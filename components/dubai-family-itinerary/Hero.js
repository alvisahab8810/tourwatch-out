import React from "react";

export default function Hero({ packages = [] }) {
  const pkg = packages[0];

  const bigSrc  = pkg?.webBanner?.src  || "/assets/images/dubai/itinerary/left.png";
  const bigAlt  = pkg?.webBanner?.alt  || "Dubai main view";
  const gallery = pkg?.gallery         || [];

  const small = [0, 1, 2, 3].map(i => ({
    src: gallery[i]?.src || `/assets/images/dubai/itinerary/img${i === 0 ? "" : i + 1}.png`,
    alt: gallery[i]?.alt || `Dubai attraction ${i + 1}`,
  }));

  return (
    <div className="container mobile-none">
      <div className="dubai-gallery-section">
        <div className="dgs-grid">
          <div className="dgs-big">
            <img src={bigSrc} alt={bigAlt} />
          </div>
          <div className="dgs-small-grid">
            <img src={small[0].src} alt={small[0].alt} />
            <img className="top-right-img"  src={small[1].src} alt={small[1].alt} />
            <img src={small[2].src} alt={small[2].alt} />
            <img className="top-bottom-img" src={small[3].src} alt={small[3].alt} />
          </div>
        </div>
      </div>
    </div>
  );
}
