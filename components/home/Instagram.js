


import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Link from "next/link";
const videoSources = [
  "/assets/images/instagram/video1.mp4",
  "/assets/images/instagram/video2.mp4",
  "/assets/images/instagram/video3.mp4",
  "/assets/images/instagram/video4.mp4",
  "/assets/images/instagram/video5.mp4",
  "/assets/images/instagram/video6.mp4",
  "/assets/images/instagram/video1.mp4",
  "/assets/images/instagram/video2.mp4",
];

export default function Instagram() {
  const videoRefs = useRef([]);
  const [unmutedIndex, setUnmutedIndex] = useState(null);

  const toggleMute = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === index) {
          video.muted = !video.muted;
          setUnmutedIndex(video.muted ? null : i);
        } else {
          video.muted = true;
        }
      }
    });
  };

  return (
    <>
      <section className="instagram-section">

          <div className="mini-container1">
          <div className="insta-row ">
         <h2 className="section-title">Instagram videos</h2>

            <Link
              href="https://www.instagram.com/tourwatchout/?hl=en"
              className="explore-more-btn"
            >
              Visit Instagram
              {/* <img
                src="/assets/images/icons/right-arrow.png"
                alt="right arrow"
              ></img> */}
            </Link>
           
          </div>
        </div>
        <div className="mini-container1">
          <Swiper
            spaceBetween={10}
            loop={true}
            grabCursor={true}
            slidesPerView={3.2}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              240: {
                slidesPerView: 1.4,
                spaceBetween: 10,
                centeredSlides: true,
              },
              768: { slidesPerView: 2.5, spaceBetween: 10 },
              1024: { slidesPerView: 3.2, spaceBetween: 10 },
            }}
            navigation={{
              nextEl: ".swiper-button-next-1",
              prevEl: ".swiper-button-prev-1",
            }}
            modules={[Autoplay, Navigation]}
            className="swiper mySwiper4 pt-80"
          >
            {videoSources.map((src, index) => (
              <SwiperSlide key={index} className="swiper-slide relative">
                <div className="video-container">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="video-element"
                  />
                  <button
                    className="mute-toggle-button"
                    onClick={() => toggleMute(index)}
                  >
                    {unmutedIndex === index ? (
                      <FaVolumeUp size={20} />
                    ) : (
                      <FaVolumeMute size={20} />
                    )}
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <style jsx>{`
        .video-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .video-element {
          width: 100%;
          height: auto;
          border-radius: 12px;
        }

        .mute-toggle-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(0, 0, 0, 0.6);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.3s ease;
          z-index: 10;
          line-height:1;
        }

        .mute-toggle-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}
