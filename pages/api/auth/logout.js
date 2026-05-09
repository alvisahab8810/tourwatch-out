import connectDB from "../../../utils/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (token) {
    await connectDB();
    await User.findOneAndUpdate({ sessionToken: token }, { sessionToken: null });
  }

  res.status(200).json({ ok: true });
}
