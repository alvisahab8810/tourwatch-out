"use client";




export default function Hero() {
  return (
   <div>
     <section className="twc-hero mobile-none">
      {/* ── Left image cluster ── */}
      <div className="twc-cluster twc-cluster--left" aria-hidden="true">
        <div className="twc-cluster__row">
           <img src="/assets/images/hero/left-side.png" alt="hero left side img"></img>
        </div>
      </div>

      {/* ── Centre content ── */}
      <div className="twc-center">
        <div className="twc-wordmark" aria-hidden="true">
          <span className="twc-wordmark__bg">Think</span><br/>
          <span className="twc-wordmark__script">Travel</span>
        </div>

        <h1 className="twc-brand">Tourwatchout</h1>

        <p className="twc-tagline">Your Dream Destination Just One Click away</p>

        <p className="twc-offer">
          <span className="twc-offer__highlight">Flat 20% Off</span>{" "}
          On Your First Tour Package!
        </p>


        <div className="horizontal-devider">
          <img src="/assets/images/hero/hd.svg" alt="horizontal devider"></img>
        </div>

        <button className="twc-cta" type="button" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">
          Request A Call back
        </button>
      </div>

      {/* ── Right image cluster ── */}
      <div className="twc-cluster twc-cluster--right" aria-hidden="true">
        <div className="twc-cluster__row">
           <img src="/assets/images/hero/right-side.png" alt="hero left side img"></img>
          
        </div>
      </div>

    
    </section>

     <div className="desktop-none">
      <section className="hero">
        <div className="container">
          <div className="contain-hero">

                  {/* ── Centre content ── */}
      <div className="twc-center">
        <div className="twc-wordmark" aria-hidden="true">
          <span className="twc-wordmark__bg">Think</span><br/>
          <span className="twc-wordmark__script">Travel</span>
        </div>

        <h1 className="twc-brand">Tourwatchout</h1>

      
      </div>
              <div className="hero-content">
            <p className="hero-subtitle">
              Your Dream Destination Just One Click away
            </p>
            <h1 className="hero-title">
              <span className="highlight">Flat 20% Off</span> on Your First Tour
              Package!
            </h1>

               <div className="horizontal-devider">
          <img src="/assets/images/hero/hd.svg" alt="horizontal devider"></img>
        </div>

          
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
     </div>
   </div>
  );
}





// import React from "react";
// import Link from "next/link";
// export default function Hero() {
//   return (
//     <>
//       <section className="hero">
//         <div className="container">
//           <div className="contain-hero">
//               <div className="hero-content">
//             <p className="hero-subtitle">
//               Your Dream Destination Just One Click away
//             </p>
//             <h1 className="hero-title">
//               <span className="highlight">Flat 20% Off</span> on Your First Tour
//               Package!
//             </h1>

//             <img src="/assets/images/hero/horizontal.svg" className="mobile-none"></img>

          
//             <button className="cta-button interactive" data-bs-toggle="modal"
//                     data-bs-target="#exampleModalCenter">
//               Request A Call back
//             </button>
//           </div>
//           <div class="stats-container">
//           <div class="stat-item">
//             <div class="stat-icon">
//               <img src="/assets/images/icons/home/icon1.svg" alt="Experience icon"/>
//             </div>
//             <div class="stat-content">
//               <h3>10+</h3>
//               <p>Years of Expertise</p>
//             </div>
//           </div>
//           <div class="stat-item">
//             <div class="stat-icon">
//               <img src="/assets/images/icons/home/icon2.svg" alt="Clients icon"/>
//             </div>
//             <div class="stat-content">
//               <h3>5000+</h3>
//               <p>Happy Clients</p>
//             </div>
//           </div>
//           <div class="stat-item">
//             <div class="stat-icon">
//               <img src="/assets/images/icons/home/icon3.svg" alt="Hotels icon"/>
//             </div>
//             <div class="stat-content">
//               <h3>500+</h3>
//               <p>Hotel Collaboration</p>
//             </div>
//           </div>
//           <div class="stat-item">
//             <div class="stat-icon">
//               <img src="/assets/images/icons/home/icon4.svg" alt="Destinations icon"/>
//             </div>
//             <div class="stat-content">
//               <h3>50+</h3>
//               <p>Destinations</p>
//             </div>
//           </div>
//           <div class="stat-item mobile-none">
//             <img src="/assets/images/icons/home/review.svg" alt="Google Reviews" />
//             <div class="stat-content">
//               <h3>4.9 Reviews</h3>
//               <p>Customer  Reviews</p>
//             </div>
//           </div>
//           </div>
//           </div>
//         </div>

       
//       </section>
//     </>
//   );
// }
