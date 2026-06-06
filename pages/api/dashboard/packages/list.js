import connectDB from "../../../../utils/mongodb";
import Package from "../../../../models/Package";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();
  const packages = await Package.find({ status: { $regex: /^active$/i } })
    .select("_id packageName destination")
    .sort({ packageName: 1 })
    .lean();
  return res.status(200).json(packages);
}
