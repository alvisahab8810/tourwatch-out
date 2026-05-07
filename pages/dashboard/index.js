import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdPeople, MdMenu, MdKeyboardArrowDown, MdCallMade,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

/* ─── Static chart data ─── */
// NAV_ITEMS, CRM_ITEMS, and Sidebar extracted to components/backend/Sidebar.js
const CONVERSION_DATA = [
  { month: "Jan", Closed: 50, Quotations: 75, Lost: 30 },
  { month: "Feb", Closed: 50, Quotations: 75, Lost: 20 },
  { month: "Mar", Closed: 65, Quotations: 80, Lost: 35 },
  { month: "Apr", Closed: 70, Quotations: 95, Lost: 28 },
  { month: "May", Closed: 50, Quotations: 75, Lost: 45 },
  { month: "Jun", Closed: 52, Quotations: 76, Lost: 40 },
  { month: "Jul", Closed: 65, Quotations: 78, Lost: 48 },
  { month: "Aug", Closed: 55, Quotations: 80, Lost: 48 },
  { month: "Sep", Closed: 65, Quotations: 82, Lost: 48 },
  { month: "Oct", Closed: 68, Quotations: 70, Lost: 38 },
  { month: "Nov", Closed: 72, Quotations: 88, Lost: 12 },
];

const REVENUE_DATA = [
  { month: "Jan",  Packages: 120, Hotels: 80,  Flights: 55 },
  { month: "Feb",  Packages: 100, Hotels: 90,  Flights: 40 },
  { month: "Mar",  Packages: 140, Hotels: 95,  Flights: 70 },
  { month: "Apr",  Packages: 160, Hotels: 110, Flights: 85 },
  { month: "May",  Packages: 130, Hotels: 75,  Flights: 65 },
  { month: "Jun",  Packages: 145, Hotels: 88,  Flights: 72 },
  { month: "Jul",  Packages: 155, Hotels: 105, Flights: 80 },
  { month: "Aug",  Packages: 142, Hotels: 98,  Flights: 75 },
  { month: "Sep",  Packages: 150, Hotels: 102, Flights: 78 },
  { month: "Oct",  Packages: 148, Hotels: 92,  Flights: 68 },
  { month: "Nov",  Packages: 168, Hotels: 115, Flights: 88 },
];

const CONVERSION_COLORS = ["#22c55e", "#eab308", "#ef4444"];
const REVENUE_COLORS    = ["#2563eb", "#818cf8", "#a78bfa"];



/* ─── Reusable bar chart ─── */
function BarChart({ data, maxVal, colors }) {
  const [active, setActive] = useState(null);
  const keys = Object.keys(data[0]).filter((k) => k !== "month");

  return (
    <div>
      <div className="bk-chart-area">
        {/* Y-axis */}
        <div className="bk-y-axis">
          {[maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0].map((v) => (
            <span key={v} className="bk-y-label">{v}</span>
          ))}
        </div>

        {/* Bars */}
        <div className="bk-bars-wrap">
          <div className="bk-bars-inner">
            <div className="bk-bar-chart-row">
              {data.map((d, i) => (
                <div
                  key={d.month}
                  className="bk-bar-group"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  {/* Tooltip */}
                  <div className={`bk-tooltip ${active === i ? "visible" : ""}`}>
                    {keys.map((k, ki) => (
                      <div key={k} className="bk-tooltip-row">
                        <div className="bk-tooltip-dot" style={{ background: colors[ki] }} />
                        <span>{k}: {d[k]}</span>
                      </div>
                    ))}
                  </div>

                  {keys.map((k, ki) => (
                    <div
                      key={k}
                      className="bk-bar"
                      style={{
                        height: `${(d[k] / maxVal) * 100}%`,
                        background: colors[ki],
                        borderRadius: "3px 3px 0 0",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* X labels */}
            <div className="bk-x-labels">
              {data.map((d) => (
                <div key={d.month} className="bk-x-label">{d.month}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bk-legend">
        {keys.map((k, ki) => (
          <div key={k} className="bk-legend-item">
            <div className="bk-legend-dot" style={{ background: colors[ki] }} />
            {k}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function Dashboard() {
  const router = useRouter();
  const openSidebar = useOpenSidebar();
  const [destStat, setDestStat] = useState({ total: 0, active: 0 });
  const [pkgStat,  setPkgStat]  = useState({ total: 0, active: 0 });
  const [blogStat, setBlogStat] = useState({ total: 0, published: 0 });
  const [faqStat,  setFaqStat]  = useState({ total: 0, published: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/destinations").then(r => r.json()),
      fetch("/api/dashboard/packages").then(r => r.json()),
      fetch("/api/dashboard/blogs").then(r => r.json()),
      fetch("/api/dashboard/faqs").then(r => r.json()),
    ]).then(([dests, pkgs, blogsRes, faqsRes]) => {
      const d = Array.isArray(dests) ? dests : [];
      const p = Array.isArray(pkgs)  ? pkgs  : [];
      setDestStat({ total: d.length, active: d.filter(x => x.status === "Active").length });
      setPkgStat ({ total: p.length, active: p.filter(x => x.status === "Active").length });
      const blogsArr = Array.isArray(blogsRes) ? blogsRes : [];
      setBlogStat({
        total:     blogsArr.length,
        published: blogsArr.filter(b => b.status === "published").length,
      });
      const fStats = faqsRes?.stats || {};
      setFaqStat({ total: fStats.total || 0, published: fStats.published || 0 });
    }).catch(() => {});
  }, []);

  return (
    <>
      <Head><title>Dashboard — TourWatchOut</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar} aria-label="Open menu">
            <MdMenu size={22} />
          </button>
          <h1 className="bk-page-title">Dashboard</h1>
        </div>
        <div className="bk-header-right">
          <div className="bk-team-pill"><span>Sales Team</span><MdKeyboardArrowDown size={16} /></div>
          <button className="bk-avatar-btn">
            <MdPeople size={18} color="#2563eb" />
            <span className="bk-avatar-badge">4</span>
          </button>
        </div>
      </header>

      <div className="bk-content">
            {/* Stats */}
            <div className="bk-stats-grid">
              {/* Dynamic: Total Destinations */}
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
              {/* Dynamic: Total Packages */}
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
              {/* Dynamic: Blogs */}
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
              {/* Dynamic: FAQ's */}
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
              {/* Static: Leads */}
              <div className="bk-stat-card">
                <MdCallMade className="bk-stat-arrow-icon" size={17} />
                <div className="bk-stat-title">Leads</div>
                <div className="bk-stat-row">
                  <div className="bk-stat-number">0</div>
                  <div className="bk-stat-sub">
                    <div className="bk-stat-sub-num bk-clr-red">0</div>
                    <div className="bk-stat-sub-label">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversions chart */}
            <div className="bk-chart-card">
              <div className="bk-chart-top">
                <div className="bk-chart-title">Total Conversions this month</div>
                <MdCallMade size={18} color="#9ca3af" />
              </div>
              <div className="bk-chart-sub-row">
                <div className="bk-chart-subtitle">Monthly reporting</div>
                <select className="bk-period-select">
                  <option>Yearly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <BarChart data={CONVERSION_DATA} maxVal={100} colors={CONVERSION_COLORS} />
            </div>

            {/* Revenue chart */}
            <div className="bk-chart-card">
              <div className="bk-chart-top">
                <div className="bk-chart-title">Total revenue this month</div>
                <MdCallMade size={18} color="#9ca3af" />
              </div>
              <div className="bk-chart-sub-row">
                <div className="bk-chart-subtitle">Monthly reporting</div>
                <select className="bk-period-select">
                  <option>Yearly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <BarChart data={REVENUE_DATA} maxVal={200} colors={REVENUE_COLORS} />
            </div>
          </div>
    </>
  );
}

Dashboard.getLayout = (page) => (
  <DashboardLayout active="Dashboard">{page}</DashboardLayout>
);
