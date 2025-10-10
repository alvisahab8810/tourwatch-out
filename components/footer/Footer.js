import React from "react";
import Link from "next/link";
export default function Footer() {
  return (
    <>
      <footer className="footer-area pt-5">
        <div className="container footer">
          <div className="row">
            <div className="col-md-4">
              <div className="logo">
                <Link
                  href="/"
                  className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
                >
                  {" "}
                  <img src="/assets/images/logo.png" alt="Logo Image" />{" "}
                </Link>{" "}
              </div>
              <p className="footer-para">
                We always provide the best
                <br /> service for our customers{" "}
              </p>
              <div className="social-icons">
                <Link href="https://wa.me/918882701800?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Tourwatchout">
                  {" "}
                  <i className="ri-whatsapp-line"></i>{" "}
                </Link>
                <Link href="https://www.instagram.com/tourwatchout/">
                  {" "}
                  <i className="ri-instagram-line"></i>{" "}
                </Link>
                <Link href="https://www.facebook.com/TourWatchout/">
                  {" "}
                  <i className="ri-facebook-fill"></i>{" "}
                </Link>
              </div>
            </div>
            <div className="col-md-3 pl-100">
              <h5> Popular </h5>
              <ul>
                <li>
                  {" "}
                  <Link href="/family/national-destination/kashmir">
                    {" "}
                    Kashmir{" "}
                  </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/family/national-destination/shimla">
                    {" "}
                    Shimla & Manali{" "}
                  </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/family/national-destination/dehradun">
                    {" "}
                    Dehradun & Mussoorie{" "}
                  </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/family/national-destination/dharamshala">
                    {" "}
                    Dharamshala{" "}
                  </Link>{" "}
                </li>
              </ul>
            </div>
            <div className="col-md-3 pl-50">
              <h5> Products </h5>
              <ul>
                <li>
                  {" "}
                  <Link href="/corporate"> Corporate </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/honeymoon"> Honeymoon </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/family/national-destination">National</Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/family/international-destination">
                    International{" "}
                  </Link>{" "}
                </li>
              </ul>
            </div>
            <div className="col-md-2">
              <h5> Other Links </h5>
              <ul>
                <li>
                  {" "}
                  <Link href="/privacy-policy"> Privacy Policy </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/term-and-conditions">
                    {" "}
                    Term & Conditions
                  </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/refund-cancellation-policy">
                    {" "}
                    Refund & Cancellation
                  </Link>{" "}
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center footer-area text-white mt-6 border-t border-gray-700 pt-6">
            <p className="mb-2 text-lg font-semibold">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-yellow-400">
                Realization Customer Services Pvt Ltd
              </span>
            </p>
            <p className="all-right text-gray-300">
              All rights reserved | Designed by{" "}
              <a
                href="https://viralon.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                Viralon
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
