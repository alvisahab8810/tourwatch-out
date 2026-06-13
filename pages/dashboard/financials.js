import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";
import InvoiceBuilder from "../../components/backend/InvoiceBuilder";

const inr = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");

function calcInv(inv) {
  const sub  = (inv?.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst = sub  * (parseFloat(inv?.cgstPct) || 0) / 100;
  const sgst = sub  * (parseFloat(inv?.sgstPct) || 0) / 100;
  const igst = sub  * (parseFloat(inv?.igstPct) || 0) / 100;
  const gst  = cgst + sgst + igst;
  const after = sub + gst;
  const tcs  = after * (parseFloat(inv?.tcsPct) || 0) / 100;
  return { sub, gst, tcs, grand: after + tcs };
}

function gradeOf(mpct) {
  if (mpct > 30) return { g: "A Grade",  c: "#15803D", bg: "#DCFCE7" };
  if (mpct > 20) return { g: "B+ Grade", c: "#2563EB", bg: "#EFF4FF" };
  if (mpct >= 16) return { g: "B Grade", c: "#B45309", bg: "#FEF3C7" };
  return              { g: "C Grade",  c: "#BE123C", bg: "#FEE2E2" };
}

function fmtDate(v) {
  if (!v) return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}

export default function FinancialsPage() {
  const [vouchers,    setVouchers]    = useState([]);
  const [invoices,    setInvoices]    = useState([]);
  const [quotations,  setQuotations]  = useState([]);
  const [leads,       setLeads]       = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [search,      setSearch]      = useState("");
  const [spFilter,    setSpFilter]    = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [dateFrom,    setDateFrom]    = useState("");
  const [dateTo,      setDateTo]      = useState("");

  const [invViewer,   setInvViewer]   = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/vouchers").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/invoices").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/quotations").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/leads").then(r => r.json()).catch(() => []),
    ]).then(([v, inv, q, l]) => {
      setVouchers(Array.isArray(v) ? v : []);
      setInvoices(Array.isArray(inv) ? inv : []);
      setQuotations(Array.isArray(q) ? q : []);
      setLeads(Array.isArray(l) ? l : []);
    }).finally(() => setLoading(false));
  }, []);

  // Lookup maps
  const invMap   = useMemo(() => {
    const m = {};
    invoices.forEach(i => { m[i.id || i._id] = i; });
    return m;
  }, [invoices]);

  const quoteMap = useMemo(() => {
    const m = {};
    quotations.forEach(q => { m[String(q._id)] = q; });
    return m;
  }, [quotations]);

  const leadMap  = useMemo(() => {
    const m = {};
    leads.forEach(l => { m[String(l._id)] = l; });
    return m;
  }, [leads]);

  // Build rows
  const rows = useMemo(() => {
    const result = [];
    for (const v of vouchers) {
      if (!v.invoiceId) continue;
      const inv = invMap[v.invoiceId];
      if (!inv) continue;

      const ic = calcInv(inv);

      // Lead: from invoice.leadId or voucher fields
      const lead = leadMap[inv.leadId] || leadMap[v.leadId] || null;

      // Quotation: from invoice.quotationId, or find by leadId
      let quote = quoteMap[inv.quotationId] || null;
      if (!quote && inv.leadId) {
        quote = quotations.find(q => String(q.leadId?._id || q.leadId) === String(inv.leadId)) || null;
      }

      const cost        = +(quote?.cost        || 0);
      const margin      = +(quote?.margin      || 0);
      const tripExpense = +(quote?.tripExpense  || 0);
      const mpct        = cost > 0 ? (margin / cost) * 100 : 0;
      const netMargin   = margin - tripExpense;

      // Salesperson name
      const spName = quote?.assignedTo?.name || "—";

      // Travel date
      const travelDate = quote?.travelDate || v.travelDateFrom || lead?.brr?.tripDate || "";

      result.push({
        tripId:       v.tripId || "—",
        invoiceNo:    inv.invoiceNo || "—",
        name:         lead?.name || inv.clientName || v.name || "—",
        mobile:       lead?.phone || inv.contact || v.contactNo || "—",
        destination:  lead?.destination || inv.destination || v.destination || "—",
        travelDate,
        cost,
        selling:      ic.grand,
        gst:          ic.gst,
        tcs:          ic.tcs,
        margin,
        tripExpense,
        mpct,
        netMargin,
        spName,
        inv,
        lead,
      });
    }
    return result;
  }, [vouchers, invMap, quoteMap, leadMap, quotations]);

  // Filtered rows
  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (spFilter    && r.spName !== spFilter)       return false;
      if (gradeFilter && gradeOf(r.mpct).g !== gradeFilter) return false;
      if (dateFrom    && r.travelDate && r.travelDate < dateFrom) return false;
      if (dateTo      && r.travelDate && r.travelDate > dateTo)   return false;
      if (search) {
        const q = search.toLowerCase();
        if (![r.tripId, r.name, r.destination, r.invoiceNo].join(" ").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [rows, spFilter, gradeFilter, dateFrom, dateTo, search]);

  // Summary totals from filtered rows
  const sum = useMemo(() => ({
    trips:       filtered.length,
    selling:     filtered.reduce((s, r) => s + r.selling,     0),
    cost:        filtered.reduce((s, r) => s + r.cost,        0),
    margin:      filtered.reduce((s, r) => s + r.margin,      0),
    gst:         filtered.reduce((s, r) => s + r.gst,         0),
    tcs:         filtered.reduce((s, r) => s + r.tcs,         0),
    tripExpense: filtered.reduce((s, r) => s + r.tripExpense,  0),
    netMargin:   filtered.reduce((s, r) => s + r.netMargin,   0),
  }), [filtered]);

  // Unique salesperson names for filter
  const uniqueSP = useMemo(() => [...new Set(rows.map(r => r.spName).filter(x => x !== "—"))], [rows]);
  const GRADES   = ["A Grade", "B+ Grade", "B Grade", "C Grade"];

  function exportCSV() {
    const headers = ["Trip ID","Name","Mobile","Destination","Travel Date","Trip Expense","GST","TCS","Cost Price","Selling Price","Margin","Margin %","Grade","Invoice ID","Salesperson"];
    const dataRows = filtered.map(r => [
      r.tripId, r.name, r.mobile, r.destination, r.travelDate,
      Math.round(r.tripExpense), Math.round(r.gst), Math.round(r.tcs),
      Math.round(r.cost), Math.round(r.selling), Math.round(r.margin),
      r.mpct.toFixed(1) + "%", gradeOf(r.mpct).g, r.invoiceNo, r.spName,
    ]);
    const csv = [headers, ...dataRows]
      .map(row => row.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `financials-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout active="Financials">
      <Head><title>Financials — Tourwatchout</title></Head>
      <div style={{ padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" }}>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0F1B33" }}>Financials</div>
          <div style={{ fontSize: 13, color: "#6B7A99", marginTop: 2 }}>Trip wise profit and loss with every filter</div>
        </div>

        {/* Summary chips */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
          <SChip label="TRIPS"         value={sum.trips}              plain />
          <SChip label="SELLING VALUE" value={inr(sum.selling)}        color="#2563EB" />
          <SChip label="COST"          value={inr(sum.cost)}           color="#374151" />
          <SChip label="MARGIN"        value={inr(sum.margin)}         color="#15803D" />
          <SChip label="GST"           value={inr(sum.gst)}            color="#374151" />
          <SChip label="TCS"           value={inr(sum.tcs)}            color="#374151" />
          <SChip label="TRIP EXPENSES" value={inr(sum.tripExpense)}    color="#BE123C" />
          <SChip label="NET MARGIN"    value={inr(sum.netMargin)}      color={sum.netMargin >= 0 ? "#15803D" : "#BE123C"} />
        </div>

        {/* Filters */}
        <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <input
            style={F.inp}
            placeholder="Search trip, name, destination"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select style={F.sel} value={spFilter} onChange={e => setSpFilter(e.target.value)}>
            <option value="">All salespeople</option>
            {uniqueSP.map(sp => <option key={sp}>{sp}</option>)}
          </select>
          <select style={F.sel} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
            <option value="">All grades</option>
            {GRADES.map(g => <option key={g}>{g}</option>)}
          </select>
          <input type="date" style={F.date} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <input type="date" style={F.date} value={dateTo}   onChange={e => setDateTo(e.target.value)} />
          <button style={F.exp} onClick={exportCSV}>↓ Export</button>
        </div>

        {/* Table */}
        <div style={S.card}>
          <div style={{ overflowX: "auto" }} className="fin-wrap">
            <style>{`.fin-wrap::-webkit-scrollbar{height:5px}.fin-wrap::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}.fin-tbl tr:hover td{background:#F8FAFF!important}`}</style>
            <table style={S.tbl} className="fin-tbl">
              <thead>
                <tr style={{ background: "#F6F8FC" }}>
                  {["TRIP ID","NAME","MOBILE","TRIP EXPENSE","GST","TCS","COST PRICE","SELLING PRICE","MARGIN","MARGIN %","GRADE","INVOICE ID","SALESPERSON"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={13} style={S.empty}>Loading…</td></tr>}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={13} style={S.empty}>
                    No financial records found — create vouchers linked to invoices to see data here
                  </td></tr>
                )}
                {filtered.map((r, idx) => {
                  const g = gradeOf(r.mpct);
                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9", background: idx % 2 === 0 ? "#fff" : "#FAFBFD" }}>

                      {/* Trip ID */}
                      <td style={S.td}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#2563EB", background: "#EFF4FF", padding: "3px 8px", borderRadius: 6 }}>
                          {r.tripId}
                        </span>
                      </td>

                      {/* Name + Destination */}
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, color: "#0F1B33", fontSize: 13 }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{r.destination}</div>
                      </td>

                      {/* Mobile */}
                      <td style={S.td}>
                        <a href={`tel:${r.mobile}`} style={{ color: "#374151", fontSize: 12, textDecoration: "none" }}>
                          {r.mobile !== "—" ? "+91 " + r.mobile.replace(/^\+?91/, "").trim() : "—"}
                        </a>
                      </td>

                      {/* Trip Expense */}
                      <td style={{ ...S.td, textAlign: "right" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: r.tripExpense ? "#BE123C" : "#CBD5E1" }}>
                          {r.tripExpense ? inr(r.tripExpense) : "—"}
                        </span>
                      </td>

                      {/* GST */}
                      <td style={{ ...S.td, textAlign: "right" }}>
                        <span style={{ fontSize: 13 }}>{inr(r.gst)}</span>
                      </td>

                      {/* TCS */}
                      <td style={{ ...S.td, textAlign: "right" }}>
                        <span style={{ fontSize: 13 }}>{r.tcs ? inr(r.tcs) : "₹0"}</span>
                      </td>

                      {/* Cost Price */}
                      <td style={{ ...S.td, textAlign: "right" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                          {r.cost ? inr(r.cost) : "—"}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td style={{ ...S.td, textAlign: "right" }}>
                        <b style={{ fontSize: 13, color: "#2563EB" }}>{inr(r.selling)}</b>
                      </td>

                      {/* Margin */}
                      <td style={{ ...S.td, textAlign: "right" }}>
                        <b style={{ fontSize: 13, color: "#15803D" }}>{r.margin ? inr(r.margin) : "—"}</b>
                      </td>

                      {/* Margin % */}
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: r.cost > 0 ? g.c : "#CBD5E1" }}>
                          {r.cost > 0 ? r.mpct.toFixed(1) + "%" : "—"}
                        </span>
                      </td>

                      {/* Grade */}
                      <td style={{ ...S.td, textAlign: "center" }}>
                        {r.cost ? (
                          <span style={{ background: g.bg, color: g.c, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>
                            {g.g}
                          </span>
                        ) : <span style={{ color: "#CBD5E1" }}>—</span>}
                      </td>

                      {/* Invoice ID — clickable */}
                      <td style={S.td}>
                        <button
                          style={S.invBtn}
                          onClick={() => setInvViewer({ inv: r.inv, lead: r.lead })}
                        >
                          {r.invoiceNo}
                        </button>
                      </td>

                      {/* Salesperson */}
                      <td style={S.td}>
                        <span style={{ fontSize: 13 }}>{r.spName}</span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Invoice PDF viewer */}
      {invViewer && (
        <InvoiceBuilder
          invoiceData={invViewer.inv}
          isNew={false}
          prefill={{ lead: invViewer.lead }}
          onClose={() => setInvViewer(null)}
          onSaved={() => setInvViewer(null)}
        />
      )}
    </DashboardLayout>
  );
}

function SChip({ label, value, color, plain }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 12, padding: "12px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.04)", minWidth: 100 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: plain ? "#0F1B33" : (color || "#0F1B33") }}>{value}</div>
    </div>
  );
}

const F = {
  inp:  { padding: "7px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 13, outline: "none", color: "#374151", fontFamily: "inherit", background: "#F8FAFD", width: 170, flexShrink: 0 },
  sel:  { padding: "7px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 13, outline: "none", color: "#374151", fontFamily: "inherit", background: "#fff",    width: 148, flexShrink: 0, cursor: "pointer" },
  date: { padding: "7px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 13, outline: "none", color: "#374151", fontFamily: "inherit", background: "#fff",    width: 142, flexShrink: 0, colorScheme: "light" },
  exp:  { marginLeft: "auto", flexShrink: 0, padding: "7px 16px", background: "#fff", color: "#0F1B33", border: "1.5px solid #CBD5E1", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
};

const S = {
  search:    { padding: "8px 14px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, outline: "none", color: "#0F1B33", width: 200, flexShrink: 0, fontFamily: "inherit", background: "#fff" },
  sel:       { padding: "8px 12px", border: "1px solid #E4E9F2", borderRadius: 10, fontSize: 13, outline: "none", color: "#0F1B33", fontFamily: "inherit", background: "#fff", cursor: "pointer", flexShrink: 0 },
  fsel:      { padding: "7px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 13, outline: "none", color: "#374151", fontFamily: "inherit", background: "#fff", cursor: "pointer", flexShrink: 0, width: "auto", minWidth: 0 },
  exportBtn: { padding: "8px 18px", background: "#0F1B33", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  card:      { background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(15,27,51,.07)", overflow: "hidden" },
  tbl:       { width: "100%", borderCollapse: "collapse", fontSize: ".84rem", minWidth: 1150 },
  th:        { background: "#F6F8FC", color: "#6B7A99", fontSize: ".69rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E4E9F2", whiteSpace: "nowrap" },
  td:        { padding: "10px 12px", verticalAlign: "middle", color: "#36415A", whiteSpace: "nowrap" },
  empty:     { padding: 44, textAlign: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600 },
  invBtn:    { background: "#EFF4FF", color: "#2563EB", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" },
};
