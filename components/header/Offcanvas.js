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
                <Link href="/about" className="nav-link ">
                  {" "}
                  Our Story
                </Link>
              </li>
              <li className="nav-item mob-dropdown">
              <div className="accordion" id="familyAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Family
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#familyAccordion"
                    >
                      <div className="accordion-body">
                        <ul className="list-unstyled">
                          <li><Link href="/family/national-destination">- National Destination</Link></li>
                          <li><Link href="/family/international-destination">- International Destination</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

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
