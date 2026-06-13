import connectDB from "../../../../utils/mongodb";
import mongoose from "mongoose";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

async function col() {
  await connectDB();
  return mongoose.connection.db.collection("vouchers");
}

export default async function handler(req, res) {
  const { id } = req.query;
  let c;
  try { c = await col(); }
  catch (e) { return res.status(500).json({ error: "DB connection failed: " + e.message }); }

  if (req.method === "GET") {
    try {
      const doc = await c.findOne({ _id: id });
      if (!doc) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ ...doc, id: String(doc._id) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === "PUT") {
    try {
      const { _id, id: _id2, __v, createdAt, updatedAt, ...body } = req.body || {};
      const now = new Date();
      await c.updateOne({ _id: id }, { $set: { ...body, updatedAt: now } });
      const updated = await c.findOne({ _id: id });
      return res.status(200).json({ ...updated, id: String(updated._id) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === "PATCH") {
    try {
      const { _id, id: _id2, __v, createdAt, updatedAt, ...body } = req.body || {};
      const now = new Date();
      await c.updateOne({ _id: id }, { $set: { ...body, updatedAt: now } });
      const updated = await c.findOne({ _id: id });
      return res.status(200).json({ ...updated, id: String(updated._id) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === "DELETE") {
    try {
      await c.deleteOne({ _id: id });
      return res.status(200).json({ ok: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).end();
}
