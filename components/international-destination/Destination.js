import React from "react";
import Link from "next/link";
export default function Destination() {
  return (
    <div>
      <section className="international-main destination-row pt-80 mob-pad">
        <div className="container">
          <div className="row w-100">
            <div className="content-section">
              <h1>Top Travel Packages</h1>
              <p className="mt-4 mb-5">
                Explore our most popular packages, loved by travelers worldwide.
              </p>
            </div>
          </div>
          <div className="national-list-bx">

            <div class="new-desti-card">
                <img
                  src="/assets/images/i-destination/dubai.webp"
                  alt="Dubai cityscape showing Burj Khalifa tower and waterfront with people"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div class="p-4">
                  <div class="header">
                    <h2>Dubai - Abudhabi</h2>
                    <div className="share-area">
                      <span class="duration-badge">8N/7D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
                      </Link>
                    </div>
                  </div>
                  <div class="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span>
                      Downtown Dubai • Old Dubai • Desert Safari • Palm Jumeirah
                    </span>
                  </div>
                  <div class="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon4.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon7.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div class="price-section">
                    <div class="price-info">
                      <p class="old-price">
                        Starting from <span className="oldcut">₹80,000</span>
                      </p>
                      <p class="new-price">₹50,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/international-destination/dubai">View Package</Link>
                  </div>
                </div>
              </div>
            {/* <div className="national-features">
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/i-destination/dubai.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Dubai - Abudhabi</h3>
                    <p>
                       Dubai  is a tropical paradise, renowned for its stunning
                      beaches, vibrant culture, and lush landscapes, perfect for
                      relaxation and adventure.
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
            </div> */}
            {/* <div className="national-features">
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/i-destination/bali.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Bali</h3>
                    <p>
                      Bali is a dynamic city-state, celebrated for its
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
            </div> */}

              <div class="new-desti-card">
                <img
                  src="/assets/images/i-destination/bali.webp"
                  alt="Bali"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div class="p-4">
                  <div class="header">
                    <h2>Bali</h2>
                    <div className="share-area">
                      <span class="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
                      </Link>
                    </div>
                  </div>
                  <div class="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div class="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div class="price-section">
                    <div class="price-info">
                      <p class="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p class="new-price">₹150,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
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

            {/* <div className="national-features">
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/i-destination/thailand.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Thailand</h3>
                    <p>
                      Thailand is a vibrant destination, famous for its
                      beautiful beaches, rich culture, and lively street life,
                      perfect for adventure seekers.
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
            </div> */}


             <div class="new-desti-card ">
                <img
                  src="/assets/images/i-destination/thailand.webp"
                  alt="Bali"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div class="p-4">
                  <div class="header">
                    <h2>Thailand</h2>
                    <div className="share-area">
                      <span class="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
                      </Link>
                    </div>
                  </div>
                  <div class="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div class="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div class="price-section">
                    <div class="price-info">
                      <p class="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p class="new-price">₹150,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            {/* <div className="national-features mt-2">
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/i-destination/malaysia.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Malaysia</h3>
                    <p>
                      Malaysia is a diverse country, known for its stunning
                      rainforests, vibrant cities, and rich cultural heritage,
                      offering a unique experience for every traveler.
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
            </div> */}

              <div class="new-desti-card mt-2">
                            <img
                              src="/assets/images/i-destination/singapore.webp"
                              alt="Singapore"
                              loading="lazy"
                              width="400"
                              height="250"
                            />
                            <div class="p-4">
                              <div class="header">
                                <h2>Singapore</h2>
                                <div className="share-area">
                                  <span class="duration-badge">4N/5D</span>
                                  <Link href="#">
                                    <img
                                      src="/assets/images/icons/share.png"
                                      alt="share icon"
                                    />
                                  </Link>
                                </div>
                              </div>
                              <div class="location">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  stroke="none"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                                </svg>
                                <span> Kintamani • Ubud • Tanjung Benoa</span>
                              </div>
                              <div class="icons" aria-label="Travel icons">
                                <ul className="amenities-icons">
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon1.png"></img>
                                  </li>
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon2.png"></img>
                                  </li>
            
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon6.png"></img>
                                  </li>
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon3.png"></img>
                                  </li>
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon5.png"></img>
                                  </li>
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon9.png"></img>
                                  </li>
            
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon10.png"></img>
                                  </li>
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon11.png"></img>
                                  </li>
            
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon12.png"></img>
                                  </li>
            
                                  <li>
                                    <img src="/assets/images/icons/amenities/icon8.png"></img>
                                  </li>
                                </ul>
                              </div>
                              <div class="price-section">
                                <div class="price-info">
                                  <p class="old-price">
                                    Starting from <span className="oldcut">₹180,000</span>
                                  </p>
                                  <p class="new-price">₹150,000</p>
                                  <p class="price-desc">per person on twin sharing </p>
                                </div>
                                <Link href="#">View Package</Link>
                              </div>
                            </div>
              </div>

                  <div class="new-desti-card mt-2">
                <img
                  src="/assets/images/i-destination/malaysia.webp"
                  alt="malaysia"
                  loading="lazy"
                  width="400"
                  height="250"
                />
                <div class="p-4">
                  <div class="header">
                    <h2>Malaysia</h2>
                    <div className="share-area">
                      <span class="duration-badge">4N/5D</span>
                      <Link href="#">
                        <img
                          src="/assets/images/icons/share.png"
                          alt="share icon"
                        />
                      </Link>
                    </div>
                  </div>
                  <div class="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                    <span> Kintamani • Ubud • Tanjung Benoa</span>
                  </div>
                  <div class="icons" aria-label="Travel icons">
                    <ul className="amenities-icons">
                      <li>
                        <img src="/assets/images/icons/amenities/icon1.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon2.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon6.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon3.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon5.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon9.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon10.png"></img>
                      </li>
                      <li>
                        <img src="/assets/images/icons/amenities/icon11.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon12.png"></img>
                      </li>

                      <li>
                        <img src="/assets/images/icons/amenities/icon8.png"></img>
                      </li>
                    </ul>
                  </div>
                  <div class="price-section">
                    <div class="price-info">
                      <p class="old-price">
                        Starting from <span className="oldcut">₹180,000</span>
                      </p>
                      <p class="new-price">₹150,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="#">View Package</Link>
                  </div>
                </div>
              </div>
            {/* <div className="national-features mt-2 mobile-none">
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/i-destination/singapore.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Singapore</h3>
                    <p>
                      Singapore is a tropical paradise, renowned for its stunning
                      beaches, vibrant culture, and lush landscapes, perfect for
                      relaxation and adventure.
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
            </div> */}
           
          </div>
        </div>
      </section>

      <section className="international-banner banner-sections ptb-80 mobile-none">
        <div className="container">
          <div className="banner-section">
            <div className="banner-content">
              <p className="i-para">Strengthen collaborations with</p>
              <h1 className="pacifico-regular">Executive Getaway</h1>
              <p className="i-para1">And get exciting offers</p>
            </div>
            <div className="con-ctabx">
              <button className="btn btn-primary1" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">Request A Callback</button>
            </div>
          </div>
        </div>
      </section>


      

      <section className="destination-row d-none">
        <div className="container">
          <div className="national-list-bx pb-80">
            <div className="national-features">
              <Link href="#">
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
                      beautiful beaches, rich culture, and lively street life,
                      perfect for adventure seekers.
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
                      Malaysia is a diverse country, known for its stunning
                      rainforests, vibrant cities, and rich cultural heritage,
                      offering a unique experience for every traveler.
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
                      Bali is a tropical paradise, renowned for its stunning
                      beaches, vibrant culture, and lush landscapes, perfect for
                      relaxation and adventure.
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
              <Link href="#">
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
                      beautiful beaches, rich culture, and lively street life,
                      perfect for adventure seekers.
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
                      Malaysia is a diverse country, known for its stunning
                      rainforests, vibrant cities, and rich cultural heritage,
                      offering a unique experience for every traveler.
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
        </div>
      </section>
    </div>
  );
}
