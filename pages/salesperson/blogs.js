import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdSearch, MdAdd, MdEdit, MdDelete, MdArticle, MdVisibility } from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";

export default function SPBlogs() {
  const router = useRouter();
  const [spData,   setSpData]   = useState(null);
  const [blogs,    setBlogs]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SP_AUTH_KEY);
      if (!raw) return router.replace("/salesperson/login");
      const { token, salesperson } = JSON.parse(raw);
      if (!token || !salesperson) return router.replace("/salesperson/login");
      setSpData(salesperson);
    } catch { router.replace("/salesperson/login"); }
  }, []);

  useEffect(() => {
    if (!spData) return;
    fetch("/api/dashboard/blogs")
      .then(r => r.json())
      .then(data => { setBlogs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [spData]);

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

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

  if (!spData) return null;

  return (
    <SPLayout active="Blogs" spData={spData} onLogout={handleLogout}>
      <Head><title>Blogs — Tourwatchout</title></Head>

      <div style={{ padding: "28px 24px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Blogs</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Manage all blog posts from here.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Blogs",    value: total },
            { label: "Published",      value: published },
            { label: "Drafts",         value: drafts },
            { label: "Total Views",    value: views.toLocaleString("en-IN") },
          ].map(st => (
            <div key={st.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #e8eaf0" }}>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px", fontWeight: 500 }}>{st.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e", margin: 0 }}>{st.value}</p>
            </div>
          ))}
        </div>

        {/* Topbar */}
        <div className="bk-topbar" style={{ marginBottom: 24 }}>
          <div className="bk-search-wrap">
            <MdSearch size={18} className="bk-search-icon" />
            <input className="bk-search-input" placeholder="Search by title or author…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 14px", fontSize: 13, background: "#fff", cursor: "pointer", outline: "none" }}
              value={filter} onChange={e => setFilter(e.target.value)}>
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

        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>All blogs</h2>

        {loading ? (
          <p style={{ color: "#9ca3af", textAlign: "center", padding: 40 }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px" }}>
            <MdArticle size={48} style={{ color: "#d1d5db", marginBottom: 12 }} />
            <p style={{ color: "#9ca3af" }}>No blogs found. Create your first blog post!</p>
            <button className="bk-add-btn" style={{ marginTop: 12 }} onClick={() => router.push("/dashboard/blogs/create")}>
              <MdAdd size={18} /> Add New Blog
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
            {filtered.map(blog => (
              <div key={blog.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #e8eaf0", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: 160, background: "#f3f4f6", flexShrink: 0 }}>
                  {blog.cardImage?.src || blog.coverImage?.src ? (
                    <img
                      src={blog.cardImage?.src || blog.coverImage?.src}
                      alt={blog.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MdArticle size={36} style={{ color: "#d1d5db" }} />
                    </div>
                  )}
                  <span style={{
                    position: "absolute", top: 10, left: 10, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                    background: blog.status === "published" ? "#dcfce7" : blog.status === "scheduled" ? "#fef3c7" : "#f3f4f6",
                    color: blog.status === "published" ? "#15803d" : blog.status === "scheduled" ? "#b45309" : "#6b7280",
                  }}>
                    {blog.status === "published" ? "Live" : blog.status === "scheduled" ? "Scheduled" : "Draft"}
                  </span>
                </div>
                <div style={{ padding: "14px 14px 8px", flex: 1 }}>
                  {blog.categories?.length > 0 && (
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 5px" }}>{blog.categories[0]}</p>
                  )}
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px", lineHeight: 1.4 }} title={blog.title}>
                    {blog.title?.length > 55 ? blog.title.slice(0, 55) + "…" : blog.title}
                  </h3>
                  {blog.authorName && <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px" }}>By {blog.authorName}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" }}>
                    <span><MdVisibility size={13} style={{ verticalAlign: "middle", marginRight: 3 }} />{blog.views || 0} views</span>
                    <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, padding: "10px 14px 14px", borderTop: "1px solid #f3f4f6" }}>
                  <button
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    onClick={() => router.push(`/dashboard/blogs/create?id=${blog.id}`)}>
                    <MdEdit size={14} /> Edit
                  </button>
                  <button
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#fff2f2", color: "#e84949", border: "1px solid #fecaca", borderRadius: 7, padding: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    onClick={() => deleteBlog(blog.id)}>
                    <MdDelete size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SPLayout>
  );
}
