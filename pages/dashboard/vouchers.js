import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdSearch, MdAdd, MdEdit, MdDelete,
  MdChevronLeft, MdChevronRight, MdVisibility,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

const PER_PAGE_OPTS = [10, 20, 50];

export default function VoucherList() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const openSidebar = useOpenSidebar();
  const [perPage, setPerPage]   = useState(10);
  const [page, setPage]         = useState(1);

  useEffect(() => {
    fetch("/api/dashboard/vouchers")
      .then(r => r.json())
      .then(data => { setVouchers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function deleteVoucher(id) {
    if (!confirm("Delete this voucher?")) return;
    const snapshot = vouchers;
    setVouchers(prev => prev.filter(v => v.id !== id));
    try {
      const r = await fetch(`/api/dashboard/vouchers/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
    } catch {
      setVouchers(snapshot);
      alert("Failed to delete. Please try again.");
    }
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
      <Head><title>All Vouchers — Tourwatchout</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
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
              <button className="bk-add-btn" onClick={() => router.push("/dashboard/create-voucher")}>
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
                    {loading ? (
                      <tr><td colSpan={8} style={{ textAlign:"center", padding:"32px", color:"#9ca3af" }}>Loading…</td></tr>
                    ) : paged.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign:"center", padding:"32px", color:"#9ca3af" }}>No vouchers found</td></tr>
                    ) : paged.map((v, i) => (
                      <tr key={v.id}>
                        <td>{(page - 1) * perPage + i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{v.voucherNo || "—"}</td>
                        <td style={{ fontWeight: 500 }}>{v.tripId || "—"}</td>
                        <td style={{ fontWeight: 500 }}>{v.name || "—"}</td>
                        <td>{v.destination || "—"}</td>
                        <td>{v.travelDate || v.travelDateFrom || "—"}</td>
                        <td>{v.pax || "—"}</td>
                        <td>
                          <div className="bk-action-btns">
                            <button
                              className="bk-view-btn"
                              title="Preview voucher"
                              onClick={() => router.push(`/dashboard/create-voucher?id=${v.id}&preview=1`)}
                            >
                              <MdVisibility size={15} />
                            </button>
                            <button
                              className="bk-edit-btn"
                              title="Edit"
                              onClick={() => router.push(`/dashboard/create-voucher?id=${v.id}`)}
                            >
                              <MdEdit size={15} />
                            </button>
                            <button className="bk-del-btn" title="Delete" onClick={() => deleteVoucher(v.id)}>
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
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                    <button key={n} className={`bk-pag-btn ${page === n ? "active" : ""}`}
                      onClick={() => setPage(n)}>{n}</button>
                  ))}
                  {totalPages > 5 && <span style={{ padding:"0 4px", color:"#9ca3af" }}>…</span>}
                  <button className="bk-pag-btn bk-pag-arrow"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                    <MdChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
      </div>
    </>
  );
}

VoucherList.getLayout = (page) => (
  <DashboardLayout active="Voucher">{page}</DashboardLayout>
);
