import React from "react";

export default function Stripe() {
  return (

    <div className="stripe-main-container mobile-none">
      <div className="container">
      <div className="stripe_items">
        <div className="feature-item">
          <img
            src="/assets/icons/icon1.svg"
            alt="Book Now"
            className="feature-icons"
          />
          <div>

            <h4>10+</h4>
            <p className="feature-text">Years of Expertise</p>

          </div>
        </div>
        <div className="feature-item">
          <img
            src="/assets/icons/icon2.svg"
            alt="stacked coins"
            className="feature-icons"
          />
           <div>

            <h4>5000+</h4>
            <p className="feature-text">Happy Clients</p>

          </div>
        </div>
        <div className="feature-item">
          <img
            src="/assets/icons/icon3.svg"
            alt="Representing personalised packages"
            className="feature-icons"
          />
           <div>

            <h4>500+</h4>
            <p className="feature-text">Hotel Collaboration</p>

          </div>
        </div>
        <div className="feature-item">
          <img
           src="/assets/icons/icon4.svg"
            alt="Representing 24/7 support"
            className="feature-icons"
          />
           <div>

            <h4>50+</h4>
            <p className="feature-text">Destinations</p>

          </div>
        </div>


          <div className="feature-item">
          <img
            src="/assets/icons/icon5.svg"
            alt="Representing 24/7 support"
            className="feature-icons"
          />
           <div>

            <h4>4.9 Google Reviews</h4>
            <p className="feature-text">675 Google Reviews</p>

          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
