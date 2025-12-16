import React from 'react'
import Topbar from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Hero from '../components/contact/Hero'
import ContactForm from '../components/contact/ContactForm'
import Cta from '../components/contact/Cta'
import Popup from '../components/corporate/Popup'
import Offcanvas from '../components/header/Offcanvas'
import NewFooter from '../components/footer/NewFooter'

export default function ContactUs() {
  return (
    <div className="contact-us-page">
    <Topbar/>
    <Offcanvas/>
    <Hero/>
    <ContactForm/>
    {/* <Cta/> */}
    <Popup/>
    {/* <Footer/> */}
    <NewFooter/>
      
    </div>
  )
}
