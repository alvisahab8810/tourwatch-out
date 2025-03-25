import React from 'react'
import Topbar from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import Hero from '../../components/international-destination/Hero'
import Destination from '../../components/international-destination/Destination'
import Reviews from '../../components/corporate/Reviews'
import Popup from '../../components/corporate/Popup'

import Offcanvas from '../../components/header/Offcanvas'
import Help from '../../components/corporate/Help'

export default function internationaldestination() {
  return (
    <div id='international-main'>
       <Topbar/>
       <Offcanvas/>
       <Hero/>
       <Destination/>
       <Help/>
       <Reviews/>
       <Popup/>
       <Footer/>
    </div>
  )
}
