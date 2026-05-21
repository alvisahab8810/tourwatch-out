import connectDB from "../../../../utils/mongodb";
import Vendor from "../../../../models/Vendor";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: { sizeLimit: "20mb" } } };

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const vendors = await Vendor.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(vendors.map(v => ({ ...v, id: v._id })));
  }

  if (req.method === "POST") {
    const id = uuidv4();
    const vendor = await Vendor.create({ ...req.body, _id: id });
    return res.status(201).json({ ...vendor.toObject(), id });
  }

  res.status(405).end();
}
