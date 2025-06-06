import React from "react";
import Link from "next/link";
export default function Destination() {
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
          <div className="national-list-bx">
            {/* <div className="national-features">
              <Link href="/family/national-destination/kashmir">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/kashmir.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
                    <p>
                      Kashmir, known as “Paradise on Earth,” boasts breathtaking landscapes, serene lakes, and vibrant culture, offering a truly magical experience..

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
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/leh.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Kashmir</h2>
                    <div className="share-area">
                      <span class="duration-badge">4N/5D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                      Srinagar • Gulmarg • Pahalgam • Sonamarg
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
                    <Link href="/family/national-destination/kashmir">View Package</Link>
                  </div>
                </div>
              </div>




            {/* <div className="national-features">
              <Link href="/family/national-destination/leh-laddakh">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/leh.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Leh Ladakh</h3>
                    <p>
                      Leh-Ladakh, where rugged mountains meet serene monasteries, is an adventure lover’s paradise and a tranquil escape for the soul.
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

             <div class="new-desti-card">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/leh.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Leh Ladakh</h2>
                    <div className="share-area">
                      <span class="duration-badge">3N/4D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                     Leh • Pangong
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p class="new-price">₹40,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/leh-laddakh">View Package</Link>
                  </div>
                </div>
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

            {/* <div className="national-features">
              <Link href="/family/national-destination/manali">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/manali.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Manali</h3>
                    <p>
                       Manali, a captivating hill station, offers snow-capped peaks, lush valleys, and thrilling adventure sports, making it the perfect blend of beauty and excitement.
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
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/manali.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Manali</h2>
                    <div className="share-area">
                      <span class="duration-badge">3N/4D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                     Manali-Solang • Atal Tunnel • Manali - Manikaran
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p class="new-price">₹40,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/manali">View Package</Link>
                  </div>
                </div>
              </div>

            {/* <div className="national-features mt-2">
              <Link href="/family/national-destination/shimla">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/shimla.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Shimla</h3>
                    <p>
                      Shimla and Manali are picturesque hill stations, offering scenic landscapes, adventure activities, and a refreshing escape into the mountains. Both are perfect for nature lovers and thrill-seekers alike.
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

            <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/shimla.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Shimla</h2>
                    <div className="share-area">
                      <span class="duration-badge">3N/4D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                     Shimla  • Kufri • Mashobra - Naldehra
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
                        Starting from <span className="oldcut">₹60,000</span>
                      </p>
                      <p class="new-price">₹40,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/shimla">View Package</Link>
                  </div>
                </div>
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

            {/* <div className="national-features mt-2">
              <Link href="/family/national-destination/shimla-manali">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/shimla&manali.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Shimla & Manali</h3>
                    <p>
                       Shimla and Manali are picturesque hill stations, offering scenic landscapes, adventure activities, and a refreshing escape into the mountains. Both are perfect for nature lovers and thrill-seekers alike.
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
                      <img /> <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div> */}


            {/* <div className="national-features mt-2">
              <Link href="/family/national-destination/dharamshala">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/dharamshala.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Dharamshala</h3>
                    <p>
                       Dharamshala, nestled in the Himachal Pradesh hills, is known for its Tibetan culture, serene landscapes, and peaceful atmosphere, making it a perfect destination for spiritual retreats 
                       and nature lovers.

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


            <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/dharamshala.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Dharamshala</h2>
                    <div className="share-area">
                      <span class="duration-badge">3N/4D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                     Dharmshala McLeod Ganj & Dalhousie
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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/dharamshala">View Package</Link>
                  </div>
                </div>
            </div>

            



              <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/dehradun.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Dehradun</h2>
                    <div className="share-area">
                      <span class="duration-badge">4N/5D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                     Dehradun & Mussoorie
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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/dehradun">View Package</Link>
                  </div>
                </div>
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


           
          </div>
        </div>
      </section>

      {/* ================== CTA ================== */}
      <section className="banner-sections ptb-40-30 ptb-80">
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
      <section className="destination-row ">
        <div className="container">
          <div className="national-list-bx pb-80">
              
              <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/shimla&manali.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Nanital</h2>
                    <div className="share-area">
                      <span class="duration-badge">3N/4D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                     Nanital
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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/nanital">View Package</Link>
                  </div>
                </div>
              </div>

               <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/img2.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Goa</h2>
                    <div className="share-area">
                      <span class="duration-badge">2N/3D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                     North Goa •South Goa
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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/goa">View Package</Link>
                  </div>
                </div>
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

         

            {/* <div className="national-features">
              <Link href="/family/national-destination/goa">
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
                      Kashmir is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
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

              <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/img3.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/kashmir.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Jim Corbett </h2>
                    <div className="share-area">
                      <span class="duration-badge">3N/4D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                    Jim Corbett

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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/jim-corbett">View Package</Link>
                  </div>
                </div>
              </div>


            {/* <div className="national-features mt-2">
              <Link href="/family/national-destination/jim-corbett">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Jim Corbett </h3>
                    <p>
                      Jim Corbett is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
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

             <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/img4.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/img3.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Jaipur</h2>
                    <div className="share-area">
                      <span class="duration-badge">2N/3D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                     Jaipur

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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/jaipur">View Package</Link>
                  </div>
                </div>
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
            
          

             <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/img2.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/img3.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2> North Sikkim</h2>
                    <div className="share-area">
                      <span class="duration-badge">3N/4D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                    
                     Darjeeling

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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/north-sikkim">View Package</Link>
                  </div>
                </div>
              </div>

            {/* <div className="national-features mt-2">
              <Link href="/family/national-destination/north-sikkim">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>North Sikkim</h3>
                    <p>
                      North Sikkim is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
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


              <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/img4.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/img3.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2> Lonavala & Khandala</h2>
                    <div className="share-area">
                      <span class="duration-badge">3N/4D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                    
                     Lonavala and Khandala


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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/lonavala-khandala">View Package</Link>
                  </div>
                </div>
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


            
              <div class="new-desti-card mt-2">
                  <div className="desti-img-wrapper">
                  <div className="desti-img change-hover">
                    <img
                      src="/assets/images/n-destination/img4.webp"
                      alt="National Destination"
                    />
                  </div>
                  <div className="desti-img dual-change-hover">
                    <img
                      src="/assets/images/n-destination/img1.webp"
                      alt="National Destination"
                    />
                  </div>
                </div>
                <div class="p-4">
                  <div class="header">
                    <h2>Andaman</h2>
                    <div className="share-area">
                      <span class="duration-badge">4N/5D</span>
                      <Link href="#" >
                        <img src="/assets/images/icons/share.png" alt="share icon"/>
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
                    
                     Port Blair  • Havelock Island and Neil Island


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
                        Starting from <span className="oldcut">₹70,000</span>
                      </p>
                      <p class="new-price">₹45,000</p>
                      <p class="price-desc">per person on twin sharing </p>
                    </div>
                    <Link href="/family/national-destination/andaman">View Package</Link>
                  </div>
                </div>
              </div>
    
              
          </div>
        </div>
      </section>
    </>
  );
}
