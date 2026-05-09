import connectDB from "../../../utils/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email is required." });

  await connectDB();
  // We don't reveal whether the email exists for security
  await User.findOne({ email: email.toLowerCase().trim() });

  res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
}
