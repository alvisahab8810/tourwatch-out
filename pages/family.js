import React, { useState } from "react";
import Link from "next/link";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
import BottomReviews from "../components/home/BottomReviews";
import FAQs from "../components/home/FAQs";
import Blogs from "../components/home/Blogs";
import Popup from "../components/corporate/Popup";
import NewFooter from "../components/footer/NewFooter";
import PromoSection from "../components/home/PromoSection";
import BenifitSection from "../components/home/BenifitSection";
import MostPopular from "../components/home/MostPopular";
import TopReviews from "../components/home/TopReviews";
import Instagram from "../components/home/Instagram";

const SUBTYPE_ORDER = ["Economy", "Deluxe", "Premium"];

const TAB_ICONS = {
  Economy: "/assets/images/dubai/itinerary/star.svg",
  Deluxe:  "/assets/images/dubai/itinerary/stars.svg",
  Premium: "/assets/images/dubai/itinerary/starss.svg",
};

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function getPackageHref(pkg) {
  if (pkg.destination?.toLowerCase() === "dubai") {
    return `/dubai/dubai-family?tab=${pkg.packageSubtype?.toLowerCase()}`;
  }
  return `/destination/${pkg.destSlug}/package/${pkg.id}`;
}

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

function PackageCard({ pkg }) {
  const href       = getPackageHref(pkg);
  const image      = pkg.webBanner?.src || "/assets/images/i-destination/dubai.webp";
  const hasDiscount = pkg.basePrice && pkg.finalPrice && pkg.basePrice !== pkg.finalPrice;
  const highlights  = pkg.destinationHighlights || "";

  return (
    <div className="new-desti-card">
      <Link href={href}>
        <img
          src={image}
          alt={pkg.webBanner?.alt || pkg.packageName}
          loading="lazy"
          width="400"
          height="284"
          style={{ width: "100%", height: 254, objectFit: "cover" }}
        />
      </Link>

      <div className="p-4">
        <div className="header">
          <h2>{(() => { const words = (pkg.packageName || pkg.destination || "").split(" "); return words.length > 2 ? words.slice(0, 2).join(" ") + "..." : words.join(" "); })()}</h2>
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
            <span>
              {highlights.slice(0, 100)}{highlights.length > 100 ? "…" : ""}
            </span>
          </div>
        )}

        {Array.isArray(pkg.amenities) && pkg.amenities.length > 0 && (
          <div className="icons" aria-label="Travel amenities">
            <ul className="amenities-icons">
              {pkg.amenities.map((a, i) => {
                const name = typeof a === "string" ? a : a?.name;
                const icon = (typeof a === "object" && a?.icon) || AMENITY_ICONS[name];
                return icon ? (
                  <li key={i}>
                    <img src={icon} alt={name} title={name} />
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
                Starting from <span className="oldcut">{fmt(pkg.basePrice)}</span>
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <p className="new-price" style={{ margin: 0 }}>{fmt(pkg.finalPrice || pkg.basePrice)}</p>
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

export default function FamilyPackages({ packages = [], initialTab = "", destName = "" }) {
  const subtypes = SUBTYPE_ORDER.filter(s => packages.some(p => p.packageSubtype === s));
  const [activeTab, setActiveTab] = useState(() => {
    const valid = SUBTYPE_ORDER.map(s => s.toLowerCase());
    if (initialTab && valid.includes(initialTab)) return initialTab;
    return subtypes[0]?.toLowerCase() || "economy";
  });

  const visiblePkgs = packages.filter(p => p.packageSubtype?.toLowerCase() === activeTab);
  const activeLabel = subtypes.find(s => s.toLowerCase() === activeTab) || "";

  return (
    <div className="dubai-family-package family-packages familypage">
      <Topbar />
      <Offcanvas />

      {/* Full-width hero banner */}
      <div className="packages-hero-area">
        <img
          src="/assets/images/family/hero-banner.webp"
          alt="Family Packages"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      <div className="package-details-page">
        <div className="container">
          <section className="package-details-tabs">

            {/* Tabs */}
            <div className="pdt-tabs-row">
              {subtypes.map(sub => {
                const id   = sub.toLowerCase();
                const icon = TAB_ICONS[sub] || TAB_ICONS.Economy;
                const best = sub === "Deluxe";
                return (
                  <button
                    key={sub}
                    className={`pdt-tab ${activeTab === id ? "is-active" : ""}`}
                    onClick={() => setActiveTab(id)}
                  >
                    <img src={icon} alt={sub} className="pdt-tab-icon" />
                    <span className="pdt-tab-label">{sub}</span>
                    {best && <span className="pdt-best">BEST VALUE</span>}
                  </button>
                );
              })}
            </div>

            {/* Section heading */}
            <div className="section-header" style={{ marginBottom: "2rem" }}>
              <h2 className="section-title">
                <span className="highlight">{activeLabel} {destName || "Family"} </span> Packages
              </h2>
              <p className="section-subtitle">Let's find out what suits you the best</p>
            </div>

            {/* Cards */}
            {visiblePkgs.length > 0 ? (
              <div className="national-list-bx">
                {visiblePkgs.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
                No packages available in this category yet.
              </p>
            )}

          </section>
        </div>
      </div>


      <PromoSection/>

      <BenifitSection/>
      <MostPopular/>

       <TopReviews/>
           
      
            <Instagram/>
      

      <FAQs />
      <Blogs />
      <Popup />
      <NewFooter />
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { dest: destSlug, tab } = query;
  const connectDB = require("../utils/mongodb").default;
  const Package   = require("../models/Package").default;
  const { readAll: readDests } = require("../utils/destStore");

  await connectDB();

  const allDests = readDests();
  const slugMap  = {};
  allDests.forEach(d => {
    slugMap[(d.name || d.title || "").toLowerCase()] = d.slug;
  });

  const filter = {
    packageType: { $regex: /^family$/i },
    status:      { $regex: /^active$/i },
  };

  let destName = "";
  if (destSlug) {
    const destObj = allDests.find(d => d.slug === destSlug);
    if (destObj) {
      destName = destObj.name || destObj.title || "";
      const names = [destObj.name, destObj.title].filter(Boolean);
      filter.destination = { $in: names };
    }
  }

  const raw = await Package.find(filter)
    .sort({ createdAt: 1 })
    .lean();

  const packages = raw
    .map(p => ({
      ...p,
      id:       p._id,
      destSlug:
        slugMap[p.destination?.toLowerCase()] ||
        p.destination?.toLowerCase().replace(/\s+/g, "-") ||
        "",
    }))
    .sort((a, b) =>
      SUBTYPE_ORDER.indexOf(a.packageSubtype) - SUBTYPE_ORDER.indexOf(b.packageSubtype)
    );

  return {
    props: {
      packages:   JSON.parse(JSON.stringify(packages)),
      initialTab: (tab || "").toLowerCase(),
      destName,
    },
  };
}
