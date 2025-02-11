import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/honeymoon/Hero'
import Usp from '../components/honeymoon/Usp'
import NatInt from '../components/honeymoon/NatInt'
import Cta from '../components/honeymoon/Cta'
import Popup from '../components/corporate/Popup'
import Reviews from '../components/corporate/Reviews'

export default function honeymoon() {
  return (
    <div className='bg-prime'>
      <Topbar/>
       <Hero/>
       <Usp/>
       <NatInt/>
       <Cta/>
       <Reviews/>
       <Popup/>
      <Footer/>
      
    </div>
  )
}
