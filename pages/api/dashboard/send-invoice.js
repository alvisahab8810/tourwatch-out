import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

/* The PDF now arrives as a multipart file — no base64 bloat and no JSON size cap,
   which is what was making large invoices fail at the proxy. Older callers still
   post JSON, so the body is read by hand for both shapes. */
export const config = { api: { bodyParser: false } };

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", c => { raw += c; });
    req.on("end", () => {
      try { resolve(JSON.parse(raw || "{}")); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

function readMultipart(req) {
  return new Promise((resolve, reject) => {
    formidable({ maxFileSize: 100 * 1024 * 1024 }).parse(req, (err, fields, files) => {
      if (err) return reject(err);
      /* formidable v3 wraps every field value in an array */
      const f = k => (Array.isArray(fields[k]) ? fields[k][0] : fields[k]) || "";
      const pdf = files.pdf?.[0] || files.pdf;
      resolve({
        to:        f("to"),
        subject:   f("subject"),
        html:      f("html"),
        fileName:  f("fileName") || pdf?.originalFilename || "",
        pdfBuffer: pdf ? fs.readFileSync(pdf.filepath) : null,
      });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  let body;
  try {
    body = String(req.headers["content-type"] || "").includes("multipart/form-data")
      ? await readMultipart(req)
      : await readJson(req);
  } catch (e) {
    return res.status(400).json({ message: "Could not read the request: " + e.message });
  }

  const { to, subject, html, pdfBase64, fileName } = body;

  if (!to) {
    return res.status(400).json({ message: "Missing required field: to" });
  }

  /* Invoice mail has its own sender (accounts@tourwatchout.com). Everything else
     in the app keeps going out from the sales account, so this route reads its own
     SMTP_INVOICE_* vars and only falls back to the shared ones if they are unset. */
  const host = process.env.SMTP_INVOICE_HOST || process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_INVOICE_PORT || process.env.SMTP_PORT || process.env.EMAIL_PORT || "587");
  const user = process.env.SMTP_INVOICE_USER || process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.SMTP_INVOICE_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const from = process.env.SMTP_INVOICE_FROM || (user ? `Tourwatchout <${user}>` : process.env.SMTP_FROM);

  if (!host || !user || !pass) {
    return res.status(500).json({
      message: "Invoice email not configured. Set SMTP_INVOICE_USER and SMTP_INVOICE_PASS in .env.local",
    });
  }

  /* Multipart gives a Buffer straight away; the JSON callers still send base64. */
  const content = body.pdfBuffer || (pdfBase64 ? Buffer.from(pdfBase64, "base64") : null);

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      replyTo: "sales@tourwatchout.com",
      to,
      subject: subject || "Your Tax Invoice — Tourwatchout",
      html,
      attachments: content ? [
        {
          filename: fileName || "invoice.pdf",
          content,
          contentType: "application/pdf",
        },
      ] : [],
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ message: err.message || "Failed to send email" });
  }
}
