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

export default function VouchersPage() {
  const [vouchers,  setVouchers]  = useState([]);
  const [invoices,  setInvoices]  = useState([]);
  const [leads,     setLeads]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [vBuilder,  setVBuilder]  = useState(null);

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

  function handleSaved(saved) {
    setVouchers(prev => {
      const idx = prev.findIndex(v => v.id === saved.id || v._id === saved._id);
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
      return [saved, ...prev];
    });
    setVBuilder(null);
  }

  const filtered = useMemo(() => {
    if (!search) return vouchers;
    const q = search.toLowerCase();
    return vouchers.filter(v =>
      (v.voucherNo  || "").toLowerCase().includes(q) ||
      (v.tripId     || "").toLowerCase().includes(q) ||
      (v.name       || "").toLowerCase().includes(q) ||
      (v.destination|| "").toLowerCase().includes(q)
    );
  }, [vouchers, search]);

  return (
    <DashboardLayout active="Voucher">
      <Head><title>Vouchers — Tourwatchout</title></Head>
      <div style={{ padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <input style={S.search} placeholder="Search by trip ID, guest, destination…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button style={{ ...S.newBtn, marginLeft: "auto" }}
            onClick={() => setVBuilder({ voucher: null, isNew: true, prefill: null })}>
            ＋ New Voucher
          </button>
        </div>

        <div style={{ fontSize: 13, color: "#6B7A99", fontWeight: 600, marginBottom: 10 }}>
          {filtered.length} voucher{filtered.length !== 1 ? "s" : ""}
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
                        {locked ? (
                          <button style={S.viewBtn} onClick={() => setVBuilder({ voucher: v, isNew: false, prefill: null })}>
                            View
                          </button>
                        ) : (
                          <button style={S.editBtn} onClick={() => setVBuilder({ voucher: v, isNew: false, prefill: null })}>
                            Open / Edit
                          </button>
                        )}
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
  search:  { padding: "9px 14px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, outline: "none", color: "#0F1B33", width: 320, fontFamily: "inherit", background: "#fff" },
  newBtn:  { padding: "9px 18px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  card:    { background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(15,27,51,.07)", overflow: "hidden" },
  tbl:     { width: "100%", borderCollapse: "collapse", fontSize: ".84rem", minWidth: 1050 },
  th:      { background: "#F6F8FC", color: "#6B7A99", fontSize: ".69rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E4E9F2", whiteSpace: "nowrap" },
  td:      { padding: "10px 12px", verticalAlign: "middle", color: "#36415A", whiteSpace: "nowrap" },
  empty:   { padding: 44, textAlign: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600 },
  editBtn: { background: "#2563EB", color: "#fff", border: "none", borderRadius: 7, padding: "6px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  viewBtn: { background: "#fff", color: "#2563EB", border: "1.5px solid #2563EB", borderRadius: 7, padding: "5px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
};
