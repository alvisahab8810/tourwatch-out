import React from 'react'
import Link from 'next/link'
export default function NewFooter() {
  return (
    
      <footer className="footer">
    <div className="mini-container1">
      <div className="footer-content">
        <div className="footer-links">
          <div className="footer-column">
            <h3>National</h3>
            <ul>
              <li><a href="#">Kashmir</a></li>
              <li><a href="#">Leh Ladakh</a></li>
              <li><a href="#">Manali</a></li>
              <li><a href="#">Shimla</a></li>
              <li><a href="#">Dharamshala</a></li>
              <li><a href="#">Dehradun</a></li>
              <li><a href="#">Nanital</a></li>
            </ul>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-column">
            <h3>National</h3>
            <ul>
              <li><a href="#">Goa</a></li>
              <li><a href="#">Jim Corbett</a></li>
              <li><a href="#">Jaipur</a></li>
              <li><a href="#">North Sikkim</a></li>
              <li><a href="#">Lonavala & Khandala</a></li>
              <li><a href="#">Andaman</a></li>
            </ul>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-column">
            <h3>International</h3>
            <ul>
              <li><Link href="/dubai-package">Dubai - Abudhabi</Link></li>
              <li><a href="#">Bali</a></li>
              <li><a href="#">Thailand</a></li>
              <li><a href="#">Singapore</a></li>
              <li><a href="#">Malaysia</a></li>
            </ul>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-column">
            <h3>Explore</h3>
            <ul>
              <li><Link href="/about">Our Story</Link></li>
              <li><a href="#">Corporate</a></li>
              <li><a href="#">Honeymoon</a></li>
              <li><Link href="/contact-us">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className='footer-area1'>
          <div className="footer-copyright-divider"></div>
          <img src="/assets/images/icons/home/footer-logo.svg" alt="Tourwatchout Logo"/>
         
        <div className="footer-copyright-divider" ></div>
        </div>
        <p className="footer-copyright">Copyright © 2025 <span className="brand">Tourwatchout.</span> All Rights Reserved</p>
        
        <div className="footer-social">
         

              
                <Link href="https://www.instagram.com/tourwatchout/">
                   <img src="/assets/images/icons/home/instagram.svg" alt="Instagram"/>
                </Link>
                <Link href="https://www.facebook.com/TourWatchout/">
                    <img src="/assets/images/icons/home/facebook.svg" alt="Facebook"/>
                  
                </Link>

                <Link href="https://x.com/tourwatchout/status/1372176665351053313">
                 <img src="/assets/images/icons/home/twitter.svg" alt="Twitter"/>

                 </Link>

                 <Link href="https://in.linkedin.com/company/tourwatchout">
          <img src="/assets/images/icons/home/linkedin.svg" alt="LinkedIn"/>
          </Link>

                 <Link href="https://www.youtube.com/@Tourwatchout">

          <img src="/assets/images/icons/home/youtube.svg" alt="YouTube"/>

          </Link>
        </div>
        
        <p className="footer-legal">Copyright © 2025 <span className="brand">Tourwatchout.</span> All Rights Reserved</p>
        <p className="footer-disclaimer">The content and images used on this site are copyright protected and copyrights vests with the respective Owners. The usage Of the content and images on this website is intended to promote the works and no endorsement Of the artist Shall be implied. Unauthorized use is prohbited and punishable by law.</p>
        
        <div className="footer-policies">
          {/* <button className="">Privacy Policy</button> */}
          <Link href="/privacy-policy" className='policy-button interactive'> Privacy Policy </Link>

           <Link href="/term-and-conditions" className='policy-button interactive'>
                    {" "}
                    Term & Conditions
                  </Link>{" "}


                  <Link href="/refund-cancellation-policy" className='policy-button interactive'>
                    {" "}
                    Refund & Cancellation
                  </Link>{" "}
        </div>
      </div>
    </div>
  </footer>
  )
}
