import React from "react";

export default function Usp() {
  return (
    <>
      <section className="destination-row pt-80">
        <div className="container">
          <div className="row w-100">
            <div className="content-section">
              <h1>Top Travel Packages</h1>
              <p className="mt-4 mb-5">
                Explore our most popular packages, loved by travelers worldwide.
              </p>
            </div>
          </div>

          <div className="usp-section-bx pb-80 container-fluid">
            <div className="row">
              <div className="col-md-6 p-0">
                <img
                  alt="Person kayaking on a serene lake with mountains in the background"
                  className="img-fluid"
                  height="400"
                  src="./assets/images/corporate/about.webp"
                  width="600"
                />
              </div>
              <div className="col-md-6 ">
                <div className=" mb-4">
                  <button
                    className="btn btn-custom"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j"
                  >
                    Request a Custom Package
                  </button>
                  <a href="#review-section" className="btn btn-custom-outline">
                    Trip Reviews
                  </a>
                </div>

                <div>
                  <ul className="usp-list">
                    <li>
                      <img
                        src="./assets/images/corporate/icons/1.png"
                        alt="Icons"
                      />
                      <span className="width-fit">Customised setup </span>
                      <div className="question-bx">
                        <img
                          src="./assets/images/corporate/icons/question.png"
                          alt="Question Icon"
                        />
                        <span className="tooltip-text">
                          This is a customized setup.
                        </span>
                      </div>
                    </li>
                    <li>
                      <img
                        src="./assets/images/corporate/icons/2.png"
                        alt="Icons"
                      />
                      <span className="width-fit"> Company Branding </span>
                      <div className="question-bx">
                        <img
                          src="./assets/images/corporate/icons/question.png"
                          alt="Question Icon"
                        />
                        <span className="tooltip-text">
                          We provide company branding services.
                        </span>
                      </div>
                    </li>
                    <li>
                      <img
                        src="./assets/images/corporate/icons/3.png"
                        alt="Icons"
                      />
                      <span className="width-fit">Management Service </span>
                      <div className="question-bx">
                        <img
                          src="./assets/images/corporate/icons/question.png"
                          alt="Question Icon"
                        />
                        <span className="tooltip-text">
                          Our management services help streamline operations.
                        </span>
                      </div>
                    </li>
                    <li>
                      <img
                        src="./assets/images/corporate/icons/4.png"
                        alt="Icons"
                      />
                      <span className="width-fit">Team Activities </span>
                      <div className="question-bx">
                        <img
                          src="./assets/images/corporate/icons/question.png"
                          alt="Question Icon"
                        />
                        <span className="tooltip-text">
                          We organize fun and engaging team activities.
                        </span>
                      </div>
                    </li>
                    <li>
                      <img
                        src="./assets/images/corporate/icons/5.png"
                        alt="Icons"
                      />
                      <span className="width-fit"> Photos and Videos </span>
                      <div className="question-bx">
                        <img
                          src="./assets/images/corporate/icons/question.png"
                          alt="Question Icon"
                        />
                        <span className="tooltip-text">
                          Capture the moments with our photos and videos
                          services.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
