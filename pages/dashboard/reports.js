import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

/* ── helpers ── */
const inr  = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");
const inrK = n => {
  if (!n) return "₹0";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (n >= 1000)   return "₹" + (n / 1000).toFixed(0)   + "k";
  return "₹" + Math.round(n);
};

function calcInv(inv) {
  const sub  = (inv?.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst = sub * (parseFloat(inv?.cgstPct) || 0) / 100;
  const sgst = sub * (parseFloat(inv?.sgstPct) || 0) / 100;
  const igst = sub * (parseFloat(inv?.igstPct) || 0) / 100;
  const gst  = cgst + sgst + igst;
  const after = sub + gst;
  const tcs  = after * (parseFloat(inv?.tcsPct) || 0) / 100;
  return { gst, tcs, grand: after + tcs };
}

function quoteGrade(q) {
  const cost = +q.cost || 0, margin = +q.margin || 0;
  if (cost <= 0) return null;
  const p = (margin / cost) * 100;
  if (p > 30) return "A";
  if (p > 20) return "B+";
  if (p >= 16) return "B";
  return "C";
}

function getMonths(from, to) {
  const out = [];
  const s = from ? new Date(from + "T00:00:00") : new Date(new Date().getFullYear() + "-01-01");
  const e = to   ? new Date(to   + "T23:59:59") : new Date();
  let d = new Date(s.getFullYear(), s.getMonth(), 1);
  while (d <= e) {
    out.push({
      year: d.getFullYear(), month: d.getMonth(),
      label: d.toLocaleString("default", { month: "short" }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
  return out;
}

function inMonth(dateStr, mo) {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.getFullYear() === mo.year && d.getMonth() === mo.month;
  } catch { return false; }
}

const todayISO      = () => new Date().toISOString().slice(0, 10);
const startYearISO  = () => new Date().getFullYear() + "-01-01";

export default function ReportsPage() {
  const [quotations, setQuotations] = useState([]);
  const [invoices,   setInvoices]   = useState([]);
  const [leads,      setLeads]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [mounted,    setMounted]    = useState(false);

  /* filter inputs */
  const [dateFrom,   setDateFrom]   = useState(startYearISO());
  const [dateTo,     setDateTo]     = useState(todayISO());
  const [spFilter,   setSpFilter]   = useState("");
  const [srcFilter,  setSrcFilter]  = useState("");
  const [destFilter, setDestFilter] = useState("");

  /* applied filters — only change on "Apply Filters" click */
  const [applied, setApplied] = useState({
    dateFrom: startYearISO(), dateTo: todayISO(),
    spFilter: "", srcFilter: "", destFilter: "",
  });

  useEffect(() => {
    setMounted(true);
    Promise.all([
      fetch("/api/dashboard/quotations").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/invoices").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/leads").then(r => r.json()).catch(() => []),
    ]).then(([q, inv, l]) => {
      setQuotations(Array.isArray(q) ? q : []);
      setInvoices(Array.isArray(inv) ? inv : []);
      setLeads(Array.isArray(l) ? l : []);
    }).finally(() => setLoading(false));
  }, []);

  const leadMap = useMemo(() => {
    const m = {};
    leads.forEach(l => { m[String(l._id)] = l; });
    return m;
  }, [leads]);

  /* dropdown options */
  const uniqueSP    = useMemo(() => [...new Set(quotations.map(q => q.assignedTo?.name).filter(Boolean))], [quotations]);
  const uniqueDests = useMemo(() => [...new Set(leads.map(l => l.destination).filter(Boolean))].sort(), [leads]);

  /* filtered quotations */
  const filteredQ = useMemo(() => quotations.filter(q => {
    const lead = leadMap[String(q.leadId?._id || q.leadId)];
    if (applied.spFilter   && q.assignedTo?.name    !== applied.spFilter)   return false;
    if (applied.srcFilter  && q.type                !== applied.srcFilter)  return false;
    if (applied.destFilter && (lead?.destination||"")!== applied.destFilter) return false;
    if (applied.dateFrom   && q.travelDate && q.travelDate < applied.dateFrom) return false;
    if (applied.dateTo     && q.travelDate && q.travelDate > applied.dateTo)   return false;
    return true;
  }), [quotations, applied, leadMap]);

  const wonQ  = useMemo(() => filteredQ.filter(q => q.status === "Won"),  [filteredQ]);
  const lostQ = useMemo(() => filteredQ.filter(q => q.status === "Lost"), [filteredQ]);

  /* invoices linked to won leads in filtered set */
  const wonLeadIds = useMemo(() => new Set(wonQ.map(q => String(q.leadId?._id || q.leadId))), [wonQ]);
  const wonInvoices = useMemo(() => invoices.filter(inv => {
    if (!wonLeadIds.has(String(inv.leadId))) return false;
    const d = inv.createdAt ? new Date(inv.createdAt).toISOString().slice(0, 10) : "";
    if (d && applied.dateFrom && d < applied.dateFrom) return false;
    if (d && applied.dateTo   && d > applied.dateTo)   return false;
    return true;
  }), [invoices, wonLeadIds, applied]);

  /* summary numbers */
  const totalRev   = useMemo(() => wonInvoices.reduce((s, i) => s + calcInv(i).grand, 0), [wonInvoices]);
  const gstColl    = useMemo(() => wonInvoices.reduce((s, i) => s + calcInv(i).gst,   0), [wonInvoices]);
  const tcsColl    = useMemo(() => wonInvoices.reduce((s, i) => s + calcInv(i).tcs,   0), [wonInvoices]);
  const winRate    = useMemo(() => {
    const t = wonQ.length + lostQ.length;
    return t > 0 ? Math.round((wonQ.length / t) * 100) : 0;
  }, [wonQ, lostQ]);
  const avgMargin  = useMemo(() => {
    const w = wonQ.filter(q => +q.cost > 0);
    return w.length ? w.reduce((s, q) => s + ((+q.margin / +q.cost) * 100), 0) / w.length : 0;
  }, [wonQ]);

  /* month axis */
  const months = useMemo(() => getMonths(applied.dateFrom, applied.dateTo), [applied]);

  /* chart data */
  const gradeMonthData = useMemo(() => months.map(mo => ({
    month: mo.label,
    A:    wonQ.filter(q => inMonth(q.travelDate, mo) && quoteGrade(q) === "A").length,
    "B+": wonQ.filter(q => inMonth(q.travelDate, mo) && quoteGrade(q) === "B+").length,
    B:    wonQ.filter(q => inMonth(q.travelDate, mo) && quoteGrade(q) === "B").length,
    C:    wonQ.filter(q => inMonth(q.travelDate, mo) && quoteGrade(q) === "C").length,
  })), [months, wonQ]);

  const wonLostData = useMemo(() => months.map(mo => ({
    month: mo.label,
    Won:  filteredQ.filter(q => inMonth(q.travelDate, mo) && q.status === "Won").length,
    Lost: filteredQ.filter(q => inMonth(q.travelDate, mo) && q.status === "Lost").length,
  })), [months, filteredQ]);

  const revTrendData = useMemo(() => months.map(mo => {
    const rev = wonInvoices
      .filter(inv => { const d = inv.createdAt ? new Date(inv.createdAt) : null; return d && d.getFullYear() === mo.year && d.getMonth() === mo.month; })
      .reduce((s, inv) => s + calcInv(inv).grand, 0);
    return { month: mo.label, revenue: Math.round(rev) };
  }), [months, wonInvoices]);

  const gradeDistData = useMemo(() => {
    const c = { A: 0, "B+": 0, B: 0, C: 0 };
    wonQ.forEach(q => { const g = quoteGrade(q); if (g) c[g]++; });
    return [
      { name: "A Grade",  value: c["A"],  color: "#22c55e" },
      { name: "B+ Grade", value: c["B+"], color: "#3b82f6" },
      { name: "B Grade",  value: c["B"],  color: "#f59e0b" },
      { name: "C Grade",  value: c["C"],  color: "#ef4444" },
    ].filter(d => d.value > 0);
  }, [wonQ]);

  function apply() {
    setApplied({ dateFrom, dateTo, spFilter, srcFilter, destFilter });
  }

  return (
    <DashboardLayout active="Reports">
      <Head><title>Reports — Tourwatchout</title></Head>
      <div style={{ padding: "22px 26px 60px", background: "#F3F5FA", minHeight: "100vh" }}>

        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0F1B33" }}>Reports</div>
          <div style={{ fontSize: 13, color: "#6B7A99", marginTop: 2 }}>Grades, win rate, revenue and margins over time</div>
        </div>

        {/* Filter bar */}
        <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".06em" }}>DATE RANGE</span>
            <input type="date" style={F.date} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" style={F.date} value={dateTo}   onChange={e => setDateTo(e.target.value)} />
          </div>
          <select style={F.sel} value={spFilter}   onChange={e => setSpFilter(e.target.value)}>
            <option value="">All salespeople</option>
            {uniqueSP.map(s => <option key={s}>{s}</option>)}
          </select>
          <select style={F.sel} value={srcFilter}  onChange={e => setSrcFilter(e.target.value)}>
            <option value="">All sources</option>
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
          </select>
          <select style={F.sel} value={destFilter} onChange={e => setDestFilter(e.target.value)}>
            <option value="">All destinations</option>
            {uniqueDests.map(d => <option key={d}>{d}</option>)}
          </select>
          <button style={F.apply} onClick={apply}>Apply Filters</button>
          <button style={{ ...F.print, marginLeft: "auto" }} onClick={() => window.print()}>🖨 Print Report</button>
        </div>

        {/* Summary chips */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 22 }}>
          <SCard label="TOTAL REVENUE"      value={inr(totalRev)}        sub="Sum of all invoice totals"           accent="#2563EB" />
          <SCard label="WON AFTER QUOTING"  value={wonQ.length}          sub={`Win rate ${winRate}%`}             accent="#15803D" />
          <SCard label="LOST AFTER QUOTING" value={lostQ.length}         sub={`Price (${lostQ.length})`}          accent="#BE123C" />
          <SCard label="GST COLLECTED"      value={inr(gstColl)}         sub="On won deals"                       accent="#7C3AED" />
          <SCard label="TCS COLLECTED"      value={inr(tcsColl)}         sub="International trips, u/s 206C(1G)"  accent="#0891B2" />
          <SCard label="AVG MARGIN %"       value={avgMargin.toFixed(1)+"%"} sub="Across won deals"               accent="#15803D" />
        </div>

        {/* Charts row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Grade-wise by month */}
          <div style={C.box}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={C.title}>Grade-wise sales by month</div>
              <div style={{ fontSize: 10, color: "#94A3B8", textAlign: "right", lineHeight: 1.6 }}>A above 30% · B+ 20 to 30<br/>B 16 to 20 · C below 16</div>
            </div>
            {mounted ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gradeMonthData} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="A"  stackId="s" fill="#22c55e" />
                  <Bar dataKey="B+" stackId="s" fill="#3b82f6" />
                  <Bar dataKey="B"  stackId="s" fill="#f59e0b" />
                  <Bar dataKey="C"  stackId="s" fill="#ef4444" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={C.loader} />}
          </div>

          {/* Won vs Lost */}
          <div style={C.box}>
            <div style={{ marginBottom: 14 }}>
              <div style={C.title}>Won vs Lost after sending quotation</div>
            </div>
            {mounted ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={wonLostData} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Won"  fill="#22c55e" radius={[3,3,0,0]} />
                  <Bar dataKey="Lost" fill="#ef4444" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={C.loader} />}
          </div>
        </div>

        {/* Charts row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Revenue trend */}
          <div style={C.box}>
            <div style={{ marginBottom: 14 }}>
              <div style={C.title}>Revenue trend between dates</div>
            </div>
            {mounted ? (
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={revTrendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={inrK} width={58} />
                  <Tooltip formatter={v => [inr(v), "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div style={C.loader} />}
          </div>

          {/* Grade donut */}
          <div style={C.box}>
            <div style={{ marginBottom: 14 }}>
              <div style={C.title}>Sales by grade, current period</div>
            </div>
            {mounted ? (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={gradeDistData.length ? gradeDistData : [{ name: "No data", value: 1, color: "#E4E9F2" }]}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={105}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {(gradeDistData.length ? gradeDistData : [{ color: "#E4E9F2" }]).map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v + " deals", n]} />
                  <Legend iconSize={12} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div style={C.loader} />}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

function SCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderTop: `3px solid ${accent}`, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent, lineHeight: 1.2, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.4 }}>{sub}</div>
    </div>
  );
}

const F = {
  date:  { padding: "6px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 12, outline: "none", color: "#374151", fontFamily: "inherit", background: "#F8FAFD", width: 128, colorScheme: "light" },
  sel:   { padding: "6px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 12, outline: "none", color: "#374151", fontFamily: "inherit", background: "#fff", cursor: "pointer", width: 138 },
  apply: { padding: "7px 16px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
  print: { padding: "7px 14px", background: "#fff", color: "#374151", border: "1.5px solid #CBD5E1", borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
};

const C = {
  box:    { background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,.04)" },
  title:  { fontSize: 14, fontWeight: 700, color: "#0F1B33" },
  loader: { height: 220, background: "#F8FAFD", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
};
