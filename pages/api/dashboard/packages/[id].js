import { readAll, writeAll, processImages } from "../../../../utils/packageStore";

export const config = { api: { bodyParser: { sizeLimit: "25mb" } } };

export default function handler(req, res) {
  const { id } = req.query;
  const all = readAll();
  const idx = all.findIndex(p => p.id === id);

  if (req.method === "PUT") {
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const existing = all[idx];
    const raw = { ...existing, ...req.body, id };
    // Merge images: only overwrite if new base64 provided
    raw.webBanner    = mergeImg(existing.webBanner,    req.body.webBanner);
    raw.mobileBanner = mergeImg(existing.mobileBanner, req.body.mobileBanner);
    raw.priceImage   = mergeImg(existing.priceImage,   req.body.priceImage);
    if (req.body.advertisement?.image)
      raw.advertisement.image = mergeImg(existing.advertisement?.image, req.body.advertisement.image);
    raw.gallery      = mergeArr(existing.gallery,      req.body.gallery);
    raw.aboutImages  = mergeArr(existing.aboutImages,  req.body.aboutImages);
    raw.bucketImages = mergeArr(existing.bucketImages, req.body.bucketImages);

    const data = processImages(raw, id);
    all[idx] = data;
    writeAll(all);
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    writeAll(all.filter(p => p.id !== id));
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}

function mergeImg(existing, incoming) {
  if (!incoming) return existing;
  if (incoming.src?.startsWith("data:")) return incoming;
  const merged = { ...(existing || {}), ...incoming };
  // Don't overwrite a valid existing src with null
  if (!incoming.src && existing?.src) merged.src = existing.src;
  return merged;
}

function mergeArr(existing = [], incoming = []) {
  // Preserve existing when incoming is empty (prevents accidental wipe-out)
  if (!incoming || incoming.length === 0) return existing;
  return incoming.map((item, i) => {
    const ex = existing[i];
    if (!item) return ex || { src: null, alt: "" };
    if (item.src?.startsWith("data:")) return item;
    const merged = { ...(ex || {}), ...item };
    // Don't overwrite a valid existing src with null
    if (!item.src && ex?.src) merged.src = ex.src;
    return merged;
  });
}
