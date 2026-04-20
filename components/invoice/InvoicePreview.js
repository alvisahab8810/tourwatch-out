import { numberToWords } from "../../utils/numberToWords";

const RED  = "#e84949";
const DARK = "#1a1a2e";
const BLUE = "#2563eb";

export default function InvoicePreview({ data }) {
  const d = data || {};

  // ── Computed amounts ─────────────────────────────────────────────────────
  const items = d.items || [];
  const subTotal  = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgstAmt   = d.cgstPct  ? (subTotal * parseFloat(d.cgstPct))  / 100 : 0;
  const sgstAmt   = d.sgstPct  ? (subTotal * parseFloat(d.sgstPct))  / 100 : 0;
  const igstAmt   = d.igstPct  ? (subTotal * parseFloat(d.igstPct))  / 100 : 0;
  const grandTotal = subTotal + cgstAmt + sgstAmt + igstAmt;
  const amtWords  = numberToWords(grandTotal);

  const fmt = (n) =>
    Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={iv.wrap}>

      {/* ═══════ TOP RED STRIP ═══════ */}
      <div style={iv.topStrip} />

      {/* ═══════ TITLE ═══════ */}
      <div style={iv.titleRow}>
        <h1 style={iv.title}>Tax Invoice</h1>
      </div>

      {/* ═══════ COMPANY HEADER ═══════ */}
      <div style={iv.companyHeader}>
        {/* Left: company info */}
        <div style={iv.companyLeft}>
          <div style={iv.companyName}>Realization Customer Services Private Limited</div>
          <table style={iv.infoTable}>
            <tbody>
              <CRow label="Trade Name"    value="Tourwatchout" />
              <CRow label="Email"         value="sales@tourwatchout.com" />
              <CRow label="GSTIN"         value="09AANA63481P2ZK" />
              <CRow label="Company's PAN" value="AACR4934P" />
              <CRow label="State Name"    value="Uttar Pradesh, Code: 09" />
              <CRow label="Address"       value="Regency Rd, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010" />
            </tbody>
          </table>
        </div>

        {/* Right: logo */}
        <div style={iv.companyRight}>
          <img
            src="/assets/voucher/logo.png"
            alt="tourwatchout"
            style={iv.logoImg}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      <div style={iv.divider} />

      {/* ═══════ INVOICE META ═══════ */}
      <div style={iv.metaRow}>
        <div style={iv.metaCell}>
          <span style={iv.metaLabel}>Invoice number</span>
          <span style={iv.metaVal}>{d.invoiceNo || "—"}</span>
        </div>
        <div style={{ ...iv.metaCell, textAlign: "center" }}>
          <span style={iv.metaLabel}>Invoice date</span>
          <span style={iv.metaVal}>{d.invoiceDate || "—"}</span>
        </div>
        <div style={{ ...iv.metaCell, textAlign: "right" }}>
          <span style={iv.metaLabel}>Mode/Terms of Payment</span>
          <span style={iv.metaVal}>{d.paymentMode || "Online"}</span>
        </div>
      </div>

      <div style={iv.divider} />

      {/* ═══════ BILL TO ═══════ */}
      <div style={iv.billToSection}>
        <div style={iv.billToHead}>
          <span style={iv.billToIcon}>👤</span>
          <span style={iv.billToLabel}>Bill To:</span>
        </div>
        <div style={iv.billToGrid}>
          <div style={iv.billToLeft}>
            <BillRow label="Name"       value={d.clientName} />
            <BillRow label="Address"    value={d.clientAddress} />
            <BillRow label="State Name" value={d.clientState} />
          </div>
          <div style={iv.billToRight}>
            <BillRow label="GSTIN"       value={d.clientGstin} />
            <BillRow label="Destination" value={d.destination} />
          </div>
        </div>
      </div>

      <div style={iv.divider} />

      {/* ═══════ ITEMS TABLE ═══════ */}
      <table style={iv.table}>
        <thead>
          <tr style={iv.tableHead}>
            <th style={{ ...iv.th, width: "40%", textAlign: "left" }}>Particulars</th>
            <th style={{ ...iv.th, width: "12%" }}>HSN/SAC</th>
            <th style={{ ...iv.th, width: "10%" }}>Quantity</th>
            <th style={{ ...iv.th, width: "15%", textAlign: "right" }}>Rate</th>
            <th style={{ ...iv.th, width: "18%", textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map((item, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...iv.td, textAlign: "left", fontWeight: 600 }}>{item.particulars || "—"}</td>
              <td style={{ ...iv.td, textAlign: "center" }}>{item.hsn || ""}</td>
              <td style={{ ...iv.td, textAlign: "center" }}>{item.qty || ""}</td>
              <td style={{ ...iv.td, textAlign: "right" }}>{item.rate ? fmt(item.rate) : ""}</td>
              <td style={{ ...iv.td, textAlign: "right", fontWeight: 600 }}>
                {item.amount ? fmt(item.amount) : ""}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} style={{ ...iv.td, textAlign: "center", color: "#aaa" }}>No items added</td>
            </tr>
          )}

          {/* Tax rows */}
          {(d.cgstPct && cgstAmt > 0) && (
            <tr style={iv.taxRow}>
              <td style={{ ...iv.td, textAlign: "left" }} colSpan={3}>CGST</td>
              <td style={{ ...iv.td, textAlign: "right" }}>{d.cgstPct}%</td>
              <td style={{ ...iv.td, textAlign: "right" }}>{fmt(cgstAmt)}</td>
            </tr>
          )}
          {(d.sgstPct && sgstAmt > 0) && (
            <tr style={iv.taxRow}>
              <td style={{ ...iv.td, textAlign: "left" }} colSpan={3}>SGST</td>
              <td style={{ ...iv.td, textAlign: "right" }}>{d.sgstPct}%</td>
              <td style={{ ...iv.td, textAlign: "right" }}>{fmt(sgstAmt)}</td>
            </tr>
          )}
          {(d.igstPct && igstAmt > 0) && (
            <tr style={iv.taxRow}>
              <td style={{ ...iv.td, textAlign: "left" }} colSpan={3}>IGST</td>
              <td style={{ ...iv.td, textAlign: "right" }}>{d.igstPct}%</td>
              <td style={{ ...iv.td, textAlign: "right" }}>{fmt(igstAmt)}</td>
            </tr>
          )}

          {/* Total */}
          <tr style={iv.totalRow}>
            <td style={{ ...iv.td, ...iv.totalCell, textAlign: "left" }} colSpan={4}>Total</td>
            <td style={{ ...iv.td, ...iv.totalCell, textAlign: "right" }}>{fmt(grandTotal)}</td>
          </tr>
        </tbody>
      </table>

      <div style={iv.divider} />

      {/* ═══════ AMOUNT IN WORDS + SIGNATURE ═══════ */}
      <div style={iv.bottomSection}>
        <div style={iv.amtWordsBox}>
          <div style={iv.amtWordsLabel}>Amount Chargeable (in words)</div>
          <div style={iv.amtWords}>{amtWords || "—"}</div>
        </div>

        <div style={iv.signatureBox}>
          <div style={iv.signFor}>For Realization Customer Services Private Limited</div>
          <div style={iv.companyNameBlue}>Realization Customer Services Pvt. Ltd.</div>
          <div style={iv.signImgWrap}>
            <img
              src="/assets/voucher/signature.svg"
              alt="Signature"
              style={iv.signImg}
              crossOrigin="anonymous"
            />
          </div>
          <div style={iv.directorLabel}>Director</div>
        </div>
      </div>

      {/* ═══════ FOOTER GRADIENT STRIP ═══════ */}
      <div id="invoice-pdf-footer" style={iv.footer}>
        <div style={iv.footerInner}>
          <span style={iv.footerQuote}>
            "Think <span style={{ color: RED }}>Travel</span>, Think{" "}
            <span style={{ color: RED }}>Tourwatchout</span>"
          </span>
        </div>
        <div style={iv.footerGrad} />
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CRow({ label, value }) {
  return (
    <tr>
      <td style={{ fontSize: 10.5, fontWeight: 700, color: "#555", paddingRight: 8, paddingBottom: 3, whiteSpace: "nowrap", verticalAlign: "top" }}>
        {label}
      </td>
      <td style={{ fontSize: 10.5, color: "#333", paddingBottom: 3, lineHeight: 1.5 }}>
        : &nbsp;{value}
      </td>
    </tr>
  );
}

function BillRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 5, marginBottom: 4, fontSize: 12 }}>
      <span style={{ fontWeight: 700, color: "#555", minWidth: 80, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#222" }}>: &nbsp;{value || "—"}</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const iv = {
  wrap: {
    fontFamily: "'DM Sans', Arial, sans-serif",
    background: "#fff",
    maxWidth: 720,
    margin: "0 auto",
    border: "1px solid #ddd",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  topStrip: { height: 5, background: `linear-gradient(90deg, ${RED} 0%, #ff7676 100%)` },

  // Title
  titleRow: { padding: "16px 24px 6px", textAlign: "center" },
  title: { fontSize: 22, fontWeight: 800, color: DARK, margin: 0, letterSpacing: 0.5 },

  // Company header
  companyHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "12px 24px 14px", gap: 16,
  },
  companyLeft: { flex: 1, minWidth: 0 },
  companyName: { fontSize: 12.5, fontWeight: 800, color: DARK, marginBottom: 8, lineHeight: 1.4 },
  infoTable: { borderCollapse: "collapse", width: "100%" },
  companyRight: { flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" },
  logoImg: { maxWidth: 90, maxHeight: 90, width: "auto", height: "auto", display: "block" },

  divider: { height: 1, background: "#e0e0e0", margin: "0 24px" },

  // Invoice meta
  metaRow: { display: "flex", padding: "12px 24px", gap: 0 },
  metaCell: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  metaLabel: { fontSize: 10.5, color: "#888", fontWeight: 600 },
  metaVal: { fontSize: 12.5, fontWeight: 700, color: DARK },

  // Bill To
  billToSection: { padding: "12px 24px" },
  billToHead: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 },
  billToIcon: { fontSize: 14 },
  billToLabel: { fontSize: 13, fontWeight: 800, color: DARK },
  billToGrid: { display: "flex", gap: 24 },
  billToLeft: { flex: 1 },
  billToRight: { flex: 1 },

  // Table
  table: { width: "100%", borderCollapse: "collapse", margin: "0" },
  tableHead: { background: "#f5f5f5" },
  th: {
    padding: "9px 12px", fontSize: 11.5, fontWeight: 700,
    color: "#333", borderBottom: "2px solid #e0e0e0",
    borderTop: "1px solid #e0e0e0", textAlign: "center",
  },
  td: {
    padding: "8px 12px", fontSize: 12, color: "#333",
    borderBottom: "1px solid #ececec", textAlign: "center",
    verticalAlign: "top",
  },
  taxRow: { background: "#fafafa" },
  totalRow: { background: "#fff0f0" },
  totalCell: {
    fontWeight: 800, fontSize: 13, color: DARK,
    borderTop: "2px solid #e0e0e0",
  },

  // Bottom: amount words + signature
  bottomSection: {
    display: "flex", padding: "14px 24px", gap: 24, alignItems: "flex-start",
  },
  amtWordsBox: { flex: 1 },
  amtWordsLabel: { fontSize: 10.5, color: "#888", fontWeight: 600, marginBottom: 4 },
  amtWords: { fontSize: 12.5, fontWeight: 700, color: DARK, lineHeight: 1.5 },

  signatureBox: { minWidth: 200, textAlign: "right" },
  signFor: { fontSize: 10.5, color: "#555", marginBottom: 4 },
  companyNameBlue: { fontSize: 11.5, fontWeight: 700, color: BLUE, marginBottom: 4 },
  signImgWrap: { display: "flex", justifyContent: "flex-end", marginBottom: 4 },
  signImg: { maxHeight: 52, maxWidth: 140, width: "auto", height: "auto" },
  directorLabel: { fontSize: 11, fontWeight: 700, color: "#444" },

  // Footer
  footer: { marginTop: 0 },
  footerInner: {
    background: "#fff",
    padding: "14px 24px 10px",
    borderTop: "1px solid #f0e0e0",
    textAlign: "center",
  },
  footerQuote: { fontSize: 14, fontStyle: "italic", color: DARK, fontWeight: 600 },
  footerGrad: {
    height: 28,
    background: "url('/assets/voucher/backgruond-gradeint.png') center/cover no-repeat",
    backgroundSize: "cover",
  },
};
