import connectDB from "../../../../utils/mongodb";
import Comment from "../../../../models/Comment";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PATCH") {
    const { status } = req.body || {};
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const comment = await Comment.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!comment) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...comment, id: String(comment._id) });
  }

  if (req.method === "DELETE") {
    await Comment.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
