import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  MdDashboard, MdPeople, MdNotificationsNone, MdStore,
  MdConfirmationNumber, MdReceipt, MdLocationOn, MdApps, MdArticle,
  MdHelpOutline, MdRateReview, MdComment, MdManageAccounts,
  MdLogout, MdMenu, MdDescription, MdBarChart, MdAttachMoney,
  MdFlight, MdPersonSearch, MdStar, MdAssessment,
} from "react-icons/md";

const SP_AUTH_KEY = "tw_sp_auth";

/* ─── nav definition ─────────────────────────────────────────────────────────
   href = the salesperson page route
   permKey = permission key in SalesPerson.permissions
   built = whether the page is actually implemented (false → shows Coming Soon)
   ─────────────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard", Icon: MdDashboard, href: "/salesperson/dashboard", permKey: null, built: true },
];

const CRM_ITEMS = [
  { label: "Leads",      Icon: MdPeople,             href: "/salesperson/dashboard",   permKey: "leads",     built: true },
  { label: "BRR",        Icon: MdAssessment,         href: "/salesperson/brr",         permKey: "brr",       built: false },
  { label: "Quotation",  Icon: MdDescription,        href: "/salesperson/quotations",  permKey: "quotation", built: true },
  { label: "Invoice",    Icon: MdReceipt,            href: "/salesperson/invoices",    permKey: "invoice",   built: true },
  { label: "Voucher",    Icon: MdConfirmationNumber, href: "/salesperson/vouchers",    permKey: "voucher",   built: true },
  { label: "Reminder",   Icon: MdNotificationsNone,  href: "/salesperson/reminders",   permKey: "reminders", built: false },
  { label: "Vendors",    Icon: MdStore,              href: "/salesperson/vendors",     permKey: "vendors",   built: true },
];

const OTHER_ITEMS = [
  { label: "Destinations", Icon: MdLocationOn,     href: "/salesperson/destinations",  permKey: "destinations", built: true },
  { label: "All Packages",  Icon: MdApps,           href: "/salesperson/packages",      permKey: "packages",     built: true },
  { label: "Blogs",         Icon: MdArticle,        href: "/salesperson/blogs",         permKey: "blogs",        built: true },
  { label: "Comments",      Icon: MdComment,        href: "/salesperson/comments",      permKey: "comments",     built: true },
  { label: "Reviews",       Icon: MdRateReview,     href: "/salesperson/reviews",       permKey: "reviews",      built: true },
  { label: "Most Popular",  Icon: MdStar,           href: "/salesperson/most-popular",  permKey: "mostPopular",  built: false },
  { label: "FAQs",          Icon: MdHelpOutline,    href: "/salesperson/faqs",          permKey: "faqs",         built: true },
  { label: "Users",         Icon: MdManageAccounts, href: "/salesperson/users",         permKey: "users",        built: true },
];

const BUSINESS_ITEMS = [
  { label: "Financials",    Icon: MdAttachMoney,    href: "/salesperson/financials",    permKey: "financials",   built: false },
  { label: "Reports",       Icon: MdBarChart,       href: "/salesperson/reports",       permKey: "reports",      built: false },
  { label: "Trip Records",  Icon: MdFlight,         href: "/salesperson/trip-records",  permKey: "tripRecords",  built: false },
  { label: "Lead Profiles", Icon: MdPersonSearch,   href: "/salesperson/lead-profiles", permKey: "leadProfiles", built: false },
];

export default function SPLayout({ children, active, spData, onLogout }) {
  const router  = useRouter();
  const [open, setOpen]         = useState(false);
  const [livePerms, setLivePerms] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SP_AUTH_KEY);
      if (!raw) return;
      const { token } = JSON.parse(raw);
      if (!token) return;
      fetch("/api/salesperson/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.error) { onLogout?.(); return; }
          const updated = { token, salesperson: data };
          localStorage.setItem(SP_AUTH_KEY, JSON.stringify(updated));
          setLivePerms(data.permissions || {});
        })
        .catch(() => {});
    } catch {}
  }, []);

  const perms = livePerms ?? spData?.permissions ?? {};

  function go(item) {
    setOpen(false);
    const target = item.built ? item.href : "/salesperson/coming-soon";
    if (target !== "#") router.push(target);
  }

  const visibleCRM      = CRM_ITEMS.filter(i => !i.permKey || perms[i.permKey]);
  const visibleOther    = OTHER_ITEMS.filter(i => !i.permKey || perms[i.permKey]);
  const visibleBusiness = BUSINESS_ITEMS.filter(i => !i.permKey || perms[i.permKey]);

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>

      <style>{`
        .sp-sidebar{position:fixed;top:0;left:0;width:230px;height:100vh;background:#fff;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;z-index:200;transition:transform .25s;overflow:hidden}
        .sp-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:199}
        .sp-main{margin-left:230px;min-height:100vh;background:#f8fafc}
        @media(max-width:768px){
          .sp-sidebar{transform:translateX(-100%)}
          .sp-sidebar.open{transform:translateX(0)}
          .sp-overlay.open{display:block}
          .sp-main{margin-left:0}
          .sp-mob{display:flex!important}
        }
        .sp-nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;font-size:13px;font-weight:500;color:#64748b;cursor:pointer;border-radius:8px;margin:1px 8px;transition:background .12s,color .12s;white-space:nowrap;user-select:none}
        .sp-nav-item:hover{background:#f8fafc;color:#0f172a}
        .sp-nav-item.active{background:#fef2f2;color:#EE4C49;font-weight:700}
        .sp-nav-item.soon{opacity:.55}
        .sp-section{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;padding:12px 16px 4px}
        .sp-soon-chip{margin-left:auto;font-size:9px;background:#f1f5f9;color:#94a3b8;border-radius:4px;padding:1px 5px;font-weight:700}
      `}</style>

      <div className={`sp-overlay${open ? " open" : ""}`} onClick={() => setOpen(false)} />

      <aside className={`sp-sidebar${open ? " open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          <img src="/assets/images/dark-logo.svg" alt="Tourwatchout" style={{ height: 30 }} />
        </div>

        {/* User badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#EE4C49", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
            {spData?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{spData?.name}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Sales Representative</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
          {NAV_ITEMS.map(item => (
            <div key={item.label} className={`sp-nav-item${active === item.label ? " active" : ""}`} onClick={() => go(item)}>
              <item.Icon size={17} />{item.label}
            </div>
          ))}

          {visibleCRM.length > 0 && (
            <>
              <div className="sp-section">Sales CRM</div>
              {visibleCRM.map(item => (
                <div key={item.label} className={`sp-nav-item${active === item.label ? " active" : ""}${!item.built ? " soon" : ""}`} onClick={() => go(item)}>
                  <item.Icon size={17} />
                  {item.label}
                  {!item.built && <span className="sp-soon-chip">SOON</span>}
                </div>
              ))}
            </>
          )}

          {visibleOther.length > 0 && (
            <>
              <div className="sp-section">Content</div>
              {visibleOther.map(item => (
                <div key={item.label} className={`sp-nav-item${active === item.label ? " active" : ""}${!item.built ? " soon" : ""}`} onClick={() => go(item)}>
                  <item.Icon size={17} />
                  {item.label}
                  {!item.built && <span className="sp-soon-chip">SOON</span>}
                </div>
              ))}
            </>
          )}

          {visibleBusiness.length > 0 && (
            <>
              <div className="sp-section">Business</div>
              {visibleBusiness.map(item => (
                <div key={item.label} className={`sp-nav-item${active === item.label ? " active" : ""}${!item.built ? " soon" : ""}`} onClick={() => go(item)}>
                  <item.Icon size={17} />
                  {item.label}
                  {!item.built && <span className="sp-soon-chip">SOON</span>}
                </div>
              ))}
            </>
          )}
        </nav>

        {/* Logout */}
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "8px", flexShrink: 0 }}>
          <div className="sp-nav-item" style={{ color: "#ef4444" }} onClick={onLogout}>
            <MdLogout size={17} /> Logout
          </div>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="sp-mob" style={{ display: "none", alignItems: "center", height: 54, background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 16px", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
          <MdMenu size={22} color="#374151" />
        </button>
        <img src="/assets/images/dark-logo.svg" alt="" style={{ height: 26 }} />
      </div>

      <main className="sp-main">{children}</main>
    </>
  );
}
