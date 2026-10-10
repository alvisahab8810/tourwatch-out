import nodemailer from "nodemailer";

export const config = {
  api: { bodyParser: { sizeLimit: "15mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { to, subject, html, pdfBase64, fileName } = req.body;

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
      attachments: pdfBase64 ? [
        {
          filename: fileName || "invoice.pdf",
          content: Buffer.from(pdfBase64, "base64"),
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
