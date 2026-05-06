import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MdSearch, MdBookmarkBorder, MdArrowForward, MdChevronLeft, MdChevronRight } from "react-icons/md";

const LIMIT = 9;

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function readTime(content) {
  if (!content) return "3 min read";
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export default function BlogList() {
  const [blogs,   setBlogs]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [query,   setQuery]   = useState("");
  const [cat,     setCat]     = useState("");
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (q, c, p) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: LIMIT });
      if (q) params.set("search", q);
      if (c) params.set("category", c);
      const r = await fetch(`/api/blogs?${params}`);
      const data = await r.json();
      setBlogs(data.blogs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      // Collect unique categories from all returned blogs
      if (p === 1) {
        const allCats = (data.blogs || []).flatMap(b => b.categories || []);
        setCats(prev => {
          const merged = [...new Set([...prev, ...allCats])];
          return merged.slice(0, 12);
        });
      }
    } catch { setBlogs([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load("", "", 1); }, [load]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    setQuery(search);
    load(search, cat, 1);
  }

  function handleCat(c) {
    const next = c === cat ? "" : c;
    setCat(next);
    setPage(1);
    load(query, next, 1);
  }

  function handlePage(p) {
    setPage(p);
    load(query, cat, p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="blogs-list-section ptb-80">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h2 className="blogs-title">
            {total > 0 ? `${total} Blog${total !== 1 ? "s" : ""}` : "Blog Posts"}
          </h2>
          <form className="bl-controls" onSubmit={handleSearch} style={{ marginBottom: 0 }}>
            <div className="bl-search-wrap">
              <MdSearch className="bl-search-icon" />
              <input
                type="text"
                placeholder="Search blogs…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary btn px-4 py-2 rounded-3" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
              Search
            </button>
          </form>
        </div>

        {/* Category filters */}
        {cats.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "18px 0 28px" }}>
            <button
              onClick={() => handleCat("")}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "1.5px solid",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                borderColor: !cat ? "#EE4C49" : "#E4E7EC",
                background: !cat ? "#EE4C49" : "#fff",
                color: !cat ? "#fff" : "#0C141D",
              }}
            >All</button>
            {cats.map(c => (
              <button
                key={c}
                onClick={() => handleCat(c)}
                style={{
                  padding: "6px 16px", borderRadius: 20, border: "1.5px solid",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                  borderColor: cat === c ? "#EE4C49" : "#E4E7EC",
                  background: cat === c ? "#EE4C49" : "#fff",
                  color: cat === c ? "#fff" : "#0C141D",
                }}
              >{c}</button>
            ))}
          </div>
        )}

        <div className="bl-grid">
          {loading ? (
            <div className="bl-loading">
              <div style={{ fontSize: 36, marginBottom: 12 }}>✈️</div>
              Loading stories…
            </div>
          ) : blogs.length === 0 ? (
            <div className="bl-empty">
              <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
              <p style={{ margin: 0 }}>No blogs published yet. Check back soon!</p>
            </div>
          ) : blogs.map(blog => {
            const img   = blog.cardImage?.src || blog.coverImage?.src;
            const badge = blog.categories?.[0];
            const date  = formatDate(blog.publishDate || blog.createdAt);

            return (
              <Link href={`/blogs/${blog.slug}`} key={blog.id} legacyBehavior>
                <a style={{ textDecoration: "none", display: "block" }}>
                  <div className="bl-card">
                    <div className="bl-card-img">
                      {img ? (
                        <img src={img} alt={blog.cardImage?.alt || blog.title} />
                      ) : (
                        <div className="bl-card-img-placeholder">✈️</div>
                      )}
                      {badge && <span className="bl-badge">{badge}</span>}
                      <button
                        className="bl-bookmark"
                        onClick={e => e.preventDefault()}
                        aria-label="Bookmark"
                      >
                        <MdBookmarkBorder />
                      </button>
                    </div>
                    <div className="bl-card-body">
                      {badge && <p className="bl-card-cat">{badge}</p>}
                      <h3 className="bl-card-title">{blog.title}</h3>
                      {blog.summary && <p className="bl-card-summary">{blog.summary}</p>}
                      <div className="bl-card-footer">
                        <div className="bl-card-meta">
                          {blog.authorName && <span className="bl-card-author">{blog.authorName}</span>}
                          <span className="bl-card-date">{date}</span>
                        </div>
                        <span className="bl-read-more">
                          Read more <MdArrowForward size={15} />
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="bl-pagination">
            <button className="bl-pag-btn" onClick={() => handlePage(page - 1)} disabled={page === 1}>
              <MdChevronLeft size={18} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`bl-pag-btn ${page === n ? "active" : ""}`}
                onClick={() => handlePage(n)}
              >{n}</button>
            ))}
            <button className="bl-pag-btn" onClick={() => handlePage(page + 1)} disabled={page >= pages}>
              <MdChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
