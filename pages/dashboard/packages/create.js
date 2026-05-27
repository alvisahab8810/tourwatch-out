import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdChevronLeft,
  MdCheckCircle, MdMoreHoriz, MdImage, MdClose, MdAdd, MdDelete, MdSearch,
  MdCode, MdCopyAll, MdDeleteOutline,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../../components/backend/DashboardLayout";

// Add this line alongside your other component imports
import RichTextEditor from "../../../components/backend/RichTextEditor";

/* ── Constants ── */
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1";
const BLANK_SCHEMA   = { type: "TouristAttraction", content: "" };
const BASE_URL       = "https://tourwatchout.com";

const SCHEMA_TYPES = [
  "TouristAttraction", "TouristTrip", "Product", "Service",
  "BreadcrumbList", "FAQPage", "TravelAction", "LodgingBusiness",
  "Hotel", "Organization", "LocalBusiness", "WebPage",
  "Article", "BlogPosting", "Event",
];

const PKG_TYPES    = ["Family", "Couple", "Corporate", "Honeymoon", "Group"];
const PKG_SUBTYPES = ["Economy", "Deluxe", "Premium"];
const DURATION_OPTS = [
  "1N 2D","2N 3D","3N 4D","4N 5D","5N 6D","6N 7D","7N 8D","8N 9D","9N 10D","10N 11D",
  "11N 12D","12N 13D","13N 14D","14N 15D",
];
const PRICE_TYPES = [
  "Per Person",
  "Per Group",
  "Per Couple",
  "02 Couples",
  "01 Couple + 01 Child (below 5 years)",
  "01 Couple + 01 Child (below 4 years) + 01 Child (below 10 years)",
  "01 Couple + 01 Child (below 5 years) + 01 Child (above 15 years)",
  "01 Couple + 01 Child (above 12 years) + 01 Child (above 15 years)",
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

/* ── Image Uploader — uploads immediately on select, stores URL not base64 ── */
function ImageUploader({ label, value, onChange, hint, accept }) {
  const fileRef  = useRef(null);
  const [localSrc,  setLocalSrc]  = useState(null); // data URL for instant preview
  const [uploading, setUploading] = useState(false);
  const [errMsg,    setErrMsg]    = useState("");
  const [broken,    setBroken]    = useState(false);

  // When value changes from the parent (e.g. loading existing package),
  // clear the local preview so we use the server URL instead.
  const prevValue = useRef(value);
  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      if (!localSrc) setBroken(false); // reset broken only when not mid-upload
      setErrMsg("");
    }
  }, [value, localSrc]);

  // displaySrc: prefer local data URL (always loads) over server URL
  const displaySrc = localSrc || value;
  const hasImage   = Boolean(displaySrc) && (!broken || Boolean(localSrc));

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrMsg("Max file size is 5 MB"); return; }
    setUploading(true);
    setErrMsg("");
    setBroken(false);
    const reader = new FileReader();
    reader.onload = async ev => {
      const dataUrl = ev.target.result;
      setLocalSrc(dataUrl); // show preview immediately — guaranteed to work
      try {
        const r = await fetch("/api/dashboard/packages/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: dataUrl, name: file.name }),
        });
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || `Upload failed (${r.status})`);
        }
        const { url } = await r.json();
        onChange(url); // store server URL in form (for save)
        // keep localSrc so preview stays visible without flickering
      } catch (err) {
        setErrMsg(err.message || "Upload failed — try again");
        setLocalSrc(null);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleRemove(e) {
    e.stopPropagation();
    setLocalSrc(null);
    setBroken(false);
    setErrMsg("");
    onChange(null);
  }

  return (
    <div className="bk-img-col">
      <div className="bk-img-col-header">
        <span className="bk-img-col-title">{label}</span>
        <span className={`bk-img-status-icon ${hasImage ? "uploaded" : ""}`}>
          {uploading
            ? <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 700 }}>Uploading…</span>
            : hasImage
              ? <MdCheckCircle size={22} />
              : <MdMoreHoriz size={22} />}
        </span>
      </div>
      {hint && <p className="bk-img-note"><strong>Note:</strong> {hint}</p>}
      <div
        className={`bk-upload-area ${hasImage ? "has-image" : ""}`}
        onClick={() => !uploading && fileRef.current?.click()}
        style={{ cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.7 : 1 }}
      >
        {uploading ? (
          <div className="bk-upload-placeholder">
            <span style={{ fontSize: 13, color: "#6366f1", fontWeight: 600 }}>Uploading image…</span>
          </div>
        ) : hasImage ? (
          <>
            <img
              src={displaySrc}
              alt={label}
              className="bk-upload-preview"
              onError={() => { if (!localSrc) setBroken(true); }}
            />
            <button className="bk-upload-remove" onClick={handleRemove}>
              <MdClose size={14} />
            </button>
          </>
        ) : value && broken ? (
          <div className="bk-upload-placeholder">
            <MdImage size={32} style={{ color: "#e84949" }} />
            <span style={{ color: "#e84949", fontSize: 12 }}>Image missing — click to re-upload</span>
          </div>
        ) : (
          <div className="bk-upload-placeholder"><MdImage size={32} /><span>Click to upload</span></div>
        )}
      </div>
      {errMsg && <p style={{ fontSize: 11, color: "#e84949", margin: "4px 0 0", fontWeight: 600 }}>{errMsg}</p>}
      <input ref={fileRef} type="file"
        accept={accept || "image/svg+xml,image/png,image/jpeg,image/webp"}
        style={{ display: "none" }} onChange={handleFile} onClick={e => { e.target.value = ""; }} />
    </div>
  );
}

/* ── Day Icon Uploader ── */
function DayIconUploader({ value, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localSrc,  setLocalSrc]  = useState(null);

  const displaySrc = localSrc || value;
  const hasIcon    = Boolean(displaySrc);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async ev => {
      const dataUrl = ev.target.result;
      setLocalSrc(dataUrl); // instant preview
      try {
        const r = await fetch("/api/dashboard/packages/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: dataUrl, name: file.name }),
        });
        if (!r.ok) throw new Error("Upload failed");
        const { url } = await r.json();
        onChange(url);
      } catch {
        alert("Icon upload failed — try again");
        setLocalSrc(null);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="bk-day-icon-uploader" onClick={() => !uploading && fileRef.current?.click()} title="Click to upload icon"
      style={{ cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}>
      {uploading ? (
        <div className="bk-day-icon-placeholder"><span style={{ fontSize: 10, color: "#6366f1" }}>…</span></div>
      ) : hasIcon ? (
        <>
          <img src={displaySrc} alt="icon" className="bk-day-icon-img" />
          <button className="bk-day-icon-remove" onClick={e => { e.stopPropagation(); setLocalSrc(null); onChange(""); }}>
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
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setOpen(false);
    document.body.style.overflow = "";
  }

  function toggleDraft(name) {
    setDraft(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  }

  function handleSelect() {
    const chosen = allAmenities.filter(a => draft.includes(a.name));
    onChange(chosen);
    closeModal();
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

      {/* Modal — rendered via portal at body level so position:fixed always works */}
      {open && typeof document !== "undefined" && createPortal(
        <div className="bk-modal-overlay" onClick={closeModal}>
          <div className="bk-modal" onClick={e => e.stopPropagation()}>
            <div className="bk-modal-header">
              <span className="bk-modal-title">icon set</span>
              <button className="bk-modal-close" onClick={closeModal}><MdClose size={18} /></button>
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
              <button className="bk-modal-cancel" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body
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

/* ── Schema generator (adapted for packages) ── */
function buildSchemaJson(type, form) {
  const destSlug = (form.destination || "destination").toLowerCase().replace(/\s+/g, "-");
  const pkgUrl   = `${BASE_URL}/destination/${destSlug}`;

  if (type === "BreadcrumbList") {
    return {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": form.destination || "Destination", "item": `${BASE_URL}/destination/${destSlug}` },
        { "@type": "ListItem", "position": 3, "name": form.packageName || "Package", "item": pkgUrl },
      ],
    };
  }

  if (type === "FAQPage") {
    return {
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": (form.faqs || []).filter(f => f.question).map(f => ({
        "@type": "Question", "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer || "" },
      })),
    };
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    "name": form.packageName || "",
    "description": form.metaDescription || form.destinationHighlights || "",
    "url": pkgUrl,
    "provider": { "@type": "Organization", "name": "TourWatchOut", "url": BASE_URL },
  };

  if (form.faqs?.filter(f => f.question).length > 0) {
    schema.mainEntity = form.faqs.filter(f => f.question).map(f => ({
      "@type": "Question", "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer || "" },
    }));
  }

  return schema;
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
  metaRobots: DEFAULT_ROBOTS, xRobotsTag: DEFAULT_ROBOTS,
  schemas: [{ ...BLANK_SCHEMA }], faqs: [],
  status: "Inactive",
  featureImage: { src: null, alt: "" },
  webBanner:    { src: null, alt: "" },
  mobileBanner: { src: null, alt: "" },
  gallery:      [{ src: null, alt: "" }, { src: null, alt: "" }, { src: null, alt: "" }, { src: null, alt: "" }],
  priceImage:   { src: null, alt: "" },
  advertisement: { headline: "", subtext: "", callbackType: "Call", image: { src: null, alt: "" } },
  aboutImages:   [{ src: null, alt: "" }, { src: null, alt: "" }],
  bucketImages:  [{ src: null, alt: "" }, { src: null, alt: "" }],
  days: [{ day: 1, title: "", icon: "", description: "" }],
  stays: [],
  transfers: [],
  activityBookings: [],
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

  const openSidebar = useOpenSidebar();
  const [form, setForm]           = useState(BLANK);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [destinations, setDests]  = useState([]);
  const [siblings, setSiblings]   = useState([]);
  const [customAmenities, setCustomAmenities] = useState([]);
  const [vendors, setVendors]               = useState([]);

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

  // Load vendors for Hotel/Transfer selectors
  useEffect(() => {
    fetch("/api/dashboard/vendors")
      .then(r => r.json())
      .then(data => setVendors(Array.isArray(data) ? data : []))
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
    if (id) {
      fetch(`/api/dashboard/packages/${id}`)
        .then(r => r.json())
        .then(found => {
          if (found && !found.error) {
            setForm({
              ...BLANK, ...found,
              amenities:   found.amenities   || [],
              days:        found.days?.length        ? found.days        : BLANK.days,
              gallery:     found.gallery?.length     ? found.gallery     : BLANK.gallery,
              aboutImages: found.aboutImages?.length ? found.aboutImages : BLANK.aboutImages,
              bucketImages:found.bucketImages?.length? found.bucketImages: BLANK.bucketImages,
              stays:            found.stays            || [],
              transfers:        found.transfers        || [],
              activityBookings: found.activityBookings || [],
              schemas:    found.schemas?.length ? found.schemas : [{ ...BLANK_SCHEMA }],
              faqs:       Array.isArray(found.faqs) ? found.faqs : [],
              metaRobots: found.metaRobots || DEFAULT_ROBOTS,
              xRobotsTag: found.xRobotsTag || DEFAULT_ROBOTS,
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

  /* ── Stays helpers ── */
  const stayVendors      = vendors.filter(v => v.vendorTab === "Stay");
  const transferVendors  = vendors.filter(v => v.vendorTab === "Transfers");
  const activityVendors  = vendors.filter(v => v.vendorTab === "Activities");

  function calcStay(s) {
    const sub = (s.price||0) * (s.nights||1) * (s.rooms||1);
    const gst = Math.round(sub * (s.gstPct||0) / 100);
    return { ...s, subTotal: sub, gstAmt: gst, total: sub + gst };
  }
  function calcTransfer(t) {
    const sub = (t.pricePerDay||0) * (t.days||1);
    const gst = Math.round(sub * (t.gstPct||0) / 100);
    return { ...t, subTotal: sub, gstAmt: gst, total: sub + gst };
  }
  function calcActivity(a) {
    const sub = (a.pricePerPerson||0) * (a.persons||1);
    const gst = Math.round(sub * (a.gstPct||0) / 100);
    return { ...a, subTotal: sub, gstAmt: gst, total: sub + gst };
  }
  function addStay() {
    setForm(p => ({ ...p, stays: [...(p.stays||[]), calcStay({ vendorId:"", vendorName:"", roomCategory:"", roomName:"", bedType:"", roomSize:"", amenities:[], starRating:null, address:"", phone:"", vendorImg:"", price:0, nights:1, rooms:1, gstPct:0 })] }));
  }
  function removeStay(i) {
    setForm(p => ({ ...p, stays: (p.stays||[]).filter((_,idx)=>idx!==i) }));
  }
  function updateStay(i, updates) {
    setForm(p => {
      const stays = [...(p.stays||[])];
      stays[i] = calcStay({ ...stays[i], ...updates });
      return { ...p, stays };
    });
  }
  function addTransfer() {
    setForm(p => ({ ...p, transfers: [...(p.transfers||[]), calcTransfer({ vendorId:"", vendorName:"", vehicleType:"", vehicleImg:"", pricePerDay:0, days:1, gstPct:0, inclusions:[] })] }));
  }
  function removeTransfer(i) {
    setForm(p => ({ ...p, transfers: (p.transfers||[]).filter((_,idx)=>idx!==i) }));
  }
  function updateTransfer(i, updates) {
    setForm(p => {
      const transfers = [...(p.transfers||[])];
      transfers[i] = calcTransfer({ ...transfers[i], ...updates });
      return { ...p, transfers };
    });
  }
  function addActivity() {
    setForm(p => ({ ...p, activityBookings: [...(p.activityBookings||[]), calcActivity({ vendorId:"", vendorName:"", activityName:"", activityImg:"", pricePerPerson:0, persons:1, gstPct:0 })] }));
  }
  function removeActivity(i) {
    setForm(p => ({ ...p, activityBookings: (p.activityBookings||[]).filter((_,idx)=>idx!==i) }));
  }
  function updateActivity(i, updates) {
    setForm(p => {
      const activityBookings = [...(p.activityBookings||[])];
      activityBookings[i] = calcActivity({ ...activityBookings[i], ...updates });
      return { ...p, activityBookings };
    });
  }

  /* ── Schema helpers ── */
  const addSchema      = ()        => setForm(p => ({ ...p, schemas: [...p.schemas, { ...BLANK_SCHEMA }] }));
  const removeSchema   = i        => setForm(p => ({ ...p, schemas: p.schemas.filter((_, idx) => idx !== i) }));
  const updateSchema   = (i, k, v) => setForm(p => ({ ...p, schemas: p.schemas.map((sc, idx) => idx === i ? { ...sc, [k]: v } : sc) }));
  const generateSchemaAt = i      => updateSchema(i, "content", JSON.stringify(buildSchemaJson(form.schemas[i].type, form), null, 2));
  const copySchemaAt   = i        => { navigator.clipboard?.writeText(form.schemas[i]?.content || ""); setToast({ msg: "Schema copied to clipboard!", next: null }); };

  /* ── FAQ helpers ── */
  const addFaq    = ()        => setForm(p => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));
  const removeFaq = i         => setForm(p => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }));
  const updateFaq = (i, k, v) => setForm(p => ({ ...p, faqs: p.faqs.map((q, idx) => idx === i ? { ...q, [k]: v } : q) }));

  const [faqGenerating, setFaqGenerating] = useState(false);
  async function generateFaqsWithAI() {
    setFaqGenerating(true);
    try {
      const r = await fetch("/api/dashboard/generate-faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination:  form.destination,
          packageName:  form.packageName,
          packageType:  form.packageType,
          duration:     form.duration,
          highlights:   form.destinationHighlights,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      setForm(p => ({ ...p, faqs: data }));
      setToast({ msg: `${data.length} FAQs generated!`, next: null });
    } catch (e) {
      alert("AI generation failed: " + e.message);
    } finally {
      setFaqGenerating(false);
    }
  }

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
        setTimeout(() => router.back(), 1200);
      } else if (nextMissing) {
        setToast({
          msg: `${form.packageSubtype} saved as draft!`,
          next: { label: `Create ${nextMissing} →`, href: `/dashboard/packages/create?destination=${encodeURIComponent(form.destination)}&packageType=${encodeURIComponent(form.packageType)}&subtype=${nextMissing}` }
        });
      } else {
        setToast({ msg: isEdit ? "Package updated!" : "Package saved!", next: null });
        setTimeout(() => router.back(), 1200);
      }
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  }

  const destNames = [...new Set(destinations.map(d => d.name || d.title).filter(Boolean))];

  return (
    <>
      <Head>
        <title>{`${isEdit ? "Edit" : "Add"} Package — TourWatchOut`}</title>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </Head>

          <header className="bk-header">
            <div className="bk-header-left">
              <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
              <button className="bk-back-btn" onClick={() => router.back()}>
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

            {/* ── Section 2: Feature Image (Package Card) ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Package Card Image</h2>
              <p style={{color:"#6b7280",fontSize:13,marginBottom:12}}>This image appears on the package listing cards (e.g. /family, /couple pages). Recommended: 400×300px.</p>
              <div style={{maxWidth:320}}>
                <ImageUploader label="Card / Feature Image" value={form.featureImage?.src} onChange={v => setNested("featureImage","src",v)} hint="Recommended: 400×300px" />
                <input className="bk-form-input" style={{marginTop:8}} placeholder="Alt text" value={form.featureImage?.alt || ""} onChange={e => setNested("featureImage","alt",e.target.value)} />
              </div>
            </div>

            {/* ── Section 3: Banners ── */}
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
              <div style={{ display:"none" }}>
                <input className="bk-form-input" value={form.itineraryTitle} onChange={e => f("itineraryTitle",e.target.value)} />
              </div>
              <div className="bk-form-group" style={{ maxWidth: 320 }}>
                <label className="bk-form-label">Duration</label>
                <select className="bk-form-select" value={form.duration} onChange={e => f("duration",e.target.value)}>
                  {DURATION_OPTS.map(o => <option key={o}>{o}</option>)}
                </select>
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
            {/* <div className="bk-form-section">
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
            </div> */}

            {/* ── Section 7b: Hotel Details ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Hotel Details</h2>
              {(form.stays||[]).map((stay, i) => {
                const vendor = stayVendors.find(v => (v.id||v._id) === stay.vendorId);
                const vendorImg = vendor?.image?.src || stay.vendorImg || "";
                return (
                  <div key={i} className="bk-vendor-row-card">
                    <div className="bk-vendor-row-header">
                      <span className="bk-day-badge">Hotel {i+1}</span>
                      <button className="bk-del-btn" onClick={() => removeStay(i)}><MdDelete size={15} /></button>
                    </div>
                    {/* Image preview + selectors row */}
                    <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:14}}>
                      {vendorImg && (
                        <div style={{flexShrink:0,width:90,height:70,borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
                          <img src={vendorImg} alt="hotel" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                        </div>
                      )}
                      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                        <div className="bk-form-group">
                          <label className="bk-form-label">Select Hotel</label>
                          <select className="bk-form-select" value={stay.vendorId} onChange={e => {
                            const v = stayVendors.find(v => (v.id||v._id) === e.target.value);
                            updateStay(i, { vendorId: e.target.value, vendorName: v?.businessName||"", vendorImg: v?.image?.src||"", address: v?.place||"", phone: v?.contactPerson?.contactNumber||"", roomCategory:"", roomName:"", bedType:"", roomSize:"", amenities:[], starRating: v?.starRating||null, price:0 });
                          }}>
                            <option value="">— Select Hotel —</option>
                            {stayVendors.map(v => <option key={v.id||v._id} value={v.id||v._id}>{v.businessName}</option>)}
                          </select>
                        </div>
                        <div className="bk-form-group">
                          <label className="bk-form-label">Select Room Category</label>
                          <select className="bk-form-select" value={stay.roomCategory} onChange={e => {
                            const room = vendor?.hotelRooms?.find(r => r.roomType === e.target.value);
                            updateStay(i, {
                              roomCategory: e.target.value,
                              price:        +(room?.pricePerNight || 0),
                              roomName:     room?.roomName     || "",
                              bedType:      room?.bedType      || "",
                              roomSize:     room?.roomSize     || "",
                              amenities:    room?.amenities    || [],
                              starRating:   vendor?.starRating || null,
                            });
                          }} disabled={!vendor}>
                            <option value="">— Select Room —</option>
                            {(vendor?.hotelRooms||[]).map(r => (
                              <option key={r.roomType} value={r.roomType}>{r.roomType}{r.pricePerNight ? ` — ₹${r.pricePerNight}` : ""}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="bk-form-row bk-form-row-2">
                      <div className="bk-form-group">
                        <label className="bk-form-label">Address</label>
                        <input className="bk-form-input" value={stay.address||""} onChange={e => updateStay(i, {address: e.target.value})} placeholder="Auto-filled from vendor" />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Phone</label>
                        <input className="bk-form-input" value={stay.phone||""} onChange={e => updateStay(i, {phone: e.target.value})} placeholder="Auto-filled from vendor" />
                      </div>
                    </div>
                    <div className="bk-form-row bk-form-row-4">
                      <div className="bk-form-group">
                        <label className="bk-form-label">Price / Night (₹)</label>
                        <input className="bk-form-input" type="number" min="0" value={stay.price||""} onChange={e => updateStay(i, {price: +e.target.value})} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Nights</label>
                        <input className="bk-form-input" type="number" min="1" value={stay.nights||1} onChange={e => updateStay(i, {nights: +e.target.value})} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Rooms</label>
                        <input className="bk-form-input" type="number" min="1" value={stay.rooms||1} onChange={e => updateStay(i, {rooms: +e.target.value})} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Sub Total (₹)</label>
                        <input className="bk-form-input bk-calc-field" readOnly value={stay.subTotal||0} />
                      </div>
                    </div>
                    <div className="bk-form-row bk-form-row-3">
                      <div className="bk-form-group">
                        <label className="bk-form-label">GST %</label>
                        <select className="bk-form-select" value={stay.gstPct??0} onChange={e => updateStay(i, {gstPct: +e.target.value})}>
                          {[0,5,12,18,28].map(p => <option key={p} value={p}>{p}%</option>)}
                        </select>
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">GST Amount (₹)</label>
                        <input className="bk-form-input bk-calc-field" readOnly value={stay.gstAmt||0} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Total (₹)</label>
                        <input className="bk-form-input bk-calc-total" readOnly value={stay.total||0} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <button className="bk-add-day-btn" onClick={addStay}><MdAdd size={18} /> Add Hotel</button>
            </div>

            {/* ── Section 7c: Transfer Details ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Transfer Details</h2>
              {(form.transfers||[]).map((tr, i) => {
                const vendor = transferVendors.find(v => (v.id||v._id) === tr.vendorId);
                const selVehicle = vendor?.vehicles?.find(v => v.vehicleType === tr.vehicleType);
                const vehicleImg = selVehicle?.vehicleImage?.src || tr.vehicleImg || "";
                return (
                  <div key={i} className="bk-vendor-row-card">
                    <div className="bk-vendor-row-header">
                      <span className="bk-day-badge">Transfer {i+1}</span>
                      <button className="bk-del-btn" onClick={() => removeTransfer(i)}><MdDelete size={15} /></button>
                    </div>
                    {/* Image preview + selectors */}
                    <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:14}}>
                      {vehicleImg && (
                        <div style={{flexShrink:0,width:90,height:70,borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
                          <img src={vehicleImg} alt="vehicle" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                        </div>
                      )}
                      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                        <div className="bk-form-group">
                          <label className="bk-form-label">Select Vendor</label>
                          <select className="bk-form-select" value={tr.vendorId} onChange={e => {
                            const v = transferVendors.find(v => (v.id||v._id) === e.target.value);
                            updateTransfer(i, { vendorId: e.target.value, vendorName: v?.businessName||"", vehicleType:"", vehicleImg:"", pricePerDay:0 });
                          }}>
                            <option value="">— Select Vendor —</option>
                            {transferVendors.map(v => <option key={v.id||v._id} value={v.id||v._id}>{v.businessName}</option>)}
                          </select>
                        </div>
                        <div className="bk-form-group">
                          <label className="bk-form-label">Vehicle Type</label>
                          <select className="bk-form-select" value={tr.vehicleType} onChange={e => {
                            const vh = vendor?.vehicles?.find(v => v.vehicleType === e.target.value);
                            updateTransfer(i, { vehicleType: e.target.value, vehicleImg: vh?.vehicleImage?.src||"", pricePerDay: +(vh?.pricePerDay||0) });
                          }} disabled={!vendor}>
                            <option value="">— Select Vehicle —</option>
                            {(vendor?.vehicles||[]).map(v => (
                              <option key={v.vehicleType} value={v.vehicleType}>{v.vehicleType}{v.pricePerDay ? ` — ₹${v.pricePerDay}/day` : ""}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="bk-form-row bk-form-row-4">
                      <div className="bk-form-group">
                        <label className="bk-form-label">Price / Day (₹)</label>
                        <input className="bk-form-input" type="number" min="0" value={tr.pricePerDay||""} onChange={e => updateTransfer(i, {pricePerDay: +e.target.value})} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Days</label>
                        <input className="bk-form-input" type="number" min="1" value={tr.days||1} onChange={e => updateTransfer(i, {days: +e.target.value})} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Sub Total (₹)</label>
                        <input className="bk-form-input bk-calc-field" readOnly value={tr.subTotal||0} />
                      </div>
                    </div>
                    <div className="bk-form-row bk-form-row-3">
                      <div className="bk-form-group">
                        <label className="bk-form-label">GST %</label>
                        <select className="bk-form-select" value={tr.gstPct??0} onChange={e => updateTransfer(i, {gstPct: +e.target.value})}>
                          {[0,5,12,18,28].map(p => <option key={p} value={p}>{p}%</option>)}
                        </select>
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">GST Amount (₹)</label>
                        <input className="bk-form-input bk-calc-field" readOnly value={tr.gstAmt||0} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Total (₹)</label>
                        <input className="bk-form-input bk-calc-total" readOnly value={tr.total||0} />
                      </div>
                    </div>
                    <div className="bk-form-group">
                      <label className="bk-form-label">Inclusions</label>
                      <div className="bk-checkbox-row">
                        {["Toll & Parking","Driver Allowance","Fuel","Night Charges"].map(inc => (
                          <label key={inc} className="bk-checkbox-label">
                            <input type="checkbox" checked={(tr.inclusions||[]).includes(inc)}
                              onChange={e => {
                                const list = tr.inclusions||[];
                                updateTransfer(i, { inclusions: e.target.checked ? [...list, inc] : list.filter(x=>x!==inc) });
                              }} />
                            {inc}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button className="bk-add-day-btn" onClick={addTransfer}><MdAdd size={18} /> Add Transfer</button>
            </div>

            {/* ── Section 7d: Activity Details ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Activity Details</h2>
              {(form.activityBookings||[]).map((ab, i) => {
                const vendor = activityVendors.find(v => (v.id||v._id) === ab.vendorId);
                const selActivity = vendor?.activities?.find(a => a.activityName === ab.activityName);
                const actImg = selActivity?.activityImage?.src || ab.activityImg || "";
                return (
                  <div key={i} className="bk-vendor-row-card">
                    <div className="bk-vendor-row-header">
                      <span className="bk-day-badge">Activity {i+1}</span>
                      <button className="bk-del-btn" onClick={() => removeActivity(i)}><MdDelete size={15} /></button>
                    </div>
                    <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:14}}>
                      {actImg && (
                        <div style={{flexShrink:0,width:90,height:70,borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
                          <img src={actImg} alt="activity" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                        </div>
                      )}
                      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                        <div className="bk-form-group">
                          <label className="bk-form-label">Select Vendor</label>
                          <select className="bk-form-select" value={ab.vendorId} onChange={e => {
                            const v = activityVendors.find(v => (v.id||v._id) === e.target.value);
                            updateActivity(i, { vendorId: e.target.value, vendorName: v?.businessName||"", activityName:"", activityImg:"", pricePerPerson:0 });
                          }}>
                            <option value="">— Select Vendor —</option>
                            {activityVendors.map(v => <option key={v.id||v._id} value={v.id||v._id}>{v.businessName}</option>)}
                          </select>
                        </div>
                        <div className="bk-form-group">
                          <label className="bk-form-label">Activity</label>
                          <select className="bk-form-select" value={ab.activityName} onChange={e => {
                            const ac = vendor?.activities?.find(a => a.activityName === e.target.value);
                            updateActivity(i, { activityName: e.target.value, activityImg: ac?.activityImage?.src||"", pricePerPerson: +(ac?.pricePerPerson||0) });
                          }} disabled={!vendor}>
                            <option value="">— Select Activity —</option>
                            {(vendor?.activities||[]).map(a => (
                              <option key={a.activityName} value={a.activityName}>{a.activityName}{a.pricePerPerson ? ` — ₹${a.pricePerPerson}/person` : ""}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="bk-form-row bk-form-row-4">
                      <div className="bk-form-group">
                        <label className="bk-form-label">Price / Person (₹)</label>
                        <input className="bk-form-input" type="number" min="0" value={ab.pricePerPerson||""} onChange={e => updateActivity(i, {pricePerPerson: +e.target.value})} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Persons</label>
                        <input className="bk-form-input" type="number" min="1" value={ab.persons||1} onChange={e => updateActivity(i, {persons: +e.target.value})} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Sub Total (₹)</label>
                        <input className="bk-form-input bk-calc-field" readOnly value={ab.subTotal||0} />
                      </div>
                    </div>
                    <div className="bk-form-row bk-form-row-3">
                      <div className="bk-form-group">
                        <label className="bk-form-label">GST %</label>
                        <select className="bk-form-select" value={ab.gstPct??0} onChange={e => updateActivity(i, {gstPct: +e.target.value})}>
                          {[0,5,12,18,28].map(p => <option key={p} value={p}>{p}%</option>)}
                        </select>
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">GST Amount (₹)</label>
                        <input className="bk-form-input bk-calc-field" readOnly value={ab.gstAmt||0} />
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-form-label">Total (₹)</label>
                        <input className="bk-form-input bk-calc-total" readOnly value={ab.total||0} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <button className="bk-add-day-btn" onClick={addActivity}><MdAdd size={18} /> Add Activity</button>
            </div>

            {/* ── Section 9: Inclusions / Exclusions ── */}
            {/* <div className="bk-form-section">
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
            </div> */}



            {/* ── Section 9: Inclusions / Exclusions ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Inclusions &amp; Exclusions</h2>
              <div className="bk-form-row bk-form-row-2">
                <div className="bk-form-group">
                  <RichTextEditor
                    label="Inclusions"
                    value={form.inclusions}
                    onChange={val => f("inclusions", val)}
                    rows={8}
                  />
                </div>
                <div className="bk-form-group">
                  <RichTextEditor
                    label="Exclusions"
                    value={form.exclusions}
                    onChange={val => f("exclusions", val)}
                    rows={8}
                  />
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
                  value={form.metaDescription} maxLength={160} onChange={e => f("metaDescription",e.target.value)} />
                <p style={{fontSize:11,color:"#9ca3af",textAlign:"right",margin:"4px 0 0"}}>{(form.metaDescription||"").length}/160</p>
              </div>
              <div className="bk-form-group">
                <label className="bk-form-label">Meta Keywords</label>
                <input className="bk-form-input" placeholder="keyword1, keyword2, keyword3"
                  value={form.metaKeywords} onChange={e => f("metaKeywords",e.target.value)} />
              </div>
            </div>

            {/* ── Section 14: Robots Directives ── */}
            <div className="bk-form-section">
              <h2 className="bk-section-title">Robots Directives</h2>
              <div className="bk-form-row bk-form-row-2">
                <div className="bk-form-group">
                  <label className="bk-form-label">Meta Robots Tag</label>
                  <p style={{fontSize:11,color:"#9ca3af",margin:"0 0 6px",fontStyle:"italic"}}>Injected as <code style={{fontSize:10}}>{`<meta name="robots">`}</code></p>
                  <input className="bk-form-input" value={form.metaRobots} onChange={e => f("metaRobots",e.target.value)} />
                  <p style={{fontSize:10,color:"#9ca3af",margin:"4px 0 0",fontStyle:"italic"}}><code>{`<meta name="robots" content="${form.metaRobots}">`}</code></p>
                </div>
                <div className="bk-form-group">
                  <label className="bk-form-label">X-Robots-Tag (HTTP Header)</label>
                  <p style={{fontSize:11,color:"#9ca3af",margin:"0 0 6px",fontStyle:"italic"}}>Sent as a server response header</p>
                  <input className="bk-form-input" value={form.xRobotsTag} onChange={e => f("xRobotsTag",e.target.value)} />
                  <p style={{fontSize:10,color:"#9ca3af",margin:"4px 0 0",fontStyle:"italic"}}><code>{`X-Robots-Tag: ${form.xRobotsTag}`}</code></p>
                </div>
              </div>
              <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["index, follow","index, follow, max-image-preview:large, max-snippet:-1"],["noindex","noindex, nofollow"],["noarchive","index, follow, noarchive"]].map(([lbl,val])=>(
                  <button key={lbl} onClick={()=>{f("metaRobots",val);f("xRobotsTag",val);}}
                    style={{fontSize:12,padding:"5px 12px",borderRadius:20,border:"1.5px solid #e5e7eb",background:"#f3f4f6",color:"#374151",cursor:"pointer",fontWeight:600}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Section 15: FAQs ── */}
            <div className="bk-form-section">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
                <h2 className="bk-section-title" style={{margin:0}}>FAQs</h2>
                <div style={{display:"flex",gap:8}}>
                  <button
                    onClick={generateFaqsWithAI}
                    disabled={faqGenerating}
                    style={{display:"inline-flex",alignItems:"center",gap:6,background: faqGenerating ? "#f3f4f6" : "linear-gradient(135deg,#6366f1,#8b5cf6)",color: faqGenerating ? "#9ca3af" : "#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:13,fontWeight:600,cursor: faqGenerating ? "not-allowed" : "pointer",boxShadow: faqGenerating ? "none" : "0 2px 8px rgba(99,102,241,0.3)",transition:"all 0.2s"}}>
                    {faqGenerating ? (
                      <><span style={{display:"inline-block",width:13,height:13,border:"2px solid #9ca3af",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite"}} /> Generating…</>
                    ) : (
                      <><span style={{fontSize:15}}>✦</span> Generate by AI</>
                    )}
                  </button>
                  <button onClick={addFaq} style={{display:"inline-flex",alignItems:"center",gap:5,background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",borderRadius:7,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                    <MdAdd size={15} /> Add FAQ
                  </button>
                </div>
              </div>
              <p style={{fontSize:12,color:"#9ca3af",margin:"0 0 16px",fontStyle:"italic"}}>FAQs are shown on the itinerary page and auto-included in FAQPage schema generation.</p>

              {form.faqs.length === 0 ? (
                <div style={{background:"#f9fafb",borderRadius:8,padding:"22px",textAlign:"center",color:"#9ca3af",fontSize:13}}>
                  No FAQs yet — click <strong>"Add FAQ"</strong> to add your first question
                </div>
              ) : form.faqs.map((faq, i) => (
                <div key={i} style={{marginTop:i===0?0:16,paddingTop:i===0?0:16,borderTop:i===0?"none":"1.5px solid #f3f4f6"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:0.5}}>Q{i+1}</span>
                    <button onClick={()=>removeFaq(i)} style={{display:"inline-flex",alignItems:"center",background:"#fff1f2",color:"#e84949",border:"1px solid #fecdd3",borderRadius:7,padding:"5px 7px",cursor:"pointer"}}>
                      <MdDeleteOutline size={15} />
                    </button>
                  </div>
                  <input className="bk-form-input" placeholder="Question e.g. What is included in the package?" value={faq.question} onChange={e=>updateFaq(i,"question",e.target.value)} />
                  <textarea className="bk-textarea" rows={3} style={{marginTop:8}} placeholder="Answer…" value={faq.answer} onChange={e=>updateFaq(i,"answer",e.target.value)} />
                </div>
              ))}
            </div>

            {/* ── Section 16: Schema (JSON-LD) ── */}
            <div className="bk-form-section">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h2 className="bk-section-title" style={{margin:0}}>Schema (JSON-LD)</h2>
                <button onClick={addSchema} style={{display:"inline-flex",alignItems:"center",gap:5,background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",borderRadius:7,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                  <MdAdd size={15} /> Add Schema
                </button>
              </div>

              {form.schemas.map((sc, i) => (
                <div key={i} style={{borderTop:i>0?"1.5px solid #f0f2f7":"none",paddingTop:i>0?16:0,marginTop:i>0?16:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:0.5,minWidth:60}}>
                      Schema {form.schemas.length>1?i+1:""}
                    </span>
                    <select className="bk-form-select" style={{flex:1,minWidth:150,fontSize:13}} value={sc.type} onChange={e=>updateSchema(i,"type",e.target.value)}>
                      {SCHEMA_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    <button onClick={()=>generateSchemaAt(i)} style={{display:"inline-flex",alignItems:"center",gap:5,background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe",borderRadius:7,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      <MdCode size={14} /> Generate
                    </button>
                    <button onClick={()=>copySchemaAt(i)} style={{display:"inline-flex",alignItems:"center",gap:5,background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe",borderRadius:7,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      <MdCopyAll size={14} /> Copy
                    </button>
                    {form.schemas.length>1 && (
                      <button onClick={()=>removeSchema(i)} style={{display:"inline-flex",alignItems:"center",background:"#fff1f2",color:"#e84949",border:"1px solid #fecdd3",borderRadius:7,padding:"6px 8px",cursor:"pointer"}}>
                        <MdDeleteOutline size={16} />
                      </button>
                    )}
                  </div>
                  <textarea
                    className="bk-textarea"
                    rows={8}
                    style={{fontFamily:"monospace",fontSize:12}}
                    placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "${sc.type}"\n}`}
                    value={sc.content}
                    onChange={e=>updateSchema(i,"content",e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* ── Actions ── */}
            <div className="bk-form-actions">
              <button className="bk-cancel-btn" onClick={() => router.back()}>Cancel</button>
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

CreatePackage.getLayout = (page) => (
  <DashboardLayout active="All Packages">{page}</DashboardLayout>
);
