import connectDB from "../../../utils/mongodb";
import Faq from "../../../models/Faq";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { status } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    const total     = await Faq.countDocuments({});
    const published = await Faq.countDocuments({ status: "published" });
    const draft     = await Faq.countDocuments({ status: "draft" });
    return res.status(200).json({
      faqs: faqs.map(f => ({ ...f, id: f._id })),
      stats: { total, published, draft },
    });
  }

  if (req.method === "POST") {
    const { question, answer, status = "draft", order = 0 } = req.body;
    if (!question || !answer) return res.status(400).json({ error: "question and answer required" });
    const faq = await Faq.create({ question, answer, status, order });
    const obj = faq.toObject();
    return res.status(201).json({ ...obj, id: obj._id });
  }

  res.status(405).end();
}
