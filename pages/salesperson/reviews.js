import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdSearch, MdDelete, MdCheckCircle, MdCancel, MdChevronLeft, MdChevronRight } from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";
const PER_PAGE_OPTS = [10, 20, 50];
const STATUS_OPTS = ["All", "pending", "approved", "rejected"];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function Stars({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width={13} height={13} viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? "#f5a623" : "none"}
          stroke="#f5a623" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

const STATUS_MAP = {
  pending:  { bg: "#fef9c3", color: "#a16207" },
  approved: { bg: "#dcfce7", color: "#15803d" },
  rejected: { bg: "#fee2e2", color: "#b91c1c" },
};

export default function SPReviews() {
  const router = useRouter();
  const [spData,   setSpData]   = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("All");
  const [perPage,  setPerPage]  = useState(10);
  const [page,     setPage]     = useState(1);
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

  useEffect(() => { if (spData) load(); }, [spData]);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/dashboard/reviews");
      const d = await r.json();
      setReviews(Array.isArray(d) ? d : []);
    } finally { setLoading(false); }
  }

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

  async function updateStatus(id, newStatus) {
    setActing(id);
    await fetch(`/api/dashboard/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setActing(null);
  }

  async function deleteReview(id) {
    if (!confirm("Delete this review?")) return;
    setActing(id);
    await fetch(`/api/dashboard/reviews/${id}`, { method: "DELETE" });
    setReviews(prev => prev.filter(r => r.id !== id));
    setActing(null);
  }

  let filtered = reviews.filter(r => {
    const matchStatus = status === "All" || r.status === status;
    const q = search.toLowerCase();
    const matchQ = !search || (r.reviewer || r.name || "").toLowerCase().includes(q) || (r.packageName || "").toLowerCase().includes(q) || (r.comment || r.review || "").toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  if (!spData) return null;

  return (
    <SPLayout active="Reviews" spData={spData} onLogout={handleLogout}>
      <Head><title>Reviews — Tourwatchout</title></Head>

      <div style={{ padding: "28px 24px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Reviews</h1>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <MdSearch size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search reviews…"
              style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", background: "#fff" }}>
            {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="bk-table-card">
          <div className="bk-table-wrap">
            <table className="bk-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Reviewer</th>
                  <th>Package</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>Loading…</td></tr>
                ) : paged.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No reviews found</td></tr>
                ) : paged.map((r, i) => {
                  const sc = STATUS_MAP[r.status] || STATUS_MAP.pending;
                  return (
                    <tr key={r.id}>
                      <td>{(page - 1) * perPage + i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.reviewer || r.name || "—"}</td>
                      <td style={{ maxWidth: 160 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.packageName || "—"}</div></td>
                      <td><Stars rating={r.rating || 0} /></td>
                      <td style={{ maxWidth: 220 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#374151" }}>{r.comment || r.review || "—"}</div></td>
                      <td><span style={{ ...sc, borderRadius: 5, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>{r.status}</span></td>
                      <td>{r.createdAt ? fmtDate(r.createdAt) : "—"}</td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          {r.status !== "approved" && (
                            <button disabled={acting === r.id} onClick={() => updateStatus(r.id, "approved")}
                              style={{ background: "#dcfce7", border: "none", borderRadius: 5, padding: "4px 8px", cursor: "pointer", color: "#15803d", fontSize: 11, fontWeight: 700 }}>Approve</button>
                          )}
                          {r.status !== "rejected" && (
                            <button disabled={acting === r.id} onClick={() => updateStatus(r.id, "rejected")}
                              style={{ background: "#fee2e2", border: "none", borderRadius: 5, padding: "4px 8px", cursor: "pointer", color: "#b91c1c", fontSize: 11, fontWeight: 700 }}>Reject</button>
                          )}
                          <button disabled={acting === r.id} onClick={() => deleteReview(r.id)}
                            style={{ background: "#f1f5f9", border: "none", borderRadius: 5, padding: "4px 6px", cursor: "pointer", color: "#64748b" }}>
                            <MdDelete size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bk-pagination">
            <div className="bk-pagination-left">
              <span className="bk-pag-label">Show</span>
              <select className="bk-pag-size" value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              <span className="bk-pag-label">of {filtered.length}</span>
            </div>
            <div className="bk-pagination-right">
              <button className="bk-pag-btn bk-pag-arrow" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><MdChevronLeft size={18} /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} className={`bk-pag-btn${page === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              {totalPages > 5 && <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>}
              <button className="bk-pag-btn bk-pag-arrow" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}><MdChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </SPLayout>
  );
}
