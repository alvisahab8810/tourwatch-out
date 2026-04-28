import connectDB from "../../../utils/mongodb";
import Package from "../../../models/Package";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") return res.status(405).end();

  await connectDB();

  const filePath = path.join(process.cwd(), "data", "packages.json");
  if (!fs.existsSync(filePath)) {
    return res.status(200).json({ migrated: 0, message: "No JSON file found" });
  }

  let jsonPackages = [];
  try {
    jsonPackages = JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
  } catch {
    return res.status(500).json({ error: "Failed to read packages.json" });
  }

  let migrated = 0;
  let skipped  = 0;

  for (const pkg of jsonPackages) {
    const id = pkg.id || pkg._id || uuidv4();
    const exists = await Package.findById(id);
    if (exists) { skipped++; continue; }
    try {
      await Package.create({ ...pkg, _id: id });
      migrated++;
    } catch (e) {
      console.error("Migration error for", id, e.message);
    }
  }

  return res.status(200).json({ migrated, skipped, total: jsonPackages.length });
}
