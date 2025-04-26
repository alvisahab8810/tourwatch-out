import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
export default function Instagram() {
  return (
    <>
      <section className="instagram-section national-dest pb-80">
        <div className="container">
          <div className="insta-row ">
            <h1 className="heading lh-75">Instagram videos</h1>
            <a
              href="https://www.instagram.com/tourwatchout/?hl=en"
              className="explore-more-btn"
            >
              Visit Instagram
            </a>
          </div>
        </div>
        <div className="contianer">
          <Swiper
            spaceBetween={20}
            centeredSlides={true}
            loop={true}
            grabCursor={true}
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
            className="swiper mySwiper4 pt-80"
          >
            <SwiperSlide className="swiper-slide">
              <Link
                href="https://www.instagram.com/tourwatchout/?hl=en "
                target="_blank"
                rel="noopener noreferrer"
              >
                <video
                  src="./assets/images/instagram/video1.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ cursor: "pointer" }} // Optional: Changes cursor to pointer on hover
                ></video>
              </Link>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="https://www.instagram.com/tourwatchout/?hl=en">
                <video
                  src="./assets/images/instagram/video2.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </Link>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="https://www.instagram.com/tourwatchout/?hl=en">
                <video
                  src="./assets/images/instagram/video3.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </Link>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="https://www.instagram.com/tourwatchout/?hl=en">
                <video
                  src="./assets/images/instagram/video4.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </Link>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="https://www.instagram.com/tourwatchout/?hl=en">
                <video
                  src="./assets/images/instagram/video5.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </Link>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="https://www.instagram.com/tourwatchout/?hl=en">
                <video
                  src="./assets/images/instagram/video6.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </Link>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="https://www.instagram.com/tourwatchout/?hl=en">
                <video
                  src="./assets/images/instagram/video4.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </Link>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="https://www.instagram.com/tourwatchout/?hl=en">
                <video
                  src="./assets/images/instagram/video5.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </Link>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <Link href="https://www.instagram.com/tourwatchout/?hl=en">
                <video
                  src="./assets/images/instagram/video6.mp4"
                  alt="National Destination"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </Link>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  );
}
