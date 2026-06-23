import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  MdDashboard, MdLocationOn, MdApps, MdArticle, MdHelpOutline,
  MdPeople, MdNotificationsNone, MdStore,
  MdConfirmationNumber, MdReceipt, MdLogout, MdComment, MdStar, MdRateReview,
  MdManageAccounts, MdSupervisedUserCircle, MdAssignment, MdRequestQuote,
  MdAccountBalance, MdBarChart, MdFlight, MdPersonSearch,
} from "react-icons/md";
import { logout, getSalespersonData } from "../../utils/voucherAuth";

/* ── Nav definitions — permKey controls salesperson visibility
   adminOnly = true means hidden from salesperson even if they somehow have the key ── */
const NAV = [
  { label: "Dashboard",    Icon: MdDashboard,      href: "/dashboard",              permKey: null },
  { label: "Destinations", Icon: MdLocationOn,     href: "/dashboard/destinations", permKey: "destinations" },
  { label: "All Packages", Icon: MdApps,           href: "/dashboard/packages",     permKey: "packages" },
  { label: "Blogs",        Icon: MdArticle,        href: "/dashboard/blogs",        permKey: "blogs" },
  { label: "Comments",     Icon: MdComment,        href: "/dashboard/comments",     permKey: "comments" },
  { label: "Reviews",      Icon: MdRateReview,     href: "/dashboard/reviews",      permKey: "reviews" },
  { label: "Most Popular", Icon: MdStar,           href: "/dashboard/popular",      permKey: "mostPopular" },
  { label: "Faq's",        Icon: MdHelpOutline,    href: "/dashboard/faqs",         permKey: "faqs" },
  { label: "Users",        Icon: MdManageAccounts, href: "/dashboard/users",        permKey: "users" },
];

const CRM = [
  { label: "Leads",      Icon: MdPeople,               href: "/dashboard/leads",      permKey: "leads" },
  { label: "BRR",        Icon: MdAssignment,            href: "/dashboard/brr",        permKey: "brr" },
  { label: "Quotation",  Icon: MdRequestQuote,          href: "/dashboard/quotations", permKey: "quotation" },
  { label: "Invoice",    Icon: MdReceipt,               href: "/dashboard/invoices",   permKey: "invoice" },
  { label: "Voucher",    Icon: MdConfirmationNumber,    href: "/dashboard/vouchers",   permKey: "voucher" },
  { label: "Reminder",   Icon: MdNotificationsNone,     href: "/dashboard/reminders",  permKey: "reminders" },
  { label: "Sales Team", Icon: MdSupervisedUserCircle,  href: "/dashboard/sales-team", permKey: null, adminOnly: true },
  { label: "Vendors",    Icon: MdStore,                 href: "/dashboard/vendors",    permKey: "vendors" },
];

const BUSINESS = [
  { label: "Financials",    Icon: MdAccountBalance, href: "/dashboard/financials",    permKey: "financials" },
  { label: "Reports",       Icon: MdBarChart,       href: "/dashboard/reports",       permKey: "reports" },
  { label: "Trip Records",  Icon: MdFlight,         href: "/dashboard/trip-records",  permKey: "tripRecords" },
  { label: "Lead Profiles", Icon: MdPersonSearch,   href: "/dashboard/lead-profiles", permKey: "leadProfiles" },
];

export default function Sidebar({ active, isOpen, onClose }) {
  const router = useRouter();
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [spData,        setSpData]        = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const sp = getSalespersonData();
    setSpData(sp);
    if (!sp) return;
    try {
      const { token } = JSON.parse(localStorage.getItem("tw_sp_auth") || "{}");
      if (!token) return;
      fetch("/api/salesperson/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.error) return;
          localStorage.setItem("tw_sp_auth", JSON.stringify({ token, salesperson: data }));
          setSpData(data);
        })
        .catch(() => {});
    } catch {}
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector(".bk-nav-item.active");
    if (activeEl) activeEl.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    fetch("/api/dashboard/leads")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) setNewLeadsCount(data.filter(l => l.status === "New").length);
      })
      .catch(() => {});
  }, []);

  /* Filter nav items for salesperson — admin sees everything */
  const perms = spData?.permissions ?? null;

  function filter(items) {
    if (!perms) return items; // admin: show all
    return items.filter(item => {
      if (item.adminOnly) return false;
      if (!item.permKey)  return true;  // no permission required (e.g. Dashboard)
      return !!perms[item.permKey];
    });
  }

  const visibleNAV      = filter(NAV);
  const visibleCRM      = filter(CRM);
  const visibleBUSINESS = filter(BUSINESS);

  function go(href) {
    if (onClose) onClose();
    if (href !== "#") router.push(href);
  }

  function handleLogout() {
    if (spData) {
      localStorage.removeItem("tw_sp_auth");
      router.replace("/salesperson/login");
    } else {
      logout();
      router.replace("/dashboard/login");
    }
  }

  return (
    <>
      <div className={`bk-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`bk-sidebar ${isOpen ? "open" : ""}`}>
        <div className="bk-sidebar-logo">
          <img src="/assets/images/dark-logo.svg" alt="Tourwatchout" />
          {spData && (
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{spData.name}</div>
              <div style={{ fontSize: 11, color: "#EE4C49", fontWeight: 600 }}>{spData.designation || "Sales Representative"}</div>
            </div>
          )}
        </div>

        <nav className="bk-sidebar-nav" ref={navRef}>
          {visibleNAV.map(({ label, Icon, href }) => (
            <div key={label} className={`bk-nav-item ${active === label ? "active" : ""}`} onClick={() => go(href)}>
              <Icon size={18} />{label}
            </div>
          ))}

          {visibleCRM.length > 0 && <div className="bk-nav-section">Sales CRM</div>}

          {visibleCRM.map(({ label, Icon, href }) => (
            <div key={label} className={`bk-nav-item ${active === label ? "active" : ""}`} onClick={() => go(href)} style={{ position: "relative" }}>
              <Icon size={18} />
              {label}
              {label === "Leads" && newLeadsCount > 0 && (
                <span style={{ marginLeft: "auto", background: "#E8364A", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 99, minWidth: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px", lineHeight: 1 }}>
                  {newLeadsCount}
                </span>
              )}
            </div>
          ))}

          {visibleBUSINESS.length > 0 && <div className="bk-nav-section">Business</div>}

          {visibleBUSINESS.map(({ label, Icon, href }) => (
            <div key={label} className={`bk-nav-item ${active === label ? "active" : ""}`} onClick={() => go(href)}>
              <Icon size={18} />{label}
            </div>
          ))}
        </nav>

        <div className="bk-sidebar-bottom">
          <div className="bk-nav-item danger" onClick={handleLogout}>
            <MdLogout size={18} />Logout
          </div>
        </div>
      </aside>
    </>
  );
}
