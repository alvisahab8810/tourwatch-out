import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdHotel, MdFlight, MdDirectionsCar, MdCalendarToday,
  MdPerson, MdLocationOn, MdSave, MdVisibility, MdAdd,
  MdDelete, MdHome, MdClose, MdDownload, MdPrint,
  MdInfo, MdEmail, MdSend, MdCheckCircle,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { isAuthenticated } from "../../utils/voucherAuth";
import VoucherPreview from "../../components/voucher/VoucherPreview";

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
  // count vouchers created this month that already have a number with this prefix
  const count = allVouchers.filter((v) => v.voucherNo?.startsWith(prefix)).length;
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}
function buildTripId(allVouchers) {
  const fy = getFinancialYear(), mm = getMonthPad();
  const prefix = `TWO/${fy}/${mm}/`;
  // Trip IDs are cumulative for the financial year; the series starts at 27
  // (26 pre-existing trips outside this system)
  const yearCount = allVouchers.filter((v) => v.tripId?.startsWith(`TWO/${fy}/`)).length;
  return `${prefix}${String(26 + yearCount + 1).padStart(3, "0")}`;
}

// ─── Factories ──────────────────────────────────────────────────────────────
const uid = () => Date.now() + Math.random();
const EMPTY_FLIGHT = () => ({
  id: uid(), pnr: "", flight_no: "",
  from_city: "", from_code: "", from_date: "", from_time: "",
  to_city: "", to_code: "", to_date: "", to_time: "",
});
const EMPTY_TRANSPORT = () => ({ id: uid(), vehicle_type: "", driver_name: "", driver_contact: "" });
const EMPTY_ITINERARY = () => ({ id: uid(), date: "", tour: "", transfer: "", pickup_time: "", itinerary: "" });

const DEFAULT_HOTEL_NOTE = `Kindly note, early check-in is subject to availability of the rooms or hotel may charge directly to the guest.
• For early check-in, extra bed and airport pickups contact the hotel directly.
• Passport, Driving License and Aadhaar are accepted as ID proof(s). Local ids are allowed.
• Please ask the property for the GST invoice at the time of check-in and collect it at the time of check-out (valid only for properties in India).`;

const DEFAULT_IMPORTANT_NOTES = `As per the Dubai Executive Council Resolution No. (2) of 2014, a "Tourism Dirham(TD)" charge of AED 10 to AED 20 per room per night (depending on the Hotel Classification category) will apply for hotel rooms and Suites. For Apartment rooms, charges are AED 10 or AED 20 per bedroom per apartment per night.

We request to the guest that at the time of arrival in UAE, kindly purchase a local SIM, so we can communicate easily. Pick-up & drop timings are only indicative & might change, exact timings will be informed by the operations team when the customer is here.

It is advisable for customers to contact our local Dubai office and inform their hotel room numbers/local contact number once they check-in.

In case any tour is cancelled, due to bad weather or any unavoidable circumstances, we shall inform you prior and the same shall be organized some other day or refund the amount for same.`;

const DEFAULT_FORM = {
  voucherNo: "", tripId: "",
  name: "", pax: "", travelDate: "", destination: "",
  email: "", contactNo: "", address: "",
  hotelName: "", hotelAddress: "", hotelConfirmNo: "", units: "",
  roomType: "", mealPlan: "",
  checkinDate: "", checkinTime: "", checkoutDate: "", checkoutTime: "", nights: "",
  hotelNote: DEFAULT_HOTEL_NOTE,
  showFlights: false, flights: [],
  showTransport: false, transports: [],
  showItinerary: false, itineraries: [],
  extras: "Water, Cake, GTB - N/A",
  specialInstructions: "",
  importantNotes: DEFAULT_IMPORTANT_NOTES,
};

export default function CreateVoucher() {
  const router = useRouter();
  const { id: editId } = router.query;
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("voucher");
  // Email modal state
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
      if (found) { setForm(found); setReady(true); return; }
    }
    // New voucher — auto-generate IDs
    setForm((f) => ({
      ...f,
      voucherNo: buildVoucherNo(vouchers),
      tripId: buildTripId(vouchers),
    }));
    setReady(true);
  }, [editId]);

  const set = (key, val) => { setForm((f) => ({ ...f, [key]: val })); setSaved(false); };

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

  // PDF generation — smart page breaks (never cuts through a section header)
  async function generatePDF() {
    setPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      const wrapEl   = document.getElementById("voucher-pdf-target");
      const footerEl = document.getElementById("voucher-pdf-footer");
      if (!wrapEl || !footerEl) return null;

      const SCALE = 2;

      // ── 1. Measure section boundaries BEFORE hiding anything ─────────────
      // Each [data-pdf-section] marks a red header + body block.
      // We use these to avoid cutting through them during page breaks.
      const wrapRect    = wrapEl.getBoundingClientRect();
      const sectionEls  = wrapEl.querySelectorAll("[data-pdf-section]");
      const sectionBounds = Array.from(sectionEls).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          top: r.top - wrapRect.top,       // px from top of wrap
          bottom: r.bottom - wrapRect.top,
        };
      });

      // ── 2. Capture footer separately ──────────────────────────────────────
      const footerCanvas = await html2canvas(footerEl, {
        scale: SCALE, useCORS: true, backgroundColor: "#fff5f5", logging: false,
      });

      // ── 3. Hide footer, capture main content ──────────────────────────────
      const prevDisplay  = footerEl.style.display;
      footerEl.style.display = "none";

      const mainCanvas = await html2canvas(wrapEl, {
        scale: SCALE, useCORS: true, backgroundColor: "#fff", logging: false,
        // Ensure full height is captured
        height: wrapEl.scrollHeight,
        windowHeight: wrapEl.scrollHeight,
      });

      footerEl.style.display = prevDisplay;

      // ── 4. Coordinate system ──────────────────────────────────────────────
      const pdf   = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageH = pdf.internal.pageSize.getHeight();  // 297 mm

      // Pixels-per-mm on the canvas (so we can express pageH in canvas-px)
      const pxPerMm   = mainCanvas.width / pageW;
      const pagePx    = pageH * pxPerMm;       // page height in canvas pixels
      const totalPx   = mainCanvas.height;

      // DOM-px → canvas-px conversion factor
      const domToCvs = mainCanvas.width / wrapEl.offsetWidth;

      // Pre-compute section boundaries in canvas pixels
      const sectionBoundsCvs = sectionBounds.map((s) => ({
        top: s.top * domToCvs,
        bottom: s.bottom * domToCvs,
      }));

      // ── 5. Compute smart page-cut positions ───────────────────────────────
      // Rule: a cut must NOT fall inside a section's first 60 canvas-px (header row).
      // If it would, move the cut BEFORE the section starts instead.
      const pageCuts = [0]; // start positions of each page (in canvas px)

      while (true) {
        const lastCut = pageCuts[pageCuts.length - 1];
        let nextCut   = lastCut + pagePx;

        if (nextCut >= totalPx) break; // last page — no more cuts needed

        // Check whether nextCut falls inside any section's header zone
        for (const s of sectionBoundsCvs) {
          const headerZoneEnd = s.top + 60; // 60 canvas-px = ~1 line of the red bar
          if (nextCut > s.top && nextCut < headerZoneEnd) {
            // Cut would slice through the section header — move to just before it
            nextCut = s.top;
            break;
          }
        }

        // Safety: never cut at the exact same position (infinite loop guard)
        if (nextCut <= lastCut) nextCut = lastCut + pagePx;

        pageCuts.push(nextCut);
      }
      pageCuts.push(totalPx); // sentinel: end of content

      // ── 6. Render each page slice onto the PDF ────────────────────────────
      const footerImgH = (footerCanvas.height / footerCanvas.width) * pageW;

      for (let i = 0; i < pageCuts.length - 1; i++) {
        if (i > 0) pdf.addPage();

        const sliceTopPx  = pageCuts[i];
        const sliceTallPx = pageCuts[i + 1] - sliceTopPx;

        // Draw just this slice of the main canvas
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width  = mainCanvas.width;
        sliceCanvas.height = sliceTallPx;
        sliceCanvas.getContext("2d").drawImage(
          mainCanvas,
          0, sliceTopPx,              // source x, y
          mainCanvas.width, sliceTallPx, // source w, h
          0, 0,                       // dest x, y
          mainCanvas.width, sliceTallPx  // dest w, h
        );

        const sliceMmH = (sliceTallPx / pxPerMm);
        pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", 0, 0, pageW, sliceMmH);
      }

      // ── 7. Pin footer to absolute bottom of last page ─────────────────────
      const lastSlicePx  = pageCuts[pageCuts.length - 1] - pageCuts[pageCuts.length - 2];
      const lastSliceMmH = lastSlicePx / pxPerMm;
      const remaining    = pageH - lastSliceMmH;

      if (remaining >= footerImgH) {
        // Footer fits — pin it to the absolute bottom
        pdf.addImage(
          footerCanvas.toDataURL("image/png"), "PNG",
          0, pageH - footerImgH, pageW, footerImgH
        );
      } else {
        // Footer won't fit — new page, pin to its bottom
        pdf.addPage();
        pdf.addImage(
          footerCanvas.toDataURL("image/png"), "PNG",
          0, pageH - footerImgH, pageW, footerImgH
        );
      }

      return pdf;
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleDownload() {
    const pdf = await generatePDF();
    if (pdf) pdf.save(`voucher-${form.voucherNo || form.tripId || Date.now()}.pdf`);
  }

  async function handlePrint() {
    const pdf = await generatePDF();
    if (!pdf) return;
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  }

  async function handleWhatsApp() {
    // 1. Download PDF so admin has it ready to attach
    await handleDownload();
    // 2. Open WhatsApp Web — logged-in user can pick any contact
    const msg = encodeURIComponent(
      `Hello ${form.name || ""},\n\nYour travel voucher is ready! ✈️\n\nVoucher No: ${form.voucherNo || "—"}\nTrip ID: ${form.tripId || "—"}\nDestination: ${form.destination || "—"}\nTravel Date: ${form.travelDate || "—"}\n\nPlease find the attached PDF voucher.\nContact us at sales@tourwatchout.com for any query.\n\n— Team TourWatchOut`
    );
    window.open(`https://web.whatsapp.com/send?text=${msg}`, "_blank");
  }

  async function handleSendEmail() {
    if (!emailTo.trim()) return;
    setEmailSending(true);
    setEmailError("");
    try {
      // Generate PDF as base64
      const pdf = await generatePDF();
      if (!pdf) throw new Error("PDF generation failed");
      const pdfBase64 = pdf.output("datauristring").split(",")[1];
      const fileName = `voucher-${form.voucherNo || form.tripId || "tw"}.pdf`;

      const emailBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#e84949;padding:20px;text-align:center">
    <h2 style="color:#fff;margin:0">TourWatchOut — Travel Voucher</h2>
  </div>
  <div style="padding:24px;background:#fff;border:1px solid #eee">
    <p>Dear <strong>${form.name || "Guest"}</strong>,</p>
    <p>Your travel voucher is ready. Please find the PDF attached to this email.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:8px;font-weight:bold;color:#555;width:140px">Voucher No.</td><td style="padding:8px;color:#222">${form.voucherNo || "—"}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Trip ID</td><td style="padding:8px;color:#222">${form.tripId || "—"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#555">Destination</td><td style="padding:8px;color:#222">${form.destination || "—"}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Travel Date</td><td style="padding:8px;color:#222">${form.travelDate || "—"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#555">Pax</td><td style="padding:8px;color:#222">${form.pax || "—"}</td></tr>
    </table>
    <p style="font-size:13px;color:#888">For any queries, contact us at <a href="mailto:sales@tourwatchout.com">sales@tourwatchout.com</a></p>
  </div>
  <div style="background:#fff5f5;padding:12px;text-align:center;font-size:12px;color:#888;border-top:2px solid #e84949">
    Team TourWatchOut &nbsp;|&nbsp; sales@tourwatchout.com &nbsp;|&nbsp; /Tourwatchout
  </div>
</div>`;

      const res = await fetch("/api/dashboard/send-voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          subject: `Travel Voucher — ${form.destination || "TourWatchOut"} (${form.voucherNo || form.tripId})`,
          html: emailBody,
          pdfBase64,
          fileName,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Email sending failed");
      }
      setEmailDone(true);
      setTimeout(() => { setShowEmailModal(false); setEmailDone(false); setEmailTo(""); }, 2500);
    } catch (e) {
      setEmailError(e.message || "Something went wrong. Check SMTP settings.");
    } finally {
      setEmailSending(false);
    }
  }

  function handlePreview() {
    saveVoucher();
    setShowPreview(true);
  }

  if (!ready) return null;

  const navItems = [
    { id: "voucher", icon: <MdPerson size={18} />, label: "Guest Info" },
    { id: "hotel", icon: <MdHotel size={18} />, label: "Hotel" },
    { id: "flights", icon: <MdFlight size={18} />, label: "Flights" },
    { id: "transport", icon: <MdDirectionsCar size={18} />, label: "Transport" },
    { id: "itinerary", icon: <MdCalendarToday size={18} />, label: "Itinerary" },
    { id: "notes", icon: <MdInfo size={18} />, label: "Notes" },
  ];

  return (
    <>
      <Head><title>{editId ? "Edit" : "New"} Voucher — TourWatchOut</title></Head>
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
            <div style={s.menuLabel}>SECTIONS</div>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#section-${item.id}`}
                style={{
                  ...s.menuItem,
                  ...(activeSection === item.id ? s.menuItemActive : {}),
                }}
                onClick={() => setActiveSection(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          <div style={s.sideBottom}>
            <div style={s.sideActions}>
              <button onClick={saveVoucher} disabled={saving} style={s.sideBtn}>
                <MdSave size={16} />
                {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={handlePreview} style={{ ...s.sideBtn, ...s.sideBtnRed }}>
                <MdVisibility size={16} />
                Preview
              </button>
            </div>
            {saved && <div style={s.savedPill}>✓ All changes saved</div>}
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={s.main}>
          <div style={s.topBar}>
            <div>
              <h1 style={s.pageTitle}>{editId ? "Edit Voucher" : "Create New Voucher"}</h1>
              <p style={s.pageSubtitle}>Fill in all details to generate a professional travel voucher</p>
            </div>
            <div style={s.topActions}>
              {saved && <span style={s.savedTag}>✓ Saved</span>}
              <button onClick={handlePreview} style={s.previewBtn}>
                <MdVisibility size={16} /> Preview & Export
              </button>
            </div>
          </div>

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
            <TwoCol>
              <Field label="Travel Date / Period" value={form.travelDate} onChange={(v) => set("travelDate", v)} placeholder="e.g. 25 Mar – 28 Mar 2026" />
              <Field label="Destination" value={form.destination} onChange={(v) => set("destination", v)} placeholder="e.g. Dubai" icon={<MdLocationOn />} />
            </TwoCol>
            <TwoCol>
              <Field label="Guest Email" value={form.email} onChange={(v) => set("email", v)} placeholder="guest@email.com" type="email" />
              <Field label="Contact No." value={form.contactNo} onChange={(v) => set("contactNo", v)} placeholder="e.g. +91 98765 43210" />
            </TwoCol>
            <Field label="Guest Address" value={form.address} onChange={(v) => set("address", v)} placeholder="Full guest address" full />
          </FormSection>

          {/* ── Hotel ── */}
          <FormSection id="section-hotel" title="Hotel Details" icon={<MdHotel />}>
            <TwoCol>
              <Field label="Hotel Name" value={form.hotelName} onChange={(v) => set("hotelName", v)} placeholder="e.g. Wescott Hotel" />
              <Field label="Hotel Address / Location" value={form.hotelAddress} onChange={(v) => set("hotelAddress", v)} placeholder="Hotel city / full address" />
            </TwoCol>
            <TwoCol>
              <Field label="Confirmation No." value={form.hotelConfirmNo} onChange={(v) => set("hotelConfirmNo", v)} placeholder="e.g. 27685" />
              <Field label="Units / Rooms" value={form.units} onChange={(v) => set("units", v)} placeholder="e.g. 1" />
            </TwoCol>
            <TwoCol>
              <Field label="Room Type" value={form.roomType} onChange={(v) => set("roomType", v)} placeholder="e.g. Deluxe Room With Bath Tub" />
              <Field label="Meal Plan" value={form.mealPlan} onChange={(v) => set("mealPlan", v)} placeholder="e.g. Bed and Breakfast" />
            </TwoCol>
            <div style={s.divider} />
            <div style={s.subHeading}>Check-in / Check-out</div>
            <TwoCol>
              <Field label="Check-in Date" value={form.checkinDate} onChange={(v) => set("checkinDate", v)} placeholder="e.g. Sun, 25 Mar 2026" />
              <Field label="Check-in Time" value={form.checkinTime} onChange={(v) => set("checkinTime", v)} placeholder="e.g. after 11:00 PM" />
            </TwoCol>
            <TwoCol>
              <Field label="Check-out Date" value={form.checkoutDate} onChange={(v) => set("checkoutDate", v)} placeholder="e.g. Wed, 28 Mar 2026" />
              <Field label="Check-out Time" value={form.checkoutTime} onChange={(v) => set("checkoutTime", v)} placeholder="e.g. before 11:00 AM" />
            </TwoCol>
            <Field label="No. of Nights" value={form.nights} onChange={(v) => set("nights", v)} placeholder="e.g. 3 Nights Stay" />
            <div style={s.divider} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={s.subHeading}>Hotel Note <span style={{ fontSize: 11, fontWeight: 400, color: "#aaa" }}>(shown in voucher)</span></div>
            </div>
            <div style={s.notePreviewBox}>
              <div style={s.notePreviewDashed}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e84949", marginBottom: 4 }}>Preview</div>
                <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.6 }}>
                  {form.hotelNote.split("\n")[0]}
                </div>
              </div>
            </div>
            <Field
              label=""
              value={form.hotelNote}
              onChange={(v) => set("hotelNote", v)}
              textarea rows={6}
              placeholder="Hotel note / check-in instructions…"
              full
            />
          </FormSection>

          {/* ── Flights (toggle) ── */}
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
                      <Field label="Date" value={fl.from_date} onChange={(v) => updateFlight(fl.id, "from_date", v)} placeholder="Apr 17, 2024" />
                      <Field label="Time" value={fl.from_time} onChange={(v) => updateFlight(fl.id, "from_time", v)} placeholder="12:00 hrs" />
                    </TwoCol>
                  </div>
                  <div style={s.flightHalf}>
                    <div style={s.flightHalfTitle}>🛬 ARRIVAL</div>
                    <Field label="City" value={fl.to_city} onChange={(v) => updateFlight(fl.id, "to_city", v)} placeholder="e.g. Dubai" />
                    <Field label="IATA Code" value={fl.to_code} onChange={(v) => updateFlight(fl.id, "to_code", v)} placeholder="DXB" />
                    <TwoCol>
                      <Field label="Date" value={fl.to_date} onChange={(v) => updateFlight(fl.id, "to_date", v)} placeholder="Apr 17, 2024" />
                      <Field label="Time" value={fl.to_time} onChange={(v) => updateFlight(fl.id, "to_time", v)} placeholder="22:55 hrs" />
                    </TwoCol>
                  </div>
                </div>
              </div>
            ))}
            <AddBtn onClick={addFlight} label="Add Flight Leg" icon={<MdFlight size={15} />} />
          </ToggleSection>

          {/* ── Transport (toggle) ── */}
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

          {/* ── Itinerary (toggle) ── */}
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
              <div key={item.id} style={s.card}>
                <div style={s.cardHead}>
                  <span style={s.cardBadge}>📅 Day {idx + 1}</span>
                  <button style={s.removeBtn} onClick={() => removeItinerary(item.id)}>
                    <MdDelete size={14} /> Remove
                  </button>
                </div>
                <TwoCol>
                  <Field label="Date" value={item.date} onChange={(v) => updateItinerary(item.id, "date", v)} placeholder="e.g. 23rd Mar" />
                  <Field label="Tour / Activity" value={item.tour} onChange={(v) => updateItinerary(item.id, "tour", v)} placeholder="e.g. Airport Pick-up DX" />
                </TwoCol>
                <TwoCol>
                  <Field label="Transfer Type" value={item.transfer} onChange={(v) => updateItinerary(item.id, "transfer", v)} placeholder="e.g. PVT / NA" />
                  <Field label="Pick-up Time" value={item.pickup_time} onChange={(v) => updateItinerary(item.id, "pickup_time", v)} placeholder="e.g. 1:30 AM" />
                </TwoCol>
                <Field label="Itinerary Details" value={item.itinerary} onChange={(v) => updateItinerary(item.id, "itinerary", v)} placeholder="Describe what happens this day…" textarea rows={3} full />
              </div>
            ))}
            <AddBtn onClick={addItinerary} label="Add Day" icon={<MdCalendarToday size={15} />} />
          </ToggleSection>

          {/* ── Notes ── */}
          <FormSection id="section-notes" title="Extras & Notes" icon={<MdInfo />}>
            <Field label="Extras / Inclusions" value={form.extras} onChange={(v) => set("extras", v)} placeholder="e.g. Water, Cake, GTB - N/A" full />
            <div style={s.divider} />
            <Field label="Special Instructions" value={form.specialInstructions} onChange={(v) => set("specialInstructions", v)} placeholder="Any special instructions for the guest…" textarea rows={4} full />
            <div style={s.divider} />
            <Field label="Important Notes (Please read before Travel)" value={form.importantNotes} onChange={(v) => set("importantNotes", v)} placeholder="Important travel notes…" textarea rows={8} full />
          </FormSection>

          {/* ── Bottom action bar ── */}
          <div style={s.bottomBar}>
            <button onClick={saveVoucher} disabled={saving} style={s.btnDark}>
              <MdSave size={17} /> {saving ? "Saving…" : "Save Voucher"}
            </button>
            <button onClick={handlePreview} style={s.btnRed}>
              <MdVisibility size={17} /> Preview & Export
            </button>
          </div>
        </main>
      </div>

      {/* ═══════════════ PREVIEW MODAL ═══════════════ */}
      {showPreview && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setShowPreview(false)}>
          <div style={s.modal}>
            {/* Modal header */}
            <div style={s.modalHead}>
              <span style={s.modalTitle}>Voucher Preview</span>
              <div style={s.modalActions}>
                <ActionBtn
                  color="#25d366"
                  icon={<FaWhatsapp size={15} />}
                  label={pdfLoading ? "Preparing…" : "WhatsApp"}
                  onClick={handleWhatsApp}
                  disabled={pdfLoading}
                />
                <ActionBtn
                  color="#ea4335"
                  icon={<MdEmail size={15} />}
                  label="Send Email"
                  onClick={() => setShowEmailModal(true)}
                  disabled={pdfLoading}
                />
                <ActionBtn
                  color="#3b82f6"
                  icon={<MdDownload size={15} />}
                  label={pdfLoading ? "…" : "Download PDF"}
                  onClick={handleDownload}
                  disabled={pdfLoading}
                />
                <ActionBtn
                  color="#7c3aed"
                  icon={<MdPrint size={15} />}
                  label="Print"
                  onClick={handlePrint}
                  disabled={pdfLoading}
                />
                <button onClick={() => setShowPreview(false)} style={s.closeBtn}>
                  <MdClose size={18} />
                </button>
              </div>
            </div>
            {/* WhatsApp info bar */}
            <div style={s.infoBar}>
              <FaWhatsapp size={13} color="#25d366" />
              <span><strong>WhatsApp:</strong> PDF downloads, then WhatsApp Web opens — select any contact to share.</span>
            </div>

            {/* Voucher */}
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
              <button onClick={() => setShowEmailModal(false)} style={s.closeBtn}>
                <MdClose size={18} />
              </button>
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
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="guest@example.com"
                      style={s.emailInput}
                      onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                    />
                  </div>
                  <div style={s.emailPreviewBox}>
                    <div style={s.emailPreviewLabel}>Voucher Summary</div>
                    <div style={s.emailPreviewRow}><b>Voucher No.:</b> {form.voucherNo || "—"}</div>
                    <div style={s.emailPreviewRow}><b>Trip ID:</b> {form.tripId || "—"}</div>
                    <div style={s.emailPreviewRow}><b>Guest:</b> {form.name || "—"}</div>
                    <div style={s.emailPreviewRow}><b>Destination:</b> {form.destination || "—"}</div>
                    <div style={s.emailPreviewRow}><b>Travel Date:</b> {form.travelDate || "—"}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
                    📎 The voucher PDF will be auto-generated and attached to this email.
                  </div>
                  {emailError && (
                    <div style={s.emailError}>{emailError}</div>
                  )}
                  <button
                    onClick={handleSendEmail}
                    disabled={emailSending || !emailTo.trim()}
                    style={{
                      ...s.emailSendBtn,
                      opacity: (emailSending || !emailTo.trim()) ? 0.6 : 1,
                    }}
                  >
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

// ─── Form building blocks ──────────────────────────────────────────────────────

function FormSection({ id, title, icon, children }) {
  return (
    <div id={id} style={s.section}>
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
    <div id={id} style={s.section}>
      <div style={s.sectionHead}>
        <span style={s.sectionIcon}>{icon}</span>
        <span style={s.sectionTitle}>{title}</span>
        <button
          onClick={onToggle}
          style={{
            ...s.toggleBtn,
            background: enabled ? "#e84949" : "rgba(255,255,255,0.15)",
            color: "#fff",
          }}
        >
          {enabled ? "− Remove Section" : "+ Add Section"}
        </button>
      </div>
      {enabled && <div style={s.sectionBody}>{children}</div>}
      {!enabled && (
        <div style={s.disabledHint}>
          This section is not included in the voucher. Click "+ Add Section" to enable it.
        </div>
      )}
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
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{ ...s.input, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
        />
      ) : (
        <div style={{ position: "relative" }}>
          {icon && <span style={s.inputIcon}>{icon}</span>}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ ...s.input, paddingLeft: icon ? 34 : 12 }}
          />
        </div>
      )}
    </div>
  );
}

function AddBtn({ onClick, label, icon }) {
  return (
    <button onClick={onClick} style={s.addBtn}>
      {icon} {label}
    </button>
  );
}

function ActionBtn({ color, icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#888" : color,
        color: "#fff", border: "none", borderRadius: 7,
        padding: "9px 14px", fontSize: 13, fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", gap: 5,
      }}
    >
      {icon} {label}
    </button>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { display: "flex", minHeight: "100vh", background: "#f0f2f7", fontFamily: "'DM Sans', sans-serif" },

  // Sidebar
  sidebar: {
    width: 230, background: "#1a1a2e", display: "flex", flexDirection: "column",
    position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100,
    boxShadow: "2px 0 16px rgba(0,0,0,0.2)",
  },
  sideTop: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  sideLogo: { height: 38, objectFit: "contain", filter: "brightness(0) invert(1)" },
  sideMenu: { flex: 1, padding: "16px 12px", overflowY: "auto" },
  backBtn: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.07)", border: "none",
    borderRadius: 7, color: "rgba(255,255,255,0.6)",
    padding: "8px 12px", fontSize: 13, cursor: "pointer",
    width: "100%", marginBottom: 16, fontFamily: "inherit",
  },
  menuLabel: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, padding: "0 4px", marginBottom: 6 },
  menuItem: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "9px 12px", borderRadius: 7,
    color: "rgba(255,255,255,0.55)", fontSize: 13.5, fontWeight: 500,
    textDecoration: "none", marginBottom: 2,
    transition: "all 0.15s",
  },
  menuItemActive: { background: "rgba(232,73,73,0.18)", color: "#e84949" },
  sideBottom: { padding: "12px" },
  sideActions: { display: "flex", gap: 8, marginBottom: 8 },
  sideBtn: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
    background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 7,
    color: "#fff", padding: "9px 8px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  sideBtnRed: { background: "#e84949" },
  savedPill: { textAlign: "center", fontSize: 11.5, color: "#4ade80", padding: "4px 0" },

  // Main
  main: { marginLeft: 230, flex: 1, padding: "28px 36px 60px", minHeight: "100vh" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  pageTitle: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: 0 },
  pageSubtitle: { fontSize: 13, color: "#9ca3af", margin: "5px 0 0" },
  topActions: { display: "flex", alignItems: "center", gap: 10 },
  savedTag: { background: "#dcfce7", color: "#15803d", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600 },
  previewBtn: {
    background: "#e84949", color: "#fff", border: "none", borderRadius: 8,
    padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 6,
  },

  // Sections
  section: {
    background: "#fff", borderRadius: 12, overflow: "hidden",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 20,
    border: "1px solid #e8eaf0",
  },
  sectionHead: {
    background: "#e84949", display: "flex", alignItems: "center", gap: 10,
    padding: "13px 20px",
  },
  sectionIcon: { color: "#fff", display: "flex", alignItems: "center", fontSize: 18 },
  sectionTitle: { color: "#fff", fontWeight: 700, fontSize: 14.5, flex: 1, letterSpacing: 0.2 },
  sectionBody: { padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 },
  disabledHint: { padding: "14px 22px", fontSize: 13, color: "#9ca3af", fontStyle: "italic" },
  toggleBtn: {
    border: "none", borderRadius: 6, padding: "5px 14px",
    fontSize: 12, fontWeight: 700, cursor: "pointer",
  },

  // Form
  twoCol: { display: "flex", gap: 14 },
  label: { display: "block", fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 },
  input: {
    width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
    padding: "10px 12px", fontSize: 14, outline: "none",
    boxSizing: "border-box", background: "#f9fafb", color: "#111",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.15s",
  },
  inputIcon: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" },
  divider: { height: 1, background: "#f0f0f0", margin: "2px 0" },
  subHeading: { fontSize: 12.5, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.8 },

  // Cards
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
  flightHalf: {
    flex: 1, background: "#fff", border: "1.5px solid #e5e7eb",
    borderRadius: 8, padding: "14px", display: "flex", flexDirection: "column", gap: 10,
  },
  flightHalfTitle: { fontSize: 11, fontWeight: 800, color: "#e84949", letterSpacing: 1, marginBottom: 4 },

  // Add button
  addBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    background: "#eff6ff", color: "#2563eb", border: "1.5px dashed #93c5fd",
    borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", width: "100%",
  },

  // Note preview
  notePreviewBox: { marginBottom: 4 },
  notePreviewDashed: {
    border: "1.5px dashed #93c5fd", borderRadius: 8,
    padding: "10px 14px", background: "#f0f9ff",
  },

  // Bottom bar
  bottomBar: { display: "flex", gap: 12, paddingTop: 10, paddingBottom: 20 },
  btnDark: {
    background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8,
    padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 7,
  },
  btnRed: {
    background: "#e84949", color: "#fff", border: "none", borderRadius: 8,
    padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 7,
  },

  // Modal
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
    zIndex: 1000, display: "flex", alignItems: "flex-start",
    justifyContent: "center", overflowY: "auto", padding: "20px",
  },
  modal: {
    background: "#f0f2f7", borderRadius: 16, width: "100%",
    maxWidth: 840, margin: "auto",
    boxShadow: "0 24px 80px rgba(0,0,0,0.4)", overflow: "hidden",
  },
  modalHead: {
    background: "#1a1a2e", padding: "16px 22px",
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: 10,
  },
  modalTitle: { color: "#fff", fontSize: 16, fontWeight: 700 },
  modalActions: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  closeBtn: {
    background: "rgba(255,255,255,0.1)", border: "none",
    borderRadius: 7, color: "#fff", padding: "8px 10px",
    cursor: "pointer", display: "flex", alignItems: "center",
  },
  infoBar: {
    background: "#f0fdf4", padding: "10px 22px",
    display: "flex", alignItems: "center", gap: 8,
    fontSize: 12, color: "#166534", borderBottom: "1px solid #dcfce7",
  },
  modalBody: { padding: "24px", overflowY: "auto", maxHeight: "82vh" },

  // Email modal
  emailModal: {
    background: "#fff", borderRadius: 14, width: "100%",
    maxWidth: 460, margin: "auto",
    boxShadow: "0 24px 60px rgba(0,0,0,0.35)", overflow: "hidden",
  },
  emailModalHead: {
    background: "#ea4335", padding: "16px 20px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  emailModalBody: { padding: "24px" },
  emailSenderRow: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#f5f5f5", borderRadius: 7, padding: "9px 12px", marginBottom: 16,
  },
  emailLabel: { fontSize: 11.5, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 },
  emailFrom: { fontSize: 13, color: "#333", fontWeight: 600 },
  emailInput: {
    width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 8,
    padding: "11px 13px", fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
  },
  emailPreviewBox: {
    background: "#f9f9f9", border: "1px solid #eee",
    borderRadius: 8, padding: "12px 14px", marginBottom: 16,
  },
  emailPreviewLabel: { fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  emailPreviewRow: { fontSize: 13, color: "#444", marginBottom: 4 },
  emailSendBtn: {
    background: "#ea4335", color: "#fff", border: "none",
    borderRadius: 8, padding: "13px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", width: "100%", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 7,
  },
  emailError: {
    background: "#fff2f2", border: "1px solid #fecaca",
    color: "#b91c1c", borderRadius: 7, padding: "10px 13px",
    fontSize: 13, marginBottom: 12,
  },
  emailSuccess: {
    textAlign: "center", padding: "24px 0",
  },
};
