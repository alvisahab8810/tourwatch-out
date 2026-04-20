import { readAll, writeAll, processDestImages, toSlug } from "../../../utils/destStore";
import { v4 as uuid } from "uuid";

export const config = { api: { bodyParser: { sizeLimit: "25mb" } } };

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.json(readAll());
  }

  if (req.method === "POST") {
    const id = uuid();
    const raw = {
      ...req.body,
      id,
      slug: req.body.slug || toSlug(req.body.title || req.body.name || ""),
      type: req.body.type || (req.body.country === "India" ? "national" : "international"),
      createdAt: new Date().toISOString(),
    };
    const data = processDestImages(raw, id);
    const all = readAll();
    writeAll([...all, data]);
    return res.status(201).json(data);
  }

  res.status(405).end();
}
