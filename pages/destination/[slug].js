import React from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import Topbar from "../../components/header/Header";

// ── Lazy-load every component that is NOT above the fold ──────────────────────
// These are downloaded AFTER the hero is painted, so the user sees content fast.
const Offcanvas          = dynamic(() => import("../../components/header/Offcanvas"),                         { ssr: false });
const Popup              = dynamic(() => import("../../components/corporate/Popup"),                          { ssr: false });
const Kashmir            = dynamic(() => import("../../components/destination/pitch-videos/Kashmir"),         { ssr: false });
const PitchVideoMob      = dynamic(() => import("../../components/home/PitchVideoMob"),                      { ssr: false });
const TopReviews         = dynamic(() => import("../../components/home/TopReviews"),                         { ssr: false });
const MostPopular        = dynamic(() => import("../../components/home/MostPopular"),                        { ssr: false });
const FAQs               = dynamic(() => import("../../components/home/FAQs"),                               { ssr: false });
const BottomReviews      = dynamic(() => import("../../components/home/BottomReviews"),                      { ssr: false });
const BottomReviewsMobile= dynamic(() => import("../../components/home/BottomReviewsMobile"),                { ssr: false });
const Blogs              = dynamic(() => import("../../components/home/Blogs"),                               { ssr: false });
const NewFooter          = dynamic(() => import("../../components/footer/NewFooter"),                        { ssr: false });
// ─────────────────────────────────────────────────────────────────────────────

const PKG_TYPES = ["Family", "Couple"];
const SUBTYPES  = ["Economy", "Deluxe", "Premium"];

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

// ── Static paths — enumerate all active destinations at build time ────────────
export async function getStaticPaths() {
  const { readAll: readDests } = require("../../utils/destStore");
  const dests = readDests().filter(d => d.status === "Active");
  return {
    paths:    dests.map(d => ({ params: { slug: d.slug } })),
    fallback: "blocking", // new destinations SSR on first hit, then cached
  };
}

// ── Static props with ISR — DB hit only on first build / revalidation ─────────
export async function getStaticProps({ params }) {
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
    revalidate: 60, // regenerate at most once per minute when traffic hits
  };
}

// ── Package card ──────────────────────────────────────────────────────────────
function CategoryCard({ dest, pkgType, subtype, packages }) {
  const pkgsForCategory = packages.filter(
    p => p.packageType?.toLowerCase()    === pkgType.toLowerCase() &&
         p.packageSubtype?.toLowerCase() === subtype.toLowerCase()
  );
  const priced = pkgsForCategory
    .map(p => ({ base: Number(p.basePrice || 0), final: Number(p.finalPrice || p.basePrice || 0) }))
    .filter(p => p.final > 0);
  priced.sort((a, b) => a.final - b.final);
  const minFinal     = priced[0]?.final ?? 0;
  const minBase      = priced[0]?.base  ?? 0;
  const hasDiscount  = minBase > 0 && minBase !== minFinal;

  const image =
    dest.images?.[pkgType]?.[subtype]?.src ||
    dest.mainImage?.src ||
    "/assets/images/i-destination/dubai.webp";

  const href = `/${pkgType.toLowerCase()}?dest=${dest.slug}&tab=${subtype.toLowerCase()}`;
  const name = dest.name || dest.title;

  return (
    <Link href={href} className="dest-cat-link">
      <div className="dest-cat-card">
        <img src={image} alt={`${subtype} ${name}`} className="dest-cat-bg" loading="lazy" decoding="async" />
        <div className="dest-cat-gradient" />
        <div className="dest-cat-content">
          <h2>{subtype} {name}</h2>
          {minFinal > 0 && (
            <div className="price-section">
              <div className="price-info">
                {hasDiscount
                  ? <p className="old-price">Starting from <span className="oldcut">{fmt(minBase)}</span></p>
                  : <p className="old-price">Starting from</p>}
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
            <CategoryCard key={sub} dest={dest} pkgType={pkgType} subtype={sub} packages={packages} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DestinationPage({ dest, packages }) {
  const banner = dest.mainImage?.src || dest.images?.Family?.Economy?.src;
  const name   = dest.name || dest.title;

  const typesToShow = PKG_TYPES.filter(t =>
    packages.some(p => p.packageType?.toLowerCase() === t.toLowerCase()) ||
    SUBTYPES.some(s => dest.images?.[t]?.[s]?.src)
  );

  return (
    <div className="dyna-destination-pages">
      <Head>
        <title>{name} Packages — TourWatchOut</title>
        <meta name="description" content={`Explore ${name} packages — Economy, Deluxe and Premium options for Family and Couple travel.`} />

        {/* ── Critical CSS — inline before anything renders ── */}
        <link rel="stylesheet" href="/assets/css/style.css" />

        {/* ── Resource hints — resolve DNS / open connections early ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://script.google.com" />

        {/* ── Preload the hero banner so it paints with the first frame ── */}
        {banner && (
          <link rel="preload" as="image" href={banner} fetchpriority="high" />
        )}
      </Head>

      {/* Topbar is above-fold — SSR */}
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
                Request Callback
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

      {/* ── Below-fold — all lazy loaded ── */}
      <div className="mobile-none">
        <Kashmir />
      </div>
      <PitchVideoMob />

      {typesToShow.length === 0 && (
        <section className="family-dubai-packages">
          <div className="mini-container1">
            <p style={{ textAlign: "center", padding: "2rem 0", color: "#888" }}>
              No packages available yet. Check back soon!
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
      <BottomReviews slug={dest.slug} />
      <BottomReviewsMobile slug={dest.slug} />
      <Blogs />
      <Popup destination={dest.name || dest.title} />
      <NewFooter />
    </div>
  );
}
