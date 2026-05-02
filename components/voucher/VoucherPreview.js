/**
 * VoucherPreview — Voucher PDF layout.
 * id="voucher-pdf-footer" is used by the PDF generator to pin footer to page bottom.
 */

const RED = "#e84949";
const DARK = "#1a1a2e";
const LIGHT_PINK = "#fff5f5";

// Convert <ol>/<ul> to div-based layout so html2canvas doesn't need CSS counters/::marker
function flattenLists(html) {
  let out = html;
  // ordered lists
  out = out.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let n = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, content) => {
      n++;
      return `<div style="display:flex;align-items:flex-start;gap:5px;margin-bottom:3px"><span style="min-width:18px;font-weight:bold;flex-shrink:0">${n}.</span><span>${content.trim()}</span></div>`;
    });
  });
  // unordered lists
  out = out.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, content) =>
      `<div style="display:flex;align-items:flex-start;gap:5px;margin-bottom:3px"><span style="min-width:18px;flex-shrink:0">•</span><span>${content.trim()}</span></div>`
    )
  );
  return out;
}

// Renders HTML from rich-text editor, or plain text with newlines as <p>
function RichContent({ html, style }) {
  if (!html) return null;
  const hasHtml = /<[^>]+>/.test(html);
  const base = { fontSize: 11.5, color: "#444", lineHeight: 1.8, margin: 0, ...(style || {}) };
  if (hasHtml) {
    return <div dangerouslySetInnerHTML={{ __html: flattenLists(html) }} style={base} />;
  }
  return (
    <div style={base}>
      {html.split("\n").filter((l) => l.trim()).map((line, i) => (
        <p key={i} style={{ margin: "0 0 5px" }}>{line}</p>
      ))}
    </div>
  );
}

export default function VoucherPreview({ data }) {
  const d = data || {};

  // Build travel date from new or old format
  const travelDate =
    d.travelDate ||
    (d.travelDateFrom && d.travelDateTo
      ? `${d.travelDateFrom} – ${d.travelDateTo}`
      : d.travelDateFrom || d.travelDateTo || "");

  return (
    <div style={v.wrap}>

      {/* ══════════ HEADER ══════════ */}
      <div style={v.header}>
        {/* Left: company info */}
        <div style={v.headerLeft}>
          <div style={v.voucherTitle}>Travel Voucher</div>
          <div style={v.realization}>Realization Customer Services Private Limited</div>
          <table style={v.infoTable}>
            <tbody>
              <HRow label="Trade Name"  value="Tourwatchout" />
              <HRow label="Email"       value="sales1@tourwatchout.com" />
              <HRow label="GSTIN"       value="09AANA63481P2ZK" />
              <HRow label="State Name"  value="Uttar Pradesh, Code: 09" />
              <HRow label="Address"     value="Ground Floor, Unit no. -01, Tower 2, Parsvnath Planet, Gomti Nagar, Lucknow-226010" />
            </tbody>
          </table>
        </div>

        {/* Right: logo */}
        <div style={v.headerLogo}>
          <img
            src="/assets/voucher/logo.png"
            alt="tourwatchout"
            style={v.logoImg}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      <div style={v.redBar} />

      {/* ══════════ VOUCHER META ══════════ */}
      <div data-pdf-section="true" style={v.metaSection}>
        <div style={v.metaLeft}>
          <InfoPair label="Voucher No." value={d.voucherNo} />
          <InfoPair label="Trip ID"     value={d.tripId} />
          <InfoPair label="Name"        value={d.name} />
          <InfoPair label="Pax"         value={d.pax} />
          <InfoPair label="Date"        value={travelDate} />
        </div>
        <div style={v.metaDivider} />
        <div style={v.metaRight}>
          <InfoPair label="Destination" value={d.destination} right />
          <InfoPair label="Email"       value={d.email}       right />
          <InfoPair label="Contact No." value={d.contactNo}   right />
          <InfoPair label="Address"     value={d.address}     right />
        </div>
      </div>

      {/* ══════════ HOTEL DETAILS ══════════ */}
      {d.showHotel !== false && (() => {
        const hotels =
          d.hotels && d.hotels.length > 0
            ? d.hotels
            : d.hotelName
            ? [{ id: 0, hotelName: d.hotelName, hotelAddress: d.hotelAddress, place: d.place, hotelConfirmNo: d.hotelConfirmNo, units: d.units, roomType: d.roomType, mealPlan: d.mealPlan, checkinDate: d.checkinDate, checkinTime: d.checkinTime, checkoutDate: d.checkoutDate, checkoutTime: d.checkoutTime, nights: d.nights }]
            : [];
        if (hotels.length === 0) return null;
        const hotelNote = d.hotelNote || hotels[0]?.hotelNote || "";
        return (
          <RedSection title="Hotel Details">
            {hotels.map((h, idx) => (
              <div
                key={h.id ?? idx}
                data-pdf-section="true"
                style={idx > 0 ? { marginTop: 18, borderTop: "1px dashed #e0e0e0", paddingTop: 14 } : {}}
              >
                <div style={v.hotelBlock}>
                  <div style={v.hotelLeft}>
                    <div style={v.hotelNameRow}>
                      <span style={v.hotelIcon}>🏨</span>
                      <span style={v.hotelName}>{h.hotelName || "—"}</span>
                      {h.place && <span style={v.hotelPlace}>&nbsp;— {h.place}</span>}
                    </div>
                    {h.hotelAddress && <div style={v.hotelAddr}>📍 {h.hotelAddress}</div>}
                    <div style={{ height: 10 }} />
                    <HotelRow label="Hotel Confirmation No." value={h.hotelConfirmNo} />
                    <HotelRow label="Units"                  value={h.units} />
                    <HotelRow label="Room Type"              value={h.roomType} />
                    <HotelRow label="Meal Plan"              value={h.mealPlan} />
                  </div>
                  <div style={v.hotelRight}>
                    <div style={v.dateCard}>
                      <div style={v.dateCardTitle}>Check-in &amp; Check-out</div>
                      <div style={v.dateRow}>
                        <div style={v.dateBox}>
                          <div style={v.dateLabel}>Check-in</div>
                          <div style={v.dateDay}>{h.checkinDate  || "—"}</div>
                          <div style={v.dateTime}>{h.checkinTime  || ""}</div>
                        </div>
                        <div style={v.dateArrow}>→</div>
                        <div style={v.dateBox}>
                          <div style={v.dateLabel}>Check-out</div>
                          <div style={v.dateDay}>{h.checkoutDate || "—"}</div>
                          <div style={v.dateTime}>{h.checkoutTime || ""}</div>
                        </div>
                      </div>
                      {h.nights && <div style={v.nightsPill}>{h.nights}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {hotelNote && (
              <div data-pdf-section="true" style={v.noteBox}>
                <div style={v.noteBoxTitle}>{hotelNote.split("\n")[0]}</div>
                <ul style={v.noteList}>
                  {hotelNote
                    .split("\n")
                    .slice(1)
                    .filter((l) => l.trim())
                    .map((line, i) => (
                      <li key={i} style={v.noteItem}>
                        {line.replace(/^[•\-\*]\s*/, "")}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </RedSection>
        );
      })()}

      {/* ══════════ FLIGHT DETAILS ══════════ */}
      {d.showFlights && d.flights && d.flights.length > 0 && (
        <RedSection title="Flight Details">
          {d.flights.map((fl, i) => (
            <div key={i} data-pdf-section="true" style={{ marginBottom: i < d.flights.length - 1 ? 16 : 0 }}>
              <div style={v.pnrRow}>
                <span style={v.pnrLabel}>PNR:</span>
                <span style={v.pnrValue}>{fl.pnr || "—"}</span>
              </div>
              <div style={v.flightCard}>
                <div style={v.flightSide}>
                  <div style={v.flightCity}>{fl.from_city || "—"}</div>
                  <div style={v.flightCode}>({fl.from_code})</div>
                  <div style={v.flightMeta}>{fl.from_date}</div>
                  <div style={v.flightTime}>{fl.from_time}</div>
                </div>
                <div style={v.flightMid}>
                  <div style={v.flightNo}>{fl.flight_no}</div>
                  <div style={v.flightArrow}>✈ ──────→</div>
                </div>
                <div style={{ ...v.flightSide, textAlign: "right" }}>
                  <div style={v.flightCity}>{fl.to_city || "—"}</div>
                  <div style={v.flightCode}>({fl.to_code})</div>
                  <div style={v.flightMeta}>{fl.to_date}</div>
                  <div style={v.flightTime}>{fl.to_time}</div>
                </div>
              </div>
            </div>
          ))}
        </RedSection>
      )}

      {/* ══════════ TRANSPORTATION ══════════ */}
      {d.showTransport && d.transports && d.transports.length > 0 && (
        <RedSection title="Transportation Details">
          <table style={v.table}>
            <thead>
              <tr>
                <Th>Vehicle Type</Th>
                <Th>Driver Details</Th>
                <Th>Contact</Th>
              </tr>
            </thead>
            <tbody>
              {d.transports.map((t, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <Td>{t.vehicle_type}</Td>
                  <Td>{t.driver_name}</Td>
                  <Td>{t.driver_contact}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </RedSection>
      )}

      {/* ══════════ DAY-WISE ITINERARY — vertical cards ══════════ */}
      {d.showItinerary && d.itineraries && d.itineraries.length > 0 && (
        <RedSection title="Day-wise Itinerary">
          {d.itineraries.map((item, i) => (
            <div
              key={i}
              data-pdf-section="true"
              style={{
                marginBottom: i < d.itineraries.length - 1 ? 18 : 0,
                paddingBottom: i < d.itineraries.length - 1 ? 16 : 0,
                borderBottom: i < d.itineraries.length - 1 ? "1px dashed #e0e0e0" : "none",
              }}
            >
              {/* Day badge + date + title */}
              <div style={v.dayHeader}>
                <div style={v.dayBadge}>Day {i + 1}</div>
                {item.date  && <span style={v.dayDate}>{item.date}</span>}
                {item.title && <span style={v.dayTitle}> — {item.title}</span>}
              </div>

              {/* Tour meta row */}
              {(item.tour || item.transfer || item.pickup_time) && (
                <div style={v.dayMetaRow}>
                  {item.tour        && <span style={v.dayMeta}><strong>Tour:</strong> {item.tour}</span>}
                  {item.transfer    && <span style={v.dayMeta}><strong>Transfer:</strong> {item.transfer}</span>}
                  {item.pickup_time && <span style={v.dayMeta}><strong>Pick-up:</strong> {item.pickup_time}</span>}
                </div>
              )}

              {/* Rich itinerary details */}
              {item.itinerary && (
                <div style={{ marginTop: 6 }}>
                  <RichContent html={item.itinerary} />
                </div>
              )}
            </div>
          ))}
        </RedSection>
      )}

      {/* ══════════ INCLUSIONS ══════════ */}
      {d.inclusions && (
        <RedSection title="Inclusions">
          <RichContent html={d.inclusions} />
        </RedSection>
      )}

      {/* ══════════ EXCLUSIONS ══════════ */}
      {d.exclusions && (
        <RedSection title="Exclusions">
          <RichContent html={d.exclusions} />
        </RedSection>
      )}

      {/* ══════════ VALUE ADDITION ══════════ */}
      {(d.valueAddition || d.extras) && (
        <div data-pdf-section="true" style={v.extrasBar}>
          <strong>Value Addition:</strong>
          <span style={{ marginLeft: 8, color: "#555" }}>{d.valueAddition || d.extras}</span>
        </div>
      )}

      {/* ══════════ SPECIAL INSTRUCTIONS ══════════ */}
      {d.specialInstructions && (
        <RedSection title="Special Instructions">
          <RichContent html={d.specialInstructions} />
        </RedSection>
      )}

      {/* ══════════ T&C ══════════ */}
      {(d.termsConditions || d.importantNotes) && (
        <RedSection title="T&amp;C">
          <RichContent html={d.termsConditions || d.importantNotes} />
        </RedSection>
      )}

      {/* ══════════ FOOTER — pinned to page bottom in PDF ══════════ */}
      <div id="voucher-pdf-footer" style={v.footer}>
        <div style={v.footerItem}>
          <img src="/assets/voucher/email.svg"     alt="" style={v.fIcon} crossOrigin="anonymous" />
          <span style={v.fEmail}>sales1@tourwatchout.com</span>
          <span style={v.fMuted}>&nbsp;(for any query)</span>
        </div>
        <div style={v.footerItem}>
          <img src="/assets/voucher/instagram.svg" alt="" style={v.fIcon} crossOrigin="anonymous" />
          <span style={v.fHandle}>/Tourwatchout</span>
        </div>
        <div style={v.footerItem}>
          <img src="/assets/voucher/footer-logo.png" alt="tourwatchout" style={v.fLogo} crossOrigin="anonymous" />
        </div>
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HRow({ label, value }) {
  return (
    <tr>
      <td style={{ fontSize: 11, fontWeight: 700, color: "#555", paddingRight: 10, paddingBottom: 3, whiteSpace: "nowrap", verticalAlign: "top" }}>
        {label}
      </td>
      <td style={{ fontSize: 11, color: "#333", paddingBottom: 3, lineHeight: 1.5 }}>
        : {value}
      </td>
    </tr>
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

function RedSection({ title, children }) {
  return (
    <div data-pdf-section="true" style={{ borderTop: "1px solid #e8e8e8" }}>
      <div style={{
        background: RED, color: "#fff",
        padding: "9px 18px",
        fontSize: 13, fontWeight: 700,
      }}>
        {title}
      </div>
      <div style={{ padding: "14px 18px", background: "#fff" }}>{children}</div>
    </div>
  );
}

function HotelRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 12 }}>
      <span style={{ fontWeight: 700, color: "#555", minWidth: 180, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#333" }}>{value || "—"}</span>
    </div>
  );
}

function Th({ children, w }) {
  return (
    <th style={{
      background: RED, color: "#fff",
      padding: "7px 9px", fontSize: 11, fontWeight: 700, textAlign: "left",
      border: "1px solid rgba(255,255,255,0.15)",
      width: w || undefined, whiteSpace: "nowrap",
    }}>
      {children}
    </th>
  );
}

function Td({ children, bold, center }) {
  return (
    <td style={{
      padding: "7px 9px", fontSize: 11.5, color: "#333",
      border: "1px solid #ececec",
      fontWeight: bold ? 700 : 400,
      textAlign: center ? "center" : "left",
      verticalAlign: "top", lineHeight: 1.5,
    }}>
      {children || "—"}
    </td>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const v = {
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

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "20px 22px 16px",
    background: "#fff",
    gap: 20,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  voucherTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: DARK,
    marginBottom: 3,
    lineHeight: 1.2,
    letterSpacing: "normal",
  },
  realization: {
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    marginBottom: 12,
    lineHeight: 1.4,
  },
  infoTable: {
    borderCollapse: "collapse",
    width: "100%",
  },
  headerLogo: {
    flexShrink: 0,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 12,
  },
  logoImg: {
    width: 140,
    height: "auto",
    maxHeight: 120,
    display: "block",
    objectFit: "contain",
  },
  redBar: { height: 3, background: RED },

  // Meta
  metaSection: {
    display: "flex",
    padding: "14px 22px",
    background: "#fafafa",
    borderBottom: "1px solid #ececec",
    gap: 12,
  },
  metaLeft: { flex: 1 },
  metaDivider: { width: 1, background: "#e0e0e0", flexShrink: 0 },
  metaRight: { flex: 1 },

  // Hotel
  hotelBlock: { display: "flex", gap: 18, alignItems: "flex-start" },
  hotelLeft: { flex: 1, minWidth: 0 },
  hotelNameRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" },
  hotelIcon: { fontSize: 14, flexShrink: 0 },
  hotelName: { fontSize: 15, fontWeight: 700, color: DARK, lineHeight: 1.3, letterSpacing: "normal" },
  hotelPlace: { fontSize: 13, fontWeight: 600, color: "#6b7280" },
  hotelAddr: { fontSize: 11, color: "#888", marginBottom: 8, paddingLeft: 2, lineHeight: 1.5 },
  hotelRight: { width: 310, flexShrink: 0 },
  dateCard: {
    border: "1px solid #e8e8e8", borderRadius: 8,
    padding: 12, background: "#f9f9f9", textAlign: "center",
  },
  dateCardTitle: { fontSize: 11, fontWeight: 700, color: RED, marginBottom: 10, letterSpacing: 0.3 },
  dateRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  dateBox: { flex: 1 },
  dateLabel: { fontSize: 9.5, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  dateDay: { fontSize: 11.5, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.4 },
  dateTime: { fontSize: 10, color: "#888", marginTop: 3 },
  dateArrow: { fontSize: 18, color: RED, padding: "0 6px" },
  nightsPill: {
    marginTop: 9, background: "#fff2f2",
    color: RED, fontSize: 11, fontWeight: 700,
    borderRadius: 20, padding: "3px 10px", display: "inline-block",
  },

  // Hotel note
  noteBox: {
    marginTop: 14,
    border: "1.5px dashed #93c5fd",
    borderRadius: 6, padding: "10px 14px", background: "#f0f9ff",
  },
  noteBoxTitle: { fontWeight: 700, fontSize: 12, color: RED, marginBottom: 5, lineHeight: 1.5 },
  noteList: { margin: 0, paddingLeft: 16 },
  noteItem: { fontSize: 11, color: "#444", lineHeight: 1.7, marginBottom: 2 },

  // Flights
  pnrRow: { display: "flex", gap: 6, alignItems: "center", marginBottom: 8 },
  pnrLabel: { fontSize: 12, fontWeight: 700, color: "#666" },
  pnrValue: { fontSize: 13, fontWeight: 800, color: DARK, letterSpacing: 1 },
  flightCard: {
    display: "flex", alignItems: "center",
    background: "#f9f9f9", border: "1px solid #e8e8e8",
    borderRadius: 8, padding: "12px 16px",
  },
  flightSide: { flex: 1, minWidth: 0 },
  flightCity: { fontSize: 14, fontWeight: 800, color: "#1a1a2e" },
  flightCode: { fontSize: 11, color: "#888" },
  flightMeta: { fontSize: 11, color: "#555", marginTop: 3 },
  flightTime: { fontSize: 12, fontWeight: 700, color: RED, marginTop: 2 },
  flightMid: { flex: 1, textAlign: "center", padding: "0 8px" },
  flightNo: { fontSize: 11, fontWeight: 600, color: "#555", marginBottom: 4 },
  flightArrow: { fontSize: 12, color: RED, letterSpacing: -1 },

  // Table
  table: { width: "100%", borderCollapse: "collapse" },

  // Day-wise Itinerary vertical layout
  dayHeader: {
    display: "flex", alignItems: "center", gap: 8,
    marginBottom: 8, flexWrap: "wrap",
  },
  dayBadge: {
    background: RED, color: "#fff",
    fontSize: 11, fontWeight: 700,
    borderRadius: 4, padding: "3px 10px",
    flexShrink: 0,
  },
  dayDate: { fontSize: 12, fontWeight: 700, color: "#374151" },
  dayTitle: { fontSize: 13, fontWeight: 700, color: DARK, letterSpacing: "normal" },
  dayMetaRow: {
    display: "flex", gap: 18, flexWrap: "wrap",
    fontSize: 11.5, color: "#555", marginBottom: 4,
  },
  dayMeta: { display: "inline-flex", gap: 4 },

  // Extras / Value Addition
  extrasBar: {
    padding: "11px 18px 11px 22px",
    background: "#f3f4f6",
    borderTop: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    borderLeft: `4px solid ${DARK}`,
    fontSize: 12.5,
  },

  // Footer
  footer: {
    background: LIGHT_PINK,
    borderTop: `2px solid ${RED}`,
    padding: "11px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  footerItem: { display: "flex", alignItems: "center", gap: 6 },
  fIcon: { width: 20, height: 20, objectFit: "contain", flexShrink: 0 },
  fEmail: { fontSize: 11.5, color: "#333", fontWeight: 600 },
  fMuted: { fontSize: 11, color: "#888" },
  fHandle: { fontSize: 11.5, color: "#333", fontWeight: 600 },
  fLogo: { height: 30, width: "auto", objectFit: "contain" },
};
