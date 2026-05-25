import crypto from "crypto";
import fs from "fs";
import path from "path";
import connectDB from "../../../utils/mongodb";
import PackageImage from "../../../models/PackageImage";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const SUBDIRS      = ["packages", "destinations", "blogs", "amenities"];

function findOnFilesystem(id) {
  // id may contain only alphanumeric, dash, underscore (new uploads)
  // or may contain dots (legacy migrated images — keep them as-is)
  const safeName = id.replace(/[^a-z0-9._-]/gi, "_").slice(0, 200);

  for (const sub of SUBDIRS) {
    const dir = path.join(UPLOADS_ROOT, sub);
    if (!fs.existsSync(dir)) continue;

    // Try: safeName already contains the extension (legacy migrated files)
    const direct = path.join(dir, safeName);
    if (fs.existsSync(direct)) {
      const ext = path.extname(safeName).slice(1).toLowerCase();
      const contentType = ext === "svg" ? "image/svg+xml"
        : ext === "jpg" || ext === "jpeg" ? "image/jpeg"
        : `image/${ext || "jpeg"}`;
      return { buf: fs.readFileSync(direct), contentType };
    }

    // Try: append common extensions (new upload files have no ext in the id)
    for (const ext of ["jpg", "jpeg", "png", "webp", "gif", "svg"]) {
      const fp = path.join(dir, `${safeName}.${ext}`);
      if (fs.existsSync(fp)) {
        const contentType = ext === "svg" ? "image/svg+xml"
          : ext === "jpg" || ext === "jpeg" ? "image/jpeg"
          : `image/${ext}`;
        return { buf: fs.readFileSync(fp), contentType };
      }
    }
  }
  return null;
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).end();

  // Try filesystem first for new-style IDs (pkg_upload_... / blog_...)
  // This avoids a slow MongoDB round-trip for images that were never in DB
  if (id.startsWith("pkg_upload_") || id.startsWith("blog_content_") || id.startsWith("blog_upload_") || id.startsWith("dest_")) {
    const found = findOnFilesystem(id);
    if (found) {
      res.setHeader("Content-Type", found.contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.end(found.buf);
    }
    return res.status(404).end();
  }

  // For legacy IDs (old MongoDB images): try MongoDB, fall back to filesystem
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

  // Filesystem fallback for legacy migrated images
  const found = findOnFilesystem(id);
  if (found) {
    res.setHeader("Content-Type", found.contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.end(found.buf);
  }

  return res.status(404).end();
}
