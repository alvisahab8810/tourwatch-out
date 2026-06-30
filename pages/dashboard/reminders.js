import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";

const TYPES = ["Follow-up Call", "Send Package", "Document Reminder", "Payment Reminder", "Other"];

const TYPE_COLOR = {
  "Follow-up Call":      { bg: "#EDE9FE", color: "#6D28D9" },
  "Send Package":        { bg: "#DBEAFE", color: "#1D4ED8" },
  "Document Reminder":   { bg: "#FEF3C7", color: "#B45309" },
  "Payment Reminder":    { bg: "#FEE2E2", color: "#BE123C" },
  "Other":               { bg: "#F1F5F9", color: "#475569" },
};

function fmtDate(v) {
  if (!v) return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate + "T00:00:00") < new Date(new Date().toDateString());
}

const DEF_FORM = { dueDate: "", dueTime: "", type: "Follow-up Call", note: "", quotationId: "", leadId: "", salespersonId: "" };

export default function RemindersPage() {
  const [reminders,    setReminders]    = useState([]);
  const [quotations,   setQuotations]   = useState([]);
  const [salespeople,  setSalespeople]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [form,         setForm]         = useState(DEF_FORM);
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/reminders").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/quotations").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/salesperson").then(r => r.json()).catch(() => []),
    ]).then(([rems, quotes, sps]) => {
      setReminders(Array.isArray(rems)   ? rems   : []);
      setQuotations(Array.isArray(quotes) ? quotes : []);
      setSalespeople(Array.isArray(sps)  ? sps    : []);
    }).finally(() => setLoading(false));
  }, []);

  async function markDone(rem) {
    if (rem._embedded) {
      setReminders(prev => prev.map(x => x._id === rem._id ? { ...x, status: "Done" } : x));
      return;
    }
    const r = await fetch(`/api/dashboard/reminders/${rem._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Done" }),
    });
    if (r.ok) {
      const updated = await r.json();
      setReminders(prev => prev.map(x => (x._id === rem._id ? updated : x)));
    }
  }

  async function markUndone(rem) {
    if (rem._embedded) {
      setReminders(prev => prev.map(x => x._id === rem._id ? { ...x, status: "Upcoming" } : x));
      return;
    }
    const r = await fetch(`/api/dashboard/reminders/${rem._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Upcoming" }),
    });
    if (r.ok) {
      const updated = await r.json();
      setReminders(prev => prev.map(x => (x._id === rem._id ? updated : x)));
    }
  }

  async function deleteReminder(rem) {
    if (rem._embedded) {
      alert("This reminder was added via the Quotations page and cannot be deleted here.");
      return;
    }
    if (!confirm("Delete this reminder?")) return;
    await fetch(`/api/dashboard/reminders/${rem._id}`, { method: "DELETE" });
    setReminders(prev => prev.filter(x => x._id !== rem._id));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form };
      if (!body.quotationId) delete body.quotationId;
      if (!body.leadId)      delete body.leadId;
      if (!body.salespersonId) delete body.salespersonId;
      const r = await fetch("/api/dashboard/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        const created = await r.json();
        setReminders(prev => [created, ...prev]);
        setShowModal(false);
        setForm(DEF_FORM);
      }
    } finally { setSaving(false); }
  }

  const filtered = useMemo(() => {
    let list = [...reminders];
    if (filterStatus && filterStatus !== "all") list = list.filter(r => r.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        (r.note || "").toLowerCase().includes(q) ||
        (r.leadId?.name || "").toLowerCase().includes(q) ||
        (r.quotationId?.quotationNo || "").toLowerCase().includes(q) ||
        (r.salespersonId?.name || "").toLowerCase().includes(q) ||
        (r.type || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [reminders, search, filterStatus]);

  const upcoming = reminders.filter(r => r.status === "Upcoming").length;
  const overdue  = reminders.filter(r => r.status === "Upcoming" && isOverdue(r.dueDate)).length;

  return (
    <DashboardLayout active="Reminder">
      <Head><title>Reminders — Tourwatchout</title></Head>
      <div style={{ padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" }}>

        {/* Page title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0F1B33" }}>Reminders</div>
          <div style={{ fontSize: 13, color: "#6B7A99", marginTop: 2 }}>Everything the team must not forget</div>
        </div>

        {/* Stat chips */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <Chip label="Total" value={reminders.length} color="#2563EB" />
          <Chip label="Upcoming" value={upcoming} color="#7C3AED" />
          <Chip label="Overdue" value={overdue} color="#BE123C" />
          <Chip label="Done" value={reminders.length - upcoming} color="#15803D" />
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <input
              style={{ ...S.search, flex: 1, width: "auto" }}
              placeholder="Search reminders, guests, quotations…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select style={S.sel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button style={S.newBtn} onClick={() => setShowModal(true)}>
            ＋ Add Reminder
          </button>
        </div>

        {/* Table */}
        <div style={S.card}>
          <div style={{ overflowX: "auto" }} className="rtbl-wrap">
            <style>{`.rtbl-wrap::-webkit-scrollbar{height:5px}.rtbl-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}.rtbl tr:hover td{background:#F8FAFF}`}</style>
            <table style={S.tbl} className="rtbl">
              <thead>
                <tr style={{ background: "#F6F8FC" }}>
                  {["DUE", "TYPE", "REMINDER", "QUOTATION", "CUSTOMER", "SALESPERSON", "STATUS", ""].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={8} style={S.empty}>Loading…</td></tr>}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={8} style={S.empty}>No reminders found — click "+ Add Reminder" to create one</td></tr>
                )}
                {filtered.map(rem => {
                  const tc   = TYPE_COLOR[rem.type] || TYPE_COLOR["Other"];
                  const done = rem.status === "Done";
                  const over = !done && isOverdue(rem.dueDate);
                  return (
                    <tr key={rem._id} style={{ borderBottom: "1px solid #F1F5F9", opacity: done ? 0.65 : 1 }}>

                      {/* DUE */}
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: over ? "#BE123C" : "#0F1B33" }}>
                          {fmtDate(rem.dueDate)}
                        </div>
                        {rem.dueTime && <div style={{ fontSize: 11, color: over ? "#BE123C" : "#6B7A99", fontWeight: 600 }}>{rem.dueTime}</div>}
                        {over && <div style={{ fontSize: 10, color: "#BE123C", fontWeight: 700 }}>OVERDUE</div>}
                      </td>

                      {/* TYPE */}
                      <td style={S.td}>
                        <span style={{ background: tc.bg, color: tc.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>
                          {rem.type}
                        </span>
                      </td>

                      {/* REMINDER NOTE */}
                      <td style={{ ...S.td, maxWidth: 260, whiteSpace: "normal", lineHeight: 1.5 }}>
                        <span style={{ fontSize: 13, color: "#374151" }}>{rem.note || "—"}</span>
                      </td>

                      {/* QUOTATION */}
                      <td style={S.td}>
                        {rem.quotationId?.quotationNo ? (
                          <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#2563EB", background: "#EFF4FF", padding: "3px 8px", borderRadius: 6 }}>
                            {rem.quotationId.quotationNo}
                          </span>
                        ) : <span style={{ color: "#CBD5E1" }}>—</span>}
                      </td>

                      {/* CUSTOMER */}
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, color: "#0F1B33", fontSize: 13 }}>{rem.leadId?.name || "—"}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{rem.leadId?.phone || ""}</div>
                      </td>

                      {/* SALESPERSON */}
                      <td style={S.td}>
                        <span style={{ fontSize: 13, color: "#374151" }}>{rem.salespersonId?.name || "—"}</span>
                      </td>

                      {/* STATUS */}
                      <td style={S.td}>
                        {done ? (
                          <span style={{ fontSize: 11, fontWeight: 800, background: "#DCFCE7", color: "#15803D", padding: "4px 10px", borderRadius: 99 }}>
                            ✓ Done
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 800, background: "#EDE9FE", color: "#6D28D9", padding: "4px 10px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6D28D9", display: "inline-block" }} />
                            Upcoming
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {done ? (
                            <button style={S.undoBtn} onClick={() => markUndone(rem)}>↩ Undo</button>
                          ) : (
                            <button style={S.doneBtn} onClick={() => markDone(rem)}>Done ✓</button>
                          )}
                          <button style={S.delBtn} onClick={() => deleteReminder(rem)}>✕</button>
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

      {/* ── Add Reminder Modal ── */}
      {showModal && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setForm(DEF_FORM); } }}>
          <div style={S.modal}>
            <div style={S.mHead}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Add Reminder</span>
              <button style={S.mX} onClick={() => { setShowModal(false); setForm(DEF_FORM); }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>

              <div style={G2}>
                <Fl label="Due Date *">
                  <input type="date" required style={{ ...S.inp, colorScheme: "light" }} value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </Fl>
                <Fl label="Time (24h)">
                  <input type="time" style={{ ...S.inp, colorScheme: "light" }} value={form.dueTime || ""}
                    onChange={e => setForm(f => ({ ...f, dueTime: e.target.value }))} />
                </Fl>
              </div>
              <Fl label="Type">
                <select style={S.inp} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Fl>

              <Fl label="Reminder Note *">
                <textarea required rows={3} style={{ ...S.inp, resize: "vertical" }} placeholder="What needs to be done?" value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              </Fl>

              <Fl label="Link to Quotation (optional)">
                <select style={S.inp} value={form.quotationId} onChange={e => {
                  const qid = e.target.value;
                  const q   = quotations.find(x => String(x._id) === qid);
                  setForm(f => ({
                    ...f,
                    quotationId:   qid,
                    leadId:        q?.leadId?._id        || q?.leadId        || f.leadId,
                    salespersonId: q?.assignedTo?._id    || q?.assignedTo    || f.salespersonId,
                  }));
                }}>
                  <option value="">— None —</option>
                  {quotations.map(q => (
                    <option key={q._id} value={q._id}>
                      {q.quotationNo} {q.leadId?.name ? `· ${q.leadId.name}` : ""} {q.leadId?.destination ? `· ${q.leadId.destination}` : ""}
                    </option>
                  ))}
                </select>
              </Fl>

              <div style={G2}>
                <Fl label="Salesperson (optional)">
                  <select style={S.inp} value={form.salespersonId} onChange={e => setForm(f => ({ ...f, salespersonId: e.target.value }))}>
                    <option value="">— None —</option>
                    {salespeople.map(sp => <option key={sp._id} value={sp._id}>{sp.name}</option>)}
                  </select>
                </Fl>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
                <button type="button" style={S.cancelBtn} onClick={() => { setShowModal(false); setForm(DEF_FORM); }}>Cancel</button>
                <button type="submit" style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Saving…" : "＋ Save Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${color}20`, borderRadius: 10, padding: "8px 16px", display: "flex", gap: 8, alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 800, color }}>{value}</span>
    </div>
  );
}

function Fl({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99" }}>{label}</label>
      {children}
    </div>
  );
}

const G2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };

const S = {
  search:    { padding: "9px 14px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, outline: "none", color: "#0F1B33", width: 320, fontFamily: "inherit", background: "#fff" },
  sel:       { padding: "9px 12px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, outline: "none", color: "#0F1B33", fontFamily: "inherit", background: "#fff", cursor: "pointer", flexShrink: 0, width: 140 },
  newBtn:    { padding: "9px 18px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  card:      { background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(15,27,51,.07)", overflow: "hidden" },
  tbl:       { width: "100%", borderCollapse: "collapse", fontSize: ".84rem", minWidth: 900 },
  th:        { background: "#F6F8FC", color: "#6B7A99", fontSize: ".69rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E4E9F2", whiteSpace: "nowrap" },
  td:        { padding: "10px 12px", verticalAlign: "middle", color: "#36415A", whiteSpace: "nowrap" },
  empty:     { padding: 44, textAlign: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600 },
  doneBtn:   { background: "#DCFCE7", color: "#15803D", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  undoBtn:   { background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  delBtn:    { background: "#FEE2E2", color: "#BE123C", border: "none", borderRadius: 7, padding: "5px 8px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  overlay:   { position: "fixed", inset: 0, background: "rgba(10,18,38,.55)", backdropFilter: "blur(3px)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 18px" },
  modal:     { background: "#F3F5FA", borderRadius: 18, boxShadow: "0 10px 40px rgba(15,27,51,.18)", width: "100%", maxWidth: 540 },
  mHead:     { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#2563EB", borderRadius: "18px 18px 0 0" },
  mX:        { background: "rgba(255,255,255,.18)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: 8, fontSize: "1rem", fontWeight: 800, cursor: "pointer" },
  inp:       { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#fff", fontFamily: "inherit" },
  cancelBtn: { padding: "8px 16px", border: "1px solid #E4E9F2", borderRadius: 9, background: "#fff", color: "#36415A", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  saveBtn:   { padding: "8px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" },
};
