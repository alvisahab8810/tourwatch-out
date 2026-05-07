import connectDB from "../../../utils/mongodb";
import Comment from "../../../models/Comment";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { status, slug } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (slug) filter.blogSlug = slug;

    const [comments, total, pending, approved, rejected] = await Promise.all([
      Comment.find(filter).sort({ createdAt: -1 }).lean(),
      Comment.countDocuments(),
      Comment.countDocuments({ status: "pending" }),
      Comment.countDocuments({ status: "approved" }),
      Comment.countDocuments({ status: "rejected" }),
    ]);

    return res.status(200).json({
      comments: comments.map(c => ({ ...c, id: String(c._id) })),
      stats: { total, pending, approved, rejected },
    });
  }

  return res.status(405).end();
}
