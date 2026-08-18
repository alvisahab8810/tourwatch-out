import { sendQuotationEmail } from "../../../utils/mailer";
import formidable from "formidable";
import fs from "fs";

/* Disable Next.js body parser — formidable reads the raw stream */
export const config = { api: { bodyParser: false } };

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ maxFileSize: 100 * 1024 * 1024 }); // 100 MB
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      /* formidable v3 wraps every field value in an array */
      const f = k => (Array.isArray(fields[k]) ? fields[k][0] : fields[k]) || "";
      resolve({ f, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { f, files } = await parseForm(req);

    const to      = f("to");
    const cc      = f("cc")  || undefined;
    const bcc     = f("bcc") || undefined;
    const subject = f("subject");
    const message = f("message");
    const quotationData = JSON.parse(f("quotationData") || "{}");

    if (!to) return res.status(400).json({ error: "Recipient (to) is required" });

    /* Read attached PDF if present */
    let pdfBuffer = null;
    let pdfName   = "quotation.pdf";
    const pdfFile = files.pdf?.[0] || files.pdf;
    if (pdfFile) {
      pdfBuffer = fs.readFileSync(pdfFile.filepath);
      pdfName   = pdfFile.originalFilename || pdfName;
    }

    await sendQuotationEmail({ to, cc, bcc, subject, message, pdfBuffer, pdfName, quotationData });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Quotation email error:", err);
    return res.status(500).json({ error: err.message || "Failed to send email" });
  }
}
