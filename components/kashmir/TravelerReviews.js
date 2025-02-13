import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
export default function TravelerReviews() {
  return (
    <>
      <section className="traveler-reviews" id="traveler-reviews">
        <div className="container">
          <div className="travleler-content">
            <h2>Traveler Reviews</h2>
            <p>
              See what our travelers are saying about their favorite
              destinations.
            </p>
          </div>

          <div className="review-lists p-relative">
            <Swiper
              spaceBetween={20}
              // centeredSlides={true}
                  loop={true}
                  grabCursor={true}
              slidesPerView={3}
              // autoplay={{
              // delay: 2500,
              // disableOnInteraction: false,
              // }}
              pagination={{
                clickable: true,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}

              breakpoints={{

               
                240: {
                  slidesPerView: 1.2,
                  spaceBetween: 10,
                 
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3.9,
                  spaceBetween: 20,
                },
              }}
              modules={[Autoplay, Navigation]}
              className="swiper mySwiper5 pt-80 travelers-testi"
            >
              <SwiperSlide className="swiper-slide">
                <h3>Sarah</h3>
                <p className="location-para">
                  Taveler Jim Corbett National Park{" "}
                </p>
                {/* <!-- <img src="./assets/images/icons/review.png" alt="Review Icon"> -->/ */}
                <img
                  src="./assets/images/kashmir/icons/stars.png"
                  alt="Review Star"
                />
                <p className="testi-description">
                  I can't thank Voyagify enough for helping us plan the most
                  incredible vacation. From start to finish, every detail was
                  taken care of—flights, accommodations, and even excursions.
                  They truly listened to what we wanted and tailored everything
                  to our preferences.{" "}
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide">
                <h3>Sarah</h3>
                <p className="location-para">
                  Taveler Jim Corbett National Park{" "}
                </p>
                {/* <!-- <img src="./assets/images/icons/review.png" alt="Review Icon"> --> */}
                <img
                  src="./assets/images/kashmir/icons/stars.png"
                  alt="Review Star"
                />
                <p className="testi-description">
                  I can't thank Voyagify enough for helping us plan the most
                  incredible vacation. From start to finish, every detail was
                  taken care of—flights, accommodations, and even excursions.
                  They truly listened to what we wanted and tailored everything
                  to our preferences.{" "}
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide">
                <h3>Sarah</h3>
                <p className="location-para">
                  Taveler Jim Corbett National Park{" "}
                </p>
                {/* <!-- <img src="./assets/images/icons/review.png" alt="Review Icon"> --> */}
                <img
                  src="./assets/images/kashmir/icons/stars.png"
                  alt="Review Star"
                />
                <p className="testi-description">
                  I can't thank Voyagify enough for helping us plan the most
                  incredible vacation. From start to finish, every detail was
                  taken care of—flights, accommodations, and even excursions.
                  They truly listened to what we wanted and tailored everything
                  to our preferences.{" "}
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide">
                <h3>Sarah</h3>
                <p className="location-para">
                  Taveler Jim Corbett National Park{" "}
                </p>
                {/* <!-- <img src="./assets/images/icons/review.png" alt="Review Icon"> --> */}
                <img
                  src="./assets/images/kashmir/icons/stars.png"
                  alt="Review Star"
                />
                <p className="testi-description">
                  I can't thank Voyagify enough for helping us plan the most
                  incredible vacation. From start to finish, every detail was
                  taken care of—flights, accommodations, and even excursions.
                  They truly listened to what we wanted and tailored everything
                  to our preferences.{" "}
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide">
                <h3>Sarah</h3>
                <p className="location-para">
                  Taveler Jim Corbett National Park{" "}
                </p>
                {/* <!-- <img src="./assets/images/icons/review.png" alt="Review Icon"> --> */}
                <img
                  src="./assets/images/kashmir/icons/stars.png"
                  alt="Review Star"
                />
                <p className="testi-description">
                  I can't thank Voyagify enough for helping us plan the most
                  incredible vacation. From start to finish, every detail was
                  taken care of—flights, accommodations, and even excursions.
                  They truly listened to what we wanted and tailored everything
                  to our preferences.{" "}
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide">
                <h3>Sarah</h3>
                <p className="location-para">
                  Taveler Jim Corbett National Park{" "}
                </p>
                {/* <!-- <img src="./assets/images/icons/review.png" alt="Review Icon"> --> */}
                <img
                  src="./assets/images/kashmir/icons/stars.png"
                  alt="Review Star"
                />
                <p className="testi-description">
                  I can't thank Voyagify enough for helping us plan the most
                  incredible vacation. From start to finish, every detail was
                  taken care of—flights, accommodations, and even excursions.
                  They truly listened to what we wanted and tailored everything
                  to our preferences.{" "}
                </p>
              </SwiperSlide>
            </Swiper>
            <div className="navpage">
              <button className="btn-review">Write a Review</button>
              <div className="swiper-button-prev">
                <img
                  src="./assets/images/kashmir/icons/left.png"
                  alt="Right Arrow"
                />
              </div>
              <div className="swiper-button-next">
                <img
                  src="./assets/images/kashmir/icons/right.png"
                  alt="Right Arrow"
                />
              </div>

              <div className="swiper-pagination"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
