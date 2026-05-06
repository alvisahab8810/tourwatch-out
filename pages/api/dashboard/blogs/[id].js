import connectDB from "../../../../utils/mongodb";
import Blog from "../../../../models/Blog";
import { saveImage } from "../../../../utils/packageStore";

export const config = { api: { bodyParser: { sizeLimit: "20mb" } } };

async function processImages(body, blogId) {
  if (body.coverImage?.src?.startsWith("data:"))
    body.coverImage.src = await saveImage(body.coverImage.src, `blog_${blogId}`, "cover") || body.coverImage.src;
  if (body.cardImage?.src?.startsWith("data:"))
    body.cardImage.src = await saveImage(body.cardImage.src, `blog_${blogId}`, "card") || body.cardImage.src;
}

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const blog = await Blog.findById(id).lean();
    if (!blog) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...blog, id: blog._id });
  }

  if (req.method === "PUT") {
    const body = { ...req.body };
    await processImages(body, id);
    const blog = await Blog.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!blog) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...blog, id: blog._id });
  }

  if (req.method === "DELETE") {
    await Blog.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
