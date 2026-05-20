import React, { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
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

const PRICE_BUCKETS = [
  { key: "lt45",    label: "< ₹45,000",           min: 0,      max: 44999    },
  { key: "45to75",  label: "₹45,000 – ₹75,000",   min: 45000,  max: 74999    },
  { key: "75to115", label: "₹75,000 – ₹1,15,000", min: 75000,  max: 114999   },
  { key: "gt115",   label: "> ₹1,15,000",          min: 115000, max: Infinity },
];

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function getPackageHref(pkg) {
  if (pkg.destination?.toLowerCase() === "dubai") {
    return `/dubai/dubai-couple?tab=${pkg.packageSubtype?.toLowerCase()}`;
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

function parseNights(dur) {
  if (!dur) return null;
  const m = dur.match(/(\d+)\s*N/i);
  return m ? Number(m[1]) : null;
}

function hasFlights(pkg) {
  if (!Array.isArray(pkg.amenities)) return false;
  return pkg.amenities.some(a => /flight/i.test(typeof a === "string" ? a : a?.name || ""));
}

/* ── Dual-handle range slider ── */
function DualRangeSlider({ min, max, value, onChange, formatLabel, step = 1 }) {
  const [lo, hi] = value;
  const range = (max - min) || 1;
  const minPct = ((lo - min) / range) * 100;
  const maxPct = ((hi - min) / range) * 100;

  return (
    <div className="drs-container">
      <div className="drs-wrap">
        <div className="drs-track">
          <div className="drs-fill" style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={lo}
          className="drs-input drs-lo"
          style={{ zIndex: lo >= hi - step ? 5 : 3 }}
          onChange={e => onChange([Math.min(Number(e.target.value), hi - step), hi])}
        />
        <input
          type="range" min={min} max={max} step={step} value={hi}
          className="drs-input drs-hi"
          style={{ zIndex: 4 }}
          onChange={e => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
        />
      </div>
      <div className="drs-labels">
        <span>{formatLabel(lo)}</span>
        <span>{formatLabel(hi)}</span>
      </div>
    </div>
  );
}

/* ── Filter panel (shared desktop + mobile drawer) ── */
function FilterPanel({
  minNight, maxNight, nightRange, setNightRange,
  filterFlights, setFilterFlights,
  minPrice, maxPrice, priceRange, setPriceRange,
  filterPriceBuckets, toggleBucket,
  allCities, filterCities, toggleCity,
  citySearch, setCitySearch, showAllCities, setShowAllCities,
  filterEMI, setFilterEMI,
  totalFilters, clearFilters,
}) {
  const citiesFiltered = allCities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
  const citiesShown    = showAllCities ? citiesFiltered : citiesFiltered.slice(0, 5);

  return (
    <div className="ffp-inner">

      <div className="ffp-header">
        <span className="ffp-title">Filters</span>
        {totalFilters > 0 && (
          <button className="ffp-clear-btn" onClick={clearFilters}>Clear all</button>
        )}
      </div>

      {/* ── Duration ── */}
      {minNight < maxNight && (
        <div className="ffp-section">
          <p className="ffp-section-title">Duration (In Nights)</p>
          <DualRangeSlider
            min={minNight} max={maxNight} step={1}
            value={nightRange}
            onChange={setNightRange}
            formatLabel={n => `${n}N`}
          />
        </div>
      )}

      {/* ── Flights ── */}
      <div className="ffp-section">
        <p className="ffp-section-title">Flights</p>
        <div className="ffp-pills-row">
          {[
            { key: "with",    label: "With Flights"   },
            { key: "without", label: "Without Flight" },
          ].map(f => (
            <button
              key={f.key}
              className={`ffp-pill ${filterFlights === f.key ? "active" : ""}`}
              onClick={() => setFilterFlights(prev => prev === f.key ? null : f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Budget ── */}
      <div className="ffp-section">
        <p className="ffp-section-title">Budget (Per Person)</p>
        {minPrice < maxPrice && (
          <DualRangeSlider
            min={minPrice} max={maxPrice} step={1000}
            value={priceRange}
            onChange={setPriceRange}
            formatLabel={n => fmt(n)}
          />
        )}
        <div style={{ marginTop: 12 }}>
          {PRICE_BUCKETS.map(r => (
            <label key={r.key} className="ffp-check-row">
              <input
                type="checkbox"
                className="ffp-checkbox"
                checked={filterPriceBuckets.includes(r.key)}
                onChange={() => toggleBucket(r.key)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Cities ── */}
      {allCities.length > 0 && (
        <div className="ffp-section">
          <p className="ffp-section-title">Cities</p>
          <div className="ffp-city-search-wrap">
            <input
              type="text"
              className="ffp-city-input"
              placeholder="Search"
              value={citySearch}
              onChange={e => setCitySearch(e.target.value)}
            />
            <svg className="ffp-city-icon" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          {citiesShown.map(city => (
            <label key={city} className="ffp-check-row">
              <input
                type="checkbox"
                className="ffp-checkbox"
                checked={filterCities.includes(city)}
                onChange={() => toggleCity(city)}
              />
              <span>{city}</span>
            </label>
          ))}
          {citiesFiltered.length > 5 && (
            <button className="ffp-show-more" onClick={() => setShowAllCities(p => !p)}>
              {showAllCities ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {/* ── Buy Now, Pay Later ── */}
      <div className="ffp-section">
        <p className="ffp-section-title">Buy Now, Pay Later</p>
        <label className="ffp-check-row">
          <input
            type="checkbox"
            className="ffp-checkbox"
            checked={filterEMI}
            onChange={e => setFilterEMI(e.target.checked)}
          />
          <span>Book @ ₹2,000</span>
        </label>
      </div>

    </div>
  );
}

/* ── Package card ── */
function PackageCard({ pkg }) {
  const href = getPackageHref(pkg);

  const galleryImgs = (pkg.gallery || [])
    .filter(g => g?.src)
    .map(g => ({ src: g.src, alt: g.alt || pkg.packageName }));

  const images = galleryImgs.length > 0
    ? galleryImgs
    : [
        pkg.featureImage?.src ? { src: pkg.featureImage.src, alt: pkg.featureImage.alt || pkg.packageName } : null,
        pkg.webBanner?.src    ? { src: pkg.webBanner.src,    alt: pkg.webBanner.alt    || pkg.packageName } : null,
      ].filter(Boolean);

  if (!images.length) images.push({ src: "/assets/images/i-destination/dubai.webp", alt: pkg.packageName });

  const base    = Number(pkg.basePrice)  || 0;
  const final   = Number(pkg.finalPrice) || base;
  const discPct = base > final && base > 0 ? Math.round((base - final) / base * 100) : 0;

  const bullets = (pkg.destinationHighlights || "")
    .split(/[-,•]\s*/)
    .map(h => h.trim())
    .filter(Boolean);

  return (
    <div className="new-desti-card">
      {images.length > 1 ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          className="pkg-card-swiper"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <Link href={href} style={{ display: "block" }}>
                <img src={img.src} alt={img.alt} loading="lazy"
                  style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Link href={href}>
          <img src={images[0].src} alt={images[0].alt} loading="lazy"
            style={{ width: "100%", height: 150, objectFit: "cover" }} />
        </Link>
      )}

      <div className="p-4">
        <div className="pkg-badges-row">
          <div className="pkg-badges-left">
            {pkg.duration       && <span className="pkg-bdg pkg-bdg-dur">{pkg.duration}</span>}
            {pkg.packageType    && <span className="pkg-bdg pkg-bdg-type">{pkg.packageType}</span>}
            {pkg.packageSubtype && <span className="pkg-bdg pkg-bdg-sub">{pkg.packageSubtype}</span>}
          </div>
          <div className="pkg-rating">
            <span className="pkg-star">★</span>
            <span><span className="font-bold">4.1</span> (230)</span>
          </div>
        </div>

        <h2 className="pkg-card-name">{pkg.packageName || pkg.destination}</h2>

        {bullets.length > 0 && (
          <p className="pkg-card-highlights">
            {bullets.map((b, i) => <span key={i}>• {b} </span>)}
          </p>
        )}

        <hr className="pkg-card-divider" />

        {Array.isArray(pkg.amenities) && pkg.amenities.length > 0 && (
          <ul className="pkg-amenities-row">
            {pkg.amenities.map((a, i) => {
              const name = typeof a === "string" ? a : a?.name;
              const icon = (typeof a === "object" && a?.icon) || AMENITY_ICONS[name];
              return icon ? (
                <li key={i} className="pkg-amenity-item">
                  <img src={icon} alt={name} />
                  <span>{name}</span>
                </li>
              ) : null;
            })}
          </ul>
        )}

        <div className="pkg-price-main-row">
          <div className="pkg-price-left">
            <div className="pkg-price-top-row">
              {base > final && <span className="pkg-old-price">{fmt(base)}</span>}
              {discPct > 0  && <span className="pkg-disc-badge">{discPct}% OFF</span>}
            </div>
            <span className="pkg-final-price">{fmt(final || base)} <span className="per-person">/person</span></span>
            <p className="pkg-total-line">Total Price {fmt(base || final)} inc. of taxes</p>
          </div>
          <Link href={href} className="pkg-view-btn">View Package</Link>
        </div>

        {pkg.priceType && <p className="pkg-price-type-line">{pkg.priceType}</p>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Main page component
══════════════════════════════════════════════════════ */
export default function CouplePackages({ packages = [], initialTab = "", destName = "" }) {
  const subtypes = SUBTYPE_ORDER.filter(s => packages.some(p => p.packageSubtype === s));

  const [activeTab, setActiveTab] = useState(() => {
    const valid = SUBTYPE_ORDER.map(s => s.toLowerCase());
    if (initialTab && valid.includes(initialTab)) return initialTab;
    return subtypes[0]?.toLowerCase() || "economy";
  });

  /* ── filter state ── */
  const [nightRange,         setNightRange]         = useState([null, null]);
  const [filterFlights,      setFilterFlights]      = useState(null);
  const [priceRange,         setPriceRange]         = useState([null, null]);
  const [filterPriceBuckets, setFilterPriceBuckets] = useState([]);
  const [filterCities,       setFilterCities]       = useState([]);
  const [citySearch,         setCitySearch]         = useState("");
  const [showAllCities,      setShowAllCities]      = useState(false);
  const [filterEMI,          setFilterEMI]          = useState(false);
  const [mobileFiltersOpen,  setMobileFiltersOpen]  = useState(false);

  /* ── base packages for this tab ── */
  const visiblePkgs = packages.filter(p => p.packageSubtype?.toLowerCase() === activeTab);

  /* ── computed ranges ── */
  const nightValues   = visiblePkgs.map(p => parseNights(p.duration)).filter(n => n !== null);
  const minNight      = nightValues.length > 0 ? Math.min(...nightValues) : 1;
  const maxNight      = nightValues.length > 0 ? Math.max(...nightValues) : 14;
  const effNightRange = [nightRange[0] ?? minNight, nightRange[1] ?? maxNight];

  const priceValues   = visiblePkgs.map(p => Number(p.finalPrice) || Number(p.basePrice) || 0).filter(p => p > 0);
  const minPrice      = priceValues.length > 0 ? Math.floor(Math.min(...priceValues) / 1000) * 1000 : 10000;
  const maxPrice      = priceValues.length > 0 ? Math.ceil(Math.max(...priceValues)  / 1000) * 1000 : 500000;
  const effPriceRange = [priceRange[0] ?? minPrice, priceRange[1] ?? maxPrice];

  const allCities = [...new Set(visiblePkgs.map(p => p.destination).filter(Boolean))].sort();

  /* ── apply all filters ── */
  let filteredPkgs = visiblePkgs;

  if (nightRange[0] !== null || nightRange[1] !== null) {
    const lo = effNightRange[0], hi = effNightRange[1];
    filteredPkgs = filteredPkgs.filter(p => { const n = parseNights(p.duration); return n !== null && n >= lo && n <= hi; });
  }

  if (filterFlights === "with") {
    filteredPkgs = filteredPkgs.filter(p => hasFlights(p));
  } else if (filterFlights === "without") {
    filteredPkgs = filteredPkgs.filter(p => !hasFlights(p));
  }

  if (priceRange[0] !== null || priceRange[1] !== null) {
    const lo = effPriceRange[0], hi = effPriceRange[1];
    filteredPkgs = filteredPkgs.filter(p => {
      const price = Number(p.finalPrice) || Number(p.basePrice) || 0;
      return price >= lo && price <= hi;
    });
  }

  if (filterPriceBuckets.length > 0) {
    filteredPkgs = filteredPkgs.filter(p => {
      const price = Number(p.finalPrice) || Number(p.basePrice) || 0;
      return filterPriceBuckets.some(key => {
        const r = PRICE_BUCKETS.find(b => b.key === key);
        return r && price >= r.min && price <= r.max;
      });
    });
  }

  if (filterCities.length > 0) {
    filteredPkgs = filteredPkgs.filter(p => filterCities.includes(p.destination));
  }

  const totalFilters =
    (nightRange[0] !== null || nightRange[1] !== null ? 1 : 0) +
    (filterFlights ? 1 : 0) +
    (priceRange[0] !== null || priceRange[1] !== null ? 1 : 0) +
    filterPriceBuckets.length +
    filterCities.length +
    (filterEMI ? 1 : 0);

  function clearFilters() {
    setNightRange([null, null]);
    setFilterFlights(null);
    setPriceRange([null, null]);
    setFilterPriceBuckets([]);
    setFilterCities([]);
    setCitySearch("");
    setShowAllCities(false);
    setFilterEMI(false);
  }

  function toggleBucket(key) {
    setFilterPriceBuckets(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }
  function toggleCity(city) {
    setFilterCities(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  }

  const activeLabel = subtypes.find(s => s.toLowerCase() === activeTab) || "";

  const filterPanelProps = {
    minNight, maxNight, nightRange: effNightRange, setNightRange,
    filterFlights, setFilterFlights,
    minPrice, maxPrice, priceRange: effPriceRange, setPriceRange,
    filterPriceBuckets, toggleBucket,
    allCities, filterCities, toggleCity,
    citySearch, setCitySearch, showAllCities, setShowAllCities,
    filterEMI, setFilterEMI,
    totalFilters, clearFilters,
  };

  return (
    <div className="dubai-family-package family-packages couplepage">
      <Topbar />
      <Offcanvas />

      <div className="packages-hero-area"></div>

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
                    onClick={() => { setActiveTab(id); clearFilters(); }}
                  >
                    <img src={icon} alt={sub} className="pdt-tab-icon" />
                    <span className="pdt-tab-label">{sub}</span>
                    {best && <span className="pdt-best">BEST VALUE</span>}
                  </button>
                );
              })}
            </div>

            {/* Mobile filter bar */}
            <div className="family-mobile-filter-bar">
              <button className="family-filter-toggle-btn" onClick={() => setMobileFiltersOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filters
                {totalFilters > 0 && <span className="ffp-active-dot">{totalFilters}</span>}
              </button>
              <span className="family-results-count">{filteredPkgs.length} Result{filteredPkgs.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Desktop layout */}
            <div className="family-layout">

              <aside className="family-filter-sidebar">
                <FilterPanel {...filterPanelProps} />
              </aside>

              <div className="family-packages-col">
                <div className="section-header">
                  <h2 className="section-title">
                    <span className="highlight">{activeLabel} {destName || "Couple"} </span> Packages
                  </h2>
                  <p className="section-subtitle">Let's find out what suits you the best</p>
                </div>

                {filteredPkgs.length > 0 ? (
                  <div className="national-list-bx">
                    {filteredPkgs.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#888" }}>
                    <p style={{ marginBottom: 12 }}>No packages match the selected filters.</p>
                    {totalFilters > 0 && (
                      <button
                        onClick={clearFilters}
                        style={{ color: "#e84949", background: "none", border: "1px solid #e84949", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 600 }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>

          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="family-filter-overlay" onClick={() => setMobileFiltersOpen(false)} />
          <div className="family-filter-drawer">
            <div className="ffd-topbar">
              <span className="ffd-title">Filters{totalFilters > 0 ? ` (${totalFilters})` : ""}</span>
              <button className="ffd-close" onClick={() => setMobileFiltersOpen(false)}>✕</button>
            </div>
            <div className="ffd-body">
              <FilterPanel {...filterPanelProps} />
            </div>
            <div className="ffd-footer">
              {totalFilters > 0 && (
                <button className="ffd-clear-btn" onClick={clearFilters}>Clear All</button>
              )}
              <button className="ffd-apply-btn" onClick={() => setMobileFiltersOpen(false)}>
                Show {filteredPkgs.length} Result{filteredPkgs.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </>
      )}

      <PromoSection/>
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
  allDests.forEach(d => { slugMap[(d.name || d.title || "").toLowerCase()] = d.slug; });

  const filter = {
    packageType: { $regex: /^couple$/i },
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

  const raw = await Package.find(filter).sort({ createdAt: 1 }).lean();

  const packages = raw
    .map(p => ({
      ...p,
      id:       p._id,
      destSlug:
        slugMap[p.destination?.toLowerCase()] ||
        p.destination?.toLowerCase().replace(/\s+/g, "-") ||
        "",
    }))
    .sort((a, b) => SUBTYPE_ORDER.indexOf(a.packageSubtype) - SUBTYPE_ORDER.indexOf(b.packageSubtype));

  return {
    props: {
      packages:   JSON.parse(JSON.stringify(packages)),
      initialTab: (tab || "").toLowerCase(),
      destName,
    },
  };
}
