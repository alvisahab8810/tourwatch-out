import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdSearch,
  MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight, MdUpload,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

const TABS = ["Family", "Couple"];
const PER_PAGE_OPTS = [20, 50, 100];

const LIST_STATE_KEY = "pkgListState";

export default function PackagesList() {
  const router = useRouter();
  const openSidebar = useOpenSidebar();
  const [packages, setPackages] = useState([]);

  // Restore state from sessionStorage if coming back from edit
  const saved = (() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(sessionStorage.getItem(LIST_STATE_KEY) || "null"); } catch { return null; }
  })();

  const [tab, setTab]             = useState(saved?.tab || "Family");
  const [search, setSearch]       = useState("");
  const [destFilter, setDestFilter] = useState(saved?.destFilter || "");
  const [subtypeFilter, setSubtypeFilter] = useState(saved?.subtypeFilter || "");
  const [statusFilter, setStatusFilter]   = useState(saved?.statusFilter || "");
  const [perPage, setPerPage]     = useState(saved?.perPage || 20);
  const [page, setPage]           = useState(saved?.page || 1);

  useEffect(() => {
    // Clear saved state after restoring — only applies once per return
    sessionStorage.removeItem(LIST_STATE_KEY);
  }, []);

  useEffect(() => {
    fetch("/api/dashboard/packages")
      .then(r => r.json())
      .then(setPackages)
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

  const destinations = [...new Set(packages.map(p => p.destination).filter(Boolean))].sort();

  const filtered = packages.filter(p => {
    if (p.packageType !== tab) return false;
    if (destFilter    && p.destination   !== destFilter)    return false;
    if (subtypeFilter && p.packageSubtype !== subtypeFilter) return false;
    if (statusFilter  && p.status        !== statusFilter)  return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.packageName?.toLowerCase().includes(q) ||
        p.destination?.toLowerCase().includes(q) ||
        p.packageSubtype?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Head><title>All Packages — TourWatchOut</title></Head>

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
            {/* Top bar */}
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
              <button
                className="bk-import-btn"
                onClick={() => router.push("/dashboard/packages/import")}
              >
                <MdUpload size={17} /> Import Excel
              </button>
              <button
                className="bk-add-btn"
                onClick={() => router.push("/dashboard/packages/create")}
              >
                <MdAdd size={18} /> Add Package
              </button>
            </div>

            {/* Tabs + Filters in one row */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:14 }}>
              {/* Left: tabs */}
              <div className="bk-tabs" style={{ margin:0, flex:"0 0 auto" }}>
                {TABS.map(t => (
                  <button key={t} className={`bk-tab ${tab === t ? "active" : ""}`}
                    onClick={() => { setTab(t); setPage(1); }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Right: filters pushed to end */}
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

            {/* Table */}
            <div className="bk-table-card">
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
                      <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>
                        No packages found
                      </td>
                    </tr>
                  ) : paged.map((p, i) => (
                    <tr key={p.id}>
                      <td>{(page - 1) * perPage + i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{p.packageName}</td>
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
                  {totalPages > 5 && <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>}
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
  border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 14px",
  fontSize: 13, fontWeight: 500, background: "#fff", color: "#374151",
  outline: "none", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
