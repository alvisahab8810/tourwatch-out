import connectDB from "../../../../utils/mongodb";
import Reminder from "../../../../models/Reminder";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PATCH") {
    const { status, dueDate, type, note } = req.body || {};
    const upd = {};
    if (status  !== undefined) upd.status  = status;
    if (dueDate !== undefined) upd.dueDate = dueDate;
    if (type    !== undefined) upd.type    = type;
    if (note    !== undefined) upd.note    = note;
    const updated = await Reminder.findByIdAndUpdate(id, { $set: upd }, { new: true })
      .populate("quotationId", "quotationNo")
      .populate("leadId", "name phone email destination")
      .populate("salespersonId", "name")
      .lean();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await Reminder.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
