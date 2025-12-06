import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/corporate/Hero'
import Usp from '../components/corporate/Usp'
import NatInt from '../components/corporate/NatInt'
import Help from '../components/corporate/Help'
import Reviews from '../components/corporate/Reviews'
import Popup from '../components/corporate/Popup'
import Offcanvas from '../components/header/Offcanvas'
import NewFooter from '../components/footer/NewFooter'

export default function corporate() {
  return (
    <div id='corporate-main'>
    <Topbar/>
    <Offcanvas/>
     <Hero/>
     <Usp/>
     <NatInt/>
     <Help/>
     <Reviews/>
     <Popup/>

    {/* <Footer/> */}
    <NewFooter/>
    </div>
  )
}
