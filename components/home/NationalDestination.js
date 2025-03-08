import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

import "swiper/css/pagination";


export default function NationalDestination() {
  return (
    <>
      <section className="national-dest">
        <div className="contianer">
          <div className="row pt-80">
            <div className="col-md-12">
              <h2 className="subtitle text-center"> WHAT WE SERVE</h2>
              <h1 className="heading lh-75">National Destinations</h1>
            </div>
          </div>
          <Swiper
            spaceBetween={20}
            // centeredSlides={true}
            grabCursor={true}
            loop={true}
            slidesPerView={3.9}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination", // Ensure a pagination element is available
            }}
            navigation={{
              nextEl: ".swiper-button-next-1",
              prevEl: ".swiper-button-prev-1",
            }}

            breakpoints={{
                  240: {
                 centeredSlides:true,

                    slidesPerView: 1.5,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 2.5,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3.9,
                    spaceBetween: 20,
                  },
                }}
            modules={[Autoplay, Navigation, Pagination ]}
            className="swiper mySwiper5 pt-80"
          >
            <SwiperSlide className="swiper-slide">
              <Link href="/kashmir">
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/kashmir.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Kashmir</h3>
                  <p>
                    Kashmir National Park is a wildlife haven, offering
                    stunning landscapes and unforgettable adventures for nature
                    lovers.
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
               <Link href="/leh-laddakh">
               <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/leh.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Leh Ladakh</h3>
                  <p>
                     Leh Ladakh is a vibrant coastal haven, known for its stunning
                    beaches, lively nightlife, and rich cultural heritage, ideal
                    for relaxation and exploration.
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="/manali">
                <div className="batch-info">
                  <p>Starting From*</p>
                  <h4>
                    ₹23,999/<sub>person</sub>
                  </h4>
                </div>
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/manali.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Manali</h3>
                    <p>
                      Manali is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
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
            </SwiperSlide>


            <SwiperSlide className="swiper-slide">
              <Link href="/shimla">
                <div className="batch-info">
                  <p>Starting From*</p>
                  <h4>
                    ₹23,999/<sub>person</sub>
                  </h4>
                </div>
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/shimla.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Shimla</h3>
                    <p>
                      Shimla is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="/shimla">
                <div className="batch-info">
                  <p>Starting From*</p>
                  <h4>
                    ₹23,999/<sub>person</sub>
                  </h4>
                </div>
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/shimla&manali.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Shimla & Manali </h3>
                    <p>
                      Shimla & Manali is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
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
            </SwiperSlide>


            <SwiperSlide className="swiper-slide">
              <Link href="/dharamshala">
                <div className="batch-info">
                  <p>Starting From*</p>
                  <h4>
                    ₹23,999/<sub>person</sub>
                  </h4>
                </div>
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/dharamshala.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Dharamshala </h3>
                    <p>
                      Dharamshala is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="/dehradun">
                <div className="batch-info">
                  <p>Starting From*</p>
                  <h4>
                    ₹23,999/<sub>person</sub>
                  </h4>
                </div>
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/dehradun.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Dehradun & Mussoorie </h3>
                    <p>
                      Dehradun & Mussoorie is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
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
            </SwiperSlide>


          <div className="swiper-pagination"></div>
           
          </Swiper>

          {/* <!-- <div className="swiper-button-prev"></div> -->
           <!-- <div className="swiper-button-next"></div> --> */}
          <div className="container">
            <Link href="/national-destination" className="explore-more-btn">
              Explore More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
