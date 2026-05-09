import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getUser, getToken, clearSession } from "../../utils/userAuth";
import toast from "react-hot-toast";

export default function Topbar() {
  const [pkgOpen,     setPkgOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user,        setUser]        = useState(null);
  const router   = useRouter();
  const dropRef  = useRef(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const token = getToken();
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    clearSession();
    setUser(null);
    setProfileOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
  }

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <div className="header-updated p-relative">
        <header className="d-flex flex-wrap top-bar p-absolute">
          <Link
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none desk-logo"
          >
            <img src="/assets/images/dark-logo.svg" alt="Logo" className="light-pages" />
            <img src="/assets/images/dark-logo.svg" alt="Logo" className="dark-pages d-none" />
          </Link>

          <ul className="menus nav nav-pills mobile-none" style={{ alignItems: "center" }}>
            <li className="nav-item">
              <Link href="/" className="nav-link">Home</Link>
            </li>

            <li className="nav-item nav-dropdown">
              <span
                className={`nav-link nav-dropdown-toggle${pkgOpen ? " open" : ""}`}
                onClick={() => setPkgOpen(o => !o)}
              >
                Packages
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
              <ul className={`nav-dropdown-menu${pkgOpen ? " open" : ""}`}>
                <li><Link href="/family" onClick={() => setPkgOpen(false)}>Family Packages</Link></li>
                <li><Link href="/couple" onClick={() => setPkgOpen(false)}>Couple Packages</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link href="/blogs" className="nav-link">Blogs</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact-us" className="nav-link">Contact Us</Link>
            </li>

            {/* Auth area */}
            <li className="nav-item" style={{ marginLeft: 8 }}>
              {user ? (
                <div className="profile-dropdown-wrap" ref={dropRef}>
                  <div className="profile-trigger" onClick={() => setProfileOpen(o => !o)}>
                    <div className="profile-avatar">
                      {user.profileImage
                        ? <img src={user.profileImage} alt={user.name} />
                        : initials}
                    </div>
                    <span className="profile-name">{user.name}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>

                  <div className={`profile-menu${profileOpen ? " open" : ""}`}>
                    {/* User info header */}
                    <div style={{ padding: "12px 20px 10px", borderBottom: "1px solid #f0f0f0" }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{user.email}</div>
                    </div>

                    <Link href="/profile" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      View Profile
                    </Link>

                    <Link href="/profile?tab=password" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Change Password
                    </Link>

                    <Link href="/profile?tab=trips" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      Trips
                    </Link>

                    <div className="profile-menu-divider" />

                    <button className="profile-menu-item profile-menu-logout" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e84949" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="nav-login-btn">Login</Link>
              )}
            </li>
          </ul>

          <Link
            className="burger-menu desktop-none"
            data-bs-toggle="offcanvas"
            href="#offcanvasExample"
            role="button"
            aria-controls="offcanvasExample"
          >
            <img src="/assets/images/icons/menu.png" alt="Menu" />
          </Link>
        </header>
      </div>
    </>
  );
}
