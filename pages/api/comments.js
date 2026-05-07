import connectDB from "../../utils/mongodb";
import Comment from "../../models/Comment";
import Blog from "../../models/Blog";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "slug required" });
    const comments = await Comment.find({ blogSlug: slug, status: "approved" })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(comments.map(c => ({ ...c, id: String(c._id) })));
  }

  if (req.method === "POST") {
    const { slug, name, email, body } = req.body || {};
    if (!slug || !name || !email || !body) {
      return res.status(400).json({ error: "slug, name, email and body are required" });
    }
    const blog = await Blog.findOne({ slug, status: "published" }).select("title").lean();
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = await Comment.create({
      blogSlug: slug,
      blogTitle: blog.title || "",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      body: body.trim(),
      status: "pending",
    });
    return res.status(201).json({ ...comment.toObject(), id: String(comment._id) });
  }

  return res.status(405).end();
}
