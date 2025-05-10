import React from "react";
import Topbar from "../../../components/header/Header";
import Offcanvas from "../../../components/header/Offcanvas";
import Link from "next/link";
import Footer from "../../../components/footer/Footer";
import TravelerReviews from "../../../components/kashmir/TravelerReviews";
import Map from "../../../components/kashmir/Map";
import Popup from "../../../components/corporate/Popup";

export default function Jaipur() {
  return (
    <div className="bg-prime">
      <Topbar />
      <Offcanvas />

      {/* --------------- Hero start -------------------- */}
      <section className="kashmir-hero">
        <div className="container">
          <div className="row align-items-center pt-200">
            <div className="col-md-12 about-contennt">
              <h2 className="fs-64 text-white fw-bold">
                The heaven of earth, Jaipur
              </h2>
              <p>
                Plan your trips, honeymoons, or family getaways with
                Tourwatchout! Enjoy a hassle-free experience and create
                unforgettable memories that last a lifetime.
              </p>
              <button
                className="btn btn-primary mt-0 mobile-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalCenter"
                fdprocessedid="s6df8j"
              >
                Start Your Journey Now
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* --------------- Hero end -------------------- */}

      {/* ------------------------- Kashmir Tour Package start -------------------------------- */}

      <section className="destination-row ptb-50">
        <div className="container">
          <div className="parent-package w-100" id="package">
            <div className="max-800">
              <div className="content-section">
                <h1>Jaipur Family Tour Package</h1>
              </div>

              <div className="tour-package pt-80">
                <ul
                  className="nav nav-pills mb-3"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item first-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-basic-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-basic"
                      type="button"
                      role="tab"
                      aria-controls="pills-basic"
                      aria-selected="true"
                    >
                      Basic
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-standard-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-standard"
                      type="button"
                      role="tab"
                      aria-controls="pills-standard"
                      aria-selected="false"
                    >
                      Standard
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-premium-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-premium"
                      type="button"
                      role="tab"
                      aria-controls="pills-premium"
                      aria-selected="false"
                    >
                      Premium
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <Link
                      href="#traveler-reviews"
                      className="rev-btn nav-link"
                      type="button"
                      id="review"
                    >
                      Reviews
                    </Link>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  {/* ------------------ Basic ------------------- */}
                  <div
                    className="tab-pane fade show active"
                    id="pills-basic"
                    role="tabpanel"
                    aria-labelledby="pills-basic-tab"
                    tabIndex="0"
                  >
                    <div className="basic-hotel-features">
                      <div className="feature-media mobile-none">
                        <video
                          id="videoPlayer"
                          src="/assets/images/kashmir/video.mp4"
                          muted
                          autoPlay
                          loop
                          playsInline
                        ></video>
                        <button id="playButton" className="play-btn"></button>
                      </div>
                      <div className="feature-list">
                        <ul className="location-list">
                          {/* <li className="list-item-none">(4 Night 5 Days )</li> */}
                          <li className="locaton-items">
                            <img
                              src="/assets/images/kashmir/icons/pin.png"
                              alt="Location Icon"
                            />{" "}
                            Jaipur
                          </li>
                        </ul>
                        <ul className="features-lists">
                          <li>
                            <img
                              src="/assets/images/icons/hotel.png"
                              alt="Hotel Icon"
                            />
                            <span>Hotel</span> : 3* Deluxe
                          </li>

                          <li>
                            <img
                              src="/assets/images/icons/pax.png"
                              alt="pax Icon"
                            />
                            <span>No of Pax</span> : 2 adults & 1 child (Below 5
                            yrs)
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/transferes.png"
                              alt="transfer Icon"
                            />
                            <span>Transfers</span> : Sedan
                          </li>

                          <li>
                            <img
                              src="/assets/images/icons/meal.png"
                              alt="meals Icon"
                            />
                            <span>Meals</span> : Breakfast
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/duration.png"
                              alt="duration Icon"
                            />
                            <span>Duration</span> : 2N 3D
                          </li>
                        </ul>
                        <button
                          className="btn btn-primary1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j"
                        >
                          Request A Callback
                        </button>
                      </div>
                    </div>

                    {/* ------=--------------------- time in tabs ===================== */}

                    <section className="time-schedule-section ">
                      <div className="container">
                        <div className="schedule-list">
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 1</p>
                            <div>
                              <h3>Arrival At Jaipur & Local Sightseeing</h3>
                              <p className="sche-details">
                                Upon your arrival at Jaipur airport/railway
                                station. After rest cover sightseeing like -
                                City Palace, Jantar Mantar, Hawa Mahal, Jal
                                Mahal and Amer Fort. In the evening visit
                                Chaukhi Dhani, the traditional Heritage ethnic
                                village and then back to hotel for overnight
                                stay
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 2</p>

                            <div>
                              <h3>Jaipur Local Tour</h3>
                              <p className="sche-details">
                                After breakfast enjoy the visit Jaigarh Fort,
                                Nahargarh Fort along with City Museum and Birla
                                Temple. You can also enjoy the famous Rawat Ki
                                Kachori and Lassi of Jaipur and visit local
                                market to shop around. In the evening back to
                                Hotel and overnight stay at hotel
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 3</p>
                            <div>
                              <h3> Jaipur & Depature</h3>
                              <p className="sche-details">
                                Morning after your breakfast, pack your luggage
                                our driver will drop you at Jaipur
                                Airport/Railwaystation/Bus stop
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="cancellation-policy-bx">
                          <Link href="#">*Cancellation Policy</Link>
                          <button
                            className="btn btn-primary1"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalCenter"
                            fdprocessedid="s6df8j"
                          >
                            Request A Callback
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* ------=--------------------- time in tabs ===================== */}
                  </div>
                  {/* ------------------ Basic ------------------- */}

                  {/* ------------------ Standard ------------------- */}
                  <div
                    className="tab-pane fade"
                    id="pills-standard"
                    role="tabpanel"
                    aria-labelledby="pills-standard-tab"
                    tabIndex="0"
                  >
                    <div className="basic-hotel-features">
                      <div className="feature-media mobile-none">
                        <video
                          id="videoPlayer"
                          src="/assets/images/kashmir/video.mp4"
                          muted
                          autoPlay
                          loop
                          playsInline
                        ></video>
                        <button id="playButton" className="play-btn"></button>
                      </div>
                      <div className="feature-list">
                        <ul className="location-list">
                          <li className="locaton-items">
                            <img
                              src="/assets/images/kashmir/icons/pin.png"
                              alt="Location Icon"
                            />{" "}
                            Jaipur & Udaipur
                          </li>
                        </ul>
                        <ul className="features-lists">
                          <li>
                            <img
                              src="/assets/images/icons/hotel.png"
                              alt="Hotel Icon"
                            />
                            <span>Hotel</span> : 3* Premium
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/pax.png"
                              alt="pax Icon"
                            />
                            <span>No of Pax</span> : 02 Adults & 01 Child (Below
                            5 yrs)
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/transferes.png"
                              alt="transfer Icon"
                            />
                            <span>Transfers</span> : Sedan (Railway Station / Airport)
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/meal.png"
                              alt="meals Icon"
                            />
                            <span>Meals</span> : Breakfast and Dinner
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/duration.png"
                              alt="duration Icon"
                            />
                            <span>Duration</span> : 4N 5D
                          </li>
                        </ul>
                        <button
                          className="btn btn-primary1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j"
                        >
                          Request A Callback
                        </button>
                      </div>
                    </div>

                    {/* ------=--------------------- time in tabs ===================== */}

                    <section className="time-schedule-section ">
                      <div className="container">
                        <div className="schedule-list">
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 1</p>
                            <div>
                              <h3>
                                 Arrival in Jaipur & Pink City Exploration
                              </h3>
                              <p className="sche-details">
                                Arrive at Jaipur Airport (JAI) or Railway Station.Check into your hotel.City Palace, a grand palace complex with museums and courtyards.Visit Hawa Mahal (Palace of Winds), a unique structure with numerous windows offering views of the street below.
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 2</p>
                            <div>
                              <h3>
                                Amber Fort & Jaipur Sightseeing
                              </h3>
                              <p className="sche-details">
                                 Take an elephant ride or jeep ride up to Amber Fort, a historic fort on a hill. Explore the fort's intricate courtyards, palaces, and galleries.Visit Jal Mahal (Water Palace), a palace situated in the middle of a lake.
                                 Evening: Explore the local markets, such as Bapu Bazaar or Johri Bazaar, for shopping and street food. 
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 3</p>
                            <div>
                              <h3>
                                {" "}
                                Travel to Udaipur & City Palace
                              </h3>
                              <p className="sche-details">
                                 Depart from Jaipur for Udaipur. The journey is around 6-7 hours by road. Check into your hotel in Udaipur.Explore the City Palace, a sprawling complex on the banks of Lake Pichola, with various courtyards, palaces, and museums.
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 4</p>
                            <div>
                              <h3>
                                Udaipur Sightseeing
                               </h3>
                              <p className="sche-details">
                                Take a boat ride on Lake Pichola for a scenic view of the city and the surrounding hill. Visit Saheliyon-Ki-Bari, a beautiful garden with fountains, pavilions, and musical instruments.Explore the local markets in Udaipur, such as the old city market or the Bada Bazaar. 
                              </p>
                            </div>
                          </div>


                          <div className="schedule-items">
                            <p className="schedule-timing">Day 5</p>
                            <div>
                              <h3>
                                Departure
                               </h3>
                              <p className="sche-details">
                                 Enjoy breakfast and do some last-minute souvenir shopping. Depart from Udaipur Airport (IDR) or Railway Station. 
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="cancellation-policy-bx">
                          <Link href="#">*Cancellation Policy</Link>
                          <button
                            className="btn btn-primary1"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalCenter"
                            fdprocessedid="s6df8j"
                          >
                            Request A Callback
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* ------=--------------------- time in tabs ===================== */}
                  </div>
                  {/* ------------------ Standard ------------------- */}

                  {/* ------------------ Premium ------------------- */}

                  <div
                    className="tab-pane fade"
                    id="pills-premium"
                    role="tabpanel"
                    aria-labelledby="pills-premium-tab"
                    tabIndex="0"
                  >
                    <div className="basic-hotel-features">
                      <div className="feature-media mobile-none">
                        <video
                          id="videoPlayer"
                          src="/assets/images/kashmir/video.mp4"
                          muted
                          loop
                          playsInline
                        ></video>
                        <button id="playButton" className="play-btn"></button>
                      </div>
                      <div className="feature-list">
                        <ul className="location-list">
                          {/* <li className="list-item-none">(6 Night 7 Days )</li> */}
                          <li className="locaton-items">
                            <img
                              src="/assets/images/kashmir/icons/pin.png"
                              alt="Location Icon"
                            />{" "}
                            Jaipur & Udaipur
                          </li>
                        </ul>
                        <ul className="features-lists">
                          <li>
                            <img
                              src="/assets/images/icons/hotel.png"
                              alt="Hotel Icon"
                            />
                            <span>Hotel</span> : 4*
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/pax.png"
                              alt="pax Icon"
                            />
                            <span>No of Pax</span> : 02 Adults & 02 Childs
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/transferes.png"
                              alt="transfer Icon"
                            />
                            <span>Transfers</span> : Sedan (Railway station / Airport)
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/meal.png"
                              alt="meals Icon"
                            />
                            <span>Meals</span> : Breakfast and Dinner
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/duration.png"
                              alt="duration Icon"
                            />
                            <span>Duration</span> : 4N 5D
                          </li>
                        </ul>
                        <button
                          className="btn btn-primary1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j"
                        >
                          Request A Callback
                        </button>
                      </div>
                    </div>

                    {/* ------=--------------------- time in tabs ===================== */}

                    <section className="time-schedule-section ">
                      <div className="container">
                        <div className="schedule-list">
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 1</p>
                            <div>
                              <h3>
                                Arrival in Jaipur & Pink City Exploration
                              </h3>
                              <p className="sche-details">
                                Arrive at Jaipur Airport (JAI) or Railway Station.Check into your hotel.City Palace, a grand palace complex with museums and courtyards.Visit Hawa Mahal (Palace of Winds), a unique structure with numerous windows offering views of the street below.
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 2</p>
                            <div>
                              <h3>
                                Amber Fort & Jaipur Sightseeing
                              </h3>
                              <p className="sche-details">
                              Take an elephant ride or jeep ride up to Amber Fort, a historic fort on a hill. Explore the fort's intricate courtyards, palaces, and galleries.Visit Jal Mahal (Water Palace), a palace situated in the middle of a lake.
                              Evening: Explore the local markets, such as Bapu Bazaar or Johri Bazaar, for shopping and street food. 
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 3</p>
                            <div>
                              <h3>
                                 Travel to Udaipur & City Palace
                              </h3>
                              <p className="sche-details">
                                 Depart from Jaipur for Udaipur. The journey is around 6-7 hours by road. Check into your hotel in Udaipur.Explore the City Palace, a sprawling complex on the banks of Lake Pichola, with various courtyards, palaces, and museums.
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">Day 4</p>
                            <div>
                              <h3>
                                 Udaipur Sightseeing
                              </h3>
                              <p className="sche-details">
                              Take a boat ride on Lake Pichola for a scenic view of the city and the surrounding hill. Visit Saheliyon-Ki-Bari, a beautiful garden with fountains, pavilions, and musical instruments.Explore the local markets in Udaipur, such as the old city market or the Bada Bazaar. 
                              </p>
                            </div>
                          </div>

                          <div className="schedule-items">
                            <p className="schedule-timing">Day 5</p>
                            <div>
                              <h3>
                                Departure
                              </h3>
                              <p className="sche-details">
                              Enjoy breakfast and do some last-minute souvenir shopping. Depart from Udaipur Airport (IDR) or Railway Station.  
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="cancellation-policy-bx">
                          <Link href="#">*Cancellation Policy</Link>
                          <button
                            className="btn btn-primary1"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalCenter"
                            fdprocessedid="s6df8j"
                          >
                            Request A Callback
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* ------=--------------------- time in tabs ===================== */}
                  </div>
                  {/* ------------------ Premium ------------------- */}
                </div>
              </div>
            </div>
            <div className="max-400 mobile-none">
              <h2>
                {" "}
                Table <br />
                of contents
              </h2>
              <div className="table-contents">
                <Link href="#package">Jaipur Packages</Link>

                <Link href="#about-us">About Jaipur</Link>

                <Link href="#headingTwo">Jaipur Bucket List</Link>

                <Link href="#headingThree">Jaipur FAQ’s </Link>

                <Link href="#location">Jaipur Location</Link>

                <Link href="#traveler-reviews">Trip Reviews</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ------------------------- Kashmir Tour Package end -------------------------------- */}

      {/* ==================================== Moibile-things ================================= */}
      <section className="onlyl-mobile desktop-none">
        <div className="container">
          <div className="table-of-row tour-package">
            <div className="feature-media ">
              <video
                id="videoPlayer"
                src="/assets/images/kashmir/video.mp4"
                muted
                loop
                playsInline
              ></video>
              <button id="playButton" className="play-btn"></button>
            </div>

            <div className="max-400 ">
              <h2>
                {" "}
                Table <br />
                of contents
              </h2>
              <div className="table-contents">
                <Link href="#package">Jaipur Packages</Link>

                <Link href="#about-us">About Jaipur</Link>

                <Link href="#headingTwo">Jaipur Bucket List</Link>

                <Link href="#headingThree">Jaipur FAQ’s </Link>

                <Link href="#location">Jaipur Location</Link>

                <Link href="#traveler-reviews">Trip Reviews</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ==================================== Moibile-things ================================= */}

      {/* ---------------------------------- CTa ----------------------- */}

      <section className="banner-sections bg-prime ptb-10">
        <div className="container">
          <div className="banner-section">
            <div className="banner-content">
              <p>Visit the Paradise of earth</p>
              <h1 className="pacifico-regular">Kashmir</h1>
              <p>And get exciting offers</p>

              <button
                className="btn btn-primary1 desktop-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalCenter"
                fdprocessedid="s6df8j"
              >
                Start Journey Now
              </button>
            </div>
            <div className="con-ctabx">
              <button
                className="btn btn-primary1 mobile-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalCenter"
                fdprocessedid="s6df8j"
              >
                Start Journey Now
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------------------------- CTa ----------------------- */}

      {/* ------------------------------  About Start ---------------------- */}
      <section className="about-kashmir bg-prime">
        <div className="container">
          <div className="about-boxes pt-20">
            <div className="accordion " id="accordionExample">
              <div className="accordion-item" id="about-us">
                <h2 className="accordion-header bg-prime" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    About Jaipur
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body bg-prime">
                    <div className="about-items">
                      <p>
                        Jaipur, often referred to as "Paradise on Earth,"
                        is a breathtaking region nestled in the northern part of
                        the Indian subcontinent. Renowned for its stunning
                        natural beauty, Jaipur is characterized by its
                        majestic mountains, lush valleys, and serene lakes,
                        making it a dream destination for travelers and nature
                        enthusiasts alike.
                      </p>
                    </div>
                    <div className="about-items">
                      <h2>Natural Wonders</h2>
                      <p>
                        The landscape of Kashmir is a tapestry of vibrant colors
                        and diverse ecosystems. The famous Dal Lake, with its
                        iconic houseboats and shikaras (traditional wooden
                        boats), offers a tranquil escape where visitors can
                        enjoy the serene waters surrounded by the majestic
                        Himalayas. The valley is adorned with beautiful gardens,
                        such as the Mughal Gardens of Shalimar and Nishat, which
                        showcase the region's rich horticultural heritage.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Cultural Richness</h2>
                      <p>
                        Kashmir is not just about its stunning landscapes; it is
                        also a melting pot of cultures and traditions. The
                        region has a rich history influenced by various
                        civilizations, including Persian, Mughal, and Central
                        Asian cultures. This is reflected in its art,
                        architecture, and cuisine. Visitors can explore ancient
                        temples, mosques, and shrines that tell the story of
                        Kashmir's diverse heritage.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Culinary Delights</h2>
                      <p>
                        Kashmiri cuisine is a feast for the senses, known for
                        its unique flavors and aromatic spices. Dishes like
                        Rogan Josh, Yakhni, and Dum Aloo are must-tries, along
                        with the famous Wazwan, a traditional multi-course meal
                        that showcases the culinary skills of Kashmiri chefs.
                        The use of saffron, a prized spice grown in the region,
                        adds a distinctive touch to many dishes.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Adventure and Activities</h2>
                      <p>
                        For adventure seekers, Kashmir offers a plethora of
                        activities. From trekking in the breathtaking landscapes
                        of Sonamarg and Pahalgam to skiing in the winter
                        wonderland of Gulmarg, there is something for everyone.
                        The region is also ideal for river rafting, paragliding,
                        and camping, providing an adrenaline rush amidst
                        stunning backdrops.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Flora and Fauna</h2>
                      <p>
                        Kashmir is home to diverse flora and fauna, with several
                        national parks and wildlife sanctuaries. The Dachigam
                        National Park, for instance, is known for its population
                        of the endangered Hangul deer. Birdwatchers can delight
                        in spotting various migratory birds that flock to the
                        region during different seasons.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>A Year-Round Destination</h2>
                      <p>
                        Kashmir is a year-round destination, with each season
                        offering a unique experience. Spring brings blooming
                        tulips and vibrant gardens, summer offers pleasant
                        weather for exploration, autumn showcases stunning
                        foliage, and winter transforms the landscape into a
                        snowy paradise.
                      </p>
                    </div>

                    <div className="about-items">
                      <p>
                        In summary, Kashmir is a captivating destination that
                        enchants visitors with its natural beauty, rich culture,
                        and warm hospitality. Whether you seek adventure,
                        relaxation, or cultural immersion, Kashmir promises an
                        unforgettable experience that will linger in your heart
                        long after you leave.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header bg-prime" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Jaipur Bucket List
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body bg-prime">
                    <div className="about-items">
                      <p>
                        Kashmir, often referred to as "Paradise on Earth," is a
                        breathtaking region nestled in the northern part of the
                        Indian subcontinent. Renowned for its stunning natural
                        beauty, Kashmir is characterized by its majestic
                        mountains, lush valleys, and serene lakes, making it a
                        dream destination for travelers and nature enthusiasts
                        alike.
                      </p>
                    </div>
                    <div className="about-items">
                      <h2>Natural Wonders</h2>
                      <p>
                        The landscape of Kashmir is a tapestry of vibrant colors
                        and diverse ecosystems. The famous Dal Lake, with its
                        iconic houseboats and shikaras (traditional wooden
                        boats), offers a tranquil escape where visitors can
                        enjoy the serene waters surrounded by the majestic
                        Himalayas. The valley is adorned with beautiful gardens,
                        such as the Mughal Gardens of Shalimar and Nishat, which
                        showcase the region's rich horticultural heritage.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Cultural Richness</h2>
                      <p>
                        Kashmir is not just about its stunning landscapes; it is
                        also a melting pot of cultures and traditions. The
                        region has a rich history influenced by various
                        civilizations, including Persian, Mughal, and Central
                        Asian cultures. This is reflected in its art,
                        architecture, and cuisine. Visitors can explore ancient
                        temples, mosques, and shrines that tell the story of
                        Kashmir's diverse heritage.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Culinary Delights</h2>
                      <p>
                        Kashmiri cuisine is a feast for the senses, known for
                        its unique flavors and aromatic spices. Dishes like
                        Rogan Josh, Yakhni, and Dum Aloo are must-tries, along
                        with the famous Wazwan, a traditional multi-course meal
                        that showcases the culinary skills of Kashmiri chefs.
                        The use of saffron, a prized spice grown in the region,
                        adds a distinctive touch to many dishes.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Adventure and Activities</h2>
                      <p>
                        For adventure seekers, Kashmir offers a plethora of
                        activities. From trekking in the breathtaking landscapes
                        of Sonamarg and Pahalgam to skiing in the winter
                        wonderland of Gulmarg, there is something for everyone.
                        The region is also ideal for river rafting, paragliding,
                        and camping, providing an adrenaline rush amidst
                        stunning backdrops.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Flora and Fauna</h2>
                      <p>
                        Kashmir is home to diverse flora and fauna, with several
                        national parks and wildlife sanctuaries. The Dachigam
                        National Park, for instance, is known for its population
                        of the endangered Hangul deer. Birdwatchers can delight
                        in spotting various migratory birds that flock to the
                        region during different seasons.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>A Year-Round Destination</h2>
                      <p>
                        Kashmir is a year-round destination, with each season
                        offering a unique experience. Spring brings blooming
                        tulips and vibrant gardens, summer offers pleasant
                        weather for exploration, autumn showcases stunning
                        foliage, and winter transforms the landscape into a
                        snowy paradise.
                      </p>
                    </div>

                    <div className="about-items">
                      <p>
                        In summary, Kashmir is a captivating destination that
                        enchants visitors with its natural beauty, rich culture,
                        and warm hospitality. Whether you seek adventure,
                        relaxation, or cultural immersion, Kashmir promises an
                        unforgettable experience that will linger in your heart
                        long after you leave.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header bg-prime" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Jaipur FAQ’s?
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body bg-prime">
                    <div className="about-items">
                      <p>
                        Kashmir, often referred to as "Paradise on Earth," is a
                        breathtaking region nestled in the northern part of the
                        Indian subcontinent. Renowned for its stunning natural
                        beauty, Kashmir is characterized by its majestic
                        mountains, lush valleys, and serene lakes, making it a
                        dream destination for travelers and nature enthusiasts
                        alike.
                      </p>
                    </div>
                    <div className="about-items">
                      <h2>Natural Wonders</h2>
                      <p>
                        The landscape of Kashmir is a tapestry of vibrant colors
                        and diverse ecosystems. The famous Dal Lake, with its
                        iconic houseboats and shikaras (traditional wooden
                        boats), offers a tranquil escape where visitors can
                        enjoy the serene waters surrounded by the majestic
                        Himalayas. The valley is adorned with beautiful gardens,
                        such as the Mughal Gardens of Shalimar and Nishat, which
                        showcase the region's rich horticultural heritage.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Cultural Richness</h2>
                      <p>
                        Kashmir is not just about its stunning landscapes; it is
                        also a melting pot of cultures and traditions. The
                        region has a rich history influenced by various
                        civilizations, including Persian, Mughal, and Central
                        Asian cultures. This is reflected in its art,
                        architecture, and cuisine. Visitors can explore ancient
                        temples, mosques, and shrines that tell the story of
                        Kashmir's diverse heritage.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Culinary Delights</h2>
                      <p>
                        Kashmiri cuisine is a feast for the senses, known for
                        its unique flavors and aromatic spices. Dishes like
                        Rogan Josh, Yakhni, and Dum Aloo are must-tries, along
                        with the famous Wazwan, a traditional multi-course meal
                        that showcases the culinary skills of Kashmiri chefs.
                        The use of saffron, a prized spice grown in the region,
                        adds a distinctive touch to many dishes.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Adventure and Activities</h2>
                      <p>
                        For adventure seekers, Kashmir offers a plethora of
                        activities. From trekking in the breathtaking landscapes
                        of Sonamarg and Pahalgam to skiing in the winter
                        wonderland of Gulmarg, there is something for everyone.
                        The region is also ideal for river rafting, paragliding,
                        and camping, providing an adrenaline rush amidst
                        stunning backdrops.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>Flora and Fauna</h2>
                      <p>
                        Kashmir is home to diverse flora and fauna, with several
                        national parks and wildlife sanctuaries. The Dachigam
                        National Park, for instance, is known for its population
                        of the endangered Hangul deer. Birdwatchers can delight
                        in spotting various migratory birds that flock to the
                        region during different seasons.
                      </p>
                    </div>

                    <div className="about-items">
                      <h2>A Year-Round Destination</h2>
                      <p>
                        Kashmir is a year-round destination, with each season
                        offering a unique experience. Spring brings blooming
                        tulips and vibrant gardens, summer offers pleasant
                        weather for exploration, autumn showcases stunning
                        foliage, and winter transforms the landscape into a
                        snowy paradise.
                      </p>
                    </div>

                    <div className="about-items">
                      <p>
                        In summary, Kashmir is a captivating destination that
                        enchants visitors with its natural beauty, rich culture,
                        and warm hospitality. Whether you seek adventure,
                        relaxation, or cultural immersion, Kashmir promises an
                        unforgettable experience that will linger in your heart
                        long after you leave.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ------------------------------  About end ---------------------- */}

      {/* --------------------------- Map Area ------------------------ */}
      <Map />
      {/* --------------------------- Map Area ------------------------ */}

      {/* ------------------------------ traveler Reviews Start------------------------------- */}
      <TravelerReviews />
      {/* ------------------------------ traveler Reviews Start------------------------------- */}

      <Popup />

      <Footer />
    </div>
  );
}
