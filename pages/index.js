// pages/index.js
import React from "react";
import CustomHead from "../components/CustomHead";
import Topbar from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Hero from "../components/home/Hero";
import Form from "../components/home/Form";
// import Hww from "../components/home/Hww";
import Testimonials from "../components/home/Testimonials";
// import Rtcu from "../components/home/Rtcu";
// import About from "../components/home/About";
import Destination from "../components/home/Destination";
// import CTA from "../components/home/CTA";
// import Help from "../components/home/Help";
import Faq from "../components/home/Faq";
// import Fcta from "../components/home/Fcta";
import NationalDestination from "../components/home/NationalDestination";
import InterNational from "../components/home/InterNational";
import Instagram from "../components/home/Instagram";
import Kashmircta from "../components/home/Kashmircta";
import Projects from "../components/home/Projects";
import Popup from "../components/corporate/Popup";
import Offcanvas from "../components/header/Offcanvas";
import Help from "../components/corporate/Help";
import OnloadPopup from "../components/home/OnloadPopup";
import Stripe from "../components/home/Stripe";
import WhatMakeus from "../components/home/WhatMakeus";
import BenifitSection from "../components/home/BenifitSection";
import PromoSection from "../components/home/PromoSection";
import TopReviews from "../components/home/TopReviews";
import MostPopular from "../components/home/MostPopular";
import FAQs from "../components/home/FAQs";
import BottomReviews from "../components/home/BottomReviews";
import Blogs from "../components/home/Blogs";
import NewFooter from "../components/footer/NewFooter";
import BottomReviewsMobile from "../components/home/BottomReviewsMobile";

export default function IndexPage({ data }) {
  return (
    <section id="home" className="bg-prime">
      <CustomHead
        title="Tourwatchout"
        keywords=""
        description="#"
      />
      <Topbar/>
      <Offcanvas/>
      <Hero/>

        <div className="desktop-none mobile-g-reviews">
           <div class="stat-item">
            <img src="/assets/images/icons/home/review-mob.svg" alt="Google Reviews" />
            <div class="stat-content">
              <h3>4.5 Google Reviews</h3>
              <p>675 Google Reviews</p>
            </div>
          </div>
      </div>
      <WhatMakeus/>
      <BenifitSection/>

      <PromoSection/>
      {/* <Stripe/>x */}
      {/* <Form/> */}
      {/* <Hww/> */}
      {/* <Projects/> */}
       <InterNational/>
      <NationalDestination/>


      <TopReviews/>
      <BottomReviewsMobile/>

     
      {/* <Testimonials/> */}
      <Instagram/>
      {/* <Kashmircta/> */}

      <PromoSection/>

      <MostPopular/>


      <FAQs/>

      <BottomReviews/>


      <Blogs/>



      {/* <Help/> */}
      {/* <Faq/> */}
      <Popup/>
      {/* <OnloadPopup/> */}
     {/* <Footer/> */}
     <NewFooter/>
    </section>
  );
}
