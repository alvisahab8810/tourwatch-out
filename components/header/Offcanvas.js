import React, { useState } from "react";
import Link from "next/link";

export default function Offcanvas() {
  const [pkgOpen, setPkgOpen] = useState(false);

  return (
    <>
      <style>{`
        .mob-pkg-toggle {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 10px 0; cursor: pointer;
          font-size: 15px; color: #333; font-weight: 500;
          background: none; border: none; text-align: left;
        }
        .mob-pkg-toggle svg { transition: transform 0.2s; flex-shrink: 0; }
        .mob-pkg-toggle.open svg { transform: rotate(180deg); }
        .mob-pkg-submenu {
          max-height: 0; overflow: hidden;
          transition: max-height 0.25s ease;
          padding-left: 14px;
        }
        .mob-pkg-submenu.open { max-height: 200px; }
        .mob-pkg-submenu a {
          display: block; padding: 8px 0;
          font-size: 14px; color: #555; text-decoration: none;
        }
        .mob-pkg-submenu a:hover { color: #e84949; }
      `}</style>

      <div
        className="offcanvas mob-canvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            <Link
              href="/"
              className="d-flex align-items-center mb-md-0 me-md-auto text-dark text-decoration-none desk-logo"
            >
              <img src="/assets/images/logo.png" alt="Logo Image" />
            </Link>
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body">
          <div className="mob-menus">
            <ul className="nav nav-pills">

              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>

              {/* Packages collapsible */}
              <li className="nav-item" style={{ width: "100%" }}>
                <button
                  className={`mob-pkg-toggle${pkgOpen ? " open" : ""}`}
                  onClick={() => setPkgOpen(o => !o)}
                >
                  Packages
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className={`mob-pkg-submenu${pkgOpen ? " open" : ""}`}>
                  <Link href="/family" data-bs-dismiss="offcanvas">Family Packages</Link>
                  <Link href="/couple" data-bs-dismiss="offcanvas">Couple Packages</Link>
                </div>
              </li>

              {/* <li className="nav-item">
                <Link href="/dubai-package" className="nav-link">Dubai</Link>
              </li> */}
              <li className="nav-item">
                <Link href="/blogs" className="nav-link">Blogs</Link>
              </li>
              <li className="nav-item">
                <Link href="/contact-us" className="nav-link">Contact Us</Link>
              </li>

            </ul>
          </div>

          <img src="/assets/images/footer-vacation.webp" alt="Vacation" className="foot-img" />
        </div>
      </div>
    </>
  );
}
