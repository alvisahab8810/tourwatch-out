import React from "react";

export default function Help() {
  return (
    <>
      <section className="helping-sections pt-80">
        <div className="container d-flex align-items-center justify-content-center ">
          <div className="row w-100">
            <div className="col-md-6 mobile-none">
              <img
                src="./assets/images/helping-banner.png"
                className="img-fluid rounded "
                alt="Woman in a blue dress and straw hat looking at the ocean"
              />
            </div>
            <div className="col-md-6 d-flex flex-column justify-content-center">
              <div className="content-section">
                <h1>Helping You Find Your Dream Vacation Come True</h1>
                <img
                  src="./assets/images/helping-banner.png"
                  className="img-fluid rounded desktop-none"
                  alt="Woman in a blue dress and straw hat looking at the ocean"
                />
                <p className="mt-4 mb-5">
                  Discovering New Worlds With Your Two Eyes Will Make You Want
                  To Explore The Whole World. Whatever You Need Will Be Here
                </p>
                <div className="row featur">
                  <div className="col-6  mb-3">
                    <div className="d-flex align-items-center">
                      <img src="./assets/images/icons/1.png" alt="Icon" />
                      <span className="pl-5">20</span>
                    </div>
                    <div>
                      <p>Elite Airlines</p>
                    </div>
                  </div>
                  <div className="col-6  mb-3">
                    <div className="d-flex align-items-center">
                      <img src="./assets/images/icons/2.png" alt="Icon" />
                      <span>90M+</span>
                    </div>
                    <div>
                      <p>Satisfied Traveler</p>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="d-flex align-items-center">
                      <img src="./assets/images/icons/3.png" alt="Icon" />
                      <span>50+</span>
                    </div>
                    <div>
                      <p>Holiday Package</p>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="d-flex align-items-center">
                      <img src="./assets/images/icons/4.png" alt="Icon" />
                      <span>120</span>
                    </div>
                    <div>
                      <p>Luxury Hotel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
