import fs from "fs";
import path from "path";

const ROBOTS_PATH = path.join(process.cwd(), "public", "robots.txt");

const DEFAULT_ROBOTS = `User-agent: *
Allow: /

Sitemap: https://tourwatchout.com/sitemap.xml`;

export default function handler(req, res) {
  if (req.method === "GET") {
    try {
      const content = fs.existsSync(ROBOTS_PATH)
        ? fs.readFileSync(ROBOTS_PATH, "utf8")
        : DEFAULT_ROBOTS;
      return res.status(200).json({ content });
    } catch {
      return res.status(200).json({ content: DEFAULT_ROBOTS });
    }
  }

  if (req.method === "PUT") {
    try {
      fs.writeFileSync(ROBOTS_PATH, req.body.content || "", "utf8");
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).end();
}
