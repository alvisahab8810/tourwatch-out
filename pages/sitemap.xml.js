/**
 * Dynamic sitemap — served at /sitemap.xml
 *
 * Built on every request from the database, so new blog posts, destinations and
 * packages appear without anybody editing a file. Backend areas (/dashboard,
 * /salesperson, /api) are never listed, and neither are pages that are private or
 * useless to a search engine (login, profile, checkout, check-in forms).
 */
import connectDB from "../utils/mongodb";
import Blog from "../models/Blog";
import Package from "../models/Package";
import { readAll as readDests } from "../utils/destStore";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tourwatchout.com").replace(/\/+$/, "");

/* Public, indexable static routes. Keep in sync with pages/*.js — anything
   behind a login or part of a booking flow stays out on purpose. */
const STATIC_PAGES = [
  { path: "/",                              priority: "1.0", changefreq: "daily"   },
  { path: "/about",                         priority: "0.8", changefreq: "monthly" },
  { path: "/blogs",                         priority: "0.9", changefreq: "daily"   },
  { path: "/contact-us",                    priority: "0.7", changefreq: "monthly" },
  { path: "/faqs",                          priority: "0.6", changefreq: "monthly" },
  { path: "/family",                        priority: "0.9", changefreq: "weekly"  },
  { path: "/couple",                        priority: "0.9", changefreq: "weekly"  },
  { path: "/corporate",                     priority: "0.9", changefreq: "weekly"  },
  { path: "/honeymoon",                     priority: "0.9", changefreq: "weekly"  },
  { path: "/dubai-package",                 priority: "0.8", changefreq: "weekly"  },
  { path: "/kashmir-honeymoon",             priority: "0.8", changefreq: "weekly"  },
  { path: "/kashmir-corporate",             priority: "0.8", changefreq: "weekly"  },
  { path: "/privacy-policy",                priority: "0.3", changefreq: "yearly"  },
  { path: "/term-and-conditions",           priority: "0.3", changefreq: "yearly"  },
  { path: "/refund-cancellation-policy",    priority: "0.3", changefreq: "yearly"  },
];

const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const iso = (d) => {
  const t = d ? new Date(d) : null;
  return t && !isNaN(t) ? t.toISOString() : new Date().toISOString();
};

const slugify = (s) => String(s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

function urlTag({ path, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${esc(SITE + path)}</loc>`,
    lastmod    ? `    <lastmod>${lastmod}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority   ? `    <priority>${priority}</priority>` : "",
    "  </url>",
  ].filter(Boolean).join("\n");
}

export async function getServerSideProps({ res }) {
  const urls = [];
  const seen = new Set();
  // two Active packages can share a slug — the same <loc> must appear only once
  const add = (entry) => { if (seen.has(entry.path)) return; seen.add(entry.path); urls.push(urlTag(entry)); };
  const now = new Date().toISOString();

  for (const p of STATIC_PAGES) add({ ...p, lastmod: now });

  /* Destinations come from data/destinations.json, packages and blogs from Mongo.
     A failure on any one source must not take the whole sitemap down. */
  try {
    for (const d of readDests().filter((d) => d.status === "Active" && d.slug)) {
      add({ path: `/destination/${d.slug}`, lastmod: iso(d.updatedAt), changefreq: "weekly", priority: "0.9" });
    }
  } catch (e) { console.error("[sitemap] destinations failed:", e?.message || e); }

  try {
    await connectDB();

    // the package page 404s unless its destination slug is an Active destination,
    // so unknown destinations are skipped instead of feeding Google dead URLs
    const destBySlug = {};
    const activeSlugs = new Set();
    try {
      for (const d of readDests().filter((d) => d.status === "Active" && d.slug)) {
        activeSlugs.add(d.slug);
        destBySlug[slugify(d.name || d.slug)] = d.slug;
      }
    } catch {}

    const blogs = await Blog.find({ status: "published" }, { slug: 1, updatedAt: 1, publishDate: 1 }).lean();
    for (const b of blogs) {
      if (!b.slug) continue;
      add({ path: `/blogs/${b.slug}`, lastmod: iso(b.updatedAt || b.publishDate), changefreq: "monthly", priority: "0.8" });
    }

    const pkgs = await Package.find({ status: "Active" }, { slug: 1, destination: 1, updatedAt: 1 }).lean();
    for (const p of pkgs) {
      const destSlug = destBySlug[slugify(p.destination)] || slugify(p.destination);
      const id = p.slug || String(p._id || "");
      if (!destSlug || !id || !activeSlugs.has(destSlug)) continue;
      add({ path: `/destination/${destSlug}/package/${id}`, lastmod: iso(p.updatedAt), changefreq: "weekly", priority: "0.7" });
    }
  } catch (e) { console.error("[sitemap] db failed:", e?.message || e); }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("X-Robots-Tag", "noindex");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() { return null; }
