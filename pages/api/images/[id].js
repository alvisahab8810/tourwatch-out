import crypto from "crypto";
import fs from "fs";
import path from "path";
import connectDB from "../../../utils/mongodb";
import PackageImage from "../../../models/PackageImage";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const SUBDIRS      = ["packages", "destinations", "blogs", "amenities"];

function findOnFilesystem(id) {
  const safeName = id.replace(/[^a-z0-9._-]/gi, "_").slice(0, 200);
  for (const sub of SUBDIRS) {
    const dir = path.join(UPLOADS_ROOT, sub);
    if (!fs.existsSync(dir)) continue;
    // Try common extensions
    for (const ext of ["jpg", "png", "webp", "gif", "svg"]) {
      const fp = path.join(dir, `${safeName}.${ext}`);
      if (fs.existsSync(fp)) {
        const contentType = ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
        return { buf: fs.readFileSync(fp), contentType };
      }
    }
  }
  return null;
}

export default async function handler(req, res) {
  const { id } = req.query;

  // Try MongoDB first (legacy images)
  try {
    await connectDB();
    const img = await PackageImage.findById(id).lean();
    if (img) {
      const buf  = img.data?.buffer ? Buffer.from(img.data.buffer) : Buffer.from(img.data);
      const etag = `"${crypto.createHash("md5").update(buf).digest("hex")}"`;

      res.setHeader("Content-Type", img.contentType || "image/jpeg");
      res.setHeader("ETag", etag);
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");

      if (req.headers["if-none-match"] === etag) return res.status(304).end();
      return res.end(buf);
    }
  } catch (_) {
    // MongoDB unavailable — fall through to filesystem
  }

  // Fallback: filesystem (migrated images)
  const found = findOnFilesystem(id);
  if (found) {
    res.setHeader("Content-Type", found.contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.end(found.buf);
  }

  return res.status(404).end();
}
