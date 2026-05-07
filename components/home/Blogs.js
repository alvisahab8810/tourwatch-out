import React, { useEffect, useState } from "react";
import Link from "next/link";

// Static fallback cards shown while blogs load
const STATIC = [
  { id: "s1", image: "/assets/images/blogs/blog1.png", category: "Malaysia",     sub: "Tour Packages", href: "/blogs" },
  { id: "s2", image: "/assets/images/blogs/blog2.png", category: "Thailand",     sub: "Tour Packages", href: "/blogs" },
  { id: "s3", image: "/assets/images/blogs/blog3.png", category: "Kuala Lumpur", sub: "Tour Packages", href: "/blogs" },
  { id: "s4", image: "/assets/images/blogs/blog4.png", category: "Dubai",        sub: "Tour Packages", href: "/blogs" },
];

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return "";
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("/api/blogs?limit=4&page=1")
      .then(r => r.json())
      .then(data => {
        const list = data.blogs || [];
        if (list.length > 0) setBlogs(list);
      })
      .catch(() => {});
  }, []);

  const cards = blogs.length > 0 ? blogs : STATIC;

  return (
    <section className="blogs-section">
      <div className="mini-container1">
        <div className="explore-row">
          <h2 className="section-title">Blogs</h2>
          <Link href="/blogs" className="explore-more-btn">
            View all
          </Link>
        </div>

        <div className="blogs-grid pt-80">
          {cards.map((card, i) => {
            // ── Real blog card ──
            if (card.slug) {
              const img      = card.cardImage?.src || card.coverImage?.src || STATIC[i % 4]?.image;
              const category = card.categories?.[0] || "Blog";
              const sub      = truncate(card.title, 32) || "Travel Blog";
              const date     = formatDate(card.publishDate || card.createdAt);

              return (
                <Link
                  href={`/blogs/${card.slug}`}
                  key={card.id || card._id || i}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div className="blog-card">
                    <div
                      className="blog-image"
                      style={{ backgroundImage: `url('${img}')` }}
                    >
                      <div className="blog-overlay">
                        <div className="blog-category">{category}</div>
                        <div className="blog-subcategory">{sub}</div>
                        <div className="blog-divider"></div>
                        <div className="blog-price">
                          <span className="price-label">{date || "Read More →"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }

            // ── Static fallback card ──
            return (
              <Link
                href={card.href}
                key={card.id}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div className="blog-card">
                  <div
                    className="blog-image"
                    style={{ backgroundImage: `url('${card.image}')` }}
                  >
                    <div className="blog-overlay">
                      <div className="blog-category">{card.category}</div>
                      <div className="blog-subcategory">{card.sub}</div>
                      <div className="blog-divider"></div>
                      <div className="blog-price">
                        <span className="price-label">Starts at</span>
                        <span className="price-value">₹ ***</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
