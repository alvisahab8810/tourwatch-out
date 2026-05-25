import fs from "fs";
import path from "path";
import connectDB from "../../../utils/mongodb";
import PackageImage from "../../../models/PackageImage";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getExt(contentType = "image/jpeg") {
  const map = {
    "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png",
    "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg",
  };
  return map[contentType] || "jpg";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const lastId = req.body?.lastId || "";
  const limit  = Math.min(parseInt(req.body?.limit) || 5, 20);

  try {
    await connectDB();

    const query  = lastId ? { _id: { $gt: lastId } } : {};
    const images = await PackageImage.find(query).sort({ _id: 1 }).limit(limit).lean();

    if (images.length === 0) {
      return res.status(200).json({ migrated: 0, errors: 0, hasMore: false, lastId });
    }

    let migrated   = 0;
    let errors     = 0;
    let nextLastId = lastId;

    for (const img of images) {
      try {
        const id  = img._id;
        const ext = getExt(img.contentType);

        const subdir    = id.startsWith("dest_") ? "destinations" : "packages";
        const uploadDir = path.join(UPLOADS_ROOT, subdir);
        ensureDir(uploadDir);

        const safeName = id.replace(/[^a-z0-9._-]/gi, "_").slice(0, 200);
        const filename = `${safeName}.${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Only write if not already migrated
        if (!fs.existsSync(filepath)) {
          const buf = img.data?.buffer ? Buffer.from(img.data.buffer) : Buffer.from(img.data);
          fs.writeFileSync(filepath, buf);
        }

        // Delete from MongoDB to free space (deletes are allowed even when quota exceeded)
        await PackageImage.deleteOne({ _id: id });

        migrated++;
        nextLastId = id;
      } catch (e) {
        console.error("[migrate-images] Failed for", img._id, ":", e.message);
        errors++;
        nextLastId = img._id; // advance past failed image
      }
    }

    const hasMore = images.length === limit;
    return res.status(200).json({ migrated, errors, hasMore, lastId: nextLastId });

  } catch (e) {
    console.error("[migrate-images] Batch error:", e.message);
    return res.status(500).json({ error: e.message, migrated: 0, hasMore: true, lastId });
  }
}
