import connectDB from "../../../../utils/mongodb";
import Package from "../../../../models/Package";
import { processImages } from "../../../../utils/packageStore";

export const config = { api: { bodyParser: { sizeLimit: "50mb" } } };

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const pkg = await Package.findById(id).lean();
    if (!pkg) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...pkg, id: pkg._id });
  }

  if (req.method === "PUT") {
    try {
      const existing = await Package.findById(id).lean();
      if (!existing) return res.status(404).json({ error: "Not found" });

      const raw = { ...existing, ...req.body, _id: id };
      raw.featureImage = mergeImg(existing.featureImage, req.body.featureImage);
      raw.webBanner    = mergeImg(existing.webBanner,    req.body.webBanner);
      raw.mobileBanner = mergeImg(existing.mobileBanner, req.body.mobileBanner);
      raw.priceImage   = mergeImg(existing.priceImage,   req.body.priceImage);
      if (req.body.advertisement?.image)
        raw.advertisement = {
          ...(existing.advertisement || {}),
          ...req.body.advertisement,
          image: mergeImg(existing.advertisement?.image, req.body.advertisement.image),
        };
      raw.gallery      = mergeArr(existing.gallery,      req.body.gallery);
      raw.aboutImages  = mergeArr(existing.aboutImages,  req.body.aboutImages);
      raw.bucketImages = mergeArr(existing.bucketImages, req.body.bucketImages);

      // Strip unknown/computed fields that Mongoose strict mode rejects
      delete raw.id;
      delete raw.__v;
      delete raw.updatedAt;

      const data = await processImages(raw, id);
      const updated = await Package.findByIdAndUpdate(
        id, data, { new: true, overwrite: true, runValidators: false }
      ).lean();
      if (!updated) return res.status(404).json({ error: "Update failed — document not found" });
      return res.status(200).json({ ...updated, id: updated._id });
    } catch (e) {
      console.error("[packages PUT] Error:", e.message, e.stack);
      return res.status(500).json({ error: e.message || "Internal server error" });
    }
  }

  if (req.method === "PATCH") {
    const set = {};
    if ("popular" in req.body) set.popular = Boolean(req.body.popular);
    if ("packageName" in req.body) set.packageName = req.body.packageName;
    if ("slug" in req.body) set.slug = req.body.slug;
    if ("status" in req.body) set.status = req.body.status;
    await Package.collection.updateOne({ _id: id }, { $set: set });
    const updated = await Package.findById(id).lean();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ...updated, id: updated._id });
  }

  if (req.method === "DELETE") {
    const pkg = await Package.findByIdAndDelete(id);
    if (!pkg) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}

function mergeImg(existing, incoming) {
  if (!incoming) return existing;
  if (incoming.src?.startsWith("data:")) return incoming;
  const merged = { ...(existing || {}), ...incoming };
  if (!incoming.src && existing?.src) merged.src = existing.src;
  return merged;
}

function mergeArr(existing = [], incoming = []) {
  if (!incoming || incoming.length === 0) return existing;
  return incoming.map((item, i) => {
    const ex = existing[i];
    if (!item) return ex || { src: null, alt: "" };
    if (item.src?.startsWith("data:")) return item;
    const merged = { ...(ex || {}), ...item };
    if (!item.src && ex?.src) merged.src = ex.src;
    return merged;
  });
}
