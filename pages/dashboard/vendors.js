import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdSearch,
  MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight,
  MdClose, MdExpandMore, MdExpandLess, MdImage, MdDirectionsCar,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

/* ─── constants ─── */
const TABS = ["Stay", "Transfers", "Activities"];

const BUSINESS_TYPES = {
  Stay:       ["Hotel", "Resort", "Hostel", "Guesthouse", "Villa", "Lodge", "Homestay"],
  Transfers:  ["Car Rental", "Transportation", "Bus Service", "Taxi", "Airport Transfer", "Boat", "Bike Rental"],
  Activities: ["Adventure", "Sightseeing", "Cultural", "Water Sports", "Trekking", "Safari", "City Tour"],
};

const VEHICLE_TYPES  = ["Sedan", "SUV", "XUV", "Hatchback", "Innova", "Fortuner", "Tempo Traveller", "Mini Bus", "Bus"];
const ROOM_TYPES     = ["Standard", "Deluxe", "Premium", "Suite", "Economy", "Luxury"];
const HOTEL_AMENITIES = ["Breakfast", "WiFi", "Pool", "Gym", "Parking", "AC", "Room Service", "Laundry"];
const VEH_INCLUSIONS  = ["Toll & Parking", "Driver Allowance", "Fuel", "Night Charges"];

const COUNTRY_CODES = [
  "+91 (India)", "+1 (USA/Canada)", "+44 (UK)",
  "+880 (Bangladesh)", "+971 (UAE)", "+65 (Singapore)",
  "+60 (Malaysia)", "+61 (Australia)", "+49 (Germany)",
];
const POSITIONS    = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
const PER_PAGE_OPTS = [10, 20, 50];

const EMPTY_FORM = {
  vendorTab:      "Stay",
  businessName:   "",
  typeOfBusiness: "",
  place:          "",
  image:          { src: "", alt: "" },
  gallery:        [],
  contactPerson:  { position: "Mr", firstName: "", lastName: "", email: "", countryCode: "+91 (India)", contactNumber: "" },
  hotelRooms:  [{ roomType: "", pricePerNight: "", cp: "", map: "", ap: "", guests: 2, amenities: [] }],
  vehicles:    [{ vehicleImage: { src: "", alt: "" }, vehicleType: "", pricePerDay: "", passengers: "", inclusions: [] }],
  activities:  [{ activityImage: { src: "", alt: "" }, activityName: "", pricePerPerson: "", duration: "", description: "" }],
  status: "Active",
};

/* ─── helpers ─── */
function daysAgo(date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}
function fmtDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}
function toBase64(file, cb) {
  const r = new FileReader();
  r.onload = () => cb(r.result);
  r.readAsDataURL(file);
}

/* ─── pricing helpers for table ─── */
function getPricingDisplay(v) {
  if (v.vendorTab === "Stay" && v.hotelRooms?.length) {
    const r = v.hotelRooms[0];
    return r.pricePerNight ? { label: r.roomType || "Room", price: r.pricePerNight, more: v.hotelRooms.length > 1 } : null;
  }
  if (v.vendorTab === "Transfers" && v.vehicles?.length) {
    const vh = v.vehicles[0];
    return vh.pricePerDay ? { label: vh.vehicleType || "Vehicle", price: vh.pricePerDay, more: v.vehicles.length > 1 } : null;
  }
  if (v.vendorTab === "Activities" && v.activities?.length) {
    const ac = v.activities[0];
    return ac.pricePerPerson ? { label: ac.activityName || "Activity", price: ac.pricePerPerson, more: v.activities.length > 1 } : null;
  }
  return null;
}

function getExpandedRows(v) {
  if (v.vendorTab === "Stay" && v.hotelRooms?.length) {
    return {
      headers: ["Room Type", "Price / Night", "Guests", "Amenities"],
      rows: v.hotelRooms.map(r => [r.roomType || "—", r.pricePerNight ? `₹${Number(r.pricePerNight).toLocaleString("en-IN")}` : "—", r.guests || "—", (r.amenities || []).join(", ") || "—"]),
    };
  }
  if (v.vendorTab === "Transfers" && v.vehicles?.length) {
    return {
      headers: ["Vehicle Type", "Price / Day", "Passengers", "Inclusions"],
      rows: v.vehicles.map(vh => [vh.vehicleType || "—", vh.pricePerDay ? `₹${Number(vh.pricePerDay).toLocaleString("en-IN")}` : "—", vh.passengers || "—", (vh.inclusions || []).join(", ") || "—"]),
    };
  }
  if (v.vendorTab === "Activities" && v.activities?.length) {
    return {
      headers: ["Activity", "Price / Person", "Duration", "Description"],
      rows: v.activities.map(ac => [ac.activityName || "—", ac.pricePerPerson ? `₹${Number(ac.pricePerPerson).toLocaleString("en-IN")}` : "—", ac.duration || "—", ac.description || "—"]),
    };
  }
  return null;
}

/* ══════════════════════════════════════════════════
   VENDOR MODAL
══════════════════════════════════════════════════ */
function VendorModal({ initial, onSave, onClose, saving }) {
  const [form, setForm]             = useState(initial);
  const [imgPreview, setImgPreview] = useState(initial.image?.src || "");

  const mainImgRef     = useRef();
  const vehicleImgRef  = useRef();
  const activityImgRef = useRef();
  const galleryImgRef  = useRef();
  const pendingRow     = useRef(null);

  /* ── generic field setters ── */
  function set(f, v) { setForm(p => ({ ...p, [f]: v })); }
  function setContact(f, v) { setForm(p => ({ ...p, contactPerson: { ...p.contactPerson, [f]: v } })); }

  /* ── hotel rooms ── */
  function setRoom(idx, f, v) {
    setForm(p => { const a = [...p.hotelRooms]; a[idx] = { ...a[idx], [f]: v }; return { ...p, hotelRooms: a }; });
  }
  function toggleRoomAmenity(idx, am) {
    setForm(p => {
      const a = [...p.hotelRooms];
      const list = a[idx].amenities || [];
      a[idx] = { ...a[idx], amenities: list.includes(am) ? list.filter(x => x !== am) : [...list, am] };
      return { ...p, hotelRooms: a };
    });
  }
  function addRoom()        { setForm(p => ({ ...p, hotelRooms: [...p.hotelRooms, { roomType: "", pricePerNight: "", cp: "", map: "", ap: "", guests: 2, amenities: [] }] })); }
  function removeRoom(idx)  { setForm(p => ({ ...p, hotelRooms: p.hotelRooms.filter((_, i) => i !== idx) })); }

  /* ── vehicles ── */
  function setVeh(idx, f, v) {
    setForm(p => { const a = [...p.vehicles]; a[idx] = { ...a[idx], [f]: v }; return { ...p, vehicles: a }; });
  }
  function toggleInclusion(idx, inc) {
    setForm(p => {
      const a = [...p.vehicles];
      const list = a[idx].inclusions || [];
      a[idx] = { ...a[idx], inclusions: list.includes(inc) ? list.filter(x => x !== inc) : [...list, inc] };
      return { ...p, vehicles: a };
    });
  }
  function addVehicle()       { setForm(p => ({ ...p, vehicles: [...p.vehicles, { vehicleImage: { src: "", alt: "" }, vehicleType: "", pricePerDay: "", passengers: "", inclusions: [] }] })); }
  function removeVehicle(idx) { setForm(p => ({ ...p, vehicles: p.vehicles.filter((_, i) => i !== idx) })); }
  function openVehicleImg(idx) { pendingRow.current = idx; vehicleImgRef.current.click(); }
  function handleVehicleImg(e) {
    const file = e.target.files[0]; if (!file) return;
    const idx = pendingRow.current;
    toBase64(file, src => setVeh(idx, "vehicleImage", { src, alt: file.name }));
    e.target.value = "";
  }

  /* ── activities ── */
  function setAct(idx, f, v) {
    setForm(p => { const a = [...p.activities]; a[idx] = { ...a[idx], [f]: v }; return { ...p, activities: a }; });
  }
  function addActivity()       { setForm(p => ({ ...p, activities: [...p.activities, { activityImage: { src: "", alt: "" }, activityName: "", pricePerPerson: "", duration: "", description: "" }] })); }
  function removeActivity(idx) { setForm(p => ({ ...p, activities: p.activities.filter((_, i) => i !== idx) })); }
  function openActivityImg(idx) { pendingRow.current = idx; activityImgRef.current.click(); }
  function handleActivityImg(e) {
    const file = e.target.files[0]; if (!file) return;
    const idx = pendingRow.current;
    toBase64(file, src => setAct(idx, "activityImage", { src, alt: file.name }));
    e.target.value = "";
  }

  /* ── gallery (hotel photos) ── */
  function handleGallery(e) {
    Array.from(e.target.files).forEach(file =>
      toBase64(file, src => setForm(p => ({ ...p, gallery: [...(p.gallery || []), { src, alt: file.name }] })))
    );
    e.target.value = "";
  }
  function removeGalleryImg(idx) {
    setForm(p => ({ ...p, gallery: p.gallery.filter((_, i) => i !== idx) }));
  }

  /* ── main image ── */
  function handleMainImg(e) {
    const file = e.target.files[0]; if (!file) return;
    toBase64(file, src => { setImgPreview(src); set("image", { src, alt: file.name }); });
  }

  const bizTypes  = BUSINESS_TYPES[form.vendorTab] || [];
  const addLabel  = form.vendorTab === "Stay" ? "+ Add Room Type" : form.vendorTab === "Transfers" ? "+ Add Vehicle" : "+ Add Activity";
  const onAddRow  = form.vendorTab === "Stay" ? addRoom : form.vendorTab === "Transfers" ? addVehicle : addActivity;

  /* ── Contact Person section (shared) — kept as JSX variable, NOT a component,
        to avoid focus loss caused by remounting on every keystroke ── */
  const contactJSX = (
    <>
      <div style={S.sectionHead}>Contact Person Information</div>
      <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div>
          <label style={S.label}>Position</label>
          <select style={S.select} value={form.contactPerson.position} onChange={e => setContact("position", e.target.value)}>
            {POSITIONS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>First Name</label>
          <input style={S.input} placeholder="Enter First Name" value={form.contactPerson.firstName} onChange={e => setContact("firstName", e.target.value)} />
        </div>
        <div>
          <label style={S.label}>Last Name</label>
          <input style={S.input} placeholder="Enter Last Name" value={form.contactPerson.lastName} onChange={e => setContact("lastName", e.target.value)} />
        </div>
      </div>
      <div style={S.fieldGroup}>
        <label style={S.label}>Email</label>
        <input style={S.input} type="email" placeholder="entermail@gmail.com" value={form.contactPerson.email} onChange={e => setContact("email", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 10, marginBottom: 4 }}>
        <div>
          <label style={S.label}>Country Code</label>
          <select style={S.select} value={form.contactPerson.countryCode} onChange={e => setContact("countryCode", e.target.value)}>
            {COUNTRY_CODES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Contact Number</label>
          <input style={S.input} placeholder="Enter Contact Number" value={form.contactPerson.contactNumber} onChange={e => setContact("contactNumber", e.target.value)} />
        </div>
      </div>
    </>
  );

  return (
    <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.modal}>

        {/* Header */}
        <div style={S.modalHead}>
          <h2 style={S.modalTitle}>{initial.id ? "Edit vendor details" : "Add vendor details"}</h2>
          <button style={S.closeBtn} onClick={onClose}><MdClose size={20} /></button>
        </div>

        {/* Type tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", padding: "0 24px" }}>
          {TABS.map(t => (
            <button key={t}
              style={{ padding: "10px 22px", fontSize: 14, fontWeight: form.vendorTab === t ? 700 : 400, color: form.vendorTab === t ? "#2563eb" : "#64748b", background: "none", border: "none", borderBottom: form.vendorTab === t ? "2px solid #2563eb" : "2px solid transparent", cursor: "pointer" }}
              onClick={() => set("vendorTab", t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={S.modalBody}>

          {/* ═══════════════════════════════════
              STAY
          ═══════════════════════════════════ */}
          {form.vendorTab === "Stay" && (
            <>
              {/* Top row: image left + fields right */}
              <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                <div style={{ flexShrink: 0, width: 180, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={S.imgBox} onClick={() => mainImgRef.current.click()}>
                    {imgPreview
                      ? <img src={imgPreview} alt="hotel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <><MdImage size={40} color="#94a3b8" /><span style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>W 300 x H 442</span><span style={{ fontSize: 10, color: "#cbd5e1" }}>Click to upload</span></>}
                  </div>
                  <input ref={mainImgRef} type="file" accept="image/*" hidden onChange={handleMainImg} />
                  {imgPreview && <button style={S.removeImg} onClick={() => { setImgPreview(""); set("image", { src: "", alt: "" }); }}>Remove</button>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Type of Business</label>
                    <select style={S.select} value={form.typeOfBusiness} onChange={e => set("typeOfBusiness", e.target.value)}>
                      <option value="">Select Type of Business</option>
                      {bizTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Business Name</label>
                    <input style={S.input} placeholder="Enter Business Name" value={form.businessName} onChange={e => set("businessName", e.target.value)} />
                  </div>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Place</label>
                    <input style={S.input} placeholder="e.g. Kashmir, J&K" value={form.place} onChange={e => set("place", e.target.value)} />
                  </div>
                </div>
              </div>

              {contactJSX}

              {/* Gallery */}
              <div style={S.sectionHead}>Gallery Images (Hotel Photos)</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                {(form.gallery || []).map((img, i) => (
                  <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                    <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                    <button onClick={() => removeGalleryImg(i)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>
                ))}
                <div style={{ width: 72, height: 72, border: "2px dashed #cbd5e1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#f8fafc" }}
                  onClick={() => galleryImgRef.current.click()}>
                  <MdAdd size={22} color="#94a3b8" />
                </div>
              </div>
              <input ref={galleryImgRef} type="file" accept="image/*" multiple hidden onChange={handleGallery} />

              {/* Room Categories */}
              <div style={S.sectionHead}>Room Categories & Pricing</div>
              {form.hotelRooms.map((room, idx) => (
                <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", marginBottom: 10, background: "#fafafa", position: "relative" }}>

                  {/* Row 1: Room Type + pricing fields + Guests */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 68px", gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={S.label}>Room Type</label>
                      <select style={S.select} value={room.roomType} onChange={e => setRoom(idx, "roomType", e.target.value)}>
                        <option value="">Select Type</option>
                        {ROOM_TYPES.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.label}>Price / Night (₹)</label>
                      <input style={S.input} type="number" placeholder="e.g. 3500" value={room.pricePerNight} onChange={e => setRoom(idx, "pricePerNight", e.target.value)} />
                    </div>
                    <div>
                      <label style={S.label}>C.P. (₹)</label>
                      <input style={S.input} type="number" placeholder="Contracted" value={room.cp} onChange={e => setRoom(idx, "cp", e.target.value)} />
                    </div>
                    <div>
                      <label style={S.label}>M.A.P. (₹)</label>
                      <input style={S.input} type="number" placeholder="Min Adv." value={room.map} onChange={e => setRoom(idx, "map", e.target.value)} />
                    </div>
                    <div>
                      <label style={S.label}>A.P. (₹)</label>
                      <input style={S.input} type="number" placeholder="Advertised" value={room.ap} onChange={e => setRoom(idx, "ap", e.target.value)} />
                    </div>
                    <div>
                      <label style={S.label}>Guests</label>
                      <input style={S.input} type="number" placeholder="2" value={room.guests} onChange={e => setRoom(idx, "guests", e.target.value)} />
                    </div>
                  </div>

                  {/* Row 2: Amenities */}
                  <div>
                    <label style={S.label}>Amenities</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px" }}>
                      {HOTEL_AMENITIES.map(am => (
                        <label key={am} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={(room.amenities || []).includes(am)} onChange={() => toggleRoomAmenity(idx, am)} style={{ accentColor: "#2563eb" }} />
                          {am}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Remove button */}
                  {idx > 0 && (
                    <button style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}
                      onClick={() => removeRoom(idx)}>✕</button>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ═══════════════════════════════════
              TRANSFERS
          ═══════════════════════════════════ */}
          {form.vendorTab === "Transfers" && (
            <>
              {/* Business info — 3 columns, no portrait image */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Type of Business</label>
                  <select style={S.select} value={form.typeOfBusiness} onChange={e => set("typeOfBusiness", e.target.value)}>
                    <option value="">Select Type</option>
                    {bizTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Name of Business</label>
                  <input style={S.input} placeholder="e.g. Shiv Shakti Travels" value={form.businessName} onChange={e => set("businessName", e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>Place</label>
                  <input style={S.input} placeholder="e.g. Kashmir, J&K" value={form.place} onChange={e => set("place", e.target.value)} />
                </div>
              </div>

              {contactJSX}

              {/* Vehicles */}
              <div style={S.sectionHead}>Price</div>
              <input ref={vehicleImgRef} type="file" accept="image/*" hidden onChange={handleVehicleImg} />

              {form.vehicles.map((veh, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12, padding: "12px 14px", border: "1px solid #e2e8f0", borderRadius: 10, background: "#fafafa", position: "relative" }}>
                  {/* Vehicle image */}
                  <div style={{ flexShrink: 0, width: 90, height: 68, border: "2px dashed #cbd5e1", borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => openVehicleImg(idx)}>
                    {veh.vehicleImage?.src
                      ? <img src={veh.vehicleImage.src} alt="vehicle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <MdDirectionsCar size={32} color="#94a3b8" />}
                  </div>

                  {/* Fields */}
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 8 }}>
                    <div>
                      <label style={S.label}>Vehicle Type</label>
                      <select style={S.select} value={veh.vehicleType} onChange={e => setVeh(idx, "vehicleType", e.target.value)}>
                        <option value="">Select</option>
                        {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.label}>Price per Night</label>
                      <input style={S.input} type="number" placeholder="e.g. 2300" value={veh.pricePerDay} onChange={e => setVeh(idx, "pricePerDay", e.target.value)} />
                    </div>
                    <div>
                      <label style={S.label}>Passengers</label>
                      <input style={S.input} type="number" placeholder="4" value={veh.passengers} onChange={e => setVeh(idx, "passengers", e.target.value)} />
                    </div>
                  </div>

                  {/* Inclusions checkboxes */}
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 6, paddingTop: 18 }}>
                    {VEH_INCLUSIONS.map(inc => (
                      <label key={inc} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                        <input type="checkbox" style={{ accentColor: "#f97316", width: 14, height: 14 }}
                          checked={(veh.inclusions || []).includes(inc)}
                          onChange={() => toggleInclusion(idx, inc)} />
                        {inc}
                      </label>
                    ))}
                  </div>

                  {idx > 0 && (
                    <button style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}
                      onClick={() => removeVehicle(idx)}>✕</button>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ═══════════════════════════════════
              ACTIVITIES
          ═══════════════════════════════════ */}
          {form.vendorTab === "Activities" && (
            <>
              {/* Business info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Type of Business</label>
                  <select style={S.select} value={form.typeOfBusiness} onChange={e => set("typeOfBusiness", e.target.value)}>
                    <option value="">Select Type</option>
                    {bizTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Business Name</label>
                  <input style={S.input} placeholder="e.g. Kashmir Adventures" value={form.businessName} onChange={e => set("businessName", e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>Place</label>
                  <input style={S.input} placeholder="e.g. Gulmarg" value={form.place} onChange={e => set("place", e.target.value)} />
                </div>
              </div>

              {contactJSX}

              {/* Activities */}
              <div style={S.sectionHead}>Activities</div>
              <input ref={activityImgRef} type="file" accept="image/*" hidden onChange={handleActivityImg} />

              {form.activities.map((act, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12, padding: "12px 14px", border: "1px solid #e2e8f0", borderRadius: 10, background: "#fafafa", position: "relative" }}>
                  {/* Activity image */}
                  <div style={{ flexShrink: 0, width: 100, height: 80, border: "2px dashed #cbd5e1", borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => openActivityImg(idx)}>
                    {act.activityImage?.src
                      ? <img src={act.activityImage.src} alt="activity" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <MdImage size={32} color="#94a3b8" />}
                  </div>

                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div>
                      <label style={S.label}>Activity Name</label>
                      <input style={S.input} placeholder="e.g. Gondola Ride" value={act.activityName} onChange={e => setAct(idx, "activityName", e.target.value)} />
                    </div>
                    <div>
                      <label style={S.label}>Price per Person (₹)</label>
                      <input style={S.input} type="number" placeholder="e.g. 1500" value={act.pricePerPerson} onChange={e => setAct(idx, "pricePerPerson", e.target.value)} />
                    </div>
                    <div>
                      <label style={S.label}>Duration</label>
                      <input style={S.input} placeholder="e.g. 2 hours" value={act.duration} onChange={e => setAct(idx, "duration", e.target.value)} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={S.label}>Description</label>
                      <textarea style={{ ...S.input, height: 56, resize: "vertical" }} placeholder="Brief description of the activity…" value={act.description} onChange={e => setAct(idx, "description", e.target.value)} />
                    </div>
                  </div>

                  {idx > 0 && (
                    <button style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}
                      onClick={() => removeActivity(idx)}>✕</button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ ...S.modalFoot, justifyContent: "space-between" }}>
          <button style={S.addCatBtn} onClick={onAddRow}>{addLabel}</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
            <button style={{ ...S.doneBtn, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={() => onSave(form)}>
              {saving ? "Saving…" : "Done"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function VendorsPage() {
  const openSidebar = useOpenSidebar();

  const [vendors,   setVendors]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("Stay");
  const [search,    setSearch]    = useState("");
  const [filterBiz, setFilterBiz] = useState("All Vendors");
  const [filterLoc, setFilterLoc] = useState("All Locations");
  const [sortBy,    setSortBy]    = useState("Date Created");
  const [page,      setPage]      = useState(1);
  const [perPage,   setPerPage]   = useState(10);
  const [expanded,  setExpanded]  = useState(null);
  const [modal,    setModal]      = useState(false);
  const [editData, setEditData]   = useState(null);
  const [saving,   setSaving]     = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/vendors")
      .then(r => r.json())
      .then(d => { setVendors(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function saveVendor(form) {
    setSaving(true);
    try {
      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/dashboard/vendors/${form.id}` : "/api/dashboard/vendors", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Save failed: " + (err.error || res.statusText));
        return;
      }
      const saved = await res.json();
      setVendors(prev => isEdit ? prev.map(v => v.id === saved.id ? saved : v) : [saved, ...prev]);
      setModal(false);
    } catch (e) {
      alert("Save error: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteVendor(id) {
    if (!confirm("Delete this vendor?")) return;
    setVendors(prev => prev.filter(v => v.id !== id));
    await fetch(`/api/dashboard/vendors/${id}`, { method: "DELETE" });
  }

  function openAdd() {
    setEditData({ ...EMPTY_FORM, vendorTab: tab });
    setModal(true);
  }

  function openEdit(v) {
    setEditData({
      ...EMPTY_FORM,
      ...v,
      contactPerson: { ...EMPTY_FORM.contactPerson, ...(v.contactPerson || {}) },
      hotelRooms:    v.hotelRooms?.length    ? v.hotelRooms.map(r => ({ roomType: r.roomType || "", pricePerNight: r.pricePerNight ?? "", cp: r.cp ?? "", map: r.map ?? "", ap: r.ap ?? "", guests: r.guests ?? 2, amenities: r.amenities || [] }))    : EMPTY_FORM.hotelRooms,
      vehicles:      v.vehicles?.length      ? v.vehicles      : EMPTY_FORM.vehicles,
      activities:    v.activities?.length    ? v.activities    : EMPTY_FORM.activities,
      gallery:       v.gallery || [],
    });
    setModal(true);
  }

  /* filter pipeline */
  let list = vendors.filter(v => v.vendorTab === tab);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(v =>
      v.businessName?.toLowerCase().includes(q) ||
      v.typeOfBusiness?.toLowerCase().includes(q) ||
      v.place?.toLowerCase().includes(q) ||
      v.contactPerson?.firstName?.toLowerCase().includes(q) ||
      v.contactPerson?.lastName?.toLowerCase().includes(q)
    );
  }
  if (filterBiz !== "All Vendors")   list = list.filter(v => v.typeOfBusiness === filterBiz);
  if (filterLoc !== "All Locations") list = list.filter(v => v.place === filterLoc);
  if (sortBy === "Date Created") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sortBy === "Name A-Z") list = [...list].sort((a, b) => (a.businessName || "").localeCompare(b.businessName || ""));

  const totalPages = Math.ceil(list.length / perPage);
  const paged      = list.slice((page - 1) * perPage, page * perPage);

  const bizOptions  = ["All Vendors",   ...new Set(vendors.filter(v => v.vendorTab === tab).map(v => v.typeOfBusiness).filter(Boolean))];
  const locOptions  = ["All Locations", ...new Set(vendors.filter(v => v.vendorTab === tab).map(v => v.place).filter(Boolean))];

  return (
    <>
      <Head><title>Vendors — TourWatchOut</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
          <h1 className="bk-page-title">Vendors</h1>
        </div>
        <div className="bk-header-right">
          <div className="bk-team-pill"><span>Sales Team</span><MdKeyboardArrowDown size={16} /></div>
          <button className="bk-avatar-btn"><MdPeople size={18} color="#2563eb" /><span className="bk-avatar-badge">4</span></button>
        </div>
      </header>

      <div className="bk-content">

        {/* Tabs + Add */}
        <div style={S.tabRow}>
          <div style={S.tabGroup}>
            {TABS.map(t => (
              <button key={t}
                style={{ ...S.tabBtn, ...(tab === t ? S.tabBtnActive : {}) }}
                onClick={() => { setTab(t); setPage(1); setFilterBiz("All Vendors"); setFilterLoc("All Locations"); }}>
                {t}
              </button>
            ))}
          </div>
          <button style={S.addBtn} onClick={openAdd}>
            <MdAdd size={18} style={{ marginRight: 4 }} /> Add New Vendor
          </button>
        </div>

        {/* Search + filters */}
        <div style={S.filterRow}>
          <div style={S.searchWrap}>
            <MdSearch size={18} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input style={S.searchInput} placeholder="Search Vendors by name, business, or location…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div style={S.dropdownWrap}>
            <select style={S.filterSelect} value={filterBiz} onChange={e => { setFilterBiz(e.target.value); setPage(1); }}>
              {bizOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={S.dropdownWrap}>
            <select style={S.filterSelect} value={filterLoc} onChange={e => { setFilterLoc(e.target.value); setPage(1); }}>
              {locOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={S.dropdownWrap}>
            <select style={S.filterSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {["Date Created", "Name A-Z"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bk-table-card">
          <div className="bk-table-wrap">
            <table className="bk-table">
              <thead>
                <tr>
                  <th style={{ width: 48 }}>Sr.</th>
                  <th>Business Name</th>
                  <th>Type of Business</th>
                  <th>Location</th>
                  <th>Vendor Name</th>
                  <th>Contact</th>
                  <th>Last Updated</th>
                  <th style={{ minWidth: 130 }}>Pricing</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>Loading…</td></tr>
                ) : paged.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No vendors found</td></tr>
                ) : paged.map((v, i) => {
                  const isExp     = expanded === v.id;
                  const pricing   = getPricingDisplay(v);
                  const expData   = getExpandedRows(v);
                  const contact   = v.contactPerson || {};
                  const vendorName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
                  const ago       = v.updatedAt ? daysAgo(v.updatedAt) : null;

                  return (
                    <React.Fragment key={v.id}>
                      <tr style={{ background: isExp ? "#f8fafc" : "" }}>
                        <td>{(page - 1) * perPage + i + 1}</td>
                        <td style={{ fontWeight: 600 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {v.image?.src && <img src={v.image.src} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />}
                            {v.businessName || "—"}
                          </div>
                        </td>
                        <td>{v.typeOfBusiness || "—"}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="#64748b" style={{ marginTop: 2, flexShrink: 0 }}>
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
                            </svg>
                            <span style={{ fontSize: 13 }}>{v.place || "—"}</span>
                          </div>
                        </td>
                        <td>{vendorName || "—"}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.status === "Active" ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
                            <div style={{ fontSize: 12 }}>
                              <div style={{ fontWeight: 500 }}>{contact.contactNumber ? `${contact.countryCode?.split(" ")[0] || ""} ${contact.contactNumber}` : "—"}</div>
                              <div style={{ color: "#64748b" }}>{contact.email || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {v.updatedAt ? (
                            <div style={{ fontSize: 12 }}>
                              <div style={{ fontWeight: 500 }}>{fmtDate(v.updatedAt)}</div>
                              <div style={{ color: "#e84949" }}>{ago} day{ago !== 1 ? "s" : ""} ago</div>
                            </div>
                          ) : "—"}
                        </td>
                        <td>
                          {pricing ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <div style={{ fontSize: 12 }}>
                                <div style={{ fontSize: 11, color: "#64748b" }}>{pricing.label}</div>
                                <div style={{ fontWeight: 700, color: "#e84949" }}>₹{Number(pricing.price).toLocaleString("en-IN")}</div>
                              </div>
                              {pricing.more && (
                                <button style={S.expandBtn} onClick={() => setExpanded(isExp ? null : v.id)}>
                                  {isExp ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
                                </button>
                              )}
                            </div>
                          ) : "—"}
                        </td>
                        <td>
                          <div className="bk-action-btns">
                            <button className="bk-edit-btn" onClick={() => openEdit(v)}><MdEdit size={15} /></button>
                            <button className="bk-del-btn" onClick={() => deleteVendor(v.id)}><MdDelete size={15} /></button>
                          </div>
                        </td>
                      </tr>
                      {isExp && expData && (
                        <tr style={{ background: "#f1f5f9" }}>
                          <td />
                          <td colSpan={8} style={{ padding: "8px 16px" }}>
                            <table style={{ width: "auto", fontSize: 12 }}>
                              <thead>
                                <tr>{expData.headers.map(h => <th key={h} style={{ padding: "4px 20px 4px 0", color: "#64748b", fontWeight: 600, textAlign: "left" }}>{h}</th>)}</tr>
                              </thead>
                              <tbody>
                                {expData.rows.map((row, ri) => (
                                  <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "3px 20px 3px 0", maxWidth: 200 }}>{cell}</td>)}</tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bk-pagination">
            <div className="bk-pagination-left">
              <span className="bk-pag-label">Showing</span>
              <select className="bk-pag-size" value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              <span className="bk-pag-label">of {list.length}</span>
            </div>
            <div className="bk-pagination-right">
              <button className="bk-pag-btn bk-pag-arrow" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><MdChevronLeft size={18} /></button>
              {Array.from({ length: Math.min(Math.max(totalPages, 1), 5) }, (_, i) => i + 1).map(n => (
                <button key={n} className={`bk-pag-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              {totalPages > 5 && <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>}
              <button className="bk-pag-btn bk-pag-arrow" onClick={() => setPage(p => Math.min(Math.max(totalPages, 1), p + 1))} disabled={page >= Math.max(totalPages, 1)}><MdChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      {modal && editData && (
        <VendorModal initial={editData} onSave={saveVendor} onClose={() => setModal(false)} saving={saving} />
      )}
    </>
  );
}

VendorsPage.getLayout = page => (
  <DashboardLayout active="Vendors">{page}</DashboardLayout>
);

/* ─── styles ─── */
const S = {
  tabRow:       { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  tabGroup:     { display: "flex", gap: 0, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" },
  tabBtn:       { padding: "10px 28px", fontSize: 14, fontWeight: 500, background: "#fff", border: "none", cursor: "pointer", color: "#374151" },
  tabBtnActive: { background: "#2563eb", color: "#fff" },
  addBtn:       { display: "flex", alignItems: "center", padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" },

  filterRow:    { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" },
  searchWrap:   { flex: 1, minWidth: 260, position: "relative" },
  searchInput:  { width: "100%", padding: "10px 12px 10px 38px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" },
  dropdownWrap: { display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 10px", background: "#fff" },
  filterSelect: { padding: "9px 4px", fontSize: 13, border: "none", outline: "none", background: "transparent", cursor: "pointer", color: "#374151" },
  expandBtn:    { background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 0, display: "flex", alignItems: "center" },

  overlay:      { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px", overflowY: "auto" },
  modal:        { background: "#fff", borderRadius: 12, width: "100%", maxWidth: 820, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" },
  modalHead:    { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 14px", borderBottom: "1px solid #f1f5f9" },
  modalTitle:   { margin: 0, fontSize: 17, fontWeight: 700, color: "#1e40af" },
  closeBtn:     { background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: 4 },
  modalBody:    { display: "flex", flexDirection: "column", padding: "20px 24px", overflowY: "auto", maxHeight: "calc(90vh - 140px)" },
  modalFoot:    { display: "flex", alignItems: "center", padding: "14px 24px", borderTop: "1px solid #f1f5f9" },

  imgBox:       { width: 180, height: 210, border: "2px dashed #cbd5e1", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", background: "#f8fafc" },
  removeImg:    { marginTop: 6, fontSize: 11, color: "#e84949", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" },

  fieldGroup:   { marginBottom: 12 },
  label:        { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 },
  input:        { width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" },
  select:       { width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" },
  sectionHead:  { fontSize: 13, fontWeight: 700, color: "#1e293b", margin: "16px 0 10px", borderBottom: "1px solid #f1f5f9", paddingBottom: 6 },

  addCatBtn:    { padding: "7px 16px", background: "none", border: "1px solid #2563eb", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#2563eb", cursor: "pointer" },
  removeBtn:    { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, padding: 0 },
  cancelBtn:    { padding: "9px 22px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#374151" },
  doneBtn:      { padding: "9px 28px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
