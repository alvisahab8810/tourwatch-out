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

export default function IndexPage({ data }) {
  return (
    <section id="home" className="bg-prime">
      <CustomHead
        title="TourWatchout"
        keywords=""
        description="#"
      />
      <Topbar/>
      <Offcanvas/>
      <Hero/>
      <Stripe/>
      <Form/>
      {/* <Hww/> */}
      <Projects/>
      <NationalDestination/>
      <InterNational/>
      <Testimonials/>
      <Instagram/>
      {/* <Kashmircta/> */}
      <Help/>
      <Faq/>
      <Popup/>
      {/* <OnloadPopup/> */}
     <Footer/>
    </section>
  );
}
