import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdSearch, MdRefresh } from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";
const PER_PAGE_OPTS = [10, 20, 50];

function inrFmt(n) {
  return Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function calcTotal(q) {
  const cost = parseFloat(q.totalCost || q.cost || 0);
  const margin = parseFloat(q.margin || 0);
  return cost + (cost * margin) / 100;
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_STYLE = {
  Won:      { bg: "#f0fdf4", color: "#16a34a" },
  Lost:     { bg: "#fef2f2", color: "#dc2626" },
  Sent:     { bg: "#eff6ff", color: "#2563eb" },
  Draft:    { bg: "#f8fafc", color: "#64748b" },
};

export default function SPQuotations() {
  const router = useRouter();
  const [spData,      setSpData]      = useState(null);
  const [quotations,  setQuotations]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [perPage,     setPerPage]     = useState(10);
  const [page,        setPage]        = useState(1);

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
    setLoading(true);
    fetch("/api/dashboard/quotations")
      .then(r => r.json())
      .then(d => setQuotations(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [spData]);

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

  const filtered = quotations.filter(q => {
    const s = search.toLowerCase();
    return !s ||
      q.clientName?.toLowerCase().includes(s) ||
      q.quoteId?.toLowerCase().includes(s) ||
      q.destination?.toLowerCase().includes(s) ||
      q.displayId?.toLowerCase().includes(s);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  if (!spData) return null;

  return (
    <SPLayout active="Quotation" spData={spData} onLogout={handleLogout}>
      <Head><title>Quotations — Tourwatchout</title></Head>
      <div style={S.page}>

        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Quotations</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>View all client quotations</p>
          </div>
          <button style={S.refreshBtn} onClick={() => { setLoading(true); fetch("/api/dashboard/quotations").then(r => r.json()).then(d => setQuotations(Array.isArray(d) ? d : [])).finally(() => setLoading(false)); }} title="Refresh">
            <MdRefresh size={18} />
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
          <StatCard label="Total"  value={quotations.length}                                    color="#2563eb" />
          <StatCard label="Won"    value={quotations.filter(q => q.status === "Won").length}    color="#16a34a" />
          <StatCard label="Sent"   value={quotations.filter(q => q.status === "Sent").length}   color="#d97706" />
          <StatCard label="Lost"   value={quotations.filter(q => q.status === "Lost").length}   color="#dc2626" />
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px", height: 42, marginBottom: 16 }}>
          <MdSearch size={17} color="#94a3b8" />
          <input
            style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#0f172a", background: "transparent" }}
            placeholder="Search by client name, quote ID, destination…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Table */}
        <div style={S.tableCard}>
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["SR.", "QUOTE ID", "CLIENT", "DESTINATION", "TOTAL", "STATUS", "DATE"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={S.empty}>Loading…</td></tr>
                ) : slice.length === 0 ? (
                  <tr><td colSpan={7} style={S.empty}>{search ? "No quotations match your search" : "No quotations yet"}</td></tr>
                ) : slice.map((q, i) => {
                  const st = STATUS_STYLE[q.status] || STATUS_STYLE.Draft;
                  const total = calcTotal(q);
                  return (
                    <tr key={q._id || q.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={S.td}>{(safePage - 1) * perPage + i + 1}</td>
                      <td style={S.td}>
                        <span style={{ fontWeight: 700, color: "#EE4C49", fontSize: 12 }}>
                          {q.displayId || q.quoteId || "—"}
                        </span>
                      </td>
                      <td style={S.td}><span style={{ fontWeight: 600 }}>{q.clientName || "—"}</span></td>
                      <td style={S.td}>{q.destination || "—"}</td>
                      <td style={S.td}>
                        <span style={{ fontWeight: 700, color: "#0f172a" }}>
                          {total > 0 ? `₹${inrFmt(total)}` : "—"}
                        </span>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", background: st.bg, color: st.color }}>
                          {q.status || "Draft"}
                        </span>
                      </td>
                      <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmtDate(q.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Showing&nbsp;
              <select style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 6px", fontSize: 13, background: "#fff" }}
                value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              &nbsp;of {filtered.length} quotations
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Prev</PgBtn>
              <PgBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</PgBtn>
            </div>
          </div>
        </div>
      </div>
    </SPLayout>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function PgBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding: "5px 14px", border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", color: disabled ? "#cbd5e1" : "#374151", cursor: disabled ? "default" : "pointer", fontSize: 12, fontWeight: 500 }}>
      {children}
    </button>
  );
}

const S = {
  page:      { padding: "24px 28px", minHeight: "100vh", background: "#f8fafc", width: "100%", boxSizing: "border-box" },
  header:    { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 },
  title:     { fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" },
  refreshBtn:{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" },
  tableCard: { background: "#fff", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden" },
  table:     { width: "100%", borderCollapse: "collapse", minWidth: 700 },
  th:        { padding: "11px 14px", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", textAlign: "left", whiteSpace: "nowrap" },
  td:        { padding: "11px 14px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" },
  empty:     { padding: "60px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 },
};
