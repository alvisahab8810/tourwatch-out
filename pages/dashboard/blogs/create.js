import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdSave, MdVisibility, MdArrowBack, MdImage, MdClose, MdAdd,
  MdFormatBold, MdFormatItalic, MdFormatListBulleted, MdFormatListNumbered,
  MdLink, MdCode, MdCopyAll, MdFormatQuote, MdFormatColorText,
  MdAddPhotoAlternate, MdEdit, MdDeleteOutline,
  MdCheckCircle, MdError, MdWarning, MdInfoOutline,
} from "react-icons/md";
import { isAuthenticated } from "../../../utils/voucherAuth";
import Sidebar from "../../../components/backend/Sidebar";

const SCHEMA_TYPES = [
  "BlogPosting", "Article", "NewsArticle", "BreadcrumbList", "FAQPage",
  "TouristAttraction", "Hotel", "Restaurant", "Event", "Product",
  "Organization", "LocalBusiness", "HowTo", "Recipe", "WebPage", "Person",
];

const PRESET_COLORS = [
  "#000000", "#374151", "#EE4C49", "#2563eb", "#16a34a",
  "#d97706", "#7c3aed", "#db2777", "#0891b2", "#ea580c",
  "#ffffff", "#9ca3af",
];

const FONT_SIZES = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 54, 60, 72, 80, 96,
];

const DEFAULT_ROBOTS  = "index, follow, max-image-preview:large, max-snippet:-1";
const TOAST_DURATION  = 4500; // ms before auto-dismiss
const BLANK_SCHEMA   = { type: "BlogPosting", content: "" };
const BASE_URL       = "https://tourwatchout.com";

const BLANK = {
  title: "", slug: "", coverImage: { src: null, alt: "" }, cardImage: { src: null, alt: "" },
  content: "", summary: "",
  schemas: [{ ...BLANK_SCHEMA }],
  faqs:    [],
  status: "draft", publishDate: "", allowComments: true,
  categories: "", tags: "", metaTitle: "", metaKeywords: "", metaDescription: "",
  authorName: "", metaRobots: DEFAULT_ROBOTS, xRobotsTag: DEFAULT_ROBOTS,
};

/* ── Markdown → HTML (stash-protect images/HTML so underscores in URLs stay safe) ── */
function mdToHtml(md) {
  if (!md) return "";
  const stash = [];
  const save  = html => { const k = `\x02${stash.length}\x03`; stash.push(html); return k; };

  let s = md;
  s = s.replace(/<[a-zA-Z][^>]*>[\s\S]*?<\/[a-zA-Z]+>|<[a-zA-Z][^>]*\/>/g, save);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => save(`<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;display:block;" />`));

  s = s
    .replace(/^###### (.+)$/gm, "<h6>$1</h6>")
    .replace(/^##### (.+)$/gm,  "<h5>$1</h5>")
    .replace(/^#### (.+)$/gm,   "<h4>$1</h4>")
    .replace(/^### (.+)$/gm,    "<h3>$1</h3>")
    .replace(/^## (.+)$/gm,     "<h2>$1</h2>")
    .replace(/^# (.+)$/gm,      "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,     "<em>$1</em>")
    .replace(/_(.+?)_/g,       "<em>$1</em>")
    .replace(/`(.+?)`/g,       "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^> (.+)$/gm,     "<blockquote>$1</blockquote>")
    .replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>")
    .replace(/^- (.+)$/gm,     "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .split(/\n{2,}/)
    .map(para => {
      const t = para.trim();
      if (!t) return "";
      if (/^<(h[1-6]|ul|ol|li|blockquote|img|div|figure|span|p)/.test(t) || t.startsWith("\x02")) return para;
      return `<p>${para.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");

  return s.replace(/\x02(\d+)\x03/g, (_, i) => stash[+i]);
}

function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

/* ── Image upload widget ── */
function ImgUpload({ label, value, onChange, hint, onError }) {
  const ref = useRef(null);
  const [broken, setBroken] = useState(false);
  useEffect(() => { setBroken(false); }, [value]);
  function handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 6 * 1024 * 1024) { onError?.("Image too large — max 6 MB allowed."); return; }
    const r = new FileReader();
    r.onload = ev => onChange(ev.target.result);
    r.readAsDataURL(f);
  }
  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      {hint  && <p style={s.hint}>{hint}</p>}
      <div style={{ ...s.uploadArea, ...(value && !broken ? s.uploadHas : {}) }} onClick={() => ref.current?.click()}>
        {value && !broken ? (
          <>
            <img src={value} alt="preview" style={s.uploadPreview} onError={() => setBroken(true)} />
            <button style={s.uploadRemove} onClick={e => { e.stopPropagation(); onChange(null); }}><MdClose size={13} /></button>
          </>
        ) : value && broken ? (
          <div style={s.uploadPlaceholder}><MdImage size={28} style={{ color: "#e84949" }} /><span style={{ color: "#e84949", fontSize: 12 }}>Missing — click to re-upload</span></div>
        ) : (
          <div style={s.uploadPlaceholder}><MdImage size={28} style={{ color: "#9ca3af" }} /><span style={{ color: "#9ca3af", fontSize: 12 }}>Click to upload or drag & drop</span></div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} onClick={e => { e.target.value = ""; }} />
    </div>
  );
}

/* ── Toolbar helpers ── */
function insertAtCursor(el, set, prefix, suffix = "") {
  if (!el) return;
  const a = el.selectionStart, b = el.selectionEnd;
  const sel = el.value.slice(a, b);
  set(el.value.slice(0, a) + prefix + sel + suffix + el.value.slice(b));
  setTimeout(() => { el.focus(); el.setSelectionRange(a + prefix.length, b + prefix.length); }, 0);
}
function insertHeading(el, set, level) {
  if (!el) return;
  const v = el.value, p = el.selectionStart;
  const ls = v.lastIndexOf("\n", p - 1) + 1;
  const le = v.indexOf("\n", p); const end = le === -1 ? v.length : le;
  const clean = v.slice(ls, end).replace(/^#{1,6}\s*/, "");
  const pre = level === 0 ? "" : "#".repeat(level) + " ";
  const nl = pre + clean;
  set(v.slice(0, ls) + nl + v.slice(end));
  setTimeout(() => { el.focus(); el.setSelectionRange(ls + nl.length, ls + nl.length); }, 0);
}
function insertSpan(el, set, style) {
  if (!el) return;
  const a = el.selectionStart, b = el.selectionEnd;
  const sel = el.value.slice(a, b) || "text";
  const tag = `<span style="${style}">${sel}</span>`;
  set(el.value.slice(0, a) + tag + el.value.slice(b));
  setTimeout(() => { el.focus(); el.setSelectionRange(a + tag.length, a + tag.length); }, 0);
}

/* ── Schema builder ── */
function buildSchemaJson(type, form) {
  const postUrl  = `${BASE_URL}/blogs/${form.slug || "post"}`;
  const coverSrc = form.coverImage?.src;
  const imageUrl = coverSrc && !coverSrc.startsWith("data:")
    ? (coverSrc.startsWith("http") ? coverSrc : `${BASE_URL}${coverSrc}`) : null;

  if (type === "BreadcrumbList") {
    return {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",  "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blogs", "item": `${BASE_URL}/blogs` },
        { "@type": "ListItem", "position": 3, "name": form.title || "Post", "item": postUrl },
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
    "headline": form.title || "",
    "description": form.metaDescription || form.summary || "",
    "url": postUrl,
    "mainEntityOfPage": { "@type": "WebPage", "@id": postUrl },
    "author": { "@type": "Person", "name": form.authorName || "TourWatchOut" },
    "publisher": {
      "@type": "Organization", "name": "TourWatchOut", "url": BASE_URL,
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/assets/images/logo.png` },
    },
    "datePublished": form.publishDate || new Date().toISOString().slice(0, 10),
    "dateModified":  new Date().toISOString().slice(0, 10),
  };

  if (imageUrl) {
    schema.image = {
      "@type": "ImageObject",
      "url": imageUrl,
      "description": form.coverImage?.alt || form.title || "",
    };
  }

  if (form.faqs?.filter(f => f.question).length > 0) {
    schema.mainEntity = form.faqs.filter(f => f.question).map(f => ({
      "@type": "Question", "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer || "" },
    }));
  }

  return schema;
}

/* ── Premium Toast ── */
const TOAST_CFG = {
  success: { icon: MdCheckCircle,  bg: "#f0fdf4", accent: "#22c55e", text: "#15803d", label: "Success" },
  error:   { icon: MdError,        bg: "#fff1f2", accent: "#ef4444", text: "#dc2626", label: "Error"   },
  warning: { icon: MdWarning,      bg: "#fffbeb", accent: "#f59e0b", text: "#92400e", label: "Warning" },
  info:    { icon: MdInfoOutline,  bg: "#eff6ff", accent: "#3b82f6", text: "#1d4ed8", label: "Info"    },
};

function ToastItem({ toast, onClose }) {
  const [bar, setBar] = useState(100);
  useEffect(() => {
    const t = setTimeout(() => setBar(0), 60);
    return () => clearTimeout(t);
  }, []);

  const cfg = TOAST_CFG[toast.type] || TOAST_CFG.info;
  const Icon = cfg.icon;

  return (
    <div style={{
      background: cfg.bg, borderRadius: 14, width: 360, maxWidth: "calc(100vw - 32px)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
      borderLeft: `4px solid ${cfg.accent}`, overflow: "hidden",
      animation: "twSlideIn .3s cubic-bezier(.34,1.3,.64,1)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 14px 10px 16px" }}>
        <span style={{ color: cfg.accent, flexShrink: 0, marginTop: 1 }}><Icon size={20} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 3px", fontSize: 10.5, fontWeight: 800, color: cfg.accent, textTransform: "uppercase", letterSpacing: 0.8 }}>{cfg.label}</p>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, color: "#111827", lineHeight: 1.5, wordBreak: "break-word" }}>{toast.message}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#9ca3af", display: "flex", alignItems: "center", flexShrink: 0, marginTop: 1 }}>
          <MdClose size={16} />
        </button>
      </div>
      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(0,0,0,0.06)" }}>
        <div style={{ height: "100%", background: cfg.accent, width: `${bar}%`, transition: `width ${TOAST_DURATION}ms linear`, opacity: 0.6 }} />
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onClose }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", flexDirection: "column-reverse", gap: 10, alignItems: "flex-end", pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <ToastItem toast={t} onClose={() => onClose(t.id)} />
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function CreateBlog() {
  const router = useRouter();
  const { id: editId } = router.query;

  const [ready,        setReady]        = useState(false);
  const [sidebar,      setSidebar]      = useState(false);
  const [form,         setForm]         = useState(BLANK);
  const [saving,       setSaving]       = useState(false);
  const [toasts,       setToasts]       = useState([]);
  const [slugManual,   setSlugManual]   = useState(false);
  const [showColors,   setShowColors]   = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [contentMode,  setContentMode]  = useState("write"); // "write" | "split" | "preview"

  const contentRef   = useRef(null);
  const imgInsertRef = useRef(null);
  const headingRef   = useRef(null);
  const fontSizeRef  = useRef(null);
  const customSzRef  = useRef(null);

  /* ── Load existing blog ── */
  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/dashboard/login"); return; }
    if (editId) {
      fetch(`/api/dashboard/blogs/${editId}`)
        .then(r => r.json())
        .then(data => {
          if (data && !data.error) {
            const schemas = data.schemas?.length
              ? data.schemas
              : data.schema ? [{ type: data.schemaType || "BlogPosting", content: data.schema }]
              : [{ ...BLANK_SCHEMA }];
            setForm({
              ...BLANK, ...data, schemas,
              faqs:       Array.isArray(data.faqs) ? data.faqs : [],
              categories: Array.isArray(data.categories) ? data.categories.join(", ") : data.categories || "",
              tags:       Array.isArray(data.tags)       ? data.tags.join(", ")       : data.tags       || "",
              metaRobots: data.metaRobots || DEFAULT_ROBOTS,
              xRobotsTag: data.xRobotsTag || DEFAULT_ROBOTS,
            });
            setSlugManual(true);
          }
          setReady(true);
        })
        .catch(() => setReady(true));
    } else { setReady(true); }
  }, [editId]);

  useEffect(() => {
    if (!showColors) return;
    const hide = () => setShowColors(false);
    document.addEventListener("click", hide);
    return () => document.removeEventListener("click", hide);
  }, [showColors]);

  /* ── Form helpers ── */
  const f    = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setImg = (field, k, v) => setForm(p => ({ ...p, [field]: { ...p[field], [k]: v } }));
  const setContent = v => f("content", v);
  const showToast    = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), TOAST_DURATION + 400);
  };
  const dismissToast = id => setToasts(p => p.filter(t => t.id !== id));
  const handleTitleChange = v => { f("title", v); if (!slugManual) f("slug", slugify(v)); };

  /* ── Toolbar ── */
  const tb = (pre, suf = "") => insertAtCursor(contentRef.current, setContent, pre, suf);

  function applyHeading(e) {
    const lv = parseInt(e.target.value);
    if (!isNaN(lv)) insertHeading(contentRef.current, setContent, lv);
    headingRef.current.value = "";
  }
  function applyFontSize(e) {
    const sz = e.target.value;
    if (sz) insertSpan(contentRef.current, setContent, `font-size:${sz}px`);
    fontSizeRef.current.value = "";
  }
  function applyCustomSize(e) {
    if (e.key !== "Enter") return;
    const sz = e.target.value.trim();
    if (!sz || isNaN(sz)) return;
    insertSpan(contentRef.current, setContent, `font-size:${sz}px`);
    e.target.value = "";
  }
  function applyColor(color) { insertSpan(contentRef.current, setContent, `color:${color}`); setShowColors(false); }

  async function handleInsertImage(e) {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 6 * 1024 * 1024) { showToast("warning", "Image too large — max 6 MB allowed."); return; }
    setUploadingImg(true);
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const r = await fetch("/api/dashboard/blogs/upload-image", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: ev.target.result, name: file.name }),
        });
        if (!r.ok) throw new Error(`Upload failed (${r.status})`);
        const { url } = await r.json();
        tb(`\n![${file.name}](${url})\n`);
        showToast("success", "Image uploaded and inserted!");
      } catch (err) {
        showToast("error", err.message || "Image upload failed. Please try again.");
        tb(`\n![${file.name}](${ev.target.result})\n`);
      }
      setUploadingImg(false);
      setContentMode("split"); // auto-switch so user sees the image
    };
    reader.readAsDataURL(file);
  }

  /* ── Schema helpers ── */
  const addSchema    = ()        => setForm(p => ({ ...p, schemas: [...p.schemas, { ...BLANK_SCHEMA }] }));
  const removeSchema = i        => setForm(p => ({ ...p, schemas: p.schemas.filter((_, idx) => idx !== i) }));
  const updateSchema = (i, k, v) => setForm(p => ({ ...p, schemas: p.schemas.map((sc, idx) => idx === i ? { ...sc, [k]: v } : sc) }));
  const generateSchemaAt = i   => updateSchema(i, "content", JSON.stringify(buildSchemaJson(form.schemas[i].type, form), null, 2));
  const copySchemaAt = i       => { navigator.clipboard?.writeText(form.schemas[i]?.content || ""); showToast("success", "Schema copied to clipboard!"); };

  /* ── FAQ helpers ── */
  const addFaq    = ()         => setForm(p => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));
  const removeFaq = i          => setForm(p => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }));
  const updateFaq = (i, k, v)  => setForm(p => ({ ...p, faqs: p.faqs.map((q, idx) => idx === i ? { ...q, [k]: v } : q) }));

  /* ── Save ── */
  async function saveBlog(status) {
    if (!form.title.trim()) { showToast("warning", "Title is required before saving."); return; }
    if (!form.slug.trim())  { showToast("warning", "Slug (URL) is required before saving."); return; }
    setSaving(true);
    const payload = {
      ...form,
      status: status || form.status,
      categories: form.categories ? form.categories.split(",").map(c => c.trim()).filter(Boolean) : [],
      tags:       form.tags       ? form.tags.split(",").map(t => t.trim()).filter(Boolean)       : [],
      schema:     form.schemas[0]?.content || "",
      schemaType: form.schemas[0]?.type    || "BlogPosting",
    };
    try {
      const url    = editId ? `/api/dashboard/blogs/${editId}` : "/api/dashboard/blogs";
      const method = editId ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) {
        let errMsg = `Server error ${r.status}`;
        try { const body = await r.json(); errMsg = body.error || body.message || errMsg; } catch {}
        throw new Error(errMsg);
      }
      const saved = await r.json();
      if (!editId && saved.id) router.replace(`/dashboard/blogs/create?id=${saved.id}`, undefined, { shallow: true });
      setForm(p => ({ ...p, status: payload.status }));
      showToast("success", status === "published" ? "Blog published successfully!" : "Draft saved successfully!");
    } catch (e) {
      showToast("error", e.message || "Something went wrong. Please try again.");
    }
    setSaving(false);
  }

  if (!ready) return null;

  const charTitle    = (form.title    || "").length;
  const charSummary  = (form.summary  || "").length;
  const charMetaDesc = (form.metaDescription || "").length;
  const wordCount    = (form.content  || "").trim().split(/\s+/).filter(Boolean).length;

  const previewHtml  = mdToHtml(form.content);

  /* ═══════════════════════════════════════════════════ JSX ═══ */
  return (
    <>
      <Head>
        <title>{`${editId ? "Edit Blog" : "New Blog"} — TourWatchOut`}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
        <style>{`
          @keyframes twSlideIn {
            from { opacity: 0; transform: translateX(64px) scale(0.95); }
            to   { opacity: 1; transform: translateX(0)   scale(1);    }
          }
        `}</style>
      </Head>

      <div className="bk-page">
        <Sidebar active="Blogs" isOpen={sidebar} onClose={() => setSidebar(false)} />
        <main className="bk-main">

          {/* Header */}
          <header className="bk-header">
            <div className="bk-header-left">
              <button className="bk-hamburger" onClick={() => setSidebar(true)}><MdMenu size={22} /></button>
              <button style={s.backBtn} onClick={() => router.push("/dashboard/blogs")}><MdArrowBack size={16} /></button>
              <h1 className="bk-page-title">{editId ? "Edit Blog" : "New Blog Post"}</h1>
            </div>
            <div className="bk-header-right">
              <button onClick={() => saveBlog("draft")} disabled={saving} style={s.draftBtn}><MdSave size={14} /> {saving ? "Saving…" : "Save Draft"}</button>
              <button onClick={() => saveBlog("published")} disabled={saving} style={s.publishBtn}>{saving ? "Publishing…" : "Publish"}</button>
            </div>
          </header>

          <div style={s.layout}>
            {/* ══ LEFT ══ */}
            <div style={s.leftCol}>

              {/* Article Details */}
              <div style={s.card}>
                <h2 style={s.cardTitle}>Article Details</h2>
                <label style={s.label}>Title <span style={s.req}>*</span></label>
                <input style={s.input} placeholder="Enter article title…" value={form.title} maxLength={100} onChange={e => handleTitleChange(e.target.value)} />
                <p style={s.charCount}>{charTitle}/100</p>
                <label style={s.label}>Slug (URL) <span style={s.req}>*</span></label>
                <input style={s.input} placeholder="my-article-slug" value={form.slug} onChange={e => { setSlugManual(true); f("slug", slugify(e.target.value)); }} />
                <p style={s.hint}>Lowercase, numbers, hyphens only</p>
                <label style={{ ...s.label, marginTop: 14 }}>Cover Image</label>
                <ImgUpload value={form.coverImage?.src} onChange={v => setImg("coverImage", "src", v)} onError={msg => showToast("warning", msg)} />
                <input style={{ ...s.input, marginTop: 8 }} placeholder="Alt text for cover image (SEO)" value={form.coverImage?.alt || ""} onChange={e => setImg("coverImage", "alt", e.target.value)} />
              </div>

              {/* ── Content Editor ── */}
              <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h2 style={{ ...s.cardTitle, margin: 0 }}>Content</h2>
                  {/* Mode tabs */}
                  <div style={s.modeTabs}>
                    {[["write", <MdEdit key="e" size={13} />, "Write"], ["split", null, "Split"], ["preview", <MdVisibility key="v" size={13} />, "Preview"]].map(([m, icon, label]) => (
                      <button key={m} style={{ ...s.modeTab, ...(contentMode === m ? s.modeTabActive : {}) }} onClick={() => setContentMode(m)}>
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toolbar — hidden in preview-only mode */}
                {contentMode !== "preview" && (
                  <div style={s.toolbar}>
                    {/* Group: Heading */}
                    <span style={s.tbGroup}>
                      <select ref={headingRef} style={{ ...s.tbSelect, width: 88 }} defaultValue="" onChange={applyHeading} title="Heading">
                        <option value="" disabled>Heading</option>
                        <option value="0">¶ Para</option>
                        <option value="1">H1</option><option value="2">H2</option>
                        <option value="3">H3</option><option value="4">H4</option>
                        <option value="5">H5</option><option value="6">H6</option>
                      </select>
                    </span>
                    <span style={s.tbDiv} />

                    {/* Group: Format */}
                    <span style={s.tbGroup}>
                      <button style={s.toolBtn} title="Bold **text**"  onClick={() => tb("**", "**")}><MdFormatBold     size={17} /></button>
                      <button style={s.toolBtn} title="Italic _text_"  onClick={() => tb("_",  "_")} ><MdFormatItalic   size={17} /></button>
                      <button style={s.toolBtn} title="Inline code"    onClick={() => tb("`",  "`")} ><MdCode           size={17} /></button>
                    </span>
                    <span style={s.tbDiv} />

                    {/* Group: Size + custom */}
                    <span style={s.tbGroup}>
                      <select ref={fontSizeRef} style={{ ...s.tbSelect, width: 65 }} defaultValue="" onChange={applyFontSize} title="Font size">
                        <option value="" disabled>Size</option>
                        {FONT_SIZES.map(sz => <option key={sz} value={sz}>{sz}px</option>)}
                      </select>
                      <input ref={customSzRef} type="number" min={6} max={300} placeholder="px" title="Custom size — press Enter" style={s.customSzInput} onKeyDown={applyCustomSize} />
                    </span>

                    {/* Group: Color */}
                    <span style={{ ...s.tbGroup, position: "relative" }}>
                      <button style={s.toolBtn} title="Text colour" onClick={e => { e.stopPropagation(); setShowColors(p => !p); }}>
                        <MdFormatColorText size={17} />
                      </button>
                      {showColors && (
                        <div style={s.colorPalette} onClick={e => e.stopPropagation()}>
                          {PRESET_COLORS.map(c => (
                            <button key={c} title={c} style={{ ...s.colorSwatch, background: c, border: c === "#ffffff" ? "1.5px solid #d1d5db" : "1.5px solid transparent" }} onClick={() => applyColor(c)} />
                          ))}
                        </div>
                      )}
                    </span>
                    <span style={s.tbDiv} />

                    {/* Group: Structure */}
                    <span style={s.tbGroup}>
                      <button style={s.toolBtn} title="Bullet list"   onClick={() => tb("\n- ")}       ><MdFormatListBulleted  size={17} /></button>
                      <button style={s.toolBtn} title="Numbered list" onClick={() => tb("\n1. ")}      ><MdFormatListNumbered  size={17} /></button>
                      <button style={s.toolBtn} title="Link"          onClick={() => tb("[", "](url)")}><MdLink                size={17} /></button>
                      <button style={s.toolBtn} title="Blockquote"    onClick={() => tb("\n> ")}       ><MdFormatQuote         size={17} /></button>
                    </span>
                    <span style={s.tbDiv} />

                    {/* Group: Insert Image */}
                    <span style={s.tbGroup}>
                      <button style={{ ...s.toolBtn, opacity: uploadingImg ? 0.5 : 1, gap: 4 }} title="Insert image into content" disabled={uploadingImg} onClick={() => imgInsertRef.current?.click()}>
                        <MdAddPhotoAlternate size={17} />
                        {uploadingImg ? <span style={{ fontSize: 10 }}>uploading…</span> : <span style={{ fontSize: 11, fontWeight: 600 }}>Image</span>}
                      </button>
                      <input ref={imgInsertRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleInsertImage} onClick={e => { e.target.value = ""; }} />
                    </span>
                  </div>
                )}

                {/* Editor / Preview area */}
                {contentMode === "preview" ? (
                  <div style={s.previewPane} dangerouslySetInnerHTML={{ __html: previewHtml || "<p style='color:#9ca3af;font-style:italic'>Nothing to preview yet…</p>" }} />
                ) : contentMode === "split" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <textarea ref={contentRef} style={{ ...s.editor, minHeight: 340 }}
                      placeholder={"Write in Markdown…\n**bold**  _italic_  # H1  ## H2  - list  [link](url)\nInline HTML supported for colour/size/images."}
                      value={form.content} onChange={e => f("content", e.target.value)} />
                    <div style={{ ...s.previewPane, minHeight: 340, overflow: "auto" }}
                      dangerouslySetInnerHTML={{ __html: previewHtml || "<p style='color:#9ca3af;font-style:italic'>Preview appears here as you type…</p>" }} />
                  </div>
                ) : (
                  <textarea ref={contentRef} style={s.editor}
                    placeholder={"Write in Markdown…\n**bold**  _italic_  # H1  ## H2  - list  [link](url)\nUse toolbar to insert images — they'll appear in the Split preview."}
                    value={form.content} onChange={e => f("content", e.target.value)} />
                )}

                <p style={{ ...s.hint, textAlign: "right", marginTop: 6 }}>{wordCount} words</p>
              </div>

              {/* Summary */}
              <div style={s.card}>
                <h2 style={s.cardTitle}>Summary</h2>
                <textarea style={{ ...s.editor, minHeight: 90 }} placeholder="Brief summary…" value={form.summary} maxLength={200} onChange={e => f("summary", e.target.value)} />
                <p style={s.charCount}>{charSummary}/200</p>
              </div>

              {/* ── FAQs ── */}
              <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h2 style={{ ...s.cardTitle, margin: 0 }}>FAQs</h2>
                  <button style={s.addSchemaBtn} onClick={addFaq}><MdAdd size={15} /> Add FAQ</button>
                </div>
                <p style={{ ...s.hint, marginBottom: 16 }}>Shown at the end of the post. Auto-included in FAQPage & BlogPosting schema generation.</p>

                {form.faqs.length === 0 ? (
                  <div style={{ background: "#f9fafb", borderRadius: 8, padding: "22px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                    No FAQs yet — click <strong>"Add FAQ"</strong> to add your first question
                  </div>
                ) : form.faqs.map((faq, i) => (
                  <div key={i} style={{ marginTop: i === 0 ? 0 : 16, paddingTop: i === 0 ? 0 : 16, borderTop: i === 0 ? "none" : "1.5px solid #f3f4f6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Q{i + 1}</span>
                      <button style={s.removeSchemaBtn} onClick={() => removeFaq(i)} title="Remove FAQ"><MdDeleteOutline size={15} /></button>
                    </div>
                    <input style={s.input} placeholder="Question e.g. What is TourWatchOut?" value={faq.question} onChange={e => updateFaq(i, "question", e.target.value)} />
                    <textarea style={{ ...s.editor, minHeight: 80, marginTop: 8 }} placeholder="Answer…" value={faq.answer} onChange={e => updateFaq(i, "answer", e.target.value)} />
                  </div>
                ))}
              </div>

              {/* ── Multiple Schemas ── */}
              <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ ...s.cardTitle, margin: 0 }}>Schema (JSON-LD)</h2>
                  <button style={s.addSchemaBtn} onClick={addSchema}><MdAdd size={15} /> Add Schema</button>
                </div>

                {form.schemas.map((sc, i) => (
                  <div key={i} style={{ ...s.schemaBlock, marginTop: i > 0 ? 16 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, minWidth: 58 }}>
                        Schema {form.schemas.length > 1 ? i + 1 : ""}
                      </span>
                      <select style={{ ...s.tbSelect, fontSize: 13, flex: 1, minWidth: 140 }} value={sc.type} onChange={e => updateSchema(i, "type", e.target.value)}>
                        {SCHEMA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button style={s.iconBtn} onClick={() => generateSchemaAt(i)}><MdCode size={14} /> Generate</button>
                      <button style={s.iconBtn} onClick={() => copySchemaAt(i)}><MdCopyAll size={14} /> Copy</button>
                      {form.schemas.length > 1 && (
                        <button style={s.removeSchemaBtn} onClick={() => removeSchema(i)} title="Remove"><MdDeleteOutline size={16} /></button>
                      )}
                    </div>
                    <textarea
                      style={{ ...s.editor, minHeight: 160, fontFamily: "monospace", fontSize: 12 }}
                      placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "${sc.type}"\n}`}
                      value={sc.content} onChange={e => updateSchema(i, "content", e.target.value)}
                    />
                  </div>
                ))}
              </div>

            </div>

            {/* ══ RIGHT SIDEBAR ══ */}
            <div style={s.rightCol}>

              <div style={s.card}>
                <h2 style={s.cardTitle}>Blog Card Cover Image</h2>
                <ImgUpload value={form.cardImage?.src} onChange={v => setImg("cardImage", "src", v)} hint="Listing cards (600×400px recommended)" onError={msg => showToast("warning", msg)} />
                <input style={{ ...s.input, marginTop: 8 }} placeholder="Image alt text" value={form.cardImage?.alt || ""} onChange={e => setImg("cardImage", "alt", e.target.value)} />
              </div>

              <div style={s.card}>
                <h2 style={s.cardTitle}>Publishing Settings</h2>
                <label style={s.label}>Status</label>
                {[["draft","Save as Draft"],["published","Publish Now"],["scheduled","Scheduled Publish"]].map(([val, lbl]) => (
                  <label key={val} style={s.radioRow}>
                    <input type="radio" name="status" value={val} checked={form.status === val} onChange={() => f("status", val)} style={{ accentColor: "#2563eb" }} />
                    <span style={{ fontSize: 14, color: "#374151" }}>{lbl}</span>
                  </label>
                ))}
                <label style={{ ...s.label, marginTop: 14 }}>Publish Date</label>
                <input type="date" style={{ ...s.input, colorScheme: "light" }} value={form.publishDate} onChange={e => f("publishDate", e.target.value)} />
                <div style={s.toggleRow}>
                  <span style={{ fontSize: 14, color: "#374151" }}>Allow Comments</span>
                  <div style={{ ...s.toggle, background: form.allowComments ? "#2563eb" : "#d1d5db" }} onClick={() => f("allowComments", !form.allowComments)}>
                    <div style={{ ...s.toggleKnob, left: form.allowComments ? 18 : 3 }} />
                  </div>
                </div>
              </div>

              <div style={s.card}>
                <h2 style={s.cardTitle}>Robots Directives</h2>
                <label style={s.label}>Meta Robots Tag</label>
                <p style={s.hint}>Injected as <code style={{ fontSize: 11 }}>{`<meta name="robots">`}</code></p>
                <input style={{ ...s.input, marginTop: 6 }} value={form.metaRobots} onChange={e => f("metaRobots", e.target.value)} />
                <p style={{ ...s.hint, marginTop: 4 }}><code style={{ fontSize: 10 }}>{`<meta name="robots" content="${form.metaRobots}">`}</code></p>
                <label style={{ ...s.label, marginTop: 16 }}>X-Robots-Tag (HTTP Header)</label>
                <p style={s.hint}>Sent as a server response header</p>
                <input style={{ ...s.input, marginTop: 6 }} value={form.xRobotsTag} onChange={e => f("xRobotsTag", e.target.value)} />
                <p style={{ ...s.hint, marginTop: 4 }}><code style={{ fontSize: 10 }}>{`X-Robots-Tag: ${form.xRobotsTag}`}</code></p>
                <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[["index, follow","index, follow, max-image-preview:large, max-snippet:-1"],["noindex","noindex, nofollow"],["noarchive","index, follow, noarchive"]].map(([lbl, val]) => (
                    <button key={lbl} style={s.presetBtn} onClick={() => { f("metaRobots", val); f("xRobotsTag", val); }}>{lbl}</button>
                  ))}
                </div>
              </div>

              <div style={s.card}>
                <h2 style={s.cardTitle}>Categories &amp; Tags</h2>
                <label style={s.label}>Categories</label>
                <input style={s.input} placeholder="Travel, Adventure (comma separated)" value={form.categories} onChange={e => f("categories", e.target.value)} />
                <label style={{ ...s.label, marginTop: 12 }}>Tags</label>
                <input style={s.input} placeholder="SEO, Tips (comma separated)" value={form.tags} onChange={e => f("tags", e.target.value)} />
              </div>

              <div style={s.card}>
                <h2 style={s.cardTitle}>SEO Settings</h2>
                <label style={s.label}>Meta Title</label>
                <input style={s.input} placeholder="SEO optimised title…" value={form.metaTitle} onChange={e => f("metaTitle", e.target.value)} />
                <label style={{ ...s.label, marginTop: 12 }}>Meta Keywords</label>
                <input style={s.input} placeholder="keyword1, keyword2" value={form.metaKeywords} onChange={e => f("metaKeywords", e.target.value)} />
                <label style={{ ...s.label, marginTop: 12 }}>Meta Description</label>
                <textarea style={{ ...s.editor, minHeight: 80 }} placeholder="SEO meta description…" value={form.metaDescription} maxLength={160} onChange={e => f("metaDescription", e.target.value)} />
                <p style={s.charCount}>{charMetaDesc}/160</p>
              </div>

              <div style={s.card}>
                <h2 style={s.cardTitle}>Author</h2>
                <label style={s.label}>Author Name</label>
                <input style={s.input} placeholder="Enter author name" value={form.authorName} onChange={e => f("authorName", e.target.value)} />
              </div>

            </div>
          </div>

          {/* Bottom bar */}
          <div style={s.bottomBar}>
            <button onClick={() => saveBlog("draft")} disabled={saving} style={s.draftBtnLg}><MdSave size={16} /> {saving ? "Saving…" : "Save Draft"}</button>
            <button style={s.previewBtnLg} onClick={() => form.slug && window.open(`/blogs/${form.slug}`, "_blank")}><MdVisibility size={16} /> Live Preview</button>
            <button onClick={() => saveBlog("published")} disabled={saving} style={s.publishBtnLg}>{saving ? "Publishing…" : "Publish"}</button>
          </div>

        </main>
      </div>

      <ToastContainer toasts={toasts} onClose={dismissToast} />
    </>
  );
}

/* ══ Styles ══ */
const s = {
  layout:         { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, padding: "28px 32px 100px", alignItems: "start" },
  leftCol:        { display: "flex", flexDirection: "column", gap: 20 },
  rightCol:       { display: "flex", flexDirection: "column", gap: 20 },
  card:           { background: "#fff", borderRadius: 12, padding: "22px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #e8eaf0" },
  cardTitle:      { fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "0 0 16px" },
  label:          { display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  req:            { color: "#e84949" },
  hint:           { fontSize: 11.5, color: "#9ca3af", margin: "4px 0 0", fontStyle: "italic" },
  charCount:      { fontSize: 11, color: "#9ca3af", margin: "4px 0 0", textAlign: "right" },
  input:          { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb", color: "#111", fontFamily: "inherit" },
  select:         { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb", color: "#111", cursor: "pointer" },
  editor:         { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "12px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb", color: "#111", fontFamily: "inherit", resize: "vertical", minHeight: 300, lineHeight: 1.7 },
  previewPane:    { border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "18px 20px", background: "#fff", lineHeight: 1.8, fontSize: 15, color: "#1a1a2e", overflowX: "auto" },
  modeTabs:       { display: "flex", background: "#f0f2f7", borderRadius: 8, padding: 3, gap: 2 },
  modeTab:        { padding: "5px 13px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: "transparent", color: "#9ca3af", display: "flex", alignItems: "center", gap: 4, transition: "all .15s" },
  modeTabActive:  { background: "#fff", color: "#1a1a2e", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  toolbar:        { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10, padding: "7px 8px", background: "#f0f2f7", borderRadius: 8, alignItems: "center" },
  tbGroup:        { display: "inline-flex", alignItems: "center", gap: 2 },
  tbDiv:          { width: 1, height: 22, background: "#d1d5db", margin: "0 2px", display: "inline-block", flexShrink: 0 },
  toolBtn:        { background: "none", border: "none", cursor: "pointer", padding: "5px 6px", borderRadius: 5, color: "#374151", display: "inline-flex", alignItems: "center", transition: "background .12s" },
  tbSelect:       { border: "1.5px solid #d1d5db", borderRadius: 6, padding: "4px 6px", fontSize: 12, fontWeight: 600, background: "#fff", color: "#374151", cursor: "pointer", outline: "none", flexShrink: 0 },
  customSzInput:  { width: 40, border: "1.5px solid #d1d5db", borderRadius: 6, padding: "4px 4px", fontSize: 12, fontWeight: 600, background: "#fff", color: "#374151", outline: "none", textAlign: "center", flexShrink: 0 },
  colorPalette:   { position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", borderRadius: 8, padding: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 200, display: "grid", gridTemplateColumns: "repeat(6, 20px)", gap: 4, border: "1px solid #e5e7eb" },
  colorSwatch:    { width: 20, height: 20, borderRadius: 4, cursor: "pointer", padding: 0 },
  schemaBlock:    { borderTop: "1.5px solid #f0f2f7", paddingTop: 16 },
  addSchemaBtn:   { display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 },
  removeSchemaBtn:{ display: "inline-flex", alignItems: "center", background: "#fff1f2", color: "#e84949", border: "1px solid #fecdd3", borderRadius: 7, padding: "5px 7px", cursor: "pointer", flexShrink: 0 },
  iconBtn:        { display: "inline-flex", alignItems: "center", gap: 5, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  uploadArea:     { border: "2px dashed #e5e7eb", borderRadius: 10, minHeight: 130, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden", background: "#f9fafb" },
  uploadHas:      { border: "2px solid #e5e7eb" },
  uploadPreview:  { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 },
  uploadRemove:   { position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", zIndex: 2 },
  uploadPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  radioRow:       { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" },
  toggleRow:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  toggle:         { width: 42, height: 24, borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s" },
  toggleKnob:     { position: "absolute", top: 3, width: 18, height: 18, background: "#fff", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" },
  presetBtn:      { fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: "#f3f4f6", color: "#374151", cursor: "pointer", fontWeight: 600 },
  backBtn:        { background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center", padding: "4px 8px" },
  draftBtn:       { background: "#f3f4f6", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  publishBtn:     { background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  bottomBar:      { bottom: 0, left: 230, right: 0, background: "#fff", borderTop: "1px solid #e5e7eb", padding: "14px 32px", display: "flex", gap: 12, alignItems: "center", zIndex: 50 },
  draftBtnLg:     { display: "flex", alignItems: "center", gap: 7, background: "#f3f4f6", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  previewBtnLg:   { display: "flex", alignItems: "center", gap: 7, background: "none", color: "#2563eb", border: "none", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  publishBtnLg:   { marginLeft: "auto", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
};
