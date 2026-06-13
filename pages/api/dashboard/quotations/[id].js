import connectDB from "../../../../utils/mongodb";
import Quotation from "../../../../models/Quotation";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const q = await Quotation.findById(id)
      .populate("leadId", "name phone email destination travelDate brr")
      .populate("assignedTo", "name email")
      .lean();
    if (!q) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(q);
  }

  if (req.method === "PATCH") {
    const q = await Quotation.findByIdAndUpdate(id, { $set: req.body }, { new: true })
      .populate("leadId", "name phone email destination travelDate brr")
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
