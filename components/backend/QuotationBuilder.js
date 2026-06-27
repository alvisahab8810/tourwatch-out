import React, { useState, useRef, useEffect } from "react";
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
const DEF_ITIN = () => ({ _k: uid(), date: "", title: "", tour: "", transfer: "", pickup_time: "", itinerary: "" });

function initItin(initialData) {
  if (!initialData?.itinerary?.length) return [DEF_ITIN()];
  return initialData.itinerary.map(d => ({
    _k:          d._k           || uid(),
    date:        d.date         || "",
    title:       d.title        || "",
    tour:        d.tour         || "",
    transfer:    d.transfer     || "",
    pickup_time: d.pickup_time  || "",
    itinerary:   d.itinerary    || toRichText(d.description || ""),
  }));
}

const DEF_HOTEL    = { name: "", roomCat: "Deluxe", occupancy: "Double", nights: "", rooms: "", price: "" };
const DEF_FLIGHT   = { from: "", to: "", date: "", pax: "", price: "", roundTrip: false, returnPrice: "" };
const DEF_TRANSFER = { cab: "", perDay: "", days: "" };
const DEF_MISC     = { name: "", amount: "" };

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

const DEF_FORM = {
  type: "Domestic", pkgMode: "Complete Package",
  days: "", travelDate: "", assignedTo: "",
  inclusions: "", exclusions: "",
  notes: "This is an initial quote based on our most popular holiday package to your chosen destination.",
  termsConditions: DEFAULT_TERMS,
  bookingPolicy: DEFAULT_BOOKING_POLICY,
  cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
  cost: "", margin: "", gstPct: 5, tcsPct: 2, tripExpense: 0,
};

/* Build initial hotels/flights/transfers from BRR or existing data */
function initArrays(initialData, lead) {
  // hotels
  let hotels;
  if (initialData?.hotels?.length) {
    hotels = [...initialData.hotels];
  } else {
    const brr = lead?.brr || {};
    hotels = [{ ...DEF_HOTEL, roomCat: brr.hotelCategory || "Deluxe" }];
  }

  // flights
  let flights;
  if (initialData?.flights?.length) {
    flights = [...initialData.flights];
  } else {
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
    flights = [{ ...DEF_FLIGHT, pax: pax || 0, date: brr.tripDate || lead?.travelDate || "" }];
  }

  // transfers
  const transfers = initialData?.transfers?.length ? [...initialData.transfers] : [{ ...DEF_TRANSFER }];

  return { hotels, flights, transfers };
}

export default function QuotationBuilder({
  lead, leadDisplayId, quoteDisplayId,
  initialData, isNew, salespeople = [],
  onClose, onSaved,
}) {
  const brr = lead?.brr || {};

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
      }
    : {
        ...DEF_FORM,
        travelDate: brr.tripDate || lead?.travelDate || "",
        assignedTo: lead?.assignedTo?._id || lead?.assignedTo || "",
        days: brr.duration || "",
      };

  const arrInit = initArrays(initialData, lead);

  const [form,      setForm]      = useState(baseForm);
  const [hotels,    setHotels]    = useState(arrInit.hotels);
  const [flights,   setFlights]   = useState(arrInit.flights);
  const [transfers, setTransfers] = useState(arrInit.transfers);
  const [miscs,     setMiscs]     = useState(initialData?.miscs?.length ? [...initialData.miscs] : []);
  const [itin,       setItin]       = useState(() => initItin(initialData));
  const [saving,     setSaving]     = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [extraRoomCats, setExtraRoomCats] = useState([]);
  const [preview,    setPreview]    = useState(false);

  /* ── auto-save ── */
  const [savedId,   setSavedId]   = useState(initialData?._id || null);
  const [autoState, setAutoState] = useState(""); // "" | "saving" | "saved"
  const skipFirstAuto = useRef(true);
  const autoTimer     = useRef(null);

  /* ── shared cab/transfer detail: Day 1 itinerary's "Transfer Type" is the source for ──
     (a) every other itinerary day (unless that day was customised), and
     (b) the Cab Details section's "Cab Type" field — both stay editable, just kept in sync. */
  const prevSharedCab = useRef(itin[0]?.transfer || arrInit.transfers[0]?.cab || "");
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
  const c    = calcQ(form);
  const g    = gradeColor(c.mpct);
  const intl = form.type === "International";

  /* ── array helpers ── */
  function updArr(setter, idx, field, value) {
    setter(prev => prev.map((x, i) => i === idx ? { ...x, [field]: value } : x));
  }
  function addRow(setter, def)   { setter(p => [...p, { ...def }]); }
  function remRow(setter, idx)   { setter(p => p.filter((_, i) => i !== idx)); }

  /* ── sub-totals ── */
  const hotelTotal    = hotels.reduce((s, h) => s + (+h.price || 0) * (+h.nights || 0) * (+h.rooms || 0), 0);
  const flightTotal   = flights.reduce((s, f) => s + ((+f.price || 0) + (f.roundTrip ? (+f.returnPrice || 0) : 0)) * (+f.pax || 0), 0);
  const transferTotal = transfers.reduce((s, t) => s + (+t.perDay || 0) * (+t.days || 0), 0);
  const miscTotal     = miscs.reduce((s, m) => s + (+m.amount || 0), 0);
  const grandComponentTotal = hotelTotal + flightTotal + transferTotal + miscTotal;

  /* ── auto-sync Cost Price from component grand total ── */
  useEffect(() => {
    if (grandComponentTotal > 0) upd("cost", grandComponentTotal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grandComponentTotal]);

  /* ── shared body builder (used by manual save + auto-save) ── */
  function buildBody() {
    return {
      ...form,
      assignedTo: form.assignedTo || null, // empty string can't be cast to ObjectId — send null instead
      cost: toN(form.cost), margin: toN(form.margin), gstPct: toN(form.gstPct, 5), tcsPct: toN(form.tcsPct),
      hotels: hotels.map(h => ({ name: h.name, roomCat: h.roomCat, occupancy: h.occupancy || "Double", nights: toN(h.nights), rooms: toN(h.rooms, 1), price: toN(h.price) })),
      flights: flights.map(f => ({ from: f.from, to: f.to, date: f.date, pax: toN(f.pax), price: toN(f.price), roundTrip: !!f.roundTrip, returnPrice: toN(f.returnPrice) })),
      transfers: transfers.map(t => ({ cab: t.cab, perDay: toN(t.perDay), days: toN(t.days) })),
      miscs: miscs.filter(m => m.name || m.amount).map(m => ({ name: m.name, amount: toN(m.amount) })),
      itinerary: itin.map(({ _k, ...rest }) => rest),
    };
  }

  /* ── auto-save while editing (debounced, silent) ── */
  useEffect(() => {
    if (skipFirstAuto.current) { skipFirstAuto.current = false; return; }
    if (!lead?._id) return;
    setAutoState("");
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(async () => {
      setAutoState("saving");
      try {
        const body = buildBody();
        let res;
        if (!savedId) {
          res = await fetch("/api/dashboard/quotations", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, leadId: lead._id }),
          });
        } else {
          res = await fetch(`/api/dashboard/quotations/${savedId}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
        if (res.ok) {
          const data = await res.json();
          if (!savedId) setSavedId(data._id);
          setAutoState("saved");
        } else {
          setAutoState("");
        }
      } catch { setAutoState(""); }
    }, 1200);
    return () => clearTimeout(autoTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, hotels, flights, transfers, miscs, itin]);

  /* ── save (explicit, creates a new version) ── */
  async function save() {
    setSaving(true);
    try {
      const newVer = { v: (initialData?.versions?.length || 0) + 1, date: todayISO(), cost: toN(form.cost), margin: toN(form.margin), note: (initialData?.versions?.length || 0) === 0 ? "First quote created" : "Quote revised" };
      const body = { ...buildBody(), versions: [...(initialData?.versions || []), newVer] };
      let res;
      if (!savedId) {
        body.leadId = lead._id;
        res = await fetch("/api/dashboard/quotations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        res = await fetch(`/api/dashboard/quotations/${savedId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      if (res.ok) {
        const data = await res.json();
        setSavedId(data._id);
        onSaved?.(data); onClose();
      }
    } finally { setSaving(false); }
  }

  const waHref = () => {
    const n   = String(lead?.phone || "").replace(/\D/g, "");
    const msg = `Hi ${lead?.name || ""}, greetings from Tourwatchout! Your ${lead?.destination || ""} quotation ${quoteDisplayId} is ready. ${form.days} starting ${fmtDate(form.travelDate)} at ${inr(c.selling)} all inclusive. Your travel expert is a call away.`;
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

      /* Measure footer height before cloning */
      const footerEl    = document.getElementById("qb-pdf-footer");
      const footerH     = footerEl ? footerEl.offsetHeight : 0;
      const scale       = 2;

      const patch = doc => { const st = doc.createElement("style"); st.textContent = "* { font-family: Arial, Helvetica, sans-serif !important; }"; doc.head.appendChild(st); };
      const canvas  = await html2canvas(el, { scale, useCORS: true, backgroundColor: "#fff", logging: false, height: el.scrollHeight, windowHeight: el.scrollHeight, onclone: patch });

      const pdf     = new jsPDF("p", "mm", "a4");
      const pageW   = pdf.internal.pageSize.getWidth();
      const pageH   = pdf.internal.pageSize.getHeight();
      const pxPerMm = canvas.width / pageW;
      const pagePx  = Math.round(pageH * pxPerMm);

      /* Pad canvas to exact multiple of pagePx; move footer to very bottom */
      const totalPages   = Math.ceil(canvas.height / pagePx);
      const paddedHeight = totalPages * pagePx;
      const padded       = document.createElement("canvas");
      padded.width       = canvas.width;
      padded.height      = paddedHeight;
      const ctx          = padded.getContext("2d");
      ctx.fillStyle      = "#fff";
      ctx.fillRect(0, 0, padded.width, padded.height);

      const footerPx    = footerH * scale;           // footer height in canvas px
      const contentEnd  = canvas.height - footerPx;  // where footer starts in original canvas

      /* Draw all content above footer */
      ctx.drawImage(canvas, 0, 0, canvas.width, contentEnd, 0, 0, canvas.width, contentEnd);
      /* Draw footer pinned to very bottom of padded canvas */
      ctx.drawImage(canvas, 0, contentEnd, canvas.width, footerPx, 0, paddedHeight - footerPx, canvas.width, footerPx);

      /* Slice into A4 pages — every slice is now exactly pagePx tall */
      let yPx = 0, first = true;
      while (yPx < padded.height) {
        if (!first) pdf.addPage();
        first = false;
        const sl = document.createElement("canvas");
        sl.width  = padded.width;
        sl.height = pagePx;
        sl.getContext("2d").drawImage(padded, 0, yPx, padded.width, pagePx, 0, 0, padded.width, pagePx);
        pdf.addImage(sl.toDataURL("image/png"), "PNG", 0, 0, pageW, pageH);
        yPx += pagePx;
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
      <Ov onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
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
            {autoState && (
              <div style={{ fontSize: 11.5, color: "#BFD3FE", fontWeight: 700, display: "flex", alignItems: "center", gap: 5, marginLeft: "auto" }}>
                {autoState === "saving" ? "⏳ Saving…" : "✓ All changes auto-saved"}
              </div>
            )}
            <button style={{ ...QS.x, marginLeft: autoState ? 14 : "auto" }} onClick={onClose}>✕</button>
          </div>

          {/* Body — two columns: sticky price panel left + scrollable form right */}
          <div style={{ display: "flex", maxHeight: "70vh", overflow: "hidden" }}>

          {/* ── LEFT: live price preview ── */}
          <div style={{ width: 210, flexShrink: 0, overflowY: "auto", background: "#fff", borderRight: "1px solid #E4E9F2", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7A99", marginBottom: 2 }}>💰 Price Preview</div>

            {/* Hotels */}
            {hotels.some(h => +h.price > 0) && (
              <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#15803D", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>🏨 Hotels</div>
                {hotels.map((h, i) => +h.price > 0 && (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4, fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#374151", flexShrink: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name || `Hotel ${i + 1}`}</span>
                    <span style={{ fontWeight: 700, color: "#15803D", flexShrink: 0 }}>{inr((+h.price || 0) * (+h.nights || 0) * (+h.rooms || 0))}</span>
                  </div>
                ))}
                {hotels.length > 1 && <div style={{ fontSize: 11, fontWeight: 800, color: "#15803D", borderTop: "1px dashed #86EFAC", paddingTop: 4, marginTop: 2, display: "flex", justifyContent: "space-between" }}><span>Total</span><span>{inr(hotelTotal)}</span></div>}
              </div>
            )}

            {/* Flights */}
            {flights.some(f => +f.price > 0) && (
              <div style={{ background: "#EFF4FF", border: "1px solid #93C5FD", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>✈️ Flights</div>
                {flights.map((f, i) => +f.price > 0 && (
                  <div key={i} style={{ fontSize: 11, marginBottom: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
                      <span style={{ color: "#374151" }}>{f.from || "—"} → {f.to || "—"}</span>
                      <span style={{ fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>{inr((+f.price || 0) * (+f.pax || 0))}</span>
                    </div>
                    {f.roundTrip && +f.returnPrice > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 4, color: "#6B7A99" }}>
                        <span>↩ Return</span>
                        <span style={{ fontWeight: 700, flexShrink: 0 }}>{inr((+f.returnPrice || 0) * (+f.pax || 0))}</span>
                      </div>
                    )}
                  </div>
                ))}
                {flights.length > 1 && <div style={{ fontSize: 11, fontWeight: 800, color: "#1D4ED8", borderTop: "1px dashed #93C5FD", paddingTop: 4, marginTop: 2, display: "flex", justifyContent: "space-between" }}><span>Total</span><span>{inr(flightTotal)}</span></div>}
              </div>
            )}

            {/* Transfers */}
            {transfers.some(t => +t.perDay > 0) && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#B45309", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>🚐 Transfers</div>
                {transfers.map((t, i) => +t.perDay > 0 && (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4, fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#374151", flexShrink: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.cab || `Transfer ${i + 1}`}</span>
                    <span style={{ fontWeight: 700, color: "#B45309", flexShrink: 0 }}>{inr((+t.perDay || 0) * (+t.days || 0))}</span>
                  </div>
                ))}
                {transfers.length > 1 && <div style={{ fontSize: 11, fontWeight: 800, color: "#B45309", borderTop: "1px dashed #FCD34D", paddingTop: 4, marginTop: 2, display: "flex", justifyContent: "space-between" }}><span>Total</span><span>{inr(transferTotal)}</span></div>}
              </div>
            )}

            {/* Misc preview */}
            {miscTotal > 0 && (
              <div style={{ background: "#FAF5FF", border: "1px solid #D8B4FE", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>➕ Misc</div>
                {miscs.map((m, i) => +m.amount > 0 && (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#374151", flexShrink: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name || `Item ${i + 1}`}</span>
                    <span style={{ fontWeight: 700, color: "#7C3AED", flexShrink: 0 }}>{inr(+m.amount)}</span>
                  </div>
                ))}
                {miscs.filter(m => +m.amount > 0).length > 1 && (
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", borderTop: "1px dashed #D8B4FE", paddingTop: 4, marginTop: 2, display: "flex", justifyContent: "space-between" }}><span>Total</span><span>{inr(miscTotal)}</span></div>
                )}
              </div>
            )}

            {/* Grand total */}
            {grandComponentTotal > 0 && (
              <div style={{ background: "#EFF4FF", border: "2px solid #2563EB", borderRadius: 8, padding: "8px 10px", marginTop: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#1D4ED8" }}>Grand Total</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#1D4ED8" }}>{inr(grandComponentTotal)}</span>
                </div>
              </div>
            )}

            {grandComponentTotal === 0 && (
              <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
                Enter prices in Hotels, Flights or Transfers to see live preview here.
              </div>
            )}
          </div>

          {/* ── RIGHT: scrollable form ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

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
                    <div>
                      <Fl l="Itinerary Details">
                        <RTE
                          value={toRichText(d.itinerary || "")}
                          onChange={v => setItin(p => p.map((x, j) => j === i ? { ...x, itinerary: v } : x))}
                          placeholder="Describe what happens this day…"
                          minHeight={200}
                        />
                      </Fl>
                    </div>

                  </div>
                </div>
              ))}
              <button
                onClick={() => setItin(p => [...p, { ...DEF_ITIN(), transfer: p[0]?.transfer || "" }])}
                style={QS.addBtnBottom}
              >+ Add Day {itin.length + 1}</button>
            </Sec>

            {/* ── Hotels ── */}
            <Sec
              label="🏨  Hotel Details"
              right={<span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Customer side</span>}
            >
              {hotels.map((h, i) => (
                <div key={i} style={QS.rowBox}>
                  {hotels.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setHotels, i)}>✕</button>}
                  {hotels.length > 1 && <div style={QS.rowLabel}>Hotel {i + 1}</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <Fl l="Select Hotel">
                      <input style={QS.inp} placeholder="Hotel name, city" value={h.name} onChange={e => updArr(setHotels, i, "name", e.target.value)} />
                    </Fl>
                    <Fl l="Room Category">
                      <RoomCatSelect
                        value={h.roomCat}
                        extra={extraRoomCats}
                        onChange={v => updArr(setHotels, i, "roomCat", v)}
                        onAdd={addRoomCategory}
                        onDelete={removeRoomCategory}
                      />
                    </Fl>
                    <Fl l="Occupancy">
                      <select style={QS.inp} value={h.occupancy || "Double"} onChange={e => updArr(setHotels, i, "occupancy", e.target.value)}>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Triple">Triple</option>
                      </select>
                    </Fl>
                    <Fl l="Price / Night (₹)">
                      <input type="number" style={QS.inp} value={h.price} onChange={e => updArr(setHotels, i, "price", e.target.value)} />
                    </Fl>
                  </div>
                  <div style={G3}>
                    <Fl l="Nights">
                      <input type="number" style={QS.inp} value={h.nights} onChange={e => updArr(setHotels, i, "nights", e.target.value)} />
                    </Fl>
                    <Fl l="Rooms">
                      <input type="number" style={QS.inp} value={h.rooms} onChange={e => updArr(setHotels, i, "rooms", e.target.value)} />
                    </Fl>
                    <Fl l="Sub Total">
                      <input style={{ ...QS.inp, color: "#15803D", fontWeight: 700 }}
                        value={inr((+h.price || 0) * (+h.nights || 0) * (+h.rooms || 0))} disabled />
                    </Fl>
                  </div>
                </div>
              ))}
              {hotels.length > 1 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#15803D", marginTop: 4 }}>
                  Combined Hotel Total: {inr(hotelTotal)}
                </div>
              )}
              <button onClick={() => addRow(setHotels, DEF_HOTEL)} style={QS.addBtnBottom}>+ Add Hotel</button>
            </Sec>

            {/* ── Transfers (Cab) ── */}
            <Sec label="🚐  Transfer">
              {transfers.map((t, i) => (
                <div key={i} style={QS.rowBox}>
                  {transfers.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setTransfers, i)}>✕</button>}
                  {transfers.length > 1 && <div style={QS.rowLabel}>Transfer {i + 1}</div>}
                  <div style={G4}>
                    <Fl l="Cab Type">
                      <input style={QS.inp} placeholder="Innova Crysta" value={t.cab}
                        onChange={e => i === 0
                          ? setSharedCab(e.target.value)
                          : updArr(setTransfers, i, "cab", e.target.value)} />
                    </Fl>
                    <Fl l="Price / Day (₹)">
                      <input type="number" style={QS.inp} value={t.perDay} onChange={e => updArr(setTransfers, i, "perDay", e.target.value)} />
                    </Fl>
                    <Fl l="Days">
                      <input type="number" style={QS.inp} value={t.days} onChange={e => updArr(setTransfers, i, "days", e.target.value)} />
                    </Fl>
                    <Fl l="Sub Total">
                      <input style={{ ...QS.inp, color: "#B45309", fontWeight: 700 }}
                        value={inr((+t.perDay || 0) * (+t.days || 0))} disabled />
                    </Fl>
                  </div>
                </div>
              ))}
              {transfers.length > 1 && (
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
            <Sec label="➕  Miscellaneous">
              {miscs.length === 0 && (
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 10 }}>Add any additional services — sightseeing, entry fees, boat rides, etc.</div>
              )}
              {miscs.map((m, i) => (
                <div key={i} style={QS.rowBox}>
                  <button style={QS.remBtn} onClick={() => remRow(setMiscs, i)}>✕</button>
                  {miscs.length > 1 && <div style={QS.rowLabel}>Item {i + 1}</div>}
                  <div style={G2}>
                    <Fl l="Service / Item">
                      <input style={QS.inp} placeholder="Sightseeing, Boat Ride, Entry Fees…" value={m.name} onChange={e => updArr(setMiscs, i, "name", e.target.value)} />
                    </Fl>
                    <Fl l="Amount (₹)">
                      <input type="number" style={QS.inp} value={m.amount} onChange={e => updArr(setMiscs, i, "amount", e.target.value)} />
                    </Fl>
                  </div>
                </div>
              ))}
              {miscs.length > 1 && miscTotal > 0 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#7C3AED", marginTop: 4 }}>
                  Total Misc: {inr(miscTotal)}
                </div>
              )}
              <button onClick={() => addRow(setMiscs, { ...DEF_MISC })} style={QS.addBtnBottom}>+ Add Misc Item</button>
            </Sec>

            {/* ── Flights ── */}
            <Sec label="✈️  Flight Details">
              {flights.map((f, i) => (
                <div key={i} style={QS.rowBox}>
                  {flights.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setFlights, i)}>✕</button>}
                  {flights.length > 1 && <div style={QS.rowLabel}>Flight {i + 1}</div>}
                  <TripTypeToggle value={!!f.roundTrip} onChange={v => updArr(setFlights, i, "roundTrip", v)} />
                  {/* Row 1: From | To */}
                  <div style={{ ...G2, marginBottom: 10 }}>
                    <Fl l="From">
                      <input style={QS.inp} placeholder="Delhi" value={f.from} onChange={e => updArr(setFlights, i, "from", e.target.value)} />
                    </Fl>
                    <Fl l="To">
                      <input style={QS.inp} placeholder="Srinagar" value={f.to} onChange={e => updArr(setFlights, i, "to", e.target.value)} />
                    </Fl>
                  </div>
                  {/* Row 2: Pax | Price Per Pax */}
                  <div style={{ ...G2, marginBottom: 10 }}>
                    <Fl l="Pax">
                      <input type="number" style={QS.inp} value={f.pax} onChange={e => updArr(setFlights, i, "pax", e.target.value)} />
                    </Fl>
                    <Fl l="Price Per Pax (₹)">
                      <input type="number" style={QS.inp} value={f.price} onChange={e => updArr(setFlights, i, "price", e.target.value)} />
                    </Fl>
                  </div>
                  {/* Row 3: Sub Total — full width */}
                  <Fl l="Sub Total">
                    <input style={{ ...QS.inp, color: "#2563EB", fontWeight: 700 }}
                      value={f.price === "" ? "" : inr((+f.price || 0) * (+f.pax || 0))} disabled />
                  </Fl>

                  {f.roundTrip && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed #E4E9F2" }}>
                      {/* Return Row 1: Return From | Return To */}
                      <div style={{ ...G2, marginBottom: 10 }}>
                        <Fl l="Return From">
                          <input style={QS.inp} placeholder={f.to || "Srinagar"} value={f.to} disabled />
                        </Fl>
                        <Fl l="Return To">
                          <input style={QS.inp} placeholder={f.from || "Delhi"} value={f.from} disabled />
                        </Fl>
                      </div>
                      {/* Return Row 2: Pax | Return Price Per Pax */}
                      <div style={{ ...G2, marginBottom: 10 }}>
                        <Fl l="Pax">
                          <input style={{ ...QS.inp, color: "#94A3B8" }} value={f.pax} disabled />
                        </Fl>
                        <Fl l="Return Price Per Pax (₹)">
                          <input type="number" style={QS.inp} value={f.returnPrice} onChange={e => updArr(setFlights, i, "returnPrice", e.target.value)} />
                        </Fl>
                      </div>
                      {/* Return Row 3: Return Sub Total — full width */}
                      <Fl l="Return Sub Total">
                        <input style={{ ...QS.inp, color: "#2563EB", fontWeight: 700 }}
                          value={f.returnPrice === "" ? "" : inr((+f.returnPrice || 0) * (+f.pax || 0))} disabled />
                      </Fl>
                      <div style={{ textAlign: "right", fontSize: 13, fontWeight: 800, color: "#1D4ED8", marginTop: 8 }}>
                        Total Amount (Onward + Return): {inr(((+f.price || 0) + (+f.returnPrice || 0)) * (+f.pax || 0))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {flights.length > 1 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>
                  Combined Flight Total: {inr(flightTotal)}
                </div>
              )}
              {flights.length < 3 && (
                <button onClick={() => addRow(setFlights, DEF_FLIGHT)} style={QS.addBtnBottom}>+ Add Flight</button>
              )}
            </Sec>

            {/* ── Inclusions / Exclusions / Notes ── */}
            <Sec label="📝  Inclusions, Exclusions and Notes">
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                <Fl l="Inclusions">
                  <RTE
                    value={toRichText(form.inclusions || "")}
                    onChange={v => upd("inclusions", v)}
                    placeholder="List what's included in the package…"
                    minHeight={350}
                  />
                </Fl>
                <Fl l="Exclusions">
                  <RTE
                    value={toRichText(form.exclusions || "")}
                    onChange={v => upd("exclusions", v)}
                    placeholder="List what's not included…"
                    minHeight={350}
                  />
                </Fl>
              </div>
              <Fl l="Special Notes (shown on quote PDF)">
                <textarea style={{ ...QS.inp, minHeight: 54, resize: "vertical" }} value={form.notes} onChange={e => upd("notes", e.target.value)} />
              </Fl>
            </Sec>

            {/* ── Terms & Conditions / Booking Policy / Cancellation Policy ── */}
            <Sec
              label="📜  Terms, Booking & Cancellation Policy"
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
                <RTE
                  value={toRichText(form.cancellationPolicy || "")}
                  onChange={v => upd("cancellationPolicy", v)}
                  placeholder="Cancellation policy…"
                />
              </div>
              <div style={{ height: 12 }} />
              <div>
                <div style={QS.policyLabel}>Terms & Conditions</div>
                <RTE
                  value={toRichText(form.termsConditions || "")}
                  onChange={v => upd("termsConditions", v)}
                  placeholder="Terms & conditions…"
                />
              </div>
            </Sec>

            {/* ── Company Side ── */}
            <div style={{ border: "2px solid #E8364A", borderRadius: 12, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ background: "#E8364A", color: "#fff", fontWeight: 700, fontSize: 14, padding: "9px 14px" }}>
                🔒 Company Side · Internal Only, never printed on the customer PDF
              </div>
              <div style={{ background: "#fff", padding: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${intl ? 4 : 3}, 1fr)`, gap: 12, marginBottom: 14 }}>
                  <Fl l="Cost Price (₹) — auto from components"><input type="number" style={{ ...QS.inp, background: "#F0FDF4", fontWeight: 700 }} value={form.cost} onChange={e => upd("cost", e.target.value)} /></Fl>
                  <Fl l="Margin (₹)"><input type="number" style={QS.inp} value={form.margin} onChange={e => upd("margin", e.target.value)} /></Fl>
                  <Fl l="GST %"><input type="number" style={QS.inp} value={form.gstPct} onChange={e => upd("gstPct", e.target.value)} /></Fl>
                  {intl && (
                    <Fl l="TCS % (Intl only)">
                      <select style={QS.inp} value={form.tcsPct} onChange={e => upd("tcsPct", +e.target.value)}>
                        <option value={2}>2% (up to ₹7L)</option>
                        <option value={20}>20% (above ₹7L)</option>
                      </select>
                    </Fl>
                  )}
                </div>
                <div style={{ background: "#FFF8F8", border: "1px dashed #E8364A", borderRadius: 10, padding: "10px 14px" }}>
                  <CR l="Margin %  (auto)" v={`${c.mpct.toFixed(1)}%  ${g.g} Grade`} vc={g.c} />
                  <CR l="Base Price = Cost + Margin" v={inr(c.base)} />
                  <CR l="GST Amount" v={inr(c.gst)} />
                  {intl && <CR l="TCS Amount" v={inr(c.tcs)} />}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, marginTop: 4, borderTop: "1px dashed #FECACA" }}>
                    <b style={{ color: "#0F1B33", fontSize: 13 }}>Selling Price = Base + GST{intl ? " + TCS" : ""}</b>
                    <b style={{ fontSize: 20, color: "#2563EB" }}>{inr(c.selling)}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>{/* end right scrollable form */}
          </div>{/* end two-column body */}

          {/* Footer */}
          <div style={QS.foot}>
            <button style={QS.fb} onClick={onClose}>Close</button>
            <button style={QS.fb} onClick={() => setPreview(true)}>👁 Preview PDF</button>
            <a style={QS.fb} href={emailHref()}>✉️ Email Quote</a>
            <a style={{ ...QS.fb, background: "#16A34A", color: "#fff", border: "1px solid #16A34A", textDecoration: "none" }} href={waHref()} target="_blank" rel="noreferrer">💬 WhatsApp Quote</a>
            <button style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", opacity: saving ? 0.7 : 1 }} onClick={save} disabled={saving}>
              💾 {saving ? "Saving…" : "Save as New Version"}
            </button>
          </div>
        </div>
      </Ov>

      {/* ── Preview PDF ── */}
      {preview && (
        <Ov style={{ zIndex: 101 }} onClick={e => { if (e.target === e.currentTarget) setPreview(false); }}>
          <div style={{ ...QS.modal, maxWidth: 840 }}>
            <div style={QS.head}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Quote Preview · {quoteDisplayId}</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <button style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", opacity: pdfLoading ? 0.6 : 1 }} onClick={handleDownload} disabled={pdfLoading}>
                  ⬇ {pdfLoading ? "…" : "Download PDF"}
                </button>
                <button style={{ ...QS.fb, background: "#7c3aed", color: "#fff", border: "none", opacity: pdfLoading ? 0.6 : 1 }} onClick={handlePrint} disabled={pdfLoading}>
                  🖨 Print
                </button>
                <button style={QS.x} onClick={() => setPreview(false)}>✕</button>
              </div>
            </div>
            <div style={{ padding: 22, maxHeight: "76vh", overflowY: "auto" }}>
              <QuotationPreview
                id="qb-pdf-target"
                data={{ quoteId: quoteDisplayId, lead, form, hotels, flights, transfers, miscs, itin, selling: c.selling }}
              />
            </div>
            <div style={QS.foot}>
              <button style={QS.fb} onClick={() => setPreview(false)}>← Back to Edit</button>
              <button style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none", opacity: pdfLoading ? 0.6 : 1 }} onClick={handleDownload} disabled={pdfLoading}>
                ⬇ {pdfLoading ? "Generating…" : "Download PDF"}
              </button>
              <button style={{ ...QS.fb, background: "#7c3aed", color: "#fff", border: "none", opacity: pdfLoading ? 0.6 : 1 }} onClick={handlePrint} disabled={pdfLoading}>
                🖨 Print
              </button>
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

function RTE({ value, onChange, placeholder, minHeight }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.innerHTML = value || ""; }, []);
  const exec    = cmd  => { document.execCommand(cmd, false, null);  if (ref.current) onChange(ref.current.innerHTML); ref.current?.focus(); };
  const execVal = (cmd, val) => { document.execCommand(cmd, false, val); if (ref.current) onChange(ref.current.innerHTML); ref.current?.focus(); };
  const isEmpty = !(value ? value.replace(/<[^>]*>/g, "").trim() : "");

  function applyFontSize(px) {
    if (!px || px === "Default") { exec("removeFormat"); return; }
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    const span = document.createElement("span");
    span.style.fontSize = px;
    range.surroundContents(span);
    if (ref.current) onChange(ref.current.innerHTML);
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
