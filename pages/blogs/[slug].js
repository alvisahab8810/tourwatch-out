import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import Topbar from "../../components/header/Header";
import Offcanvas from "../../components/header/Offcanvas";
import NewFooter from "../../components/footer/NewFooter";
import {
  MdArrowBack, MdCalendarToday, MdPerson, MdVisibility,
  MdAccessTime, MdArrowForward, MdExpandMore, MdExpandLess,
} from "react-icons/md";
import connectDB from "../../utils/mongodb";
import Blog from "../../models/Blog";

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}
function stripMd(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/_(.+?)_/g, "$1");
}

function mdToHtml(md) {
  if (!md) return "";
  const stash = [];
  const save  = html => { const k = `\x02${stash.length}\x03`; stash.push(html); return k; };

  let s = md;
  s = s.replace(/<[a-zA-Z][^>]*>[\s\S]*?<\/[a-zA-Z]+>|<[a-zA-Z][^>]*\/>/g, save);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => save(`<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />`));

  s = s
    .replace(/^###### (.+)$/gm, (_, t) => `<h6 id="${slugify(t)}">${t}</h6>`)
    .replace(/^##### (.+)$/gm,  (_, t) => `<h5 id="${slugify(t)}">${t}</h5>`)
    .replace(/^#### (.+)$/gm,   (_, t) => `<h4 id="${slugify(t)}">${t}</h4>`)
    .replace(/^### (.+)$/gm,    (_, t) => `<h3 id="${slugify(t)}">${t}</h3>`)
    .replace(/^## (.+)$/gm,     (_, t) => `<h2 id="${slugify(t)}">${t}</h2>`)
    .replace(/^# (.+)$/gm,      (_, t) => `<h1 id="${slugify(t)}">${t}</h1>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,     "<em>$1</em>")
    .replace(/_(.+?)_/g,       "<em>$1</em>")
    .replace(/`(.+?)`/g,       "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^> (.+)$/gm,     "<blockquote>$1</blockquote>")
    .replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>")
    .replace(/^- (.+)$/gm,     "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .split(/\n{2,}/)
    .map(para => {
      const t = para.trim();
      if (!t) return "";
      if (/^<(h[1-6]|ul|ol|li|blockquote|img|div|figure|span|p)/.test(t) || t.startsWith("\x02")) return para;
      return `<p>${para.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");

  return s.replace(/\x02(\d+)\x03/g, (_, i) => stash[+i]);
}

function extractToc(md) {
  if (!md) return [];
  const toc = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^(#{2,4})\s+(.+)$/);
    if (m) {
      const raw = m[2].trim();
      toc.push({ level: m[1].length, text: stripMd(raw), id: slugify(raw) });
    }
  }
  return toc;
}

function readTime(content) {
  if (!content) return "3 min read";
  return `${Math.max(1, Math.round(content.trim().split(/\s+/).length / 200))} min read`;
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function timeAgo(d) {
  if (!d) return "";
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function BlogDetail({ blog, related }) {
  const [openFaq,     setOpenFaq]     = useState(null);
  const [activeId,    setActiveId]    = useState("");
  const [queryForm,   setQueryForm]   = useState({ name: "", destination: "", phone: "", email: "" });
  const [querySent,   setQuerySent]   = useState(false);
  const [queryLoading,setQueryLoading]= useState(false);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", body: "" });
  const [commentSent, setCommentSent] = useState(false);
  const [comments,    setComments]    = useState([]);

  const toc  = useMemo(() => extractToc(blog?.content || ""), [blog?.content]);
  const html = useMemo(() => mdToHtml(blog?.content),         [blog?.content]);

  // Load approved comments
  useEffect(() => {
    if (!blog?.slug) return;
    fetch(`/api/comments?slug=${blog.slug}`)
      .then(r => r.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [blog?.slug]);

  // Scroll spy for ToC
  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: "-10% 0px -75% 0px" }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);

  if (!blog) return null;

  const date    = formatDate(blog.publishDate || blog.createdAt);
  const rt      = readTime(blog.content);
  const hasHero = !!(blog.coverImage?.src);

  async function handleQuerySubmit(e) {
    e.preventDefault();
    setQueryLoading(true);
    try {
      await fetch("/api/queries/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...queryForm, source: `Blog: ${blog.title}` }),
      });
    } catch (_) {}
    setQuerySent(true);
    setQueryLoading(false);
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: blog.slug, ...commentForm }),
      });
    } catch (_) {}
    setCommentSent(true);
  }

  return (
    <>
      <Head>
        <title>{`${blog.metaTitle || blog.title} — Tourwatchout`}</title>
        <meta name="description" content={blog.metaDescription || blog.summary || ""} />
        {blog.metaRobots && <meta name="robots" content={blog.metaRobots} />}
        {blog.metaKeywords && <meta name="keywords" content={blog.metaKeywords} />}
        <link rel="stylesheet" href="/assets/css/blogs.css" />
        {blog.schemas?.length > 0
          ? blog.schemas.map((sc, i) => sc.content
              ? <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: sc.content }} />
              : null)
          : blog.schema
            ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: blog.schema }} />
            : null
        }
      </Head>

      <Topbar />
      <Offcanvas />

      <div className="blog-detail-page">

        {/* ── Hero: clean image only ── */}
        {hasHero ? (
          <div className="bdd-hero">
            <img src={blog.coverImage.src} alt={blog.coverImage.alt || blog.title} />
          </div>
        ) : (
          <div className="bdd-hero-placeholder" />
        )}

        <div className="container">
          {/* ── Two-column layout ── */}
          <div className="bdd-layout">

            {/* LEFT: title + content + comments */}
            <div className="bdd-main">

              {/* Back + Title block */}
              <div className="bdd-post-header">
                <div className="blg-top-row">
                  <Link href="/blogs" legacyBehavior>
                  <a className="bl-back-btn"><MdArrowBack size={16} /> Back to Blogs</a>
                </Link>

                {blog.categories?.length > 0 && (
                  <div className="bdd-cats">
                    {blog.categories.map(c => (
                      <span key={c} className="bl-badge bdd-cat-badge">{c}</span>
                    ))}
                  </div>
                )}

                </div>
                <h1 className="bdd-title">{blog.title}</h1>

                <div className="bdd-meta-row">
                  {blog.authorName && (
                    <span className="bdd-meta-item"><MdPerson size={15} />{blog.authorName}</span>
                  )}
                  {date && (
                    <span className="bdd-meta-item"><MdCalendarToday size={14} />{date}</span>
                  )}
                  <span className="bdd-meta-item"><MdAccessTime size={14} />{rt}</span>
                  <span className="bdd-meta-item">
                    <MdVisibility size={14} />{(blog.views || 0).toLocaleString("en-IN")} views
                  </span>
                </div>
              </div>

              {/* Summary */}
              {blog.summary && (
                <p className="bdd-summary">{blog.summary}</p>
              )}

              {/* Content */}
              <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: html }} />

              {/* Tags — clickable */}
              {blog.tags?.length > 0 && (
                <div className="blog-detail-tags">
                  <span style={{ fontSize: 13, color: "#999", marginRight: 6 }}>Tags:</span>
                  {blog.tags.map(t => (
                    <Link href={`/blogs?tag=${encodeURIComponent(t)}`} key={t} legacyBehavior>
                      <a className="blog-detail-tag bdd-tag-link">{t}</a>
                    </Link>
                  ))}
                </div>
              )}

              {/* ── Approved Comments ── */}
              {comments.length > 0 && (
                <div className="bdd-comments-list">
                  <h3 className="bdd-section-heading">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h3>
                  {comments.map(c => (
                    <div key={c.id} className="bdd-comment-item">
                      <div className="bdd-comment-avatar">{(c.name || "?")[0].toUpperCase()}</div>
                      <div className="bdd-comment-content">
                        <div className="bdd-comment-meta">
                          <span className="bdd-comment-author">{c.name}</span>
                          <span className="bdd-comment-time">{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="bdd-comment-body">{c.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Leave a Comment ── */}
              {blog.allowComments !== false && (
                <div className="bdd-comments">
                  <h3 className="bdd-section-heading">Leave a Comment</h3>
                  {commentSent ? (
                    <div className="bdd-success-msg">
                      <span className="bdd-success-icon">✓</span>
                      Thank you! Your comment is under review and will appear once approved.
                    </div>
                  ) : (
                    <form className="bdd-comment-form" onSubmit={handleCommentSubmit}>
                      <div className="bdd-form-row">
                        <div className="bdd-field">
                          <label>Your Name *</label>
                          <input type="text" placeholder="John Doe" required value={commentForm.name} onChange={e => setCommentForm(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="bdd-field">
                          <label>Your Email *</label>
                          <input type="email" placeholder="john@email.com" required value={commentForm.email} onChange={e => setCommentForm(p => ({ ...p, email: e.target.value }))} />
                        </div>
                      </div>
                      <div className="bdd-field">
                        <label>Comment *</label>
                        <textarea placeholder="Share your thoughts…" rows={4} required value={commentForm.body} onChange={e => setCommentForm(p => ({ ...p, body: e.target.value }))} />
                      </div>
                      <button type="submit" className="bdd-submit-btn">Post Comment</button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT: sticky sidebar */}
            <aside className="bdd-sidebar">

              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="bdd-toc-card">
                  <h4 className="bdd-toc-heading">
                    <span className="bdd-toc-icon">☰</span> Table of Contents
                  </h4>
                  <ul className="bdd-toc-list">
                    {toc.map((item, idx) => (
                      <li key={idx} className={`bdd-toc-item bdd-toc-l${item.level}${activeId === item.id ? " active" : ""}`}>
                        <a href={`#${item.id}`} onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Query Form — REACH OUT TO US style */}
              <div className="bdd-reach-card  mobile-none">
                <div className="bdd-reach-banner">
                  <div className="bdd-reach-banner-overlay">
                    <h4 className="bdd-reach-title">REACH OUT TO US</h4>
                    <p className="bdd-reach-sub">Just A Few Details &amp; We're On It!</p>
                  </div>
                </div>

                {querySent ? (
                  <div style={{ padding: "20px 18px" }}>
                    <div className="bdd-success-msg">
                      <span className="bdd-success-icon">✓</span>
                      We'll call you back shortly!
                    </div>
                  </div>
                ) : (
                  <form className="bdd-reach-form" onSubmit={handleQuerySubmit}>
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={queryForm.name}
                      onChange={e => setQueryForm(p => ({ ...p, name: e.target.value }))}
                    />
                    <input
                      type="text"
                      placeholder="Destination"
                      value={queryForm.destination}
                      onChange={e => setQueryForm(p => ({ ...p, destination: e.target.value }))}
                    />
                    <div className="bdd-phone-wrap">
                      <span className="bdd-phone-prefix">
                        <span className="bdd-flag">🇮🇳</span>
                        <span className="bdd-code">+91</span>
                        <span className="bdd-divider">|</span>
                      </span>
                      <input
                        type="tel"
                        placeholder="0000 0000 00"
                        required
                        value={queryForm.phone}
                        onChange={e => setQueryForm(p => ({ ...p, phone: e.target.value }))}
                        className="bdd-phone-input"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={queryForm.email}
                      onChange={e => setQueryForm(p => ({ ...p, email: e.target.value }))}
                    />
                    <button type="submit" className="bdd-reach-btn" disabled={queryLoading}>
                      {queryLoading ? "Sending…" : "Request Callback"}
                    </button>
                  </form>
                )}
              </div>

            </aside>
          </div>
        </div>

        {/* ── FAQs — accordion ── */}
        {blog.faqs?.filter(f => f.question).length > 0 && (
          <div className="blog-faqs">
            <div className="container">
              <h2 className="blog-faqs-title">Frequently Asked Questions</h2>
              <div className="bdd-accordion">
                {blog.faqs.filter(f => f.question).map((faq, i) => (
                  <div key={i} className={`bdd-faq-item${openFaq === i ? " open" : ""}`}>
                    <button className="bdd-faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span className="bdd-faq-num">Q{i + 1}</span>
                      <span className="bdd-faq-q">{faq.question}</span>
                      <span className="bdd-faq-chevron">
                        {openFaq === i ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
                      </span>
                    </button>
                    <div className="bdd-faq-body">
                      <div className="bdd-faq-answer"><p>{faq.answer}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Related blogs carousel ── */}
        {related?.length > 0 && (
          <div className="bdd-related">
            <div className="container">
              <h2 className="blog-related-title">You might also like</h2>
              <div className="bdd-carousel">
                {related.map(b => {
                  const img   = b.cardImage?.src || b.coverImage?.src;
                  const badge = b.categories?.[0];
                  return (
                    <Link href={`/blogs/${b.slug}`} key={b._id} legacyBehavior>
                      <a className="bdd-carousel-link">
                        <div className="bl-card bdd-carousel-card">
                          <div className="bl-card-img">
                            {img
                              ? <img src={img} alt={b.cardImage?.alt || b.title} />
                              : <div className="bl-card-img-placeholder">✈️</div>
                            }
                            {badge && <span className="bl-badge">{badge}</span>}
                          </div>
                          <div className="bl-card-body">
                            {badge && <p className="bl-card-cat">{badge}</p>}
                            <h3 className="bl-card-title">{b.title}</h3>
                            {b.summary && <p className="bl-card-summary">{b.summary}</p>}
                            <div className="bl-card-footer">
                              <div className="bl-card-meta">
                                {b.authorName && <span className="bl-card-author">{b.authorName}</span>}
                              </div>
                              <span className="bl-read-more">Read more <MdArrowForward size={14} /></span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      <NewFooter />
    </>
  );
}

export async function getServerSideProps({ params, res }) {
  try {
    await connectDB();
    const blog = await Blog.findOneAndUpdate(
      { slug: params.slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!blog) return { notFound: true };
    if (blog.xRobotsTag) res.setHeader("X-Robots-Tag", blog.xRobotsTag);

    const related = await Blog.find({
      status: "published",
      _id: { $ne: blog._id },
      $or: [
        { categories: { $in: blog.categories || [] } },
        { tags:       { $in: blog.tags       || [] } },
      ],
    })
      .select("-content -schema")
      .limit(6)
      .lean();

    return {
      props: {
        blog:    JSON.parse(JSON.stringify({ ...blog, id: String(blog._id) })),
        related: JSON.parse(JSON.stringify(related)),
      },
    };
  } catch {
    return { notFound: true };
  }
}
