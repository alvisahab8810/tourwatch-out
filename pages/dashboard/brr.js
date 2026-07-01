import React, { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "../../components/backend/DashboardLayout";
import QuotationBuilder, { calcQ, inrFmt } from "../../components/backend/QuotationBuilder";

/* ── constants ── */
const HOTEL_CATS   = ["Standard", "Deluxe", "Deluxe Family", "Premium", "Premium / Water Villa", "Luxury"];
const MEAL_OPTIONS = ["C.P.", "M.A.P.", "A.P."];
const EMPTY_BRR    = { adults: 2, children: 0, childAge1: "", childAge2: "", duration: "", tripDate: "", mealPlan: "C.P.", flight: false, train: false, transfers: false, sightseeing: false, hotelCategory: "Deluxe", budgetRange: "", notes: "" };

/* ── helpers ── */
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(v) {
  if (!v || v === "N/A") return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}

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
    ? <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 99, background: "#EAF7EF", color: "#15803D" }}>✓</span>
    : <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 99, background: "#EEF1F6", color: "#94A3B8" }}>✕</span>;
}

export default function BrrPage() {
  const router = useRouter();
  const [leads,       setLeads]       = useState([]);
  const [salespeople, setSalespeople] = useState([]);
  const [quotes,      setQuotes]      = useState([]);
  const [loading,     setLoading]     = useState(true);

  /* BRR modal */
  const [brrModal,   setBrrModal]   = useState(null);
  const [brrForm,    setBrrForm]    = useState(EMPTY_BRR);
  const [savingBrr,  setSavingBrr]  = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  /* Quotation builder modal */
  const [openBuilder, setOpenBuilder] = useState(null); // {quote|null, isNew, lead}
  const [notePopup, setNotePopup] = useState(null); // full note text to show in popup

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

  /* quote display ID */
  function qDispId(q) {
    return q.quotationNo || `TWO-Q-${(leadIdMap[q.leadId?._id || q.leadId]?.split("-")[2]) || "????"}`;
  }

  /* map leadId → existing quote */
  const quoteByLead = useMemo(() => {
    const m = {};
    quotes.forEach(q => { const lid = q.leadId?._id || q.leadId; if (lid) m[lid] = q; });
    return m;
  }, [quotes]);

  /* only leads with BRR collected */
  const brrLeads = leads.filter(l => !!l.brr?.collectedOn);

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
  const mealColor = { "C.P.": { bg: "#E5EDFF", color: "#1D4ED8" }, "M.A.P.": { bg: "#FdF3D8", color: "#A16207" }, "A.P.": { bg: "#FFE9DC", color: "#C2410C" } };

  return (
    <DashboardLayout active="BRR">
      <Head><title>BRR — Tourwatchout</title></Head>
      <div style={S.page}>
        <style>{`
          .tbl-wrap::-webkit-scrollbar{height:5px}
          .tbl-wrap::-webkit-scrollbar-track{background:#F3F5FA}
          .tbl-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}
          .tbl tr:hover td{background:#F8FAFF}
          .meal-opt{flex:1;text-align:center;padding:8px;border-radius:9px;font-weight:800;font-size:.8rem;cursor:pointer;border:2px solid transparent;transition:all .12s}
          .meal-cp{background:#E5EDFF;color:#1D4ED8}.meal-map{background:#FdF3D8;color:#A16207}.meal-ap{background:#FFE9DC;color:#C2410C}
          .meal-opt.active{border-color:currentColor}
        `}</style>

        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <h1 style={S.title}>Basic Requirement Records</h1>
          <div style={{ fontSize: 12, color: "#6B7A99", fontWeight: 600 }}>Captured requirements, ready to convert into packages</div>
        </div>

        {/* Banner */}
        <div style={S.banner}>
          ⚡ <span><strong>One click ahead:</strong> every BRR carries the Lead ID with it. <strong>Create Package</strong> will open the quotation builder pre-filled with these requirements, and the Quotation ID will be auto-chained to the Lead ID.</span>
        </div>

        {/* Panel */}
        <div style={S.panel}>
          <div style={S.toolbar}>
            <span style={{ fontSize: 13, color: "#6B7A99", fontWeight: 600 }}>{brrLeads.length} requirement records</span>
          </div>

          <div style={{ overflowX: "auto" }} className="tbl-wrap">
            <table style={S.tbl} className="tbl">
              <thead>
                <tr style={{ background: "#F6F8FC" }}>
                  {["Lead ID", "Name", "Destination", "Adults", "Children", "Child Ages", "Duration", "Trip Date", "Meal", "Flight", "Train", "Transfers", "Sightseeing", "Hotel Category", "Budget", "Collected On", "Notes", "Action"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={18} style={S.emptyCell}>Loading…</td></tr>
                ) : brrLeads.length === 0 ? (
                  <tr><td colSpan={18} style={S.emptyCell}>No BRR collected yet. Qualify a lead and collect their requirements.</td></tr>
                ) : brrLeads.map(l => {
                  const b       = l.brr;
                  const mc      = mealColor[b.mealPlan] || mealColor["C.P."];
                  const ages    = [b.childAge1, b.childAge2].filter(Boolean).join(", ") || "—";
                  const existQ  = quoteByLead[l._id];
                  return (
                    <tr key={l._id} style={{ opacity: updatingId === l._id ? 0.6 : 1, transition: "opacity .15s" }}>
                      <td style={S.td}>
                        <span
                          style={{ color: "#2563EB", fontWeight: 700, fontSize: 13, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}
                          title="View lead profile"
                          onClick={() => router.push(`/dashboard/lead-profiles?lead=${l._id}`)}
                        >
                          {leadIdMap[l._id]}
                        </span>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontWeight: 700, color: "#0F1B33", display: "block" }}>{l.name}</span>
                        <span style={{ fontSize: 11, color: "#94A3B8" }}>{l.phone}</span>
                      </td>
                      <td style={S.td}>{l.destination || "—"}</td>
                      <td style={{ ...S.td, textAlign: "center", fontWeight: 700 }}>{b.adults}</td>
                      <td style={{ ...S.td, textAlign: "center", fontWeight: 700 }}>{b.children}</td>
                      <td style={S.td}>{ages}</td>
                      <td style={S.td}>{b.duration || "—"}</td>
                      <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmtDate(b.tripDate)}</td>
                      <td style={S.td}>
                        <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 99, fontSize: 11, fontWeight: 800, background: mc.bg, color: mc.color }}>
                          {b.mealPlan}
                        </span>
                      </td>
                      <td style={{ ...S.td, textAlign: "center" }}><Yn v={b.flight} /></td>
                      <td style={{ ...S.td, textAlign: "center" }}><Yn v={b.train} /></td>
                      <td style={{ ...S.td, textAlign: "center" }}><Yn v={b.transfers} /></td>
                      <td style={{ ...S.td, textAlign: "center" }}><Yn v={b.sightseeing} /></td>
                      <td style={S.td}>{b.hotelCategory}</td>
                      <td style={{ ...S.td, fontWeight: 600, color: "#15803D" }}>{b.budgetRange || "—"}</td>
                      <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmtDate(b.collectedOn)}</td>
                      <td style={{ ...S.td, maxWidth: 180, color: "#374151" }}>
                        {b.notes ? (
                          <span
                            onClick={() => setNotePopup(b.notes)}
                            title="Click to read full note"
                            style={{ fontSize: 12, cursor: "pointer", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textDecoration: "underline dotted #94A3B8" }}
                          >
                            {b.notes}
                          </span>
                        ) : "—"}
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                          <button onClick={() => openBrr(l._id)} style={S.viewBtn}>View / Edit</button>
                          {existQ ? (
                            <button onClick={() => setOpenBuilder({ quote: existQ, isNew: false, lead: l })} style={S.pkgViewBtn}>
                              📦 {qDispId(existQ)} · {inrFmt(calcQ(existQ).selling)}
                            </button>
                          ) : (
                            <button onClick={() => setOpenBuilder({ quote: null, isNew: true, lead: l, type: "Domestic", pkgMode: "Complete Package" })} style={S.createBtn}>
                              ⊕ Create Package
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ Note Popup ══ */}
      {notePopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 480, padding: "24px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", position: "relative" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>📝 Note</div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{notePopup}</p>
            <button onClick={() => setNotePopup(null)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B7A99" }}>✕</button>
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
              {/* Notes */}
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

const S = {
  page:       { padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" },
  title:      { fontSize: "1.15rem", fontWeight: 800, color: "#0F1B33", margin: "0 0 2px", letterSpacing: "-.01em" },
  banner:     { background: "#EFF4FF", border: "1px solid #BFD3FE", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#1D4ED8", marginBottom: 14, lineHeight: 1.55 },
  panel:      { background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, boxShadow: "0 1px 2px rgba(15,27,51,.05),0 4px 14px rgba(15,27,51,.06)", overflow: "hidden" },
  toolbar:    { display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #E4E9F2", background: "#FBFCFE" },
  tbl:        { width: "100%", borderCollapse: "collapse", fontSize: ".84rem", minWidth: 1800 },
  th:         { position: "sticky", top: 0, background: "#F6F8FC", color: "#6B7A99", fontSize: ".69rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E4E9F2", whiteSpace: "nowrap", zIndex: 2, minWidth: 80 },
  td:         { padding: "10px 12px", borderBottom: "1px solid #E4E9F2", verticalAlign: "middle", color: "#36415A", whiteSpace: "nowrap" },
  emptyCell:  { padding: "44px", textAlign: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600 },
  viewBtn:    { background: "#EFF4FF", color: "#1D4ED8", border: "1px solid #BFD3FE", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  createBtn:  { background: "#EAF7EF", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  pkgViewBtn: { background: "#EFF4FF", color: "#2563EB", border: "1px solid #BFD3FE", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  overlay:    { position: "fixed", inset: 0, background: "rgba(10,18,38,.55)", backdropFilter: "blur(3px)", zIndex: 90, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "34px 18px" },
  modal:      { background: "#F3F5FA", borderRadius: 18, boxShadow: "0 10px 40px rgba(15,27,51,.18)", width: "100%" },
  modalHead:  { display: "flex", alignItems: "center", gap: 10, padding: "15px 20px", background: "#E8364A", borderRadius: "18px 18px 0 0" },
  modalTitle: { fontSize: "1rem", fontWeight: 800, margin: 0 },
  modalX:     { marginLeft: "auto", background: "rgba(255,255,255,.18)", border: "none", width: 30, height: 30, borderRadius: 8, fontSize: "1rem", fontWeight: 800, cursor: "pointer" },
  modalBody:  { padding: "18px 20px", maxHeight: "72vh", overflowY: "auto" },
  modalFoot:  { display: "flex", gap: 10, justifyContent: "flex-end", padding: "14px 20px", borderTop: "1px solid #E4E9F2", background: "#fff", borderRadius: "0 0 18px 18px" },
  inp:        { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#F8FAFD", fontFamily: "inherit" },
  cancelBtn:  { flex: 1, padding: "10px 0", borderRadius: 50, border: "1px solid #E4E9F2", background: "#fff", color: "#36415A", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  saveBtn:    { flex: 1, padding: "10px 0", borderRadius: 50, border: "none", background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  brrSection: { border: "1px solid #E4E9F2", borderRadius: 12, marginBottom: 14, overflow: "hidden" },
  brrHead:    { background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: ".86rem", padding: "9px 14px" },
  brrBody:    { padding: "14px" },
  lbl:        { display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99", marginBottom: 8 },
};
