import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdChevronLeft,
  MdCheckCircle, MdMoreHoriz, MdImage, MdClose,
} from "react-icons/md";
import { isAuthenticated } from "../../../utils/voucherAuth";
import Sidebar from "../../../components/backend/Sidebar";

const COUNTRIES = [
  "India", "UAE", "Indonesia", "Malaysia", "Singapore",
  "Thailand", "Maldives", "Nepal", "Sri Lanka", "Bhutan",
  "Vietnam", "Japan", "Australia", "USA", "UK",
];

const INDIA_STATES = [
  "Andaman & Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const PKG_TYPES    = ["Family", "Couple"];
const PKG_SUBTYPES = ["Economy", "Deluxe", "Premium"];

/* ── Image Uploader ── */
function ImageUploader({ label, value, alt, onImage, onAlt, small }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { alert("Max file size is 4 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => onImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className={`dest-img-col ${small ? "dest-img-col-sm" : ""}`}>
      <div className="dest-img-top">
        <span className="dest-img-label">{label}</span>
        <span className={`bk-img-status-icon ${value ? "uploaded" : ""}`}>
          {value ? <MdCheckCircle size={18} /> : <MdMoreHoriz size={18} />}
        </span>
      </div>
      <div
        className={`bk-upload-area ${value ? "has-image" : ""} ${small ? "bk-upload-sm" : ""}`}
        onClick={() => fileRef.current?.click()}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="bk-upload-preview" />
            <button className="bk-upload-remove" onClick={e => { e.stopPropagation(); onImage(null); }}>
              <MdClose size={14} />
            </button>
          </>
        ) : (
          <div className="bk-upload-placeholder">
            <MdImage size={small ? 22 : 28} />
            <span>{small ? "Upload" : "Click to upload"}</span>
          </div>
        )}
      </div>
      {onAlt && (
        <input
          className="bk-form-input dest-alt-input"
          placeholder="Image alt text"
          value={alt || ""}
          onChange={e => onAlt(e.target.value)}
        />
      )}
      <input
        ref={fileRef} type="file"
        accept="image/svg+xml,image/png,image/jpeg,image/webp"
        style={{ display: "none" }}
        onChange={handleFile}
        onClick={e => { e.target.value = ""; }}
      />
    </div>
  );
}

/* ── Blank form ── */
function blankImages() {
  const obj = {};
  PKG_TYPES.forEach(t => {
    obj[t] = {};
    PKG_SUBTYPES.forEach(s => { obj[t][s] = { src: null, alt: "" }; });
  });
  return obj;
}

const BLANK = {
  type: "national",
  name: "",
  country: "India",
  state: "",
  title: "",
  slug: "",
  status: "Active",
  mainImage: { src: null, alt: "" },
  images: blankImages(),
};

function slugify(s) {
  return s.toLowerCase().replace(/[&]/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CreateDestination() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = Boolean(id);

  const [ready, setReady]     = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [form, setForm]       = useState(BLANK);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState("");

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/dashboard/login"); return; }
    if (id) {
      fetch("/api/dashboard/destinations")
        .then(r => r.json())
        .then(all => {
          const found = all.find(d => d.id === id);
          if (found) {
            // Ensure images have the new nested structure
            const imgs = blankImages();
            if (found.images) {
              PKG_TYPES.forEach(t => {
                PKG_SUBTYPES.forEach(s => {
                  if (found.images[t]?.[s]) imgs[t][s] = found.images[t][s];
                });
              });
            }
            setForm({
              ...BLANK,
              ...found,
              images: imgs,
              mainImage: found.mainImage || { src: null, alt: "" },
            });
          }
        });
    }
    setReady(true);
  }, [id]);

  function f(key, val) {
    setForm(p => {
      const next = { ...p, [key]: val };
      if (key === "name" && !isEdit) next.slug = slugify(val);
      if (key === "type") {
        next.country = val === "national" ? "India" : "";
        next.state   = "";
      }
      return next;
    });
  }

  function setMainImg(key, val) {
    setForm(p => ({ ...p, mainImage: { ...p.mainImage, [key]: val } }));
  }

  function setPkgImg(type, sub, key, val) {
    setForm(p => ({
      ...p,
      images: {
        ...p.images,
        [type]: {
          ...p.images[type],
          [sub]: { ...p.images[type][sub], [key]: val },
        },
      },
    }));
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function handleSave() {
    if (!form.name.trim() && !form.title.trim()) {
      alert("Please enter a destination name."); return;
    }
    setSaving(true);
    const payload = {
      ...form,
      title: form.title || form.name,
      slug: form.slug || slugify(form.title || form.name),
    };
    try {
      const url    = isEdit ? `/api/dashboard/destinations/${id}` : "/api/dashboard/destinations";
      const method = isEdit ? "PUT" : "POST";
      const r = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Save failed");
      showToast(isEdit ? "Destination updated!" : "Destination created!");
      setTimeout(() => router.push("/dashboard/destinations"), 1100);
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return null;

  const isIndia = form.country === "India";

  return (
    <>
      <Head>
        <title>{isEdit ? "Edit" : "Add"} Destination — TourWatchOut</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>

      <div className="bk-page">
        <Sidebar active="Destinations" isOpen={sidebar} onClose={() => setSidebar(false)} />

        <main className="bk-main">
          <header className="bk-header">
            <div className="bk-header-left">
              <button className="bk-hamburger" onClick={() => setSidebar(true)}><MdMenu size={22} /></button>
              <button className="bk-back-btn" onClick={() => router.push("/dashboard/destinations")}>
                <MdChevronLeft size={20} />
              </button>
              <h1 className="bk-page-title">{isEdit ? "Edit Destination" : "Add New Destination"}</h1>
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

            {/* ── Section 1: Core Info ── */}
            <div className="bk-form-section">

              {/* National / International toggle */}
              <div className="dest-type-toggle">
                <button
                  className={`dest-type-btn ${form.type === "national" ? "active" : ""}`}
                  onClick={() => f("type", "national")}
                  type="button"
                >
                  🇮🇳 National
                </button>
                <button
                  className={`dest-type-btn ${form.type === "international" ? "active" : ""}`}
                  onClick={() => f("type", "international")}
                  type="button"
                >
                  🌍 International
                </button>
              </div>

              {/* Main image + core fields row */}
              <div className="dest-core-row">
                <div className="dest-core-img">
                  <ImageUploader
                    label="Destination Photo"
                    value={form.mainImage.src}
                    alt={form.mainImage.alt}
                    onImage={v => setMainImg("src", v)}
                    onAlt={v => setMainImg("alt", v)}
                  />
                </div>

                <div className="dest-core-fields">
                  <div className="bk-form-group">
                    <label className="bk-form-label">Destination Name *</label>
                    <input className="bk-form-input" placeholder="e.g. Kashmir"
                      value={form.name} onChange={e => f("name", e.target.value)} />
                  </div>

                  <div className="bk-form-row bk-form-row-2">
                    {form.type === "international" ? (
                      <div className="bk-form-group">
                        <label className="bk-form-label">Country</label>
                        <select className="bk-form-select" value={form.country}
                          onChange={e => f("country", e.target.value)}>
                          <option value="">— Select Country —</option>
                          {COUNTRIES.filter(c => c !== "India").map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    ) : null}

                    <div className="bk-form-group">
                      <label className="bk-form-label">State / Province</label>
                      {isIndia ? (
                        <select className="bk-form-select" value={form.state}
                          onChange={e => f("state", e.target.value)}>
                          <option value="">— Select State —</option>
                          {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      ) : (
                        <input className="bk-form-input" placeholder="State / Province"
                          value={form.state} onChange={e => f("state", e.target.value)} />
                      )}
                    </div>

                    <div className="bk-form-group">
                      <label className="bk-form-label">Status</label>
                      <select className="bk-form-select" value={form.status}
                        onChange={e => f("status", e.target.value)}>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="bk-form-group" style={{ marginBottom: 0 }}>
                    <label className="bk-form-label">Destination Title (display name)</label>
                    <input className="bk-form-input" placeholder="e.g. Kashmir – Paradise on Earth"
                      value={form.title} onChange={e => f("title", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Package Type Image Sections ── */}
            {PKG_TYPES.map(type => (
              <div key={type} className="bk-form-section">
                <h2 className="bk-img-section-title">{type} Packages Images</h2>
                <div className="dest-subtype-grid">
                  {PKG_SUBTYPES.map(sub => (
                    <ImageUploader
                      key={sub}
                      label={sub}
                      value={form.images[type][sub].src}
                      alt={form.images[type][sub].alt}
                      onImage={v => setPkgImg(type, sub, "src", v)}
                      onAlt={v => setPkgImg(type, sub, "alt", v)}
                      small
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* ── Actions ── */}
            <div className="bk-form-actions">
              <button className="bk-cancel-btn" onClick={() => router.push("/dashboard/destinations")}>
                Cancel
              </button>
              <button className="bk-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : isEdit ? "Update Destination" : "Save Destination"}
              </button>
            </div>

          </div>
        </main>
      </div>

      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, background: "#1f2937",
          color: "#fff", borderRadius: 10, padding: "12px 22px",
          fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)", zIndex: 9999,
        }}>
          ✓ &nbsp;{toast}
        </div>
      )}
    </>
  );
}
