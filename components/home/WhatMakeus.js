import React, { useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const videoSources = [
  "/assets/images/instagram/video2.mp4",
  "/assets/images/instagram/video1.mp4",
  "/assets/images/instagram/video3.mp4",
];

export default function WhatMakeus() {
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
    <section className="what-makes-us">
      <div className="mini-container1">
        <div className="section-header">
          <p className="section-subtitle">What Makes Us</p>
          <h2 className="section-title">
            Your Ideal <span className="highlight">Travel Partner</span>
          </h2>
        </div>

        <div className="features-grid">

          {/* CARD 1 */}
          <div className="feature-card">
            <div className="feature-image">
              <video
                ref={(el) => (videoRefs.current[0] = el)}
                src={videoSources[0]}
                autoPlay
                loop
                muted
                playsInline
                className="wm-video"
              />
              <button
                className="wm-mute-btn"
                onClick={() => toggleMute(0)}
              >
                {unmutedIndex === 0 ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>

              <div className="feature-content">
                <div className="feature-stat">
                  <img src="/assets/images/hero/icons/experience.svg" alt="Experience" />
                  <h4>10+</h4>
                </div>
                <p>Years of Expertise</p>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="feature-card">
            <div className="feature-image">
              <video
                ref={(el) => (videoRefs.current[1] = el)}
                src={videoSources[1]}
                autoPlay
                loop
                muted
                playsInline
                className="wm-video"
              />
              <button
                className="wm-mute-btn"
                onClick={() => toggleMute(1)}
              >
                {unmutedIndex === 1 ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>

              <div className="feature-content">
                <div className="feature-stat">
                  <img src="/assets/images/hero/icons/share.svg" alt="Clients" />
                  <h4>5000+</h4>
                </div>
                <p>Happy Clients</p>
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="feature-card">
            <div className="feature-image">
              <video
                ref={(el) => (videoRefs.current[2] = el)}
                src={videoSources[2]}
                autoPlay
                loop
                muted
                playsInline
                className="wm-video"
              />
              <button
                className="wm-mute-btn"
                onClick={() => toggleMute(2)}
              >
                {unmutedIndex === 2 ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>

              <div className="feature-content">
                <div className="feature-stat">
                  <img src="/assets/images/hero/icons/activity.svg" alt="Hotels" />
                  
                  <h4>500+</h4>
                </div>
                <p>Hotel Collaboration</p>
              </div>
            </div>
          </div>

          {/* CARD 4 */}
          {/* <div className="feature-card">
            <div className="feature-image">
              <video
                ref={(el) => (videoRefs.current[3] = el)}
                src={videoSources[3]}
                autoPlay
                loop
                muted
                playsInline
                className="wm-video"
              />
              <button
                className="wm-mute-btn"
                onClick={() => toggleMute(3)}
              >
                {unmutedIndex === 3 ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>

              <div className="feature-content">
                <div className="feature-stat">
                  <img src="/assets/images/hero/icons/activity.svg" alt="Destinations" />
                  <h4>50+</h4>
                </div>
                <p>Global Destinations</p>
              </div>
            </div>
          </div> */}

        </div>
      </div>

      {/* Extra CSS for buttons + video */}
      <style jsx>{`
        .wm-video {
          width: 100%;
          height: 100%;
            aspect-ratio: 9 / 16;
          object-fit: cover;
          border-radius: 10px 10px 0 0;
        }

        .wm-mute-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.55);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 50%;
          z-index: 20;
          cursor: pointer;
        }

        .wm-mute-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </section>
  );
}
