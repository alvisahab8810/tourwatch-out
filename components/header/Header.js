import Link from "next/link";
import React from "react";

export default function Topbar() {
  return (
    <>
      <div className="container p-relative">
        <header className="d-flex flex-wrap top-bar p-absolute ">
          <Link
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none desk-logo"
          >
            <img src="/assets/images/logo.svg" alt="Logo Image"  className="light-pages"/>
            <img src="/assets/images/dark-logo.svg" alt="Logo Image"  className="dark-pages d-none"/>


          </Link>

          <ul className="menus nav nav-pills mobile-none">
             <li className="nav-item">
              <Link href="/" className="nav-link" aria-current="page">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link" aria-current="page">
                Our Story
              </Link>
            </li>

              <li className="nav-item">
              <Link href="/dubai-package" className="nav-link" aria-current="page">
                Dubai
              </Link>
            </li>
            {/* <li className="nav-item dropdown-main">
              <Link href="#" className="nav-link">
                Family <img src="/assets/images/drop.png" alt="Down Arrow"></img>
              </Link>

              <ul className="dropdown-items">
                  <li> <Link href="/family/national-destination">National</Link> </li>
                  <li> <Link href="/family/international-destination">International</Link> </li>
                </ul>
            </li> */}
            {/* <li className="nav-item">
              <Link href="/corporate" className="nav-link">
                Corporate
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/honeymoon" className="nav-link">
                Honeymoon
              </Link>
            </li> */}

            <li className="nav-item">
              <Link href="/blogs" className="nav-link">
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact-us" className="nav-link">
                Contact Us
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link href="#" className="nav-link btn-primary">
                Login
              </Link>
            </li> */}
          </ul>

          <Link
            className="burger-menu desktop-none"
            data-bs-toggle="offcanvas"
            href="#offcanvasExample"
            role="button"
            aria-controls=" offcanvasExample"
          >
            <img src="/assets/images/icons/menu.png" alt="Menu Png" />
          </Link>
        </header>

      </div>
    </>
  );
}
