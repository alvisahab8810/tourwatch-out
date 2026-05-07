import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdSearch, MdAdd, MdEdit, MdDelete,
  MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

const PER_PAGE_OPTS = [10, 20, 50];

function calcGrand(inv) {
  const items = inv.items || [];
  const sub   = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst  = inv.cgstPct ? (sub * parseFloat(inv.cgstPct)) / 100 : 0;
  const sgst  = inv.sgstPct ? (sub * parseFloat(inv.sgstPct)) / 100 : 0;
  const igst  = inv.igstPct ? (sub * parseFloat(inv.igstPct)) / 100 : 0;
  const after = sub + cgst + sgst + igst;
  const tcs   = inv.tcsPct ? (after * parseFloat(inv.tcsPct)) / 100 : 0;
  return after + tcs;
}

async function migrateLocalStorage() {
  try {
    const raw = localStorage.getItem("tw_invoices");
    if (!raw) return;
    localStorage.removeItem("tw_invoices"); // clear immediately to prevent repeat runs
    const local = JSON.parse(raw);
    if (!Array.isArray(local) || local.length === 0) return;

    // Only migrate entries that don't already exist in DB (match by invoiceNo)
    const dbRes = await fetch("/api/dashboard/invoices");
    const dbInvoices = dbRes.ok ? await dbRes.json() : [];
    const dbNos = new Set(dbInvoices.map(i => i.invoiceNo).filter(Boolean));

    const toMigrate = local.filter(i => !i.invoiceNo || !dbNos.has(i.invoiceNo));
    await Promise.all(toMigrate.map(inv =>
      fetch("/api/dashboard/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inv),
      })
    ));
  } catch {}
}

export default function InvoiceList() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch]     = useState("");
  const openSidebar = useOpenSidebar();
  const [perPage, setPerPage]   = useState(10);
  const [page, setPage]         = useState(1);

  useEffect(() => {
    migrateLocalStorage().then(() => {
      fetch("/api/dashboard/invoices")
        .then(r => r.json())
        .then(data => setInvoices(Array.isArray(data) ? data : []))
        .catch(() => {});
    });
  }, []);

  async function deleteInv(id) {
    if (!confirm("Delete this invoice?")) return;
    const snapshot = invoices;
    setInvoices(prev => prev.filter(i => i.id !== id));
    try {
      const r = await fetch(`/api/dashboard/invoices/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Delete failed");
    } catch {
      setInvoices(snapshot); // revert on failure
      alert("Failed to delete invoice. Please try again.");
    }
  }

  const filtered = invoices.filter(inv => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (inv.invoiceNo   || "").toLowerCase().includes(q) ||
      (inv.clientName  || "").toLowerCase().includes(q) ||
      (inv.destination || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged      = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Head><title>All Invoices — TourWatchOut</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
          <h1 className="bk-page-title">All Invoices</h1>
        </div>
      </header>

      <div className="bk-content">
            {/* Top bar */}
            <div className="bk-topbar">
              <div className="bk-search-wrap">
                <MdSearch size={18} className="bk-search-icon" />
                <input
                  className="bk-search-input"
                  placeholder="Search by invoice no, client or destination…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <button
                className="bk-add-btn"
                onClick={() => router.push("/dashboard/create-invoice")}
              >
                <MdAdd size={18} /> Add Invoice
              </button>
            </div>

            {/* Table */}
            <div className="bk-table-card">
              <div className="bk-table-wrap">
                <table className="bk-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Invoice No.</th>
                      <th>Date</th>
                      <th>Client Name</th>
                      <th>Destination</th>
                      <th>Payment Mode</th>
                      <th>Grand Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>
                          No invoices found
                        </td>
                      </tr>
                    ) : paged.map((inv, i) => (
                      <tr key={inv.id}>
                        <td>{(page - 1) * perPage + i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{inv.invoiceNo || "—"}</td>
                        <td>{inv.invoiceDate || "—"}</td>
                        <td style={{ fontWeight: 500 }}>{inv.clientName || "—"}</td>
                        <td>{inv.destination || "—"}</td>
                        <td>{inv.paymentMode || "—"}</td>
                        <td style={{ fontWeight: 600 }}>
                          ₹{calcGrand(inv).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <div className="bk-action-btns">
                            <button
                              className="bk-edit-btn"
                              onClick={() => router.push(`/dashboard/create-invoice?id=${inv.id}`)}
                            >
                              <MdEdit size={15} />
                            </button>
                            <button className="bk-del-btn" onClick={() => deleteInv(inv.id)}>
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
    </>
  );
}

InvoiceList.getLayout = (page) => (
  <DashboardLayout active="Invoice">{page}</DashboardLayout>
);
