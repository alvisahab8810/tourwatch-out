import connectDB from "../../../../utils/mongodb";
import Package from "../../../../models/Package";
import { verifyToken } from "../../../../utils/voucherAuth";

function toSlug(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!verifyToken(token)) return res.status(401).json({ error: "Unauthorized" });

  await connectDB();

  const pkgs = await Package.find({ slug: { $in: ["", null, undefined] } })
    .select("_id packageName slug")
    .lean();

  let updated = 0;
  for (const p of pkgs) {
    if (p.slug) continue;
    const generated = toSlug(p.packageName || 'package') + '-' + String(p._id).slice(0, 8);
    await Package.updateOne({ _id: p._id }, { $set: { slug: generated } });
    updated++;
  }

  return res.status(200).json({ total: pkgs.length, updated, message: `${updated} slugs generated.` });
}
