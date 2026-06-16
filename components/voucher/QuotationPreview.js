const RED  = "#e84949";
const DARK = "#1a1a2e";

function flattenLists(html) {
  let out = html;
  out = out.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let n = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, content) => {
      n++;
      return `<div style="display:flex;align-items:flex-start;gap:5px;margin-bottom:3px"><span style="min-width:18px;font-weight:bold;flex-shrink:0">${n}.</span><span>${content.trim()}</span></div>`;
    });
  });
  out = out.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, content) =>
      `<div style="display:flex;align-items:flex-start;gap:5px;margin-bottom:3px"><span style="min-width:18px;flex-shrink:0">•</span><span>${content.trim()}</span></div>`
    )
  );
  return out;
}

function RichContent({ html, style }) {
  if (!html) return null;
  const hasHtml = /<[^>]+>/.test(html);
  const base = { fontSize: 11.5, color: "#444", lineHeight: 1.8, margin: 0, ...(style || {}) };
  if (hasHtml) return <div dangerouslySetInnerHTML={{ __html: flattenLists(html) }} style={base} />;
  return (
    <div style={base}>
      {html.split("\n").filter(l => l.trim()).map((line, i) => (
        <p key={i} style={{ margin: "0 0 5px" }}>{line}</p>
      ))}
    </div>
  );
}

function RedSection({ title, children }) {
  return (
    <div data-pdf-section="true" style={{ borderTop: "1px solid #e8e8e8" }}>
      <div style={{ background: RED, color: "#fff", padding: "9px 18px", fontSize: 13, fontWeight: 700 }}>{title}</div>
      <div style={{ padding: "14px 18px", background: "#fff" }}>{children}</div>
    </div>
  );
}

function InfoPair({ label, value, right }) {
  return (
    <div style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start", gap: 5, marginBottom: 5, fontSize: 12 }}>
      <span style={{ fontWeight: 700, color: "#444", whiteSpace: "nowrap", flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#222" }}>{value || "—"}</span>
    </div>
  );
}

function HRow({ label, value }) {
  return (
    <tr>
      <td style={{ fontSize: 11, fontWeight: 700, color: "#555", paddingRight: 10, paddingBottom: 3, whiteSpace: "nowrap", verticalAlign: "top" }}>{label}</td>
      <td style={{ fontSize: 11, color: "#333", paddingBottom: 3, lineHeight: 1.5 }}>: {value}</td>
    </tr>
  );
}

function Th({ children }) {
  return (
    <th style={{ background: RED, color: "#fff", padding: "7px 9px", fontSize: 11, fontWeight: 700, textAlign: "left", border: "1px solid rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>
      {children}
    </th>
  );
}
function Td({ children }) {
  return (
    <td style={{ padding: "7px 9px", fontSize: 11.5, color: "#333", border: "1px solid #ececec", verticalAlign: "top", lineHeight: 1.5 }}>
      {children || "—"}
    </td>
  );
}

function fmtDate(v) {
  if (!v) return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}
const inr = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");

export default function QuotationPreview({ data, id }) {
  const { quoteId, lead = {}, form = {}, hotels = [], flights = [], transfers = [], itin = [], selling = 0 } = data || {};

  return (
    <div id={id} style={q.wrap}>

      {/* ══════════ HEADER ══════════ */}
      <div style={q.header}>
        <div style={q.headerLeft}>
          <div style={q.docTitle}>Package Quotation</div>
          <div style={q.realization}>Realization Customer Services Private Limited</div>
          <table style={q.infoTable}>
            <tbody>
              <HRow label="Trade Name" value="Tourwatchout" />
              <HRow label="Email"      value="sales1@tourwatchout.com" />
              <HRow label="GSTIN"      value="09AANA63481P2ZK" />
              <HRow label="State Name" value="Uttar Pradesh, Code: 09" />
              <HRow label="Address"    value="Ground Floor, Unit no. -01, Tower 2, Parsvnath Planet, Gomti Nagar, Lucknow-226010" />
            </tbody>
          </table>
        </div>
        <div style={q.headerLogo}>
          <img src="/assets/voucher/logo.png" alt="tourwatchout" style={q.logoImg} crossOrigin="anonymous" />
        </div>
      </div>

      <div style={q.redBar} />

      {/* ══════════ META ══════════ */}
      <div data-pdf-section="true" style={q.metaSection}>
        <div style={q.metaLeft}>
          <InfoPair label="Quote No."   value={quoteId} />
          <InfoPair label="Guest Name"  value={lead.name} />
          <InfoPair label="Duration"    value={form.days} />
          <InfoPair label="Travel Date" value={fmtDate(form.travelDate)} />
          <InfoPair label="Trip Type"   value={[form.type, form.pkgMode].filter(Boolean).join(" · ")} />
        </div>
        <div style={q.metaDivider} />
        <div style={q.metaRight}>
          <InfoPair label="Destination" value={lead.destination} right />
          <InfoPair label="Email"       value={lead.email}       right />
          <InfoPair label="Contact No." value={lead.phone}       right />
        </div>
      </div>

      {/* ══════════ DAY-WISE ITINERARY ══════════ */}
      {itin.some(d => d.title || d.itinerary || d.date || d.tour || d.transfer || d.pickup_time) && (
        <RedSection title="Day-wise Itinerary">
          {itin.filter(d => d.title || d.itinerary || d.date || d.tour || d.transfer || d.pickup_time).map((item, i, arr) => (
            <div key={i} data-pdf-section="true" style={{
              marginBottom: i < arr.length - 1 ? 18 : 0,
              paddingBottom: i < arr.length - 1 ? 16 : 0,
              borderBottom: i < arr.length - 1 ? "1px dashed #e0e0e0" : "none",
            }}>
              <div style={q.dayHeader}>
                <div style={q.dayBadge}>Day {i + 1}</div>
                {item.date  && <span style={q.dayDate}>{fmtDate(item.date)}</span>}
                {item.title && <span style={q.dayTitle}> — {item.title}</span>}
              </div>
              {(item.tour || item.transfer || item.pickup_time) && (
                <div style={q.dayMetaRow}>
                  {item.tour        && <span style={q.dayMeta}><strong>Tour:</strong> {item.tour}</span>}
                  {item.transfer    && <span style={q.dayMeta}><strong>Transfer:</strong> {item.transfer}</span>}
                  {item.pickup_time && <span style={q.dayMeta}><strong>Pick-up:</strong> {item.pickup_time}</span>}
                </div>
              )}
              {item.itinerary && (
                <div style={{ marginTop: 6 }}>
                  <RichContent html={item.itinerary} />
                </div>
              )}
            </div>
          ))}
        </RedSection>
      )}

      {/* ══════════ HOTEL DETAILS ══════════ */}
      {hotels.filter(h => h.name).length > 0 && (
        <RedSection title="Hotel Details">
          {hotels.filter(h => h.name).map((h, idx) => (
            <div key={idx} data-pdf-section="true"
              style={idx > 0 ? { marginTop: 14, borderTop: "1px dashed #e0e0e0", paddingTop: 12 } : {}}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>🏨</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>{h.name}</span>
                {h.roomCat && <span style={{ fontSize: 12, color: "#6b7280" }}>— {h.roomCat}</span>}
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 12, color: "#374151" }}>
                {h.nights && <span><b>Nights:</b> {h.nights}</span>}
                {h.rooms  && <span><b>Rooms:</b> {h.rooms}</span>}
              </div>
            </div>
          ))}
        </RedSection>
      )}

      {/* ══════════ TRANSPORTATION (CAB) ══════════ */}
      {transfers.filter(t => t.cab || t.perDay || t.days).length > 0 && (
        <RedSection title="Transportation Details">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Cab Type</Th>
                <Th>Days</Th>
              </tr>
            </thead>
            <tbody>
              {transfers.filter(t => t.cab || t.perDay || t.days).map((t, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <Td>{t.cab}</Td>
                  <Td>{t.days}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </RedSection>
      )}

      {/* ══════════ FLIGHT DETAILS ══════════ */}
      {flights.filter(f => f.from || f.to || f.date || f.pax || f.price).length > 0 && (
        <RedSection title="Flight Details">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Date</Th>
                <Th>Pax</Th>
              </tr>
            </thead>
            <tbody>
              {flights.filter(f => f.from || f.to || f.date || f.pax || f.price).map((f, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <Td>{f.from}</Td>
                  <Td>{f.to}</Td>
                  <Td>{fmtDate(f.date)}</Td>
                  <Td>{f.pax}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </RedSection>
      )}

      {/* ══════════ INCLUSIONS ══════════ */}
      {form.inclusions && (
        <RedSection title="Inclusions">
          <RichContent html={form.inclusions} />
        </RedSection>
      )}

      {/* ══════════ EXCLUSIONS ══════════ */}
      {form.exclusions && (
        <RedSection title="Exclusions">
          <RichContent html={form.exclusions} />
        </RedSection>
      )}

      {/* ══════════ PRICE BOX ══════════ */}
      <div data-pdf-section="true" style={{ borderTop: "1px solid #e8e8e8" }}>
        <div style={{ background: RED, color: "#fff", padding: "9px 18px", fontSize: 13, fontWeight: 700 }}>Package Price</div>
        <div style={{ padding: "16px 18px", background: "#fff" }}>
          <div style={q.priceBox}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Total Package Price</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>All taxes included</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: RED }}>{inr(selling)}</div>
          </div>
          {form.notes && (
            <p style={{ fontSize: 12, color: "#6B7A99", marginTop: 10, fontStyle: "italic", margin: "10px 0 0" }}>{form.notes}</p>
          )}
        </div>
      </div>

      {/* ══════════ TERMS & CONDITIONS ══════════ */}
      {form.termsConditions && (
        <RedSection title="Terms & Conditions">
          <RichContent html={form.termsConditions} style={{ fontSize: 11, lineHeight: 1.7 }} />
        </RedSection>
      )}

      {/* ══════════ BOOKING POLICY ══════════ */}
      {form.bookingPolicy && (
        <RedSection title="Booking Policy">
          <RichContent html={form.bookingPolicy} style={{ fontSize: 11, lineHeight: 1.7 }} />
        </RedSection>
      )}

      {/* ══════════ CANCELLATION POLICY ══════════ */}
      {form.cancellationPolicy && (
        <RedSection title="Cancellation Policy">
          <RichContent html={form.cancellationPolicy} style={{ fontSize: 11, lineHeight: 1.7 }} />
        </RedSection>
      )}

      {/* ══════════ FOOTER ══════════ */}
      <div style={q.footer}>
        <div style={q.footerItem}>
          <img src="/assets/voucher/email.svg" alt="" style={q.fIcon} crossOrigin="anonymous" />
          <span style={q.fEmail}>sales1@tourwatchout.com</span>
          <span style={q.fMuted}>&nbsp;(for any query)</span>
        </div>
        <div style={q.footerItem}>
          <img src="/assets/voucher/instagram.svg" alt="" style={q.fIcon} crossOrigin="anonymous" />
          <span style={q.fHandle}>/Tourwatchout</span>
        </div>
        <div style={q.footerItem}>
          <img src="/assets/voucher/footer-logo.png" alt="tourwatchout" style={q.fLogo} crossOrigin="anonymous" />
        </div>
      </div>

    </div>
  );
}

const q = {
  wrap: {
    fontFamily: "Arial, Helvetica, sans-serif",
    letterSpacing: "0.01px",
    wordSpacing: "0.1px",
    background: "#fff",
    width: "100%",
    maxWidth: 780,
    margin: "0 auto",
    border: "1px solid #d0d0d0",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 22px 16px", background: "#fff", gap: 20 },
  headerLeft: { flex: 1, minWidth: 0 },
  docTitle: { fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 3, lineHeight: 1.2, letterSpacing: "normal" },
  realization: { fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 12, lineHeight: 1.4 },
  infoTable: { borderCollapse: "collapse", width: "100%" },
  headerLogo: { flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingLeft: 12 },
  logoImg: { width: 140, height: "auto", maxHeight: 120, display: "block", objectFit: "contain" },
  redBar: { height: 3, background: RED },
  metaSection: { display: "flex", padding: "14px 22px", background: "#fafafa", borderBottom: "1px solid #ececec", gap: 12 },
  metaLeft: { flex: 1 },
  metaDivider: { width: 1, background: "#e0e0e0", flexShrink: 0 },
  metaRight: { flex: 1 },
  dayHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" },
  dayBadge: { background: RED, color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 4, padding: "3px 10px", flexShrink: 0 },
  dayDate: { fontSize: 12, fontWeight: 700, color: "#374151" },
  dayTitle: { fontSize: 13, fontWeight: 700, color: DARK, letterSpacing: "normal" },
  dayMetaRow: { display: "flex", gap: 18, flexWrap: "wrap", fontSize: 11.5, color: "#555", marginBottom: 4 },
  dayMeta: { display: "inline-flex", gap: 4 },
  priceBox: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff5f5", border: `1.5px solid ${RED}`, borderRadius: 10, padding: "14px 18px" },
  footer: { background: "#fff5f5", borderTop: `2px solid ${RED}`, padding: "11px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  footerItem: { display: "flex", alignItems: "center", gap: 6 },
  fIcon: { width: 20, height: 20, objectFit: "contain", flexShrink: 0 },
  fEmail: { fontSize: 11.5, color: "#333", fontWeight: 600 },
  fMuted: { fontSize: 11, color: "#888" },
  fHandle: { fontSize: 11.5, color: "#333", fontWeight: 600 },
  fLogo: { height: 30, width: "auto", objectFit: "contain" },
};
