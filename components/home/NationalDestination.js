import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css/pagination";

export default function NationalDestination() {
  return (
    <>
      <section className="national-dest">
        <div className="mini-container1">
          <div className="explore-row">
            <h2 className="section-title">National Destinations</h2>
            <Link
              href="/family/national-destination"
              className="explore-more-btn"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="mini-container1">
          <Swiper
            spaceBetween={10}
            loop={true}
            slidesPerView={3.2}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
            }}
            navigation={{
              nextEl: ".swiper-button-next-1",
              prevEl: ".swiper-button-prev-1",
            }}
            breakpoints={{
              240: {
                centeredSlides: true,
                slidesPerView: 1.2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 3.2,
                spaceBetween: 10,
              },
            }}
            modules={[Autoplay, Navigation, Pagination]}
            className="swiper mySwiper5 pt-80"
          >

            {/* =========== Kashmir =========== */}
            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <Link href="/family/national-destination/kashmir">
                  <img
                    src="/assets/images/n-destination/kashmir.webp"
                    alt="Kashmir"
                    loading="lazy"
                  />
                </Link>

                <div className="p-4">
                  <div className="header">
                    <Link href="/family/national-destination/kashmir">
                      <h2>Kashmir</h2>
                    </Link>

                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img src="/assets/images/hero/icons/share1.svg" alt="share" />
                      </Link>
                    </div>
                  </div>

                  <div className="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span>Srinagar • Gulmarg • Pahalgam • Sonamarg</span>
                  </div>

                  <Amenities />

                  <PriceBlock
                    oldPrice="₹80,000"
                    newPrice="₹50,000"
                    link="/family/national-destination/kashmir"
                  />
                </div>
              </div>
            </SwiperSlide>

            {/* =========== Leh Ladakh =========== */}
            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <Link href="/family/national-destination/leh-laddakh">
                  <img
                    src="/assets/images/n-destination/leh.webp"
                    alt="Leh Ladakh"
                    loading="lazy"
                  />
                </Link>

                <div className="p-4">
                  <div className="header">
                    <Link href="/family/national-destination/leh-laddakh">
                      <h2>Leh Ladakh</h2>
                    </Link>

                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
                      <Link href="#">
                        <img src="/assets/images/hero/icons/share1.svg" alt="share" />
                      </Link>
                    </div>
                  </div>

                  <div className="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span>Leh • Pangong</span>
                  </div>

                  <Amenities />

                  <PriceBlock
                    oldPrice="₹60,000"
                    newPrice="₹40,000"
                    link="/family/national-destination/leh-laddakh"
                  />
                </div>
              </div>
            </SwiperSlide>

            {/* =========== Manali =========== */}
            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <Link href="/family/national-destination/manali">
                  <img
                    src="/assets/images/n-destination/manali.webp"
                    alt="Manali"
                    loading="lazy"
                  />
                </Link>

                <div className="p-4">
                  <div className="header">
                    <Link href="/family/national-destination/manali">
                      <h2>Manali</h2>
                    </Link>

                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
                      <Link href="#">
                        <img src="/assets/images/hero/icons/share1.svg" alt="share" />
                      </Link>
                    </div>
                  </div>

                  <div className="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span>Manali • Solang • Atal Tunnel • Manikaran</span>
                  </div>

                  <Amenities />

                  <PriceBlock
                    oldPrice="₹60,000"
                    newPrice="₹40,000"
                    link="/family/national-destination/manali"
                  />
                </div>
              </div>
            </SwiperSlide>

            {/* =========== Shimla =========== */}
            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <Link href="/family/national-destination/shimla">
                  <img
                    src="/assets/images/n-destination/shimla.webp"
                    alt="Shimla"
                    loading="lazy"
                  />
                </Link>

                <div className="p-4">
                  <div className="header">
                    <Link href="/family/national-destination/shimla">
                      <h2>Shimla</h2>
                    </Link>

                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
                      <Link href="#">
                        <img src="/assets/images/hero/icons/share1.svg" alt="share" />
                      </Link>
                    </div>
                  </div>

                  <div className="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span>Shimla • Kufri • Mashobra • Naldehra</span>
                  </div>

                  <Amenities />

                  <PriceBlock
                    oldPrice="₹60,000"
                    newPrice="₹40,000"
                    link="/family/national-destination/shimla"
                  />
                </div>
              </div>
            </SwiperSlide>

            {/* =========== Dharamshala =========== */}
            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <Link href="/family/national-destination/dharamshala">
                  <img
                    src="/assets/images/n-destination/dharamshala.webp"
                    alt="Dharamshala"
                    loading="lazy"
                  />
                </Link>

                <div className="p-4">
                  <div className="header">
                    <Link href="/family/national-destination/dharamshala">
                      <h2>Dharamshala</h2>
                    </Link>

                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
                      <Link href="#">
                        <img src="/assets/images/hero/icons/share1.svg" alt="share" />
                      </Link>
                    </div>
                  </div>

                  <div className="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span>McLeod Ganj • Dalhousie</span>
                  </div>

                  <Amenities />

                  <PriceBlock
                    oldPrice="₹70,000"
                    newPrice="₹45,000"
                    link="/family/national-destination/dharamshala"
                  />
                </div>
              </div>
            </SwiperSlide>

            {/* =========== Dehradun =========== */}
            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <Link href="/family/national-destination/dehradun">
                  <img
                    src="/assets/images/n-destination/dehradun.webp"
                    alt="Dehradun"
                    loading="lazy"
                  />
                </Link>

                <div className="p-4">
                  <div className="header">
                    <Link href="/family/national-destination/dehradun">
                      <h2>Dehradun</h2>
                    </Link>

                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img src="/assets/images/hero/icons/share1.svg" alt="share" />
                      </Link>
                    </div>
                  </div>

                  <div className="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span>Dehradun • Mussoorie</span>
                  </div>

                  <Amenities />

                  <PriceBlock
                    oldPrice="₹70,000"
                    newPrice="₹45,000"
                    link="/family/national-destination/dehradun"
                  />
                </div>
              </div>
            </SwiperSlide>

          </Swiper>
        </div>
      </section>
    </>
  );
}

/* ================= Common Reusable Components ================= */

function Amenities() {
  return (
    <div className="icons" aria-label="Travel icons">
      <ul className="amenities-icons">
        <li><img src="/assets/images/hero/icons/amenities/icon1.svg" /></li>
        <li><img src="/assets/images/hero/icons/amenities/icon2.svg" /></li>
        <li><img src="/assets/images/hero/icons/amenities/icon3.svg" /></li>
        <li><img src="/assets/images/hero/icons/amenities/icon4.svg" /></li>
        <li><img src="/assets/images/hero/icons/amenities/icon5.svg" /></li>
        <li><img src="/assets/images/hero/icons/amenities/icon6.svg" /></li>
        <li><img src="/assets/images/hero/icons/amenities/icon7.svg" /></li>
        <li><img src="/assets/images/hero/icons/amenities/icon8.svg" /></li>
      </ul>
    </div>
  );
}

function PriceBlock({ oldPrice, newPrice, link }) {
  return (
    <>
      <div className="price-section">
        <div className="price-info">
          <p className="old-price">
            Starting from <span className="oldcut">{oldPrice}</span>
          </p>
          <p className="new-price">{newPrice}</p>
          <p className="price-desc">per person on twin sharing</p>
        </div>

        <div className="contact-icons">
          <Link href="tel:+91 8882701800">
            <img src="/assets/images/hero/icons/call.svg" alt="Call" />
          </Link>

          <Link href="https://wa.link/pshqg5">
            <img src="/assets/images/hero/icons/whatsapp.svg" alt="WhatsApp" />
          </Link>
        </div>
      </div>

      <button
        className="package-button interactive"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalCenter"
      >
        Request A Callback
      </button>
    </>
  );
}
