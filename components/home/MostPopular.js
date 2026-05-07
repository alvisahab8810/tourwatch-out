import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css/pagination";

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

const STATIC = [
  {
    id: "s1",
    image: "/assets/images/i-destination/dubai.webp",
    href: "/dubai-package",
    name: "Dubai",
    duration: "8N/7D",
    highlights: "Downtown Dubai • Old Dubai • Desert Safari",
    basePrice: 80000,
    finalPrice: 50000,
    priceType: "per person on twin sharing",
    amenities: [],
  },
  {
    id: "s2",
    image: "/assets/images/i-destination/bali.webp",
    href: "#",
    name: "Bali",
    duration: "4N/5D",
    highlights: "Kintamani • Ubud • Tanjung Benoa",
    basePrice: 180000,
    finalPrice: 150000,
    priceType: "per person on twin sharing",
    amenities: [],
  },
  {
    id: "s3",
    image: "/assets/images/i-destination/thailand.webp",
    href: "#",
    name: "Thailand",
    duration: "4N/5D",
    highlights: "Kintamani • Ubud • Tanjung Benoa",
    basePrice: 180000,
    finalPrice: 130000,
    priceType: "per person on twin sharing",
    amenities: [],
  },
  {
    id: "s4",
    image: "/assets/images/i-destination/singapore.webp",
    href: "#",
    name: "Singapore",
    duration: "4N/5D",
    highlights: "Kintamani • Ubud • Tanjung Benoa",
    basePrice: 180000,
    finalPrice: 150000,
    priceType: "per person on twin sharing",
    amenities: [],
  },
  {
    id: "s5",
    image: "/assets/images/i-destination/malaysia.webp",
    href: "#",
    name: "Malaysia",
    duration: "4N/5D",
    highlights: "Kintamani • Ubud • Tanjung Benoa",
    basePrice: 180000,
    finalPrice: 170000,
    priceType: "per person on twin sharing",
    amenities: [],
  },
];

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function getHref(pkg) {
  if (pkg.destination?.toLowerCase() === "dubai") {
    return `/dubai/dubai-family?tab=${(pkg.packageSubtype || "economy").toLowerCase()}`;
  }
  const slug = pkg.destination?.toLowerCase().replace(/\s+/g, "-") || "";
  return `/destination/${slug}/package/${pkg.id}`;
}

function PackageCard({ card }) {
  const href        = card.href || getHref(card);
  const image       = card.image || card.featureImage?.src || card.webBanner?.src || "/assets/images/i-destination/dubai.webp";
  const highlights  = card.highlights || card.destinationHighlights || "";
  const hasDiscount = card.basePrice && card.finalPrice && String(card.basePrice) !== String(card.finalPrice);
  const amenities   = Array.isArray(card.amenities) ? card.amenities : [];

  const displayName = (() => {
    const words = (card.name || card.packageName || card.destination || "").split(" ");
    return words.length > 2 ? words.slice(0, 2).join(" ") + "..." : words.join(" ");
  })();

  return (
    <div className="new-desti-card">
      <Link href={href}>
        <img
          src={image}
          alt={card.name || card.packageName}
          loading="lazy"
          width="400"
          height="284"
          style={{ width: "100%", height: 254, objectFit: "cover" }}
        />
      </Link>

      <div className="p-4">
        <div className="header">
          <Link href={href}>
            <h2>{displayName}</h2>
          </Link>
          <div className="share-area">
            {card.duration && <span className="duration-badge">{card.duration}</span>}
            <Link href={href}>
              <img src="/assets/images/icons/share.svg" alt="share" />
            </Link>
          </div>
        </div>

        {highlights && (
          <div className="location">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              stroke="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span>{highlights.slice(0, 100)}{highlights.length > 100 ? "…" : ""}</span>
          </div>
        )}

        {amenities.length > 0 && (
          <div className="icons" aria-label="Travel amenities">
            <ul className="amenities-icons">
              {amenities.map((a, i) => {
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
                Starting from <span className="oldcut">{fmt(card.basePrice)}</span>
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <p className="new-price" style={{ margin: 0 }}>
                {fmt(card.finalPrice || card.basePrice)}
              </p>
              <span style={{
                fontSize: 9, fontWeight: 700, background: "#e84949", color: "#fff",
                borderRadius: 4, padding: "2px 6px", letterSpacing: 0.3, whiteSpace: "nowrap",
              }}>
                Incl. taxes
              </span>
            </div>
            <p className="price-desc">{card.priceType || "per person on twin sharing"}</p>
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

        <Link
          href={href}
          className="package-button"
          style={{ display: "block", textAlign: "center", textDecoration: "none" }}
        >
          View Package
        </Link>
      </div>
    </div>
  );
}

export default function MostPopular() {
  const [cards, setCards] = useState(STATIC);

  useEffect(() => {
    fetch("/api/packages/popular")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCards(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="international-dest national-dest">
        <div className="mini-container1">
          <div className="explore-row">
            <h2 className="section-title">Most popular</h2>
            <Link href="#" className="explore-more-btn">
              View all
            </Link>
          </div>
        </div>
        <div className="mini-container1">
          <Swiper
            spaceBetween={20}
            loop={true}
            slidesPerView={3.2}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true, el: ".swiper-pagination" }}
            navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
            breakpoints={{
              240: { centeredSlides: true, slidesPerView: 1.2, spaceBetween: 10 },
              768: { slidesPerView: 2.5, spaceBetween: 10 },
              1024: { slidesPerView: 3.2, spaceBetween: 20 },
            }}
            modules={[Autoplay, Navigation, Pagination]}
            className="swiper mySwiper4 pt-80"
          >
            {cards.map((card, i) => (
              <SwiperSlide key={card.id || card._id || i} className="swiper-slide">
                <PackageCard card={card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}
