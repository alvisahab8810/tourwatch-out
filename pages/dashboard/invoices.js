import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";
import InvoiceBuilder from "../../components/backend/InvoiceBuilder";
import QuotationBuilder from "../../components/backend/QuotationBuilder";
import VoucherBuilder from "../../components/backend/VoucherBuilder";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function calcGrand(inv) {
  const sub  = (inv.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst = inv.cgstPct ? (sub  * parseFloat(inv.cgstPct)) / 100 : 0;
  const sgst = inv.sgstPct ? (sub  * parseFloat(inv.sgstPct)) / 100 : 0;
  const igst = inv.igstPct ? (sub  * parseFloat(inv.igstPct)) / 100 : 0;
  const after = sub + cgst + sgst + igst;
  const tcs  = inv.tcsPct ? (after * parseFloat(inv.tcsPct)) / 100 : 0;
  return after + tcs;
}
function calcPaid(inv)   { return (inv.payments || []).reduce((s, p) => s + (+p.amount || 0), 0); }
function calcDue(inv)    { return Math.max(0, calcGrand(inv) - calcPaid(inv)); }
function getStatus(inv) {
  const paid = calcPaid(inv);
  if (paid === 0) return "Unpaid";
  if (calcDue(inv) === 0) return "Paid";
  return "Partially Paid";
}
const inr = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");
function fmtDate(v) {
  if (!v) return "—";
  try {
    const d = /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(v + "T00:00:00") : new Date(v);
    if (isNaN(d)) return v;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return v; }
}
const todayISO = () => new Date().toISOString().slice(0, 10);

const STATUS_STYLE = {
  "Paid":           { background: "#DCFCE7", color: "#15803D" },
  "Partially Paid": { background: "#FEF3C7", color: "#B45309" },
  "Unpaid":         { background: "#FEE2E2", color: "#BE123C" },
};

const PAYMENT_MODES = ["Online", "Bank Transfer", "Cash", "UPI", "Cheque", "NEFT / RTGS"];

/* ─── Payment Modal ────────────────────────────────────────────────────────── */
function PaymentModal({ invoice, onClose, onUpdated }) {
  const [date,   setDate]   = useState(todayISO());
  const [amount, setAmount] = useState("");
  const [mode,   setMode]   = useState("Online");
  const [note,   setNote]   = useState("");
  const [saving, setSaving] = useState(false);

  const payments  = invoice.payments || [];
  const total     = calcGrand(invoice);
  const paid      = calcPaid(invoice);
  const due       = calcDue(invoice);

  async function addPayment() {
    if (!amount || +amount <= 0) return;
    setSaving(true);
    try {
      const newPayments = [...payments, { date, amount: +amount, mode, note }];
      const res = await fetch(`/api/dashboard/invoices/${invoice.id || invoice._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payments: newPayments }),
      });
      if (res.ok) { onUpdated(await res.json()); onClose(); }
    } finally { setSaving(false); }
  }

  return (
    <div style={P.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={P.modal}>
        {/* Header */}
        <div style={P.head}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
              Payments · {invoice.invoiceNo}
            </div>
            <div style={{ fontSize: 12, color: "#BFD3FE", marginTop: 3 }}>
              {invoice.clientName} · Total {inr(total)} · Paid {inr(paid)} · Due {inr(due)}
            </div>
          </div>
          <button style={P.x} onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: "18px 20px", maxHeight: "64vh", overflowY: "auto" }}>
          {/* Existing payments */}
          {payments.length === 0 ? (
            <p style={{ color: "#94A3B8", fontSize: 13, textAlign: "center", padding: "12px 0" }}>No payments recorded yet</p>
          ) : payments.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#F8FAFD", border: "1px solid #E4E9F2", borderRadius: 10, marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#15803D", fontSize: 15 }}>{inr(p.amount)}</div>
                <div style={{ fontSize: 12, color: "#6B7A99", marginTop: 2 }}>{p.mode} · {fmtDate(p.date)}{p.note ? ` · ${p.note}` : ""}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: 99 }}>Part {i + 1}</span>
            </div>
          ))}

          {/* Add payment form */}
          {due > 0 && (
            <div style={{ border: "1px solid #E4E9F2", borderRadius: 12, overflow: "hidden", marginTop: 10 }}>
              <div style={{ background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 14px" }}>+ Record New Payment</div>
              <div style={{ padding: 14, background: "#fff" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <Fl l="Date"><input type="date" style={P.inp} value={date} onChange={e => setDate(e.target.value)} /></Fl>
                  <Fl l="Amount (₹)"><input type="number" style={P.inp} value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Max ${inr(due)}`} /></Fl>
                  <Fl l="Mode">
                    <select style={P.inp} value={mode} onChange={e => setMode(e.target.value)}>
                      {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </Fl>
                </div>
                <Fl l="Note (optional)">
                  <input style={P.inp} value={note} onChange={e => setNote(e.target.value)} placeholder="NEFT ref, cheque no…" />
                </Fl>
              </div>
            </div>
          )}
          {due === 0 && payments.length > 0 && (
            <div style={{ textAlign: "center", padding: "12px 0", color: "#15803D", fontWeight: 700, fontSize: 14 }}>✓ Fully Paid — Balance is ₹0</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", padding: "14px 20px", borderTop: "1px solid #E4E9F2", background: "#fff", borderRadius: "0 0 16px 16px" }}>
          <button style={P.cancelBtn} onClick={onClose}>Close</button>
          {due > 0 && (
            <button style={{ ...P.cancelBtn, background: "#2563EB", color: "#fff", border: "none", opacity: saving ? 0.7 : 1 }} onClick={addPayment} disabled={saving || !amount || +amount <= 0}>
              {saving ? "Saving…" : "Save Payment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function InvoicesPage() {
  const [invoices,    setInvoices]    = useState([]);
  const [quotes,      setQuotes]      = useState([]);
  const [leads,       setLeads]       = useState([]);
  const [salespeople, setSalespeople] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");

  const [vouchers,    setVouchers]    = useState([]);
  const [builder,     setBuilder]     = useState(null);  // { invoice, isNew }
  const [payModal,    setPayModal]     = useState(null);  // invoice doc
  const [qBuilder,    setQBuilder]     = useState(null);  // { quote, lead }
  const [vBuilder,    setVBuilder]     = useState(null);  // { voucher?, isNew, prefill? }

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/invoices").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/quotations").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/leads").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/salesperson").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/vouchers").then(r => r.json()).catch(() => []),
    ]).then(([inv, q, l, sp, v]) => {
      setInvoices(Array.isArray(inv) ? inv : []);
      setQuotes(Array.isArray(q) ? q : []);
      setLeads(Array.isArray(l) ? l : []);
      setSalespeople(Array.isArray(sp) ? sp : []);
      setVouchers(Array.isArray(v) ? v : []);
    }).finally(() => setLoading(false));
  }, []);

  const voucherByInvoice = useMemo(
    () => Object.fromEntries(vouchers.filter(v => v.invoiceId).map(v => [v.invoiceId, v])),
    [vouchers]
  );

  const leadIdMap = useMemo(() => {
    const sorted = [...leads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return Object.fromEntries(sorted.map((l, i) => [l._id, `TWO-L-${String(i + 1).padStart(4, "0")}`]));
  }, [leads]);

  function openQuotation(inv) {
    const quote = quotes.find(q => q._id === inv.quotationId);
    if (!quote) return;
    const lead = leads.find(l => l._id === (quote.leadId?._id || quote.leadId));
    setQBuilder({ quote, lead });
  }

  function handleSaved(saved) {
    setInvoices(prev => {
      const idx = prev.findIndex(i => i.id === saved.id || i._id === saved._id);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...prev[idx], ...saved }; return n; }
      return [saved, ...prev];
    });
  }

  const filtered = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(i =>
      (i.invoiceNo   || "").toLowerCase().includes(q) ||
      (i.clientName  || "").toLowerCase().includes(q) ||
      (i.destination || "").toLowerCase().includes(q) ||
      (i.quotationNo || "").toLowerCase().includes(q)
    );
  }, [invoices, search]);

  return (
    <DashboardLayout active="Invoice">
      <Head><title>Invoices — Tourwatchout</title></Head>
      <div style={{ padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" }}>

        {/* Banner */}
        <div style={{ background: "#EFF4FF", border: "1px solid #BFD3FE", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#1D4ED8", fontWeight: 600, lineHeight: 1.5 }}>
          ⚡ <b>Part payments, handled:</b> record any number of parts with date, amount and mode. Balance due updates itself. When due hits zero the Final Invoice unlocks.
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <input style={S.search} placeholder="Search by invoice no, client, destination, quote ID…" value={search} onChange={e => setSearch(e.target.value)} />
          <button style={{ ...S.newBtn, marginLeft: "auto" }} onClick={() => setBuilder({ invoice: null, isNew: true })}>
            ＋ New Invoice
          </button>
        </div>

        {/* Count */}
        <div style={{ fontSize: 13, color: "#6B7A99", fontWeight: 600, marginBottom: 10 }}>
          {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
        </div>

        {/* Table */}
        <div style={S.card}>
          <div style={{ overflowX: "auto" }} className="tbl-wrap">
            <style>{`.tbl-wrap::-webkit-scrollbar{height:5px}.tbl-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}.tbl tr:hover td{background:#F8FAFF}`}</style>
            <table style={S.tbl} className="tbl">
              <thead>
                <tr style={{ background: "#F6F8FC" }}>
                  {["S.No","Name","Invoice ID","Quotation","Total","Payments","Amount Due","Parts","Status","Final Invoice","Voucher"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={11} style={S.empty}>Loading…</td></tr>}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={11} style={S.empty}>No invoices yet — create one from the Quotations page or click "+ New Invoice"</td></tr>
                )}
                {filtered.map((inv, idx) => {
                  const total  = calcGrand(inv);
                  const paid   = calcPaid(inv);
                  const due    = calcDue(inv);
                  const status = getStatus(inv);
                  const ss     = STATUS_STYLE[status];
                  const parts  = (inv.payments || []).length;

                  return (
                    <tr key={inv.id || inv._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      {/* S.No */}
                      <td style={S.td}><span style={{ color: "#94A3B8", fontSize: 12 }}>{idx + 1}</span></td>

                      {/* Name */}
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, color: "#0F1B33", fontSize: 13 }}>{inv.clientName || "—"}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{inv.contact || ""}</div>
                      </td>

                      {/* Invoice ID */}
                      <td style={S.td}>
                        <button style={S.invBtn} onClick={() => setBuilder({ invoice: inv, isNew: false })}>
                          {inv.invoiceNo || "—"}
                        </button>
                        <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{fmtDate(inv.invoiceDate)}</div>
                      </td>

                      {/* Quotation */}
                      <td style={S.td}>
                        {inv.quotationNo && inv.quotationId ? (
                          <button style={S.invBtn} onClick={() => openQuotation(inv)}>
                            {inv.quotationNo}
                          </button>
                        ) : (
                          <span style={{ color: "#CBD5E1", fontSize: 12 }}>—</span>
                        )}
                      </td>

                      {/* Total */}
                      <td style={S.td}>
                        <b style={{ color: "#0F1B33", fontSize: 13 }}>{inr(total)}</b>
                      </td>

                      {/* Payments Record/View */}
                      <td style={S.td}>
                        <button style={S.payBtn} onClick={() => setPayModal(inv)}>
                          ≡ Record / View{paid > 0 ? ` (${inr(paid)} paid)` : ""}
                        </button>
                      </td>

                      {/* Amount Due */}
                      <td style={S.td}>
                        <b style={{ color: due === 0 ? "#15803D" : "#BE123C", fontSize: 13 }}>{inr(due)}</b>
                      </td>

                      {/* Parts */}
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <span style={{ fontSize: 12, color: "#6B7A99" }}>{parts} part{parts !== 1 ? "s" : ""}</span>
                      </td>

                      {/* Status */}
                      <td style={S.td}>
                        <span style={{ ...ss, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>
                          {status === "Partially Paid" ? "• " : status === "Paid" ? "• " : "○ "}{status}
                        </span>
                      </td>

                      {/* Final Invoice */}
                      <td style={S.td}>
                        {due === 0 && total > 0 ? (
                          <button style={S.finalBtn} onClick={() => setBuilder({ invoice: inv, isNew: false, openPreview: true })}>
                            🧾 Send Final Invoice
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: "#CBD5E1" }}>Locked till due is ₹0</span>
                        )}
                      </td>

                      {/* Voucher */}
                      <td style={S.td}>
                        {(() => {
                          const existingV = voucherByInvoice[inv.id || inv._id];
                          if (existingV) {
                            return (
                              <button style={S.voucherBtn} onClick={() => setVBuilder({ voucher: existingV, isNew: false, prefill: null })}>
                                🗂 {existingV.tripId || "View Voucher"}
                              </button>
                            );
                          }
                          const lead = leads.find(l => l._id === inv.leadId);
                          return (
                            <button style={{ ...S.voucherBtn, background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}
                              onClick={() => setVBuilder({ voucher: null, isNew: true, prefill: { invoice: inv, lead } })}>
                              ＋ Create Voucher
                            </button>
                          );
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice builder modal */}
      {builder && (
        <InvoiceBuilder
          invoiceData={builder.invoice}
          isNew={builder.isNew}
          onClose={() => setBuilder(null)}
          onSaved={saved => { handleSaved(saved); }}
        />
      )}

      {/* Payment modal */}
      {payModal && (
        <PaymentModal
          invoice={payModal}
          onClose={() => setPayModal(null)}
          onUpdated={updated => {
            setInvoices(prev => prev.map(i => (i.id === updated.id || i._id === updated._id) ? { ...i, ...updated } : i));
            setPayModal(null);
          }}
        />
      )}

      {/* Voucher builder modal */}
      {vBuilder && (
        <VoucherBuilder
          prefill={vBuilder.prefill}
          voucherData={vBuilder.voucher}
          isNew={vBuilder.isNew}
          onClose={() => setVBuilder(null)}
          onSaved={saved => {
            setVouchers(prev => {
              const idx = prev.findIndex(v => v.id === saved.id || v._id === saved._id);
              if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
              return [saved, ...prev];
            });
            setVBuilder(null);
          }}
        />
      )}

      {/* Quotation builder popup (from clicking quotation ID) */}
      {qBuilder && (
        <QuotationBuilder
          lead={qBuilder.lead}
          leadDisplayId={leadIdMap[qBuilder.lead?._id] || "TWO-L-????"}
          quoteDisplayId={qBuilder.quote?.quotationNo || "TWO-Q-????"}
          initialData={qBuilder.quote}
          isNew={false}
          salespeople={salespeople}
          onClose={() => setQBuilder(null)}
          onSaved={() => setQBuilder(null)}
        />
      )}
    </DashboardLayout>
  );
}

/* ── Sub-component ── */
function Fl({ l, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99" }}>{l}</label>
      {children}
    </div>
  );
}

const P = {
  overlay:   { position: "fixed", inset: 0, background: "rgba(10,18,38,.55)", backdropFilter: "blur(3px)", zIndex: 97, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "34px 18px" },
  modal:     { background: "#F3F5FA", borderRadius: 16, boxShadow: "0 10px 40px rgba(15,27,51,.18)", width: "100%", maxWidth: 580 },
  head:      { display: "flex", alignItems: "center", gap: 12, padding: "15px 20px", background: "#2563EB", borderRadius: "16px 16px 0 0" },
  x:         { marginLeft: "auto", background: "rgba(255,255,255,.18)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 8, fontSize: "1.1rem", fontWeight: 800, cursor: "pointer" },
  inp:       { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#F8FAFD", fontFamily: "inherit" },
  cancelBtn: { padding: "9px 22px", border: "1px solid #E4E9F2", borderRadius: 9, background: "#fff", color: "#36415A", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
};

const S = {
  search:    { padding: "9px 14px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, outline: "none", color: "#0F1B33", width: 320, fontFamily: "inherit", background: "#fff" },
  newBtn:    { padding: "9px 18px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  card:      { background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(15,27,51,.07)", overflow: "hidden" },
  tbl:       { width: "100%", borderCollapse: "collapse", fontSize: ".84rem", minWidth: 1200 },
  th:        { background: "#F6F8FC", color: "#6B7A99", fontSize: ".69rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E4E9F2", whiteSpace: "nowrap" },
  td:        { padding: "10px 12px", verticalAlign: "middle", color: "#36415A", whiteSpace: "nowrap" },
  empty:     { padding: 44, textAlign: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600 },
  invBtn:    { background: "#EFF4FF", color: "#2563EB", border: "none", borderRadius: 7, padding: "3px 9px", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  payBtn:    { background: "#2563EB", color: "#fff", border: "none", borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  finalBtn:  { background: "#15803D", color: "#fff", border: "none", borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  voucherBtn:{ background: "#EFF4FF", color: "#2563EB", border: "1px solid #BFD3FE", borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
};
