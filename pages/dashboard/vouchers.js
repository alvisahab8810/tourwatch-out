import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdSearch, MdAdd, MdEdit, MdDelete,
  MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import { isAuthenticated } from "../../utils/voucherAuth";
import Sidebar from "../../components/backend/Sidebar";

const PER_PAGE_OPTS = [10, 20, 50];

export default function VoucherList() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [search, setSearch]     = useState("");
  const [sidebar, setSidebar]   = useState(false);
  const [perPage, setPerPage]   = useState(10);
  const [page, setPage]         = useState(1);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/dashboard/login"); return; }
    setVouchers(JSON.parse(localStorage.getItem("tw_vouchers") || "[]"));
  }, []);

  function deleteVoucher(id) {
    if (!confirm("Delete this voucher?")) return;
    const updated = vouchers.filter(v => v.id !== id);
    localStorage.setItem("tw_vouchers", JSON.stringify(updated));
    setVouchers(updated);
  }

  const filtered = vouchers.filter(v => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (v.voucherNo    || "").toLowerCase().includes(q) ||
      (v.tripId       || "").toLowerCase().includes(q) ||
      (v.name         || "").toLowerCase().includes(q) ||
      (v.destination  || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged      = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Head>
        <title>All Vouchers — TourWatchOut</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>

      <div className="bk-page">
        <Sidebar active="Voucher" isOpen={sidebar} onClose={() => setSidebar(false)} />

        <main className="bk-main">
          <header className="bk-header">
            <div className="bk-header-left">
              <button className="bk-hamburger" onClick={() => setSidebar(true)}><MdMenu size={22} /></button>
              <h1 className="bk-page-title">All Vouchers</h1>
            </div>
          </header>

          <div className="bk-content">
            {/* Top bar */}
            <div className="bk-topbar">
              <div className="bk-search-wrap">
                <MdSearch size={18} className="bk-search-icon" />
                <input
                  className="bk-search-input"
                  placeholder="Search by voucher no, trip ID, guest or destination…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <button
                className="bk-add-btn"
                onClick={() => router.push("/dashboard/create-voucher")}
              >
                <MdAdd size={18} /> Add Voucher
              </button>
            </div>

            {/* Table */}
            <div className="bk-table-card">
              <div className="bk-table-wrap">
                <table className="bk-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Voucher No.</th>
                      <th>Trip ID</th>
                      <th>Guest Name</th>
                      <th>Destination</th>
                      <th>Travel Date</th>
                      <th>Pax</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>
                          No vouchers found
                        </td>
                      </tr>
                    ) : paged.map((v, i) => (
                      <tr key={v.id}>
                        <td>{(page - 1) * perPage + i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{v.voucherNo || "—"}</td>
                        <td style={{ fontWeight: 500 }}>{v.tripId || "—"}</td>
                        <td style={{ fontWeight: 500 }}>{v.name || "—"}</td>
                        <td>{v.destination || "—"}</td>
                        <td>{v.travelDate || "—"}</td>
                        <td>{v.pax || "—"}</td>
                        <td>
                          <div className="bk-action-btns">
                            <button
                              className="bk-edit-btn"
                              onClick={() => router.push(`/dashboard/create-voucher?id=${v.id}`)}
                            >
                              <MdEdit size={15} />
                            </button>
                            <button className="bk-del-btn" onClick={() => deleteVoucher(v.id)}>
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
                  <span className="bk-pag-label">Show</span>
                  <select
                    className="bk-pag-size"
                    value={perPage}
                    onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                  >
                    {PER_PAGE_OPTS.map(n => <option key={n}>{n}</option>)}
                  </select>
                  <span className="bk-pag-label">per page</span>
                </div>
                <div className="bk-pagination-right">
                  <button
                    className="bk-pag-btn bk-pag-arrow"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <MdChevronLeft size={18} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      className={`bk-pag-btn ${page === n ? "active" : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  {totalPages > 5 && <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>}
                  <button
                    className="bk-pag-btn bk-pag-arrow"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
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
