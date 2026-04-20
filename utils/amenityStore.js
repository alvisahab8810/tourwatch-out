// Server-side only
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "amenities.json");

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

export function saveAmenityIcon(base64, slug) {
  if (!base64?.startsWith("data:")) return null;
  const match = base64.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;
  const ext = match[1].split("/")[1]?.replace("svg+xml", "svg") || "png";
  const dir  = path.join(process.cwd(), "public", "uploads", "amenities");
  fs.mkdirSync(dir, { recursive: true });
  const name = `${slug}.${ext}`;
  fs.writeFileSync(path.join(dir, name), Buffer.from(match[2], "base64"));
  return `/uploads/amenities/${name}`;
}
