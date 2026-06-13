import React, { useState } from "react";

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
const DEF = {
  type: "Domestic", pkgMode: "Complete Package",
  days: "", travelDate: "", assignedTo: "",
  hotelName: "", hotelCat: "Deluxe", hotelNights: 4, hotelRooms: 1, hotelPrice: 0,
  flightFrom: "", flightTo: "", flightDate: "", flightPax: 0, flightPrice: 0,
  transferCab: "", transferPerDay: 0, transferDays: 0,
  inclusions: "", exclusions: "",
  notes: "This is an initial quote based on our most popular holiday package to your chosen destination.",
  cost: 0, margin: 0, gstPct: 5, tcsPct: 0, tripExpense: 0,
};

export default function QuotationBuilder({ lead, leadDisplayId, quoteDisplayId, initialData, isNew, salespeople = [], onClose, onSaved }) {
  const init = initialData
    ? { ...DEF, ...initialData, assignedTo: initialData.assignedTo?._id || initialData.assignedTo || "" }
    : {
        ...DEF,
        travelDate: lead?.travelDate || "",
        flightDate: lead?.travelDate || "",
        hotelCat: lead?.brr?.hotelCategory || "Deluxe",
        assignedTo: lead?.assignedTo?._id || lead?.assignedTo || "",
      };

  const [form, setForm]     = useState(init);
  const [itin, setItin]     = useState(initialData?.itinerary?.length ? [...initialData.itinerary] : [{ title: "", description: "" }]);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const c    = calcQ(form);
  const g    = gradeColor(c.mpct);
  const intl = form.type === "International";
  const hotelSub = (+form.hotelPrice || 0) * (+form.hotelNights || 0) * (+form.hotelRooms || 0);

  async function save() {
    setSaving(true);
    try {
      const newVer = { v: (initialData?.versions?.length || 0) + 1, date: todayISO(), cost: form.cost, margin: form.margin, note: isNew ? "First quote created" : "Quote revised" };
      const body = { ...form, itinerary: itin, versions: [...(initialData?.versions || []), newVer] };
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

  return (
    <>
      <Ov onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ ...QS.modal, maxWidth: 940 }}>
          {/* Header */}
          <div style={QS.head}>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, margin: 0 }}>
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

            {/* Trip Basics */}
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

            {/* Hotel */}
            <Sec label="🏨  Hotel Details" right="Customer side">
              <div style={{ ...G3, marginBottom: 12 }}>
                <Fl l="Select Hotel"><input style={QS.inp} placeholder="Hotel name, city" value={form.hotelName} onChange={e => upd("hotelName", e.target.value)} /></Fl>
                <Fl l="Room Category">
                  <select style={QS.inp} value={form.hotelCat} onChange={e => upd("hotelCat", e.target.value)}>
                    {ROOM_CATS.map(h => <option key={h}>{h}</option>)}
                  </select>
                </Fl>
                <Fl l="Price / Night (₹)"><input type="number" style={QS.inp} value={form.hotelPrice} onChange={e => upd("hotelPrice", +e.target.value || 0)} /></Fl>
              </div>
              <div style={G3}>
                <Fl l="Nights"><input type="number" style={QS.inp} value={form.hotelNights} onChange={e => upd("hotelNights", +e.target.value || 0)} /></Fl>
                <Fl l="Rooms"><input type="number" style={QS.inp} value={form.hotelRooms} onChange={e => upd("hotelRooms", +e.target.value || 1)} /></Fl>
                <Fl l="Sub Total"><input style={{ ...QS.inp, color: "#15803D", fontWeight: 700 }} value={inr(hotelSub)} disabled /></Fl>
              </div>
            </Sec>

            {/* Flight */}
            <Sec label="✈️  Flight Details">
              <div style={G4}>
                <Fl l="From"><input style={QS.inp} placeholder="Delhi" value={form.flightFrom} onChange={e => upd("flightFrom", e.target.value)} /></Fl>
                <Fl l="To"><input style={QS.inp} placeholder="Srinagar" value={form.flightTo} onChange={e => upd("flightTo", e.target.value)} /></Fl>
                <Fl l="Pax"><input type="number" style={QS.inp} value={form.flightPax} onChange={e => upd("flightPax", +e.target.value || 0)} /></Fl>
                <Fl l="Total Fare (₹)"><input type="number" style={QS.inp} value={form.flightPrice} onChange={e => upd("flightPrice", +e.target.value || 0)} /></Fl>
              </div>
            </Sec>

            {/* Transfer */}
            <Sec label="🚐  Transfer">
              <div style={G3}>
                <Fl l="Cab Type"><input style={QS.inp} placeholder="Innova Crysta" value={form.transferCab} onChange={e => upd("transferCab", e.target.value)} /></Fl>
                <Fl l="Price / Day (₹)"><input type="number" style={QS.inp} value={form.transferPerDay} onChange={e => upd("transferPerDay", +e.target.value || 0)} /></Fl>
                <Fl l="Days"><input type="number" style={QS.inp} value={form.transferDays} onChange={e => upd("transferDays", +e.target.value || 0)} /></Fl>
              </div>
            </Sec>

            {/* Itinerary */}
            <Sec
              label="📅  Day-wise Itinerary"
              right={
                <button onClick={() => setItin(p => [...p, { title: "", description: "" }])}
                  style={{ background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.3)", color: "#fff", borderRadius: 8, padding: "4px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  + Add Another Day
                </button>
              }
            >
              {itin.map((d, i) => (
                <div key={i} style={{ border: "1px solid #E4E9F2", borderRadius: 10, padding: 10, marginBottom: 8, background: "#F8FAFD", position: "relative" }}>
                  {itin.length > 1 && (
                    <button onClick={() => setItin(p => p.filter((_, j) => j !== i))}
                      style={{ position: "absolute", top: 8, right: 8, background: "#FEE2E2", border: "none", color: "#BE123C", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      ✕
                    </button>
                  )}
                  <div style={G2}>
                    <Fl l={`Day ${i + 1} Title`}>
                      <input style={QS.inp} placeholder="Gulmarg day trip" value={d.title} onChange={e => setItin(p => p.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                    </Fl>
                    <Fl l="Description">
                      <input style={QS.inp} placeholder="Gondola, snow activities" value={d.description} onChange={e => setItin(p => p.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
                    </Fl>
                  </div>
                </div>
              ))}
            </Sec>

            {/* Inclusions / Exclusions / Notes */}
            <Sec label="📝  Inclusions, Exclusions and Notes">
              <div style={{ ...G2, marginBottom: 12 }}>
                <Fl l="Inclusions"><textarea style={{ ...QS.inp, minHeight: 80, resize: "vertical" }} value={form.inclusions} onChange={e => upd("inclusions", e.target.value)} /></Fl>
                <Fl l="Exclusions"><textarea style={{ ...QS.inp, minHeight: 80, resize: "vertical" }} value={form.exclusions} onChange={e => upd("exclusions", e.target.value)} /></Fl>
              </div>
              <Fl l="Special Notes (shown on quote PDF)">
                <textarea style={{ ...QS.inp, minHeight: 54, resize: "vertical" }} value={form.notes} onChange={e => upd("notes", e.target.value)} />
              </Fl>
            </Sec>

            {/* Company Side */}
            <div style={{ border: "2px solid #E8364A", borderRadius: 12, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ background: "#E8364A", color: "#fff", fontWeight: 700, fontSize: 14, padding: "9px 14px" }}>
                🔒 Company Side · Internal Only, never printed on the customer PDF
              </div>
              <div style={{ background: "#fff", padding: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${intl ? 4 : 3}, 1fr)`, gap: 12, marginBottom: 14 }}>
                  <Fl l="Cost Price (₹)"><input type="number" style={QS.inp} value={form.cost} onChange={e => upd("cost", +e.target.value || 0)} /></Fl>
                  <Fl l="Margin (₹)"><input type="number" style={QS.inp} value={form.margin} onChange={e => upd("margin", +e.target.value || 0)} /></Fl>
                  <Fl l="GST %"><input type="number" style={QS.inp} value={form.gstPct} onChange={e => upd("gstPct", +e.target.value || 0)} /></Fl>
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
                  <CR l="Margin %  (auto)"            v={`${c.mpct.toFixed(1)}%  ${g.g} Grade`} vc={g.c} />
                  <CR l="Base Price = Cost + Margin"  v={inr(c.base)} />
                  <CR l="GST Amount"                  v={inr(c.gst)} />
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

      {/* Preview PDF Modal */}
      {preview && (
        <Ov style={{ zIndex: 101 }} onClick={e => { if (e.target === e.currentTarget) setPreview(false); }}>
          <div style={{ ...QS.modal, maxWidth: 840 }}>
            <div style={QS.head}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Quote Preview · {quoteDisplayId}</div>
              <button style={QS.x} onClick={() => setPreview(false)}>✕</button>
            </div>
            <div style={{ padding: 22, maxHeight: "76vh", overflowY: "auto" }}>
              <div style={{ border: "1px solid #E4E9F2", borderRadius: 12, padding: 22, background: "#fff" }} id="printArea">
                {/* Letterhead */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "3px solid #E8364A", paddingBottom: 12, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#E8364A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontStyle: "italic", fontSize: 14, flexShrink: 0 }}>Tw</div>
                  <div>
                    <b style={{ fontSize: 16, color: "#0F1B33" }}>tourwatchout</b>
                    <div style={{ fontSize: 11, color: "#6B7A99" }}>DLF Mypad, Vibhuti Khand, Gomti Nagar, Lucknow · +91 8882701800 · sales1@tourwatchout.com</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <b style={{ color: "#2563EB" }}>{quoteDisplayId}</b>
                    <div style={{ fontSize: 11, color: "#6B7A99" }}>Dated {fmtDate(todayISO())}</div>
                  </div>
                </div>
                {/* Details */}
                <table style={{ width: "100%", fontSize: 13, marginBottom: 12, borderCollapse: "collapse" }}>
                  <tbody>
                    <tr><td style={{ paddingBottom: 4, width: "50%" }}><b>Guest:</b> {lead?.name}</td><td><b>Destination:</b> {lead?.destination}</td></tr>
                    <tr><td style={{ paddingBottom: 4 }}><b>Duration:</b> {form.days || "—"}</td><td><b>Travel Date:</b> {fmtDate(form.travelDate)}</td></tr>
                    <tr><td><b>Contact:</b> {lead?.phone}</td><td><b>Trip Type:</b> {form.type} · {form.pkgMode}</td></tr>
                  </tbody>
                </table>
                {form.hotelName && <p style={{ fontSize: 13, marginBottom: 6 }}><b>🏨 Stay:</b> {form.hotelName} · {form.hotelCat} · {form.hotelNights} nights · {form.hotelRooms} room(s)</p>}
                {form.flightFrom && <p style={{ fontSize: 13, marginBottom: 6 }}><b>✈️ Flights:</b> {form.flightFrom} → {form.flightTo} · {form.flightPax} pax</p>}
                {form.transferCab && <p style={{ fontSize: 13, marginBottom: 6 }}><b>🚐 Transfers:</b> {form.transferCab} · {form.transferDays} days</p>}
                {itin.some(d => d.title) && (
                  <>
                    <h4 style={{ margin: "12px 0 6px", fontSize: 14, color: "#0F1B33" }}>Day-wise Itinerary</h4>
                    {itin.filter(d => d.title).map((d, i) => (
                      <p key={i} style={{ fontSize: 13, marginBottom: 6 }}>
                        <b>Day {i + 1} · {d.title}</b><br />
                        <span style={{ color: "#6B7A99" }}>{d.description}</span>
                      </p>
                    ))}
                  </>
                )}
                {(form.inclusions || form.exclusions) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    {form.inclusions && <div><h4 style={{ color: "#15803D", marginBottom: 4, fontSize: 13 }}>✓ Inclusions</h4><p style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{form.inclusions}</p></div>}
                    {form.exclusions && <div><h4 style={{ color: "#BE123C", marginBottom: 4, fontSize: 13 }}>✕ Exclusions</h4><p style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{form.exclusions}</p></div>}
                  </div>
                )}
                <div style={{ background: "#EFF4FF", borderRadius: 10, padding: "12px 16px", marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ color: "#0F1B33" }}>Total Package Price (all taxes included)</b>
                  <b style={{ fontSize: 22, color: "#2563EB" }}>{inr(c.selling)}</b>
                </div>
                {form.notes && <p style={{ fontSize: 12, color: "#6B7A99", marginTop: 10, fontStyle: "italic" }}>{form.notes}</p>}
              </div>
            </div>
            <div style={QS.foot}>
              <button style={QS.fb} onClick={() => setPreview(false)}>← Back to Edit</button>
              <button style={{ ...QS.fb, background: "#2563EB", color: "#fff", border: "none" }} onClick={() => window.print()}>🖨 Print / Save PDF</button>
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
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(10,18,38,.55)", backdropFilter: "blur(3px)", zIndex: 90, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 18px", ...style }}
      onClick={onClick}
    >
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
const G2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const G3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 };
const G4 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 };

const QS = {
  modal: { background: "#F3F5FA", borderRadius: 18, boxShadow: "0 10px 40px rgba(15,27,51,.18)", width: "100%" },
  head:  { display: "flex", alignItems: "center", gap: 12, padding: "15px 20px", background: "#2563EB", borderRadius: "18px 18px 0 0" },
  x:     { marginLeft: "auto", background: "rgba(255,255,255,.18)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 8, fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", flexShrink: 0 },
  body:  { padding: "18px 20px", maxHeight: "70vh", overflowY: "auto" },
  foot:  { display: "flex", gap: 8, justifyContent: "flex-end", padding: "14px 20px", borderTop: "1px solid #E4E9F2", background: "#fff", borderRadius: "0 0 18px 18px", flexWrap: "wrap", alignItems: "center" },
  fb:    { padding: "8px 14px", border: "1px solid #E4E9F2", borderRadius: 9, background: "#fff", color: "#36415A", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none", fontFamily: "inherit" },
  inp:   { border: "1px solid #E4E9F2", borderRadius: 9, padding: "8px 11px", fontSize: ".88rem", color: "#0F1B33", outline: "none", width: "100%", boxSizing: "border-box", background: "#F8FAFD", fontFamily: "inherit" },
};

export { calcQ, gradeColor, inr as inrFmt };
