import connectDB from "../../../utils/mongodb";
import Blog from "../../../models/Blog";
import { v4 as uuidv4 } from "uuid";
import { saveImage } from "../../../utils/packageStore";

export const config = { api: { bodyParser: { sizeLimit: "20mb" } } };

async function processImages(body, blogId) {
  if (body.coverImage?.src?.startsWith("data:"))
    body.coverImage.src = await saveImage(body.coverImage.src, `blog_${blogId}`, "cover") || body.coverImage.src;
  if (body.cardImage?.src?.startsWith("data:"))
    body.cardImage.src = await saveImage(body.cardImage.src, `blog_${blogId}`, "card") || body.cardImage.src;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const blogs = await Blog.find({})
      .select("title slug status cardImage coverImage categories authorName views createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(blogs.map(b => ({ ...b, id: b._id })));
  }

  if (req.method === "POST") {
    const id = uuidv4();
    const body = { ...req.body };
    await processImages(body, id);
    const blog = await Blog.create({ ...body, _id: id });
    const obj  = blog.toObject();
    return res.status(201).json({ ...obj, id: obj._id });
  }

  res.status(405).end();
}
