import React, { useState } from "react";

export default function BottomReviews() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="google-reviews">
      <div className="mini-container1">
        <h2 className="google-reviews-header">Google reviews</h2>

        <div className="reviews-overview">
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

          <div className="rating-breakdown">
            <div className="rating-row">
              <span className="rating-label">5</span>
              <img
                src="/assets/images/hero/icons/star.svg"
                alt="Star"
                className="rating-star"
              />
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: "85%" }}></div>
              </div>
              <span className="rating-count">12.5K</span>
            </div>

            <div className="rating-row">
              <span className="rating-label">4</span>
              <img
                src="/assets/images/hero/icons/star.svg"
                alt="Star"
                className="rating-star"
              />
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: "80%" }}></div>
              </div>
              <span className="rating-count">5.5K</span>
            </div>

            <div className="rating-row">
              <span className="rating-label">3</span>
              <img
                src="/assets/images/hero/icons/star.svg"
                alt="Star"
                className="rating-star"
              />
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: "20%" }}></div>
              </div>
              <span className="rating-count">377</span>
            </div>

            <div className="rating-row">
              <span className="rating-label">2</span>
              <img
                src="/assets/images/hero/icons/star.svg"
                alt="Star"
                className="rating-star"
              />
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: "0%" }}></div>
              </div>
              <span className="rating-count">0</span>
            </div>

            <div className="rating-row">
              <span className="rating-label">1</span>
              <img
                src="/assets/images/hero/icons/star.svg"
                alt="Star"
                className="rating-star"
              />
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: "0%" }}></div>
              </div>
              <span className="rating-count">0</span>
            </div>
          </div>
        </div>

        <div className="customer-reviews">
          {/* REVIEW 1 */}
          <div className="customer-review">
            <div className="customer-header">
              <div className="customer-info">
                <div className="customer-profile">
                  <img
                    src="/assets/images/hero/review/img1.svg"
                    alt="Customer Reviews"
                  />
                </div>
                <div className="customer-info-row">
                  <h4>Piyush Patil</h4>
                  <p className="date">Reviewed: 06 May 2024</p>
                </div>
              </div>
              <div className="customer-rating">
                <img
                  src="/assets/images/hero/icons/color-star.svg"
                  alt="Star"
                />
                <span>5.0/5</span>
              </div>
            </div>

            <p className="booking-info">
              <span className="booked">Booked:</span>{" "}
              <a href="#">Glimpse of Singapore | Flight Inclusive Deal</a>
            </p>

            <p className="customer-review-text">
              I wanted to extend my heartfelt thanks for the exceptional
              experience during my Singapore trip. From seamless logistics to
              courteous drivers, every aspect exceeded my expectations. Special
              appreciation to Vijay Sir for his invaluable guidance. I'll gladly
              recommend Thrillophilia to my loved ones.
            </p>
          </div>

          {/* REVIEW 2 */}
          <div className="customer-review">
            <div className="customer-header">
              <div className="customer-info">
                <div className="customer-profile">
                  <img
                    src="/assets/images/hero/review/img7.svg"
                    alt="Customer Reviews"
                  />
                </div>
                <div className="customer-info-row">
                  <h4>Ravi Kumar Achanta</h4>
                  <p className="date">Reviewed: 22 May 2025</p>
                </div>
              </div>

              <div className="customer-rating">
                <img
                  src="/assets/images/hero/icons/color-star.svg"
                  alt="Star"
                />
                <span>5.0/5</span>
              </div>
            </div>

            <p className="booking-info">
              <span className="booked">Booked:</span> Singapore Tour Package
              Template
            </p>

            <p className="customer-review-text">
              Thrillophilia has planned our family trip to Singapore & Kuala
              Lumpur meticulously and it was a memorable trip. Ground
              coordinators at both the cities were really supportive. Had an
              amazing experience. Thanks to Ms Mansi, Mr Avi Yadav and others.
            </p>
          </div>

          {/* REVIEW 3 */}
          <div className="customer-review">
            <div className="customer-header">
              <div className="customer-info">
                <div className="customer-profile">
                  <img
                    src="/assets/images/hero/review/img3.svg"
                    alt="Customer Reviews"
                  />
                </div>
                <div className="customer-info-row">
                  <h4>Jitendra Gupta</h4>
                  <p className="date">Reviewed: 13 Jan 2025</p>
                </div>
              </div>

              <div className="customer-rating">
                <img
                  src="/assets/images/hero/icons/color-star.svg"
                  alt="Star"
                />
                <span>5.0/5</span>
              </div>
            </div>

            <p className="booking-info">
              <span className="booked">Booked:</span> Jitendra Gupta
            </p>

            <p className="customer-review-text">
              We were a group of 20 people (family) and are trip was across
              Thailand and Singapore. The trip was very well planned, and every
              day accounted properly so that we can cover as much as possible.
              We started off with Thailand, and first stop was Pattaya. In
              Pattaya, we got the chance to visit the island... Read More
            </p>
          </div>

          {/* REVIEW 4 */}
          <div className="customer-review">
            <div className="customer-header">
              <div className="customer-info">
                <div className="customer-profile">
                  <img
                    src="/assets/images/hero/review/img4.svg"
                    alt="Customer Reviews"
                  />
                </div>
                <div className="customer-info-row">
                  <h4>SANTHOSH Narayanamurthy</h4>
                  <p className="date">Reviewed: 28 Nov 2024</p>
                </div>
              </div>

              <div className="customer-rating">
                <img
                  src="/assets/images/hero/icons/color-star.svg"
                  alt="Star"
                />
                <span>5.0/5</span>
              </div>
            </div>

            <p className="booking-info">
              <span className="booked">Booked:</span>{" "}
              <a href="#">
                Universal Studios & SEA Aquarium Singapore Combo Tickets
              </a>
            </p>

            <p className="customer-review-text">It was a great experience.</p>
          </div>

          {/* REVIEW 5 */}
          <div className="customer-review">
            <div className="customer-header">
              <div className="customer-info">
                <div className="customer-profile">
                  <img
                    src="/assets/images/hero/review/img5.svg"
                    alt="Customer Reviews"
                  />
                </div>
                <div className="customer-info-row">
                  <h4>Jitendra Gupta</h4>
                  <p className="date">Reviewed: 31 Dec 2024</p>
                </div>
              </div>

              <div className="customer-rating">
                <img
                  src="/assets/images/hero/icons/color-star.svg"
                  alt="Star"
                />
                <span>5.0/5</span>
              </div>
            </div>

            <p className="booking-info">
              <span className="booked">Booked:</span> Jitendra Gupta
            </p>

            <p className="customer-review-text">
              Nice Experience with Thrillophilia for My 2nd Trip After Dubai.
              All arrangements done as commitment, Ground staff was good & very
              co operatives. Vehicle for Travel, Hotels was up to the mark,
              attraction Ticket's provided well in time. My special thanks to
              Your representative Mr Abhinav Abhishek how ... Read More
            </p>
          </div>

          {/* REVIEW 6 */}
          <div className="customer-review">
            <div className="customer-header">
              <div className="customer-info">
                <div className="customer-profile">
                  <img
                    src="/assets/images/hero/review/img6.svg"
                    alt="Customer Reviews"
                  />
                </div>
                <div className="customer-info-row">
                  <h4>Ravi Kose</h4>
                  <p className="date">Reviewed: 15 Dec 2024</p>
                </div>
              </div>

              <div className="customer-rating">
                <img
                  src="/assets/images/hero/icons/color-star.svg"
                  alt="Star"
                />
                <span>5.0/5</span>
              </div>
            </div>

            <p className="booking-info">
              <span className="booked">Booked:</span> Singapore Tour Package
              Template
            </p>

            <p className="customer-review-text">
              Unforgettable 6D/5N Singapore Adventure, Thanks to Thrillophilia &
              Ankit! Our 6D/5N trip to Singapore was nothing short of amazing,
              and we owe it all to Thrillophilia for organizing such a detailed
              and well-planned itinerary. The trip was packed with adventure,
              excitement, and unforgettable experie... Read More
            </p>
          </div>

          {/* ⭐ SHOW EXTRA REVIEWS ONLY WHEN CLICKED ⭐ */}
          {showMore && (
            <>
              {/* EXTRA REVIEW 1 */}
              <div className="customer-review">
                <div className="customer-header">
                  <div className="customer-info">
                    <div className="customer-profile">
                      <img
                        src="/assets/images/hero/review/img7.svg"
                        alt="Customer Reviews"
                      />
                    </div>
                    <div className="customer-info-row">
                      <h4>Neha Sharma</h4>
                      <p className="date">Reviewed: 18 Dec 2024</p>
                    </div>
                  </div>

                  <div className="customer-rating">
                    <img
                      src="/assets/images/hero/icons/color-star.svg"
                      alt="Star"
                    />
                    <span>4.7/5</span>
                  </div>
                </div>

                <p className="booking-info">
                  <span className="booked">Booked:</span> Marina Bay + Night
                  Safari
                </p>

                <p className="customer-review-text">
                  Amazing arrangements by the team! Superb coordination.
                </p>
              </div>

              {/* EXTRA REVIEW 2 */}
              <div className="customer-review">
                <div className="customer-header">
                  <div className="customer-info">
                    <div className="customer-profile">
                      <img
                        src="/assets/images/hero/review/img3.svg"
                        alt="Customer Reviews"
                      />
                    </div>
                    <div className="customer-info-row">
                      <h4>Vikas Rana</h4>
                      <p className="date">Reviewed: 21 Dec 2024</p>
                    </div>
                  </div>

                  <div className="customer-rating">
                    <img
                      src="/assets/images/hero/icons/color-star.svg"
                      alt="Star"
                    />
                    <span>4.9/5</span>
                  </div>
                </div>

                <p className="booking-info">
                  <span className="booked">Booked:</span> Singapore Family
                  Package
                </p>

                <p className="customer-review-text">
                  Wonderful trip, the team handled everything professionally.
                </p>
              </div>
            </>
          )}
        </div>

        <button
          className="load-more-button interactive"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less Reviews" : "Load More reviews (18439+)"}
        </button>
      </div>
    </section>
  );
}
