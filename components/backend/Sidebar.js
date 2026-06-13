import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  MdDashboard, MdLocationOn, MdApps, MdArticle, MdHelpOutline,
  MdPeople, MdAutorenew, MdNotificationsNone, MdStore,
  MdConfirmationNumber, MdReceipt, MdLogout, MdSmartButton, MdComment, MdStar, MdRateReview,
  MdManageAccounts, MdSupervisedUserCircle, MdAssignment, MdRequestQuote,
  MdAccountBalance, MdBarChart, MdFlight, MdPersonSearch,
} from "react-icons/md";
import { logout } from "../../utils/voucherAuth";

const NAV = [
  { label: "Dashboard",    Icon: MdDashboard,         href: "/dashboard" },
  { label: "Destinations", Icon: MdLocationOn,         href: "/dashboard/destinations" },
  { label: "All Packages", Icon: MdApps,               href: "/dashboard/packages" },
  { label: "Blogs",        Icon: MdArticle,            href: "/dashboard/blogs" },
  { label: "Comments",    Icon: MdComment,            href: "/dashboard/comments" },
  { label: "Reviews",     Icon: MdRateReview,        href: "/dashboard/reviews" },
  { label: "Most Popular", Icon: MdStar,              href: "/dashboard/popular" },
  { label: "Faq's",       Icon: MdHelpOutline,        href: "/dashboard/faqs" },
  { label: "Users",       Icon: MdManageAccounts,     href: "/dashboard/users" },
];

const CRM = [
  { label: "Leads",       Icon: MdPeople,                 href: "/dashboard/leads" },
  { label: "BRR",         Icon: MdAssignment,             href: "/dashboard/brr" },
  { label: "Quotation",   Icon: MdRequestQuote,           href: "/dashboard/quotations" },
  { label: "Invoice",     Icon: MdReceipt,                href: "/dashboard/invoices" },
  { label: "Voucher",     Icon: MdConfirmationNumber,     href: "/dashboard/vouchers" },
  { label: "Reminder",    Icon: MdNotificationsNone,      href: "/dashboard/reminders" },
  { label: "Sales Team",  Icon: MdSupervisedUserCircle,   href: "/dashboard/sales-team" },
  // { label: "Follow Up",   Icon: MdAutorenew,              href: "#" },
  { label: "Vendors",     Icon: MdStore,                  href: "/dashboard/vendors" },
];

const BUSINESS = [
  { label: "Financials",    Icon: MdAccountBalance, href: "/dashboard/financials" },
  { label: "Reports",       Icon: MdBarChart,       href: "/dashboard/reports" },
  { label: "Trip Records",  Icon: MdFlight,         href: "/dashboard/trip-records" },
  { label: "Lead Profiles", Icon: MdPersonSearch,   href: "/dashboard/lead-profiles" },
];

export default function Sidebar({ active, isOpen, onClose }) {
  const router = useRouter();
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    fetch("/api/dashboard/leads")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setNewLeadsCount(data.filter(l => l.status === "New").length);
        }
      })
      .catch(() => {});
  }, []);

  function go(href) {
    if (onClose) onClose();
    if (href !== "#") router.push(href);
  }

  function handleLogout() {
    logout();
    router.replace("/dashboard/login");
  }

  return (
    <>
      <div className={`bk-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`bk-sidebar ${isOpen ? "open" : ""}`}>
        <div className="bk-sidebar-logo">
          <img src="/assets/images/dark-logo.svg" alt="Tourwatchout" />
        </div>

        <nav className="bk-sidebar-nav">
          {NAV.map(({ label, Icon, href }) => (
            <div
              key={label}
              className={`bk-nav-item ${active === label ? "active" : ""}`}
              onClick={() => go(href)}
            >
              <Icon size={18} />
              {label}
            </div>
          ))}

          <div className="bk-nav-section">Sales CRM</div>

          {CRM.map(({ label, Icon, href }) => (
            <div
              key={label}
              className={`bk-nav-item ${active === label ? "active" : ""}`}
              onClick={() => go(href)}
              style={{ position: "relative" }}
            >
              <Icon size={18} />
              {label}
              {label === "Leads" && newLeadsCount > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: "#E8364A",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  borderRadius: 99,
                  minWidth: 18,
                  height: 18,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 5px",
                  lineHeight: 1,
                }}>
                  {newLeadsCount}
                </span>
              )}
            </div>
          ))}

          <div className="bk-nav-section">Business</div>

          {BUSINESS.map(({ label, Icon, href }) => (
            <div
              key={label}
              className={`bk-nav-item ${active === label ? "active" : ""}`}
              onClick={() => go(href)}
            >
              <Icon size={18} />
              {label}
            </div>
          ))}
        </nav>

        <div className="bk-sidebar-bottom">
          <div className="bk-nav-item danger" onClick={handleLogout}>
            <MdLogout size={18} />
            Logout
          </div>
        </div>
      </aside>
    </>
  );
}
