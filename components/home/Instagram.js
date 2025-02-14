import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
export default function Instagram() {
  return (
    <>
      <section className="instagram-section national-dest pb-80">
        <div className="contianer">
          <div className="row ">
            <div className="col-md-12">
              <h1 className="heading lh-75">Instagram videos</h1>
            </div>
          </div>
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
              <video
                src="./assets/images/instagram/video1.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <video
                src="./assets/images/instagram/video2.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <video
                src="./assets/images/instagram/video3.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <video
                src="./assets/images/instagram/video4.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <video
                src="./assets/images/instagram/video5.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <video
                src="./assets/images/instagram/video6.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <video
                src="./assets/images/instagram/video4.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <video
                src="./assets/images/instagram/video5.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>

            <SwiperSlide className="swiper-slide">
              <video
                src="./assets/images/instagram/video6.mp4"
                alt="National Destination"
                autoPlay
                muted
                loop
                playsInline
              ></video>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  );
}
