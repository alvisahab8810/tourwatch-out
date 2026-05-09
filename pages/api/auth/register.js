import crypto from "crypto";
import connectDB from "../../../utils/mongodb";
import User from "../../../models/User";

function hashPassword(password, salt) {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body || {};

  if (!name?.trim())    return res.status(400).json({ error: "Full name is required." });
  if (!email?.trim())   return res.status(400).json({ error: "Email is required." });
  if (!password)        return res.status(400).json({ error: "Password is required." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Enter a valid email address." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  await connectDB();

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: "This email is already registered." });

  const salt         = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  const sessionToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({ name: name.trim(), email, passwordHash, salt, sessionToken });

  res.status(201).json({
    token: sessionToken,
    user:  { id: user._id, name: user.name, email: user.email },
  });
}
