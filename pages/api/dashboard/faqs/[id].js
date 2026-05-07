import connectDB from "../../../../utils/mongodb";
import Faq from "../../../../models/Faq";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PUT") {
    const { question, answer, status, order } = req.body;
    if (!question || !answer) return res.status(400).json({ error: "question and answer required" });
    const updated = await Faq.findByIdAndUpdate(
      id,
      { question, answer, status, order },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...updated, id: updated._id });
  }

  if (req.method === "PATCH") {
    const updated = await Faq.findByIdAndUpdate(id, { $set: req.body }, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...updated, id: updated._id });
  }

  if (req.method === "DELETE") {
    const deleted = await Faq.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
