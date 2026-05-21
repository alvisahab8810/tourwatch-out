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

function getCardHref(card) {
  if (card.href) return card.href;
  if (card.destination?.toLowerCase() === "dubai") {
    return `/dubai/dubai-family?tab=${(card.packageSubtype || "economy").toLowerCase()}`;
  }
  const slug = card.destSlug || card.destination?.toLowerCase().replace(/\s+/g, "-") || "";
  return `/destination/${slug}/package/${card.id || card._id}`;
}

function PackageCard({ card }) {
  const href = getCardHref(card);

  /* images — handle both API shape (gallery/featureImage) and static shape (image) */
  const galleryImgs = (card.gallery || [])
    .filter(g => g?.src)
    .map(g => ({ src: g.src, alt: g.alt || card.packageName || card.name }));

  let images = galleryImgs;
  if (!images.length) {
    images = [
      card.featureImage?.src ? { src: card.featureImage.src, alt: card.featureImage.alt || card.name } : null,
      card.webBanner?.src    ? { src: card.webBanner.src,    alt: card.webBanner.alt    || card.name } : null,
      card.image             ? { src: card.image,            alt: card.name }                         : null,
    ].filter(Boolean);
  }
  if (!images.length) images.push({ src: "/assets/images/i-destination/dubai.webp", alt: card.name });

  /* price */
  const base    = Number(card.basePrice)  || 0;
  const final   = Number(card.finalPrice) || base;
  const discPct = base > final && base > 0 ? Math.round((base - final) / base * 100) : 0;

  /* highlights — handle "• A • B" string or plain "A, B" string */
  const highlightStr = card.destinationHighlights || card.highlights || "";
  const bullets = highlightStr
    .split(/[-,•]\s*/)
    .map(h => h.trim())
    .filter(Boolean);

  const displayName = card.packageName || card.name || card.destination || "";
  const amenities   = Array.isArray(card.amenities) ? card.amenities : [];

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
            {card.duration        && <span className="pkg-bdg pkg-bdg-dur">{card.duration}</span>}
            {card.packageType     && <span className="pkg-bdg pkg-bdg-type">{card.packageType}</span>}
            {card.packageSubtype  && <span className="pkg-bdg pkg-bdg-sub">{card.packageSubtype}</span>}
          </div>
          <div className="pkg-rating">
            <span className="pkg-star">★</span>
            <span><span className="font-bold">4.1</span> (230)</span>
          </div>
        </div>

        <h2 className="pkg-card-name">{displayName}</h2>

        {bullets.length > 0 && (
          <p className="pkg-card-highlights">
            {bullets.map((b, i) => <span key={i}>• {b} </span>)}
          </p>
        )}

        <hr className="pkg-card-divider" />

        {amenities.length > 0 && (
          <ul className="pkg-amenities-row">
            {amenities.map((a, i) => {
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

        {card.priceType && <p className="pkg-price-type-line">{card.priceType}</p>}
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
    <div className="most-popular-section">
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
              240: { centeredSlides: true, slidesPerView: 1, spaceBetween: 10 },
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
    </div>
  );
}
