import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdPeople, MdMenu, MdKeyboardArrowDown, MdCallMade,
} from "react-icons/md";
import { isAuthenticated } from "../../utils/voucherAuth";
import Sidebar from "../../components/backend/Sidebar";

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


const STATS = [
  { title: "Total Destinations", value: 30,  subNum: 28,  subLabel: "Active",    color: "bk-clr-green" },
  { title: "Total Packages",     value: 105, subNum: 100, subLabel: "Active",    color: "bk-clr-green" },
  { title: "Blogs",              value: 145, subNum: 120, subLabel: "Active",    color: "bk-clr-green" },
  { title: "FAQ's",              value: 56,  subNum: 10,  subLabel: "New Added", color: "bk-clr-gray"  },
  { title: "Leads",              value: 150, subNum: 18,  subLabel: "Pending",   color: "bk-clr-red"   },
];

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
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/dashboard/login");
      return;
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      <Head>
        <title>Dashboard — TourWatchOut</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>

      <div className="bk-page">
        <Sidebar
          active="Dashboard"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="bk-main">
          {/* ─── Header ─── */}
          <header className="bk-header">
            <div className="bk-header-left">
              <button
                className="bk-hamburger"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <MdMenu size={22} />
              </button>
              <h1 className="bk-page-title">Dashboard</h1>
            </div>

            <div className="bk-header-right">
              <div className="bk-team-pill">
                <span>Sales Team</span>
                <MdKeyboardArrowDown size={16} />
              </div>
              <button className="bk-avatar-btn">
                <MdPeople size={18} color="#2563eb" />
                <span className="bk-avatar-badge">4</span>
              </button>
            </div>
          </header>

          {/* ─── Content ─── */}
          <div className="bk-content">
            {/* Stats */}
            <div className="bk-stats-grid">
              {STATS.map((s) => (
                <div key={s.title} className="bk-stat-card">
                  <MdCallMade className="bk-stat-arrow-icon" size={17} />
                  <div className="bk-stat-title">{s.title}</div>
                  <div className="bk-stat-row">
                    <div className="bk-stat-number">{s.value}</div>
                    <div className="bk-stat-sub">
                      <div className={`bk-stat-sub-num ${s.color}`}>{s.subNum}</div>
                      <div className="bk-stat-sub-label">{s.subLabel}</div>
                    </div>
                  </div>
                </div>
              ))}
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
        </main>
      </div>
    </>
  );
}
