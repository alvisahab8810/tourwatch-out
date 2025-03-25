import React from "react";
import Link from "next/link";
export default function NatInt() {
  return (
    <>
      <section className=" national-inter-section">
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
              className="tab-pane international-main fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabindex="0"
            >
              {/* <!-- ------- first-row --> */}
              <div className="national-list-bx mob-pad">
                <div className="national-features">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/i-destination/img1.webp"
                        alt="National Destination"
                      />{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Bali</h3>
                        <p>
                          Bali is a tropical paradise, renowned for its stunning
                          beaches, vibrant culture, and lush landscapes, perfect
                          for relaxation and adventure.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              />
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              />
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              />
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          />{" "}
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
                        src="/assets/images/i-destination/img2.webp"
                        alt="National Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Singapore</h3>
                        <p>
                          Singapore is a dynamic city-state, celebrated for its
                          modern skyline, diverse cuisine, and lush gardens,
                          offering a unique blend of culture and innovation.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                 </Link>
                </div>

                 {/* ================== CTA ================== */}
                  <section className="banner-sections desktop-none ptb-40-30" >
                    <div className="container">
                      <div className="banner-section">
                        <div className="banner-content">
                          <p>Explore </p>
                          <h1 className="pacifico-regular">Dubai</h1>
                          <p>And get exciting offers</p>
                          <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                                data-bs-target="#exampleModalCenter"
                                fdprocessedid="s6df8j">Start Journey Now</button>
                        </div>
                        <div className="con-ctabx">
                          <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                                data-bs-target="#exampleModalCenter"
                                fdprocessedid="s6df8j">Start Journey Now</button>
                        </div>
                      </div>
                    </div>
                  </section>
                  {/* ================== CTA ================== */}

                <div className="national-features">
                  <Link href="/kashmir-corporate">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/i-destination/img3.webp"
                        alt="National Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Thailand</h3>
                        <p>
                          Thailand is a vibrant destination, famous for its
                          beautiful beaches, rich culture, and lively street
                          life, perfect for adventure seekers.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
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
                        src="/assets/images/i-destination/img4.webp"
                        alt="National Destination"
                      />{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Malaysia</h3>
                        <p>
                          Malaysia is a diverse country, known for its stunning
                          rainforests, vibrant cities, and rich cultural
                          heritage, offering a unique experience for every
                          traveler.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              />
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              />
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              />
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          />{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="national-features mt-2 mobile-none">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/i-destination/img1.webp"
                        alt="National Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Bali</h3>
                        <p>
                          Bali is a tropical paradise, renowned for its stunning
                          beaches, vibrant culture, and lush landscapes, perfect
                          for relaxation and adventure.
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features mt-2 mobile-none">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/i-destination/img2.webp"
                        alt="National Destination"
                      ></img>{" "}
                    </div>
                    <div className="desti-main">
                      <div className="desti-info">
                        <h3>Singapore</h3>
                        <p>
                          Singapore is a dynamic city-state, celebrated for its
                          modern skyline, diverse cuisine, and lush gardens,
                          offering a unique blend of culture and innovation.s
                        </p>
                      </div>
                      <div className="facility-section">
                        <div className="faci-1">
                          <ul>
                            <li className="ml-0">
                              <img
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
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

              <section className="international-banner banner-sections ptb-20 mobile-none">
                <div className="banner-section">
                  <div className="banner-content">
                    <p className="i-para">Strengthen collaborations with</p>
                    <h1 className="pacifico-regular">Executive Getaway</h1>
                    <p className="i-para1">And get exciting offers</p>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">
                      Request A Callback
                    </button>
                  </div>
                </div>
              </section>

              {/* <!-- ------- 2nd-row --> */}

              <section className="destination-row mobile-none">
                <div className="national-list-bx pb-80">
                  <div className="national-features">
                    <Link href="/kashmir-corporate">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="/assets/images/i-destination/img3.webp"
                          alt="National Destination"
                        />{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Thailand</h3>
                          <p>
                            Thailand is a vibrant destination, famous for its
                            beautiful beaches, rich culture, and lively street
                            life, perfect for adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                />
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                />
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                />
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            />{" "}
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
                          src="/assets/images/i-destination/img4.webp"
                          alt="National Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Malaysia</h3>
                          <p>
                            Malaysia is a diverse country, known for its
                            stunning rainforests, vibrant cities, and rich
                            cultural heritage, offering a unique experience for
                            every traveler.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
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
                          src="/assets/images/i-destination/img1.webp"
                          alt="National Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Bali</h3>
                          <p>
                            Bali is a tropical paradise, renowned for its
                            stunning beaches, vibrant culture, and lush
                            landscapes, perfect for relaxation and adventure.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
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
                          src="/assets/images/i-destination/img2.webp"
                          alt="National Destination"
                        />{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Singapore</h3>
                          <p>
                            Singapore is a dynamic city-state, celebrated for
                            its modern skyline, diverse cuisine, and lush
                            gardens, offering a unique blend of culture and
                            innovation.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                />
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                />
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                />
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            />{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="national-features mt-2">
                    <Link href="/kashmir-corporate">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="/assets/images/i-destination/img3.webp"
                          alt="National Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Thailand</h3>
                          <p>
                            Thailand is a vibrant destination, famous for its
                            beautiful beaches, rich culture, and lively street
                            life, perfect for adventure seekers.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
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
                          src="/assets/images/i-destination/img4.webp"
                          alt="National Destination"
                        ></img>{" "}
                      </div>
                      <div className="desti-main">
                        <div className="desti-info">
                          <h3>Malaysia</h3>
                          <p>
                            Malaysia is a diverse country, known for its
                            stunning rainforests, vibrant cities, and rich
                            cultural heritage, offering a unique experience for
                            every traveler.
                          </p>
                        </div>
                        <div className="facility-section">
                          <div className="faci-1">
                            <ul>
                              <li className="ml-0">
                                <img
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
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
              <div className="national-list-bx mob-pad">
                <div className="national-features">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/n-destination/img2.webp"
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
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              />
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              />
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              />
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          />{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features">
                  <Link href="/kashmir-corporate">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/n-destination/img3.webp"
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
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                 </Link>
                </div>

                
            {/* ================== CTA ================== */}
            <section className="banner-sections desktop-none ptb-40-30">
              <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
            </section>
            {/* ================== CTA ================== */}

                <div className="national-features">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/n-destination/img4.webp"
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
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                 </Link>
                </div>

                <div className="national-features mt-2">
                  <Link href="/kashmir-corporate">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/n-destination/img3.webp"
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
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          ></img>{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                 </Link>
                </div>
                

                
            {/* ================== CTA ================== */}
            <section className="banner-sections desktop-none ptb-40-30">
              <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
            </section>
            {/* ================== CTA ================== */}

                <div className="national-features mt-2">
                  <Link href="#">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/n-destination/img2.webp"
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
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              />
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              />
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              />
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
                            alt="Heart Icon"
                          />{" "}
                          <span>4.8</span>{" "}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="national-features mt-2">
                  <Link href="/kashmir-corporate">
                    <div className="desti-img">
                      {" "}
                      <img
                        src="/assets/images/n-destination/img3.webp"
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
                                src="/assets/images/destination/icons/hotel.png"
                                alt="Hotel Icon"
                              ></img>
                              <p> Upto 3 Stars</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/meal.png"
                                alt="Meal Icon"
                              ></img>
                              <p> Meal</p>
                            </li>
                            <li>
                              <img
                                src="/assets/images/destination/icons/sight.png"
                                alt="sight Icon"
                              ></img>
                              <p> Sightseeing</p>
                            </li>
                          </ul>
                        </div>
                        <div className="faci-ratings">
                          {" "}
                          <img
                            src="/assets/images/destination/icons/heart.png"
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

              <section className="banner-sections ptb-20 mobile-none">
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
              <section className="destination-row  mobile-none">
                <div className="national-list-bx pb-80">
                  <div className="national-features">
                    <Link href="#">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="/assets/images/n-destination/img4.webp"
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
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                />
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                />
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                />
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            />{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="national-features">
                    <Link href="/kashmir-corporate">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="/assets/images/n-destination/img3.webp"
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
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
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
                          src="/assets/images/n-destination/img2.webp"
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
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            ></img>{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                   </Link>
                  </div>

                  <div className="national-features mt-2">
                    <Link href="/kashmir-corporate">
                      <div className="desti-img">
                        {" "}
                        <img
                          src="/assets/images/n-destination/img3.webp"
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
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
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
                          src="/assets/images/n-destination/img4.webp"
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
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                />
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                />
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                />
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
                              alt="Heart Icon"
                            />{" "}
                            <span>4.8</span>{" "}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="national-features mt-2">
                    <Link href="/kashmir-corporate">
                      {/*  */}
                      <div className="desti-img">
                        {" "}
                        <img
                          src="/assets/images/n-destination/img3.webp"
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
                                  src="/assets/images/destination/icons/hotel.png"
                                  alt="Hotel Icon"
                                ></img>
                                <p> Upto 3 Stars</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/meal.png"
                                  alt="Meal Icon"
                                ></img>
                                <p> Meal</p>
                              </li>
                              <li>
                                <img
                                  src="/assets/images/destination/icons/sight.png"
                                  alt="sight Icon"
                                ></img>
                                <p> Sightseeing</p>
                              </li>
                            </ul>
                          </div>
                          <div className="faci-ratings">
                            {" "}
                            <img
                              src="/assets/images/destination/icons/heart.png"
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
