import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

import "swiper/css/pagination";

export default function NationalDestination() {
  return (
    <>
      <section className="national-dest">
        <div className="container">
          <div className="explore-row">
            <h2>National Destinations</h2>
            <Link
              href="/family/national-destination"
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
          <div className="row">
            {/* <div className="col-md-12">
              <h2 className="subtitle text-center"> WHAT WE SERVE</h2>
              <h1 className="heading">National Destinations</h1>
            </div> */}
          </div>
          <Swiper
            spaceBetween={20}
            // centeredSlides={true}
            grabCursor={true}
            loop={true}
            slidesPerView={3.5}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination", // Ensure a pagination element is available
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
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 20,
              },
            }}
            modules={[Autoplay, Navigation, Pagination]}
            className="swiper mySwiper5 pt-80"
          >
            {/* <SwiperSlide className="swiper-slide">
              <Link href="/family/national-destination/kashmir">
                <div className="batch-info">
                  <p>Starting From*</p>
                  <h4>
                    ₹23,999/<sub>person</sub>
                  </h4>
                </div>
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/leh.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>

                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
                    <p>
                      Kashmir National Park is a wildlife haven, offering
                      stunning landscapes and unforgettable adventures for
                      nature lovers.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide> */}

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/leh.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Kashmir</h2>
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
                    <span>Srinagar • Gulmarg • Pahalgam • Sonamarg</span>
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
                    <Link href="/family/national-destination/kashmir">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/leh.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Leh Ladakh</h2>
                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
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
                    <span>Leh • Pangong</span>
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p className="new-price">₹40,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/leh-laddakh">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/manali.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Manali</h2>
                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
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
                      Manali-Solang • Atal Tunnel • Manali - Manikaran
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p className="new-price">₹40,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/manali">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/shimla.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Shimla</h2>
                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
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
                    <span>Shimla • Kufri • Mashobra - Naldehra</span>
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p className="new-price">₹40,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/shimla">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/dharamshala.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Dharamshala</h2>
                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
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
                    <span>Dharmshala McLeod Ganj & Dalhousie</span>
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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p className="new-price">₹45,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/dharamshala">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/dehradun.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Dehradun</h2>
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
                    <span>Dehradun & Mussoorie</span>
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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p className="new-price">₹45,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/dehradun">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>


            {/* ==============  Repeat Sliders=============== */}

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/leh.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Kashmir</h2>
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
                    <span>Srinagar • Gulmarg • Pahalgam • Sonamarg</span>
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
                    <Link href="/family/national-destination/kashmir">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/leh.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Leh Ladakh</h2>
                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
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
                    <span>Leh • Pangong</span>
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p className="new-price">₹40,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/leh-laddakh">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/manali.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Manali</h2>
                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
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
                      Manali-Solang • Atal Tunnel • Manali - Manikaran
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p className="new-price">₹40,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/manali">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/shimla.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Shimla</h2>
                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
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
                    <span>Shimla • Kufri • Mashobra - Naldehra</span>
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p className="new-price">₹40,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/shimla">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/dharamshala.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Dharamshala</h2>
                    <div className="share-area">
                      <span className="duration-badge">3N/4D</span>
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
                    <span>Dharmshala McLeod Ganj & Dalhousie</span>
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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p className="new-price">₹45,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/dharamshala">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="new-desti-card">
                <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/dehradun.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="header">
                    <h2>Dehradun</h2>
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
                    <span>Dehradun & Mussoorie</span>
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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p className="new-price">₹45,000</p>
                      <p className="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/dehradun">
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* <div className="swiper-pagination"></div> */}
          </Swiper>

          {/* <!-- <div className="swiper-button-prev"></div> -->
           <!-- <div className="swiper-button-next"></div> --> */}
        </div>
      </section>
    </>
  );
}
