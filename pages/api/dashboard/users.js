import connectDB from "../../../utils/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await connectDB();

  const users = await User.find({})
    .select("-passwordHash -salt -sessionToken")
    .sort({ createdAt: -1 })
    .lean();

  const data = users.map(u => ({
    id:        u._id.toString(),
    name:      u.name,
    email:     u.email,
    createdAt: u.createdAt,
  }));

  res.status(200).json(data);
}
