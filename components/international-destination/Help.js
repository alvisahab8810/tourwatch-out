import React from "react";

export default function Help() {
  return (
    <>
      <section className="international-help need-help-section ">
        <div className="container">
          <div className="need-help-row">
            <div className="need-form-bx ">
              <h2>Need help to decide?</h2>
              <p className="need-para">
                Let’s Connect and talk out your doubtss
              </p>

              <div className="contact-form p-5">
                <form>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                      Full Name
                    </label>
                    <input type="text" className="form-control" id="fullName" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailAddress" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailAddress"
                    />
                  </div>
                  <button type="submit" className="btn btn-block">
                    Contact Us
                  </button>
                </form>
              </div>
            </div>
            <div className="need-form-bx">
              <section className="banner-sections ">
                <div className="banner-section1">
                  <div className="banner-content">
                    <p>Explore</p>
                    <h1 className="pacifico-regular">Dubai</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">
                      Start Journey Now
                    </button>
                  </div>
                  <div className="ms-auto"></div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
