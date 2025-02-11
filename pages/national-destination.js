import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/national-destination/Hero'
import Destination from '../components/national-destination/Destination'
import Vacation from '../components/national-destination/Vacation'
import Help from '../components/corporate/Help'
import Reviews from '../components/corporate/Reviews'
import Popup from '../components/corporate/Popup'

export default function nationaldestination() {
  return (
    <div>
      <Topbar/>
       <Hero/>
       <Destination/>
       <Vacation/>
       <Help/>
       <Reviews/>
       <Popup/>
      <Footer/>
    </div>
  )
}
