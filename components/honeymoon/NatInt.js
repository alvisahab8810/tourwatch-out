import React from "react";
import Link from "next/link";

export default function NatInt() {
  return (
    <>
      <section className="national-inter-section">
        <div className="container">
          <ul className="nav nav-pills tabs-list" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                National
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                International
              </button>
            </li>
          </ul>

          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabindex="0"
            >
              {/* <!-- ------- first-row --> */}
              <div className="national-list-bx">
                <div className="national-features p-relative">
                  <Link href="#">
                    <div className="batch-info">
                      <p>Starting From*</p>
                      <h4>
                        ₹23,999/<sub>person</sub>
                      </h4>
                    </div>
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/honeymoon/img1.webp"
                        alt="Honeymoon Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Singapore</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features p-relative">
                  <Link href="#">
                    <div className="batch-info">
                      <p>Starting From*</p>
                      <h4>
                        ₹23,999/<sub>person</sub>
                      </h4>
                    </div>
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/honeymoon/img2.webp"
                        alt="Honeymoon Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Bali</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features p-relative">
                  <Link href="/kashmir-honeymoon">
                    <div className="batch-info">
                      <p>Starting From*</p>
                      <h4>
                        ₹23,999/<sub>person</sub>
                      </h4>
                    </div>
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/honeymoon/img3.webp"
                        alt="Honeymoon Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Malaysia</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="national-features p-relative mt-2">
                  <Link href="#">
                    <div className="batch-info">
                      <p>Starting From*</p>
                      <h4>
                        ₹23,999/<sub>person</sub>
                      </h4>
                    </div>
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/honeymoon/img4.webp"
                        alt="Honeymoon Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Singapore</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features p-relative mt-2">
                  <Link href="#">
                    <div className="batch-info">
                      <p>Starting From*</p>
                      <h4>
                        ₹23,999/<sub>person</sub>
                      </h4>
                    </div>
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/honeymoon/img5.webp"
                        alt="Honeymoon Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Bali</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features p-relative mt-2">
                  <Link href="#">
                    <div className="batch-info">
                      <p>Starting From*</p>
                      <h4>
                        ₹23,999/<sub>person</sub>
                      </h4>
                    </div>
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/honeymoon/img6.webp"
                        alt="Honeymoon Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Malaysia</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* <!-- ------- banner- --> */}

              <section className="honeymoon-cta banner-sections ab-cta ptb-20">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Experience magic together with a dreamy</p>
                    <h1 className="pacifico-regular">Candlelight Dinner</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">
                      Request A Callback
                    </button>
                  </div>
                  <div className="ms-auto"></div>
                </div>
              </section>

              {/* <!-- ------- 2nd-row --> */}

              <section className="destination-row ">
                <div className="national-list-bx pb-80">
                  <div className="national-features p-relative">
                    <Link href="#">
                      <div className="batch-info">
                        <p>Starting From*</p>
                        <h4>
                          ₹23,999/<sub>person</sub>
                        </h4>
                      </div>
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/honeymoon/img1.webp"
                          alt="Honeymoon Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Singapore</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="national-features p-relative">
                    <Link href="#">
                      <div className="batch-info">
                        <p>Starting From*</p>
                        <h4>
                          ₹23,999/<sub>person</sub>
                        </h4>
                      </div>
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/honeymoon/img2.webp"
                          alt="Honeymoon Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Bali</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="national-features p-relative">
                    <Link href="/kashmir-honeymoon">
                      <div className="batch-info">
                        <p>Starting From*</p>
                        <h4>
                          ₹23,999/<sub>person</sub>
                        </h4>
                      </div>
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/honeymoon/img3.webp"
                          alt="Honeymoon Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Malaysia</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="national-features p-relative mt-2">
                    <Link href="#">
                      <div className="batch-info">
                        <p>Starting From*</p>
                        <h4>
                          ₹23,999/<sub>person</sub>
                        </h4>
                      </div>
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/honeymoon/img4.webp"
                          alt="Honeymoon Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Singapore</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="national-features p-relative mt-2">
                    <Link href="#">
                      <div className="batch-info">
                        <p>Starting From*</p>
                        <h4>
                          ₹23,999/<sub>person</sub>
                        </h4>
                      </div>
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/honeymoon/img5.webp"
                          alt="Honeymoon Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Bali</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="national-features p-relative mt-2">
                    <Link href="#">
                      <div className="batch-info">
                        <p>Starting From*</p>
                        <h4>
                          ₹23,999/<sub>person</sub>
                        </h4>
                      </div>
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/honeymoon/img6.webp"
                          alt="Honeymoon Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Malaysia</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabindex="0"
            >
              {/* <!-- ------- first-row --> */}
              <div className="national-list-bx">
                <div className="national-features">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/n-destination/img2.webp"
                        alt="National Destination"
                      />{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Goa</h3>
                        <p>
                          Goa is a vibrant coastal haven, known for its stunning
                          beaches, lively nightlife, and rich cultural heritage,
                          ideal for relaxation and exploration.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              />
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              />
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              />
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          />{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features">
                  <Link href="/kashmir-honeymoon">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/n-destination/img3.webp"
                        alt="National Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Kashmir</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/n-destination/img4.webp"
                        alt="National Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Darjeeling</h3>
                        <p>
                          Darjeeling, with its lush tea gardens and panoramic
                          views of the Himalayas, is a charming hill station
                          that captivates visitors seeking tranquility & natural
                          beauty.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="national-features mt-2">
                  <Link href="/kashmir-honeymoon">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/n-destination/img3.webp"
                        alt="National Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Kashmir</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features mt-2">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/n-destination/img2.webp"
                        alt="National Destination"
                      />{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Goa</h3>
                        <p>
                          Goa is a vibrant coastal haven, known for its stunning
                          beaches, lively nightlife, and rich cultural heritage,
                          ideal for relaxation and exploration.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              />
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              />
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              />
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          />{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features mt-2">
                  <Link href="/kashmir-honeymoon">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="./assets/images/n-destination/img3.webp"
                        alt="National Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Kashmir</h3>
                        <p>
                          Kashmir is a breathtaking paradise, featuring majestic
                          mountains and serene lakes, perfect for nature lovers
                          and adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="./assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="./assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="./assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* <!-- -------National banner- --> */}

              <section className="banner-sections ptb-20">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">
                      Start Journey Now
                    </button>
                  </div>
                </div>
              </section>
              {/* <!-- ------- 2nd-row --> */}
              <section className="destination-row ">
                <div className="national-list-bx pb-80">
                  <div className="national-features">
                    <Link href="#">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/n-destination/img4.webp"
                          alt="National Destination"
                        />{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Darjeeling</h3>
                          <p>
                            Darjeeling, with its lush tea gardens and panoramic
                            views of the Himalayas, is a charming hill station
                            that captivates visitors seeking tranquility &
                            natural beauty.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                />
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                />
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                />
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            />{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="national-features">
                    <Link href="/kashmir-honeymoon">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/n-destination/img3.webp"
                          alt="National Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Kashmir</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="national-features">
                    <Link href="#">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/n-destination/img2.webp"
                          alt="National Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Goa</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="national-features mt-2">
                    <Link href="/kashmir-honeymoon">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/n-destination/img3.webp"
                          alt="National Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Kashmir</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="national-features mt-2">
                    <Link href="#">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/n-destination/img4.webp"
                          alt="National Destination"
                        />{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Darjeeling</h3>
                          <p>
                            Darjeeling, with its lush tea gardens and panoramic
                            views of the Himalayas, is a charming hill station
                            that captivates visitors seeking tranquility &
                            natural beauty.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                />
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                />
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                />
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            />{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="national-features mt-2">
                    <Link href="/kashmir-honeymoon">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="./assets/images/n-destination/img3.webp"
                          alt="National Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Kashmir</h3>
                          <p>
                            Kashmir is a breathtaking paradise, featuring
                            majestic mountains and serene lakes, perfect for
                            nature lovers and adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="./assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="./assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="./assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
