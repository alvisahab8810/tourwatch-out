import React from "react";
import Head from "next/head";
import Link from "next/link";
import Topbar from "../../components/header/Header";
import Offcanvas from "../../components/header/Offcanvas";
import NewFooter from "../../components/footer/NewFooter";
import Popup from "../../components/corporate/Popup";
import TopReviews from "../../components/home/TopReviews";
import FAQs from "../../components/home/FAQs";

const PKG_TYPES    = ["Family", "Couple"];
const PKG_SUBTYPES = ["Economy", "Deluxe", "Premium"];

const SUBTYPE_COLORS = {
  Economy: { bg: "#fff7ed", badge: "#f97316" },
  Deluxe:  { bg: "#eff6ff", badge: "#2563eb" },
  Premium: { bg: "#fdf4ff", badge: "#9333ea" },
};

export async function getServerSideProps({ params }) {
  const { readAll: readDests } = require("../../utils/destStore");
  const { readAll: readPkgs  } = require("../../utils/packageStore");

  const { slug } = params;
  const all = readDests();
  const dest = all.find(d => d.slug === slug && d.status === "Active");

  if (!dest) return { notFound: true };

  const pkgs = readPkgs().filter(
    p => (p.destination === dest.name || p.destination === dest.title) && p.status === "Active"
  );

  return {
    props: {
      dest:     JSON.parse(JSON.stringify(dest)),
      packages: JSON.parse(JSON.stringify(pkgs)),
    }
  };
}

function PackageCard({ dest, pkgType, subtype, linkedPkg }) {
  const imgObj = dest.images?.[pkgType]?.[subtype];
  const image  = imgObj?.src;
  if (!image) return null; // skip if no image set

  const clr  = SUBTYPE_COLORS[subtype] || {};
  const href = linkedPkg
    ? `/destination/${dest.slug}/package/${linkedPkg.id}`
    : `#`;

  const price = linkedPkg
    ? Number(linkedPkg.finalPrice || linkedPkg.basePrice || 0)
    : null;

  return (
    <div className="dp-pkg-card">
      <div className="dp-pkg-img-wrap">
        <img src={image} alt={imgObj?.alt || `${dest.name} ${subtype}`} />
        <span className="dp-pkg-badge" style={{ background: clr.badge }}>{subtype}</span>
      </div>
      <div className="dp-pkg-body">
        <h3 className="dp-pkg-title">{subtype} {dest.name || dest.title}</h3>
        {linkedPkg && (
          <>
            <p className="dp-pkg-duration">{linkedPkg.duration}</p>
            {price > 0 && (
              <p className="dp-pkg-price">
                Starting from <strong>₹{price.toLocaleString("en-IN")}</strong>
              </p>
            )}
          </>
        )}
        <Link href={href} className="dp-view-btn">
          View Package
        </Link>
      </div>
    </div>
  );
}

export default function DestinationPage({ dest, packages }) {
  const banner = dest.mainImage?.src || dest.images?.Family?.Economy?.src;
  const name   = dest.name || dest.title;

  // Map packages by type+subtype for linking
  const pkgMap = {};
  packages.forEach(p => {
    const key = `${p.packageType}__${p.packageSubtype}`;
    if (!pkgMap[key]) pkgMap[key] = p;
  });

  // Determine which types have at least one image
  const typesWithImages = PKG_TYPES.filter(t =>
    PKG_SUBTYPES.some(s => dest.images?.[t]?.[s]?.src)
  );

  return (
    <>
      <Head>
        <title>{name} Packages — TourWatchOut</title>
        <meta name="description" content={`Explore ${name} packages — Economy, Deluxe and Premium options for Family and Couple travel.`} />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </Head>

      <Topbar />
      <Offcanvas />

      {/* ── Hero Banner ── */}
      <div className="dp-hero" style={{ backgroundImage: banner ? `url(${banner})` : "none" }}>
        <div className="dp-hero-overlay">
          <div className="mini-container1">
            <h1 className="dp-hero-title">{name}</h1>
            <p className="dp-hero-sub">
              {dest.state ? `${dest.state}, ` : ""}{dest.country}
            </p>
          </div>
        </div>
      </div>

      {/* ── Package Type Sections ── */}
      <div className="dp-page">
        <div className="mini-container1">

          {typesWithImages.length === 0 && (
            <div className="dp-empty">
              <p>No packages available yet for this destination. Check back soon!</p>
            </div>
          )}

          {typesWithImages.map(pkgType => (
            <section key={pkgType} className="dp-type-section">
              <div className="dp-type-header">
                <h2 className="dp-type-title">{pkgType} Packages</h2>
              </div>
              <div className="dp-cards-grid">
                {PKG_SUBTYPES.map(sub => {
                  const linked = pkgMap[`${pkgType}__${sub}`] || null;
                  return (
                    <PackageCard
                      key={sub}
                      dest={dest}
                      pkgType={pkgType}
                      subtype={sub}
                      linkedPkg={linked}
                    />
                  );
                })}
              </div>
            </section>
          ))}

        </div>
      </div>

      <TopReviews />
      <FAQs />
      <Popup />
      <NewFooter />
    </>
  );
}
