import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";
import QuotationBuilder, { calcQ, gradeColor, inrFmt } from "../../components/backend/QuotationBuilder";
import InvoiceBuilder from "../../components/backend/InvoiceBuilder";
const QuotationPreview = dynamic(() => import("../../components/voucher/QuotationPreview"), { ssr: false });

/* ── helpers ── */
const MONTH_OPTS = (() => {
  const y = new Date().getFullYear();
  const opts = [];
  for (let yr = y; yr >= y - 1; yr--)
    for (let m = 12; m >= 1; m--)
      opts.push({ key: `${yr}-${String(m).padStart(2, "0")}`, label: new Date(yr, m - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) });
  return opts;
})();
function qMonthKey(q) {
  try { const d = new Date(q.createdAt); return isNaN(d) ? "" : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; } catch { return ""; }
}

function fmtDate(v) {
  if (!v) return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function reverseCalc(sp, q) {
  const selling = +sp;
  if (!selling || !q.cost) return null;
  const g = (q.gstPct || 5) / 100;
  const t = q.type === "International" ? (q.tcsPct || 0) / 100 : 0;
  const base = selling / ((1 + g) * (1 + t));
  const m = base - q.cost;
  return q.cost > 0 ? (m / q.cost) * 100 : 0;
}
function mpctBadge(mpct) {
  if (mpct === null || mpct === undefined) return null;
  const { g, c } = gradeColor(mpct);
  return { g, c, bg: c + "18" };
}
function statusStyle(s) {
  if (s === "Won")  return { background: "#DCFCE7", color: "#15803D" };
  if (s === "Lost") return { background: "#FEE2E2", color: "#BE123C" };
  return { background: "#EFF4FF", color: "#2563EB" };
}

export default function QuotationsPage() {
  const [quotes, setQuotes]           = useState([]);
  const [leads, setLeads]             = useState([]);
  const [salespeople, setSalespeople] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromMonth,    setFromMonth]    = useState("");
  const [toMonth,      setToMonth]      = useState("");

  const [newStep, setNewStep]         = useState(null); // {leadId, type, pkgMode}
  const [openBuilder, setOpenBuilder] = useState(null); // {quote|null, isNew, lead}
  const [invoices,    setInvoices]    = useState([]);
  const [invBuilder,  setInvBuilder]  = useState(null); // { prefill, invoiceData, isNew }

  const [fuModal, setFuModal] = useState(null);
  const [fuNote, setFuNote]   = useState("");
  const [fuDate, setFuDate]   = useState(todayISO());

  const [remModal,   setRemModal]   = useState(null);
  const [remNote,    setRemNote]    = useState("");
  const [remDate,    setRemDate]    = useState(todayISO());
  const [remType,    setRemType]    = useState("Follow-up Call");
  const [allReminders, setAllReminders] = useState([]);
  const [remSaving,  setRemSaving]  = useState(false);

  const [verModal, setVerModal]   = useState(null);
  const [pdfPreviewData, setPdfPreviewData] = useState(null);
  const [pdfLoading,     setPdfLoading]     = useState(false);
  const [lostInput, setLostInput] = useState({});
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting,   setDeleting]   = useState(null);
  const [newSP, setNewSP]         = useState({});
  const [expEdit, setExpEdit]     = useState({});
  const [fuOpen, setFuOpen]       = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/quotations").then(r => r.json()),
      fetch("/api/dashboard/leads").then(r => r.json()),
      fetch("/api/dashboard/salesperson").then(r => r.json()),
      fetch("/api/dashboard/invoices").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/reminders").then(r => r.json()).catch(() => []),
    ]).then(([q, l, sp, inv, rems]) => {
      const qs = Array.isArray(q) ? q : [];
      setQuotes(qs);
      setLeads(Array.isArray(l) ? l : []);
      setSalespeople(Array.isArray(sp) ? sp : []);
      setInvoices(Array.isArray(inv) ? inv : []);
      setAllReminders(Array.isArray(rems) ? rems : []);
      // Restore saved New Selling Prices
      const init = {};
      qs.forEach(x => { if (x.newSellingPrice) init[x._id] = x.newSellingPrice; });
      setNewSP(init);
    }).finally(() => setLoading(false));
  }, []);

  const leadIdMap = useMemo(() => {
    const sorted = [...leads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return Object.fromEntries(sorted.map((l, i) => [l._id, `TWO-L-${String(i + 1).padStart(4, "0")}`]));
  }, [leads]);

  /* quotationId (MongoDB _id string) → existing invoice */
  const invByQuote = useMemo(() => {
    const m = {};
    invoices.forEach(inv => { if (inv.quotationId) m[inv.quotationId] = inv; });
    return m;
  }, [invoices]);

  function openInvoice(q) {
    const lead       = leads.find(l => l._id === (q.leadId?._id || q.leadId));
    const existingInv = invByQuote[q._id];
    const lDispId    = leadIdMap[lead?._id] || "";
    const qDispId_   = q.quotationNo || `TWO-Q-${(lDispId?.split("-")[2]) || "????"}`;

    if (existingInv) {
      setInvBuilder({ invoiceData: existingInv, isNew: false, prefill: { lead, quotation: q, leadDisplayId: lDispId, quotationDisplayId: qDispId_ } });
    } else {
      setInvBuilder({ invoiceData: null, isNew: true, prefill: { lead, quotation: q, leadDisplayId: lDispId, quotationDisplayId: qDispId_ } });
    }
  }

  function qDispId(q) {
    return q.quotationNo || `TWO-Q-${(leadIdMap[q.leadId?._id || q.leadId]?.split("-")[2]) || "????"}`;
  }

  function patchQuote(id, body) {
    return fetch(`/api/dashboard/quotations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(r => r.json())
      .then(updated => setQuotes(prev => prev.map(q => q._id === id ? updated : q)));
  }

  function handleSaved(saved) {
    setQuotes(prev => {
      const idx = prev.findIndex(q => q._id === saved._id);
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
      return [saved, ...prev];
    });
  }

  async function addFollowup(q) {
    if (!fuNote.trim()) return;
    await patchQuote(q._id, { followups: [...(q.followups || []), { date: fuDate, note: fuNote.trim() }] });
    setFuModal(null); setFuNote(""); setFuDate(todayISO());
  }

  async function addReminder(q) {
    if (!remNote.trim()) return;
    setRemSaving(true);
    try {
      const r = await fetch("/api/dashboard/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationId:   q._id,
          leadId:        q.leadId?._id || q.leadId || undefined,
          salespersonId: q.assignedTo?._id || q.assignedTo || undefined,
          dueDate:       remDate,
          type:          remType,
          note:          remNote.trim(),
        }),
      });
      if (r.ok) {
        const created = await r.json();
        setAllReminders(prev => [created, ...prev]);
        setRemNote(""); setRemDate(todayISO());
      }
    } finally { setRemSaving(false); }
  }

  async function markReminderDone(remId) {
    const r = await fetch(`/api/dashboard/reminders/${remId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Done" }),
    });
    if (r.ok) {
      const updated = await r.json();
      setAllReminders(prev => prev.map(x => x._id === remId ? updated : x));
    }
  }

  async function undoReminderDone(remId) {
    const r = await fetch(`/api/dashboard/reminders/${remId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Upcoming" }),
    });
    if (r.ok) {
      const updated = await r.json();
      setAllReminders(prev => prev.map(x => x._id === remId ? updated : x));
    }
  }

  async function saveNewSP(q) {
    const raw = newSP[q._id];
    const v = +raw;
    if (!raw || isNaN(v) || v <= 0) return;
    await patchQuote(q._id, { newSellingPrice: v });
  }

  async function saveExpense(q) {
    const v = +expEdit[q._id]; if (isNaN(v)) return;
    await patchQuote(q._id, { tripExpense: v });
    setExpEdit(p => { const n = { ...p }; delete n[q._id]; return n; });
  }

  function openPdfPreview(q, v) {
    const lead = q.leadId || {};
    const selling = (v?.cost || 0) + (v?.margin || 0);
    setPdfPreviewData({
      quoteId:   qDispId(q),
      lead,
      form:      { ...q, cost: v?.cost ?? q.cost, margin: v?.margin ?? q.margin },
      hotels:    q.hotels    || [],
      flights:   q.flights   || [],
      transfers: q.transfers || [],
      itin:      q.itinerary || [],
      selling:   selling || calcQ(q).selling,
    });
  }

  async function downloadPreviewPDF() {
    setPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const el = document.getElementById("qpv-pdf-target");
      if (!el) return;
      const patch = doc => { const st = doc.createElement("style"); st.textContent = "* { font-family: Arial, Helvetica, sans-serif !important; }"; doc.head.appendChild(st); };
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff", logging: false, height: el.scrollHeight, windowHeight: el.scrollHeight, onclone: patch });
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
      const pxPerMm = canvas.width / pageW, pagePx = pageH * pxPerMm;
      let yPx = 0, first = true;
      while (yPx < canvas.height) {
        const slice = document.createElement("canvas");
        slice.width = canvas.width; slice.height = Math.min(pagePx, canvas.height - yPx);
        slice.getContext("2d").drawImage(canvas, 0, yPx, canvas.width, slice.height, 0, 0, canvas.width, slice.height);
        if (!first) pdf.addPage();
        pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pageW, (slice.height / pxPerMm));
        yPx += pagePx; first = false;
      }
      pdf.save(`quote-${pdfPreviewData?.quoteId || "tw"}.pdf`);
    } finally { setPdfLoading(false); }
  }

  async function deleteQuote(id) {
    setDeleting(id);
    try {
      await fetch(`/api/dashboard/quotations/${id}`, { method: "DELETE" });
      setQuotes(prev => prev.filter(q => q._id !== id));
      setConfirmDel(null);
    } finally { setDeleting(null); }
  }

  async function changeStatus(q, s) {
    if (s === "Lost") setLostInput(p => ({ ...p, [q._id]: q.lostReason || "" }));
    await patchQuote(q._id, { status: s });
  }

  async function saveLostReason(q) {
    await patchQuote(q._id, { lostReason: lostInput[q._id] || "" });
    setLostInput(p => { const n = { ...p }; delete n[q._id]; return n; });
  }

  const remsByQuote = useMemo(() => {
    const m = {};
    allReminders.forEach(r => {
      const qid = r.quotationId?._id || String(r.quotationId || "");
      if (qid) { if (!m[qid]) m[qid] = []; m[qid].push(r); }
    });
    return m;
  }, [allReminders]);

  const qualifiedLeads = useMemo(() => leads.filter(l => l.status === "Qualified"), [leads]);

  const filtered = useMemo(() => {
    return quotes.filter(q => {
      const lead = q.leadId || {};
      if (filterStatus && q.status !== filterStatus) return false;
      const mk = qMonthKey(q);
      if (fromMonth && mk && mk < fromMonth) return false;
      if (toMonth   && mk && mk > toMonth)   return false;
      if (search) {
        const s = search.toLowerCase();
        if (![lead.name || "", lead.destination || "", qDispId(q)].join(" ").toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [quotes, search, filterStatus, fromMonth, toMonth, leadIdMap]);

  async function startNewQuote() {
    if (!newStep?.leadId) return;
    const lead = leads.find(l => l._id === newStep.leadId);
    if (!lead) return;
    setOpenBuilder({ quote: null, isNew: true, lead, type: newStep.type, pkgMode: newStep.pkgMode });
    setNewStep(null);
  }

  if (loading) return (
    <DashboardLayout active="Quotation">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#6B7A99", fontSize: 15 }}>Loading quotations…</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout active="Quotation">
      <Head><title>Quotations — Tourwatchout</title></Head>
      <div style={{ padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" }}>
      {/* Banner */}
      <div style={{ background: "#EFF4FF", border: "1px solid #BFD3FE", borderRadius: 10, padding: "9px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#1D4ED8", fontWeight: 600 }}>
        ⚡ Quotation Manager — Build, price, and send packages. Company-side costs are never shown on customer PDFs.
      </div>

      {/* Toolbar */}
      {/* Toolbar row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <input style={S.searchInp} placeholder="Search by name, destination, quote ID…" value={search} onChange={e => setSearch(e.target.value)} />
        <button style={{ ...S.newBtn, marginLeft: "auto", whiteSpace: "nowrap" }} onClick={() => setNewStep({ leadId: qualifiedLeads[0]?._id || "", type: "Domestic", pkgMode: "Complete Package" })}>
          ＋ New Quotation
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, background: "#fff", border: "1px solid #E4E9F2", borderRadius: 10, padding: "10px 14px", overflowX: "auto" }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".05em", flexShrink: 0 }}>Filters:</span>
        <select style={{ ...S.filterSel, width: 150, flexShrink: 0 }} value={fromMonth} onChange={e => setFromMonth(e.target.value)}>
          <option value="">From Month</option>
          {MONTH_OPTS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
        <select style={{ ...S.filterSel, width: 150, flexShrink: 0 }} value={toMonth} onChange={e => setToMonth(e.target.value)}>
          <option value="">To Month</option>
          {MONTH_OPTS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
        <select style={{ ...S.filterSel, width: 140, flexShrink: 0 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        {(fromMonth || toMonth || filterStatus) && (
          <button onClick={() => { setFromMonth(""); setToMonth(""); setFilterStatus(""); }}
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
      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr style={{ background: "#F3F5FA" }}>
                {["S.No","Quote ID","Name","Mobile","Destination","Days","Date of Travel","Quoted Price","Margin %","New Selling Price","Live Margin %","Edits","Follow-ups","Status","Lost Reason","Reminders","Trip Expense","Invoice",""].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={18} style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8", fontSize: 14 }}>
                  {search || filterStatus ? "No matching quotations" : "No quotations yet — click '+ New Quotation' to start"}
                </td></tr>
              )}
              {filtered.map((q, idx) => {
                const lead   = q.leadId || {};
                const qid    = qDispId(q);
                const cr     = calcQ(q);
                const spVal  = newSP[q._id];
                const liveMp = spVal !== undefined && spVal !== "" ? reverseCalc(spVal, q) : null;
                const lGrd   = liveMp !== null ? mpctBadge(liveMp) : null;
                const oGrd   = mpctBadge(cr.mpct);
                const isExp  = q._id in expEdit;

                return (
                  <tr key={q._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={S.td}><span style={{ color: "#94A3B8", fontSize: 12 }}>{idx + 1}</span></td>

                    <td style={S.td}>
                      <button style={S.qidBtn} onClick={() => setOpenBuilder({ quote: q, isNew: false, lead: q.leadId || {} })}>{qid}</button>
                      <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{q.type} · {(q.pkgMode || "").split(" ")[0]}</div>
                    </td>

                    <td style={S.td}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#0F1B33" }}>{lead.name || "—"}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{leadIdMap[lead._id] || "—"}</div>
                    </td>

                    <td style={S.td}>
                      <a href={`tel:${lead.phone || ""}`} style={{ color: "#2563EB", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{lead.phone || "—"}</a>
                    </td>

                    <td style={S.td}><span style={{ fontWeight: 600, fontSize: 13 }}>{lead.destination || "—"}</span></td>
                    <td style={S.td}><span style={{ fontSize: 12 }}>{q.days || "—"}</span></td>
                    <td style={S.td}><span style={{ fontSize: 12 }}>{fmtDate(q.travelDate)}</span></td>

                    <td style={S.td}><b style={{ color: "#2563EB", fontSize: 13 }}>{inrFmt(cr.selling)}</b></td>

                    <td style={S.td}>
                      {oGrd && <span style={{ background: oGrd.bg, color: oGrd.c, borderRadius: 8, padding: "3px 9px", fontSize: 12, fontWeight: 700 }}>{cr.mpct.toFixed(1)}% {oGrd.g}</span>}
                    </td>

                    <td style={S.td}>
                      <input
                        type="number"
                        style={{ ...S.inlineInp, width: 110 }}
                        placeholder="Enter price…"
                        value={spVal ?? ""}
                        onChange={e => setNewSP(p => ({ ...p, [q._id]: e.target.value }))}
                        onBlur={() => saveNewSP(q)}
                        onKeyDown={e => { if (e.key === "Enter") { e.target.blur(); } }}
                      />
                    </td>

                    <td style={S.td}>
                      {lGrd
                        ? <span style={{ background: lGrd.bg, color: lGrd.c, borderRadius: 8, padding: "3px 9px", fontSize: 12, fontWeight: 700 }}>{liveMp.toFixed(1)}% {lGrd.g}</span>
                        : <span style={{ color: "#CBD5E1", fontSize: 11 }}>—</span>}
                    </td>

                    <td style={S.td}>
                      <button style={S.linkBtn} onClick={() => setVerModal(q)}>{q.versions?.length || 0} ver{(q.versions?.length || 0) !== 1 ? "s" : ""}</button>
                    </td>

                    {/* Follow-ups dropdown */}
                    <td style={{ ...S.td, position: "relative" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button style={{ ...S.linkBtn, display: "inline-flex", alignItems: "center", gap: 4 }}
                          onClick={() => setFuOpen(fuOpen === q._id ? null : q._id)}>
                          {q.followups?.length || 0} follow-up{(q.followups?.length || 0) !== 1 ? "s" : ""} ▾
                        </button>
                        {fuOpen === q._id && (
                          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, background: "#fff", border: "1px solid #E4E9F2", borderRadius: 12, boxShadow: "0 6px 24px rgba(0,0,0,.13)", minWidth: 280, overflow: "hidden" }}>
                            <div style={{ padding: "10px 14px 0" }}>
                              {(q.followups || []).length === 0 && (
                                <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 10px" }}>No follow-ups yet</p>
                              )}
                              {(q.followups || []).map((f, i) => (
                                <div key={i} style={{ marginBottom: 10 }}>
                                  <div style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>
                                    #{i + 1} · {fmtDate(f.date).toUpperCase()}
                                  </div>
                                  <div style={{ fontSize: 13, color: "#0F1B33", fontWeight: 500 }}>{f.note}</div>
                                </div>
                              ))}
                            </div>
                            <button style={{ display: "block", width: "100%", padding: "10px 14px", background: "#F8FAFD", border: "none", borderTop: "1px solid #E4E9F2", fontSize: 13, fontWeight: 700, color: "#2563EB", cursor: "pointer", textAlign: "left" }}
                              onClick={() => { setFuModal(q); setFuOpen(null); }}>
                              + Add follow-up
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={S.td}>
                      <select style={{ ...S.inlineInp, ...statusStyle(q.status), fontWeight: 700, border: "none", cursor: "pointer", padding: "4px 8px", width: 90 }} value={q.status} onChange={e => changeStatus(q, e.target.value)}>
                        <option value="Open">Open</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    <td style={S.td}>
                      {q.status === "Lost" ? (
                        q._id in lostInput ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input style={{ ...S.inlineInp, width: 120 }} value={lostInput[q._id]} onChange={e => setLostInput(p => ({ ...p, [q._id]: e.target.value }))} placeholder="Reason…" />
                            <button style={S.saveBtn} onClick={() => saveLostReason(q)}>✓</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: "#BE123C", cursor: "pointer" }} onClick={() => setLostInput(p => ({ ...p, [q._id]: q.lostReason || "" }))}>
                            {q.lostReason || <span style={{ color: "#CBD5E1" }}>Add…</span>}
                          </span>
                        )
                      ) : <span style={{ color: "#CBD5E1", fontSize: 11 }}>N/A</span>}
                    </td>

                    <td style={S.td}>
                      <button style={S.linkBtn} onClick={() => setRemModal(q)}>
                        {remsByQuote[q._id]?.length || 0} rem
                      </button>
                    </td>

                    <td style={S.td}>
                      {isExp ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <input type="number" style={{ ...S.inlineInp, width: 100 }} value={expEdit[q._id]} onChange={e => setExpEdit(p => ({ ...p, [q._id]: e.target.value }))} />
                          <button style={S.saveBtn} onClick={() => saveExpense(q)}>✓</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, cursor: "pointer", color: q.tripExpense ? "#0F1B33" : "#CBD5E1" }} onClick={() => setExpEdit(p => ({ ...p, [q._id]: q.tripExpense || 0 }))}>
                          {q.tripExpense ? inrFmt(q.tripExpense) : "Add…"}
                        </span>
                      )}
                    </td>

                    <td style={S.td}>
                      {invByQuote[q._id] ? (
                        <button style={{ ...S.linkBtn, fontSize: 12, color: "#15803D", fontWeight: 700 }} onClick={() => openInvoice(q)}>
                          🧾 {invByQuote[q._id].invoiceNo}
                        </button>
                      ) : (
                        <button style={{ ...S.linkBtn, fontSize: 12, color: "#2563EB", fontWeight: 700 }} onClick={() => openInvoice(q)}>
                          + Invoice
                        </button>
                      )}
                    </td>

                    {/* Delete */}
                    <td style={S.td}>
                      {confirmDel === q._id ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 11, color: "#BE123C", fontWeight: 700 }}>Sure?</span>
                          <button style={S.delYes} onClick={() => deleteQuote(q._id)} disabled={deleting === q._id}>
                            {deleting === q._id ? "…" : "Yes"}
                          </button>
                          <button style={S.delNo} onClick={() => setConfirmDel(null)}>No</button>
                        </span>
                      ) : (
                        <button style={S.delBtn} onClick={() => setConfirmDel(q._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── New Quote Step Modal ── */}
      {newStep && (
        <Ov onClick={e => { if (e.target === e.currentTarget) setNewStep(null); }}>
          <div style={{ ...S.modal, maxWidth: 520 }}>
            <div style={S.mHead}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Create Package · New Quotation</div>
              <button style={S.mx} onClick={() => setNewStep(null)}>✕</button>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ marginBottom: 18 }}>
                <label style={S.lbl}>Select Lead (Qualified)</label>
                <select style={S.inp} value={newStep.leadId} onChange={e => setNewStep(p => ({ ...p, leadId: e.target.value }))}>
                  <option value="">— Select a qualified lead —</option>
                  {qualifiedLeads.map(l => <option key={l._id} value={l._id}>{l.name} · {l.destination} · {leadIdMap[l._id]}</option>)}
                </select>
              </div>
              <label style={S.lbl}>Where is this trip going?</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap:   12, marginBottom: 18 }}>
                {["Domestic", "International"].map(t => (
                  <div key={t} onClick={() => setNewStep(p => ({ ...p, type: t }))}
                    style={{ border: `2px solid ${newStep.type === t ? "#2563EB" : "#E4E9F2"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: newStep.type === t ? "#EFF4FF" : "#fff", textAlign: "center", fontWeight: 700, color: newStep.type === t ? "#2563EB" : "#6B7A99", fontSize: 14, transition: "all .15s" }}>
                    {t === "Domestic" ? "🇮🇳" : "🌏"}<br />{t}
                  </div>
                ))}
              </div>
              <label style={S.lbl}>What are you quoting?</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["Complete Package", "Individual Service"].map(m => (
                  <div key={m} onClick={() => setNewStep(p => ({ ...p, pkgMode: m }))}
                    style={{ border: `2px solid ${newStep.pkgMode === m ? "#2563EB" : "#E4E9F2"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: newStep.pkgMode === m ? "#EFF4FF" : "#fff", textAlign: "center", fontWeight: 700, color: newStep.pkgMode === m ? "#2563EB" : "#6B7A99", fontSize: 14, transition: "all .15s" }}>
                    {m === "Complete Package" ? "📦" : "🔧"}<br />{m}
                  </div>
                ))}
              </div>
            </div>
            <div style={S.mFoot}>
              <button style={S.fb} onClick={() => setNewStep(null)}>Cancel</button>
              <button style={{ ...S.fb, background: "#2563EB", color: "#fff", border: "none", opacity: !newStep.leadId ? 0.5 : 1 }} disabled={!newStep.leadId} onClick={startNewQuote}>
                Create Quotation →
              </button>
            </div>
          </div>
        </Ov>
      )}

      {/* ── Quotation Builder ── */}
      {openBuilder && (
        <QuotationBuilder
          lead={openBuilder.lead}
          leadDisplayId={leadIdMap[openBuilder.lead?._id || openBuilder.lead] || "TWO-L-????"}
          quoteDisplayId={openBuilder.isNew ? `TWO-Q-${(leadIdMap[openBuilder.lead?._id]?.split("-")[2]) || "NEW"}` : qDispId(openBuilder.quote)}
          initialData={openBuilder.isNew ? { type: openBuilder.type || "Domestic", pkgMode: openBuilder.pkgMode || "Complete Package" } : openBuilder.quote}
          isNew={openBuilder.isNew}
          salespeople={salespeople}
          onClose={() => setOpenBuilder(null)}
          onSaved={handleSaved}
        />
      )}

      {/* ── Follow-up Modal ── */}
      {fuModal && (
        <Ov onClick={e => { if (e.target === e.currentTarget) setFuModal(null); }}>
          <div style={{ ...S.modal, maxWidth: 480 }}>
            <div style={{ ...S.mHead, flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
              <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Add Follow-up · {qDispId(fuModal)}</span>
                <button style={{ ...S.mx, marginLeft: "auto" }} onClick={() => setFuModal(null)}>✕</button>
              </div>
              <div style={{ fontSize: 12, color: "#BFD3FE" }}>Keep it short, 10 to 12 words</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <label style={S.lbl}>Date</label>
              <input type="date" style={{ ...S.inp, marginBottom: 16 }} value={fuDate} onChange={e => setFuDate(e.target.value)} />
              <label style={S.lbl}>Summary</label>
              <input style={S.inp} value={fuNote} onChange={e => setFuNote(e.target.value)}
                placeholder="Negotiated, asked for better hotel near Dal Lake" />
            </div>
            <div style={{ ...S.mFoot, justifyContent: "flex-end", gap: 10 }}>
              <button style={S.fb} onClick={() => setFuModal(null)}>Cancel</button>
              <button style={{ ...S.sb, padding: "9px 22px" }} onClick={() => addFollowup(fuModal)}>Save Follow-up</button>
            </div>
          </div>
        </Ov>
      )}

      {/* ── Reminder Modal ── */}
      {remModal && (() => {
        const rems     = remsByQuote[remModal._id] || [];
        const leadName = remModal.leadId?.name || "—";
        return (
          <Ov onClick={e => { if (e.target === e.currentTarget) { setRemModal(null); setRemNote(""); setRemDate(todayISO()); } }}>
            <div style={{ ...S.modal, maxWidth: 740 }}>
              {/* Header */}
              <div style={{ ...S.mHead, flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Reminders · {qDispId(remModal)}</span>
                  <button style={{ ...S.mx, marginLeft: "auto" }} onClick={() => { setRemModal(null); setRemNote(""); setRemDate(todayISO()); }}>✕</button>
                </div>
                <div style={{ fontSize: 12, color: "#BFD3FE" }}>{leadName} · multiple reminders can be attached to one quotation</div>
              </div>

              {/* Existing reminders */}
              <div style={{ padding: "16px 24px 0" }}>
                {rems.length === 0 && (
                  <p style={{ color: "#94A3B8", fontSize: 13, textAlign: "center", padding: "16px 0" }}>No reminders yet</p>
                )}
                {rems.map(r => {
                  const done = r.status === "Done";
                  return (
                    <div key={r._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: done ? "#F8FAFD" : "#fff", border: "1px solid #E4E9F2", borderRadius: 10, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: done ? "#94A3B8" : "#0F1B33", fontSize: 14, textDecoration: done ? "line-through" : "none", marginBottom: 3 }}>{r.note}</div>
                        <div style={{ fontSize: 12, color: "#6B7A99" }}>{r.type} · due {fmtDate(r.dueDate)}</div>
                      </div>
                      {done ? (
                        <button onClick={() => undoReminderDone(r._id)} style={{ background: "none", border: "1px solid #CBD5E1", borderRadius: 7, color: "#6B7A99", fontSize: 12, fontWeight: 700, padding: "4px 12px", cursor: "pointer" }}>
                          ↩ Undo
                        </button>
                      ) : (
                        <button onClick={() => markReminderDone(r._id)} style={{ background: "none", border: "1px solid #FECACA", borderRadius: 7, color: "#E8364A", fontSize: 12, fontWeight: 700, padding: "4px 12px", cursor: "pointer" }}>
                          Done ✓
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* New Reminder form */}
              <div style={{ margin: "8px 24px 0", borderRadius: 10, overflow: "hidden", border: "1px solid #E4E9F2" }}>
                <div style={{ background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 16px" }}>+ New Reminder</div>
                <div style={{ background: "#F8FAFD", padding: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={S.lbl}>Date</label>
                      <input type="date" style={{ ...S.inp, colorScheme: "light" }} value={remDate} onChange={e => setRemDate(e.target.value)} />
                    </div>
                    <div>
                      <label style={S.lbl}>Type</label>
                      <select style={S.inp} value={remType} onChange={e => setRemType(e.target.value)}>
                        {["Follow-up Call","Send Package","Schedule Video Call","Document Reminder","Payment Reminder"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.lbl}>Note</label>
                      <input style={S.inp} value={remNote} onChange={e => setRemNote(e.target.value)} placeholder="Decision call, push upgrade" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ ...S.mFoot, justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button style={S.fb} onClick={() => { setRemModal(null); setRemNote(""); setRemDate(todayISO()); }}>Close</button>
                <button style={{ ...S.sb, padding: "9px 22px", opacity: remSaving ? 0.7 : 1 }} disabled={remSaving} onClick={() => addReminder(remModal)}>
                  {remSaving ? "Saving…" : "Add Reminder"}
                </button>
              </div>
            </div>
          </Ov>
        );
      })()}

      {/* ── Version History Modal ── */}
      {verModal && (() => {
        const vers = verModal.versions || [];
        const leadName = verModal.leadId?.name || "—";
        return (
          <Ov onClick={e => { if (e.target === e.currentTarget) setVerModal(null); }}>
            <div style={{ ...S.modal, maxWidth: 860 }}>
              {/* Header */}
              <div style={{ ...S.mHead, flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Edit History · {qDispId(verModal)}</span>
                  <button style={{ ...S.mx, marginLeft: "auto" }} onClick={() => setVerModal(null)}>✕</button>
                </div>
                <div style={{ fontSize: 12, color: "#BFD3FE" }}>{leadName} — every revision is stored, the latest one is the final quote</div>
              </div>

              {/* Table */}
              <div style={{ padding: "20px 24px" }}>
                {vers.length === 0 ? (
                  <p style={{ color: "#94A3B8", fontSize: 13, textAlign: "center", padding: "28px 0" }}>No versions saved yet</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F6F8FC" }}>
                        {["Version","Date","Cost","Margin","Margin %","Selling","Note",""].map(h => (
                          <th key={h} style={{ ...S.th, textAlign: h === "" ? "right" : "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vers.map((v, i) => {
                        const isFinal = i === vers.length - 1;
                        const selling = (v.cost || 0) + (v.margin || 0);
                        const mpct = v.cost > 0 ? ((v.margin / v.cost) * 100).toFixed(1) : "—";
                        return (
                          <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: isFinal ? "#F0FDF4" : "#fff" }}>
                            <td style={{ ...S.td, fontWeight: 700 }}>
                              <span style={{ color: "#2563EB" }}>v{v.v}</span>
                              {isFinal && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, background: "#15803D", color: "#fff", borderRadius: 99, padding: "2px 7px" }}>Final</span>}
                            </td>
                            <td style={S.td}>{fmtDate(v.date)}</td>
                            <td style={{ ...S.td, fontWeight: 600 }}>{inrFmt(v.cost)}</td>
                            <td style={{ ...S.td, fontWeight: 600 }}>{inrFmt(v.margin)}</td>
                            <td style={{ ...S.td, color: "#6B7A99" }}>{mpct !== "—" ? `${mpct}%` : "—"}</td>
                            <td style={{ ...S.td, fontWeight: 700, color: "#0F1B33" }}>{inrFmt(selling)}</td>
                            <td style={{ ...S.td, color: "#6B7A99", maxWidth: 180, whiteSpace: "normal" }}>{v.note || "—"}</td>
                            <td style={{ ...S.td, textAlign: "right", whiteSpace: "nowrap" }}>
                              <button onClick={() => { setOpenBuilder({ quote: { ...verModal, ...v.snapshot }, isNew: false, lead: verModal.leadId }); setVerModal(null); }}
                                style={{ background: "#EFF4FF", color: "#2563EB", border: "1px solid #BFD3FE", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", marginRight: 6 }}>
                                ✎ Edit
                              </button>
                              <button onClick={() => openPdfPreview(verModal, v)}
                                style={{ background: "#fff", color: "#36415A", border: "1px solid #E4E9F2", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                PDF
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div style={{ ...S.mFoot, justifyContent: "flex-end", gap: 10 }}>
                <button style={S.fb} onClick={() => setVerModal(null)}>Close</button>
                <button style={{ ...S.sb, padding: "9px 22px" }} onClick={() => {
                  setOpenBuilder({ quote: verModal, isNew: false, lead: verModal.leadId });
                  setVerModal(null);
                }}>Open Latest Version</button>
              </div>
            </div>
          </Ov>
        );
      })()}

      {fuOpen && <div style={{ position: "fixed", inset: 0, zIndex: 30 }} onClick={() => setFuOpen(null)} />}
      </div>{/* end page wrapper */}

      {/* ── PDF Preview Modal ── */}
      {pdfPreviewData && (
        <Ov onClick={e => { if (e.target === e.currentTarget) setPdfPreviewData(null); }}>
          <div style={{ ...S.modal, maxWidth: 860, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ ...S.mHead, flexShrink: 0 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Quote Preview · {pdfPreviewData.quoteId}</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <button style={{ ...S.fb, background: "#2563EB", color: "#fff", border: "none", opacity: pdfLoading ? 0.6 : 1 }}
                  onClick={downloadPreviewPDF} disabled={pdfLoading}>
                  ⬇ {pdfLoading ? "Generating…" : "Download PDF"}
                </button>
                <button style={{ ...S.mx }} onClick={() => setPdfPreviewData(null)}>✕</button>
              </div>
            </div>
            {/* Preview */}
            <div style={{ padding: 22, maxHeight: "76vh", overflowY: "auto", background: "#F3F5FA" }}>
              <QuotationPreview id="qpv-pdf-target" data={pdfPreviewData} />
            </div>
            {/* Footer */}
            <div style={{ ...S.mFoot, flexShrink: 0 }}>
              <button style={S.fb} onClick={() => setPdfPreviewData(null)}>Close</button>
              <button style={{ ...S.sb, padding: "9px 22px", opacity: pdfLoading ? 0.6 : 1 }}
                onClick={downloadPreviewPDF} disabled={pdfLoading}>
                ⬇ {pdfLoading ? "Generating…" : "Download PDF"}
              </button>
            </div>
          </div>
        </Ov>
      )}

      {/* ── Invoice Builder Modal ── */}
      {invBuilder && (
        <InvoiceBuilder
          prefill={invBuilder.prefill}
          invoiceData={invBuilder.invoiceData}
          isNew={invBuilder.isNew}
          onClose={() => setInvBuilder(null)}
          onSaved={saved => {
            setInvoices(prev => {
              const idx = prev.findIndex(i => i.id === saved.id || i._id === saved._id);
              if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
              return [saved, ...prev];
            });
            setInvBuilder(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function Ov({ children, onClick }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,18,38,.55)", backdropFilter: "blur(3px)", zIndex: 90, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 18px" }} onClick={onClick}>
      {children}
    </div>
  );
}

const S = {
  card:      { background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(15,27,51,.07)", overflow: "hidden" },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:        { padding: "10px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99", whiteSpace: "nowrap", textAlign: "left" },
  td:        { padding: "10px 12px", verticalAlign: "middle", whiteSpace: "nowrap" },
  searchInp: { padding: "9px 14px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, outline: "none", color: "#0F1B33", width: 280, fontFamily: "inherit" },
  filterSel: { padding: "9px 12px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, color: "#36415A", fontFamily: "inherit", outline: "none" },
  newBtn:    { padding: "9px 18px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  qidBtn:    { background: "#EFF4FF", color: "#2563EB", border: "none", borderRadius: 8, padding: "3px 9px", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  linkBtn:   { background: "none", border: "none", color: "#2563EB", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" },
  saveBtn:   { background: "#2563EB", color: "#fff", border: "none", borderRadius: 7, padding: "5px 10px", fontWeight: 700, cursor: "pointer", fontSize: 12 },
  inlineInp: { border: "1px solid #E4E9F2", borderRadius: 8, padding: "5px 8px", fontSize: 12, outline: "none", fontFamily: "inherit", color: "#0F1B33", background: "#F8FAFD" },
  modal:     { background: "#F3F5FA", borderRadius: 18, boxShadow: "0 10px 40px rgba(15,27,51,.18)", width: "100%" },
  mHead:     { display: "flex", alignItems: "center", gap: 12, padding: "15px 20px", background: "#2563EB", borderRadius: "18px 18px 0 0" },
  mx:        { marginLeft: "auto", background: "rgba(255,255,255,.18)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 8, fontSize: "1.1rem", fontWeight: 800, cursor: "pointer" },
  mFoot:     { display: "flex", gap: 8, justifyContent: "flex-end", padding: "14px 20px", borderTop: "1px solid #E4E9F2", background: "#fff", borderRadius: "0 0 18px 18px" },
  fb:        { padding: "8px 14px", border: "1px solid #E4E9F2", borderRadius: 9, background: "#fff", color: "#36415A", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  sb:        { padding: "8px 18px", border: "none", borderRadius: 9, background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  inp:       { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#F8FAFD", fontFamily: "inherit" },
  lbl:       { display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99", marginBottom: 5 },
  delBtn:    { background: "#FEE2E2", color: "#BE123C", border: "none", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  delYes:    { background: "#BE123C", color: "#fff", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  delNo:     { background: "#F1F5F9", color: "#36415A", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
};
