import React, { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// import "swiper/css/pagination";

export default function TopReviews() {
  // Read More Function
  const ReviewText = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const shortText = text.substring(0, 110);

    return (
      <p className="review-text">
        {expanded ? text : shortText + (text.length > 110 ? "..." : "")}

        {text.length > 110 && (
          <span
            className="read-more"
            onClick={() => setExpanded(!expanded)}
            style={{ cursor: "pointer", marginLeft: "6px" }}
          >
            {expanded ? "Read less" : "Read more"}
          </span>
        )}
      </p>
    );
  };

  return (
    <div>
      <section className="reviews-section mobile-none">
        <div className="mini-container1">
          <div className="explore-row">
            <h2 className="section-title">Reviews</h2>
            {/* <Link href="#" className="explore-more-btn">
            View all
          </Link> */}
          </div>
        </div>

        <div className="mini-container1 pt-80 pb-80">
          <div className="reviews-grid">
            {/* LEFT SUMMARY BOX — SAME */}
            <div className="reviews-summary">
              <div className="rating-display">
                <img
                  src="/assets/images/hero/icons/reviews.svg"
                  alt="Rating stars"
                  className="rating-stars"
                />
                <div className="rating-number">4.9</div>
                {/* <div className="rating-text">675 Google Reviews</div> */}
                <div className="rating-source">
                  by trips from <span className="highlight">65+ countries</span>
                </div>
              </div>
            </div>

            {/* RIGHT SWIPER — SAME UI */}
            <div className="review-cards">
              <Swiper
                spaceBetween={20}
                slidesPerView={2}
                 autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
                loop={true}
                breakpoints={{
                  240: { slidesPerView: 1.1, spaceBetween: 15 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                }}
                navigation={false}
                //   pagination={{ clickable: true }}
                modules={[Navigation, Autoplay]}
                className="review-swiper"
              >
                {/* CARD 1 — Chloe */}
                <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review.png"
                          alt="Chloe"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Anuj Srivastava</h4>
                          <p>a month ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText text="We booked our honeymoon trip to the Andaman & Nicobar Islands with TourWatchOut, and it was an amazing experience! Everything was perfectly planned — from flights and hotels to local transfers and island activities. The team was professional, responsive, and made sure our trip was completely hassle-free. Special thanks to their local coordinators for smooth execution throughout. Thanks to TourWatchOut, we created beautiful memories that will last a lifetime. Highly recommended for a well-managed and memorable holiday!" />
                  </div>
                </SwiperSlide>

                {/* CARD 2 — Ethan */}
                <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review1.png"
                          alt="Atik Bijapure"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Atik Bijapure</h4>
                          <p>a month ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="
                    We recently had an incredible 5-day domestic tour to Goa organised by Tourwatchout, and it was an absolutely memorable experience! As the Head of Agribusiness Management, I truly appreciate how well the team planned and executed every detail — perfectly combining educational exposure with fun and relaxation.
                    "
                    />
                  </div>
                </SwiperSlide>

                {/* CARD 3 — Isabella */}
                <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review2.png"
                          alt="Isabella"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>ASHWANI KUMAR KUVIND</h4>
                          <p>a month ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="
                    Amazing experience! They were extremely dedicated and kept improving everything until it was perfect. Their patience, creativity, and commitment to quality made the entire process smooth and enjoyable."
                    />
                  </div>
                </SwiperSlide>

                {/* CARD 4 — Benjamin */}
                <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review3.png"
                          alt="Benjamin"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Uday</h4>
                          <p>a month ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="
                    Our Goa trip organized by TourWatchOut was absolutely fantastic...! Everything was perfectly planned — from the travel arrangements and hotel stays to sightseeing and activities. The team made sure we had a smooth and stress-free experience throughout the tour.

Their coordination, punctuality, and attention to detail truly made our trip special. We didn’t have to worry about a single thing — just enjoyed every moment!

A big thank you to the TourWatchOut team for making our Goa tour so memorable. Highly recommended for anyone planning a fun, well-managed holiday!
                    "
                    />
                  </div>
                </SwiperSlide>

                {/* CARD 5 — Chloe again */}
                <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review4.png"
                          alt="Chloe"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Aisha Yadav</h4>
                          <p>a month ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="
                    We recently went on our college trip to Goa with TourWatchOut, and it was an unforgettable experience! The whole tour was super well-organized — from travel to stay to all the fun activities. The team handled everything so smoothly and made sure we had the best time without any stress.

                        The coordinators were really friendly, cooperative, and kept the vibe fun throughout the trip. Every moment was full of energy, laughter, and memories we’ll always cherish.

                        Big thanks to TourWatchOut for making our college trip so special! 💫
                        Highly recommend them for group and college tours!
                    "
                    />
                  </div>
                </SwiperSlide>


                 <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review5.png"
                          alt="Chloe"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Mayuree Tawade</h4>
                          <p>a month ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="We came with a group of 70 students 8 faculties. Excellent service 5 Star rating always much recommended Smooth co-ordination. Thanks to Tourwatchout team."
                    />
                  </div>
                </SwiperSlide>


                 <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review6.png"
                          alt="Chloe"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Arvind sah</h4>
                          <p>3 months ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="The service provided by Tourwatchout was amazing during our Goa visit. From booking our cab and helping us in each and every point whenever needed. We loved each and every moment of the trip and Thanks Tourwatchout for such an amazing support."
                    />
                  </div>
                </SwiperSlide>


                 <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review7.png"
                          alt="Chloe"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>CHANDAN CHATTRAJ</h4>
                          <p>2 months ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="My feed back————-…………I with my family very thankful to Mr Ivan and his entire team members including all person who incudes in this group -urs performance and total arrangements is excellent and not a single issue creates.I am very graceful to urs team .My Thailand tour is very sweet memories with this Tour & Travel team.With ur team co operation excellent.Once again I must say my friends circle and relatives says prefer their tour with ur Tour and Travel group .Thank you .Bye -bye🙏🙏"
                    />
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review8.png"
                          alt="Chloe"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Rakesh Kumar Maurya</h4>
                          <p>8 months ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="Tourwatchout team has help in making our honeymoon experience extraordinary with an pocket friendly package for Shimla and Manali, team was very cooperative and provided us a hasselless experience. If you are looking out to have a great experience please do consider Tourwatchout team."
                    />
                  </div>
                </SwiperSlide>


                <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review9.png"
                          alt="Chloe"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Yash Prakash</h4>
                          <p>3 months ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="It was good experience travelling in assistance of tourwatchout they provided nice stay good food and smooth transition.
                      I took their service multiple times and they are consistent with the value they provide."
                    />
                  </div>
                </SwiperSlide>


                <SwiperSlide>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src="/assets/images/profiles/review10.png"
                          alt="Chloe"
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <h4>Madhu Mourya</h4>
                          <p>8 months ago</p>
                        </div>
                      </div>

                      <div className="review-rating">
                        <img
                          src="/assets/images/hero/icons/star.svg"
                          alt="Star"
                        />
                        <span>5.0</span>
                      </div>
                    </div>

                    <ReviewText
                      text="Hi team thanks for making our honeymoon extraordinary, with very nice hotels views and great guides.

                     This is highly recommended."
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
