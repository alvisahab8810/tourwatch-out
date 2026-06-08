import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import {
  MdSearch, MdRefresh, MdDelete, MdEdit, MdCheckCircle, MdCancel, MdStar,
  MdChevronLeft, MdChevronRight, MdFilterList, MdAdd,
} from "react-icons/md";
import DashboardLayout from "../../components/backend/DashboardLayout";

const PER_PAGE_OPTS = [10, 20, 50];
const STATUS_OPTS   = ["All", "pending", "approved", "rejected"];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function Stars({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width={13} height={13} viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? "#f5a623" : "none"}
          stroke="#f5a623" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{ cursor: "pointer", fontSize: 28, color: n <= active ? "#f5a623" : "#d1d5db", transition: "color 0.1s" }}
          onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(n)}>★</span>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { pending: { bg: "#fef9c3", color: "#a16207" }, approved: { bg: "#dcfce7", color: "#15803d" }, rejected: { bg: "#fee2e2", color: "#b91c1c" } };
  const s = map[status] || map.pending;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{label}</span>;
}

function TH({ children }) {
  return <th style={{ padding: "11px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", borderBottom: "1px solid #e2e8f0" }}>{children}</th>;
}
function TD({ children, style }) {
  return <td style={{ padding: "11px 14px", fontSize: 13, color: "#374151", verticalAlign: "middle", ...style }}>{children}</td>;
}
function Label({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, marginTop: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>{children}</div>;
}
function PgBtn({ children, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      minWidth: 32, height: 32, border: "1px solid #e2e8f0", borderRadius: 6, padding: "0 8px",
      background: active ? "#EE4C49" : "#fff", color: active ? "#fff" : "#374151",
      fontSize: 13, fontWeight: active ? 700 : 400, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center",
    }}>{children}</button>
  );
}

const BLANK_FORM = { packageId: "", packageName: "", destinationSlug: "", userName: "", userEmail: "", rating: 0, title: "", text: "", status: "approved" };

export default function ReviewsPage() {
  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [statusF,   setStatusF]   = useState("All");
  const [perPage,   setPerPage]   = useState(10);
  const [page,      setPage]      = useState(1);

  /* Edit modal */
  const [editId,    setEditId]    = useState(null);
  const [editData,  setEditData]  = useState({});
  const [editMeta,  setEditMeta]  = useState({}); // read-only reviewer info
  const [saving,    setSaving]    = useState(false);
  const editImgRef = useRef(null);

  /* Delete confirm */
  const [confirmId, setConfirmId] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  /* Add Review modal */
  const [showAdd,   setShowAdd]   = useState(false);
  const [packages,  setPackages]  = useState([]);
  const [pkgSearch, setPkgSearch] = useState("");
  const [addForm,   setAddForm]   = useState(BLANK_FORM);
  const [adding,    setAdding]    = useState(false);

  useEffect(() => { fetchReviews(); }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/reviews");
      if (res.ok) setReviews(await res.json());
    } finally { setLoading(false); }
  }

  async function openAddModal() {
    setShowAdd(true);
    setAddForm(BLANK_FORM);
    setPkgSearch("");
    if (packages.length === 0) {
      const res = await fetch("/api/dashboard/packages/list");
      if (res.ok) setPackages(await res.json());
    }
  }

  function selectPackage(pkg) {
    setAddForm(p => ({
      ...p,
      packageId:       String(pkg._id),
      packageName:     pkg.packageName,
      destinationSlug: pkg.destination || "",
    }));
    setPkgSearch(pkg.packageName);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!addForm.packageId)    { alert("Please select a package."); return; }
    if (!addForm.rating)       { alert("Please select a rating."); return; }
    if (!addForm.text.trim())  { alert("Please enter review text."); return; }
    if (!addForm.userName.trim()) { alert("Please enter reviewer name."); return; }

    setAdding(true);
    try {
      const res = await fetch("/api/dashboard/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        const created = await res.json();
        setReviews(prev => [created, ...prev]);
        setShowAdd(false);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to create review.");
      }
    } finally { setAdding(false); }
  }

  function openEdit(r) {
    setEditId(r._id);
    setEditData({ status: r.status, title: r.title || "", text: r.text, adminNote: r.adminNote || "", images: Array.isArray(r.images) ? [...r.images] : [] });
    setEditMeta({ userName: r.userName, userEmail: r.userEmail || "", rating: r.rating, packageName: r.packageName || "", createdAt: r.createdAt });
  }

  async function saveEdit() {
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/reviews/${editId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editData),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews(prev => prev.map(r => r._id === editId ? updated : r));
        setEditId(null);
      }
    } finally { setSaving(false); }
  }

  async function quickStatus(id, status) {
    const res = await fetch(`/api/dashboard/reviews/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReviews(prev => prev.map(r => r._id === id ? updated : r));
    }
  }

  async function confirmDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await fetch(`/api/dashboard/reviews/${confirmId}`, { method: "DELETE" });
      setReviews(prev => prev.filter(r => r._id !== confirmId));
    } finally { setDeleting(false); setConfirmId(null); }
  }

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.userName?.toLowerCase().includes(q) || r.userEmail?.toLowerCase().includes(q) || r.packageName?.toLowerCase().includes(q) || r.text?.toLowerCase().includes(q);
    return matchSearch && (statusF === "All" || r.status === statusF);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const stats = { total: reviews.length, pending: reviews.filter(r => r.status === "pending").length, approved: reviews.filter(r => r.status === "approved").length, rejected: reviews.filter(r => r.status === "rejected").length };

  const filteredPkgs = packages.filter(p => p.packageName?.toLowerCase().includes(pkgSearch.toLowerCase()));

  return (
    <DashboardLayout active="Reviews">
      <Head><title>Reviews — Tourwatchout</title></Head>

      <div style={{ padding: "28px 24px" }}>
        <style>{`
          .rev-table-wrap::-webkit-scrollbar { height: 5px; }
          .rev-table-wrap::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 99px; }
          .rev-table-wrap::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
          .rev-table-wrap::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          .pkg-option:hover { background: #f1f5f9 !important; }
        `}</style>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>Package Reviews</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={fetchReviews} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Refresh">
              <MdRefresh size={18} />
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[["Total", stats.total, "#2563eb"], ["Pending", stats.pending, "#d97706"], ["Approved", stats.approved, "#16a34a"], ["Rejected", stats.rejected, "#dc2626"]].map(([label, value, color]) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 20px", flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px", height: 40 }}>
            <MdSearch size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
            <input style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: "#0f172a" }}
              placeholder="Search by reviewer, package, text…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px", height: 40 }}>
            <MdFilterList size={16} color="#64748b" />
            <select style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", background: "transparent", cursor: "pointer" }}
              value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }}>
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s === "All" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ width: "100%", overflowX: "auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12 }} className="rev-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <TH>SR.</TH>
                <TH>Package</TH>
                <TH>Reviewer</TH>
                <TH>Rating</TH>
                <TH>Review</TH>
                <TH>Status</TH>
                <TH>Date</TH>
                <TH>Admin Note</TH>
                <TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>Loading…</td></tr>
              ) : slice.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                  <MdStar size={36} color="#cbd5e1" style={{ display: "block", margin: "0 auto 8px" }} />
                  No reviews found
                </td></tr>
              ) : slice.map((r, i) => (
                <tr key={r._id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                  <TD>{(safePage - 1) * perPage + i + 1}</TD>
                  <TD>
                    {r.packageId ? (
                      <a href={`/dashboard/packages/create?id=${r.packageId}`} target="_blank" rel="noreferrer"
                        style={{ fontWeight: 600, color: "#2563eb", maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", textDecoration: "none" }}
                        title={`Edit: ${r.packageName}`}>{r.packageName || "—"} ↗</a>
                    ) : (
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{r.packageName || <span style={{ color: "#94a3b8" }}>—</span>}</div>
                    )}
                    {r.destinationSlug && r.packageId && (
                      <a href={`/destination/${r.destinationSlug}/package/${r.packageId}`} target="_blank" rel="noreferrer"
                        style={{ fontSize: 11, color: "#EE4C49", textDecoration: "none", display: "block" }}
                        title="View live package page">{r.destinationSlug} · View live ↗</a>
                    )}
                    {!r.packageId && r.destinationSlug && <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.destinationSlug}</div>}
                  </TD>
                  <TD>
                    <div style={{ fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>{r.userName}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{r.userEmail || "—"}</div>
                  </TD>
                  <TD>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Stars rating={r.rating} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#f5a623" }}>{r.rating}/5</span>
                    </div>
                  </TD>
                  <TD style={{ maxWidth: 240 }}>
                    {r.title && <div style={{ fontWeight: 600, fontSize: 12, color: "#0f172a", marginBottom: 2 }}>{r.title}</div>}
                    <div style={{ fontSize: 12, color: "#374151", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }} title={r.text}>{r.text}</div>
                  </TD>
                  <TD><StatusBadge status={r.status} /></TD>
                  <TD style={{ whiteSpace: "nowrap" }}>{fmtDate(r.createdAt)}</TD>
                  <TD style={{ maxWidth: 140 }}>
                    {r.adminNote ? <span style={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }} title={r.adminNote}>{r.adminNote.slice(0, 40)}{r.adminNote.length > 40 ? "…" : ""}</span> : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>}
                  </TD>
                  <TD>
                    <div style={{ display: "flex", gap: 6 }}>
                      {r.status !== "approved" && (
                        <button title="Approve" onClick={() => quickStatus(r._id, "approved")} style={iconBtn("#16a34a")}><MdCheckCircle size={16} /></button>
                      )}
                      {r.status !== "rejected" && (
                        <button title="Reject" onClick={() => quickStatus(r._id, "rejected")} style={iconBtn("#dc2626")}><MdCancel size={16} /></button>
                      )}
                      <button title="Edit" onClick={() => openEdit(r)} style={iconBtn("#2563eb")}><MdEdit size={16} /></button>
                      <button title="Delete" onClick={() => setConfirmId(r._id)} style={iconBtn("#64748b")}><MdDelete size={16} /></button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" }}>
            Showing
            <select style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px", fontSize: 13, color: "#374151", background: "#fff", outline: "none" }}
              value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
              {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
            </select>
            of {filtered.length}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}><MdChevronLeft size={18} /></PgBtn>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              const pg = idx + 1;
              return <PgBtn key={pg} onClick={() => setPage(pg)} active={pg === safePage}>{pg}</PgBtn>;
            })}
            <PgBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}><MdChevronRight size={18} /></PgBtn>
          </div>
        </div>
      </div>

      {/* ════════════════ ADD REVIEW MODAL ════════════════ */}
      {showAdd && (
        <div style={M.overlay} onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={{ ...M.box, maxWidth: 600 }}>
            <div style={M.head}>
              <h3 style={M.hTitle}>Add Review</h3>
              <button style={M.close} onClick={() => setShowAdd(false)}>✕</button>
            </div>

            <form onSubmit={handleAdd}>
              <div style={{ padding: "8px 24px 20px", maxHeight: "70vh", overflowY: "auto" }}>

                {/* Package selector */}
                <Label>Select Package *</Label>
                <div style={{ position: "relative" }}>
                  <input
                    style={M.input}
                    placeholder="Search and select a package…"
                    value={pkgSearch}
                    onChange={e => { setPkgSearch(e.target.value); setAddForm(p => ({ ...p, packageId: "", packageName: "", destinationSlug: "" })); }}
                    autoComplete="off"
                  />
                  {pkgSearch && !addForm.packageId && filteredPkgs.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 99, maxHeight: 200, overflowY: "auto" }}>
                      {filteredPkgs.slice(0, 20).map(pkg => (
                        <div key={String(pkg._id)} className="pkg-option"
                          style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}
                          onMouseDown={e => { e.preventDefault(); selectPackage(pkg); }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{pkg.packageName}</div>
                          {pkg.destination && <div style={{ fontSize: 11, color: "#64748b" }}>{pkg.destination}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {addForm.packageId && (
                  <div style={{ marginTop: 6, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                    ✓ {addForm.packageName}
                  </div>
                )}

                {/* Reviewer name + email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <Label>Reviewer Name *</Label>
                    <input style={M.input} placeholder="e.g. Rahul Sharma" value={addForm.userName}
                      onChange={e => setAddForm(p => ({ ...p, userName: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Reviewer Email</Label>
                    <input style={M.input} placeholder="e.g. rahul@email.com" value={addForm.userEmail}
                      onChange={e => setAddForm(p => ({ ...p, userEmail: e.target.value }))} />
                  </div>
                </div>

                {/* Rating */}
                <Label>Rating *</Label>
                <StarPicker value={addForm.rating} onChange={v => setAddForm(p => ({ ...p, rating: v }))} />

                {/* Title */}
                <Label>Review Title</Label>
                <input style={M.input} placeholder="e.g. Amazing Kashmir experience!" value={addForm.title}
                  onChange={e => setAddForm(p => ({ ...p, title: e.target.value }))} maxLength={100} />

                {/* Text */}
                <Label>Review Text *</Label>
                <textarea style={{ ...M.input, resize: "vertical", minHeight: 100 }}
                  placeholder="Write the review content here…"
                  value={addForm.text} onChange={e => setAddForm(p => ({ ...p, text: e.target.value }))}
                  maxLength={1000} required />
                <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "right", marginTop: 2 }}>{addForm.text.length}/1000</div>

                {/* Status */}
                <Label>Status</Label>
                <select style={{ ...M.input, cursor: "pointer" }} value={addForm.status}
                  onChange={e => setAddForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="approved">Approved (visible on page)</option>
                  <option value="pending">Pending (hidden until approved)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div style={M.footer}>
                <button type="submit" style={M.saveBtn} disabled={adding}>{adding ? "Posting…" : "Post Review"}</button>
                <button type="button" style={M.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════ EDIT MODAL ════════════════ */}
      {editId && (
        <div style={M.overlay} onClick={e => { if (e.target === e.currentTarget) setEditId(null); }}>
          <div style={{ ...M.box, maxWidth: 560 }}>
            <div style={M.head}>
              <h3 style={M.hTitle}>Edit Review</h3>
              <button style={M.close} onClick={() => setEditId(null)}>✕</button>
            </div>
            <div style={{ padding: "4px 24px 20px", maxHeight: "74vh", overflowY: "auto" }}>

              {/* Reviewer info — read-only */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", marginTop: 12, marginBottom: 4 }}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Reviewer</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{editMeta.userName}</div>
                    {editMeta.userEmail && <div style={{ fontSize: 12, color: "#64748b" }}>{editMeta.userEmail}</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Package</div>
                    <div style={{ fontSize: 13, color: "#374151" }}>{editMeta.packageName || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Rating</div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize: 16, color: n <= editMeta.rating ? "#f5a623" : "#d1d5db" }}>★</span>)}
                    </div>
                  </div>
                  {editMeta.createdAt && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Date</div>
                      <div style={{ fontSize: 12, color: "#374151" }}>{fmtDate(editMeta.createdAt)}</div>
                    </div>
                  )}
                </div>
              </div>

              <Label>Status</Label>
              <select style={{ ...M.input, cursor: "pointer" }} value={editData.status} onChange={e => setEditData(p => ({ ...p, status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <Label>Review Title</Label>
              <input style={M.input} value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} placeholder="Review title…" />

              <Label>Review Text</Label>
              <textarea style={{ ...M.input, resize: "vertical", minHeight: 100 }} value={editData.text} onChange={e => setEditData(p => ({ ...p, text: e.target.value }))} />

              {/* Photos */}
              <Label>Review Photos</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 4 }}>
                {(editData.images || []).map((img, idx) => (
                  <div key={idx} style={{ position: "relative", width: 72, height: 72, borderRadius: 8, overflow: "hidden", border: "1.5px solid #e2e8f0", background: "#f1f5f9", flexShrink: 0 }}>
                    {img.uploading
                      ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>…</div>
                      : <img src={img.src} alt={img.alt || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    }
                    <button type="button"
                      onClick={() => setEditData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                      title="Remove photo"
                      style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(220,38,38,0.85)", border: "none", color: "#fff", fontSize: 11, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>✕</button>
                  </div>
                ))}
                {(editData.images || []).length < 6 && (
                  <button type="button"
                    onClick={() => editImgRef.current?.click()}
                    style={{ width: 72, height: 72, borderRadius: 8, border: "1.5px dashed #cbd5e1", background: "#f8fafc", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, flexShrink: 0 }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>Add
                  </button>
                )}
                {(editData.images || []).length === 0 && <span style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No photos attached</span>}
              </div>
              <input ref={editImgRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                onChange={async e => {
                  const files = Array.from(e.target.files || []);
                  e.target.value = "";
                  const slots = files.slice(0, 6 - (editData.images || []).length);
                  const startIdx = (editData.images || []).length;
                  const placeholders = slots.map(() => ({ src: "", alt: "", uploading: true }));
                  setEditData(p => ({ ...p, images: [...(p.images || []), ...placeholders] }));
                  slots.forEach(async (file, i) => {
                    const reader = new FileReader();
                    reader.onload = async ev => {
                      try {
                        const r = await fetch("/api/dashboard/packages/upload-image", {
                          method: "POST", headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ base64: ev.target.result, name: file.name }),
                        });
                        const { url } = await r.json();
                        setEditData(p => { const imgs = [...(p.images || [])]; imgs[startIdx + i] = { src: url, alt: file.name }; return { ...p, images: imgs }; });
                      } catch { setEditData(p => ({ ...p, images: (p.images || []).filter((_, idx2) => idx2 !== startIdx + i) })); }
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />

              <Label>Admin Note (internal)</Label>
              <input style={M.input} value={editData.adminNote} onChange={e => setEditData(p => ({ ...p, adminNote: e.target.value }))} placeholder="Internal note…" />
            </div>
            <div style={M.footer}>
              <button style={M.saveBtn} onClick={saveEdit} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
              <button style={M.cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ DELETE CONFIRM ════════════════ */}
      {confirmId && (
        <div style={M.overlay} onClick={e => { if (e.target === e.currentTarget) setConfirmId(null); }}>
          <div style={{ ...M.box, maxWidth: 400 }}>
            <div style={M.head}>
              <h3 style={{ ...M.hTitle, color: "#dc2626" }}>Delete Review</h3>
              <button style={M.close} onClick={() => setConfirmId(null)}>✕</button>
            </div>
            <div style={{ padding: "20px 24px", fontSize: 14, color: "#374151" }}>
              Are you sure you want to permanently delete this review? This cannot be undone.
            </div>
            <div style={M.footer}>
              <button style={{ ...M.saveBtn, background: "#dc2626" }} onClick={confirmDelete} disabled={deleting}>{deleting ? "Deleting…" : "Yes, Delete"}</button>
              <button style={M.cancelBtn} onClick={() => setConfirmId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function iconBtn(color) {
  return { background: "transparent", border: `1.5px solid ${color}`, borderRadius: 6, color, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
}

const M = {
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 },
  box:       { background: "#fff", borderRadius: 16, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden" },
  head:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #f1f5f9" },
  hTitle:    { fontSize: 17, fontWeight: 800, color: "#0f172a", margin: 0 },
  close:     { background: "none", border: "none", fontSize: 18, color: "#94a3b8", cursor: "pointer" },
  input:     { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 13px", fontSize: 14, color: "#0c141d", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  footer:    { display: "flex", gap: 10, padding: "16px 24px", borderTop: "1px solid #f1f5f9" },
  saveBtn:   { background: "#EE4C49", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  cancelBtn: { background: "transparent", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
