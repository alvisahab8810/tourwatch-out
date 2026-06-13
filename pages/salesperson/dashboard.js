import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdSearch, MdChevronLeft, MdChevronRight, MdPeople,
  MdRefresh, MdAdd, MdWarning, MdDelete, MdFilterAlt, MdLocationOn,
} from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY    = "tw_sp_auth";
const PER_PAGE_OPTS  = [10, 20, 50];
const BUDGET_OPTIONS = ["", "Under ₹30k", "₹30k–50k", "₹50k–1L", "₹1L–2L", "₹2L–5L", "₹5L+", "Custom"];
const BUDGET_PRESETS = new Set(["", "Under ₹30k", "₹30k–50k", "₹50k–1L", "₹1L–2L", "₹2L–5L", "₹5L+"]);
function todayISO() { return new Date().toISOString().slice(0, 10); }

/* Verification */
const VERIFY_OPTIONS = ["New", "Verified", "Not Verified"];
const VERIFY_CODE    = { New: "New", Verified: "VF", "Not Verified": "NV" };
const VERIFY_STYLE   = {
  New:            { bg: "#f1f5f9", color: "#475569" },
  Verified:       { bg: "#dcfce7", color: "#16a34a" },
  "Not Verified": { bg: "#fef9c3", color: "#b45309" },
};

/* Status */
const STATUS_OPTIONS = ["New", "Contacted", "Follow Up", "Not Interested", "No Answer"];
const STATUS_CODE    = { New: "New", Contacted: "CT", "Follow Up": "FU", "Not Interested": "NI", "No Answer": "NA" };
const STATUS_STYLE   = {
  New:              { bg: "#f1f5f9", color: "#475569" },
  Contacted:        { bg: "#fef9c3", color: "#b45309" },
  "Follow Up":      { bg: "#f3e8ff", color: "#7c3aed" },
  "Not Interested": { bg: "#fef2f2", color: "#dc2626" },
  "No Answer":      { bg: "#f0f9ff", color: "#0369a1" },
};

const LEGEND = [
  { code: "New", label: "New",           ...STATUS_STYLE.New },
  { code: "VF",  label: "Verified",      ...VERIFY_STYLE.Verified },
  { code: "CT",  label: "Contacted",     ...STATUS_STYLE.Contacted },
  { code: "FU",  label: "Follow Up",     ...STATUS_STYLE["Follow Up"] },
  { code: "NV",  label: "Not Verified",  ...VERIFY_STYLE["Not Verified"] },
  { code: "NA",  label: "No Answer",     ...STATUS_STYLE["No Answer"] },
  { code: "NI",  label: "Not Interested",...STATUS_STYLE["Not Interested"] },
];

const EMPTY_LEAD = { name: "", phone: "", email: "", destination: "", travelDate: "", pax: "", message: "", budgetBracket: "", source: "" };

/* ── helpers ── */
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTravelDate(val) {
  if (!val) return null;
  try { return new Date(val + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return val; }
}
function daysAgo(date) {
  if (!date) return "";
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  return d === 0 ? "Today" : d === 1 ? "1 day ago" : `${d} days ago`;
}

export default function SPDashboard() {
  const router = useRouter();
  const [spData,     setSpData]     = useState(null);
  const [token,      setToken]      = useState(null);
  const [leads,      setLeads]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  /* filters / pagination */
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVerify, setFilterVerify] = useState("All");
  const [sortDate,     setSortDate]     = useState("newest");
  const [perPage,      setPerPage]      = useState(10);
  const [page,         setPage]         = useState(1);

  /* Add New Lead modal */
  const [showAdd,   setShowAdd]   = useState(false);
  const [addForm,   setAddForm]   = useState(EMPTY_LEAD);
  const [addError,  setAddError]  = useState("");
  const [addSaving, setAddSaving] = useState(false);

  /* Budget custom & contact editing */
  const [customBudgets,     setCustomBudgets]     = useState({});
  const [contactEdit,       setContactEdit]       = useState(null);
  const [modalCustomBudget, setModalCustomBudget] = useState(false);

  /* Delete confirm */
  const [confirmId, setConfirmId] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  /* Tabs */
  const [activeTab,      setActiveTab]      = useState("list");
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  /* Auth guard */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SP_AUTH_KEY);
      if (!raw) return router.replace("/salesperson/login");
      const { token: t, salesperson } = JSON.parse(raw);
      if (!t || !salesperson) return router.replace("/salesperson/login");
      setToken(t);
      setSpData(salesperson);
    } catch { router.replace("/salesperson/login"); }
  }, []);

  useEffect(() => { if (token) fetchLeads(); }, [token]);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/salesperson/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem(SP_AUTH_KEY);
        return router.replace("/salesperson/login");
      }
      if (res.ok) setLeads(await res.json());
    } finally { setLoading(false); }
  }

  async function patchLead(id, update) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/dashboard/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l._id === id ? { ...l, ...updated } : l));
      }
    } finally { setUpdatingId(null); }
  }

  async function toggleContacted(lead) {
    const nowContacted = !lead.contacted;
    await patchLead(lead._id, {
      contacted:   nowContacted,
      contactedAt: nowContacted ? new Date().toISOString() : null,
    });
  }

  async function saveNewLead() {
    setAddError("");
    if (!addForm.name.trim()) return setAddError("Name is required.");
    if (!addForm.phone.trim()) return setAddError("Phone is required.");
    if (!addForm.email.trim()) return setAddError("Email is required.");
    setAddSaving(true);
    try {
      const res = await fetch("/api/dashboard/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addForm, adminCreate: true }),
      });
      const data = await res.json();
      if (!res.ok) return setAddError(data.message || data.error || "Failed to save.");
      /* only show the lead if it gets assigned to this salesperson, or add it anyway */
      setLeads(prev => [data.lead, ...prev]);
      setShowAdd(false);
      setAddForm(EMPTY_LEAD);
    } finally { setAddSaving(false); }
  }

  async function confirmDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await fetch(`/api/dashboard/leads/${confirmId}`, { method: "DELETE" });
      setLeads(prev => prev.filter(l => l._id !== confirmId));
    } finally { setDeleting(false); setConfirmId(null); }
  }

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

  /* filtering */
  let filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchQ = !q || l.name?.toLowerCase().includes(q) || l.phone?.includes(q) || l.email?.toLowerCase().includes(q) || l.destination?.toLowerCase().includes(q);
    const matchSt = filterStatus === "All" || l.status === filterStatus;
    const matchVf = filterVerify === "All" || l.verificationStatus === filterVerify;
    return matchQ && matchSt && matchVf;
  });
  filtered = [...filtered].sort((a, b) => {
    const at = new Date(a.createdAt).getTime(), bt = new Date(b.createdAt).getTime();
    return sortDate === "newest" ? bt - at : at - bt;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage    = Math.min(page, totalPages);
  const slice       = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const confirmLead = leads.find(l => l._id === confirmId);
  const selectedLead = selectedLeadId ? leads.find(l => l._id === selectedLeadId) ?? null : null;

  if (!spData) return null;

  return (
    <SPLayout active="Leads" spData={spData} onLogout={handleLogout}>
      <Head><title>My Leads — Tourwatchout</title></Head>

      <div style={S.page}>
        <style>{`
          .sp-wrap::-webkit-scrollbar{height:5px}
          .sp-wrap::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
          .sp-wrap::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
          .sp-wrap::-webkit-scrollbar-thumb:hover{background:#94a3b8}
          .isel{border:1px solid #e2e8f0;border-radius:6px;padding:3px 7px;font-size:11px;font-weight:700;cursor:pointer;outline:none}
          .isel:focus{border-color:#2563eb}
          .isel:disabled{opacity:.5;cursor:default}
        `}</style>

        {/* ── Header ── */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Lead Listing</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Your assigned leads — update status, verification, and contact info directly from the table</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Live Sync ON
            </div>
            <button style={S.refreshBtn} onClick={fetchLeads} title="Refresh"><MdRefresh size={18} /></button>
            <button style={S.addBtn} onClick={() => { setAddForm(EMPTY_LEAD); setAddError(""); setModalCustomBudget(false); setShowAdd(true); }}>
              <MdAdd size={16} /> Add New Lead
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: 24 }}>
          {[{ key: "list", label: "Lead List" }, { key: "details", label: "Lead Details" }].map(tab => (
            <button key={tab.key}
              onClick={() => { if (tab.key === "details" && !selectedLead) return; setActiveTab(tab.key); }}
              style={{ padding: "10px 22px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.key ? "#EE4C49" : "transparent"}`, marginBottom: -2, cursor: tab.key === "details" && !selectedLead ? "not-allowed" : "pointer", fontWeight: activeTab === tab.key ? 700 : 500, fontSize: 13, color: tab.key === "details" && !selectedLead ? "#cbd5e1" : activeTab === tab.key ? "#EE4C49" : "#64748b", transition: "color 0.15s" }}>
              {tab.label}
              {tab.key === "details" && selectedLead && <span style={{ marginLeft: 6, fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>— {selectedLead.name}</span>}
            </button>
          ))}
        </div>

        {activeTab === "list" && (<>
        {/* ── Stats ── */}
        <div style={S.statsRow}>
          <StatCard label="Total Assigned"  value={leads.length}                                                  color="#2563eb" />
          <StatCard label="Today"           value={leads.filter(l => fmtDate(l.createdAt) === fmtDate(new Date())).length} color="#16a34a" />
          <StatCard label="Contacted"       value={leads.filter(l => l.contacted).length}                         color="#d97706" />
          <StatCard label="Verified"        value={leads.filter(l => l.verificationStatus === "Verified").length} color="#7c3aed" />
        </div>

        {/* ── Toolbar ── */}
        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <MdSearch size={17} color="#94a3b8" style={{ flexShrink: 0 }} />
            <input style={S.searchInput} placeholder="Search by name, phone, email, destination…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div style={S.filterGroup}>
            <MdFilterAlt size={15} color="#64748b" />
            <select style={S.fsel} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="All">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={S.filterGroup}>
            <select style={S.fsel} value={filterVerify} onChange={e => { setFilterVerify(e.target.value); setPage(1); }}>
              <option value="All">All Verification</option>
              {VERIFY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div style={S.filterGroup}>
            <select style={S.fsel} value={sortDate} onChange={e => setSortDate(e.target.value)}>
              <option value="newest">Date Created ↓</option>
              <option value="oldest">Date Created ↑</option>
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={S.tableCard}>
          <div style={S.tableWrap} className="sp-wrap">
            <table style={S.table}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <TH w={44}>SR.</TH>
                  <TH w={140}>Lead Name</TH>
                  <TH w={170}>Contact</TH>
                  <TH w={120}>Budget</TH>
                  <TH w={100}>Date</TH>
                  <TH w={150}>Destination</TH>
                  <TH w={110}>Travel Date</TH>
                  <TH w={50}>Pax</TH>
                  <TH w={180}>Message</TH>
                  <TH w={110}>Contacted</TH>
                  <TH w={110}>Verification</TH>
                  <TH w={130}>Status</TH>
                  <TH w={90}>Source</TH>
                  <TH w={90}>Medium</TH>
                  <TH w={120}>Campaign</TH>
                  <TH w={100}>Adset</TH>
                  <TH w={120}>Ad Content</TH>
                  <TH w={110}>Campaign ID</TH>
                  <TH w={60}>Action</TH>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={19} style={S.empty}>Loading…</td></tr>
                ) : slice.length === 0 ? (
                  <tr>
                    <td colSpan={19} style={S.empty}>
                      <MdPeople size={40} color="#cbd5e1" />
                      <div style={{ marginTop: 8, fontSize: 14, color: "#94a3b8" }}>
                        {search || filterStatus !== "All" || filterVerify !== "All" ? "No leads match your filters" : "No leads assigned yet"}
                      </div>
                    </td>
                  </tr>
                ) : slice.map((l, i) => {
                  const vi = VERIFY_STYLE[l.verificationStatus] || VERIFY_STYLE.New;
                  const si = STATUS_STYLE[l.status] || STATUS_STYLE.New;
                  return (
                    <tr key={l._id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", opacity: updatingId === l._id ? 0.6 : 1, transition: "opacity 0.15s" }}>

                      <TD>{(safePage - 1) * perPage + i + 1}</TD>

                      {/* Lead Name */}
                      <TD>
                        <span style={{ fontWeight: 700, color: "#EE4C49", display: "block", whiteSpace: "nowrap", cursor: "pointer", textDecoration: "underline" }} onClick={() => { setSelectedLeadId(l._id); setActiveTab("details"); }}>{l.name}</span>
                        {l.formType && (
                          <span style={{ fontSize: 10, background: l.formType === "Manual" ? "#f0fdf4" : l.formType === "Query Form" ? "#eff6ff" : "#fdf4ff", color: l.formType === "Manual" ? "#15803d" : l.formType === "Query Form" ? "#1d4ed8" : "#7c3aed", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>
                            {l.formType}
                          </span>
                        )}
                      </TD>

                      {/* Contact */}
                      <TD>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                          {l.phone}
                        </span>
                        <span style={{ fontSize: 11, color: "#64748b", display: "block", marginTop: 2 }}>{l.email}</span>
                      </TD>

                      {/* Budget — editable */}
                      <TD>
                        {(() => {
                          const isCustom = l.budgetBracket && !BUDGET_PRESETS.has(l.budgetBracket);
                          const isEditing = customBudgets[l._id] !== undefined;
                          return isEditing ? (
                            <input className="isel"
                              placeholder="e.g. 5L–10L"
                              value={customBudgets[l._id]}
                              onChange={e => setCustomBudgets(p => ({ ...p, [l._id]: e.target.value }))}
                              onBlur={e => {
                                const raw = e.target.value.trim();
                                const v = raw && !raw.startsWith("₹") ? `₹${raw}` : raw;
                                if (v) { setLeads(prev => prev.map(x => x._id === l._id ? { ...x, budgetBracket: v } : x)); patchLead(l._id, { budgetBracket: v }); }
                                setCustomBudgets(p => { const n = { ...p }; delete n[l._id]; return n; });
                              }}
                              onKeyDown={e => {
                                if (e.key === "Enter") {
                                  const raw = e.target.value.trim();
                                  const v = raw && !raw.startsWith("₹") ? `₹${raw}` : raw;
                                  if (v) { setLeads(prev => prev.map(x => x._id === l._id ? { ...x, budgetBracket: v } : x)); patchLead(l._id, { budgetBracket: v }); }
                                  setCustomBudgets(p => { const n = { ...p }; delete n[l._id]; return n; });
                                }
                                if (e.key === "Escape") setCustomBudgets(p => { const n = { ...p }; delete n[l._id]; return n; });
                              }}
                              autoFocus disabled={updatingId === l._id}
                              style={{ minWidth: 110, background: "#f0fdf4", color: "#15803d", fontWeight: 700 }}
                            />
                          ) : (
                            <>
                              <select className="isel"
                                value={isCustom ? "Custom" : (l.budgetBracket || "")}
                                onChange={e => {
                                  if (e.target.value === "Custom") {
                                    setCustomBudgets(p => ({ ...p, [l._id]: "" }));
                                  } else {
                                    setLeads(prev => prev.map(x => x._id === l._id ? { ...x, budgetBracket: e.target.value } : x));
                                    patchLead(l._id, { budgetBracket: e.target.value });
                                  }
                                }}
                                disabled={updatingId === l._id}
                                style={{ background: l.budgetBracket ? "#f0fdf4" : "#f8fafc", color: l.budgetBracket ? "#15803d" : "#94a3b8", minWidth: 90 }}>
                                {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o || "—"}</option>)}
                              </select>
                              {isCustom && (
                                <span
                                  onClick={() => setCustomBudgets(p => ({ ...p, [l._id]: l.budgetBracket }))}
                                  style={{ display: "block", marginTop: 3, fontSize: 11, fontWeight: 700, color: "#15803d", cursor: "pointer" }}
                                  title="Click to edit">
                                  {l.budgetBracket}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </TD>

                      {/* Date */}
                      <TD>
                        <span style={{ whiteSpace: "nowrap", fontWeight: 500, fontSize: 12 }}>{fmtDate(l.createdAt)}</span>
                        <span style={{ display: "block", fontSize: 10, color: "#94a3b8" }}>{daysAgo(l.createdAt)}</span>
                      </TD>

                      {/* Destination */}
                      <TD>
                        {l.destination
                          ? <span style={{ display: "flex", alignItems: "center", gap: 4, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <MdLocationOn size={13} color="#EE4C49" style={{ flexShrink: 0 }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{l.destination}</span>
                            </span>
                          : <span style={S.dash}>—</span>}
                      </TD>

                      {/* Travel Date */}
                      <TD><span style={{ whiteSpace: "nowrap" }}>{fmtTravelDate(l.travelDate) || <span style={S.dash}>—</span>}</span></TD>

                      {/* Pax */}
                      <TD>{l.pax || <span style={S.dash}>—</span>}</TD>

                      {/* Message */}
                      <TD>
                        <span style={{ display: "inline-block", maxWidth: 170, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={l.message}>
                          {l.message || <span style={S.dash}>—</span>}
                        </span>
                      </TD>

                      {/* Contacted */}
                      <TD>
                        {contactEdit?.id === l._id ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <input type="date" className="isel"
                              value={contactEdit.date}
                              onChange={e => setContactEdit(p => ({ ...p, date: e.target.value }))}
                              onBlur={() => {
                                if (contactEdit.date) patchLead(l._id, { contacted: true, contactedAt: new Date(contactEdit.date + "T12:00:00").toISOString() });
                                setContactEdit(null);
                              }}
                              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setContactEdit(null); }}
                              autoFocus style={{ fontSize: 11, fontWeight: 600, minWidth: 100 }}
                            />
                            <button style={{ fontSize: 10, color: "#ef4444", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
                              onClick={() => { patchLead(l._id, { contacted: false, contactedAt: null }); setContactEdit(null); }}>
                              Clear
                            </button>
                          </div>
                        ) : l.contacted && l.contactedAt ? (
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
                            onClick={() => setContactEdit({ id: l._id, date: new Date(l.contactedAt).toISOString().slice(0, 10) })}
                            disabled={updatingId === l._id} title="Click to edit date">
                            <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#15803d", whiteSpace: "nowrap" }}>
                              ✓ {new Date(l.contactedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                            <span style={{ display: "block", fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>{daysAgo(l.contactedAt)}</span>
                          </button>
                        ) : (
                          <button style={{ background: "none", border: "1px dashed #e2e8f0", borderRadius: 6, cursor: "pointer", padding: "3px 8px", fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}
                            onClick={() => patchLead(l._id, { contacted: true, contactedAt: new Date(todayISO() + "T12:00:00").toISOString() })}
                            disabled={updatingId === l._id}>
                            Mark contacted
                          </button>
                        )}
                      </TD>

                      {/* Verification */}
                      <TD>
                        <select className="isel" value={l.verificationStatus || "New"}
                          onChange={e => {
                            const v = e.target.value;
                            setLeads(prev => prev.map(x => x._id === l._id ? { ...x, verificationStatus: v } : x));
                            patchLead(l._id, { verificationStatus: v });
                          }}
                          style={{ background: vi.bg, color: vi.color, border: `1px solid ${vi.color}40` }}>
                          {VERIFY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </TD>

                      {/* Status */}
                      <TD>
                        <select className="isel" value={l.status || "New"}
                          onChange={e => {
                            const v = e.target.value;
                            setLeads(prev => prev.map(x => x._id === l._id ? { ...x, status: v } : x));
                            patchLead(l._id, { status: v });
                          }}
                          style={{ background: si.bg, color: si.color, border: `1px solid ${si.color}40`, minWidth: 120 }}>
                          {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </TD>

                      {/* UTM fields */}
                      <TD>{l.source   ? <Tag>{l.source}</Tag>                   : <span style={S.dash}>—</span>}</TD>
                      <TD>{l.medium   ? <Tag color="#7c3aed">{l.medium}</Tag>   : <span style={S.dash}>—</span>}</TD>
                      <TD>
                        <span style={{ display: "inline-block", maxWidth: 110, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={l.campaign}>
                          {l.campaign ? <Tag color="#0369a1">{l.campaign}</Tag> : <span style={S.dash}>—</span>}
                        </span>
                      </TD>
                      <TD>
                        <span style={{ display: "inline-block", maxWidth: 90, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={l.adset}>
                          {l.adset || <span style={S.dash}>—</span>}
                        </span>
                      </TD>
                      <TD>
                        <span style={{ display: "inline-block", maxWidth: 110, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={l.adContent}>
                          {l.adContent || <span style={S.dash}>—</span>}
                        </span>
                      </TD>
                      <TD>
                        <span style={{ fontFamily: "monospace", fontSize: 11, display: "inline-block", maxWidth: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={l.campaignId}>
                          {l.campaignId || <span style={S.dash}>—</span>}
                        </span>
                      </TD>

                      <TD>
                        <button style={S.delBtn} title="Delete lead" onClick={() => setConfirmId(l._id)}>
                          <MdDelete size={15} />
                        </button>
                      </TD>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div style={S.paginBar}>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Showing&nbsp;
              <select style={S.perPageSel} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              &nbsp;of {filtered.length} leads
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</PgBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                .reduce((acc, n, idx, arr) => { if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…"); acc.push(n); return acc; }, [])
                .map((n, idx) => n === "…"
                  ? <span key={`e${idx}`} style={{ padding: "0 4px", color: "#94a3b8", display: "flex", alignItems: "center" }}>…</span>
                  : <PgBtn key={n} active={n === safePage} onClick={() => setPage(n)}>{n}</PgBtn>
                )}
              <PgBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</PgBtn>
            </div>
          </div>

          {/* ── Legend ── */}
          <div style={S.legend}>
            {LEGEND.map(item => (
              <div key={item.code} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", background: item.bg, color: item.color }}>{item.code}</span>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        </>)}

        {activeTab === "details" && selectedLead && (() => {
          const l = selectedLead;
          const vi = VERIFY_STYLE[l.verificationStatus] || VERIFY_STYLE.New;
          const si = STATUS_STYLE[l.status] || STATUS_STYLE.New;
          return (
            <div style={{ maxWidth: 860 }}>
              {/* Header */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#EE4C49", flexShrink: 0 }}>{l.name?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{l.name}</span>
                    {l.formType && <span style={{ fontSize: 11, background: "#fdf4ff", color: "#7c3aed", borderRadius: 4, padding: "2px 8px", fontWeight: 700 }}>{l.formType}</span>}
                    <span style={{ fontSize: 11, background: si.bg, color: si.color, borderRadius: 4, padding: "2px 8px", fontWeight: 700, border: `1px solid ${si.color}30` }}>{l.status || "New"}</span>
                    <span style={{ fontSize: 11, background: vi.bg, color: vi.color, borderRadius: 4, padding: "2px 8px", fontWeight: 700, border: `1px solid ${vi.color}30` }}>{l.verificationStatus || "New"}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Lead added {fmtDate(l.createdAt)} · {daysAgo(l.createdAt)}</div>
                </div>
              </div>

              {/* Contact + Trip */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Contact Information</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <DRow label="Phone" value={<strong>{l.phone}</strong>} />
                    <DRow label="Email" value={l.email} />
                    {l.source && <DRow label="Source" value={l.source} />}
                  </div>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Trip Details</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {l.destination && <DRow label="Destination" value={l.destination} />}
                    {l.travelDate && <DRow label="Travel Date" value={fmtTravelDate(l.travelDate)} />}
                    {l.pax && <DRow label="Pax" value={l.pax} />}
                    {l.budgetBracket && <DRow label="Budget" value={<span style={{ color: "#15803d", fontWeight: 700 }}>{l.budgetBracket}</span>} />}
                  </div>
                </div>
              </div>

              {/* Status & Activity */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Status & Activity</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px,1fr))", gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 6 }}>Status</div>
                    <select className="isel" value={l.status || "New"} onChange={e => { const v = e.target.value; setLeads(prev => prev.map(x => x._id === l._id ? { ...x, status: v } : x)); patchLead(l._id, { status: v }); }} style={{ background: si.bg, color: si.color, border: `1px solid ${si.color}40`, minWidth: 130 }}>
                      {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 6 }}>Verification</div>
                    <select className="isel" value={l.verificationStatus || "New"} onChange={e => { const v = e.target.value; setLeads(prev => prev.map(x => x._id === l._id ? { ...x, verificationStatus: v } : x)); patchLead(l._id, { verificationStatus: v }); }} style={{ background: vi.bg, color: vi.color, border: `1px solid ${vi.color}40`, minWidth: 110 }}>
                      {VERIFY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 6 }}>Contacted</div>
                    {contactEdit?.id === l._id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <input type="date" className="isel" value={contactEdit.date} onChange={e => setContactEdit(p => ({ ...p, date: e.target.value }))} onBlur={() => { if (contactEdit.date) patchLead(l._id, { contacted: true, contactedAt: new Date(contactEdit.date + "T12:00:00").toISOString() }); setContactEdit(null); }} onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setContactEdit(null); }} autoFocus style={{ fontSize: 11, fontWeight: 600, minWidth: 120 }} />
                        <button style={{ fontSize: 10, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => { patchLead(l._id, { contacted: false, contactedAt: null }); setContactEdit(null); }}>Clear</button>
                      </div>
                    ) : l.contacted && l.contactedAt ? (
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }} onClick={() => setContactEdit({ id: l._id, date: new Date(l.contactedAt).toISOString().slice(0, 10) })}>
                        <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#15803d" }}>✓ {new Date(l.contactedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        <span style={{ display: "block", fontSize: 11, color: "#94a3b8" }}>{daysAgo(l.contactedAt)}</span>
                      </button>
                    ) : (
                      <button style={{ background: "none", border: "1px dashed #e2e8f0", borderRadius: 6, cursor: "pointer", padding: "3px 10px", fontSize: 11, color: "#94a3b8" }} onClick={() => patchLead(l._id, { contacted: true, contactedAt: new Date(todayISO() + "T12:00:00").toISOString() })}>Mark contacted</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Message */}
              {l.message && (
                <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Message / Notes</div>
                  <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{l.message}</p>
                </div>
              )}

              {/* UTM */}
              {(l.medium || l.campaign || l.adset || l.adContent || l.campaignId) && (
                <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>UTM Tracking</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 14 }}>
                    {[["Medium", l.medium], ["Campaign", l.campaign], ["Adset", l.adset], ["Ad Content", l.adContent], ["Campaign ID", l.campaignId]].filter(([, v]) => v).map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{k}</div>
                        <div style={{ fontSize: 13, color: "#374151", fontWeight: 600, wordBreak: "break-all" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── Add New Lead Modal ── */}
      {showAdd && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget && !addSaving) setShowAdd(false); }}>
          <div style={S.modalCard}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Add New Lead</h2>
              <button style={S.modalClose} onClick={() => !addSaving && setShowAdd(false)}>×</button>
            </div>
            <div style={S.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <Field label="Full Name *">
                  <input style={S.inp} placeholder="e.g. Rajesh Kumar" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                </Field>
                <Field label="Phone Number *">
                  <input style={S.inp} placeholder="+91 98765 43210" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
                </Field>
                <Field label="Email *">
                  <input style={S.inp} placeholder="email@example.com" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
                </Field>
                <Field label="Destination">
                  <input style={S.inp} placeholder="e.g. Kashmir" value={addForm.destination} onChange={e => setAddForm(f => ({ ...f, destination: e.target.value }))} />
                </Field>
                <Field label="Travel Date">
                  <input type="date" style={S.inp} value={addForm.travelDate} onChange={e => setAddForm(f => ({ ...f, travelDate: e.target.value }))} />
                </Field>
                <Field label="No. of Pax">
                  <input style={S.inp} placeholder="e.g. 4" value={addForm.pax} onChange={e => setAddForm(f => ({ ...f, pax: e.target.value }))} />
                </Field>
                <Field label="Budget Bracket">
                  <select style={S.inp}
                    value={modalCustomBudget ? "Custom" : (addForm.budgetBracket || "")}
                    onChange={e => {
                      if (e.target.value === "Custom") { setModalCustomBudget(true); setAddForm(f => ({ ...f, budgetBracket: "" })); }
                      else { setModalCustomBudget(false); setAddForm(f => ({ ...f, budgetBracket: e.target.value })); }
                    }}>
                    {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o || "Select budget…"}</option>)}
                  </select>
                  {modalCustomBudget && (
                    <input style={{ ...S.inp, marginTop: 6 }} placeholder="e.g. 5L–10L" autoFocus
                      value={addForm.budgetBracket}
                      onChange={e => {
                        const raw = e.target.value;
                        const v = raw && !raw.startsWith("₹") ? `₹${raw}` : raw;
                        setAddForm(f => ({ ...f, budgetBracket: v }));
                      }} />
                  )}
                </Field>
                <Field label="Source">
                  <input style={S.inp} placeholder="e.g. Reference, Google" value={addForm.source} onChange={e => setAddForm(f => ({ ...f, source: e.target.value }))} />
                </Field>
              </div>
              <Field label="Message / Notes">
                <textarea style={{ ...S.inp, minHeight: 72, resize: "vertical" }} placeholder="Additional details…" value={addForm.message} onChange={e => setAddForm(f => ({ ...f, message: e.target.value }))} />
              </Field>
              {addError && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#dc2626" }}>
                  {addError}
                </div>
              )}
            </div>
            <div style={S.modalFooter}>
              <button style={S.cancelBtn} onClick={() => !addSaving && setShowAdd(false)} disabled={addSaving}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: addSaving ? 0.7 : 1 }} onClick={saveNewLead} disabled={addSaving}>
                {addSaving ? "Saving…" : "Save Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {confirmId && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget && !deleting) setConfirmId(null); }}>
          <div style={S.confirmCard}>
            <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}><MdWarning size={36} color="#ef4444" /></div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", textAlign: "center" }}>Delete Lead?</h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 26px", textAlign: "center" }}>
              Permanently delete <strong>{confirmLead?.name}</strong> ({confirmLead?.phone}). Cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.cancelBtn} onClick={() => setConfirmId(null)} disabled={deleting}>Cancel</button>
              <button style={S.deleteBtn} onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SPLayout>
  );
}

/* ── atom components ── */
function DRow({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, minWidth: 90, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function TH({ children, w }) {
  return (
    <th style={{ padding: "11px 12px", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap", background: "#f8fafc", textAlign: "left", minWidth: w }}>
      {children}
    </th>
  );
}
function TD({ children }) {
  return <td style={{ padding: "10px 12px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" }}>{children}</td>;
}
function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  );
}
function Tag({ children, color = "#2563eb" }) {
  return <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", background: color + "18", color }}>{children}</span>;
}
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
    </div>
  );
}
function PgBtn({ children, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, padding: "0 10px", border: "1px solid", borderColor: active ? "#2563eb" : "#e2e8f0", borderRadius: 6, background: active ? "#2563eb" : "#fff", color: active ? "#fff" : disabled ? "#cbd5e1" : "#374151", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: active ? 700 : 400, whiteSpace: "nowrap" }}>
      {children}
    </button>
  );
}

const S = {
  page:       { padding: "24px 28px", minHeight: "100vh", background: "#f8fafc", width: "100%", boxSizing: "border-box" },
  header:     { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  title:      { fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" },
  refreshBtn: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" },
  addBtn:     { display: "flex", alignItems: "center", gap: 6, background: "#EE4C49", color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", height: 36, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },

  statsRow:    { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 },

  toolbar:     { display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" },
  searchWrap:  { flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px", height: 40 },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 13, color: "#0f172a", background: "transparent" },
  filterGroup: { display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 12px", height: 40 },
  fsel:        { border: "none", outline: "none", fontSize: 13, color: "#374151", background: "transparent", cursor: "pointer" },

  tableCard:   { background: "#fff", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden" },
  tableWrap:   { overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table:       { width: "100%", borderCollapse: "collapse", minWidth: 1600 },
  empty:       { padding: "60px 0", textAlign: "center", color: "#94a3b8" },
  dash:        { color: "#cbd5e1" },

  paginBar:    { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: 10 },
  perPageSel:  { border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 6px", fontSize: 13, color: "#374151", background: "#fff", cursor: "pointer" },

  legend:      { display: "flex", gap: 20, justifyContent: "center", padding: "14px 16px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap" },

  delBtn:      { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444" },

  overlay:     { position: "fixed", inset: 0, background: "rgba(10,15,30,0.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 },
  modalCard:   { background: "#fff", borderRadius: 18, width: "100%", maxWidth: 620, boxShadow: "0 20px 60px rgba(0,0,0,0.22)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" },
  modalTitle:  { fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 },
  modalClose:  { background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8", lineHeight: 1, padding: 0 },
  modalBody:   { padding: "20px 24px", overflowY: "auto", flex: 1 },
  modalFooter: { display: "flex", gap: 10, padding: "16px 24px", borderTop: "1px solid #f1f5f9" },
  inp:         { border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box", background: "#f8fafc" },
  cancelBtn:   { flex: 1, padding: "11px 0", borderRadius: 50, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  saveBtn:     { flex: 1, padding: "11px 0", borderRadius: 50, border: "none", background: "#EE4C49", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  confirmCard: { background: "#fff", borderRadius: 18, padding: "36px 32px 28px", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.22)" },
  deleteBtn:   { flex: 1, padding: "11px 0", borderRadius: 50, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
};
