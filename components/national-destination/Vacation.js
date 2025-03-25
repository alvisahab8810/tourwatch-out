import React from "react";

export default function Vacation() {
  return (
    <>
      <section className="drem-sections pb-80">
        <div className="container">
          <div className="dream-section">
            <div className="main-dream-bx">
              <div className="image-section">
                <img
                  alt="Person kayaking on a serene lake with mountains in the background"
                  className="img-fluid"
                  src="/assets/images/n-destination/about.webp"
                />
              </div>
              <div className="content-section dream-content">
                <h2>Tailor Your Dream Vacation</h2>
                <p>
                  Looking for a Truly Unique Experience? Customize Your Travel
                  Package to Match Your Dream Adventure and Personalize Every
                  Detail of Your Journey.
                </p>

                <div className="feature_bx">
                  <div className="feature">
                    <img
                      src="/assets/images/n-destination/icons/1.png"
                      alt="private tutors"
                    />
                    <h3>Private tours</h3>
                    <p>
                      Explore your destination at your own pace with a private
                      guide, offering personalized insights and tailored
                      experiences just for you.
                    </p>
                  </div>
                  <div className="feature">
                    <img
                      src="/assets/images/n-destination/icons/2.png"
                      alt="private tutors"
                    />
                    <h3>Special meal plans</h3>

                    <p>
                      Indulge in customized dining experiences, from local
                      delicacies to gourmet meals, crafted to suit your tastes
                      and dietary preferences.
                    </p>
                  </div>
                  <div className="feature">
                    <img
                      src="/assets/images/n-destination/icons/3.png"
                      alt="private tutors"
                    />
                    <h3>Extended stays or additional destinations</h3>

                    <p>
                      Enjoy a more relaxed, immersive experience by extending
                      your stay, giving you extra time to explore and unwind at
                      your own pace.
                    </p>
                  </div>
                  <div className="feature">
                    <img
                      src="/assets/images/n-destination/icons/4.png"
                      alt="private tutors"
                    />
                    <h3>Additional Destinations</h3>
                    <p>
                      Enhance your journey by adding more destinations, allowing
                      you to explore nearby cities or countries for a truly
                      unforgettable adventure.
                    </p>
                  </div>
                </div>

                <button className="btn-custom" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">Request a Custom Package</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
