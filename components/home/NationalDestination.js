import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css/pagination";

function fmt(n) {
  if (!n) return null;
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function DestCard({ d }) {
  const image = d.mainImage?.src || d.images?.Family?.Economy?.src || "/assets/images/n-destination/kashmir.webp";
  const price = d.startingPrice ? fmt(d.startingPrice) : null;
  const href  = `/destination/${d.slug}`;

  return (
    <Link href={href} className="dest-slide-card">
      <div className="dest-slide-img">
        <img src={image} alt={d.mainImage?.alt || d.name || d.title} loading="lazy" />
        <div className="dest-slide-overlay">
          <h3 className="dest-slide-name">{d.name || d.title}</h3>
          {price && (
            <p className="dest-slide-price">
                           Starting from <br/> <span className="destination-card-price"><strong>{price}</strong></span>

            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function NationalDestination({ destinations = [] }) {
  const active = destinations.filter(d => d.type === "national" && d.status === "Active");

  return (
    <section className="national-dest">
      <div className="mini-container1">
        <div className="explore-row">
          <h2 className="section-title">National Destinations</h2>
          <Link href="/family/national-destination" className="explore-more-btn">
            View all
          </Link>
        </div>
      </div>
      <div className="mini-container1">
        <Swiper
          spaceBetween={28}
          loop={active.length > 3}
          slidesPerView={3.4}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true, el: ".swiper-pagination" }}
          navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
          breakpoints={{
            240: { centeredSlides: true, slidesPerView: 1.2, spaceBetween: 10 },
            768: { slidesPerView: 2.5, spaceBetween: 10 },
            1024: { slidesPerView: 3.4, spaceBetween: 28 },
          }}
          modules={[Autoplay, Navigation, Pagination]}
          className="swiper mySwiper4 pt-80"
        >
          {active.map(d => (
            <SwiperSlide key={d.id} className="swiper-slide">
              <DestCard d={d} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
