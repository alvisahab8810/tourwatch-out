import fs from "fs";
import path from "path";

const ROBOTS_PATH = path.join(process.cwd(), "public", "robots.txt");

// the admin area is never crawlable — these lines are re-added if an edit drops them
const BACKEND_DISALLOW = ["Disallow: /dashboard", "Disallow: /salesperson", "Disallow: /api/"];
const BACKEND_BLOCK = `# Backend / admin area — must never be crawled or indexed
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /salesperson
Disallow: /salesperson/
Disallow: /api/`;

const DEFAULT_ROBOTS = `User-agent: *
Allow: /

# Backend / admin area — must never be crawled or indexed
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /salesperson
Disallow: /salesperson/
Disallow: /api/

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
      // the backend must stay disallowed even if it is edited out of the box above
      let content = req.body.content || "";
      const missing = BACKEND_DISALLOW.filter(line => !content.includes(line));
      if (missing.length) content = content.trimEnd() + "\n\n" + BACKEND_BLOCK;
      fs.writeFileSync(ROBOTS_PATH, content, "utf8");
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).end();
}
