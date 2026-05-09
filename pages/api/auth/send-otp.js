import crypto from "crypto";
import connectDB from "../../../utils/mongodb";
import User from "../../../models/User";
import OtpToken from "../../../models/OtpToken";
import { sendOtpEmail } from "../../../utils/mailer";

function hashPassword(password, salt) {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body || {};

  if (!name?.trim())  return res.status(400).json({ error: "Full name is required." });
  if (!email?.trim()) return res.status(400).json({ error: "Email is required." });
  if (!password)      return res.status(400).json({ error: "Password is required." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Enter a valid email address." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  await connectDB();

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: "This email is already registered." });

  // Delete any prior pending OTP for this email
  await OtpToken.deleteMany({ email: email.toLowerCase() });

  const salt         = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  const otp          = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt    = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await OtpToken.create({ email: email.toLowerCase(), name: name.trim(), passwordHash, salt, otp, expiresAt });

  try {
    await sendOtpEmail(email.trim(), name.trim(), otp);
  } catch (err) {
    console.error("OTP email error:", err);
    return res.status(500).json({ error: "Failed to send verification email. Please try again." });
  }

  res.status(200).json({ ok: true });
}
