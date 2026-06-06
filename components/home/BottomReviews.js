import React, { useState } from "react";
import { getReviewsBySlug } from "../../data/destinationReviews";

const INITIAL_COUNT = 6;

export default function BottomReviews({ slug }) {
  const [showMore, setShowMore] = useState(false);
  const all     = getReviewsBySlug(slug);
  const visible = showMore ? all : all.slice(0, INITIAL_COUNT);
  const extra   = all.length - INITIAL_COUNT;

  return (
    <div>
      <section className="google-reviews mobile-none">
        <div className="mini-container1">
          <h2 className="google-reviews-header">Client Reviews</h2>

          <div className="reviews-overview">
            <div className="reviews-summary">
              <div className="rating-display">
                <img
                  src="/assets/images/hero/icons/reviews.svg"
                  alt="Rating stars"
                  className="rating-stars"
                />
                <div className="rating-number">4.9</div>
                <div className="rating-source">675 Reviews</div>
              </div>
            </div>

            <div className="rating-breakdown">
              {[["5","85%","12.5K"],["4","80%","5.5K"],["3","20%","377"],["2","0%","0"],["1","0%","0"]].map(([label, width, count]) => (
                <div key={label} className="rating-row">
                  <span className="rating-label">{label}</span>
                  <img src="/assets/images/hero/icons/star.svg" alt="Star" className="rating-star" />
                  <div className="rating-bar">
                    <div className="rating-fill" style={{ width }}></div>
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="customer-reviews">
            {visible.map((r, i) => (
              <div key={i} className="customer-review">
                <div className="customer-header">
                  <div className="customer-info">
                    <div className="customer-profile">
                      <img src={r.img} alt="Customer Reviews" />
                    </div>
                    <div className="customer-info-row">
                      <h4>{r.name}</h4>
                      <p className="date">{r.date}</p>
                    </div>
                  </div>
                  <div className="customer-rating">
                    <img src="/assets/images/hero/icons/color-star.svg" alt="Star" />
                    <span>{r.rating}</span>
                  </div>
                </div>
                <p className="booking-info">
                  <span className="booked">Booked:</span> {r.booked}
                </p>
                <p className="customer-review-text">{r.text}</p>
              </div>
            ))}
          </div>

          {extra > 0 && (
            <button
              className="load-more-button interactive"
              onClick={() => setShowMore(p => !p)}
            >
              {showMore ? "Show Less Reviews" : `Load More reviews (${extra}+)`}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
