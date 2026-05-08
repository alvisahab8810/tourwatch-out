import crypto from "crypto";
import connectDB from "../../../utils/mongodb";
import PackageImage from "../../../models/PackageImage";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  const img = await PackageImage.findById(id).lean();
  if (!img) return res.status(404).end();

  const buf  = img.data?.buffer ? Buffer.from(img.data.buffer) : Buffer.from(img.data);
  const etag = `"${crypto.createHash("md5").update(buf).digest("hex")}"`;

  res.setHeader("Content-Type", img.contentType || "image/jpeg");
  res.setHeader("ETag", etag);
  // Revalidate every request using ETag — 304 if unchanged (cheap), 200+body if updated
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");

  if (req.headers["if-none-match"] === etag) {
    return res.status(304).end();
  }

  res.end(buf);
}
