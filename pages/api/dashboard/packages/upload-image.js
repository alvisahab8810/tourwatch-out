import { v4 as uuidv4 } from "uuid";
import { saveImage } from "../../../../utils/packageStore";

export const config = { api: { bodyParser: { sizeLimit: "8mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { base64, name = "image" } = req.body || {};
  if (!base64 || !base64.startsWith("data:")) {
    return res.status(400).json({ error: "Invalid image data" });
  }
  const safeName = (name || "image").replace(/[^a-z0-9._-]/gi, "_").slice(0, 60);
  const tempId   = uuidv4();          // unique ID per upload; package ID not needed yet
  const url = await saveImage(base64, `pkg_upload_${tempId}`, safeName);
  if (!url || url.startsWith("data:")) {
    return res.status(500).json({ error: "Image save failed" });
  }
  return res.status(200).json({ url });
}
