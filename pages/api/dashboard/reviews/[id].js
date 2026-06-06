import connectDB from "../../../../utils/mongodb";
import Review from "../../../../models/Review";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  /* ── PUT — update status / text / adminNote ── */
  if (req.method === "PUT") {
    const { status, title, text, adminNote } = req.body;
    const update = {};
    if (status)    update.status    = status;
    if (title !== undefined) update.title = title;
    if (text)      update.text      = text;
    if (adminNote !== undefined) update.adminNote = adminNote;

    const review = await Review.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!review) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(review);
  }

  /* ── DELETE ── */
  if (req.method === "DELETE") {
    await Review.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
