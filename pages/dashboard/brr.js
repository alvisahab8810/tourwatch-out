import React, { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { MdSearch } from "react-icons/md";
import DashboardLayout from "../../components/backend/DashboardLayout";
import QuotationBuilder, { calcQ, inrFmt } from "../../components/backend/QuotationBuilder";

/* ── constants ── */
const HOTEL_CATS   = ["Standard", "Deluxe", "Deluxe Family", "Premium", "Premium / Water Villa", "Luxury"];
const MEAL_OPTIONS = ["C.P.", "M.A.P.", "A.P."];
const EMPTY_BRR    = { adults: 2, children: 0, childAge1: "", childAge2: "", duration: "", tripDate: "", mealPlan: "C.P.", flight: false, train: false, transfers: false, sightseeing: false, hotelCategory: "Deluxe", budgetRange: "", notes: "" };

const PER_PAGE_OPTS = [10, 20, 50];
const CUR_YEAR = new Date().getFullYear();
const MONTH_CHIPS = Array.from({ length: 12 }, (_, i) => ({
  key: `${CUR_YEAR}-${String(i + 1).padStart(2, "0")}`,
  label: new Date(CUR_YEAR, i, 1).toLocaleDateString("en-IN", { month: "short" }),
}));
function brrMonthKey(l) {
  try { const d = new Date(l.brr?.collectedOn + "T00:00:00"); return isNaN(d) ? "" : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; } catch { return ""; }
}

/* ── helpers ── */
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(v) {
  if (!v || v === "N/A") return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}

const mealColor = {
  "C.P.":  { bg: "#E5EDFF", color: "#1D4ED8" },
  "M.A.P.":{ bg: "#FdF3D8", color: "#A16207" },
  "A.P.":  { bg: "#FFE9DC", color: "#C2410C" },
};

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ position: "relative", width: 40, height: 22, cursor: "pointer", userSelect: "none", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 99, background: checked ? "#2563EB" : "#CBD5E1", transition: ".18s" }} />
      <div style={{ position: "absolute", width: 16, height: 16, background: "#fff", borderRadius: "50%", top: 3, left: checked ? 21 : 3, transition: ".18s", boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
    </div>
  );
}

function Yn({ v }) {
  return v
    ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#EAF7EF", color: "#15803D" }}>✓</span>
    : <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#F1F4FA", color: "#CBD5E1" }}>✕</span>;
}

export default function BrrPage() {
  const router = useRouter();
  const [leads,       setLeads]       = useState([]);
  const [salespeople, setSalespeople] = useState([]);
  const [quotes,      setQuotes]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [expandedRow, setExpandedRow] = useState(null);
  const [hoveredRow,  setHoveredRow]  = useState(null);
  const [perPage,     setPerPage]     = useState(10);
  const [page,        setPage]        = useState(1);

  /* BRR modal */
  const [brrModal,   setBrrModal]   = useState(null);
  const [brrForm,    setBrrForm]    = useState(EMPTY_BRR);
  const [savingBrr,  setSavingBrr]  = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  /* Quotation builder modal */
  const [openBuilder, setOpenBuilder] = useState(null);
  const [notePopup,   setNotePopup]   = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/leads").then(r => r.json()),
      fetch("/api/dashboard/salesperson").then(r => r.json()),
      fetch("/api/dashboard/quotations").then(r => r.json()),
    ]).then(([l, sp, q]) => {
      setLeads(Array.isArray(l) ? l : []);
      setSalespeople(Array.isArray(sp) ? sp : []);
      setQuotes(Array.isArray(q) ? q : []);
    }).finally(() => setLoading(false));
  }, []);

  /* lead display IDs */
  const leadIdMap = useMemo(() => {
    const sorted = [...leads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return Object.fromEntries(sorted.map((l, i) => [l._id, `TWO-L-${String(i + 1).padStart(4, "0")}`]));
  }, [leads]);

  function qDispId(q) {
    return q.quotationNo || `TWO-Q-${(leadIdMap[q.leadId?._id || q.leadId]?.split("-")[2]) || "????"}`;
  }

  const quoteByLead = useMemo(() => {
    const m = {};
    quotes.forEach(q => { const lid = q.leadId?._id || q.leadId; if (lid) m[lid] = q; });
    return m;
  }, [quotes]);

  /* filter BRR leads */
  const brrLeads = useMemo(() => {
    return leads.filter(l => {
      if (!l.brr?.collectedOn) return false;
      if (filterMonth && brrMonthKey(l) !== filterMonth) return false;
      if (search) {
        const s = search.toLowerCase();
        if (![l.name, l.phone, l.destination, leadIdMap[l._id]].join(" ").toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [leads, filterMonth, search, leadIdMap]);

  const totalPages = Math.max(1, Math.ceil(brrLeads.length / perPage));
  const pg         = Math.min(page, totalPages);
  const slice      = brrLeads.slice((pg - 1) * perPage, pg * perPage);

  function openBrr(leadId) {
    const l = leads.find(x => x._id === leadId);
    setBrrForm({ ...EMPTY_BRR, tripDate: l?.travelDate || "", ...(l?.brr || {}) });
    setBrrModal(leadId);
  }

  async function saveBrr() {
    setSavingBrr(true); setUpdatingId(brrModal);
    try {
      const r = await fetch(`/api/dashboard/leads/${brrModal}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brr: { ...brrForm, adults: +brrForm.adults || 1, children: +brrForm.children || 0, collectedOn: todayISO() } }),
      });
      if (r.ok) {
        const u = await r.json();
        setLeads(p => p.map(l => l._id === brrModal ? { ...l, ...u } : l));
        setBrrModal(null);
      }
    } finally { setSavingBrr(false); setUpdatingId(null); }
  }

  function handleQuoteSaved(saved) {
    setQuotes(prev => {
      const idx = prev.findIndex(q => q._id === saved._id);
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
      return [saved, ...prev];
    });
  }

  const brrLead = brrModal ? leads.find(l => l._id === brrModal) : null;
  const COLS = ["Collected On", "Lead ID", "Name", "Destination", "Adults", "Children", "Duration", "Trip Date", "Budget", "Notes", "Action", ""];

  return (
    <DashboardLayout active="BRR">
      <Head><title>BRR — Tourwatchout</title></Head>
      <div style={S.page}>
        <style>{`
          .tbl-wrap::-webkit-scrollbar{height:5px}
          .tbl-wrap::-webkit-scrollbar-track{background:#F3F5FA}
          .tbl-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}
          .meal-opt{flex:1;text-align:center;padding:8px;border-radius:9px;font-weight:800;font-size:.8rem;cursor:pointer;border:2px solid transparent;transition:all .12s}
          .meal-cp{background:#E5EDFF;color:#1D4ED8}.meal-map{background:#FdF3D8;color:#A16207}.meal-ap{background:#FFE9DC;color:#C2410C}
          .meal-opt.active{border-color:currentColor}
        `}</style>

        {/* Header */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.title}>Basic Requirement Records</h1>
            <div style={{ fontSize: 12, color: "#6B7A99", fontWeight: 600 }}>Captured requirements, ready to convert into packages</div>
          </div>
        </div>

        {/* Banner */}
        <div style={S.banner}>
          <span style={{ color: "#F59E0B", marginRight: 6 }}>⚡</span>
          <span style={{ color: "#6B7A99" }}><strong style={{ color: "#374151" }}>One click ahead:</strong> every BRR carries the Lead ID with it. <strong style={{ color: "#374151" }}>Create Package</strong> will open the quotation builder pre-filled with these requirements.</span>
        </div>

        {/* Month filter chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, background: "#fff", border: "1px solid #E8EDF5", borderRadius: 10, padding: "10px 14px", overflowX: "auto", boxShadow: "0 1px 3px rgba(15,27,51,.04)" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".07em", flexShrink: 0 }}>Filters:</span>
          {MONTH_CHIPS.map(m => (
            <button key={m.key} onClick={() => { setFilterMonth(filterMonth === m.key ? "" : m.key); setPage(1); }}
              style={{ padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${filterMonth === m.key ? "#2563EB" : "#E8EDF5"}`, background: filterMonth === m.key ? "#2563EB" : "#fff", color: filterMonth === m.key ? "#fff" : "#6B7A99", whiteSpace: "nowrap", flexShrink: 0, transition: "all .12s" }}>
              {m.label}
            </button>
          ))}
          {filterMonth && (
            <button onClick={() => setFilterMonth("")}
              style={{ marginLeft: "auto", background: "#FEE2E2", color: "#BE123C", border: "none", borderRadius: 7, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Panel */}
        <div style={S.panel}>
          {/* Toolbar */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #E4E9F2", background: "#FBFCFE" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={S.searchWrap}>
                <MdSearch size={15} color="#94A3B8" />
                <input style={S.searchInput} placeholder="Search name, mobile, destination…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <span style={{ marginLeft: "auto", fontSize: 13, color: "#6B7A99", fontWeight: 600, whiteSpace: "nowrap" }}>{brrLeads.length} records</span>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }} className="tbl-wrap">
            <table style={S.tbl}>
              <thead>
                <tr style={{ background: "#fff" }}>
                  {COLS.map((h, i) => (
                    <th key={i} style={{
                      ...S.th,
                      ...(h === "Action" ? { minWidth: 180 } : {}),
                      ...(h === "Notes"  ? { minWidth: 140 } : {}),
                      ...(h === ""       ? { minWidth: 36, width: 36 } : {}),
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={COLS.length} style={S.emptyCell}>Loading…</td></tr>
                ) : brrLeads.length === 0 ? (
                  <tr><td colSpan={COLS.length} style={S.emptyCell}>No BRR records match the filters.</td></tr>
                ) : slice.map(l => {
                  const b          = l.brr;
                  const mc         = mealColor[b.mealPlan] || mealColor["C.P."];
                  const ages       = [b.childAge1, b.childAge2].filter(Boolean).join(", ") || "—";
                  const existQ     = quoteByLead[l._id];
                  const isExpanded = expandedRow === l._id;
                  const isHovered  = hoveredRow  === l._id;
                  const rowBg      = isExpanded ? "#EEF4FF" : isHovered ? "#F7F9FF" : "#fff";

                  return (
                    <React.Fragment key={l._id}>
                      <tr
                        onMouseEnter={() => setHoveredRow(l._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{ opacity: updatingId === l._id ? 0.6 : 1, transition: "background .12s, opacity .15s", background: rowBg }}
                      >
                        {/* Collected On */}
                        <td style={{ ...S.td, whiteSpace: "nowrap", width: 120 }}>
                          <span style={{ display: "block", color: "#36415A" }}>{fmtDate(b.collectedOn)}</span>
                        </td>

                        {/* Lead ID */}
                        <td style={{ ...S.td }}>
                          <span
                            style={{ display: "inline-block", background: "#EFF6FF", color: "#2563EB", fontWeight: 600, fontSize: 10.5, cursor: "pointer", padding: "2px 7px", borderRadius: 5, border: "1px solid #BFDBFE", letterSpacing: ".01em" }}
                            title="View lead profile"
                            onClick={() => router.push(`/dashboard/lead-profiles?lead=${l._id}`)}
                          >
                            {leadIdMap[l._id]}
                          </span>
                        </td>

                        {/* Name */}
                        <td style={{ ...S.td, minWidth: 120 }}>
                          <span style={{ fontWeight: 600, color: "#0F1B33", display: "block" }}>{l.name}</span>
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>{l.phone}</span>
                        </td>

                        {/* Destination */}
                        <td style={S.td}>{l.destination || <span style={S.dash}>—</span>}</td>

                        {/* Adults */}
                        <td style={{ ...S.td, textAlign: "center" }}>{b.adults}</td>

                        {/* Children */}
                        <td style={{ ...S.td, textAlign: "center" }}>{b.children}</td>

                        {/* Duration */}
                        <td style={S.td}>{b.duration || <span style={S.dash}>—</span>}</td>

                        {/* Trip Date */}
                        <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmtDate(b.tripDate)}</td>

                        {/* Budget */}
                        <td style={{ ...S.td, color: b.budgetRange ? "#15803D" : "#CBD5E1", fontWeight: b.budgetRange ? 600 : 400 }}>{b.budgetRange || "—"}</td>

                        {/* Notes */}
                        <td style={{ ...S.td, maxWidth: 160 }}>
                          {b.notes ? (
                            <span
                              onClick={() => setNotePopup(b.notes)}
                              title="Click to read full note"
                              style={{ cursor: "pointer", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", whiteSpace: "normal", fontSize: 12 }}
                            >
                              {b.notes}
                            </span>
                          ) : <span style={S.dash}>—</span>}
                        </td>

                        {/* Action */}
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => openBrr(l._id)} style={S.viewBtn}>View / Edit</button>
                            {existQ ? (
                              <button onClick={() => setOpenBuilder({ quote: existQ, isNew: false, lead: l })} style={S.pkgViewBtn}>
                                📦 {qDispId(existQ)}
                              </button>
                            ) : (
                              <button onClick={() => setOpenBuilder({ quote: null, isNew: true, lead: l, type: "Domestic", pkgMode: "Complete Package" })} style={S.createBtn}>
                                ⊕ Create Package
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Expand arrow */}
                        <td style={{ ...S.td, textAlign: "center", width: 36 }}>
                          <button
                            title="Show inclusions"
                            onClick={() => setExpandedRow(prev => prev === l._id ? null : l._id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: isExpanded ? "#2563EB" : "#94A3B8", display: "inline-flex", alignItems: "center", transition: "color .15s" }}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>
                              <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </td>
                      </tr>

                      {/* ── Expanded inclusions row ── */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={COLS.length} style={{ padding: 0, borderBottom: "2px solid #BFDBFE", background: "#F5F8FF" }}>
                            <div style={{ borderLeft: "3px solid #3B82F6", margin: "0 16px 0 16px", padding: "10px 16px 12px" }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Travel Inclusions & Details</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>

                                {/* Meal Plan */}
                                <div style={S.chip}>
                                  <div style={S.chipLabel}>Meal Plan</div>
                                  <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: mc.bg, color: mc.color }}>{b.mealPlan}</span>
                                </div>

                                {/* Hotel Category */}
                                <div style={S.chip}>
                                  <div style={S.chipLabel}>Hotel Category</div>
                                  <span style={{ fontSize: 12, color: "#36415A", fontWeight: 500 }}>{b.hotelCategory || "—"}</span>
                                </div>

                                {/* Child Ages */}
                                {(b.childAge1 || b.childAge2) && (
                                  <div style={S.chip}>
                                    <div style={S.chipLabel}>Child Ages</div>
                                    <span style={{ fontSize: 12, color: "#36415A", fontWeight: 500 }}>{ages}</span>
                                  </div>
                                )}

                                {/* Flight */}
                                <div style={S.chip}>
                                  <div style={S.chipLabel}>✈️ Flight</div>
                                  <Yn v={b.flight} />
                                </div>

                                {/* Train */}
                                <div style={S.chip}>
                                  <div style={S.chipLabel}>🚂 Train</div>
                                  <Yn v={b.train} />
                                </div>

                                {/* Transfers */}
                                <div style={S.chip}>
                                  <div style={S.chipLabel}>🚗 Transfers</div>
                                  <Yn v={b.transfers} />
                                </div>

                                {/* Sightseeing */}
                                <div style={S.chip}>
                                  <div style={S.chipLabel}>🎭 Sightseeing</div>
                                  <Yn v={b.sightseeing} />
                                </div>

                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={S.pgBar}>
            <div style={{ fontSize: 13, color: "#6B7A99" }}>
              Showing&nbsp;
              <select style={S.perPageSel} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              &nbsp;of {brrLeads.length} records
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pg === 1}>Prev</PgBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - pg) <= 1)
                .reduce((acc, n, idx, arr) => { if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…"); acc.push(n); return acc; }, [])
                .map((n, idx) => n === "…"
                  ? <span key={`e${idx}`} style={{ padding: "0 4px", color: "#94A3B8", display: "flex", alignItems: "center" }}>…</span>
                  : <PgBtn key={n} active={n === pg} onClick={() => setPage(n)}>{n}</PgBtn>
                )}
              <PgBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={pg === totalPages}>Next</PgBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Note Popup ══ */}
      {notePopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 480, padding: "24px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", position: "relative" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F1B33", marginBottom: 14 }}>📝 Note</div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{notePopup}</p>
            <button onClick={() => setNotePopup(null)} style={{ position: "absolute", top: 14, right: 16, background: "#F3F5FA", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 16, color: "#6B7A99", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✕</button>
          </div>
        </div>
      )}

      {/* ══ BRR Modal ══ */}
      {brrModal && brrLead && (
        <div style={S.overlay}>
          <div style={{ ...S.modal, maxWidth: 700 }}>
            <div style={{ ...S.modalHead, background: "#2563EB" }}>
              <div>
                <h3 style={{ ...S.modalTitle, color: "#fff" }}>Basic Requirement Record</h3>
                <div style={{ fontSize: 12, color: "#BFD3FE", marginTop: 2 }}>{leadIdMap[brrLead._id]} · {brrLead.name} · {brrLead.destination}</div>
              </div>
              <button style={{ ...S.modalX, color: "#fff" }} onClick={() => setBrrModal(null)}>✕</button>
            </div>
            <div style={S.modalBody}>
              <div style={S.brrSection}>
                <div style={S.brrHead}>Requirement</div>
                <div style={S.brrBody}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <Field label="Adults"><input type="number" style={S.inp} value={brrForm.adults} min={1} onChange={e => setBrrForm(f => ({ ...f, adults: e.target.value }))} /></Field>
                    <Field label="Children"><input type="number" style={S.inp} value={brrForm.children} min={0} onChange={e => setBrrForm(f => ({ ...f, children: e.target.value }))} /></Field>
                    <Field label="Duration"><input style={S.inp} placeholder="4 N 5 D" value={brrForm.duration} onChange={e => setBrrForm(f => ({ ...f, duration: e.target.value }))} /></Field>
                    <Field label="Child 1 Age"><input style={S.inp} placeholder="10 years" value={brrForm.childAge1} onChange={e => setBrrForm(f => ({ ...f, childAge1: e.target.value }))} /></Field>
                    <Field label="Child 2 Age"><input style={S.inp} placeholder="5 years" value={brrForm.childAge2} onChange={e => setBrrForm(f => ({ ...f, childAge2: e.target.value }))} /></Field>
                    <Field label="Trip Date"><input type="date" style={S.inp} value={brrForm.tripDate} onChange={e => setBrrForm(f => ({ ...f, tripDate: e.target.value }))} /></Field>
                  </div>
                  <Field label="Meal Plan">
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      {MEAL_OPTIONS.map(m => {
                        const cls = m === "C.P." ? "meal-cp" : m === "M.A.P." ? "meal-map" : "meal-ap";
                        return <div key={m} className={`meal-opt ${cls}${brrForm.mealPlan === m ? " active" : ""}`} onClick={() => setBrrForm(f => ({ ...f, mealPlan: m }))}>{m}</div>;
                      })}
                    </div>
                  </Field>
                </div>
              </div>

              <div style={S.brrSection}>
                <div style={{ ...S.brrHead, background: "#5B6B8C" }}>Travel Inclusions</div>
                <div style={S.brrBody}>
                  {[["flight", "✈️  Flight"], ["train", "🚂  Train"], ["transfers", "🚗  Airport / Station Transfers"], ["sightseeing", "🎭  Attractions / Sightseeing"]].map(([key, label]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFD", border: "1px solid #E4E9F2", borderRadius: 10, padding: "9px 12px", marginBottom: 8, fontWeight: 700, fontSize: 14 }}>
                      <span>{label}</span>
                      <Toggle checked={!!brrForm[key]} onChange={v => setBrrForm(f => ({ ...f, [key]: v }))} />
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
                    <Field label="Hotel Category">
                      <select style={S.inp} value={brrForm.hotelCategory} onChange={e => setBrrForm(f => ({ ...f, hotelCategory: e.target.value }))}>
                        {HOTEL_CATS.map(h => <option key={h}>{h}</option>)}
                      </select>
                    </Field>
                    <Field label="Budget Range">
                      <input style={S.inp} placeholder="₹80,000 to ₹1,00,000" value={brrForm.budgetRange} onChange={e => setBrrForm(f => ({ ...f, budgetRange: e.target.value }))} />
                    </Field>
                  </div>
                </div>
              </div>

              <div style={{ padding: "12px 16px 4px" }}>
                <Field label="Notes">
                  <textarea
                    style={{ ...S.inp, minHeight: 72, resize: "vertical", fontFamily: "inherit" }}
                    placeholder="Any special requirements, preferences or remarks…"
                    value={brrForm.notes || ""}
                    onChange={e => setBrrForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </Field>
              </div>
            </div>
            <div style={S.modalFoot}>
              <button style={S.cancelBtn} onClick={() => setBrrModal(null)}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: savingBrr ? 0.7 : 1 }} onClick={saveBrr} disabled={savingBrr}>{savingBrr ? "Saving…" : "Save BRR"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Quotation Builder Modal ══ */}
      {openBuilder && (
        <QuotationBuilder
          lead={openBuilder.lead}
          leadDisplayId={leadIdMap[openBuilder.lead?._id] || "TWO-L-????"}
          quoteDisplayId={openBuilder.isNew
            ? `TWO-Q-${(leadIdMap[openBuilder.lead?._id]?.split("-")[2]) || "NEW"}`
            : (openBuilder.quote?.quotationNo || `TWO-Q-${(leadIdMap[openBuilder.lead?._id]?.split("-")[2]) || "????"}`)}
          initialData={openBuilder.isNew
            ? { type: openBuilder.type || "Domestic", pkgMode: openBuilder.pkgMode || "Complete Package", travelDate: openBuilder.lead?.travelDate || "", days: openBuilder.lead?.brr?.duration || "" }
            : openBuilder.quote}
          isNew={openBuilder.isNew}
          salespeople={salespeople}
          onClose={() => setOpenBuilder(null)}
          onSaved={handleQuoteSaved}
        />
      )}
    </DashboardLayout>
  );
}

function Field({ label, children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99" }}>{label}</label>{children}</div>;
}

function PgBtn({ children, onClick, disabled, active }) {
  return <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, padding: "0 10px", border: "1px solid", borderColor: active ? "#2563EB" : "#E4E9F2", borderRadius: 6, background: active ? "#2563EB" : "#fff", color: active ? "#fff" : disabled ? "#CBD5E1" : "#36415A", cursor: disabled ? "default" : "pointer", fontSize: 12, fontWeight: active ? 700 : 400, whiteSpace: "nowrap" }}>{children}</button>;
}

/* ── Styles ── */
const S = {
  page:       { padding: "24px 28px 60px", background: "#F1F4FA", minHeight: "100vh" },
  topbar:     { display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  title:      { fontSize: "1.18rem", fontWeight: 800, color: "#0F1B33", margin: "0 0 2px", letterSpacing: "-.02em" },
  banner:     { background: "#fff", border: "1px solid #E8EDF5", borderRadius: 10, padding: "9px 14px", fontSize: 12, color: "#4B5563", marginBottom: 14, lineHeight: 1.55, boxShadow: "0 1px 3px rgba(15,27,51,.04)" },
  panel:      { background: "#fff", border: "none", borderRadius: 16, boxShadow: "0 2px 8px rgba(15,27,51,.05), 0 8px 32px rgba(15,27,51,.09)", overflow: "hidden" },
  searchWrap: { flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 7, background: "#F8FAFD", border: "1.5px solid #E8EDF5", borderRadius: 9, padding: "0 11px", height: 36 },
  searchInput:{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent", color: "#0F1B33" },
  tbl:        { width: "100%", borderCollapse: "collapse", fontSize: ".8rem", minWidth: 900 },
  th:         { position: "sticky", top: 0, background: "#fff", color: "#94A3B8", fontSize: ".63rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", textAlign: "left", padding: "11px 10px", borderBottom: "2px solid #F1F5F9", whiteSpace: "nowrap", zIndex: 2, minWidth: 60 },
  td:         { padding: "9px 10px", borderBottom: "1px solid #F8FAFC", verticalAlign: "middle", color: "#374151", whiteSpace: "nowrap", fontWeight: 400 },
  dash:       { color: "#D1D5DB" },
  emptyCell:  { padding: "52px 0", textAlign: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600 },
  chip:       { background: "#fff", border: "1px solid #E8EDF5", borderRadius: 8, padding: "6px 11px", minWidth: 90 },
  chipLabel:  { fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 },
  viewBtn:    { background: "#EFF4FF", color: "#1D4ED8", border: "1px solid #BFD3FE", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  createBtn:  { background: "#EAF7EF", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  pkgViewBtn: { background: "#EFF4FF", color: "#2563EB", border: "1px solid #BFD3FE", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  overlay:    { position: "fixed", inset: 0, background: "rgba(10,18,38,.55)", backdropFilter: "blur(3px)", zIndex: 90, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "34px 18px" },
  modal:      { background: "#F3F5FA", borderRadius: 18, boxShadow: "0 10px 40px rgba(15,27,51,.18)", width: "100%" },
  modalHead:  { display: "flex", alignItems: "center", gap: 10, padding: "15px 20px", borderRadius: "18px 18px 0 0" },
  modalTitle: { fontSize: "1rem", fontWeight: 800, margin: 0 },
  modalX:     { marginLeft: "auto", background: "rgba(255,255,255,.18)", border: "none", width: 30, height: 30, borderRadius: 8, fontSize: "1rem", fontWeight: 800, cursor: "pointer" },
  modalBody:  { padding: "18px 20px", maxHeight: "72vh", overflowY: "auto" },
  modalFoot:  { display: "flex", gap: 10, justifyContent: "flex-end", padding: "14px 20px", borderTop: "1px solid #E4E9F2", background: "#fff", borderRadius: "0 0 18px 18px" },
  inp:        { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#F8FAFD", fontFamily: "inherit" },
  cancelBtn:  { flex: 1, padding: "10px 0", borderRadius: 50, border: "1px solid #E4E9F2", background: "#fff", color: "#36415A", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  saveBtn:    { flex: 1, padding: "10px 0", borderRadius: 50, border: "none", background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  pgBar:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #E4E9F2", flexWrap: "wrap", gap: 10 },
  perPageSel: { border: "1px solid #E4E9F2", borderRadius: 6, padding: "2px 6px", fontSize: 13, background: "#fff", cursor: "pointer" },
  brrSection: { border: "1px solid #E4E9F2", borderRadius: 12, marginBottom: 14, overflow: "hidden" },
  brrHead:    { background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: ".86rem", padding: "9px 14px" },
  brrBody:    { padding: "14px" },
};
