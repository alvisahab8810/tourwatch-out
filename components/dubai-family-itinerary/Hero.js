import React from "react";

export default function Hero() {
  return (
    <div className="container">
        <div className="dubai-gallery-section">
      <div className="dgs-grid">

        {/* BIG LEFT IMAGE */}
        <div className="dgs-big">
          <img
            src="/assets/images/dubai/itinerary/left.png"
            alt="Dubai main view"
          />
        </div>

        {/* RIGHT SIDE 4 IMAGES */}
        <div className="dgs-small-grid">
          <img
            src="/assets/images/dubai/itinerary/img.png"
            alt="Dubai attraction 1"
          />
          <img
           className="top-right-img"
            src="/assets/images/dubai/itinerary/img2.png"
            alt="Dubai attraction 2"
          />
          <img
            src="/assets/images/dubai/itinerary/img3.png"
            alt="Dubai attraction 3"
          />
          <img
           className="top-bottom-img"

            src="/assets/images/dubai/itinerary/img4.png"
            alt="Dubai attraction 4"
          />
        </div>

      </div>
    </div>
    </div>
  );
}
