import React from "react";

export default function About() {
  return (
    <>
      <section className="blogs-about pt-80">
        <div className="container">
          <div className="row w-100">
            <div className="content-section">
              <h1 className="main-heading-blogs">Top picks for you</h1>
              <p className="mt-4 mb-5">
                Handpicked articles to inspire and guide your next journey
              </p>
            </div>
          </div>
        </div>

        <div className="container d-flex align-items-center justify-content-center ">
          <div className="row w-100">
            <div className="col-md-6 mobile-none">
              <img
                src="./assets/images/blogs/about.webp"
                className="img-fluid rounded "
                alt="about image"
              />
            </div>
            <div className="blog-about-con col-md-6 d-flex flex-column justify-content-center">
              <div className="content-section">
                <div className="category">Food</div>
                <a href="#">
                  <h1>
                    A Food Lover’s Guide to Dubai:
                    <br />
                    Top Restaurants and Street Food <br />
                    Spots
                  </h1>
                </a>

                <p className="mt-4 mb-5">
                  Explore Dubai's culinary treasures with our guide to the
                  city's top restaurants and vibrant street food spots.
                </p>

                <ul className="times-lists">
                  <li>18 Nov 2024</li>
                  <li>5 min read</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
