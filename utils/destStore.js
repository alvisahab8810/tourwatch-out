// Server-side only — do NOT import in client components
import fs from "fs";
import path from "path";

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

export function saveImage(base64, destId, name) {
  if (!base64 || !base64.startsWith("data:")) return null;
  const match = base64.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;
  const ext = match[1].split("/")[1]?.replace("jpeg", "jpg").replace("svg+xml", "svg") || "jpg";
  const dir = path.join(process.cwd(), "public", "uploads", "destinations", destId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.${ext}`), Buffer.from(match[2], "base64"));
  return `/uploads/destinations/${destId}/${name}.${ext}`;
}

const PKG_TYPES    = ["Family", "Couple"];
const PKG_SUBTYPES = ["Economy", "Deluxe", "Premium"];

/* Save all image fields in a destination payload, return updated payload */
export function processDestImages(data, id) {
  const d = JSON.parse(JSON.stringify(data));

  function img(obj, name) {
    if (!obj) return obj;
    if (obj.src?.startsWith("data:")) obj.src = saveImage(obj.src, id, name);
    return obj;
  }

  if (d.mainImage) d.mainImage = img(d.mainImage, "main");

  if (d.images) {
    PKG_TYPES.forEach(type => {
      if (d.images[type]) {
        PKG_SUBTYPES.forEach(sub => {
          if (d.images[type][sub]) {
            d.images[type][sub] = img(d.images[type][sub], `${type.toLowerCase()}-${sub.toLowerCase()}`);
          }
        });
      }
    });
  }

  return d;
}

export function toSlug(title) {
  return title.toLowerCase().replace(/[&]/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
