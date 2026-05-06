import connectDB from "../../../utils/mongodb";
import Blog from "../../../models/Blog";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();

  const { slug } = req.query;
  const blog = await Blog.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!blog) return res.status(404).json({ error: "Not found" });
  return res.status(200).json({ ...blog, id: blog._id });
}
