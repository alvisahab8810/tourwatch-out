import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/about/Hero'
import OurStory from '../components/about/OurStory'
import Rtcu from '../components/home/Rtcu'
import Kashmircta from '../components/about/Kashmircta'
import HelpingSection from '../components/about/HelpingSection'
import AbHww from '../components/about/AbHww'
import Instagram from '../components/home/Instagram'
import Popup from '../components/corporate/Popup'
import Offcanvas from '../components/header/Offcanvas'

export default function about() {
  return (
    <>
        <Topbar/>
        <Offcanvas/>
         <Hero/>
         <OurStory/>
         <Rtcu/>
         <Kashmircta/>
         <HelpingSection/>
         <AbHww/>
         <Instagram/>
         <Footer/>
         <Popup/>

    </>
  )
}
