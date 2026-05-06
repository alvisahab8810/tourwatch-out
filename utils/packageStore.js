// Server-side only — do NOT import in client components
import connectDB from "./mongodb";
import PackageImage from "../models/PackageImage";

// Saves a base64 data URI to the PackageImage MongoDB collection.
// Returns a stable /api/images/<id> URL — survives server restarts and redeployments.
export async function saveImage(base64, pkgId, name) {
  if (!base64 || !base64.startsWith("data:")) return null;
  const match = base64.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;

  try {
    await connectDB();
    const contentType = match[1];
    const data        = Buffer.from(match[2], "base64");
    const id          = `${pkgId}__${name}`;

    await PackageImage.findByIdAndUpdate(
      id,
      { _id: id, data, contentType },
      { upsert: true }
    );
    return `/api/images/${id}`;
  } catch (e) {
    console.error("[saveImage] MongoDB save failed:", e.message);
    // Last-resort: keep the data URI so the image still shows
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
      icon: day.icon?.startsWith("data:") ? await saveImage(day.icon, id, `day-${i + 1}-icon`) : day.icon,
    })));
  }

  return d;
}
