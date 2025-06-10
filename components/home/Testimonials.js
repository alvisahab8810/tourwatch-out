import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
export default function Testimonials() {
  return (
    <>
      {/* <section className="testimonials bg-light pb-80"> */}
      <section className="google__swiper bg-light pb-80">
        {/* <div className="container">
          <h1 className="heading">What do they say?</h1>
          <div className="p-relative">
            <Swiper 

              spaceBetween={20}
              centeredSlides={true}
              loop={true}
              slidesPerView={3}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
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

          
            </Swiper>

            <div className="mobile-none">
             <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </div>
          </div>
        </div> */}

        <div className="container">
          <div className="explore-row">
            <h2>Google reviews</h2>
          </div>
        </div>

        <div className="mini-container">
          <h1 className="heading"> </h1>

          {/* <h1 className="heading">What do they say?</h1> */}
          <div className="p-relative">
            <Swiper
              spaceBetween={20}
              // centeredSlides={true}
              loop={true}
              slidesPerView={4}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              breakpoints={{
                240: {
                  
                  slidesPerView: 1.2,
                  spaceBetween: 10,

                centeredSlides: true,
                },
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3.9,

                  spaceBetween: 20,
                },
              }}
              modules={[Autoplay, Navigation]}
              className="swiper mySwiper pt-80"
            >
              <SwiperSlide className="swiper-slide g_reviews h-100">
                <div className="header">
                  <div className="profile">
                    <img
                      src="https://storage.googleapis.com/a1aa/image/d69f7d10-4bef-407c-a414-8b61e621e39d.jpg"
                      alt="Profile image of a young man with short dark hair, wearing a dark shirt, outdoors with greenery in the background"
                      width="48"
                      height="48"
                    />
                    <div className="profile-info">
                      <h2>Chloe Patterson</h2>
                      <p>May 5, 2023</p>
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/google.png"
                    alt="Google logo "
                    className="google-logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="stars" aria-label="4 out of 5 stars rating">
                  <img
                    src="/assets/images/icons/reviews/rating3.png"
                    alt="Rating 3"
                  ></img>
                </div>
                <p className="review-text">
                  Great quality and fast shipping! I was really impressed with
                  the customer service and the product exceeded my expectations.
                  Will definitely order again.
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide g_reviews h-100">
                <div className="header">
                  <div className="profile">
                    <img
                      src="/assets/images/icons/reviews/profile1.png"
                      alt="Profile image "
                      width="48"
                      height="48"
                    />
                    <div className="profile-info">
                      <h2>Ethan Clark</h2>
                      <p>April 10, 2023</p>
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/google.png"
                    alt="Google logo "
                    className="google-logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="stars" aria-label="4 out of 5 stars rating">
                  <img
                    src="/assets/images/icons/reviews/rating4.png"
                    alt="Rating 3"
                  ></img>
                </div>
                <p className="review-text">
                  They are skilled professionals, and the service was decent.
                  However, their pricing structure is confusing, and we had some
                  unexpected charges. Be sure to clarify all costs upfront.
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide g_reviews h-100">
                <div className="header">
                  <div className="profile">
                    <img
                      src="/assets/images/icons/reviews/profile.png"
                      alt="Profile image "
                      width="48"
                      height="48"
                    />
                    <div className="profile-info">
                      <h2>Isabella Turner</h2>
                      <p>March 22, 2023</p>
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/google.png"
                    alt="Google logo "
                    className="google-logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="stars" aria-label="4 out of 5 stars rating">
                  <img
                    src="/assets/images/icons/reviews/rating5.png"
                    alt="Rating 3"
                  ></img>
                </div>
                <p className="review-text">
                  Outstanding service and dedication! They worked with us until
                  we were completely satisfied. Truly a team that goes the extra
                  mile.
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide g_reviews h-100">
                <div className="header">
                  <div className="profile">
                    <img
                      src="/assets/images/icons/reviews/profile2.png"
                      alt="Profile image"
                      width="48"
                      height="48"
                    />
                    <div className="profile-info">
                      <h2>Benjamin Collins</h2>
                      <p>February 8, 2023</p>
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/google.png"
                    alt="Google logo "
                    className="google-logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="stars" aria-label="4 out of 5 stars rating">
                  <img
                    src="/assets/images/icons/reviews/rating3.png"
                    alt="Rating 3"
                  ></img>
                </div>
                <p className="review-text">
                  Very professional and skilled team. The only issue was that we
                  had to request a couple of revisions, but they handled them
                  well. The final result was worth the wait!
                </p>
              </SwiperSlide>

              {/* ==================repeat============ */}

              <SwiperSlide className="swiper-slide g_reviews h-100">
                <div className="header">
                  <div className="profile">
                    <img
                      src="https://storage.googleapis.com/a1aa/image/d69f7d10-4bef-407c-a414-8b61e621e39d.jpg"
                      alt="Profile image of a young man with short dark hair, wearing a dark shirt, outdoors with greenery in the background"
                      width="48"
                      height="48"
                    />
                    <div className="profile-info">
                      <h2>Chloe Patterson</h2>
                      <p>May 5, 2023</p>
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/google.png"
                    alt="Google logo "
                    className="google-logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="stars" aria-label="4 out of 5 stars rating">
                  <img
                    src="/assets/images/icons/reviews/rating3.png"
                    alt="Rating 3"
                  ></img>
                </div>
                <p className="review-text">
                  Great quality and fast shipping! I was really impressed with
                  the customer service and the product exceeded my expectations.
                  Will definitely order again.
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide g_reviews h-100">
                <div className="header">
                  <div className="profile">
                    <img
                      src="/assets/images/icons/reviews/profile1.png"
                      alt="Profile image "
                      width="48"
                      height="48"
                    />
                    <div className="profile-info">
                      <h2>Ethan Clark</h2>
                      <p>April 10, 2023</p>
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/google.png"
                    alt="Google logo "
                    className="google-logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="stars" aria-label="4 out of 5 stars rating">
                  <img
                    src="/assets/images/icons/reviews/rating4.png"
                    alt="Rating 3"
                  ></img>
                </div>
                <p className="review-text">
                  They are skilled professionals, and the service was decent.
                  However, their pricing structure is confusing, and we had some
                  unexpected charges. Be sure to clarify all costs upfront.
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide g_reviews h-100">
                <div className="header">
                  <div className="profile">
                    <img
                      src="/assets/images/icons/reviews/profile.png"
                      alt="Profile image "
                      width="48"
                      height="48"
                    />
                    <div className="profile-info">
                      <h2>Isabella Turner</h2>
                      <p>March 22, 2023</p>
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/google.png"
                    alt="Google logo "
                    className="google-logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="stars" aria-label="4 out of 5 stars rating">
                  <img
                    src="/assets/images/icons/reviews/rating5.png"
                    alt="Rating 3"
                  ></img>
                </div>
                <p className="review-text">
                  Outstanding service and dedication! They worked with us until
                  we were completely satisfied. Truly a team that goes the extra
                  mile.
                </p>
              </SwiperSlide>

              <SwiperSlide className="swiper-slide g_reviews h-100">
                <div className="header">
                  <div className="profile">
                    <img
                      src="/assets/images/icons/reviews/profile2.png"
                      alt="Profile image"
                      width="48"
                      height="48"
                    />
                    <div className="profile-info">
                      <h2>Benjamin Collins</h2>
                      <p>February 8, 2023</p>
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/google.png"
                    alt="Google logo "
                    className="google-logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="stars" aria-label="4 out of 5 stars rating">
                  <img
                    src="/assets/images/icons/reviews/rating3.png"
                    alt="Rating 3"
                  ></img>
                </div>
                <p className="review-text">
                  Very professional and skilled team. The only issue was that we
                  had to request a couple of revisions, but they handled them
                  well. The final result was worth the wait!
                </p>
              </SwiperSlide>
            </Swiper>

            {/* <div className="mobile-none">
             <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}
