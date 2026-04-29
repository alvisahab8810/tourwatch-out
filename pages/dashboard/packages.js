import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdSearch,
  MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import { isAuthenticated } from "../../utils/voucherAuth";
import Sidebar from "../../components/backend/Sidebar";

const TABS = ["Family", "Couple", "Corporate", "Honeymoon", "Group"];
const PER_PAGE_OPTS = [10, 20, 50];

export default function PackagesList() {
  const router = useRouter();
  const [ready, setReady]     = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [packages, setPackages] = useState([]);
  const [tab, setTab]         = useState("Family");
  const [search, setSearch]   = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage]       = useState(1);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/dashboard/login"); return; }
    fetch("/api/dashboard/packages")
      .then(r => r.json())
      .then(setPackages)
      .catch(() => {});
    setReady(true);
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

  if (!ready) return null;

  const filtered = packages.filter(p => {
    if (p.packageType !== tab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.packageName?.toLowerCase().includes(q) ||
      p.destination?.toLowerCase().includes(q) ||
      p.packageSubtype?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Head>
        <title>All Packages — TourWatchOut</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>

      <div className="bk-page">
        <Sidebar active="All Packages" isOpen={sidebar} onClose={() => setSidebar(false)} />

        <main className="bk-main">
          <header className="bk-header">
            <div className="bk-header-left">
              <button className="bk-hamburger" onClick={() => setSidebar(true)}><MdMenu size={22} /></button>
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
                className="bk-add-btn"
                onClick={() => router.push("/dashboard/packages/create")}
              >
                <MdAdd size={18} /> Add Package
              </button>
            </div>

            {/* Tabs */}
            <div className="bk-tabs">
              {TABS.map(t => (
                <button
                  key={t}
                  className={`bk-tab ${tab === t ? "active" : ""}`}
                  onClick={() => { setTab(t); setPage(1); }}
                >
                  {t}
                </button>
              ))}
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
                            onClick={() => router.push(`/dashboard/packages/create?id=${p.id}`)}
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
        </main>
      </div>
    </>
  );
}
