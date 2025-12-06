import React, { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,  Autoplay } from "swiper/modules";
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
          <h2 className="section-title">Google Reviews</h2>
          <Link href="#" className="explore-more-btn">
            View all
          </Link>
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
              <div className="rating-number">4.5</div>
              <div className="rating-text">675 Google Reviews</div>
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
                        src="https://storage.googleapis.com/a1aa/image/d69f7d10-4bef-407c-a414-8b61e621e39d.jpg"
                        alt="Chloe"
                        className="reviewer-avatar"
                      />
                      <div className="reviewer-details">
                        <h4>Chloe Patterson</h4>
                        <p>May 5, 2023</p>
                      </div>
                    </div>

                    <div className="review-rating">
                      <img src="/assets/images/hero/icons/star.svg" alt="Star" />
                      <span>4.0</span>
                    </div>
                  </div>

                  <ReviewText
                    text="
                    Outstanding service and dedication! They worked with us until we were completely satisfied. Truly a team that goes the extra mile. Their communication was smooth and everything was handled with extreme professionalism."
                  />
                </div>
              </SwiperSlide>

              {/* CARD 2 — Ethan */}
              <SwiperSlide>
                <div className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img
                        src="/assets/images/icons/reviews/profile1.png"
                        alt="Ethan"
                        className="reviewer-avatar"
                      />
                      <div className="reviewer-details">
                        <h4>Ethan Clark</h4>
                        <p>April 10, 2023</p>
                      </div>
                    </div>

                    <div className="review-rating">
                      <img src="/assets/images/hero/icons/star.svg" alt="Star" />
                      <span>4.4</span>
                    </div>
                  </div>

                  <ReviewText
                    text="
                    Skilled professionals & decent service, but pricing was confusing. We had a few unexpected charges, so make sure to clarify costs upfront. The final outcome was still very impressive."
                  />
                </div>
              </SwiperSlide>

              {/* CARD 3 — Isabella */}
              <SwiperSlide>
                <div className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img
                        src="/assets/images/icons/reviews/profile.png"
                        alt="Isabella"
                        className="reviewer-avatar"
                      />
                      <div className="reviewer-details">
                        <h4>Isabella Turner</h4>
                        <p>March 22, 2023</p>
                      </div>
                    </div>

                    <div className="review-rating">
                      <img src="/assets/images/hero/icons/star.svg" alt="Star" />
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
                        src="/assets/images/icons/reviews/profile2.png"
                        alt="Benjamin"
                        className="reviewer-avatar"
                      />
                      <div className="reviewer-details">
                        <h4>Benjamin Collins</h4>
                        <p>February 8, 2023</p>
                      </div>
                    </div>

                    <div className="review-rating">
                      <img src="/assets/images/hero/icons/star.svg" alt="Star" />
                      <span>4.1</span>
                    </div>
                  </div>

                  <ReviewText
                    text="
                    Very professional team. Even though we needed a few revisions, they handled everything smoothly and without delay. The final output exceeded our expectations and showed their strong attention to detail."
                  />
                </div>
              </SwiperSlide>

              {/* CARD 5 — Chloe again */}
              <SwiperSlide>
                <div className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img
                        src="https://storage.googleapis.com/a1aa/image/d69f7d10-4bef-407c-a414-8b61e621e39d.jpg"
                        alt="Chloe"
                        className="reviewer-avatar"
                      />
                      <div className="reviewer-details">
                        <h4>Chloe Patterson</h4>
                        <p>May 5, 2023</p>
                      </div>
                    </div>

                    <div className="review-rating">
                      <img src="/assets/images/hero/icons/star.svg" alt="Star" />
                      <span>4.0</span>
                    </div>
                  </div>

                  <ReviewText
                    text="
                    Really impressed with their service. Everything was delivered on time with great quality. The team maintained excellent communication and ensured everything was perfect from start to finish."
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
