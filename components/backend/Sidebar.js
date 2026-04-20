import { useRouter } from "next/router";
import {
  MdDashboard, MdLocationOn, MdApps, MdArticle, MdHelpOutline,
  MdPeople, MdAutorenew, MdNotificationsNone, MdStore,
  MdConfirmationNumber, MdReceipt, MdLogout,
} from "react-icons/md";
import { logout } from "../../utils/voucherAuth";

const NAV = [
  { label: "Dashboard",    Icon: MdDashboard,         href: "/dashboard" },
  { label: "Destinations", Icon: MdLocationOn,         href: "/dashboard/destinations" },
  { label: "All Packages", Icon: MdApps,               href: "/dashboard/packages" },
  { label: "Blogs",        Icon: MdArticle,            href: "#" },
  { label: "Faq's",        Icon: MdHelpOutline,        href: "#" },
];

const CRM = [
  { label: "Leads",      Icon: MdPeople,             href: "#" },
  { label: "Follow Up",  Icon: MdAutorenew,          href: "#" },
  { label: "Reminder",   Icon: MdNotificationsNone,  href: "#" },
  { label: "Vendors",    Icon: MdStore,              href: "#" },
  { label: "Voucher",    Icon: MdConfirmationNumber, href: "/dashboard/create-voucher" },
  { label: "Invoice",    Icon: MdReceipt,            href: "/dashboard/create-invoice" },
];

export default function Sidebar({ active, isOpen, onClose }) {
  const router = useRouter();

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
          <img src="/assets/images/dark-logo.svg" alt="TourWatchOut" />
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
