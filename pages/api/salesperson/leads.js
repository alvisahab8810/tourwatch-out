import connectDB from "../../../utils/mongodb";
import SalesPerson from "../../../models/SalesPerson";
import Lead from "../../../models/Lead";

async function authenticate(req) {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  return SalesPerson.findOne({ sessionToken: token, isActive: true }).lean();
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();

  const sp = await authenticate(req);
  if (!sp) return res.status(401).json({ error: "Unauthorized" });

  const leads = await Lead.find({ assignedTo: sp._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(leads);
}
