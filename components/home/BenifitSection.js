import React from 'react'

export default function BenifitSection() {
  return (
        <section className="benefits-section">
      <div className="mini-container1">
        <div class="section-header"><h2 class="section-title">Why Book with us? </h2></div>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">

            <img src="/assets/icons/book1.svg" alt="Hassle-free Booking"/>
            </div>
            <span className="benefit-text">Hassle-free<br/>Booking</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <img src="/assets/icons/book2.svg" alt="Value For Money"/>
            </div>
            <span className="benefit-text">Value For<br/>Money</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <img src="/assets/icons/book3.svg" alt="Personalised Packages"/>
            </div>
            <span className="benefit-text">Personalised<br/>Packages</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <img src="/assets/icons/book4.svg" alt="24/7 Support"/>
            </div>
            <span className="benefit-text">24/7 Support<br/>During Trip</span>
          </div>
        </div>
      </div>
    </section>
  )
}
