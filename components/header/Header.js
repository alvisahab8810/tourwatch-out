import Link from "next/link";
import React, { useState } from "react";

export default function Topbar() {
  const [pkgOpen, setPkgOpen] = useState(false);

  return (
    <>
      <style>{`
        .nav-dropdown { position: relative; }
        .nav-dropdown-toggle {
          display: flex; align-items: center; gap: 4px; cursor: pointer;
        }
        .nav-dropdown-toggle svg { transition: transform 0.2s; }
        .nav-dropdown-toggle.open svg { transform: rotate(180deg); }
        .nav-dropdown-menu {
          position: absolute; top: calc(100% + 0px); left: 50%;
          transform: translateX(-50%);
          background: #fff; border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          min-width: 190px; list-style: none; padding: 8px 0; margin: 0;
          z-index: 999;
          opacity: 0; visibility: hidden; pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
          transform: translateX(-50%) translateY(-4px);
        }
        .nav-dropdown:hover .nav-dropdown-menu,
        .nav-dropdown-menu.open {
          opacity: 1; visibility: visible; pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }
        .nav-dropdown-menu li a {
          display: block; padding: 10px 20px;
          font-size: 14px; color: #333; text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .nav-dropdown-menu li a:hover { background: #f0f6ff; color: #e84949; }
      `}</style>

      <div className="header-updated p-relative">
        <header className="d-flex flex-wrap top-bar p-absolute">
          <Link
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none desk-logo"
          >
            <img src="/assets/images/dark-logo.svg" alt="Logo Image" className="light-pages" />
            <img src="/assets/images/dark-logo.svg" alt="Logo Image" className="dark-pages d-none" />
          </Link>

          <ul className="menus nav nav-pills mobile-none">
            <li className="nav-item">
              <Link href="/" className="nav-link" aria-current="page">Home</Link>
            </li>

            {/* Packages dropdown */}
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
              <Link href="/dubai-package" className="nav-link" aria-current="page">Dubai</Link>
            </li>

            <li className="nav-item">
              <Link href="/blogs" className="nav-link">Blogs</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact-us" className="nav-link">Contact Us</Link>
            </li>
          </ul>

          <Link
            className="burger-menu desktop-none"
            data-bs-toggle="offcanvas"
            href="#offcanvasExample"
            role="button"
            aria-controls="offcanvasExample"
          >
            <img src="/assets/images/icons/menu.png" alt="Menu Png" />
          </Link>
        </header>
      </div>
    </>
  );
}
