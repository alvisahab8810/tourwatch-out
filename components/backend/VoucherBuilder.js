import { useEffect, useRef, useState } from "react";
import {
  MdHotel, MdFlight, MdDirectionsCar, MdCalendarToday,
  MdPerson, MdLocationOn, MdSave, MdVisibility,
  MdDelete, MdClose, MdDownload, MdPrint,
  MdInfo, MdEmail, MdSend, MdCheckCircle,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import VoucherPreview from "../voucher/VoucherPreview";

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toISO(str) {
  if (!str) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const d = new Date(str);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fromISO(iso, fmt = "long") {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  if (fmt === "flight") return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (fmt === "short") return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}
function buildTravelDate(from, to) { return (from && to) ? `${from} – ${to}` : (from || to || ""); }
function toRichText(text) {
  if (!text) return "";
  if (/<[^>]+>/.test(text)) return text;
  return text.replace(/\n/g, "<br>");
}

// ─── Auto ID ──────────────────────────────────────────────────────────────────
function getFinancialYear() {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
  return m >= 4 ? `${String(y).slice(2)}-${String(y+1).slice(2)}` : `${String(y-1).slice(2)}-${String(y).slice(2)}`;
}
function getMonthPad() { return String(new Date().getMonth() + 1).padStart(2, "0"); }
function buildVoucherNo(all) {
  const fy = getFinancialYear(), mm = getMonthPad(), prefix = `TWO/${fy}/${mm}/`;
  const count = all.filter(v => v.voucherNo?.startsWith(prefix)).length;
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}
function buildTripId(all) {
  const fy = getFinancialYear(), mm = getMonthPad(), prefix = `TWO/${fy}/${mm}/`;
  const yearCount = all.filter(v => v.tripId?.startsWith(`TWO/${fy}/`)).length;
  return `${prefix}${String(26 + yearCount + 1).padStart(3, "0")}`;
}

// ─── Options & Factories ──────────────────────────────────────────────────────
const MEAL_OPTS = ["EPAI - Room Only","CPAI - Room & Breakfast","MAPAI - Breakfast & Lunch","MAPAI - Breakfast & Dinner","APAI - Breakfast, Lunch & Dinner"];
const NIGHTS_OPTS = ["1N/2D","2N/3D","3N/4D","4N/5D","5N/6D","6N/7D","7N/8D","8N/9D","9N/10D","10N/11D","11N/12D"];
const uid = () => Date.now() + Math.random();
const EMPTY_FLIGHT    = () => ({ id: uid(), pnr: "", flight_no: "", from_city: "", from_code: "", from_date: "", from_time: "", to_city: "", to_code: "", to_date: "", to_time: "" });
const EMPTY_TRANSPORT = () => ({ id: uid(), vehicle_type: "", driver_name: "", driver_contact: "" });
const EMPTY_ITINERARY = () => ({ id: uid(), date: "", title: "", tour: "", transfer: "", pickup_time: "", itinerary: "" });
const EMPTY_HOTEL     = () => ({ id: uid(), place: "", hotelName: "", hotelAddress: "", hotelConfirmNo: "", units: "", roomType: "", mealPlan: "", checkinDate: "", checkinTime: "2:00 PM", checkoutDate: "", checkoutTime: "10:00 AM", nights: "" });

const DEFAULT_HOTEL_NOTE = `Kindly note, early check-in is subject to availability of the rooms or hotel may charge directly to the guest.\n• For early check-in, extra bed and airport pickups contact the hotel directly.\n• Passport, Driving License and Aadhaar are accepted as ID proof(s).`;
const DEFAULT_TC = `We request to the guest that at the time of arrival, kindly purchase a local SIM, so we can communicate easily. Pick-up & drop timings are only indicative & might change, exact timings will be informed by the operations team.`;

const DEFAULT_FORM = {
  voucherNo: "", tripId: "",
  name: "", pax: "", travelDateFrom: "", travelDateTo: "", travelDate: "", destination: "",
  email: "", contactNo: "", address: "",
  invoiceId: "", leadId: "", quotationId: "",
  showHotel: false, hotels: [],
  showFlights: false, flights: [],
  showTransport: false, transports: [],
  showItinerary: false, itineraries: [],
  hotelNote: DEFAULT_HOTEL_NOTE,
  inclusions: "", exclusions: "",
  valueAddition: "Water, Cake, GTB - N/A",
  specialInstructions: "",
  termsConditions: DEFAULT_TC,
};

function buildDefault(prefill, all) {
  const inv = prefill?.invoice;
  const lead = prefill?.lead;
  const base = { ...DEFAULT_FORM, voucherNo: buildVoucherNo(all), tripId: buildTripId(all) };
  if (inv) {
    base.invoiceId   = inv.id || inv._id || "";
    base.quotationId = inv.quotationId || "";
    base.leadId      = inv.leadId || "";
    base.name        = inv.clientName || "";
    base.contactNo   = inv.contact || "";
    base.destination = inv.destination || "";
  }
  if (lead) {
    if (!base.name)        base.name        = lead.name || "";
    if (!base.contactNo)   base.contactNo   = lead.phone || "";
    if (!base.destination) base.destination = lead.destination || "";
    base.email  = lead.email || "";
    if (!base.leadId) base.leadId = lead._id || "";
    const adults = +lead.brr?.adults || 0, children = +lead.brr?.children || 0;
    if (adults > 0) base.pax = children > 0 ? `${adults} Adults, ${children} Child` : `${adults} Adults`;
    if (lead.brr?.tripDate) base.travelDateFrom = fromISO(lead.brr.tripDate, "short");
  }
  return base;
}

export default function VoucherBuilder({ prefill, voucherData, isNew, onClose, onSaved }) {
  const editId = voucherData?.id || voucherData?._id || null;
  const [formKey, setFormKey] = useState(0);
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
    async function init() {
      const dbRes = await fetch("/api/dashboard/vouchers").then(r => r.json()).catch(() => []);
      const all = Array.isArray(dbRes) ? dbRes : [];
      if (voucherData) {
        setForm({ ...DEFAULT_FORM, ...voucherData });
      } else {
        setForm(buildDefault(prefill, all));
      }
      setFormKey(k => k + 1);
    }
    init();
  }, []);

  const set    = (key, val) => { setForm(f => ({ ...f, [key]: val })); setSaved(false); };
  const setM   = (upd) =>     { setForm(f => ({ ...f, ...upd })); setSaved(false); };

  const addHotel        = () => set("hotels", [...(form.hotels || []), EMPTY_HOTEL()]);
  const removeHotel     = (id) => set("hotels", form.hotels.filter(h => h.id !== id));
  const updateHotel     = (id, k, v) => { setForm(f => ({ ...f, hotels: f.hotels.map(h => { if (h.id !== id) return h; const u = { ...h, [k]: v }; if (k === "checkinDate") u.checkoutDate = v; return u; }) })); setSaved(false); };
  const addFlight       = () => set("flights", [...form.flights, EMPTY_FLIGHT()]);
  const removeFlight    = (id) => set("flights", form.flights.filter(f => f.id !== id));
  const updateFlight    = (id, k, v) => set("flights", form.flights.map(f => f.id === id ? { ...f, [k]: v } : f));
  const addTransport    = () => set("transports", [...form.transports, EMPTY_TRANSPORT()]);
  const removeTransport = (id) => set("transports", form.transports.filter(t => t.id !== id));
  const updateTransport = (id, k, v) => set("transports", form.transports.map(t => t.id === id ? { ...t, [k]: v } : t));
  const addItinerary    = () => set("itineraries", [...form.itineraries, EMPTY_ITINERARY()]);
  const removeItinerary = (id) => set("itineraries", form.itineraries.filter(i => i.id !== id));
  const updateItinerary = (id, k, v) => set("itineraries", form.itineraries.map(i => i.id === id ? { ...i, [k]: v } : i));

  // Internal save — updates DB + local state only, does NOT call onSaved (so parent never unmounts this modal)
  async function saveLocal() {
    setSaving(true);
    try {
      const payload = { ...form };
      const currentId = form.id || form._id || editId;
      let result;
      if (currentId) {
        const r = await fetch(`/api/dashboard/vouchers/${currentId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        result = await r.json();
      } else {
        const r = await fetch("/api/dashboard/vouchers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() }) });
        result = await r.json();
      }
      setForm(prev => ({ ...prev, ...result }));
      setSaved(true);
      return result;
    } catch (e) { alert("Save failed: " + e.message); } finally { setSaving(false); }
  }

  // Explicit save (Save button) — also notifies parent so list refreshes
  async function saveVoucher() {
    const result = await saveLocal();
    if (result && onSaved) onSaved(result);
    return result;
  }

  async function generatePDF() {
    setPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const wrapEl   = document.getElementById("vb-pdf-target");
      const footerEl = document.getElementById("vb-pdf-footer");
      if (!wrapEl) return null;
      const SCALE = 2;
      const patch = (doc) => { const s = doc.createElement("style"); s.textContent = "* { font-family: Arial, Helvetica, sans-serif !important; }"; doc.head.appendChild(s); };

      let mainCanvas;
      if (footerEl) {
        const prevD = footerEl.style.display;
        footerEl.style.display = "none";
        mainCanvas = await html2canvas(wrapEl, { scale: SCALE, useCORS: true, backgroundColor: "#fff", logging: false, height: wrapEl.scrollHeight, windowHeight: wrapEl.scrollHeight, onclone: patch });
        footerEl.style.display = prevD;
      } else {
        mainCanvas = await html2canvas(wrapEl, { scale: SCALE, useCORS: true, backgroundColor: "#fff", logging: false, height: wrapEl.scrollHeight, windowHeight: wrapEl.scrollHeight, onclone: patch });
      }

      const footerCanvas = footerEl ? await html2canvas(footerEl, { scale: SCALE, useCORS: true, backgroundColor: "#fff5f5", logging: false, onclone: patch }) : null;

      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
      const pxPerMm = mainCanvas.width / pageW, pagePx = pageH * pxPerMm;
      const totalPx = mainCanvas.height;

      let yPx = 0, firstPage = true;
      while (yPx < totalPx) {
        if (!firstPage) pdf.addPage();
        firstPage = false;
        const slicePx = Math.min(pagePx, totalPx - yPx);
        const sl = document.createElement("canvas"); sl.width = mainCanvas.width; sl.height = slicePx;
        sl.getContext("2d").drawImage(mainCanvas, 0, yPx, mainCanvas.width, slicePx, 0, 0, mainCanvas.width, slicePx);
        pdf.addImage(sl.toDataURL("image/png"), "PNG", 0, 0, pageW, slicePx / pxPerMm);
        yPx += pagePx;
      }
      if (footerCanvas) {
        const fh = (footerCanvas.height / footerCanvas.width) * pageW;
        pdf.addImage(footerCanvas.toDataURL("image/png"), "PNG", 0, pageH - fh, pageW, fh);
      }
      return pdf;
    } finally { setPdfLoading(false); }
  }

  async function handleDownload() { await saveLocal(); const pdf = await generatePDF(); if (pdf) pdf.save(`voucher-${form.voucherNo || form.tripId || "tw"}.pdf`); }
  async function handlePrint()    { await saveLocal(); const pdf = await generatePDF(); if (!pdf) return; const url = URL.createObjectURL(pdf.output("blob")); const win = window.open(url); if (win) win.onload = () => win.print(); }
  async function handleWhatsApp() { await saveLocal(); const pdf = await generatePDF(); if (pdf) pdf.save(`voucher-${form.voucherNo || form.tripId || "tw"}.pdf`); const msg = encodeURIComponent(`Hello ${form.name || ""},\n\nYour travel voucher is ready! ✈️\n\nVoucher No: ${form.voucherNo||"—"}\nTrip ID: ${form.tripId||"—"}\nDestination: ${form.destination||"—"}\n\n— Team Tourwatchout`); window.open(`https://web.whatsapp.com/send?text=${msg}`, "_blank"); }

  async function handleSendEmail() {
    if (!emailTo.trim()) return;
    await saveLocal();
    setEmailSending(true); setEmailError("");
    try {
      const pdf = await generatePDF();
      if (!pdf) throw new Error("PDF generation failed");
      const pdfBase64 = pdf.output("datauristring").split(",")[1];
      const fileName = `voucher-${form.voucherNo || form.tripId || "tw"}.pdf`;
      const emailBody = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#e84949;padding:20px;text-align:center"><h2 style="color:#fff;margin:0">Tourwatchout — Travel Voucher</h2></div><div style="padding:24px;background:#fff;border:1px solid #eee"><p>Dear <strong>${form.name||"Guest"}</strong>,</p><p>Your travel voucher is ready. Please find the PDF attached.</p><table style="width:100%;border-collapse:collapse;margin:16px 0"><tr><td style="padding:8px;font-weight:bold;color:#555;width:140px">Voucher No.</td><td style="padding:8px;color:#222">${form.voucherNo||"—"}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Trip ID</td><td style="padding:8px;color:#222">${form.tripId||"—"}</td></tr><tr><td style="padding:8px;font-weight:bold;color:#555">Destination</td><td style="padding:8px;color:#222">${form.destination||"—"}</td></tr></table></div></div>`;
      const res = await fetch("/api/dashboard/send-voucher", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: emailTo, subject: `Travel Voucher — ${form.destination||"Tourwatchout"} (${form.voucherNo||form.tripId})`, html: emailBody, pdfBase64, fileName }) });
      if (!res.ok) throw new Error("Email sending failed");
      setEmailDone(true);
      setTimeout(() => { setShowEmailModal(false); setEmailDone(false); setEmailTo(""); }, 2500);
    } catch (e) { setEmailError(e.message || "Something went wrong."); } finally { setEmailSending(false); }
  }

  function handlePreview() { setShowPreview(true); }

  return (
    <>
      {/* ═══ Main Modal ═══ */}
      <div style={ms.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={ms.modal}>
          {/* Header */}
          <div style={ms.head}>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{editId ? "Edit Voucher" : "Create Voucher"}</div>
              {form.tripId && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{form.tripId}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {saved && <span style={s.savedTag}>✓ Saved</span>}
              <button onClick={saveVoucher} disabled={saving} style={ms.saveBtn}>
                <MdSave size={14} /> {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={handlePreview} style={ms.previewBtn}>
                <MdVisibility size={14} /> Preview
              </button>
              <button onClick={onClose} style={ms.closeBtn}>✕</button>
            </div>
          </div>

          {/* Body */}
          <div style={ms.body}>

            {/* ── Voucher Info ── */}
            <FS title="Voucher Information" icon={<MdPerson />}>
              <TC>
                <F label="Voucher No." value={form.voucherNo} onChange={v => set("voucherNo", v)} placeholder="e.g. TWO/26-27/06/001" />
                <F label="Trip ID" value={form.tripId} onChange={v => set("tripId", v)} placeholder="e.g. TWO/26-27/06/027" />
              </TC>
              <div style={s.divider} />
              <div style={s.subHead}>Guest Details</div>
              <TC>
                <F label="Guest Name" value={form.name} onChange={v => set("name", v)} placeholder="e.g. Shilpa Singh" />
                <F label="Pax (Adults + Kids)" value={form.pax} onChange={v => set("pax", v)} placeholder="e.g. 2 Adults, 1 kid" />
              </TC>
              <TC>
                <DF label="Travel From" value={form.travelDateFrom} onChange={v => setM({ travelDateFrom: v, travelDate: buildTravelDate(v, form.travelDateTo) })} fmt="short" />
                <DF label="Travel To"   value={form.travelDateTo}   onChange={v => setM({ travelDateTo: v, travelDate: buildTravelDate(form.travelDateFrom, v) })} fmt="short" />
              </TC>
              {form.travelDate && (
                <div style={{ fontSize: 12.5, color: "#4b5563", padding: "6px 12px", background: "#f0f9ff", borderRadius: 6, border: "1px solid #bae6fd" }}>
                  Travel Period: <strong>{form.travelDate}</strong>
                </div>
              )}
              <TC>
                <F label="Destination" value={form.destination} onChange={v => set("destination", v)} placeholder="e.g. Dubai" icon={<MdLocationOn />} />
                <F label="Guest Email" value={form.email} onChange={v => set("email", v)} placeholder="guest@email.com" type="email" />
              </TC>
              <TC>
                <F label="Contact No." value={form.contactNo} onChange={v => set("contactNo", v)} placeholder="e.g. +91 98765 43210" />
                <F label="Guest Address" value={form.address} onChange={v => set("address", v)} placeholder="Full guest address" />
              </TC>
            </FS>

            {/* ── Hotel ── */}
            <TS title="Hotel Details" icon={<MdHotel />} enabled={form.showHotel !== false}
              onToggle={() => { const n = !form.showHotel; set("showHotel", n); if (n && !(form.hotels||[]).length) addHotel(); }}>
              {(form.hotels || []).map((h, idx) => (
                <div key={h.id} style={s.card}>
                  <div style={s.cardHead}>
                    <span style={s.cardBadge}>🏨 Hotel {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeHotel(h.id)}><MdDelete size={13} /> Remove</button>
                  </div>
                  <TC><F label="Hotel Name" value={h.hotelName} onChange={v => updateHotel(h.id,"hotelName",v)} placeholder="e.g. Wescott Hotel" /><F label="Place" value={h.place||""} onChange={v => updateHotel(h.id,"place",v)} placeholder="e.g. Dubai Marina" /></TC>
                  <TC><F label="Hotel Address" value={h.hotelAddress} onChange={v => updateHotel(h.id,"hotelAddress",v)} placeholder="Hotel city / full address" /><F label="Confirmation No." value={h.hotelConfirmNo} onChange={v => updateHotel(h.id,"hotelConfirmNo",v)} placeholder="e.g. 27685" /></TC>
                  <TC><F label="Units / Rooms" value={h.units} onChange={v => updateHotel(h.id,"units",v)} placeholder="e.g. 1" /><F label="Room Type" value={h.roomType} onChange={v => updateHotel(h.id,"roomType",v)} placeholder="e.g. Deluxe Room" /></TC>
                  <SF label="Meal Plan" value={h.mealPlan} onChange={v => updateHotel(h.id,"mealPlan",v)} options={MEAL_OPTS} allowEmpty />
                  <div style={s.divider} /><div style={s.subHead}>Check-in / Check-out</div>
                  <TC><DF label="Check-in Date" value={h.checkinDate} onChange={v => updateHotel(h.id,"checkinDate",v)} /><F label="Check-in Time" value={h.checkinTime} onChange={v => updateHotel(h.id,"checkinTime",v)} placeholder="2:00 PM" /></TC>
                  <TC><DF label="Check-out Date" value={h.checkoutDate} onChange={v => updateHotel(h.id,"checkoutDate",v)} /><F label="Check-out Time" value={h.checkoutTime} onChange={v => updateHotel(h.id,"checkoutTime",v)} placeholder="10:00 AM" /></TC>
                  <SF label="No. of Nights" value={h.nights} onChange={v => updateHotel(h.id,"nights",v)} options={NIGHTS_OPTS} allowEmpty />
                </div>
              ))}
              <div style={s.divider} /><div style={s.subHead}>Hotel Note</div>
              <F label="" value={form.hotelNote||""} onChange={v => set("hotelNote",v)} textarea rows={5} placeholder="Hotel note…" full />
              <AddBtn onClick={addHotel} label="Add Hotel" icon={<MdHotel size={14} />} />
            </TS>

            {/* ── Flights ── */}
            <TS title="Flight Details" icon={<MdFlight />} enabled={form.showFlights}
              onToggle={() => { const n = !form.showFlights; set("showFlights", n); if (n && !form.flights.length) addFlight(); }}>
              {form.flights.map((fl, idx) => (
                <div key={fl.id} style={s.card}>
                  <div style={s.cardHead}>
                    <span style={s.cardBadge}>✈ Flight {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeFlight(fl.id)}><MdDelete size={13} /> Remove</button>
                  </div>
                  <TC><F label="PNR" value={fl.pnr} onChange={v => updateFlight(fl.id,"pnr",v)} placeholder="e.g. B8F6Y1" /><F label="Flight No." value={fl.flight_no} onChange={v => updateFlight(fl.id,"flight_no",v)} placeholder="e.g. SG 51" /></TC>
                  <div style={s.flightGrid}>
                    <div style={s.flightHalf}>
                      <div style={s.flightTitle}>🛫 DEPARTURE</div>
                      <F label="City" value={fl.from_city} onChange={v => updateFlight(fl.id,"from_city",v)} placeholder="e.g. Pune" />
                      <F label="IATA Code" value={fl.from_code} onChange={v => updateFlight(fl.id,"from_code",v)} placeholder="PNQ" />
                      <TC><DF label="Date" value={fl.from_date} onChange={v => updateFlight(fl.id,"from_date",v)} fmt="flight" /><F label="Time" value={fl.from_time} onChange={v => updateFlight(fl.id,"from_time",v)} placeholder="12:00 hrs" /></TC>
                    </div>
                    <div style={s.flightHalf}>
                      <div style={s.flightTitle}>🛬 ARRIVAL</div>
                      <F label="City" value={fl.to_city} onChange={v => updateFlight(fl.id,"to_city",v)} placeholder="e.g. Dubai" />
                      <F label="IATA Code" value={fl.to_code} onChange={v => updateFlight(fl.id,"to_code",v)} placeholder="DXB" />
                      <TC><DF label="Date" value={fl.to_date} onChange={v => updateFlight(fl.id,"to_date",v)} fmt="flight" /><F label="Time" value={fl.to_time} onChange={v => updateFlight(fl.id,"to_time",v)} placeholder="22:55 hrs" /></TC>
                    </div>
                  </div>
                </div>
              ))}
              <AddBtn onClick={addFlight} label="Add Flight Leg" icon={<MdFlight size={14} />} />
            </TS>

            {/* ── Transport ── */}
            <TS title="Transportation Details" icon={<MdDirectionsCar />} enabled={form.showTransport}
              onToggle={() => { const n = !form.showTransport; set("showTransport", n); if (n && !form.transports.length) addTransport(); }}>
              {form.transports.map((t, idx) => (
                <div key={t.id} style={s.card}>
                  <div style={s.cardHead}>
                    <span style={s.cardBadge}>🚗 Vehicle {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeTransport(t.id)}><MdDelete size={13} /> Remove</button>
                  </div>
                  <TC><F label="Vehicle Type" value={t.vehicle_type} onChange={v => updateTransport(t.id,"vehicle_type",v)} placeholder="e.g. Sedan" /><F label="Driver Name" value={t.driver_name} onChange={v => updateTransport(t.id,"driver_name",v)} placeholder="e.g. Shivam Singh" /></TC>
                  <F label="Driver Contact" value={t.driver_contact} onChange={v => updateTransport(t.id,"driver_contact",v)} placeholder="e.g. +971 4 329 3200" full />
                </div>
              ))}
              <AddBtn onClick={addTransport} label="Add Vehicle" icon={<MdDirectionsCar size={14} />} />
            </TS>

            {/* ── Itinerary ── */}
            <TS title="Day-wise Itinerary" icon={<MdCalendarToday />} enabled={form.showItinerary}
              onToggle={() => { const n = !form.showItinerary; set("showItinerary", n); if (n && !form.itineraries.length) addItinerary(); }}>
              {form.itineraries.map((item, idx) => (
                <div key={`${item.id}-${formKey}`} style={s.card}>
                  <div style={s.cardHead}>
                    <span style={s.cardBadge}>📅 Day {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeItinerary(item.id)}><MdDelete size={13} /> Remove</button>
                  </div>
                  <TC><DF label="Date" value={item.date} onChange={v => updateItinerary(item.id,"date",v)} /><F label="Itinerary Title" value={item.title||""} onChange={v => updateItinerary(item.id,"title",v)} placeholder="e.g. Arrival & City Tour" /></TC>
                  <TC><F label="Tour / Activity" value={item.tour} onChange={v => updateItinerary(item.id,"tour",v)} placeholder="e.g. Airport Pick-up" /><F label="Transfer Type" value={item.transfer} onChange={v => updateItinerary(item.id,"transfer",v)} placeholder="e.g. PVT / NA" /></TC>
                  <F label="Pick-up Time" value={item.pickup_time} onChange={v => updateItinerary(item.id,"pickup_time",v)} placeholder="e.g. 1:30 AM" full />
                  <div>
                    <label style={s.label}>Itinerary Details</label>
                    <RTE value={toRichText(item.itinerary)} onChange={v => updateItinerary(item.id,"itinerary",v)} placeholder="Describe what happens this day…" />
                  </div>
                </div>
              ))}
              <AddBtn onClick={addItinerary} label="Add Day" icon={<MdCalendarToday size={14} />} />
            </TS>

            {/* ── Inclusions ── */}
            <FS title="Inclusions" icon={<MdCheckCircle />}>
              <RTE key={`inc-${formKey}`} value={toRichText(form.inclusions||"")} onChange={v => set("inclusions",v)} placeholder="List what's included…" />
            </FS>

            {/* ── Exclusions ── */}
            <FS title="Exclusions" icon={<MdClose />}>
              <RTE key={`exc-${formKey}`} value={toRichText(form.exclusions||"")} onChange={v => set("exclusions",v)} placeholder="List what's not included…" />
            </FS>

            {/* ── Notes ── */}
            <FS title="Extras & Notes" icon={<MdInfo />}>
              <F label="Value Addition" value={form.valueAddition||""} onChange={v => set("valueAddition",v)} placeholder="e.g. Water, Cake, GTB - N/A" full />
              <div style={s.divider} />
              <F label="Special Instructions" value={form.specialInstructions} onChange={v => set("specialInstructions",v)} placeholder="Any special instructions…" textarea rows={4} full />
              <div style={s.divider} />
              <div>
                <label style={s.label}>T&amp;C</label>
                <RTE key={`tc-${formKey}`} value={toRichText(form.termsConditions||"")} onChange={v => set("termsConditions",v)} placeholder="Terms and conditions…" />
              </div>
            </FS>

            <div style={{ display: "flex", gap: 12, paddingTop: 8, paddingBottom: 8 }}>
              <button onClick={saveVoucher} disabled={saving} style={s.btnDark}><MdSave size={16} /> {saving ? "Saving…" : "Save Voucher"}</button>
              <button onClick={handlePreview} style={s.btnBlue}><MdVisibility size={16} /> Preview & Export</button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Preview Modal ═══ */}
      {showPreview && (
        <div style={{ ...ms.overlay, zIndex: 201 }} onClick={e => { if (e.target === e.currentTarget) setShowPreview(false); }}>
          <div style={{ ...ms.modal, background: "#f0f2f7", maxWidth: 860 }}>
            <div style={{ background: "#1a1a2e", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderRadius: "16px 16px 0 0", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Voucher Preview</span>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
                <AB color="#25d366" icon={<FaWhatsapp size={13}/>} label={pdfLoading?"…":"WhatsApp"} onClick={handleWhatsApp} disabled={pdfLoading} />
                <AB color="#ea4335" icon={<MdEmail size={13}/>} label="Email" onClick={() => setShowEmailModal(true)} disabled={pdfLoading} />
                <AB color="#3b82f6" icon={<MdDownload size={13}/>} label={pdfLoading?"…":"Download"} onClick={handleDownload} disabled={pdfLoading} />
                <AB color="#7c3aed" icon={<MdPrint size={13}/>} label="Print" onClick={handlePrint} disabled={pdfLoading} />
                <button onClick={() => setShowPreview(false)} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 7, color: "#fff", padding: "7px 11px", cursor: "pointer", fontSize: 15, fontWeight: 700 }}>✕</button>
              </div>
            </div>
            <div style={{ padding: "20px", overflowY: "auto", maxHeight: "80vh" }}>
              <div id="vb-pdf-target" style={{ background: "#fff" }}>
                <VoucherPreview data={form} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Email Modal ═══ */}
      {showEmailModal && (
        <div style={{ ...ms.overlay, zIndex: 202 }} onClick={e => { if (e.target === e.currentTarget) setShowEmailModal(false); }}>
          <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 440, margin: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", overflow: "hidden" }}>
            <div style={{ background: "#ea4335", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MdEmail size={18} color="#fff" />
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Send Voucher via Email</span>
              </div>
              <button onClick={() => setShowEmailModal(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, color: "#fff", padding: "6px 9px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>✕</button>
            </div>
            <div style={{ padding: "20px" }}>
              {emailDone ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <MdCheckCircle size={48} color="#22c55e" />
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#166534", marginTop: 10 }}>Email sent!</div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Voucher PDF delivered to {emailTo}</div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", display: "block", marginBottom: 5 }}>To (Recipient Email)</label>
                    <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="guest@example.com" onKeyDown={e => e.key==="Enter" && handleSendEmail()}
                      style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                  {emailError && <div style={{ background: "#fff2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 7, padding: "9px 12px", fontSize: 13, marginBottom: 12 }}>{emailError}</div>}
                  <button onClick={handleSendEmail} disabled={emailSending || !emailTo.trim()} style={{ background: "#ea4335", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: (emailSending || !emailTo.trim()) ? 0.6 : 1 }}>
                    <MdSend size={15} /> {emailSending ? "Sending…" : "Send Email with PDF"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FS({ title, icon, children }) {
  return (
    <div style={s.section}>
      <div style={s.secHead}><span style={s.secIcon}>{icon}</span><span style={s.secTitle}>{title}</span></div>
      <div style={s.secBody}>{children}</div>
    </div>
  );
}
function TS({ title, icon, enabled, onToggle, children }) {
  return (
    <div style={s.section}>
      <div style={s.secHead}>
        <span style={s.secIcon}>{icon}</span>
        <span style={s.secTitle}>{title}</span>
        <button onClick={onToggle} style={{ border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", color: "#fff", background: enabled ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)" }}>
          {enabled ? "− Remove Section" : "+ Add Section"}
        </button>
      </div>
      {enabled  && <div style={s.secBody}>{children}</div>}
      {!enabled && <div style={{ padding: "11px 18px", fontSize: 12.5, color: "#9ca3af", fontStyle: "italic" }}>Section disabled — click "+ Add Section" to enable.</div>}
    </div>
  );
}
function TC({ children }) { return <div style={{ display: "flex", gap: 12 }}>{children}</div>; }
function F({ label, value, onChange, placeholder, type = "text", textarea, full, rows = 3, icon }) {
  return (
    <div style={{ flex: full ? "1 1 100%" : "1 1 0", minWidth: 0 }}>
      {label && <label style={s.label}>{label}</label>}
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...s.input, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
      ) : (
        <div style={{ position: "relative" }}>
          {icon && <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>{icon}</span>}
          <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...s.input, paddingLeft: icon ? 34 : 12 }} />
        </div>
      )}
    </div>
  );
}
function SF({ label, value, onChange, options, allowEmpty = false, full = false }) {
  return (
    <div style={{ flex: full ? "1 1 100%" : "1 1 0", minWidth: 0 }}>
      {label && <label style={s.label}>{label}</label>}
      <select value={value||""} onChange={e => onChange(e.target.value)} style={{ ...s.input, cursor: "pointer" }}>
        {(allowEmpty || !value) && <option value="">— Select —</option>}
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
function DF({ label, value, onChange, fmt = "long" }) {
  return (
    <div style={{ flex: "1 1 0", minWidth: 0 }}>
      {label && <label style={s.label}>{label}</label>}
      <input type="date" value={toISO(value)} onChange={e => onChange(fromISO(e.target.value, fmt))} style={{ ...s.input, colorScheme: "light" }} />
    </div>
  );
}
function RTE({ value, onChange, placeholder }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.innerHTML = value || ""; }, []);
  const exec = cmd => { document.execCommand(cmd, false, null); if (ref.current) onChange(ref.current.innerHTML); ref.current?.focus(); };
  const isEmpty = !(value ? value.replace(/<[^>]*>/g,"").trim() : "");
  return (
    <div style={s.richEditor}>
      <div style={s.richToolbar}>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("bold"); }} style={s.richBtn}><b>B</b></button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("italic"); }} style={s.richBtn}><i>I</i></button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }} style={s.richBtn}>• List</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }} style={s.richBtn}>1. List</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }} style={{ ...s.richBtn, color: "#e84949" }}>Clear</button>
      </div>
      <div style={{ position: "relative" }}>
        {isEmpty && <div style={s.richPlaceholder}>{placeholder || "Type here…"}</div>}
        <div ref={ref} contentEditable suppressContentEditableWarning onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }} style={s.richContent} />
      </div>
    </div>
  );
}
function AddBtn({ onClick, label, icon }) {
  return <button onClick={onClick} style={s.addBtn}>{icon} {label}</button>;
}
function AB({ color, icon, label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: disabled?"#888":color, color:"#fff", border:"none", borderRadius:7, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:disabled?"default":"pointer", display:"flex", alignItems:"center", gap:5 }}>
      {icon} {label}
    </button>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ms = {
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "20px" },
  modal:      { background: "#f0f2f7", borderRadius: 16, width: "100%", maxWidth: 860, margin: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.45)", overflow: "hidden", display: "flex", flexDirection: "column" },
  head:       { background: "#2563eb", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  body:       { overflowY: "auto", maxHeight: "88vh", padding: "22px 26px 30px" },
  saveBtn:    { background: "rgba(255,255,255,0.18)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "7px 15px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 },
  previewBtn: { background: "rgba(255,255,255,0.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "7px 15px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 },
  closeBtn:   { background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 7, color: "#fff", padding: "7px 11px", cursor: "pointer", fontSize: 16, fontWeight: 700 },
};
const s = {
  savedTag:   { background: "#dcfce7", color: "#15803d", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700 },
  section:    { background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 16, border: "1px solid #e8eaf0" },
  secHead:    { background: "#2563eb", display: "flex", alignItems: "center", gap: 10, padding: "12px 18px" },
  secIcon:    { color: "#fff", display: "flex", alignItems: "center", fontSize: 17 },
  secTitle:   { color: "#fff", fontWeight: 700, fontSize: 13.5, flex: 1, letterSpacing: 0.2 },
  secBody:    { padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 },
  divider:    { height: 1, background: "#f0f0f0", margin: "2px 0" },
  subHead:    { fontSize: 11.5, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.8 },
  label:      { display: "block", fontSize: 10.5, fontWeight: 700, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 },
  input:      { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13.5, outline: "none", boxSizing: "border-box", background: "#f9fafb", color: "#111", fontFamily: "'DM Sans', sans-serif" },
  card:       { background: "#f8f9fc", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "14px", display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 },
  cardHead:   { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardBadge:  { fontSize: 12.5, fontWeight: 700, color: "#374151" },
  removeBtn:  { display: "flex", alignItems: "center", gap: 4, background: "#fff2f2", color: "#e84949", border: "none", borderRadius: 6, padding: "4px 9px", fontSize: 11.5, fontWeight: 600, cursor: "pointer" },
  flightGrid: { display: "flex", gap: 10 },
  flightHalf: { flex: 1, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "12px", display: "flex", flexDirection: "column", gap: 9 },
  flightTitle:{ fontSize: 10.5, fontWeight: 800, color: "#e84949", letterSpacing: 1, marginBottom: 3 },
  addBtn:     { display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#eff6ff", color: "#2563eb", border: "1.5px dashed #93c5fd", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%" },
  btnDark:    { background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  btnBlue:    { background: "rgb(37 99 235 / 12%)", color: "rgb(37 99 235)", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  richEditor: { border: "1.5px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#f9fafb" },
  richToolbar:{ display: "flex", gap: 4, padding: "5px 9px", background: "#f0f4ff", borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" },
  richBtn:    { background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, padding: "3px 8px", fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#374151" },
  richContent:{ minHeight: 88, padding: "9px 11px", fontSize: 13.5, color: "#111", outline: "none", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" },
  richPlaceholder: { position: "absolute", top: 9, left: 11, fontSize: 13.5, color: "#9ca3af", pointerEvents: "none", userSelect: "none" },
};
