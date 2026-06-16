import { useState, useEffect, useRef } from "react";
import {
  MdReceipt, MdPerson, MdSave, MdVisibility, MdAdd,
  MdDelete, MdClose, MdDownload, MdPrint, MdEmail, MdSend,
  MdCheckCircle, MdAttachMoney,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import InvoicePreview from "../invoice/InvoicePreview";
import { calcQ } from "./QuotationBuilder";

/* ─── helpers (identical to create-invoice.js) ─────────────────────────── */
function parseToISO(s) {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s); if (isNaN(d)) return "";
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function isoToDisplay(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00"); if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function todayStr() {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
/* A real Date for an invoice-date display string, falling back to "now" if blank/unparsable. */
function dateOf(displayDate) {
  const iso = parseToISO(displayDate);
  const d = iso ? new Date(iso + "T00:00:00") : new Date();
  return isNaN(d) ? new Date() : d;
}

/* ─── Invoice No auto-generation — same RCSPL/<FY>/<seq> ledger used in
   create-invoice.js, so both flows continue one shared numbering sequence
   instead of forking off into a separate "TWO-INV-XXXX" scheme. ─── */
function getInvoiceFY(d) {
  const dt = d instanceof Date && !isNaN(d) ? d : new Date();
  const y = dt.getFullYear(), m = dt.getMonth() + 1;
  return m >= 4 ? `${y}-${String(y + 1).slice(2)}` : `${y - 1}-${String(y).slice(2)}`;
}
function buildInvoiceNo(allInvoices, forDate) {
  const fy = getInvoiceFY(forDate);
  const prefix = `RCSPL/${fy}/`;
  const count = (allInvoices || []).filter(i => i.invoiceNo?.startsWith(prefix)).length;
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}
const uid = () => Date.now() + Math.random();
const EMPTY_ITEM = () => ({ id: uid(), particulars: "", hsn: "9985", qty: "1", rate: "", amount: "" });

/* No. of pax — taken from the quotation's flight headcount first (most likely to be
   up to date), falling back to the lead's BRR adults+children, else blank/1 */
function derivePax(lead, quotation) {
  const fromQuote = quotation?.flights?.[0]?.pax;
  if (fromQuote) return String(fromQuote);
  const brr = lead?.brr || {};
  const fromBrr = (brr.adults || 0) + (brr.children || 0);
  if (fromBrr) return String(fromBrr);
  return "1";
}

/* Build pre-fill from quotation + lead */
function buildDefault(prefill) {
  const { lead, quotation, leadDisplayId, quotationDisplayId } = prefill || {};
  const q = quotation ? calcQ(quotation) : null;
  const isIntl = quotation?.type === "International";
  const gstHalf = quotation?.gstPct ? String(quotation.gstPct / 2) : "";
  const pax = derivePax(lead, quotation);

  // Rate is intentionally left blank (not auto-filled) — Amount is the fixed package
  // price and does not get recalculated off Qty/Rate (see updateItem below).
  const items = q
    ? [{ id: uid(), particulars: `${lead?.destination || quotation?.destination || "Tour"} Package`, hsn: "9985", qty: pax, rate: "", amount: String(Math.round(q.base)) }]
    : [EMPTY_ITEM()];

  return {
    invoiceNo:     "",
    invoiceDate:   todayStr(),
    paymentMode:   "Online",
    clientName:    lead?.name || "",
    clientAddress: "",
    clientState:   "",
    clientGstin:   "",
    destination:   lead?.destination || "",
    contact:       lead?.phone || "",
    items,
    cgstPct: isIntl ? "" : gstHalf,
    sgstPct: isIntl ? "" : gstHalf,
    igstPct: "",
    tcsPct:  isIntl ? String(quotation?.tcsPct || "") : "",
    // CRM links (stored in DB)
    leadId:        lead?._id || "",
    quotationId:   quotation?._id || "",
    quotationNo:   quotation?.quotationNo || quotationDisplayId || "",
    leadDisplayId: leadDisplayId || "",
  };
}

export default function InvoiceBuilder({ prefill, invoiceData, isNew, onClose, onSaved }) {
  const [form,           setForm]           = useState(() => invoiceData ? { ...invoiceData } : buildDefault(prefill));
  const [showPreview,    setShowPreview]    = useState(false);
  const [saving,         setSaving]        = useState(false);
  const [saved,          setSaved]         = useState(false);
  const [pdfLoading,     setPdfLoading]    = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo,        setEmailTo]       = useState(prefill?.lead?.email || "");
  const [emailSending,   setEmailSending]  = useState(false);
  const [emailDone,      setEmailDone]     = useState(false);
  const [emailError,     setEmailError]    = useState("");

  /* Auto-generate invoice number on the RCSPL/<FY>/<seq> ledger — and
     re-generate it whenever the user changes the Invoice Date across a
     financial-year boundary (1 Apr), so the FY portion and sequence stay correct. */
  const invNoFyRef = useRef(getInvoiceFY(dateOf(form.invoiceDate)));
  useEffect(() => {
    if (!isNew) return;
    const fy = getInvoiceFY(dateOf(form.invoiceDate));
    if (fy === invNoFyRef.current && form.invoiceNo) return; // same FY, already numbered
    invNoFyRef.current = fy;
    fetch("/api/dashboard/invoices")
      .then(r => r.json())
      .then(all => {
        setForm(f => ({ ...f, invoiceNo: buildInvoiceNo(Array.isArray(all) ? all : [], dateOf(f.invoiceDate)) }));
      })
      .catch(() => {});
  }, [isNew, form.invoiceDate]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false); };

  /* Items — Qty, Rate and Amount are independent, manually-controlled fields.
     Amount is the fixed package price and is never recalculated off Qty/Rate, so
     changing the pax count (Qty) never bumps the price. */
  function updateItem(id, key, val) {
    setForm(f => ({
      ...f,
      items: f.items.map(item => item.id === id ? { ...item, [key]: val } : item),
    }));
    setSaved(false);
  }
  const addItem    = () => setForm(f => ({ ...f, items: [...f.items, EMPTY_ITEM()] }));
  const removeItem = id  => setForm(f => ({ ...f, items: f.items.filter(i => i.id !== id) }));

  /* Internal save — updates DB + local state, does NOT call onSaved (parent never unmounts this modal) */
  async function saveLocal() {
    setSaving(true);
    try {
      const currentId = form.id || form._id;
      let result;
      if (currentId && !isNew) {
        const r = await fetch(`/api/dashboard/invoices/${currentId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        });
        result = await r.json();
      } else {
        const r = await fetch("/api/dashboard/invoices", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        });
        result = await r.json();
      }
      if (result && !result.error) {
        setForm(prev => ({ ...prev, ...result }));
        setSaved(true);
      }
      return result;
    } catch { return null; }
    finally { setSaving(false); }
  }

  /* Explicit save (Save button) — also notifies parent so list refreshes */
  async function saveInvoice() {
    const result = await saveLocal();
    if (result && !result.error) onSaved?.(result);
    return result;
  }

  /* PDF */
  async function generatePDF() {
    setPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const wrapEl = document.getElementById("inv-modal-pdf-target");
      if (!wrapEl) return null;
      const SCALE = 2;
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const patchClone = doc => {
        const st = doc.createElement("style");
        st.textContent = "* { font-family: Arial, Helvetica, sans-serif !important; }";
        doc.head.appendChild(st);
      };
      const canvas = await html2canvas(wrapEl, { scale: SCALE, useCORS: true, backgroundColor: "#fff", logging: false, height: wrapEl.scrollHeight, windowHeight: wrapEl.scrollHeight, onclone: patchClone });
      const pxPerMm = canvas.width / pageW;
      const pagePx = pageH * pxPerMm;
      const cuts = [0];
      while (true) {
        const last = cuts[cuts.length - 1];
        const next = last + pagePx;
        if (next >= canvas.height) break;
        cuts.push(next);
      }
      cuts.push(canvas.height);
      for (let i = 0; i < cuts.length - 1; i++) {
        if (i > 0) pdf.addPage();
        const sliceH = cuts[i + 1] - cuts[i];
        const sc = document.createElement("canvas");
        sc.width = canvas.width; sc.height = sliceH;
        sc.getContext("2d").drawImage(canvas, 0, cuts[i], canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        pdf.addImage(sc.toDataURL("image/png"), "PNG", 0, 0, pageW, sliceH / pxPerMm);
      }
      return pdf;
    } finally { setPdfLoading(false); }
  }

  async function handleDownload() {
    const pdf = await generatePDF();
    if (pdf) pdf.save(`invoice-${form.invoiceNo?.replace(/\//g, "_") || Date.now()}.pdf`);
  }
  async function handlePrint() {
    const pdf = await generatePDF();
    if (!pdf) return;
    const url = URL.createObjectURL(pdf.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  }
  async function handleWhatsApp() {
    await handleDownload();
    const msg = encodeURIComponent(`Hello ${form.clientName || ""},\n\nYour tax invoice is ready! 🧾\nInvoice No: ${form.invoiceNo}\nTotal: ₹${fmt(grandTotal)}\n\n— Team Tourwatchout`);
    window.open(`https://web.whatsapp.com/send?text=${msg}`, "_blank");
  }
  async function handleSendEmail() {
    if (!emailTo.trim()) return;
    setEmailSending(true); setEmailError("");
    try {
      const pdf = await generatePDF();
      if (!pdf) throw new Error("PDF generation failed");
      const pdfBase64 = pdf.output("datauristring").split(",")[1];
      const fileName = `invoice-${form.invoiceNo?.replace(/\//g, "_") || "tw"}.pdf`;
      const emailBody = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#e84949;padding:20px;text-align:center"><h2 style="color:#fff;margin:0">Tax Invoice — Tourwatchout</h2></div><div style="padding:24px;background:#fff;border:1px solid #eee"><p>Dear <strong>${form.clientName || "Customer"}</strong>,</p><p>Please find your tax invoice attached.</p><table style="width:100%;border-collapse:collapse;margin:16px 0"><tr><td style="padding:8px;font-weight:bold;color:#555">Invoice No.</td><td style="padding:8px">${form.invoiceNo || "—"}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Date</td><td style="padding:8px">${form.invoiceDate || "—"}</td></tr><tr><td style="padding:8px;font-weight:bold;color:#555">Total</td><td style="padding:8px;font-weight:bold">₹${fmt(grandTotal)}</td></tr></table></div></div>`;
      const res = await fetch("/api/dashboard/send-invoice", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo, subject: `Tax Invoice ${form.invoiceNo} — Tourwatchout`, html: emailBody, pdfBase64, fileName }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Failed"); }
      setEmailDone(true);
      setTimeout(() => { setShowEmailModal(false); setEmailDone(false); setEmailTo(""); }, 2500);
    } catch (e) { setEmailError(e.message || "Something went wrong."); }
    finally { setEmailSending(false); }
  }

  /* Totals */
  const subTotal   = form.items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgstAmt    = form.cgstPct ? (subTotal * parseFloat(form.cgstPct)) / 100 : 0;
  const sgstAmt    = form.sgstPct ? (subTotal * parseFloat(form.sgstPct)) / 100 : 0;
  const igstAmt    = form.igstPct ? (subTotal * parseFloat(form.igstPct)) / 100 : 0;
  const afterGst   = subTotal + cgstAmt + sgstAmt + igstAmt;
  const tcsAmt     = form.tcsPct ? (afterGst * parseFloat(form.tcsPct)) / 100 : 0;
  const grandTotal = afterGst + tcsAmt;
  const fmt = n => Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  const invId   = form.invoiceNo || "RCSPL/????/???";
  const chainTxt = [prefill?.quotationDisplayId || form.quotationNo, prefill?.leadDisplayId || form.leadDisplayId].filter(Boolean).join(" and ");

  return (
    <>
      {/* ══ Main builder modal ══ */}
      <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={s.modal}>
          {/* Header */}
          <div style={s.head}>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
                {isNew ? "New Tax Invoice" : "Edit Invoice"} · {invId}
              </div>
              {chainTxt && (
                <div style={{ fontSize: 12, color: "#BFD3FE", marginTop: 3, fontWeight: 600 }}>
                  Chained to {chainTxt} · {prefill?.lead?.name || form.clientName || ""}
                </div>
              )}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              {saved && <span style={s.savedTag}>✓ Saved</span>}
              <button onClick={() => setShowPreview(true)} style={s.previewBtn}>
                <MdVisibility size={14} /> Preview
              </button>
              <button style={s.x} onClick={onClose}>✕</button>
            </div>
          </div>

          {/* Body */}
          <div style={s.body}>

            {/* ── Invoice Info ── */}
            <FormSec title="Invoice Information" icon={<MdReceipt />}>
              <div style={g3}>
                <Fld label="Invoice Number" value={form.invoiceNo} onChange={v => set("invoiceNo", v)} placeholder="RCSPL/2026-27/001" />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={s.lbl}>Invoice Date</label>
                  <input type="date" style={s.inp} value={parseToISO(form.invoiceDate)} onChange={e => set("invoiceDate", isoToDisplay(e.target.value))} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={s.lbl}>Mode / Terms of Payment</label>
                  <select style={s.inp} value={form.paymentMode} onChange={e => set("paymentMode", e.target.value)}>
                    {["Online", "Bank Transfer", "Cash", "UPI", "Cheque", "NEFT / RTGS"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </FormSec>

            {/* ── Client ── */}
            <FormSec title="Client (Bill To)" icon={<MdPerson />}>
              <div style={g2}>
                <Fld label="Client Name"            value={form.clientName}    onChange={v => set("clientName",    v)} placeholder="Full name" />
                <Fld label="Client GSTIN (Optional)" value={form.clientGstin}  onChange={v => set("clientGstin",  v)} placeholder="27AAACR0000A1Z1" />
              </div>
              <div style={g2}>
                <Fld label="Client Address" value={form.clientAddress} onChange={v => set("clientAddress", v)} placeholder="House no, area, city" />
                <Fld label="Client State"   value={form.clientState}   onChange={v => set("clientState",   v)} placeholder="Uttar Pradesh" />
              </div>
              <div style={g2}>
                <Fld label="Destination" value={form.destination} onChange={v => set("destination", v)} placeholder="Kashmir, Goa…" />
                <Fld label="Contact"     value={form.contact}     onChange={v => set("contact",     v)} placeholder="+91 98765 43210" />
              </div>
            </FormSec>

            {/* ── Line Items ── */}
            <FormSec title="Line Items and Tax" icon={<MdAttachMoney />}>
              <div style={s.itmHead}>
                <div style={{ flex: 3 }}>Particulars</div>
                <div style={{ flex: 1, textAlign: "center" }}>HSN/SAC</div>
                <div style={{ flex: 1, textAlign: "center" }}>Qty</div>
                <div style={{ flex: 1.5, textAlign: "right" }}>Rate (₹)</div>
                <div style={{ flex: 1.5, textAlign: "right" }}>Amount (₹)</div>
                <div style={{ width: 32 }} />
              </div>

              {form.items.map(item => (
                <div key={item.id} style={s.itmRow}>
                  <div style={{ flex: 3 }}><input value={item.particulars} onChange={e => updateItem(item.id, "particulars", e.target.value)} placeholder="Tour Package" style={s.itmInp} /></div>
                  <div style={{ flex: 1 }}><input value={item.hsn} onChange={e => updateItem(item.id, "hsn", e.target.value)} placeholder="9985" style={{ ...s.itmInp, textAlign: "center" }} /></div>
                  <div style={{ flex: 1 }}><input type="number" value={item.qty} onChange={e => updateItem(item.id, "qty", e.target.value)} placeholder="1" style={{ ...s.itmInp, textAlign: "center" }} /></div>
                  <div style={{ flex: 1.5 }}><input type="number" value={item.rate} onChange={e => updateItem(item.id, "rate", e.target.value)} placeholder="-" style={{ ...s.itmInp, textAlign: "right" }} /></div>
                  <div style={{ flex: 1.5 }}><input type="number" value={item.amount} onChange={e => updateItem(item.id, "amount", e.target.value)} placeholder="0.00" style={{ ...s.itmInp, textAlign: "right", fontWeight: 700 }} /></div>
                  <div style={{ width: 32 }}>
                    {form.items.length > 1 && (
                      <button style={s.itmDel} onClick={() => removeItem(item.id)}><MdDelete size={14} /></button>
                    )}
                  </div>
                </div>
              ))}

              <button style={s.addItm} onClick={addItem}><MdAdd size={15} /> Add Line Item</button>

              <div style={s.divider} />
              <div style={s.subHead}>Tax Configuration (GST)</div>
              <div style={s.note}>Domestic: CGST + SGST. Interstate: IGST only. Leave unused fields blank.</div>
              <div style={g2}>
                <Fld label="CGST %" value={form.cgstPct} onChange={v => set("cgstPct", v)} placeholder="2.5" inputMode="decimal" />
                <Fld label="SGST %" value={form.sgstPct} onChange={v => set("sgstPct", v)} placeholder="2.5" inputMode="decimal" />
              </div>
              <Fld label="IGST % (leave blank if CGST+SGST applies)" value={form.igstPct} onChange={v => set("igstPct", v)} placeholder="e.g. 18 or blank" inputMode="decimal" />

              <div style={s.divider} />
              <div style={s.subHead}>TCS — Tax Collected at Source</div>
              <div style={s.note}>Applicable for international packages u/s 206C(1G). Enter 5% (≤₹7L) or 20% (above ₹7L), or leave blank.</div>
              <Fld label="TCS % (leave blank if not applicable)" value={form.tcsPct} onChange={v => set("tcsPct", v)} placeholder="5 or blank" inputMode="decimal" />

              {/* Summary */}
              <div style={s.sumBox}>
                <div style={s.sumTitle}>Invoice Summary</div>
                <SumRow l="Sub-total (before tax)"    v={`₹${fmt(subTotal)}`} />
                {cgstAmt > 0 && <SumRow l={`CGST @ ${form.cgstPct}%`} v={`₹${fmt(cgstAmt)}`} />}
                {sgstAmt > 0 && <SumRow l={`SGST @ ${form.sgstPct}%`} v={`₹${fmt(sgstAmt)}`} />}
                {igstAmt > 0 && <SumRow l={`IGST @ ${form.igstPct}%`} v={`₹${fmt(igstAmt)}`} />}
                {tcsAmt  > 0 && <SumRow l={`TCS @ ${form.tcsPct}% u/s 206C(1G)`} v={`₹${fmt(tcsAmt)}`} vc="#b45309" />}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#1a1a2e", borderTop: "1.5px solid #e5e7eb", paddingTop: 10, marginTop: 6 }}>
                  <span>Grand Total</span><span>₹{fmt(grandTotal)}</span>
                </div>
              </div>
            </FormSec>
          </div>

          {/* Footer */}
          <div style={s.foot}>
            <button style={s.fb} onClick={onClose}>Cancel</button>
            <button style={s.fb} onClick={() => setShowEmailModal(true)}><MdEmail size={14} /> Email</button>
            <button style={{ ...s.fb, background: "#25d366", color: "#fff", border: "none" }} onClick={handleWhatsApp} disabled={pdfLoading}>
              <FaWhatsapp size={14} /> WhatsApp
            </button>
            <button style={{ ...s.fb, background: "#2563eb", color: "#fff", border: "none", opacity: saving ? 0.7 : 1 }} onClick={saveInvoice} disabled={saving}>
              <MdSave size={14} /> {saving ? "Saving…" : "Save Invoice"}
            </button>
          </div>
        </div>
      </div>

      {/* ══ Preview modal ══ */}
      {showPreview && (
        <div style={{ ...s.overlay, zIndex: 101 }} onClick={e => { if (e.target === e.currentTarget) setShowPreview(false); }}>
          <div style={{ ...s.modal, maxWidth: 780 }}>
            <div style={{ background: "#1a1a2e", padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderRadius: "18px 18px 0 0" }}>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>🧾 Invoice Preview · {invId}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Abtn color="#25d366" icon={<FaWhatsapp size={13} />} label="WhatsApp"    onClick={handleWhatsApp} loading={pdfLoading} />
                <Abtn color="#ea4335" icon={<MdEmail    size={13} />} label="Email"       onClick={() => setShowEmailModal(true)} />
                <Abtn color="#3b82f6" icon={<MdDownload size={13} />} label={pdfLoading ? "…" : "Download"} onClick={handleDownload} loading={pdfLoading} />
                <Abtn color="#7c3aed" icon={<MdPrint    size={13} />} label="Print"       onClick={handlePrint} loading={pdfLoading} />
                <button onClick={() => setShowPreview(false)} style={s.closeBtn}><MdClose size={18} /></button>
              </div>
            </div>
            <div style={{ padding: 24, overflowY: "auto", maxHeight: "78vh" }}>
              <div id="inv-modal-pdf-target"><InvoicePreview data={form} /></div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Email modal ══ */}
      {showEmailModal && (
        <div style={{ ...s.overlay, zIndex: 102 }} onClick={e => { if (e.target === e.currentTarget) setShowEmailModal(false); }}>
          <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 440, margin: "auto", boxShadow: "0 24px 60px rgba(0,0,0,.35)", overflow: "hidden" }}>
            <div style={{ background: "#ea4335", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700 }}>Send Invoice via Email</span>
              <button onClick={() => setShowEmailModal(false)} style={s.closeBtn}><MdClose size={16} /></button>
            </div>
            <div style={{ padding: 22 }}>
              {emailDone ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <MdCheckCircle size={52} color="#22c55e" />
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#166534", marginTop: 10 }}>Sent successfully!</div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Invoice delivered to {emailTo}</div>
                </div>
              ) : (
                <>
                  <label style={s.lbl}>Recipient Email</label>
                  <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="client@example.com" style={{ ...s.inp, marginBottom: 14 }} onKeyDown={e => e.key === "Enter" && handleSendEmail()} />
                  <div style={{ background: "#f9f9f9", border: "1px solid #eee", borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 6 }}>Summary</div>
                    <div style={{ fontSize: 13, color: "#444", marginBottom: 3 }}><b>Invoice:</b> {form.invoiceNo}</div>
                    <div style={{ fontSize: 13, color: "#444", marginBottom: 3 }}><b>Client:</b> {form.clientName}</div>
                    <div style={{ fontSize: 13, color: "#444" }}><b>Total:</b> ₹{fmt(grandTotal)}</div>
                  </div>
                  {emailError && <div style={{ background: "#fff2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 7, padding: "10px 13px", fontSize: 13, marginBottom: 12 }}>{emailError}</div>}
                  <button onClick={handleSendEmail} disabled={emailSending || !emailTo.trim()} style={{ background: "#ea4335", color: "#fff", border: "none", borderRadius: 8, padding: 13, fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, opacity: (emailSending || !emailTo.trim()) ? 0.6 : 1 }}>
                    <MdSend size={15} /> {emailSending ? "Sending…" : "Send Invoice Email"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ── */
function FormSec({ title, icon, children }) {
  return (
    <div style={s.sec}>
      <div style={s.secHead}><span style={{ color: "#fff", display: "flex", alignItems: "center", fontSize: 18 }}>{icon}</span><span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{title}</span></div>
      <div style={s.secBody}>{children}</div>
    </div>
  );
}
function Fld({ label, value, onChange, placeholder, inputMode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={s.lbl}>{label}</label>}
      <input inputMode={inputMode} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s.inp} />
    </div>
  );
}
function SumRow({ l, v, vc }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 6 }}><span>{l}</span><b style={{ color: vc || "#111" }}>{v}</b></div>;
}
function Abtn({ color, icon, label, onClick, loading }) {
  return <button onClick={onClick} disabled={loading} style={{ background: loading ? "#888" : color, color: "#fff", border: "none", borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5 }}>{icon} {label}</button>;
}

const g2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 };
const g3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 };

const s = {
  overlay:  { position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(3px)", zIndex: 96, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "20px 18px" },
  modal:    { background: "#f0f2f7", borderRadius: 18, boxShadow: "0 10px 40px rgba(15,27,51,.2)", width: "100%", maxWidth: 900, margin: "auto" },
  head:     { display: "flex", alignItems: "center", gap: 12, padding: "15px 22px", background: "#2563eb", borderRadius: "18px 18px 0 0" },
  x:        { background: "rgba(255,255,255,.18)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 8, fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", flexShrink: 0 },
  body:     { padding: "20px 22px", maxHeight: "70vh", overflowY: "auto" },
  foot:     { display: "flex", gap: 8, justifyContent: "flex-end", padding: "14px 22px", borderTop: "1px solid #E4E9F2", background: "#fff", borderRadius: "0 0 18px 18px", flexWrap: "wrap" },
  fb:       { padding: "9px 16px", border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit" },
  savedTag: { background: "#dcfce7", color: "#15803d", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 },
  previewBtn:{ background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.3)", color: "#fff", borderRadius: 8, padding: "7px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 },
  closeBtn: { background: "rgba(255,255,255,.12)", border: "none", borderRadius: 7, color: "#fff", padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center" },
  sec:      { background: "#fff", borderRadius: 12, overflow: "hidden", marginBottom: 16, border: "1px solid #e8eaf0", boxShadow: "0 1px 6px rgba(0,0,0,.05)" },
  secHead:  { background: "#2563eb", display: "flex", alignItems: "center", gap: 10, padding: "12px 18px" },
  secBody:  { padding: "18px 18px 14px" },
  lbl:      { display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: .5 },
  inp:      { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb", color: "#111", fontFamily: "inherit" },
  divider:  { height: 1, background: "#f0f0f0", margin: "10px 0" },
  subHead:  { fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: .8, marginBottom: 4 },
  note:     { fontSize: 11, color: "#6b7280", fontStyle: "italic", marginBottom: 12 },
  itmHead:  { display: "flex", gap: 8, padding: "8px 12px", background: "#f0f2f7", borderRadius: 7, fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 },
  itmRow:   { display: "flex", gap: 8, alignItems: "center", marginBottom: 6 },
  itmInp:   { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 7, padding: "9px 10px", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff", fontFamily: "inherit" },
  itmDel:   { background: "#fff2f2", border: "none", borderRadius: 6, padding: 7, cursor: "pointer", color: "#e84949", display: "flex", alignItems: "center" },
  addItm:   { display: "flex", alignItems: "center", gap: 6, justifyContent: "center", background: "#eff6ff", color: "#2563eb", border: "1.5px dashed #93c5fd", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 10 },
  sumBox:   { background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "16px 20px", marginTop: 12 },
  sumTitle: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 },
};
