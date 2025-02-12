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
            <img src="./assets/images/logo.png" alt="Logo Image" />
          </Link>

          <ul className="menus nav nav-pills mobile-none">
            <li className="nav-item">
              <Link href="/about" className="nav-link" aria-current="page">
                Our Story
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                Family
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/corporate" className="nav-link">
                Corporate
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/honeymoon" className="nav-link">
                Honeymoon
              </Link>
            </li>

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
            <img src="./assets/images/icons/menu.png" alt="Menu Png" />
          </Link>
        </header>

        {/* <!-- ================== Mobile Menus Area ========================== --> */}

        <div
          class="offcanvas mob-canvas offcanvas-start"
          tabindex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">
              <a
                href="index.html"
                class="d-flex align-items-center  mb-md-0 me-md-auto text-dark text-decoration-none desk-logo"
              >
                <img src="./assets/images/logo.png" alt="Logo Image" />
              </a>
            </h5>
            <button
              type="button"
              class="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <div class="mob-menus">
              <ul class=" nav nav-pills">
                <li class="nav-item">
                  <a href="#" class="nav-link ">
                    {" "}
                    Home
                  </a>
                </li>
                <li class="nav-item">
                  <a href="about-us.html" class="nav-link">
                    Contact
                  </a>
                </li>
                <li class="nav-item">
                  <a href="services.html" class="nav-link">
                    Holiday
                  </a>
                </li>
                <li class="nav-item">
                  <a href="gaellery.html" class="nav-link">
                    Gallery
                  </a>
                </li>
                <li class="nav-item">
                  <a href="contact-us.html" class="nav-link">
                    Destination
                  </a>
                </li>
              </ul>
            </div>

            <div class="mob-social-mediabx">
              <ul>
                <li>
                  <i class="ri-facebook-fill"></i>
                </li>
                <li>
                  <i class="ri-twitter-x-line"></i>
                </li>
                <li>
                  <i class="ri-instagram-line"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <!-- ================== Mobile Menus Area ========================== --> */}
      </div>
    </>
  );
}
