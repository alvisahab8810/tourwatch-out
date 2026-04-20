import React from "react";
import Link from "next/link";

const SUBTYPE_TAB = {
  Economy: "economy",
  Deluxe:  "deluxe",
  Premium: "premium",
  Basic:   "basic",
};

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function PackageCard({ pkg }) {
  const tab = SUBTYPE_TAB[pkg.packageSubtype] || pkg.packageSubtype?.toLowerCase() || "economy";
  const href = `/dubai/dubai-family?tab=${tab}`;
  const image = pkg.webBanner?.src || "/assets/images/i-destination/dubai.webp";

  return (
    <div className="new-desti-card f-dubai-card">
      <div className="f-dubai-main-card">
        {image && (
          <div className="f-dubai-img-wrap">
            <img src={image} alt={pkg.webBanner?.alt || pkg.packageName} className="f-dubai-card-img" />
          </div>
        )}
        <div className="header">
          <div>
            <Link href={href}>
              <span className="duration-badge">{pkg.duration}</span>
            </Link>
          </div>
          <div className="share-area">
            <Link href={href}>
              <img src="/assets/images/hero/icons/share1.svg" alt="share icon" />
            </Link>
          </div>
        </div>

        <div className="f-dubai-contanetbx">
          <div className="header">
            <Link href={href}>
              <h2>{pkg.packageSubtype} Dubai</h2>
            </Link>
          </div>

          <Link href={href}>
            <div className="price-section">
              <div className="price-info">
                {pkg.basePrice && pkg.basePrice !== pkg.finalPrice && (
                  <p className="old-price">
                    Starting from <span className="oldcut">{fmt(pkg.basePrice)}</span>
                  </p>
                )}
                <p className="new-price">{fmt(pkg.finalPrice || pkg.basePrice)}</p>
              </div>
            </div>
          </Link>

          {pkg.destinationHighlights && (
            <Link href={href}>
              <div className="location">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                </svg>
                <span>{pkg.destinationHighlights.slice(0, 80)}{pkg.destinationHighlights.length > 80 ? "…" : ""}</span>
              </div>
            </Link>
          )}

          {Array.isArray(pkg.amenities) && pkg.amenities.length > 0 && (
            <div className="icons" aria-label="Travel icons">
              <Link href={href}>
                <ul className="amenities-icons">
                  {pkg.amenities.slice(0, 8).map((_, i) => (
                    <li key={i}>
                      <img src={`/assets/images/hero/icons/amenities/icon${i + 1}.svg`} alt="" />
                    </li>
                  ))}
                </ul>
              </Link>
            </div>
          )}

          <Link href={href} className="package-button interactive">
            View Package
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FamilyDubaiPackages({ packages = [] }) {
  if (!packages.length) return null;

  return (
    <section className="family-dubai-packages">
      <div className="mini-container1">
        <div className="section-header">
          <p className="section-subtitle">Recommended</p>
          <h2 className="section-title">
            <span className="highlight">Family Dubai </span> Packages
          </h2>
        </div>

        <div className="family-dubai-row">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
