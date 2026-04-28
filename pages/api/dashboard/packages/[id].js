import connectDB from "../../../../utils/mongodb";
import Package from "../../../../models/Package";
import { processImages } from "../../../../utils/packageStore";

export const config = { api: { bodyParser: { sizeLimit: "25mb" } } };

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PUT") {
    const existing = await Package.findById(id).lean();
    if (!existing) return res.status(404).json({ error: "Not found" });

    const raw = { ...existing, ...req.body, _id: id };
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

    const data = processImages(raw, id);
    const updated = await Package.findByIdAndUpdate(id, data, { new: true, overwrite: true }).lean();
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
