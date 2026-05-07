import connectDB from "../../../utils/mongodb";
import Package from "../../../models/Package";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();

  // Use collection directly to bypass Mongoose strictQuery filtering on the popular field
  const raw = await Package.collection
    .find({ popular: true })
    .project({ destination: 1, packageName: 1, packageSubtype: 1, duration: 1, basePrice: 1, finalPrice: 1, priceType: 1, destinationHighlights: 1, amenities: 1, featureImage: 1, webBanner: 1 })
    .sort({ createdAt: -1 })
    .toArray();

  const packages = raw;

  return res.status(200).json(packages.map(p => ({ ...p, id: String(p._id) })));
}
