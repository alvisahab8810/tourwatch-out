import { numberToWords } from "../../utils/numberToWords";

const RED  = "#F74C4D";
const DARK = "#1a1a2e";
const GREY = "#6B7280";

// Registered details printed on every invoice.
const COMPANY = {
  legalName: "Realization Customer Services Private Limited",
  address:   "GF, Unit no.-1, Tower 2, Parsvnath Planet, Gomti Nagar, Lucknow-226010",
  tradeName: "Tourwatchout",
  email:     "sales1@tourwatchout.com",
  contact:   "88827 01800",
  gstin:     "09AAICR4934P2ZK",
  pan:       "AAICR4934P",
  state:     "Uttar Pradesh, Code : 09",
};

const BANK = {
  bankName:    "ICICI",
  accountName: "REALIZATION CUSTOMER SERVICES PVT LTD",
  accountNo:   "098505500836",
  ifsc:        "ICIC0008351",
};

export default function InvoicePreview({ data }) {
  const d = data || {};

  // ── Computed amounts ─────────────────────────────────────────────────────
  const items     = d.items || [];
  const is18      = d.gstMode === "18";
  const convFee   = is18 ? (parseFloat(d.convenienceFee) || 0) : 0;
  const subTotal  = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgstAmt   = is18 ? convFee * 0.09 : (d.cgstPct ? (subTotal * parseFloat(d.cgstPct)) / 100 : 0);
  const sgstAmt   = is18 ? convFee * 0.09 : (d.sgstPct ? (subTotal * parseFloat(d.sgstPct)) / 100 : 0);
  const igstAmt   = is18 ? 0 : (d.igstPct ? (subTotal * parseFloat(d.igstPct)) / 100 : 0);
  const gstTotal  = cgstAmt + sgstAmt + igstAmt;
  const afterGst  = subTotal + convFee + gstTotal;
  const tcsAmt    = d.tcsPct   ? (afterGst  * parseFloat(d.tcsPct))   / 100 : 0;
  const grandTotal = afterGst + tcsAmt;
  const amtWords  = numberToWords(grandTotal);

  const fmt = (n) =>
    Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const rupee = (n) => `₹ ${fmt(n)}`;

  const totals = [
    ["Sub Total", rupee(subTotal)],
    ...(convFee > 0 ? [["Convenience Fee", rupee(convFee)]] : []),
    ...(cgstAmt > 0 ? [[`CGST (${is18 ? "9" : d.cgstPct}%)`, rupee(cgstAmt)]] : []),
    ...(sgstAmt > 0 ? [[`SGST (${is18 ? "9" : d.sgstPct}%)`, rupee(sgstAmt)]] : []),
    ...(igstAmt > 0 ? [[`IGST (${d.igstPct}%)`, rupee(igstAmt)]] : []),
    ...((d.tcsPct && tcsAmt > 0) ? [[`TCS u/s 206C(1G) (${d.tcsPct}%)`, rupee(tcsAmt)]] : []),
  ];

  return (
    <div style={iv.wrap}>
      <div style={iv.page}>

        {/* ═══════ HEADER: logo + title ═══════ */}
        <div style={iv.head}>
          <img src="/assets/voucher/logo.png" alt="tourwatchout" style={iv.logoImg} crossOrigin="anonymous" />
          <div style={iv.titleBlock}>
            <div style={iv.title}>Tax Invoice</div>
            <div style={iv.titleRule} />
            <MetaRow label="Invoice No."   value={d.invoiceNo || "—"} />
            <MetaRow label="Invoice Date"  value={d.invoiceDate || "—"} />
          </div>
        </div>

        {/* ═══════ PARTIES ═══════ */}
        <div style={iv.parties}>
          <div style={iv.party}>
            <div style={iv.pName}>{COMPANY.legalName}</div>
            <div style={iv.pAddr}>{COMPANY.address}</div>
            <Row label="Trade Name"    value={COMPANY.tradeName} />
            <Row label="Email"         value={COMPANY.email} />
            <Row label="Contact"       value={COMPANY.contact} />
            <Row label="GSTIN"         value={COMPANY.gstin} />
            <Row label="Company's PAN" value={COMPANY.pan} />
            <Row label="State Name"    value={COMPANY.state} />
          </div>

          <div style={iv.party}>
            <div style={iv.pHead}>
              <span style={iv.pLabel}>Bill To</span>
              <span style={iv.pName}>{d.clientName || "—"}</span>
            </div>
            {d.clientAddress ? <div style={iv.pAddr}>{d.clientAddress}</div> : <div style={{ height: 10 }} />}
            {d.contact     ? <Row label="Contact"     value={d.contact} /> : null}
            <Row label="GSTIN"       value={d.clientGstin || "—"} />
            <Row label="Destination" value={d.destination || "—"} />
            <Row label="State Name"  value={d.clientState || "—"} />
            <Row label="Mode/Terms of Payment" value={d.paymentMode || "Online"} />
          </div>
        </div>

        {/* ═══════ ITEMS TABLE ═══════ */}
        <table style={iv.table}>
          <thead>
            <tr>
              <th style={{ ...iv.th, ...iv.thFirst, textAlign: "left" }}>Description</th>
              <th style={{ ...iv.th, width: 90 }}>HSN/SAC</th>
              <th style={{ ...iv.th, width: 80 }}>Quantity</th>
              <th style={{ ...iv.th, width: 110, textAlign: "right" }}>Unit Price</th>
              <th style={{ ...iv.th, ...iv.thLast, width: 120, textAlign: "right" }}>Taxable Value</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map((item, i) => (
              <tr key={i}>
                <td style={{ ...iv.td, textAlign: "left", fontWeight: 700, color: DARK, fontSize: 12 }}>{item.particulars || "—"}</td>
                <td style={{ ...iv.td, color: GREY }}>{item.hsn || ""}</td>
                <td style={{ ...iv.td, color: GREY }}>{item.qty || ""}</td>
                <td style={{ ...iv.td, textAlign: "right", color: GREY }}>{item.rate ? fmt(item.rate) : "—"}</td>
                <td style={{ ...iv.td, textAlign: "right", fontWeight: 700, color: DARK }}>
                  {item.amount ? fmt(item.amount) : ""}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ ...iv.td, textAlign: "center", color: "#aaa" }}>No items added</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ═══════ TOTALS ═══════ */}
        <div style={iv.sumWrap}>
          <div style={iv.sum}>
            {totals.map(([k, v]) => (
              <div key={k} style={iv.sumRow}>
                <span style={{ color: GREY }}>{k}</span>
                <span style={{ fontWeight: 700, color: DARK }}>{v}</span>
              </div>
            ))}
            <div style={iv.grand}>
              <span>Grand Total</span>
              <span>{rupee(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* ═══════ AMOUNT IN WORDS ═══════ */}
        <div style={iv.words}>
          <span style={{ color: GREY }}>Amount Chargeable (in words)</span>
          <span style={{ fontWeight: 700, color: DARK }}>: {amtWords || "—"}</span>
        </div>

        {/* ═══════ BANK + SIGNATURE ═══════ */}
        <div style={iv.foot}>
          <div style={iv.bankCard}>
            <div style={iv.bankTitle}>Bank Account Details</div>
            <div style={iv.bankCols}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Row label="Bank Name"           value={BANK.bankName}    bold bank />
                <Row label="Account Holder Name" value={BANK.accountName} bold bank />
                <Row label="Account Number"      value={BANK.accountNo}   bold bank />
                <Row label="IFSC"                value={BANK.ifsc}        bold bank />
              </div>
              <div style={iv.qrWrap}>
                <div style={iv.scan}>Scan to pay</div>
                <img src="/assets/voucher/qr.svg" alt="QR" style={iv.qrImg} crossOrigin="anonymous" />
              </div>
            </div>
          </div>

          <div style={iv.signBox}>
            <img src="/assets/voucher/signature.svg" alt="Signature" style={iv.signImg} crossOrigin="anonymous" />
            <div style={iv.signCap}>( DIRECTOR )</div>
            <div style={iv.signFor}>Realization Customer Services Pvt. Ltd.</div>
          </div>
        </div>
      </div>

      {/* ═══════ FOOTER ═══════ */}
      <div id="invoice-pdf-footer" style={iv.footer}>
        <div style={iv.footerInner}>
          <span style={iv.footerQuote}>
            “Think <span style={{ color: RED }}>Travel,</span> Think{" "}
            <span style={{ color: RED }}>Tourwatchout</span>”
          </span>
        </div>
        <div style={iv.footerBar} />
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({ label, value, bold, bank }) {
  return (
    <div style={{ display: "flex", gap: 4, fontSize: 10.5, lineHeight: bank ? 1.4 : 1.9, padding: bank ? "3px 0" : 0 }}>
      <span style={{ color: GREY, flex: `0 0 ${bank ? 108 : 118}px` }}>{label}</span>
      <span style={{ color: GREY }}>:</span>
      <span style={{ color: "#000", flex: 1, fontWeight: bold ? 700 : 400 }}>{value}</span>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, fontSize: 11, padding: "2px 0" }}>
      <span style={{ color: GREY }}>{label}</span>
      <span style={{ color: DARK, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const iv = {
  wrap: {
    fontFamily: "Arial, Helvetica, sans-serif",
    letterSpacing: "0.01px",
    wordSpacing: "0.1px",
    background: "#fff",
    color: DARK,
    maxWidth: 720,
    margin: "0 auto",
    border: "1px solid #ddd",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  page: { padding: "32px 32px 18px" },

  // Header
  head: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 },
  logoImg: { maxWidth: 150, maxHeight: 90, width: "auto", height: "auto", display: "block" },
  titleBlock: { minWidth: 190 },
  title: { fontSize: 24, fontWeight: 900, color: RED, lineHeight: "30px", letterSpacing: "normal" },
  titleRule: { height: 2, background: RED, margin: "8px 0 10px" },

  // Parties
  parties: { display: "flex", gap: 14, marginTop: 24 },
  party: {
    flex: "1 1 0", minWidth: 0, background: "#F9F9F9", border: "1px solid #DFDFDF",
    borderRadius: 10, padding: "16px 16px 14px",
  },
  pHead: { display: "flex", alignItems: "baseline", gap: 10 },
  pLabel: { color: RED, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" },
  pName: { color: DARK, fontSize: 12.5, fontWeight: 800, lineHeight: 1.3, letterSpacing: "normal" },
  pAddr: { color: "#000", fontSize: 10.5, lineHeight: 1.55, margin: "6px 0 10px" },

  // Table
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, marginTop: 24 },
  th: {
    background: "#F3F4F8", color: DARK, fontSize: 11, fontWeight: 700,
    padding: "11px 12px", textAlign: "center",
  },
  thFirst: { borderRadius: "6px 0 0 6px" },
  thLast:  { borderRadius: "0 6px 6px 0" },
  td: {
    padding: "12px 12px", fontSize: 11.5, color: "#333",
    borderBottom: "1px solid #E7E7E7", textAlign: "center", verticalAlign: "top",
  },

  // Totals
  sumWrap: { display: "flex", justifyContent: "flex-end", marginTop: 14 },
  sum: { width: 290 },
  sumRow: { display: "flex", justifyContent: "space-between", fontSize: 11.5, padding: "6px 0" },
  grand: {
    display: "flex", justifyContent: "space-between", marginTop: 8,
    background: "#F3F4F8", borderRadius: 6, padding: "10px 12px",
    fontSize: 14, fontWeight: 800, color: DARK,
  },

  // Amount in words
  words: { display: "flex", gap: 6, flexWrap: "wrap", fontSize: 11.5, marginTop: 20, lineHeight: 1.5 },

  // Bank + signature
  foot: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginTop: 34 },
  bankCard: {
    flex: "0 0 400px", background: "#F9F9F9", border: "1px solid #DFDFDF",
    borderRadius: 8, padding: "12px 14px 13px",
  },
  bankTitle: { color: DARK, fontSize: 11, fontWeight: 800, marginBottom: 6 },
  bankCols: { display: "flex", alignItems: "center", gap: 12 },
  qrWrap: { flex: "0 0 auto", textAlign: "center" },
  scan: { color: RED, fontSize: 9.5, fontWeight: 800, marginBottom: 5 },
  qrImg: { display: "block", width: 64, height: 64, margin: "0 auto" },
  signBox: { flex: "0 0 auto", width: 220, textAlign: "center" },
  signImg: { display: "block", margin: "0 auto", maxHeight: 80, maxWidth: 180, width: "auto", height: "auto" },
  signCap: { color: RED, fontSize: 10, fontWeight: 800, letterSpacing: "0.04em", marginTop: 4 },
  signFor: { color: DARK, fontSize: 11, fontWeight: 700, marginTop: 3 },

  // Footer
  footer: { marginTop: 0 },
  footerInner: { background: "#fff", padding: "18px 24px 16px", textAlign: "center" },
  footerQuote: { fontSize: 20, fontWeight: 700, color: DARK },
  footerBar: { height: 6, background: RED },
};
