import { useEffect, useState } from "react";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdSearch,
  MdDelete, MdChevronLeft, MdChevronRight, MdDownload,
} from "react-icons/md";
import DashboardLayout from "../../components/backend/DashboardLayout";
import { useOpenSidebar } from "../../components/backend/DashboardLayout";

const PER_PAGE_OPTS = [10, 25, 50];
const SORT_OPTS     = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name",   label: "Name A–Z" },
];

function Avatar({ name }) {
  const colors  = ["#e84949","#2563eb","#16a34a","#d97706","#7c3aed","#0891b2"];
  const bg      = colors[(name?.charCodeAt(0) || 0) % colors.length];
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UsersPage() {
  const openSidebar = useOpenSidebar();

  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("newest");
  const [perPage, setPerPage] = useState(10);
  const [page,    setPage]    = useState(1);

  function load() {
    fetch("/api/dashboard/users")
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : []))
      .catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function deleteUser(id, name) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    await fetch(`/api/dashboard/users/${id}`, { method: "DELETE" }).catch(() => {});
  }

  function exportCSV() {
    const rows = [["#","Name","Email","Joined"], ...filtered.map((u, i) => [i + 1, u.name, u.email, fmt(u.createdAt)])];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `users-${Date.now()}.csv` });
    a.click();
  }

  const filtered = users
    .filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return (a.name || "").localeCompare(b.name || "");
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged      = filtered.slice((page - 1) * perPage, page * perPage);

  function goPage(n) { setPage(Math.min(Math.max(1, n), totalPages)); }

  const thisMonth = users.filter(u => {
    const d = new Date(u.createdAt), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <>
      <Head><title>Users — TourWatchOut</title></Head>

      {/* Header */}
      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
          <h1 className="bk-page-title">Users</h1>
        </div>
        <div className="bk-header-right">
          <div className="bk-team-pill"><span>Admin</span><MdKeyboardArrowDown size={16} /></div>
          <button className="bk-avatar-btn">
            <MdPeople size={18} color="#2563eb" />
            <span className="bk-avatar-badge">{users.length}</span>
          </button>
        </div>
      </header>

      <div className="bk-content">

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div className="bk-stat-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdPeople size={22} color="#e84949" />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{users.length}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Total Users</div>
            </div>
          </div>
          <div className="bk-stat-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdPeople size={22} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{thisMonth}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>New This Month</div>
            </div>
          </div>
        </div>

        {/* Top bar — search + filters in one row */}
        <div className="bk-topbar">
          <div className="bk-search-wrap">
            <MdSearch size={18} className="bk-search-icon" />
            <input
              className="bk-search-input"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Sort */}
            <select
              className="bk-pag-size"
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e5e5e5", fontSize: 13, background: "#fff", cursor: "pointer" }}
            >
              {SORT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Export CSV */}
            <button className="bk-add-btn" onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MdDownload size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bk-table-card">
          <div className="bk-table-wrap">
            <table className="bk-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                      {search ? "No users match your search." : "No users registered yet."}
                    </td>
                  </tr>
                ) : paged.map((u, i) => (
                  <tr key={u.id}>
                    <td>{(page - 1) * perPage + i + 1}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={u.name} />
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{fmt(u.createdAt)}</td>
                    <td>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#f0fdf4", color: "#16a34a" }}>
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="bk-action-btns">
                        <button className="bk-del-btn" onClick={() => deleteUser(u.id, u.name)} title="Delete user">
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
              <span className="bk-pag-label">of {filtered.length} users</span>
            </div>
            <div className="bk-pagination-right">
              <button className="bk-pag-btn bk-pag-arrow" onClick={() => goPage(page - 1)} disabled={page === 1}>
                <MdChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} className={`bk-pag-btn ${page === n ? "active" : ""}`} onClick={() => goPage(n)}>{n}</button>
              ))}
              {totalPages > 5 && <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>}
              <button className="bk-pag-btn bk-pag-arrow" onClick={() => goPage(page + 1)} disabled={page >= totalPages}>
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

UsersPage.getLayout = (page) => (
  <DashboardLayout active="Users">{page}</DashboardLayout>
);
