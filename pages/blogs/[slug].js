import Head from "next/head";
import Link from "next/link";
import Topbar from "../../components/header/Header";
import Offcanvas from "../../components/header/Offcanvas";
import NewFooter from "../../components/footer/NewFooter";
import { MdArrowBack, MdCalendarToday, MdPerson, MdVisibility, MdAccessTime } from "react-icons/md";
import connectDB from "../../utils/mongodb";
import Blog from "../../models/Blog";

// Markdown → HTML. Images and inline HTML are stashed before italic/bold
// processing so underscores inside URLs never get converted to <em> tags.
function mdToHtml(md) {
  if (!md) return "";
  const stash = [];
  const save  = html => { const k = `\x02${stash.length}\x03`; stash.push(html); return k; };

  let s = md;
  // 1. Protect existing inline HTML
  s = s.replace(/<[a-zA-Z][^>]*>[\s\S]*?<\/[a-zA-Z]+>|<[a-zA-Z][^>]*\/>/g, save);
  // 2. Convert image markdown → <img> BEFORE italic regex runs
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => save(`<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />`));

  s = s
    .replace(/^###### (.+)$/gm, "<h6>$1</h6>")
    .replace(/^##### (.+)$/gm,  "<h5>$1</h5>")
    .replace(/^#### (.+)$/gm,   "<h4>$1</h4>")
    .replace(/^### (.+)$/gm,    "<h3>$1</h3>")
    .replace(/^## (.+)$/gm,     "<h2>$1</h2>")
    .replace(/^# (.+)$/gm,      "<h1>$1</h1>")
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

export default function BlogDetail({ blog, related }) {
  if (!blog) return null;

  const hasHero = !!(blog.coverImage?.src);
  const date    = formatDate(blog.publishDate || blog.createdAt);
  const rt      = readTime(blog.content);
  const html    = mdToHtml(blog.content);

  return (
    <>
      <Head>
        <title>{`${blog.metaTitle || blog.title} — TourWatchOut`}</title>
        <meta name="description" content={blog.metaDescription || blog.summary || ""} />
        {blog.metaRobots && <meta name="robots" content={blog.metaRobots} />}
        {blog.metaKeywords && <meta name="keywords" content={blog.metaKeywords} />}
        <link rel="stylesheet" href="/assets/css/blogs.css" />
        {/* Multiple schemas — fall back to legacy single schema field */}
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
        {/* Hero */}
        {hasHero ? (
          <div className="blog-detail-hero">
            <img
              src={blog.coverImage.src}
              alt={blog.coverImage.alt || blog.title}
            />
            <div className="blog-detail-hero-overlay">
              <div className="blog-detail-hero-text" style={{ maxWidth: 820, width: "100%" }}>
                {blog.categories?.[0] && (
                  <span className="bl-badge" style={{ position: "static", display: "inline-block", marginBottom: 14 }}>
                    {blog.categories[0]}
                  </span>
                )}
                <h1>{blog.title}</h1>
                <div className="blog-detail-meta">
                  {blog.authorName && <span><MdPerson size={15} />{blog.authorName}</span>}
                  {date && <span><MdCalendarToday size={14} />{date}</span>}
                  <span><MdAccessTime size={14} />{rt}</span>
                  <span><MdVisibility size={14} />{(blog.views || 0).toLocaleString("en-IN")} views</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="blog-detail-no-hero">
            <div className="container">
              {blog.categories?.[0] && (
                <span className="bl-badge" style={{ position: "static", display: "inline-block", marginBottom: 16 }}>
                  {blog.categories[0]}
                </span>
              )}
              <h1>{blog.title}</h1>
              <div className="blog-detail-meta">
                {blog.authorName && <span><MdPerson size={15} />{blog.authorName}</span>}
                {date && <span><MdCalendarToday size={14} />{date}</span>}
                <span><MdAccessTime size={14} />{rt}</span>
                <span><MdVisibility size={14} />{(blog.views || 0).toLocaleString("en-IN")} views</span>
              </div>
            </div>
          </div>
        )}

        {/* Article body */}
        <div className="blog-detail-body">
          <Link href="/blogs" legacyBehavior>
            <a className="bl-back-btn"><MdArrowBack size={16} /> Back to Blogs</a>
          </Link>

          {blog.summary && (
            <p style={{ fontSize: 18, color: "#555", lineHeight: 1.7, marginBottom: 32, fontStyle: "italic", borderLeft: "4px solid #EE4C49", paddingLeft: 18 }}>
              {blog.summary}
            </p>
          )}

          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />

            {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="blog-detail-tags">
              <span style={{ fontSize: 13, color: "#999", marginRight: 4 }}>Tags:</span>
              {blog.tags.map(t => (
                <span key={t} className="blog-detail-tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* FAQs */}
        {blog.faqs?.filter(f => f.question).length > 0 && (
          <div className="blog-faqs">
            <div className="container">
              <h2 className="blog-faqs-title">Frequently Asked Questions</h2>
              <div className="blog-faqs-list">
                {blog.faqs.filter(f => f.question).map((faq, i) => (
                  <div key={i} className="blog-faq-item">
                    <div className="blog-faq-question">
                      <span className="blog-faq-num">Q{i + 1}</span>
                      <h3>{faq.question}</h3>
                    </div>
                    <div className="blog-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related blogs */}
        {related?.length > 0 && (
          <div className="blog-related">
            <div className="container">
              <h2 className="blog-related-title">You might also like</h2>
              <div className="bl-grid">
                {related.map(b => {
                  const img   = b.cardImage?.src || b.coverImage?.src;
                  const badge = b.categories?.[0];
                  return (
                    <Link href={`/blogs/${b.slug}`} key={b._id} legacyBehavior>
                      <a style={{ textDecoration: "none", display: "block" }}>
                        <div className="bl-card">
                          <div className="bl-card-img">
                            {img ? (
                              <img src={img} alt={b.cardImage?.alt || b.title} />
                            ) : (
                              <div className="bl-card-img-placeholder">✈️</div>
                            )}
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
                              <span className="bl-read-more">Read more <MdArrowBack size={15} style={{ transform: "rotate(180deg)" }} /></span>
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
        { tags: { $in: blog.tags || [] } },
      ],
    })
      .select("-content -schema")
      .limit(3)
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
