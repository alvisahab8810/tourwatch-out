import connectDB from "../../../../utils/mongodb";
import Review from "../../../../models/Review";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { packageId, summary } = req.query;

    // ?summary=true → return { [packageId]: count } for all packages that have reviews
    if (summary === "true") {
      const counts = await Review.aggregate([
        { $group: { _id: "$packageId", count: { $sum: 1 } } },
      ]);
      const map = {};
      counts.forEach(c => { map[c._id] = c.count; });
      return res.status(200).json(map);
    }

    const filter = packageId ? { packageId } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json(reviews);
  }

  /* ── POST — admin creates a review directly (no user token required) ── */
  if (req.method === "POST") {
    const { packageId, packageName, destinationSlug, userName, userEmail, rating, title, text, status, images } = req.body;
    if (!packageId)   return res.status(400).json({ error: "Package is required." });
    if (!userName?.trim()) return res.status(400).json({ error: "Reviewer name is required." });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be 1–5." });
    if (!text?.trim()) return res.status(400).json({ error: "Review text is required." });

    const review = await Review.create({
      packageId,
      packageName:     packageName || "",
      destinationSlug: destinationSlug || "",
      userId:   "admin",
      userName: userName.trim(),
      userEmail: userEmail?.trim() || "",
      userImage: "",
      rating:   Number(rating),
      title:    title?.trim() || "",
      text:     text.trim(),
      status:   status || "approved",
      images:   Array.isArray(images) ? images.filter(img => img?.src) : [],
    });
    return res.status(201).json(review);
  }

  res.status(405).end();
}
