import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/corporate/Hero'
import Usp from '../components/corporate/Usp'
import NatInt from '../components/corporate/NatInt'
import Help from '../components/corporate/Help'
import Reviews from '../components/corporate/Reviews'
import Popup from '../components/corporate/Popup'

export default function corporate() {
  return (
    <div id='international-main'>
    <Topbar/>
     <Hero/>
     <Usp/>
     <NatInt/>
     <Help/>
     <Reviews/>
     <Popup/>

    <Footer/>
    </div>
  )
}
