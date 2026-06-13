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

const DEF_HOTEL    = { name: "", roomCat: "Deluxe", nights: "", rooms: "", price: "" };
const DEF_FLIGHT   = { from: "", to: "", date: "", pax: "", price: "" };
const DEF_TRANSFER = { cab: "", perDay: "", days: "" };

const toN = (v, d = 0) => (v === "" || v === undefined || v === null) ? d : (+v || d);

const DEF_FORM = {
  type: "Domestic", pkgMode: "Complete Package",
  days: "", travelDate: "", assignedTo: "",
  inclusions: "", exclusions: "",
  notes: "This is an initial quote based on our most popular holiday package to your chosen destination.",
  cost: "", margin: "", gstPct: 5, tcsPct: 0, tripExpense: 0,
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
    const pax = (brr.adults || 0) + (brr.children || 0);
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
    ? { ...DEF_FORM, ...initialData, assignedTo: initialData.assignedTo?._id || initialData.assignedTo || "" }
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
  const [itin,       setItin]       = useState(() => initItin(initialData));
  const [saving,     setSaving]     = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [preview,    setPreview]    = useState(false);

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
  const flightTotal   = flights.reduce((s, f) => s + (+f.price || 0), 0);
  const transferTotal = transfers.reduce((s, t) => s + (+t.perDay || 0) * (+t.days || 0), 0);

  /* ── save ── */
  async function save() {
    setSaving(true);
    try {
      const newVer = { v: (initialData?.versions?.length || 0) + 1, date: todayISO(), cost: toN(form.cost), margin: toN(form.margin), note: isNew ? "First quote created" : "Quote revised" };
      const body = {
        ...form,
        cost: toN(form.cost), margin: toN(form.margin), gstPct: toN(form.gstPct, 5), tcsPct: toN(form.tcsPct),
        hotels: hotels.map(h => ({ name: h.name, roomCat: h.roomCat, nights: toN(h.nights), rooms: toN(h.rooms, 1), price: toN(h.price) })),
        flights: flights.map(f => ({ from: f.from, to: f.to, date: f.date, pax: toN(f.pax), price: toN(f.price) })),
        transfers: transfers.map(t => ({ cab: t.cab, perDay: toN(t.perDay), days: toN(t.days) })),
        itinerary: itin.map(({ _k, ...rest }) => rest),
        versions: [...(initialData?.versions || []), newVer],
      };
      let res;
      if (isNew) {
        body.leadId = lead._id;
        res = await fetch("/api/dashboard/quotations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        res = await fetch(`/api/dashboard/quotations/${initialData._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      if (res.ok) { onSaved?.(await res.json()); onClose(); }
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
      const patch = doc => { const st = doc.createElement("style"); st.textContent = "* { font-family: Arial, Helvetica, sans-serif !important; }"; doc.head.appendChild(st); };
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff", logging: false, height: el.scrollHeight, windowHeight: el.scrollHeight, onclone: patch });
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
      const pxPerMm = canvas.width / pageW, pagePx = pageH * pxPerMm;
      let yPx = 0, first = true;
      while (yPx < canvas.height) {
        if (!first) pdf.addPage();
        first = false;
        const h = Math.min(pagePx, canvas.height - yPx);
        const sl = document.createElement("canvas"); sl.width = canvas.width; sl.height = h;
        sl.getContext("2d").drawImage(canvas, 0, yPx, canvas.width, h, 0, 0, canvas.width, h);
        pdf.addImage(sl.toDataURL("image/png"), "PNG", 0, 0, pageW, h / pxPerMm);
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
            <button style={QS.x} onClick={onClose}>✕</button>
          </div>

          {/* Body */}
          <div style={QS.body}>

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

            {/* ── Hotels ── */}
            <Sec
              label="🏨  Hotel Details"
              right={
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Customer side</span>
                  {hotels.length < 3 && (
                    <button onClick={() => addRow(setHotels, DEF_HOTEL)}
                      style={QS.addRowBtn}>+ Add Hotel</button>
                  )}
                </div>
              }
            >
              {hotels.map((h, i) => (
                <div key={i} style={QS.rowBox}>
                  {hotels.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setHotels, i)}>✕</button>}
                  {hotels.length > 1 && <div style={QS.rowLabel}>Hotel {i + 1}</div>}
                  <div style={{ ...G3, marginBottom: 10 }}>
                    <Fl l="Select Hotel">
                      <input style={QS.inp} placeholder="Hotel name, city" value={h.name} onChange={e => updArr(setHotels, i, "name", e.target.value)} />
                    </Fl>
                    <Fl l="Room Category">
                      <select style={QS.inp} value={h.roomCat} onChange={e => updArr(setHotels, i, "roomCat", e.target.value)}>
                        {ROOM_CATS.map(r => <option key={r}>{r}</option>)}
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
            </Sec>

            {/* ── Flights ── */}
            <Sec
              label="✈️  Flight Details"
              right={
                flights.length < 3 && (
                  <button onClick={() => addRow(setFlights, DEF_FLIGHT)} style={QS.addRowBtn}>+ Add Flight</button>
                )
              }
            >
              {flights.map((f, i) => (
                <div key={i} style={QS.rowBox}>
                  {flights.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setFlights, i)}>✕</button>}
                  {flights.length > 1 && <div style={QS.rowLabel}>Flight {i + 1}</div>}
                  <div style={G4}>
                    <Fl l="From">
                      <input style={QS.inp} placeholder="Delhi" value={f.from} onChange={e => updArr(setFlights, i, "from", e.target.value)} />
                    </Fl>
                    <Fl l="To">
                      <input style={QS.inp} placeholder="Srinagar" value={f.to} onChange={e => updArr(setFlights, i, "to", e.target.value)} />
                    </Fl>
                    <Fl l="Pax">
                      <input type="number" style={QS.inp} value={f.pax} onChange={e => updArr(setFlights, i, "pax", e.target.value)} />
                    </Fl>
                    <Fl l="Total Fare (₹)">
                      <input type="number" style={QS.inp} value={f.price} onChange={e => updArr(setFlights, i, "price", e.target.value)} />
                    </Fl>
                  </div>
                </div>
              ))}
              {flights.length > 1 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>
                  Combined Flight Total: {inr(flightTotal)}
                </div>
              )}
            </Sec>

            {/* ── Transfers ── */}
            <Sec
              label="🚐  Transfer"
              right={
                transfers.length < 3 && (
                  <button onClick={() => addRow(setTransfers, DEF_TRANSFER)} style={QS.addRowBtn}>+ Add Transfer</button>
                )
              }
            >
              {transfers.map((t, i) => (
                <div key={i} style={QS.rowBox}>
                  {transfers.length > 1 && <button style={QS.remBtn} onClick={() => remRow(setTransfers, i)}>✕</button>}
                  {transfers.length > 1 && <div style={QS.rowLabel}>Transfer {i + 1}</div>}
                  <div style={G3}>
                    <Fl l="Cab Type">
                      <input style={QS.inp} placeholder="Innova Crysta" value={t.cab} onChange={e => updArr(setTransfers, i, "cab", e.target.value)} />
                    </Fl>
                    <Fl l="Price / Day (₹)">
                      <input type="number" style={QS.inp} value={t.perDay} onChange={e => updArr(setTransfers, i, "perDay", e.target.value)} />
                    </Fl>
                    <Fl l="Days">
                      <input type="number" style={QS.inp} value={t.days} onChange={e => updArr(setTransfers, i, "days", e.target.value)} />
                    </Fl>
                  </div>
                </div>
              ))}
              {transfers.length > 1 && (
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#B45309", marginTop: 4 }}>
                  Combined Transfer Total: {inr(transferTotal)}
                </div>
              )}
            </Sec>

            {/* ── Itinerary ── */}
            <Sec
              label="📅  Day-wise Itinerary"
              right={
                <button onClick={() => setItin(p => [...p, DEF_ITIN()])}
                  style={QS.addRowBtn}>+ Add Another Day</button>
              }
            >
              {itin.map((d, i) => (
                <div key={d._k} style={{ ...QS.rowBox, padding: "12px 40px 12px 12px" }}>
                  {itin.length > 1 && <button style={QS.remBtn} onClick={() => setItin(p => p.filter((_, j) => j !== i))}>✕</button>}
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>📅 Day {i + 1}</div>
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
                  <div style={{ ...G2, marginBottom: 10 }}>
                    <Fl l="Tour / Activity">
                      <input style={QS.inp} placeholder="e.g. Airport Pick-up" value={d.tour || ""}
                        onChange={e => setItin(p => p.map((x, j) => j === i ? { ...x, tour: e.target.value } : x))} />
                    </Fl>
                    <Fl l="Transfer Type">
                      <input style={QS.inp} placeholder="e.g. PVT / NA" value={d.transfer || ""}
                        onChange={e => setItin(p => p.map((x, j) => j === i ? { ...x, transfer: e.target.value } : x))} />
                    </Fl>
                  </div>
                  <Fl l="Pick-up Time">
                    <input style={QS.inp} placeholder="e.g. 1:30 AM" value={d.pickup_time || ""}
                      onChange={e => setItin(p => p.map((x, j) => j === i ? { ...x, pickup_time: e.target.value } : x))} />
                  </Fl>
                  <div style={{ marginTop: 10 }}>
                    <Fl l="Itinerary Details">
                      <RTE
                        value={toRichText(d.itinerary || "")}
                        onChange={v => setItin(p => p.map((x, j) => j === i ? { ...x, itinerary: v } : x))}
                        placeholder="Describe what happens this day…"
                      />
                    </Fl>
                  </div>
                </div>
              ))}
            </Sec>

            {/* ── Inclusions / Exclusions / Notes ── */}
            <Sec label="📝  Inclusions, Exclusions and Notes">
              <div style={{ ...G2, marginBottom: 12 }}>
                <Fl l="Inclusions">
                  <RTE
                    value={toRichText(form.inclusions || "")}
                    onChange={v => upd("inclusions", v)}
                    placeholder="List what's included in the package…"
                  />
                </Fl>
                <Fl l="Exclusions">
                  <RTE
                    value={toRichText(form.exclusions || "")}
                    onChange={v => upd("exclusions", v)}
                    placeholder="List what's not included…"
                  />
                </Fl>
              </div>
              <Fl l="Special Notes (shown on quote PDF)">
                <textarea style={{ ...QS.inp, minHeight: 54, resize: "vertical" }} value={form.notes} onChange={e => upd("notes", e.target.value)} />
              </Fl>
            </Sec>

            {/* ── Company Side ── */}
            <div style={{ border: "2px solid #E8364A", borderRadius: 12, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ background: "#E8364A", color: "#fff", fontWeight: 700, fontSize: 14, padding: "9px 14px" }}>
                🔒 Company Side · Internal Only, never printed on the customer PDF
              </div>
              <div style={{ background: "#fff", padding: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${intl ? 4 : 3}, 1fr)`, gap: 12, marginBottom: 14 }}>
                  <Fl l="Cost Price (₹)"><input type="number" style={QS.inp} value={form.cost} onChange={e => upd("cost", e.target.value)} /></Fl>
                  <Fl l="Margin (₹)"><input type="number" style={QS.inp} value={form.margin} onChange={e => upd("margin", e.target.value)} /></Fl>
                  <Fl l="GST %"><input type="number" style={QS.inp} value={form.gstPct} onChange={e => upd("gstPct", e.target.value)} /></Fl>
                  {intl && (
                    <Fl l="TCS % (Intl only)">
                      <select style={QS.inp} value={form.tcsPct} onChange={e => upd("tcsPct", +e.target.value)}>
                        <option value={5}>5% (up to ₹7L)</option>
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
          </div>

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
                data={{ quoteId: quoteDisplayId, lead, form, hotels, flights, transfers, itin, selling: c.selling }}
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
function CR({ l, v, vc }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 2px", borderBottom: "1px dashed #E4E9F2" }}><span style={{ color: "#36415A" }}>{l}</span><b style={{ color: vc || "#0F1B33" }}>{v}</b></div>;
}
function RTE({ value, onChange, placeholder }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.innerHTML = value || ""; }, []);
  const exec = cmd => { document.execCommand(cmd, false, null); if (ref.current) onChange(ref.current.innerHTML); ref.current?.focus(); };
  const isEmpty = !(value ? value.replace(/<[^>]*>/g, "").trim() : "");
  return (
    <div style={{ border: "1.5px solid #E4E9F2", borderRadius: 9, overflow: "hidden", background: "#F8FAFD" }}>
      <div style={{ display: "flex", gap: 4, padding: "5px 9px", background: "#EFF4FF", borderBottom: "1px solid #E4E9F2", flexWrap: "wrap" }}>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("bold"); }} style={QS.rteBtn}><b>B</b></button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("italic"); }} style={QS.rteBtn}><i>I</i></button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }} style={QS.rteBtn}>• List</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }} style={QS.rteBtn}>1. List</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }} style={{ ...QS.rteBtn, color: "#BE123C" }}>Clear</button>
      </div>
      <div style={{ position: "relative" }}>
        {isEmpty && <div style={{ position: "absolute", top: 9, left: 11, fontSize: 13, color: "#9ca3af", pointerEvents: "none", userSelect: "none" }}>{placeholder || "Type here…"}</div>}
        <div ref={ref} contentEditable suppressContentEditableWarning onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
          style={{ minHeight: 80, padding: "9px 11px", fontSize: 13, color: "#0F1B33", outline: "none", lineHeight: 1.7, fontFamily: "inherit" }} />
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
  rteBtn:    { background: "#fff", border: "1px solid #D1D5DB", borderRadius: 4, padding: "3px 8px", fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#374151" },
};

export { calcQ, gradeColor, inr as inrFmt };
