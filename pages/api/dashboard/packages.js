import { readAll, writeAll, processImages } from "../../../utils/packageStore";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: { sizeLimit: "25mb" } } };

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(readAll());
  }

  if (req.method === "POST") {
    const all = readAll();
    const id = uuidv4();
    const raw = { ...req.body, id, createdAt: new Date().toISOString() };
    const data = processImages(raw, id);
    all.push(data);
    writeAll(all);
    return res.status(201).json(data);
  }

  res.status(405).end();
}
