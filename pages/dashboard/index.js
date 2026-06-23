import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdPeople, MdMenu, MdKeyboardArrowDown, MdCallMade,
  MdLocationOn, MdApps, MdArticle, MdHelpOutline, MdRateReview,
  MdComment, MdStar, MdReceipt, MdConfirmationNumber, MdRequestQuote,
  MdAssignment, MdManageAccounts, MdStore,
} from "react-icons/md";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";
import { getSalespersonData } from "../../utils/voucherAuth";

/* ── helpers (shared with reports page) ── */
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
  const after = sub + cgst + sgst + igst;
  const tcs  = after * (parseFloat(inv?.tcsPct) || 0) / 100;
  return after + tcs;
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

/* ── Main page ── */
export default function Dashboard() {
  const router      = useRouter();
  const openSidebar = useOpenSidebar();
  const [mounted,    setMounted]    = useState(false);
  const [spData,     setSpData]     = useState(null);

  /* content stats */
  const [destStat,    setDestStat]    = useState({ total: 0, active: 0 });
  const [pkgStat,     setPkgStat]     = useState({ total: 0, active: 0 });
  const [blogStat,    setBlogStat]    = useState({ total: 0, published: 0 });
  const [faqStat,     setFaqStat]     = useState({ total: 0, published: 0 });
  const [leadStat,    setLeadStat]    = useState({ total: 0, today: 0 });
  const [reviewStat,  setReviewStat]  = useState({ total: 0, pending: 0 });
  const [commentStat, setCommentStat] = useState({ total: 0, pending: 0 });
  const [vendorStat,  setVendorStat]  = useState({ total: 0 });
  const [userStat,    setUserStat]    = useState({ total: 0 });

  /* report data */
  const [quotations, setQuotations] = useState([]);
  const [invoices,   setInvoices]   = useState([]);
  const [vouchers,   setVouchers]   = useState([]);

  useEffect(() => {
    setMounted(true);
    const sp = getSalespersonData();
    setSpData(sp);
    if (sp) {
      try {
        const { token } = JSON.parse(localStorage.getItem("tw_sp_auth") || "{}");
        if (token) {
          fetch("/api/salesperson/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => { if (!data.error) { localStorage.setItem("tw_sp_auth", JSON.stringify({ token, salesperson: data })); setSpData(data); } })
            .catch(() => {});
        }
      } catch {}
    }

    /* Revenue-critical fetches run independently so a stats-block error can't kill them */
    fetch("/api/dashboard/invoices").then(r => r.ok ? r.json() : []).then(inv => { if (Array.isArray(inv)) setInvoices(inv); }).catch(() => {});
    fetch("/api/dashboard/quotations").then(r => r.ok ? r.json() : []).then(q  => { if (Array.isArray(q))   setQuotations(q);  }).catch(() => {});
    fetch("/api/dashboard/vouchers").then(r => r.ok ? r.json() : []).then(v   => { if (Array.isArray(v))   setVouchers(v);    }).catch(() => {});

    /* Stat-card fetches */
    Promise.all([
      fetch("/api/dashboard/destinations").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/packages").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/blogs").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/faqs").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/leads").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/reviews").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/comments").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/vendors").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/users").then(r => r.json()).catch(() => []),
    ]).then(([dests, pkgs, blogsRes, faqsRes, leadsRes, revRes, comRes, venRes, usrRes]) => {
      const d = Array.isArray(dests) ? dests : [];
      const p = Array.isArray(pkgs)  ? pkgs  : [];
      setDestStat({ total: d.length, active: d.filter(x => x.status === "Active").length });
      setPkgStat ({ total: p.length, active: p.filter(x => x.status === "Active").length });
      const blogsArr = Array.isArray(blogsRes) ? blogsRes : [];
      setBlogStat({ total: blogsArr.length, published: blogsArr.filter(b => b.status === "published").length });
      const fStats = faqsRes?.stats || {};
      setFaqStat({ total: fStats.total || 0, published: fStats.published || 0 });
      const leads = Array.isArray(leadsRes) ? leadsRes : [];
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      setLeadStat({ total: leads.length, today: leads.filter(l => new Date(l.createdAt) >= todayStart).length });
      const revArr = Array.isArray(revRes) ? revRes : [];
      setReviewStat({ total: revArr.length, pending: revArr.filter(r => !r.approved).length });
      const comArr = Array.isArray(comRes) ? comRes : [];
      setCommentStat({ total: comArr.length, pending: comArr.filter(c => !c.approved).length });
      setVendorStat({ total: Array.isArray(venRes) ? venRes.length : 0 });
      setUserStat({ total: Array.isArray(usrRes) ? usrRes.length : 0 });
    }).catch(() => {});
  }, []);

  /* current year range */
  const yearFrom = new Date().getFullYear() + "-01-01";
  const yearTo   = new Date().toISOString().slice(0, 10);
  const months   = useMemo(() => getMonths(yearFrom, yearTo), []);

  const wonQ  = useMemo(() => quotations.filter(q => q.status === "Won"),  [quotations]);
  const lostQ = useMemo(() => quotations.filter(q => q.status === "Lost"), [quotations]);

  const totalRev = useMemo(() => invoices.reduce((s, i) => s + calcInv(i), 0), [invoices]);
  const winRate  = useMemo(() => {
    const t = wonQ.length + lostQ.length;
    return t > 0 ? Math.round((wonQ.length / t) * 100) : 0;
  }, [wonQ, lostQ]);

  const gradeMonthData = useMemo(() => months.map(mo => ({
    month: mo.label,
    A:    wonQ.filter(q => inMonth(q.travelDate, mo) && quoteGrade(q) === "A").length,
    "B+": wonQ.filter(q => inMonth(q.travelDate, mo) && quoteGrade(q) === "B+").length,
    B:    wonQ.filter(q => inMonth(q.travelDate, mo) && quoteGrade(q) === "B").length,
    C:    wonQ.filter(q => inMonth(q.travelDate, mo) && quoteGrade(q) === "C").length,
  })), [months, wonQ]);

  const wonLostData = useMemo(() => months.map(mo => ({
    month: mo.label,
    Won:  quotations.filter(q => inMonth(q.travelDate, mo) && q.status === "Won").length,
    Lost: quotations.filter(q => inMonth(q.travelDate, mo) && q.status === "Lost").length,
  })), [months, quotations]);

  const revTrendData = useMemo(() => months.map(mo => {
    const rev = invoices
      .filter(inv => { const d = inv.createdAt ? new Date(inv.createdAt) : null; return d && d.getFullYear() === mo.year && d.getMonth() === mo.month; })
      .reduce((s, inv) => s + calcInv(inv), 0);
    return { month: mo.label, revenue: Math.round(rev) };
  }), [months, invoices]);

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

  /* ── Build salesperson stat cards based on their permissions ── */
  const perms = spData?.permissions || null;

  const SP_CARDS = [
    { permKey: "leads",        label: "Leads",             Icon: MdPeople,           href: "/dashboard/leads",        main: leadStat.total,    sub: leadStat.today,         subLabel: "Today",     color: "#2563eb" },
    { permKey: "destinations", label: "Destinations",      Icon: MdLocationOn,       href: "/dashboard/destinations", main: destStat.total,    sub: destStat.active,        subLabel: "Active",    color: "#16a34a" },
    { permKey: "packages",     label: "All Packages",      Icon: MdApps,             href: "/dashboard/packages",     main: pkgStat.total,     sub: pkgStat.active,         subLabel: "Active",    color: "#7c3aed" },
    { permKey: "blogs",        label: "Blogs",             Icon: MdArticle,          href: "/dashboard/blogs",        main: blogStat.total,    sub: blogStat.published,     subLabel: "Published", color: "#d97706" },
    { permKey: "reviews",      label: "Reviews",           Icon: MdRateReview,       href: "/dashboard/reviews",      main: reviewStat.total,  sub: reviewStat.pending,     subLabel: "Pending",   color: "#0891b2" },
    { permKey: "comments",     label: "Comments",          Icon: MdComment,          href: "/dashboard/comments",     main: commentStat.total, sub: commentStat.pending,    subLabel: "Pending",   color: "#be185d" },
    { permKey: "mostPopular",  label: "Most Popular",      Icon: MdStar,             href: "/dashboard/popular",      main: "—",               sub: null,                   subLabel: "",          color: "#f59e0b" },
    { permKey: "faqs",         label: "FAQs",              Icon: MdHelpOutline,      href: "/dashboard/faqs",         main: faqStat.total,     sub: faqStat.published,      subLabel: "Published", color: "#64748b" },
    { permKey: "users",        label: "Users",             Icon: MdManageAccounts,   href: "/dashboard/users",        main: userStat.total,    sub: null,                   subLabel: "",          color: "#475569" },
    { permKey: "quotation",    label: "Quotations",        Icon: MdRequestQuote,     href: "/dashboard/quotations",   main: quotations.length, sub: quotations.filter(q => q.status === "Won").length, subLabel: "Won", color: "#059669" },
    { permKey: "invoice",      label: "Invoices",          Icon: MdReceipt,          href: "/dashboard/invoices",     main: invoices.length,   sub: inr(totalRev),          subLabel: "Revenue",   color: "#dc2626" },
    { permKey: "voucher",      label: "Vouchers",          Icon: MdConfirmationNumber,href: "/dashboard/vouchers",   main: vouchers.length,   sub: vouchers.filter(v => v.isLocked).length, subLabel: "Locked", color: "#7c3aed" },
    { permKey: "brr",          label: "BRR",               Icon: MdAssignment,       href: "/dashboard/brr",          main: "—",               sub: null,                   subLabel: "",          color: "#334155" },
    { permKey: "reminders",    label: "Reminders",         Icon: MdCallMade,         href: "/dashboard/reminders",    main: "—",               sub: null,                   subLabel: "",          color: "#0369a1" },
    { permKey: "vendors",      label: "Vendors",           Icon: MdStore,            href: "/dashboard/vendors",      main: vendorStat.total,  sub: null,                   subLabel: "",          color: "#92400e" },
  ];

  const visibleSpCards = perms ? SP_CARDS.filter(c => perms[c.permKey]) : [];

  return (
    <>
      <Head><title>Dashboard — Tourwatchout</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar} aria-label="Open menu">
            <MdMenu size={22} />
          </button>
          <h1 className="bk-page-title">
            {spData ? `Welcome, ${spData.name.split(" ")[0]}!` : "Dashboard"}
          </h1>
        </div>
        {!spData && (
          <div className="bk-header-right">
            <div className="bk-team-pill"><span>Sales Team</span><MdKeyboardArrowDown size={16} /></div>
            <button className="bk-avatar-btn">
              <MdPeople size={18} color="#2563eb" />
              <span className="bk-avatar-badge">4</span>
            </button>
          </div>
        )}
      </header>

      <div className="bk-content">

        {/* ══════════════ SALESPERSON VIEW ══════════════ */}
        {spData ? (
          <>
            <div style={{ marginBottom: 20, padding: "14px 18px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, fontSize: 13, color: "#1e40af" }}>
              You are logged in as <strong>{spData.name}</strong>. Only features assigned to you are visible below.
            </div>

            {visibleSpCards.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                No features have been assigned to you yet. Contact your admin.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {visibleSpCards.map(card => (
                  <div key={card.permKey}
                    onClick={() => router.push(card.href)}
                    style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: `3px solid ${card.color}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "box-shadow 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: card.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <card.Icon size={18} color={card.color} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>{card.label}</span>
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.main}</div>
                    {card.sub !== null && card.subLabel && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>
                        <span style={{ fontWeight: 700, color: card.color }}>{card.sub}</span> {card.subLabel}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (

        /* ══════════════ ADMIN VIEW ══════════════ */
        <>
          {/* Stats */}
          <div className="bk-stats-grid">
            <div className="bk-stat-card">
              <MdCallMade className="bk-stat-arrow-icon" size={17} />
              <div className="bk-stat-title">Total Destinations</div>
              <div className="bk-stat-row">
                <div className="bk-stat-number">{destStat.total}</div>
                <div className="bk-stat-sub">
                  <div className="bk-stat-sub-num bk-clr-green">{destStat.active}</div>
                  <div className="bk-stat-sub-label">Active</div>
                </div>
              </div>
            </div>
            <div className="bk-stat-card">
              <MdCallMade className="bk-stat-arrow-icon" size={17} />
              <div className="bk-stat-title">Total Packages</div>
              <div className="bk-stat-row">
                <div className="bk-stat-number">{pkgStat.total}</div>
                <div className="bk-stat-sub">
                  <div className="bk-stat-sub-num bk-clr-green">{pkgStat.active}</div>
                  <div className="bk-stat-sub-label">Active</div>
                </div>
              </div>
            </div>
            <div className="bk-stat-card">
              <MdCallMade className="bk-stat-arrow-icon" size={17} />
              <div className="bk-stat-title">Blogs</div>
              <div className="bk-stat-row">
                <div className="bk-stat-number">{blogStat.total}</div>
                <div className="bk-stat-sub">
                  <div className="bk-stat-sub-num bk-clr-green">{blogStat.published}</div>
                  <div className="bk-stat-sub-label">Published</div>
                </div>
              </div>
            </div>
            <div className="bk-stat-card">
              <MdCallMade className="bk-stat-arrow-icon" size={17} />
              <div className="bk-stat-title">FAQ&apos;s</div>
              <div className="bk-stat-row">
                <div className="bk-stat-number">{faqStat.total}</div>
                <div className="bk-stat-sub">
                  <div className="bk-stat-sub-num bk-clr-green">{faqStat.published}</div>
                  <div className="bk-stat-sub-label">Published</div>
                </div>
              </div>
            </div>
            <div className="bk-stat-card" style={{ cursor: "pointer" }} onClick={() => router.push("/dashboard/leads")}>
              <MdCallMade className="bk-stat-arrow-icon" size={17} />
              <div className="bk-stat-title">Leads</div>
              <div className="bk-stat-row">
                <div className="bk-stat-number">{leadStat.total}</div>
                <div className="bk-stat-sub">
                  <div className="bk-stat-sub-num bk-clr-green">{leadStat.today}</div>
                  <div className="bk-stat-sub-label">Today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary chips */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            <SCard label="TOTAL REVENUE (YTD)"   value={inr(totalRev)}  sub="Sum of all invoice totals"  accent="#2563EB" />
            <SCard label="WON AFTER QUOTING"     value={wonQ.length}    sub={`Win rate ${winRate}%`}     accent="#15803D" />
            <SCard label="LOST AFTER QUOTING"    value={lostQ.length}   sub="Across all time"            accent="#BE123C" />
          </div>

          {/* Charts row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={C.box}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={C.title}>Grade-wise sales by month</div>
                <div style={{ fontSize: 10, color: "#94A3B8", textAlign: "right", lineHeight: 1.6 }}>A above 30% · B+ 20–30<br/>B 16–20 · C below 16</div>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={C.box}>
              <div style={{ marginBottom: 14 }}>
                <div style={C.title}>Revenue trend (this year)</div>
              </div>
              {mounted ? (
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={revTrendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGradDb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={inrK} width={58} />
                    <Tooltip formatter={v => [inr(v), "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGradDb)" dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div style={C.loader} />}
            </div>

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

          {/* Link to full reports */}
          <div style={{ textAlign: "right", marginBottom: 8 }}>
            <button onClick={() => router.push("/dashboard/reports")}
              style={{ background: "#EFF4FF", color: "#2563EB", border: "1px solid #BFD3FE", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              View Full Reports with Filters →
            </button>
          </div>
        </>
        )}
      </div>
    </>
  );
}

Dashboard.getLayout = (page) => (
  <DashboardLayout active="Dashboard">{page}</DashboardLayout>
);

function SCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderTop: `3px solid ${accent}`, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent, lineHeight: 1.2, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#94A3B8" }}>{sub}</div>
    </div>
  );
}

const C = {
  box:    { background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,.04)" },
  title:  { fontSize: 14, fontWeight: 700, color: "#0F1B33" },
  loader: { height: 220, background: "#F8FAFD", borderRadius: 8 },
};
