import connectDB from "../../utils/mongodb";
import Package from "../../models/Package";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();
  const { destination, packageType } = req.query;

  const filter = { status: "Active" };
  if (destination)  filter.destination  = destination;
  if (packageType)  filter.packageType  = packageType;

  const packages = await Package.find(filter).lean();
  return res.status(200).json(packages.map(p => ({ ...p, id: p._id })));
}
