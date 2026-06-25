import connectDB from "../../../../utils/mongodb";
import Invoice from "../../../../models/Invoice";
import Lead from "../../../../models/Lead";
import mongoose from "mongoose";
import { sendMetaEvent } from "../../../../utils/metaCapi";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

const STRIP = new Set(["_id", "id", "__v", "createdAt", "updatedAt"]);

/* Mirror the frontend getStatus logic — status is NOT stored in DB */
function calcGrand(inv) {
  const sub  = (inv.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst = inv.cgstPct ? (sub  * parseFloat(inv.cgstPct)) / 100 : 0;
  const sgst = inv.sgstPct ? (sub  * parseFloat(inv.sgstPct)) / 100 : 0;
  const igst = inv.igstPct ? (sub  * parseFloat(inv.igstPct)) / 100 : 0;
  const after = sub + cgst + sgst + igst;
  const tcs  = inv.tcsPct ? (after * parseFloat(inv.tcsPct)) / 100 : 0;
  return after + tcs;
}
function calcPaid(inv) { return (inv.payments || []).reduce((s, p) => s + (+p.amount || 0), 0); }
function isNowPaid(inv) {
  const grand = calcGrand(inv);
  const paid  = calcPaid(inv);
  return paid >= 0.01 && Math.max(0, grand - paid) < 0.01;
}

async function firePurchaseEvent(inv) {
  let email = "", phone = inv.contact || "", fbc = "", fbp = "", clientIp = "", userAgent = "";
  if (inv.leadId) {
    try {
      const lead = await Lead.findById(inv.leadId).lean();
      if (lead) {
        email     = lead.email     || "";
        phone     = lead.phone     || phone;
        fbc       = lead.fbc       || "";
        fbp       = lead.fbp       || "";
        clientIp  = lead.clientIp  || "";
        userAgent = lead.userAgent || "";
      }
    } catch (_) {}
  }
  const value = Math.round(calcGrand(inv) * 100) / 100;
  await sendMetaEvent({
    eventName: "Purchase",
    eventId:   `booking_${String(inv._id)}`,
    email, phone, fbc, fbp, clientIp, userAgent,
    value, currency: "INR",
  });
}

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
      const prevInv = await Invoice.collection.findOne(idFilter(id));
      const result = await Invoice.collection.findOneAndUpdate(
        idFilter(id),
        { $set: body },
        { returnDocument: "after" }
      );
      const inv = result?.value ?? result;
      if (!inv) return res.status(404).json({ error: "Not found" });
      if (!isNowPaid(prevInv) && isNowPaid(inv)) {
        firePurchaseEvent(inv).catch((e) => console.error("[MetaCAPI] Purchase failed:", e));
      }
      return res.status(200).json({ ...inv, id: String(inv._id) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === "PATCH") {
    try {
      const body = { ...req.body };
      STRIP.forEach(k => delete body[k]);
      body.updatedAt = new Date();
      const prevInv = await Invoice.collection.findOne(idFilter(id));
      const result = await Invoice.collection.findOneAndUpdate(
        idFilter(id),
        { $set: body },
        { returnDocument: "after" }
      );
      const inv = result?.value ?? result;
      if (!inv) return res.status(404).json({ error: "Not found" });
      if (!isNowPaid(prevInv) && isNowPaid(inv)) {
        firePurchaseEvent(inv).catch((e) => console.error("[MetaCAPI] Purchase failed:", e));
      }
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
