import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  MdSearch, MdChevronLeft, MdChevronRight, MdPeople,
  MdFilterList, MdRefresh, MdDelete, MdWarning,
} from "react-icons/md";
import DashboardLayout from "../../components/backend/DashboardLayout";

const PER_PAGE_OPTS = [10, 20, 50];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTravelDate(val) {
  if (!val) return null;
  try {
    return new Date(val + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  } catch { return val; }
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function daysAgo(date) {
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  return d === 0 ? "Today" : d === 1 ? "1 day ago" : `${d} days ago`;
}

export default function LeadsPage() {
  const [leads,       setLeads]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [perPage,     setPerPage]     = useState(10);
  const [page,        setPage]        = useState(1);
  const [source,      setSource]      = useState("All");
  const [confirmId,   setConfirmId]   = useState(null); // lead id pending deletion
  const [deleting,    setDeleting]    = useState(false);

  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/leads");
      if (res.ok) setLeads(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await fetch(`/api/dashboard/leads/${confirmId}`, { method: "DELETE" });
      setLeads(prev => prev.filter(l => l._id !== confirmId));
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  const sources  = ["All", ...Array.from(new Set(leads.map(l => l.source).filter(Boolean)))];
  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.name?.toLowerCase().includes(q) ||
      l.phone?.includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.destination?.toLowerCase().includes(q) ||
      l.campaign?.toLowerCase().includes(q);
    return matchSearch && (source === "All" || l.source === source);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const confirmLead = leads.find(l => l._id === confirmId);

  return (
    <DashboardLayout active="Leads">
      <Head><title>Leads — Tourwatchout</title></Head>

      <div style={S.page}>

        <style>{`
          .leads-table-wrap::-webkit-scrollbar { height: 5px; }
          .leads-table-wrap::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 99px; }
          .leads-table-wrap::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
          .leads-table-wrap::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}</style>

        {/* ── Header ── */}
        <div style={S.header}>
          <h1 style={S.title}>Leads</h1>
          <button style={S.refreshBtn} onClick={fetchLeads} title="Refresh">
            <MdRefresh size={18} />
          </button>
        </div>

        {/* ── Stats ── */}
        <div style={S.statsRow}>
          <Stat label="Total Leads"   value={leads.length}                               color="#2563eb" />
          <Stat label="Today"         value={leads.filter(l => fmtDate(l.createdAt) === fmtDate(new Date())).length} color="#16a34a" />
          <Stat label="With Source"   value={leads.filter(l => l.source).length}         color="#d97706" />
          <Stat label="With Campaign" value={leads.filter(l => l.campaign).length}       color="#7c3aed" />
        </div>

        {/* ── Toolbar ── */}
        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <MdSearch size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
            <input
              style={S.searchInput}
              placeholder="Search by name, phone, email, destination…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div style={S.filterWrap}>
            <MdFilterList size={16} color="#64748b" />
            <select style={S.select} value={source} onChange={e => { setSource(e.target.value); setPage(1); }}>
              {sources.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={S.tableWrap} className="leads-table-wrap">
          <table style={S.table}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <TH>SR.</TH>
                <TH>Name</TH>
                <TH>Mobile No.</TH>
                <TH>Email</TH>
                <TH>Destination</TH>
                <TH>Travel Date</TH>
                <TH>Pax</TH>
                <TH>Message</TH>
                <TH>Form Type</TH>
                <TH>Date</TH>
                <TH>Time</TH>
                <TH>Source</TH>
                <TH>Medium</TH>
                <TH>Campaign</TH>
                <TH>Adset</TH>
                <TH>Ad Content</TH>
                <TH>Campaign ID</TH>
                <TH>Action</TH>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={18} style={S.empty}>Loading…</td></tr>
              ) : slice.length === 0 ? (
                <tr>
                  <td colSpan={18} style={S.empty}>
                    <MdPeople size={40} color="#cbd5e1" />
                    <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 14 }}>No leads found</div>
                  </td>
                </tr>
              ) : slice.map((l, i) => (
                <tr key={l._id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                  <TD>{(safePage - 1) * perPage + i + 1}</TD>
                  <TD><span style={{ fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>{l.name}</span></TD>
                  <TD>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                      <span style={S.phoneDot} />{l.phone}
                    </span>
                  </TD>
                  <TD><span style={{ color: "#2563eb", whiteSpace: "nowrap" }}>{l.email}</span></TD>
                  <TD>
                    <span style={{ display: "inline-block", maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={l.destination}>
                      {l.destination || <span style={S.dash}>—</span>}
                    </span>
                  </TD>
                  <TD>{fmtTravelDate(l.travelDate) || <span style={S.dash}>—</span>}</TD>
                  <TD>{l.pax        || <span style={S.dash}>—</span>}</TD>
                  <TD>
                    <span style={{ display:"inline-block", maxWidth:160, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }} title={l.message}>
                      {l.message || <span style={S.dash}>—</span>}
                    </span>
                  </TD>
                  <TD>
                    {l.formType
                      ? <span style={{ background: l.formType === "Query Form" ? "#eff6ff" : "#fdf4ff", color: l.formType === "Query Form" ? "#1d4ed8" : "#7c3aed", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{l.formType}</span>
                      : <span style={S.dash}>—</span>}
                  </TD>
                  <TD>
                    <div style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{fmtDate(l.createdAt)}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{daysAgo(l.createdAt)}</div>
                  </TD>
                  <TD><span style={{ whiteSpace: "nowrap" }}>{fmtTime(l.createdAt)}</span></TD>
                  <TD>{l.source    ? <Tag>{l.source}</Tag>                    : <span style={S.dash}>—</span>}</TD>
                  <TD>{l.medium    ? <Tag>{l.medium}</Tag>                    : <span style={S.dash}>—</span>}</TD>
                  <TD>{l.campaign  ? <Tag color="#7c3aed">{l.campaign}</Tag>  : <span style={S.dash}>—</span>}</TD>
                  <TD>{l.adset     ? <Tag color="#d97706">{l.adset}</Tag>     : <span style={S.dash}>—</span>}</TD>
                  <TD>
                    <span style={{ whiteSpace: "nowrap", maxWidth: 120, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis" }} title={l.adContent}>
                      {l.adContent || <span style={S.dash}>—</span>}
                    </span>
                  </TD>
                  <TD>
                    <span style={{ fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap", maxWidth: 100, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis" }} title={l.campaignId}>
                      {l.campaignId || <span style={S.dash}>—</span>}
                    </span>
                  </TD>
                  <TD>
                    <button
                      style={S.delBtn}
                      title="Delete lead"
                      onClick={() => setConfirmId(l._id)}
                    >
                      <MdDelete size={16} />
                    </button>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div style={S.paginationBar}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" }}>
            Showing
            <select style={S.perPageSelect} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
              {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
            </select>
            of {filtered.length}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}><MdChevronLeft size={18} /></PgBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…");
                acc.push(n);
                return acc;
              }, [])
              .map((n, idx) =>
                n === "…"
                  ? <span key={`e${idx}`} style={{ padding: "0 4px", color: "#94a3b8" }}>…</span>
                  : <PgBtn key={n} active={n === safePage} onClick={() => setPage(n)}>{n}</PgBtn>
              )}
            <PgBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}><MdChevronRight size={18} /></PgBtn>
          </div>
        </div>

      </div>

      {/* ── Delete Confirmation Modal ── */}
      {confirmId && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget && !deleting) setConfirmId(null); }}>
          <div style={S.confirmCard}>
            <div style={S.confirmIcon}><MdWarning size={36} color="#ef4444" /></div>
            <h3 style={S.confirmTitle}>Delete Lead?</h3>
            <p style={S.confirmMsg}>
              You are about to permanently delete the lead for{" "}
              <strong>{confirmLead?.name}</strong>{" "}
              ({confirmLead?.phone}). This action cannot be undone.
            </p>
            <div style={S.confirmBtns}>
              <button
                style={S.cancelBtn}
                onClick={() => setConfirmId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                style={S.deleteBtn}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

/* ── atoms ── */
function TH({ children }) {
  return (
    <th style={{
      padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "#64748b",
      textTransform: "uppercase", letterSpacing: "0.05em",
      borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap",
      background: "#f8fafc", textAlign: "left",
    }}>{children}</th>
  );
}

function TD({ children }) {
  return (
    <td style={{
      padding: "11px 14px", fontSize: 13, color: "#374151",
      borderBottom: "1px solid #f1f5f9", verticalAlign: "middle",
      whiteSpace: "nowrap",
    }}>{children}</td>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={S.statCard}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Tag({ children, color = "#2563eb" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
      background: color + "18", color,
    }}>{children}</span>
  );
}

function PgBtn({ children, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 32, height: 32, border: "1px solid",
      borderColor: active ? "#2563eb" : "#e2e8f0",
      borderRadius: 6, background: active ? "#2563eb" : "#fff",
      color: active ? "#fff" : disabled ? "#cbd5e1" : "#374151",
      cursor: disabled ? "default" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: active ? 700 : 400,
    }}>{children}</button>
  );
}

/* ── styles ── */
const S = {
  page:         { padding: "24px 28px", minHeight: "100vh", background: "#f8fafc", width: "100%", boxSizing: "border-box" },
  header:       { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  title:        { fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 },
  refreshBtn:   { marginLeft: "auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" },
  statsRow:     { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 },
  statCard:     { background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  toolbar:      { display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  searchWrap:   { flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px", height: 42 },
  searchInput:  { flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0f172a", background: "transparent" },
  filterWrap:   { display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px", height: 42 },
  select:       { border: "none", outline: "none", fontSize: 13, color: "#374151", background: "transparent", cursor: "pointer" },
  tableWrap:    { background: "#fff", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table:        { width: "100%", borderCollapse: "collapse", minWidth: 900 },
  empty:        { padding: "60px 0", textAlign: "center", color: "#94a3b8" },
  dash:         { color: "#cbd5e1" },
  phoneDot:     { display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 },
  paginationBar:{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 4px", flexWrap: "wrap", gap: 10 },
  perPageSelect:{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 6px", fontSize: 13, color: "#374151", background: "#fff", cursor: "pointer" },

  delBtn: {
    background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6,
    width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#ef4444", transition: "background 0.15s",
  },

  /* confirmation modal */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(10,15,30,0.55)",
    backdropFilter: "blur(3px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 9999, padding: 16,
  },
  confirmCard: {
    background: "#fff", borderRadius: 18, padding: "36px 32px 28px",
    width: "100%", maxWidth: 420, textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
    animation: "pop-in 0.25s cubic-bezier(0.34,1.56,0.64,1)",
  },
  confirmIcon:  { marginBottom: 14, display: "flex", justifyContent: "center" },
  confirmTitle: { fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" },
  confirmMsg:   { fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 26px" },
  confirmBtns:  { display: "flex", gap: 10 },
  cancelBtn: {
    flex: 1, padding: "12px 0", borderRadius: 50, border: "1.5px solid #e2e8f0",
    background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  deleteBtn: {
    flex: 1, padding: "12px 0", borderRadius: 50, border: "none",
    background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
  },
};
