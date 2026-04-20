import React, { useState, useEffect } from "react";
import Head from "next/head";
import Topbar from "../../../../components/header/Header";
import Offcanvas from "../../../../components/header/Offcanvas";
import Popup from "../../../../components/corporate/Popup";
import NewFooter from "../../../../components/footer/NewFooter";
import BottomReviews from "../../../../components/home/BottomReviews";
import FAQs from "../../../../components/home/FAQs";
import Blogs from "../../../../components/home/Blogs";

const SUBTYPE_ORDER = ["Economy", "Deluxe", "Premium"];
const TAB_ICONS = {
  Economy: "/assets/images/dubai/itinerary/star.svg",
  Deluxe:  "/assets/images/dubai/itinerary/stars.svg",
  Premium: "/assets/images/dubai/itinerary/starss.svg",
};
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

export async function getServerSideProps({ params }) {
  const { readAll: readPkgs  } = require("../../../../utils/packageStore");
  const { readAll: readDests } = require("../../../../utils/destStore");

  const { slug, id } = params;

  const allPkgs = readPkgs();
  const pkg = allPkgs.find(p => p.id === id && p.status === "Active");
  if (!pkg) return { notFound: true };

  const dest = readDests().find(d => d.slug === slug && d.status === "Active");
  if (!dest) return { notFound: true };

  const siblings = allPkgs
    .filter(p =>
      (p.destination === dest.name || p.destination === dest.title) &&
      p.packageType === pkg.packageType &&
      p.status === "Active"
    )
    .sort((a, b) =>
      SUBTYPE_ORDER.indexOf(a.packageSubtype) - SUBTYPE_ORDER.indexOf(b.packageSubtype)
    );

  // Hero: use this package's own images if uploaded, else first sibling with images
  const heroPkg = pkg.webBanner?.src
    ? pkg
    : (siblings.find(p => p.webBanner?.src) || siblings[0] || pkg);

  return {
    props: {
      pkg:      JSON.parse(JSON.stringify(pkg)),
      dest:     JSON.parse(JSON.stringify(dest)),
      siblings: JSON.parse(JSON.stringify(siblings)),
      heroPkg:  JSON.parse(JSON.stringify(heroPkg)),
    },
  };
}

function fmtPrice(val) {
  const n = Number(val);
  return n ? `₹${n.toLocaleString("en-IN")}` : null;
}

function BulletText({ text }) {
  if (!text) return null;
  return (
    <ul className="dfn-bullet-list">
      {text.split("\n").filter(Boolean).map((line, i) => (
        <li key={i}>{line.replace(/^[•\-]\s*/, "")}</li>
      ))}
    </ul>
  );
}

function AccordionSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="dfn-section">
      <button className="dfn-section-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="dfn-pill">{title}</span>
        <span className="faq-icon" style={{ display:"inline-block", transform: open?"rotate(-90deg)":"rotate(90deg)", transition:"0.3s ease", fontSize:"20px" }}>
          &gt;
        </span>
      </button>
      {open && <div className="dfn-panel">{children}</div>}
    </div>
  );
}

export default function PackageDetailPage({ pkg: initialPkg, dest, siblings, heroPkg }) {
  const [activePkg, setActivePkg] = useState(initialPkg);
  const [openDay, setOpenDay] = useState(1);

  useEffect(() => { setOpenDay(1); }, [activePkg?.id]);

  const destName = dest.name || dest.title;
  const banner   = activePkg.webBanner?.src || dest.mainImage?.src || "/assets/images/dubai/itinerary/banner.png";
  const price    = fmtPrice(activePkg.finalPrice || activePkg.basePrice);
  const rawAmenities = Array.isArray(activePkg.amenities) ? activePkg.amenities : [];
  const amenities = rawAmenities.map(a => typeof a === "string" ? { name: a, icon: AMENITY_ICONS[a] || null } : a);
  const days      = Array.isArray(activePkg.days)      ? activePkg.days      : [];

  // Hero is constant — uses the sibling that has the best images (computed server-side)
  const heroBig     = heroPkg.webBanner?.src || dest.mainImage?.src || "/assets/images/dubai/itinerary/left.png";
  const heroBigAlt  = heroPkg.webBanner?.alt || destName;
  const heroGallery = (heroPkg.gallery || []);

  return (
    <>
      <Head>
        <title>{activePkg.packageName || destName} — TourWatchOut</title>
        <meta name="description" content={activePkg.metaDescription || `${destName} ${activePkg.packageSubtype} package`} />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </Head>

      <div className="dubai-family-package">
        <Topbar />
        <Offcanvas />

        {/* ── Hero Gallery — constant across all tabs ── */}
        <div className="container mobile-none">
          <div className="dubai-gallery-section">
            <div className="dgs-grid">
              <div className="dgs-big">
                <img src={heroBig} alt={heroBigAlt} />
              </div>
              <div className="dgs-small-grid">
                {[0, 1, 2, 3].map((i, idx) => {
                  const g   = heroGallery[i];
                  const src = g?.src || `/assets/images/dubai/itinerary/img${i === 0 ? "" : i + 1}.png`;
                  const alt = g?.alt || `${destName} ${i + 1}`;
                  return (
                    <img
                      key={i}
                      className={idx === 1 ? "top-right-img" : idx === 3 ? "top-bottom-img" : ""}
                      src={src}
                      alt={alt}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Package Tabs + Content ── */}
        <div className="package-details-page">
          <div className="container">
            <section className="package-details-tabs">

              {/* Tab buttons (siblings) */}
              {siblings.length > 1 && (
                <div className="pdt-tabs-row">
                  {siblings.map((sib, idx) => {
                    const id    = sib.packageSubtype?.toLowerCase();
                    const label = sib.packageSubtype;
                    const icon  = TAB_ICONS[sib.packageSubtype] || TAB_ICONS.Economy;
                    const best  = idx === 1;
                    const isActive = activePkg.id === sib.id;
                    return (
                      <button
                        key={sib.id}
                        className={`pdt-tab ${isActive ? "is-active" : ""}`}
                        onClick={() => setActivePkg(sib)}
                      >
                        <img src={icon} alt={label} className="pdt-tab-icon" />
                        <span className="pdt-tab-label">{label}</span>
                        {best && <span className="pdt-best">BEST VALUE</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="pdt-content">
                {/* Left content */}
                <div className="pdt-left">
                  <div className="pdt-header">
                    <h1 className="pdt-title">{activePkg.packageName || `${activePkg.packageSubtype} ${destName}`}</h1>
                    {activePkg.duration && <div className="pdt-tag">{activePkg.duration}</div>}
                  </div>

                  {activePkg.destinationHighlights && (
                    <div className="location">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                      </svg>
                      <span>{activePkg.destinationHighlights}</span>
                    </div>
                  )}

                  {/* Mobile price card */}
                  <div className="price-card desktop-none">
                    <div className="prices-row">
                      <div>
                        <div className="pc-top"><div className="pc-from">Starting from</div></div>
                        <div className="pc-price">
                          <div className="pc-amount">{price || "—"}</div>
                          <div className="pc-note">{activePkg.priceType || "per person on twin sharing"}</div>
                        </div>
                      </div>
                      <div>
                        <img src={activePkg.priceImage?.src || "/assets/images/dubai/itinerary/it-banner.png"} alt="package" />
                      </div>
                    </div>
                    <button className="pc-cta">Request A Callback</button>
                  </div>

                  {/* Banner */}
                  <div className="pdt-banner">
                    <img src={banner} alt={activePkg.webBanner?.alt || destName} />
                    <div className="pdt-banner-chips">
                      <span className="chip left">
                        <img src="/assets/images/icons/itinerary/flight.svg" /> Flight Excluded
                      </span>
                      <span className="chip right">
                        Rating: 4.5 <img src="/assets/images/icons/itinerary/stars.svg" />
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
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

                  {/* Itinerary */}
                  <hr className="pdt-sep" />
                  <h3 className="pdt-section-title">Itinerary</h3>
                  <div className="pdt-itinerary">
                    {days.map((d, idx) => {
                      const dayNum = d.day || idx + 1;
                      const isOpen = openDay === dayNum;
                      return (
                        <div key={dayNum} className={`it-day ${isOpen ? "open" : ""}`}>
                          <button className="it-day-header" onClick={() => setOpenDay(isOpen ? null : dayNum)}>
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
                </div>

                {/* Right sidebar */}
                <aside className="pdt-right">
                  <div className="price-card mobile-none">
                    <div className="prices-row">
                      <div>
                        <div className="pc-top"><div className="pc-from">Starting from</div></div>
                        <div className="pc-price">
                          <div className="pc-amount">{price || "—"}</div>
                          <div className="pc-note">{activePkg.priceType || "per person on twin sharing"}</div>
                        </div>
                      </div>
                      <div>
                        <img src={activePkg.priceImage?.src || "/assets/images/dubai/itinerary/it-banner.png"} alt="package" />
                      </div>
                    </div>
                    <button className="pc-cta">Request A Callback</button>
                  </div>

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
                      <input type="text" placeholder="Destination" defaultValue={destName} />
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
              {activePkg.advertisement?.image?.src && (
                <div className="pdt-promo-banner">
                  <img
                    src={activePkg.advertisement.image.src}
                    alt={activePkg.advertisement.image.alt || "advertisement"}
                  />
                </div>
              )}

              {/* Notes section */}
              <div className="dubai-family-notes">
                <div className="dfn-accordion">

                  {(activePkg.inclusions || activePkg.exclusions) && (
                    <AccordionSection title="Inclusions &amp; Exclusions">
                      {activePkg.inclusions && (
                        <><h4 className="dfn-sub-heading">Inclusions</h4><BulletText text={activePkg.inclusions} /></>
                      )}
                      {activePkg.exclusions && (
                        <><h4 className="dfn-sub-heading">Exclusions</h4><BulletText text={activePkg.exclusions} /></>
                      )}
                    </AccordionSection>
                  )}

                  {activePkg.aboutText && (
                    <AccordionSection title={`About ${destName}`} defaultOpen>
                      <div className="dfn-about">
                        <div className="dfn-content">
                          <div className="dfn-intro">
                            <img src="/assets/images/dubai/icons/info-circle.svg" alt="info" className="info-icon" />
                            <p>{activePkg.aboutText}</p>
                          </div>
                          {Array.isArray(activePkg.aboutImages) &&
                            activePkg.aboutImages.filter(i => i?.src).length > 0 && (
                              <div className="dfn-highlights">
                                {activePkg.aboutImages.filter(i => i?.src).map((img, idx) => (
                                  <img key={idx} src={img.src} alt={img.alt || "about"} />
                                ))}
                              </div>
                          )}
                        </div>
                      </div>
                    </AccordionSection>
                  )}

                  {activePkg.bucketListText && (
                    <AccordionSection title={`${destName} Bucket List`}>
                      <BulletText text={activePkg.bucketListText} />
                      {Array.isArray(activePkg.bucketImages) &&
                        activePkg.bucketImages.filter(i => i?.src).length > 0 && (
                          <div className="dfn-highlights">
                            {activePkg.bucketImages.filter(i => i?.src).map((img, idx) => (
                              <img key={idx} src={img.src} alt={img.alt || "bucket"} />
                            ))}
                          </div>
                      )}
                    </AccordionSection>
                  )}

                  {(activePkg.cancellationPolicy || activePkg.bookingPolicy || activePkg.termsConditions) && (
                    <AccordionSection title="Cancellation &amp; Policies">
                      {activePkg.cancellationPolicy && (
                        <><h4 className="dfn-sub-heading">Cancellation Policy</h4><BulletText text={activePkg.cancellationPolicy} /></>
                      )}
                      {activePkg.bookingPolicy && (
                        <><h4 className="dfn-sub-heading">Booking Policy</h4><p>{activePkg.bookingPolicy}</p></>
                      )}
                      {activePkg.termsConditions && (
                        <><h4 className="dfn-sub-heading">Terms &amp; Conditions</h4><p>{activePkg.termsConditions}</p></>
                      )}
                    </AccordionSection>
                  )}

                </div>
              </div>

            </section>
          </div>
        </div>

        <BottomReviews />
        <FAQs />
        <Blogs />
        <Popup />
        <NewFooter />
      </div>
    </>
  );
}
