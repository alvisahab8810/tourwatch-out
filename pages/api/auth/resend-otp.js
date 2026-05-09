import connectDB from "../../../utils/mongodb";
import OtpToken from "../../../models/OtpToken";
import { sendOtpEmail } from "../../../utils/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body || {};
  if (!email?.trim()) return res.status(400).json({ error: "Email is required." });

  await connectDB();

  const record = await OtpToken.findOne({ email: email.toLowerCase() });
  if (!record) return res.status(400).json({ error: "No pending verification found. Please sign up again." });

  const newOtp    = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  record.otp       = newOtp;
  record.expiresAt = expiresAt;
  await record.save();

  try {
    await sendOtpEmail(email.trim(), record.name, newOtp);
  } catch {
    return res.status(500).json({ error: "Failed to resend email. Please try again." });
  }

  res.status(200).json({ ok: true });
}
