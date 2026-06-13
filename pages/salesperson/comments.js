import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdCheck, MdClose, MdDelete, MdSearch, MdRefresh } from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";
const STATUS_COLOR = {
  pending:  { bg: "#fef3c7", color: "#b45309" },
  approved: { bg: "#dcfce7", color: "#15803d" },
  rejected: { bg: "#fee2e2", color: "#dc2626" },
};

export default function SPComments() {
  const router = useRouter();
  const [spData,   setSpData]   = useState(null);
  const [data,     setData]     = useState({ comments: [], stats: {} });
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SP_AUTH_KEY);
      if (!raw) return router.replace("/salesperson/login");
      const { token, salesperson } = JSON.parse(raw);
      if (!token || !salesperson) return router.replace("/salesperson/login");
      setSpData(salesperson);
    } catch { router.replace("/salesperson/login"); }
  }, []);

  useEffect(() => { if (spData) load(); }, [spData, filter]);

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
    setData(prev => ({ ...prev, comments: prev.comments.map(c => c.id === id ? { ...c, status } : c) }));
    setActing(null);
  }

  async function del(id) {
    if (!confirm("Delete this comment permanently?")) return;
    setActing(id + "del");
    await fetch(`/api/dashboard/comments/${id}`, { method: "DELETE" });
    setData(prev => ({ ...prev, comments: prev.comments.filter(c => c.id !== id) }));
    setActing(null);
  }

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

  const visible = (data.comments || []).filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.author || "").toLowerCase().includes(q) || (c.content || "").toLowerCase().includes(q) || (c.packageName || "").toLowerCase().includes(q);
  });

  if (!spData) return null;

  return (
    <SPLayout active="Comments" spData={spData} onLogout={handleLogout}>
      <Head><title>Comments — Tourwatchout</title></Head>

      <div style={{ padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Comments</h1>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#374151" }}>
            <MdRefresh size={16} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => { setFilter(f); setSearch(""); }}
              style={{ padding: "8px 18px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: filter === f ? 700 : 500, cursor: "pointer", background: filter === f ? "#EE4C49" : "#f1f5f9", color: filter === f ? "#fff" : "#374151" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && data.stats?.[f] != null && <span style={{ marginLeft: 6, opacity: 0.8 }}>({data.stats[f]})</span>}
            </button>
          ))}
        </div>

        <div className="bk-topbar" style={{ marginBottom: 16 }}>
          <div className="bk-search-wrap">
            <MdSearch size={18} className="bk-search-icon" />
            <input className="bk-search-input" placeholder="Search comments…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>Loading…</div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>No comments found</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visible.map(c => {
              const sc = STATUS_COLOR[c.status] || STATUS_COLOR.pending;
              return (
                <div key={c.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{c.author || "Anonymous"}</span>
                        {c.email && <span style={{ fontSize: 12, color: "#64748b" }}>{c.email}</span>}
                        <span style={{ ...sc, borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{c.status}</span>
                        {c.packageName && <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 500 }}>on: {c.packageName}</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{c.content}</p>
                      {c.createdAt && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>{new Date(c.createdAt).toLocaleString("en-IN")}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {c.status !== "approved" && (
                        <button disabled={!!acting} onClick={() => act(c.id, "approved")}
                          style={{ background: "#dcfce7", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: "#15803d", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                          <MdCheck size={14} /> Approve
                        </button>
                      )}
                      {c.status !== "rejected" && (
                        <button disabled={!!acting} onClick={() => act(c.id, "rejected")}
                          style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                          <MdClose size={14} /> Reject
                        </button>
                      )}
                      <button disabled={acting === c.id + "del"} onClick={() => del(c.id)}
                        style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}>
                        <MdDelete size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SPLayout>
  );
}
