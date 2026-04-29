/**
 * VoucherPreview — matches Figma design.
 * id="voucher-pdf-footer" is used by the PDF generator to pin footer to page bottom.
 */

const RED = "#e84949";
const DARK = "#1a1a2e";
const LIGHT_PINK = "#fff5f5";

export default function VoucherPreview({ data }) {
  const d = data || {};

  return (
    <div style={v.wrap}>

      {/* ══════════ HEADER ══════════ */}
      <div style={v.header}>
        {/* Left: company info */}
        <div style={v.headerLeft}>
          <div style={v.voucherTitle}>Tourwatchout Voucher</div>
          <div style={v.realization}>Realization Customer Services Private Limited</div>
          <table style={v.infoTable}>
            <tbody>
              <HRow label="Trade Name"  value="Tourwatchout" />
              <HRow label="Email"       value="sales@tourwatchout.com" />
              <HRow label="GSTIN"       value="09AANA63481P2ZK" />
              <HRow label="State Name"  value="Uttar Pradesh, Code: 09" />
              <HRow label="Address"     value="Uni no 01, Ground Floor, Tower 02, Parsvnath Planet, Vibhuti Khand, Gomti Nagar, Lucknow 226010" />
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

      {/* Red divider */}
      <div style={v.redBar} />

      {/* ══════════ VOUCHER META ══════════ */}
      <div style={v.metaSection}>
        <div style={v.metaLeft}>
          <InfoPair label="Voucher No." value={d.voucherNo} />
          <InfoPair label="Trip ID"     value={d.tripId} />
          <InfoPair label="Name"        value={d.name} />
          <InfoPair label="Pax"         value={d.pax} />
          <InfoPair label="Date"        value={d.travelDate} />
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
        // Support both new hotels[] array and old flat-field vouchers
        const hotels = d.hotels && d.hotels.length > 0
          ? d.hotels
          : d.hotelName
            ? [{ id: 0, hotelName: d.hotelName, hotelAddress: d.hotelAddress, hotelConfirmNo: d.hotelConfirmNo, units: d.units, roomType: d.roomType, mealPlan: d.mealPlan, checkinDate: d.checkinDate, checkinTime: d.checkinTime, checkoutDate: d.checkoutDate, checkoutTime: d.checkoutTime, nights: d.nights, hotelNote: d.hotelNote }]
            : [];
        if (hotels.length === 0) return null;
        return (
          <RedSection title="Hotel Details">
            {hotels.map((h, idx) => (
              <div key={h.id ?? idx} style={idx > 0 ? { marginTop: 18, borderTop: "1px dashed #e0e0e0", paddingTop: 14 } : {}}>
                <div style={v.hotelBlock}>
                  <div style={v.hotelLeft}>
                    <div style={v.hotelNameRow}>
                      <span style={v.hotelIcon}>🏨</span>
                      <span style={v.hotelName}>{h.hotelName || "—"}</span>
                    </div>
                    {h.hotelAddress && (
                      <div style={v.hotelAddr}>📍 {h.hotelAddress}</div>
                    )}
                    <div style={{ height: 10 }} />
                    <HotelRow label="Hotel Confirmation no." value={h.hotelConfirmNo} />
                    <HotelRow label="Units"                  value={h.units} />
                    <HotelRow label="Room Type"              value={h.roomType} />
                    <HotelRow label="Meal Plan"              value={h.mealPlan} />
                  </div>
                  <div style={v.hotelRight}>
                    <div style={v.dateCard}>
                      <div style={v.dateCardTitle}>Check in &amp; Check out Date</div>
                      <div style={v.dateRow}>
                        <div style={v.dateBox}>
                          <div style={v.dateDay}>{h.checkinDate  || "—"}</div>
                          <div style={v.dateTime}>{h.checkinTime  || ""}</div>
                        </div>
                        <div style={v.dateArrow}>→</div>
                        <div style={v.dateBox}>
                          <div style={v.dateDay}>{h.checkoutDate || "—"}</div>
                          <div style={v.dateTime}>{h.checkoutTime || ""}</div>
                        </div>
                      </div>
                      {h.nights && <div style={v.nightsPill}>{h.nights}</div>}
                    </div>
                  </div>
                </div>
                {h.hotelNote && (
                  <div style={v.noteBox}>
                    <div style={v.noteBoxTitle}>{h.hotelNote.split("\n")[0]}</div>
                    <ul style={v.noteList}>
                      {h.hotelNote.split("\n").slice(1)
                        .filter((l) => l.trim())
                        .map((line, i) => (
                          <li key={i} style={v.noteItem}>
                            {line.replace(/^[•\-\*]\s*/, "")}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </RedSection>
        );
      })()}

      {/* ══════════ FLIGHT DETAILS ══════════ */}
      {d.showFlights && d.flights && d.flights.length > 0 && (
        <RedSection title="Flight Details">
          {d.flights.map((fl, i) => (
            <div key={i} style={{ marginBottom: i < d.flights.length - 1 ? 16 : 0 }}>
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

      {/* ══════════ ITINERARY ══════════ */}
      {d.showItinerary && d.itineraries && d.itineraries.length > 0 && (
        <RedSection title="Day-wise Itinerary">
          <table style={v.table}>
            <thead>
              <tr>
                <Th w={58}>Date</Th>
                <Th>Tour</Th>
                <Th w={54}>Transfer</Th>
                <Th w={68}>Pick-up Time</Th>
                <Th>Itinerary</Th>
              </tr>
            </thead>
            <tbody>
              {d.itineraries.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <Td bold>{item.date}</Td>
                  <Td>{item.tour}</Td>
                  <Td center>{item.transfer || "NA"}</Td>
                  <Td center>{item.pickup_time || "NA"}</Td>
                  <Td>{item.itinerary}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </RedSection>
      )}

      {/* ══════════ EXTRAS ══════════ */}
      {d.extras && (
        <div style={v.extrasBar}>
          <strong>Extras:</strong>
          <span style={{ marginLeft: 8, color: "#555" }}>{d.extras}</span>
        </div>
      )}

      {/* ══════════ SPECIAL INSTRUCTIONS ══════════ */}
      {d.specialInstructions && (
        <RedSection title="Special Instructions">
          <p style={v.noteText}>{d.specialInstructions}</p>
        </RedSection>
      )}

      {/* ══════════ IMPORTANT NOTES ══════════ */}
      {d.importantNotes && (
        <RedSection title="Important Notes: (Please read before Travel)">
          <div style={v.noteText}>
            {d.importantNotes.split("\n").map((line, i) => (
              <p key={i} style={{ margin: "0 0 5px" }}>{line}</p>
            ))}
          </div>
        </RedSection>
      )}

      {/* ══════════ FOOTER — pinned to page bottom in PDF ══════════ */}
      <div id="voucher-pdf-footer" style={v.footer}>
        <div style={v.footerItem}>
          <img src="/assets/voucher/email.svg"    alt="" style={v.fIcon} crossOrigin="anonymous" />
          <span style={v.fEmail}>sales@tourwatchout.com</span>
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

// ─── Sub-components ──────────────────────────────────────────────────────────

function HRow({ label, value }) {
  return (
    <tr>
      <td style={{ fontSize: 10.5, fontWeight: 700, color: "#555", paddingRight: 10, paddingBottom: 3, whiteSpace: "nowrap", verticalAlign: "top" }}>
        {label}
      </td>
      <td style={{ fontSize: 10.5, color: "#333", paddingBottom: 3, lineHeight: 1.5 }}>
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
    // data-pdf-section is read by the PDF generator to find safe page-break points
    <div data-pdf-section="true" style={{ borderTop: "1px solid #e8e8e8" }}>
      <div style={{
        background: RED, color: "#fff",
        padding: "9px 18px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 13, fontWeight: 700,
      }}>
        {title}
        <span style={{ opacity: 0.7, fontWeight: 400, fontSize: 16, lineHeight: 1 }}>—</span>
      </div>
      <div style={{ padding: "14px 18px", background: "#fff" }}>{children}</div>
    </div>
  );
}

function HotelRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 12 }}>
      <span style={{ fontWeight: 700, color: "#555", minWidth: 170, flexShrink: 0 }}>{label}:</span>
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
    fontFamily: "'DM Sans', Arial, sans-serif",
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
    gap: 16,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,        // prevent flex child from overflowing
  },
  voucherTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: DARK,
    marginBottom: 2,
    lineHeight: 1.3,
  },
  realization: {
    fontSize: 10,
    color: "#888",
    marginBottom: 10,
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
  // NO objectFit — html2canvas ignores it and stretches the image.
  // Let the img scale naturally within maxWidth/maxHeight.
  logoImg: {
    maxWidth: 88,
    maxHeight: 88,
    width: "auto",
    height: "auto",
    display: "block",
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
  hotelNameRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 3 },
  hotelIcon: { fontSize: 14, flexShrink: 0 },
  hotelName: { fontSize: 15, fontWeight: 800, color: "#2563eb", lineHeight: 1.3 },
  hotelAddr: { fontSize: 11, color: "#888", marginBottom: 8, paddingLeft: 2, lineHeight: 1.5 },
  hotelRight: { width: 200, flexShrink: 0 },
  dateCard: {
    border: "1px solid #e8e8e8", borderRadius: 8,
    padding: 12, background: "#f9f9f9", textAlign: "center",
  },
  dateCardTitle: { fontSize: 10.5, fontWeight: 700, color: "#666", marginBottom: 10 },
  dateRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  dateBox: { flex: 1 },
  dateDay: { fontSize: 12, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.4 },
  dateTime: { fontSize: 10, color: "#888", marginTop: 3 },
  dateArrow: { fontSize: 16, color: RED, padding: "0 4px" },
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

  // Extras
  extrasBar: {
    padding: "10px 18px", background: "#f9f9f9",
    borderTop: "1px solid #ececec", fontSize: 12,
  },

  // Notes text
  noteText: { fontSize: 11.5, color: "#444", lineHeight: 1.75, margin: 0 },

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
