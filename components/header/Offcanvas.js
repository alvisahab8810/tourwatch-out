import React from 'react'

export default function Offcanvas() {
  return (
    <>
           <div className="offcanvas mob-canvas offcanvas-start" tabindex="-1" id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel">
    <div className="offcanvas-header">
      <h5 className="offcanvas-title" id="offcanvasExampleLabel">
        <a href="index.html"
            className="d-flex align-items-center  mb-md-0 me-md-auto text-dark text-decoration-none desk-logo">
            <img src="./assets/images/logo.png" alt="Logo Image"/>
         </a>
      </h5>
      <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div className="offcanvas-body">
      <div className="mob-menus">
        <ul className=" nav nav-pills">
          <li className="nav-item"><a href="#" className="nav-link "> Home</a></li>
          <li className="nav-item"><a href="about-us.html" className="nav-link">Contact</a></li>
          <li className="nav-item"><a href="services.html" className="nav-link">Holiday</a></li>
          <li className="nav-item"><a href="gaellery.html" className="nav-link">Gallery</a></li>
          <li className="nav-item"><a href="contact-us.html" className="nav-link">Destination</a></li>
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
