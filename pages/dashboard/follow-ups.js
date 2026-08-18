import { useState, useEffect, useMemo, useRef } from "react";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";
import { calcQ, inrFmt } from "../../components/backend/QuotationBuilder";

/* ── helpers ── */
const CUR_YEAR  = new Date().getFullYear();
const PER_PAGE  = 20;
const MONTHS    = Array.from({ length: 12 }, (_, i) => ({
  key:   `${CUR_YEAR}-${String(i + 1).padStart(2, "0")}`,
  label: new Date(CUR_YEAR, i, 1).toLocaleDateString("en-IN", { month: "short" }),
}));

function fmtDate(v) {
  if (!v) return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function inr(n)     { return n > 0 ? "₹" + Math.round(n).toLocaleString("en-IN") : "—"; }

/* ── Compact follow-up cell — inline edit on click ── */
function FuCell({ fu, onSave }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const anchorRef = useRef(null); // chip trigger
  const popRef    = useRef(null); // popup (click-outside)
  const hasFu = !!fu?.note;

  function startEdit() {
    setDate(fu?.date || todayISO());
    setNote(fu?.note || "");
    // calculate fixed position from anchor
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({
        top:  rect.bottom + 4,
        left: Math.min(rect.left, window.innerWidth - 270),
      });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function h(e) {
      if (popRef.current && !popRef.current.contains(e.target) &&
          anchorRef.current && !anchorRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  async function save() {
    if (!note.trim()) return;
    await onSave({ date, note: note.trim() });
    setOpen(false);
  }

  return (
    <div>
      {/* chip trigger */}
      <div
        ref={anchorRef}
        onClick={startEdit}
        title={hasFu ? `${fmtDate(fu.date)} — ${fu.note}` : "Add follow-up"}
        style={{
          minWidth: 130, maxWidth: 200, cursor: "pointer",
          padding: "3px 7px", borderRadius: 5,
          background: hasFu ? "#F0FDF4" : "transparent",
          border: hasFu ? "1px solid #BBF7D0" : "1px dashed #D0D7E8",
          fontSize: 11.5, lineHeight: 1.4, color: hasFu ? "#166534" : "#CBD5E1",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "border .1s",
        }}
      >
        {hasFu ? (
          <span>
            <span style={{ fontWeight: 700, color: "#64748B", marginRight: 4 }}>
              {new Date(fu.date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}:
            </span>
            {fu.note}
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 20, fontSize: 14, color: "#D0D7E8" }}>+</span>
        )}
      </div>

      {/* popup — fixed so it's never clipped by overflow/table containers */}
      {open && (
        <div ref={popRef} style={{
          position: "fixed", top: pos.top, left: pos.left, zIndex: 9999,
          background: "#fff", border: "1.5px solid #2563EB",
          borderRadius: 10, padding: 12, width: 260,
          boxShadow: "0 8px 32px rgba(0,0,0,.18)",
          whiteSpace: "normal",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>
            {hasFu ? "Edit Follow-up" : "Add Follow-up"}
          </div>
          {/* Note first, date below — more natural UX */}
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Note..."
            style={{ display: "block", width: "100%", boxSizing: "border-box", marginBottom: 6, padding: "5px 8px", border: "1px solid #E4E9F2", borderRadius: 6, fontSize: 12, resize: "vertical", fontFamily: "inherit", outline: "none", whiteSpace: "pre-wrap", wordBreak: "break-word" }} />
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ display: "block", width: "100%", boxSizing: "border-box", marginBottom: 8, padding: "5px 8px", border: "1px solid #E4E9F2", borderRadius: 6, fontSize: 12, outline: "none" }} />
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button onClick={() => setOpen(false)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E4E9F2", background: "#fff", fontSize: 12, cursor: "pointer" }}>Cancel</button>
            <button onClick={save} disabled={!note.trim()}
              style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: "#2563EB", color: "#fff", fontSize: 12, fontWeight: 700, cursor: note.trim() ? "pointer" : "not-allowed", opacity: note.trim() ? 1 : 0.5 }}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Styles matching quotations page exactly ── */
const S = {
  card:      { background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(15,27,51,.05), 0 8px 32px rgba(15,27,51,.09)", overflow: "hidden" },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: ".8rem" },
  th:        { position: "sticky", top: 0, background: "#fff", padding: "11px 10px", fontSize: ".63rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", color: "#94A3B8", whiteSpace: "nowrap", textAlign: "left", borderBottom: "2px solid #F1F5F9", zIndex: 2 },
  td:        { padding: "9px 10px", borderBottom: "1px solid #F8FAFC", verticalAlign: "middle", whiteSpace: "nowrap", color: "#374151", fontWeight: 400 },
  searchInp: { padding: "8px 14px", border: "1.5px solid #E8EDF5", borderRadius: 9, fontSize: 13, outline: "none", color: "#0F1B33", width: 260, fontFamily: "inherit", background: "#F8FAFD" },
  filterSel: { padding: "7px 10px", border: "1.5px solid #E8EDF5", borderRadius: 8, fontSize: 12, color: "#36415A", fontFamily: "inherit", outline: "none", background: "#F8FAFD" },
  pgBar:     { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #E4E9F2", flexWrap: "wrap", gap: 10 },
};

const STATUS_STYLE = {
  Won:  { background: "#DCFCE7", color: "#15803D" },
  Lost: { background: "#FEE2E2", color: "#BE123C" },
  Open: { background: "#EFF4FF", color: "#2563EB" },
};

export default function FollowUpsPage() {
  const [quotes,  setQuotes]  = useState([]);
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth,  setFilterMonth]  = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/quotations").then(r => r.json()),
      fetch("/api/dashboard/leads").then(r => r.json()),
    ]).then(([q, l]) => {
      setQuotes(Array.isArray(q) ? q : []);
      setLeads(Array.isArray(l) ? l : []);
    }).finally(() => setLoading(false));
  }, []);

  /* quote display IDs */
  const quoteDispMap = useMemo(() => {
    const m = {};
    quotes.forEach((q, i) => {
      const yr = String(new Date(q.createdAt || Date.now()).getFullYear()).slice(-2);
      const mo = String(new Date(q.createdAt || Date.now()).getMonth() + 1).padStart(2, "0");
      m[q._id] = q.displayId || `TWO-Q-${yr}${mo}-${String(i + 1).padStart(3, "0")}`;
    });
    return m;
  }, [quotes]);

  async function patchQuote(quoteId, data) {
    const res = await fetch(`/api/dashboard/quotations/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setQuotes(prev => prev.map(q => q._id === quoteId ? { ...q, ...updated } : q));
    }
  }

  function makeFuSaver(q, idx) {
    return async ({ date, note }) => {
      const fus = [...(q.followups || [])];
      if (idx < fus.length) fus[idx] = { date, note };
      else { while (fus.length < idx) fus.push({ date: todayISO(), note: "" }); fus.push({ date, note }); }
      await patchQuote(q._id, { followups: fus });
    };
  }

  const filtered = useMemo(() => {
    return quotes.filter(q => {
      const lead = typeof q.leadId === "object" ? q.leadId : leads.find(l => l._id === q.leadId) || {};
      const s = search.toLowerCase();
      if (s) {
        const name = (lead.name || "").toLowerCase();
        const dest = (lead.destination || "").toLowerCase();
        const qid  = (quoteDispMap[q._id] || "").toLowerCase();
        const mob  = String(lead.phone || "").replace(/\D/g, "");
        if (!name.includes(s) && !dest.includes(s) && !qid.includes(s) && !mob.includes(search.replace(/\D/g, ""))) return false;
      }
      if (filterStatus && q.status !== filterStatus) return false;
      if (filterMonth) {
        const d = new Date(q.createdAt);
        if (`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}` !== filterMonth) return false;
      }
      return true;
    });
  }, [quotes, leads, search, filterStatus, filterMonth, quoteDispMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function resetPage() { setPage(1); }

  /* sticky col widths */
  const SN_W  = 44;
  const QID_W = 145;
  const NAME_W = 140;
  const MOB_W  = 115;

  const thSticky = (left, w) => ({
    ...S.th, position: "sticky", left, width: w, minWidth: w, zIndex: 3, background: "#fff",
    ...(left === SN_W + QID_W + NAME_W ? { boxShadow: "3px 0 6px rgba(0,0,0,.06)" } : {}),
  });
  const tdSticky = (left, w, bg) => ({
    ...S.td, position: "sticky", left, width: w, zIndex: 1, background: bg,
    ...(left === SN_W + QID_W + NAME_W ? { boxShadow: "3px 0 6px rgba(0,0,0,.06)" } : {}),
  });

  return (
    <DashboardLayout active="Follow-ups">
      <Head><title>Follow-ups · Tourwatchout</title></Head>
      <div style={{ padding: "24px 28px 60px", background: "#F1F4FA", minHeight: "100vh" }}>
      <style>{`
        .fu-wrap::-webkit-scrollbar{height:5px}
        .fu-wrap::-webkit-scrollbar-track{background:#F3F5FA}
        .fu-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}
        .fu-tbl tr:hover td{background:#F7F9FF!important}
      `}</style>

        {/* Banner */}
        <div style={{ background: "#fff", border: "1px solid #E8EDF5", borderRadius: 10, padding: "9px 14px", marginBottom: 14, fontSize: 12, color: "#4B5563", lineHeight: 1.55, boxShadow: "0 1px 3px rgba(15,27,51,.04)" }}>
          <span style={{ color: "#F59E0B", marginRight: 6 }}>⚡</span>
          <span><strong style={{ color: "#374151" }}>Follow-up Tracker</strong> — Click any cell to add or edit follow-up notes. Sticky columns keep customer info visible while scrolling.</span>
        </div>

        {/* Toolbar row: search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <input
            style={S.searchInp}
            placeholder="Search by name, destination, quote ID…"
            value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
          />
        </div>

        {/* Filter bar — single scrollable row, matches quotation page */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, background: "#fff", border: "1px solid #E8EDF5", borderRadius: 10, padding: "10px 14px", overflowX: "auto", boxShadow: "0 1px 3px rgba(15,27,51,.04)" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".05em", flexShrink: 0 }}>Filters:</span>
          {MONTHS.map(m => (
            <button key={m.key} onClick={() => { setFilterMonth(p => p === m.key ? "" : m.key); resetPage(); }}
              style={{ padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${filterMonth === m.key ? "#2563EB" : "#E8EDF5"}`, background: filterMonth === m.key ? "#2563EB" : "#fff", color: filterMonth === m.key ? "#fff" : "#6B7A99", whiteSpace: "nowrap", flexShrink: 0, transition: "all .12s" }}>
              {m.label}
            </button>
          ))}
          <div style={{ width: 1, background: "#E4E9F2", alignSelf: "stretch", flexShrink: 0 }} />
          <select style={{ ...S.filterSel, width: 140, flexShrink: 0 }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); resetPage(); }}>
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
          {(filterMonth || filterStatus || search) && (
            <button onClick={() => { setFilterMonth(""); setFilterStatus(""); setSearch(""); resetPage(); }}
              style={{ background: "#FEE2E2", color: "#BE123C", border: "none", borderRadius: 7, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
              ✕ Clear
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#6B7A99", fontWeight: 600, flexShrink: 0 }}>
            {filtered.length} quotation{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Count chips */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { l: "Total", n: quotes.length,                                  c: "#2563EB", bg: "#EFF4FF" },
            { l: "Open",  n: quotes.filter(q => q.status === "Open").length,  c: "#2563EB", bg: "#EFF4FF" },
            { l: "Won",   n: quotes.filter(q => q.status === "Won").length,   c: "#15803D", bg: "#DCFCE7" },
            { l: "Lost",  n: quotes.filter(q => q.status === "Lost").length,  c: "#BE123C", bg: "#FEE2E2" },
          ].map(({ l, n, c, bg }) => (
            <div key={l} style={{ background: bg, borderRadius: 10, padding: "8px 18px", display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${c}22` }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: c }}>{n}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#94A3B8", fontSize: 14 }}>Loading…</div>
        ) : (
          <div style={S.card}>
            <div className="fu-wrap" style={{ overflowX: "auto" }}>
              <table className="fu-tbl" style={S.table}>
                <thead>
                  <tr>
                    <th style={thSticky(0,          SN_W)}>S.No</th>
                    <th style={thSticky(SN_W,        QID_W)}>Quote ID</th>
                    <th style={thSticky(SN_W+QID_W,  NAME_W)}>Customer</th>
                    <th style={thSticky(SN_W+QID_W+NAME_W, MOB_W)}>Mobile</th>
                    <th style={S.th}>Destination</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Duration</th>
                    <th style={S.th}>Start Date</th>
                    <th style={S.th}>End Date</th>
                    <th style={{ ...S.th, textAlign: "center" }}>Adult</th>
                    <th style={{ ...S.th, textAlign: "center" }}>Child</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Cost</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Margin</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Margin%</th>
                    <th style={{ ...S.th, textAlign: "right" }}>SP</th>
                    {[1,2,3,4,5,6].map(n => <th key={n} style={{ ...S.th, minWidth: 160 }}>Follow-up {n}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {slice.length === 0 && (
                    <tr><td colSpan={21} style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8", fontSize: 14 }}>
                      No quotations found
                    </td></tr>
                  )}
                  {slice.map((q, idx) => {
                    const lead  = typeof q.leadId === "object" ? q.leadId : leads.find(l => l._id === q.leadId) || {};
                    const calc  = calcQ(q);
                    const mpct  = q.cost > 0 ? ((q.margin || 0) / q.cost) * 100 : null;
                    const ss    = STATUS_STYLE[q.status] || STATUS_STYLE.Open;
                    const fus   = q.followups || [];
                    const bg    = (page - 1) * PER_PAGE + idx + 1;
                    const rowBg = bg % 2 === 0 ? "#FAFBFF" : "#fff";

                    /* end date */
                    const endDate = (() => {
                      const start = q.form?.travelDate || q.travelDate;
                      const days  = parseInt(q.form?.days || q.days || "0");
                      if (!start || !days) return "—";
                      try { const d = new Date(start + "T00:00:00"); d.setDate(d.getDate() + days - 1); return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
                      catch { return "—"; }
                    })();

                    return (
                      <tr key={q._id} style={{ background: rowBg }}>
                        {/* Sticky: S.No */}
                        <td style={tdSticky(0, SN_W, rowBg)}>
                          <span style={{ color: "#94A3B8", fontWeight: 600, fontSize: 12 }}>{(page-1)*PER_PAGE + idx + 1}</span>
                        </td>
                        {/* Sticky: Quote ID */}
                        <td style={tdSticky(SN_W, QID_W, rowBg)}>
                          <span style={{ background: "#EFF4FF", color: "#2563EB", border: "none", borderRadius: 7, padding: "3px 8px", fontWeight: 800, fontSize: 11.5 }}>
                            {quoteDispMap[q._id] || "—"}
                          </span>
                          <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{q.type} · {q.pkgMode}</div>
                        </td>
                        {/* Sticky: Customer */}
                        <td style={tdSticky(SN_W+QID_W, NAME_W, rowBg)}>
                          <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 12.5 }}>{lead.name || "—"}</div>
                          {lead.email && <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>{lead.email}</div>}
                        </td>
                        {/* Sticky: Mobile */}
                        <td style={tdSticky(SN_W+QID_W+NAME_W, MOB_W, rowBg)}>
                          <span style={{ fontSize: 12 }}>{lead.phone || "—"}</span>
                        </td>

                        <td style={S.td}>{lead.destination || q.form?.destination || "—"}</td>

                        <td style={S.td}>
                          <span style={{ ...ss, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {q.status || "Open"}
                          </span>
                        </td>

                        <td style={S.td}>{q.form?.days || q.days || "—"}</td>
                        <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmtDate(q.form?.travelDate || q.travelDate)}</td>
                        <td style={{ ...S.td, whiteSpace: "nowrap", color: "#94A3B8" }}>{endDate}</td>
                        <td style={{ ...S.td, textAlign: "center" }}>{q.form?.pax || q.pax || "—"}</td>
                        <td style={{ ...S.td, textAlign: "center" }}>{q.form?.childPax || q.childPax || "—"}</td>
                        <td style={{ ...S.td, textAlign: "right" }}>{inr(q.cost)}</td>
                        <td style={{ ...S.td, textAlign: "right", color: "#15803D", fontWeight: 600 }}>{inr(q.margin)}</td>
                        <td style={{ ...S.td, textAlign: "right" }}>
                          <span style={{ fontWeight: 700, color: mpct === null ? "#94A3B8" : mpct >= 20 ? "#15803D" : mpct >= 10 ? "#D97706" : "#DC2626" }}>
                            {mpct !== null ? mpct.toFixed(1) + "%" : "—"}
                          </span>
                        </td>
                        <td style={{ ...S.td, textAlign: "right", fontWeight: 700, color: "#2563EB" }}>{inrFmt(calc.selling)}</td>

                        {[0,1,2,3,4,5].map(fi => (
                          <td key={fi} style={{ ...S.td, padding: "6px 8px" }}>
                            <FuCell fu={fus[fi]} onSave={makeFuSaver(q, fi)} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={S.pgBar}>
                <span style={{ fontSize: 12, color: "#6B7A99" }}>
                  Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                    style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E4E9F2", background: page === 1 ? "#F8FAFD" : "#fff", cursor: page === 1 ? "default" : "pointer", fontSize: 13, color: page === 1 ? "#CBD5E1" : "#374151" }}>
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i-1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) => p === "..." ? (
                      <span key={`d${i}`} style={{ padding: "0 4px", color: "#94A3B8", fontSize: 13 }}>…</span>
                    ) : (
                      <button key={p} onClick={() => setPage(p)}
                        style={{ padding: "4px 9px", borderRadius: 6, border: p === page ? "none" : "1px solid #E4E9F2", background: p === page ? "#2563EB" : "#fff", color: p === page ? "#fff" : "#374151", fontWeight: p === page ? 700 : 400, fontSize: 13, cursor: "pointer" }}>
                        {p}
                      </button>
                    ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                    style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E4E9F2", background: page === totalPages ? "#F8FAFD" : "#fff", cursor: page === totalPages ? "default" : "pointer", fontSize: 13, color: page === totalPages ? "#CBD5E1" : "#374151" }}>
                    ›
                  </button>
                </div>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>Page {page} of {totalPages}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
