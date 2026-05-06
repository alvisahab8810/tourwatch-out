import connectDB from "../../../../utils/mongodb";
import Invoice from "../../../../models/Invoice";
import mongoose from "mongoose";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

const STRIP = new Set(["_id", "id", "__v", "createdAt", "updatedAt"]);

// Matches both String UUID and ObjectId-format _id in MongoDB
function idFilter(id) {
  if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
    return { $or: [{ _id: id }, { _id: new mongoose.Types.ObjectId(id) }] };
  }
  return { _id: id };
}

export default async function handler(req, res) {
  try { await connectDB(); } catch (e) {
    return res.status(500).json({ error: "DB connection failed: " + e.message });
  }
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const inv = await Invoice.collection.findOne(idFilter(id));
      if (!inv) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ ...inv, id: String(inv._id) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === "PUT") {
    try {
      const body = { ...req.body };
      STRIP.forEach(k => delete body[k]);
      body.updatedAt = new Date();
      const result = await Invoice.collection.findOneAndUpdate(
        idFilter(id),
        { $set: body },
        { returnDocument: "after" }
      );
      const inv = result?.value ?? result;
      if (!inv) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ ...inv, id: String(inv._id) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === "DELETE") {
    try {
      await Invoice.collection.deleteOne(idFilter(id));
      return res.status(200).json({ ok: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).end();
}
