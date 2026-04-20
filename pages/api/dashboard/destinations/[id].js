import { readAll, writeAll, processDestImages, toSlug } from "../../../../utils/destStore";

export const config = { api: { bodyParser: { sizeLimit: "25mb" } } };

const PKG_TYPES    = ["Family", "Couple"];
const PKG_SUBTYPES = ["Economy", "Deluxe", "Premium"];

function mergeImg(existing, incoming) {
  if (!incoming) return existing;
  if (incoming.src?.startsWith("data:")) return incoming;
  return { ...(existing || {}), ...incoming };
}

function mergeTypeImages(existing = {}, incoming = {}) {
  const result = JSON.parse(JSON.stringify(existing));
  PKG_TYPES.forEach(type => {
    if (incoming[type]) {
      result[type] = result[type] || {};
      PKG_SUBTYPES.forEach(sub => {
        if (incoming[type][sub] !== undefined) {
          result[type][sub] = mergeImg(result[type]?.[sub], incoming[type][sub]);
        }
      });
    }
  });
  return result;
}

export default function handler(req, res) {
  const { id } = req.query;
  const all = readAll();
  const idx = all.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  if (req.method === "PUT") {
    const existing = all[idx];
    const raw = {
      ...existing,
      ...req.body,
      id,
      slug: req.body.slug || toSlug(req.body.title || req.body.name || existing.title || ""),
      type: req.body.type || (req.body.country === "India" ? "national" : "international"),
      mainImage: mergeImg(existing.mainImage, req.body.mainImage),
      images: mergeTypeImages(existing.images, req.body.images || {}),
    };
    const data = processDestImages(raw, id);
    all[idx] = data;
    writeAll(all);
    return res.json(data);
  }

  if (req.method === "DELETE") {
    writeAll(all.filter(d => d.id !== id));
    return res.status(204).end();
  }

  res.status(405).end();
}
