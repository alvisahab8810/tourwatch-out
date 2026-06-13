import connectDB from "../../../../utils/mongodb";
import SalesPerson from "../../../../models/SalesPerson";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return res.status(401).json({ error: "No token" });

  await connectDB();

  const sp = await SalesPerson.findOne({ sessionToken: token })
    .select("-passwordHash -salt -sessionToken")
    .lean();

  if (!sp) return res.status(401).json({ error: "Invalid session" });
  if (!sp.isActive) return res.status(403).json({ error: "Account deactivated" });

  return res.status(200).json({
    _id:         sp._id,
    name:        sp.name,
    email:       sp.email,
    username:    sp.username,
    permissions: sp.permissions,
    isActive:    sp.isActive,
  });
}
