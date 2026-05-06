import connectDB from "../../../utils/mongodb";
import PackageImage from "../../../models/PackageImage";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  const img = await PackageImage.findById(id).lean();
  if (!img) return res.status(404).end();

  const buf = img.data?.buffer ? Buffer.from(img.data.buffer) : Buffer.from(img.data);
  res.setHeader("Content-Type", img.contentType || "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=31536000");
  res.end(buf);
}
