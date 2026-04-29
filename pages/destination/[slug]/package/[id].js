import React, { useState } from "react";
import Head from "next/head";
import Topbar from "../../../../components/header/Header";
import Offcanvas from "../../../../components/header/Offcanvas";
import Popup from "../../../../components/corporate/Popup";
import NewFooter from "../../../../components/footer/NewFooter";
import BottomReviews from "../../../../components/home/BottomReviews";
import FAQs from "../../../../components/home/FAQs";
import Blogs from "../../../../components/home/Blogs";
import PromoSection from "../../../../components/home/PromoSection";
import MostPopular from "../../../../components/home/MostPopular";
import BenifitSection from "../../../../components/home/BenifitSection";

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
  const connectDB = require("../../../../utils/mongodb").default;
  const Package   = require("../../../../models/Package").default;
  const { readAll: readDests } = require("../../../../utils/destStore");

  const { slug, id } = params;
  await connectDB();

  const dest = readDests().find(d => d.slug === slug && d.status === "Active");
  if (!dest) return { notFound: true };

  const pkgDoc = await Package.findOne({
    _id:    id,
    status: { $regex: /^active$/i },
  }).lean();
  if (!pkgDoc) return { notFound: true };
  const pkg = { ...pkgDoc, id: pkgDoc._id };

  return {
    props: {
      pkg:  JSON.parse(JSON.stringify(pkg)),
      dest: JSON.parse(JSON.stringify(dest)),
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

export default function PackageDetailPage({ pkg, dest }) {
  const [openDay, setOpenDay] = useState(1);

  const destName = dest.name || dest.title;
  const banner   = pkg.webBanner?.src || dest.mainImage?.src || "/assets/images/dubai/itinerary/banner.png";
  const price    = fmtPrice(pkg.finalPrice || pkg.basePrice);
  const rawAmenities = Array.isArray(pkg.amenities) ? pkg.amenities : [];
  const amenities = rawAmenities.map(a => typeof a === "string" ? { name: a, icon: AMENITY_ICONS[a] || null } : a);
  const days      = Array.isArray(pkg.days) ? pkg.days : [];

  const heroBig     = pkg.webBanner?.src || dest.mainImage?.src || "/assets/images/dubai/itinerary/left.png";
  const heroBigAlt  = pkg.webBanner?.alt || destName;
  const heroGallery = pkg.gallery || [];

  return (
    <>
      <Head>
        <title>{pkg.packageName || destName} — TourWatchOut</title>
        <meta name="description" content={pkg.metaDescription || `${destName} ${pkg.packageSubtype} package`} />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </Head>

      <div className="dubai-family-package family-packages itinerary-page">
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

              <div className="pdt-content">
                {/* Left content */}
                <div className="pdt-left">
                  <div className="pdt-header">
                    <h1 className="pdt-title">{pkg.packageName || `${pkg.packageSubtype} ${destName}`}</h1>
                    {pkg.duration && <div className="pdt-tag">{pkg.duration}</div>}
                  </div>

                  {pkg.destinationHighlights && (
                    <div className="location">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                      </svg>
                      <span>{pkg.destinationHighlights}</span>
                    </div>
                  )}

                  {/* Mobile price card */}
                  <div className="price-card desktop-none">
                    <div className="prices-row">
                      <div>
                        <div className="pc-top"><div className="pc-from">Starting from</div></div>
                        <div className="pc-price">
                          <div className="pc-amount">{price || "—"}</div>
                          <div className="pc-note">{pkg.priceType || "per person on twin sharing"}</div>
                        </div>
                      </div>
                      <div>
                        <img src={pkg.priceImage?.src || "/assets/images/dubai/itinerary/it-banner.png"} alt="package" />
                      </div>
                    </div>
                    <button className="pc-cta" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">Request A Callback</button>
                  </div>

                  {/* Banner */}
                  <div className="pdt-banner">
                    <img src={banner} alt={pkg.webBanner?.alt || destName} />
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


                    {/* Notes section */}
              <div className="dubai-family-notes">
                <div className="dfn-accordion">

                  {(pkg.inclusions || pkg.exclusions) && (
                    <AccordionSection title="Inclusions &amp; Exclusions">
                      {pkg.inclusions && (
                        <><h4 className="dfn-sub-heading">Inclusions</h4><BulletText text={pkg.inclusions} /></>
                      )}
                      {pkg.exclusions && (
                        <><h4 className="dfn-sub-heading">Exclusions</h4><BulletText text={pkg.exclusions} /></>
                      )}
                    </AccordionSection>
                  )}

                  {pkg.aboutText && (
                    <AccordionSection title={`About ${destName}`} defaultOpen>
                      <div className="dfn-about">
                        <div className="dfn-content">
                          <div className="dfn-intro">
                            {/* <img src="/assets/images/dubai/icons/info-circle.svg" alt="info" className="info-icon" /> */}
                            <p>{pkg.aboutText}</p>
                          </div>
                          {Array.isArray(pkg.aboutImages) &&
                            pkg.aboutImages.filter(i => i?.src).length > 0 && (
                              <div className="dfn-highlights">
                                {pkg.aboutImages.filter(i => i?.src).map((img, idx) => (
                                  <img key={idx} src={img.src} alt={img.alt || "about"} />
                                ))}
                              </div>
                          )}
                        </div>
                      </div>
                    </AccordionSection>
                  )}

                  {pkg.bucketListText && (
                    <AccordionSection title={`${destName} Bucket List`}>
                      <BulletText text={pkg.bucketListText} />
                      {Array.isArray(pkg.bucketImages) &&
                        pkg.bucketImages.filter(i => i?.src).length > 0 && (
                          <div className="dfn-highlights">
                            {pkg.bucketImages.filter(i => i?.src).map((img, idx) => (
                              <img key={idx} src={img.src} alt={img.alt || "bucket"} />
                            ))}
                          </div>
                      )}
                    </AccordionSection>
                  )}

                  {(pkg.cancellationPolicy || pkg.bookingPolicy || pkg.termsConditions) && (
                    <AccordionSection title="Cancellation &amp; Policies">
                      {pkg.cancellationPolicy && (
                        <><h4 className="dfn-sub-heading">Cancellation Policy</h4><BulletText text={pkg.cancellationPolicy} /></>
                      )}
                      {pkg.bookingPolicy && (
                        <><h4 className="dfn-sub-heading">Booking Policy</h4><p>{pkg.bookingPolicy}</p></>
                      )}
                      {pkg.termsConditions && (
                        <><h4 className="dfn-sub-heading">Terms &amp; Conditions</h4><p>{pkg.termsConditions}</p></>
                      )}
                    </AccordionSection>
                  )}

                </div>
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
                          <div className="pc-note">{pkg.priceType || "per person on twin sharing"}</div>
                        </div>
                      </div>
                      <div>
                        <img src={pkg.priceImage?.src || "/assets/images/dubai/itinerary/it-banner.png"} alt="package" />
                      </div>
                    </div>
                    <button className="pc-cta" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">Request A Callback</button>
                  </div>

                  <div className="enquiry-card mobile-none">
                    {pkg.advertisement?.image?.src && (
                      <img
                        src={pkg.advertisement.image.src}
                        alt={pkg.advertisement.image.alt || "offer"}
                        className="enq-ad-img"
                      />
                    )}
                    <div className="enq-badge">
                      {pkg.advertisement?.headline
                        ? <span className="offer">{pkg.advertisement.headline}</span>
                        : <><span className="offer">Flat 20% </span>Off On Your First Tour Package!</>}
                    </div>
                    <p className="query-form-heading">
                      {pkg.advertisement?.subtext || "Your Dream Destination Just One Click away"}
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
              {/* {pkg.advertisement?.image?.src && (
                <div className="pdt-promo-banner">
                  <img
                    src={pkg.advertisement.image.src}
                    alt={pkg.advertisement.image.alt || "advertisement"}
                  />
                </div>
              )} */}


              {/* <PromoSection/> */}


         

            

            </section>
          </div>
        </div>

        {/* <BottomReviews /> */}

      <BenifitSection/>
      <MostPopular/>
        <BottomReviews />

              <PromoSection/>


        <FAQs />
        <Blogs />
        <Popup />
        <NewFooter />
      </div>
    </>
  );
}
