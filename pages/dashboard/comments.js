import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdMenu, MdCheck, MdClose, MdDelete, MdComment, MdSearch, MdRefresh } from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

const STATUS_COLOR = {
  pending:  { bg: "#fef3c7", color: "#b45309" },
  approved: { bg: "#dcfce7", color: "#15803d" },
  rejected: { bg: "#fee2e2", color: "#dc2626" },
};

export default function CommentsPage() {
  const router = useRouter();
  const [data,    setData]    = useState({ comments: [], stats: {} });
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const openSidebar = useOpenSidebar();
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState(null);

  useEffect(() => {
    load();
  }, [filter]);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ status: filter });
    const r = await fetch(`/api/dashboard/comments?${params}`);
    const json = await r.json();
    setData(json);
    setLoading(false);
  }

  async function act(id, status) {
    setActing(id + status);
    await fetch(`/api/dashboard/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setData(prev => ({
      ...prev,
      comments: prev.comments.map(c => c.id === id ? { ...c, status } : c),
    }));
    setActing(null);
  }

  async function del(id) {
    if (!confirm("Delete this comment permanently?")) return;
    setActing(id + "del");
    await fetch(`/api/dashboard/comments/${id}`, { method: "DELETE" });
    setData(prev => ({
      ...prev,
      comments: prev.comments.filter(c => c.id !== id),
    }));
    setActing(null);
  }

  const visible = data.comments.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.name || "").toLowerCase().includes(q)
      || (c.body || "").toLowerCase().includes(q)
      || (c.blogSlug || "").toLowerCase().includes(q);
  });

  const { stats = {} } = data;

  const statCards = [
    { label: "Total",    value: stats.total    || 0, color: "#6366f1", icon: "💬" },
    { label: "Pending",  value: stats.pending  || 0, color: "#f59e0b", icon: "⏳" },
    { label: "Approved", value: stats.approved || 0, color: "#10b981", icon: "✅" },
    { label: "Rejected", value: stats.rejected || 0, color: "#ef4444", icon: "🚫" },
  ];

  return (
    <>
      <Head><title>Comments — Tourwatchout</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
              <div>
                <h1 className="bk-page-title">Comments</h1>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Review and moderate blog comments</p>
              </div>
            </div>
            <button
              onClick={load}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#f3f4f6", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}
            >
              <MdRefresh size={16} /> Refresh
            </button>
      </header>

      <div className="bk-content">
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {statCards.map(st => (
                <div key={st.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #e8eaf0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 6px", fontWeight: 500 }}>{st.label}</p>
                      <p style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", margin: 0 }}>{st.value}</p>
                    </div>
                    <span style={{ fontSize: 28 }}>{st.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bk-topbar" style={{ marginBottom: 24 }}>
              <div className="bk-search-wrap">
                <MdSearch size={18} className="bk-search-icon" />
                <input
                  className="bk-search-input"
                  placeholder="Search by name, content or blog…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", "pending", "approved", "rejected"].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    style={{
                      padding: "8px 16px", borderRadius: 8, border: "1.5px solid",
                      fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                      borderColor: filter === s ? "#2563eb" : "#e5e7eb",
                      background: filter === s ? "#2563eb" : "#fff",
                      color: filter === s ? "#fff" : "#374151",
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: 48 }}>Loading comments…</p>
            ) : visible.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px" }}>
                <MdComment size={48} style={{ color: "#d1d5db", marginBottom: 12 }} />
                <p style={{ color: "#9ca3af" }}>No comments found.</p>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e8eaf0" }}>
                      {["Commenter", "Comment", "Blog", "Date", "Status", "Actions"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((c, i) => (
                      <tr key={c.id} style={{ borderBottom: i < visible.length - 1 ? "1px solid #f3f4f6" : "none", background: "#fff" }}>
                        <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: "0 0 2px" }}>{c.name}</p>
                          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{c.email}</p>
                        </td>
                        <td style={{ padding: "14px 16px", verticalAlign: "top", maxWidth: 320 }}>
                          <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {c.body}
                          </p>
                        </td>
                        <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                          <a
                            href={`/blogs/${c.blogSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 600, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 160 }}
                          >
                            {c.blogTitle || c.blogSlug}
                          </a>
                        </td>
                        <td style={{ padding: "14px 16px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                            {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        </td>
                        <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "capitalize",
                            background: STATUS_COLOR[c.status]?.bg || "#f3f4f6",
                            color: STATUS_COLOR[c.status]?.color || "#6b7280",
                          }}>{c.status}</span>
                        </td>
                        <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                            {c.status !== "approved" && (
                              <button
                                onClick={() => act(c.id, "approved")}
                                disabled={!!acting}
                                title="Approve"
                                style={{ display: "flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#15803d", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                              >
                                <MdCheck size={14} /> Approve
                              </button>
                            )}
                            {c.status !== "rejected" && (
                              <button
                                onClick={() => act(c.id, "rejected")}
                                disabled={!!acting}
                                title="Reject"
                                style={{ display: "flex", alignItems: "center", gap: 4, background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                              >
                                <MdClose size={14} /> Reject
                              </button>
                            )}
                            <button
                              onClick={() => del(c.id)}
                              disabled={!!acting}
                              title="Delete"
                              style={{ display: "flex", alignItems: "center", gap: 4, background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                            >
                              <MdDelete size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>
    </>
  );
}

CommentsPage.getLayout = (page) => (
  <DashboardLayout active="Comments">{page}</DashboardLayout>
);
