import React from "react";
import Hero from "../components/dubai-package/Hero";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
import WhatMakeus from "../components/dubai-package/WhatMakes";
import FamilyDubaiPackages from "../components/dubai-package/FamilyDubaiPackages";
import BenifitSection from "../components/dubai-package/BenifitSection";
import CoupleDubaiPackages from "../components/dubai-package/CoupleDubaiPackages";
import TopReviews from "../components/home/TopReviews";
import PromoSection from "../components/home/PromoSection";
import MostPopular from "../components/home/MostPopular";
import FAQs from "../components/home/FAQs";
import Blogs from "../components/home/Blogs";
import BottomReviews from "../components/home/BottomReviews";
import Popup from "../components/corporate/Popup";
import NewFooter from "../components/footer/NewFooter";
import DubaiFamilyNotes from "../components/dubai-package/DubaiFamilyNotes";

export default function DubaiPackage() {
  return (
    <div className="dubai-packages">
      <Topbar />
      <Offcanvas />

      <Hero />
      <WhatMakeus />
      <BenifitSection />
      <FamilyDubaiPackages />
      <CoupleDubaiPackages />

      <TopReviews />
      <PromoSection />
      {/* <DubaiFamilyNotes/> */}
      <MostPopular />
      <FAQs />
      <Blogs />

      <BottomReviews />

      <Popup />

      <NewFooter />
    </div>
  );
}
