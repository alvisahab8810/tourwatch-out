import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/honeymoon/Hero'
import Usp from '../components/honeymoon/Usp'
import NatInt from '../components/honeymoon/NatInt'
import Cta from '../components/honeymoon/Cta'
import Popup from '../components/corporate/Popup'
import Reviews from '../components/corporate/Reviews'
import Offcanvas from '../components/header/Offcanvas'
import NewFooter from '../components/footer/NewFooter'

export default function honeymoon() {
  return (
    <div className='bg-prime' id='honeymoon-main'>
      <Topbar/>
       <Offcanvas/>
       <Hero/>
       <Usp/>
       <NatInt/>
       <Cta/>
       <Reviews/>
       <Popup/>
      {/* <Footer/> */}
      <NewFooter/>
      
    </div>
  )
}
