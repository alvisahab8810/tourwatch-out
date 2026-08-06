import connectDB from "../../../../utils/mongodb";
import Lead from "../../../../models/Lead";
import { sendMetaEvent } from "../../../../utils/metaCapi";

const ALLOWED_PATCH = [
  "assignedTo", "contacted", "contactedAt",
  "verificationStatus", "status", "budgetBracket", "notes",
  "score", "brr", "destination",
];

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const lead = await Lead.findById(id)
      .populate("assignedTo", "name email username")
      .lean();
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    return res.status(200).json(lead);
  }

  if (req.method === "DELETE") {
    await Lead.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  if (req.method === "PATCH") {
    /* Special: increment / decrement connects */
    if (req.body.connectIncrement || req.body.connectDecrement) {
      const delta = req.body.connectDecrement ? -1 : 1;
      const lead = await Lead.findByIdAndUpdate(
        id,
        { $inc: { connects: delta } },
        { new: true }
      )
        .populate("assignedTo", "name email username")
        .lean();
      if (!lead) return res.status(404).json({ error: "Lead not found" });
      return res.status(200).json(lead);
    }

    const update = {};
    for (const key of ALLOWED_PATCH) {
      if (key in req.body) update[key] = req.body[key];
    }
    /* When toggling contacted, auto-set contactedAt */
    if ("contacted" in req.body && !("contactedAt" in req.body)) {
      update.contactedAt = req.body.contacted ? new Date() : null;
    }
    if (!Object.keys(update).length) return res.status(400).json({ error: "No valid fields to update" });

    /* Track destination changes in history */
    let destHistEntry = null;
    if ("destination" in update) {
      const current = await Lead.findById(id).select("destination").lean();
      const oldDest = current?.destination || "";
      if (oldDest !== update.destination) {
        destHistEntry = { from: oldDest, to: update.destination, changedAt: new Date() };
      }
    }

    const mongoUpdate = { $set: update };
    if (destHistEntry) mongoUpdate.$push = { destinationHistory: destHistEntry };

    const lead = await Lead.findByIdAndUpdate(id, mongoUpdate, { new: true, strict: false })
      .populate("assignedTo", "name email username")
      .lean();
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    if (update.status === "Qualified") {
      sendMetaEvent({
        eventName: "QualifiedLead",
        eventId:   `qlead_${lead._id}`,
        email:     lead.email,
        phone:     lead.phone,
        fbc:       lead.fbc,
        fbp:       lead.fbp,
        clientIp:  lead.clientIp,
        userAgent: lead.userAgent,
      }).catch((err) => console.error("[MetaCAPI] QualifiedLead failed:", err));
    }

    return res.status(200).json(lead);
  }

  res.status(405).end();
}
