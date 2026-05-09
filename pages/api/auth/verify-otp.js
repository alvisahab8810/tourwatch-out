import crypto from "crypto";
import connectDB from "../../../utils/mongodb";
import User from "../../../models/User";
import OtpToken from "../../../models/OtpToken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, otp } = req.body || {};

  if (!email?.trim()) return res.status(400).json({ error: "Email is required." });
  if (!otp?.trim())   return res.status(400).json({ error: "OTP is required." });

  await connectDB();

  const record = await OtpToken.findOne({ email: email.toLowerCase() });

  if (!record)                           return res.status(400).json({ error: "No pending verification found. Please sign up again." });
  if (new Date() > record.expiresAt)    return res.status(400).json({ error: "OTP has expired. Please sign up again." });
  if (record.otp !== otp.trim())        return res.status(400).json({ error: "Incorrect OTP. Please check and try again." });

  // Double-check email not registered in race condition
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    await OtpToken.deleteMany({ email: email.toLowerCase() });
    return res.status(409).json({ error: "This email is already registered. Please log in." });
  }

  const sessionToken = crypto.randomBytes(32).toString("hex");
  const user = await User.create({
    name:         record.name,
    email:        record.email,
    passwordHash: record.passwordHash,
    salt:         record.salt,
    sessionToken,
  });

  await OtpToken.deleteMany({ email: email.toLowerCase() });

  res.status(201).json({
    token: sessionToken,
    user:  { id: user._id, name: user.name, email: user.email },
  });
}
