import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdAdd, MdDelete, MdSave, MdVisibility, MdClose,
  MdPrint, MdHotel, MdFlight, MdDirectionsCar, MdListAlt,
  MdCheckCircle, MdKeyboardArrowDown, MdKeyboardArrowUp,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

/* ── Constants ── */
const HOTEL_CATS    = ["Standard", "Deluxe", "Deluxe Family", "Premium", "Luxury"];
const TYPES         = ["Domestic", "International"];
const PKG_MODES     = ["Complete Package", "Individual Service"];
const STATUS_OPTS   = ["Open", "Won", "Lost"];
const STATUS_STYLE  = {
  Open: { bg: "#EFF4FF", color: "#1D4ED8" },
  Won:  { bg: "#EAF7EF", color: "#15803D" },
  Lost: { bg: "#FDECEE", color: "#BE123C" },
};

const EMPTY_FORM = {
  type: "Domestic",
  pkgMode: "Complete Package",
  days: "",
  travelDate: "",
  assignedTo: "",
  // Hotel
  hotelName: "", hotelCat: "Deluxe", hotelNights: "", hotelRooms: 1, hotelPrice: "",
  // Flight
  flightFrom: "", flightTo: "", flightDate: "", flightPax: 1, flightPrice: "",
  // Transfer
  transferCab: "", transferPerDay: "", transferDays: "",
  // Content
  itinerary: [],
  inclusions: "• Accommodation on double sharing basis\n• Daily breakfast\n• Sightseeing as per itinerary\n• All transfers by private cab",
  exclusions: "• Airfare / Train fare\n• Personal expenses\n• Any meals not mentioned\n• Tips and porterage",
  notes: "This quotation is valid for 7 days. Prices are subject to availability and may change without prior notice.",
  // Costing
  cost: "", margin: 20, gstPct: 5, tcsPct: 0, tripExpense: "",
  // Workflow
  status: "Open",
  lostReason: "",
};

/* ── Helpers ── */
function fmtINR(n) {
  if (!n && n !== 0) return "—";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
function Sect({ title, icon: Icon, open, onToggle, children }) {
  return (
    <div style={S.section}>
      <div style={S.sectHead} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Icon && <Icon size={17} color="#2563EB" />}
          <span style={{ fontWeight: 800, fontSize: 14, color: "#0F1B33" }}>{title}</span>
        </div>
        {open ? <MdKeyboardArrowUp size={20} color="#6B7A99" /> : <MdKeyboardArrowDown size={20} color="#6B7A99" />}
      </div>
      {open && <div style={S.sectBody}>{children}</div>}
    </div>
  );
}
function Field({ label, children, half }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...(half ? {} : {}) }}>
      <label style={S.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}
function Inp({ value, onChange, type = "text", placeholder, min, max, readOnly }) {
  return (
    <input type={type} value={value ?? ""} onChange={onChange} placeholder={placeholder}
      min={min} max={max} readOnly={readOnly}
      style={{ ...S.inp, ...(readOnly ? { background: "#F8FAFD", color: "#6B7A99" } : {}) }} />
  );
}
function Sel({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange} style={S.inp}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* ── Preview Component ── */
function QuotationPreview({ q, lead, pricing, onClose }) {
  const printRef = useRef();
  function doPrint() {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>Quotation ${q.quotationNo || ""}</title>
      <style>body{margin:0;font-family:'Segoe UI',Arial,sans-serif;color:#0f1b33}
      table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #e2e8f0;font-size:12px}
      th{background:#f6f8fc;font-weight:700}
      .no-print{display:none}@media print{.no-print{display:none}}
      h1{font-size:22px;margin:0}h2{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#64748b;margin:0 0 10px}
      p{margin:4px 0;font-size:13px}strong{font-weight:700}</style></head>
      <body>${printRef.current?.innerHTML || ""}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 400);
  }

  const itinerary = Array.isArray(q.itinerary) ? q.itinerary : [];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,18,38,.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "24px 12px" }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 820, boxShadow: "0 16px 60px rgba(0,0,0,.2)" }}>
        {/* Preview toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #E4E9F2", background: "#F8FAFD", borderRadius: "16px 16px 0 0" }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#0F1B33" }}>Quotation Preview</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={doPrint} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              <MdPrint size={16} /> Print / PDF
            </button>
            <button onClick={onClose} style={{ background: "#FDECEE", border: "none", borderRadius: 9, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#E8364A" }}>
              <MdClose size={18} />
            </button>
          </div>
        </div>

        {/* Document */}
        <div ref={printRef} style={{ padding: "36px 40px", fontSize: 13, color: "#0f1b33" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #EE4C49" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#EE4C49", letterSpacing: -1 }}>Tourwatchout</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>tourwatchout.com</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>QUOTATION</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#EE4C49", marginTop: 2 }}>{q.quotationNo || "DRAFT"}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</div>
            </div>
          </div>

          {/* Client + Trip info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#64748b", marginBottom: 8 }}>Prepared For</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{lead?.name || "—"}</div>
              {lead?.phone && <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>{lead.phone}</div>}
              {lead?.email && <div style={{ color: "#475569", fontSize: 12 }}>{lead.email}</div>}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#64748b", marginBottom: 8 }}>Trip Details</div>
              {lead?.destination && <div style={{ fontSize: 13 }}><strong>Destination:</strong> {lead.destination}</div>}
              {q.days && <div style={{ fontSize: 13 }}><strong>Duration:</strong> {q.days}</div>}
              {q.travelDate && <div style={{ fontSize: 13 }}><strong>Travel Date:</strong> {q.travelDate}</div>}
              {lead?.pax && <div style={{ fontSize: 13 }}><strong>Pax:</strong> {lead.pax}</div>}
              <div style={{ fontSize: 13 }}><strong>Type:</strong> {q.type} · {q.pkgMode}</div>
            </div>
          </div>

          {/* Services */}
          {(q.hotelName || q.flightFrom || q.transferCab) && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#64748b", marginBottom: 10 }}>Services Included</div>
              <table>
                <thead>
                  <tr><th style={{ textAlign: "left" }}>Service</th><th style={{ textAlign: "left" }}>Details</th></tr>
                </thead>
                <tbody>
                  {q.hotelName && (
                    <tr>
                      <td><strong>Hotel</strong></td>
                      <td>{q.hotelName} ({q.hotelCat}) · {q.hotelNights} nights · {q.hotelRooms} room(s)</td>
                    </tr>
                  )}
                  {q.flightFrom && (
                    <tr>
                      <td><strong>Flight</strong></td>
                      <td>{q.flightFrom} → {q.flightTo}{q.flightDate ? ` · ${q.flightDate}` : ""} · {q.flightPax} pax</td>
                    </tr>
                  )}
                  {q.transferCab && (
                    <tr>
                      <td><strong>Transfer</strong></td>
                      <td>{q.transferCab}{q.transferDays ? ` · ${q.transferDays} days` : ""}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#64748b", marginBottom: 10 }}>Day-by-Day Itinerary</div>
              {itinerary.map((day, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, background: "#EE4C49", color: "#fff", borderRadius: "50%", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{day.title || `Day ${i + 1}`}</div>
                    {day.description && <div style={{ fontSize: 12, color: "#475569", marginTop: 3, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{day.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inclusions / Exclusions */}
          {(q.inclusions || q.exclusions) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              {q.inclusions && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#64748b", marginBottom: 8 }}>Inclusions</div>
                  <div style={{ fontSize: 12, color: "#1a2940", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{q.inclusions}</div>
                </div>
              )}
              {q.exclusions && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#64748b", marginBottom: 8 }}>Exclusions</div>
                  <div style={{ fontSize: 12, color: "#1a2940", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{q.exclusions}</div>
                </div>
              )}
            </div>
          )}

          {/* Pricing */}
          <div style={{ background: "#f8fafc", borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 24 }}>
            <div style={{ background: "#EE4C49", color: "#fff", padding: "10px 16px", fontWeight: 800, fontSize: 13 }}>Pricing Summary</div>
            <table style={{ margin: 0 }}>
              <tbody>
                <tr><td>Selling Price</td><td style={{ textAlign: "right", fontWeight: 700 }}>{fmtINR(pricing.sellingPrice)}</td></tr>
                {pricing.gstAmount > 0 && <tr><td>GST ({q.gstPct}%)</td><td style={{ textAlign: "right" }}>{fmtINR(pricing.gstAmount)}</td></tr>}
                {pricing.tcsAmount > 0 && <tr><td>TCS ({q.tcsPct}%)</td><td style={{ textAlign: "right" }}>{fmtINR(pricing.tcsAmount)}</td></tr>}
                {pricing.tripExpense > 0 && <tr><td>Additional Expenses</td><td style={{ textAlign: "right" }}>{fmtINR(pricing.tripExpense)}</td></tr>}
                <tr style={{ background: "#0f1b33", color: "#fff" }}>
                  <td style={{ fontWeight: 800, fontSize: 14, border: "none" }}>Grand Total</td>
                  <td style={{ textAlign: "right", fontWeight: 900, fontSize: 16, border: "none" }}>{fmtINR(pricing.grandTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          {q.notes && (
            <div style={{ background: "#EFF4FF", border: "1px solid #BFD3FE", borderRadius: 8, padding: "12px 16px", marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "#1D4ED8", marginBottom: 6 }}>Important Notes</div>
              <div style={{ fontSize: 12, color: "#1D4ED8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{q.notes}</div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid #e2e8f0", color: "#94a3b8", fontSize: 11 }}>
            Tourwatchout · tourwatchout.com · This quotation was prepared exclusively for the above client.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function CreateQuotation() {
  const router = useRouter();
  const { leadId, qid } = router.query;
  const openSidebar = useOpenSidebar();

  const [lead, setLead] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [quotationId, setQuotationId] = useState(null);
  const [quotationNo, setQuotationNo] = useState("");
  const [salespeople, setSalespeople] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [open, setOpen] = useState({ trip: true, hotel: true, flight: false, transfer: false, itinerary: true, content: true, costing: true, workflow: true });

  useEffect(() => {
    fetch("/api/dashboard/salesperson").then(r => r.json()).then(d => setSalespeople(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (qid) {
      fetch(`/api/dashboard/quotations/${qid}`)
        .then(r => r.json())
        .then(data => {
          if (data._id) {
            setLead(data.leadId || null);
            setQuotationId(data._id);
            setQuotationNo(data.quotationNo || "");
            const { leadId: _l, quotationNo: _n, _id: _i, __v: _v, createdAt: _c, updatedAt: _u, ...rest } = data;
            setForm(f => ({ ...EMPTY_FORM, ...rest, assignedTo: rest.assignedTo?._id || rest.assignedTo || "" }));
          }
        }).catch(() => {});
    } else if (leadId) {
      fetch(`/api/dashboard/leads/${leadId}`)
        .then(r => r.json())
        .then(d => {
          if (d._id) {
            setLead(d);
            setForm(f => ({ ...f, travelDate: d.travelDate || "", assignedTo: d.assignedTo?._id || "" }));
          }
        }).catch(() => {});
    }
  }, [router.isReady, qid, leadId]);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  }
  function toggle(key) {
    setOpen(o => ({ ...o, [key]: !o[key] }));
  }

  const pricing = useMemo(() => {
    const cost = Number(form.cost) || 0;
    const sell = cost * (1 + (Number(form.margin) || 0) / 100);
    const gstAmt = sell * (Number(form.gstPct) || 0) / 100;
    const tcsAmt = sell * (Number(form.tcsPct) || 0) / 100;
    const tripExp = Number(form.tripExpense) || 0;
    return {
      cost, sellingPrice: sell, gstAmount: gstAmt, tcsAmount: tcsAmt,
      tripExpense: tripExp, grandTotal: sell + gstAmt + tcsAmt + tripExp,
    };
  }, [form.cost, form.margin, form.gstPct, form.tcsPct, form.tripExpense]);

  async function save() {
    if (!lead) return alert("Please link a lead first.");
    setSaving(true);
    try {
      const body = {
        leadId: lead._id || lead,
        ...form,
        hotelNights: Number(form.hotelNights) || 0,
        hotelRooms: Number(form.hotelRooms) || 1,
        hotelPrice: Number(form.hotelPrice) || 0,
        flightPax: Number(form.flightPax) || 1,
        flightPrice: Number(form.flightPrice) || 0,
        transferPerDay: Number(form.transferPerDay) || 0,
        transferDays: Number(form.transferDays) || 0,
        cost: Number(form.cost) || 0,
        margin: Number(form.margin) || 0,
        gstPct: Number(form.gstPct) || 0,
        tcsPct: Number(form.tcsPct) || 0,
        tripExpense: Number(form.tripExpense) || 0,
        assignedTo: form.assignedTo || null,
      };

      const method = quotationId ? "PATCH" : "POST";
      const url = quotationId ? `/api/dashboard/quotations/${quotationId}` : "/api/dashboard/quotations";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await r.json();
      if (r.ok) {
        setQuotationId(data._id);
        setQuotationNo(data.quotationNo || "");
        setSaved(true);
        if (!quotationId) router.replace(`/dashboard/create-quotation?qid=${data._id}`, undefined, { shallow: true });
      }
    } finally { setSaving(false); }
  }

  /* Itinerary helpers */
  function addDay() { set("itinerary", [...form.itinerary, { title: "", description: "" }]); }
  function removeDay(i) { set("itinerary", form.itinerary.filter((_, idx) => idx !== i)); }
  function setDay(i, key, val) {
    set("itinerary", form.itinerary.map((d, idx) => idx === i ? { ...d, [key]: val } : d));
  }

  const ss = STATUS_STYLE[form.status] || STATUS_STYLE.Open;

  return (
    <>
      <Head><title>{quotationNo ? `Quotation ${quotationNo}` : "New Quotation"} — Tourwatchout</title></Head>

      {showPreview && lead && (
        <QuotationPreview
          q={{ ...form, quotationNo }}
          lead={lead}
          pricing={pricing}
          onClose={() => setShowPreview(false)}
        />
      )}

      <DashboardLayout active="Quotation">
        <div style={S.page}>

          {/* Header */}
          <div style={S.header}>
            <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={S.title}>{quotationNo || "New Quotation"}</h1>
                <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 800, background: ss.bg, color: ss.color }}>
                  {form.status}
                </span>
                {saved && <span style={{ fontSize: 12, color: "#15803D", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><MdCheckCircle size={15} /> Saved</span>}
              </div>
              {lead && <div style={{ fontSize: 12, color: "#6B7A99", marginTop: 2 }}>{lead.name} · {lead.destination || "—"} · {lead.phone}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button style={S.outBtn} onClick={() => setShowPreview(true)} disabled={!lead}>
                <MdVisibility size={16} /> Preview
              </button>
              <button style={{ ...S.addBtn, opacity: saving ? 0.7 : 1 }} onClick={save} disabled={saving}>
                <MdSave size={16} /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          <div style={S.layout}>
            {/* ── Left: form ── */}
            <div style={S.formCol}>

              {/* Lead info (read-only) */}
              {lead ? (
                <div style={S.section}>
                  <div style={S.sectHead}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: "#0F1B33" }}>Lead</span>
                    </div>
                    <button style={S.changeLead}
                      onClick={() => router.push("/dashboard/quotations")}>
                      ← Back to list
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, padding: "14px 16px" }}>
                    {[["Name", lead.name], ["Phone", lead.phone], ["Email", lead.email], ["Destination", lead.destination || "—"], ["Travel Date", lead.travelDate || "—"], ["Pax", lead.pax || "—"]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "#94A3B8", marginBottom: 2 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1B33" }}>{v || "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ ...S.section, padding: 20, textAlign: "center" }}>
                  <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 10 }}>No lead linked. Go back and select a lead.</div>
                  <button style={S.addBtn} onClick={() => router.push("/dashboard/quotations")}>← Back to Quotations</button>
                </div>
              )}

              {/* Trip Details */}
              <Sect title="Trip Details" open={open.trip} onToggle={() => toggle("trip")}>
                <div style={S.grid2}>
                  <Field label="Package Type">
                    <Sel value={form.type} onChange={e => set("type", e.target.value)} options={TYPES} />
                  </Field>
                  <Field label="Package Mode">
                    <Sel value={form.pkgMode} onChange={e => set("pkgMode", e.target.value)} options={PKG_MODES} />
                  </Field>
                  <Field label="Duration (e.g. 5N/6D)">
                    <Inp value={form.days} onChange={e => set("days", e.target.value)} placeholder="5N/6D" />
                  </Field>
                  <Field label="Travel Date">
                    <Inp type="text" value={form.travelDate} onChange={e => set("travelDate", e.target.value)} placeholder="e.g. 15 Jun 2025" />
                  </Field>
                  <Field label="Assign To">
                    <select style={S.inp} value={form.assignedTo} onChange={e => set("assignedTo", e.target.value)}>
                      <option value="">Unassigned</option>
                      {salespeople.map(sp => <option key={sp._id} value={sp._id}>{sp.name}</option>)}
                    </select>
                  </Field>
                </div>
              </Sect>

              {/* Hotel */}
              <Sect title="Hotel" icon={MdHotel} open={open.hotel} onToggle={() => toggle("hotel")}>
                <div style={S.grid2}>
                  <Field label="Hotel Name">
                    <Inp value={form.hotelName} onChange={e => set("hotelName", e.target.value)} placeholder="e.g. The Grand Palace" />
                  </Field>
                  <Field label="Category">
                    <Sel value={form.hotelCat} onChange={e => set("hotelCat", e.target.value)} options={HOTEL_CATS} />
                  </Field>
                  <Field label="No. of Nights">
                    <Inp type="number" value={form.hotelNights} onChange={e => set("hotelNights", e.target.value)} placeholder="3" min="0" />
                  </Field>
                  <Field label="No. of Rooms">
                    <Inp type="number" value={form.hotelRooms} onChange={e => set("hotelRooms", e.target.value)} placeholder="1" min="1" />
                  </Field>
                  <Field label="Price per Night (₹)">
                    <Inp type="number" value={form.hotelPrice} onChange={e => set("hotelPrice", e.target.value)} placeholder="0" min="0" />
                  </Field>
                  <Field label="Total Hotel Cost (auto)">
                    <Inp readOnly value={fmtINR((Number(form.hotelPrice) || 0) * (Number(form.hotelNights) || 0) * (Number(form.hotelRooms) || 1))} />
                  </Field>
                </div>
              </Sect>

              {/* Flight */}
              <Sect title="Flight" icon={MdFlight} open={open.flight} onToggle={() => toggle("flight")}>
                <div style={S.grid2}>
                  <Field label="From">
                    <Inp value={form.flightFrom} onChange={e => set("flightFrom", e.target.value)} placeholder="Delhi (DEL)" />
                  </Field>
                  <Field label="To">
                    <Inp value={form.flightTo} onChange={e => set("flightTo", e.target.value)} placeholder="Srinagar (SXR)" />
                  </Field>
                  <Field label="Date">
                    <Inp value={form.flightDate} onChange={e => set("flightDate", e.target.value)} placeholder="15 Jun 2025" />
                  </Field>
                  <Field label="No. of Pax">
                    <Inp type="number" value={form.flightPax} onChange={e => set("flightPax", e.target.value)} placeholder="2" min="1" />
                  </Field>
                  <Field label="Total Flight Price (₹)">
                    <Inp type="number" value={form.flightPrice} onChange={e => set("flightPrice", e.target.value)} placeholder="0" min="0" />
                  </Field>
                </div>
              </Sect>

              {/* Transfer */}
              <Sect title="Transfer / Cab" icon={MdDirectionsCar} open={open.transfer} onToggle={() => toggle("transfer")}>
                <div style={S.grid2}>
                  <Field label="Cab Type">
                    <Inp value={form.transferCab} onChange={e => set("transferCab", e.target.value)} placeholder="Innova Crysta" />
                  </Field>
                  <Field label="Rate per Day (₹)">
                    <Inp type="number" value={form.transferPerDay} onChange={e => set("transferPerDay", e.target.value)} placeholder="0" min="0" />
                  </Field>
                  <Field label="No. of Days">
                    <Inp type="number" value={form.transferDays} onChange={e => set("transferDays", e.target.value)} placeholder="0" min="0" />
                  </Field>
                  <Field label="Total Transfer Cost (auto)">
                    <Inp readOnly value={fmtINR((Number(form.transferPerDay) || 0) * (Number(form.transferDays) || 0))} />
                  </Field>
                </div>
              </Sect>

              {/* Itinerary */}
              <Sect title="Day-by-Day Itinerary" icon={MdListAlt} open={open.itinerary} onToggle={() => toggle("itinerary")}>
                {form.itinerary.map((day, i) => (
                  <div key={i} style={{ border: "1px solid #E4E9F2", borderRadius: 10, padding: "12px 14px", marginBottom: 10, background: "#FBFCFE" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 24, height: 24, background: "#EE4C49", color: "#fff", borderRadius: "50%", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <input style={{ ...S.inp, flex: 1 }} placeholder={`Day ${i + 1} title…`}
                        value={day.title} onChange={e => setDay(i, "title", e.target.value)} />
                      <button style={{ background: "#FDECEE", border: "1px solid #FECACA", borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#E8364A", flexShrink: 0 }}
                        onClick={() => removeDay(i)} title="Remove day">
                        <MdDelete size={14} />
                      </button>
                    </div>
                    <textarea style={{ ...S.inp, minHeight: 72, resize: "vertical" }}
                      placeholder="Describe the day's activities…"
                      value={day.description} onChange={e => setDay(i, "description", e.target.value)} />
                  </div>
                ))}
                <button style={S.addDayBtn} onClick={addDay}>
                  <MdAdd size={16} /> Add Day
                </button>
              </Sect>

              {/* Inclusions / Exclusions / Notes */}
              <Sect title="Inclusions, Exclusions & Notes" open={open.content} onToggle={() => toggle("content")}>
                <Field label="Inclusions">
                  <textarea style={{ ...S.inp, minHeight: 100, resize: "vertical" }}
                    value={form.inclusions} onChange={e => set("inclusions", e.target.value)} />
                </Field>
                <div style={{ height: 12 }} />
                <Field label="Exclusions">
                  <textarea style={{ ...S.inp, minHeight: 100, resize: "vertical" }}
                    value={form.exclusions} onChange={e => set("exclusions", e.target.value)} />
                </Field>
                <div style={{ height: 12 }} />
                <Field label="Notes / Terms">
                  <textarea style={{ ...S.inp, minHeight: 72, resize: "vertical" }}
                    value={form.notes} onChange={e => set("notes", e.target.value)} />
                </Field>
              </Sect>

              {/* Costing */}
              <Sect title="Costing (Internal)" open={open.costing} onToggle={() => toggle("costing")}>
                <div style={{ background: "#EFF4FF", border: "1px solid #BFD3FE", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 12, color: "#1D4ED8" }}>
                  💡 Costing details are internal only — not shown in the client-facing preview.
                </div>
                <div style={S.grid2}>
                  <Field label="Base Cost (₹)">
                    <Inp type="number" value={form.cost} onChange={e => set("cost", e.target.value)} placeholder="0" min="0" />
                  </Field>
                  <Field label="Margin (%)">
                    <Inp type="number" value={form.margin} onChange={e => set("margin", e.target.value)} placeholder="20" min="0" max="100" />
                  </Field>
                  <Field label="GST (%)">
                    <Inp type="number" value={form.gstPct} onChange={e => set("gstPct", e.target.value)} placeholder="5" min="0" />
                  </Field>
                  <Field label="TCS (%)">
                    <Inp type="number" value={form.tcsPct} onChange={e => set("tcsPct", e.target.value)} placeholder="0" min="0" />
                  </Field>
                  <Field label="Trip Expense (₹)">
                    <Inp type="number" value={form.tripExpense} onChange={e => set("tripExpense", e.target.value)} placeholder="0" min="0" />
                  </Field>
                </div>
              </Sect>

              {/* Workflow */}
              <Sect title="Workflow" open={open.workflow} onToggle={() => toggle("workflow")}>
                <div style={S.grid2}>
                  <Field label="Status">
                    <select style={{ ...S.inp, background: ss.bg, color: ss.color, fontWeight: 700 }}
                      value={form.status} onChange={e => set("status", e.target.value)}>
                      {STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                  {form.status === "Lost" && (
                    <Field label="Reason for Loss">
                      <Inp value={form.lostReason} onChange={e => set("lostReason", e.target.value)} placeholder="e.g. Budget too high" />
                    </Field>
                  )}
                </div>
              </Sect>
            </div>

            {/* ── Right: sticky pricing ── */}
            <div style={S.sideCol}>
              <div style={S.priceCard}>
                <div style={S.priceHead}>Cost Summary</div>

                <PRow label="Base Cost" val={fmtINR(pricing.cost)} />
                <PRow label={`Margin (${form.margin}%)`} val={fmtINR(pricing.sellingPrice - pricing.cost)} />
                <div style={{ borderTop: "1px dashed #E4E9F2", margin: "10px 0" }} />
                <PRow label="Selling Price" val={fmtINR(pricing.sellingPrice)} bold />
                {pricing.gstAmount > 0 && <PRow label={`GST (${form.gstPct}%)`} val={fmtINR(pricing.gstAmount)} />}
                {pricing.tcsAmount > 0 && <PRow label={`TCS (${form.tcsPct}%)`} val={fmtINR(pricing.tcsAmount)} />}
                {pricing.tripExpense > 0 && <PRow label="Trip Expense" val={fmtINR(pricing.tripExpense)} />}
                <div style={{ borderTop: "2px solid #0F1B33", margin: "12px 0 10px" }} />
                <PRow label="Grand Total" val={fmtINR(pricing.grandTotal)} big />

                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  <button style={{ ...S.addBtn, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
                    onClick={save} disabled={saving}>
                    <MdSave size={16} /> {saving ? "Saving…" : "Save Quotation"}
                  </button>
                  <button style={S.outBtn} onClick={() => setShowPreview(true)} disabled={!lead}>
                    <MdVisibility size={16} /> Preview / Print
                  </button>
                </div>

                {/* Hotel / Flight / Transfer breakdown */}
                {(Number(form.hotelPrice) > 0 || Number(form.flightPrice) > 0 || Number(form.transferPerDay) > 0) && (
                  <div style={{ marginTop: 20, borderTop: "1px solid #E4E9F2", paddingTop: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "#94A3B8", marginBottom: 8 }}>Service Costs</div>
                    {Number(form.hotelPrice) > 0 && (
                      <PRow label="Hotel" val={fmtINR((Number(form.hotelPrice) || 0) * (Number(form.hotelNights) || 0) * (Number(form.hotelRooms) || 1))} small />
                    )}
                    {Number(form.flightPrice) > 0 && (
                      <PRow label="Flight" val={fmtINR(Number(form.flightPrice))} small />
                    )}
                    {Number(form.transferPerDay) > 0 && (
                      <PRow label="Transfer" val={fmtINR((Number(form.transferPerDay) || 0) * (Number(form.transferDays) || 0))} small />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

function PRow({ label, val, bold, big, small }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: big ? 0 : 7, padding: big ? "6px 0" : 0 }}>
      <span style={{ fontSize: small ? 11 : 13, color: big ? "#0F1B33" : "#6B7A99", fontWeight: big ? 800 : bold ? 700 : 500 }}>{label}</span>
      <span style={{ fontSize: big ? 17 : small ? 12 : 14, fontWeight: big ? 900 : bold ? 700 : 600, color: big ? "#EE4C49" : "#0F1B33" }}>{val}</span>
    </div>
  );
}

const S = {
  page:       { padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" },
  header:     { display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  title:      { fontSize: "1.2rem", fontWeight: 900, color: "#0F1B33", margin: 0, letterSpacing: "-.01em" },
  layout:     { display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" },
  formCol:    { display: "flex", flexDirection: "column", gap: 14, minWidth: 0 },
  sideCol:    { position: "sticky", top: 20 },
  section:    { background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, boxShadow: "0 1px 4px rgba(15,27,51,.05)", overflow: "hidden" },
  sectHead:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", cursor: "pointer", background: "#FAFBFD", borderBottom: "1px solid #E4E9F2", userSelect: "none" },
  sectBody:   { padding: "16px" },
  grid2:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  fieldLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6B7A99" },
  inp:        { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#F8FAFD", fontFamily: "inherit", transition: "border .15s" },
  addDayBtn:  { display: "inline-flex", alignItems: "center", gap: 6, background: "#EFF4FF", color: "#1D4ED8", border: "1px solid #BFD3FE", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 6 },
  priceCard:  { background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, padding: "18px 16px", boxShadow: "0 1px 8px rgba(15,27,51,.08)" },
  priceHead:  { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#94A3B8", marginBottom: 14 },
  addBtn:     { display: "inline-flex", alignItems: "center", gap: 6, background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, padding: "0 16px", height: 36, fontWeight: 700, fontSize: 14, cursor: "pointer" },
  outBtn:     { display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", color: "#2563EB", border: "1px solid #BFD3FE", borderRadius: 9, padding: "0 16px", height: 36, fontWeight: 700, fontSize: 14, cursor: "pointer", justifyContent: "center" },
  changeLead: { fontSize: 12, color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 700 },
};
