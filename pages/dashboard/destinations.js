import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdSearch, MdTune, MdAdd, MdMenu,
  MdKeyboardArrowDown, MdPeople,
  MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import { isAuthenticated } from "../../utils/voucherAuth";
import Sidebar from "../../components/backend/Sidebar";

const PAGE_SIZES = [10, 20, 50];

export default function Destinations() {
  const router = useRouter();
  const [ready, setReady]         = useState(false);
  const [sidebarOpen, setSidebar] = useState(false);
  const [destinations, setDests]  = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState("national");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(10);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/dashboard/login"); return; }
    setReady(true);
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [destRes, pkgRes] = await Promise.all([
        fetch("/api/dashboard/destinations"),
        fetch("/api/dashboard/packages"),
      ]);
      const dests = await destRes.json();
      const pkgs  = await pkgRes.json();

      const destList = Array.isArray(dests) ? dests : [];
      const pkgList  = Array.isArray(pkgs)  ? pkgs  : [];

      // Compute package counts per destination (matched by name)
      const enriched = destList.map((d) => {
        const name = (d.title || d.name || "").toLowerCase();
        const matched = pkgList.filter((p) => (p.destination || "").toLowerCase() === name);
        return {
          ...d,
          totalPackages:  matched.length,
          activePackages: matched.filter((p) => p.status === "Active").length,
        };
      });

      setDests(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    // Optimistic update
    setDests(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    await fetch(`/api/dashboard/destinations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteDest(id) {
    if (!confirm("Delete this destination? This cannot be undone.")) return;
    setDests(prev => prev.filter(d => d.id !== id));
    await fetch(`/api/dashboard/destinations/${id}`, { method: "DELETE" });
  }

  /* ─── Filter + paginate ─── */
  const filtered = destinations.filter(d =>
    d.type === tab &&
    (!search || (d.title || d.name || "").toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageNums = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  if (!ready) return null;

  return (
    <>
      <Head>
        <title>Destinations — TourWatchOut</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>

      <div className="bk-page">
        <Sidebar active="Destinations" isOpen={sidebarOpen} onClose={() => setSidebar(false)} />

        <main className="bk-main">
          <header className="bk-header">
            <div className="bk-header-left">
              <button className="bk-hamburger" onClick={() => setSidebar(true)}><MdMenu size={22} /></button>
              <button className="bk-back-btn" onClick={() => router.push("/dashboard")}><MdChevronLeft size={20} /></button>
              <h1 className="bk-page-title">Destinations</h1>
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
            {/* Topbar */}
            <div className="bk-topbar">
              <div className="bk-search-wrap">
                <MdSearch size={18} className="bk-search-icon" />
                <input
                  className="bk-search-input"
                  placeholder="Search destinations…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <button className="bk-filter-btn"><MdTune size={18} /> Filter</button>
              <button
                className="bk-add-btn"
                onClick={() => router.push("/dashboard/destinations/create")}
              >
                <MdAdd size={18} /> Add New Destination
              </button>
            </div>

            {/* Tabs */}
            <div className="bk-tabs">
              <button className={`bk-tab ${tab === "national" ? "active" : ""}`}
                onClick={() => { setTab("national"); setPage(1); }}>National</button>
              <button className={`bk-tab ${tab === "international" ? "active" : ""}`}
                onClick={() => { setTab("international"); setPage(1); }}>International</button>
            </div>

            {/* Table */}
            <div className="bk-table-card">
              <div className="bk-table-wrap">
                <table className="bk-table">
                  <thead>
                    <tr>
                      <th>Package Name</th>
                      {/* <th>Duration</th> */}
                      <th>Total Packages</th>
                      <th>Active Packages</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="bk-table-empty">Loading…</td></tr>
                    ) : rows.length === 0 ? (
                      <tr><td colSpan={5} className="bk-table-empty">No destinations found. Click "Add New Destination" to create one.</td></tr>
                    ) : rows.map(d => (
                      <tr key={d.id}>
                        <td>
                          <div className="bk-dest-name-cell">
                            <img
                              src={
                                d.mainImage?.src ||
                                d.images?.Family?.Economy?.src ||
                                d.images?.economy ||
                                "/assets/images/n-destination/img1.webp"
                              }
                              alt={d.title || d.name}
                              className="bk-dest-thumb"
                              onError={e => { e.currentTarget.src = "/assets/images/n-destination/img1.webp"; }}
                            />
                            <div>
                              <span className="bk-dest-title">{d.title || d.name}</span>
                              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                                {d.country}{d.state ? `, ${d.state}` : ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* <td style={{ color: "#6b7280", fontSize: 13 }}>{d.duration || "—"}</td> */}
                        <td className="bk-td-num">{d.totalPackages || 0}</td>
                        <td className="bk-td-num bk-clr-green">{d.activePackages || 0}</td>
                        <td>
                          <select
                            className={`bk-status-select ${d.status === "Active" ? "active" : "inactive"}`}
                            value={d.status}
                            onChange={e => updateStatus(d.id, e.target.value)}
                          >
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                        </td>
                        <td>
                          <div className="bk-action-btns">
                            <button className="bk-edit-btn"
                              onClick={() => router.push(`/dashboard/destinations/create?id=${d.id}`)}>
                              Edit
                            </button>
                            <button className="bk-del-btn" onClick={() => deleteDest(d.id)}>Delete</button>
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
                  <select className="bk-pag-size" value={pageSize}
                    onChange={e => { setPageSize(+e.target.value); setPage(1); }}>
                    {PAGE_SIZES.map(n => <option key={n}>{n}</option>)}
                  </select>
                  <span className="bk-pag-label">of {filtered.length}</span>
                </div>
                <div className="bk-pagination-right">
                  <button className="bk-pag-btn bk-pag-arrow"
                    onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <MdChevronLeft size={18} />
                  </button>
                  {pageNums.map(n => (
                    <button key={n} className={`bk-pag-btn ${page === n ? "active" : ""}`}
                      onClick={() => setPage(n)}>{n}</button>
                  ))}
                  {totalPages > 5 && <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>}
                  <button className="bk-pag-btn bk-pag-arrow"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    <MdChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
