import connectDB from "../../../../utils/mongodb";
import User from "../../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { id } = req.query;
  await connectDB();
  await User.findByIdAndDelete(id);
  res.status(200).json({ ok: true });
}
