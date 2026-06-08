import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdSearch,
  MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight, MdUpload,
  MdContentCopy, MdTravelExplore, MdCheckCircle, MdWarning, MdStar, MdStarBorder,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

const TABS = ["All", "Family", "Couple"];
const PER_PAGE_OPTS = [20, 50, 100];
const LIST_STATE_KEY = "pkgListState";

const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const dupKey = (p) => `${norm(p.packageName)}|${norm(p.destination)}|${norm(p.packageType)}|${norm(p.packageSubtype)}`;

export default function PackagesList() {
  const router = useRouter();
  const openSidebar = useOpenSidebar();
  const [packages, setPackages] = useState([]);
  const [showDupes,         setShowDupes]         = useState(false);
  const [showSeoIssues,     setShowSeoIssues]     = useState(false);
  const [showSeoDone,       setShowSeoDone]       = useState(false);
  const [showNoReviews,     setShowNoReviews]     = useState(false);
  const [showHasReviews,    setShowHasReviews]    = useState(false);
  const [reviewCounts,      setReviewCounts]      = useState({}); // { packageId: count }
  const [inactivating,      setInactivating]      = useState(false);

  const saved = (() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(sessionStorage.getItem(LIST_STATE_KEY) || "null"); } catch { return null; }
  })();

  const [tab, setTab]               = useState(saved?.tab || "All");
  const [search, setSearch]         = useState("");
  const [destFilter, setDestFilter] = useState(saved?.destFilter || "");
  const [subtypeFilter, setSubtypeFilter] = useState(saved?.subtypeFilter || "");
  const [statusFilter, setStatusFilter]   = useState(saved?.statusFilter || "");
  const [perPage, setPerPage]       = useState(saved?.perPage || 20);
  const [page, setPage]             = useState(saved?.page || 1);

  useEffect(() => { sessionStorage.removeItem(LIST_STATE_KEY); }, []);

  useEffect(() => {
    fetch("/api/dashboard/packages")
      .then(r => r.json())
      .then(setPackages)
      .catch(() => {});
    fetch("/api/dashboard/reviews?summary=true")
      .then(r => r.json())
      .then(data => { if (data && typeof data === "object") setReviewCounts(data); })
      .catch(() => {});
  }, []);

  async function updateStatus(id, status) {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    await fetch(`/api/dashboard/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function deletePkg(id) {
    if (!confirm("Delete this package?")) return;
    setPackages(prev => prev.filter(p => p.id !== id));
    await fetch(`/api/dashboard/packages/${id}`, { method: "DELETE" });
  }

  // Compute duplicate IDs across ALL packages (not just filtered view)
  const duplicateIds = useMemo(() => {
    const groups = {};
    packages.forEach(p => {
      const k = dupKey(p);
      if (!groups[k]) groups[k] = [];
      groups[k].push(p);
    });
    const dupes = new Set();
    Object.values(groups).forEach(group => {
      if (group.length < 2) return;
      // Sort oldest first — keep the oldest as original, rest are duplicates
      const sorted = [...group].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      sorted.slice(1).forEach(p => dupes.add(p.id));
    });
    return dupes;
  }, [packages]);

  // SEO completeness — check all key SEO fields
  const seoCheck = useMemo(() => {
    const incomplete = new Map(); // id → missing: string[]
    packages.forEach(p => {
      const missing = [];
      if (!p.metaTitle?.trim())                                     missing.push("Meta Title");
      if (!p.metaDescription?.trim())                               missing.push("Meta Description");
      if (!p.metaKeywords?.trim())                                  missing.push("Meta Keywords");
      if (!Array.isArray(p.faqs) || p.faqs.length === 0)           missing.push("FAQs");
      if (!Array.isArray(p.schemas) || p.schemas.length === 0 ||
          !p.schemas.some(s => s.content?.trim()))                  missing.push("Schema");
      if (missing.length > 0) incomplete.set(p.id, missing);
    });
    return incomplete;
  }, [packages]);

  const destinations = [...new Set(packages.map(p => p.destination).filter(Boolean))].sort();

  const filtered = packages.filter(p => {
    if (showDupes)       return duplicateIds.has(p.id);
    if (showSeoIssues)   return seoCheck.has(p.id);
    if (showSeoDone)     return !seoCheck.has(p.id);
    if (showNoReviews)   return !reviewCounts[p.id];
    if (showHasReviews)  return !!reviewCounts[p.id];
    if (tab !== "All" && p.packageType !== tab) return false;
    if (destFilter    && p.destination   !== destFilter)    return false;
    if (subtypeFilter && p.packageSubtype !== subtypeFilter) return false;
    if (statusFilter  && p.status        !== statusFilter)  return false;
    if (search) {
      const q = search.toLowerCase().replace(/\s+/g, " ").trim();
      return (
        norm(p.packageName).includes(q) ||
        norm(p.destination).includes(q) ||
        norm(p.packageSubtype).includes(q)
      );
    }
    return true;
  });

  const activeDupes = showDupes ? filtered.filter(p => p.status === "Active") : [];

  async function inactivateAllDupes() {
    if (!activeDupes.length) return;
    if (!confirm(`Inactivate ${activeDupes.length} duplicate package(s)?`)) return;
    setInactivating(true);
    await Promise.all(activeDupes.map(p => updateStatus(p.id, "Inactive")));
    setInactivating(false);
  }

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Head><title>All Packages — Tourwatchout</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
          <h1 className="bk-page-title">All Packages</h1>
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
        {/* Row 1 — Search + main actions */}
        <div className="bk-topbar">
          <div className="bk-search-wrap">
            <MdSearch size={18} className="bk-search-icon" />
            <input
              className="bk-search-input"
              placeholder="Search packages…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button className="bk-import-btn" onClick={() => router.push("/dashboard/packages/import")}>
            <MdUpload size={17} /> Import Excel
          </button>
          <button className="bk-add-btn" onClick={() => router.push("/dashboard/packages/create")}>
            <MdAdd size={18} /> Add Package
          </button>
        </div>

        {/* Row 2 — Tracker buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>Trackers:</span>

          {/* Duplicates */}
          {[
            {
              label: "Duplicates", icon: <MdContentCopy size={14} />,
              active: showDupes, count: duplicateIds.size,
              activeStyle: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
              badgeStyle: { bg: "#ea580c", inactiveBg: "#e5e7eb", inactiveColor: "#374151" },
              onClick: () => { setShowDupes(d => !d); setShowSeoIssues(false); setShowSeoDone(false); setShowNoReviews(false); setShowHasReviews(false); setPage(1); },
            },
            {
              label: "SEO Issues", icon: <MdTravelExplore size={14} />,
              active: showSeoIssues, count: seoCheck.size,
              activeStyle: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
              badgeStyle: { bg: "#dc2626", inactiveBg: seoCheck.size > 0 ? "#fee2e2" : "#dcfce7", inactiveColor: seoCheck.size > 0 ? "#dc2626" : "#16a34a" },
              onClick: () => { setShowSeoIssues(s => !s); setShowDupes(false); setShowSeoDone(false); setShowNoReviews(false); setShowHasReviews(false); setPage(1); },
            },
            {
              label: "SEO Done", icon: <MdCheckCircle size={14} />,
              active: showSeoDone, count: packages.length - seoCheck.size,
              activeStyle: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
              badgeStyle: { bg: "#16a34a", inactiveBg: "#dcfce7", inactiveColor: "#16a34a" },
              onClick: () => { setShowSeoDone(s => !s); setShowDupes(false); setShowSeoIssues(false); setShowNoReviews(false); setShowHasReviews(false); setPage(1); },
            },
            {
              label: "No Reviews", icon: <MdStarBorder size={14} />,
              active: showNoReviews, count: packages.filter(p => !reviewCounts[p.id]).length,
              activeStyle: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
              badgeStyle: { bg: "#dc2626", inactiveBg: "#fee2e2", inactiveColor: "#dc2626" },
              onClick: () => { setShowNoReviews(s => !s); setShowHasReviews(false); setShowDupes(false); setShowSeoIssues(false); setShowSeoDone(false); setPage(1); },
            },
            {
              label: "Has Reviews", icon: <MdStar size={14} />,
              active: showHasReviews, count: packages.filter(p => !!reviewCounts[p.id]).length,
              activeStyle: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
              badgeStyle: { bg: "#d97706", inactiveBg: "#fef3c7", inactiveColor: "#d97706" },
              onClick: () => { setShowHasReviews(s => !s); setShowNoReviews(false); setShowDupes(false); setShowSeoIssues(false); setShowSeoDone(false); setPage(1); },
            },
          ].map(({ label, icon, active, count, activeStyle, badgeStyle, onClick }) => (
            <button key={label} onClick={onClick} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
              background: active ? activeStyle.bg : "#fff",
              color: active ? activeStyle.color : "#374151",
              border: `1.5px solid ${active ? activeStyle.border : "#e5e7eb"}`,
            }}>
              {icon}
              {label}
              <span style={{
                background: active ? badgeStyle.bg : badgeStyle.inactiveBg,
                color: active ? "#fff" : badgeStyle.inactiveColor,
                borderRadius: 20, padding: "0 6px", fontSize: 10, fontWeight: 700, minWidth: 18, textAlign: "center",
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Duplicates banner */}
        {showDupes && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 10,
            padding: "12px 18px", marginTop: 14, gap: 12, flexWrap: "wrap",
          }}>
            <div>
              <span style={{ fontWeight: 700, color: "#ea580c", fontSize: 14 }}>
                {duplicateIds.size} duplicate package{duplicateIds.size !== 1 ? "s" : ""} found
              </span>
              <span style={{ color: "#78350f", fontSize: 13, marginLeft: 10 }}>
                The oldest copy of each group is kept as original — these are the extras.
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {activeDupes.length > 0 && (
                <button
                  onClick={inactivateAllDupes}
                  disabled={inactivating}
                  style={{
                    background: inactivating ? "#9ca3af" : "#ea580c", color: "#fff",
                    border: "none", borderRadius: 8, padding: "8px 18px",
                    fontSize: 13, fontWeight: 700, cursor: inactivating ? "not-allowed" : "pointer",
                  }}
                >
                  {inactivating ? "Inactivating…" : `Inactivate All (${activeDupes.length})`}
                </button>
              )}
              <button
                onClick={() => { setShowDupes(false); setPage(1); }}
                style={{
                  background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb",
                  borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>
        )}

        {/* SEO Issues banner */}
        {showSeoIssues && (
          <div style={{
            background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10,
            padding: "12px 18px", marginTop: 14, display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap",
          }}>
            <MdWarning size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, color: "#dc2626", fontSize: 14 }}>
                {seoCheck.size} package{seoCheck.size !== 1 ? "s" : ""} with incomplete SEO
              </span>
              <span style={{ color: "#7f1d1d", fontSize: 13, marginLeft: 10 }}>
                Click the edit button on any package to fill in the missing SEO fields.
              </span>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Meta Title",       count: packages.filter(p => !p.metaTitle?.trim()).length,       color: "#dc2626", bg: "#fee2e2" },
                  { label: "Meta Description", count: packages.filter(p => !p.metaDescription?.trim()).length, color: "#d97706", bg: "#fef3c7" },
                  { label: "Meta Keywords",    count: packages.filter(p => !p.metaKeywords?.trim()).length,    color: "#7c3aed", bg: "#ede9fe" },
                  { label: "FAQs",             count: packages.filter(p => !Array.isArray(p.faqs) || p.faqs.length === 0).length, color: "#0891b2", bg: "#e0f2fe" },
                  { label: "Schema",           count: packages.filter(p => !Array.isArray(p.schemas) || p.schemas.length === 0 || !p.schemas.some(s => s.content?.trim())).length, color: "#16a34a", bg: "#dcfce7" },
                ].map(({ label, count, color, bg }) => count > 0 && (
                  <span key={label} style={{ background: bg, color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                    No {label}: {count}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setShowSeoIssues(false); setPage(1); }}
              style={{ background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
              ✕ Close
            </button>
          </div>
        )}

        {/* SEO Done banner */}
        {showSeoDone && (
          <div style={{
            background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10,
            padding: "12px 18px", marginTop: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          }}>
            <MdCheckCircle size={20} color="#16a34a" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, color: "#16a34a", fontSize: 14 }}>
                {packages.length - seoCheck.size} package{packages.length - seoCheck.size !== 1 ? "s" : ""} with complete SEO
              </span>
              <span style={{ color: "#14532d", fontSize: 13, marginLeft: 10 }}>
                All required SEO fields (Meta Title, Description, Keywords) are filled.
              </span>
            </div>
            <button
              onClick={() => { setShowSeoDone(false); setPage(1); }}
              style={{ background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
              ✕ Close
            </button>
          </div>
        )}

        {/* No Reviews banner */}
        {showNoReviews && (
          <div style={{
            background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10,
            padding: "12px 18px", marginTop: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          }}>
            <MdStarBorder size={20} color="#dc2626" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, color: "#dc2626", fontSize: 14 }}>
                {packages.filter(p => !reviewCounts[p.id]).length} package{packages.filter(p => !reviewCounts[p.id]).length !== 1 ? "s" : ""} have no reviews
              </span>
              <span style={{ color: "#7f1d1d", fontSize: 13, marginLeft: 10 }}>
                Go to the package edit page and add reviews to build credibility.
              </span>
            </div>
            <button onClick={() => { setShowNoReviews(false); setPage(1); }}
              style={{ background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
              ✕ Close
            </button>
          </div>
        )}

        {/* Has Reviews banner */}
        {showHasReviews && (
          <div style={{
            background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 10,
            padding: "12px 18px", marginTop: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          }}>
            <MdStar size={20} color="#d97706" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, color: "#d97706", fontSize: 14 }}>
                {packages.filter(p => !!reviewCounts[p.id]).length} package{packages.filter(p => !!reviewCounts[p.id]).length !== 1 ? "s" : ""} have reviews
              </span>
              <span style={{ color: "#78350f", fontSize: 13, marginLeft: 10 }}>
                Review count shown next to each package name.
              </span>
            </div>
            <button onClick={() => { setShowHasReviews(false); setPage(1); }}
              style={{ background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
              ✕ Close
            </button>
          </div>
        )}

        {/* Tabs + Filters — hidden in dupe/seo/review mode */}
        {!showDupes && !showSeoIssues && !showSeoDone && !showNoReviews && !showHasReviews && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:14 }}>
            <div className="bk-tabs" style={{ margin:0, flex:"0 0 auto" }}>
              {TABS.map(t => (
                <button key={t} className={`bk-tab ${tab === t ? "active" : ""}`}
                  onClick={() => { setTab(t); setPage(1); }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
              <select style={selStyle} value={destFilter} onChange={e => { setDestFilter(e.target.value); setPage(1); }}>
                <option value="">All Destinations</option>
                {destinations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select style={selStyle} value={subtypeFilter} onChange={e => { setSubtypeFilter(e.target.value); setPage(1); }}>
                <option value="">All Subtypes</option>
                {["Economy","Deluxe","Premium"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select style={selStyle} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {(destFilter || subtypeFilter || statusFilter) && (
                <button onClick={() => { setDestFilter(""); setSubtypeFilter(""); setStatusFilter(""); setPage(1); }}
                  style={{ padding:"8px 12px", borderRadius:8, border:"1.5px solid #fecdd3", background:"#fff1f2", color:"#e84949", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                  ✕ Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bk-table-card" style={{ marginTop: (showDupes || showSeoIssues || showSeoDone || showNoReviews || showHasReviews) ? 14 : undefined }}>
          <div className="bk-table-wrap">
            <table className="bk-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Package Name</th>
                  <th>Destination</th>
                  <th>Type</th>
                  <th>Sub Type</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign:"center", padding:"32px", color:"#9ca3af" }}>
                      {showDupes ? "No duplicates found — all packages are unique!" : showSeoIssues ? "All packages have complete SEO! 🎉" : showSeoDone ? "No packages with complete SEO yet." : showNoReviews ? "All packages have at least one review! 🎉" : showHasReviews ? "No packages with reviews yet." : "No packages found"}
                    </td>
                  </tr>
                ) : paged.map((p, i) => (
                  <tr key={p.id} style={showDupes ? { background: "#fff7ed" } : showSeoIssues ? { background: "#fef9f9" } : showSeoDone ? { background: "#f9fefb" } : showNoReviews ? { background: "#fef9f9" } : showHasReviews ? { background: "#fffdf0" } : {}}>
                    <td>{(page - 1) * perPage + i + 1}</td>
                    <td style={{ fontWeight:500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span>{p.packageName}</span>
                        {showDupes && (
                          <span style={{ fontSize:10, fontWeight:700, color:"#ea580c", background:"#fed7aa", borderRadius:4, padding:"1px 5px" }}>
                            DUPLICATE
                          </span>
                        )}
                      </div>
                      {showSeoIssues && seoCheck.has(p.id) && (
                        <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                          {seoCheck.get(p.id).map(field => (
                            <span key={field} style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", background: "#fee2e2", borderRadius: 4, padding: "1px 6px", display: "inline-flex", alignItems: "center", gap: 2 }}>
                              ✕ {field}
                            </span>
                          ))}
                        </div>
                      )}
                      {!showSeoIssues && !showDupes && !showSeoDone && seoCheck.has(p.id) && (
                        <div style={{ marginTop: 3 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", background: "#fee2e2", borderRadius: 4, padding: "1px 6px" }}>
                            SEO incomplete
                          </span>
                        </div>
                      )}
                      {showSeoDone && (
                        <div style={{ marginTop: 3 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#dcfce7", borderRadius: 4, padding: "1px 6px" }}>
                            ✓ SEO complete
                          </span>
                        </div>
                      )}
                      {showNoReviews && (
                        <div style={{ marginTop: 3 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", background: "#fee2e2", borderRadius: 4, padding: "1px 6px" }}>
                            ✕ No reviews yet
                          </span>
                        </div>
                      )}
                      {showHasReviews && reviewCounts[p.id] && (
                        <div style={{ marginTop: 3 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#d97706", background: "#fef3c7", borderRadius: 4, padding: "1px 6px", display: "inline-flex", alignItems: "center", gap: 3 }}>
                            ★ {reviewCounts[p.id]} review{reviewCounts[p.id] !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                      {!showNoReviews && !showHasReviews && !showDupes && !showSeoIssues && !showSeoDone && reviewCounts[p.id] && (
                        <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: "#d97706", background: "#fef3c7", borderRadius: 4, padding: "1px 6px", display: "inline-flex", alignItems: "center", gap: 2 }}>
                          ★ {reviewCounts[p.id]}
                        </span>
                      )}
                    </td>
                    <td>{p.destination}</td>
                    <td>{p.packageType}</td>
                    <td>{p.packageSubtype}</td>
                    <td>{p.duration}</td>
                    <td>₹{Number(p.finalPrice || p.basePrice).toLocaleString("en-IN")}</td>
                    <td>
                      <select
                        className={`bk-status-select ${p.status === "Active" ? "active" : "inactive"}`}
                        value={p.status}
                        onChange={e => updateStatus(p.id, e.target.value)}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </td>
                    <td>
                      <div className="bk-action-btns">
                        <button
                          className="bk-edit-btn"
                          onClick={() => {
                            sessionStorage.setItem(LIST_STATE_KEY, JSON.stringify({ page, tab, destFilter, subtypeFilter, statusFilter, perPage }));
                            router.push(`/dashboard/packages/create?id=${p.id}`);
                          }}
                        >
                          <MdEdit size={15} />
                        </button>
                        <button className="bk-del-btn" onClick={() => deletePkg(p.id)}>
                          <MdDelete size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bk-pagination">
            <div className="bk-pagination-left">
              <span className="bk-pag-label">Showing</span>
              <select className="bk-pag-size" value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              <span className="bk-pag-label">of {filtered.length}</span>
            </div>
            <div className="bk-pagination-right">
              <button className="bk-pag-btn bk-pag-arrow"
                onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <MdChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(Math.max(totalPages, 1), 5) }, (_, i) => i + 1).map(n => (
                <button key={n} className={`bk-pag-btn ${page === n ? "active" : ""}`}
                  onClick={() => setPage(n)}>{n}</button>
              ))}
              {totalPages > 5 && <span style={{ padding:"0 4px", color:"#9ca3af" }}>…</span>}
              <button className="bk-pag-btn bk-pag-arrow"
                onClick={() => setPage(p => Math.min(Math.max(totalPages, 1), p + 1))} disabled={page >= Math.max(totalPages, 1)}>
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

PackagesList.getLayout = (page) => (
  <DashboardLayout active="All Packages">{page}</DashboardLayout>
);

const selStyle = {
  border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 14px",
  fontSize:13, fontWeight:500, background:"#fff", color:"#374151",
  outline:"none", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
};
