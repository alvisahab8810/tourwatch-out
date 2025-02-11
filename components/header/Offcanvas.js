import React from 'react'
import Link from 'next/link'

export default function Offcanvas() {
  return (
    <>
           <div className="offcanvas mob-canvas offcanvas-start" tabindex="-1" id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel">
    <div className="offcanvas-header">
      <h5 className="offcanvas-title" id="offcanvasExampleLabel">
        <Link href="index.html"
            className="d-flex align-items-center  mb-md-0 me-md-auto text-dark text-decoration-none desk-logo">
            <img src="./assets/images/logo.png" alt="Logo Image"/>
         </Link>
      </h5>
      <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div className="offcanvas-body">
      <div className="mob-menus">
        <ul className=" nav nav-pills">
          <li className="nav-item"><Link href="#" className="nav-link "> Home</Link></li>
          <li className="nav-item"><Link href="about-us.html" className="nav-link">Contact</Link></li>
          <li className="nav-item"><Link href="services.html" className="nav-link">Holiday</Link></li>
          <li className="nav-item"><Link href="gaellery.html" className="nav-link">Gallery</Link></li>
          <li className="nav-item"><Link href="contact-us.html" className="nav-link">Destination</Link></li>
        </ul>
      </div>


      <div className="mob-social-mediabx">
        <ul>
          <li>
            <i className="ri-facebook-fill"></i>
          </li>
          <li>
            <i className="ri-twitter-x-line"></i>
          </li>
          <li>
            <i className="ri-instagram-line"></i>
          </li>

        </ul>

      </div>

    </div>
    </div>  
    </>
  )
}
