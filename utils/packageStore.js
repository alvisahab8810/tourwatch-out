// Server-side only — do NOT import in client components
import fs   from "fs";
import path from "path";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getExt(contentType) {
  const map = {
    "image/jpeg":   "jpg",
    "image/jpg":    "jpg",
    "image/png":    "png",
    "image/webp":   "webp",
    "image/svg+xml":"svg",
    "image/gif":    "gif",
  };
  return map[contentType] || "jpg";
}

/**
 * Saves a base64 data URI to /public/uploads/<subdir>/<id>.<ext>
 * Returns a stable public URL — e.g. /uploads/packages/pkg__banner.jpg
 *
 * Existing images already stored in MongoDB (URLs like /api/images/...)
 * are NOT affected — they are served by /api/images/[id].js as before.
 */
export async function saveImage(base64, pkgId, name) {
  if (!base64 || !base64.startsWith("data:")) return null;
  const match = base64.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;

  try {
    const contentType = match[1];
    const buffer      = Buffer.from(match[2], "base64");
    const ext         = getExt(contentType);

    // blog_ prefix → blogs subdir, everything else → packages
    const subdir    = pkgId.startsWith("blog_") ? "blogs" : "packages";
    const uploadDir = path.join(UPLOADS_ROOT, subdir);
    ensureDir(uploadDir);

    const safeName = `${pkgId}__${name}`
      .replace(/[^a-z0-9._-]/gi, "_")
      .slice(0, 120);
    const filename = `${safeName}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);
    return `/uploads/${subdir}/${filename}`;
  } catch (e) {
    console.error("[saveImage] Filesystem save failed:", e.message);
    // Return base64 as last resort so image still shows in UI
    return base64;
  }
}

/* Save all image fields in a package payload, return updated payload */
export async function processImages(data, id) {
  const d = JSON.parse(JSON.stringify(data));

  async function img(obj, name) {
    if (!obj) return obj;
    if (obj.src?.startsWith("data:")) {
      obj.src = await saveImage(obj.src, id, name);
    }
    return obj;
  }

  d.featureImage = await img(d.featureImage, "feature-image");
  d.webBanner    = await img(d.webBanner,    "web-banner");
  d.mobileBanner = await img(d.mobileBanner, "mobile-banner");
  d.priceImage   = await img(d.priceImage,   "price-image");

  if (d.advertisement?.image)
    d.advertisement.image = await img(d.advertisement.image, "ad-image");

  if (Array.isArray(d.gallery))
    d.gallery = await Promise.all(d.gallery.map((g, i) => img(g, `gallery-${i}`)));

  if (Array.isArray(d.aboutImages))
    d.aboutImages = await Promise.all(d.aboutImages.map((g, i) => img(g, `about-${i}`)));

  if (Array.isArray(d.bucketImages))
    d.bucketImages = await Promise.all(d.bucketImages.map((g, i) => img(g, `bucket-${i}`)));

  if (Array.isArray(d.days)) {
    d.days = await Promise.all(d.days.map(async (day, i) => ({
      ...day,
      icon: day.icon?.startsWith("data:")
        ? await saveImage(day.icon, id, `day-${i + 1}-icon`)
        : day.icon,
    })));
  }

  return d;
}
