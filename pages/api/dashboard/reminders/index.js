import connectDB from "../../../../utils/mongodb";
import Reminder from "../../../../models/Reminder";
import Quotation from "../../../../models/Quotation";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    // 1. Reminders from the dedicated Reminder collection
    const collectionRems = await Reminder.find({})
      .sort({ dueDate: 1, createdAt: -1 })
      .populate("quotationId", "quotationNo")
      .populate("leadId", "name phone email destination")
      .populate("salespersonId", "name")
      .lean();

    // 2. Embedded reminders from Quotation.reminders[]
    const quotations = await Quotation.find({ "reminders.0": { $exists: true } })
      .populate("leadId", "name phone email destination")
      .populate("assignedTo", "name")
      .lean();

    const embeddedRems = [];
    for (const q of quotations) {
      for (let i = 0; i < (q.reminders || []).length; i++) {
        const r = q.reminders[i];
        embeddedRems.push({
          _id:          `emb-${q._id}-${i}`,
          _embedded:    true,
          quotationId:  { _id: q._id, quotationNo: q.quotationNo },
          leadId:       q.leadId || null,
          salespersonId:q.assignedTo || null,
          dueDate:      r.date  || "",
          type:         r.type  || "Follow-up Call",
          note:         r.note  || "",
          status:       r.done  ? "Done" : "Upcoming",
          createdAt:    q.createdAt,
        });
      }
    }

    // Merge: collection entries first (they have real IDs), then embedded
    // Deduplicate by note+quotationId to avoid doubles if already migrated
    const collectionKeys = new Set(
      collectionRems.map(r => `${r.quotationId?._id}-${r.note}-${r.dueDate}`)
    );
    const deduped = embeddedRems.filter(
      r => !collectionKeys.has(`${r.quotationId?._id}-${r.note}-${r.dueDate}`)
    );

    const all = [...collectionRems, ...deduped].sort((a, b) => {
      if (a.dueDate < b.dueDate) return -1;
      if (a.dueDate > b.dueDate) return 1;
      return 0;
    });

    return res.status(200).json(all);
  }

  if (req.method === "POST") {
    const { quotationId, leadId, salespersonId, dueDate, dueTime, type, note } = req.body || {};
    if (!dueDate) return res.status(400).json({ error: "dueDate required" });
    const r = await Reminder.create({
      quotationId:   quotationId   || null,
      leadId:        leadId        || null,
      salespersonId: salespersonId || null,
      dueDate, dueTime: dueTime || "", type, note,
    });
    const populated = await Reminder.findById(r._id)
      .populate("quotationId", "quotationNo")
      .populate("leadId", "name phone email destination")
      .populate("salespersonId", "name")
      .lean();
    return res.status(201).json(populated);
  }

  res.status(405).end();
}
