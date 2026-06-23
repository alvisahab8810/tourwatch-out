import React, { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { MdSearch, MdPeople, MdAdd, MdDelete, MdWarning, MdRefresh, MdFilterAlt } from "react-icons/md";
import DashboardLayout from "../../components/backend/DashboardLayout";
import { getSalespersonData, isAdmin } from "../../utils/voucherAuth";

/* ── constants ── */
const STATUS_OPTIONS = ["New", "Contacted", "Follow Up", "Not Interested", "No Answer", "Qualified", "Not Qualified"];
const STATUS_STYLE = {
  New:              { bg: "#EEF1F6",  color: "#6B7A99" },
  Contacted:        { bg: "#FdF3E3",  color: "#B45309" },
  "Follow Up":      { bg: "#F3EEFD",  color: "#7C3AED" },
  "Not Interested": { bg: "#FDECEE",  color: "#BE123C" },
  "No Answer":      { bg: "#EFF4FF",  color: "#1D4ED8" },
  Qualified:        { bg: "#EAF7EF",  color: "#15803D" },
  "Not Qualified":  { bg: "#FDECEE",  color: "#BE123C" },
};
const VERIFY_OPTIONS = ["New", "Verified", "Not Verified"];
const BUDGET_OPTIONS = ["", "Under ₹30k", "₹30k–50k", "₹50k–1L", "₹1L–2L", "₹2L–5L", "₹5L+", "Custom"];
const BUDGET_PRESETS = new Set(["", "Under ₹30k", "₹30k–50k", "₹50k–1L", "₹1L–2L", "₹2L–5L", "₹5L+"]);
const HOTEL_CATS = ["Standard", "Deluxe", "Deluxe Family", "Premium", "Premium / Water Villa", "Luxury"];
const MEAL_OPTIONS = ["C.P.", "M.A.P.", "A.P."];
const PER_PAGE_OPTS = [10, 20, 50];
const SCORE_QS = [
  "Has the customer shared a clear budget range for this trip?",
  "Are the travel dates fixed and within the next 90 days?",
  "Is the person you spoke to the decision maker for this trip?",
  "Did the customer respond on call or WhatsApp within 24 hours?",
  "Has the customer shared specific requirements like hotel category, pax or sightseeing?",
];
const EMPTY_BRR = { adults: 2, children: 0, childAge1: "", childAge2: "", duration: "", tripDate: "", mealPlan: "C.P.", flight: false, train: false, transfers: false, sightseeing: false, hotelCategory: "Deluxe", budgetRange: "" };
const EMPTY_LEAD = { name: "", phone: "", email: "", destination: "", travelDate: "", pax: "", message: "", budgetBracket: "", source: "" };

/* ── helpers ── */
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso) { if (!iso) return "—"; return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtTime(iso) { if (!iso) return ""; return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }); }
function fmtTravelDate(v) { if (!v) return "—"; try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return v; } }

function waUrl(phone, name, dest) { const d = String(phone || "").replace(/\D/g, ""); const n = d.length > 10 ? d : `91${d.slice(-10)}`; return `https://wa.me/${n}?text=${encodeURIComponent(`Hi ${name || ""}, this is Tourwatchout regarding your ${dest || ""} enquiry.`)}`; }

/* Display a stored number with a "+91" country code — most leads are saved as
   bare 10-digit numbers, so prefix +91 unless one is already present. */
function fmtPhone(phone) {
  if (!phone) return "—";
  const raw = String(phone).trim();
  if (raw.startsWith("+")) return raw;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return raw;
  return `+91 ${digits.slice(-10)}`;
}

function formTypeBadge(ft) {
  const s = ft === "Manual" ? { bg: "#EAF7EF", color: "#15803D" } : ft === "Query Form" ? { bg: "#EFF4FF", color: "#1D4ED8" } : { bg: "#F3EEFD", color: "#7C3AED" };
  return s;
}

function scoreChipStyle(val) {
  if (val >= 8) return { bg: "#EAF7EF", color: "#15803D" };
  if (val >= 5) return { bg: "#FdF3E3", color: "#B45309" };
  return { bg: "#FDECEE", color: "#BE123C" };
}

/* ── Toggle ── */
function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ position: "relative", width: 40, height: 22, cursor: "pointer", userSelect: "none", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 99, background: checked ? "#2563EB" : "#CBD5E1", transition: ".18s" }} />
      <div style={{ position: "absolute", width: 16, height: 16, background: "#fff", borderRadius: "50%", top: 3, left: checked ? 21 : 3, transition: ".18s", boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
    </div>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [isAdminUser, setIsAdminUser] = useState(true);
  const [spId,        setSpId]        = useState(null);
  const [leads,       setLeads]       = useState([]);
  const [salespeople, setSalespeople] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [perPage,     setPerPage]     = useState(10);
  const [page,        setPage]        = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");

  /* add lead */
  const [showAdd,   setShowAdd]   = useState(false);
  const [addForm,   setAddForm]   = useState(EMPTY_LEAD);
  const [addError,  setAddError]  = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [modalCustomBudget, setModalCustomBudget] = useState(false);

  /* delete */
  const [confirmId, setConfirmId] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  /* inline edits */
  const [updatingId, setUpdatingId] = useState(null);
  const [contactEdit, setContactEdit] = useState(null);
  const [customBudgets, setCustomBudgets] = useState({});

  /* score quiz */
  const [scoreModal,  setScoreModal]  = useState(null);
  const [quizAns,     setQuizAns]     = useState([null, null, null, null, null]);
  const [savingScore, setSavingScore] = useState(false);

  /* BRR */
  const [brrModal,  setBrrModal]  = useState(null);
  const [brrForm,   setBrrForm]   = useState(EMPTY_BRR);
  const [savingBrr, setSavingBrr] = useState(false);

  useEffect(() => {
    const admin = isAdmin();
    setIsAdminUser(admin);
    if (!admin) {
      const sp = getSalespersonData();
      if (sp) setSpId(String(sp._id));
    }
    fetchLeads();
    fetchSalespeople();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try { const r = await fetch("/api/dashboard/leads"); if (r.ok) setLeads(await r.json()); } finally { setLoading(false); }
  }
  async function fetchSalespeople() {
    const r = await fetch("/api/dashboard/salesperson"); if (r.ok) setSalespeople(await r.json());
  }

  async function patchLead(id, update) {
    setUpdatingId(id);
    try {
      const r = await fetch(`/api/dashboard/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(update) });
      if (r.ok) { const u = await r.json(); setLeads(p => p.map(l => l._id === id ? { ...l, ...u } : l)); return u; }
    } finally { setUpdatingId(null); }
  }

  async function logConnect(id, decrement = false) {
    setUpdatingId(id);
    try {
      const body = decrement ? { connectDecrement: true } : { connectIncrement: true };
      const r = await fetch(`/api/dashboard/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (r.ok) { const u = await r.json(); setLeads(p => p.map(l => l._id === id ? { ...l, connects: u.connects } : l)); }
    } finally { setUpdatingId(null); }
  }

  async function confirmDelete() {
    if (!confirmId) return; setDeleting(true);
    try { await fetch(`/api/dashboard/leads/${confirmId}`, { method: "DELETE" }); setLeads(p => p.filter(l => l._id !== confirmId)); } finally { setDeleting(false); setConfirmId(null); }
  }

  async function saveNewLead() {
    setAddError("");
    if (!addForm.name.trim()) return setAddError("Name is required.");
    if (addForm.phone.replace(/\D/g, "").length < 10) return setAddError("Enter a valid phone number.");
    if (!addForm.email.trim()) return setAddError("Email is required.");
    setAddSaving(true);
    try {
      const r = await fetch("/api/dashboard/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...addForm, adminCreate: true }) });
      const data = await r.json();
      if (!r.ok) return setAddError(data.message || data.error || "Failed.");
      setLeads(p => [data.lead, ...p]); setShowAdd(false); setAddForm({ ...EMPTY_LEAD, phone: "+91 " });
    } finally { setAddSaving(false); }
  }

  function openScoreQuiz(leadId) {
    const l = leads.find(x => x._id === leadId);
    setQuizAns(l?.score?.ans?.length === 5 ? [...l.score.ans] : [null, null, null, null, null]);
    setScoreModal(leadId);
  }
  async function saveScore() {
    if (quizAns.some(a => a === null)) return alert("Answer all 5 questions first.");
    const val = quizAns.reduce((s, a) => s + a * 2, 0);
    setSavingScore(true);
    try { await patchLead(scoreModal, { score: { val, ans: quizAns } }); setScoreModal(null); } finally { setSavingScore(false); }
  }

  function openBrr(leadId) {
    const l = leads.find(x => x._id === leadId);
    setBrrForm({ ...EMPTY_BRR, tripDate: l?.travelDate || "", ...(l?.brr || {}) });
    setBrrModal(leadId);
  }
  async function saveBrr() {
    setSavingBrr(true);
    try { await patchLead(brrModal, { brr: { ...brrForm, adults: +brrForm.adults || 1, children: +brrForm.children || 0, collectedOn: todayISO() } }); setBrrModal(null); } finally { setSavingBrr(false); }
  }

  /* lead display ID (TWO-L-XXXX based on createdAt order) */
  const leadIdMap = useMemo(() => {
    const sorted = [...leads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return Object.fromEntries(sorted.map((l, i) => [l._id, `TWO-L-${String(i + 1).padStart(4, "0")}`]));
  }, [leads]);

  /* filter + sort */
  const allSources = ["", ...Array.from(new Set(leads.map(l => l.source).filter(Boolean)))];
  let filtered = leads.filter(l => {
    if (!isAdminUser && spId) {
      const assignedId = String(l.assignedTo?._id || l.assignedTo || "");
      if (assignedId !== spId) return false;
    }
    const q = search.toLowerCase();
    const m = !q || [l.name, l.phone, l.email, l.destination, leadIdMap[l._id]].join(" ").toLowerCase().includes(q);
    return m && (!filterStatus || l.status === filterStatus) && (!filterSource || l.source === filterSource);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pg        = Math.min(page, totalPages);
  const slice     = filtered.slice((pg - 1) * perPage, pg * perPage);
  const scoreLead    = scoreModal ? leads.find(l => l._id === scoreModal) : null;
  const brrLead      = brrModal   ? leads.find(l => l._id === brrModal)   : null;
  const liveScore    = quizAns.every(a => a !== null) ? quizAns.reduce((s, a) => s + a * 2, 0) : null;
  const confirmLead  = leads.find(l => l._id === confirmId);

  return (
    <DashboardLayout active="Leads">
      <Head><title>Leads — Tourwatchout</title></Head>
      <div style={S.page}>
        <style>{`
          .tbl-wrap::-webkit-scrollbar{height:5px}
          .tbl-wrap::-webkit-scrollbar-track{background:#F3F5FA}
          .tbl-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}
          .tbl tr:hover td{background:#F8FAFF}
          .mini-sel{border:1px solid #E4E9F2;border-radius:7px;padding:5px 8px;font-size:.78rem;font-weight:700;cursor:pointer;outline:none;font-family:inherit}
          .mini-sel:disabled{opacity:.5}
          .mini-sel:focus{border-color:#2563EB;box-shadow:0 0 0 3px rgba(37,99,235,.12)}
          .yn-btn{flex:1;border:1.5px solid #E4E9F2;background:#fff;border-radius:9px;padding:7px;font-weight:800;font-size:.82rem;cursor:pointer;color:#6B7A99;transition:all .12s}
          .yn-y.sel{background:#EAF7EF!important;border-color:#16A34A!important;color:#15803D!important}
          .yn-n.sel{background:#FDECEE!important;border-color:#E8364A!important;color:#BE123C!important}
          .meal-opt{flex:1;text-align:center;padding:8px;border-radius:9px;font-weight:800;font-size:.8rem;cursor:pointer;border:2px solid transparent;transition:all .12s}
          .meal-cp{background:#E5EDFF;color:#1D4ED8}.meal-map{background:#FdF3D8;color:#A16207}.meal-ap{background:#FFE9DC;color:#C2410C}
          .meal-opt.active{border-color:currentColor}
        `}</style>

        {/* ── Topbar ── */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.title}>Leads</h1>
            <div style={{ fontSize: 12, color: "#6B7A99", fontWeight: 600 }}>Every enquiry from Meta, Google and organic, in one place</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <button style={S.iconBtn} onClick={fetchLeads} title="Refresh"><MdRefresh size={17} /></button>
            <button style={S.addBtn} onClick={() => { setAddForm({ ...EMPTY_LEAD, phone: "+91 " }); setAddError(""); setModalCustomBudget(false); setShowAdd(true); }}>
              <MdAdd size={16} /> Add Lead
            </button>
          </div>
        </div>

        {/* ══ LEADS TABLE ══ */}
        {(<>

        {/* Automation banner */}
        <div style={S.banner}>
          ⚡ <span><strong>Automations live on this screen:</strong> leads land here straight from website forms, Meta Lead Ads and Google Ads with full UTM data. Duplicate numbers are auto-merged. Marking a lead <strong>Qualified</strong> unlocks the BRR button. Lead score is computed from 5 quick questions.</span>
        </div>

        {/* Table panel */}
        <div style={S.panel}>
          {/* Toolbar */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #E4E9F2", background: "#FBFCFE" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={S.searchWrap}>
                <MdSearch size={15} color="#94A3B8" />
                <input style={S.searchInput} placeholder="Search name, mobile, destination" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <select style={{ ...S.filterSel, width: 140 }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select style={{ ...S.filterSel, width: 130 }} value={filterSource} onChange={e => { setFilterSource(e.target.value); setPage(1); }}>
                <option value="">All sources</option>
                {allSources.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span style={{ marginLeft: "auto", fontSize: 13, color: "#6B7A99", fontWeight: 600, whiteSpace: "nowrap" }}>{filtered.length} leads</span>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }} className="tbl-wrap">
            <table style={S.tbl}>
              <thead>
                <tr style={{ background: "#F6F8FC" }}>
                  {["Lead ID","Name",...(isAdminUser?["Assigned To"]:[]),"Mobile","Email","Destination","Travel Date","Pax","Message","Form Type","Date · Time","Source","Medium","Campaign","Campaign ID","Adset","Ad Content","Connects","Status","BRR","Lead Score",...(isAdminUser?[""]:[])].map((h,i) => (
                    <th key={i} style={{ ...S.th, ...(h === "Message" ? { minWidth: 190 } : h === "Name" ? { minWidth: 130 } : h === "Assigned To" ? { minWidth: 140 } : h === "Email" ? { minWidth: 150 } : h === "Campaign" ? { minWidth: 150 } : h === "Status" ? { minWidth: 130 } : {}) }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={isAdminUser ? 23 : 21} style={S.emptyCell}>Loading…</td></tr>
                ) : slice.length === 0 ? (
                  <tr><td colSpan={isAdminUser ? 23 : 21} style={S.emptyCell}><MdPeople size={38} color="#CBD5E1" /><div style={{ marginTop: 8, fontSize: 13 }}>{isAdminUser ? "No leads match the filters." : "No leads assigned to you yet."}</div></td></tr>
                ) : slice.map(l => {
                  const ss = STATUS_STYLE[l.status] || STATUS_STYLE.New;
                  const ftBadge = formTypeBadge(l.formType);
                  const hasBrr = !!l.brr?.collectedOn;
                  const sc = l.score?.val != null ? scoreChipStyle(l.score.val) : null;
                  const disabled = updatingId === l._id;
                  return (
                    <tr key={l._id} style={{ opacity: disabled ? 0.6 : 1, transition: "opacity .15s" }}>
                      {/* Lead ID */}
                      <td style={S.td}>
                        <span
                          style={{ color: "#2563EB", fontWeight: 700, fontSize: 13, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}
                          title="View lead profile"
                          onClick={() => router.push(`/dashboard/lead-profiles?lead=${l._id}`)}
                        >
                          {leadIdMap[l._id]}
                        </span>
                      </td>

                      {/* Name */}
                      <td style={S.td}>
                        <span style={{ fontWeight: 700, color: "#0F1B33" }}>{l.name}</span>
                      </td>

                      {/* Assigned To — admin only */}
                      {isAdminUser && (
                        <td style={S.td}>
                          <select className="mini-sel" disabled={disabled}
                            value={l.assignedTo?._id || l.assignedTo || ""}
                            onChange={e => { const v = e.target.value; setLeads(p => p.map(x => x._id === l._id ? { ...x, assignedTo: salespeople.find(sp => sp._id === v) || null } : x)); patchLead(l._id, { assignedTo: v || null }); }}
                            style={{ color: l.assignedTo ? "#2563EB" : "#94A3B8", minWidth: 120 }}>
                            <option value="">Unassigned</option>
                            {salespeople.map(sp => <option key={sp._id} value={sp._id}>{sp.name}</option>)}
                          </select>
                        </td>
                      )}

                      {/* Mobile */}
                      <td style={S.td}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                          {fmtPhone(l.phone)}
                          <a href={waUrl(l.phone, l.name, l.destination)} target="_blank" rel="noreferrer" title="WhatsApp" style={{ textDecoration: "none", fontSize: 15, lineHeight: 1 }}>💬</a>
                        </span>
                      </td>

                      {/* Email */}
                      <td style={{ ...S.td, fontSize: 12, color: "#36415A" }}>{l.email}</td>

                      {/* Destination */}
                      <td style={S.td}>{l.destination || <span style={S.dash}>—</span>}</td>

                      {/* Travel Date */}
                      <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmtTravelDate(l.travelDate)}</td>

                      {/* Pax */}
                      <td style={S.td}>{l.pax || <span style={S.dash}>—</span>}</td>

                      {/* Message */}
                      <td style={{ ...S.td, maxWidth: 190, whiteSpace: "normal", fontSize: 12, color: "#36415A" }}>{l.message || <span style={S.dash}>—</span>}</td>

                      {/* Form Type */}
                      <td style={S.td}>
                        <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 99, fontSize: 11, fontWeight: 800, letterSpacing: ".02em", background: ftBadge.bg, color: ftBadge.color }}>
                          {l.formType || "—"}
                        </span>
                      </td>

                      {/* Date · Time */}
                      <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                        <span style={{ display: "block", fontWeight: 600, color: "#36415A" }}>{fmtDate(l.createdAt)}</span>
                        <span style={{ display: "block", fontSize: 11, color: "#94A3B8" }}>{fmtTime(l.createdAt)}</span>
                      </td>

                      {/* Source */}
                      <td style={S.td}>{l.source || <span style={S.dash}>—</span>}</td>

                      {/* Medium */}
                      <td style={S.td}>{l.medium || <span style={S.dash}>—</span>}</td>

                      {/* Campaign */}
                      <td style={{ ...S.td, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }} title={l.campaign}>{l.campaign || <span style={S.dash}>—</span>}</td>

                      {/* Campaign ID */}
                      <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12 }}>{l.campaignId || <span style={S.dash}>—</span>}</td>

                      {/* Adset */}
                      <td style={{ ...S.td, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }} title={l.adset}>{l.adset || <span style={S.dash}>—</span>}</td>

                      {/* Ad Content */}
                      <td style={{ ...S.td, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }} title={l.adContent}>{l.adContent || <span style={S.dash}>—</span>}</td>

                      {/* Connects */}
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button onClick={() => logConnect(l._id, true)} disabled={disabled || !l.connects} title="Decrease"
                            style={{ ...S.iconBtn26, color: "#E8364A", borderColor: "#FECACA", opacity: !l.connects ? 0.35 : 1 }}>−</button>
                          <span style={{ fontWeight: 700, color: "#0F1B33", minWidth: 22, textAlign: "center" }}>{l.connects || 0}</span>
                          <button onClick={() => logConnect(l._id)} disabled={disabled} title="Increase"
                            style={{ ...S.iconBtn26, color: "#15803D", borderColor: "#BBF7D0" }}>+</button>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={S.td}>
                        <select className="mini-sel" value={l.status || "New"} disabled={disabled}
                          onChange={e => { const v = e.target.value; setLeads(p => p.map(x => x._id === l._id ? { ...x, status: v } : x)); patchLead(l._id, { status: v }); }}
                          style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.color}40`, minWidth: 118 }}>
                          {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </td>

                      {/* BRR */}
                      <td style={S.td}>
                        {l.status === "Qualified"
                          ? hasBrr
                            ? <button style={S.brrGreen} onClick={() => openBrr(l._id)}>View BRR</button>
                            : <button style={S.brrBlue}  onClick={() => openBrr(l._id)}>Collect BRR</button>
                          : <span style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 700 }}>N/A</span>}
                      </td>

                      {/* Lead Score */}
                      <td style={S.td}>
                        {sc ? (
                          <button onClick={() => openScoreQuiz(l._id)}
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 34, height: 26, borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: "pointer", border: "none", background: sc.bg, color: sc.color }}>
                            {l.score.val}/10
                          </button>
                        ) : (
                          <button onClick={() => openScoreQuiz(l._id)} style={S.scoreLead}>Score Lead</button>
                        )}
                      </td>

                      {/* Delete — admin only */}
                      {isAdminUser && (
                        <td style={S.td}>
                          <button style={S.delBtn} onClick={() => setConfirmId(l._id)} title="Delete">
                            <MdDelete size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!loading && filtered.length === 0 && <div />}
          </div>

          {/* Pagination */}
          <div style={S.pgBar}>
            <div style={{ fontSize: 13, color: "#6B7A99" }}>
              Showing&nbsp;
              <select style={S.perPageSel} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              &nbsp;of {filtered.length} leads
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
        </>)}

      </div>

      {/* ══ Add Lead Modal ══ */}
      {showAdd && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget && !addSaving) setShowAdd(false); }}>
          <div style={{ ...S.modal, maxWidth: 620 }}>
            <div style={S.modalHead}><h3 style={S.modalTitle}>Add New Lead</h3><button style={S.modalX} onClick={() => !addSaving && setShowAdd(false)}>✕</button></div>
            <div style={S.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <Field label="Full Name *"><input style={S.inp} placeholder="Rajesh Kumar" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} /></Field>
                <Field label="Phone *">
                  <input style={S.inp} placeholder="+91 98765 43210" value={addForm.phone}
                    onChange={e => { const v = e.target.value; setAddForm(f => ({ ...f, phone: v.startsWith("+91") ? v : `+91 ${v.replace(/^\+?91\s*/, "")}` })); }} />
                </Field>
                <Field label="Email *"><input style={S.inp} placeholder="email@example.com" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} /></Field>
                <Field label="Destination"><input style={S.inp} placeholder="Kashmir" value={addForm.destination} onChange={e => setAddForm(f => ({ ...f, destination: e.target.value }))} /></Field>
                <Field label="Travel Date"><input type="date" style={S.inp} value={addForm.travelDate} onChange={e => setAddForm(f => ({ ...f, travelDate: e.target.value }))} /></Field>
                <Field label="Pax"><input style={S.inp} placeholder="2 Adults, 1 Kid" value={addForm.pax} onChange={e => setAddForm(f => ({ ...f, pax: e.target.value }))} /></Field>
                <Field label="Budget">
                  <select style={S.inp} value={modalCustomBudget ? "Custom" : (addForm.budgetBracket || "")} onChange={e => { if (e.target.value === "Custom") { setModalCustomBudget(true); setAddForm(f => ({ ...f, budgetBracket: "" })); } else { setModalCustomBudget(false); setAddForm(f => ({ ...f, budgetBracket: e.target.value })); } }}>
                    {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o || "Select budget…"}</option>)}
                  </select>
                  {modalCustomBudget && <input style={{ ...S.inp, marginTop: 6 }} placeholder="₹5L–10L" autoFocus value={addForm.budgetBracket} onChange={e => { const v = e.target.value; setAddForm(f => ({ ...f, budgetBracket: v.startsWith("₹") ? v : `₹${v}` })); }} />}
                </Field>
                <Field label="Source"><input style={S.inp} placeholder="Reference, Google" value={addForm.source} onChange={e => setAddForm(f => ({ ...f, source: e.target.value }))} /></Field>
              </div>
              <Field label="Message / Notes"><textarea style={{ ...S.inp, minHeight: 68, resize: "vertical" }} placeholder="Additional details…" value={addForm.message} onChange={e => setAddForm(f => ({ ...f, message: e.target.value }))} /></Field>
              {addError && <div style={S.errorBox}>{addError}</div>}
            </div>
            <div style={S.modalFoot}>
              <button style={S.cancelBtn} onClick={() => !addSaving && setShowAdd(false)} disabled={addSaving}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: addSaving ? 0.7 : 1 }} onClick={saveNewLead} disabled={addSaving}>{addSaving ? "Saving…" : "Save Lead"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Score Quiz Modal ══ */}
      {scoreModal && scoreLead && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) setScoreModal(null); }}>
          <div style={{ ...S.modal, maxWidth: 520 }}>
            <div style={{ ...S.modalHead, background: "#2563EB" }}>
              <div><h3 style={{ ...S.modalTitle, color: "#fff" }}>Lead Score · {scoreLead.name}</h3><div style={{ fontSize: 12, color: "#BFD3FE", marginTop: 2 }}>5 quick questions · 2 points per Yes · max 10</div></div>
              <button style={{ ...S.modalX, color: "#fff" }} onClick={() => setScoreModal(null)}>✕</button>
            </div>
            <div style={S.modalBody}>
              <div style={{ background: "#EFF4FF", border: "1px solid #BFD3FE", borderRadius: 10, padding: "9px 12px", marginBottom: 14, fontSize: 13, color: "#1D4ED8", fontWeight: 600 }}>
                🧠 Score 8–10 = <strong>Hot</strong> &nbsp;·&nbsp; 5–7 = Warm &nbsp;·&nbsp; 0–4 = Cold
              </div>
              {SCORE_QS.map((q, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 12, padding: "13px 14px", marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, color: "#0F1B33", fontSize: 14, marginBottom: 9 }}>{i + 1}. {q}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className={`yn-btn yn-y${quizAns[i] === 1 ? " sel" : ""}`} onClick={() => setQuizAns(p => { const n = [...p]; n[i] = 1; return n; })}>Yes</button>
                    <button className={`yn-btn yn-n${quizAns[i] === 0 ? " sel" : ""}`} onClick={() => setQuizAns(p => { const n = [...p]; n[i] = 0; return n; })}>No</button>
                  </div>
                </div>
              ))}
              {liveScore !== null && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 10, padding: "12px 16px", background: liveScore >= 8 ? "#EAF7EF" : liveScore >= 5 ? "#FdF3E3" : "#FDECEE" }}>
                  <span style={{ fontWeight: 700 }}>Live score</span>
                  <b style={{ fontSize: 20, color: liveScore >= 8 ? "#15803D" : liveScore >= 5 ? "#B45309" : "#BE123C" }}>{liveScore}/10</b>
                </div>
              )}
            </div>
            <div style={S.modalFoot}>
              <button style={S.cancelBtn} onClick={() => setScoreModal(null)}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: savingScore ? 0.7 : 1 }} onClick={saveScore} disabled={savingScore}>{savingScore ? "Saving…" : "Save Score"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ BRR Modal ══ */}
      {brrModal && brrLead && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) setBrrModal(null); }}>
          <div style={{ ...S.modal, maxWidth: 700 }}>
            <div style={{ ...S.modalHead, background: "#2563EB" }}>
              <div><h3 style={{ ...S.modalTitle, color: "#fff" }}>Basic Requirement Record</h3><div style={{ fontSize: 12, color: "#BFD3FE", marginTop: 2 }}>{leadIdMap[brrLead._id]} · {brrLead.name} · {brrLead.destination}</div></div>
              <button style={{ ...S.modalX, color: "#fff" }} onClick={() => setBrrModal(null)}>✕</button>
            </div>
            <div style={S.modalBody}>
              {/* Requirement section */}
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
                        return (
                          <div key={m} className={`meal-opt ${cls}${brrForm.mealPlan === m ? " active" : ""}`}
                            onClick={() => setBrrForm(f => ({ ...f, mealPlan: m }))}>
                            {m}
                          </div>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              </div>
              {/* Inclusions section */}
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
                    <Field label="Budget Range"><input style={S.inp} placeholder="₹80,000 to ₹1,00,000" value={brrForm.budgetRange} onChange={e => setBrrForm(f => ({ ...f, budgetRange: e.target.value }))} /></Field>
                  </div>
                </div>
              </div>
            </div>
            <div style={S.modalFoot}>
              <button style={S.cancelBtn} onClick={() => setBrrModal(null)}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: savingBrr ? 0.7 : 1 }} onClick={saveBrr} disabled={savingBrr}>{savingBrr ? "Saving…" : "Save BRR"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Delete Confirm ══ */}
      {confirmId && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget && !deleting) setConfirmId(null); }}>
          <div style={S.confirmCard}>
            <div style={{ textAlign: "center", marginBottom: 12 }}><MdWarning size={36} color="#E8364A" /></div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F1B33", textAlign: "center", marginBottom: 8 }}>Delete Lead?</h3>
            <p style={{ fontSize: 14, color: "#6B7A99", textAlign: "center", marginBottom: 22, lineHeight: 1.6 }}>Permanently delete <strong>{confirmLead?.name}</strong>. Cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.cancelBtn} onClick={() => setConfirmId(null)} disabled={deleting}>Cancel</button>
              <button style={{ ...S.saveBtn, background: "#E8364A", opacity: deleting ? 0.7 : 1 }} onClick={confirmDelete} disabled={deleting}>{deleting ? "Deleting…" : "Yes, Delete"}</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

/* ── Atoms ── */
function Field({ label, children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99" }}>{label}</label>{children}</div>;
}

function PgBtn({ children, onClick, disabled, active }) {
  return <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, padding: "0 10px", border: "1px solid", borderColor: active ? "#2563EB" : "#E4E9F2", borderRadius: 6, background: active ? "#2563EB" : "#fff", color: active ? "#fff" : disabled ? "#CBD5E1" : "#36415A", cursor: disabled ? "default" : "pointer", fontSize: 12, fontWeight: active ? 700 : 400, whiteSpace: "nowrap" }}>{children}</button>;
}

/* ── Styles ── */
const S = {
  page:       { padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" },
  topbar:     { display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" },
  title:      { fontSize: "1.15rem", fontWeight: 800, color: "#0F1B33", margin: "0 0 2px", letterSpacing: "-.01em" },
  iconBtn:    { background: "#fff", border: "1px solid #E4E9F2", borderRadius: 9, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B7A99" },
  iconBtn26:  { width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid #E4E9F2", background: "#fff", borderRadius: 7, color: "#6B7A99", fontWeight: 800, cursor: "pointer" },
  addBtn:     { display: "inline-flex", alignItems: "center", gap: 6, background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, padding: "0 16px", height: 36, fontWeight: 700, fontSize: 14, cursor: "pointer" },
  banner:     { background: "#EFF4FF", border: "1px solid #BFD3FE", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#1D4ED8", marginBottom: 14, lineHeight: 1.55 },
  panel:      { background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, boxShadow: "0 1px 2px rgba(15,27,51,.05),0 4px 14px rgba(15,27,51,.06)", overflow: "hidden" },
  toolbar:    { display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #E4E9F2", background: "#FBFCFE" },
  searchWrap: { flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #E4E9F2", borderRadius: 9, padding: "0 11px", height: 36 },
  searchInput:{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent", color: "#0F1B33" },
  filterSel:  { border: "1px solid #E4E9F2", borderRadius: 9, padding: "7px 10px", fontSize: 13, background: "#fff", color: "#36415A", cursor: "pointer", outline: "none", fontFamily: "inherit" },
  tbl:        { width: "100%", borderCollapse: "collapse", fontSize: ".84rem", minWidth: 1600 },
  th:         { position: "sticky", top: 0, background: "#F6F8FC", color: "#6B7A99", fontSize: ".69rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E4E9F2", whiteSpace: "nowrap", zIndex: 2, minWidth: 80 },
  td:         { padding: "10px 12px", borderBottom: "1px solid #E4E9F2", verticalAlign: "middle", color: "#36415A", whiteSpace: "nowrap" },
  dash:       { color: "#CBD5E1" },
  emptyCell:  { padding: "44px 0", textAlign: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600 },
  brrGreen:   { background: "#EAF7EF", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  brrBlue:    { background: "#EFF4FF", color: "#1D4ED8", border: "1px solid #BFD3FE", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  scoreLead:  { background: "#EFF4FF", color: "#1D4ED8", border: "1px solid #BFD3FE", borderRadius: 7, padding: "4px 9px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  delBtn:     { background: "#FDECEE", border: "1px solid #FECACA", borderRadius: 7, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#E8364A" },
  pgBar:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #E4E9F2", flexWrap: "wrap", gap: 10 },
  perPageSel: { border: "1px solid #E4E9F2", borderRadius: 6, padding: "2px 6px", fontSize: 13, background: "#fff", cursor: "pointer" },
  overlay:    { position: "fixed", inset: 0, background: "rgba(10,18,38,.55)", backdropFilter: "blur(3px)", zIndex: 90, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "34px 18px" },
  modal:      { background: "#F3F5FA", borderRadius: 18, boxShadow: "0 10px 40px rgba(15,27,51,.18)", width: "100%", animation: "none" },
  modalHead:  { display: "flex", alignItems: "center", gap: 10, padding: "15px 20px", background: "#2563EB", borderRadius: "18px 18px 0 0" },
  modalTitle: { fontSize: "1rem", fontWeight: 800, color: "#0F1B33", margin: 0 },
  modalX:     { marginLeft: "auto", background: "rgba(255,255,255,.18)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 8, fontSize: "1rem", fontWeight: 800, cursor: "pointer" },
  modalBody:  { padding: "18px 20px", maxHeight: "72vh", overflowY: "auto" },
  modalFoot:  { display: "flex", gap: 10, justifyContent: "flex-end", padding: "14px 20px", borderTop: "1px solid #E4E9F2", background: "#fff", borderRadius: "0 0 18px 18px", flexWrap: "wrap" },
  inp:        { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#F8FAFD", fontFamily: "inherit", transition: "border .15s" },
  cancelBtn:  { flex: 1, padding: "10px 0", borderRadius: 50, border: "1px solid #E4E9F2", background: "#fff", color: "#36415A", fontSize: 14, fontWeight: 600, cursor: "pointer", minWidth: 80 },
  saveBtn:    { flex: 1, padding: "10px 0", borderRadius: 50, border: "none", background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", minWidth: 80 },
  confirmCard:{ background: "#fff", borderRadius: 18, padding: "32px 28px 24px", width: "100%", maxWidth: 420, boxShadow: "0 10px 40px rgba(15,27,51,.18)" },
  errorBox:   { marginTop: 12, padding: "9px 12px", background: "#FDECEE", border: "1px solid #FECACA", borderRadius: 8, fontSize: 13, color: "#BE123C" },
  brrSection: { border: "1px solid #E4E9F2", borderRadius: 12, marginBottom: 14, overflow: "hidden" },
  brrHead:    { background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: ".86rem", padding: "9px 14px", display: "flex", alignItems: "center", gap: 8 },
  brrBody:    { padding: "14px" },
};
