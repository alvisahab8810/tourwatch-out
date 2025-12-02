import React from "react";

export default function WhyTourwatchout() {
  return (
    <section className="tw-why-tourwatchout">
      <div className="tw-container">
        <h2 className="tw-title">Why Tourwatchout</h2>

        <div className="tw-features-row">

          {/* 1 — Hassle-free Booking */}
          <div className="tw-feature-box">
            <img src="/assets/images/dubai/icons/icon.svg" alt="Hassle-free Booking" />
            <p>Hassle-free Booking</p>
          </div>

          {/* 2 — Value For Money */}
          <div className="tw-feature-box">
            <img src="/assets/images/dubai/icons/icon1.svg" alt="Value For Money" />
            <p>Value For Money</p>
          </div>

          {/* 3 — Personalized Packages */}
          <div className="tw-feature-box">
            <img src="/assets/images/dubai/icons/icon2.svg" alt="Personalised Packages" />
            <p>Personalised Packages</p>
          </div>

          {/* 4 — 24/7 Support */}
          <div className="tw-feature-box">
            <img src="/assets/images/dubai/icons/icon3.svg" alt="24/7 Support During Trip" />
            <p>24/7 Support During Trip</p>
          </div>

        </div>
      </div>
    </section>
  );
}
