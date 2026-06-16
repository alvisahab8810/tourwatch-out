import connectDB from "../../../utils/mongodb";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

let indexCleaned = false;

/* ─── Invoice No auto-generation — RCSPL/<FY>/<seq> ledger, matching the
   convention used since this business's first invoices (and create-invoice.js's
   client-side generator). Only used as a fallback when no invoiceNo is supplied. */
function getInvoiceFY(d) {
  const dt = d instanceof Date && !isNaN(d) ? d : new Date();
  const y = dt.getFullYear(), m = dt.getMonth() + 1;
  return m >= 4 ? `${y}-${String(y + 1).slice(2)}` : `${y - 1}-${String(y).slice(2)}`;
}
async function buildInvoiceNo(c, forDate) {
  const fy = getInvoiceFY(forDate);
  const prefix = `RCSPL/${fy}/`;
  const count = await c.countDocuments({ invoiceNo: { $regex: `^${prefix.replace(/\//g, "\\/")}` } });
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}

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

      // Auto-generate RCSPL/<FY>/<seq> if not provided (or it's a stale
      // "TWO-INV-XXXX" suggestion left over from an unfixed caller)
      const looksStale = typeof body.invoiceNo === "string" && /^TWO-INV-\d+$/.test(body.invoiceNo.trim());
      if (!body.invoiceNo || !String(body.invoiceNo).trim() || looksStale) {
        const d = body.invoiceDate ? new Date(body.invoiceDate) : new Date();
        body.invoiceNo = await buildInvoiceNo(c, isNaN(d) ? new Date() : d);
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
