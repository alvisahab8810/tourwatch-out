import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdSearch,
  MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight,
  MdClose, MdExpandMore, MdExpandLess, MdImage, MdDirectionsCar,
  MdLocationOn, MdPhone, MdEmail, MdStar, MdHotel, MdDirectionsBus,
  MdOutlineExplore, MdFilterList, MdStorefront,
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

/* Room categories — same list as QuotationBuilder so they stay in sync */
const ROOM_CATS = ["Standard", "Deluxe", "Deluxe Family", "Premium", "Premium / Water Villa", "Luxury"];
const CUSTOM_OPT = "__custom__";
const HOTEL_AMENITIES = [
  "Breakfast", "Breakfast & Dinner", "Lunch", "Dinner", "All Meals",
  "WiFi", "Pool", "Gym", "Parking", "AC", "Elevator",
  "Room Service", "Laundry", "Spa", "Bar", "Restaurant",
];
const VEH_INCLUSIONS  = ["Toll & Parking", "Driver Allowance", "Fuel", "Night Charges"];

const COUNTRY_CODES = [
  "+91 (India)", "+1 (USA/Canada)", "+44 (UK)",
  "+880 (Bangladesh)", "+971 (UAE)", "+65 (Singapore)",
  "+60 (Malaysia)", "+61 (Australia)", "+49 (Germany)",
];
const POSITIONS    = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
const PER_PAGE_OPTS = [10, 20, 50];

const DEF_SEASON = { label: "", cpai: "", mapai: "", apai: "" };
const DEF_ROOM   = { roomType: "Standard", roomName: "", bedType: "", roomSize: "", totalRooms: "", extraPerson: "", childWithBed: "", childWithoutBed: "", amenities: [], gallery: [], seasons: [{ ...DEF_SEASON }] };

const EMPTY_FORM = {
  vendorTab:      "Stay",
  businessName:   "",
  typeOfBusiness: "",
  place:          "",
  starRating:     "",
  image:          { src: "", alt: "" },
  gallery:        [],
  contactPerson:  { position: "Mr", firstName: "", lastName: "", email: "", countryCode: "+91 (India)", contactNumber: "" },
  hotelRooms:  [{ ...DEF_ROOM }],
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
function inrS(n) { return n && n > 0 ? `₹${Number(n).toLocaleString("en-IN")}` : "—"; }

function getPricingDisplay(v) {
  if (v.vendorTab === "Stay" && v.hotelRooms?.length) {
    const r  = v.hotelRooms[0];
    const s  = r.seasons?.[0];
    const price = s?.cpai || r.pricePerNight;
    const mealPlan = s?.cpai ? "CPAI" : "";
    if (price) return { label: r.roomName || r.roomType || "Room", price, mealPlan, more: v.hotelRooms.length > 1 || (r.seasons?.length > 1) };
    return null;
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
    const hasSeasons = v.hotelRooms.some(r => r.seasons?.length > 0);
    if (hasSeasons) {
      return {
        headers: ["Room", "Room Size", "Total", "Season", "CPAI", "MAPAI", "APAI"],
        rows: v.hotelRooms.flatMap(r =>
          (r.seasons || []).map((s, si) => [
            si === 0 ? (r.roomName || r.roomType || "—") : "",
            si === 0 ? (r.roomSize || "—") : "",
            si === 0 ? (r.totalRooms || "—") : "",
            s.label || "—",
            inrS(s.cpai), inrS(s.mapai), inrS(s.apai),
          ])
        ),
      };
    }
    return {
      headers: ["Room Type", "Room Size", "Total Rooms", "Price / Night"],
      rows: v.hotelRooms.map(r => [r.roomType || "—", r.roomSize || "—", r.totalRooms || "—", inrS(r.pricePerNight)]),
    };
  }
  if (v.vendorTab === "Transfers" && v.vehicles?.length) {
    return {
      headers: ["Vehicle Type", "Price / Day", "Passengers", "Inclusions"],
      rows: v.vehicles.map(vh => [vh.vehicleType || "—", inrS(vh.pricePerDay), vh.passengers || "—", (vh.inclusions || []).join(", ") || "—"]),
    };
  }
  if (v.vendorTab === "Activities" && v.activities?.length) {
    return {
      headers: ["Activity", "Price / Person", "Duration", "Description"],
      rows: v.activities.map(ac => [ac.activityName || "—", inrS(ac.pricePerPerson), ac.duration || "—", ac.description || "—"]),
    };
  }
  return null;
}

/* ══════════════════════════════════════════════════
   RoomCatSelect — same pattern as QuotationBuilder
══════════════════════════════════════════════════ */
function RoomCatSelect({ value, extra = [], onChange, onAdd, onDelete, accent = "#2563EB" }) {
  const [editing, setEditing] = useState(false);
  const allKnown = [...ROOM_CATS, ...extra];

  if (editing) {
    const trimmed = (value || "").trim();
    const alreadyKnown = allKnown.some(c => c.toLowerCase() === trimmed.toLowerCase());
    return (
      <div style={{ display: "flex", gap: 6 }}>
        <input
          autoFocus
          placeholder="Type new category…"
          value={value === CUSTOM_OPT ? "" : (value || "")}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1, padding: "9px 12px", border: `1.5px solid ${accent}`, borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }}
        />
        <button
          type="button"
          disabled={!trimmed}
          onClick={() => {
            if (!trimmed) return;
            if (!alreadyKnown) onAdd?.(trimmed);
            setEditing(false);
          }}
          style={{ background: accent, color: "#fff", border: "none", borderRadius: 6, padding: "8px 13px", fontSize: 13, fontWeight: 700, cursor: trimmed ? "pointer" : "not-allowed", opacity: trimmed ? 1 : 0.5, flexShrink: 0 }}>
          + Add
        </button>
        <button
          type="button"
          onClick={() => { setEditing(false); onChange(ROOM_CATS[0]); }}
          style={{ padding: "8px 11px", border: "1px solid #E2E8F0", borderRadius: 6, background: "#fff", color: "#64748B", fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
          ✕
        </button>
      </div>
    );
  }

  const options = (!value || allKnown.includes(value)) ? allKnown : [value, ...allKnown];
  const isCustomValue = value && extra.includes(value);

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <select
        value={value}
        onChange={e => {
          if (e.target.value === CUSTOM_OPT) { setEditing(true); onChange(""); }
          else onChange(e.target.value);
        }}
        style={{ flex: 1, padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }}>
        {options.map(r => <option key={r} value={r}>{r}</option>)}
        <option value={CUSTOM_OPT}>+ Add New Category…</option>
      </select>
      {isCustomValue && (
        <button
          type="button"
          title="Delete this custom category"
          onClick={() => {
            if (!window.confirm(`Delete custom category "${value}"? It will be removed for everyone.`)) return;
            onDelete?.(value);
            onChange(ROOM_CATS[0]);
          }}
          style={{ padding: "8px 11px", border: "1px solid #FCA5A5", borderRadius: 6, background: "#FEF2F2", color: "#EF4444", fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
          ✕
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   VENDOR MODAL — Step 1: choose type  Step 2: form
══════════════════════════════════════════════════ */
function VendorModal({ initial, onSave, onClose, saving }) {
  const [form, setForm]               = useState(initial);
  const [step, setStep]               = useState(initial.id ? 2 : 1);
  const [imgPreview, setImgPreview]   = useState(initial.image?.src || "");
  const [extraRoomCats, setExtraRoomCats] = useState([]);

  const mainImgRef     = useRef();
  const vehicleImgRef  = useRef();
  const activityImgRef = useRef();
  const roomGalleryRef = useRef();
  const pendingRow     = useRef(null);

  /* ── load custom room categories (same API as QuotationBuilder) ── */
  useEffect(() => {
    fetch("/api/dashboard/room-categories")
      .then(r => r.ok ? r.json() : [])
      .then(list => Array.isArray(list) && setExtraRoomCats(list.filter(n => !ROOM_CATS.includes(n))))
      .catch(() => {});
  }, []);

  async function addRoomCategory(name) {
    const clean = String(name || "").trim();
    if (!clean) return;
    setExtraRoomCats(p => p.includes(clean) ? p : [...p, clean]);
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
    setExtraRoomCats(p => p.filter(n => n !== name));
    try {
      const res = await fetch(`/api/dashboard/room-categories?name=${encodeURIComponent(name)}`, { method: "DELETE" });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) setExtraRoomCats(list.filter(n => !ROOM_CATS.includes(n)));
      }
    } catch {}
  }

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
  function addRoom()       { setForm(p => ({ ...p, hotelRooms: [...p.hotelRooms, { ...DEF_ROOM, seasons: [{ ...DEF_SEASON }] }] })); }
  function removeRoom(idx) { setForm(p => ({ ...p, hotelRooms: p.hotelRooms.filter((_, i) => i !== idx) })); }

  /* ── seasons (per room) ── */
  function setSeason(rIdx, sIdx, f, v) {
    setForm(p => {
      const rooms = [...p.hotelRooms];
      const seasons = [...(rooms[rIdx].seasons || [])];
      seasons[sIdx] = { ...seasons[sIdx], [f]: v };
      rooms[rIdx] = { ...rooms[rIdx], seasons };
      return { ...p, hotelRooms: rooms };
    });
  }
  function addSeason(rIdx) {
    setForm(p => {
      const rooms = [...p.hotelRooms];
      rooms[rIdx] = { ...rooms[rIdx], seasons: [...(rooms[rIdx].seasons || []), { ...DEF_SEASON }] };
      return { ...p, hotelRooms: rooms };
    });
  }
  function removeSeason(rIdx, sIdx) {
    setForm(p => {
      const rooms = [...p.hotelRooms];
      rooms[rIdx] = { ...rooms[rIdx], seasons: (rooms[rIdx].seasons || []).filter((_, i) => i !== sIdx) };
      return { ...p, hotelRooms: rooms };
    });
  }

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

  /* ── room gallery ── */
  function openRoomGallery(idx) { pendingRow.current = idx; roomGalleryRef.current?.click(); }
  function handleRoomGallery(e) {
    const idx = pendingRow.current;
    Array.from(e.target.files).forEach(file =>
      toBase64(file, src => setForm(p => {
        const rooms = [...p.hotelRooms];
        rooms[idx] = { ...rooms[idx], gallery: [...(rooms[idx].gallery || []), { src, alt: file.name }] };
        return { ...p, hotelRooms: rooms };
      }))
    );
    e.target.value = "";
  }

  /* ── main image ── */
  function handleMainImg(e) {
    const file = e.target.files[0]; if (!file) return;
    toBase64(file, src => { setImgPreview(src); set("image", { src, alt: file.name }); });
  }

  /* ── derived ── */
  const ACCENT    = form.vendorTab === "Transfers" ? "#EA580C" : form.vendorTab === "Activities" ? "#16A34A" : "#2563EB";
  const ACCENT_BG = form.vendorTab === "Transfers" ? "#FFF7ED" : form.vendorTab === "Activities" ? "#F0FDF4" : "#EFF4FF";
  const bizTypes  = BUSINESS_TYPES[form.vendorTab] || [];
  const addLabel  = form.vendorTab === "Stay" ? "+ Add Room Type" : form.vendorTab === "Transfers" ? "+ Add Vehicle" : "+ Add Activity";
  const onAddRow  = form.vendorTab === "Stay" ? addRoom : form.vendorTab === "Transfers" ? addVehicle : addActivity;

  /* ── shared contact section ── */
  const contactJSX = (
    <>
      <div style={{ ...S.sectionHead, color: ACCENT }}>Contact Person</div>
      <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div><label style={S.label}>Position</label>
          <select style={S.select} value={form.contactPerson.position} onChange={e => setContact("position", e.target.value)}>
            {POSITIONS.map(p => <option key={p}>{p}</option>)}
          </select></div>
        <div><label style={S.label}>First Name</label>
          <input style={S.input} placeholder="First Name" value={form.contactPerson.firstName} onChange={e => setContact("firstName", e.target.value)} /></div>
        <div><label style={S.label}>Last Name</label>
          <input style={S.input} placeholder="Last Name" value={form.contactPerson.lastName} onChange={e => setContact("lastName", e.target.value)} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 190px 1fr", gap: 10, marginBottom: 4 }}>
        <div><label style={S.label}>Email</label>
          <input style={S.input} type="email" placeholder="email@example.com" value={form.contactPerson.email} onChange={e => setContact("email", e.target.value)} /></div>
        <div><label style={S.label}>Country Code</label>
          <select style={S.select} value={form.contactPerson.countryCode} onChange={e => setContact("countryCode", e.target.value)}>
            {COUNTRY_CODES.map(c => <option key={c}>{c}</option>)}
          </select></div>
        <div><label style={S.label}>Contact Number</label>
          <input style={S.input} placeholder="Contact Number" value={form.contactPerson.contactNumber} onChange={e => setContact("contactNumber", e.target.value)} /></div>
      </div>
    </>
  );


  /* ─── STEP 1: Type selection ─────────────────── */
  if (step === 1) {
    const TYPES = [
      { key: "Stay",       emoji: "🏨", label: "Stay",       desc: "Hotels, Resorts, Homestays, Villas…",           color: "#2563EB", bg: "#EFF4FF", border: "#BFDBFE" },
      { key: "Transfers",  emoji: "🚗", label: "Transfers",  desc: "Car Rental, Taxi, Airport Transfer, Bus…",      color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" },
      { key: "Activities", emoji: "🎯", label: "Activities", desc: "Adventure, Sightseeing, Cultural Tours, Treks…", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
    ];
    return (
      <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,.18)", padding: "28px 28px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>Add New Vendor</h2>
              <p style={{ margin: "5px 0 0", fontSize: 13, color: "#64748B" }}>Choose vendor type to get started</p>
            </div>
            <button style={S.closeBtn} onClick={onClose}><MdClose size={20} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TYPES.map(t => (
              <button key={t.key}
                onClick={() => { set("vendorTab", t.key); setStep(2); }}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", border: `2px solid ${t.border}`, borderRadius: 12, background: t.bg, cursor: "pointer", textAlign: "left", width: "100%" }}>
                <span style={{ fontSize: 30, lineHeight: 1 }}>{t.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: t.color, marginBottom: 3 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{t.desc}</div>
                </div>
                <span style={{ color: t.color, fontSize: 22, fontWeight: 300 }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── STEP 2: Vendor form ─────────────────────── */
  const TYPE_EMOJI = form.vendorTab === "Stay" ? "🏨" : form.vendorTab === "Transfers" ? "🚗" : "🎯";

  return (
    <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.modal}>

        {/* Coloured header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px 14px", borderBottom: `3px solid ${ACCENT}`, background: ACCENT_BG }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!initial.id && (
              <button onClick={() => setStep(1)} title="Back to type selection"
                style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontSize: 24, lineHeight: 1, padding: "0 4px 0 0", fontWeight: 300 }}>←</button>
            )}
            <span style={{ fontSize: 22 }}>{TYPE_EMOJI}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: ACCENT }}>{initial.id ? "Edit" : "Add"} {form.vendorTab} Vendor</h2>
              <p style={{ margin: 0, fontSize: 11, color: "#64748B" }}>
                {form.vendorTab === "Stay" ? "Hotels, Resorts & Stays" : form.vendorTab === "Transfers" ? "Vehicles & Transport" : "Tours & Activities"}
              </p>
            </div>
          </div>
          <button style={S.closeBtn} onClick={onClose}><MdClose size={20} /></button>
        </div>

        {/* Scrollable body */}
        <div style={S.modalBody}>
          <input ref={mainImgRef}     type="file" accept="image/*"          hidden onChange={handleMainImg} />
          <input ref={vehicleImgRef}  type="file" accept="image/*"          hidden onChange={handleVehicleImg} />
          <input ref={activityImgRef} type="file" accept="image/*"          hidden onChange={handleActivityImg} />
          <input ref={roomGalleryRef} type="file" accept="image/*" multiple hidden onChange={handleRoomGallery} />

          {/* ═══════ STAY (blue) ═══════ */}
          {form.vendorTab === "Stay" && (
            <>
              {/* Business info row */}
              <div style={{ display: "flex", gap: 18, marginBottom: 16 }}>
                {/* Hotel image */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={S.imgBox} onClick={() => mainImgRef.current.click()}>
                    {imgPreview ? <img src={imgPreview} alt="hotel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <><MdImage size={34} color="#94a3b8" /><span style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>Click to upload</span></>}
                  </div>
                  {imgPreview && <button style={S.removeImg} onClick={() => { setImgPreview(""); set("image", { src: "", alt: "" }); }}>Remove</button>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div><label style={S.label}>Type of Business</label>
                      <select style={S.select} value={form.typeOfBusiness} onChange={e => set("typeOfBusiness", e.target.value)}>
                        <option value="">Select Type</option>
                        {bizTypes.map(t => <option key={t}>{t}</option>)}
                      </select></div>
                    <div><label style={S.label}>Star Rating</label>
                      <input style={S.input} type="number" min="1" max="5" step="0.5" placeholder="e.g. 4.5" value={form.starRating || ""} onChange={e => set("starRating", e.target.value)} /></div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>Hotel / Business Name</label>
                    <input style={S.input} placeholder="e.g. Hotel Fresh Wave Resort" value={form.businessName} onChange={e => set("businessName", e.target.value)} />
                  </div>
                  <div><label style={S.label}>Place / Location</label>
                    <input style={S.input} placeholder="e.g. Pahalgam, J&K" value={form.place} onChange={e => set("place", e.target.value)} /></div>
                </div>
              </div>

              {contactJSX}

              {/* Room Categories & Pricing */}
              <div style={{ ...S.sectionHead, color: "#2563EB" }}>Room Categories & Pricing</div>
              {form.hotelRooms.map((room, rIdx) => (
                <div key={rIdx} style={{ border: "1.5px solid #BFDBFE", borderRadius: 10, padding: "14px 14px 12px", marginBottom: 12, background: "#FAFCFF", position: "relative" }}>
                  {rIdx > 0 && <button style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, lineHeight: 1 }} onClick={() => removeRoom(rIdx)}>✕</button>}
                  <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr 1.2fr 1fr 80px", gap: 10, marginBottom: 12 }}>
                    <div><label style={S.label}>Room Display Name</label>
                      <input style={S.input} placeholder="e.g. Regal Classic Room" value={room.roomName || ""} onChange={e => setRoom(rIdx, "roomName", e.target.value)} /></div>
                    <div><label style={S.label}>Room Category</label>
                      <RoomCatSelect
                        value={room.roomType || ROOM_CATS[0]}
                        extra={extraRoomCats}
                        accent="#2563EB"
                        onChange={v => setRoom(rIdx, "roomType", v)}
                        onAdd={addRoomCategory}
                        onDelete={removeRoomCategory}
                      /></div>
                    <div><label style={S.label}>Bed Type</label>
                      <input style={S.input} placeholder="e.g. 1 Queen Bed" value={room.bedType || ""} onChange={e => setRoom(rIdx, "bedType", e.target.value)} /></div>
                    <div><label style={S.label}>Room Size</label>
                      <input style={S.input} placeholder="350 sq.ft" value={room.roomSize || ""} onChange={e => setRoom(rIdx, "roomSize", e.target.value)} /></div>
                    <div><label style={S.label}>Total</label>
                      <input style={S.input} type="number" placeholder="14" value={room.totalRooms || ""} onChange={e => setRoom(rIdx, "totalRooms", e.target.value)} /></div>
                  </div>
                  {/* Season pricing table */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1e293b" }}>Pricing by Season <span style={{ color: "#94a3b8", fontWeight: 400 }}>(per room / per night · DBL occ.)</span></span>
                    <button onClick={() => addSeason(rIdx)} style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", background: "none", border: "1px solid #2563EB", borderRadius: 5, padding: "3px 10px", cursor: "pointer" }}>+ Add Season</button>
                  </div>
                  <div style={{ overflowX: "auto", marginBottom: 10 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#EFF4FF" }}>
                          {["Season / Date Range", "CPAI\n(Room + Breakfast)", "MAPAI\n(Breakfast & Dinner)", "APAI\n(All Meals)", ""].map((h, hi) => (
                            <th key={hi} style={{ padding: "7px 8px", textAlign: hi === 0 ? "left" : "center", fontWeight: 700, color: "#2563EB", fontSize: 11, whiteSpace: "pre-line", borderBottom: "2px solid #BFDBFE", minWidth: hi === 0 ? 160 : hi === 4 ? 24 : 120 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(room.seasons || []).map((s, sIdx) => (
                          <tr key={sIdx} style={{ background: sIdx % 2 === 0 ? "#fff" : "#F8FAFF", borderBottom: "1px solid #EEF2FF" }}>
                            <td style={{ padding: "6px 6px" }}>
                              <input value={s.label} onChange={e => setSeason(rIdx, sIdx, "label", e.target.value)} placeholder="e.g. Nov 2026 – Mar 2027" style={{ ...SS.cell, width: "100%" }} />
                            </td>
                            {["cpai", "mapai", "apai"].map(f => (
                              <td key={f} style={{ padding: "6px 6px", textAlign: "center" }}>
                                <input type="number" value={s[f]} onChange={e => setSeason(rIdx, sIdx, f, e.target.value)} placeholder="₹" style={{ ...SS.cell, width: 100, textAlign: "center" }} />
                              </td>
                            ))}
                            <td style={{ padding: "6px 4px", textAlign: "center" }}>
                              {(room.seasons || []).length > 1 && <button onClick={() => removeSeason(rIdx, sIdx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13, padding: 0 }}>✕</button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Extra person / child rates (flat per room) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div>
                      <label style={{ ...S.label, color: "#64748B" }}>Extra Adult per Night (₹)</label>
                      <input style={S.input} type="number" placeholder="e.g. 2000" value={room.extraPerson || ""} onChange={e => setRoom(rIdx, "extraPerson", e.target.value)} />
                    </div>
                    <div>
                      <label style={{ ...S.label, color: "#64748B" }}>Child with Bed per Night (₹)</label>
                      <input style={S.input} type="number" placeholder="e.g. 1000" value={room.childWithBed || ""} onChange={e => setRoom(rIdx, "childWithBed", e.target.value)} />
                    </div>
                    <div>
                      <label style={{ ...S.label, color: "#64748B" }}>Child without Bed per Night (₹)</label>
                      <input style={S.input} type="number" placeholder="e.g. 0 / free" value={room.childWithoutBed || ""} onChange={e => setRoom(rIdx, "childWithoutBed", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ═══════ TRANSFERS (orange) ═══════ */}
          {form.vendorTab === "Transfers" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div><label style={S.label}>Type of Business</label>
                  <select style={S.select} value={form.typeOfBusiness} onChange={e => set("typeOfBusiness", e.target.value)}>
                    <option value="">Select Type</option>
                    {bizTypes.map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label style={S.label}>Business Name</label>
                  <input style={S.input} placeholder="e.g. Shiv Shakti Travels" value={form.businessName} onChange={e => set("businessName", e.target.value)} /></div>
                <div><label style={S.label}>Place / Location</label>
                  <input style={S.input} placeholder="e.g. Srinagar, J&K" value={form.place} onChange={e => set("place", e.target.value)} /></div>
              </div>
              {contactJSX}
              <div style={{ ...S.sectionHead, color: "#EA580C" }}>Vehicles & Pricing</div>
              {form.vehicles.map((veh, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12, padding: "14px", border: "1.5px solid #FED7AA", borderRadius: 10, background: "#FFFBF7", position: "relative" }}>
                  <div style={{ flexShrink: 0, width: 90, height: 68, border: "2px dashed #FED7AA", borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => openVehicleImg(idx)}>
                    {veh.vehicleImage?.src ? <img src={veh.vehicleImage.src} alt="v" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MdDirectionsCar size={32} color="#EA580C" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 8, marginBottom: 10 }}>
                      <div><label style={S.label}>Vehicle Type</label>
                        <select style={S.select} value={veh.vehicleType} onChange={e => setVeh(idx, "vehicleType", e.target.value)}>
                          <option value="">Select</option>
                          {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select></div>
                      <div><label style={S.label}>Price per Day (₹)</label>
                        <input style={S.input} type="number" placeholder="e.g. 2300" value={veh.pricePerDay} onChange={e => setVeh(idx, "pricePerDay", e.target.value)} /></div>
                      <div><label style={S.label}>Passengers</label>
                        <input style={S.input} type="number" placeholder="4" value={veh.passengers} onChange={e => setVeh(idx, "passengers", e.target.value)} /></div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
                      {VEH_INCLUSIONS.map(inc => (
                        <label key={inc} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" style={{ accentColor: "#EA580C" }} checked={(veh.inclusions || []).includes(inc)} onChange={() => toggleInclusion(idx, inc)} />
                          {inc}
                        </label>
                      ))}
                    </div>
                  </div>
                  {idx > 0 && <button style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }} onClick={() => removeVehicle(idx)}>✕</button>}
                </div>
              ))}
            </>
          )}

          {/* ═══════ ACTIVITIES (green) ═══════ */}
          {form.vendorTab === "Activities" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div><label style={S.label}>Type of Business</label>
                  <select style={S.select} value={form.typeOfBusiness} onChange={e => set("typeOfBusiness", e.target.value)}>
                    <option value="">Select Type</option>
                    {bizTypes.map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label style={S.label}>Business Name</label>
                  <input style={S.input} placeholder="e.g. Kashmir Adventures" value={form.businessName} onChange={e => set("businessName", e.target.value)} /></div>
                <div><label style={S.label}>Place / Location</label>
                  <input style={S.input} placeholder="e.g. Gulmarg" value={form.place} onChange={e => set("place", e.target.value)} /></div>
              </div>
              {contactJSX}
              <div style={{ ...S.sectionHead, color: "#16A34A" }}>Activities & Pricing</div>
              {form.activities.map((act, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12, padding: "14px", border: "1.5px solid #BBF7D0", borderRadius: 10, background: "#F0FDF8", position: "relative" }}>
                  <div style={{ flexShrink: 0, width: 100, height: 80, border: "2px dashed #BBF7D0", borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => openActivityImg(idx)}>
                    {act.activityImage?.src ? <img src={act.activityImage.src} alt="a" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MdImage size={32} color="#16A34A" />}
                  </div>
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div><label style={S.label}>Activity Name</label>
                      <input style={S.input} placeholder="e.g. Gondola Ride" value={act.activityName} onChange={e => setAct(idx, "activityName", e.target.value)} /></div>
                    <div><label style={S.label}>Price per Person (₹)</label>
                      <input style={S.input} type="number" placeholder="e.g. 1500" value={act.pricePerPerson} onChange={e => setAct(idx, "pricePerPerson", e.target.value)} /></div>
                    <div><label style={S.label}>Duration</label>
                      <input style={S.input} placeholder="e.g. 2 hours" value={act.duration} onChange={e => setAct(idx, "duration", e.target.value)} /></div>
                    <div style={{ gridColumn: "1/-1" }}><label style={S.label}>Description</label>
                      <textarea style={{ ...S.input, height: 56, resize: "vertical" }} placeholder="Brief description…" value={act.description} onChange={e => setAct(idx, "description", e.target.value)} /></div>
                  </div>
                  {idx > 0 && <button style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }} onClick={() => removeActivity(idx)}>✕</button>}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ ...S.modalFoot, justifyContent: "space-between" }}>
          <button style={{ ...S.addCatBtn, color: ACCENT, borderColor: ACCENT }} onClick={onAddRow}>{addLabel}</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
            <button style={{ ...S.doneBtn, background: ACCENT, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={() => onSave(form)}>
              {saving ? "Saving…" : "Save Vendor"}
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
      // Coerce numeric fields so Mongoose doesn't get empty strings for Number fields
      const payload = {
        ...form,
        starRating: form.starRating !== "" && form.starRating != null ? Number(form.starRating) : undefined,
        hotelRooms: (form.hotelRooms || []).map(r => ({
          ...r,
          totalRooms:      Number(r.totalRooms)      || 0,
          extraPerson:     Number(r.extraPerson)     || 0,
          childWithBed:    Number(r.childWithBed)    || 0,
          childWithoutBed: Number(r.childWithoutBed) || 0,
          seasons: (r.seasons || []).map(s => ({
            label: s.label || "",
            cpai:  Number(s.cpai)  || 0,
            mapai: Number(s.mapai) || 0,
            apai:  Number(s.apai)  || 0,
          })),
          // legacy fields (keep for backward compat)
          pricePerNight: r.pricePerNight !== "" ? Number(r.pricePerNight) || 0 : 0,
          cp:     r.cp  !== "" ? Number(r.cp)  || 0 : 0,
          map:    r.map !== "" ? Number(r.map) || 0 : 0,
          ap:     r.ap  !== "" ? Number(r.ap)  || 0 : 0,
          guests: Number(r.guests) || 2,
        })),
      };
      const res = await fetch(isEdit ? `/api/dashboard/vendors/${form.id}` : "/api/dashboard/vendors", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      hotelRooms:    v.hotelRooms?.length ? v.hotelRooms.map(r => ({
        roomType:   r.roomType   || ROOM_CATS[0],
        roomName:   r.roomName   || "",
        bedType:    r.bedType    || "",
        roomSize:   r.roomSize   || "",
        totalRooms: r.totalRooms ?? "",
        extraPerson:     r.extraPerson     ?? "",
        childWithBed:    r.childWithBed    ?? "",
        childWithoutBed: r.childWithoutBed ?? "",
        amenities: r.amenities || [],
        gallery:   r.gallery   || [],
        seasons: r.seasons?.length ? r.seasons.map(s => ({
          label: s.label || "",
          cpai:  s.cpai  || "",
          mapai: s.mapai || "",
          apai:  s.apai  || "",
        })) : [{ ...DEF_SEASON }],
        // legacy
        pricePerNight: r.pricePerNight ?? "", cp: r.cp ?? "", map: r.map ?? "", ap: r.ap ?? "", guests: r.guests ?? 2,
      })) : EMPTY_FORM.hotelRooms,
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

  /* ── tab accent colours ── */
  const TAB_CFG = {
    Stay:       { color: "#2563EB", bg: "#EFF4FF", border: "#BFDBFE", Icon: MdHotel },
    Transfers:  { color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA", Icon: MdDirectionsBus },
    Activities: { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", Icon: MdOutlineExplore },
  };
  const ACCENT = TAB_CFG[tab]?.color || "#2563EB";

  /* ── stat counts ── */
  const totalAll   = vendors.length;
  const totalActive = vendors.filter(v => v.status !== "Inactive").length;
  const counts = {
    Stay:       vendors.filter(v => v.vendorTab === "Stay").length,
    Transfers:  vendors.filter(v => v.vendorTab === "Transfers").length,
    Activities: vendors.filter(v => v.vendorTab === "Activities").length,
  };

  return (
    <>
      <Head><title>Vendors — Tourwatchout</title></Head>

      <style>{`
        .vnd-card { transition: box-shadow .15s; }
        .vnd-card:hover { box-shadow: 0 6px 24px rgba(15,27,51,.10) !important; }
        .vnd-tab-btn { transition: all .15s; }
        .vnd-tab-btn:hover { opacity: .85; }
        .vnd-act-btn { transition: background .12s; }
        .vnd-act-btn:hover { background: #f1f5f9; }
      `}</style>

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

        {/* ── Stats bar ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Vendors",   value: totalAll,                  color: "#6366F1", bg: "#EEF2FF", Icon: MdStorefront },
            { label: "Stay",            value: counts.Stay,               color: "#2563EB", bg: "#EFF4FF", Icon: MdHotel },
            { label: "Transfers",       value: counts.Transfers,          color: "#EA580C", bg: "#FFF7ED", Icon: MdDirectionsBus },
            { label: "Activities",      value: counts.Activities,         color: "#16A34A", bg: "#F0FDF4", Icon: MdOutlineExplore },
            { label: "Active Vendors",  value: totalActive,               color: "#0891B2", bg: "#ECFEFF", Icon: MdPeople },
          ].map(({ label, value, color, bg, Icon }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #E8EDF5", boxShadow: "0 1px 4px rgba(15,27,51,.05)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>{value}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab bar + Add button ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {TABS.map(t => {
              const cfg = TAB_CFG[t];
              const active = tab === t;
              return (
                <button key={t} className="vnd-tab-btn"
                  onClick={() => { setTab(t); setPage(1); setFilterBiz("All Vendors"); setFilterLoc("All Locations"); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, border: `2px solid ${active ? cfg.color : "#E8EDF5"}`, background: active ? cfg.bg : "#fff", cursor: "pointer", fontWeight: active ? 700 : 500, fontSize: 14, color: active ? cfg.color : "#64748B" }}>
                  <cfg.Icon size={17} />
                  {t}
                  <span style={{ fontSize: 11, fontWeight: 700, background: active ? cfg.color : "#E8EDF5", color: active ? "#fff" : "#64748B", borderRadius: 99, padding: "1px 7px", marginLeft: 2 }}>{counts[t]}</span>
                </button>
              );
            })}
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", background: ACCENT, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,.25)" }} onClick={openAdd}>
            <MdAdd size={19} /> Add New Vendor
          </button>
        </div>

        {/* ── Search + filter bar ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", background: "#fff", border: "1px solid #E8EDF5", borderRadius: 10, padding: "10px 14px", boxShadow: "0 1px 3px rgba(15,27,51,.04)" }}>
          <MdFilterList size={18} color="#94A3B8" />
          <div style={{ position: "relative", flex: 1 }}>
            <MdSearch size={16} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input style={{ width: "100%", padding: "8px 10px 8px 32px", border: "1px solid #E8EDF5", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", background: "#F8FAFC" }}
              placeholder={`Search ${tab === "Stay" ? "hotels, resorts" : tab === "Transfers" ? "car rentals, taxis" : "tours, activities"}…`}
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div style={{ width: 1, height: 28, background: "#E8EDF5", flexShrink: 0 }} />
          <select style={{ padding: "8px 10px", border: "1px solid #E8EDF5", borderRadius: 8, fontSize: 13, outline: "none", background: "#F8FAFC", color: "#374151", cursor: "pointer" }}
            value={filterBiz} onChange={e => { setFilterBiz(e.target.value); setPage(1); }}>
            {bizOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <select style={{ padding: "8px 10px", border: "1px solid #E8EDF5", borderRadius: 8, fontSize: 13, outline: "none", background: "#F8FAFC", color: "#374151", cursor: "pointer" }}
            value={filterLoc} onChange={e => { setFilterLoc(e.target.value); setPage(1); }}>
            {locOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <select style={{ padding: "8px 10px", border: "1px solid #E8EDF5", borderRadius: 8, fontSize: 13, outline: "none", background: "#F8FAFC", color: "#374151", cursor: "pointer" }}
            value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {["Date Created", "Name A-Z"].map(o => <option key={o}>{o}</option>)}
          </select>
          <span style={{ fontSize: 12, color: "#94A3B8", flexShrink: 0, fontWeight: 600 }}>{list.length} {tab === "Stay" ? "hotels" : tab === "Transfers" ? "operators" : "providers"}</span>
        </div>

        {/* ── Vendor Cards ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#94A3B8", fontSize: 15 }}>Loading vendors…</div>
        ) : paged.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{tab === "Stay" ? "🏨" : tab === "Transfers" ? "🚗" : "🎯"}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No {tab} vendors yet</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>Add your first {tab.toLowerCase()} vendor to get started</div>
            <button style={{ padding: "10px 24px", background: ACCENT, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }} onClick={openAdd}>+ Add {tab} Vendor</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {paged.map(v => {
              const isExp    = expanded === v.id;
              const pricing  = getPricingDisplay(v);
              const expData  = getExpandedRows(v);
              const contact  = v.contactPerson || {};
              const name     = [contact.position, contact.firstName, contact.lastName].filter(Boolean).join(" ");
              const phone    = contact.contactNumber ? `${contact.countryCode?.split(" ")[0] || ""} ${contact.contactNumber}` : null;
              const cfg      = TAB_CFG[tab] || TAB_CFG.Stay;
              const roomCount = v.hotelRooms?.filter(r => r.roomName || r.roomType).length || 0;
              const vehCount  = v.vehicles?.filter(vh => vh.vehicleType).length || 0;
              const actCount  = v.activities?.filter(a => a.activityName).length || 0;
              const subCount  = tab === "Stay" ? roomCount : tab === "Transfers" ? vehCount : actCount;
              const subLabel  = tab === "Stay" ? "room type" : tab === "Transfers" ? "vehicle type" : "activity";

              return (
                <div key={v.id} className="vnd-card" style={{ background: "#fff", border: "1px solid #E8EDF5", borderRadius: 14, boxShadow: "0 2px 8px rgba(15,27,51,.05)", overflow: "hidden" }}>

                  {/* Main card row */}
                  <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>

                    {/* Left: image strip */}
                    <div style={{ width: 90, flexShrink: 0, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {v.image?.src
                        ? <img src={v.image.src} alt={v.businessName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <cfg.Icon size={28} color={cfg.color} style={{ opacity: .5 }} />
                          </div>
                      }
                    </div>

                    {/* Center: main info */}
                    <div style={{ flex: 1, padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>{v.businessName || "—"}</span>
                            {v.typeOfBusiness && <span style={{ fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 6, padding: "2px 8px" }}>{v.typeOfBusiness}</span>}
                            {v.starRating > 0 && (
                              <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 700, color: "#F59E0B" }}>
                                <MdStar size={14} />{v.starRating}
                              </span>
                            )}
                            <span style={{ fontSize: 10, fontWeight: 700, background: v.status === "Inactive" ? "#FEF2F2" : "#F0FDF4", color: v.status === "Inactive" ? "#EF4444" : "#16A34A", border: v.status === "Inactive" ? "1px solid #FCA5A5" : "1px solid #86EFAC", borderRadius: 99, padding: "2px 8px" }}>
                              {v.status === "Inactive" ? "● Inactive" : "● Active"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                            {v.place && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#64748B" }}><MdLocationOn size={15} color="#94A3B8" />{v.place}</span>}
                            {name && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#64748B" }}><MdPeople size={14} color="#94A3B8" />{name}</span>}
                            {phone && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#64748B" }}><MdPhone size={14} color="#94A3B8" />{phone}</span>}
                            {contact.email && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#64748B" }}><MdEmail size={14} color="#94A3B8" />{contact.email}</span>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button className="vnd-act-btn" onClick={() => openEdit(v)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", border: `1px solid ${cfg.border}`, borderRadius: 8, background: cfg.bg, color: cfg.color, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            <MdEdit size={15} /> Edit
                          </button>
                          <button className="vnd-act-btn" onClick={() => deleteVendor(v.id)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #FCA5A5", borderRadius: 8, background: "#FEF2F2", color: "#EF4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            <MdDelete size={15} /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Bottom row: pricing + expand */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                          {pricing ? (
                            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                              <span style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>₹{Number(pricing.price).toLocaleString("en-IN")}</span>
                              <span style={{ fontSize: 11, color: "#94A3B8" }}>/ night {pricing.mealPlan ? `· ${pricing.mealPlan}` : ""}</span>
                              {tab === "Transfers" && <span style={{ fontSize: 11, color: "#94A3B8" }}>/ day</span>}
                              {tab === "Activities" && <span style={{ fontSize: 11, color: "#94A3B8" }}>/ person</span>}
                            </div>
                          ) : (
                            <span style={{ fontSize: 13, color: "#CBD5E1", fontStyle: "italic" }}>No pricing added</span>
                          )}
                          {subCount > 0 && (
                            <span style={{ fontSize: 12, color: "#64748B", background: "#F8FAFC", border: "1px solid #E8EDF5", borderRadius: 6, padding: "3px 10px" }}>
                              {subCount} {subLabel}{subCount !== 1 ? "s" : ""}
                            </span>
                          )}
                          {v.updatedAt && (
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>Updated {daysAgo(v.updatedAt)}d ago</span>
                          )}
                        </div>
                        {expData && (
                          <button onClick={() => setExpanded(isExp ? null : v.id)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", border: "1px solid #E8EDF5", borderRadius: 8, background: isExp ? "#F8FAFC" : "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            {isExp ? <><MdExpandLess size={16} /> Hide Rate Card</> : <><MdExpandMore size={16} /> View Rate Card</>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded rate card */}
                  {isExp && expData && (
                    <div style={{ borderTop: `2px solid ${cfg.border}`, background: cfg.bg, padding: "14px 20px 16px" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: cfg.color, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>Rate Card</div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
                          <thead>
                            <tr style={{ background: cfg.color }}>
                              {expData.headers.map((h, hi) => (
                                <th key={hi} style={{ padding: "8px 14px", textAlign: hi > 2 ? "center" : "left", fontWeight: 700, color: "#fff", fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {expData.rows.map((row, ri) => (
                              <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : cfg.bg, borderBottom: "1px solid #F1F5F9" }}>
                                {row.map((cell, ci) => (
                                  <td key={ci} style={{ padding: "8px 14px", textAlign: ci > 2 ? "center" : "left", fontWeight: ci > 2 && cell !== "—" ? 700 : 400, color: ci > 2 && cell !== "—" ? "#0F172A" : "#374151" }}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, padding: "12px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B" }}>
              <span>Show</span>
              <select style={{ padding: "5px 8px", border: "1px solid #E8EDF5", borderRadius: 6, fontSize: 13, outline: "none" }}
                value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              <span>of <strong>{list.length}</strong> vendors</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ padding: "7px 12px", border: "1px solid #E8EDF5", borderRadius: 8, background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? .4 : 1, display: "flex", alignItems: "center" }}
                onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><MdChevronLeft size={18} /></button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  style={{ padding: "7px 13px", border: `1px solid ${page === n ? ACCENT : "#E8EDF5"}`, borderRadius: 8, background: page === n ? ACCENT : "#fff", color: page === n ? "#fff" : "#374151", fontWeight: page === n ? 700 : 400, cursor: "pointer", fontSize: 13 }}>{n}</button>
              ))}
              <button style={{ padding: "7px 12px", border: "1px solid #E8EDF5", borderRadius: 8, background: "#fff", cursor: page >= totalPages ? "not-allowed" : "pointer", opacity: page >= totalPages ? .4 : 1, display: "flex", alignItems: "center" }}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}><MdChevronRight size={18} /></button>
            </div>
          </div>
        )}

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
  /* modal */
  overlay:      { position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px", overflowY: "auto" },
  modal:        { background: "#fff", borderRadius: 14, width: "100%", maxWidth: 940, boxShadow: "0 20px 60px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column" },
  closeBtn:     { background: "none", border: "none", cursor: "pointer", color: "#64748B", display: "flex", padding: 4 },
  modalBody:    { display: "flex", flexDirection: "column", padding: "20px 24px", overflowY: "auto", maxHeight: "calc(90vh - 140px)" },
  modalFoot:    { display: "flex", alignItems: "center", padding: "14px 24px", borderTop: "1px solid #F1F5F9" },
  imgBox:       { width: 160, height: 190, border: "2px dashed #CBD5E1", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", background: "#F8FAFC" },
  removeImg:    { marginTop: 6, fontSize: 11, color: "#E84949", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" },
  label:        { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 },
  input:        { width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" },
  select:       { width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" },
  sectionHead:  { fontSize: 13, fontWeight: 700, color: "#1E293B", margin: "16px 0 10px", borderBottom: "1px solid #F1F5F9", paddingBottom: 6 },
  addCatBtn:    { padding: "7px 16px", background: "none", border: "1px solid #2563EB", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#2563EB", cursor: "pointer" },
  cancelBtn:    { padding: "9px 22px", background: "#F1F5F9", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#374151" },
  doneBtn:      { padding: "9px 28px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" },
};

/* ─── Season cell input style ─── */
const SS = {
  cell: { padding: "5px 7px", border: "1px solid #DBEAFE", borderRadius: 5, fontSize: 12, outline: "none", boxSizing: "border-box", background: "#fff", fontFamily: "inherit" },
};
