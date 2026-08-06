/* ── colours ───────────────────────────────────────────── */
const TEAL        = "#2B8E8E";
const TEAL_LIGHT  = "#EAF5F5";
const TEAL_BORDER = "#9DD0D0";
const RED         = "#E84949";
const DARK        = "#1a1a2e";

const TIER_LABELS = ["Economy", "Deluxe", "Premium"];
const TIER_ICONS  = {};
const TIER_CLR    = { Economy: "#15803D", Deluxe: "#2563EB", Premium: "#7C3AED" };
const TIER_BG     = { Economy: "#F0FDF4", Deluxe: "#EFF4FF", Premium: "#FAF5FF" };

/* ── inline SVG icons (no clipPath/filter = renders in html2canvas too) ── */
const IcHotel = () => (
  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.19926 19.841V13.9275M10.9991 9.94049H11.0081M10.9991 6.3402H11.0081M12.7989 13.9275V19.841M13.6988 14.4409C12.92 13.8566 11.9727 13.5408 10.9991 13.5408C10.0255 13.5408 9.07821 13.8566 8.29935 14.4409M14.5987 9.94049H14.6077M14.5987 6.3402H14.6077M7.39944 9.94049H7.40844M7.39944 6.3402H7.40844M5.59962 1.83984H16.3985C17.3926 1.83984 18.1984 2.6458 18.1984 3.63999V18.0411C18.1984 19.0353 17.3926 19.8413 16.3985 19.8413H5.59962C4.60561 19.8413 3.7998 19.0353 3.7998 18.0411V3.63999C3.7998 2.6458 4.60561 1.83984 5.59962 1.83984Z" stroke="#F74C4D" strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);
const IcActivity = () => (
  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.1002 17.1008C8.1002 18.5921 6.89136 19.801 5.4002 19.801C3.90903 19.801 2.7002 18.5921 2.7002 17.1008C2.7002 15.6095 3.90903 14.4006 5.4002 14.4006C6.89136 14.4006 8.1002 15.6095 8.1002 17.1008ZM8.1002 17.1008H15.7502C16.5856 17.1008 17.3868 16.7689 17.9776 16.1781C18.5683 15.5873 18.9002 14.786 18.9002 13.9505C18.9002 13.115 18.5683 12.3138 17.9776 11.723C17.3868 11.1322 16.5856 10.8003 15.7502 10.8003H5.8502C5.01476 10.8003 4.21355 10.4684 3.62281 9.87759C3.03207 9.28681 2.7002 8.48553 2.7002 7.65003C2.7002 6.81453 3.03207 6.01325 3.62281 5.42246C4.21355 4.83168 5.01476 4.49978 5.8502 4.49978H13.5002M13.5002 4.49978C13.5002 5.99106 14.709 7.19999 16.2002 7.19999C17.6914 7.19999 18.9002 5.99106 18.9002 4.49978C18.9002 3.00849 17.6914 1.79956 16.2002 1.79956C14.709 1.79956 13.5002 3.00849 13.5002 4.49978Z" stroke="#F74C4D" strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);
const IcTransfer = () => (
  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.9008 14.8398H18.701C19.241 14.8398 19.601 14.4798 19.601 13.9398V11.2398C19.601 10.4298 18.971 9.70984 18.2509 9.52984C16.6308 9.07984 14.2006 8.53984 14.2006 8.53984C14.2006 8.53984 13.0305 7.27984 12.2205 6.46984C11.7704 6.10984 11.2304 5.83984 10.6003 5.83984H4.29983C3.75978 5.83984 3.30975 6.19984 3.03972 6.64984L1.77962 9.25984C1.66044 9.60745 1.59961 9.97238 1.59961 10.3398V13.9398C1.59961 14.4798 1.95964 14.8398 2.49968 14.8398H4.29983M16.9008 14.8398C16.9008 15.834 16.0949 16.6398 15.1007 16.6398C14.1065 16.6398 13.3005 15.834 13.3005 14.8398M16.9008 14.8398C16.9008 13.8457 16.0949 13.0398 15.1007 13.0398C14.1065 13.0398 13.3005 13.8457 13.3005 14.8398M4.29983 14.8398C4.29983 15.834 5.10578 16.6398 6.09997 16.6398C7.09416 16.6398 7.90011 15.834 7.90011 14.8398M4.29983 14.8398C4.29983 13.8457 5.10578 13.0398 6.09997 13.0398C7.09416 13.0398 7.90011 13.8457 7.90011 14.8398M13.3005 14.8398H7.90011" stroke="#F74C4D" strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);
const IcMeals = () => (
  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.39961 7.19997L6.97479 18.2528C7.03593 18.6853 7.25227 19.0809 7.58348 19.3657C7.91469 19.6505 8.33817 19.8052 8.775 19.8009H12.8615C13.2983 19.8052 13.7218 19.6505 14.053 19.3657C14.3842 19.0809 14.6005 18.6853 14.6617 18.2528L16.2008 7.19997M4.49951 7.19997H17.101M6.29972 13.5001C7.01237 13.2015 7.77731 13.0478 8.54997 13.0478C9.32264 13.0478 10.0876 13.2015 10.8002 13.5001C11.5129 13.7986 12.2778 13.9524 13.0505 13.9524C13.8232 13.9524 14.5881 13.7986 15.3007 13.5001M10.8002 7.19997L11.7003 1.79956H13.5005" stroke="#F74C4D" strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);
const IcFlight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#F74C4D"/>
  </svg>
);
/* Call & WhatsApp use file paths — gradients/shadows render fine as <img alt=""> */
const _ICImg = (src, s) => {
  const C = () => <img src={src} crossOrigin="anonymous" style={{ width: s, height: s, display: "block", flexShrink: 0 }} alt="" />;
  C.displayName = "ICImg";
  return C;
};
const IcCall     = _ICImg("/assets/icons/quotation/call.svg",      38);
const IcWhatsApp = _ICImg("/assets/icons/quotation/whatsapp.svg",  38);

/* ── tier helpers (unchanged logic) ────────────────────── */
const hasFlightData = f => !!(f.from || f.to || f.depCity || f.arrCity || f.pnr || f.flightNo);

function hasTierData(tier) {
  if (!tier) return false;
  return (tier.hotels  || []).some(h => h.name)
      || (tier.flights  || []).some(hasFlightData)
      || (tier.transfers|| []).some(t => t.cab && (+t.perDay > 0 || +t.days > 0))
      || (tier.miscs    || []).some(m => m.name);
}

function calcTierCost(tier) {
  const h = (tier.hotels    || []).reduce((s, h) => s + (h.rates||[]).reduce((rs,r) => rs + (+r.price||0)*(+r.nights||0)*(+r.rooms||0), 0), 0);
  const f = (tier.flights   || []).reduce((s, f) => s + ((+f.price||0) + (f.roundTrip ? (+f.returnPrice||0) : 0)) * (+f.pax||0), 0);
  const t = (tier.transfers || []).reduce((s, t) => s + (+t.perDay||0)*(+t.days||0), 0);
  const m = (tier.miscs     || []).reduce((s, m) => s + (+m.amount||0), 0);
  return h + f + t + m;
}

function calcTierSelling(tier, form) {
  const cost = calcTierCost(tier);
  if (!cost) return 0;
  const margin = tier.margin !== undefined ? +tier.margin : (+form.margin || 0);
  const base = cost + margin;
  const gst  = base * (+form.gstPct || 5) / 100;
  const tcs  = form.type === "International" ? (base + gst) * (+form.tcsPct || 0) / 100 : 0;
  return Math.round(base + gst + tcs);
}

function calcTierBase(tier, form) {
  const cost = calcTierCost(tier);
  if (!cost) return 0;
  const margin = tier.margin !== undefined ? +tier.margin : (+form.margin || 0);
  return cost + margin;
}

function getTierPax(tier) {
  const f = (tier.flights || []).find(f => +f.pax > 0);
  return f ? +f.pax : 0;
}

function getPaxLabel(lead) {
  if (lead?.brr?.adults != null) {
    let s = `${lead.brr.adults} Adult${lead.brr.adults !== 1 ? "s" : ""}`;
    if (lead.brr.children) s += `, ${lead.brr.children} Child${lead.brr.children !== 1 ? "ren" : ""}`;
    return s;
  }
  return lead?.pax || null;
}

/* ── rich-text renderer (unchanged) ────────────────────── */
function flattenLists(html) {
  let out = html;
  out = out.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let n = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, content) => {
      n++;
      return `<div style="display:flex;align-items:flex-start;gap:5px;margin-bottom:4px"><span style="min-width:18px;font-weight:bold;flex-shrink:0">${n}.</span><span>${content.trim()}</span></div>`;
    });
  });
  out = out.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, content) =>
      `<div style="display:flex;align-items:flex-start;gap:5px;margin-bottom:4px"><span style="min-width:18px;flex-shrink:0">•</span><span>${content.trim()}</span></div>`
    )
  );
  return out;
}

function RichContent({ html, style }) {
  if (!html) return null;
  const hasHtml = /<[^>]+>/.test(html);
  const base = { fontSize: 13, color: "#374151", lineHeight: 1.8, margin: 0, ...(style || {}) };
  if (hasHtml) return <div dangerouslySetInnerHTML={{ __html: flattenLists(html) }} style={base} />;
  return (
    <div style={base}>
      {html.split("\n").filter(l => l.trim()).map((line, i) => (
        <p key={i} style={{ margin: "0 0 5px" }}>{line}</p>
      ))}
    </div>
  );
}

/* ── date helpers ───────────────────────────────────────── */
function fmtDate(v) {
  if (!v) return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}
function fmtCreated(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      + " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
  } catch { return ""; }
}
const inr = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");
function fmtDateWeekday(v) {
  if (!v) return "";
  try {
    const d = new Date(v + "T00:00:00");
    const wd  = d.toLocaleDateString("en-IN", { weekday: "short" });
    const day = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return `${wd}, ${day}`;
  } catch { return v; }
}

/* ── reusable UI pieces ─────────────────────────────────── */
function MiniHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src="/assets/icons/quotation/long-logo.png" alt="tourwatchout" style={{ height: 38, width: "auto" }} crossOrigin="anonymous" />
        <div style={{ width: 1, height: 36, background: "#ccc" }} />
        <div>
          <div style={{ fontSize: 11, color: "#888" }}>Think Travel</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: RED }}>Think Tourwatchout</div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, imgIcon, title, children, noPad }) {
  return (
    <div style={{ border: "1px solid #88CAD0", borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3FDFF", padding: "11px 16px", borderBottom: "1px solid #88CAD0" }}>
        {imgIcon && <img data-card-icon={imgIcon} src={imgIcon} alt="" crossOrigin="anonymous" style={{ width: 22, height: 22, flexShrink: 0, objectFit: "contain" }} />}
        {!imgIcon && icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{title}</span>
      </div>
      <div style={noPad ? {} : { padding: "16px", background: "#fff" }}>{children}</div>
    </div>
  );
}

function Th({ children, style }) {
  return (
    <th style={{ background: "transparent", color: DARK, padding: "8px 12px", fontSize: 13, fontWeight: 700, textAlign: "left", borderBottom: "1px solid #88CAD0", whiteSpace: "nowrap", ...(style || {}) }}>
      {children}
    </th>
  );
}
function Td({ children, style }) {
  return (
    <td style={{ padding: "8px 12px", fontSize: 11, color: "#333", border: "1px solid #DFF0F0", verticalAlign: "top", lineHeight: 1.5, ...(style || {}) }}>
      {children ?? "—"}
    </td>
  );
}

/* ── Cancellation bar — multi-slab visual ─────────────── */
function CanxBar({ bar }) {
  if (!bar?.enabled) return null;
  const slabs = (bar.slabs || [])
    .filter(s => +s.days > 0 || s.pct === 0)
    .slice()
    .sort((a, b) => b.days - a.days);
  if (slabs.length === 0) return null;

  const maxDays = slabs[0].days;

  /* flat, muted colours — no gradients */
  const segColor = pct =>
    pct === 0   ? "#16A34A"
    : pct <= 30 ? "#65A30D"
    : pct <= 60 ? "#D97706"
    : pct <= 85 ? "#EA580C"
    :              "#DC2626";

  const segBg = pct =>
    pct === 0   ? "#22C55E"
    : pct <= 30 ? "#84CC16"
    : pct <= 60 ? "#F59E0B"
    : pct <= 85 ? "#F97316"
    :              "#EF4444";

  const segLight = pct =>
    pct === 0   ? "#DCFCE7"
    : pct <= 30 ? "#ECFCCB"
    : pct <= 60 ? "#FEF3C7"
    : pct <= 85 ? "#FFEDD5"
    :              "#FEE2E2";

  const segIcon = pct => pct === 0 ? "✓" : pct < 100 ? "!" : "✕";

  const segs = slabs.map((slab, i) => {
    const nextDays = i < slabs.length - 1 ? slabs[i + 1].days : 0;
    const range    = slab.days - nextDays;
    const wPct     = maxDays > 0 ? (range / maxDays) * 100 : 100 / slabs.length;
    return { ...slab, nextDays, wPct };
  });

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16, border: "1px solid #E5E7EB" }}>

      {/* Header */}
      <div style={{ background: "#1e293b", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#f1f5f9", fontSize: 12.5, fontWeight: 700, letterSpacing: ".02em" }}>Cancellation Policy</div>
        <div style={{ color: "#94A3B8", fontSize: 10.5 }}>Days remaining before travel</div>
      </div>

      <div style={{ padding: "16px 16px 14px", background: "#fff" }}>

        {/* ── bar ── */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <div style={{ display: "flex", height: 20, borderRadius: 10, overflow: "hidden" }}>
            {segs.map((seg, i) => (
              <div key={i} style={{
                width: `${seg.wPct}%`, minWidth: 3,
                background: segBg(seg.pct),
                borderRight: i < segs.length - 1 ? "3px solid #fff" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>
                  {seg.pct === 0 ? "FREE" : `${seg.pct}%`}
                </span>
              </div>
            ))}
          </div>

          {/* boundary dots */}
          {(() => {
            let cumW = 0;
            return segs.slice(0, -1).map((seg, i) => {
              cumW += seg.wPct;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${cumW}%`, top: -5,
                  transform: "translateX(-50%)",
                  width: 30, height: 30, borderRadius: "50%",
                  background: "#fff",
                  border: `2.5px solid ${segColor(segs[i + 1].pct)}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 2,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: segColor(segs[i + 1].pct) }}>
                    {segs[i + 1].days}d
                  </span>
                </div>
              );
            });
          })()}
        </div>

        {/* ── slab cards ── */}
        <div style={{ display: "flex", gap: 6, marginTop: 18 }}>
          {segs.map((seg, i) => (
            <div key={i} style={{
              flex: `${seg.wPct} 1 0%`, minWidth: 0,
              borderRadius: 8,
              border: `1.5px solid ${segColor(seg.pct)}30`,
              background: segLight(seg.pct),
              padding: "10px 6px",
              textAlign: "center",
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: segBg(seg.pct),
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 6px",
              }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>{segIcon(seg.pct)}</span>
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: segColor(seg.pct) }}>
                {seg.days}+ days
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "#374151", marginTop: 2 }}>
                {seg.pct === 0 ? "No Charge" : `${seg.pct}% deducted`}
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ marginTop: 10, padding: "7px 11px", background: "#FEF2F2", borderRadius: 7, border: "1px solid #FECACA" }}>
          <span style={{ fontSize: 11, color: "#991B1B" }}>
            ✕ &nbsp;Less than <strong>{slabs[slabs.length - 1].days} days</strong> before travel — Package is <strong>Non-Refundable</strong>.
          </span>
        </div>

      </div>
    </div>
  );
}

function Pill({ label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", border: "1px solid #ccc", borderRadius: 20, padding: "5px 14px", fontSize: 12.5, color: DARK, background: "#fff", marginRight: 8, marginBottom: 8 }}>
      {label}
    </span>
  );
}

function FlightCard({ f }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {(f.pnr || f.flightNo) && (
        <div style={{ display: "flex", gap: 20, marginBottom: 6, fontSize: 12, color: "#444" }}>
          {f.pnr    && <span><strong>PNR:</strong> <span style={{ fontWeight: 800, letterSpacing: 1, color: DARK }}>{f.pnr}</span></span>}
          {f.flightNo && <span><strong>Flight:</strong> {f.flightNo}</span>}
          <span style={{ marginLeft: "auto" }}>{f.roundTrip ? "Round Trip" : "One-way"} · {f.pax || "—"} Pax</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", background: "#F5FBFB", border: `1px solid ${TEAL_BORDER}`, borderRadius: 8, padding: "12px 16px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: DARK }}>{f.depCity || f.from || "—"}</div>
          {f.depIATA && <div style={{ fontSize: 11, color: "#888" }}>({f.depIATA})</div>}
          {(f.depDate || f.date) && <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{fmtDate(f.depDate || f.date)}</div>}
          {f.depTime && <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, marginTop: 2 }}>{f.depTime}</div>}
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: "0 8px" }}>
          {f.flightNo && <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{f.flightNo}</div>}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
            <div style={{ flex: 1, height: 2, background: TEAL }} />
            <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `8px solid ${TEAL}`, flexShrink: 0 }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: DARK }}>{f.arrCity || f.to || "—"}</div>
          {f.arrIATA && <div style={{ fontSize: 11, color: "#888" }}>({f.arrIATA})</div>}
          {f.arrDate && <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{fmtDate(f.arrDate)}</div>}
          {f.arrTime && <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, marginTop: 2 }}>{f.arrTime}</div>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function QuotationPreview({ data, id }) {
  const {
    quoteId, lead = {}, form = {},
    pkgTiers,
    hotels = [], flights = [], transfers = [], miscs = [],
    itin = [], selling = 0,
  } = data || {};

  /* tier mode */
  const isB2B       = form.quoteType === "b2b";
  const useTiers    = pkgTiers && TIER_LABELS.some(lbl => hasTierData(pkgTiers[lbl]));
  /* activeTiers — tiers with a non-zero selling price, used for the pricing box */
  const activeTiers = useTiers
    ? TIER_LABELS.filter(lbl => hasTierData(pkgTiers[lbl]) && calcTierSelling(pkgTiers[lbl], form) > 0)
    : [];
  /* dataTiers — all tiers with any data, used for service detail cards (hotels/flights/transfers).
     In B2B mode prices are not filled in, so activeTiers can be empty even when data exists. */
  const dataTiers   = useTiers
    ? TIER_LABELS.filter(lbl => hasTierData(pkgTiers[lbl]))
    : [];
  const isPackage   = form.quoteType === "package";

  /* per-person mode (package only) */
  const ppSell     = isPackage && !!form.ppSellEnabled;
  const ppSub      = isPackage && !!form.ppSubEnabled;
  const ppSubTotal = isPackage && !!form.ppSubTotalEnabled;
  const leadPax = (() => {
    const brr = lead?.brr || {};
    if (brr.adults != null) return (brr.adults || 0) + (brr.children || 0);
    const raw = lead?.pax || "";
    const a = raw.match(/(\d+)\s*(?:adult|adults)/i);
    const ch = raw.match(/(\d+)\s*(?:child|children|kid|kids)/i);
    const first = parseInt(raw);
    return (a ? +a[1] : (!isNaN(first) && first > 0 ? first : 0)) + (ch ? +ch[1] : 0);
  })();

  /* derived */
  const destination = lead.destination || "";
  const paxLabel    = getPaxLabel(lead);
  const sp          = typeof form.assignedTo === "object" && form.assignedTo?.name ? form.assignedTo : null;
  const createdAt   = fmtCreated(form.createdAt);

  /* highlight visibility — use dataTiers so B2B (no pricing) still shows pills */
  const showHotel    = useTiers ? dataTiers.some(l => (pkgTiers[l].hotels   ||[]).some(h => h.name)) : hotels.some(h => h.name);
  const showTransfer = useTiers ? dataTiers.some(l => (pkgTiers[l].transfers||[]).some(t => t.cab && +t.days > 0)) : transfers.some(t => +t.perDay > 0);
  const showFlight   = useTiers ? dataTiers.some(l => (pkgTiers[l].flights  ||[]).some(hasFlightData)) : flights.some(hasFlightData);
  const hasItin      = itin.some(d => d.title || d.itinerary || d.date || d.tour || d.transfer);

  /* manual highlights: if form.highlights array is set, it controls visibility + labels;
     otherwise fall back to auto-detect from data presence.
     Supports both legacy string[] and new {key,label}[] formats. */
  const hlArr = Array.isArray(form.highlights) && form.highlights.length > 0 ? form.highlights : null;
  const hlNorm = hlArr
    ? (typeof hlArr[0] === "string"
        ? hlArr.map(k => ({ key: k, label: k }))
        : hlArr)
    : null;
  const showHL  = key => hlNorm ? hlNorm.some(h => h.key === key) : (
    key === "hotel"    ? showHotel    :
    key === "activity" ? hasItin      :
    key === "transfer" ? showTransfer :
    key === "meals"    ? !!form.inclusions :
    key === "flight"   ? showFlight   : false
  );
  const labelHL = (key, def) => hlNorm?.find(h => h.key === key)?.label || def;

  /* contents list */
  const contents = [
    hasItin && "Your Itinerary",
    hasItin && "Day Wise Details",
    form.bookingPolicy && "How To Book",
    form.cancellationPolicy && "Cancellation & Date Change Policies",
  ].filter(Boolean);

  return (
    <div id={id} style={{ fontFamily: "Arial, Helvetica, sans-serif", background: "#fff", width: "100%", maxWidth: 780, margin: "0 auto", border: "1px solid #d0d0d0", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", boxSizing: "border-box" }}>

      {/* ══════════════════════════════
          COVER PAGE
      ══════════════════════════════ */}
      <div style={{ padding: "36px 32px 28px" }}>

        {/* Hero: name + destination + logo */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 40, color: DARK, marginBottom: 4, lineHeight: 1.3 }}>
              {lead.name
                ? <><strong>{lead.name.split(" ")[0]}'s</strong> trip to</>
                : "Your trip to"}
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, color: RED, lineHeight: 1.2, marginBottom: 18, wordBreak: "break-word" }}>
              {destination || "Your Destination"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {form.days && (
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #ccc", borderRadius: 20, padding: "5px 16px", fontSize: 13.5, fontWeight: 600, color: DARK }}>
                  {form.days}
                </span>
              )}
              {paxLabel && (
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #ccc", borderRadius: 20, padding: "5px 16px", fontSize: 13.5, fontWeight: 600, color: DARK }}>
                  Pax: {paxLabel}
                </span>
              )}
              {quoteId && (
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #e0e0e0", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: "#888" }}>
                  {quoteId}
                </span>
              )}
            </div>
          </div>
          <img src="/assets/voucher/logo.png" alt="tourwatchout" style={{ width: 210, height: "auto", flexShrink: 0, marginLeft: 20, marginTop: 4 }} crossOrigin="anonymous" />
        </div>

        <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* Contents + Coordinator */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>

          {/* Contents list */}
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEAL, marginBottom: 16 }}>Contents</div>
            {contents.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: TEAL_LIGHT, border: `1.5px solid ${TEAL_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: TEAL, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13.5, color: DARK }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Coordinator card */}
          <div style={{ border: `1px solid ${TEAL_BORDER}`, borderRadius: 20, padding: "16px 18px", background: "#F3FDFF" }}>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>Your Travel Co-ordinator</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: DARK }}>{sp?.name || "Savi Prajapati"}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href="tel:+918882701800" data-pdf-link="tel:+918882701800" style={{ textDecoration: "none" }}>
                  <IcCall />
                </a>
                <a href="https://wa.me/918882701800" data-pdf-link="https://wa.me/918882701800" style={{ textDecoration: "none" }}>
                  <IcWhatsApp />
                </a>
              </div>
            </div>
            <div style={{ fontSize: 13, color: DARK, marginBottom: 3 }}>Call: <strong>+91 8882701800</strong></div>
            <div style={{ fontSize: 13, color: DARK, marginBottom: 14 }}>Email: <strong>{sp?.email || "sales1@tourwatchout.com"}</strong></div>
            {createdAt && (
              <>
                <hr style={{ margin: "0 0 12px", border: "none", borderTop: "1px solid #eee" }} />
                <div style={{ fontSize: 12, color: "#555" }}>Quotation Created on <strong>{createdAt}</strong></div>
              </>
            )}
          </div>
        </div>

        {/* Highlights */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 12 }}>Highlights</div>
          <div>
            {showHL("hotel")    && <Pill iconKey="hotel"    label={labelHL("hotel",    "Hotel")} />}
            {showHL("activity") && <Pill iconKey="activity" label={labelHL("activity", "Activities")} />}
            {showHL("transfer") && <Pill iconKey="transfer" label={labelHL("transfer", "Transfers")} />}
            {showHL("meals")    && <Pill iconKey="meals"    label={labelHL("meals",    "Selected Meals Included")} />}
            {showHL("flight")   && <Pill iconKey="flight"   label={labelHL("flight",   "Flights")} />}
          </div>
        </div>

        {/* Package pricing box — only in Package mode; Standard/B2B use the flat selling price below */}
        {isPackage && useTiers && activeTiers.length > 0 && (
          <div style={{ border: "1px solid #26828D", borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
            {activeTiers.map((lbl, idx) => {
              const tier        = pkgTiers[lbl];
              const tierSelling = calcTierSelling(tier, form);
              const tierBase    = calcTierBase(tier, form);
              const tierPax     = getTierPax(tier);
              const effPax      = leadPax > 0 ? leadPax : tierPax;
              const displayVal  = ppSell && effPax > 0
                ? Math.round(tierSelling / effPax)
                : ppSub && effPax > 0
                  ? Math.round(tierBase / effPax)
                  : ppSubTotal
                    ? Math.round(tierBase)
                    : isPackage ? tierSelling : tierSelling;
              const priceLabel  = !isPackage
                ? <>{lbl} Package <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>Incl. Tax</span></>
                : ppSell && effPax > 0
                  ? <>Per Person Price <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Incl. Tax)</span></>
                  : ppSub && effPax > 0
                    ? <>Per Person Price <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Excl. GST)</span></>
                    : ppSubTotal
                      ? <>Total Package Cost <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Excl. GST)</span></>
                      : <>Total Package Cost <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Incl. Tax)</span></>;
              const suffix = (ppSell || ppSub) && effPax > 0
                ? <span style={{ fontSize: 13, color: DARK }}>Per Person</span>
                : ppSubTotal
                  ? (effPax > 0 ? <span style={{ fontSize: 13, color: DARK }}>For {effPax} {effPax === 1 ? "Person" : "Persons"}</span> : paxLabel && <span style={{ fontSize: 13, color: DARK }}>For {paxLabel}</span>)
                  : effPax > 0
                    ? <span style={{ fontSize: 13, color: DARK }}>For {effPax} {effPax === 1 ? "Person" : "Persons"}</span>
                    : paxLabel && <span style={{ fontSize: 13, color: DARK }}>For {paxLabel}</span>;
              return (
                <div key={lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", borderBottom: idx < activeTiers.length - 1 ? "1px solid #26828D" : "none" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: TEAL }}>{priceLabel}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: "#26828D" }}>₹ {displayVal.toLocaleString("en-IN")}</span>
                    {suffix}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legacy single price — Standard/B2B always; Package mode only when no priced tiers */}
        {selling > 0 && (!isPackage || !useTiers || activeTiers.length === 0) && (() => {
          const base = (+form.cost || 0) + (+form.margin || 0);
          const legacyVal = ppSell && leadPax > 0
            ? Math.round(selling / leadPax)
            : ppSub && leadPax > 0
              ? Math.round(base / leadPax)
              : ppSubTotal
                ? Math.round(base)
                : Math.round(selling);
          const legacyLabel = !isPackage
            ? <>Total Cost Price <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Incl. Tax)</span></>
            : ppSell && leadPax > 0
              ? <>Per Person Price <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Incl. Tax)</span></>
              : ppSub && leadPax > 0
                ? <>Per Person Price <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Excl. GST)</span></>
                : ppSubTotal
                  ? <>Total Package Cost <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Excl. GST)</span></>
                  : <>Total Package Cost <span style={{ fontWeight: 400, fontSize: 14, color: DARK }}>(Incl. Tax)</span></>;
          const legacySuffix = (ppSell || ppSub) && leadPax > 0
            ? <span style={{ fontSize: 20, color: DARK }}>Per Person</span>
            : leadPax > 0
              ? <span style={{ fontSize: 20, color: DARK }}>For {leadPax} {leadPax === 1 ? "Person" : "Persons"}</span>
              : paxLabel && <span style={{ fontSize: 20, color: DARK }}>For {paxLabel}</span>;
          return (
            <div style={{ border: "1px solid #26828D", borderRadius: 12, padding: "16px 22px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: TEAL }}>{legacyLabel}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 34, fontWeight: 900, color: "#26828D" }}>₹ {legacyVal.toLocaleString("en-IN")}</span>
                {legacySuffix}
              </div>
            </div>
          );
        })()}

        {/* Note box — always generic disclaimer */}
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: "14px 18px", background: "#F3FDFF" }}>
          <div style={{ fontSize: 13, color: DARK, lineHeight: 1.75 }}>
            <strong>Note:</strong>{" "}
            This is a tentative and estimated quote and may vary based on selected hotels, inclusions, and customizations. Our Travel Expert will assist with any modifications.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          YOUR ITINERARY
      ══════════════════════════════ */}
      {hasItin && (
        <div data-pdf-section="true">
          <MiniHeader />
          <div style={{ padding: "28px 32px" }}>
            <div style={{ fontSize: 32, color: DARK, marginBottom: 4 }}>Your <strong>Itinerary</strong></div>
            {destination && (
              <div style={{ fontSize: 44, fontWeight: 900, color: RED, marginBottom: 24, lineHeight: 1.2 }}>
                {form.days ? `${form.days} in ` : ""}{destination}
              </div>
            )}

            {(() => {
              const rows = itin.filter(d => d.title || d.itinerary || d.date || d.tour || d.transfer || d.pickup_time || d.activities?.length);

              /* Build groups — a day with a title+activities starts a new bordered group;
                 subsequent title-less days continue that group. */
              const groups = [];
              let currentGroup = null;
              let dayCount = 0;

              for (const item of rows) {
                const hasAct = item.activities?.length > 0;
                const isStandaloneHeader   = item.title && !item.date && !item.tour && !item.transfer && !item.itinerary && !item.pickup_time && !hasAct;
                const isStandaloneTransfer = item.transfer && !item.date && !item.title && !item.tour && !item.itinerary && !item.pickup_time && !hasAct;

                if (isStandaloneHeader) {
                  groups.push({ type: "header", item });
                  currentGroup = null;
                } else if (isStandaloneTransfer) {
                  groups.push({ type: "transfer", item });
                  currentGroup = null;
                } else {
                  dayCount++;
                  const dayEntry = { item, dayNum: dayCount, hasAct };
                  if (hasAct && item.title) {
                    /* New bordered group starting with this day's title */
                    currentGroup = { type: "group", header: item.title, days: [dayEntry] };
                    groups.push(currentGroup);
                  } else if (currentGroup?.type === "group") {
                    currentGroup.days.push(dayEntry);
                  } else {
                    /* Legacy / ungrouped day */
                    groups.push({ type: "solo", ...dayEntry });
                    currentGroup = null;
                  }
                }
              }

              const ActIcon = ({ type }) =>
                type === "hotel"    ? <IcHotel />    :
                type === "meals"    ? <IcMeals />    :
                type === "activity" ? <IcActivity /> :
                <IcTransfer />;

              const ActRow = ({ act }) => (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7, fontSize: 13, color: DARK }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}><ActIcon type={act.type} /></span>
                  <span dangerouslySetInnerHTML={{ __html: act.text }} />
                </div>
              );

              const LegacyActs = ({ item }) => (<>
                {item.transfer   && <div style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:7,fontSize:13,color:DARK }}><span style={{flexShrink:0,marginTop:1}}><IcTransfer /></span><span>{item.transfer}</span></div>}
                {item.tour       && <div style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:7,fontSize:13,color:DARK }}><span style={{flexShrink:0,marginTop:1}}><IcActivity /></span><span>{item.tour}</span></div>}
                {item.pickup_time&& <div style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:7,fontSize:13,color:DARK }}><span style={{flexShrink:0,marginTop:1}}><IcTransfer /></span><span>Pickup: {item.pickup_time}</span></div>}
                {item.itinerary  && <RichContent html={item.itinerary} style={{ fontSize:12.5,color:"#444",lineHeight:1.75 }} />}
              </>);

              return groups.map((group, gi) => {
                if (group.type === "header") {
                  return (
                    <div key={gi} data-pdf-break="true" style={{ display:"flex",alignItems:"center",gap:10,background:"#F3FDFF",border:"1px solid #88CAD0",borderRadius:10,padding:"12px 18px",marginBottom:8,marginTop:gi>0?18:0 }}>
                      <img data-card-icon="/assets/icons/quotation/location.png" src="/assets/icons/quotation/location.png" alt="" crossOrigin="anonymous" style={{ width:20,height:20,flexShrink:0,objectFit:"contain" }} />
                      <span style={{ fontSize:18,fontWeight:700,color:DARK }}>{group.item.title}</span>
                    </div>
                  );
                }

                if (group.type === "transfer") {
                  return (
                    <div key={gi} style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 18px",marginBottom:8,marginTop:4 }}>
                      <IcTransfer />
                      <span style={{ fontSize:13.5,fontWeight:600,color:DARK }}>{group.item.transfer}</span>
                    </div>
                  );
                }

                if (group.type === "solo") {
                  const { item, dayNum } = group;
                  return (
                    <div key={gi} data-pdf-break="true" style={{ display:"grid",gridTemplateColumns:"160px 1fr",borderTop:gi>0?"1px solid #e8e8e8":"none",padding:"14px 4px" }}>
                      <div style={{ paddingRight:12 }}>
                        {item.date && <div style={{ fontSize:13,fontWeight:700,color:DARK,marginBottom:3 }}>{fmtDate(item.date)}</div>}
                        <div style={{ fontSize:11,color:TEAL,fontWeight:600 }}>Day {dayNum}</div>
                        {item.title && <div style={{ fontSize:12,color:"#555",marginTop:5,lineHeight:1.4 }}>{item.title}</div>}
                      </div>
                      <div><LegacyActs item={item} /></div>
                    </div>
                  );
                }

                /* Bordered group with location header */
                return (
                  <div key={gi} data-pdf-break="true" style={{ border:"1px solid #88CAD0",borderRadius:12,overflow:"hidden",marginBottom:8,marginTop:gi>0?16:0 }}>
                    {/* Location header row */}
                    <div style={{ display:"flex",alignItems:"center",gap:10,background:"#F3FDFF",padding:"11px 18px",borderBottom:"1px solid #e0f0f0" }}>
                      <img data-card-icon="/assets/icons/quotation/location.png" src="/assets/icons/quotation/location.png" alt="" crossOrigin="anonymous" style={{ width:18,height:18,flexShrink:0,objectFit:"contain" }} />
                      <span style={{ fontSize:15,fontWeight:700,color:DARK }}>{group.header}</span>
                    </div>
                    {/* Day rows */}
                    {group.days.map(({ item, dayNum, hasAct }, di) => (
                      <div key={di} data-pdf-break="true" style={{ display:"grid",gridTemplateColumns:"180px 1fr",borderTop:di>0?"1px solid #e8e8e8":"none",padding:"14px 18px" }}>
                        {/* Date + Day on one line */}
                        <div style={{ paddingRight:12 }}>
                          <div style={{ fontSize:13,fontWeight:700,color:DARK }}>
                            {item.date ? fmtDateWeekday(item.date) : ""}
                            {item.date && <span style={{ color:DARK,fontWeight:700 }}>, Day {dayNum}</span>}
                            {!item.date && <span style={{ color:DARK,fontWeight:700 }}>Day {dayNum}</span>}
                          </div>
                        </div>
                        {/* Activities */}
                        <div>
                          {hasAct
                            ? item.activities.map((act, ai) => <ActRow key={ai} act={act} />)
                            : <LegacyActs item={item} />
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          PACKAGE DETAILS — TIER MODE
      ══════════════════════════════ */}
      {useTiers && dataTiers.length > 0 && (
        <div data-pdf-section="true">
          <MiniHeader />
          <div style={{ padding: "28px 32px" }}>

            {dataTiers.map((lbl, tidx) => {
              const tier      = pkgTiers[lbl];
              const tHotels   = (tier.hotels   || []).filter(h => h.name);
              const tFlights  = (tier.flights  || []).filter(hasFlightData);
              const tTransfers= (tier.transfers|| []).filter(t => t.cab && (+t.perDay > 0 || +t.days > 0));
              const tMiscs    = (tier.miscs    || []).filter(m => m.name);
              const tierSell  = calcTierSelling(tier, form);
              const tierPax   = getTierPax(tier);

              return (
                <div key={lbl}>
                  {/* Tier label */}
                  <div style={{ fontSize: 15, fontWeight: 700, color: DARK, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
                    {lbl} Package
                  </div>

                  {/* Hotels */}
                  {tHotels.length > 0 && (
                    <Card imgIcon="/assets/icons/quotation/hotel-details.svg" title="Hotel Details" noPad>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <Th>Location</Th>
                            <Th>Hotel Name</Th>
                            <Th>Room Category</Th>
                            <Th style={{ textAlign: "center" }}>No. Of Rooms</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {tHotels.map((h, hi) => {
                            const rates = (h.rates?.length
                              ? h.rates
                              : [{ occupancy: h.occupancy || "Double", roomCat: h.roomCat, nights: h.nights, rooms: h.rooms }]
                            ).filter(r => r.occupancy || r.nights || r.rooms);
                            return rates.map((r, ri) => (
                              <tr key={`${hi}-${ri}`} {...(hi > 0 || ri > 0 ? { "data-pdf-break": "true" } : {})} style={{ background: "#fff" }}>
                                <Td style={{ fontWeight: 600 }}>{ri === 0 ? (h.location || "—") : ""}</Td>
                                <Td style={{ fontWeight: ri === 0 ? 700 : 400 }}>{ri === 0 ? h.name : ""}</Td>
                                <Td>{r.roomCat || "Deluxe Room"}</Td>
                                <Td style={{ textAlign: "center" }}>{r.rooms ?? 1}</Td>
                              </tr>
                            ));
                          })}
                        </tbody>
                      </table>
                    </Card>
                  )}

                  {/* Cab Details */}
                  {tTransfers.length > 0 && (
                    <div data-pdf-break="true">
                      <Card imgIcon="/assets/icons/quotation/cab-details.svg" title="Cab Details" noPad>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <Th>Cab Type</Th>
                              <Th style={{ width: "30%", textAlign: "center" }}>Duration</Th>
                            </tr>
                          </thead>
                          <tbody>
                            {tTransfers.map((t, ti) => (
                              <tr key={ti} style={{ background: "#fff" }}>
                                <Td>{t.cab}</Td>
                                <Td style={{ textAlign: "center" }}>{t.days ? `${t.days} Days` : "—"}</Td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Card>
                    </div>
                  )}

                  {/* Flights */}
                  {tFlights.length > 0 && (
                    <div data-pdf-break="true">
                      <Card icon={<IcFlight />} title="Flight Details">
                        {tFlights.map((f, fi) => <FlightCard key={fi} f={f} />)}
                      </Card>
                    </div>
                  )}

                  {/* Miscellaneous */}
                  {tMiscs.length > 0 && (
                    <div data-pdf-break="true">
                      <Card imgIcon="/assets/icons/quotation/miscellaneous-details.svg" title="Add on">
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {tMiscs.map((m, mi) => (
                            <li key={mi} style={{ fontSize: 13, color: DARK, marginBottom: 5 }}>{m.name}</li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  )}

                  {/* Financials — Package mode uses per-tier price; Standard/B2B use flat selling */}
                  {(() => {
                    const displaySell = isPackage ? tierSell : selling;
                    if (!(displaySell > 0)) return null;
                    const effPax = leadPax > 0 ? leadPax : tierPax;
                    return (
                      <div style={{ border: `1px solid ${TEAL_BORDER}`, borderRadius: 10, padding: "14px 18px", background: "transparent", marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: TEAL }}>{lbl} Package — Net Cost (Incl. GST)</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                            <span style={{ fontSize: 20, fontWeight: 900, color: DARK }}>
                              ₹ {Math.round(displaySell).toLocaleString("en-IN")}/-
                            </span>
                            {effPax > 1 && (
                              <span style={{ fontSize: 12, color: "#666" }}>
                                Per Person: ₹ {Math.round(displaySell / effPax).toLocaleString("en-IN")}/-
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {tidx < dataTiers.length - 1 && (
                    <hr style={{ border: "none", borderTop: "2px dashed #DFF0F0", margin: "22px 0" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          PACKAGE DETAILS — LEGACY MODE
      ══════════════════════════════ */}
      {!useTiers && (hotels.some(h => h.name) || transfers.some(t => +t.perDay > 0) || flights.some(hasFlightData) || miscs.some(m => m.name)) && (
        <div data-pdf-section="true">
          <MiniHeader />
          <div style={{ padding: "28px 32px" }}>

            {hotels.filter(h => h.name).length > 0 && (
              <Card imgIcon="/assets/icons/quotation/hotel-details.svg" title="Hotel Details" noPad>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <Th>Location</Th>
                      <Th>Hotel Name</Th>
                      <Th>Room Category</Th>
                      <Th style={{ textAlign: "center" }}>No. Of Rooms</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotels.filter(h => h.name).map((h, hi) => {
                      const rates = (h.rates?.length ? h.rates : [{ occupancy: h.occupancy || "Double", roomCat: h.roomCat, nights: h.nights, rooms: h.rooms }]).filter(r => r.occupancy || r.nights);
                      return rates.map((r, ri) => (
                        <tr key={`${hi}-${ri}`} {...(hi > 0 || ri > 0 ? { "data-pdf-break": "true" } : {})} style={{ background: "#fff" }}>
                          <Td style={{ fontWeight: 600 }}>{ri === 0 ? (h.location || "—") : ""}</Td>
                          <Td style={{ fontWeight: ri === 0 ? 700 : 400 }}>{ri === 0 ? h.name : ""}</Td>
                          <Td>{r.roomCat || "—"}</Td>
                          <Td style={{ textAlign: "center" }}>{r.rooms || 1}</Td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </Card>
            )}

            {transfers.filter(t => +t.perDay > 0).length > 0 && (
              <div data-pdf-break="true">
                <Card imgIcon="/assets/icons/quotation/cab-details.svg" title="Cab Details" noPad>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr><Th>Cab Type</Th><Th style={{ width: "30%", textAlign: "center" }}>Duration</Th></tr></thead>
                    <tbody>
                      {transfers.filter(t => +t.perDay > 0).map((t, i) => (
                        <tr key={i} style={{ background: "#fff" }}>
                          <Td>{t.cab}</Td>
                          <Td style={{ textAlign: "center" }}>{t.days ? `${t.days} Days` : "—"}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {flights.filter(f => hasFlightData(f) || +f.price > 0).length > 0 && (
              <div data-pdf-break="true">
                <Card icon={<IcFlight />} title="Flight Details">
                  {flights.filter(f => hasFlightData(f) || +f.price > 0).map((f, fi) => <FlightCard key={fi} f={f} />)}
                </Card>
              </div>
            )}

            {miscs.filter(m => m.name).length > 0 && (
              <div data-pdf-break="true">
                <Card imgIcon="/assets/icons/quotation/miscellaneous-details.svg" title="Add on">
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {miscs.filter(m => m.name).map((m, i) => (
                      <li key={i} style={{ fontSize: 13, color: DARK, marginBottom: 5 }}>{m.name}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}

            {selling > 0 && (
              <div style={{ border: `1px solid ${TEAL_BORDER}`, borderRadius: 10, padding: "14px 18px", background: "transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEAL }}>Package — Net Cost (Incl. GST)</div>
                  <span style={{ fontSize: 20, fontWeight: 900, color: DARK }}>₹ {Math.round(selling).toLocaleString("en-IN")}/-</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          INCLUSIONS & EXCLUSIONS
      ══════════════════════════════ */}
      {(form.inclusions || form.exclusions) && (
        <div data-pdf-section="true">
          <MiniHeader />
          <div style={{ padding: "28px 32px" }}>
            {form.inclusions && (
              <Card title="INCLUSIONS:">
                <RichContent html={form.inclusions} style={{ fontSize: 13, lineHeight: 1.8 }} />
              </Card>
            )}
            {form.exclusions && (
              <Card title="EXCLUSIONS:">
                <RichContent html={form.exclusions} style={{ fontSize: 13, lineHeight: 1.8 }} />
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          IMPORTANT NOTES
      ══════════════════════════════ */}
      {form.notes && (
        <div data-pdf-section="true">
          <MiniHeader />
          <div style={{ padding: "28px 32px" }}>
            <Card title="IMPORTANT NOTES:">
              <RichContent html={form.notes} style={{ fontSize: 13, lineHeight: 1.8 }} />
            </Card>
          </div>
        </div>
      )}

      {/* CTA Banner */}
      <div style={{ padding: "0 32px 24px" }}>
        <div data-pdf-link="https://tourwatchout.com/contact-us" style={{ display: "block", cursor: "pointer" }}>
          <img src="/assets/icons/quotation/cta.png" alt="Get a Callback" crossOrigin="anonymous" style={{ width: "100%", borderRadius: 12, display: "block" }} />
        </div>
      </div>

      {/* ══════════════════════════════
          HOW TO BOOK
      ══════════════════════════════ */}
      {form.bookingPolicy && (
        <div data-pdf-section="true">
          <MiniHeader />
          <div style={{ padding: "28px 32px" }}>
            <Card title="How To Book">
              <RichContent html={form.bookingPolicy} style={{ fontSize: 13, lineHeight: 1.8 }} />
            </Card>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          CANCELLATION
      ══════════════════════════════ */}
      {(form.cancellationPolicy || form.canxBar?.enabled) && (
        <div data-pdf-section="true">
          <MiniHeader />
          <div style={{ padding: "28px 32px" }}>
            <Card title="Cancellation & Date Change Policies">
              {form.canxBar?.enabled && <CanxBar bar={form.canxBar} />}
              {form.cancellationPolicy && <RichContent html={form.cancellationPolicy} style={{ fontSize: 13, lineHeight: 1.8 }} />}
            </Card>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          TERMS & CONDITIONS LINK
      ══════════════════════════════ */}
      <div data-pdf-section="true">
        <MiniHeader />
        <div style={{ padding: "28px 32px", display: "flex", justifyContent: "flex-end" }}>
          <a
            href="https://tourwatchout.com/term-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            data-pdf-link="https://tourwatchout.com/term-and-conditions"
            style={{ textDecoration: "none", cursor: "pointer", display: "block" }}
          >
            <div
              style={{
                border: `1px solid ${TEAL_BORDER}`,
                borderRadius: 20,
                padding: "14px 40px",
                textAlign: "center",
                background: "#FBFCFE",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Terms &amp; Conditions*</div>
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 6, textAlign: "center" }}>Click To View</div>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════
          COORDINATOR FULL CARD
      ══════════════════════════════ */}
      <div data-pdf-section="true">
        <MiniHeader />
        <div style={{ padding: "36px 32px" }}>
          <div style={{ border: `1px solid ${TEAL_BORDER}`, borderRadius: 20, padding: "24px 26px", background: "#F3FDFF", marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>Your Travel Co-ordinator</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: DARK }}>{sp?.name || "Savi Prajapati"}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="tel:+918882701800" data-pdf-link="tel:+918882701800" style={{ textDecoration: "none" }}>
                  <IcCall />
                </a>
                <a href="https://wa.me/918882701800" data-pdf-link="https://wa.me/918882701800" style={{ textDecoration: "none" }}>
                  <IcWhatsApp />
                </a>
              </div>
            </div>
            <div style={{ fontSize: 14, color: DARK, marginBottom: 5 }}>Call: <strong>+91 8882701800</strong></div>
            <div style={{ fontSize: 14, color: DARK, marginBottom: 18 }}>Email: <strong>{sp?.email || "sales1@tourwatchout.com"}</strong></div>
            <hr style={{ border: "none", borderTop: "1px solid #eee", marginBottom: 14 }} />
            {createdAt && <div style={{ fontSize: 13, color: "#555" }}>Quotation Created on <strong>{createdAt}</strong></div>}
          </div>
          <div style={{ border: `1px solid ${TEAL_BORDER}`, borderRadius: 20, padding: "16px 18px", background: "#F3FDFF" }}>
            <div style={{ fontSize: 13, color: DARK, lineHeight: 1.8, fontWeight: 500 }}>
              This is a tentative and estimated quote and may vary based on selected hotels, inclusions, and customizations. Our Travel Expert will assist with any modifications.
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          THANK YOU PAGE
      ══════════════════════════════ */}
      <div data-pdf-section="true" data-pdf-fullpage="true" style={{ lineHeight: 0, fontSize: 0 }}>
        <img src="/assets/icons/quotation/bottom-page.jpg" alt="Thank you" crossOrigin="anonymous"
          style={{ width: "100%", display: "block" }} />
      </div>

    </div>
  );
}

