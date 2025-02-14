    import React from "react";
    import { Swiper, SwiperSlide } from "swiper/react";
    import { Autoplay, Navigation } from "swiper/modules";
    import Link from "next/link";

    export default function InterNational() {
    return (
        <>
        <section className="international-dest national-dest">
            <div className="contianer">
            <div className="row pt-80">
                <div className="col-md-12">
                {/* <!-- <h2 className="subtitle text-center"> WHAT WE SERVE</h2> --> */}
                <h1 className="heading lh-75">International Destinations</h1>
                </div>
            </div>
            <Swiper 
                spaceBetween={20}
                centeredSlides={true}
                grabCursor={true}
                loop={true}
                slidesPerView={3.9}
                autoplay={{
                  delay: 2500,
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
            
            className="swiper mySwiper4 pt-80">
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
                    src="./assets/images/i-destination/img1.webp"
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
                    src="./assets/images/i-destination/img2.webp"
                    alt="National Destination"
                    ></img>{" "}
                </div>
                <div className="desti-main">
                    <div className="desti-info">
                    <h3>Singapore</h3>
                    <p>
                        Singapore is a dynamic city-state, celebrated for its modern
                        skyline, diverse cuisine, and lush gardens, offering a
                        unique blend of culture and innovation.
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
                    src="./assets/images/i-destination/img3.webp"
                    alt="National Destination"
                    ></img>{" "}
                </div>
                <div className="desti-main">
                    <div className="desti-info">
                    <h3>Thailand</h3>
                    <p>
                        Thailand is a vibrant destination, famous for its beautiful
                        beaches, rich culture, and lively street life, perfect for
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
                    src="./assets/images/i-destination/img4.webp"
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
                    src="./assets/images/i-destination/img1.webp"
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
                    src="./assets/images/i-destination/img2.webp"
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
                    src="./assets/images/i-destination/img4.webp"
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
                    src="./assets/images/i-destination/img1.webp"
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
                    src="./assets/images/i-destination/img2.webp"
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
                <Link href="/international-destination" className="explore-more-btn">
                Explore More
                </Link>
            </div>
            </div>
        </section>
        </>
    );
    }
