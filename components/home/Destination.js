import React from "react";

export default function Destination() {
  return (
    <>
      <section className="destination-section pb-80">
        <div className="container">
          <div className="row pt-80">
            <div className="col-md-12">
              <h2 className="subtitle text-center">WHAT WE SERVE</h2>
              <h1 className="heading lh-75">
                We Provide <br /> The Best Destination Services
              </h1>
            </div>
          </div>

          <div className="swiper mySwiper3  pt-80 ">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="card">
                  <img
                    src="./assets/images/destination/img1.png"
                    alt="Card Image"
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <div className="overlay-text">
                      <h2>Bali, Indonesia</h2>
                      <p>6 Days 5 Nights</p>
                      <div className="price-bx">
                        <div>
                          <h2 className="price-text">$330/ Person</h2>
                        </div>
                        <div className="d-flex align-items-center">
                          <img
                            src="./assets/images/destination/star.png"
                            alt="Star Image"
                          />
                          <h2 className="ml-2">4.8</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-text">
                    <h2>Bali, Indonesia</h2>
                    <p>Indonesia</p>
                  </div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="card">
                  <img
                    src="./assets/images/destination/img2.png"
                    alt="Card Image"
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <div className="overlay-text">
                      <h2>Tunak Beach</h2>
                      <p>6 Days 5 Nights</p>
                      <div className="price-bx">
                        <div>
                          <h2 className="price-text">$350/ Person</h2>
                        </div>
                        <div className="d-flex align-items-center">
                          <img
                            src="./assets/images/destination/star.png"
                            alt="Star Image"
                          />
                          <h2 className="ml-2">4.8</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-text">
                    <h2>Tunak Beach</h2>
                    <p>Lombok, Indonesia</p>
                  </div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="card">
                  <img
                    src="./assets/images/destination/img3.png"
                    alt="Card Image"
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <div className="overlay-text">
                      <h2>Prambanan Temple</h2>
                      <p>6 Days 5 Nights</p>
                      <div className="price-bx">
                        <div>
                          <h2 className="price-text">$340/ Person</h2>
                        </div>
                        <div className="d-flex align-items-center">
                          <img
                            src="./assets/images/destination/star.png"
                            alt="Star Image"
                          />
                          <h2 className="ml-2">4.8</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-text">
                    <h2>Prambanan Temple</h2>
                    <p>Yogyakarta, Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- <div className="swiper-pagination"></div>  --> */}

            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>
    </>
  );
}
