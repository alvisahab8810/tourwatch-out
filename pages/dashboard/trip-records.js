import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";
import InvoiceBuilder from "../../components/backend/InvoiceBuilder";
import QuotationPreview from "../../components/voucher/QuotationPreview";

/* ── helpers ── */
const inr = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");

function calcInv(inv) {
  const sub  = (inv?.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst = sub * (parseFloat(inv?.cgstPct) || 0) / 100;
  const sgst = sub * (parseFloat(inv?.sgstPct) || 0) / 100;
  const igst = sub * (parseFloat(inv?.igstPct) || 0) / 100;
  const gst  = cgst + sgst + igst;
  const after = sub + gst;
  const tcs  = after * (parseFloat(inv?.tcsPct) || 0) / 100;
  return { grand: after + tcs };
}

function journeyStr(travelDate, daysStr) {
  if (!travelDate) return "—";
  try {
    const nm = (daysStr || "").match(/(\d+)[Nn]/);
    const nights = nm ? parseInt(nm[1]) : 0;
    const start = new Date(travelDate + "T00:00:00");
    const end   = new Date(start);
    end.setDate(end.getDate() + nights);
    const f = d => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    return nights ? `${f(start)} → ${f(end)}` : f(start);
  } catch { return travelDate; }
}

function tripId(quotationNo) {
  return (quotationNo || "").replace("TWO-Q-", "TWO-TRIP-");
}

export default function TripRecordsPage() {
  const [quotations, setQuotations] = useState([]);
  const [invoices,   setInvoices]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  const [search,   setSearch]   = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");

  const [invViewer,   setInvViewer]   = useState(null);
  const [quoteViewer, setQuoteViewer] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/quotations").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/invoices").then(r => r.json()).catch(() => []),
    ]).then(([q, inv]) => {
      setQuotations(Array.isArray(q) ? q : []);
      setInvoices(Array.isArray(inv) ? inv : []);
    }).finally(() => setLoading(false));
  }, []);

  /* invoice keyed by quotationId */
  const invByQ = useMemo(() => {
    const m = {};
    invoices.forEach(inv => { if (inv.quotationId) m[inv.quotationId] = inv; });
    return m;
  }, [invoices]);

  /* build rows from Won quotations */
  const rows = useMemo(() => {
    return quotations
      .filter(q => q.status === "Won")
      .map(q => {
        const lead = q.leadId || {};
        const inv  = invByQ[String(q._id)] || null;
        const paidTotal = (inv?.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
        const selling   = q.newSellingPrice > 0 ? q.newSellingPrice : (q.cost + q.margin);
        const hotelNames = (q.hotels || []).map(h => h.name).filter(Boolean).join(" + ") || "—";
        const meal = lead.brr?.mealPlan || "—";
        const tid  = tripId(q.quotationNo);

        return {
          tid,
          guest:       lead.name        || "—",
          phone:       lead.phone       || "",
          email:       lead.email       || "",
          destination: lead.destination || "—",
          type:        q.type           || "Domestic",
          days:        q.days           || "—",
          journey:     journeyStr(q.travelDate, q.days),
          pax:         lead.pax         || "—",
          hotel:       hotelNames,
          meal,
          selling,
          paid:        paidTotal,
          leadDisplayId: inv?.leadDisplayId || "",
          quotationNo:   q.quotationNo || "",
          invoiceNo:     inv?.invoiceNo || "",
          salesperson:   q.assignedTo?.name || "—",
          /* full objects for PDF preview */
          _q:  q,
          _inv: inv,
          _lead: lead,
        };
      });
  }, [quotations, invByQ]);

  /* filtered rows */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(r => {
      if (q && ![r.tid, r.guest, r.destination, r.quotationNo, r.invoiceNo].some(v => v.toLowerCase().includes(q))) return false;
      if (dateFrom && r._q.travelDate && r._q.travelDate < dateFrom) return false;
      if (dateTo   && r._q.travelDate && r._q.travelDate > dateTo)   return false;
      return true;
    });
  }, [rows, search, dateFrom, dateTo]);

  function openQuote(r) {
    const q = r._q;
    setQuoteViewer({
      quoteId:   q.quotationNo,
      lead:      r._lead,
      form:      q,
      hotels:    q.hotels    || [],
      flights:   q.flights   || [],
      transfers: q.transfers || [],
      itin:      q.itinerary || [],
      selling:   r.selling,
    });
  }

  function openInvoice(r) {
    if (!r._inv) return;
    setInvViewer({ inv: r._inv, lead: r._lead });
  }

  return (
    <DashboardLayout active="Trip Records">
      <Head><title>Trip Records — Tourwatchout</title></Head>

      {/* ── Quotation PDF modal ── */}
      {quoteViewer && (
        <div style={MO.overlay} onClick={() => setQuoteViewer(null)}>
          <div style={{ ...MO.box, width: 880 }} onClick={e => e.stopPropagation()}>
            <div style={MO.hdr}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Quotation Preview</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={MO.printBtn} onClick={() => window.print()}>🖨 Print / PDF</button>
                <button style={MO.closeBtn} onClick={() => setQuoteViewer(null)}>✕</button>
              </div>
            </div>
            <div style={{ overflowY: "auto", maxHeight: "calc(90vh - 56px)" }}>
              <QuotationPreview id="tr-quote-pdf" data={quoteViewer} />
            </div>
          </div>
        </div>
      )}

      {/* ── Invoice PDF modal ── */}
      {invViewer && (
        <InvoiceBuilder
          invoiceData={invViewer.inv}
          isNew={false}
          prefill={{ lead: invViewer.lead }}
          onClose={() => setInvViewer(null)}
          onSaved={() => setInvViewer(null)}
        />
      )}

      <div style={{ padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" }}>

        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0F1B33" }}>Trip Records</div>
          <div style={{ fontSize: 13, color: "#6B7A99", marginTop: 2 }}>The complete record of every trip sold</div>
        </div>

        {/* Filter bar */}
        <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 12, padding: "11px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <input
            placeholder="Search any trip…"
            style={F.inp}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <input type="date" style={F.date} value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="Journey from" />
          <input type="date" style={F.date} value={dateTo}   onChange={e => setDateTo(e.target.value)}   title="Journey to" />
          {(search || dateFrom || dateTo) && (
            <button style={F.clear} onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}>Clear</button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#6B7A99", whiteSpace: "nowrap" }}>
            {filtered.length} trip{filtered.length !== 1 ? "s" : ""} on record
          </span>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.04)" }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Loading trip records…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>No won trips found</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFD" }}>
                    {["TRIP ID","GUEST","CONTACT","DESTINATION","TYPE","DAYS","JOURNEY","PAX","HOTEL","MEAL","SELLING","PAID","LEAD → QUOTE → INVOICE","SALESPERSON"].map(col => (
                      <th key={col} style={TH}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.tid + i} style={{ borderTop: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFBFE" }}>
                      {/* TRIP ID */}
                      <td style={{ ...TD, fontWeight: 700, color: "#2563EB", whiteSpace: "nowrap" }}>{r.tid}</td>
                      {/* GUEST */}
                      <td style={{ ...TD, fontWeight: 600, color: "#0F1B33", whiteSpace: "nowrap" }}>{r.guest}</td>
                      {/* CONTACT */}
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 500 }}>{r.phone}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{r.email}</div>
                      </td>
                      {/* DESTINATION */}
                      <td style={{ ...TD, color: "#374151" }}>{r.destination}</td>
                      {/* TYPE */}
                      <td style={TD}>
                        <span style={{
                          padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                          background: r.type === "International" ? "#EFF4FF" : "#F0FDF4",
                          color:      r.type === "International" ? "#2563EB"  : "#15803D",
                        }}>{r.type}</span>
                      </td>
                      {/* DAYS */}
                      <td style={{ ...TD, whiteSpace: "nowrap", color: "#374151" }}>{r.days}</td>
                      {/* JOURNEY */}
                      <td style={{ ...TD, whiteSpace: "nowrap", color: "#374151", minWidth: 180 }}>{r.journey}</td>
                      {/* PAX */}
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{r.pax}</td>
                      {/* HOTEL */}
                      <td style={{ ...TD, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#374151" }} title={r.hotel}>{r.hotel}</td>
                      {/* MEAL */}
                      <td style={{ ...TD, whiteSpace: "nowrap", fontWeight: 600 }}>{r.meal}</td>
                      {/* SELLING */}
                      <td style={{ ...TD, fontWeight: 700, color: "#0F1B33", whiteSpace: "nowrap" }}>{inr(r.selling)}</td>
                      {/* PAID */}
                      <td style={{ ...TD, fontWeight: 700, color: r.paid > 0 ? "#15803D" : "#94A3B8", whiteSpace: "nowrap" }}>
                        {r.paid > 0 ? inr(r.paid) : "—"}
                      </td>
                      {/* LEAD → QUOTE → INVOICE */}
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {r.leadDisplayId ? (
                            <span style={LINK.lead}>{r.leadDisplayId}</span>
                          ) : (
                            <span style={{ color: "#94A3B8", fontSize: 11 }}>—</span>
                          )}
                          {r.quotationNo && (
                            <>
                              <span style={LINK.arrow}>→</span>
                              <button style={LINK.btn} onClick={() => openQuote(r)}>{r.quotationNo}</button>
                            </>
                          )}
                          {r.invoiceNo && (
                            <>
                              <span style={LINK.arrow}>→</span>
                              <button style={LINK.btn} onClick={() => openInvoice(r)}>{r.invoiceNo}</button>
                            </>
                          )}
                        </div>
                      </td>
                      {/* SALESPERSON */}
                      <td style={{ ...TD, whiteSpace: "nowrap", color: "#374151" }}>{r.salesperson}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ── styles ── */
const TH = {
  padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 800,
  color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".06em",
  whiteSpace: "nowrap", borderBottom: "1.5px solid #E4E9F2",
};
const TD = { padding: "11px 14px", verticalAlign: "middle", fontSize: 13, color: "#374151" };

const F = {
  inp:   { flex: 1, minWidth: 180, padding: "7px 12px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", color: "#374151", background: "#F8FAFD" },
  date:  { padding: "6px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 12, outline: "none", color: "#374151", fontFamily: "inherit", background: "#F8FAFD", width: 128, colorScheme: "light" },
  clear: { padding: "6px 12px", background: "#FEF2F2", color: "#BE123C", border: "1px solid #FECACA", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" },
};

const LINK = {
  lead:  { fontSize: 12, color: "#374151", fontWeight: 600 },
  arrow: { fontSize: 11, color: "#94A3B8", padding: "0 1px" },
  btn:   { background: "none", border: "none", color: "#2563EB", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline", textUnderlineOffset: 2, fontFamily: "inherit" },
};

const MO = {
  overlay:  { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  box:      { background: "#fff", borderRadius: 14, width: 900, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.25)" },
  hdr:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #E4E9F2", flexShrink: 0 },
  printBtn: { padding: "6px 14px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" },
  closeBtn: { padding: "6px 12px", background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" },
};

