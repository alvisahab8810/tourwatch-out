import React from "react";

import Topbar from "../components/header/Header";
import Footer from "../components/footer/Footer";
import TravelerReviews from "../components/kashmir/TravelerReviews";
import Map from "../components/kashmir/Map";
import Link from "next/link";
import Popup from "../components/corporate/Popup";
import Offcanvas from "../components/header/Offcanvas";

export default function ShimlaManali() {

  
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
                The heaven of earth, Shimla & Manali
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
                <h1>Shimla & Manali Family Package</h1>
                {/* <ul className="location-list">
                  <li className="list-item-none">(7 Days)</li>
                  <li className="locaton-items">
                    <img
                      src="./assets/images/kashmir/icons/pin.png"
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
                          src="./assets/images/kashmir/video.mp4"
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
                          src="./assets/images/kashmir/icons/pin.png"
                          alt="Location Icon"
                        />{" "}
                        SHIMLA • MANALI
                      </li>
                    </ul>
                        <ul className="features-lists">
                          <li>
                           <img src="./assets/images/icons/hotel.png" alt="Hotel Icon"/>
                            <span>Hotel</span> : 3* Deluxe
                          </li>

                          <li>
                          <img src="./assets/images/icons/pax.png" alt="pax Icon"/>

                            <span>No of Pax</span> : 02 Adults & 01 Child (Below 5 yrs)
                          </li>
                          <li>
                          <img src="./assets/images/icons/transferes.png" alt="transfer Icon"/>

                            <span>Airport Transfers</span> : Included (Sedan)
                          </li>
                         
                          <li>
                          <img src="./assets/images/icons/meal.png" alt="meals Icon"/>

                            <span>Meals</span> : Breakfast 
                          </li>
                          <li>
                          <img src="./assets/images/icons/duration.png" alt="duration Icon"/>

                            <span>Duration</span> : 5N 6D
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
                           <h3>Pickup from Delhi or Chandigarh  and Transfer to Shimla By Volvo in Night</h3>
                            <p className="sche-details">
                               Your journey will start from Delhi. Overnight volvo Journey towards Shimla.
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 2
                            </p>
                           <div>
                           <h3>Shimla Local Sightseeing</h3>
                            <p className="sche-details">
                              Morning arrival in Shimla and today we will explore Local sightseeing like  Jakhu Temple and Shimla Ridge Church, Vice Regal Lodge, Christ Church, Gaiety Theatre and Scandal Point.  
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 3
                            </p>
                            <div>
                            <h3>Excursion to Kufri, Mashobra and Naldehra</h3>
                            <p className="sche-details">
                               Breakfast and Himalayan National Park, Yak Ride and one can see the endless Himalayan Panorama from Kufri.Visit Apple orchards in Mashobra and Naldehra, famous for its dense forest, and take a jungle walk.
                              </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 4
                            </p>
                            <div>
                            <h3>Transfer to Manali - En Route Stop at Kullu</h3>
                            <p className="sche-details">
                             Breakfast and do check-out formalities. Visit sightseeing spots on the way like SunderNagerLake, Pandoh dam, Hanogi Mata temple, Vaishno Mata Temple. Evening Reach Manali
                            </p>
                            </div>
                          </div>
                          

                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 5
                            </p>
                            <div>
                            <h3>Excursion to Solang Valley</h3>
                            <p className="sche-details">
                            Breakfast and transfer to visit Solang Valley. You may witness Atal tunnel & Sissu lake Drive back to Manali in the evening. Dinner and overnight stay in Manali.
                            </p>
                            </div>
                          </div>


                          <div className="schedule-items">
                            <p className="schedule-timing">
                            
                              Day 6
                            </p>
                            <div>
                            <h3>Manali Local Sightseeing - Overnight Volvo to Delhi</h3>
                            <p className="sche-details">
                              Breakfast and do check-out. Now you will visit old Hidimba Mata temple.Visit Manu Temple, Van Vihar in Manali and Shiv Temple. In the evening, you will get dropped at Manali Volvo Bus stand where you can catch Volvo bus for Delhi.
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
                          src="./assets/images/kashmir/video.mp4"
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
                          src="./assets/images/kashmir/icons/pin.png"
                          alt="Location Icon"
                        />{" "}
                         Null • Null  • Null  • Null  • Null
                      </li>
                    </ul>
                        <ul className="features-lists">
                           <li>
                           <img src="./assets/images/icons/hotel.png" alt="Hotel Icon"/>

                            <span>Hotel</span> : 3* Premium
                          </li>
                          <li>
                          <img src="./assets/images/icons/pax.png" alt="pax Icon"/>

                            <span>No of Pax</span> : 02 Adults & 02 Childs (6-12yrs)
                          </li>
                          <li>

                          <img src="./assets/images/icons/transferes.png" alt="transfer Icon"/>

                            <span>Airport Transfers</span> : Included (Sedan)
                          </li>
                          <li>

                          <img src="./assets/images/icons/meal.png" alt="meals Icon"/>

                            <span>Meals</span> : Breakfast and Dinner 
                          </li>
                          <li>

                          <img src="./assets/images/icons/duration.png" alt="duration Icon"/>

                            <span>Duration</span> : 5N 6D
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
                           <h3>Pickup from Delhi and Transfer to Shimla By Volvo in Night</h3>
                            <p className="sche-details">
                              Your journey will start from Delhi. Overnight volvo Journey towards Shimla.
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                        
                              Day 2
                            </p>
                           <div>
                           <h3>Shimla Local Sightseeing</h3>
                            <p className="sche-details">
                              Morning arrival in Shimla and today we will explore Local sightseeing like  Jakhu Temple and Shimla Ridge Church, Vice Regal Lodge, Christ Church, Gaiety Theatre and Scandal Point.  
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                           
                              Day 3
                            </p>
                            <div>
                            <h3>Excursion to Kufri, Mashobra and Naldehra</h3>
                            <p className="sche-details">
                              Breakfast and Himalayan National Park, Yak Ride and one can see the endless Himalayan Panorama from Kufri.Visit Apple orchards in Mashobra and Naldehra, famous for its dense forest, and take a jungle walk.
                            </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 4
                            </p>
                           <div>
                           <h3>Transfer to Manali - En Route Stop at Kullu</h3>
                            <p className="sche-details">
                              Breakfast and do check-out formalities. Visit sightseeing spots on the way like SunderNagerLake, Pandoh dam, Hanogi Mata temple, Vaishno Mata Temple. Evening Reach Manali
                            </p>
                           </div>
                          </div>

                          <div className="schedule-items">
                            <p className="schedule-timing">
                           
                              Day 5
                            </p>
                           <div>
                           <h3>Excursion to Solang Valley</h3>
                            <p className="sche-details">
                              Breakfast and transfer to visit Solang Valley. You may witness Atal tunnel & Sissu lake Drive back to Manali in the evening. Dinner and overnight stay in Manali.
                            </p>
                           </div>
                          </div>


                          
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 6
                            </p>
                           <div>
                           <h3>Manali Local Sightseeing - Overnight Volvo to Delhi</h3>
                            <p className="sche-details">
                               Breakfast and do check-out. Now you will visit old Hidimba Mata temple.Visit Manu Temple, Van Vihar in Manali and Shiv Temple. In the evening, you will get dropped at Manali Volvo Bus stand where you can catch Volvo bus for Delhi.
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
                          src="./assets/images/kashmir/video.mp4"
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
                          src="./assets/images/kashmir/icons/pin.png"
                          alt="Location Icon"
                        />{" "}
                        Null • Null • Null • Null • Null
                      </li>
                    </ul>
                        <ul className="features-lists">
                          <li>
                          <img src="./assets/images/icons/hotel.png" alt="Hotel Icon"/>

                            <span>Hotel</span> : 4*
                          </li>
                          <li>
                          <img src="./assets/images/icons/pax.png" alt="pax Icon"/>

                            <span>No of Pax</span> : 02 Adults & 02 Childs (6-12yrs)
                          </li>
                          <li>
                          <img src="./assets/images/icons/transferes.png" alt="transfer Icon"/>

                            <span>Airport Transfers</span> : Included (Sedan)
                          </li>
                          <li>
                          <img src="./assets/images/icons/meal.png" alt="meals Icon"/>

                            <span>Meals</span> : Breakfast and Dinner 
                          </li>
                          <li>
                          <img src="./assets/images/icons/duration.png" alt="duration Icon"/>

                            <span>Duration</span> : 5N 6D
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
                            <h3>Pickup from Delhi and Transfer to Shimla By Volvo in Night</h3>
                            <p className="sche-details">
                              Your journey will start from Delhi. Overnight volvo Journey towards Shimla.
                            </p>
                            </div>

                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                           
                              Day 2
                            </p>
                           <div>
                           <h3>Shimla Local Sightseeing</h3>
                            <p className="sche-details">
                               Morning arrival in Shimla and today we will explore Local sightseeing like  Jakhu Temple and Shimla Ridge Church, Vice Regal Lodge, Christ Church, Gaiety Theatre and Scandal Point.  
                            </p>
                           </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 3
                            </p>
                            <div>
                            <h3>Excursion to Kufri, Mashobra and Naldehra</h3>
                            <p className="sche-details">
                             Breakfast and Himalayan National Park, Yak Ride and one can see the endless Himalayan Panorama from Kufri.Visit Apple orchards in Mashobra and Naldehra, famous for its dense forest, and take a jungle walk.
                            </p>
                            </div>
                          </div>
                          <div className="schedule-items">
                            <p className="schedule-timing">
                             
                              Day 4
                            </p>
                           <div>
                           <h3>Transfer to Manali - En Route Stop at Kullu</h3>
                            <p className="sche-details">
                              Breakfast and do check-out formalities. Visit sightseeing spots on the way like SunderNagerLake, Pandoh dam, Hanogi Mata temple, Vaishno Mata Temple. Evening Reach Manali
                            </p>
                           </div>
                          </div>


                          <div className="schedule-items">
                            <p className="schedule-timing">
                              Day 5
                            </p>
                           <div>
                           <h3>Excursion to Solang Valley</h3>
                            <p className="sche-details">
                               Breakfast and transfer to visit Solang Valley. You may witness Atal tunnel & Sissu lake Drive back to Manali in the evening. Dinner and overnight stay in Manali.
                            </p>
                           </div>
                          </div>



                          <div className="schedule-items">
                            <p className="schedule-timing">
                            
                              Day 6
                            </p>
                            <div>
                            <h3>Manali Local Sightseeing - Overnight Volvo to Delhi</h3>
                            <p className="sche-details">
                               Breakfast and do check-out. Now you will visit old Hidimba Mata temple.Visit Manu Temple, Van Vihar in Manali and Shiv Temple. In the evening, you will get dropped at Manali Volvo Bus stand where you can catch Volvo bus for Delhi.
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
                <Link href="#package"> Shimla & Manali Packages</Link>

                <Link href="#about-us">About Shimla & Manali</Link>

                <Link href="#headingTwo">Shimla & Manali Bucket List</Link>

                <Link href="#headingThree">Shimla & Manali FAQ’s </Link>

                <Link href="#location">Shimla & Manali Location</Link>

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
                          src="./assets/images/kashmir/video.mp4"
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
                <Link href="#package">Shimla & Manali Packages</Link>

                <Link href="#about-us">About Shimla & Manali</Link>

                <Link href="#headingTwo">Shimla & Manali Bucket List</Link>

                <Link href="#headingThree">Shimla & Manali FAQ’s </Link>

                <Link href="#location">Shimla & Manali Location</Link>

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
                      src="./assets/images/kashmir/icons/time.png"
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
                      src="./assets/images/kashmir/icons/time.png"
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
                      src="./assets/images/kashmir/icons/time.png"
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
                      src="./assets/images/kashmir/icons/time.png"
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
                      src="./assets/images/kashmir/icons/time.png"
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
                    About Manali & Shimla
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
                     Manali & Shimla Bucket List
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
                     Manali & Shimla FAQ’s?
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
