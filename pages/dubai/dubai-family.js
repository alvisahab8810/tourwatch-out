import React from 'react'
import Topbar from '../../components/header/Header'
import Offcanvas from '../../components/header/Offcanvas'
import Hero from '../../components/dubai-family-itinerary/Hero'
import PackageDetailsTabs from '../../components/dubai-family-itinerary/PackageDetailsTabs'
import HeroMobile from '../../components/dubai-family-itinerary/HeroMobile'
import Popup from '../../components/corporate/Popup'

export default function DubaiFamily() {
  return (
    <div className='dubai-family-package'>
        <Topbar/>
        <Offcanvas/>
        <Hero/>
        <HeroMobile/>
        <PackageDetailsTabs/>
         <Popup/>

    </div>
  )
}
