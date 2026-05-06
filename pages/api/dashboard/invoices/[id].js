import connectDB from "../../../../utils/mongodb";
import Invoice from "../../../../models/Invoice";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const inv = await Invoice.findById(id).lean();
    if (!inv) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...inv, id: inv._id });
  }

  if (req.method === "PUT") {
    const inv = await Invoice.findByIdAndUpdate(id, req.body, { new: true }).lean();
    if (!inv) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...inv, id: inv._id });
  }

  if (req.method === "DELETE") {
    await Invoice.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
