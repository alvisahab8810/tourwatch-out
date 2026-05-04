// Server-side only — do NOT import in client components
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "packages.json");

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

// Images ≤ 2 MB (base64 string length) are stored as data URIs in MongoDB so they
// survive server restarts and container redeployments without any filesystem dependency.
// Larger images fall back to the filesystem with a try-catch safety net.
const DB_INLINE_LIMIT = 2 * 1024 * 1024; // 2 MB base64 string ≈ 1.5 MB original

export function saveImage(base64, pkgId, name) {
  if (!base64 || !base64.startsWith("data:")) return null;
  const match = base64.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;

  // Small enough to live in the DB — always reliable
  if (base64.length <= DB_INLINE_LIMIT) return base64;

  // Large image — try filesystem, fall back to data URI if that fails
  const ext = match[1].split("/")[1]?.replace("jpeg", "jpg").replace("svg+xml", "svg") || "jpg";
  try {
    const dir = path.join(process.cwd(), "public", "uploads", "packages", pkgId);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${name}.${ext}`), Buffer.from(match[2], "base64"));
    return `/uploads/packages/${pkgId}/${name}.${ext}`;
  } catch {
    return base64;
  }
}

/* Save all image fields in a package payload, return updated payload */
export function processImages(data, id) {
  const d = JSON.parse(JSON.stringify(data));

  function img(obj, name) {
    if (!obj) return obj;
    if (obj.src?.startsWith("data:")) {
      obj.src = saveImage(obj.src, id, name);
    } else if (obj.src && obj.src.startsWith("/uploads/")) {
      // Verify the file still exists on disk; if not, clear the stale path so the
      // next save with a fresh upload will replace it with a reliable data URI.
      const absPath = path.join(process.cwd(), "public", obj.src);
      if (!fs.existsSync(absPath)) obj.src = null;
    }
    return obj;
  }

  d.featureImage = img(d.featureImage, "feature-image");
  d.webBanner    = img(d.webBanner, "web-banner");
  d.mobileBanner = img(d.mobileBanner, "mobile-banner");
  d.priceImage   = img(d.priceImage, "price-image");

  if (d.advertisement?.image) d.advertisement.image = img(d.advertisement.image, "ad-image");

  if (Array.isArray(d.gallery))
    d.gallery = d.gallery.map((g, i) => img(g, `gallery-${i}`));

  if (Array.isArray(d.aboutImages))
    d.aboutImages = d.aboutImages.map((g, i) => img(g, `about-${i}`));

  if (Array.isArray(d.bucketImages))
    d.bucketImages = d.bucketImages.map((g, i) => img(g, `bucket-${i}`));

  if (Array.isArray(d.days)) {
    d.days = d.days.map((day, i) => ({
      ...day,
      icon: day.icon?.startsWith("data:") ? saveImage(day.icon, id, `day-${i + 1}-icon`) : day.icon,
    }));
  }

  return d;
}
