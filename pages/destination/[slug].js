import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Topbar from "../../components/header/Header";
import Offcanvas from "../../components/header/Offcanvas";
import NewFooter from "../../components/footer/NewFooter";
import Popup from "../../components/corporate/Popup";
import TopReviews from "../../components/home/TopReviews";
import FAQs from "../../components/home/FAQs";
import WhatMakeus from "../../components/home/WhatMakeus";
import BenifitSection from "../../components/home/BenifitSection";
import MostPopular from "../../components/home/MostPopular";
import Blogs from "../../components/home/Blogs";
import BottomReviews from "../../components/home/BottomReviews";
import BottomReviewsMobile from "../../components/home/BottomReviewsMobile";

const PKG_TYPES   = ["Family", "Couple"];
const PER_PAGE    = 9;

const AMENITY_ICONS = {
  Meals:            "/assets/images/icons/itinerary/icon1.svg",
  Hotel:            "/assets/images/icons/itinerary/icon2.svg",
  Sightseeing:      "/assets/images/icons/itinerary/icon3.svg",
  WiFi:             "/assets/images/icons/itinerary/icon4.svg",
  Transport:        "/assets/images/icons/itinerary/icon5.svg",
  "Local Guide":    "/assets/images/icons/itinerary/icon6.svg",
  "Safe to Travel": "/assets/images/icons/itinerary/icon7.svg",
  "DJ Night":       "/assets/images/icons/itinerary/icon8.svg",
};

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export async function getServerSideProps({ params }) {
  const { readAll: readDests } = require("../../utils/destStore");
  const connectDB = require("../../utils/mongodb").default;
  const Package   = require("../../models/Package").default;

  const { slug } = params;
  const dest = readDests().find(d => d.slug === slug && d.status === "Active");
  if (!dest) return { notFound: true };

  await connectDB();
  const raw = await Package.find({
    destination: { $in: [dest.name, dest.title] },
    status:      { $regex: /^active$/i },
  }).lean();

  const pkgs = raw.map(p => ({ ...p, id: p._id }));

  return {
    props: {
      dest:     JSON.parse(JSON.stringify(dest)),
      packages: JSON.parse(JSON.stringify(pkgs)),
    }
  };
}

function PackageCard({ dest, pkg, pkgType }) {
  const image =
    pkg.webBanner?.src ||
    pkg.mobileBanner?.src ||
    pkg.gallery?.[0]?.src ||
    dest.images?.[pkgType]?.[pkg.packageSubtype]?.src ||
    dest.mainImage?.src ||
    "/assets/images/i-destination/dubai.webp";

  const href        = `/destination/${dest.slug}/package/${pkg.id}`;
  const basePrice   = Number(pkg.basePrice  || 0);
  const finalPrice  = Number(pkg.finalPrice || pkg.basePrice || 0);
  const hasDiscount = basePrice > 0 && finalPrice > 0 && basePrice !== finalPrice;
  const highlights  = pkg.destinationHighlights || "";

  const pkgWords  = (pkg.packageName || "").split(" ");
  const shortName = pkgWords.length > 2 ? pkgWords.slice(0, 2).join(" ") + "..." : pkg.packageName || "";

  return (
    <div className="new-desti-card">
      <Link href={href}>
        <img
          src={image}
          alt={pkg.webBanner?.alt || pkg.packageName}
          loading="lazy"
          width="400"
          height="254"
          style={{ width: "100%", height: 254, objectFit: "cover" }}
        />
      </Link>

      <div className="p-4">
        <div className="header">
          <h2>{shortName}</h2>
          <div className="share-area">
            <span className="duration-badge">{pkg.duration}</span>
            <Link href={href}>
              <img src="/assets/images/icons/share.svg" alt="share" />
            </Link>
          </div>
        </div>

        {highlights && (
          <div className="location">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span>{highlights.slice(0, 100)}{highlights.length > 100 ? "…" : ""}</span>
          </div>
        )}

        {Array.isArray(pkg.amenities) && pkg.amenities.length > 0 && (
          <div className="icons" aria-label="Travel amenities">
            <ul className="amenities-icons">
              {pkg.amenities.map((a, i) => {
                const aname = typeof a === "string" ? a : a?.name;
                const icon  = (typeof a === "object" && a?.icon) || AMENITY_ICONS[aname];
                return icon ? (
                  <li key={i}>
                    <img src={icon} alt={aname} title={aname} />
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}

        <div className="price-section">
          <div className="price-info">
            {hasDiscount && (
              <p className="old-price">
                Starting from <span className="oldcut">{fmt(basePrice)}</span>
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <p className="new-price" style={{ margin: 0 }}>{fmt(finalPrice)}</p>
              <span style={{ fontSize: 9, fontWeight: 700, background: "#e84949", color: "#fff", borderRadius: 4, padding: "2px 6px", letterSpacing: 0.3, whiteSpace: "nowrap" }}>Incl. taxes</span>
            </div>
            <p className="price-desc">{pkg.priceType || "02 Couples"}</p>
          </div>
          <div className="contact-icons">
            <Link href="tel:+918882701800">
              <img src="/assets/images/hero/icons/call.svg" alt="Call" className="contact-icon" />
            </Link>
            <Link href="https://wa.link/pshqg5">
              <img src="/assets/images/hero/icons/whatsapp.svg" alt="WhatsApp" className="contact-icon" />
            </Link>
          </div>
        </div>

        <Link href={href} className="package-button" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          View Package
        </Link>
      </div>
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;

  // Build page numbers — show at most 5, with ellipsis if needed
  const pages = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }

  return (
    <div className="dp-pagination">
      <button
        className="dp-pg-btn dp-pg-arrow"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
      >
        &#8249;
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="dp-pg-ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`dp-pg-btn${current === p ? " dp-pg-active" : ""}`}
            onClick={() => onChange(p)}
            aria-current={current === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="dp-pg-btn dp-pg-arrow"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Next page"
      >
        &#8250;
      </button>
    </div>
  );
}

function PackageSection({ dest, pkgType, pkgs }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(pkgs.length / PER_PAGE);
  const visible    = pkgs.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const name       = dest.name || dest.title;

  const handlePage = (p) => {
    setPage(p);
    // Scroll to section top smoothly
    document.getElementById(`section-${pkgType}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id={`section-${pkgType}`} className="family-dubai-packages">
      <div className="mini-container1">
        <div className="section-header">
          <p className="section-subtitle">Recommended</p>
          <h2 className="section-title">
            <span className="highlight">{pkgType} {name} </span> Packages
          </h2>
          {totalPages > 1 && (
            <p className="dp-pg-count">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, pkgs.length)} of {pkgs.length} packages
            </p>
          )}
        </div>

        <div className="national-list-bx">
          {visible.map(pkg => (
            <PackageCard key={pkg.id} dest={dest} pkg={pkg} pkgType={pkgType} />
          ))}
        </div>

        <Pagination current={page} total={totalPages} onChange={handlePage} />
      </div>
    </section>
  );
}

export default function DestinationPage({ dest, packages }) {
  const banner = dest.mainImage?.src || dest.images?.Family?.Economy?.src;
  const name   = dest.name || dest.title;

  const byType = {};
  PKG_TYPES.forEach(t => { byType[t] = []; });
  packages.forEach(p => {
    const t = PKG_TYPES.find(x => x.toLowerCase() === (p.packageType || "").toLowerCase());
    if (t) byType[t].push(p);
  });
  const typesWithPackages = PKG_TYPES.filter(t => byType[t].length > 0);

  return (
    <div className="dyna-destination-pages">
      <Head>
        <title>{name} Packages — TourWatchOut</title>
        <meta name="description" content={`Explore ${name} packages — Economy, Deluxe and Premium options for Family and Couple travel.`} />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </Head>

      <Topbar />
      <Offcanvas />

      {/* ── Hero Banner ── */}
      <section className="dubai-hero" style={{ backgroundImage: banner ? `url(${banner})` : "none" }}>
        <div className="container">
          <div className="contain-hero">
            <div className="hero-content">
              <p className="hero-subtitle">Your Dream Destination Just One Click Away</p>
              <h1 className="hero-title">
                <span className="highlight">{name}</span>
                {dest.state ? ` — ${dest.state}, ` : " — "}{dest.country}
              </h1>
              <img src="/assets/images/hero/horizontal.svg" className="mobile-none" alt="" />
              <button
                className="cta-button interactive"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalCenter"
              >
                Request A Call Back
              </button>
            </div>
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-icon">
                  <img src="/assets/images/icons/home/icon1.svg" alt="Experience icon" />
                </div>
                <div className="stat-content">
                  <h3>10+</h3>
                  <p>Years of Expertise</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <img src="/assets/images/icons/home/icon2.svg" alt="Clients icon" />
                </div>
                <div className="stat-content">
                  <h3>5000+</h3>
                  <p>Happy Clients</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <img src="/assets/images/icons/home/icon3.svg" alt="Hotels icon" />
                </div>
                <div className="stat-content">
                  <h3>500+</h3>
                  <p>Hotel Collaboration</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <img src="/assets/images/icons/home/icon4.svg" alt="Destinations icon" />
                </div>
                <div className="stat-content">
                  <h3>50+</h3>
                  <p>Destinations</p>
                </div>
              </div>
              <div className="stat-item mobile-none">
                <img src="/assets/images/icons/home/review.svg" alt="Google Reviews" />
                <div className="stat-content">
                  <h3>4.9 Reviews</h3>
                  <p>Customer Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatMakeus />
      {/* <BenifitSection /> */}

      {typesWithPackages.length === 0 && (
        <section className="family-dubai-packages">
          <div className="mini-container1">
            <p style={{ textAlign: "center", padding: "2rem 0", color: "#888" }}>
              No packages available yet for this destination. Check back soon!
            </p>
          </div>
        </section>
      )}

      {typesWithPackages.map(pkgType => (
        <PackageSection key={pkgType} dest={dest} pkgType={pkgType} pkgs={byType[pkgType]} />
      ))}

      <TopReviews />
      <MostPopular />
      <FAQs />
      <BottomReviews />
      <BottomReviewsMobile />
      <Blogs />
      <Popup />
      <NewFooter />
    </div>
  );
}
