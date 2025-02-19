import React from 'react'
import Hero from '../components/checkin/Hero'
import Footer from '../components/checkin/Footer'
import CheckInFamily from '../components/checkin/CheckinFamily'


export default function CheckinFam() {
  return (
    <div className='bg-prime'>
        <Hero/>
        <CheckInFamily/>
        <Footer/>
    </div>
  )
}
