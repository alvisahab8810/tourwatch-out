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
import BenifitSection from "../../components/home/BenifitSection";

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
  // Find the package with the lowest final price to derive both prices
  const priced = pkgsForCategory
    .map(p => ({ base: Number(p.basePrice || 0), final: Number(p.finalPrice || p.basePrice || 0) }))
    .filter(p => p.final > 0);
  priced.sort((a, b) => a.final - b.final);
  const minFinal = priced.length > 0 ? priced[0].final : 0;
  const minBase  = priced.length > 0 ? priced[0].base  : 0;
  const hasDiscount = minBase > 0 && minBase !== minFinal;

  const image =
    dest.images?.[pkgType]?.[subtype]?.src ||
    dest.mainImage?.src ||
    "/assets/images/i-destination/dubai.webp";

  const href = `/${pkgType.toLowerCase()}?dest=${dest.slug}&tab=${subtype.toLowerCase()}`;
  const name = dest.name || dest.title;

  return (
    <Link href={href} className="dest-cat-link">
      <div className="dest-cat-card">
        <img src={image} alt={`${subtype} ${name}`} className="dest-cat-bg" />
        <div className="dest-cat-gradient" />
        <div className="dest-cat-content">
          <h2>{subtype} {name}</h2>
          {minFinal > 0 && (
            <div className="price-section">
              <div className="price-info">
                {hasDiscount ? (
                  <p className="old-price">
                    Starting from <span className="oldcut">{fmt(minBase)}</span>
                  </p>
                ) : (
                  <p className="old-price">Starting from</p>
                )}
                <p className="new-price">{fmt(minFinal)}</p>
              </div>
            </div>
          )}
          <div className="package-button interactive">View Packages</div>
        </div>
      </div>
    </Link>
  );
}

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
        <div className="dest-cat-row">
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

      <BenifitSection/>

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
