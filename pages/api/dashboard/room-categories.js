import connectDB from "../../../utils/mongodb";
import RoomCategory from "../../../models/RoomCategory";

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const cats = await RoomCategory.find({}).sort({ name: 1 }).lean();
    return res.status(200).json(cats.map(c => c.name));
  }

  if (req.method === "POST") {
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ error: "name required" });

    // case-insensitive dedupe
    const existing = await RoomCategory.findOne({ name: { $regex: `^${escapeRegex(name)}$`, $options: "i" } }).lean();
    if (!existing) await RoomCategory.create({ name });

    const cats = await RoomCategory.find({}).sort({ name: 1 }).lean();
    return res.status(200).json(cats.map(c => c.name));
  }

  if (req.method === "DELETE") {
    const name = String(req.query?.name || req.body?.name || "").trim();
    if (!name) return res.status(400).json({ error: "name required" });

    await RoomCategory.deleteOne({ name: { $regex: `^${escapeRegex(name)}$`, $options: "i" } });

    const cats = await RoomCategory.find({}).sort({ name: 1 }).lean();
    return res.status(200).json(cats.map(c => c.name));
  }

  res.status(405).end();
}
