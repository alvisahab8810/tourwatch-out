import { saveImage } from "../../../../utils/packageStore";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { base64, name = "inline" } = req.body || {};
  if (!base64 || !base64.startsWith("data:")) return res.status(400).json({ error: "Invalid image" });
  const safeName = name.replace(/[^a-z0-9._-]/gi, "_").slice(0, 60);
  const url = await saveImage(base64, `blog_content_${Date.now()}`, safeName);
  if (!url) return res.status(500).json({ error: "Upload failed" });
  return res.status(200).json({ url });
}
