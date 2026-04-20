import React from 'react'
import Topbar from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import Hero from '../../components/international-destination/Hero'
import Destination from '../../components/international-destination/Destination'
import Reviews from '../../components/corporate/Reviews'
import Popup from '../../components/corporate/Popup'
import Offcanvas from '../../components/header/Offcanvas'
import Help from '../../components/corporate/Help'
import { readAll } from '../../utils/destStore'

export default function InternationalDestination({ destinations }) {
  return (
    <div id='international-main'>
      <Topbar />
      <Offcanvas />
      <Hero />
      <Destination destinations={destinations} />
      <Help />
      <Reviews />
      <Popup />
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const all = readAll()
    const destinations = all.filter(d => d.type === 'international' && d.status === 'Active')
    return { props: { destinations } }
  } catch {
    return { props: { destinations: [] } }
  }
}
