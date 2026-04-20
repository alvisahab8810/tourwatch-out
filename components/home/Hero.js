// "use client";

// import Image from "next/image";

// const destinationImages = [
//   { src: "/images/lake-mountains.jpg",  alt: "Lake with mountains",   position: "top-left-1"  },
//   { src: "/images/city-skyline.jpg",    alt: "City skyline",          position: "top-left-2"  },
//   { src: "/images/waterfall.jpg",       alt: "Waterfall",             position: "bottom-left-1"},
//   { src: "/images/alpine-lake.jpg",     alt: "Alpine lake",           position: "bottom-left-2"},
//   { src: "/images/burj-al-arab.jpg",    alt: "Burj Al Arab Dubai",    position: "top-right-1" },
//   { src: "/images/beach-resort.jpg",    alt: "Beach resort",          position: "top-right-2" },
//   { src: "/images/eiffel-tower.jpg",    alt: "Eiffel Tower Paris",    position: "bottom-right-1"},
//   { src: "/images/mountain-vista.jpg",  alt: "Mountain vista",        position: "bottom-right-2"},
// ];

// export default function Hero() {
//   return (
//     <section className="twc-hero">
//       {/* ── Left image cluster ── */}
//       <div className="twc-cluster twc-cluster--left" aria-hidden="true">
//         <div className="twc-cluster__row">
//           <div className="twc-img-card twc-img-card--full">
//             <Image src={destinationImages[0].src} alt={destinationImages[0].alt} fill sizes="140px" className="twc-img" />
//           </div>
//           <div className="twc-img-card twc-img-card--full">
//             <Image src={destinationImages[1].src} alt={destinationImages[1].alt} fill sizes="140px" className="twc-img" />
//           </div>
//         </div>
//         <div className="twc-cluster__row">
//           <div className="twc-img-card twc-img-card--edge">
//             <Image src={destinationImages[2].src} alt={destinationImages[2].alt} fill sizes="120px" className="twc-img" />
//           </div>
//           <div className="twc-img-card twc-img-card--full">
//             <Image src={destinationImages[3].src} alt={destinationImages[3].alt} fill sizes="120px" className="twc-img" />
//           </div>
//         </div>
//       </div>

//       {/* ── Centre content ── */}
//       <div className="twc-center">
//         <div className="twc-wordmark" aria-hidden="true">
//           <span className="twc-wordmark__bg">Think</span>
//           <span className="twc-wordmark__script">Travel</span>
//         </div>

//         <h1 className="twc-brand">Tourwatchout</h1>

//         <p className="twc-tagline">Your Dream Destination Just One Click away</p>

//         <p className="twc-offer">
//           <span className="twc-offer__highlight">Flat 20% Off</span>{" "}
//           On Your First Tour Package!
//         </p>

//         <button className="twc-cta" type="button">
//           Request A Call back
//         </button>
//       </div>

//       {/* ── Right image cluster ── */}
//       <div className="twc-cluster twc-cluster--right" aria-hidden="true">
//         <div className="twc-cluster__row">
//           <div className="twc-img-card twc-img-card--full">
//             <Image src={destinationImages[4].src} alt={destinationImages[4].alt} fill sizes="140px" className="twc-img" />
//           </div>
//           <div className="twc-img-card twc-img-card--edge twc-img-card--edge-right">
//             <Image src={destinationImages[5].src} alt={destinationImages[5].alt} fill sizes="140px" className="twc-img" />
//           </div>
//         </div>
//         <div className="twc-cluster__row">
//           <div className="twc-img-card twc-img-card--full">
//             <Image src={destinationImages[6].src} alt={destinationImages[6].alt} fill sizes="120px" className="twc-img" />
//           </div>
//           <div className="twc-img-card twc-img-card--edge twc-img-card--edge-right">
//             <Image src={destinationImages[7].src} alt={destinationImages[7].alt} fill sizes="120px" className="twc-img" />
//           </div>
//         </div>
//       </div>

//       {/* ── Scoped styles ── */}
//       <style>{`
//         /* ═══════════════════════════════════════════════
//            UNIQUE PARENT: .twc-hero
//         ═══════════════════════════════════════════════ */

//         .twc-hero {
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           width: 100%;
//           min-height: 420px;
//           background: #ffffff;
//           padding: 40px 0;
//           overflow: hidden;
//           border-bottom: 1px solid #f0f0f0;
//         }

//         /* ── Image clusters ── */
//         .twc-cluster {
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//           flex-shrink: 0;
//         }
//         .twc-cluster--left  { padding-left: 0; }
//         .twc-cluster--right { padding-right: 0; }

//         .twc-cluster__row {
//           display: flex;
//           gap: 12px;
//           align-items: center;
//         }

//         .twc-img-card {
//           position: relative;
//           border-radius: 16px;
//           overflow: hidden;
//           background: #f5f5f5;
//           flex-shrink: 0;
//           width: 140px;
//           height: 130px;
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
//         .twc-img-card:hover {
//           transform: scale(1.04);
//           box-shadow: 0 8px 28px rgba(0,0,0,0.14);
//         }

//         /* Cards that bleed off the screen edge */
//         .twc-img-card--edge {
//           width: 60px;
//           border-radius: 16px 0 0 16px;
//           overflow: hidden;
//         }
//         .twc-img-card--edge-right {
//           border-radius: 0 16px 16px 0;
//         }

//         .twc-cluster__row:last-child .twc-img-card {
//           width: 120px;
//           height: 110px;
//         }
//         .twc-cluster__row:last-child .twc-img-card--edge {
//           width: 50px;
//         }

//         .twc-img {
//           object-fit: cover;
//         }

//         /* ── Centre ── */
//         .twc-center {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           text-align: center;
//           padding: 0 32px;
//           position: relative;
//           z-index: 1;
//         }

//         /* Watermark word "Think…ink" */
//         .twc-wordmark {
//           position: relative;
//           display: flex;
//           align-items: baseline;
//           justify-content: center;
//           line-height: 1;
//           margin-bottom: -20px;
//           pointer-events: none;
//           user-select: none;
//         }
//         .twc-wordmark__bg {
//           font-size: clamp(56px, 8vw, 96px);
//           font-weight: 800;
//           letter-spacing: -2px;
//           color: rgba(0,0,0,0.06);
//   font-family: 'Erstoria';
         
//         }
//         .twc-wordmark__bg--bot {
//           position: absolute;
//           right: -8px;
//           bottom: 0;
//         }
//         .twc-wordmark__script {
//           font-size: clamp(40px, 5.5vw, 68px);
//           font-weight: 400;
//           font-family: 'Dancing Script', 'Brush Script MT', cursive;
//           color: #E03E38;
//           margin: 0 4px;
//           line-height: 1.1;
//           position: relative;
//           z-index: 1;
//         }

//         /* Brand headline */
//         .twc-brand {
//           font-size: clamp(36px, 5vw, 64px);
//           font-weight: 800;
//           color: #E03E38;
//           letter-spacing: -1px;
//           margin: 0 0 14px;
//           line-height: 1;
//           font-family: 'Georgia', serif;
//         }

//         .twc-tagline {
//           font-size: clamp(13px, 1.5vw, 16px);
//           color: #777;
//           margin: 0 0 10px;
//           font-family: sans-serif;
//           font-weight: 400;
//         }

//         .twc-offer {
//           font-size: clamp(15px, 2vw, 22px);
//           font-weight: 700;
//           color: #1a1a1a;
//           margin: 0 0 28px;
//           font-family: sans-serif;
//         }
//         .twc-offer__highlight {
//           color: #E03E38;
//         }

//         /* CTA button */
//         .twc-cta {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           background: #E03E38;
//           color: #fff;
//           border: none;
//           border-radius: 50px;
//           padding: 16px 48px;
//           font-size: clamp(14px, 1.5vw, 17px);
//           font-weight: 600;
//           font-family: sans-serif;
//           cursor: pointer;
//           letter-spacing: 0.3px;
//           transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
//           box-shadow: 0 4px 20px rgba(224, 62, 56, 0.35);
//         }
//         .twc-cta:hover {
//           background: #c42f2a;
//           transform: translateY(-2px);
//           box-shadow: 0 8px 28px rgba(224, 62, 56, 0.45);
//         }
//         .twc-cta:active {
//           transform: translateY(0);
//           box-shadow: 0 4px 16px rgba(224, 62, 56, 0.3);
//         }

//         /* ═══════════════════════════════════════════════
//            RESPONSIVE
//         ═══════════════════════════════════════════════ */

//         /* Tablet (≤ 900 px) — hide edge bleed cards, shrink cluster */
//         @media (max-width: 900px) {
//           .twc-hero {
//             min-height: 360px;
//           }
//           .twc-img-card {
//             width: 100px;
//             height: 95px;
//           }
//           .twc-img-card--edge {
//             display: none;
//           }
//           .twc-cluster__row:last-child .twc-img-card {
//             width: 90px;
//             height: 85px;
//           }
//         }

//         /* Mobile (≤ 640 px) — stack vertically */
//         @media (max-width: 640px) {
//           .twc-hero {
//             flex-direction: column;
//             gap: 28px;
//             padding: 32px 16px;
//             min-height: unset;
//           }

//           .twc-cluster {
//             flex-direction: row;
//             width: 100%;
//             overflow-x: auto;
//             gap: 10px;
//             padding: 0 4px;
//           }
//           .twc-cluster__row {
//             flex-direction: column;
//             gap: 10px;
//             flex-shrink: 0;
//           }
//           .twc-img-card {
//             width: 100px;
//             height: 90px;
//           }
//           .twc-img-card--edge {
//             display: none;
//           }
//           .twc-cluster__row:last-child .twc-img-card {
//             width: 90px;
//             height: 80px;
//           }

//           .twc-center {
//             padding: 0 8px;
//           }

//           .twc-wordmark {
//             margin-bottom: -14px;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }





import React from "react";
import Link from "next/link";
export default function Hero() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="contain-hero">
              <div className="hero-content">
            <p className="hero-subtitle">
              Your Dream Destination Just One Click away
            </p>
            <h1 className="hero-title">
              <span className="highlight">Flat 20% Off</span> on Your First Tour
              Package!
            </h1>

            <img src="/assets/images/hero/horizontal.svg" className="mobile-none"></img>

          
            <button className="cta-button interactive" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">
              Request A Call back
            </button>
          </div>
          <div class="stats-container">
          <div class="stat-item">
            <div class="stat-icon">
              <img src="/assets/images/icons/home/icon1.svg" alt="Experience icon"/>
            </div>
            <div class="stat-content">
              <h3>10+</h3>
              <p>Years of Expertise</p>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <img src="/assets/images/icons/home/icon2.svg" alt="Clients icon"/>
            </div>
            <div class="stat-content">
              <h3>5000+</h3>
              <p>Happy Clients</p>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <img src="/assets/images/icons/home/icon3.svg" alt="Hotels icon"/>
            </div>
            <div class="stat-content">
              <h3>500+</h3>
              <p>Hotel Collaboration</p>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <img src="/assets/images/icons/home/icon4.svg" alt="Destinations icon"/>
            </div>
            <div class="stat-content">
              <h3>50+</h3>
              <p>Destinations</p>
            </div>
          </div>
          <div class="stat-item mobile-none">
            <img src="/assets/images/icons/home/review.svg" alt="Google Reviews" />
            <div class="stat-content">
              <h3>4.9 Reviews</h3>
              <p>Customer  Reviews</p>
            </div>
          </div>
          </div>
          </div>
        </div>

       
      </section>
    </>
  );
}
