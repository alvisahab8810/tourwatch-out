import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
export default function Testimonials() {
  return (
    <>
      <section className="testimonials bg-light ptb-80">
        <div className="container">
          <h1 className="heading">What do they say?</h1>
          <div className="p-relative">
            <Swiper 

              spaceBetween={20}
              centeredSlides={true}
              loop={true}
              slidesPerView={3}
              // autoplay={{
              //   delay: 2500,
              //   disableOnInteraction: false,
              // }}
              pagination={{
                clickable:true
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
                
              }}

              breakpoints={{
                240: {
                  slidesPerView: 1.5,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}

              modules={[Autoplay, Navigation]}
            
            className="swiper mySwiper pt-80">
         
                <SwiperSlide className="swiper-slide">
                  <div className="quote-bx">
                    <img
                      src="./assets/images/icons/quote.png"
                      alt="Quote Image"
                    />
                  </div>
                  <div className="rating-bx">
                    <p className="testi-para">
                      “ Vacation experiences using their services. The tour
                      guide is also good so you won't regret it if you use ”
                    </p>
                    <img
                      src="./assets/images/icons/rating.png"
                      alt="Rating Image"
                    />
                  </div>

                  <div className="rating-name">
                    <div className="profile">
                      <img
                        src="./assets/images/profiles/profile.png"
                        alt="Profile Image"
                      />
                    </div>
                    <div className="r-name">
                      <h3>Ariana Grande</h3>
                      <p>Singer</p>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide className="swiper-slide">
                  <div className="quote-bx">
                    <img
                      src="./assets/images/icons/quote.png"
                      alt="Quote Image"
                    />
                  </div>
                  <div className="rating-bx">
                    <p className="testi-para">
                      “ Vacation experiences using their services. The tour
                      guide is also good so you won't regret it if you use ”
                    </p>
                    <img
                      src="./assets/images/icons/rating.png"
                      alt="Rating Image"
                    />
                  </div>

                  <div className="rating-name">
                    <div className="profile">
                      <img
                        src="./assets/images/profiles/profile.png"
                        alt="Profile Image"
                      />
                    </div>
                    <div className="r-name">
                      <h3>John Lenon</h3>
                      <p>Designer</p>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide className="swiper-slide">
                  <div className="quote-bx">
                    <img
                      src="./assets/images/icons/quote.png"
                      alt="Quote Image"
                    />
                  </div>
                  <div className="rating-bx">
                    <p className="testi-para">
                      “ Vacation experiences using their services. The tour
                      guide is also good so you won't regret it if you use ”
                    </p>
                    <img
                      src="./assets/images/icons/rating.png"
                      alt="Rating Image"
                    />
                  </div>

                  <div className="rating-name">
                    <div className="profile">
                      <img
                        src="./assets/images/profiles/profile.png"
                        alt="Profile Image"
                      />
                    </div>
                    <div className="r-name">
                      <h3>Shin Ryujin</h3>
                      <p>Developer</p>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide  className="swiper-slide">
                  <div className="quote-bx">
                    <img
                      src="./assets/images/icons/quote.png"
                      alt="Quote Image"
                    />
                  </div>
                  <div className="rating-bx">
                    <p className="testi-para">
                      “ Vacation experiences using their services. The tour
                      guide is also good so you won't regret it if you use ”
                    </p>
                    <img
                      src="./assets/images/icons/rating.png"
                      alt="Rating Image"
                    />
                  </div>

                  <div className="rating-name">
                    <div className="profile">
                      <img
                        src="./assets/images/profiles/profile.png"
                        alt="Profile Image"
                      />
                    </div>
                    <div className="r-name">
                      <h3>Ariana Grande</h3>
                      <p>Singer</p>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide className="swiper-slide">
                  <div className="quote-bx">
                    <img
                      src="./assets/images/icons/quote.png"
                      alt="Quote Image"
                    />
                  </div>
                  <div className="rating-bx">
                    <p className="testi-para">
                      “ Vacation experiences using their services. The tour
                      guide is also good so you won't regret it if you use ”
                    </p>
                    <img
                      src="./assets/images/icons/rating.png"
                      alt="Rating Image"
                    />
                  </div>

                  <div className="rating-name">
                    <div className="profile">
                      <img
                        src="./assets/images/profiles/profile.png"
                        alt="Profile Image"
                      />
                    </div>
                    <div className="r-name">
                      <h3>Ariana Grande</h3>
                      <p>Singer</p>
                    </div>
                  </div>
                </SwiperSlide>

              {/* <!-- <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-pagination"></div> --> */}
            </Swiper>

            <div className="mobile-none">
             <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
