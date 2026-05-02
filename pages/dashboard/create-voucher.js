import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdHotel, MdFlight, MdDirectionsCar, MdCalendarToday,
  MdPerson, MdLocationOn, MdSave, MdVisibility, MdAdd,
  MdDelete, MdHome, MdClose, MdDownload, MdPrint,
  MdInfo, MdEmail, MdSend, MdCheckCircle, MdMenu,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { isAuthenticated } from "../../utils/voucherAuth";
import VoucherPreview from "../../components/voucher/VoucherPreview";
import Sidebar from "../../components/backend/Sidebar";

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toISO(displayStr) {
  if (!displayStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayStr)) return displayStr;
  const d = new Date(displayStr);
  if (isNaN(d)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function fromISO(iso, fmt = "long") {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  if (fmt === "flight") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  if (fmt === "short") {
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}
function buildTravelDate(from, to) {
  if (from && to) return `${from} – ${to}`;
  return from || to || "";
}
function toRichText(text) {
  if (!text) return "";
  if (/<[^>]+>/.test(text)) return text;
  return text.replace(/\n/g, "<br>");
}

// ─── Auto ID generation ───────────────────────────────────────────────────────
function getFinancialYear() {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
  return m >= 4
    ? `${String(y).slice(2)}-${String(y + 1).slice(2)}`
    : `${String(y - 1).slice(2)}-${String(y).slice(2)}`;
}
function getMonthPad() {
  return String(new Date().getMonth() + 1).padStart(2, "0");
}
function buildVoucherNo(allVouchers) {
  const fy = getFinancialYear(), mm = getMonthPad();
  const prefix = `TWO/${fy}/${mm}/`;
  const count = allVouchers.filter((v) => v.voucherNo?.startsWith(prefix)).length;
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}
function buildTripId(allVouchers) {
  const fy = getFinancialYear(), mm = getMonthPad();
  const prefix = `TWO/${fy}/${mm}/`;
  const yearCount = allVouchers.filter((v) => v.tripId?.startsWith(`TWO/${fy}/`)).length;
  return `${prefix}${String(26 + yearCount + 1).padStart(3, "0")}`;
}

// ─── Options ──────────────────────────────────────────────────────────────────
const MEAL_PLAN_OPTIONS = [
  "EPAI - Room Only",
  "CPAI - Room & Breakfast",
  "MAPAI - Breakfast & Lunch",
  "MAPAI - Breakfast & Dinner",
  "APAI - Breakfast, Lunch & Dinner",
];
const NIGHTS_OPTIONS = [
  "1N/2D","2N/3D","3N/4D","4N/5D","5N/6D",
  "6N/7D","7N/8D","8N/9D","9N/10D","10N/11D","11N/12D",
];

// ─── Factories ────────────────────────────────────────────────────────────────
const uid = () => Date.now() + Math.random();
const EMPTY_FLIGHT = () => ({
  id: uid(), pnr: "", flight_no: "",
  from_city: "", from_code: "", from_date: "", from_time: "",
  to_city: "", to_code: "", to_date: "", to_time: "",
});
const EMPTY_TRANSPORT = () => ({ id: uid(), vehicle_type: "", driver_name: "", driver_contact: "" });
const EMPTY_ITINERARY = () => ({ id: uid(), date: "", title: "", tour: "", transfer: "", pickup_time: "", itinerary: "" });
const EMPTY_HOTEL = () => ({
  id: uid(),
  place: "",
  hotelName: "", hotelAddress: "", hotelConfirmNo: "", units: "",
  roomType: "", mealPlan: "",
  checkinDate: "", checkinTime: "2:00 PM", checkoutDate: "", checkoutTime: "10:00 AM", nights: "",
});

const DEFAULT_HOTEL_NOTE = `Kindly note, early check-in is subject to availability of the rooms or hotel may charge directly to the guest.
• For early check-in, extra bed and airport pickups contact the hotel directly.
• Passport, Driving License and Aadhaar are accepted as ID proof(s). Local ids are allowed.
• Please ask the property for the GST invoice at the time of check-in and collect it at the time of check-out (valid only for properties in India).`;

const DEFAULT_TC = `As per the Dubai Executive Council Resolution No. (2) of 2014, a "Tourism Dirham(TD)" charge of AED 10 to AED 20 per room per night (depending on the Hotel Classification category) will apply for hotel rooms and Suites. For Apartment rooms, charges are AED 10 or AED 20 per bedroom per apartment per night.

We request to the guest that at the time of arrival in UAE, kindly purchase a local SIM, so we can communicate easily. Pick-up &amp; drop timings are only indicative &amp; might change, exact timings will be informed by the operations team when the customer is here.

It is advisable for customers to contact our local Dubai office and inform their hotel room numbers/local contact number once they check-in.

In case any tour is cancelled, due to bad weather or any unavoidable circumstances, we shall inform you prior and the same shall be organized some other day or refund the amount for same.`;

const DEFAULT_FORM = {
  voucherNo: "", tripId: "",
  name: "", pax: "", travelDateFrom: "", travelDateTo: "", travelDate: "", destination: "",
  email: "", contactNo: "", address: "",
  showHotel: false, hotels: [],
  showFlights: false, flights: [],
  showTransport: false, transports: [],
  showItinerary: false, itineraries: [],
  hotelNote: DEFAULT_HOTEL_NOTE,
  inclusions: "",
  exclusions: "",
  valueAddition: "Water, Cake, GTB - N/A",
  specialInstructions: "",
  termsConditions: DEFAULT_TC,
};

export default function CreateVoucher() {
  const router = useRouter();
  const { id: editId } = router.query;
  const [ready, setReady] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [sidebar, setSidebar] = useState(false);
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
    const vouchers = JSON.parse(localStorage.getItem("tw_vouchers") || "[]");
    if (editId) {
      const found = vouchers.find((v) => v.id === editId);
      if (found) {
        setForm(found);
        setFormKey((k) => k + 1);
        setReady(true);
        return;
      }
    }
    setForm((f) => ({
      ...f,
      voucherNo: buildVoucherNo(vouchers),
      tripId: buildTripId(vouchers),
    }));
    setFormKey((k) => k + 1);
    setReady(true);
  }, [editId]);

  const set = (key, val) => { setForm((f) => ({ ...f, [key]: val })); setSaved(false); };
  const setMulti = (updates) => { setForm((f) => ({ ...f, ...updates })); setSaved(false); };

  // Hotel
  const addHotel = () => set("hotels", [...(form.hotels || []), EMPTY_HOTEL()]);
  const removeHotel = (id) => set("hotels", form.hotels.filter((h) => h.id !== id));
  const updateHotel = (id, k, v) => {
    setForm((f) => ({
      ...f,
      hotels: f.hotels.map((h) => {
        if (h.id !== id) return h;
        const updated = { ...h, [k]: v };
        if (k === "checkinDate") updated.checkoutDate = v;
        return updated;
      }),
    }));
    setSaved(false);
  };

  // Flight
  const addFlight = () => set("flights", [...form.flights, EMPTY_FLIGHT()]);
  const removeFlight = (id) => set("flights", form.flights.filter((f) => f.id !== id));
  const updateFlight = (id, k, v) => set("flights", form.flights.map((f) => f.id === id ? { ...f, [k]: v } : f));

  // Transport
  const addTransport = () => set("transports", [...form.transports, EMPTY_TRANSPORT()]);
  const removeTransport = (id) => set("transports", form.transports.filter((t) => t.id !== id));
  const updateTransport = (id, k, v) => set("transports", form.transports.map((t) => t.id === id ? { ...t, [k]: v } : t));

  // Itinerary
  const addItinerary = () => set("itineraries", [...form.itineraries, EMPTY_ITINERARY()]);
  const removeItinerary = (id) => set("itineraries", form.itineraries.filter((i) => i.id !== id));
  const updateItinerary = (id, k, v) => set("itineraries", form.itineraries.map((i) => i.id === id ? { ...i, [k]: v } : i));

  // Save
  const saveVoucher = () => {
    setSaving(true);
    const vouchers = JSON.parse(localStorage.getItem("tw_vouchers") || "[]");
    const voucherId = editId || ("twv_" + Date.now());
    const payload = { ...form, id: voucherId, createdAt: editId ? (form.createdAt || new Date().toISOString()) : new Date().toISOString() };
    const idx = vouchers.findIndex((v) => v.id === voucherId);
    if (idx >= 0) vouchers[idx] = payload;
    else vouchers.unshift(payload);
    localStorage.setItem("tw_vouchers", JSON.stringify(vouchers));
    setForm(payload);
    setTimeout(() => { setSaving(false); setSaved(true); }, 500);
    return payload;
  };

  // PDF generation
  async function generatePDF() {
    setPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const wrapEl   = document.getElementById("voucher-pdf-target");
      const footerEl = document.getElementById("voucher-pdf-footer");
      if (!wrapEl || !footerEl) return null;
      const SCALE = 2;
      const patchClone = (clonedDoc) => {
        const s = clonedDoc.createElement("style");
        s.textContent = "* { font-family: Arial, Helvetica, sans-serif !important; letter-spacing: 0.01px !important; word-spacing: 0.1px !important; }";
        clonedDoc.head.appendChild(s);
      };
      const footerCanvas = await html2canvas(footerEl, {
        scale: SCALE, useCORS: true, backgroundColor: "#fff5f5",
        logging: false, onclone: patchClone,
      });
      const prevDisplay = footerEl.style.display;
      footerEl.style.display = "none";
      const mainCanvas = await html2canvas(wrapEl, {
        scale: SCALE, useCORS: true, backgroundColor: "#fff", logging: false,
        height: wrapEl.scrollHeight, windowHeight: wrapEl.scrollHeight,
        onclone: patchClone,
      });
      footerEl.style.display = prevDisplay;
      const pdf   = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const pxPerMm  = mainCanvas.width / pageW;
      const pagePx   = pageH * pxPerMm;
      const totalPx  = mainCanvas.height;
      const domToCvs = mainCanvas.width / wrapEl.offsetWidth;

      // Collect every safe cut position: the top AND bottom of each marked section.
      // We snap page breaks to the nearest safe boundary just before the ideal cut —
      // this avoids cutting inside cards without creating large blank spaces.
      const wrapRect = wrapEl.getBoundingClientRect();
      const boundarySet = new Set([0]);
      for (const el of wrapEl.querySelectorAll("[data-pdf-section]")) {
        const r = el.getBoundingClientRect();
        const top    = Math.round((r.top    - wrapRect.top) * domToCvs);
        const bottom = Math.round((r.bottom - wrapRect.top) * domToCvs);
        if (top    > 0 && top    < totalPx) boundarySet.add(top);
        if (bottom > 0 && bottom < totalPx) boundarySet.add(bottom);
      }
      const boundaries = Array.from(boundarySet).sort((a, b) => a - b);

      // A page must contain at least MIN_FILL pixels of content.
      const MIN_FILL = pagePx * 0.20;

      const pageCuts = [0];
      while (true) {
        const lastCut  = pageCuts[pageCuts.length - 1];
        const idealCut = lastCut + pagePx;
        if (idealCut >= totalPx) break;

        // Walk boundaries from largest to smallest, pick the first one that is
        // ≤ idealCut and leaves at least MIN_FILL content on the current page.
        let chosenCut = idealCut; // fallback: cut at ideal position (may bisect content)
        for (let i = boundaries.length - 1; i >= 0; i--) {
          const b = boundaries[i];
          if (b <= lastCut + MIN_FILL) break; // page would be too short — give up
          if (b <= idealCut) { chosenCut = b; break; }
        }

        pageCuts.push(chosenCut);
      }
      pageCuts.push(totalPx);

      // Merge a very thin last slice into the previous page.
      while (pageCuts.length > 2) {
        const lastSlice = pageCuts[pageCuts.length - 1] - pageCuts[pageCuts.length - 2];
        if (lastSlice >= pagePx * 0.15) break;
        const prevSlice = pageCuts[pageCuts.length - 2] - pageCuts[pageCuts.length - 3];
        if (prevSlice + lastSlice > pagePx * 1.1) break;
        pageCuts.splice(pageCuts.length - 2, 1);
      }

      const footerImgH = (footerCanvas.height / footerCanvas.width) * pageW;
      for (let i = 0; i < pageCuts.length - 1; i++) {
        if (i > 0) pdf.addPage();
        const sliceTopPx  = pageCuts[i];
        const sliceTallPx = pageCuts[i + 1] - sliceTopPx;
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width  = mainCanvas.width;
        sliceCanvas.height = sliceTallPx;
        sliceCanvas.getContext("2d").drawImage(mainCanvas, 0, sliceTopPx, mainCanvas.width, sliceTallPx, 0, 0, mainCanvas.width, sliceTallPx);
        pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", 0, 0, pageW, sliceTallPx / pxPerMm);
      }

      // Footer pinned to absolute bottom of the last page.
      const lastSlicePx  = pageCuts[pageCuts.length - 1] - pageCuts[pageCuts.length - 2];
      const contentEndMm = lastSlicePx / pxPerMm;
      const remainMm     = pageH - contentEndMm;
      if (remainMm < footerImgH + 5) pdf.addPage();
      pdf.addImage(footerCanvas.toDataURL("image/png"), "PNG", 0, pageH - footerImgH, pageW, footerImgH);
      return pdf;
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleDownload() {
    saveVoucher();
    const pdf = await generatePDF();
    if (pdf) pdf.save(`voucher-${form.voucherNo || form.tripId || Date.now()}.pdf`);
  }
  async function handlePrint() {
    saveVoucher();
    const pdf = await generatePDF();
    if (!pdf) return;
    const url = URL.createObjectURL(pdf.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  }
  async function handleWhatsApp() {
    await handleDownload(); // handleDownload already calls saveVoucher
    const msg = encodeURIComponent(
      `Hello ${form.name || ""},\n\nYour travel voucher is ready! ✈️\n\nVoucher No: ${form.voucherNo || "—"}\nTrip ID: ${form.tripId || "—"}\nDestination: ${form.destination || "—"}\nTravel Date: ${form.travelDate || "—"}\n\nPlease find the attached PDF voucher.\nContact us at sales1@tourwatchout.com for any query.\n\n— Team TourWatchOut`
    );
    window.open(`https://web.whatsapp.com/send?text=${msg}`, "_blank");
  }
  async function handleSendEmail() {
    if (!emailTo.trim()) return;
    saveVoucher();
    setEmailSending(true); setEmailError("");
    try {
      const pdf = await generatePDF();
      if (!pdf) throw new Error("PDF generation failed");
      const pdfBase64 = pdf.output("datauristring").split(",")[1];
      const fileName = `voucher-${form.voucherNo || form.tripId || "tw"}.pdf`;
      const emailBody = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#e84949;padding:20px;text-align:center"><h2 style="color:#fff;margin:0">TourWatchOut — Travel Voucher</h2></div><div style="padding:24px;background:#fff;border:1px solid #eee"><p>Dear <strong>${form.name || "Guest"}</strong>,</p><p>Your travel voucher is ready. Please find the PDF attached to this email.</p><table style="width:100%;border-collapse:collapse;margin:16px 0"><tr><td style="padding:8px;font-weight:bold;color:#555;width:140px">Voucher No.</td><td style="padding:8px;color:#222">${form.voucherNo || "—"}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Trip ID</td><td style="padding:8px;color:#222">${form.tripId || "—"}</td></tr><tr><td style="padding:8px;font-weight:bold;color:#555">Destination</td><td style="padding:8px;color:#222">${form.destination || "—"}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Travel Date</td><td style="padding:8px;color:#222">${form.travelDate || "—"}</td></tr><tr><td style="padding:8px;font-weight:bold;color:#555">Pax</td><td style="padding:8px;color:#222">${form.pax || "—"}</td></tr></table><p style="font-size:13px;color:#888">For any queries, contact us at <a href="mailto:sales1@tourwatchout.com">sales1@tourwatchout.com</a></p></div><div style="background:#fff5f5;padding:12px;text-align:center;font-size:12px;color:#888;border-top:2px solid #e84949">Team TourWatchOut &nbsp;|&nbsp; sales1@tourwatchout.com</div></div>`;
      const res = await fetch("/api/dashboard/send-voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo, subject: `Travel Voucher — ${form.destination || "TourWatchOut"} (${form.voucherNo || form.tripId})`, html: emailBody, pdfBase64, fileName }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "Email sending failed"); }
      setEmailDone(true);
      setTimeout(() => { setShowEmailModal(false); setEmailDone(false); setEmailTo(""); }, 2500);
    } catch (e) {
      setEmailError(e.message || "Something went wrong.");
    } finally {
      setEmailSending(false);
    }
  }
  function handlePreview() { saveVoucher(); setShowPreview(true); }

  if (!ready) return null;

  return (
    <>
      <Head>
        <title>{editId ? "Edit" : "New"} Voucher — TourWatchOut</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>
      <div className="bk-page">
        <Sidebar active="Voucher" isOpen={sidebar} onClose={() => setSidebar(false)} />

        <main className="bk-main">
          <header className="bk-header">
            <div className="bk-header-left">
              <button className="bk-hamburger" onClick={() => setSidebar(true)}><MdMenu size={22} /></button>
              <h1 className="bk-page-title">{editId ? "Edit Voucher" : "Create Voucher"}</h1>
            </div>
            <div className="bk-header-right">
              {saved && <span style={s.savedTag}>✓ Saved</span>}
              <button onClick={saveVoucher} disabled={saving} style={{ ...s.previewBtn, background: "#2563eb", color: "#fff", marginRight: 8 }}>
                <MdSave size={16} /> {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={handlePreview} style={s.previewBtn}>
                <MdVisibility size={16} /> Preview & Export
              </button>
            </div>
          </header>

          <div style={{ padding: "28px 36px 60px" }}>

            {/* ── Voucher Info ── */}
            <FormSection id="section-voucher" title="Voucher Information" icon={<MdPerson />}>
              <TwoCol>
                <Field label="Voucher No." value={form.voucherNo} onChange={(v) => set("voucherNo", v)} placeholder="e.g. RCSPL/2024-25/001" />
                <Field label="Trip ID" value={form.tripId} onChange={(v) => set("tripId", v)} placeholder="e.g. TRIP/2024-25/Dy001" />
              </TwoCol>
              <div style={s.divider} />
              <div style={s.subHeading}>Guest Details</div>
              <TwoCol>
                <Field label="Guest Name" value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Shilpa Singh" />
                <Field label="Pax (Adults + Kids)" value={form.pax} onChange={(v) => set("pax", v)} placeholder="e.g. 2 Adults, 1 kid" />
              </TwoCol>

              {/* Travel Date — two date pickers */}
              <TwoCol>
                <DateField
                  label="Travel From"
                  value={form.travelDateFrom}
                  onChange={(v) => setMulti({ travelDateFrom: v, travelDate: buildTravelDate(v, form.travelDateTo) })}
                  fmt="short"
                />
                <DateField
                  label="Travel To"
                  value={form.travelDateTo}
                  onChange={(v) => setMulti({ travelDateTo: v, travelDate: buildTravelDate(form.travelDateFrom, v) })}
                  fmt="short"
                />
              </TwoCol>
              {form.travelDate && (
                <div style={{ fontSize: 12.5, color: "#4b5563", marginTop: -6, padding: "6px 12px", background: "#f0f9ff", borderRadius: 6, border: "1px solid #bae6fd" }}>
                  Travel Period: <strong>{form.travelDate}</strong>
                </div>
              )}

              <TwoCol>
                <Field label="Destination" value={form.destination} onChange={(v) => set("destination", v)} placeholder="e.g. Dubai" icon={<MdLocationOn />} />
                <Field label="Guest Email" value={form.email} onChange={(v) => set("email", v)} placeholder="guest@email.com" type="email" />
              </TwoCol>
              <TwoCol>
                <Field label="Contact No." value={form.contactNo} onChange={(v) => set("contactNo", v)} placeholder="e.g. +91 98765 43210" />
                <Field label="Guest Address" value={form.address} onChange={(v) => set("address", v)} placeholder="Full guest address" />
              </TwoCol>
            </FormSection>

            {/* ── Hotel ── */}
            <ToggleSection
              id="section-hotel"
              title="Hotel Details"
              icon={<MdHotel />}
              enabled={form.showHotel !== false}
              onToggle={() => {
                const next = form.showHotel === false ? true : false;
                set("showHotel", next);
                if (next && (form.hotels || []).length === 0) addHotel();
              }}
            >
              {(form.hotels || []).map((h, idx) => (
                <div key={h.id} style={s.card}>
                  <div style={s.cardHead}>
                    <span style={s.cardBadge}>🏨 Hotel {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeHotel(h.id)}>
                      <MdDelete size={14} /> Remove
                    </button>
                  </div>
                  <TwoCol>
                    <Field label="Hotel Name" value={h.hotelName} onChange={(v) => updateHotel(h.id, "hotelName", v)} placeholder="e.g. Wescott Hotel" />
                    <Field label="Place" value={h.place || ""} onChange={(v) => updateHotel(h.id, "place", v)} placeholder="e.g. Dubai Marina" />
                  </TwoCol>
                  <TwoCol>
                    <Field label="Hotel Address / Location" value={h.hotelAddress} onChange={(v) => updateHotel(h.id, "hotelAddress", v)} placeholder="Hotel city / full address" />
                    <Field label="Confirmation No." value={h.hotelConfirmNo} onChange={(v) => updateHotel(h.id, "hotelConfirmNo", v)} placeholder="e.g. 27685" />
                  </TwoCol>
                  <TwoCol>
                    <Field label="Units / Rooms" value={h.units} onChange={(v) => updateHotel(h.id, "units", v)} placeholder="e.g. 1" />
                    <Field label="Room Type" value={h.roomType} onChange={(v) => updateHotel(h.id, "roomType", v)} placeholder="e.g. Deluxe Room With Bath Tub" />
                  </TwoCol>
                  <SelectField label="Meal Plan" value={h.mealPlan} onChange={(v) => updateHotel(h.id, "mealPlan", v)} options={MEAL_PLAN_OPTIONS} allowEmpty />
                  <div style={s.divider} />
                  <div style={s.subHeading}>Check-in / Check-out</div>
                  <TwoCol>
                    <DateField label="Check-in Date" value={h.checkinDate} onChange={(v) => updateHotel(h.id, "checkinDate", v)} />
                    <Field label="Check-in Time" value={h.checkinTime} onChange={(v) => updateHotel(h.id, "checkinTime", v)} placeholder="2:00 PM" />
                  </TwoCol>
                  <TwoCol>
                    <DateField label="Check-out Date" value={h.checkoutDate} onChange={(v) => updateHotel(h.id, "checkoutDate", v)} />
                    <Field label="Check-out Time" value={h.checkoutTime} onChange={(v) => updateHotel(h.id, "checkoutTime", v)} placeholder="10:00 AM" />
                  </TwoCol>
                  <SelectField label="No. of Nights" value={h.nights} onChange={(v) => updateHotel(h.id, "nights", v)} options={NIGHTS_OPTIONS} allowEmpty />
                </div>
              ))}

              {/* Single global Hotel Note */}
              <div style={s.divider} />
              <div style={s.subHeading}>Hotel Note <span style={{ fontSize: 11, fontWeight: 400, color: "#aaa" }}>(shown once in voucher)</span></div>
              <div style={s.notePreviewBox}>
                <div style={s.notePreviewDashed}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>Preview</div>
                  <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.6 }}>
                    {(form.hotelNote || "").split("\n")[0]}
                  </div>
                </div>
              </div>
              <Field
                label=""
                value={form.hotelNote || ""}
                onChange={(v) => set("hotelNote", v)}
                textarea rows={6}
                placeholder="Hotel note / check-in instructions…"
                full
              />

              <AddBtn onClick={addHotel} label="Add Hotel" icon={<MdHotel size={15} />} />
            </ToggleSection>

            {/* ── Flights ── */}
            <ToggleSection
              id="section-flights"
              title="Flight Details"
              icon={<MdFlight />}
              enabled={form.showFlights}
              onToggle={() => {
                const next = !form.showFlights;
                set("showFlights", next);
                if (next && form.flights.length === 0) addFlight();
              }}
            >
              {form.flights.map((fl, idx) => (
                <div key={fl.id} style={s.card}>
                  <div style={s.cardHead}>
                    <span style={s.cardBadge}>✈ Flight {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeFlight(fl.id)}>
                      <MdDelete size={14} /> Remove
                    </button>
                  </div>
                  <TwoCol>
                    <Field label="PNR" value={fl.pnr} onChange={(v) => updateFlight(fl.id, "pnr", v)} placeholder="e.g. B8F6Y1 V30" />
                    <Field label="Flight No." value={fl.flight_no} onChange={(v) => updateFlight(fl.id, "flight_no", v)} placeholder="e.g. SG 51" />
                  </TwoCol>
                  <div style={s.flightGrid}>
                    <div style={s.flightHalf}>
                      <div style={s.flightHalfTitle}>🛫 DEPARTURE</div>
                      <Field label="City" value={fl.from_city} onChange={(v) => updateFlight(fl.id, "from_city", v)} placeholder="e.g. Pune" />
                      <Field label="IATA Code" value={fl.from_code} onChange={(v) => updateFlight(fl.id, "from_code", v)} placeholder="PNQ" />
                      <TwoCol>
                        <DateField label="Date" value={fl.from_date} onChange={(v) => updateFlight(fl.id, "from_date", v)} fmt="flight" />
                        <Field label="Time" value={fl.from_time} onChange={(v) => updateFlight(fl.id, "from_time", v)} placeholder="12:00 hrs" />
                      </TwoCol>
                    </div>
                    <div style={s.flightHalf}>
                      <div style={s.flightHalfTitle}>🛬 ARRIVAL</div>
                      <Field label="City" value={fl.to_city} onChange={(v) => updateFlight(fl.id, "to_city", v)} placeholder="e.g. Dubai" />
                      <Field label="IATA Code" value={fl.to_code} onChange={(v) => updateFlight(fl.id, "to_code", v)} placeholder="DXB" />
                      <TwoCol>
                        <DateField label="Date" value={fl.to_date} onChange={(v) => updateFlight(fl.id, "to_date", v)} fmt="flight" />
                        <Field label="Time" value={fl.to_time} onChange={(v) => updateFlight(fl.id, "to_time", v)} placeholder="22:55 hrs" />
                      </TwoCol>
                    </div>
                  </div>
                </div>
              ))}
              <AddBtn onClick={addFlight} label="Add Flight Leg" icon={<MdFlight size={15} />} />
            </ToggleSection>

            {/* ── Transport ── */}
            <ToggleSection
              id="section-transport"
              title="Transportation Details"
              icon={<MdDirectionsCar />}
              enabled={form.showTransport}
              onToggle={() => {
                const next = !form.showTransport;
                set("showTransport", next);
                if (next && form.transports.length === 0) addTransport();
              }}
            >
              {form.transports.map((t, idx) => (
                <div key={t.id} style={s.card}>
                  <div style={s.cardHead}>
                    <span style={s.cardBadge}>🚗 Vehicle {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeTransport(t.id)}>
                      <MdDelete size={14} /> Remove
                    </button>
                  </div>
                  <TwoCol>
                    <Field label="Vehicle Type" value={t.vehicle_type} onChange={(v) => updateTransport(t.id, "vehicle_type", v)} placeholder="e.g. Sedan" />
                    <Field label="Driver Name" value={t.driver_name} onChange={(v) => updateTransport(t.id, "driver_name", v)} placeholder="e.g. Shivam Singh" />
                  </TwoCol>
                  <Field label="Driver Contact" value={t.driver_contact} onChange={(v) => updateTransport(t.id, "driver_contact", v)} placeholder="e.g. +971 4 329 3200" />
                </div>
              ))}
              <AddBtn onClick={addTransport} label="Add Vehicle" icon={<MdDirectionsCar size={15} />} />
            </ToggleSection>

            {/* ── Day-wise Itinerary ── */}
            <ToggleSection
              id="section-itinerary"
              title="Day-wise Itinerary"
              icon={<MdCalendarToday />}
              enabled={form.showItinerary}
              onToggle={() => {
                const next = !form.showItinerary;
                set("showItinerary", next);
                if (next && form.itineraries.length === 0) addItinerary();
              }}
            >
              {form.itineraries.map((item, idx) => (
                <div key={`${item.id}-${formKey}`} style={s.card}>
                  <div style={s.cardHead}>
                    <span style={s.cardBadge}>📅 Day {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeItinerary(item.id)}>
                      <MdDelete size={14} /> Remove
                    </button>
                  </div>
                  <TwoCol>
                    <DateField label="Date" value={item.date} onChange={(v) => updateItinerary(item.id, "date", v)} />
                    <Field label="Itinerary Title" value={item.title || ""} onChange={(v) => updateItinerary(item.id, "title", v)} placeholder="e.g. Arrival & City Tour" />
                  </TwoCol>
                  <TwoCol>
                    <Field label="Tour / Activity" value={item.tour} onChange={(v) => updateItinerary(item.id, "tour", v)} placeholder="e.g. Airport Pick-up DX" />
                    <Field label="Transfer Type" value={item.transfer} onChange={(v) => updateItinerary(item.id, "transfer", v)} placeholder="e.g. PVT / NA" />
                  </TwoCol>
                  <Field label="Pick-up Time" value={item.pickup_time} onChange={(v) => updateItinerary(item.id, "pickup_time", v)} placeholder="e.g. 1:30 AM" />
                  <div>
                    <label style={s.label}>Itinerary Details</label>
                    <RichTextEditor
                      value={toRichText(item.itinerary)}
                      onChange={(v) => updateItinerary(item.id, "itinerary", v)}
                      placeholder="Describe what happens this day…"
                    />
                  </div>
                </div>
              ))}
              <AddBtn onClick={addItinerary} label="Add Day" icon={<MdCalendarToday size={15} />} />
            </ToggleSection>

            {/* ── Inclusions ── */}
            <FormSection id="section-inclusions" title="Inclusions" icon={<MdCheckCircle />}>
              <RichTextEditor
                key={`inc-${formKey}`}
                value={toRichText(form.inclusions || "")}
                onChange={(v) => set("inclusions", v)}
                placeholder="List what's included in the package…"
              />
            </FormSection>

            {/* ── Exclusions ── */}
            <FormSection id="section-exclusions" title="Exclusions" icon={<MdClose />}>
              <RichTextEditor
                key={`exc-${formKey}`}
                value={toRichText(form.exclusions || "")}
                onChange={(v) => set("exclusions", v)}
                placeholder="List what's not included in the package…"
              />
            </FormSection>

            {/* ── Extras & Notes ── */}
            <FormSection id="section-notes" title="Extras & Notes" icon={<MdInfo />}>
              <Field
                label="Value Addition"
                value={form.valueAddition || form.extras || ""}
                onChange={(v) => set("valueAddition", v)}
                placeholder="e.g. Water, Cake, GTB - N/A"
                full
              />
              <div style={s.divider} />
              <Field
                label="Special Instructions"
                value={form.specialInstructions}
                onChange={(v) => set("specialInstructions", v)}
                placeholder="Any special instructions for the guest…"
                textarea rows={4} full
              />
              <div style={s.divider} />
              <div>
                <label style={s.label}>T&amp;C</label>
                <RichTextEditor
                  key={`tc-${formKey}`}
                  value={toRichText(form.termsConditions || form.importantNotes || "")}
                  onChange={(v) => set("termsConditions", v)}
                  placeholder="Terms and conditions…"
                />
              </div>
            </FormSection>

            {/* ── Bottom action bar ── */}
            <div style={s.bottomBar}>
              <button onClick={saveVoucher} disabled={saving} style={s.btnDark}>
                <MdSave size={17} /> {saving ? "Saving…" : "Save Voucher"}
              </button>
              <button onClick={handlePreview} style={s.btnBlue}>
                <MdVisibility size={17} /> Preview & Export
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ═══════════════ PREVIEW MODAL ═══════════════ */}
      {showPreview && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setShowPreview(false)}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <span style={s.modalTitle}>Voucher Preview</span>
              <div style={s.modalActions}>
                <ActionBtn color="#25d366" icon={<FaWhatsapp size={15} />} label={pdfLoading ? "Preparing…" : "WhatsApp"} onClick={handleWhatsApp} disabled={pdfLoading} />
                <ActionBtn color="#ea4335" icon={<MdEmail size={15} />} label="Send Email" onClick={() => setShowEmailModal(true)} disabled={pdfLoading} />
                <ActionBtn color="#3b82f6" icon={<MdDownload size={15} />} label={pdfLoading ? "…" : "Download PDF"} onClick={handleDownload} disabled={pdfLoading} />
                <ActionBtn color="#7c3aed" icon={<MdPrint size={15} />} label="Print" onClick={handlePrint} disabled={pdfLoading} />
                <button onClick={() => setShowPreview(false)} style={s.closeBtn}><MdClose size={18} /></button>
              </div>
            </div>
            <div style={s.infoBar}>
              <FaWhatsapp size={13} color="#25d366" />
              <span><strong>WhatsApp:</strong> PDF downloads, then WhatsApp Web opens — select any contact to share.</span>
            </div>
            <div style={s.modalBody}>
              <div id="voucher-pdf-target" style={{ background: "#fff" }}>
                <VoucherPreview data={form} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ EMAIL MODAL ═══════════════ */}
      {showEmailModal && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setShowEmailModal(false)}>
          <div style={s.emailModal}>
            <div style={s.emailModalHead}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MdEmail size={20} color="#fff" />
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Send Voucher via Email</span>
              </div>
              <button onClick={() => setShowEmailModal(false)} style={s.closeBtn}><MdClose size={18} /></button>
            </div>
            <div style={s.emailModalBody}>
              {emailDone ? (
                <div style={s.emailSuccess}>
                  <MdCheckCircle size={48} color="#22c55e" />
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#166534", marginTop: 10 }}>Email sent successfully!</div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Voucher PDF delivered to {emailTo}</div>
                </div>
              ) : (
                <>
                  <div style={s.emailSenderRow}>
                    <span style={s.emailLabel}>From</span>
                    <span style={s.emailFrom}>accounts@tourwatchout.com</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={s.emailLabel}>To (Recipient Email)</label>
                    <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="guest@example.com" style={s.emailInput} onKeyDown={(e) => e.key === "Enter" && handleSendEmail()} />
                  </div>
                  <div style={s.emailPreviewBox}>
                    <div style={s.emailPreviewLabel}>Voucher Summary</div>
                    <div style={s.emailPreviewRow}><b>Voucher No.:</b> {form.voucherNo || "—"}</div>
                    <div style={s.emailPreviewRow}><b>Trip ID:</b> {form.tripId || "—"}</div>
                    <div style={s.emailPreviewRow}><b>Guest:</b> {form.name || "—"}</div>
                    <div style={s.emailPreviewRow}><b>Destination:</b> {form.destination || "—"}</div>
                    <div style={s.emailPreviewRow}><b>Travel Date:</b> {form.travelDate || "—"}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>📎 The voucher PDF will be auto-generated and attached to this email.</div>
                  {emailError && <div style={s.emailError}>{emailError}</div>}
                  <button onClick={handleSendEmail} disabled={emailSending || !emailTo.trim()} style={{ ...s.emailSendBtn, opacity: (emailSending || !emailTo.trim()) ? 0.6 : 1 }}>
                    <MdSend size={16} />
                    {emailSending ? "Sending…" : "Send Email with PDF"}
                  </button>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 10, textAlign: "center" }}>
                    Configure SMTP in <code>.env.local</code>: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Form building blocks ─────────────────────────────────────────────────────

function FormSection({ id, title, icon, children }) {
  return (
    <div id={id} data-pdf-section="true" style={s.section}>
      <div style={s.sectionHead}>
        <span style={s.sectionIcon}>{icon}</span>
        <span style={s.sectionTitle}>{title}</span>
      </div>
      <div style={s.sectionBody}>{children}</div>
    </div>
  );
}

function ToggleSection({ id, title, icon, enabled, onToggle, children }) {
  return (
    <div id={id} data-pdf-section="true" style={s.section}>
      <div style={s.sectionHead}>
        <span style={s.sectionIcon}>{icon}</span>
        <span style={s.sectionTitle}>{title}</span>
        <button
          onClick={onToggle}
          style={{ ...s.toggleBtn, background: enabled ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)", color: "#fff" }}
        >
          {enabled ? "− Remove Section" : "+ Add Section"}
        </button>
      </div>
      {enabled && <div style={s.sectionBody}>{children}</div>}
      {!enabled && <div style={s.disabledHint}>This section is not included in the voucher. Click "+ Add Section" to enable it.</div>}
    </div>
  );
}

function TwoCol({ children }) {
  return <div style={s.twoCol}>{children}</div>;
}

function Field({ label, value, onChange, placeholder, type = "text", textarea, full, rows = 3, icon }) {
  return (
    <div style={{ flex: full ? "1 1 100%" : "1 1 0", minWidth: 0 }}>
      {label && <label style={s.label}>{label}</label>}
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          style={{ ...s.input, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
      ) : (
        <div style={{ position: "relative" }}>
          {icon && <span style={s.inputIcon}>{icon}</span>}
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            style={{ ...s.input, paddingLeft: icon ? 34 : 12 }} />
        </div>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, allowEmpty = false, full = false }) {
  return (
    <div style={{ flex: full ? "1 1 100%" : "1 1 0", minWidth: 0 }}>
      {label && <label style={s.label}>{label}</label>}
      <select value={value || ""} onChange={(e) => onChange(e.target.value)} style={{ ...s.input, cursor: "pointer" }}>
        {(allowEmpty || !value) && <option value="">— Select —</option>}
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function DateField({ label, value, onChange, fmt = "long" }) {
  return (
    <div style={{ flex: "1 1 0", minWidth: 0 }}>
      {label && <label style={s.label}>{label}</label>}
      <input
        type="date"
        value={toISO(value)}
        onChange={(e) => onChange(fromISO(e.target.value, fmt))}
        style={{ ...s.input, colorScheme: "light" }}
      />
    </div>
  );
}

function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = value || "";
    }
  }, []); // Only on mount — key prop on parent forces remount when needed

  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
    if (ref.current) onChange(ref.current.innerHTML);
    ref.current?.focus();
  };

  const textContent = value ? value.replace(/<[^>]*>/g, "").trim() : "";
  const isEmpty = textContent === "";

  return (
    <div style={s.richEditor}>
      <div style={s.richToolbar}>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} style={s.richBtn} title="Bold"><b>B</b></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} style={s.richBtn} title="Italic"><i>I</i></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} style={s.richBtn} title="Bullet List">• List</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} style={s.richBtn} title="Numbered List">1. List</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }} style={{ ...s.richBtn, color: "#e84949" }} title="Clear formatting">Clear</button>
      </div>
      <div style={{ position: "relative" }}>
        {isEmpty && <div style={s.richPlaceholder}>{placeholder || "Type here…"}</div>}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
          style={s.richContent}
        />
      </div>
    </div>
  );
}

function AddBtn({ onClick, label, icon }) {
  return (
    <button onClick={onClick} style={s.addBtn}>{icon} {label}</button>
  );
}

function ActionBtn({ color, icon, label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#888" : color, color: "#fff", border: "none", borderRadius: 7,
      padding: "9px 14px", fontSize: 13, fontWeight: 600,
      cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5,
    }}>
      {icon} {label}
    </button>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  savedTag: { background: "#dcfce7", color: "#15803d", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600 },
  previewBtn: {
    background: "rgb(37 99 235 / 12%)", color: "rgb(37 99 235)", border: "none", borderRadius: 8,
    padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 6,
  },
  section: {
    background: "#fff", borderRadius: 12, overflow: "hidden",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 20,
    border: "1px solid #e8eaf0",
  },
  sectionHead: { background: "#2563eb", display: "flex", alignItems: "center", gap: 10, padding: "13px 20px" },
  sectionIcon: { color: "#fff", display: "flex", alignItems: "center", fontSize: 18 },
  sectionTitle: { color: "#fff", fontWeight: 700, fontSize: 14.5, flex: 1, letterSpacing: 0.2 },
  sectionBody: { padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 },
  disabledHint: { padding: "14px 22px", fontSize: 13, color: "#9ca3af", fontStyle: "italic" },
  toggleBtn: { border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  twoCol: { display: "flex", gap: 14 },
  label: { display: "block", fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 },
  input: {
    width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
    padding: "10px 12px", fontSize: 14, outline: "none",
    boxSizing: "border-box", background: "#f9fafb", color: "#111",
    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.15s",
  },
  inputIcon: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" },
  divider: { height: 1, background: "#f0f0f0", margin: "2px 0" },
  subHeading: { fontSize: 12.5, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.8 },
  card: {
    background: "#f8f9fc", border: "1.5px solid #e5e7eb",
    borderRadius: 10, padding: "16px", display: "flex",
    flexDirection: "column", gap: 12, marginBottom: 12,
  },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardBadge: { fontSize: 13, fontWeight: 700, color: "#374151" },
  removeBtn: {
    display: "flex", alignItems: "center", gap: 4,
    background: "#fff2f2", color: "#e84949", border: "none",
    borderRadius: 6, padding: "5px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  flightGrid: { display: "flex", gap: 12 },
  flightHalf: { flex: 1, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "14px", display: "flex", flexDirection: "column", gap: 10 },
  flightHalfTitle: { fontSize: 11, fontWeight: 800, color: "#e84949", letterSpacing: 1, marginBottom: 4 },
  addBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    background: "#eff6ff", color: "#2563eb", border: "1.5px dashed #93c5fd",
    borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", width: "100%",
  },
  notePreviewBox: { marginBottom: 4 },
  notePreviewDashed: { border: "1.5px dashed #93c5fd", borderRadius: 8, padding: "10px 14px", background: "#f0f9ff" },
  bottomBar: { display: "flex", gap: 12, paddingTop: 10, paddingBottom: 20 },
  btnDark: {
    background: "#2563eb", color: "#fff", border: "none", borderRadius: 8,
    padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 7,
  },
  btnBlue: {
    background: "rgb(37 99 235 / 12%)", color: "rgb(37 99 235)", border: "none", borderRadius: 8,
    padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 7,
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
    zIndex: 1000, display: "flex", alignItems: "flex-start",
    justifyContent: "center", overflowY: "auto", padding: "20px",
  },
  modal: { background: "#f0f2f7", borderRadius: 16, width: "100%", maxWidth: 840, margin: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.4)", overflow: "hidden" },
  modalHead: { background: "#1a1a2e", padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 },
  modalTitle: { color: "#fff", fontSize: 16, fontWeight: 700 },
  modalActions: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  closeBtn: { background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 7, color: "#fff", padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center" },
  infoBar: { background: "#f0fdf4", padding: "10px 22px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#166534", borderBottom: "1px solid #dcfce7" },
  modalBody: { padding: "24px", overflowY: "auto", maxHeight: "82vh" },
  emailModal: { background: "#fff", borderRadius: 14, width: "100%", maxWidth: 460, margin: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", overflow: "hidden" },
  emailModalHead: { background: "#ea4335", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  emailModalBody: { padding: "24px" },
  emailSenderRow: { display: "flex", alignItems: "center", gap: 8, background: "#f5f5f5", borderRadius: 7, padding: "9px 12px", marginBottom: 16 },
  emailLabel: { fontSize: 11.5, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 },
  emailFrom: { fontSize: 13, color: "#333", fontWeight: 600 },
  emailInput: { width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "11px 13px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  emailPreviewBox: { background: "#f9f9f9", border: "1px solid #eee", borderRadius: 8, padding: "12px 14px", marginBottom: 16 },
  emailPreviewLabel: { fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  emailPreviewRow: { fontSize: 13, color: "#444", marginBottom: 4 },
  emailSendBtn: { background: "#ea4335", color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 },
  emailError: { background: "#fff2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 7, padding: "10px 13px", fontSize: 13, marginBottom: 12 },
  emailSuccess: { textAlign: "center", padding: "24px 0" },

  // Rich text editor
  richEditor: { border: "1.5px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#f9fafb" },
  richToolbar: { display: "flex", gap: 4, padding: "6px 10px", background: "#f0f4ff", borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" },
  richBtn: { background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, padding: "3px 9px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#374151" },
  richContent: { minHeight: 100, padding: "10px 12px", fontSize: 14, color: "#111", outline: "none", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" },
  richPlaceholder: { position: "absolute", top: 10, left: 12, fontSize: 14, color: "#9ca3af", pointerEvents: "none", userSelect: "none" },
};
