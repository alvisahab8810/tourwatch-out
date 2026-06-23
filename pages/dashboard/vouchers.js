import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";
import VoucherBuilder from "../../components/backend/VoucherBuilder";

// ─── helpers ──────────────────────────────────────────────────────────────────
function calcGrand(inv) {
  const sub  = (inv.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst = inv.cgstPct ? sub  * parseFloat(inv.cgstPct) / 100 : 0;
  const sgst = inv.sgstPct ? sub  * parseFloat(inv.sgstPct) / 100 : 0;
  const igst = inv.igstPct ? sub  * parseFloat(inv.igstPct) / 100 : 0;
  const after = sub + cgst + sgst + igst;
  const tcs  = inv.tcsPct ? after * parseFloat(inv.tcsPct) / 100 : 0;
  return after + tcs;
}
function calcPaid(inv) { return (inv.payments || []).reduce((s, p) => s + (+p.amount || 0), 0); }
function calcDue(inv)  { return Math.max(0, calcGrand(inv) - calcPaid(inv)); }
function getInvStatus(inv) {
  const paid = calcPaid(inv), grand = calcGrand(inv);
  if (paid === 0) return "Unpaid";
  if (calcDue(inv) === 0 && grand > 0) return "Paid";
  return "Partially Paid";
}
const INV_STYLE = {
  "Paid":           { background: "#DCFCE7", color: "#15803D" },
  "Partially Paid": { background: "#FEF3C7", color: "#B45309" },
  "Unpaid":         { background: "#FEE2E2", color: "#BE123C" },
};
function voucherMonthKey(v) {
  const raw = v.travelDate || v.travelDateFrom || v.createdAt || "";
  if (!raw) return "";
  try {
    const d = /^\d{4}-\d{2}-\d{2}/.test(raw) ? new Date(raw + "T00:00:00") : new Date(raw);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  } catch { return ""; }
}

export default function VouchersPage() {
  const [vouchers,    setVouchers]    = useState([]);
  const [invoices,    setInvoices]    = useState([]);
  const [leads,       setLeads]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [vBuilder,    setVBuilder]    = useState(null);
  const [fromMonth,   setFromMonth]   = useState("");
  const [toMonth,     setToMonth]     = useState("");
  const [filterLock,  setFilterLock]  = useState("");
  const [filterDest,  setFilterDest]  = useState("");
  const [confirmDel,  setConfirmDel]  = useState(null);
  const [deleting,    setDeleting]    = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/vouchers").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/invoices").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/leads").then(r => r.json()).catch(() => []),
    ]).then(([v, inv, l]) => {
      setVouchers(Array.isArray(v)   ? v   : []);
      setInvoices(Array.isArray(inv) ? inv : []);
      setLeads(Array.isArray(l)      ? l   : []);
    }).finally(() => setLoading(false));
  }, []);

  const invMap = useMemo(
    () => Object.fromEntries(invoices.map(i => [i.id || i._id, i])),
    [invoices]
  );

  function isLocked(v) {
    const inv = invMap[v.invoiceId];
    if (!inv) return false;
    return calcDue(inv) === 0 && calcGrand(inv) > 0;
  }

  async function deleteVoucher(id) {
    setDeleting(id);
    try {
      await fetch(`/api/dashboard/vouchers/${id}`, { method: "DELETE" });
      setVouchers(prev => prev.filter(v => (v.id || v._id) !== id));
      setConfirmDel(null);
    } finally { setDeleting(null); }
  }

  function handleSaved(saved) {
    setVouchers(prev => {
      const idx = prev.findIndex(v => v.id === saved.id || v._id === saved._id);
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
      return [saved, ...prev];
    });
    setVBuilder(null);
  }

  const destOptions = useMemo(() => {
    const s = new Set(vouchers.map(v => v.destination).filter(Boolean));
    return Array.from(s).sort();
  }, [vouchers]);

  const filtered = useMemo(() => {
    return vouchers.filter(v => {
      if (search) {
        const q = search.toLowerCase();
        if (![v.voucherNo, v.tripId, v.name, v.destination].join(" ").toLowerCase().includes(q)) return false;
      }
      if (filterDest && (v.destination || "") !== filterDest) return false;
      if (filterLock === "locked"   && !isLocked(v)) return false;
      if (filterLock === "editable" &&  isLocked(v)) return false;
      const mk = voucherMonthKey(v);
      if (fromMonth && mk && mk < fromMonth) return false;
      if (toMonth   && mk && mk > toMonth)   return false;
      return true;
    });
  }, [vouchers, search, filterDest, filterLock, fromMonth, toMonth]);

  return (
    <DashboardLayout active="Voucher">
      <Head><title>Vouchers — Tourwatchout</title></Head>
      <div style={{ padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <input style={S.search} placeholder="Search by trip ID, guest, destination…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button style={{ ...S.newBtn, marginLeft: "auto" }}
            onClick={() => setVBuilder({ voucher: null, isNew: true, prefill: null })}>
            ＋ New Voucher
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, background: "#fff", border: "1px solid #E4E9F2", borderRadius: 10, padding: "10px 14px", overflowX: "auto" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".05em", flexShrink: 0 }}>Filters:</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: "#6B7A99", fontWeight: 600 }}>From</span>
            <input type="month" style={S.monthInp} value={fromMonth} onChange={e => setFromMonth(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: "#6B7A99", fontWeight: 600 }}>To</span>
            <input type="month" style={S.monthInp} value={toMonth} onChange={e => setToMonth(e.target.value)} />
          </div>
          <select style={S.filterSel} value={filterDest} onChange={e => setFilterDest(e.target.value)}>
            <option value="">All Destinations</option>
            {destOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select style={S.filterSel} value={filterLock} onChange={e => setFilterLock(e.target.value)}>
            <option value="">All States</option>
            <option value="editable">Editable</option>
            <option value="locked">Locked</option>
          </select>
          {(fromMonth || toMonth || filterDest || filterLock) && (
            <button onClick={() => { setFromMonth(""); setToMonth(""); setFilterDest(""); setFilterLock(""); }}
              style={{ background: "#FEE2E2", color: "#BE123C", border: "none", borderRadius: 7, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              ✕ Clear
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#6B7A99", fontWeight: 600 }}>
            {filtered.length} voucher{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Count chips */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            { l: "Total",    n: vouchers.length,                         c: "#2563EB", bg: "#EFF4FF", f: "" },
            { l: "Editable", n: vouchers.filter(v => !isLocked(v)).length, c: "#15803D", bg: "#DCFCE7", f: "editable" },
            { l: "Locked",   n: vouchers.filter(v =>  isLocked(v)).length, c: "#B45309", bg: "#FEF3C7", f: "locked" },
          ].map(({ l, n, c, bg, f }) => (
            <div key={l} onClick={() => setFilterLock(filterLock === f ? "" : f)}
              style={{ background: bg, borderRadius: 9, padding: "7px 16px", display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${c}22`, cursor: "pointer", opacity: filterLock && filterLock !== f && f !== "" ? 0.5 : 1 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: c }}>{n}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: c }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={S.card}>
          <div style={{ overflowX: "auto" }} className="vtbl-wrap">
            <style>{`.vtbl-wrap::-webkit-scrollbar{height:5px}.vtbl-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}.vtbl tr:hover td{background:#F8FAFF}`}</style>
            <table style={S.tbl} className="vtbl">
              <thead>
                <tr style={{ background: "#F6F8FC" }}>
                  {["S.No","Trip ID","Guest","Destination","Journey Dates","Pax","Invoice","Status","Lock","Action"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={10} style={S.empty}>Loading…</td></tr>}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={10} style={S.empty}>No vouchers yet — create one from the Invoices page or click "+ New Voucher"</td></tr>
                )}
                {filtered.map((v, idx) => {
                  const inv       = invMap[v.invoiceId];
                  const locked    = isLocked(v);
                  const invStatus = inv ? getInvStatus(inv) : null;
                  const ist       = invStatus ? INV_STYLE[invStatus] : null;

                  return (
                    <tr key={v.id || v._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      {/* S.No */}
                      <td style={S.td}><span style={{ color: "#94A3B8", fontSize: 12 }}>{idx + 1}</span></td>

                      {/* Trip ID */}
                      <td style={S.td}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#2563EB", background: "#EFF4FF", padding: "3px 8px", borderRadius: 6 }}>
                          {v.tripId || "—"}
                        </span>
                      </td>

                      {/* Guest */}
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, color: "#0F1B33", fontSize: 13 }}>{v.name || "—"}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{v.contactNo || ""}</div>
                      </td>

                      {/* Destination */}
                      <td style={S.td}><span style={{ fontSize: 13 }}>{v.destination || "—"}</span></td>

                      {/* Journey Dates */}
                      <td style={S.td}><span style={{ fontSize: 12, color: "#36415A" }}>{v.travelDate || v.travelDateFrom || "—"}</span></td>

                      {/* Pax */}
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <span style={{ fontSize: 12, color: "#36415A" }}>{v.pax || "—"}</span>
                      </td>

                      {/* Invoice */}
                      <td style={S.td}>
                        {inv ? (
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{inv.invoiceNo || "—"}</div>
                            {ist && (
                              <span style={{ fontSize: 10, fontWeight: 800, background: ist.background, color: ist.color, padding: "2px 7px", borderRadius: 99, display: "inline-block", marginTop: 2 }}>
                                {invStatus}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#CBD5E1", fontSize: 12 }}>—</span>
                        )}
                      </td>

                      {/* Voucher No */}
                      <td style={S.td}>
                        <span style={{ fontSize: 11, color: "#6B7A99" }}>{v.voucherNo || "—"}</span>
                      </td>

                      {/* Lock */}
                      <td style={{ ...S.td, textAlign: "center" }}>
                        {locked ? (
                          <span style={{ fontSize: 11, fontWeight: 800, background: "#FEF3C7", color: "#B45309", padding: "4px 9px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 3 }}>
                            🔒 Locked
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 800, background: "#DCFCE7", color: "#15803D", padding: "4px 9px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 3 }}>
                            ✏️ Editable
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {locked ? (
                            <button style={S.viewBtn} onClick={() => setVBuilder({ voucher: v, isNew: false, prefill: null })}>View</button>
                          ) : (
                            <button style={S.editBtn} onClick={() => setVBuilder({ voucher: v, isNew: false, prefill: null })}>Open / Edit</button>
                          )}
                          {confirmDel === (v.id || v._id) ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <span style={{ fontSize: 11, color: "#BE123C", fontWeight: 700 }}>Sure?</span>
                              <button style={S.delYes} onClick={() => deleteVoucher(v.id || v._id)} disabled={deleting === (v.id || v._id)}>
                                {deleting === (v.id || v._id) ? "…" : "Yes"}
                              </button>
                              <button style={S.delNo} onClick={() => setConfirmDel(null)}>No</button>
                            </span>
                          ) : (
                            <button style={S.delBtn} onClick={() => setConfirmDel(v.id || v._id)}>Delete</button>
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

      {vBuilder && (
        <VoucherBuilder
          prefill={vBuilder.prefill}
          voucherData={vBuilder.voucher}
          isNew={vBuilder.isNew}
          onClose={() => setVBuilder(null)}
          onSaved={handleSaved}
        />
      )}
    </DashboardLayout>
  );
}

const S = {
  search:    { padding: "9px 14px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, outline: "none", color: "#0F1B33", width: 260, fontFamily: "inherit", background: "#fff" },
  monthInp:  { padding: "6px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 13, outline: "none", color: "#0F1B33", fontFamily: "inherit", background: "#F8FAFD", colorScheme: "light", width: 160, flexShrink: 0 },
  filterSel: { padding: "6px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 13, color: "#36415A", fontFamily: "inherit", outline: "none", background: "#F8FAFD", flexShrink: 0, width: 160 },
  newBtn:  { padding: "9px 18px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  card:    { background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(15,27,51,.07)", overflow: "hidden" },
  tbl:     { width: "100%", borderCollapse: "collapse", fontSize: ".84rem", minWidth: 1050 },
  th:      { background: "#F6F8FC", color: "#6B7A99", fontSize: ".69rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E4E9F2", whiteSpace: "nowrap" },
  td:      { padding: "10px 12px", verticalAlign: "middle", color: "#36415A", whiteSpace: "nowrap" },
  empty:   { padding: 44, textAlign: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600 },
  editBtn: { background: "#2563EB", color: "#fff", border: "none", borderRadius: 7, padding: "6px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  viewBtn: { background: "#fff", color: "#2563EB", border: "1.5px solid #2563EB", borderRadius: 7, padding: "5px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  delBtn:  { background: "#FEE2E2", color: "#BE123C", border: "none", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  delYes:  { background: "#BE123C", color: "#fff", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  delNo:   { background: "#F1F5F9", color: "#36415A", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
};
