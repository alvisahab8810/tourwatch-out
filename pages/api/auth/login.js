import crypto from "crypto";
import connectDB from "../../../utils/mongodb";
import User from "../../../models/User";

function hashPassword(password, salt) {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body || {};

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).json({ error: "Invalid email or password." });

  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash)
    return res.status(401).json({ error: "Invalid email or password." });

  const sessionToken = crypto.randomBytes(32).toString("hex");
  user.sessionToken  = sessionToken;
  await user.save();

  res.status(200).json({
    token: sessionToken,
    user:  { id: user._id, name: user.name, email: user.email },
  });
}
