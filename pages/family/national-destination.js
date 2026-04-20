import React from 'react'
import Topbar from '../../components/header/Header'
import Hero from '../../components/national-destination/Hero'
import Destination from '../../components/national-destination/Destination'
import Vacation from '../../components/national-destination/Vacation'
import Help from '../../components/corporate/Help'
import Reviews from '../../components/corporate/Reviews'
import Popup from '../../components/corporate/Popup'
import Offcanvas from '../../components/header/Offcanvas'
import NewFooter from '../../components/footer/NewFooter'
import { readAll } from '../../utils/destStore'

export default function NationalDestination({ destinations }) {
  return (
    <div id='national-destination'>
      <Topbar />
      <Offcanvas />
      <Hero />
      <Destination destinations={destinations} />
      <Vacation />
      <Help />
      <Reviews />
      <Popup />
      <NewFooter />
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const all = readAll()
    const destinations = all.filter(d => d.type === 'national' && d.status === 'Active')
    return { props: { destinations } }
  } catch {
    return { props: { destinations: [] } }
  }
}
