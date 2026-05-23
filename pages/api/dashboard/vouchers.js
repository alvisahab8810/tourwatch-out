import connectDB from "../../../utils/mongodb";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

async function col() {
  await connectDB();
  return mongoose.connection.db.collection("vouchers");
}

export default async function handler(req, res) {
  let c;
  try { c = await col(); }
  catch (e) { return res.status(500).json({ error: "DB connection failed: " + e.message }); }

  if (req.method === "GET") {
    try {
      const docs = await c.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(docs.map(d => ({ ...d, id: String(d._id) })));
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === "POST") {
    try {
      const { _id, id, __v, updatedAt, ...body } = req.body || {};
      const newId = uuidv4();
      const now   = new Date();
      const doc   = { ...body, _id: newId, createdAt: body.createdAt ? new Date(body.createdAt) : now, updatedAt: now };
      await c.insertOne(doc);
      return res.status(201).json({ ...doc, id: newId });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).end();
}
