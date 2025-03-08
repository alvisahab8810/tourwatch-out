import React from "react";
import Link from "next/link";
export default function Hero() {
  return (
    <>
      <section className="hero-section ">
        <div className="container">
          <div className="row align-items-center pt-200">
            <div className="col-md-6 hero-contennt">
              <h2 className="fs-40 text-white fw-bold">Get Upto</h2>
              <h1 className="fs-88 text-white fw-bold">
                <span className="fs-161 text-white fw-bold">30</span>% Off
                <br />
                And Explore
              </h1>

              <div className="process-section">
                <div className="row justify-content-center">
                  <div className="col-md-3 pl-0">
                    <div className="feature-card">
                      <div className="feature-icon">
                        <img
                          src="./assets/images/icons/rtcu/1.png"
                          alt="Booking Icon"
                        />
                      </div>
                      <div className="feature-title">
                        Hassle-Free <br />
                        Booking
                      </div>
                      
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card">
                      <div className="feature-icon">
                        <img
                          src="./assets/images/icons/rtcu/2.png"
                          alt="Money Icon"
                        />
                      </div>
                      <div className="feature-title">
                        Value For <br />
                        Money
                      </div>
                      
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card">
                      <div className="feature-icon">
                        <img
                          src="./assets/images/icons/rtcu/3.png"
                          alt="Packages Icon"
                        />
                      </div>
                      <div className="feature-title">
                        Personalised
                        <br />
                        Packages
                      </div>
                      
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card">
                      <div className="feature-icon">
                        <img
                          src="./assets/images/icons/rtcu/4.png"
                          alt="Customer Icon"
                        />
                      </div>
                      <div className="feature-title">
                        24/7 Customer <br />
                        Support
                      </div>
                     
                    </div>
                  </div>
                </div>
              </div>
              {/* <Link href="#" className="main-btn">
                Explore Now{" "}
                <img
                  src="./assets/images/icons/arrow-right.png"
                  alt="Arrow Right"
                />
              </Link> */}
            </div>
            <div className="col-md-6"></div>
          </div>
        </div>
      </section>
    </>
  );
}
