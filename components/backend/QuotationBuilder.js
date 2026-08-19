import React, { useState, useRef, useEffect, useMemo } from "react";
import QuotationPreview from "../voucher/QuotationPreview";

/* ── helpers ── */
const todayISO = () => new Date().toISOString().slice(0, 10);
const inr = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");
function fmtDate(v) {
  if (!v) return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}
function calcQ(f) {
  const cost = +f.cost || 0, margin = +f.margin || 0;
  const base = cost + margin;
  const gst  = base * (+f.gstPct || 0) / 100;
  const tcs  = f.type === "International" ? (base + gst) * (+f.tcsPct || 0) / 100 : 0;
  const selling = base + gst + tcs;
  const mpct = cost > 0 ? (margin / cost) * 100 : 0;
  return { cost, margin, base, gst, tcs, selling, mpct };
}
function gradeColor(mpct) {
  if (mpct > 30) return { g: "A", c: "#15803D" };
  if (mpct > 20) return { g: "B+", c: "#2563EB" };
  if (mpct >= 16) return { g: "B", c: "#B45309" };
  return { g: "C", c: "#BE123C" };
}

const ROOM_CATS = ["Standard", "Deluxe", "Deluxe Family", "Premium", "Premium / Water Villa", "Luxury"];

function toRichText(text) {
  if (!text) return "";
  if (/<[^>]+>/.test(text)) return text;
  return text.replace(/\n/g, "<br>");
}

/* true if rich-text HTML has no real visible content (covers "", null, and editor
   leftovers like "<p><br></p>" / "<div><br></div>" after a user clears the field) */
function isBlankRichText(html) {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  return !text;
}

const uid = () => Math.random().toString(36).slice(2);
const DEF_ITIN = () => ({ _k: uid(), date: "", title: "", tour: "", transfer: "", pickup_time: "", itinerary: "", activities: [] });
const DEF_ACT  = () => ({ type: "transfer", text: "" });

function initItin(initialData) {
  if (!initialData?.itinerary?.length) return [DEF_ITIN()];
  return initialData.itinerary.map(d => ({
    _k:          d._k           || uid(),
    date:        d.date         || "",
    title:       d.title        || "",
    activities:  d.activities   || [],
    tour:        d.tour         || "",
    transfer:    d.transfer     || "",
    pickup_time: d.pickup_time  || "",
    itinerary:   d.itinerary    || toRichText(d.description || ""),
  }));
}

const DEF_RATE     = { occupancy: "Double", roomCat: "Deluxe", nights: "", rooms: "", price: "" };
const DEF_HOTEL    = { name: "", location: "", mealPlan: "CPAI", rates: [{ ...DEF_RATE }] };
const MEAL_PLANS   = [
  { value: "EPAI",  label: "EPAI — Room Only" },
  { value: "CPAI",  label: "CPAI — Room + Breakfast" },
  { value: "MAPAI", label: "MAPAI — Breakfast & Dinner" },
  { value: "APAI",  label: "APAI — Breakfast, Lunch & Dinner" },
];
const DEF_FLIGHT   = { from: "", to: "", date: "", pax: "", price: "", roundTrip: false, returnPrice: "",
  pnr: "", flightNo: "",
  depCity: "", depIATA: "", depDate: "", depTime: "",
  arrCity: "", arrIATA: "", arrDate: "", arrTime: "",
  // Return leg (round trip)
  retFlightNo: "", retPnr: "",
  retDepCity: "", retDepIATA: "", retDepDate: "", retDepTime: "",
  retArrCity: "", retArrIATA: "", retArrDate: "", retArrTime: "",
  // Layover after outbound (one-way: between cards; round-trip: between onward & return)
  hasLayover: false, layoverCity: "", layoverDuration: "",
  // Layover after return leg (round-trip only)
  hasReturnLayover: false, returnLayoverCity: "", returnLayoverDuration: "",
  // Connecting flight after outward layover (round-trip only — shows inline before return leg)
  hasOnwardConn: false,
  onwardConnPnr: "", onwardConnFlightNo: "",
  onwardConnDepCity: "", onwardConnDepIATA: "", onwardConnDepDate: "", onwardConnDepTime: "",
  onwardConnArrCity: "", onwardConnArrIATA: "", onwardConnArrDate: "", onwardConnArrTime: "",
  onwardConnPax: 0, onwardConnPrice: 0,
  // Connecting flight after return layover (round-trip only)
  hasReturnConn: false,
  returnConnPnr: "", returnConnFlightNo: "",
  returnConnDepCity: "", returnConnDepIATA: "", returnConnDepDate: "", returnConnDepTime: "",
  returnConnArrCity: "", returnConnArrIATA: "", returnConnArrDate: "", returnConnArrTime: "",
  returnConnPax: 0, returnConnPrice: 0 };
const DEF_TRANSFER = { cab: "", perDay: "", days: "" };
const DEF_MISC     = { name: "", amount: "" };

const TIER_LABELS = ["Economy", "Deluxe", "Premium"];
const TIER_ICONS  = { Economy: "🟢", Deluxe: "🔵", Premium: "🟣" };
const DEF_PKG = () => ({
  hotels: [{ name: "", location: "", rates: [{ ...DEF_RATE }] }],
  flights: [{ ...DEF_FLIGHT }],
  transfers: [{ ...DEF_TRANSFER }],
  miscs: [],
  margin: 0,
  cost: 0,
});

function normHotels(arr) {
  if (!arr?.length) return [{ name: "", rates: [{ ...DEF_RATE }] }];
  return arr.map(h => ({
    name: h.name || "",
    location: h.location || "",
    mealPlan: h.mealPlan || "CPAI",
    rates: h.rates?.length
      ? h.rates.map(r => ({ occupancy: r.occupancy || "Double", roomCat: r.roomCat || h.roomCat || "Deluxe", nights: r.nights ?? "", rooms: r.rooms ?? 1, price: r.price ?? "" }))
      : [{ occupancy: h.occupancy || "Double", roomCat: h.roomCat || "Deluxe", nights: h.nights || "", rooms: h.rooms || 1, price: h.price || "" }],
  }));
}

const toN = (v, d = 0) => (v === "" || v === undefined || v === null) ? d : (+v || d);

/* ── default policy content (prefilled, fully editable per-quotation) ── */
const DEFAULT_TERMS = `
<p><strong>1. Applicability</strong></p>
<ul>
<li>These terms apply to all Kashmir holiday packages booked with Tourwatchout. Package cost applies from Srinagar pickup/drop only; pickups from Jammu or Udhampur may incur extra charges.</li>
</ul>
<p><strong>2. Itinerary &amp; Changes</strong></p>
<ul>
<li>Itineraries are indicative and may change due to weather, road conditions, government orders, security restrictions, force majeure, strikes, festivals, overbooking, or operational reasons.</li>
<li>Tourwatchout may modify arrangements; additional costs arising from such events must be borne by guests. No liability for refunds/compensation beyond available remedies.</li>
</ul>
<p><strong>3. Safety &amp; Operational Limits</strong></p>
<ul>
<li>Vehicles will operate only where permitted by local/union regulations. Outside vehicles are restricted to designated parking points in many areas.</li>
<li>During heavy snowfall or road closure, vehicle movement may stop per government/admin orders; only chained vehicles or snow jeeps may operate.</li>
<li>Guests should remain in regular contact with Tourwatchout representatives and avoid unnecessary engagement with unknown locals.</li>
</ul>
<p><strong>4. Payments &amp; Direct Charges</strong></p>
<ul>
<li>Many local services and activities are payable directly by guests (union taxis, ponies, chained vehicles, ATVs, snow bikes, gondola, shikara, etc.). Tourwatchout can assist with arrangements but charges are direct unless otherwise stated.</li>
<li>If a paid activity is non-operational due to unforeseen reasons, refunds will be processed and should reach the guest within 30 days of processing. No refunds for complimentary activities not charged by Tourwatchout.</li>
</ul>
<p><strong>5. Refunds &amp; Non-Refundable Cases</strong></p>
<ul>
<li>No refunds will be provided for missed sightseeing due to natural or unavoidable circumstances (heavy snowfall, landslides, roadblocks, traffic, security restrictions).</li>
<li>Gondola and Shikara rides are weather-dependent; cancellations due to weather or maintenance do not warrant refunds.</li>
</ul>
<p><strong>6. Accommodation &amp; Houseboats</strong></p>
<ul>
<li>Standard hotel check-in: 2:00 PM; check-out: 11:00 AM. Early check-in / late check-out subject to hotel discretion and availability.</li>
<li>Hotels may require government-approved photo ID at check-in.</li>
<li>If listed hotels are unavailable, similar-standard alternatives will be provided.</li>
<li>Houseboats: basic, experiential accommodation. Expect intermittent power/hot water, limited menu, no transport between houseboat and land. Bukhari (traditional heater) and extra houseboat services charged directly.</li>
<li>Room heaters are subject to availability and may be charged directly by the property.</li>
</ul>
<p><strong>7. Destination-Specific Notes</strong></p>
<ul>
<li><strong>Gulmarg:</strong> Tangmarg–Gulmarg transfers during heavy snow may require chained vehicles, charges payable directly by guest. Gondola rides subject to availability and weather; pre-book recommended. Skiing/snow activities are optional and payable locally.</li>
<li><strong>Pahalgam:</strong> Sightseeing at Aru Valley, Chandanwari, Betaab Valley is through local union taxis, payable directly. Pony rides and adventure activities are optional and payable locally.</li>
<li><strong>Sonamarg:</strong> Thajiwas Glacier visits (summer) usually via pony ride; Zero Point via union taxi or ATV — both payable directly. In winter, vehicles may operate only up to Gagangir; transfers beyond are by local union taxi at guests' expense. Guests are taken to the taxi stand for onward sightseeing via local union cabs/ponies.</li>
</ul>
<p><strong>8. Vehicle Use Policy</strong></p>
<ul>
<li>Vehicles operate as per the itinerary and schedule and are for point-to-point transfers and listed sightseeing only.</li>
<li>AC/heating use during uphill drives or certain times may be restricted at driver discretion.</li>
</ul>
<p><strong>9. Extra Charges &amp; Peak Season</strong></p>
<ul>
<li>Package price excludes special/mandatory hotel charges during events (Christmas, New Year, festivals). Tourwatchout will attempt to inform guests but may not always have prior notice.</li>
</ul>
<p><strong>10. Liability Exclusions</strong></p>
<ul>
<li>Tourwatchout is not responsible for disruptions due to flight cancellations/delays, political disturbances, VIP movements, road closures, or natural calamities.</li>
</ul>
<p><strong>11. Indicative Supplement Rates</strong> <em>(payable directly; rates indicative and subject to change)</em></p>
<ul>
<li>Sonamarg: Pony per horse ₹2,500–3,500; Taxi to Zero Point up to ₹5,500 (return).</li>
<li>Gulmarg: Gondola Phase 1 ~₹950; Phase 2 ~₹1,250 (per person, incl. service charges). Snow-bike/ETV ~₹3,500 per round. Chained vehicle Tangmarg–Gulmarg return ~₹4,500 per vehicle (max 6–7 pax).</li>
<li>Pahalgam: Union cab sightseeing from ~₹3,000; Pony for Baisaran ~₹2,500 per pony.</li>
<li>All additional activities and equipment rentals are payable locally. Pony/horse rates are generally negotiable.</li>
</ul>
<p><strong>12. Contact &amp; Assistance</strong></p>
<ul>
<li>For revised costing, special requests, or clarifications (pickup point changes, additional services), contact your Tourwatchout travel expert before confirming the booking.</li>
</ul>
`.trim();

const DEFAULT_BOOKING_POLICY = `
<ul>
<li>For land arrangements, 50% of the total package cost is required as booking amount. Payment can be made via Bank Transfer, UPI, Net Banking, or Payment Gateway (2.5% gateway charges extra on Credit/Debit Card payments).</li>
<li>Full payment is required for flight bookings as airfares are dynamic and subject to change until ticket issuance.</li>
<li>Remaining 50% balance payment must be cleared 10 days prior to arrival/travel date via Bank Transfer, Net Banking, UPI, or Cash Deposit. Payment in instalments can also be considered.</li>
<li>For urgent bookings made within 15 days of travel, 80% advance payment of the total package cost is mandatory.</li>
<li>Payment invoices, confirmations, and travel vouchers will be shared via E-mail/WhatsApp. Vouchers are generally issued within 2 days of booking confirmation.</li>
</ul>
`.trim();

/* placeholder — standard slab-based policy, intended to be reviewed/edited per quotation */
const DEFAULT_CANCELLATION_POLICY = `
<ul>
<li>Cancellations must be communicated in writing (email/WhatsApp) to your Tourwatchout travel expert.</li>
<li>30+ days before travel: 10% of the total package cost will be deducted as cancellation charges.</li>
<li>15–29 days before travel: 25% of the total package cost will be deducted.</li>
<li>7–14 days before travel: 50% of the total package cost will be deducted.</li>
<li>Less than 7 days before travel / no-show: 100% of the total package cost is non-refundable.</li>
<li>Houseboat, hotel and flight bookings already confirmed/ticketed may carry separate, non-refundable cancellation charges levied by the respective service provider, irrespective of the slabs above.</li>
<li>Eligible refunds (if any) will be processed within 30 days to the original mode of payment.</li>
<li>Date change / postponement requests will be treated as a fresh booking and are subject to availability and price revision.</li>
</ul>
`.trim();

const HL_OPTIONS = [
  { key: "hotel",    label: "Hotel"                   },
  { key: "activity", label: "Activities"              },
  { key: "transfer", label: "Transfers"               },
  { key: "meals",    label: "Selected Meals Included" },
  { key: "flight",   label: "Flights"                 },
];
const DEF_HIGHLIGHTS = HL_OPTIONS.map(o => ({ key: o.key, label: o.label }));

/* normalise saved highlights — old format was string[], new is {key,label}[] */
function normHL(hl) {
  if (!Array.isArray(hl) || hl.length === 0) return DEF_HIGHLIGHTS;
  if (typeof hl[0] === "string") return hl.map(k => ({ key: k, label: HL_OPTIONS.find(o => o.key === k)?.label || k }));
  return hl;
}

const DEF_FORM = {
  type: "Domestic", pkgMode: "Complete Package", quoteType: "standard",
  highlights: DEF_HIGHLIGHTS,
  days: "", travelDate: "", assignedTo: "",
  inclusions: "", exclusions: "",
  notes: "This is an initial quote based on our most popular holiday package to your chosen destination.",
  termsConditions: DEFAULT_TERMS,
  bookingPolicy: DEFAULT_BOOKING_POLICY,
  cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
  canxBar: { enabled: false, slabs: [
    { days: 40, pct: 0 },
    { days: 30, pct: 25 },
    { days: 15, pct: 50 },
    { days: 7,  pct: 100 },
  ]},
  cost: "", margin: "", gstPct: 5, tcsPct: 2, tcsInPrice: true, tripExpense: 0,
  ppSubEnabled: false, ppSubTotalEnabled: false, ppSellEnabled: false,
};

/* Build initial pkgTiers from existing data or BRR */
function initArrays(initialData, lead) {
  // If pkgTiers already saved, restore all three tiers
  if (initialData?.pkgTiers && Object.keys(initialData.pkgTiers).length) {
    return {
      pkgTiers: Object.fromEntries(TIER_LABELS.map(lbl => {
        const d = initialData.pkgTiers[lbl] || {};
        // Migrate: if saved tier has no margin, seed Economy with form.margin and others with 0
        const fallbackMargin = lbl === "Economy" ? (+initialData.margin || 0) : 0;
        return [lbl, {
          hotels:    normHotels(d.hotels),
          flights:   d.flights?.length   ? [...d.flights]   : [{ ...DEF_FLIGHT }],
          transfers: d.transfers?.length ? [...d.transfers] : [{ ...DEF_TRANSFER }],
          miscs:     d.miscs?.length     ? [...d.miscs]     : [],
          margin:    d.margin !== undefined ? d.margin : fallbackMargin,
          cost:      d.cost !== undefined ? d.cost : (lbl === "Economy" ? (+initialData.cost || 0) : 0),
          ppSubEnabled:      d.ppSubEnabled      || false,
          ppSubTotalEnabled: d.ppSubTotalEnabled || false,
          ppSellEnabled:     d.ppSellEnabled     || false,
        }];
      })),
    };
  }

  // Migrate from legacy flat fields (or BRR seed) into Economy tier
  const brr = lead?.brr || {};
  let pax;
  if (brr.adults != null) {
    pax = brr.adults + (brr.children || 0);
  } else {
    const rawPax = lead?.pax || "";
    const adultM = rawPax.match(/(\d+)\s*(?:adult|adults)/i);
    const childM = rawPax.match(/(\d+)\s*(?:child|children|kid|kids)/i);
    const first  = parseInt(rawPax);
    const a = adultM ? +adultM[1] : (!isNaN(first) && first > 0 ? first : 0);
    const c = childM ? +childM[1] : 0;
    pax = a + c;
  }
  const ecoHotels    = normHotels(initialData?.hotels?.length ? initialData.hotels : [{ name: "", rates: [{ ...DEF_RATE, roomCat: brr.hotelCategory || "Deluxe" }] }]);
  const ecoFlights   = initialData?.flights?.length   ? [...initialData.flights]   : [{ ...DEF_FLIGHT, pax: pax || 0, date: brr.tripDate || lead?.travelDate || "" }];
  const ecoTransfers = initialData?.transfers?.length ? [...initialData.transfers] : [{ ...DEF_TRANSFER }];
  const ecoMiscs     = initialData?.miscs?.length     ? [...initialData.miscs]     : [];
  return {
    pkgTiers: {
      Economy: { hotels: ecoHotels, flights: ecoFlights, transfers: ecoTransfers, miscs: ecoMiscs, margin: +initialData?.margin || 0, cost: +initialData?.cost || 0 },
      Deluxe:  DEF_PKG(),
      Premium: DEF_PKG(),
    },
  };
}

export default function QuotationBuilder({
  lead, leadDisplayId, quoteDisplayId,
  initialData, isNew, salespeople = [],
  onClose, onSaved,
}) {
  const brr = lead?.brr || {};
  const leadPax = (() => {
    if (brr.adults != null) return (brr.adults || 0) + (brr.children || 0);
    const raw = lead?.pax || "";
    const a = raw.match(/(\d+)\s*(?:adult|adults)/i);
    const ch = raw.match(/(\d+)\s*(?:child|children|kid|kids)/i);
    const first = parseInt(raw);
    return (a ? +a[1] : (!isNaN(first) && first > 0 ? first : 0)) + (ch ? +ch[1] : 0);
  })();

  const baseForm = initialData
    ? {
        ...DEF_FORM, ...initialData,
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || "",
        // older/existing quotations saved before these policy fields existed have them
        // missing, "" or just leftover empty markup (e.g. "<p><br></p>" from a cleared
        // editor) — in all of those cases fall back to the standard prefilled text
        termsConditions:     isBlankRichText(initialData.termsConditions)    ? DEFAULT_TERMS             : initialData.termsConditions,
        bookingPolicy:       isBlankRichText(initialData.bookingPolicy)      ? DEFAULT_BOOKING_POLICY    : initialData.bookingPolicy,
        cancellationPolicy:  isBlankRichText(initialData.cancellationPolicy) ? DEFAULT_CANCELLATION_POLICY : initialData.cancellationPolicy,
        canxBar: (() => {
          const saved = initialData.canxBar || {};
          // migrate old format (cutoffDate/feeBefore/sliderPct) → slabs
          if (saved.slabs) return { ...DEF_FORM.canxBar, ...saved };
          return { ...DEF_FORM.canxBar, enabled: !!saved.enabled };
        })(),
      }
    : {
        ...DEF_FORM,
        travelDate: brr.tripDate || lead?.travelDate || "",
        assignedTo: lead?.assignedTo?._id || lead?.assignedTo || "",
        days: brr.duration || "",
      };

  const arrInit = initArrays(initialData, lead);

  /* ── original quote type — locked when editing an existing quotation ── */
  const origQuoteType = initialData?.quoteType || null;

  const [form,      setForm]      = useState(baseForm);
  const [activePkg, setActivePkg] = useState("Economy");
  const activePkgRef = useRef("Economy");           // always-current ref avoids stale closures
  const [pkgTiers,  setPkgTiers]  = useState(arrInit.pkgTiers);

  // Proxy access — always read/write the active tier
  const hotels    = pkgTiers[activePkg].hotels;
  const flights   = pkgTiers[activePkg].flights;
  const transfers = pkgTiers[activePkg].transfers;
  const miscs     = pkgTiers[activePkg].miscs;
  const setHotels    = fn => setPkgTiers(p => { const t = p[activePkg]; return { ...p, [activePkg]: { ...t, hotels:    typeof fn === "function" ? fn(t.hotels)    : fn } }; });
  const setFlights   = fn => setPkgTiers(p => { const t = p[activePkg]; return { ...p, [activePkg]: { ...t, flights:   typeof fn === "function" ? fn(t.flights)   : fn } }; });
  const setTransfers = fn => setPkgTiers(p => { const t = p[activePkg]; return { ...p, [activePkg]: { ...t, transfers: typeof fn === "function" ? fn(t.transfers) : fn } }; });
  const setMiscs     = fn => setPkgTiers(p => { const t = p[activePkg]; return { ...p, [activePkg]: { ...t, miscs:     typeof fn === "function" ? fn(t.miscs)     : fn } }; });
  const [itin,       setItin]       = useState(() => initItin(initialData));
  const [saving,     setSaving]     = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [extraRoomCats, setExtraRoomCats] = useState([]);
  const [preview,    setPreview]    = useState(false);

  /* ── quotation email modal ── */
  const [emailModal,    setEmailModal]   = useState(false);
  const [emailModalKey, setEmailModalKey]= useState(0);  // forces RTE remount on open
  const [emailTo,       setEmailTo]      = useState([]);   // array of email strings
  const [emailCc,       setEmailCc]      = useState(["ivan@tourwatchout.com"]);
  const [emailBcc,      setEmailBcc]     = useState([]);
  const [emailSubject,  setEmailSubject] = useState("");
  const [emailMsg,      setEmailMsg]     = useState("");   // HTML from RTE
  const [attachPdf,     setAttachPdf]    = useState(true);
  const [emailSending,  setEmailSending] = useState(false);
  const [emailSent,     setEmailSent]    = useState(false);
  const [emailError,    setEmailError]   = useState("");

  /* ── copy-from-existing (new quotation only) ── */
  const [tmplOpen,    setTmplOpen]    = useState(false);
  const [tmplSearch,  setTmplSearch]  = useState("");
  const [tmplList,    setTmplList]    = useState([]);
  const [tmplLoading, setTmplLoading] = useState(false);
  const [tmplPreview, setTmplPreview] = useState(null);
  const [tmplApplied, setTmplApplied] = useState(null); // which quotation is used as template

  /* ── snapshot of original state so "Clear template" can fully reset ── */
  const origFormSnap    = useRef(baseForm);
  const origItinSnap    = useRef(initItin(initialData));
  const origPkgSnap     = useRef(arrInit.pkgTiers);

  /* ── save tracking ── */
  const [savedId,   setSavedId]   = useState(initialData?._id || null);
  const savedIdRef    = useRef(initialData?._id || null);   // always current — avoids stale-closure duplicates

  /* ── original price fingerprint — used to detect price changes for smart save ── */
  const origPriceKey = useMemo(() => {
    if (!initialData) return null;
    const tiers = initialData.pkgTiers || {};
    const tierKey = TIER_LABELS.map(l => `${tiers[l]?.cost||0}:${tiers[l]?.margin||0}`).join("|");
    return `${initialData.cost||0}:${initialData.margin||0}:${tierKey}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── shared cab/transfer detail: Day 1 itinerary's "Transfer Type" is the source for ──
     (a) every other itinerary day (unless that day was customised), and
     (b) the Cab Details section's "Cab Type" field — both stay editable, just kept in sync. */
  const prevSharedCab = useRef(itin[0]?.transfer || arrInit.pkgTiers.Economy.transfers[0]?.cab || "");
  function setSharedCab(val) {
    const old = prevSharedCab.current;
    setItin(p => p.map((x, j) => {
      if (j === 0) return { ...x, transfer: val };
      // only auto-sync days that still match the old shared value (i.e. haven't been customised)
      if (!x.transfer || x.transfer === old) return { ...x, transfer: val };
      return x;
    }));
    setTransfers(p => p.map((t, j) => j === 0 ? { ...t, cab: val } : t));
    prevSharedCab.current = val;
  }

  /* on first mount, Day 1 itinerary's transfer value (if set) wins over a stale Cab Type */
  useEffect(() => {
    if (itin[0]?.transfer) {
      setTransfers(p => p.length ? p.map((t, j) => j === 0 ? { ...t, cab: itin[0].transfer } : t) : p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── room categories: load any custom categories saved previously so they show up in everyone's dropdown ── */
  useEffect(() => {
    fetch("/api/dashboard/room-categories")
      .then(r => r.ok ? r.json() : [])
      .then(list => Array.isArray(list) && setExtraRoomCats(list.filter(n => !ROOM_CATS.includes(n))))
      .catch(() => {});
  }, []);

  /* ── fetch existing quotations for template picker (only when creating new) ── */
  useEffect(() => {
    if (!isNew) return;
    setTmplLoading(true);
    fetch("/api/dashboard/quotations")
      .then(r => r.ok ? r.json() : [])
      .then(list => setTmplList(Array.isArray(list) ? list : []))
      .catch(() => {})
      .finally(() => setTmplLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addRoomCategory(name) {
    const clean = String(name || "").trim();
    if (!clean) return;
    setExtraRoomCats(p => p.includes(clean) ? p : [...p, clean]); // optimistic
    try {
      const res = await fetch("/api/dashboard/room-categories", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: clean }),
      });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) setExtraRoomCats(list.filter(n => !ROOM_CATS.includes(n)));
      }
    } catch {}
  }

  async function removeRoomCategory(name) {
    setExtraRoomCats(p => p.filter(n => n !== name)); // optimistic
    try {
      const res = await fetch(`/api/dashboard/room-categories?name=${encodeURIComponent(name)}`, { method: "DELETE" });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) setExtraRoomCats(list.filter(n => !ROOM_CATS.includes(n)));
      }
    } catch {}
  }

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* ── template: filter list by search / same destination ── */
  const filteredTmpls = useMemo(() => {
    const dest = (lead?.destination || "").toLowerCase().trim();
    if (tmplSearch.trim()) {
      const s = tmplSearch.toLowerCase();
      return tmplList.filter(q =>
        (q.quotationNo || "").toLowerCase().includes(s) ||
        (q.leadId?.destination || "").toLowerCase().includes(s) ||
        (q.leadId?.name || "").toLowerCase().includes(s)
      );
    }
    if (dest) {
      return [...tmplList].sort((a, b) => {
        const aM = (a.leadId?.destination || "").toLowerCase().includes(dest) ? 1 : 0;
        const bM = (b.leadId?.destination || "").toLowerCase().includes(dest) ? 1 : 0;
        return bM - aM;
      });
    }
    return tmplList;
  }, [tmplList, tmplSearch, lead?.destination]);

  /* ── template: apply selected quotation as starting point ── */
  function applyTemplate(q) {
    setForm(prev => ({
      ...prev,
      quoteType:          q.quoteType          || prev.quoteType,
      type:               q.type               || prev.type,
      pkgMode:            q.pkgMode            || prev.pkgMode,
      days:               q.days               || prev.days,
      gstPct:             q.gstPct             ?? prev.gstPct,
      tcsPct:             q.tcsPct             ?? prev.tcsPct,
      tcsInPrice:         q.tcsInPrice         ?? prev.tcsInPrice,
      highlights:         q.highlights?.length  ? q.highlights : prev.highlights,
      inclusions:         q.inclusions          || prev.inclusions,
      exclusions:         q.exclusions          || prev.exclusions,
      notes:              q.notes              || prev.notes,
      termsConditions:    !isBlankRichText(q.termsConditions)    ? q.termsConditions    : prev.termsConditions,
      bookingPolicy:      !isBlankRichText(q.bookingPolicy)      ? q.bookingPolicy      : prev.bookingPolicy,
      cancellationPolicy: !isBlankRichText(q.cancellationPolicy) ? q.cancellationPolicy : prev.cancellationPolicy,
      canxBar:            q.canxBar            || prev.canxBar,
      ppSubEnabled:       q.ppSubEnabled        || false,
      ppSubTotalEnabled:  q.ppSubTotalEnabled   || false,
      ppSellEnabled:      q.ppSellEnabled       || false,
      // Deliberately NOT copying: travelDate, assignedTo (lead-specific)
    }));

    // Apply itinerary
    if (q.itinerary?.length) {
      setItin(q.itinerary.map(day => ({
        _k:         uid(),
        date:       day.date       || "",
        title:      day.title      || "",
        transfer:   day.transfer   || "",
        tour:       day.tour       || "",
        pickup_time:day.pickup_time|| "",
        itinerary:  day.itinerary  || "",
        activities: (day.activities || []).map(a => ({ type: a.type || "transfer", text: a.text || "" })),
      })));
    }

    // Apply tier data
    const srcTiers = q.pkgTiers && Object.keys(q.pkgTiers).length ? q.pkgTiers : null;
    if (srcTiers) {
      setPkgTiers(Object.fromEntries(TIER_LABELS.map(lbl => {
        const d = srcTiers[lbl] || DEF_PKG();
        return [lbl, {
          hotels:            normHotels(d.hotels),
          flights:           d.flights?.length   ? [...d.flights]   : [{ ...DEF_FLIGHT }],
          transfers:         d.transfers?.length ? [...d.transfers] : [{ ...DEF_TRANSFER }],
          miscs:             d.miscs?.length     ? [...d.miscs]     : [],
          margin:            d.margin            ?? 0,
          cost:              d.cost              ?? 0,
          ppSubEnabled:      d.ppSubEnabled      || false,
          ppSubTotalEnabled: d.ppSubTotalEnabled || false,
          ppSellEnabled:     d.ppSellEnabled     || false,
        }];
      })));
    } else if (q.hotels?.length || q.transfers?.length) {
      // Legacy flat-field quotation — seed Economy tier
      setPkgTiers(prev => ({
        ...prev,
        Economy: {
          ...prev.Economy,
          hotels:    normHotels(q.hotels),
          flights:   q.flights?.length   ? [...q.flights]   : prev.Economy.flights,
          transfers: q.transfers?.length ? [...q.transfers] : prev.Economy.transfers,
          miscs:     q.miscs?.length     ? [...q.miscs]     : prev.Economy.miscs,
          margin:    q.margin  ?? prev.Economy.margin,
          cost:      q.cost    ?? prev.Economy.cost,
        },
      }));
    }

    setTmplApplied(q);
    setTmplOpen(false);
  }

  /* ── clear applied template — restore original blank state ── */
  function clearTemplate() {
    setForm(origFormSnap.current);
    setItin(origItinSnap.current);
    setPkgTiers(origPkgSnap.current);
    setTmplApplied(null);
    setTmplOpen(false);
  }

  // Keep ref always current so setTierMargin never captures a stale activePkg
  activePkgRef.current = activePkg;

  const isB2B     = form.quoteType === "b2b";
  const isPackage = form.quoteType === "package";

  /* ── smart save: detect if price has changed from when builder was opened ── */
  const currentPriceKey = useMemo(() => {
    const tierKey = TIER_LABELS.map(l => `${pkgTiers[l]?.cost||0}:${pkgTiers[l]?.margin||0}`).join("|");
    return `${form.cost||0}:${form.margin||0}:${tierKey}`;
  }, [form.cost, form.margin, pkgTiers]);
  const priceChanged = !initialData || origPriceKey === null || currentPriceKey !== origPriceKey;

  // Per-tier margin proxy — uses ref so it always writes to the tier the user intends
  const tierMargin    = pkgTiers[activePkg]?.margin ?? "";
  const setTierMargin = v => {
    const pkg = activePkgRef.current;
    setPkgTiers(p => ({ ...p, [pkg]: { ...p[pkg], margin: v } }));
  };

  // Per-tier cost proxy — B2B stores cost per tier; Standard uses shared form.cost
  const tierCost    = isB2B ? (pkgTiers[activePkg]?.cost ?? "") : form.cost;
  const setTierCost = v => {
    if (isB2B) {
      const pkg = activePkgRef.current;
      setPkgTiers(p => ({ ...p, [pkg]: { ...p[pkg], cost: v } }));
    } else {
      upd("cost", v);
    }
  };

  const c         = calcQ({ ...form, cost: isB2B ? (+tierCost || 0) : (+form.cost || 0), margin: tierMargin });
  const g         = gradeColor(c.mpct);
  const intl      = form.type === "International";

  // Per-tier pp* flags: Standard/B2B use tier-level (independent per tier);
  // Package mode uses form-level (single flat tier controlled from the form).
  const activeTierData = pkgTiers[activePkg] || {};
  const ppLocal        = !isPackage ? activeTierData : form;
  const ppSubLocal      = ppLocal.ppSubEnabled      || false;
  const ppSubTotalLocal = ppLocal.ppSubTotalEnabled || false;
  const ppSellLocal     = ppLocal.ppSellEnabled     || false;
  // Setter: writes to tier object (Standard/B2B) or form (Package)
  const updPP = (key, val, also = {}) => {
    if (!isPackage) {
      const pkg = activePkgRef.current;
      setPkgTiers(p => ({ ...p, [pkg]: { ...p[pkg], [key]: val, ...also } }));
    } else {
      upd(key, val);
      Object.entries(also).forEach(([k, v]) => upd(k, v));
    }
  };
  const tierSuffix = isPackage ? "" : ` — ${activePkg}`;

  /* ── array helpers ── */
  function updArr(setter, idx, field, value) {
    setter(prev => prev.map((x, i) => i === idx ? { ...x, [field]: value } : x));
  }
  function addRow(setter, def)        { setter(p => [...p, { ...def }]); }
  function insertRow(setter, idx, def){ setter(p => [...p.slice(0, idx), { ...def }, ...p.slice(idx)]); }
  function remRow(setter, idx)        { setter(p => p.filter((_, i) => i !== idx)); }

  /* ── per-tier sub-totals ── */
  function calcTierTotal(tier) {
    const h = (tier.hotels    || []).reduce((s, h) => s + (h.rates || []).reduce((rs, r) => rs + (+r.price || 0) * (+r.nights || 0) * (+r.rooms || 0), 0), 0);
    const f = (tier.flights   || []).reduce((s, f) => s + ((+f.price || 0) + (f.roundTrip ? (+f.returnPrice || 0) : 0)) * (+f.pax || 0), 0);
    const t = (tier.transfers || []).reduce((s, t) => s + (+t.perDay || 0) * (+t.days || 0), 0);
    const m = (tier.miscs     || []).reduce((s, m) => s + (+m.amount || 0), 0);
    return { h, f, t, m, total: h + f + t + m };
  }
  const tierTotals = Object.fromEntries(TIER_LABELS.map(lbl => [lbl, calcTierTotal(pkgTiers[lbl])]));
  // Active-tier aliases (used by existing form code below)
  const hotelTotal    = tierTotals[activePkg].h;
  const flightTotal   = tierTotals[activePkg].f;
  const transferTotal = tierTotals[activePkg].t;
  const miscTotal     = tierTotals[activePkg].m;
  const grandComponentTotal = tierTotals[activePkg].total;

  /* ── auto-sync Cost Price from component grand total (Standard/Package only) ── */
  useEffect(() => {
    if (form.quoteType !== "b2b" && grandComponentTotal > 0) upd("cost", grandComponentTotal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grandComponentTotal, form.quoteType]);

  /* ── in Package mode always use Economy tier ── */
  useEffect(() => {
    if (form.quoteType === "package") setActivePkg("Economy");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.quoteType]);

  /* ── shared body builder (used by manual save + auto-save) ── */
  function buildBody() {
    const normTier = tier => ({
      hotels:    tier.hotels.map(h => ({ name: h.name, location: h.location || "", mealPlan: h.mealPlan || "CPAI", rates: (h.rates || []).map(r => ({ occupancy: r.occupancy || "Double", roomCat: r.roomCat || "Deluxe", nights: toN(r.nights), rooms: toN(r.rooms, 1), price: toN(r.price) })) })),
      flights:   tier.flights.map(f => ({ from: f.from, to: f.to, date: f.date, pax: toN(f.pax), price: toN(f.price), roundTrip: !!f.roundTrip, returnPrice: toN(f.returnPrice), pnr: f.pnr||"", flightNo: f.flightNo||"", depCity: f.depCity||"", depIATA: f.depIATA||"", depDate: f.depDate||"", depTime: f.depTime||"", arrCity: f.arrCity||"", arrIATA: f.arrIATA||"", arrDate: f.arrDate||"", arrTime: f.arrTime||"", retFlightNo: f.retFlightNo||"", retPnr: f.retPnr||"", retDepCity: f.retDepCity||"", retDepIATA: f.retDepIATA||"", retDepDate: f.retDepDate||"", retDepTime: f.retDepTime||"", retArrCity: f.retArrCity||"", retArrIATA: f.retArrIATA||"", retArrDate: f.retArrDate||"", retArrTime: f.retArrTime||"", hasLayover: !!f.hasLayover, layoverCity: f.layoverCity||"", layoverDuration: f.layoverDuration||"", hasReturnLayover: !!f.hasReturnLayover, returnLayoverCity: f.returnLayoverCity||"", returnLayoverDuration: f.returnLayoverDuration||"", hasOnwardConn: !!f.hasOnwardConn, onwardConnPnr: f.onwardConnPnr||"", onwardConnFlightNo: f.onwardConnFlightNo||"", onwardConnDepCity: f.onwardConnDepCity||"", onwardConnDepIATA: f.onwardConnDepIATA||"", onwardConnDepDate: f.onwardConnDepDate||"", onwardConnDepTime: f.onwardConnDepTime||"", onwardConnArrCity: f.onwardConnArrCity||"", onwardConnArrIATA: f.onwardConnArrIATA||"", onwardConnArrDate: f.onwardConnArrDate||"", onwardConnArrTime: f.onwardConnArrTime||"", onwardConnPax: toN(f.onwardConnPax), onwardConnPrice: toN(f.onwardConnPrice), hasReturnConn: !!f.hasReturnConn, returnConnPnr: f.returnConnPnr||"", returnConnFlightNo: f.returnConnFlightNo||"", returnConnDepCity: f.returnConnDepCity||"", returnConnDepIATA: f.returnConnDepIATA||"", returnConnDepDate: f.returnConnDepDate||"", returnConnDepTime: f.returnConnDepTime||"", returnConnArrCity: f.returnConnArrCity||"", returnConnArrIATA: f.returnConnArrIATA||"", returnConnArrDate: f.returnConnArrDate||"", returnConnArrTime: f.returnConnArrTime||"", returnConnPax: toN(f.returnConnPax), returnConnPrice: toN(f.returnConnPrice) })),
      transfers: tier.transfers.map(t => ({ cab: (toN(t.perDay) > 0 || toN(t.days) > 0) ? t.cab : "", perDay: toN(t.perDay), days: toN(t.days) })),
      miscs:     tier.miscs.filter(m => m.name || m.amount).map(m => ({ name: m.name, amount: toN(m.amount) })),
      margin:    toN(tier.margin),
      cost:      toN(tier.cost),
      ppSubEnabled:      tier.ppSubEnabled      || false,
      ppSubTotalEnabled: tier.ppSubTotalEnabled || false,
      ppSellEnabled:     tier.ppSellEnabled     || false,
    });
    const ecoNorm = normTier(pkgTiers.Economy);
    // For B2B: derive top-level cost/margin from the first non-zero tier
    // so the quotations table (which reads q.cost via calcQ) shows a real price instead of ₹0.
    const b2bRepTier = isB2B
      ? (TIER_LABELS.map(l => pkgTiers[l]).find(t => +t?.cost > 0) || pkgTiers.Economy)
      : null;
    const topLevelCost   = isB2B ? toN(b2bRepTier?.cost)   : toN(form.cost);
    const topLevelMargin = isB2B ? toN(b2bRepTier?.margin) : toN(pkgTiers.Economy.margin);
    return {
      ...form,
      assignedTo: form.assignedTo || null,
      cost: topLevelCost, margin: topLevelMargin, gstPct: toN(form.gstPct, 5), tcsPct: toN(form.tcsPct),
      pkgTiers: Object.fromEntries(TIER_LABELS.map(lbl => [lbl, normTier(pkgTiers[lbl])])),
      // backward-compat flat fields = Economy tier (used by PDF preview)
      hotels: ecoNorm.hotels, flights: ecoNorm.flights, transfers: ecoNorm.transfers, miscs: ecoNorm.miscs,
      itinerary: itin.map(({ _k, ...rest }) => rest),
    };
  }

  /* ── save (explicit, creates a new version) ── */
  async function save() {
    setSaving(true);
    try {
      // For B2B: version cost/margin should reflect the first non-zero tier (same logic as buildBody)
      const _verRepTier = isB2B
        ? (TIER_LABELS.map(l => pkgTiers[l]).find(t => +t?.cost > 0) || pkgTiers.Economy)
        : null;
      const newVer = { v: (initialData?.versions?.length || 0) + 1, date: todayISO(), cost: isB2B ? toN(_verRepTier?.cost) : toN(form.cost), margin: isB2B ? toN(_verRepTier?.margin) : toN(pkgTiers.Economy.margin), note: (initialData?.versions?.length || 0) === 0 ? "First quote created" : "Quote revised" };
      const body = { ...buildBody(), versions: [...(initialData?.versions || []), newVer] };
      let res;
      const currentId = savedIdRef.current;
      if (!currentId) {
        body.leadId = lead._id;
        res = await fetch("/api/dashboard/quotations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        res = await fetch(`/api/dashboard/quotations/${currentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      if (res.ok) {
        const data = await res.json();
        savedIdRef.current = data._id;
        setSavedId(data._id);
        onSaved?.(data); onClose();
      }
    } finally { setSaving(false); }
  }

  /* ── save current version (no new version — for non-price changes) ── */
  async function saveCurrentVersion() {
    setSaving(true);
    try {
      const body = { ...buildBody(), versions: initialData?.versions || [] };
      const currentId = savedIdRef.current;
      let res;
      if (!currentId) {
        body.leadId = lead._id;
        res = await fetch("/api/dashboard/quotations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        res = await fetch(`/api/dashboard/quotations/${currentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      if (res.ok) {
        const data = await res.json();
        savedIdRef.current = data._id;
        setSavedId(data._id);
        onSaved?.(data); onClose();
      }
    } finally { setSaving(false); }
  }

  /* ── open email modal with pre-filled fields ── */
  function openEmailModal() {
    setEmailTo(lead?.email ? [lead.email] : []);
    setEmailCc(["ivan@tourwatchout.com"]);
    setEmailBcc([]);
    setEmailSubject(`Your ${lead?.destination || "Holiday"} Package Quotation · ${quoteDisplayId}`);
    setEmailMsg(
      `<p>Dear <strong>${lead?.name || ""}</strong>,</p>` +
      `<p>Thank you for considering <strong>Tourwatchout</strong> for your ${lead?.destination || "holiday"} trip.</p>` +
      `<p>We are pleased to share your personalized package quotation. Please find the detailed PDF attached to this email.</p>` +
      `<p>Our travel expert is available to assist you with any queries, changes, or customizations.</p>` +
      `<p>Warm regards,<br><strong>Tourwatchout Team</strong></p>`
    );
    setAttachPdf(true);
    setEmailSent(false);
    setEmailError("");
    setEmailModalKey(k => k + 1);  // forces RTE to re-initialize with fresh content
    setEmailModal(true);
  }

  /* ── generate PDF → base64 → POST to mailer API ── */
  async function handleSendEmail() {
    if (!emailTo.length) return;
    setEmailError("");

    /* Snapshot all values now — state will be gone after modal closes */
    const snap = {
      to:      emailTo.join(", "),
      cc:      emailCc.length  ? emailCc.join(", ")  : undefined,
      bcc:     emailBcc.length ? emailBcc.join(", ") : undefined,
      subject: emailSubject,
      message: emailMsg,
      doAttach: attachPdf,
      quotationData: {
        name:        lead?.name        || "",
        destination: lead?.destination || "",
        days:        form.days         || "",
        travelDate:  form.travelDate   || "",
        selling:     c.selling,
        quoteId:     quoteDisplayId    || "",
        phone:       lead?.phone       || "",
        email:       emailTo[0]        || "",
      },
      pdfName: `quotation-${quoteDisplayId || "tw"}.pdf`,
    };

    /* ── Optimistic UI: show success & close immediately ── */
    setEmailSent(true);
    setTimeout(() => setEmailModal(false), 1500);

    /* ── Background: generate PDF then send ── */
    (async () => {
      try {
        const fd = new FormData();
        fd.append("to",      snap.to);
        fd.append("cc",      snap.cc  || "");
        fd.append("bcc",     snap.bcc || "");
        fd.append("subject", snap.subject);
        fd.append("message", snap.message);
        fd.append("quotationData", JSON.stringify(snap.quotationData));

        if (snap.doAttach) {
          const pdf = await generatePDF();
          if (pdf) {
            /* output as blob — no base64 overhead, no JSON size limit */
            const blob = pdf.output("blob");
            fd.append("pdf", blob, snap.pdfName);
          }
        }

        await fetch("/api/dashboard/send-quotation-email", {
          method: "POST",
          body:   fd,   /* browser sets correct multipart Content-Type + boundary */
        });
      } catch (e) {
        console.error("Background email send failed:", e);
      }
    })();
  }

  const waHref = () => {
    const n   = String(lead?.phone || "").replace(/\D/g, "");
    const msg = `Hi ${lead?.name || ""}, greetings from Tourwatchout! Your ${lead?.destination || ""} quotation ${quoteDisplayId} is ready. ${form.days}${form.travelDate ? ` starting ${fmtDate(form.travelDate)}` : ""}. Please find the detailed PDF in your email. Your travel expert is a call away.`;
    return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
  };
  const emailHref = () => {
    const s = encodeURIComponent(`Your Tourwatchout quotation ${quoteDisplayId} for ${lead?.destination || ""}`);
    const b = encodeURIComponent(`Dear ${lead?.name || ""},\n\nPlease find your personalised ${lead?.destination || ""} package (${form.days}) at ${inr(c.selling)}.\n\nWarm regards,\nTourwatchout`);
    return `mailto:${lead?.email || ""}?subject=${s}&body=${b}`;
  };

  async function generatePDF() {
    setPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const el = document.getElementById("qb-pdf-target");
      if (!el) return null;

      const scale = 2;

      /* pdfLinks collected INSIDE onclone (offsetTop traversal, scroll-safe). */
      let pdfLinks = [];

      /* Section/break positions are measured INSIDE onclone (from the cloned
         document, after icon patches) so they match the actual canvas layout. */
      let headerSectionTops = [];
      let fullpageSectionTops = [];
      let sectionTops = [];
      let softBreakTops = [];
      let coverEnd = Infinity;
      let MINI_H_CSS = 70;

      /* Preload all SVG icons so they are in the browser cache when html2canvas captures */
      const iconSrcs = [
        "/assets/icons/quotation/hotel.svg",
        "/assets/icons/quotation/activity.svg",
        "/assets/icons/quotation/transfer.svg",
        "/assets/icons/quotation/meals.svg",
        "/assets/icons/quotation/call.svg",
        "/assets/icons/quotation/whatsapp.svg",
      ];
      await Promise.all(iconSrcs.map(src => new Promise(res => {
        const img = new window.Image();
        img.onload = res;
        img.onerror = res;
        img.crossOrigin = "anonymous";
        img.src = src;
      })));

      /* Pre-render card/section SVG icons → PNG to prevent html2canvas stretching */
      const CARD_ICON_SRCS = [
        "/assets/icons/quotation/hotel-details.svg",
        "/assets/icons/quotation/cab-details.svg",
        "/assets/icons/quotation/miscellaneous-details.svg",
        "/assets/icons/quotation/location.svg",
        "/assets/icons/quotation/hotel.svg",
        "/assets/icons/quotation/activity.svg",
        "/assets/icons/quotation/transfer.svg",
        "/assets/icons/quotation/meals.svg",
      ];
      const CARD_ICON_PNG = {};
      const CARD_ICON_RENDER = 88; /* render at 4× display size (22px) → crisp at any html2canvas scale */
      await Promise.all(CARD_ICON_SRCS.map(src =>
        new Promise(resolve => {
          const img = new window.Image();
          img.onload = () => {
            const offscreen = document.createElement("canvas");
            offscreen.width  = CARD_ICON_RENDER;
            offscreen.height = CARD_ICON_RENDER;
            try { offscreen.getContext("2d").drawImage(img, 0, 0, CARD_ICON_RENDER, CARD_ICON_RENDER); } catch (e) {}
            CARD_ICON_PNG[src] = offscreen.toDataURL("image/png");
            resolve();
          };
          img.onerror = resolve;
          img.crossOrigin = "anonymous";
          img.src = src;
        })
      ));

      /* Pre-decode every PNG data URI in the MAIN document so the browser's global
         image-decode cache is warm before html2canvas runs. Without this, setting
         imgEl.src = pngUrl inside the synchronous onclone callback triggers an async
         decode; html2canvas renders before complete=true, producing a blank image.
         On a second PDF click the cache is already warm, which is why it worked then. */
      await Promise.all(Object.values(CARD_ICON_PNG).map(pngUrl =>
        new Promise(resolve => {
          const img = new window.Image();
          img.onload  = resolve;
          img.onerror = resolve;
          img.src = pngUrl;
        })
      ));

      /* Pre-load Inter in the main document so the html2canvas clone inherits it.
         document.fonts.ready waits until all declared fonts are fully available. */
      if (!document.querySelector('link[data-inter-font]')) {
        await new Promise(resolve => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.setAttribute('data-inter-font', 'true');
          link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
          link.onload = resolve;
          link.onerror = resolve;
          document.head.appendChild(link);
        });
      }
      await document.fonts.ready;

      const patch = doc => {
        const st = doc.createElement("style");
        st.textContent = "* { font-family: 'Inter', sans-serif !important; word-spacing: 0.1px !important; letter-spacing: 0.01px !important; }";
        doc.head.appendChild(st);
        doc.querySelectorAll("[data-card-icon]").forEach(imgEl => {
          const src = imgEl.getAttribute("data-card-icon");
          const pngUrl = CARD_ICON_PNG[src];
          if (!pngUrl) return;
          imgEl.src = pngUrl;
          imgEl.style.width = "22px";
          imgEl.style.height = "auto";
          imgEl.style.maxHeight = "22px";
          imgEl.style.objectFit = "contain";
          imgEl.style.flexShrink = "0";
          imgEl.style.display = "block";
        });

        const cloneEl = doc.getElementById("qb-pdf-target");
        if (!cloneEl) return;

        /* ROOT-CAUSE FIX: cloneEl is position:static by default, so it is NOT
           an offsetParent.  The relTop traversal would overshoot past cloneEl
           to <body>, returning absolute page-coordinates instead of coordinates
           relative to cloneEl (= canvas coordinates).  Setting position:relative
           makes cloneEl an offsetParent, so the traversal stops here correctly. */
        cloneEl.style.position = "relative";

        /* relTop/relLeft: offset relative to cloneEl, in CSS px (= canvas px / scale).
           offsetTop/offsetLeft are scroll-independent — getBoundingClientRect() is not. */
        const relTop = el2 => {
          let top = 0, cur = el2;
          while (cur && cur !== cloneEl) { top += cur.offsetTop; cur = cur.offsetParent; }
          return top;
        };
        const relLeft = el2 => {
          let left = 0, cur = el2;
          while (cur && cur !== cloneEl) { left += cur.offsetLeft; cur = cur.offsetParent; }
          return left;
        };

        /* Collect link hotspots here — inside onclone — so positions match the
           canvas layout regardless of how far the preview panel is scrolled. */
        pdfLinks = Array.from(cloneEl.querySelectorAll("[data-pdf-link]")).map(linkEl => {
          const url  = linkEl.getAttribute("data-pdf-link");
          /* Inline <a> tags inside flex containers get block-ified, but force
             inline-block in the clone so offsetWidth/Height are always non-zero. */
          if (getComputedStyle(linkEl).display === "inline")
            linkEl.style.display = "inline-block";
          return {
            url,
            top:  relTop(linkEl),
            left: relLeft(linkEl),
            w:    linkEl.offsetWidth  || 40,
            h:    linkEl.offsetHeight || 40,
          };
        });

        const miniSecEl = cloneEl.querySelector("[data-pdf-section]:not([data-pdf-fullpage])");
        MINI_H_CSS = miniSecEl?.firstElementChild?.offsetHeight || 70;

        headerSectionTops = Array.from(cloneEl.querySelectorAll("[data-pdf-section]:not([data-pdf-fullpage])"))
          .map(s => Math.round(relTop(s) * scale)).filter(t => t >= 0).sort((a, b) => a - b);
        fullpageSectionTops = Array.from(cloneEl.querySelectorAll("[data-pdf-fullpage]"))
          .map(s => Math.round(relTop(s) * scale)).filter(t => t >= 0).sort((a, b) => a - b);
        softBreakTops = Array.from(cloneEl.querySelectorAll("[data-pdf-break]"))
          .map(b => Math.round(relTop(b) * scale)).filter(t => t > 0).sort((a, b) => a - b);

      };
      const canvas  = await html2canvas(el, { scale, useCORS: true, allowTaint: false, backgroundColor: "#fff", logging: false, height: el.scrollHeight, windowHeight: el.scrollHeight, onclone: patch });

      sectionTops = [...headerSectionTops, ...fullpageSectionTops].sort((a, b) => a - b);
      coverEnd    = sectionTops.length > 0 ? sectionTops[0] : Infinity;

      const pdf     = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });
      const pageW   = pdf.internal.pageSize.getWidth();
      const pageH   = pdf.internal.pageSize.getHeight();
      const pxPerMm = canvas.width / pageW;
      const pagePx  = Math.round(pageH * pxPerMm);

      /* Layout constants for content pages:
           [MINI_H_PX]   ← composited MiniHeader (real header from canvas)
           [PAD_PX 60px] ← blank breathing room below header
           [content]     ← actual page content
           [PAD_PX 60px] ← blank breathing room at page bottom             */
      const MINI_H_PX  = Math.round(MINI_H_CSS * scale);
      const PAD_PX     = Math.round(60 * scale);
      const CONTENT_Y  = MINI_H_PX + PAD_PX;
      const effectiveH = pagePx - CONTENT_Y - PAD_PX;

      /* Extract the MiniHeader strip once from the first detected section.
         All MiniHeaders are visually identical so one strip serves every page. */
      let miniStripCanvas = null;
      if (headerSectionTops.length > 0 && MINI_H_PX > 0) {
        miniStripCanvas = document.createElement("canvas");
        miniStripCanvas.width  = canvas.width;
        miniStripCanvas.height = MINI_H_PX;
        miniStripCanvas.getContext("2d").drawImage(
          canvas, 0, headerSectionTops[0], canvas.width, MINI_H_PX,
                  0, 0,                    canvas.width, MINI_H_PX,
        );
      }

      /* Direct slice helper — used for cover and fullpage sections which have
         their own design and don't need a composited header. */
      const addDirectSlice = (fromY, sliceH) => {
        const h = Math.max(1, Math.min(sliceH, canvas.height - fromY));
        const pg = document.createElement("canvas");
        pg.width = canvas.width; pg.height = pagePx;
        const ctx = pg.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pg.width, pg.height);
        ctx.drawImage(canvas, 0, fromY, canvas.width, h, 0, 0, canvas.width, h);
        pdf.addImage(pg.toDataURL("image/png"), "PNG", 0, 0, pageW, pageH);
        pdfLinks.forEach(({ url, top, left, w: lw, h: lh }) => {
          const cy = top * scale, cb = cy + lh * scale;
          if (cb > fromY && cy < fromY + h)
            pdf.link((left * scale) / pxPerMm, Math.max(0, (cy - fromY) / pxPerMm),
                     (lw * scale) / pxPerMm,   (lh * scale) / pxPerMm, { url });
        });
      };

      /* Content page helper — composites the MiniHeader at the top (exactly once),
         then draws source content in the space below it, skipping any canvas
         MiniHeaders that land in the middle of this page so they never appear
         twice on the same page. */
      const addContentPage = (contentStart, cutSrc) => {
        const pg = document.createElement("canvas");
        pg.width = canvas.width; pg.height = pagePx;
        const ctx = pg.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pg.width, pg.height);

        if (miniStripCanvas) ctx.drawImage(miniStripCanvas, 0, 0);

        /* Draw source content in segments, skipping canvas section headers. */
        let srcY = contentStart, dstY = CONTENT_Y;
        for (const secTop of headerSectionTops) {
          if (secTop > srcY && secTop < cutSrc) {
            const segH = secTop - srcY;
            if (segH > 0) {
              ctx.drawImage(canvas, 0, srcY, canvas.width, segH, 0, dstY, canvas.width, segH);
              dstY += segH;
            }
            srcY = secTop + MINI_H_PX;
          }
        }
        const remH = Math.min(Math.max(0, cutSrc - srcY), canvas.height - srcY);
        if (remH > 0) ctx.drawImage(canvas, 0, srcY, canvas.width, remH, 0, dstY, canvas.width, remH);

        pdf.addImage(pg.toDataURL("image/png"), "PNG", 0, 0, pageW, pageH);

        pdfLinks.forEach(({ url, top, left, w: lw, h: lh }) => {
          const cy = top * scale, cb = cy + lh * scale;
          if (cb > contentStart && cy < cutSrc) {
            let skipped = 0;
            for (const t of headerSectionTops)
              if (t >= contentStart && t < cy) skipped += MINI_H_PX;
            pdf.link(
              (left * scale) / pxPerMm,
              Math.max(0, (cy - contentStart + CONTENT_Y - skipped) / pxPerMm),
              (lw * scale) / pxPerMm,
              (lh * scale) / pxPerMm,
              { url },
            );
          }
        });
      };

      /* ── Page slicer ──────────────────────────────────────────────────────
         yCanvas: current position in the source canvas.

         Cover  — direct slice (has its own full-page design, no composited header).
         Fullpage sections (thank-you image) — direct slice.
         Content pages — composited MiniHeader + 60px gap + content + 60px bottom.

         Cut strategy for content pages:
           Prefer a section boundary in the latter 45–100% of effectiveH so
           the next page naturally starts with a fresh header.
           Fall back to a soft break (day-card / table row), then hard cut.   */
      let yCanvas = 0, first = true;

      while (yCanvas < canvas.height) {
        if (!first) pdf.addPage();
        first = false;

        /* ── Cover ── */
        if (yCanvas < coverEnd) {
          const cutAt = Math.min(yCanvas + pagePx, coverEnd);
          addDirectSlice(yCanvas, cutAt - yCanvas);
          yCanvas = cutAt;
          continue;
        }

        /* ── Fullpage ── */
        if (fullpageSectionTops.some(t => Math.abs(t - yCanvas) < 20)) {
          const nextBoundary = sectionTops.find(t => t > yCanvas) ?? canvas.height;
          const sliceH = Math.max(1, nextBoundary - yCanvas);
          /* Scale to fit: if the image is taller than one page, compress it to fill
             the page exactly.  This keeps the page count at exactly one. */
          const pg = document.createElement("canvas");
          pg.width = canvas.width; pg.height = pagePx;
          const ctx = pg.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, pg.width, pg.height);
          const srcH = Math.min(sliceH, canvas.height - yCanvas);
          const dstH = Math.min(srcH, pagePx);   // scale down if taller than page
          ctx.drawImage(canvas, 0, yCanvas, canvas.width, srcH, 0, 0, canvas.width, dstH);
          pdf.addImage(pg.toDataURL("image/png"), "PNG", 0, 0, pageW, pageH);
          yCanvas = nextBoundary;
          continue;
        }

        /* ── Content page ── */
        const atSection   = headerSectionTops.some(t => Math.abs(t - yCanvas) < 20);
        const contentFrom = atSection ? yCanvas + MINI_H_PX : yCanvas;

        const remaining = canvas.height - contentFrom;
        if (remaining <= effectiveH) {
          addContentPage(contentFrom, canvas.height);
          break;
        }

        const minCut      = contentFrom + Math.round(effectiveH * 0.45);
        const maxCut      = contentFrom + effectiveH;

        /* If a fullpage section starts anywhere in this page's range (even before
           minCut), cut exactly at that boundary so we never slice into it.       */
        const earlyFullpage = fullpageSectionTops.filter(t => t > contentFrom && t < maxCut);

        let cutSrc;
        if (earlyFullpage.length) {
          cutSrc = earlyFullpage[0];
        } else {
          const sectionCuts = headerSectionTops.filter(t => t >= minCut && t < maxCut);
          const softCuts    = softBreakTops.filter(t => t >= minCut && t < maxCut);
          cutSrc = sectionCuts.length ? sectionCuts[sectionCuts.length - 1]
                 : softCuts.length    ? softCuts[softCuts.length - 1]
                 : maxCut;
        }

        addContentPage(contentFrom, cutSrc);
        yCanvas = cutSrc;
      }

      return pdf;
    } finally { setPdfLoading(false); }
  }
  async function handleDownload() {
    const pdf = await generatePDF();
    if (pdf) pdf.save(`quote-${quoteDisplayId || "tw"}.pdf`);
  }
  async function handlePrint() {
    const pdf = await generatePDF();
    if (!pdf) return;
    const url = URL.createObjectURL(pdf.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  }

  return (
    <>
      {/* ── Hidden off-screen PDF target — always in DOM so generatePDF() works
           even when the preview panel is closed (e.g. while email modal is open) ── */}
      <div style={{ position: "fixed", left: -9999, top: 0, width: 794, zIndex: -1, pointerEvents: "none", opacity: 0 }}>
        <QuotationPreview
          id="qb-pdf-target"
          data={{ quoteId: quoteDisplayId, lead, form, pkgTiers, hotels, flights, transfers, miscs, itin, selling: c.selling }}
        />
      </div>

      <Ov>
        <div style={{ ...QS.modal, maxWidth: 960 }}>
          {/* Header */}
          <div style={QS.head}>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
                Quotation {quoteDisplayId} · {form.type} · {form.pkgMode}
              </div>
              <div style={{ fontSize: 12, color: "#BFD3FE", marginTop: 3, fontWeight: 600 }}>
                Linked to Lead {leadDisplayId} · {lead?.name} · {lead?.phone} · {lead?.destination}
              </div>
            </div>
            <button style={{ ...QS.x, marginLeft: "auto" }} onClick={onClose}>✕</button>
          </div>

          {/* Body — two columns: sticky price panel left + scrollable form right */}
          <div style={{ display: "flex", maxHeight: "70vh", overflow: "hidden" }}>

          {/* ── LEFT: live price preview ── */}
          <div style={{ width: 215, flexShrink: 0, overflowY: "auto", background: "#fff", borderRight: "1px solid #E4E9F2", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", marginBottom: 2 }}>💰 Package Preview</div>

            {/* Package: single tier preview */}
            {isPackage && (() => {
              const tt = tierTotals["Economy"];
              const tMgn = +pkgTiers["Economy"].margin || 0;
              const tBase = tt.total + tMgn;
              const tGst  = tBase * (+form.gstPct || 0) / 100;
              const tTcs  = intl ? (tBase + tGst) * (+form.tcsPct || 0) / 100 : 0;
              const tSell = Math.round(tBase + tGst + tTcs);
              return (
                <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 10, padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: tt.total > 0 ? 5 : 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#15803D", textTransform: "uppercase", letterSpacing: ".05em" }}>📦 Package</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: "#15803D" }}>{tt.total > 0 ? inr(tt.total) : <span style={{ fontSize: 10, color: "#9CA3AF" }}>empty</span>}</span>
                  </div>
                  {tt.h > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>🏨 Hotels</span><span style={{ fontWeight: 700 }}>{inr(tt.h)}</span></div>}
                  {tt.f > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>✈️ Flights</span><span style={{ fontWeight: 700 }}>{inr(tt.f)}</span></div>}
                  {tt.t > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>🚐 Transfer</span><span style={{ fontWeight: 700 }}>{inr(tt.t)}</span></div>}
                  {tt.m > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>➕ Misc</span><span style={{ fontWeight: 700 }}>{inr(tt.m)}</span></div>}
                  {tt.total > 0 && tMgn > 0 && (
                    <div style={{ borderTop: "1px dashed #86EFAC", marginTop: 5, paddingTop: 5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>💰 Margin</span><span style={{ fontWeight: 700 }}>{inr(tMgn)}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "#15803D" }}><span>Selling (incl. GST)</span><span>{inr(tSell)}</span></div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Package Category / Package: 3-tier pricing cards */}
            {!isPackage && !isB2B && TIER_LABELS.map(lbl => {
              const tt = tierTotals[lbl];
              const isActive = lbl === activePkg;
              const tierColor = lbl === "Economy" ? "#15803D" : lbl === "Deluxe" ? "#2563EB" : "#7C3AED";
              const tierBg    = lbl === "Economy" ? "#F0FDF4" : lbl === "Deluxe" ? "#EFF4FF" : "#FAF5FF";
              const tierBorder= lbl === "Economy" ? "#86EFAC" : lbl === "Deluxe" ? "#93C5FD" : "#D8B4FE";
              const tMgn  = +pkgTiers[lbl].margin || 0;
              const tBase = tt.total + tMgn;
              const tGst  = tBase * (+form.gstPct || 0) / 100;
              const tTcs  = intl ? (tBase + tGst) * (+form.tcsPct || 0) / 100 : 0;
              const tSell = Math.round(tBase + tGst + tTcs);
              const hasData = tt.total > 0;
              return (
                <div
                  key={lbl}
                  onClick={() => { activePkgRef.current = lbl; setActivePkg(lbl); }}
                  style={{ background: tierBg, border: `2px solid ${isActive ? tierColor : tierBorder}`, borderRadius: 10, padding: "8px 10px", cursor: "pointer", opacity: hasData ? 1 : 0.55, transition: "border .15s" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: hasData ? 5 : 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: tierColor, textTransform: "uppercase", letterSpacing: ".05em" }}>{TIER_ICONS[lbl]} {lbl}</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: tierColor }}>
                      {hasData ? inr(tt.total) : <span style={{ fontSize: 10, color: "#9CA3AF" }}>empty</span>}
                    </span>
                  </div>
                  {tt.h > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>🏨 Hotels</span><span style={{ fontWeight: 700 }}>{inr(tt.h)}</span></div>}
                  {tt.f > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>✈️ Flights</span><span style={{ fontWeight: 700 }}>{inr(tt.f)}</span></div>}
                  {tt.t > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>🚐 Transfer</span><span style={{ fontWeight: 700 }}>{inr(tt.t)}</span></div>}
                  {tt.m > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>➕ Misc</span><span style={{ fontWeight: 700 }}>{inr(tt.m)}</span></div>}
                  {hasData && tMgn > 0 && (
                    <div style={{ borderTop: `1px dashed ${tierBorder}`, marginTop: 5, paddingTop: 5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7A99", marginBottom: 2 }}><span>💰 Margin</span><span style={{ fontWeight: 700 }}>{inr(tMgn)}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: tierColor }}><span>Selling (incl. GST)</span><span>{inr(tSell)}</span></div>
                    </div>
                  )}
                  {isActive && <div style={{ fontSize: 9.5, color: tierColor, fontWeight: 700, marginTop: 4, textAlign: "right" }}>● Editing now</div>}
                </div>
              );
            })}

            {/* B2B: single pricing summary (no tier switching) */}
            {isB2B && (() => {
              const b2bCost = +pkgTiers.Economy?.cost || 0;
              const b2bMgn  = +pkgTiers.Economy?.margin || 0;
              const b2bBase = b2bCost + b2bMgn;
              const b2bGst  = b2bBase * (+form.gstPct || 0) / 100;
              const b2bTcs  = intl ? (b2bBase + b2bGst) * (+form.tcsPct || 0) / 100 : 0;
              const b2bSell = Math.round(b2bBase + b2bGst + b2bTcs);
              const hasData = b2bCost > 0 || b2bMgn > 0;
              return (
                <div style={{ background: "#EFF4FF", border: "2px solid #2563EB", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>🤝 B2B Quotation</div>
                  {hasData ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 4 }}><span>Cost Price</span><span style={{ fontWeight: 700 }}>{inr(b2bCost)}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 4 }}><span>Margin</span><span style={{ fontWeight: 700 }}>{inr(b2bMgn)}</span></div>
                      {b2bSell > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, color: "#2563EB", borderTop: "1px dashed #93C5FD", paddingTop: 5, marginTop: 3 }}><span>Selling (incl. GST)</span><span>{inr(b2bSell)}</span></div>}
                    </>
                  ) : (
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>Set Cost Price & Margin in Company Side →</div>
                  )}
                </div>
              );
            })()}

            {!isPackage && !isB2B && TIER_LABELS.every(lbl => tierTotals[lbl].total === 0) && (
              <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
                Enter prices in Hotels, Flights or Transfers to see a live preview here.
              </div>
            )}
          </div>

          {/* ── RIGHT: scrollable form ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

            {/* ── Copy from existing quotation (new only) ── */}
            {isNew && (
              <div style={{ marginBottom: 16, border: `1.5px solid ${tmplApplied ? "#86EFAC" : "#BFDBFE"}`, borderRadius: 12, overflow: "hidden" }}>
                {/* ── Banner: shows applied state or browse prompt ── */}
                <div
                  style={{ background: tmplApplied ? "#F0FDF4" : (tmplOpen ? "#EFF4FF" : "#F0F6FF"), padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between", userSelect: "none" }}
                >
                  {tmplApplied ? (
                    <>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#15803D" }}>
                        ✓ Template applied:&nbsp;
                        <span style={{ color: "#2563EB" }}>{tmplApplied.quotationNo}</span>
                        <span style={{ fontWeight: 500, color: "#64748B", marginLeft: 6 }}>
                          {tmplApplied.leadId?.destination || "—"} · {tmplApplied.days || "??"}
                        </span>
                      </span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button
                          onClick={() => setTmplOpen(p => !p)}
                          style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", border: "1px solid #BFDBFE", borderRadius: 5, background: "#EFF4FF", color: "#2563EB", cursor: "pointer" }}
                        >{tmplOpen ? "▲ Close" : "Browse another"}</button>
                        <button
                          onClick={clearTemplate}
                          style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", border: "1px solid #FCA5A5", borderRadius: 5, background: "#FFF5F5", color: "#DC2626", cursor: "pointer" }}
                        >✕ Clear</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#2563EB" }}>
                        📋 Copy from existing quotation
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#64748B", marginLeft: 8 }}>optional — fills itinerary, hotels, highlights, terms…</span>
                      </span>
                      <span
                        onClick={() => setTmplOpen(p => !p)}
                        style={{ fontSize: 11, color: "#2563EB", fontWeight: 700, cursor: "pointer" }}
                      >{tmplOpen ? "▲ Close" : "▼ Browse"}</span>
                    </>
                  )}
                </div>

                {tmplOpen && (
                  <div style={{ background: "#fff", padding: 12 }}>
                    {tmplApplied && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", background: "#FFF5F5", border: "1px solid #FCA5A5", borderRadius: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: "#7F1D1D", fontWeight: 600 }}>
                          Currently using <b>{tmplApplied.quotationNo}</b> as template
                        </span>
                        <button
                          onClick={clearTemplate}
                          style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", border: "1px solid #FCA5A5", borderRadius: 5, background: "#fff", color: "#DC2626", cursor: "pointer" }}
                        >✕ Clear template</button>
                      </div>
                    )}
                    <input
                      placeholder="Search by destination, quote ID, or guest name…"
                      value={tmplSearch}
                      onChange={e => setTmplSearch(e.target.value)}
                      style={{ width: "100%", border: "1px solid #E4E9F2", borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 10, outline: "none", boxSizing: "border-box" }}
                    />

                    {tmplLoading && (
                      <div style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", padding: "14px 0" }}>Loading quotations…</div>
                    )}

                    {!tmplLoading && filteredTmpls.length === 0 && (
                      <div style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", padding: "14px 0" }}>No quotations found</div>
                    )}

                    {!tmplLoading && filteredTmpls.slice(0, 12).map(q => {
                      const dest = q.leadId?.destination || "—";
                      const guestName = q.leadId?.name || "—";
                      const sameDestMatch = lead?.destination &&
                        (q.leadId?.destination || "").toLowerCase().includes((lead.destination || "").toLowerCase());
                      return (
                        <div
                          key={q._id}
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: `1px solid ${sameDestMatch ? "#BFDBFE" : "#E4E9F2"}`, borderRadius: 8, marginBottom: 6, background: sameDestMatch ? "#F5F8FF" : "#FAFBFF" }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{q.quotationNo}</span>
                              {sameDestMatch && (
                                <span style={{ fontSize: 9, fontWeight: 700, background: "#BFDBFE", color: "#1D4ED8", borderRadius: 4, padding: "1px 5px", letterSpacing: ".03em" }}>SAME DEST</span>
                              )}
                              <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>{q.quoteType || "standard"}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#6B7A99", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 }}>
                              {dest} · {guestName} · {q.days || "??"} · v{q.versions?.length || 1}
                            </div>
                          </div>
                          <button
                            onClick={() => setTmplPreview(q)}
                            style={{ fontSize: 11, fontWeight: 700, padding: "4px 9px", border: "1px solid #BFDBFE", borderRadius: 6, background: "#F0F6FF", color: "#2563EB", cursor: "pointer", flexShrink: 0 }}
                          >👁 Preview</button>
                          <button
                            onClick={() => applyTemplate(q)}
                            style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", border: "none", borderRadius: 6, background: "#2563EB", color: "#fff", cursor: "pointer", flexShrink: 0 }}
                          >Use ✓</button>
                        </div>
                      );
                    })}

                    {!tmplLoading && filteredTmpls.length > 12 && (
                      <div style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", paddingTop: 4 }}>
                        Showing 12 of {filteredTmpls.length} — search to narrow down
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Quotation Type Toggle ── */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", marginBottom: 8 }}>Quotation Type</div>
              <div style={{ display: "flex", border: "1.5px solid #E4E9F2", borderRadius: 10, overflow: "hidden" }}>
                {[
                  { key: "standard", label: "Package Category" },
                  { key: "b2b",      label: "B2B" },
                  { key: "package",  label: "Package" },
                ].map((t, idx) => {
                  const isActive = form.quoteType === t.key;
                  const isLocked = !isNew && origQuoteType !== null && t.key !== origQuoteType;
                  return (
                    <button
                      key={t.key}
                      onClick={() => { if (!isLocked) upd("quoteType", t.key); }}
                      disabled={isLocked}
                      title={isLocked ? "Quote type cannot be changed after creation" : undefined}
                      style={{
                        flex: 1, padding: "9px 0", border: "none",
                        cursor: isLocked ? "not-allowed" : "pointer",
                        fontWeight: 700, fontSize: 13,
                        background: isActive ? "#2563EB" : isLocked ? "#F1F5F9" : "#F8FAFF",
                        color: isActive ? "#fff" : isLocked ? "#CBD5E1" : "#6B7A99",
                        borderRight: idx < 2 ? "1.5px solid #E4E9F2" : "none",
                        transition: "all .15s",
                      }}
                    >
                      {t.label}{isLocked ? " 🔒" : ""}
                    </button>
                  );
                })}
              </div>
              {isB2B && <div style={{ marginTop: 6, fontSize: 11, color: "#2563EB", fontWeight: 600 }}>B2B mode: pricing fields are hidden. Itinerary & service details only.</div>}
              {isPackage && <div style={{ marginTop: 6, fontSize: 11, color: "#15803D", fontWeight: 600 }}>Package mode: single flat package — no Economy/Deluxe/Premium tiers.</div>}
            </div>

            {/* ── Trip Basics ── */}
            <Sec label="Trip Basics" slate>
              <div style={G4}>
                <Fl l="Guest Name"><input style={{ ...QS.inp, color: "#94A3B8" }} value={lead?.name || ""} disabled /></Fl>
                <Fl l="Days"><input style={QS.inp} placeholder="4N 5D" value={form.days} onChange={e => upd("days", e.target.value)} /></Fl>
                <Fl l="Date of Travel"><input type="date" style={QS.inp} value={form.travelDate} onChange={e => upd("travelDate", e.target.value)} /></Fl>
                <Fl l="Salesperson">
                  <select style={QS.inp} value={form.assignedTo} onChange={e => upd("assignedTo", e.target.value)}>
                    <option value="">Select…</option>
                    {salespeople.map(sp => <option key={sp._id} value={sp._id}>{sp.name}</option>)}
                  </select>
                </Fl>
              </div>
            </Sec>

            {/* ── Highlights ── */}
            <Sec label="⭐  Highlights (shown on quotation cover)">
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 12 }}>Click pill to show/hide · Click label text to edit it</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {HL_OPTIONS.map(opt => {
                  const curHL = normHL(form.highlights);
                  const item  = curHL.find(h => h.key === opt.key);
                  const on    = !!item;
                  const lbl   = item?.label ?? opt.label;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => upd("highlights", on
                        ? curHL.filter(h => h.key !== opt.key)
                        : [...curHL, { key: opt.key, label: opt.label }]
                      )}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        border: on ? "2px solid #2563EB" : "1.5px solid #D1D5DB",
                        borderRadius: 20, padding: "6px 14px",
                        background: on ? "#EFF4FF" : "#F9FAFB",
                        cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                        color: on ? "#2563EB" : "#9CA3AF",
                        transition: "all .15s", userSelect: "none",
                      }}
                    >
                      {on ? (
                        <input
                          value={lbl}
                          onClick={e => e.stopPropagation()}
                          onChange={e => upd("highlights", curHL.map(h => h.key === opt.key ? { ...h, label: e.target.value } : h))}
                          style={{
                            border: "none", background: "transparent",
                            color: "#2563EB", fontWeight: 700, fontSize: 12.5,
                            outline: "none", minWidth: 40,
                            width: `${Math.max(lbl.length, 4)}ch`,
                            cursor: "text",
                          }}
                        />
                      ) : (
                        <span>{opt.label}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Sec>

            {/* ── Itinerary ── */}
            <Sec label="📅  Day-wise Itinerary">
              {itin.map((d, i) => (
                <div key={d._k} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 15, position: "relative" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>📅 Day {i + 1}</div>
                    {itin.length > 1 && <button style={{ ...QS.remBtn, position: "absolute", right: 0 }} onClick={() => setItin(p => p.filter((_, j) => j !== i))}>✕</button>}
                  </div>
                  <div style={{ ...QS.rowBox, marginBottom: 15 }}>
                    <div style={{ ...G2, marginBottom: 10 }}>
                      <Fl l="Date">
                        <input type="date" style={{ ...QS.inp, colorScheme: "light" }} value={d.date || ""}
                          onChange={e => setItin(p => p.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} />
                      </Fl>
                      <Fl l="Itinerary Title">
                        <input style={QS.inp} placeholder="e.g. Arrival & City Tour" value={d.title}
                          onChange={e => setItin(p => p.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                      </Fl>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <Fl l={i === 0 ? "Transfer Type (Cab — synced with Cab Details below)" : "Transfer Type"}>
                        <input style={QS.inp} placeholder="e.g. PVT / NA" value={d.transfer || ""}
                          onChange={e => i === 0
                            ? setSharedCab(e.target.value)
                            : setItin(p => p.map((x, j) => j === i ? { ...x, transfer: e.target.value } : x))} />
                      </Fl>
                    </div>
                    {/* Activities list */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99", marginBottom: 6 }}>Activities</div>
                      {(d.activities || []).map((act, ai) => {
                        const actType = act.type || "transfer";
                        const ACT_OPTS = [
                          { type: "transfer", src: "/assets/icons/quotation/transfer.svg",  label: "Transfer" },
                          { type: "hotel",    src: "/assets/icons/quotation/hotel.svg",     label: "Hotel"    },
                          { type: "meals",    src: "/assets/icons/quotation/meals.svg",     label: "Meals"    },
                          { type: "activity", src: "/assets/icons/quotation/activity.svg",  label: "Activity" },
                        ];
                        return (
                          <div key={ai} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                            {/* Icon type picker */}
                            <div style={{ display: "flex", gap: 3, border: "1px solid #E4E9F2", borderRadius: 9, padding: 3, background: "#F8FAFD", flexShrink: 0 }}>
                              {ACT_OPTS.map(opt => (
                                <button
                                  key={opt.type}
                                  type="button"
                                  title={opt.label}
                                  onClick={() => setItin(p => p.map((x, j) => j !== i ? x : {
                                    ...x, activities: x.activities.map((a, k) => k !== ai ? a : { ...a, type: opt.type })
                                  }))}
                                  style={{
                                    width: 30, height: 30, borderRadius: 6, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: actType === opt.type ? "#EFF4FF" : "transparent",
                                    border: actType === opt.type ? "1.5px solid #2563EB" : "1.5px solid transparent",
                                  }}
                                >
                                  <img src={opt.src} alt={opt.label} style={{ width: 16, height: 16, objectFit: "contain" }} />
                                </button>
                              ))}
                            </div>
                            <MiniRTE
                              value={act.text || ""}
                              placeholder="e.g. Private Cab to Hotel, Check in to XYZ..."
                              onChange={v => setItin(p => p.map((x, j) => j !== i ? x : {
                                ...x, activities: x.activities.map((a, k) => k !== ai ? a : { ...a, text: v })
                              }))}
                            />
                            <button
                              style={{ background: "#FEE2E2", border: "none", color: "#BE123C", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
                              onClick={() => setItin(p => p.map((x, j) => j !== i ? x : {
                                ...x, activities: x.activities.filter((_, k) => k !== ai)
                              }))}
                            >✕</button>
                          </div>
                        );
                      })}
                      <button
                        style={{ ...QS.addBtnBottom, marginTop: 4, fontSize: 12 }}
                        onClick={() => setItin(p => p.map((x, j) => j !== i ? x : {
                          ...x, activities: [...(x.activities || []), DEF_ACT()]
                        }))}
                      >+ Add Activity</button>
                    </div>

                  </div>
                </div>
              ))}
              <button
                onClick={() => setItin(p => [...p, { ...DEF_ITIN(), transfer: p[0]?.transfer || "" }])}
                style={QS.addBtnBottom}
              >+ Add Day {itin.length + 1}</button>
            </Sec>

            {/* ── Package Tier Selector (Standard + B2B only) ── */}
            {!isPackage && (
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", marginBottom: 8 }}>Select Package Tier to Edit</div>
                <div style={{ display: "flex", gap: 0, border: "1.5px solid #E4E9F2", borderRadius: 10, overflow: "hidden" }}>
                  {TIER_LABELS.map((lbl, idx) => {
                    const isActive = activePkg === lbl;
                    const tierColor = lbl === "Economy" ? "#15803D" : lbl === "Deluxe" ? "#2563EB" : "#7C3AED";
                    const tierBg    = lbl === "Economy" ? "#F0FDF4" : lbl === "Deluxe" ? "#EFF4FF" : "#FAF5FF";
                    return (
                      <button
                        key={lbl}
                        onClick={() => { activePkgRef.current = lbl; setActivePkg(lbl); }}
                        style={{
                          flex: 1, padding: "9px 0", border: "none",
                          cursor: "pointer",
                          fontWeight: 700, fontSize: 13,
                          background: isActive ? tierColor : tierBg,
                          color: isActive ? "#fff" : tierColor,
                          borderRight: idx < 2 ? "1.5px solid #E4E9F2" : "none",
                          transition: "all .15s",
                        }}
                      >
                        {TIER_ICONS[lbl]} {lbl}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Hotels ── */}
            <Sec
              label={`🏨  Hotel Details${tierSuffix}`}
              right={<span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Customer side</span>}
            >
              {hotels.map((h, i) => {
                const hTotal = (h.rates || []).reduce((s, r) => s + (+r.price || 0) * (+r.nights || 0) * (+r.rooms || 0), 0);
                const updRate = (ri, field, val) => setHotels(p => p.map((x, xi) => xi !== i ? x : { ...x, rates: x.rates.map((r, rj) => rj !== ri ? r : { ...r, [field]: val }) }));
                const addRate = () => setHotels(p => p.map((x, xi) => xi !== i ? x : { ...x, rates: [...x.rates, { ...DEF_RATE }] }));
                const remRate = ri => setHotels(p => p.map((x, xi) => xi !== i ? x : { ...x, rates: x.rates.filter((_, rj) => rj !== ri) }));
                return (
                  <div key={i} style={QS.rowBox}>
                    {hotels.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setHotels, i)}>✕ Hotel</button>}
                    {hotels.length > 1 && <div style={QS.rowLabel}>Hotel {i + 1}</div>}
                    {/* Hotel location + name + meal plan */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <Fl l="Location / City" style={{ flex: "0 0 150px" }}>
                        <input style={QS.inp} placeholder="e.g. Srinagar" value={h.location || ""} onChange={e => updArr(setHotels, i, "location", e.target.value)} />
                      </Fl>
                      <Fl l="Hotel Name" style={{ flex: 1 }}>
                        <input style={QS.inp} placeholder="Hotel name" value={h.name} onChange={e => updArr(setHotels, i, "name", e.target.value)} />
                      </Fl>
                      <Fl l="Meal Plan" style={{ flex: "0 0 210px" }}>
                        <select style={QS.inp} value={h.mealPlan || "CPAI"} onChange={e => updArr(setHotels, i, "mealPlan", e.target.value)}>
                          {MEAL_PLANS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                      </Fl>
                    </div>
                    {/* Rate rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
                      {(h.rates || []).map((r, ri) => (
                        <div key={ri} style={{ border: "1px solid #E4E9F2", borderRadius: 8, padding: "10px 12px", background: ri % 2 === 0 ? "#fff" : "#F8FAFD", position: "relative" }}>
                          {h.rates.length > 1 && (
                            <button style={{ position: "absolute", top: 7, right: 7, background: "#FEE2E2", border: "none", color: "#BE123C", borderRadius: 4, width: 22, height: 22, fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0 }} onClick={() => remRate(ri)}>✕</button>
                          )}
                          <div style={{ display: "grid", gridTemplateColumns: isB2B ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                            <Fl l="Occupancy">
                              <select style={QS.inp} value={r.occupancy || "Double"} onChange={e => updRate(ri, "occupancy", e.target.value)}>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Triple">Triple</option>
                                <option value="Quad">Quad</option>
                              </select>
                            </Fl>
                            <Fl l="Room Category">
                              <RoomCatSelect
                                value={r.roomCat || "Deluxe"}
                                extra={extraRoomCats}
                                onChange={v => updRate(ri, "roomCat", v)}
                                onAdd={addRoomCategory}
                                onDelete={removeRoomCategory}
                              />
                            </Fl>
                            {!isB2B && (
                              <Fl l="Price / Night (₹)">
                                <input type="number" style={QS.inp} value={r.price} placeholder="0" onChange={e => updRate(ri, "price", e.target.value)} />
                              </Fl>
                            )}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: isB2B ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10 }}>
                            <Fl l="Nights">
                              <input type="number" style={QS.inp} value={r.nights} placeholder="0" onChange={e => updRate(ri, "nights", e.target.value)} />
                            </Fl>
                            <Fl l="Rooms">
                              <input type="number" style={QS.inp} value={r.rooms} placeholder="1" onChange={e => updRate(ri, "rooms", e.target.value)} />
                            </Fl>
                            {!isB2B && (
                              <Fl l="Sub Total">
                                <input style={{ ...QS.inp, color: "#15803D", fontWeight: 700 }} value={inr((+r.price || 0) * (+r.nights || 0) * (+r.rooms || 0))} disabled />
                              </Fl>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button onClick={addRate} style={{ ...QS.addBtnBottom, marginTop: 0, width: "auto", padding: "5px 14px", fontSize: 12 }}>+ Add Rate Type</button>
                      {!isB2B && hTotal > 0 && <span style={{ fontSize: 12, fontWeight: 800, color: "#15803D" }}>Hotel Total: {inr(hTotal)}</span>}
                    </div>
                  </div>
                );
              })}
              {!isB2B && hotels.length > 1 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#15803D", marginTop: 4 }}>
                  Combined Hotel Total: {inr(hotelTotal)}
                </div>
              )}
              <button onClick={() => setHotels(p => [...p, { name: "", rates: [{ ...DEF_RATE }] }])} style={QS.addBtnBottom}>+ Add Hotel</button>
            </Sec>

            {/* ── Transfers (Cab) ── */}
            <Sec label={`🚐  Transfer${tierSuffix}`}>
              {transfers.map((t, i) => (
                <div key={i} style={QS.rowBox}>
                  {transfers.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setTransfers, i)}>✕</button>}
                  {transfers.length > 1 && <div style={QS.rowLabel}>Transfer {i + 1}</div>}
                  <div style={isB2B ? G2 : G4}>
                    <Fl l="Cab Type">
                      <input style={QS.inp} placeholder="Innova Crysta" value={t.cab}
                        onChange={e => i === 0
                          ? setSharedCab(e.target.value)
                          : updArr(setTransfers, i, "cab", e.target.value)} />
                    </Fl>
                    {!isB2B && (
                      <Fl l="Price / Day (₹)">
                        <input type="number" style={QS.inp} value={t.perDay} onChange={e => updArr(setTransfers, i, "perDay", e.target.value)} />
                      </Fl>
                    )}
                    <Fl l="Days">
                      <input type="number" style={QS.inp} value={t.days} onChange={e => updArr(setTransfers, i, "days", e.target.value)} />
                    </Fl>
                    {!isB2B && (
                      <Fl l="Sub Total">
                        <input style={{ ...QS.inp, color: "#B45309", fontWeight: 700 }}
                          value={inr((+t.perDay || 0) * (+t.days || 0))} disabled />
                      </Fl>
                    )}
                  </div>
                </div>
              ))}
              {!isB2B && transfers.length > 1 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#B45309", marginTop: 4 }}>
                  Combined Transfer Total: {inr(transferTotal)}
                </div>
              )}
              {transfers.length < 3 && (
                <button
                  onClick={() => {
                    const idx = transfers.length;
                    const prefillCab = itin[idx]?.transfer || transfers[0]?.cab || itin[0]?.transfer || "";
                    setTransfers(p => [...p, { ...DEF_TRANSFER, cab: prefillCab }]);
                  }}
                  style={QS.addBtnBottom}
                >+ Add Transfer</button>
              )}
            </Sec>

            {/* ── Miscellaneous ── */}
            <Sec label={`➕  Add on${tierSuffix}`}>
              {miscs.length === 0 && (
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 10 }}>Add any additional services — sightseeing, entry fees, boat rides, etc.</div>
              )}
              {miscs.map((m, i) => (
                <div key={i} style={QS.rowBox}>
                  <button style={QS.remBtn} onClick={() => remRow(setMiscs, i)}>✕</button>
                  {miscs.length > 1 && <div style={QS.rowLabel}>Item {i + 1}</div>}
                  <div style={isB2B ? { display: "grid", gridTemplateColumns: "1fr", gap: 10 } : G2}>
                    <Fl l="Service / Item">
                      <input style={QS.inp} placeholder="Sightseeing, Boat Ride, Entry Fees…" value={m.name} onChange={e => updArr(setMiscs, i, "name", e.target.value)} />
                    </Fl>
                    {!isB2B && (
                      <Fl l="Amount (₹)">
                        <input type="number" style={QS.inp} value={m.amount} onChange={e => updArr(setMiscs, i, "amount", e.target.value)} />
                      </Fl>
                    )}
                  </div>
                </div>
              ))}
              {!isB2B && miscs.length > 1 && miscTotal > 0 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#7C3AED", marginTop: 4 }}>
                  Total Misc: {inr(miscTotal)}
                </div>
              )}
              <button onClick={() => addRow(setMiscs, { ...DEF_MISC })} style={QS.addBtnBottom}>+ Add Misc Item</button>
            </Sec>

            {/* ── Flights ── */}
            <Sec label={`✈️  Flight Details${tierSuffix}`}>
              {flights.map((f, i) => (
                <div key={i} style={QS.rowBox}>
                  {flights.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setFlights, i)}>✕</button>}
                  {flights.length > 1 && <div style={QS.rowLabel}>Flight {i + 1}</div>}
                  <TripTypeToggle value={!!f.roundTrip} onChange={v => updArr(setFlights, i, "roundTrip", v)} />

                  {/* PNR | Flight No */}
                  <div style={{ ...G2, marginBottom: 10 }}>
                    <Fl l="PNR">
                      <input style={QS.inp} placeholder="e.g. B8F6Y1" value={f.pnr || ""} onChange={e => updArr(setFlights, i, "pnr", e.target.value)} />
                    </Fl>
                    <Fl l="Flight No.">
                      <input style={QS.inp} placeholder="e.g. SG 51" value={f.flightNo || ""} onChange={e => updArr(setFlights, i, "flightNo", e.target.value)} />
                    </Fl>
                  </div>

                  {/* Departure + Arrival side by side */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                    <div style={{ border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 12px", background: "#FFF5F5" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>✈ Departure</div>
                      <Fl l="City"><input style={QS.inp} placeholder="e.g. Delhi" value={f.depCity || ""} onChange={e => updArr(setFlights, i, "depCity", e.target.value)} /></Fl>
                      <div style={{ marginTop: 8 }}>
                        <Fl l="IATA Code"><input style={QS.inp} placeholder="e.g. DEL" value={f.depIATA || ""} onChange={e => updArr(setFlights, i, "depIATA", e.target.value)} /></Fl>
                      </div>
                      <div style={{ ...G2, marginTop: 8 }}>
                        <Fl l="Date"><input type="date" style={QS.inp} value={f.depDate || ""} onChange={e => updArr(setFlights, i, "depDate", e.target.value)} /></Fl>
                        <Fl l="Time"><input style={QS.inp} placeholder="e.g. 10:30 hrs" value={f.depTime || ""} onChange={e => updArr(setFlights, i, "depTime", e.target.value)} /></Fl>
                      </div>
                    </div>
                    <div style={{ border: "1px solid #93C5FD", borderRadius: 8, padding: "10px 12px", background: "#EFF6FF" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>🛬 Arrival</div>
                      <Fl l="City"><input style={QS.inp} placeholder="e.g. Srinagar" value={f.arrCity || ""} onChange={e => updArr(setFlights, i, "arrCity", e.target.value)} /></Fl>
                      <div style={{ marginTop: 8 }}>
                        <Fl l="IATA Code"><input style={QS.inp} placeholder="e.g. SXR" value={f.arrIATA || ""} onChange={e => updArr(setFlights, i, "arrIATA", e.target.value)} /></Fl>
                      </div>
                      <div style={{ ...G2, marginTop: 8 }}>
                        <Fl l="Date"><input type="date" style={QS.inp} value={f.arrDate || ""} onChange={e => updArr(setFlights, i, "arrDate", e.target.value)} /></Fl>
                        <Fl l="Time"><input style={QS.inp} placeholder="e.g. 12:45 hrs" value={f.arrTime || ""} onChange={e => updArr(setFlights, i, "arrTime", e.target.value)} /></Fl>
                      </div>
                    </div>
                  </div>

                  {/* Pax | Price | Sub Total */}
                  <div style={{ display: "grid", gridTemplateColumns: isB2B ? "1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: f.roundTrip ? 10 : 0 }}>
                    <Fl l="Pax">
                      <input type="number" style={QS.inp} value={f.pax} onChange={e => updArr(setFlights, i, "pax", e.target.value)} />
                    </Fl>
                    {!isB2B && (
                      <Fl l="Price Per Pax (₹)">
                        <input type="number" style={QS.inp} value={f.price} onChange={e => updArr(setFlights, i, "price", e.target.value)} />
                      </Fl>
                    )}
                    {!isB2B && (
                      <Fl l="Sub Total">
                        <input style={{ ...QS.inp, color: "#2563EB", fontWeight: 700 }} value={f.price === "" ? "" : inr((+f.price || 0) * (+f.pax || 0))} disabled />
                      </Fl>
                    )}
                  </div>

                  {/* Outbound layover — only for Round Trip (placed between onward and return sections) */}
                  {f.roundTrip && (
                    <>
                      <LayoverWidget
                        label="Outward Layover (after onward leg)"
                        has={f.hasLayover}
                        city={f.layoverCity || ""}
                        dur={f.layoverDuration || ""}
                        onEnable={() => updArr(setFlights, i, "hasLayover", true)}
                        onRemove={() => { updArr(setFlights, i, "hasLayover", false); updArr(setFlights, i, "layoverCity", ""); updArr(setFlights, i, "layoverDuration", ""); }}
                        onCity={v => updArr(setFlights, i, "layoverCity", v)}
                        onDur={v => updArr(setFlights, i, "layoverDuration", v)}
                      />
                      {f.hasLayover && !f.hasOnwardConn && (
                        <button
                          onClick={() => updArr(setFlights, i, "hasOnwardConn", true)}
                          style={{ marginTop: 8, width: "100%", padding: "9px 0", borderRadius: 8, border: "1.5px dashed #2563EB", background: "#EFF6FF", color: "#2563EB", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                        >
                          ✈ Add Connecting Flight After Outward Layover
                        </button>
                      )}
                      {f.hasLayover && f.hasOnwardConn && (
                        <div style={{ marginTop: 8, border: "1.5px solid #93C5FD", borderRadius: 10, background: "#F0F7FF", padding: "12px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: ".06em" }}>✈ Connecting Onward Flight</div>
                            <button onClick={() => { updArr(setFlights, i, "hasOnwardConn", false); ["onwardConnPnr","onwardConnFlightNo","onwardConnDepCity","onwardConnDepIATA","onwardConnDepDate","onwardConnDepTime","onwardConnArrCity","onwardConnArrIATA","onwardConnArrDate","onwardConnArrTime","onwardConnPax","onwardConnPrice"].forEach(k => updArr(setFlights, i, k, k.includes("Pax")||k.includes("Price") ? 0 : "")); }} style={{ background: "none", border: "none", color: "#DC2626", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>✕</button>
                          </div>
                          <div style={{ ...G2, marginBottom: 10 }}>
                            <Fl l="PNR (Connecting)"><input style={QS.inp} placeholder="e.g. A1B2C3" value={f.onwardConnPnr||""} onChange={e => updArr(setFlights, i, "onwardConnPnr", e.target.value)} /></Fl>
                            <Fl l="Flight No. (Connecting)"><input style={QS.inp} placeholder="e.g. AI 202" value={f.onwardConnFlightNo||""} onChange={e => updArr(setFlights, i, "onwardConnFlightNo", e.target.value)} /></Fl>
                          </div>
                          <div style={{ ...G2, marginBottom: 10 }}>
                            <div style={{ border: "1px solid #BFDBFE", borderRadius: 8, padding: "10px 10px 6px" }}>
                              <div style={{ fontSize: 10, fontWeight: 800, color: "#DC2626", textTransform: "uppercase", marginBottom: 6 }}>✈ Departure</div>
                              <Fl l="City"><input style={QS.inp} placeholder="e.g. Bangalore" value={f.onwardConnDepCity||""} onChange={e => updArr(setFlights, i, "onwardConnDepCity", e.target.value)} /></Fl>
                              <div style={{ marginTop: 6 }}><Fl l="IATA"><input style={QS.inp} placeholder="e.g. BLR" value={f.onwardConnDepIATA||""} onChange={e => updArr(setFlights, i, "onwardConnDepIATA", e.target.value)} /></Fl></div>
                              <div style={{ ...G2, marginTop: 6 }}>
                                <Fl l="Date"><input type="date" style={QS.inp} value={f.onwardConnDepDate||""} onChange={e => updArr(setFlights, i, "onwardConnDepDate", e.target.value)} /></Fl>
                                <Fl l="Time"><input style={QS.inp} placeholder="e.g. 14:30 hrs" value={f.onwardConnDepTime||""} onChange={e => updArr(setFlights, i, "onwardConnDepTime", e.target.value)} /></Fl>
                              </div>
                            </div>
                            <div style={{ border: "1px solid #BFDBFE", borderRadius: 8, padding: "10px 10px 6px" }}>
                              <div style={{ fontSize: 10, fontWeight: 800, color: "#0369A1", textTransform: "uppercase", marginBottom: 6 }}>🛬 Arrival</div>
                              <Fl l="City"><input style={QS.inp} placeholder="e.g. Delhi" value={f.onwardConnArrCity||""} onChange={e => updArr(setFlights, i, "onwardConnArrCity", e.target.value)} /></Fl>
                              <div style={{ marginTop: 6 }}><Fl l="IATA"><input style={QS.inp} placeholder="e.g. DEL" value={f.onwardConnArrIATA||""} onChange={e => updArr(setFlights, i, "onwardConnArrIATA", e.target.value)} /></Fl></div>
                              <div style={{ ...G2, marginTop: 6 }}>
                                <Fl l="Date"><input type="date" style={QS.inp} value={f.onwardConnArrDate||""} onChange={e => updArr(setFlights, i, "onwardConnArrDate", e.target.value)} /></Fl>
                                <Fl l="Time"><input style={QS.inp} placeholder="e.g. 16:45 hrs" value={f.onwardConnArrTime||""} onChange={e => updArr(setFlights, i, "onwardConnArrTime", e.target.value)} /></Fl>
                              </div>
                            </div>
                          </div>
                          <div style={{ ...G2 }}>
                            <Fl l="Pax"><input type="number" style={QS.inp} placeholder="0" value={f.onwardConnPax||""} onChange={e => updArr(setFlights, i, "onwardConnPax", e.target.value)} /></Fl>
                            <Fl l="Price Per Pax (₹)"><input type="number" style={QS.inp} placeholder="0" value={f.onwardConnPrice||""} onChange={e => updArr(setFlights, i, "onwardConnPrice", e.target.value)} /></Fl>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {f.roundTrip && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1.5px dashed #93C5FD" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>🔁 Return Leg</div>
                      {/* Return PNR | Flight No */}
                      <div style={{ ...G2, marginBottom: 10 }}>
                        <Fl l="PNR (Return)">
                          <input style={QS.inp} placeholder="e.g. C5K9R2" value={f.retPnr || ""} onChange={e => updArr(setFlights, i, "retPnr", e.target.value)} />
                        </Fl>
                        <Fl l="Flight No. (Return)">
                          <input style={QS.inp} placeholder="e.g. 6E 451" value={f.retFlightNo || ""} onChange={e => updArr(setFlights, i, "retFlightNo", e.target.value)} />
                        </Fl>
                      </div>
                      {/* Return Departure + Arrival */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                        <div style={{ border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 12px", background: "#FFF5F5" }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>✈ Return Departure</div>
                          <Fl l="City"><input style={QS.inp} placeholder="e.g. Srinagar" value={f.retDepCity || ""} onChange={e => updArr(setFlights, i, "retDepCity", e.target.value)} /></Fl>
                          <div style={{ marginTop: 8 }}>
                            <Fl l="IATA Code"><input style={QS.inp} placeholder="e.g. SXR" value={f.retDepIATA || ""} onChange={e => updArr(setFlights, i, "retDepIATA", e.target.value)} /></Fl>
                          </div>
                          <div style={{ ...G2, marginTop: 8 }}>
                            <Fl l="Date"><input type="date" style={QS.inp} value={f.retDepDate || ""} onChange={e => updArr(setFlights, i, "retDepDate", e.target.value)} /></Fl>
                            <Fl l="Time"><input style={QS.inp} placeholder="e.g. 10:30 hrs" value={f.retDepTime || ""} onChange={e => updArr(setFlights, i, "retDepTime", e.target.value)} /></Fl>
                          </div>
                        </div>
                        <div style={{ border: "1px solid #93C5FD", borderRadius: 8, padding: "10px 12px", background: "#EFF6FF" }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>🛬 Return Arrival</div>
                          <Fl l="City"><input style={QS.inp} placeholder="e.g. Delhi" value={f.retArrCity || ""} onChange={e => updArr(setFlights, i, "retArrCity", e.target.value)} /></Fl>
                          <div style={{ marginTop: 8 }}>
                            <Fl l="IATA Code"><input style={QS.inp} placeholder="e.g. DEL" value={f.retArrIATA || ""} onChange={e => updArr(setFlights, i, "retArrIATA", e.target.value)} /></Fl>
                          </div>
                          <div style={{ ...G2, marginTop: 8 }}>
                            <Fl l="Date"><input type="date" style={QS.inp} value={f.retArrDate || ""} onChange={e => updArr(setFlights, i, "retArrDate", e.target.value)} /></Fl>
                            <Fl l="Time"><input style={QS.inp} placeholder="e.g. 14:30 hrs" value={f.retArrTime || ""} onChange={e => updArr(setFlights, i, "retArrTime", e.target.value)} /></Fl>
                          </div>
                        </div>
                      </div>
                      {/* Return Price */}
                      {!isB2B && (
                        <div style={{ ...G2, marginBottom: 8 }}>
                          <Fl l="Return Price Per Pax (₹)">
                            <input type="number" style={QS.inp} value={f.returnPrice} onChange={e => updArr(setFlights, i, "returnPrice", e.target.value)} />
                          </Fl>
                          <Fl l="Return Sub Total">
                            <input style={{ ...QS.inp, color: "#2563EB", fontWeight: 700 }} value={f.returnPrice === "" ? "" : inr((+f.returnPrice || 0) * (+f.pax || 0))} disabled />
                          </Fl>
                        </div>
                      )}
                      {!isB2B && (
                        <div style={{ textAlign: "right", fontSize: 13, fontWeight: 800, color: "#1D4ED8" }}>
                          Total (Onward + Return): {inr(((+f.price || 0) + (+f.returnPrice || 0)) * (+f.pax || 0))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Round Trip: return layover (after return leg) */}
                  {f.roundTrip && (
                    <>
                      <LayoverWidget
                        label="Return Layover (after return leg)"
                        has={f.hasReturnLayover}
                        city={f.returnLayoverCity || ""}
                        dur={f.returnLayoverDuration || ""}
                        onEnable={() => updArr(setFlights, i, "hasReturnLayover", true)}
                        onRemove={() => { updArr(setFlights, i, "hasReturnLayover", false); updArr(setFlights, i, "returnLayoverCity", ""); updArr(setFlights, i, "returnLayoverDuration", ""); }}
                        onCity={v => updArr(setFlights, i, "returnLayoverCity", v)}
                        onDur={v => updArr(setFlights, i, "returnLayoverDuration", v)}
                      />
                      {f.hasReturnLayover && !f.hasReturnConn && (
                        <button
                          onClick={() => updArr(setFlights, i, "hasReturnConn", true)}
                          style={{ marginTop: 8, width: "100%", padding: "9px 0", borderRadius: 8, border: "1.5px dashed #059669", background: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                        >
                          ✈ Add Connecting Return Flight After Layover
                        </button>
                      )}
                      {f.hasReturnLayover && f.hasReturnConn && (
                        <div style={{ marginTop: 8, border: "1.5px solid #6EE7B7", borderRadius: 10, background: "#F0FDF4", padding: "12px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: "#065F46", textTransform: "uppercase", letterSpacing: ".06em" }}>✈ Connecting Return Flight</div>
                            <button onClick={() => { updArr(setFlights, i, "hasReturnConn", false); ["returnConnPnr","returnConnFlightNo","returnConnDepCity","returnConnDepIATA","returnConnDepDate","returnConnDepTime","returnConnArrCity","returnConnArrIATA","returnConnArrDate","returnConnArrTime","returnConnPax","returnConnPrice"].forEach(k => updArr(setFlights, i, k, k.includes("Pax")||k.includes("Price") ? 0 : "")); }} style={{ background: "none", border: "none", color: "#DC2626", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>✕</button>
                          </div>
                          <div style={{ ...G2, marginBottom: 10 }}>
                            <Fl l="PNR (Connecting)"><input style={QS.inp} placeholder="e.g. A1B2C3" value={f.returnConnPnr||""} onChange={e => updArr(setFlights, i, "returnConnPnr", e.target.value)} /></Fl>
                            <Fl l="Flight No. (Connecting)"><input style={QS.inp} placeholder="e.g. AI 303" value={f.returnConnFlightNo||""} onChange={e => updArr(setFlights, i, "returnConnFlightNo", e.target.value)} /></Fl>
                          </div>
                          <div style={{ ...G2, marginBottom: 10 }}>
                            <div style={{ border: "1px solid #A7F3D0", borderRadius: 8, padding: "10px 10px 6px" }}>
                              <div style={{ fontSize: 10, fontWeight: 800, color: "#DC2626", textTransform: "uppercase", marginBottom: 6 }}>✈ Departure</div>
                              <Fl l="City"><input style={QS.inp} placeholder="e.g. Mumbai" value={f.returnConnDepCity||""} onChange={e => updArr(setFlights, i, "returnConnDepCity", e.target.value)} /></Fl>
                              <div style={{ marginTop: 6 }}><Fl l="IATA"><input style={QS.inp} placeholder="e.g. BOM" value={f.returnConnDepIATA||""} onChange={e => updArr(setFlights, i, "returnConnDepIATA", e.target.value)} /></Fl></div>
                              <div style={{ ...G2, marginTop: 6 }}>
                                <Fl l="Date"><input type="date" style={QS.inp} value={f.returnConnDepDate||""} onChange={e => updArr(setFlights, i, "returnConnDepDate", e.target.value)} /></Fl>
                                <Fl l="Time"><input style={QS.inp} placeholder="e.g. 18:00 hrs" value={f.returnConnDepTime||""} onChange={e => updArr(setFlights, i, "returnConnDepTime", e.target.value)} /></Fl>
                              </div>
                            </div>
                            <div style={{ border: "1px solid #A7F3D0", borderRadius: 8, padding: "10px 10px 6px" }}>
                              <div style={{ fontSize: 10, fontWeight: 800, color: "#0369A1", textTransform: "uppercase", marginBottom: 6 }}>🛬 Arrival</div>
                              <Fl l="City"><input style={QS.inp} placeholder="e.g. Lucknow" value={f.returnConnArrCity||""} onChange={e => updArr(setFlights, i, "returnConnArrCity", e.target.value)} /></Fl>
                              <div style={{ marginTop: 6 }}><Fl l="IATA"><input style={QS.inp} placeholder="e.g. LKO" value={f.returnConnArrIATA||""} onChange={e => updArr(setFlights, i, "returnConnArrIATA", e.target.value)} /></Fl></div>
                              <div style={{ ...G2, marginTop: 6 }}>
                                <Fl l="Date"><input type="date" style={QS.inp} value={f.returnConnArrDate||""} onChange={e => updArr(setFlights, i, "returnConnArrDate", e.target.value)} /></Fl>
                                <Fl l="Time"><input style={QS.inp} placeholder="e.g. 20:30 hrs" value={f.returnConnArrTime||""} onChange={e => updArr(setFlights, i, "returnConnArrTime", e.target.value)} /></Fl>
                              </div>
                            </div>
                          </div>
                          <div style={{ ...G2 }}>
                            <Fl l="Pax"><input type="number" style={QS.inp} placeholder="0" value={f.returnConnPax||""} onChange={e => updArr(setFlights, i, "returnConnPax", e.target.value)} /></Fl>
                            <Fl l="Price Per Pax (₹)"><input type="number" style={QS.inp} placeholder="0" value={f.returnConnPrice||""} onChange={e => updArr(setFlights, i, "returnConnPrice", e.target.value)} /></Fl>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* One Way: layover after this card (connects to next flight card) */}
                  {!f.roundTrip && (
                    <>
                      <LayoverWidget
                        label="Layover After This Segment"
                        has={f.hasLayover}
                        city={f.layoverCity || ""}
                        dur={f.layoverDuration || ""}
                        onEnable={() => updArr(setFlights, i, "hasLayover", true)}
                        onRemove={() => { updArr(setFlights, i, "hasLayover", false); updArr(setFlights, i, "layoverCity", ""); updArr(setFlights, i, "layoverDuration", ""); }}
                        onCity={v => updArr(setFlights, i, "layoverCity", v)}
                        onDur={v => updArr(setFlights, i, "layoverDuration", v)}
                      />
                      {f.hasLayover && (
                        <button
                          onClick={() => insertRow(setFlights, i + 1, { ...DEF_FLIGHT })}
                          style={{ marginTop: 8, width: "100%", padding: "9px 0", borderRadius: 8, border: "1.5px dashed #2563EB", background: "#EFF6FF", color: "#2563EB", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                        >
                          ✈ Add Connecting Flight After Layover
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
              {!isB2B && flights.length > 1 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>
                  Combined Flight Total: {inr(flightTotal)}
                </div>
              )}
              <button onClick={() => addRow(setFlights, { ...DEF_FLIGHT })} style={QS.addBtnBottom}>+ Add Flight</button>
            </Sec>

            {/* ── Inclusions / Exclusions / Notes ── */}
            <Sec label="📝  Inclusions, Exclusions and Notes">
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                <Fl l="Inclusions">
                  <RTE
                    key={`inc-${tmplApplied?.quotationNo || "base"}`}
                    value={toRichText(form.inclusions || "")}
                    onChange={v => upd("inclusions", v)}
                    placeholder="List what's included in the package…"
                    minHeight={350}
                  />
                </Fl>
                <Fl l="Exclusions">
                  <RTE
                    key={`exc-${tmplApplied?.quotationNo || "base"}`}
                    value={toRichText(form.exclusions || "")}
                    onChange={v => upd("exclusions", v)}
                    placeholder="List what's not included…"
                    minHeight={350}
                  />
                </Fl>
              </div>
              <Fl l="Special Notes (shown on quote PDF)">
                <RTE
                  key={`notes-${tmplApplied?.quotationNo || "base"}`}
                  value={toRichText(form.notes || "")}
                  onChange={v => upd("notes", v)}
                  placeholder="Add any special notes for the customer…"
                />
              </Fl>
            </Sec>

            {/* ── Terms & Conditions / Booking Policy / Cancellation Policy ── */}
            <Sec
              label="📜  Booking & Cancellation Policy"
              right={<span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Customer side · shown on quote PDF</span>}
            >
              <div>
                <div style={QS.policyLabel}>Booking Policy</div>
                <RTE
                  value={toRichText(form.bookingPolicy || "")}
                  onChange={v => upd("bookingPolicy", v)}
                  placeholder="Booking / payment policy…"
                />
              </div>
              <div style={{ height: 12 }} />
              <div>
                <div style={QS.policyLabel}>Cancellation Policy</div>
                {/* ── Cancellation Bar (multi-slab progress bar) ── */}
                {(() => {
                  const slabColor = pct => pct === 0 ? "#22C55E" : pct <= 35 ? "#84CC16" : pct <= 65 ? "#F59E0B" : "#EF4444";
                  const slabs = (form.canxBar?.slabs || []).slice().sort((a, b) => b.days - a.days);
                  const maxDays = slabs.length ? slabs[0].days : 1;
                  return (
                    <div style={{ border: "1.5px solid #E4E9F2", borderRadius: 10, padding: "14px 16px", marginBottom: 12, background: "#F8FAFD" }}>
                      {/* Toggle */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: form.canxBar?.enabled ? 14 : 0 }}>
                        <input type="checkbox" id="canxBarEnabled" checked={!!form.canxBar?.enabled}
                          onChange={e => upd("canxBar", { ...form.canxBar, enabled: e.target.checked })}
                          style={{ width: 16, height: 16, cursor: "pointer" }} />
                        <label htmlFor="canxBarEnabled" style={{ fontSize: 13, fontWeight: 700, color: "#0F1B33", cursor: "pointer" }}>
                          Show Cancellation Progress Bar
                        </label>
                      </div>

                      {form.canxBar?.enabled && (
                        <div>
                          {/* Column headers */}
                          <div style={{ display: "grid", gridTemplateColumns: "110px 90px 130px 28px", gap: 8, marginBottom: 5, paddingLeft: 2 }}>
                            {["Days Before Travel", "Charge %", "Amount (auto)", ""].map((h, i) => (
                              <span key={i} style={{ fontSize: 10, fontWeight: 700, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".03em" }}>{h}</span>
                            ))}
                          </div>

                          {/* Slab rows */}
                          {(form.canxBar?.slabs || []).map((slab, i) => {
                            const amt = slab.pct === 0 ? "No charge" : `₹${Math.round((slab.pct / 100) * (c.selling || 0)).toLocaleString("en-IN")}`;
                            return (
                              <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 90px 130px 28px", gap: 8, marginBottom: 7, alignItems: "center" }}>
                                <input type="number" min={0} style={QS.inp} placeholder="e.g. 30"
                                  value={slab.days === 0 && slab.days !== "" ? "" : slab.days}
                                  onChange={e => {
                                    const next = [...(form.canxBar.slabs || [])];
                                    next[i] = { ...next[i], days: e.target.value === "" ? "" : +e.target.value };
                                    upd("canxBar", { ...form.canxBar, slabs: next });
                                  }} />
                                <div style={{ position: "relative" }}>
                                  <input type="number" min={0} max={100} style={QS.inp} placeholder="0–100"
                                    value={slab.pct}
                                    onChange={e => {
                                      const next = [...(form.canxBar.slabs || [])];
                                      next[i] = { ...next[i], pct: Math.min(100, Math.max(0, +e.target.value || 0)) };
                                      upd("canxBar", { ...form.canxBar, slabs: next });
                                    }} />
                                  <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#6B7A99", pointerEvents: "none" }}>%</span>
                                </div>
                                <div style={{ background: "#F0F4F8", border: "1px solid #E4E9F2", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 700, color: slabColor(slab.pct) }}>
                                  {amt}
                                </div>
                                <button onClick={() => {
                                  const next = (form.canxBar.slabs || []).filter((_, j) => j !== i);
                                  upd("canxBar", { ...form.canxBar, slabs: next });
                                }} style={{ background: "#FEE2E2", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", color: "#E8364A", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>✕</button>
                              </div>
                            );
                          })}

                          {/* Add slab */}
                          <button onClick={() => {
                            const next = [...(form.canxBar?.slabs || []), { days: "", pct: 0 }];
                            upd("canxBar", { ...form.canxBar, slabs: next });
                          }} style={{ background: "#EFF4FF", border: "1px dashed #BFD3FE", borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#1D4ED8", cursor: "pointer", marginTop: 2 }}>
                            + Add Slab
                          </button>

                          {/* Live bar preview */}
                          {slabs.length > 0 && (
                            <div style={{ marginTop: 14, border: "1px solid #DFF0F0", borderRadius: 8, padding: "12px 14px", background: "#fff" }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".04em" }}>Preview</div>
                              {/* Bar */}
                              <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", marginBottom: 6 }}>
                                {slabs.map((seg, idx) => {
                                  const nextDays = idx < slabs.length - 1 ? slabs[idx + 1].days : 0;
                                  const range = (seg.days || 0) - (nextDays || 0);
                                  const w = maxDays > 0 ? (range / maxDays) * 100 : 100 / slabs.length;
                                  return (
                                    <div key={idx} style={{ width: `${w}%`, background: slabColor(seg.pct), borderRight: idx < slabs.length - 1 ? "2px solid #fff" : "none", minWidth: 2 }} />
                                  );
                                })}
                              </div>
                              {/* Labels */}
                              <div style={{ display: "flex" }}>
                                {slabs.map((seg, idx) => {
                                  const nextDays = idx < slabs.length - 1 ? slabs[idx + 1].days : 0;
                                  const range = (seg.days || 0) - (nextDays || 0);
                                  const w = maxDays > 0 ? (range / maxDays) * 100 : 100 / slabs.length;
                                  return (
                                    <div key={idx} style={{ width: `${w}%`, textAlign: "center", minWidth: 0, overflow: "hidden" }}>
                                      <div style={{ fontSize: 10, fontWeight: 800, color: slabColor(seg.pct), whiteSpace: "nowrap" }}>{seg.days}+ days</div>
                                      <div style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>{seg.pct === 0 ? "Free" : `${seg.pct}%`}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
                <RTE
                  value={toRichText(form.cancellationPolicy || "")}
                  onChange={v => upd("cancellationPolicy", v)}
                  placeholder="Cancellation policy…"
                />
              </div>
            </Sec>

            {/* ── Company Side ── */}
            <div style={{ border: "2px solid #E8364A", borderRadius: 12, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ background: "#E8364A", color: "#fff", fontWeight: 700, fontSize: 14, padding: "9px 14px" }}>
                🔒 Company Side · Internal Only, never printed on the customer PDF
              </div>
              <div style={{ background: "#fff", padding: 14 }}>
                {/* Trip type toggle — Domestic / International (controls TCS) */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".05em", flexShrink: 0 }}>Trip Type:</span>
                  {["Domestic", "International"].map(t => (
                    <button key={t} type="button" onClick={() => upd("type", t)}
                      style={{ padding: "4px 12px", border: `1.5px solid ${form.type === t ? "#2563EB" : "#E2E8F0"}`, borderRadius: 7, background: form.type === t ? "#EFF4FF" : "#fff", color: form.type === t ? "#2563EB" : "#64748B", fontWeight: form.type === t ? 700 : 500, fontSize: 12, cursor: "pointer", transition: ".12s" }}>
                      {t === "Domestic" ? "🇮🇳" : "🌍"} {t}
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${intl ? 4 : 3}, 1fr)`, gap: 12, marginBottom: 14 }}>
                  <Fl l={`Cost Price (₹)${isB2B ? ` — ${activePkg}` : " — auto from components"}`}><input type="number" style={{ ...QS.inp, background: "#F0FDF4", fontWeight: 700 }} value={tierCost} onChange={e => setTierCost(e.target.value)} /></Fl>
                  <Fl l={`Margin (₹)${tierSuffix}`}><input type="number" style={QS.inp} value={tierMargin} onChange={e => setTierMargin(e.target.value)} /></Fl>
                  <Fl l="GST %"><input type="number" style={QS.inp} value={form.gstPct} onChange={e => upd("gstPct", e.target.value)} /></Fl>
                  {intl && (
                    <Fl l="TCS % (Intl only)">
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ ...QS.inp, background: "#F0FDF4", fontWeight: 600, color: "#15803D", display: "flex", alignItems: "center", gap: 5 }}>
                          2% TCS (Fixed)
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, cursor: "pointer", userSelect: "none" }}>
                          <input
                            type="checkbox"
                            checked={form.tcsInPrice !== false}
                            onChange={e => upd("tcsInPrice", e.target.checked)}
                          />
                          <span style={{ color: "#374151", fontWeight: 500 }}>Include TCS in price</span>
                        </label>
                      </div>
                    </Fl>
                  )}
                </div>
                <div style={{ background: "#FFF8F8", border: "1px dashed #E8364A", borderRadius: 10, padding: "10px 14px" }}>
                  <CR l="Margin % (auto)" v={`${c.mpct.toFixed(1)}%  ${g.g} Grade`} vc={g.c} />
                  <CR l="Cost Price" v={inr(c.cost)} />
                  <CR l="Margin" v={inr(c.margin)} />
                  {/* Subtotal row — each tier has independent ÷pax / Total checkboxes */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", margin: "4px 0", borderTop: "1px dashed #FECACA", borderBottom: "1px dashed #FECACA" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {/* Per-person toggle */}
                      <label title="Show subtotal per person in PDF" style={{ display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
                        <input type="checkbox" checked={ppSubLocal}
                          onChange={e => updPP("ppSubEnabled", e.target.checked, e.target.checked ? { ppSellEnabled: false, ppSubTotalEnabled: false } : {})}
                          style={{ width: 13, height: 13, accentColor: "#E8364A", cursor: "pointer", flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: "#E8364A", fontWeight: 700 }}>÷pax</span>
                      </label>
                      {/* Total toggle (no division) */}
                      <label title="Show total subtotal in PDF (no division)" style={{ display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
                        <input type="checkbox" checked={ppSubTotalLocal}
                          onChange={e => updPP("ppSubTotalEnabled", e.target.checked, e.target.checked ? { ppSubEnabled: false, ppSellEnabled: false } : {})}
                          style={{ width: 13, height: 13, accentColor: "#F59E0B", cursor: "pointer", flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700 }}>Total</span>
                      </label>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F1B33" }}>
                        {ppSubLocal && leadPax > 0
                          ? `Subtotal per Person (÷ ${leadPax})`
                          : "Subtotal (before GST)"}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0F1B33" }}>
                      {ppSubLocal && leadPax > 0 ? inr(c.base / leadPax) : inr(c.base)}
                    </span>
                  </div>
                  <CR l={`GST Amount (${form.gstPct}%)`} v={inr(c.gst)} />
                  {intl && <CR l="TCS Amount" v={inr(c.tcs)} />}
                  {/* Selling Price row — per-tier selling price toggle */}
                  {(() => {
                    const tcsIncluded = form.tcsInPrice !== false;
                    // Display selling: with TCS when tcsInPrice=true, without TCS when false
                    const sellDisp = intl && !tcsIncluded ? c.selling - c.tcs : c.selling;
                    const sellLabel = ppSellLocal && leadPax > 0
                      ? `Selling Price per Person (÷ ${leadPax})`
                      : intl && tcsIncluded
                        ? "Selling Price (incl. GST + TCS)"
                        : "Selling Price (incl. GST)";
                    return (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, marginTop: 4, borderTop: "1px dashed #FECACA" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={ppSellLocal}
                            onChange={e => updPP("ppSellEnabled", e.target.checked, e.target.checked ? { ppSubEnabled: false, ppSubTotalEnabled: false } : {})}
                            style={{ width: 14, height: 14, accentColor: "#2563EB", cursor: "pointer", flexShrink: 0 }}
                          />
                          <b style={{ color: "#0F1B33", fontSize: 13 }}>{sellLabel}</b>
                        </label>
                        <b style={{ fontSize: 20, color: "#2563EB" }}>
                          {ppSellLocal && leadPax > 0 ? inr(sellDisp / leadPax) : inr(sellDisp)}
                        </b>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>{/* end right scrollable form */}
          </div>{/* end two-column body */}

          {/* Footer */}
          <div style={QS.foot}>
            <button style={QS.fb} onClick={onClose}>Close</button>
            <button style={QS.fb} onClick={() => setPreview(true)}>👁 Preview PDF</button>
            <button style={QS.fb} onClick={openEmailModal}>✉️ Email Quote</button>
            {/* WhatsApp Quote button — hidden for now */}
            {!isNew && !priceChanged ? (
              <button
                style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", opacity: saving ? 0.7 : 1 }}
                onClick={saveCurrentVersion} disabled={saving}
                title="Price unchanged — saves to current version without creating a new one"
              >
                💾 {saving ? "Saving…" : "Save"}
              </button>
            ) : (
              <button
                style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", opacity: saving ? 0.7 : 1 }}
                onClick={save} disabled={saving}
                title={isNew ? "Create first version" : "Price changed — saves as a new version"}
              >
                💾 {saving ? "Saving…" : "Save as New Version"}
              </button>
            )}
          </div>
        </div>
      </Ov>

      {/* ── Quotation Email Modal ── */}
      {emailModal && (
        <Ov style={{ zIndex: 103 }} onClick={() => setEmailModal(false)}>
          <div style={{ ...QS.modal, maxWidth: 600 }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={QS.head}>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>✉️ Email Quotation</div>
                <div style={{ fontSize: 11, color: "#BFD3FE", marginTop: 2, fontWeight: 600 }}>
                  {quoteDisplayId} · {lead?.name} · {lead?.destination}
                </div>
              </div>
              <button style={{ ...QS.x, marginLeft: "auto" }} onClick={() => setEmailModal(false)}>✕</button>
            </div>

            {/* Form */}
            <div style={{ padding: "18px 22px", overflowY: "auto", maxHeight: "70vh" }}>

              {emailSent ? (
                /* ── Success state (auto-closes in 1.5s) ── */
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>✓</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#15803D", marginBottom: 8 }}>Email Queued!</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>
                    Sending to <b>{emailTo.join(", ")}</b>
                    {attachPdf && <span style={{ color: "#94A3B8" }}> · PDF being attached</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 10 }}>This window will close automatically…</div>
                </div>
              ) : (
                <>
                  {/* To */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", display: "block", marginBottom: 4 }}>
                      To * <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>— type email & press Enter or comma to add</span>
                    </label>
                    <EmailChipInput tags={emailTo} onChange={setEmailTo} placeholder="recipient@email.com" />
                  </div>

                  {/* CC + BCC side by side */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", display: "block", marginBottom: 4 }}>CC</label>
                      <EmailChipInput tags={emailCc} onChange={setEmailCc} placeholder="cc@email.com" />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", display: "block", marginBottom: 4 }}>BCC</label>
                      <EmailChipInput tags={emailBcc} onChange={setEmailBcc} placeholder="bcc@email.com" />
                    </div>
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", display: "block", marginBottom: 4 }}>Subject</label>
                    <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} style={{ ...QS.inp, width: "100%", boxSizing: "border-box" }} />
                  </div>

                  {/* Message — rich text editor */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", display: "block", marginBottom: 4 }}>Message</label>
                    <RTE key={emailModalKey} value={emailMsg} onChange={setEmailMsg} minHeight={160} />
                  </div>

                  {/* Attach PDF toggle */}
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", background: attachPdf ? "#EFF4FF" : "#F8FAFC", border: `1.5px solid ${attachPdf ? "#BFDBFE" : "#E4E9F2"}`, borderRadius: 9, marginBottom: 14, userSelect: "none" }}>
                    <input type="checkbox" checked={attachPdf} onChange={e => setAttachPdf(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#2563EB", cursor: "pointer" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: attachPdf ? "#1D4ED8" : "#374151" }}>📎 Attach Quotation PDF</div>
                      <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>
                        {attachPdf ? "PDF will be generated & attached automatically" : "Send email only without PDF"}
                      </div>
                    </div>
                  </label>

                  {/* Summary bar */}
                  <div style={{ background: "#F5F8FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#374151", lineHeight: 1.7 }}>
                    <span style={{ color: "#94A3B8", fontWeight: 600 }}>To: </span>{emailTo.join(", ") || "—"}
                    {emailCc.length > 0 && <><span style={{ color: "#94A3B8", fontWeight: 600, marginLeft: 10 }}>CC: </span>{emailCc.join(", ")}</>}
                    {emailBcc.length > 0 && <><span style={{ color: "#94A3B8", fontWeight: 600, marginLeft: 10 }}>BCC: </span>{emailBcc.join(", ")}</>}
                    <div style={{ marginTop: 3 }}><span style={{ color: "#94A3B8", fontWeight: 600 }}>Attachment: </span>{attachPdf ? "✅ Quotation PDF" : "None"}</div>
                  </div>

                  {/* Error */}
                  {emailError && (
                    <div style={{ background: "#FFF5F5", border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>
                      ⚠️ {emailError}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!emailSent && (
              <div style={QS.foot}>
                <button style={QS.fb} onClick={() => setEmailModal(false)}>Cancel</button>
                <button
                  onClick={handleSendEmail}
                  disabled={emailTo.length === 0}
                  style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", opacity: emailTo.length === 0 ? 0.65 : 1 }}
                >
                  {`Send${attachPdf ? " + PDF" : ""}`}
                </button>
              </div>
            )}
          </div>
        </Ov>
      )}

      {/* ── Template PDF Preview ── */}
      {tmplPreview && (
        <Ov style={{ zIndex: 102 }} onClick={() => setTmplPreview(null)}>
          <div style={{ ...QS.modal, maxWidth: 840 }} onClick={e => e.stopPropagation()}>
            <div style={QS.head}>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
                  Preview · {tmplPreview.quotationNo}
                </div>
                <div style={{ fontSize: 11, color: "#BFD3FE", marginTop: 2, fontWeight: 600 }}>
                  {tmplPreview.leadId?.destination || "—"} · {tmplPreview.leadId?.name || "—"} · {tmplPreview.days || "??"} days
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => { applyTemplate(tmplPreview); setTmplPreview(null); }}
                  style={{ ...QS.fb, background: "#16A34A", color: "#fff", border: "none", fontWeight: 700 }}
                >
                  ✓ Use this template
                </button>
                <button style={QS.x} onClick={() => setTmplPreview(null)}>✕</button>
              </div>
            </div>
            <div style={{ maxHeight: "70vh", overflowY: "auto", padding: 20 }}>
              <QuotationPreview
                data={{
                  quoteId:   tmplPreview.quotationNo,
                  lead:      tmplPreview.leadId || {},
                  form:      tmplPreview,
                  pkgTiers:  tmplPreview.pkgTiers || {},
                  hotels:    tmplPreview.hotels    || [],
                  flights:   tmplPreview.flights   || [],
                  transfers: tmplPreview.transfers || [],
                  miscs:     tmplPreview.miscs     || [],
                  itin:      tmplPreview.itinerary || [],
                  selling:   calcQ(tmplPreview).selling,
                }}
              />
            </div>
            <div style={QS.foot}>
              <button style={QS.fb} onClick={() => setTmplPreview(null)}>← Back to list</button>
              <button
                onClick={() => { applyTemplate(tmplPreview); setTmplPreview(null); }}
                style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", fontWeight: 700 }}
              >
                ✓ Use this template
              </button>
            </div>
          </div>
        </Ov>
      )}

      {/* ── Preview PDF ── */}
      {preview && (
        <Ov style={{ zIndex: 101 }}>
          <div style={{ ...QS.modal, maxWidth: 840 }}>
            <div style={QS.head}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Quote Preview · {quoteDisplayId}</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <button style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", opacity: pdfLoading ? 0.6 : 1 }} onClick={handleDownload} disabled={pdfLoading}>
                  ⬇ {pdfLoading ? "…" : "Download PDF"}
                </button>
                {/* Print button — hidden for now */}
                <button style={QS.x} onClick={() => setPreview(false)}>✕</button>
              </div>
            </div>
            <div style={{ padding: 22, maxHeight: "76vh", overflowY: "auto" }}>
              <QuotationPreview
                data={{ quoteId: quoteDisplayId, lead, form, pkgTiers, hotels, flights, transfers, miscs, itin, selling: c.selling }}
              />
            </div>
            <div style={QS.foot}>
              <button style={QS.fb} onClick={() => setPreview(false)}>← Back to Edit</button>
              <button style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", opacity: pdfLoading ? 0.6 : 1 }} onClick={handleDownload} disabled={pdfLoading}>
                ⬇ {pdfLoading ? "Generating…" : "Download PDF"}
              </button>
              {/* Print button — hidden for now */}
            </div>
          </div>
        </Ov>
      )}
    </>
  );
}

/* ── Sub-components ── */
function Ov({ children, onClick, style }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,18,38,.55)", backdropFilter: "blur(3px)", zIndex: 90, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 18px", ...style }} onClick={onClick}>
      {children}
    </div>
  );
}
function Sec({ label, children, slate, right }) {
  return (
    <div style={{ border: "1px solid #E4E9F2", borderRadius: 12, marginBottom: 14, overflow: "hidden" }}>
      <div style={{ background: slate ? "#5B6B8C" : "#2563EB", color: "#fff", fontWeight: 700, fontSize: 14, padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{label}</span>
        {right && (typeof right === "string" ? <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>{right}</span> : right)}
      </div>
      <div style={{ background: "#fff", padding: 14 }}>{children}</div>
    </div>
  );
}
function Fl({ l, children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99" }}>{l}</label>{children}</div>;
}
const CUSTOM_OPT = "__custom__";
function RoomCatSelect({ value, extra = [], onChange, onAdd, onDelete }) {
  const [editing, setEditing] = useState(false);
  const allKnown = [...ROOM_CATS, ...extra];
  if (editing) {
    const trimmed = (value || "").trim();
    const alreadyKnown = allKnown.some(c => c.toLowerCase() === trimmed.toLowerCase());
    return (
      <div style={{ display: "flex", gap: 6 }}>
        <input
          style={QS.inp} autoFocus placeholder="Type new category…"
          value={value === CUSTOM_OPT ? "" : value}
          onChange={e => onChange(e.target.value)}
        />
        <button
          type="button" title="Add this category" disabled={!trimmed}
          onClick={() => { if (!trimmed) return; if (!alreadyKnown) onAdd?.(trimmed); setEditing(false); }}
          style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, padding: "8px 13px", fontSize: 13, fontWeight: 700, cursor: trimmed ? "pointer" : "not-allowed", opacity: trimmed ? 1 : 0.5, flexShrink: 0, fontFamily: "inherit", whiteSpace: "nowrap" }}
        >+ Add</button>
        <button type="button" title="Cancel" onClick={() => { setEditing(false); onChange(ROOM_CATS[0]); }}
          style={{ ...QS.remBtn, position: "static", flexShrink: 0 }}>✕</button>
      </div>
    );
  }
  // if the current value is a custom category (e.g. set previously, or fetched from BRR)
  // that isn't one of the known categories, surface it as a selectable option instead of forcing edit mode
  const options = (!value || allKnown.includes(value)) ? allKnown : [value, ...allKnown];
  const isCustomValue = value && extra.includes(value);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <select style={QS.inp} value={value}
        onChange={e => {
          if (e.target.value === CUSTOM_OPT) { setEditing(true); onChange(""); }
          else onChange(e.target.value);
        }}>
        {options.map(r => <option key={r} value={r}>{r}</option>)}
        <option value={CUSTOM_OPT}>+ Add New Category…</option>
      </select>
      {isCustomValue && (
        <button
          type="button" title="Delete this category"
          onClick={() => {
            if (!window.confirm(`Delete the custom room category "${value}"? This removes it for everyone.`)) return;
            onDelete?.(value);
            onChange(ROOM_CATS[0]);
          }}
          style={{ ...QS.remBtn, position: "static", flexShrink: 0 }}
        >✕</button>
      )}
    </div>
  );
}
/* Reusable layover toggle + inputs widget */
function LayoverWidget({ label, has, city, dur, onEnable, onRemove, onCity, onDur }) {
  return !has ? (
    <button
      onClick={onEnable}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 10, padding: "5px 0", background: "none", border: "1px dashed #9CA3AF", borderRadius: 6, cursor: "pointer", fontSize: 11, color: "#6B7280", fontWeight: 600 }}
    >
      ＋ Add {label}
    </button>
  ) : (
    <div style={{ marginTop: 10, padding: "10px 12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#92400E", textTransform: "uppercase", letterSpacing: ".05em" }}>🕐 {label}</span>
        <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", fontSize: 14, lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Fl l="City"><input style={QS.inp} placeholder="e.g. Bangalore" value={city} onChange={e => onCity(e.target.value)} /></Fl>
        <Fl l="Duration"><input style={QS.inp} placeholder="e.g. 4h 15m" value={dur} onChange={e => onDur(e.target.value)} /></Fl>
      </div>
    </div>
  );
}

function TripTypeToggle({ value, onChange }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid #BFD3FE", borderRadius: 999, padding: 3, background: "#F8FAFD", marginBottom: 12 }}>
      <button
        type="button"
        onClick={() => onChange(false)}
        style={{
          padding: "5px 16px", borderRadius: 999, border: "none", cursor: "pointer",
          fontSize: 12.5, fontWeight: 700, fontFamily: "inherit",
          background: !value ? "#2563EB" : "transparent", color: !value ? "#fff" : "#6B7A99",
        }}
      >One Way</button>
      <button
        type="button"
        onClick={() => onChange(true)}
        style={{
          padding: "5px 16px", borderRadius: 999, border: "none", cursor: "pointer",
          fontSize: 12.5, fontWeight: 700, fontFamily: "inherit",
          background: value ? "#2563EB" : "transparent", color: value ? "#fff" : "#6B7A99",
        }}
      >Round Trip</button>
    </div>
  );
}
function CR({ l, v, vc }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 2px", borderBottom: "1px dashed #E4E9F2" }}><span style={{ color: "#36415A" }}>{l}</span><b style={{ color: vc || "#0F1B33" }}>{v}</b></div>;
}
const FONT_FAMILIES = ["Default", "Arial", "Georgia", "Tahoma", "Verdana", "Courier New", "Times New Roman"];
const FONT_SIZES    = ["Default", "10px", "12px", "13px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

/* ── EmailChipInput ────────────────────────────────────────────────────── */
function EmailChipInput({ tags = [], onChange, placeholder = "email@example.com" }) {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef(null);

  function addTag(raw) {
    const val = raw.trim().replace(/,$/, "").trim();
    if (!val) return;
    // basic email-like check (or just allow anything — user responsibility)
    if (!tags.includes(val)) onChange([...tags, val]);
    setInput("");
  }

  function handleKey(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function handleBlur() {
    if (input.trim()) addTag(input);
  }

  function remove(idx) {
    onChange(tags.filter((_, i) => i !== idx));
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
        minHeight: 38, padding: "5px 10px",
        border: "1.5px solid #D0D7E8", borderRadius: 9,
        background: "#fff", cursor: "text", boxSizing: "border-box",
      }}
    >
      {tags.map((t, i) => (
        <span key={i} style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: "#EFF4FF", border: "1px solid #BFDBFE",
          borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#1D4ED8", fontWeight: 600,
          whiteSpace: "nowrap",
        }}>
          {t}
          <span
            onClick={e => { e.stopPropagation(); remove(i); }}
            style={{ cursor: "pointer", color: "#93A3B8", fontWeight: 700, fontSize: 13, lineHeight: 1, marginLeft: 2 }}
          >×</span>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ""}
        style={{
          flex: "1 1 120px", minWidth: 100, border: "none", outline: "none",
          fontSize: 13, background: "transparent", color: "#1E293B", padding: "2px 0",
        }}
      />
    </div>
  );
}

function MiniRTE({ value, onChange, placeholder }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.innerHTML = value || ""; }, []);
  const exec    = cmd => { document.execCommand(cmd, false, null); if (ref.current) onChange(ref.current.innerHTML); ref.current?.focus(); };
  const execVal = (cmd, val) => { document.execCommand(cmd, false, val); if (ref.current) onChange(ref.current.innerHTML); ref.current?.focus(); };
  return (
    <div style={{ border: "1px solid #E4E9F2", borderRadius: 9, overflow: "hidden", background: "#F8FAFD", flex: 1 }}>
      <div style={{ display: "flex", gap: 3, padding: "3px 7px", background: "#EFF4FF", borderBottom: "1px solid #E4E9F2", flexWrap: "wrap", alignItems: "center" }}>
        <select defaultValue="" onMouseDown={e => e.stopPropagation()}
          onChange={e => { const v = e.target.value; e.target.value = ""; if (v) execVal("fontName", v); else exec("removeFormat"); ref.current?.focus(); }}
          style={{ ...QS.rteBtn, padding: "2px 4px", cursor: "pointer", width: 105, fontSize: 11 }}>
          <option value="">Font</option>
          {FONT_FAMILIES.map(f => <option key={f} value={f === "Default" ? "" : f}>{f}</option>)}
        </select>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("bold"); }} style={{ ...QS.rteBtn, padding: "1px 7px", fontWeight: 800 }}>B</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("italic"); }} style={{ ...QS.rteBtn, padding: "1px 7px", fontStyle: "italic" }}>I</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }} style={{ ...QS.rteBtn, padding: "1px 7px" }}>• List</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }} style={{ ...QS.rteBtn, padding: "1px 7px", color: "#BE123C", fontSize: 10 }}>Clear</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
        style={{ minHeight: 30, padding: "6px 9px", fontSize: 13, color: "#0F1B33", outline: "none", lineHeight: 1.5, fontFamily: "inherit" }}
      />
    </div>
  );
}

function RTE({ value, onChange, placeholder, minHeight }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.innerHTML = value || ""; }, []);
  const exec    = cmd  => { document.execCommand(cmd, false, null);  if (ref.current) onChange(ref.current.innerHTML); ref.current?.focus(); };
  const execVal = (cmd, val) => { document.execCommand(cmd, false, val); if (ref.current) onChange(ref.current.innerHTML); ref.current?.focus(); };
  const isEmpty = !(value ? value.replace(/<[^>]*>/g, "").trim() : "");

  function applyFontSize(px) {
    if (!px) return;
    // execCommand handles all cross-element selection edge cases
    document.execCommand("fontSize", false, "7");
    if (ref.current) {
      ref.current.querySelectorAll("font[size='7']").forEach(font => {
        const span = document.createElement("span");
        span.style.fontSize = px;
        span.innerHTML = font.innerHTML;
        font.parentNode.replaceChild(span, font);
      });
      onChange(ref.current.innerHTML);
    }
  }

  return (
    <div style={{ border: "1.5px solid #E4E9F2", borderRadius: 9, overflow: "hidden", background: "#F8FAFD" }}>
      <div style={{ display: "flex", gap: 4, padding: "5px 9px", background: "#EFF4FF", borderBottom: "1px solid #E4E9F2", flexWrap: "wrap", alignItems: "center" }}>
        <select defaultValue="" onMouseDown={e => e.stopPropagation()}
          onChange={e => { const v = e.target.value; e.target.value = ""; if (v && v !== "Default") execVal("fontName", v); else exec("removeFormat"); ref.current?.focus(); }}
          style={{ ...QS.rteBtn, padding: "3px 5px", cursor: "pointer", width: 110 }}>
          <option value="">Font</option>
          {FONT_FAMILIES.map(f => <option key={f} value={f === "Default" ? "" : f}>{f}</option>)}
        </select>
        <select defaultValue="" onMouseDown={e => e.stopPropagation()}
          onChange={e => { const v = e.target.value; e.target.value = ""; applyFontSize(v); ref.current?.focus(); }}
          style={{ ...QS.rteBtn, padding: "3px 5px", cursor: "pointer", width: 72 }}>
          <option value="">Size</option>
          {FONT_SIZES.map(s => <option key={s} value={s === "Default" ? "" : s}>{s}</option>)}
        </select>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("bold"); }} style={QS.rteBtn}><b>B</b></button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("italic"); }} style={QS.rteBtn}><i>I</i></button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }} style={QS.rteBtn}>• List</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }} style={QS.rteBtn}>1. List</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }} style={{ ...QS.rteBtn, color: "#BE123C" }}>Clear</button>
      </div>
      <div style={{ position: "relative" }}>
        {isEmpty && <div style={{ position: "absolute", top: 9, left: 11, fontSize: 13, color: "#9ca3af", pointerEvents: "none", userSelect: "none" }}>{placeholder || "Type here…"}</div>}
        <div ref={ref} contentEditable suppressContentEditableWarning onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
          style={{ minHeight: minHeight || 80, padding: "9px 11px", fontSize: 13, color: "#0F1B33", outline: "none", lineHeight: 1.7, fontFamily: "inherit" }} />
      </div>
    </div>
  );
}

const G2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const G3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 };
const G4 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 };

const QS = {
  modal:     { background: "#F3F5FA", borderRadius: 18, boxShadow: "0 10px 40px rgba(15,27,51,.18)", width: "100%" },
  head:      { display: "flex", alignItems: "center", gap: 12, padding: "15px 20px", background: "#2563EB", borderRadius: "18px 18px 0 0" },
  x:         { marginLeft: "auto", background: "rgba(255,255,255,.18)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 8, fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", flexShrink: 0 },
  body:      { padding: "18px 20px", maxHeight: "70vh", overflowY: "auto" },
  foot:      { display: "flex", gap: 8, justifyContent: "flex-end", padding: "14px 20px", borderTop: "1px solid #E4E9F2", background: "#fff", borderRadius: "0 0 18px 18px", flexWrap: "wrap", alignItems: "center" },
  fb:        { padding: "8px 14px", border: "1px solid #E4E9F2", borderRadius: 9, background: "#fff", color: "#36415A", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none", fontFamily: "inherit" },
  inp:       { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#F8FAFD", fontFamily: "inherit" },
  rowBox:    { border: "1px solid #E4E9F2", borderRadius: 10, padding: 12, marginBottom: 8, background: "#F8FAFD", position: "relative" },
  rowLabel:  { fontSize: 11, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 },
  remBtn:    { position: "absolute", top: 8, right: 8, background: "#FEE2E2", border: "none", color: "#BE123C", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  addRowBtn: { background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.3)", color: "#fff", borderRadius: 8, padding: "4px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  addBtnBottom: { width: "100%", background: "#EFF4FF", border: "1.5px dashed #2563EB", color: "#2563EB", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 6, fontFamily: "inherit" },
  rteBtn:    { background: "#fff", border: "1px solid #D1D5DB", borderRadius: 4, padding: "3px 8px", fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#374151" },
  policyLabel: { fontSize: 14, fontWeight: 700, textAlign: "center", textTransform: "uppercase", letterSpacing: ".05em", color: "#111", marginBottom: 10 },
};

export { calcQ, gradeColor, inr as inrFmt };
