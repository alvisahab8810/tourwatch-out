import connectDB from "../../../../utils/mongodb";
import Quotation from "../../../../models/Quotation";

// quotations carry per-version snapshots, so the payload outgrows the 1mb default
export const config = { api: { bodyParser: { sizeLimit: "20mb" } } };

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const q = await Quotation.findById(id)
      .populate("leadId", "name phone email destination travelDate brr destinationHistory")
      .populate("assignedTo", "name email")
      .lean();
    if (!q) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(q);
  }

  if (req.method === "PATCH") {
    const patch = { ...req.body };
    // The list API strips version snapshots, so a client can send versions back without them.
    // Keep the stored snapshot for any version that arrives without one.
    if (Array.isArray(patch.versions)) {
      const existing = await Quotation.findById(id).select("versions").lean();
      const byV = new Map((existing?.versions || []).map(v => [v.v, v.snapshot]));
      patch.versions = patch.versions.map(v =>
        v.snapshot ? v : (byV.get(v.v) ? { ...v, snapshot: byV.get(v.v) } : v)
      );
    }
    const q = await Quotation.findByIdAndUpdate(id, { $set: patch }, { new: true })
      .populate("leadId", "name phone email destination travelDate brr destinationHistory")
      .populate("assignedTo", "name email")
      .lean();
    if (!q) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(q);
  }

  if (req.method === "DELETE") {
    await Quotation.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
