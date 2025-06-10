import React from "react";

export default function Stripe() {
  return (

    <div className="stripe-main-container">
      <div className="container">
      <div className="stripe_items">
        <div className="feature-item">
          <img
            src="/assets/images/icons/stripe/img1.png"
            alt="Book Now"
            className="feature-icons"
          />
          <p className="feature-text">Hassle-free Booking</p>
        </div>
        <div className="feature-item">
          <img
            src="/assets/images/icons/stripe/img2.png"
            alt="stacked coins"
            className="feature-icons"
          />
          <p className="feature-text">Value For Money</p>
        </div>
        <div className="feature-item">
          <img
            src="/assets/images/icons/stripe/img3.png"
            alt="Representing personalised packages"
            className="feature-icons"
          />
          <p className="feature-text">Personalised Packages</p>
        </div>
        <div className="feature-item">
          <img
            src="/assets/images/icons/stripe/img4.png"
            alt="Representing 24/7 support"
            className="feature-icons"
          />
          <p className="feature-text">24/7 Support During Trip</p>
        </div>
      </div>
      </div>
    </div>
  );
}
