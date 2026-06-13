import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdSearch, MdDelete, MdChevronLeft, MdChevronRight, MdDownload,
} from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";
const PER_PAGE_OPTS = [10, 25, 50];
const SORT_OPTS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name",   label: "Name A–Z" },
];

const COLORS = ["#e84949","#2563eb","#16a34a","#d97706","#7c3aed","#0891b2"];
function Avatar({ name }) {
  const bg = COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
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

export default function SPUsers() {
  const router = useRouter();
  const [spData,  setSpData]  = useState(null);
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("newest");
  const [perPage, setPerPage] = useState(10);
  const [page,    setPage]    = useState(1);

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
    fetch("/api/dashboard/users")
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [spData]);

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

  async function deleteUser(id, name) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    await fetch(`/api/dashboard/users/${id}`, { method: "DELETE" }).catch(() => {});
  }

  let filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.phone || "").includes(q);
  });
  filtered = [...filtered].sort((a, b) => {
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    const at = new Date(a.createdAt).getTime(), bt = new Date(b.createdAt).getTime();
    return sort === "newest" ? bt - at : at - bt;
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  function exportCSV() {
    const rows = [["#","Name","Email","Joined"], ...filtered.map((u, i) => [i + 1, u.name, u.email, fmt(u.createdAt)])];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `users-${Date.now()}.csv` });
    a.click(); URL.revokeObjectURL(a.href);
  }

  if (!spData) return null;

  return (
    <SPLayout active="Users" spData={spData} onLogout={handleLogout}>
      <Head><title>Users — Tourwatchout</title></Head>

      <div style={{ padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Registered Users</h1>
          <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}>
            <MdDownload size={16} /> Export CSV
          </button>
        </div>

        <div className="bk-topbar">
          <div className="bk-search-wrap">
            <MdSearch size={18} className="bk-search-icon" />
            <input className="bk-search-input" placeholder="Search by name, email, or phone…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", background: "#fff", cursor: "pointer" }}
            value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="bk-table-card">
          <div className="bk-table-wrap">
            <table className="bk-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No users found</td></tr>
                ) : paged.map((u, i) => (
                  <tr key={u.id}>
                    <td>{(page - 1) * perPage + i + 1}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar name={u.name} />
                        <span style={{ fontWeight: 600 }}>{u.name || "—"}</span>
                      </div>
                    </td>
                    <td>{u.email || "—"}</td>
                    <td>{u.phone || "—"}</td>
                    <td>{fmt(u.createdAt)}</td>
                    <td>
                      <div className="bk-action-btns">
                        <button className="bk-del-btn" title="Delete" onClick={() => deleteUser(u.id, u.name)}><MdDelete size={15} /></button>
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
