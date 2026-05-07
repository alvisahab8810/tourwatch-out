import connectDB from "../../../utils/mongodb";
import Package from "../../../models/Package";
import { processImages } from "../../../utils/packageStore";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: { sizeLimit: "50mb" } } };

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    // Exclude all large image/text fields — list view only needs metadata.
    // Full document (with images) is fetched via GET /api/dashboard/packages/:id.
    const packages = await Package.find({})
      .select("destination packageType packageSubtype packageName duration basePrice finalPrice priceType status popular destinationHighlights amenities featureImage metaTitle metaDescription metaKeywords createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(packages.map(p => ({ ...p, id: p._id })));
  }

  if (req.method === "POST") {
    const id  = uuidv4();
    const raw = { ...req.body, _id: id, id };
    const data = await processImages(raw, id);
    const pkg  = await Package.create(data);
    const obj  = pkg.toObject();
    return res.status(201).json({ ...obj, id: obj._id });
  }

  res.status(405).end();
}
