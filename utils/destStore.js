// Server-side only — do NOT import in client components
import fs from "fs";
import path from "path";
import connectDB from "./mongodb";
import PackageImage from "../models/PackageImage";

const DATA_FILE = path.join(process.cwd(), "data", "destinations.json");

export function readAll() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8") || "[]");
  } catch { return []; }
}

export function writeAll(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Stores image in MongoDB (same collection as package images).
// ID format: dest_{destId}__{name}  →  served at /api/images/dest_{destId}__{name}
export async function saveImage(base64, destId, name) {
  if (!base64 || !base64.startsWith("data:")) return null;
  const match = base64.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;

  try {
    await connectDB();
    const contentType = match[1];
    const data        = Buffer.from(match[2], "base64");
    const id          = `dest_${destId}__${name}`;

    await PackageImage.findByIdAndUpdate(
      id,
      { _id: id, data, contentType },
      { upsert: true }
    );
    return `/api/images/${id}`;
  } catch (e) {
    console.error("[destStore.saveImage] MongoDB save failed:", e.message);
    return null;
  }
}

const PKG_TYPES    = ["Family", "Couple"];
const PKG_SUBTYPES = ["Economy", "Deluxe", "Premium"];

export async function processDestImages(data, id) {
  const d = JSON.parse(JSON.stringify(data));

  async function img(obj, name) {
    if (!obj) return obj;
    if (obj.src?.startsWith("data:")) {
      obj.src = await saveImage(obj.src, id, name);
    }
    return obj;
  }

  if (d.mainImage) d.mainImage = await img(d.mainImage, "main");

  if (d.images) {
    for (const type of PKG_TYPES) {
      if (d.images[type]) {
        for (const sub of PKG_SUBTYPES) {
          if (d.images[type][sub]) {
            d.images[type][sub] = await img(
              d.images[type][sub],
              `${type.toLowerCase()}-${sub.toLowerCase()}`
            );
          }
        }
      }
    }
  }

  return d;
}

export function toSlug(title) {
  return title.toLowerCase().replace(/[&]/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
