import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
import PackageReviews from "../../../../components/reviews/PackageReviews";

const HOTEL_AMENITY_ICONS = {
  "Breakfast":           "/assets/images/icons/itinerary/icon1.svg",
  "Breakfast & Dinner":  "/assets/images/icons/itinerary/icon1.svg",
  "Lunch":               "/assets/images/icons/itinerary/icon1.svg",
  "Dinner":              "/assets/images/icons/itinerary/icon1.svg",
  "All Meals":           "/assets/images/icons/itinerary/icon1.svg",
  "Room Service":        "/assets/images/icons/itinerary/icon1.svg",
  "Restaurant":          "/assets/images/icons/itinerary/icon1.svg",
  "Bar":                 "/assets/images/icons/itinerary/icon1.svg",
  "WiFi":                "/assets/images/icons/itinerary/icon4.svg",
  "Parking":             "/assets/images/icons/itinerary/icon5.svg",
  "Transport":           "/assets/images/icons/itinerary/icon5.svg",
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

  // Fetch vendor data so the Inclusions section can show gallery + details
  let vendorMap = {};
  try {
    const Vendor    = require("../../../../models/Vendor").default;
    const vendorIds = [
      ...(pkg.stays            || []).map(s => s.vendorId),
      ...(pkg.transfers        || []).map(t => t.vendorId),
      ...(pkg.activityBookings || []).map(a => a.vendorId),
    ].filter(Boolean);
    if (vendorIds.length > 0) {
      const docs = await Vendor.find({ _id: { $in: vendorIds } }).lean();
      docs.forEach(v => { vendorMap[v._id] = v; });
    }
  } catch (_) { /* non-critical */ }

  return {
    props: {
      pkg:       JSON.parse(JSON.stringify(pkg)),
      dest:      JSON.parse(JSON.stringify(dest)),
      vendorMap: JSON.parse(JSON.stringify(vendorMap)),
    },
  };
}

function fmtPrice(val) {
  const n = Number(val);
  return n ? `₹${n.toLocaleString("en-IN")}` : null;
}

function AccordionSection({ title, open, onToggle, children }) {
  return (
    <div className="dfn-section">
      <button className="dfn-section-header" onClick={onToggle} aria-expanded={open}>
        <span className="dfn-pill">{title}</span>
        <span className="faq-icon" style={{ display:"inline-block", transform: open ? "rotate(-90deg)" : "rotate(90deg)", transition:"0.3s ease", fontSize:"20px" }}>
          &gt;
        </span>
      </button>
      {open && <div className="dfn-panel">{children}</div>}
    </div>
  );
}

export default function PackageDetailPage({ pkg, dest, vendorMap = {} }) {
  const [openDay, setOpenDay]         = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [activeTab, setActiveTab]     = useState("itinerary");
  const [inclSubTab, setInclSubTab]   = useState(
    (pkg.stays || []).length > 0 ? "stays" : (pkg.transfers || []).length > 0 ? "transfers" : "activities"
  );
  const [tabsFixed, setTabsFixed] = useState(false);
  const [tabsH, setTabsH]         = useState(50);
  const router = useRouter();

  /* ── Sidebar query form state ── */
  const [qForm, setQForm] = useState({
    name: "", destination: dest?.name || dest?.title || "", phone: "",
    email: "", travelDate: "", pax: "", message: "",
  });
  const [qLoading, setQLoading] = useState(false);
  const [qDone,    setQDone]    = useState(false);
  const [qHoneypot, setQHoneypot] = useState("");
  const qLoadTime = useRef(Date.now());

  const [qUtm, setQUtm] = useState({});
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQUtm({
      source: p.get("utm_source") || "", medium: p.get("utm_medium") || "",
      campaign: p.get("utm_campaign") || "", adset: p.get("utm_adset") || p.get("utm_term") || "",
      adContent: p.get("utm_content") || "", campaignId: p.get("utm_id") || p.get("campaign_id") || "",
    });
  }, []);

  function handleQChange(e) {
    const { name, value } = e.target;
    if (name === "phone") {
      setQForm(p => ({ ...p, phone: value.replace(/[^\d\s+\-()]/g, "") }));
      return;
    }
    setQForm(p => ({ ...p, [name]: value }));
  }

  async function handleQuerySubmit(e) {
    e.preventDefault();
    const digits = qForm.phone.replace(/\D/g, "");
    if (digits.length < 10) { toast.error("Please enter a valid 10-digit mobile number.", { id: "qf-err" }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(qForm.email)) { toast.error("Please enter a valid email address.", { id: "qf-err" }); return; }

    setQLoading(true);
    try {
      const res = await fetch("/api/dashboard/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...qForm, formType: "Query Form", ...qUtm,
          _hp: qHoneypot, _t: qLoadTime.current,
        }),
      });
      if (res.status === 409) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.field === "phone" ? "This mobile is already registered." : "This email is already registered.", { id: "qf-err", duration: 5000 });
        return;
      }
      if (res.status === 429) { toast.error("Too many attempts. Please try again later.", { id: "qf-err" }); return; }
      if (!res.ok) { const d = await res.json().catch(() => ({})); toast.error(d.message || "Failed to submit.", { id: "qf-err" }); return; }
      setQDone(true);
    } catch { toast.error("Network error. Please try again.", { id: "qf-err" }); }
    finally { setQLoading(false); }
  }

  function openCallback(e) {
    if (e) e.preventDefault();
    const el = document.getElementById("exampleModalCenter");
    if (el && window.bootstrap) {
      window.bootstrap.Modal.getOrCreateInstance(el).show();
    } else if (el && window.$) {
      window.$(el).modal("show");
    }
  }

  const tabBarRef         = useRef(null);
  const tabsSentinelRef   = useRef(null);
  const itineraryRef      = useRef(null);
  const inclusionsRef     = useRef(null);
  const highlightsRef     = useRef(null);
  const staysRef          = useRef(null);
  const transfersRef      = useRef(null);
  const activitiesRef     = useRef(null);

  const stays            = pkg.stays            || [];
  const transfers        = pkg.transfers        || [];
  const activityBookings = pkg.activityBookings || [];

  const hasVendorContent = stays.length > 0 || transfers.length > 0 || activityBookings.length > 0;
  const hasInclusions    = hasVendorContent || pkg.inclusions || pkg.exclusions;
  const hasHighlights    = pkg.aboutText || pkg.bucketListText;

  // Re-measure tab bar height whenever active tab changes (sub-tabs row appears/disappears)
  useEffect(() => {
    if (tabBarRef.current) setTabsH(tabBarRef.current.offsetHeight);
  }, [activeTab]);

  // Sticky tabs + active-section + active sub-tab detection
  useEffect(() => {
    function onScroll() {
      // Fix tab bar to top of viewport once sentinel scrolls off screen
      if (tabsSentinelRef.current) {
        setTabsFixed(tabsSentinelRef.current.getBoundingClientRect().top <= 0);
      }

      const barH = (tabBarRef.current?.offsetHeight || 50) + 8;

      // Active main-tab detection
      const inclTop = inclusionsRef.current?.getBoundingClientRect().top;
      const hiTop   = highlightsRef.current?.getBoundingClientRect().top;
      let newTab = "itinerary";
      if      (hiTop   !== undefined && hiTop   <= barH) newTab = "highlights";
      else if (inclTop !== undefined && inclTop <= barH) newTab = "inclusions";
      setActiveTab(newTab);

      // Active sub-tab detection (scroll-based highlight)
      const actTop = activitiesRef.current?.getBoundingClientRect().top;
      const trTop  = transfersRef.current?.getBoundingClientRect().top;
      const stTop  = staysRef.current?.getBoundingClientRect().top;
      if      (actTop !== undefined && actTop <= barH) setInclSubTab("activities");
      else if (trTop  !== undefined && trTop  <= barH) setInclSubTab("transfers");
      else if (stTop  !== undefined && stTop  <= barH) setInclSubTab("stays");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTab(ref) {
    if (!ref.current) return;
    const barH = tabBarRef.current?.offsetHeight || 50;
    const top  = ref.current.getBoundingClientRect().top + window.scrollY - barH - 6;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function scrollToSubTab(ref) {
    if (!ref.current) return;
    const barH = tabBarRef.current?.offsetHeight || 94;
    const top  = ref.current.getBoundingClientRect().top + window.scrollY - barH - 6;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function toggleSection(key) {
    setOpenSection(prev => prev === key ? null : key);
  }

  function handlePayClick(e) {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("tw_user_token") : null;
    if (!token) {
      toast.error("Please login to proceed with booking.", { duration: 3000 });
      const dest_url = encodeURIComponent(`/checkout?packageId=${pkg.id}&slug=${dest.slug}`);
      router.push(`/login?redirect=${dest_url}`);
      return;
    }
    router.push(`/checkout?packageId=${pkg.id}&slug=${dest.slug}`);
  }

  const destName     = dest.name || dest.title;
  const banner       = pkg.webBanner?.src || dest.mainImage?.src || "/assets/images/dubai/itinerary/banner.png";
  const price        = fmtPrice(pkg.finalPrice || pkg.basePrice);
  const rawAmenities = Array.isArray(pkg.amenities) ? pkg.amenities : [];
  const amenities    = rawAmenities.map(a => typeof a === "string" ? { name: a, icon: AMENITY_ICONS[a] || null } : a);
  const days         = Array.isArray(pkg.days) ? pkg.days : [];
  const heroBig      = pkg.webBanner?.src || dest.mainImage?.src || "/assets/images/dubai/itinerary/left.png";
  const heroGallery  = pkg.gallery || [];

  const pkgFaqs    = Array.isArray(pkg.faqs)    ? pkg.faqs.filter(f => f.question) : [];
  const pkgSchemas = Array.isArray(pkg.schemas) ? pkg.schemas.filter(s => s.content) : [];

  return (
    <>
      <Head>
        <title>{pkg.metaTitle || pkg.packageName || destName} — TourWatchOut</title>
        <meta name="description" content={pkg.metaDescription || `${destName} ${pkg.packageSubtype} package`} />
        {pkg.metaKeywords && <meta name="keywords" content={pkg.metaKeywords} />}
        {pkg.metaRobots   && <meta name="robots"   content={pkg.metaRobots} />}
        <link rel="stylesheet" href="/assets/css/style.css" />
        {pkgSchemas.map((sc, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: sc.content }} />
        ))}
      </Head>

      <div className="dubai-family-package family-packages itinerary-page">
        <Topbar />
        <Offcanvas />

        {/* Mobile Hero */}
        <div className="pdt-mob-hero desktop-none">
          <img
            src={pkg.mobileBanner?.src || pkg.webBanner?.src || dest.mainImage?.src || "/assets/images/dubai/itinerary/banner.png"}
            alt={pkg.mobileBanner?.alt || pkg.webBanner?.alt || destName}
            onError={e => { e.target.src = "/assets/images/dubai/itinerary/banner.png"; }}
          />
        </div>

        {/* Hero Gallery */}
        <div className="container mobile-none">
          <div className="dubai-gallery-section">
            <div className="dgs-grid">
              <div className="dgs-big">
                <img src={heroBig} alt={pkg.webBanner?.alt || destName}
                  onError={e => { e.target.src = "/assets/images/dubai/itinerary/left.png"; }} />
              </div>
              <div className="dgs-small-grid">
                {[0,1,2,3].map((i, idx) => {
                  const g        = heroGallery[i];
                  const fallback = `/assets/images/dubai/itinerary/img${i === 0 ? "" : i + 1}.png`;
                  return (
                    <img key={i}
                      className={idx === 1 ? "top-right-img" : idx === 3 ? "top-bottom-img" : ""}
                      src={g?.src || fallback}
                      alt={g?.alt || `${destName} ${i + 1}`}
                      onError={e => { e.target.src = fallback; }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="package-details-page">
          <div className="container">
            <section className="package-details-tabs">
              <div className="pdt-content">

                {/* ── LEFT column ── */}
                <div className="pdt-left">

                  {/* Package title */}
                  <div className="pdt-header">
                    <h1 className="pdt-title">{pkg.packageName || `${pkg.packageSubtype} ${destName}`}</h1>
                    {pkg.duration && <div className="pdt-tag mobile-none">{pkg.duration}</div>}
                  </div>

                  {/* Desktop location row */}
                  {pkg.destinationHighlights && (
                    <div className="location mobile-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                      </svg>
                      <span>{pkg.destinationHighlights}</span>
                    </div>
                  )}

                  {/* ── MOBILE CARD (replaces all above on mobile) ── */}
                  <div className="mob-info-card desktop-none">

                    {/* Row 1: title + rating */}
                    <div className="mob-info-title-row">
                      <h2 className="mob-info-title">{pkg.packageName || `${pkg.packageSubtype} ${destName}`}</h2>
                      <div className="mob-pc-rating">
                        <span>Rating: {pkg.rating || "4.5"}</span>
                        <img src="/assets/images/icons/itinerary/iti.svg" alt="Rating" />
                      </div>
                    </div>

                    {/* Row 2: duration chip + highlights */}
                    <div className="mob-info-meta">
                      {pkg.duration && <span className="mob-info-duration">{pkg.duration}</span>}
                      {pkg.destinationHighlights && (
                        <span className="mob-info-highlights">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                          </svg>
                          {pkg.destinationHighlights}
                        </span>
                      )}
                    </div>

                    {/* Row 3: price */}
                    <div className="mob-info-price-row">
                      <div className="mob-info-old-row">
                        {pkg.basePrice && pkg.finalPrice && String(pkg.basePrice) !== String(pkg.finalPrice) && (
                          <>
                            <span className="mob-info-old">{fmtPrice(pkg.basePrice)}</span>
                            <span className="mob-info-off">{Math.round((1 - Number(pkg.finalPrice)/Number(pkg.basePrice))*100)}% OFF</span>
                          </>
                        )}
                      </div>
                      <div className="mob-info-price">{price || "—"} <span className="mob-info-per">/person</span></div>
                      {pkg.priceType && <div className="mob-info-note">{pkg.priceType}</div>}
                    </div>

                  </div>

                  {/* Mobile sticky bottom bar */}
                  <div className="mob-sticky-bar desktop-none">
                    <div className="mob-sticky-left">
                      <span className="mob-sticky-amount">{price || "—"}</span>
                      <a href="#cancellation-policy" className="mob-sticky-policy">*Cancellation Policy</a>
                    </div>
                    <button className="mob-sticky-cta" onClick={openCallback}>Request Callback</button>
                  </div>

                  {/* Banner */}
                  <div className="pdt-banner">
                    <img src={banner} alt={pkg.webBanner?.alt || destName}
                      onError={e => { e.target.src = "/assets/images/dubai/itinerary/banner.png"; }} />
                    <div className="pdt-banner-chips">
                      <span className="chip left">
                        <img src="/assets/images/icons/itinerary/flight.svg" alt="" /> Flight Excluded
                      </span>
                      <span className="chip right">
                        Rating: 4.5 <img src="/assets/images/icons/itinerary/stars.svg" alt="" />
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

                  <div ref={tabsSentinelRef} />
                  {tabsFixed && <div style={{ height: tabsH }} />}
                  <div
                    ref={tabBarRef}
                    className={`pkg-tabs-bar${tabsFixed ? " pkg-tabs-bar--fixed" : ""}`}
                    style={tabsFixed ? { position:"fixed", top:0, left:0, right:0, zIndex:200, background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,0.12)" } : {}}>
                    {/* Row 1: main tabs */}
                    <div className="pkg-tabs-inner">
                      <button
                        className={`pkg-tab-item ${activeTab === "itinerary" ? "active" : ""}`}
                        onClick={() => scrollToTab(itineraryRef)}>
                        Itinerary
                      </button>
                      {hasInclusions && (
                        <button
                          className={`pkg-tab-item ${activeTab === "inclusions" ? "active" : ""}`}
                          onClick={() => scrollToTab(inclusionsRef)}>
                          Inclusions
                        </button>
                      )}
                      {hasHighlights && (
                        <button
                          className={`pkg-tab-item ${activeTab === "highlights" ? "active" : ""}`}
                          onClick={() => scrollToTab(highlightsRef)}>
                          Highlights
                        </button>
                      )}
                    </div>
                    {/* Row 2: sub-tabs — visible only when in Inclusions */}
                    {activeTab === "inclusions" && hasVendorContent && (
                      <div className={`pkg-tabs-inner pkg-subtabs-row${tabsFixed ? " pkg-subtabs-row--fixed" : ""}`}>
                        {stays.length > 0 && (
                          <button className={`pkg-sub-tab ${inclSubTab === "stays" ? "active" : ""}`}
                            onClick={() => scrollToSubTab(staysRef)}>Stay</button>
                        )}
                        {transfers.length > 0 && (
                          <button className={`pkg-sub-tab ${inclSubTab === "transfers" ? "active" : ""}`}
                            onClick={() => scrollToSubTab(transfersRef)}>Transfers</button>
                        )}
                        {activityBookings.length > 0 && (
                          <button className={`pkg-sub-tab ${inclSubTab === "activities" ? "active" : ""}`}
                            onClick={() => scrollToSubTab(activitiesRef)}>Activities</button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ══ SECTION 1: Itinerary ══ */}
                  <div ref={itineraryRef} className="pkg-section">
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

                    {/* Policies accordion at bottom of Itinerary */}
                    {(pkg.cancellationPolicy || pkg.bookingPolicy || pkg.termsConditions) && (
                      <div className="dubai-family-notes">
                        <div className="dfn-accordion">
                          <div id="cancellation-policy">
                            <AccordionSection title="Cancellation &amp; Policies" open={openSection === "policies"} onToggle={() => toggleSection("policies")}>
                              {pkg.cancellationPolicy && (
                                <><h4 className="dfn-sub-heading">Cancellation Policy</h4><p>{pkg.cancellationPolicy}</p></>
                              )}
                              {pkg.bookingPolicy && (
                                <><h4 className="dfn-sub-heading">Booking Policy</h4><p>{pkg.bookingPolicy}</p></>
                              )}
                              {pkg.termsConditions && (
                                <><h4 className="dfn-sub-heading">Terms &amp; Conditions</h4><p>{pkg.termsConditions}</p></>
                              )}
                            </AccordionSection>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ══ SECTION 2: Inclusions ══ */}
                  {hasInclusions && (
                    <div ref={inclusionsRef} className="pkg-section">

                      {/* ── Inline sub-tabs (always visible at top of Inclusions) ── */}
                      {hasVendorContent && (
                        <div className="pkg-inline-subtabs">
                          {stays.length > 0 && (
                            <button className={`pkg-inline-subtab ${inclSubTab === "stays" ? "active" : ""}`}
                              onClick={() => scrollToSubTab(staysRef)}>Stays</button>
                          )}
                          {transfers.length > 0 && (
                            <button className={`pkg-inline-subtab ${inclSubTab === "transfers" ? "active" : ""}`}
                              onClick={() => scrollToSubTab(transfersRef)}>Transfers</button>
                          )}
                          {activityBookings.length > 0 && (
                            <button className={`pkg-inline-subtab ${inclSubTab === "activities" ? "active" : ""}`}
                              onClick={() => scrollToSubTab(activitiesRef)}>Activities</button>
                          )}
                        </div>
                      )}

                      {/* ── Stay cards ── */}
                      {stays.length > 0 && (
                        <div ref={staysRef} className="pkg-sub-section">
                          <div className="pkg-sub-section-header">
                            <h3 className="pkg-sub-section-title">Stay</h3>
                          </div>
                          <div className="pkg-vendor-cards">
                            {stays.map((stay, i) => {
                              const vendor = vendorMap[stay.vendorId] || {};
                              // For old packages that pre-date the new fields, fall back to live vendor data
                              const matchedRoom = (vendor.hotelRooms || []).find(r => r.roomType === stay.roomCategory);
                              const roomName   = stay.roomName   || matchedRoom?.roomName   || "";
                              const bedType    = stay.bedType    || matchedRoom?.bedType    || "";
                              const roomSize   = stay.roomSize   || matchedRoom?.roomSize   || "";
                              const starRating = stay.starRating || vendor.starRating       || null;
                              const amenities  = (stay.amenities || []).length > 0
                                ? stay.amenities
                                : (matchedRoom?.amenities || []);
                              const images = (matchedRoom?.gallery || []).filter(g => g?.src).length > 0
                                ? (matchedRoom.gallery).filter(g => g?.src)
                                : (stay.vendorImg ? [{ src: stay.vendorImg, alt: stay.vendorName }] : []);
                              return (
                                <div key={i} className="pkg-vendor-card">
                                  <div className="pkg-card-stay-label">Stay {i + 1}</div>
                                  {images.length > 1 ? (
                                    <div className="pkg-vendor-swiper">
                                      <Swiper
                                        modules={[Pagination, Autoplay]}
                                        pagination={{ clickable: true }}
                                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        style={{ height: "100%" }}>
                                        {images.map((img, j) => (
                                          <SwiperSlide key={j}>
                                            <img src={img.src} alt={img.alt || stay.vendorName} className="pkg-vendor-img" />
                                          </SwiperSlide>
                                        ))}
                                      </Swiper>
                                    </div>
                                  ) : images.length === 1 ? (
                                    <img src={images[0].src} alt={images[0].alt || stay.vendorName} className="pkg-vendor-img" />
                                  ) : (
                                    <div className="pkg-vendor-img-placeholder">🏨</div>
                                  )}
                                  <div className="pkg-vendor-info">
                                    <h4 className="pkg-vendor-name">{roomName || stay.vendorName || "Hotel name or similar"}</h4>
                                    {bedType && (
                                      <div className="pkg-stay-bed-type">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 10v10"/><path d="M2 15h20"/></svg>
                                        {bedType}
                                      </div>
                                    )}
                                    <div className="pkg-stay-tags">
                                      {starRating && (
                                        <span className="pkg-stay-star-tag">
                                          {starRating} ⭐ Hotel
                                        </span>
                                      )}
                                      {stay.roomCategory && <span className="pkg-vendor-badge">{stay.roomCategory}</span>}
                                      {roomSize && <span className="pkg-stay-size-tag">{roomSize}</span>}
                                    </div>
                                    {amenities.length > 0 && (
                                      <div className="pkg-stay-amenities">
                                        {amenities.map(am => (
                                          <span key={am} className="pkg-stay-amenity">
                                            {HOTEL_AMENITY_ICONS[am]
                                              ? <img src={HOTEL_AMENITY_ICONS[am]} className="pkg-am-icon" alt={am} />
                                              : <span className="pkg-am-icon-fallback">✓</span>
                                            } {am}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <div className="pkg-vendor-pricing-row">
                                      {stay.price > 0 && <><span>₹{Number(stay.price).toLocaleString("en-IN")}/night</span><span className="pkg-x">×</span></>}
                                      <span>{stay.nights}N</span>
                                      {stay.rooms > 1 && <><span className="pkg-x">×</span><span>{stay.rooms} rooms</span></>}
                                      {stay.total > 0 && <span className="pkg-total">= ₹{Number(stay.total).toLocaleString("en-IN")}</span>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ── Transfer cards (always visible) ── */}
                      {transfers.length > 0 && (
                        <div ref={transfersRef} className="pkg-sub-section">
                          <div className="pkg-sub-section-header">
                            <h3 className="pkg-sub-section-title">Transfers</h3>
                          </div>
                          <div className="pkg-vendor-cards">
                            {transfers.map((tr, i) => {
                              const vendor  = vendorMap[tr.vendorId] || {};
                              const vehDoc  = (vendor.vehicles || []).find(v => v.vehicleType === tr.vehicleType);
                              const imgSrc  = vehDoc?.vehicleImage?.src || tr.vehicleImg || "";
                              return (
                                <div key={i} className="pkg-vendor-card">
                                  {imgSrc
                                    ? <img src={imgSrc} alt={tr.vehicleType} className="pkg-vendor-img" />
                                    : <div className="pkg-vendor-img-placeholder">🚗</div>}
                                  <div className="pkg-vendor-info">
                                    <h4 className="pkg-vendor-name">{tr.vendorName || "Transfer"}</h4>
                                    <div className="pkg-vendor-meta">
                                      {tr.vehicleType && <span className="pkg-vendor-badge">{tr.vehicleType}</span>}
                                    </div>
                                    <div className="pkg-vendor-pricing-row">
                                      {tr.pricePerDay > 0 && <><span>₹{Number(tr.pricePerDay).toLocaleString("en-IN")}/day</span><span className="pkg-x">×</span></>}
                                      <span>{tr.days} day{tr.days > 1 ? "s" : ""}</span>
                                      {tr.total > 0 && <span className="pkg-total">= ₹{Number(tr.total).toLocaleString("en-IN")}</span>}
                                    </div>
                                    {(tr.inclusions || []).length > 0 && (
                                      <div className="pkg-vendor-inclusions">
                                        {tr.inclusions.map(inc => <span key={inc} className="pkg-incl-chip">{inc}</span>)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ── Activity cards (always visible) ── */}
                      {activityBookings.length > 0 && (
                        <div ref={activitiesRef} className="pkg-sub-section">
                          <div className="pkg-sub-section-header">
                            <h3 className="pkg-sub-section-title">Activities</h3>
                          </div>
                          <div className="pkg-vendor-cards">
                            {activityBookings.map((ab, i) => {
                              const vendor = vendorMap[ab.vendorId] || {};
                              const actDoc = (vendor.activities || []).find(a => a.activityName === ab.activityName);
                              const imgSrc = actDoc?.activityImage?.src || ab.activityImg || "";
                              return (
                                <div key={i} className="pkg-vendor-card">
                                  {imgSrc
                                    ? <img src={imgSrc} alt={ab.activityName} className="pkg-vendor-img" />
                                    : <div className="pkg-vendor-img-placeholder">🏄</div>}
                                  <div className="pkg-vendor-info">
                                    <h4 className="pkg-vendor-name">{ab.activityName || "Activity"}</h4>
                                    <div className="pkg-vendor-meta">
                                      {ab.vendorName && <span className="pkg-vendor-badge">{ab.vendorName}</span>}
                                    </div>
                                    <div className="pkg-vendor-pricing-row">
                                      {ab.pricePerPerson > 0 && <><span>₹{Number(ab.pricePerPerson).toLocaleString("en-IN")}/person</span><span className="pkg-x">×</span></>}
                                      <span>{ab.persons} person{ab.persons > 1 ? "s" : ""}</span>
                                      {ab.total > 0 && <span className="pkg-total">= ₹{Number(ab.total).toLocaleString("en-IN")}</span>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Text Inclusions & Exclusions */}
                      {(pkg.inclusions || pkg.exclusions) && (
                        <div className="dubai-family-notes">
                          <div className="dfn-accordion">
                            <AccordionSection title="Inclusions &amp; Exclusions" open={openSection === "inclusions"} onToggle={() => toggleSection("inclusions")}>
                              {pkg.inclusions && (
                                <><h4 className="dfn-sub-heading inclusion-head">Includes</h4>
                                <div className="dfn-rich-text" dangerouslySetInnerHTML={{ __html: pkg.inclusions }} /></>
                              )}
                              {pkg.exclusions && (
                                <><h4 className="dfn-sub-heading exclusion-head">Not Includes</h4>
                                <div className="dfn-rich-text" dangerouslySetInnerHTML={{ __html: pkg.exclusions }} /></>
                              )}
                            </AccordionSection>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ══ SECTION 3: Highlights ══ */}
                  {hasHighlights && (
                    <div ref={highlightsRef} className="pkg-section">
                      {pkg.aboutText && (
                        <div className="pkg-highlights-block">
                          <h3 className="pkg-highlights-title">About {destName}</h3>
                          <p className="pkg-highlights-text">{pkg.aboutText}</p>
                          {Array.isArray(pkg.aboutImages) && pkg.aboutImages.filter(i => i?.src).length > 0 && (
                            <div className="dfn-highlights">
                              {pkg.aboutImages.filter(i => i?.src).map((img, idx) => (
                                <img key={idx} src={img.src} alt={img.alt || "about"} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {pkg.bucketListText && (
                        <div className="pkg-highlights-block">
                          <h3 className="pkg-highlights-title">{destName} Bucket List</h3>
                          <div className="pkg-bucket-list">
                            {pkg.bucketListText.split("\n").filter(Boolean).map((line, i) => (
                              <div key={i} className="pkg-bucket-item">
                                <span className="pkg-bucket-dot">✦</span>
                                <span>{line.replace(/^[•\-✦]\s*/, "")}</span>
                              </div>
                            ))}
                          </div>
                          {Array.isArray(pkg.bucketImages) && pkg.bucketImages.filter(i => i?.src).length > 0 && (
                            <div className="dfn-highlights">
                              {pkg.bucketImages.filter(i => i?.src).map((img, idx) => (
                                <img key={idx} src={img.src} alt={img.alt || "bucket"} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
                {/* ── end pdt-left ── */}

                {/* Right sidebar */}
                <aside className="pdt-right">
                  <div className="price-card mobile-none">
                    <div className="prices-row">
                      <div>
                        <div className="pc-top">
                          <div className="pc-from">
                            Starting from
                            {pkg.basePrice && pkg.finalPrice && pkg.basePrice !== pkg.finalPrice && (
                              <span className="pc-old">{fmtPrice(pkg.basePrice)}</span>
                            )}
                          </div>
                        </div>
                        <div className="pc-price">
                          <div className="pc-amount">{price || "—"}</div>
                          <div className="pc-note">{pkg.priceType || "02 Couples"}</div>
                        </div>
                      </div>
                      <div>
                        <img src={pkg.priceImage?.src || "/assets/images/dubai/itinerary/it-banner.png"} alt="package" />
                      </div>
                    </div>
                    <button className="pc-cta-pay" onClick={openCallback}>
                      Request Callback
                    </button>
                  </div>

                  <div className="enquiry-card mobile-none">
                    {pkg.advertisement?.image?.src && (
                      <img src={pkg.advertisement.image.src} alt={pkg.advertisement.image.alt || "offer"} className="enq-ad-img" />
                    )}
                    <div className="enq-badge">
                      {pkg.advertisement?.headline
                        ? <span className="offer">{pkg.advertisement.headline}</span>
                        : <><span className="offer">Flat 20% </span>Off On Your First Tour Package!</>}
                    </div>
                    <p className="query-form-heading">
                      {pkg.advertisement?.subtext || "Your Dream Destination Just One Click away"}
                    </p>
                    {/* Honeypot — invisible */}
                    <div aria-hidden="true" style={{ position:"absolute", left:"-9999px", width:1, height:1, overflow:"hidden", opacity:0 }}>
                      <input type="text" name="_qhp" value={qHoneypot} onChange={e => setQHoneypot(e.target.value)} tabIndex={-1} autoComplete="nope" />
                    </div>

                    {qDone ? (
                      <div style={{ textAlign:"center", padding:"28px 12px" }}>
                        <div style={{ fontSize:36, marginBottom:8 }}>✓</div>
                        <div style={{ fontWeight:700, color:"#16a34a", fontSize:15, marginBottom:6 }}>Request Received!</div>
                        <div style={{ fontSize:13, color:"#64748b" }}>Our travel expert will call you shortly.</div>
                      </div>
                    ) : (
                      <form className="enq-form" onSubmit={handleQuerySubmit} autoComplete="off">
                        <input type="text" name="name" placeholder="Full Name *" value={qForm.name} onChange={handleQChange} required />
                        <input type="text" name="destination" placeholder="Destination" value={qForm.destination} onChange={handleQChange} />
                        <div className="enq-phone">
                          <select><option value="+91">+91</option></select>
                          <input type="tel" name="phone" placeholder="0000 0000 00" value={qForm.phone} onChange={handleQChange} inputMode="numeric" maxLength={15} required />
                        </div>
                        <input type="email" name="email" placeholder="Email *" value={qForm.email} onChange={handleQChange} required />
                        <div style={{ display:"flex", gap:8 }}>
                          <input type="date" name="travelDate" value={qForm.travelDate} onChange={handleQChange}
                            min={new Date().toISOString().split("T")[0]}
                            style={{ flex:1, border:"1px solid #e5e7eb", borderRadius:6, padding:"10px 10px", fontSize:13, color: qForm.travelDate ? "#0c141d" : "#9ca3af", outline:"none", background:"#fff" }}
                          />
                          <input type="number" name="pax" placeholder="Travellers" value={qForm.pax} onChange={handleQChange}
                            min="1" max="50" inputMode="numeric"
                            style={{ flex:1, border:"1px solid #e5e7eb", borderRadius:6, padding:"10px 10px", fontSize:13, outline:"none", background:"#fff" }}
                          />
                        </div>
                        <textarea name="message" placeholder="Message (optional)" value={qForm.message} onChange={handleQChange}
                          rows={2} style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:6, padding:"10px 12px", fontSize:13, outline:"none", resize:"none", background:"#fff", boxSizing:"border-box", fontFamily:"inherit" }}
                        />
                        <button className="enq-submit" type="submit" disabled={qLoading}>
                          {qLoading ? "Sending…" : "Request Callback"}
                        </button>
                      </form>
                    )}
                  </div>
                </aside>

              </div>
            </section>
          </div>
        </div>

        {/* <BenifitSection /> */}
        <MostPopular />
        <PackageReviews
          packageId={pkg.id}
          packageName={pkg.packageName}
          destinationSlug={dest.slug}
        />
        <PromoSection />
        <FAQs items={pkgFaqs.length > 0 ? pkgFaqs : null} />
        <Blogs />
        <Popup asDrawer autoShowDelay={15000} packageInfo={{
          name:       pkg.packageName || dest.name || dest.title,
          image:      pkg.priceImage?.src || pkg.featureImage?.src || null,
          finalPrice: pkg.finalPrice || pkg.basePrice,
          basePrice:  pkg.basePrice,
        }} />
        <NewFooter />
      </div>

    </>
  );
}
