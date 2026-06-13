import connectDB from "../../../../utils/mongodb";
import SalesPerson from "../../../../models/SalesPerson";
import Lead from "../../../../models/Lead";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  /* ── DELETE — remove salesperson ── */
  if (req.method === "DELETE") {
    await SalesPerson.findByIdAndDelete(id);
    /* Un-assign any leads assigned to this salesperson */
    await Lead.updateMany({ assignedTo: id }, { $set: { assignedTo: null } });
    return res.status(200).json({ ok: true });
  }

  /* ── PATCH — update permissions or active status ── */
  if (req.method === "PATCH") {
    const { permissions, isActive } = req.body;
    const update = {};
    if (permissions !== undefined) update.permissions = permissions;
    if (isActive !== undefined)    update.isActive    = isActive;
    const sp = await SalesPerson.findByIdAndUpdate(id, { $set: update }, { new: true })
      .select("-passwordHash -salt -sessionToken")
      .lean();
    if (!sp) return res.status(404).json({ error: "Salesperson not found" });
    return res.status(200).json(sp);
  }

  res.status(405).end();
}
