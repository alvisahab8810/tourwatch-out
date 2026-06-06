import connectDB from "../../../utils/mongodb";
import Review from "../../../models/Review";
import User from "../../../models/User";

async function getAuthUser(req) {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return null;
  await connectDB();
  const user = await User.findOne({ sessionToken: token }).lean();
  return user || null;
}

export default async function handler(req, res) {
  await connectDB();

  /* ── GET — public: approved reviews for a package ── */
  if (req.method === "GET") {
    const { packageId } = req.query;
    if (!packageId) return res.status(400).json({ error: "packageId required" });
    const reviews = await Review.find({ packageId, status: "approved" })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(reviews);
  }

  /* ── POST — submit review (auth required) ── */
  if (req.method === "POST") {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "Please login to submit a review." });

    const { packageId, packageName, destinationSlug, rating, title, text } = req.body;

    if (!packageId)              return res.status(400).json({ error: "Package ID is required." });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be 1–5." });
    if (!text?.trim())           return res.status(400).json({ error: "Review text is required." });

    // one review per user per package
    const existing = await Review.findOne({ packageId, userId: String(user._id) });
    if (existing) return res.status(409).json({ error: "You have already reviewed this package." });

    const review = await Review.create({
      packageId,
      packageName:     packageName || "",
      destinationSlug: destinationSlug || "",
      userId:   String(user._id),
      userName: user.name,
      userEmail: user.email,
      userImage: user.profileImage || "",
      rating:   Number(rating),
      title:    title?.trim() || "",
      text:     text.trim(),
      status:   "approved",
    });

    return res.status(201).json({ ok: true, id: review._id });
  }

  res.status(405).end();
}
