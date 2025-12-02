import React from 'react'
import Topbar from '../../components/header/Header'
import Offcanvas from '../../components/header/Offcanvas'
import Hero from '../../components/dubai-family-itinerary/Hero'
import PackageDetailsTabs from '../../components/dubai-family-itinerary/PackageDetailsTabs'

export default function DubaiFamily() {
  return (
    <div className='dubai-family-package'>
        <Topbar/>
        <Offcanvas/>
        <Hero/>
        <PackageDetailsTabs/>

    </div>
  )
}
