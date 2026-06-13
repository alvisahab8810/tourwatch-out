import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdSearch, MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";
const TABS = ["All", "Family", "Couple"];
const PER_PAGE_OPTS = [20, 50, 100];

export default function SPPackages() {
  const router = useRouter();
  const [spData,    setSpData]    = useState(null);
  const [packages,  setPackages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("All");
  const [search,    setSearch]    = useState("");
  const [destFilter, setDestFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [perPage,   setPerPage]   = useState(20);
  const [page,      setPage]      = useState(1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SP_AUTH_KEY);
      if (!raw) return router.replace("/salesperson/login");
      const { token, salesperson } = JSON.parse(raw);
      if (!token || !salesperson) return router.replace("/salesperson/login");
      setSpData(salesperson);
    } catch { router.replace("/salesperson/login"); }
  }, []);

  useEffect(() => {
    if (!spData) return;
    fetch("/api/dashboard/packages")
      .then(r => r.json())
      .then(d => { setPackages(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [spData]);

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

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
    if (tab !== "All" && p.packageType !== tab) return false;
    if (destFilter   && p.destination  !== destFilter)   return false;
    if (statusFilter && p.status       !== statusFilter)  return false;
    if (search) {
      const q = search.toLowerCase();
      return (p.packageName || "").toLowerCase().includes(q) || (p.destination || "").toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  if (!spData) return null;

  return (
    <SPLayout active="Packages" spData={spData} onLogout={handleLogout}>
      <Head><title>Packages — Tourwatchout</title></Head>

      <div style={{ padding: "28px 24px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>All Packages</h1>
        </div>

        <div className="bk-topbar">
          <div className="bk-search-wrap">
            <MdSearch size={18} className="bk-search-icon" />
            <input className="bk-search-input" placeholder="Search packages…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select value={destFilter} onChange={e => { setDestFilter(e.target.value); setPage(1); }}
            style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", background: "#fff" }}>
            <option value="">All Destinations</option>
            {destinations.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", background: "#fff" }}>
            <option value="">All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button className="bk-add-btn" onClick={() => router.push("/dashboard/packages/create")}>
            <MdAdd size={18} /> Add Package
          </button>
        </div>

        <div className="bk-tabs" style={{ marginBottom: 16 }}>
          {TABS.map(t => (
            <button key={t} className={`bk-tab${tab === t ? " active" : ""}`} onClick={() => { setTab(t); setPage(1); }}>{t}</button>
          ))}
        </div>

        <div className="bk-table-card">
          <div className="bk-table-wrap">
            <table className="bk-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Package Name</th>
                  <th>Destination</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="bk-table-empty">Loading…</td></tr>
                ) : paged.length === 0 ? (
                  <tr><td colSpan={8} className="bk-table-empty">No packages found</td></tr>
                ) : paged.map((p, i) => (
                  <tr key={p.id}>
                    <td>{(page - 1) * perPage + i + 1}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {p.image?.src && <img src={p.image.src} alt="" style={{ width: 36, height: 28, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{p.packageName || "—"}</span>
                      </div>
                    </td>
                    <td>{p.destination || "—"}</td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: p.packageType === "Family" ? "#dbeafe" : "#f3e8ff", color: p.packageType === "Family" ? "#1d4ed8" : "#7c3aed" }}>
                        {p.packageType || "—"}
                      </span>
                    </td>
                    <td>{p.duration || p.nights ? `${p.nights || ""}N / ${(parseInt(p.nights || 0) + 1)}D` : "—"}</td>
                    <td style={{ fontWeight: 700, color: "#16a34a" }}>
                      {p.price || p.basePrice ? `₹${Number(p.price || p.basePrice).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td>
                      <select className={`bk-status-select${p.status === "Active" ? " active" : " inactive"}`}
                        value={p.status} onChange={e => updateStatus(p.id, e.target.value)}>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </td>
                    <td>
                      <div className="bk-action-btns">
                        <button className="bk-edit-btn" onClick={() => router.push(`/dashboard/packages/create?id=${p.id}`)}><MdEdit size={15} /></button>
                        <button className="bk-del-btn" onClick={() => deletePkg(p.id)}><MdDelete size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bk-pagination">
            <div className="bk-pagination-left">
              <span className="bk-pag-label">Show</span>
              <select className="bk-pag-size" value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
              </select>
              <span className="bk-pag-label">of {filtered.length}</span>
            </div>
            <div className="bk-pagination-right">
              <button className="bk-pag-btn bk-pag-arrow" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><MdChevronLeft size={18} /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} className={`bk-pag-btn${page === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              {totalPages > 5 && <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>}
              <button className="bk-pag-btn bk-pag-arrow" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}><MdChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </SPLayout>
  );
}
