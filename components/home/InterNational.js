import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css/pagination";

export default function InterNational() {
  return (
    <>
      <section className="international-dest national-dest">
        <div className="container">
          <div className="explore-row">
            <h2>International Destinations</h2>
            <Link
              href="/family/international-destination"
              className="explore-more-btn"
            >
              View all
              <img
                src="/assets/images/icons/right-arrow.png"
                alt="right arrow"
              ></img>
            </Link>
          </div>
        </div>
        <div className="mini-container">
          {/* <div className="row pt-80">
            <div className="col-md-12">
             
              <h1 className="heading lh-75">International Destinations</h1>
            </div>
          </div> */}
          <Swiper
            spaceBetween={20}
            // centeredSlides={true}
            // grabCursor={true}
            loop={true}
            slidesPerView={3.5}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination", // Ensure a pagination element is available
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              240: {
                centeredSlides: true,

                slidesPerView: 1.2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 20,
              },
            }}
            modules={[Autoplay, Navigation, Pagination]}
            className="swiper mySwiper4 pt-80"
          >
            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/dubai.webp"
                  alt="Dubai cityscape showing Burj Khalifa tower and waterfront with people"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Dubai</h2>
                    <div className="share-area">
                      <span className="duration-badge">8N/7D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span>
                      Downtown Dubai • Old Dubai • Desert Safari • Palm Jumeirah
                    </span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon4.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon7.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹80,000</span>
                      </p>
                      <p className="new-price">₹50,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/international-destination/dubai">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/bali.webp"
                  alt="Bali"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Bali</h2>
                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p className="new-price">₹150,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/thailand.webp"
                  alt="Bali"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Thailand</h2>
                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p className="new-price">₹150,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/singapore.webp"
                  alt="Singapore"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Singapore</h2>
                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p className="new-price">₹150,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/malaysia.webp"
                  alt="malaysia"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Malaysia</h2>
                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p className="new-price">₹150,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* ============= Repeat --------------- */}

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/dubai.webp"
                  alt="Dubai cityscape showing Burj Khalifa tower and waterfront with people"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Dubai</h2>
                    <div className="share-area">
                      <span className="duration-badge">8N/7D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span>
                      Downtown Dubai • Old Dubai • Desert Safari • Palm Jumeirah
                    </span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon4.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon7.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹80,000</span>
                      </p>
                      <p className="new-price">₹50,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/international-destination/dubai">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/bali.webp"
                  alt="Bali"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Bali</h2>
                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p className="new-price">₹150,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/thailand.webp"
                  alt="Bali"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Thailand</h2>
                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p className="new-price">₹150,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/singapore.webp"
                  alt="Singapore"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Singapore</h2>
                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p className="new-price">₹150,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <img
                  src="/assets/images/i-destination/malaysia.webp"
                  alt="malaysia"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div className="p-4">
                  <div className="header">
                    <h2>Malaysia</h2>
                    <div className="share-area">
                      <span className="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
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
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div className="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div className="price-section">
                    <div className="price-info">
                      <p className="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p className="new-price">₹150,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* <div className="swiper-pagination"></div> */}
          </Swiper>
        </div>
      </section>
    </>
  );
}
