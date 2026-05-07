import connectDB from "../../utils/mongodb";
import Blog from "../../models/Blog";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();

  const { search = "", category = "", tag = "", page = 1, limit = 9 } = req.query;
  const query = { status: "published" };

  if (search) {
    query.$or = [
      { title:   { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
    ];
  }
  if (category) query.categories = category;
  if (tag)      query.tags = tag;

  const skip  = (Number(page) - 1) * Number(limit);
  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .select("-content -schema")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Blog.countDocuments(query),
  ]);

  return res.status(200).json({
    blogs: blogs.map(b => ({ ...b, id: b._id })),
    total,
    page:  Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
}
