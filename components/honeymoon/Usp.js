import React from "react";
import Link from "next/link";

export default function Usp() {
  return (
    <>
      <section className="destination-row pt-80">
        <div className="container">
          <div className="row w-100 mobile-none">
            <div className="content-section">
              <h1>Journey to Your Forever!</h1>
              <p className="mt-4 mb-5">
                Discover enchanting honeymoon destinations that celebrate your
                love story together.
              </p>
            </div>
          </div>

          {/* <!-- ============================= USP section ====================== --> */}

          <div className="honeymoon-usp usp-section-bx pb-80 container-fluid">
            <div className="row">
              <div className="col-md-6 p-0 mobile-none">
                <img
                  alt="Person kayaking on a serene lake with mountains in the background"
                  className="img-fluid"
                  height="400"
                  src="./assets/images/corporate/about.webp"
                  width="600"
                />
              </div>
              <div className="col-md-6 ">
                <div className=" mb-4 d-flex">
                  <button
                    className="btn btn-custom"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j"
                  >
                    Request a Custom Package
                  </button>
                  <Link href="#review-section" className="btn btn-custom-outline">
                    Trip Reviews
                  </Link>
                </div>

                <div>
                  <ul className="usp-list">
                    <li>
                      <img
                        src="./assets/images/honeymoon/icons/1.png"
                        alt="Icons"
                      />
                      <span className="width-fit">Private tours</span>
                    </li>
                    <li>
                      <img
                        src="./assets/images/honeymoon/icons/2.png"
                        alt="Icons"
                      />
                      <span className="width-fit"> Special meal plans </span>
                    </li>
                    <li>
                      <img
                        src="./assets/images/honeymoon/icons/3.png"
                        alt="Icons"
                      />
                      <span className="width-fit">
                        Extended stays or additional destinations
                      </span>
                    </li>
                    <li>
                      <img
                        src="./assets/images/honeymoon/icons/4.png"
                        alt="Icons"
                      />
                      <span className="width-fit">
                        Additional Destinations{" "}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>


              <div className="col-md-6 p-0 desktop-none">
                <img
                  alt="Person kayaking on a serene lake with mountains in the background"
                  className="img-fluid"
                  height="400"
                  src="./assets/images/corporate/about.webp"
                  width="600"
                />
              </div>

              <div className="row w-100 desktop-none">
            <div className="content-section">
              <h1>Journey to Your Forever!</h1>
              <p className="mt-4 mb-5">
                Discover enchanting honeymoon destinations that celebrate your
                love story together.
              </p>
            </div>
          </div>


        
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
