import connectDB from "../../utils/mongodb";
import Faq from "../../models/Faq";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();

  const { limit } = req.query;
  const query = Faq.find({ status: "published" }).sort({ order: 1, createdAt: 1 });
  if (limit) query.limit(Number(limit));

  const faqs = await query.lean();
  return res.status(200).json(faqs.map(f => ({ ...f, id: f._id })));
}
