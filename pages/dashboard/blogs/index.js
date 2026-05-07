import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdMenu, MdSearch, MdAdd, MdEdit, MdDelete, MdArticle, MdVisibility, MdDrafts } from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../../components/backend/DashboardLayout";

export default function BlogList() {
  const router = useRouter();
  const [blogs, setBlogs]     = useState([]);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const openSidebar = useOpenSidebar();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/blogs")
      .then(r => r.json())
      .then(data => { setBlogs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function deleteBlog(id) {
    if (!confirm("Delete this blog post?")) return;
    setBlogs(prev => prev.filter(b => b.id !== id));
    await fetch(`/api/dashboard/blogs/${id}`, { method: "DELETE" });
  }

  const filtered = blogs.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || (b.title || "").toLowerCase().includes(q) || (b.authorName || "").toLowerCase().includes(q);
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const total     = blogs.length;
  const published = blogs.filter(b => b.status === "published").length;
  const drafts    = blogs.filter(b => b.status === "draft").length;
  const views     = blogs.reduce((s, b) => s + (b.views || 0), 0);

  const stats = [
    { label: "Total Blogs",            value: total,                          icon: "/assets/images/blogs/icons/icon1.svg" },
    { label: "Active Blogs",           value: published,                      icon: "/assets/images/blogs/icons/icon2.svg" },
    { label: "Blogs in Draft",         value: drafts,                         icon: "/assets/images/blogs/icons/icon3.svg" },
    { label: "Total Views this month", value: views.toLocaleString("en-IN"),  icon: "/assets/images/blogs/icons/icon4.svg" },
  ];

  return (
    <>
      <Head><title>Blogs — TourWatchOut</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
          <div>
            <h1 className="bk-page-title">Blogs</h1>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Welcome back! Here's what's happening with your blog today.</p>
          </div>
        </div>
      </header>

      <div className="bk-content">
            {/* Stats */}
            <div style={s.statsRow}>
              {stats.map(st => (
                <div key={st.label} style={s.statCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={s.statLabel}>{st.label}</p>
                      <p style={s.statValue}>{st.value}</p>
                    </div>
                    <img src={st.icon} alt="" style={{ width: 44, height: 44, objectFit: "contain" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Topbar */}
            <div className="bk-topbar" style={{ marginBottom: 24 }}>
              <div className="bk-search-wrap">
                <MdSearch size={18} className="bk-search-icon" />
                <input
                  className="bk-search-input"
                  placeholder="Search by title or author…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  style={s.filterSelect}
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <button className="bk-add-btn" onClick={() => router.push("/dashboard/blogs/create")}>
                  <MdAdd size={18} /> Add New Blog
                </button>
              </div>
            </div>

            {/* Grid */}
            <h2 style={s.sectionTitle}>Ongoing blogs</h2>
            {loading ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: 40 }}>Loading…</p>
            ) : filtered.length === 0 ? (
              <div style={s.empty}>
                <MdArticle size={48} style={{ color: "#d1d5db", marginBottom: 12 }} />
                <p style={{ color: "#9ca3af" }}>No blogs found. Create your first blog post!</p>
                <button className="bk-add-btn" style={{ marginTop: 12 }} onClick={() => router.push("/dashboard/blogs/create")}>
                  <MdAdd size={18} /> Add New Blog
                </button>
              </div>
            ) : (
              <div style={s.grid}>
                {filtered.map(blog => (
                  <div key={blog.id} style={s.card}>
                    <div style={s.cardImgWrap}>
                      {blog.cardImage?.src || blog.coverImage?.src ? (
                        <img
                          src={blog.cardImage?.src || blog.coverImage?.src}
                          alt={blog.cardImage?.alt || blog.title}
                          style={s.cardImg}
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div style={s.cardImgPlaceholder}><MdArticle size={36} style={{ color: "#d1d5db" }} /></div>
                      )}
                      <span style={{ ...s.badge, background: blog.status === "published" ? "#dcfce7" : blog.status === "scheduled" ? "#fef3c7" : "#f3f4f6", color: blog.status === "published" ? "#15803d" : blog.status === "scheduled" ? "#b45309" : "#6b7280" }}>
                        {blog.status === "published" ? "Live" : blog.status === "scheduled" ? "Scheduled" : "Draft"}
                      </span>
                    </div>
                    <div style={s.cardBody}>
                      {blog.categories?.length > 0 && (
                        <p style={s.cardCat}>{blog.categories[0]}</p>
                      )}
                      <h3 style={s.cardTitle} title={blog.title}>
                        {blog.title?.length > 55 ? blog.title.slice(0, 55) + "…" : blog.title}
                      </h3>
                      {blog.authorName && <p style={s.cardAuthor}>By {blog.authorName}</p>}
                      <div style={s.cardMeta}>
                        <span><MdVisibility size={13} style={{ verticalAlign: "middle", marginRight: 3 }} />{blog.views || 0} views</span>
                        <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
                      </div>
                    </div>
                    <div style={s.cardActions}>
                      <button style={s.editBtn} onClick={() => router.push(`/dashboard/blogs/create?id=${blog.id}`)}>
                        <MdEdit size={14} /> Edit
                      </button>
                      <button style={s.delBtn} onClick={() => deleteBlog(blog.id)}>
                        <MdDelete size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
    </>
  );
}

BlogList.getLayout = (page) => (
  <DashboardLayout active="Blogs">{page}</DashboardLayout>
);

const s = {
  statsRow:   { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 },
  statCard:   { background: "#fff", borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #e8eaf0" },
  statLabel:  { fontSize: 13, color: "#6b7280", margin: "0 0 6px", fontWeight: 500 },
  statValue:  { fontSize: 28, fontWeight: 800, color: "#1a1a2e", margin: 0 },
  filterSelect: { border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 14px", fontSize: 13, background: "#fff", cursor: "pointer", outline: "none" },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 },
  empty:      { display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px" },
  grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 },
  card:       { background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #e8eaf0", display: "flex", flexDirection: "column" },
  cardImgWrap:{ position: "relative", height: 160, background: "#f3f4f6", flexShrink: 0 },
  cardImg:    { width: "100%", height: "100%", objectFit: "cover" },
  cardImgPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  badge:      { position: "absolute", top: 10, left: 10, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20 },
  cardBody:   { padding: "14px 14px 8px", flex: 1 },
  cardCat:    { fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 5px" },
  cardTitle:  { fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px", lineHeight: 1.4 },
  cardAuthor: { fontSize: 12, color: "#9ca3af", margin: "0 0 6px" },
  cardMeta:   { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" },
  cardActions:{ display: "flex", gap: 8, padding: "10px 14px 14px", borderTop: "1px solid #f3f4f6" },
  editBtn:    { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  delBtn:     { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#fff2f2", color: "#e84949", border: "1px solid #fecaca", borderRadius: 7, padding: "8px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};
