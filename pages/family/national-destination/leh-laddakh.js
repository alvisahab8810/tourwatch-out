import React from "react";

import Topbar from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import TravelerReviews from "../../../components/kashmir/TravelerReviews";
import Map from "../../../components/kashmir/Map";
import Link from "next/link";
import Popup from "../../../components/corporate/Popup";
import Offcanvas from "../../../components/header/Offcanvas";

export default function LehLaddakh() {

  
  return (
    <div className="bg-prime">
      <Topbar />
      <Offcanvas/>
      {/* --------------- Hero start -------------------- */}
      <section className="kashmir-hero">
        <div className="container">
          <div className="row align-items-center pt-200">
            <div className="col-md-12 about-contennt">
              <h2 className="fs-64 text-white fw-bold">
                The heaven of earth, Leh
              </h2>
              <p>
                Plan your trips, honeymoons, or family getaways with
                Tourwatchout! Enjoy a hassle-free experience and create
                unforgettable memories that last a lifetime.
              </p>
              <button className="btn btn-primary mt-0 mobile-none" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">
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
                <h1>Leh Ladakh Family Package</h1>
                {/* <ul className="location-list">
                  <li className="list-item-none">(7 Days)</li>
                  <li className="locaton-items">
                    <img
                      src="/assets/images/kashmir/icons/pin.png"
                      alt="Location Icon"
                    />{" "}
                    Srinagar • Gulmarg • Pahalgam • Sonamarg
                  </li>
                </ul> */}
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
                          Leh • Pangong
                      </li>
                    </ul>
                        <ul className="features-lists">
                          <li>
                           <img src="/assets/images/icons/hotel.png" alt="Hotel Icon"/>
                            <span>Hotel</span> : 3* Deluxe
                          </li>

                          <li>
                            <img src="/assets/images/icons/pax.png" alt="pax Icon"/>
                            <span>No of Pax</span> : 2 adults & 1 child (Below 5 yrs)
                          </li>
                          <li>
                           <img src="/assets/images/icons/transferes.png" alt="transfer Icon"/>

                            <span>Transfers</span> : Included (Scorpio/Xylo/Innova)
                          </li>
                        
                          <li>
                          <img src="/assets/images/icons/meal.png" alt="meals Icon"/>

                            <span>Meals</span> : Daily Breakfast  Only
                          </li>
                          <li>
                          <img src="/assets/images/icons/duration.png" alt="duration Icon"/>

                            <span>Duration</span> : 3N 4D
                          </li>
                          {/* <li>
                            <span>Photos & Videos</span> : Included
                          </li>
                          <li>
                            <span>DJ Nights </span> : Included{" "}
                          </li> */}
                        </ul>
                        <button className="btn btn-primary1" data-bs-toggle="modal"
                        data-bs-target="#exampleModalCenter"
                         fdprocessedid="s6df8j">
                          Request A Callback
                        </button>
                      </div>
                    </div>


                    {/* ------=--------------------- time in tabs ===================== */}

                    <section className="time-schedule-section ">
                      <div className="container">
                        <div className="schedule-list">
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 1
                            </p>
                           <div>
                           <h3>Leh Airport Pickup and Acclimate</h3>
                            <p className="sche-details">
                               Arrival at Leh airport and transfer to your pre-booked Hotel. Complete day rest for acclimatize
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                           
                              Day 2
                            </p>
                           <div>
                           <h3>Sham Valley Excursion Upto Sangam</h3>
                            <p className="sche-details">
                              Breakfast and head out for Hall of Fame, Gurudwara Pather Sahib, Magnetic Hill, Sangam Point. Visit Shanti Stupa & Leh Market Place
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 3
                            </p>
                           <div>
                           <h3>Leh - Pangong Excursion Lake -Leh</h3>
                            <p className="sche-details">
                               Breakfast and leave for Pangong lake through Changla Pass. Visit throughout few small villages for sudden view of the Pangong lake. Evenin return Leh.
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                         
                              Day 4
                            </p>
                           <div>
                           <h3>Leh - Airport Drop</h3>
                            <p className="sche-details">
                              Breakfast and transferred to leh Airport. Return Home with Everlasting memories 
                            </p>
                           </div>
                          </div>
                          
                        </div>
                        <div className="cancellation-policy-bx">
                          <Link href="#">*Cancellation Policy</Link>
                          <button className="btn btn-primary1" data-bs-toggle="modal"
                                  data-bs-target="#exampleModalCenter"
                                  fdprocessedid="s6df8j">Request A Callback</button>
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
                         Leh • Nubra Valley  • Pangong  • Khardungla  • Turtuk
                      </li>
                    </ul>
                        <ul className="features-lists">
                          <li>
                            <img src="/assets/images/icons/hotel.png" alt="Hotel Icon"/>
                            <span>Hotel</span> : 3* Premium
                          </li>
                          <li>
                           <img src="/assets/images/icons/pax.png" alt="pax Icon"/>
                            <span>No of Pax</span> : 2 adults & 1 child (Below 5 yrs)
                          </li>
                          <li>
                            <img src="/assets/images/icons/transferes.png" alt="transfer Icon"/>
                            <span>Transfers</span> : Included (Srinagar - Srinagar)
                          </li>
                          <li>
                            <img src="/assets/images/icons/meal.png" alt="meals Icon"/>
                            <span>Meals</span> : Daily Breakfast  Only
                          </li>
                          <li>
                            <img src="/assets/images/icons/duration.png" alt="duration Icon"/>
                            <span>Duration</span> : 6N 7D
                          </li>
                        
                        </ul>
                        <button className="btn btn-primary1" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">
                          Request A Callback
                        </button>
                      </div>
                    </div>


                     {/* ------=--------------------- time in tabs ===================== */}

                     <section className="time-schedule-section ">
                      <div className="container">
                        <div className="schedule-list">
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 1
                            </p>
                            <div>
                            <h3>Leh Airport Pickup and Acclimate</h3>
                            <p className="sche-details">
                            Arrival at Leh airport and transfer to your pre-booked Hotel. Complete day rest for acclimatize
                            </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                            
                              Day 2
                            </p>
                            <div>
                            <h3>Sham Valley Excursion Upto Sangam</h3>
                            <p className="sche-details">
                               Breakfast and head out for Hall of Fame, Gurudwara Pather Sahib, Magnetic Hill, Sangam Point. Visit Shanti Stupa & Leh Market Place
                            </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                           
                              Day 3
                            </p>
                            <div>
                            <h3>Leh - Nubra via Khardung la -Nubra</h3>
                            <p className="sche-details">
                               Breakfast and drive to Nubra Valley via Khardungla Pass. On arrival do check-in in pre-booked hotel or camp. 
                            </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                              
                              Day 4
                            </p>
                           <div>
                           <h3>Nubra - Turtuk -Nubra (Zero Point)</h3>
                            <p className="sche-details">
                            Breakfast and leave for Turtuk. You will cover Seightseeing like Shyok River Valley . In the evening return back to Nubra. 
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 5
                            </p>
                            <div>
                            <h3>Nubra - Pangong</h3>
                            <p className="sche-details">
                                After an early breakfast do check-out and head towards Pabgong Tso via Shyok. On arrival at Pangong, Check-in in your pre-Booked Hotel or camp.
                            </p>
                            </div>
                          </div>

                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 6
                            </p>
                           <div>
                           <h3>Pangong Lake - Leh </h3>
                            <p className="sche-details">
                               In morning indulge yourself in the walk beside the lake and you can enjoy here photography. Later depart for Leh Ladak enroute Hemis Gompa. Upon arrival do check-in formailities.
                            </p>
                           </div>
                          </div>

                          <div className="schedule-items">
                            <p className="schedule-timing">
                              
                              Day 7
                            </p>
                           <div>
                           <h3>Leh - Airport Drop</h3>
                            <p className="sche-details">
                               Breakfast and transferred to leh Airport. Return Home with Everlasting memories 
                            </p>
                           </div>
                          </div>
                        </div>
                        <div className="cancellation-policy-bx">
                          <Link href="#">*Cancellation Policy</Link>
                          <button className="btn btn-primary1" data-bs-toggle="modal"
                                  data-bs-target="#exampleModalCenter"
                                  fdprocessedid="s6df8j">Request A Callback</button>
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
                       Leh • Khardungla •Nubra •Pangong •Tsomoriri •Tsokar •Tanglangla
                      </li>
                    </ul>
                        <ul className="features-lists">
                          <li>
                          <img src="/assets/images/icons/hotel.png" alt="Hotel Icon"/>

                            <span>Hotel</span> : 4*
                          </li>
                          <li>
                          <img src="/assets/images/icons/pax.png" alt="pax Icon"/>

                            <span>No of Pax</span> : 03 Adults 01 Child (below 6 yrs)
                          </li>
                          <li>
                          <img src="/assets/images/icons/transferes.png" alt="transfer Icon"/>

                            <span>Transfers</span> : Included (Scorpio/Xylo/Innova)
                          </li>
                          <li>
                          <img src="/assets/images/icons/meal.png" alt="meals Icon"/>

                            <span>Meals</span> : Breakfast and Dinner 
                          </li>
                          <li>
                          <img src="/assets/images/icons/duration.png" alt="duration Icon"/>

                            <span>Duration</span> : 6N 7D
                          </li>
                         
                        </ul>
                        <button className="btn btn-primary1" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                           fdprocessedid="s6df8j">
                          Request A Callback
                        </button>
                      </div>
                    </div>

                     {/* ------=--------------------- time in tabs ===================== */}

                     <section className="time-schedule-section ">
                      <div className="container">
                        <div className="schedule-list">
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 1
                            </p>
                           <div>
                           <h3>Leh Airport Pickup and Acclimate</h3>
                            <p className="sche-details">
                              Arrival at Leh airport and transfer to your pre-booked Hotel. Complete day rest for acclimatize
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 2
                            </p>
                            <div>
                            <h3>Sham Valley Excursion Upto Sangam</h3>
                            <p className="sche-details">
                              Breakfast and head out for Hall of Fame, Gurudwara Pather Sahib, Magnetic Hill, Sangam Point. Visit Shanti Stupa & Leh Market Place
                            </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                              
                              Day 3
                            </p>
                           <div>
                           <h3>Leh - Nubra via Khardung la -Nubra (18390 FT.)</h3>
                            <p className="sche-details">
                               Breakfast and drive to Nubra Valley via Khardungla Pass. On arrival do check-in in pre-booked hotel or camp.
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                            
                              Day 4
                            </p>
                            <div>
                            <h3>Nubra - Pangong</h3>
                            <p className="sche-details">
                               After an early breakfast do check-out and head towards Pabgong Tso via Shyok. On arrival at Pangong, Check-in in your pre-Booked Hotel or camp.
                            </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 5
                            </p>
                            <div>
                            <h3>Pangong lake - Tsomoriri</h3>
                            <p className="sche-details">
                               Wake up early and indulge yourself in the walk besides the lake. Later go for Tsomiriri Lake. On arrival do check-in Formailities.Over night stay.
                            </p>
                            </div>
                          </div>

                          <div className="schedule-items">
                            <p className="schedule-timing">
                            
                              Day 6
                            </p>
                           <div>
                           <h3>Tsomoriri - Tsokar - Tanglangla - Leh </h3>
                            <p className="sche-details">
                              After Breakfast do check-out and visit Korzok Village.  Later drive towards Tsokar and ejoy their local tribes and their way of living. Later transfer to leh for Overnight stay.
                            </p>
                           </div>
                          </div>


                          
                          <div className="schedule-items">
                            <p className="schedule-timing">
                            
                              Day 7
                            </p>
                            <div>
                            <h3>Leh - Airport Drop</h3>
                            <p className="sche-details">
                               Breakfast and transferred to leh Airport. Return Home with Everlasting memories 
                            </p>
                            </div>
                          </div>
                        </div>
                        <div className="cancellation-policy-bx">
                          <Link href="#">*Cancellation Policy</Link>
                          <button className="btn btn-primary1" data-bs-toggle="modal"
                                  data-bs-target="#exampleModalCenter"
                                  fdprocessedid="s6df8j">Request A Callback</button>
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
                <Link href="#package">Leh Packages</Link>

                <Link href="#about-us">About Leh</Link>

                <Link href="#headingTwo">Leh Bucket List</Link>

                <Link href="#headingThree">Leh FAQ’s </Link>

                <Link href="#location">Leh Location</Link>

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
                <Link href="#package">Leh Packages</Link>

                <Link href="#about-us">About Leh</Link>

                <Link href="#headingTwo">Leh Bucket List</Link>

                <Link href="#headingThree">Leh FAQ’s </Link>

                <Link href="#location">Leh Location</Link>

                <Link href="#traveler-reviews">Trip Reviews</Link>
              </div>
                </div>


             </div>
          </div>
      </section>
      {/* ==================================== Moibile-things ================================= */}


      {/* ---------------------------- Time Scheduled Start ----------------------------------- */}


          {/* <section className="time-schedule-section ">
            <div className="container">
              <div className="schedule-list">
                <div className="schedule-items">
                  <p className="schedule-timing">
                    <img
                      src="/assets/images/kashmir/icons/time.png"
                      alt="watch icon"
                    />{" "}
                    Day 1
                  </p>
                  <h3>Arrival and welcome dinner.</h3>
                  <p className="sche-details">
                    Arrive at your lodge and settle in before enjoying a delicious
                    welcome dinner. Savor local and international dishes while
                    meeting our fellow travelers and preparing for the adventure
                    ahead.
                  </p>
                </div>
                <div className="schedule-items">
                  <p className="schedule-timing">
                    <img
                      src="/assets/images/kashmir/icons/time.png"
                      alt="watch icon"
                    />{" "}
                    Day 2-3
                  </p>
                  <h3>Game drives and wildlife exploration.</h3>
                  <p className="sche-details">
                    Embark on thrilling morning and afternoon game drives through
                    the stunning safari landscape. Spot the "Big Five" and other
                    incredible wildlife in their natural habitat, guided by
                    experienced rangers who provide fascinating insights into the
                    region’s flora and fauna.
                  </p>
                </div>
                <div className="schedule-items">
                  <p className="schedule-timing">
                    <img
                      src="/assets/images/kashmir/icons/time.png"
                      alt="watch icon"
                    />{" "}
                    Day 4
                  </p>
                  <h3>Cultural visit to a local village.</h3>
                  <p className="sche-details">
                    Immerse yourself in the rich traditions of the region with a
                    visit to a local village. Engage with the community, learn about
                    their customs, and experience authentic cultural practices,
                    offering a unique perspective on local life.
                  </p>
                </div>
                <div className="schedule-items">
                  <p className="schedule-timing">
                    <img
                      src="/assets/images/kashmir/icons/time.png"
                      alt="watch icon"
                    />{" "}
                    Day 5-6
                  </p>
                  <h3>Luxury camping under the stars.</h3>
                  <p className="sche-details">
                    Experience the ultimate in comfort with luxury camping,
                    combining the beauty of nature with premium amenities. Sleep
                    under the stars in a spacious tent, complete with plush bedding
                    and stunning views of the African night sky.
                  </p>
                </div>
                <div className="schedule-items">
                  <p className="schedule-timing">
                    <img
                      src="/assets/images/kashmir/icons/time.png"
                      alt="watch icon"
                    />{" "}
                    Day 7
                  </p>
                  <h3>Departure with memories to last a lifetime.</h3>
                  <p className="sche-details">
                    As your safari adventure comes to a close, reflect on the
                    unforgettable experiences and stunning wildlife encounters.
                    Depart with cherished memories, a camera full of pictures, and a
                    heart full of stories to share.
                  </p>
                </div>
              </div>
              <div className="cancellation-policy-bx">
                <Link href="#">*Cancellation Policy</Link>
                <button className="btn btn-primary1" data-bs-toggle="modal"
                        data-bs-target="#exampleModalCenter"
                        fdprocessedid="s6df8j">Request A Callback</button>
              </div>
            </div>
          </section> */}
   
      {/* ---------------------------- Time Scheduled Start ----------------------------------- */}




      {/* ---------------------------------- CTa ----------------------- */}

      <section className="banner-sections bg-prime ptb-10">
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
                    About Leh
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
                <h2 className="accordion-header bg-prime" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Leh Bucket List
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
                    Leh FAQ’s?
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

      <Popup/>

      <Footer />
    </div>
  );
}
