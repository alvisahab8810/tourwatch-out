import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/international-destination/Hero'
import Destination from '../components/international-destination/Destination'
import Help from '../components/corporate/Help'
import Reviews from '../components/corporate/Reviews'
import Popup from '../components/corporate/Popup'

export default function internationaldestination() {
  return (
    <div id='international-main'>
       <Topbar/>
       <Hero/>
       <Destination/>
       <Help/>
       <Reviews/>
       <Popup/>
       <Footer/>
    </div>
  )
}
