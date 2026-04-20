export const config = { api: { bodyParser: { sizeLimit: "5mb" } } };

export default function handler(req, res) {
  const { readAll, writeAll, saveAmenityIcon } = require("../../../utils/amenityStore");

  if (req.method === "GET") {
    return res.status(200).json(readAll());
  }

  if (req.method === "POST") {
    const { name, iconBase64 } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: "Name required" });

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const icon = saveAmenityIcon(iconBase64, slug) || null;

    const all = readAll();
    const idx = all.findIndex(a => a.name === name);
    const amenity = { name: name.trim(), icon };
    if (idx >= 0) all[idx] = amenity; else all.push(amenity);
    writeAll(all);

    return res.status(201).json(amenity);
  }

  res.status(405).end();
}
