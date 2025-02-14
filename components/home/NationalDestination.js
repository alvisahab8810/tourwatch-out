import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Link from "next/link";

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
            centeredSlides={true}
            grabCursor={true}
            loop={true}
            slidesPerView={3.9}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next-1",
              prevEl: ".swiper-button-prev-1",
            }}

            breakpoints={{
                  240: {
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
            modules={[Autoplay, Navigation]}
            className="swiper mySwiper4 pt-80"
          >
            <SwiperSlide className="swiper-slide">
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/img2.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Jim Corbett</h3>
                  <p>
                    Jim Corbett National Park is a wildlife haven, offering
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/img3.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Goa</h3>
                  <p>
                    Goa is a vibrant coastal haven, known for its stunning
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
            </SwiperSlide>

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
                    src="./assets/images/n-destination/img2.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
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
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/img2.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Darjeeling</h3>
                  <p>
                    Darjeeling, with its lush tea gardens and panoramic views of
                    the Himalayas, is a charming hill station that captivates
                    visitors seeking tranquility & natural beauty.
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/img2.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Jim Corbett</h3>
                  <p>
                    Jim Corbett National Park is a wildlife haven, offering
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/img2.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Jim Corbett</h3>
                  <p>
                    Jim Corbett National Park is a wildlife haven, offering
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/img2.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Darjeeling</h3>
                  <p>
                    Darjeeling, with its lush tea gardens and panoramic views of
                    the Himalayas, is a charming hill station that captivates
                    visitors seeking tranquility & natural beauty.
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/img2.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Jim Corbett</h3>
                  <p>
                    Jim Corbett National Park is a wildlife haven, offering
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
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <div className="batch-info">
                <p>Starting From*</p>
                <h4>
                  ₹23,999/<sub>person</sub>
                </h4>
              </div>
              <div className="desti-img">
                {" "}
                <img
                  src="./assets/images/n-destination/img2.webp"
                  alt="National Destination"
                ></img>{" "}
              </div>
              <div className="desti-main">
                <div className="desti-info">
                  <h3>Jim Corbett</h3>
                  <p>
                    Jim Corbett National Park is a wildlife haven, offering
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
            </SwiperSlide>
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
