import React from 'react'
import Link from 'next/link'
export default function Footer() {
  return (
    <>
       <footer className="footer-area ptb-80">
            <div className="container footer">
                 <div className="row">
                    <div className="col-md-4">
                        <div className="logo"> <Link href="index.html" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"> <img src="./assets/images/logo.png" alt="Logo Image" /> </Link> </div>
                        <p className="footer-para"> We always provide the best<br/> service for our customers </p>
                        <div className="social-icons"> <Link href="#"> <i className="ri-whatsapp-line"></i> </Link> <Link href="#"> <i className="ri-instagram-line"></i>  </Link> <Link href="#"> <i className="ri-facebook-fill"></i> </Link> </div>
                    </div>
                    <div className="col-md-3 pl-100">
                        <h5> Popular </h5>
                        <ul>
                            <li> <Link href="#"> Dubai, Arab </Link> </li>
                            <li> <Link href="#"> London, Inggris </Link> </li>
                            <li> <Link href="#"> Cancun, Meksiko </Link> </li>
                            <li> <Link href="#"> Bali, Indonesia </Link> </li>
                        </ul>
                    </div>
                    <div className="col-md-3 pl-50">
                        <h5> Products </h5>
                        <ul>
                            <li> <Link href="#"> Packages </Link> </li>
                            <li> <Link href="#"> Tours </Link> </li>
                            <li> <Link href="#"> Hotels </Link> </li>
                        </ul>
                    </div>
                    <div className="col-md-2">
                        <h5> About Us </h5>
                        <ul>
                            <li> <Link href="#"> Why us? </Link> </li>
                            <li> <Link href="#"> Our team </Link> </li>
                            <li> <Link href="#"> Expet's blog </Link> </li>
                            <li> <Link href="#"> Contact us </Link> </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </>
  )
}
