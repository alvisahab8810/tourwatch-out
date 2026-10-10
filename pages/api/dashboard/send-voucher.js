import nodemailer from "nodemailer";

export const config = {
  api: { bodyParser: { sizeLimit: "15mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { to, subject, html, pdfBase64, fileName } = req.body;

  if (!to || !pdfBase64) {
    return res.status(400).json({ message: "Missing required fields: to, pdfBase64" });
  }

  // Vouchers go out from the shared sales sender, same as the rest of the app.
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587");
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const from = process.env.SMTP_FROM || `Tourwatchout <${user}>`;

  if (!host || !user || !pass) {
    return res.status(500).json({
      message: "Email not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local",
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
      subject: subject || "Your Travel Voucher — Tourwatchout",
      html,
      attachments: [
        {
          filename: fileName || "voucher.pdf",
          content: Buffer.from(pdfBase64, "base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ message: err.message || "Failed to send email" });
  }
}
