import PromoSection1 from "../dubai-package/PromoSection1";
import DubaiFamilyNotes from "../dubai-package/DubaiFamilyNotes";
import WhyTourwatchout from "./WhyTourwatchout";
import SimiliarPackage from "./SimiliarPackage";
import BottomReviews from "../home/BottomReviews";
import FAQs from "../home/FAQs";
import Blogs from "../home/Blogs";
import NewFooter from "../footer/NewFooter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SUBTYPE_ORDER = ["Economy", "Deluxe", "Premium"];

const TAB_ICONS = {
  Economy: "/assets/images/dubai/itinerary/star.svg",
  Deluxe:  "/assets/images/dubai/itinerary/stars.svg",
  Premium: "/assets/images/dubai/itinerary/starss.svg",
};

const AMENITY_ICONS = {
  Meals:           "/assets/images/icons/itinerary/icon1.svg",
  Hotel:           "/assets/images/icons/itinerary/icon2.svg",
  Sightseeing:     "/assets/images/icons/itinerary/icon3.svg",
  WiFi:            "/assets/images/icons/itinerary/icon4.svg",
  Transport:       "/assets/images/icons/itinerary/icon5.svg",
  "Local Guide":   "/assets/images/icons/itinerary/icon6.svg",
  "Safe to Travel":"/assets/images/icons/itinerary/icon7.svg",
  "DJ Night":      "/assets/images/icons/itinerary/icon8.svg",
};

function fmtPrice(val) {
  const n = Number(val);
  if (!n) return null;
  return `₹${n.toLocaleString("en-IN")}`;
}

function PriceCard({ pkg, className }) {
  const price    = fmtPrice(pkg?.finalPrice || pkg?.basePrice);
  const imgSrc   = pkg?.priceImage?.src || "/assets/images/dubai/itinerary/it-banner.png";
  const imgAlt   = pkg?.priceImage?.alt || "package banner";
  const priceType = pkg?.priceType || "per person on twin sharing";

  return (
    <div className={`price-card ${className || ""}`}>
      <div className="prices-row">
        <div>
          <div className="pc-top">
            <div className="pc-from">Starting from</div>
          </div>
          <div className="pc-price">
            <div className="pc-amount">{price || "—"}</div>
            <div className="pc-note">{priceType}</div>
          </div>
        </div>
        <div>
          <img src={imgSrc} alt={imgAlt} />
        </div>
      </div>
      <button className="pc-cta">Request A Callback</button>
    </div>
  );
}

function TabContent({ pkg, openDay, setOpenDay }) {
  if (!pkg) {
    return <p style={{ padding: "2rem" }}>No package data available.</p>;
  }

  const bannerSrc = pkg.webBanner?.src || "/assets/images/dubai/itinerary/banner.png";
  const bannerAlt = pkg.webBanner?.alt || "Package banner";
  const rawAmenities = Array.isArray(pkg.amenities) ? pkg.amenities : [];
  const amenities = rawAmenities.map(a => typeof a === "string" ? { name: a, icon: AMENITY_ICONS[a] || null } : a);
  const days      = Array.isArray(pkg.days)      ? pkg.days      : [];
  const highlights = pkg.destinationHighlights   || "";

  return (
    <>
      <div className="pdt-header">
        <h1 className="pdt-title">{pkg.packageName || `${pkg.packageSubtype} Package`}</h1>
        {pkg.duration && <div className="pdt-tag">{pkg.duration}</div>}
      </div>

      {highlights && (
        <div className="location">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          <span>{highlights}</span>
        </div>
      )}

      {/* Mobile price card */}
      <PriceCard pkg={pkg} className="desktop-none" />

      <div className="pdt-banner">
        <img src={bannerSrc} alt={bannerAlt} />
        <div className="pdt-banner-chips">
          <span className="chip left">
            <img src="/assets/images/icons/itinerary/flight.svg" /> Flight Excluded
          </span>
          <span className="chip right">
            Rating: 4.2 <img src="/assets/images/icons/itinerary/stars.svg" />
          </span>
        </div>
      </div>

      {amenities.length > 0 && (
        <div className="pdt-amenities">
          {amenities.map(a => (
            <div key={a.name} className="amenity">
              {a.icon && <img src={a.icon} alt={a.name} />}
              {a.name}
            </div>
          ))}
        </div>
      )}

      <hr className="pdt-sep" />
      <h3 className="pdt-section-title">Itinerary</h3>

      <div className="pdt-itinerary">
        {days.map((d, idx) => {
          const dayNum = d.day || idx + 1;
          const isOpen = openDay === dayNum;
          return (
            <div key={dayNum} className={`it-day ${isOpen ? "open" : ""}`}>
              <button
                className="it-day-header"
                onClick={() => setOpenDay(isOpen ? null : dayNum)}
              >
                <div className="it-day-pill">Day {dayNum}</div>
                <div className="it-day-title">{d.title}</div>
                <div className="it-day-arrow">{isOpen ? "˄" : "˅"}</div>
              </button>
              {isOpen && (
                <div className="it-day-body">
                  {d.description
                    ? d.description.split("\n").filter(Boolean).map((line, i) => (
                        <p key={i}><span className="it-icon">▸</span> {line.replace(/^[•\-]\s*/, "")}</p>
                      ))
                    : null}
                  {Array.isArray(d.activities) && d.activities.map((a, i) => (
                    <p key={i}><span className="it-icon">▸</span> {a}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function PackageDetailsTabs({ packages = [] }) {
  const router = useRouter();
  const { tab } = router.query;

  const sorted = [...packages].sort(
    (a, b) => SUBTYPE_ORDER.indexOf(a.packageSubtype) - SUBTYPE_ORDER.indexOf(b.packageSubtype)
  );

  const firstId = sorted[0]?.packageSubtype?.toLowerCase() || "economy";
  const [activeTab, setActiveTab] = useState(firstId);
  const [openDay, setOpenDay]     = useState(1);

  useEffect(() => {
    if (tab) {
      const match = sorted.find(p => p.packageSubtype?.toLowerCase() === tab.toLowerCase());
      if (match) {
        setActiveTab(match.packageSubtype.toLowerCase());
        setOpenDay(1);
      }
    }
  }, [tab]);

  const activePkg = sorted.find(p => p.packageSubtype?.toLowerCase() === activeTab) || sorted[0];

  if (sorted.length === 0) {
    return (
      <div className="package-details-page">
        <div className="container">
          <p style={{ padding: "3rem", textAlign: "center" }}>No active packages available.</p>
        </div>
        <NewFooter />
      </div>
    );
  }

  return (
    <div className="package-details-page">
      <div className="container">
        <section className="package-details-tabs">

          {/* Tab buttons */}
          <div className="pdt-tabs-row">
            {sorted.map((pkg, idx) => {
              const id    = pkg.packageSubtype?.toLowerCase();
              const label = pkg.packageSubtype || "Package";
              const icon  = TAB_ICONS[pkg.packageSubtype] || TAB_ICONS.Economy;
              const best  = pkg.packageSubtype === "Deluxe";
              return (
                <button
                  key={pkg.id}
                  className={`pdt-tab ${activeTab === id ? "is-active" : ""}`}
                  onClick={() => { setActiveTab(id); setOpenDay(1); }}
                >
                  <img src={icon} alt={label} className="pdt-tab-icon" />
                  <span className="pdt-tab-label">{label}</span>
                  {best && <span className="pdt-best">BEST VALUE</span>}
                </button>
              );
            })}
          </div>

          <div className="pdt-content">
            <div className="pdt-left">
              <TabContent pkg={activePkg} openDay={openDay} setOpenDay={setOpenDay} />
            </div>

            {/* Right sidebar */}
            <aside className="pdt-right">
              <PriceCard pkg={activePkg} className="mobile-none" />

              <div className="enquiry-card mobile-none">
                {activePkg.advertisement?.image?.src && (
                  <img
                    src={activePkg.advertisement.image.src}
                    alt={activePkg.advertisement.image.alt || "offer"}
                    className="enq-ad-img"
                  />
                )}
                <div className="enq-badge">
                  {activePkg.advertisement?.headline
                    ? <span className="offer">{activePkg.advertisement.headline}</span>
                    : <><span className="offer">Flat 20% </span>Off On Your First Tour Package!</>}
                </div>
                <p className="query-form-heading">
                  {activePkg.advertisement?.subtext || "Your Dream Destination Just One Click away"}
                </p>
                <form className="enq-form" onSubmit={e => e.preventDefault()}>
                  <input type="text" placeholder="Full Name" />
                  <input type="text" placeholder="Destination" defaultValue={activePkg.destination || ""} />
                  <div className="enq-phone">
                    <select><option value="+91">+91</option></select>
                    <input type="tel" placeholder="0000 0000 00" />
                  </div>
                  <input type="email" placeholder="Email" />
                  <button className="enq-submit">Get a Callback</button>
                </form>
              </div>
            </aside>
          </div>

          {/* Dynamic advertisement banner */}
          {activePkg.advertisement?.image?.src ? (
            <div className="pdt-promo-banner">
              <img
                src={activePkg.advertisement.image.src}
                alt={activePkg.advertisement.image.alt || "advertisement"}
              />
            </div>
          ) : (
            <PromoSection1 />
          )}

          <DubaiFamilyNotes pkg={activePkg} />
          <WhyTourwatchout />
          <SimiliarPackage />
          <BottomReviews />
          <PromoSection1 />
          <FAQs />
          <Blogs />

        </section>
      </div>
      <NewFooter />
    </div>
  );
}
