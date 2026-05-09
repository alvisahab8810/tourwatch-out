import connectDB from "../../../utils/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return res.status(401).json({ error: "No token." });

  await connectDB();
  const user = await User.findOne({ sessionToken: token });
  if (!user) return res.status(401).json({ error: "Session expired." });

  res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
}
