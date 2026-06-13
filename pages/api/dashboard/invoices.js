import connectDB from "../../../utils/mongodb";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

let indexCleaned = false;

async function col() {
  await connectDB();
  const c = mongoose.connection.db.collection("invoices");
  if (!indexCleaned) {
    try {
      await c.dropIndex("invoiceNumber_1");
      console.log("[invoices] Dropped stale invoiceNumber_1 index");
    } catch (_) {}
    indexCleaned = true;
  }
  return c;
}

export default async function handler(req, res) {
  let c;
  try {
    c = await col();
  } catch (e) {
    console.error("[invoices] DB connect error:", e);
    return res.status(500).json({ error: "DB connection failed: " + e.message });
  }

  if (req.method === "GET") {
    try {
      const docs = await c.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(docs.map(d => ({ ...d, id: String(d._id) })));
    } catch (e) {
      console.error("[invoices GET] error:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    try {
      const raw = req.body || {};
      // Strip Mongoose/React tracking fields
      const { _id, id, __v, createdAt, updatedAt, ...body } = raw;

      // Normalise item ids to string (React uses numeric ids locally)
      if (Array.isArray(body.items)) {
        body.items = body.items.map(({ id: itemId, ...rest }) => ({
          ...rest,
          ...(itemId != null ? { id: String(itemId) } : {}),
        }));
      }

      // Auto-generate TWO-INV-XXXX if not provided or using old format
      if (!body.invoiceNo || !body.invoiceNo.startsWith("TWO-INV-")) {
        const count = await c.countDocuments({});
        body.invoiceNo = `TWO-INV-${String(count + 1).padStart(4, "0")}`;
      }
      const newId = uuidv4();
      const now = new Date();
      const doc = { ...body, _id: newId, createdAt: now, updatedAt: now };

      await c.insertOne(doc);
      return res.status(201).json({ ...doc, id: newId });
    } catch (e) {
      console.error("[invoices POST] error:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).end();
}
