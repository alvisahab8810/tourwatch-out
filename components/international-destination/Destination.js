import React from "react";
import Link from "next/link";

const AMENITY_ICONS = [1, 2, 3, 4, 5, 6, 7, 8];

function fmt(n) {
  if (!n) return "";
  return Number(n).toLocaleString("en-IN");
}

function IntlCard({ d }) {
  const img  = d.images?.economy || d.images?.deluxe || "/assets/images/i-destination/dubai.webp";
  const slug = d.slug || d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const locs = Array.isArray(d.locations) ? d.locations : String(d.locations || "").split(",").map(s => s.trim()).filter(Boolean);

  return (
    <div className="new-desti-card">
      <img
        src={img}
        alt={d.title}
        loading="lazy"
        width="400"
        height="250"
        style={{ width: "100%", height: 250, objectFit: "cover" }}
      />
      <div className="p-4">
        <div className="header">
          <h2>{d.title}</h2>
          <div className="share-area">
            <span className="duration-badge">{d.duration || "5N/6D"}</span>
            <Link href="#">
              <img src="/assets/images/icons/share.png" alt="share" />
            </Link>
          </div>
        </div>
        <div className="location">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          <span>
            {locs.length > 0 ? locs.join(" • ") : d.country || ""}
          </span>
        </div>
        <div className="icons" aria-label="Travel amenities">
          <ul className="amenities-icons">
            {AMENITY_ICONS.map(n => (
              <li key={n}>
                <img src={`/assets/images/icons/amenities/icon${n}.png`} alt="" />
              </li>
            ))}
          </ul>
        </div>
        <div className="price-section">
          <div className="price-info">
            {d.oldPrice && (
              <p className="old-price">
                Starting from <span className="oldcut">₹{fmt(d.oldPrice)}</span>
              </p>
            )}
            <p className="new-price">₹{fmt(d.price) || "Contact us"}</p>
            <p className="price-desc">per person on twin sharing</p>
          </div>
          <Link href={`/family/international-destination/${slug}`}>View Package</Link>
        </div>
      </div>
    </div>
  );
}

export default function Destination({ destinations = [] }) {
  return (
    <div>
      <section className="international-main destination-row pt-80 mob-pad">
        <div className="container">
          <div className="row w-100">
            <div className="content-section">
              <h1>Top Travel Packages</h1>
              <p className="mt-4 mb-5">
                Explore our most popular packages, loved by travelers worldwide.
              </p>
            </div>
          </div>

          <div className="national-list-bx">
            {destinations.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
                No international destinations available at the moment.
              </p>
            ) : (
              destinations.map(d => <IntlCard key={d.id} d={d} />)
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
