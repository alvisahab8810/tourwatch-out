import connectDB from "../../../../utils/mongodb";
import Vendor from "../../../../models/Vendor";

export const config = { api: { bodyParser: { sizeLimit: "20mb" } } };

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const vendor = await Vendor.findById(id).lean();
    if (!vendor) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...vendor, id: vendor._id });
  }

  if (req.method === "PUT") {
    // eslint-disable-next-line no-unused-vars
    const { _id, id: _ignore, __v, createdAt, updatedAt, ...body } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: false }).lean();
    if (!vendor) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...vendor, id: vendor._id });
  }

  if (req.method === "DELETE") {
    await Vendor.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}
