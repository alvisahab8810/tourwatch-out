import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdReceipt, MdPerson, MdSave, MdVisibility, MdAdd,
  MdDelete, MdHome, MdClose, MdDownload, MdPrint,
  MdEmail, MdSend, MdCheckCircle, MdAttachMoney,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { isAuthenticated } from "../../utils/voucherAuth";
import InvoicePreview from "../../components/invoice/InvoicePreview";

// ─── Invoice No auto-generation ───────────────────────────────────────────────
function getInvoiceFY() {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
  return m >= 4 ? `${y}-${String(y + 1).slice(2)}` : `${y - 1}-${String(y).slice(2)}`;
}
function buildInvoiceNo(allInvoices) {
  const fy = getInvoiceFY();
  const prefix = `RCSPL/${fy}/`;
  const count = allInvoices.filter((i) => i.invoiceNo?.startsWith(prefix)).length;
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Date.now() + Math.random();
const EMPTY_ITEM = () => ({ id: uid(), particulars: "", hsn: "", qty: "1", rate: "", amount: "" });

function todayStr() {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const DEFAULT_FORM = {
  invoiceNo: "",
  invoiceDate: todayStr(),
  paymentMode: "Online",
  clientName: "", clientAddress: "", clientState: "", clientGstin: "", destination: "",
  items: [EMPTY_ITEM()],
  cgstPct: "5", sgstPct: "5", igstPct: "",
};

export default function CreateInvoice() {
  const router = useRouter();
  const { id: editId } = router.query;
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/dashboard/login"); return; }
    const invoices = JSON.parse(localStorage.getItem("tw_invoices") || "[]");
    if (editId) {
      const found = invoices.find((i) => i.id === editId);
      if (found) { setForm(found); setReady(true); return; }
    }
    setForm((f) => ({ ...f, invoiceNo: buildInvoiceNo(invoices) }));
    setReady(true);
  }, [editId]);

  const set = (key, val) => { setForm((f) => ({ ...f, [key]: val })); setSaved(false); };

  // ── Items ────────────────────────────────────────────────────────────────
  function updateItem(id, key, val) {
    setForm((f) => {
      const updated = f.items.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, [key]: val };
        // Auto-calculate amount from qty × rate
        if (key === "qty" || key === "rate") {
          const q = parseFloat(key === "qty" ? val : next.qty) || 0;
          const r = parseFloat(key === "rate" ? val : next.rate) || 0;
          next.amount = q && r ? String((q * r).toFixed(2)) : "";
        }
        return next;
      });
      return { ...f, items: updated };
    });
    setSaved(false);
  }
  const addItem    = () => setForm((f) => ({ ...f, items: [...f.items, EMPTY_ITEM()] }));
  const removeItem = (id) => setForm((f) => ({ ...f, items: f.items.filter((i) => i.id !== id) }));

  // ── Save ─────────────────────────────────────────────────────────────────
  const saveInvoice = () => {
    setSaving(true);
    const invoices = JSON.parse(localStorage.getItem("tw_invoices") || "[]");
    const invId  = editId || ("twi_" + Date.now());
    const payload = {
      ...form, id: invId,
      createdAt: editId ? (form.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };
    const idx = invoices.findIndex((i) => i.id === invId);
    if (idx >= 0) invoices[idx] = payload;
    else invoices.unshift(payload);
    localStorage.setItem("tw_invoices", JSON.stringify(invoices));
    setForm(payload);
    setTimeout(() => { setSaving(false); setSaved(true); }, 400);
    return payload;
  };

  // ── PDF generation ────────────────────────────────────────────────────────
  async function generatePDF() {
    setPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const wrapEl   = document.getElementById("invoice-pdf-target");
      const footerEl = document.getElementById("invoice-pdf-footer");
      if (!wrapEl) return null;

      const SCALE = 2;
      const pdf   = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // Capture footer separately if it exists
      let footerCanvas = null;
      if (footerEl) {
        footerCanvas = await html2canvas(footerEl, {
          scale: SCALE, useCORS: true, backgroundColor: null, logging: false,
        });
        footerEl.style.display = "none";
      }

      // Smart section boundaries
      const wrapRect = wrapEl.getBoundingClientRect();
      const sectionBounds = Array.from(wrapEl.querySelectorAll("[data-inv-section]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top - wrapRect.top, bottom: r.bottom - wrapRect.top };
      });

      const mainCanvas = await html2canvas(wrapEl, {
        scale: SCALE, useCORS: true, backgroundColor: "#fff", logging: false,
        height: wrapEl.scrollHeight, windowHeight: wrapEl.scrollHeight,
      });
      if (footerEl) footerEl.style.display = "";

      const pxPerMm  = mainCanvas.width / pageW;
      const pagePx   = pageH * pxPerMm;
      const totalPx  = mainCanvas.height;
      const domToCvs = mainCanvas.width / wrapEl.offsetWidth;
      const sectionCvs = sectionBounds.map((s) => ({ top: s.top * domToCvs, bottom: s.bottom * domToCvs }));

      // Compute smart cuts
      const cuts = [0];
      while (true) {
        const last = cuts[cuts.length - 1];
        let next = last + pagePx;
        if (next >= totalPx) break;
        for (const s of sectionCvs) {
          if (next > s.top && next < s.top + 60) { next = s.top; break; }
        }
        if (next <= last) next = last + pagePx;
        cuts.push(next);
      }
      cuts.push(totalPx);

      // Render slices
      const footerImgH = footerCanvas ? (footerCanvas.height / footerCanvas.width) * pageW : 0;

      for (let i = 0; i < cuts.length - 1; i++) {
        if (i > 0) pdf.addPage();
        const sliceTopPx = cuts[i];
        const sliceTallPx = cuts[i + 1] - sliceTopPx;
        const sc = document.createElement("canvas");
        sc.width = mainCanvas.width; sc.height = sliceTallPx;
        sc.getContext("2d").drawImage(mainCanvas, 0, sliceTopPx, mainCanvas.width, sliceTallPx, 0, 0, mainCanvas.width, sliceTallPx);
        pdf.addImage(sc.toDataURL("image/png"), "PNG", 0, 0, pageW, sliceTallPx / pxPerMm);
      }

      // Pin footer
      if (footerCanvas) {
        const lastSlicePx = cuts[cuts.length - 1] - cuts[cuts.length - 2];
        const lastH = lastSlicePx / pxPerMm;
        const rem = pageH - lastH;
        if (rem >= footerImgH) {
          pdf.addImage(footerCanvas.toDataURL("image/png"), "PNG", 0, pageH - footerImgH, pageW, footerImgH);
        } else {
          pdf.addPage();
          pdf.addImage(footerCanvas.toDataURL("image/png"), "PNG", 0, pageH - footerImgH, pageW, footerImgH);
        }
      }
      return pdf;
    } finally {
      setPdfLoading(false);
    }
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
    const msg = encodeURIComponent(
      `Hello ${form.clientName || ""},\n\nYour tax invoice is ready! 🧾\n\nInvoice No: ${form.invoiceNo || "—"}\nDate: ${form.invoiceDate || "—"}\nDestination: ${form.destination || "—"}\n\nPlease find the attached PDF invoice.\nContact us at sales@tourwatchout.com for any query.\n\n— Team TourWatchOut`
    );
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

      // Compute totals for email body
      const items = form.items || [];
      const subTotal = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
      const cgstAmt = form.cgstPct ? (subTotal * parseFloat(form.cgstPct)) / 100 : 0;
      const sgstAmt = form.sgstPct ? (subTotal * parseFloat(form.sgstPct)) / 100 : 0;
      const igstAmt = form.igstPct ? (subTotal * parseFloat(form.igstPct)) / 100 : 0;
      const grandTotal = subTotal + cgstAmt + sgstAmt + igstAmt;
      const fmt = (n) => Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

      const emailBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#e84949;padding:20px;text-align:center">
    <h2 style="color:#fff;margin:0">Tax Invoice — TourWatchOut</h2>
  </div>
  <div style="padding:24px;background:#fff;border:1px solid #eee">
    <p>Dear <strong>${form.clientName || "Customer"}</strong>,</p>
    <p>Please find your tax invoice attached to this email.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:8px;font-weight:bold;color:#555;width:160px">Invoice No.</td><td style="padding:8px">${form.invoiceNo || "—"}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Invoice Date</td><td style="padding:8px">${form.invoiceDate || "—"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#555">Destination</td><td style="padding:8px">${form.destination || "—"}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Total Amount</td><td style="padding:8px;font-weight:bold">₹${fmt(grandTotal)}</td></tr>
    </table>
    <p style="font-size:13px;color:#888">Contact us at <a href="mailto:sales@tourwatchout.com">sales@tourwatchout.com</a></p>
  </div>
  <div style="background:#fff5f5;padding:12px;text-align:center;font-size:12px;color:#888;border-top:2px solid #e84949">
    Team TourWatchOut | Realization Customer Services Private Limited
  </div>
</div>`;

      const res = await fetch("/api/dashboard/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          subject: `Tax Invoice ${form.invoiceNo || ""} — TourWatchOut`,
          html: emailBody, pdfBase64, fileName,
        }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Failed"); }
      setEmailDone(true);
      setTimeout(() => { setShowEmailModal(false); setEmailDone(false); setEmailTo(""); }, 2500);
    } catch (e) {
      setEmailError(e.message || "Something went wrong.");
    } finally {
      setEmailSending(false);
    }
  }

  if (!ready) return null;

  // Derived totals for the form display
  const subTotal = form.items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgstAmt  = form.cgstPct ? (subTotal * parseFloat(form.cgstPct)) / 100 : 0;
  const sgstAmt  = form.sgstPct ? (subTotal * parseFloat(form.sgstPct)) / 100 : 0;
  const igstAmt  = form.igstPct ? (subTotal * parseFloat(form.igstPct)) / 100 : 0;
  const grandTotal = subTotal + cgstAmt + sgstAmt + igstAmt;
  const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <>
      <Head><title>{editId ? "Edit" : "New"} Invoice — TourWatchOut</title></Head>
      <div style={s.page}>

        {/* ── Sidebar ── */}
        <aside style={s.sidebar}>
          <div style={s.sideTop}>
            <img src="/assets/images/logo.png" alt="TW" style={s.sideLogo} />
          </div>
          <div style={s.sideMenu}>
            <button style={s.backBtn} onClick={() => router.push("/dashboard")}>
              <MdHome size={16} /> Dashboard
            </button>
            <div style={s.menuLabel}>INVOICE SECTIONS</div>
            {[
              { href: "#sec-meta",   label: "Invoice Info",   icon: <MdReceipt size={16} /> },
              { href: "#sec-client", label: "Client Details", icon: <MdPerson size={16} /> },
              { href: "#sec-items",  label: "Line Items",     icon: <MdAttachMoney size={16} /> },
            ].map((n) => (
              <a key={n.href} href={n.href} style={s.menuItem}>
                {n.icon} <span>{n.label}</span>
              </a>
            ))}
          </div>
          <div style={s.sideBottom}>
            <div style={s.sideActions}>
              <button onClick={saveInvoice} disabled={saving} style={s.sideBtn}>
                <MdSave size={15} /> {saving ? "…" : "Save"}
              </button>
              <button onClick={() => { saveInvoice(); setShowPreview(true); }} style={{ ...s.sideBtn, ...s.sideBtnRed }}>
                <MdVisibility size={15} /> Preview
              </button>
            </div>
            {saved && <div style={s.savedPill}>✓ Saved</div>}
          </div>
        </aside>

        {/* ── Main form ── */}
        <main style={s.main}>
          <div style={s.topBar}>
            <div>
              <h1 style={s.pageTitle}>{editId ? "Edit Invoice" : "New Tax Invoice"}</h1>
              <p style={s.pageSubtitle}>Fill in details and generate a professional GST invoice</p>
            </div>
            <div style={s.topActions}>
              {saved && <span style={s.savedTag}>✓ Saved</span>}
              <button onClick={() => { saveInvoice(); setShowPreview(true); }} style={s.previewBtn}>
                <MdVisibility size={15} /> Preview & Export
              </button>
            </div>
          </div>

          {/* ── Invoice Info ── */}
          <FormSection id="sec-meta" title="Invoice Information" icon={<MdReceipt />}>
            <TwoCol>
              <Field label="Invoice Number" value={form.invoiceNo} onChange={(v) => set("invoiceNo", v)} placeholder="e.g. RCSPL/2026-27/001" />
              <Field label="Invoice Date" value={form.invoiceDate} onChange={(v) => set("invoiceDate", v)} placeholder="e.g. 05 Apr 2026" />
            </TwoCol>
            <Field label="Mode / Terms of Payment" value={form.paymentMode} onChange={(v) => set("paymentMode", v)} placeholder="e.g. Online / Bank Transfer / Cash" />
          </FormSection>

          {/* ── Client Details ── */}
          <FormSection id="sec-client" title="Client (Bill To)" icon={<MdPerson />}>
            <TwoCol>
              <Field label="Client Name" value={form.clientName} onChange={(v) => set("clientName", v)} placeholder="e.g. Chinmay" />
              <Field label="Client GSTIN" value={form.clientGstin} onChange={(v) => set("clientGstin", v)} placeholder="e.g. 27AAACR0000A1Z1" />
            </TwoCol>
            <TwoCol>
              <Field label="Client Address" value={form.clientAddress} onChange={(v) => set("clientAddress", v)} placeholder="e.g. Shilpa Housing Society, Pune" />
              <Field label="Client State" value={form.clientState} onChange={(v) => set("clientState", v)} placeholder="e.g. Maharashtra" />
            </TwoCol>
            <Field label="Destination" value={form.destination} onChange={(v) => set("destination", v)} placeholder="e.g. North East" />
          </FormSection>

          {/* ── Line Items ── */}
          <FormSection id="sec-items" title="Line Items & Tax" icon={<MdAttachMoney />}>
            {/* Items table header */}
            <div style={s.itemTableHead}>
              <div style={{ flex: 3 }}>Particulars</div>
              <div style={{ flex: 1, textAlign: "center" }}>HSN/SAC</div>
              <div style={{ flex: 1, textAlign: "center" }}>Qty</div>
              <div style={{ flex: 1.5, textAlign: "right" }}>Rate (₹)</div>
              <div style={{ flex: 1.5, textAlign: "right" }}>Amount (₹)</div>
              <div style={{ width: 32 }} />
            </div>

            {form.items.map((item, idx) => (
              <div key={item.id} style={s.itemRow}>
                <div style={{ flex: 3 }}>
                  <input
                    value={item.particulars}
                    onChange={(e) => updateItem(item.id, "particulars", e.target.value)}
                    placeholder="e.g. Tour Package"
                    style={s.itemInput}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input value={item.hsn} onChange={(e) => updateItem(item.id, "hsn", e.target.value)} placeholder="9985" style={{ ...s.itemInput, textAlign: "center" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} placeholder="1" style={{ ...s.itemInput, textAlign: "center" }} />
                </div>
                <div style={{ flex: 1.5 }}>
                  <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, "rate", e.target.value)} placeholder="50000" style={{ ...s.itemInput, textAlign: "right" }} />
                </div>
                <div style={{ flex: 1.5 }}>
                  <input readOnly value={item.amount ? fmt(parseFloat(item.amount)) : ""} placeholder="0.00" style={{ ...s.itemInput, textAlign: "right", background: "#f5f5f5", color: "#333", fontWeight: 600 }} />
                </div>
                <div style={{ width: 32 }}>
                  {form.items.length > 1 && (
                    <button style={s.delItemBtn} onClick={() => removeItem(item.id)}>
                      <MdDelete size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button style={s.addItemBtn} onClick={addItem}>
              <MdAdd size={15} /> Add Line Item
            </button>

            <div style={s.divider} />
            <div style={s.subHeading}>Tax Configuration</div>

            <TwoCol>
              <Field label="CGST %" value={form.cgstPct} onChange={(v) => set("cgstPct", v)} placeholder="e.g. 5" type="number" />
              <Field label="SGST %" value={form.sgstPct} onChange={(v) => set("sgstPct", v)} placeholder="e.g. 5" type="number" />
            </TwoCol>
            <Field label="IGST % (for interstate — leave blank if CGST/SGST applies)" value={form.igstPct} onChange={(v) => set("igstPct", v)} placeholder="e.g. 18 (or leave blank)" type="number" />

            {/* Summary box */}
            <div style={s.summaryBox}>
              <div style={s.summaryTitle}>Invoice Summary</div>
              <div style={s.summaryRow}><span>Sub-total</span><span>₹{fmt(subTotal)}</span></div>
              {cgstAmt > 0  && <div style={s.summaryRow}><span>CGST ({form.cgstPct}%)</span><span>₹{fmt(cgstAmt)}</span></div>}
              {sgstAmt > 0  && <div style={s.summaryRow}><span>SGST ({form.sgstPct}%)</span><span>₹{fmt(sgstAmt)}</span></div>}
              {igstAmt > 0  && <div style={s.summaryRow}><span>IGST ({form.igstPct}%)</span><span>₹{fmt(igstAmt)}</span></div>}
              <div style={s.summaryTotal}><span>Grand Total</span><span>₹{fmt(grandTotal)}</span></div>
            </div>
          </FormSection>

          <div style={s.bottomBar}>
            <button onClick={saveInvoice} disabled={saving} style={s.btnDark}>
              <MdSave size={17} /> {saving ? "Saving…" : "Save Invoice"}
            </button>
            <button onClick={() => { saveInvoice(); setShowPreview(true); }} style={s.btnRed}>
              <MdVisibility size={17} /> Preview & Export
            </button>
          </div>
        </main>
      </div>

      {/* ═══ PREVIEW MODAL ═══ */}
      {showPreview && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setShowPreview(false)}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <span style={s.modalTitle}>🧾 Invoice Preview</span>
              <div style={s.modalActions}>
                <ActionBtn color="#25d366" icon={<FaWhatsapp size={14} />} label="WhatsApp" onClick={handleWhatsApp} disabled={pdfLoading} />
                <ActionBtn color="#ea4335" icon={<MdEmail size={14} />} label="Email" onClick={() => setShowEmailModal(true)} disabled={pdfLoading} />
                <ActionBtn color="#3b82f6" icon={<MdDownload size={14} />} label={pdfLoading ? "…" : "Download"} onClick={handleDownload} disabled={pdfLoading} />
                <ActionBtn color="#7c3aed" icon={<MdPrint size={14} />} label="Print" onClick={handlePrint} disabled={pdfLoading} />
                <button onClick={() => setShowPreview(false)} style={s.closeBtn}><MdClose size={18} /></button>
              </div>
            </div>
            <div style={s.infoBar}>
              <FaWhatsapp size={12} color="#25d366" />
              <span>WhatsApp: PDF downloads first, then WhatsApp Web opens — pick any contact.</span>
            </div>
            <div style={s.modalBody}>
              <div id="invoice-pdf-target">
                <InvoicePreview data={form} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EMAIL MODAL ═══ */}
      {showEmailModal && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setShowEmailModal(false)}>
          <div style={s.emailModal}>
            <div style={s.emailHead}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MdEmail size={18} color="#fff" />
                <span style={{ color: "#fff", fontWeight: 700 }}>Send Invoice via Email</span>
              </div>
              <button onClick={() => setShowEmailModal(false)} style={s.closeBtn}><MdClose size={16} /></button>
            </div>
            <div style={s.emailBody}>
              {emailDone ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <MdCheckCircle size={52} color="#22c55e" />
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#166534", marginTop: 10 }}>Sent successfully!</div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Invoice delivered to {emailTo}</div>
                </div>
              ) : (
                <>
                  <div style={s.fromRow}>
                    <span style={s.fromLabel}>From</span>
                    <span style={s.fromVal}>accounts@tourwatchout.com</span>
                  </div>
                  <label style={s.fieldLabel}>Recipient Email</label>
                  <input
                    type="email" value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="client@example.com"
                    style={s.emailInput}
                    onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                  />
                  <div style={s.invoiceSummaryBox}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 8, textTransform: "uppercase" }}>Invoice Summary</div>
                    <div style={s.eSummRow}><b>Invoice No.:</b> {form.invoiceNo}</div>
                    <div style={s.eSummRow}><b>Client:</b> {form.clientName}</div>
                    <div style={s.eSummRow}><b>Total:</b> ₹{fmt(grandTotal)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>📎 Invoice PDF will be auto-generated and attached.</div>
                  {emailError && <div style={s.emailErr}>{emailError}</div>}
                  <button
                    onClick={handleSendEmail}
                    disabled={emailSending || !emailTo.trim()}
                    style={{ ...s.emailSendBtn, opacity: (emailSending || !emailTo.trim()) ? 0.6 : 1 }}
                  >
                    <MdSend size={15} />
                    {emailSending ? "Sending…" : "Send Invoice Email"}
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

// ─── Reusable UI ──────────────────────────────────────────────────────────────
function FormSection({ id, title, icon, children }) {
  return (
    <div id={id} data-inv-section="true" style={s.section}>
      <div style={s.sectionHead}>
        <span style={s.sectionIcon}>{icon}</span>
        <span style={s.sectionTitle}>{title}</span>
      </div>
      <div style={s.sectionBody}>{children}</div>
    </div>
  );
}
function TwoCol({ children }) { return <div style={s.twoCol}>{children}</div>; }
function Field({ label, value, onChange, placeholder, type = "text", full }) {
  return (
    <div style={{ flex: full ? "1 1 100%" : "1 1 0", minWidth: 0 }}>
      {label && <label style={s.label}>{label}</label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={s.input} />
    </div>
  );
}
function ActionBtn({ color, icon, label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: disabled ? "#888" : color, color: "#fff", border: "none", borderRadius: 7, padding: "8px 13px", fontSize: 13, fontWeight: 600, cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5 }}>
      {icon} {label}
    </button>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { display: "flex", minHeight: "100vh", background: "#f0f2f7", fontFamily: "'DM Sans', sans-serif" },
  sidebar: { width: 230, background: "#1a1a2e", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100, boxShadow: "2px 0 16px rgba(0,0,0,0.2)" },
  sideTop: { padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  sideLogo: { height: 38, objectFit: "contain", filter: "brightness(0) invert(1)" },
  sideMenu: { flex: 1, padding: "16px 12px", overflowY: "auto" },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 7, color: "rgba(255,255,255,0.6)", padding: "8px 12px", fontSize: 13, cursor: "pointer", width: "100%", marginBottom: 16, fontFamily: "inherit" },
  menuLabel: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, padding: "0 4px", marginBottom: 6 },
  menuItem: { display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 7, color: "rgba(255,255,255,0.55)", fontSize: 13.5, fontWeight: 500, textDecoration: "none", marginBottom: 2 },
  sideBottom: { padding: "12px" },
  sideActions: { display: "flex", gap: 8, marginBottom: 8 },
  sideBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 7, color: "#fff", padding: "9px 8px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  sideBtnRed: { background: "#e84949" },
  savedPill: { textAlign: "center", fontSize: 11.5, color: "#4ade80", padding: "4px 0" },
  main: { marginLeft: 230, flex: 1, padding: "28px 36px 60px", minHeight: "100vh" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  pageTitle: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: 0 },
  pageSubtitle: { fontSize: 13, color: "#9ca3af", margin: "5px 0 0" },
  topActions: { display: "flex", alignItems: "center", gap: 10 },
  savedTag: { background: "#dcfce7", color: "#15803d", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600 },
  previewBtn: { background: "#e84949", color: "#fff", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  section: { background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 20, border: "1px solid #e8eaf0" },
  sectionHead: { background: "#e84949", display: "flex", alignItems: "center", gap: 10, padding: "13px 20px" },
  sectionIcon: { color: "#fff", display: "flex", alignItems: "center", fontSize: 18 },
  sectionTitle: { color: "#fff", fontWeight: 700, fontSize: 14.5, flex: 1 },
  sectionBody: { padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 },
  twoCol: { display: "flex", gap: 14 },
  label: { display: "block", fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 },
  input: { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb", color: "#111", fontFamily: "inherit" },
  divider: { height: 1, background: "#f0f0f0", margin: "4px 0" },
  subHeading: { fontSize: 12.5, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.8 },
  // Items
  itemTableHead: { display: "flex", gap: 8, padding: "8px 12px", background: "#f0f2f7", borderRadius: 7, fontSize: 11.5, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, alignItems: "center" },
  itemRow: { display: "flex", gap: 8, alignItems: "center", padding: "4px 0" },
  itemInput: { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 7, padding: "9px 10px", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff", fontFamily: "inherit" },
  delItemBtn: { background: "#fff2f2", border: "none", borderRadius: 6, padding: "8px", cursor: "pointer", color: "#e84949", display: "flex", alignItems: "center" },
  addItemBtn: { display: "flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1.5px dashed #93c5fd", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", justifyContent: "center" },
  summaryBox: { background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "16px 20px" },
  summaryTitle: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 6 },
  summaryTotal: { display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#1a1a2e", borderTop: "1.5px solid #e5e7eb", paddingTop: 10, marginTop: 6 },
  bottomBar: { display: "flex", gap: 12, paddingTop: 10, paddingBottom: 20 },
  btnDark: { background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 },
  btnRed: { background: "#e84949", color: "#fff", border: "none", borderRadius: 8, padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "20px" },
  modal: { background: "#f0f2f7", borderRadius: 16, width: "100%", maxWidth: 780, margin: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.4)", overflow: "hidden" },
  modalHead: { background: "#1a1a2e", padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 },
  modalTitle: { color: "#fff", fontSize: 16, fontWeight: 700 },
  modalActions: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  closeBtn: { background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 7, color: "#fff", padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center" },
  infoBar: { background: "#f0fdf4", padding: "9px 22px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#166534", borderBottom: "1px solid #dcfce7" },
  modalBody: { padding: "24px", overflowY: "auto", maxHeight: "82vh" },
  // Email modal
  emailModal: { background: "#fff", borderRadius: 14, width: "100%", maxWidth: 440, margin: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", overflow: "hidden" },
  emailHead: { background: "#ea4335", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  emailBody: { padding: "22px" },
  fromRow: { display: "flex", alignItems: "center", gap: 8, background: "#f5f5f5", borderRadius: 7, padding: "9px 12px", marginBottom: 14 },
  fromLabel: { fontSize: 11.5, fontWeight: 700, color: "#888" },
  fromVal: { fontSize: 13, color: "#333", fontWeight: 600 },
  fieldLabel: { display: "block", fontSize: 11.5, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 },
  emailInput: { width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "11px 13px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 14 },
  invoiceSummaryBox: { background: "#f9f9f9", border: "1px solid #eee", borderRadius: 8, padding: "12px 14px", marginBottom: 14 },
  eSummRow: { fontSize: 13, color: "#444", marginBottom: 4 },
  emailErr: { background: "#fff2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 7, padding: "10px 13px", fontSize: 13, marginBottom: 12 },
  emailSendBtn: { background: "#ea4335", color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 },
};
