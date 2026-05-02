import React from "react";
import Head from "next/head";
import Link from "next/link";
import Topbar from "../../components/header/Header";
import Offcanvas from "../../components/header/Offcanvas";
import NewFooter from "../../components/footer/NewFooter";
import Popup from "../../components/corporate/Popup";
import TopReviews from "../../components/home/TopReviews";
import FAQs from "../../components/home/FAQs";
import WhatMakeus from "../../components/home/WhatMakeus";
import MostPopular from "../../components/home/MostPopular";
import Blogs from "../../components/home/Blogs";
import BottomReviews from "../../components/home/BottomReviews";
import BottomReviewsMobile from "../../components/home/BottomReviewsMobile";

const PKG_TYPES = ["Family", "Couple"];
const SUBTYPES  = ["Economy", "Deluxe", "Premium"];


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
    },
  };
}

function CategoryCard({ dest, pkgType, subtype, packages }) {
  const pkgsForCategory = packages.filter(
    p => p.packageType?.toLowerCase()    === pkgType.toLowerCase() &&
         p.packageSubtype?.toLowerCase() === subtype.toLowerCase()
  );
  const prices = pkgsForCategory
    .map(p => Number(p.finalPrice || p.basePrice || 0))
    .filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const image =
    dest.images?.[pkgType]?.[subtype]?.src ||
    dest.mainImage?.src ||
    "/assets/images/i-destination/dubai.webp";

  const href = `/${pkgType.toLowerCase()}?dest=${dest.slug}&tab=${subtype.toLowerCase()}`;
  const name = dest.name || dest.title;

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flex: "1 1 0", minWidth: 240, maxWidth: 400 }}>
      <div style={cs.card}>
        {/* True background image — absolutely fills the card */}
        <img src={image} alt={`${subtype} ${pkgType} ${name}`} style={cs.bgImg} />

        {/* Dark gradient so text is always legible */}
        <div style={cs.gradient} />

        {/* Top row: type badge + share icon */}
        <div style={cs.topRow}>
          <span className="duration-badge">{pkgType}</span>
          <img src="/assets/images/hero/icons/share1.svg" alt="share" style={{ width: 22 }} />
        </div>

        {/* Bottom overlay: title + price + button */}
        <div style={cs.bottom}>
          <h2 style={cs.title}>{subtype} {name}</h2>
          {minPrice > 0 && (
            <div className="price-section" style={{ marginBottom: 12 }}>
              <div className="price-info">
                <p className="old-price" style={{ color: "rgba(255,255,255,0.75)" }}>Starting from</p>
                <p className="new-price">{fmt(minPrice)}</p>
              </div>
            </div>
          )}
          <div className="package-button interactive" style={{ textAlign: "center" }}>
            View Packages
          </div>
        </div>
      </div>
    </Link>
  );
}

const cs = {
  card: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    height: 380,
    width: "100%",
    boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
    cursor: "pointer",
  },
  bgImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  gradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.78) 100%)",
  },
  topRow: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "0 16px 16px",
    zIndex: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 8px",
    lineHeight: 1.3,
    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
  },
};

function CategorySection({ dest, pkgType, packages }) {
  const name = dest.name || dest.title;
  return (
    <section className="family-dubai-packages">
      <div className="mini-container1">
        <div className="section-header">
          <p className="section-subtitle">Recommended</p>
          <h2 className="section-title">
            <span className="highlight">{pkgType} {name} </span> Packages
          </h2>
        </div>
        <div className="family-dubai-row">
          {SUBTYPES.map(sub => (
            <CategoryCard
              key={sub}
              dest={dest}
              pkgType={pkgType}
              subtype={sub}
              packages={packages}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DestinationPage({ dest, packages }) {
  const banner = dest.mainImage?.src || dest.images?.Family?.Economy?.src;
  const name   = dest.name || dest.title;

  // Show a section for a type if it has packages OR has any category image configured
  const typesToShow = PKG_TYPES.filter(t =>
    packages.some(p => p.packageType?.toLowerCase() === t.toLowerCase()) ||
    SUBTYPES.some(s => dest.images?.[t]?.[s]?.src)
  );

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

      {typesToShow.length === 0 && (
        <section className="family-dubai-packages">
          <div className="mini-container1">
            <p style={{ textAlign: "center", padding: "2rem 0", color: "#888" }}>
              No packages available yet for this destination. Check back soon!
            </p>
          </div>
        </section>
      )}

      {typesToShow.map(pkgType => (
        <CategorySection key={pkgType} dest={dest} pkgType={pkgType} packages={packages} />
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
