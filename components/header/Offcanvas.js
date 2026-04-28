import React from "react";
import Link from "next/link";

export default function Offcanvas() {
  return (
    <>
      <div
        className="offcanvas mob-canvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            <Link
              href="index.html"
              className="d-flex align-items-center  mb-md-0 me-md-auto text-dark text-decoration-none desk-logo"
            >
              <img src="/assets/images/logo.png" alt="Logo Image" />
            </Link>
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mob-menus">
            <ul className=" nav nav-pills">

               <li className="nav-item">
                <Link href="/" className="nav-link ">
                  {" "}
                  Home
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link href="/about" className="nav-link ">
                  {" "}
                  Our Story
                </Link>
              </li> */}


              <li className="nav-item">
                <Link href="/dubai-package" className="nav-link ">
                  {" "}
                 Dubai
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/family" className="nav-link">
                  Family
                </Link>
              </li>
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
                <Link href="contact-us" className="nav-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>


          <img src="/assets/images/footer-vacation.webp" alt="Logo Image"  className="foot-img"/>
          {/* 
      <div className="mob-social-mediabx">
        <ul>
          <li>
            <i className="ri-facebook-fill"></i>
          </li>
          <li>
            <i className="ri-twitter-x-line"></i>
          </li>
          <li>
            <i className="ri-instagram-line"></i>
          </li>

        </ul>

      </div> */}
        </div>
      </div>
    </>
  );
}
