import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdChevronLeft,
  MdCheckCircle, MdMoreHoriz, MdImage, MdClose, MdAdd, MdDelete, MdSearch,
} from "react-icons/md";
import { isAuthenticated } from "../../../utils/voucherAuth";
import Sidebar from "../../../components/backend/Sidebar";

/* ── Constants ── */
const PKG_TYPES    = ["Family", "Couple", "Corporate", "Honeymoon", "Group"];
const PKG_SUBTYPES = ["Economy", "Deluxe", "Premium"];
const DURATION_OPTS = [
  "1N 2D","2N 3D","3N 4D","4N 5D","5N 6D","6N 7D","7N 8D","8N 9D","9N 10D","10N 11D",
  "11N 12D","12N 13D","13N 14D","14N 15D",
];
const PRICE_TYPES = [
  "per person on twin sharing","per person on triple sharing",
  "per person on quad sharing","per couple","per group",
];
const CALLBACK_TYPES = ["Call", "WhatsApp", "Email"];

const DEFAULT_AMENITIES = [
  { name: "Meals",           icon: "/assets/images/icons/itinerary/icon1.svg" },
  { name: "Hotel",           icon: "/assets/images/icons/itinerary/icon2.svg" },
  { name: "Sightseeing",     icon: "/assets/images/icons/itinerary/icon3.svg" },
  { name: "WiFi",            icon: "/assets/images/icons/itinerary/icon4.svg" },
  { name: "Transport",       icon: "/assets/images/icons/itinerary/icon5.svg" },
  { name: "Local Guide",     icon: "/assets/images/icons/itinerary/icon6.svg" },
  { name: "Safe to Travel",  icon: "/assets/images/icons/itinerary/icon7.svg" },
  { name: "DJ Night",        icon: "/assets/images/icons/itinerary/icon8.svg" },
];

/* ── Image Uploader ── */
function ImageUploader({ label, value, onChange, hint, accept }) {
  const fileRef = useRef(null);
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) { alert("Max file size is 6 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  }
  return (
    <div className="bk-img-col">
      <div className="bk-img-col-header">
        <span className="bk-img-col-title">{label}</span>
        <span className={`bk-img-status-icon ${value ? "uploaded" : ""}`}>
          {value ? <MdCheckCircle size={22} /> : <MdMoreHoriz size={22} />}
        </span>
      </div>
      {hint && <p className="bk-img-note"><strong>Note:</strong> {hint}</p>}
      <div className={`bk-upload-area ${value ? "has-image" : ""}`} onClick={() => fileRef.current?.click()}>
        {value ? (
          <>
            <img src={value} alt={label} className="bk-upload-preview" />
            <button className="bk-upload-remove" onClick={e => { e.stopPropagation(); onChange(null); }}>
              <MdClose size={14} />
            </button>
          </>
        ) : (
          <div className="bk-upload-placeholder"><MdImage size={32} /><span>Click to upload</span></div>
        )}
      </div>
      <input ref={fileRef} type="file"
        accept={accept || "image/svg+xml,image/png,image/jpeg,image/webp"}
        style={{ display: "none" }} onChange={handleFile} onClick={e => { e.target.value = ""; }} />
    </div>
  );
}

/* ── Day Icon Uploader ── */
function DayIconUploader({ value, onChange }) {
  const fileRef = useRef(null);
  const isUrl   = value && (value.startsWith("/") || value.startsWith("http") || value.startsWith("data:"));

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="bk-day-icon-uploader" onClick={() => fileRef.current?.click()} title="Click to upload icon">
      {isUrl ? (
        <>
          <img src={value} alt="icon" className="bk-day-icon-img" />
          <button className="bk-day-icon-remove" onClick={e => { e.stopPropagation(); onChange(""); }}>
            <MdClose size={11} />
          </button>
        </>
      ) : (
        <div className="bk-day-icon-placeholder">
          <MdAdd size={18} />
          <span>Select Icon</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp"
        style={{ display: "none" }} onChange={handleFile} onClick={e => { e.target.value = ""; }} />
    </div>
  );
}

/* ── Amenity Picker Modal ── */
function AmenityPicker({ selected, onChange, allAmenities, onSaveCustom }) {
  const [open, setOpen]           = useState(false);
  const [search, setSearch]       = useState("");
  const [draft, setDraft]         = useState([]);
  const [customName, setCustomName] = useState("");
  const [customIcon, setCustomIcon] = useState(null);
  const [saving, setSaving]       = useState(false);
  const iconRef = useRef(null);

  function openModal() {
    setDraft(selected.map(a => a.name));
    setSearch("");
    setOpen(true);
  }

  function toggleDraft(name) {
    setDraft(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  }

  function handleSelect() {
    const chosen = allAmenities.filter(a => draft.includes(a.name));
    onChange(chosen);
    setOpen(false);
  }

  async function handleAddCustom() {
    if (!customName.trim()) return;
    setSaving(true);
    try {
      const saved = await onSaveCustom(customName.trim(), customIcon);
      if (saved) {
        setDraft(prev => [...prev, saved.name]);
        setCustomName("");
        setCustomIcon(null);
      }
    } finally { setSaving(false); }
  }

  const filtered = allAmenities.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Selected chips */}
      <div className="bk-amenity-chips">
        {selected.map(a => (
          <div key={a.name} className="bk-amenity-chip">
            {a.icon && <img src={a.icon} alt={a.name} className="bk-amenity-chip-icon" />}
            <span>{a.name}</span>
            <button className="bk-amenity-chip-remove"
              onClick={() => onChange(selected.filter(x => x.name !== a.name))}>
              <MdClose size={12} />
            </button>
          </div>
        ))}
        <button className="bk-amenity-add-btn" onClick={openModal}>
          <MdAdd size={15} /> Add Amenities
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="bk-modal-overlay" onClick={() => setOpen(false)}>
          <div className="bk-modal" onClick={e => e.stopPropagation()}>
            <div className="bk-modal-header">
              <span className="bk-modal-title">icon set</span>
              <button className="bk-modal-close" onClick={() => setOpen(false)}><MdClose size={18} /></button>
            </div>

            {/* Search */}
            <div className="bk-modal-search-wrap">
              <MdSearch size={18} className="bk-modal-search-icon" />
              <input
                className="bk-modal-search"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Amenity grid */}
            <div className="bk-amenity-modal-grid">
              {filtered.map(a => {
                const isOn = draft.includes(a.name);
                return (
                  <div
                    key={a.name}
                    className={`bk-amenity-modal-item ${isOn ? "selected" : ""}`}
                    onClick={() => toggleDraft(a.name)}
                  >
                    <div className="bk-amenity-modal-icon">
                      {a.icon
                        ? <img src={a.icon} alt={a.name} />
                        : <span style={{fontSize:20}}>✦</span>}
                    </div>
                    <span className="bk-amenity-modal-name">{a.name}</span>
                    <span className="bk-amenity-modal-radio">{isOn ? "●" : ""}</span>
                  </div>
                );
              })}
            </div>

            {/* Add custom amenity */}
            <div className="bk-custom-amenity-row">
              <input
                className="bk-form-input"
                placeholder="Custom amenity name"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
              <div
                className="bk-custom-icon-upload"
                onClick={() => iconRef.current?.click()}
                title="Upload icon"
              >
                {customIcon
                  ? <img src={customIcon} alt="icon" style={{width:24,height:24,objectFit:"contain"}} />
                  : <><MdImage size={18} /><span>Icon</span></>}
              </div>
              <input ref={iconRef} type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp"
                style={{ display: "none" }}
                onChange={e => {
                  const f = e.target.files[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = ev => setCustomIcon(ev.target.result);
                  reader.readAsDataURL(f);
                  e.target.value = "";
                }}
              />
              <button className="bk-custom-amenity-add" onClick={handleAddCustom} disabled={saving || !customName.trim()}>
                {saving ? "…" : "Add"}
              </button>
            </div>

            <div className="bk-modal-footer">
              <button className="bk-modal-select" onClick={handleSelect}>Select</button>
              <button className="bk-modal-cancel" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Subtype Progress Bar ── */
function SubtypeProgress({ destination, packageType, currentSubtype, siblings }) {
  if (!destination || !packageType) return null;
  const siblingSubs = siblings.map(p => p.packageSubtype);
  return (
    <div className="pkg-progress-bar">
      <span className="pkg-progress-label">Package completion:</span>
      {PKG_SUBTYPES.map(s => {
        const done = s === currentSubtype || siblingSubs.includes(s);
        return (
          <span key={s} className={`pkg-progress-chip ${done ? "done" : "missing"}`}>
            {done ? "✓" : "○"} {s}
          </span>
        );
      })}
      {PKG_SUBTYPES.every(s => s === currentSubtype || siblingSubs.includes(s)) ? (
        <span className="pkg-progress-ready">All subtypes ready — can publish!</span>
      ) : (
        <span className="pkg-progress-hint">Save all 3 subtypes before publishing</span>
      )}
    </div>
  );
}

/* ── Blank form ── */
const BLANK = {
  destination: "", packageType: "Family", packageSubtype: "Economy",
  packageName: "", duration: "5N/6D", itineraryTitle: "",
  destinationHighlights: "", amenities: [],
  basePrice: "", finalPrice: "", priceType: "per person on twin sharing",
  inclusions: "", exclusions: "", aboutText: "", bucketListText: "",
  bookingPolicy: "", cancellationPolicy: "", termsConditions: "",
  metaTitle: "", metaDescription: "", metaKeywords: "",
  status: "Inactive",
  webBanner:    { src: null, alt: "" },
  mobileBanner: { src: null, alt: "" },
  gallery:      [{ src: null, alt: "" }, { src: null, alt: "" }, { src: null, alt: "" }, { src: null, alt: "" }],
  priceImage:   { src: null, alt: "" },
  advertisement: { headline: "", subtext: "", callbackType: "Call", image: { src: null, alt: "" } },
  aboutImages:   [{ src: null, alt: "" }, { src: null, alt: "" }],
  bucketImages:  [{ src: null, alt: "" }, { src: null, alt: "" }],
  days: [{ day: 1, title: "", icon: "", description: "" }],
};

/* ── Normalise amenities from old string[] format ── */
function normaliseAmenities(raw, allAmenities) {
  if (!Array.isArray(raw)) return [];
  return raw.map(a => {
    if (typeof a === "object" && a.name) return a;
    const found = allAmenities.find(x => x.name === a);
    return found || { name: a, icon: null };
  });
}

export default function CreatePackage() {
  const router = useRouter();
  const { id, destination: preDestination, packageType: preType, subtype: preSub } = router.query;
  const isEdit = Boolean(id);

  const [ready, setReady]         = useState(false);
  const [sidebar, setSidebar]     = useState(false);
  const [form, setForm]           = useState(BLANK);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [destinations, setDests]  = useState([]);
  const [siblings, setSiblings]   = useState([]);
  const [customAmenities, setCustomAmenities] = useState([]);

  const allAmenities = [
    ...DEFAULT_AMENITIES,
    ...customAmenities.filter(c => !DEFAULT_AMENITIES.find(d => d.name === c.name)),
  ];

  // Load destinations
  useEffect(() => {
    fetch("/api/dashboard/destinations")
      .then(r => r.json())
      .then(data => setDests(Array.isArray(data) ? data.filter(d => d.status === "Active") : []))
      .catch(() => {});
  }, []);

  // Load custom amenities
  useEffect(() => {
    fetch("/api/dashboard/amenities")
      .then(r => r.json())
      .then(data => setCustomAmenities(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Load package if editing or pre-fill from query
  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/dashboard/login"); return; }
    if (id) {
      fetch("/api/dashboard/packages")
        .then(r => r.json())
        .then(all => {
          const found = all.find(p => p.id === id);
          if (found) {
            setForm({
              ...BLANK, ...found,
              amenities:   found.amenities || [],
              days:        found.days?.length       ? found.days        : BLANK.days,
              gallery:     found.gallery?.length    ? found.gallery     : BLANK.gallery,
              aboutImages: found.aboutImages?.length ? found.aboutImages : BLANK.aboutImages,
              bucketImages:found.bucketImages?.length ? found.bucketImages : BLANK.bucketImages,
            });
          }
        });
    } else {
      const updates = {};
      if (preDestination) updates.destination   = preDestination;
      if (preType)        updates.packageType    = preType;
      if (preSub)         updates.packageSubtype = preSub;
      if (Object.keys(updates).length) setForm(p => ({ ...p, ...updates }));
    }
    setReady(true);
  }, [id, preDestination, preType, preSub]);

  // Normalise amenities once allAmenities is loaded
  useEffect(() => {
    if (allAmenities.length > 0 && form.amenities.length > 0) {
      const normalised = normaliseAmenities(form.amenities, allAmenities);
      if (normalised.some((a, i) => typeof form.amenities[i] === "string")) {
        setForm(p => ({ ...p, amenities: normalised }));
      }
    }
  }, [allAmenities.length]);

  // Fetch siblings
  const fetchSiblings = useCallback(() => {
    if (!form.destination || !form.packageType) { setSiblings([]); return; }
    fetch("/api/dashboard/packages")
      .then(r => r.json())
      .then(all => setSiblings(all.filter(p => p.destination === form.destination && p.packageType === form.packageType && p.id !== id)))
      .catch(() => {});
  }, [form.destination, form.packageType, id]);

  useEffect(() => { fetchSiblings(); }, [fetchSiblings]);

  /* ── Field helpers ── */
  function f(key, val) { setForm(p => ({ ...p, [key]: val })); }
  function setNested(parent, key, val) { setForm(p => ({ ...p, [parent]: { ...p[parent], [key]: val } })); }
  function setGalleryImg(i, v) { setForm(p => { const g=[...p.gallery]; g[i]={...g[i],src:v}; return {...p,gallery:g}; }); }
  function setGalleryAlt(i, v) { setForm(p => { const g=[...p.gallery]; g[i]={...g[i],alt:v}; return {...p,gallery:g}; }); }
  function setAboutImg(i, v)   { setForm(p => { const a=[...p.aboutImages];  a[i]={...a[i],src:v}; return {...p,aboutImages:a}; }); }
  function setBucketImg(i, v)  { setForm(p => { const b=[...p.bucketImages]; b[i]={...b[i],src:v}; return {...p,bucketImages:b}; }); }
  function setDay(i, key, val) { setForm(p => { const d=[...p.days]; d[i]={...d[i],[key]:val}; return {...p,days:d}; }); }
  function addDay() { setForm(p => ({ ...p, days: [...p.days, { day: p.days.length+1, title:"", icon:"", description:"" }] })); }
  function removeDay(i) { setForm(p => { const d=p.days.filter((_,idx)=>idx!==i).map((d,idx)=>({...d,day:idx+1})); return {...p,days:d}; }); }

  async function saveCustomAmenity(name, iconBase64) {
    try {
      const r = await fetch("/api/dashboard/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, iconBase64 }),
      });
      if (!r.ok) return null;
      const saved = await r.json();
      setCustomAmenities(prev => {
        const next = [...prev];
        const idx  = next.findIndex(a => a.name === saved.name);
        if (idx >= 0) next[idx] = saved; else next.push(saved);
        return next;
      });
      return saved;
    } catch { return null; }
  }

  /* ── Publish check ── */
  const siblingSubs = siblings.map(p => p.packageSubtype);
  const allDone     = PKG_SUBTYPES.every(s => s === form.packageSubtype || siblingSubs.includes(s));
  const nextMissing = PKG_SUBTYPES.find(s => s !== form.packageSubtype && !siblingSubs.includes(s));

  async function handleSave(publishStatus) {
    if (!form.packageName.trim()) { alert("Please enter a package name."); return; }
    const status = publishStatus === "Active" && !allDone ? "Inactive" : (publishStatus || form.status);
    setSaving(true);
    const payload = { ...form, status };
    try {
      const url    = isEdit ? `/api/dashboard/packages/${id}` : "/api/dashboard/packages";
      const method = isEdit ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error("Save failed");

      if (publishStatus === "Active" && allDone) {
        await Promise.all(siblings.map(s =>
          fetch(`/api/dashboard/packages/${s.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Active" }),
          })
        ));
        setToast({ msg: "All packages published!", next: null });
        setTimeout(() => router.push("/dashboard/packages"), 1200);
      } else if (nextMissing) {
        setToast({
          msg: `${form.packageSubtype} saved as draft!`,
          next: { label: `Create ${nextMissing} →`, href: `/dashboard/packages/create?destination=${encodeURIComponent(form.destination)}&packageType=${encodeURIComponent(form.packageType)}&subtype=${nextMissing}` }
        });
      } else {
        setToast({ msg: isEdit ? "Package updated!" : "Package saved!", next: null });
        setTimeout(() => router.push("/dashboard/packages"), 1200);
      }
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  }

  if (!ready) return null;

  const destNames = [...new Set(destinations.map(d => d.name || d.title).filter(Boolean))];

  return (
    <>
      <Head>
        <title>{isEdit ? "Edit" : "Add"} Package — TourWatchOut</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>

      <div className="bk-page">
        <Sidebar active="All Packages" isOpen={sidebar} onClose={() => setSidebar(false)} />

        <main className="bk-main">
          <header className="bk-header">
            <div className="bk-header-left">
              <button className="bk-hamburger" onClick={() => setSidebar(true)}><MdMenu size={22} /></button>
              <button className="bk-back-btn" onClick={() => router.push("/dashboard/packages")}>
                <MdChevronLeft size={20} />
              </button>
              <h1 className="bk-page-title">{isEdit ? "Edit Package" : "Add New Package"}</h1>
            </div>
            <div className="bk-header-right">
              <div className="bk-team-pill"><span>Sales Team</span><MdKeyboardArrowDown size={16} /></div>
              <button className="bk-avatar-btn">
                <MdPeople size={18} color="#2563eb" />
                <span className="bk-avatar-badge">4</span>
              </button>
            </div>
          </header>

          <div className="bk-content">

            {/* ── Section 1: Category ── */}
            <div className="bk-form-section">
              <div className="bk-form-row bk-form-row-3">
                <div className="bk-form-group">
                  <label className="bk-form-label">Select Destination</label>
                  <select className="bk-form-select" value={form.destination} onChange={e => f("destination", e.target.value)}>
                    <option value="">— Select —</option>
                    {destNames.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">Package Type</label>
                  <select className="bk-form-select" value={form.packageType} onChange={e => f("packageType", e.target.value)}>
                    {PKG_TYPES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">Package Subtype</label>
                  <select className="bk-form-select" value={form.packageSubtype} onChange={e => f("packageSubtype", e.target.value)}>
                    {PKG_SUBTYPES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <SubtypeProgress destination={form.destination} packageType={form.packageType} currentSubtype={form.packageSubtype} siblings={siblings} />

              <div className="bk-form-group">
                <label className="bk-form-label">Package Name *</label>
                <input className="bk-form-input" placeholder="e.g. Dubai Family Adventure"
                  value={form.packageName} onChange={e => f("packageName", e.target.value)} />
              </div>
            </div>

            {/* ── Section 2: Banners ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Main Banner Images</h2>
              <div className="bk-banner-grid">
                <div>
                  <ImageUploader label="Web Banner" value={form.webBanner.src} onChange={v => setNested("webBanner","src",v)} hint="Recommended: 1920×600px" />
                  <input className="bk-form-input" style={{marginTop:8}} placeholder="Alt text" value={form.webBanner.alt} onChange={e => setNested("webBanner","alt",e.target.value)} />
                </div>
                <div>
                  <ImageUploader label="Mobile Banner" value={form.mobileBanner.src} onChange={v => setNested("mobileBanner","src",v)} hint="Recommended: 600×800px" />
                  <input className="bk-form-input" style={{marginTop:8}} placeholder="Alt text" value={form.mobileBanner.alt} onChange={e => setNested("mobileBanner","alt",e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── Section 3: Gallery ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Gallery Images</h2>
              <div className="bk-gallery-grid">
                {form.gallery.map((g, i) => (
                  <div key={i}>
                    <ImageUploader label={`Gallery ${i+1}`} value={g.src} onChange={v => setGalleryImg(i,v)} />
                    <input className="bk-form-input" style={{marginTop:6}} placeholder="Alt text" value={g.alt} onChange={e => setGalleryAlt(i,e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 4: Itinerary Header ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Itinerary Details</h2>
              <div className="bk-form-row bk-form-row-2">
                <div className="bk-form-group">
                  <label className="bk-form-label">Itinerary Title</label>
                  <input className="bk-form-input" placeholder="e.g. Dubai Family Adventure" value={form.itineraryTitle} onChange={e => f("itineraryTitle",e.target.value)} />
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">Duration</label>
                  <select className="bk-form-select" value={form.duration} onChange={e => f("duration",e.target.value)}>
                    {DURATION_OPTS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="bk-form-group">
                <label className="bk-form-label">Destination Highlights</label>
                <textarea className="bk-textarea" rows={3} placeholder="Brief description…" value={form.destinationHighlights} onChange={e => f("destinationHighlights",e.target.value)} />
              </div>
            </div>

            {/* ── Section 5: Amenities ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Amenities</h2>
              <AmenityPicker
                selected={normaliseAmenities(form.amenities, allAmenities)}
                onChange={chosen => f("amenities", chosen)}
                allAmenities={allAmenities}
                onSaveCustom={saveCustomAmenity}
              />
            </div>

            {/* ── Section 6: Price ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Price Details</h2>
              <div className="bk-form-row bk-form-row-3">
                <div className="bk-form-group">
                  <label className="bk-form-label">Base Price (₹)</label>
                  <input className="bk-form-input" type="number" placeholder="e.g. 150000" value={form.basePrice} onChange={e => f("basePrice",e.target.value)} />
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">Final Price (₹)</label>
                  <input className="bk-form-input" type="number" placeholder="e.g. 140000" value={form.finalPrice} onChange={e => f("finalPrice",e.target.value)} />
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">Price Type</label>
                  <select className="bk-form-select" value={form.priceType} onChange={e => f("priceType",e.target.value)}>
                    {PRICE_TYPES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="bk-form-row bk-form-row-2" style={{marginTop:16}}>
                <div>
                  <ImageUploader label="Price Section Image" value={form.priceImage.src} onChange={v => setNested("priceImage","src",v)} />
                  <input className="bk-form-input" style={{marginTop:6}} placeholder="Alt text" value={form.priceImage.alt} onChange={e => setNested("priceImage","alt",e.target.value)} />
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">Request a Callback</label>
                  <select className="bk-form-select" value={form.advertisement?.callbackType||"Call"}
                    onChange={e => setForm(p => ({...p,advertisement:{...p.advertisement,callbackType:e.target.value}}))}>
                    {CALLBACK_TYPES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Section 7: Day-by-Day Itinerary ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Day-by-Day Itinerary</h2>
              {form.days.map((day, i) => (
                <div key={i} className="bk-day-block">
                  <div className="bk-day-header">
                    <span className="bk-day-badge">Day {day.day}</span>
                    {form.days.length > 1 && (
                      <button className="bk-del-btn" onClick={() => removeDay(i)}><MdDelete size={15} /></button>
                    )}
                  </div>
                  <div className="bk-day-row-with-icon">
                    <DayIconUploader value={day.icon} onChange={v => setDay(i, "icon", v)} />
                    <div className="bk-form-group" style={{flex:1}}>
                      <label className="bk-form-label">Day Title</label>
                      <input className="bk-form-input" placeholder="e.g. Arrival & Check-in"
                        value={day.title} onChange={e => setDay(i,"title",e.target.value)} />
                    </div>
                  </div>
                  <div className="bk-form-group">
                    <label className="bk-form-label">Description</label>
                    <textarea className="bk-textarea" rows={3} placeholder="What happens this day…"
                      value={day.description} onChange={e => setDay(i,"description",e.target.value)} />
                  </div>
                </div>
              ))}
              <button className="bk-add-day-btn" onClick={addDay}>
                <MdAdd size={18} /> Add Another Day
              </button>
            </div>

            {/* ── Section 8: Advertisement ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Advertisement Banner</h2>
              <div className="bk-form-row bk-form-row-2">
                <div className="bk-form-group">
                  <label className="bk-form-label">Headline</label>
                  <input className="bk-form-input" placeholder="e.g. Best deal of the year!"
                    value={form.advertisement.headline}
                    onChange={e => setForm(p=>({...p,advertisement:{...p.advertisement,headline:e.target.value}}))} />
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">Subtext</label>
                  <input className="bk-form-input" placeholder="e.g. Limited seats available"
                    value={form.advertisement.subtext}
                    onChange={e => setForm(p=>({...p,advertisement:{...p.advertisement,subtext:e.target.value}}))} />
                </div>
              </div>
              <div style={{maxWidth:280}}>
                <ImageUploader label="Ad Image" value={form.advertisement.image?.src}
                  onChange={v => setForm(p=>({...p,advertisement:{...p.advertisement,image:{...p.advertisement.image,src:v}}}))} />
                <input className="bk-form-input" style={{marginTop:6}} placeholder="Alt text"
                  value={form.advertisement.image?.alt||""}
                  onChange={e => setForm(p=>({...p,advertisement:{...p.advertisement,image:{...p.advertisement.image,alt:e.target.value}}}))} />
              </div>
            </div>

            {/* ── Section 9: Inclusions / Exclusions ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Inclusions &amp; Exclusions</h2>
              <div className="bk-form-row bk-form-row-2">
                <div className="bk-form-group">
                  <label className="bk-form-label">Inclusions</label>
                  <textarea className="bk-textarea" rows={6} placeholder="• Accommodation&#10;• Daily breakfast"
                    value={form.inclusions} onChange={e => f("inclusions",e.target.value)} />
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">Exclusions</label>
                  <textarea className="bk-textarea" rows={6} placeholder="• International flights&#10;• Visa charges"
                    value={form.exclusions} onChange={e => f("exclusions",e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── Section 10: About ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">About {form.destination||"Destination"}</h2>
              <textarea className="bk-textarea" rows={4} placeholder="Write about the destination…"
                value={form.aboutText} onChange={e => f("aboutText",e.target.value)} />
              <div className="bk-two-img-grid" style={{marginTop:14}}>
                {form.aboutImages.map((img,i)=>(
                  <ImageUploader key={i} label={`About Image ${i+1}`} value={img.src} onChange={v => setAboutImg(i,v)} />
                ))}
              </div>
            </div>

            {/* ── Section 11: Bucket List ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">{form.destination||"Destination"} Bucket List</h2>
              <textarea className="bk-textarea" rows={4} placeholder="• Visit Burj Khalifa&#10;• Desert Safari"
                value={form.bucketListText} onChange={e => f("bucketListText",e.target.value)} />
              <div className="bk-two-img-grid" style={{marginTop:14}}>
                {form.bucketImages.map((img,i)=>(
                  <ImageUploader key={i} label={`Bucket Image ${i+1}`} value={img.src} onChange={v => setBucketImg(i,v)} />
                ))}
              </div>
            </div>

            {/* ── Section 12: Policies ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Policies</h2>
              <div className="bk-form-group">
                <label className="bk-form-label">Booking Policy</label>
                <textarea className="bk-textarea" rows={3} value={form.bookingPolicy} onChange={e => f("bookingPolicy",e.target.value)} />
              </div>
              <div className="bk-form-group">
                <label className="bk-form-label">Cancellation Policy</label>
                <textarea className="bk-textarea" rows={4} value={form.cancellationPolicy} onChange={e => f("cancellationPolicy",e.target.value)} />
              </div>
              <div className="bk-form-group">
                <label className="bk-form-label">Terms &amp; Conditions</label>
                <textarea className="bk-textarea" rows={4} value={form.termsConditions} onChange={e => f("termsConditions",e.target.value)} />
              </div>
            </div>

            {/* ── Section 13: SEO ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">SEO Settings</h2>
              <div className="bk-form-group">
                <label className="bk-form-label">Meta Title</label>
                <input className="bk-form-input" placeholder="e.g. Dubai Family Package | TourWatchOut"
                  value={form.metaTitle} onChange={e => f("metaTitle",e.target.value)} />
              </div>
              <div className="bk-form-group">
                <label className="bk-form-label">Meta Description</label>
                <textarea className="bk-textarea" rows={3} placeholder="SEO description (under 160 chars)…"
                  value={form.metaDescription} onChange={e => f("metaDescription",e.target.value)} />
              </div>
              <div className="bk-form-group">
                <label className="bk-form-label">Meta Keywords</label>
                <input className="bk-form-input" placeholder="keyword1, keyword2, keyword3"
                  value={form.metaKeywords} onChange={e => f("metaKeywords",e.target.value)} />
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="bk-form-actions">
              <button className="bk-cancel-btn" onClick={() => router.push("/dashboard/packages")}>Cancel</button>
              <button className="bk-draft-btn" onClick={() => handleSave("Inactive")} disabled={saving}>
                {saving ? "Saving…" : "Save Draft"}
              </button>
              <button className="bk-publish-btn" onClick={() => handleSave("Active")}
                disabled={saving || !allDone}
                title={!allDone ? `Create all 3 subtypes first. Missing: ${PKG_SUBTYPES.filter(s=>s!==form.packageSubtype&&!siblingSubs.includes(s)).join(", ")}` : ""}>
                {saving ? "Publishing…" : isEdit ? "Update & Publish" : allDone ? "Publish All Packages" : "Publish (create all 3 first)"}
              </button>
            </div>

          </div>
        </main>
      </div>

      {toast && (
        <div style={{position:"fixed",bottom:28,right:28,background:"#1f2937",color:"#fff",borderRadius:10,padding:"14px 22px",fontSize:14,fontWeight:500,fontFamily:"Inter,sans-serif",boxShadow:"0 4px 16px rgba(0,0,0,0.18)",zIndex:9999,display:"flex",alignItems:"center",gap:14,maxWidth:420}}>
          <span>✓ {toast.msg}</span>
          {toast.next && (
            <a href={toast.next.href} style={{color:"#60a5fa",fontWeight:700,textDecoration:"none",whiteSpace:"nowrap"}}>{toast.next.label}</a>
          )}
          <button onClick={() => setToast(null)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:16,padding:0,marginLeft:"auto"}}>✕</button>
        </div>
      )}
    </>
  );
}
