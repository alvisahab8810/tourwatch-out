import React from 'react'
import Link from 'next/link'

export default function ContactForm() {
  return (
    <>
           <section className="contact-form-section">
          <div className="container">
        <div className="row pt-100 flex-wrap-bx">
            <div className="col-md-6 c-leftbx">
                <h2>Get in Touch with Tourwatchout</h2>
                <p className="contact-para">Our team is dedicated to turning your travel aspirations into reality by crafting unforgettable journeys tailored to your unique preferences and passions. Whether you dream of exploring uncharted landscapes, immersing yourself in vibrant cultures, or simply finding a serene escape, we bring expertise, creativity, and care to every step of your adventure.</p>

                <div className="c-parent-bx">
                     <div className="contact-info d-flex align-items-center mb-3">
                    <i className="ri-phone-line"></i>
                    <div className="ms-3">
                        <h5>Phone</h5>
                        <p>+1 800-123-4567</p>
                    </div>
                </div>
                <div className="contact-info d-flex align-items-center mb-3">
                    <i className="ri-mail-line"></i>
                    <div className="ms-3">
                        <h5>Email</h5>
                        <p>support@voyagify.com</p>
                    </div>
                </div>
                </div>

                <div className="contact-info d-flex align-items-center mb-3">
                    <i className="ri-map-pin-line"></i>
                    <div className="ms-3">
                        <h5>Office Address</h5>
                        <p>123 Travel Lane, Adventure City, USA</p>
                    </div>
                </div>
                <div className="social-icons">
                    <h5>Follow Us on Social Media</h5>
                    <div className="social-icons1">
                        <Link href="#"><i className="ri-facebook-fill"></i></Link>
                        <Link href="#"><i className="ri-instagram-line"></i></Link>
                        <Link href="#"><i className="ri-mail-line"></i></Link>
                    </div>
                </div>
            </div>
            <div className="col-md-6 c-right-bx">
                <h2>Reach out to us today and let’s start the conversation!</h2>
                <p>Have questions, feedback, or need assistance with planning your next adventure? Get in touch with us today!</p>
                <div className="contact-form p-5">
                    <form>
                        <div className="mb-3">
                            <label for="fullName" className="form-label">Full Name</label>
                            <input type="text" className="form-control" id="fullName"/>
                        </div>
                        <div className="mb-3">
                            <label for="phoneNumber" className="form-label">Phone Number</label>
                            <input type="text" className="form-control" id="phoneNumber"/>
                        </div>
                        <div className="mb-3">
                            <label for="emailAddress" className="form-label">Email Address</label>
                            <input type="email" className="form-control" id="emailAddress"/>
                        </div>
                        <button type="submit" className="btn btn-block">Contact Us</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
     </section>
    </>
  )
}
