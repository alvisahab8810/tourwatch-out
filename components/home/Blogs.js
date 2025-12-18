import React from "react";
import Link from "next/link";

export default function Blogs() {
  return (
    <section className="blogs-section">
      <div className="mini-container1">
        <div className="explore-row">
          <h2 className="section-title">Blogs</h2>
          <Link href="/blogs" className="explore-more-btn">
            View all
          </Link>
        </div>

        <div className="blogs-grid pt-80">

          {/* BLOG 1 */}
          <div className="blog-card">
            <div
              className="blog-image"
              style={{
                backgroundImage: "url('/assets/images/blogs/blog1.png')",
              }}
            >
              <div className="blog-overlay">
                <div className="blog-category">Malaysia</div>
                <div className="blog-subcategory">Tour Packages</div>
                <div className="blog-divider"></div>
                <div className="blog-price">
                  <span className="price-label">Starts at</span>
                  <span className="price-value">₹ ***</span>
                </div>
              </div>
            </div>
          </div>

          {/* BLOG 2 */}
          <div className="blog-card">
            <div
              className="blog-image"
              style={{
                backgroundImage: "url('/assets/images/blogs/blog2.png')",
              }}
            >
              <div className="blog-overlay">
                <div className="blog-category">Thailand</div>
                <div className="blog-subcategory">Tour Packages</div>
                <div className="blog-divider"></div>
                <div className="blog-price">
                  <span className="price-label">Starts at</span>
                  <span className="price-value">₹ ***</span>
                </div>
              </div>
            </div>
          </div>

          {/* BLOG 3 */}
          <div className="blog-card">
            <div
              className="blog-image"
              style={{
                backgroundImage: "url('/assets/images/blogs/blog3.png')",
              }}
            >
              <div className="blog-overlay">
                <div className="blog-category">Kuala Lumpur</div>
                <div className="blog-subcategory">Tour Packages</div>
                <div className="blog-divider"></div>
                <div className="blog-price">
                  <span className="price-label">Starts at</span>
                  <span className="price-value">₹ ***</span>
                </div>
              </div>
            </div>
          </div>

          {/* BLOG 4 */}
          {/* <div className="blog-card">
            <div
              className="blog-image"
              style={{
                backgroundImage: "url('/assets/images/blogs/blog4.png')",
              }}
            >
              <div className="blog-overlay">
                <div className="blog-category">Dubai</div>
                <div className="blog-subcategory">Tour Packages</div>
                <div className="blog-divider"></div>
                <div className="blog-price">
                  <span className="price-label">Starts at</span>
                  <span className="price-value">₹ ***</span>
                </div>
              </div>
            </div>
          </div> */}

      

        </div>
      </div>
    </section>
  );
}
