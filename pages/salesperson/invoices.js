import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdSearch, MdAdd, MdEdit, MdDelete,
  MdChevronLeft, MdChevronRight, MdVisibility,
} from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";
const PER_PAGE_OPTS = [10, 20, 50];

function calcGrand(inv) {
  const items = inv.items || [];
  const sub  = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst = inv.cgstPct ? (sub * parseFloat(inv.cgstPct)) / 100 : 0;
  const sgst = inv.sgstPct ? (sub * parseFloat(inv.sgstPct)) / 100 : 0;
  const igst = inv.igstPct ? (sub * parseFloat(inv.igstPct)) / 100 : 0;
  const after = sub + cgst + sgst + igst;
  const tcs  = inv.tcsPct ? (after * parseFloat(inv.tcsPct)) / 100 : 0;
  return after + tcs;
}

export default function SPInvoices() {
  const router = useRouter();
  const [spData,    setSpData]    = useState(null);
  const [invoices,  setInvoices]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [perPage,   setPerPage]   = useState(10);
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
    fetch("/api/dashboard/invoices")
      .then(r => r.json())
      .then(d => setInvoices(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [spData]);

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

  async function deleteInv(id) {
    if (!confirm("Delete this invoice?")) return;
    const snap = invoices;
    setInvoices(p => p.filter(i => i.id !== id));
    const r = await fetch(`/api/dashboard/invoices/${id}`, { method: "DELETE" });
    if (!r.ok) { setInvoices(snap); alert("Delete failed."); }
  }

  const filtered = invoices.filter(inv => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (inv.invoiceNo || "").toLowerCase().includes(q) ||
           (inv.clientName || "").toLowerCase().includes(q) ||
           (inv.destination || "").toLowerCase().includes(q);
  });
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  if (!spData) return null;

  return (
    <SPLayout active="Invoice" spData={spData} onLogout={handleLogout}>
      <Head><title>Invoices — Tourwatchout</title></Head>

      <div style={{ padding: "28px 24px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>All Invoices</h1>
        </div>

        <div className="bk-topbar">
          <div className="bk-search-wrap">
            <MdSearch size={18} className="bk-search-icon" />
            <input className="bk-search-input" placeholder="Search by invoice no, client or destination…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <button className="bk-add-btn" onClick={() => router.push("/dashboard/create-invoice")}>
            <MdAdd size={18} /> Add Invoice
          </button>
        </div>

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
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No invoices found</td></tr>
                ) : paged.map((inv, i) => (
                  <tr key={inv.id}>
                    <td>{(page - 1) * perPage + i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{inv.invoiceNo || "—"}</td>
                    <td>{inv.invoiceDate || "—"}</td>
                    <td style={{ fontWeight: 500 }}>{inv.clientName || "—"}</td>
                    <td>{inv.destination || "—"}</td>
                    <td>{inv.paymentMode || "—"}</td>
                    <td style={{ fontWeight: 600 }}>₹{calcGrand(inv).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td>
                      <div className="bk-action-btns">
                        <button className="bk-view-btn" title="Preview" onClick={() => router.push(`/dashboard/create-invoice?id=${inv.id}&preview=1`)}><MdVisibility size={15} /></button>
                        <button className="bk-edit-btn" title="Edit" onClick={() => router.push(`/dashboard/create-invoice?id=${inv.id}`)}><MdEdit size={15} /></button>
                        <button className="bk-del-btn" title="Delete" onClick={() => deleteInv(inv.id)}><MdDelete size={15} /></button>
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
              <span className="bk-pag-label">per page</span>
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
