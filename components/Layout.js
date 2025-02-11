// components/Layout.js
import React from 'react';
import Header from './header/Header';
// import Hero from './Hero';
import Specilalisation from './Specialisation';
import Works from './Works';
import Clients from './Clients';
import Trending from './Trending';
import Footer from './footer/Footer';
import Hero3 from './Hero3';
// import './ourIndustrySwiper.css';



const Layout = ({ children }) => {
  return (
    <>
      <section id="home">
        {/* <!---------------- Menu Section Codes Start From Here ---------------> */}
        <Header />

        <div class="business-enquiry open-btn">
          <a href="contact-us">
            <span>Get a Quote</span>
          </a>
        </div>

        <ul class="social-bx1">
          <li><a href="#"><i class="ri-instagram-fill"></i></a></li>
          <li><a href="#"><i class="ri-facebook-fill"></i></a></li>
          <li><a href="#"><img src="./themes/viralon/images/icons/twitter.png" alt="Twitter Icon" /></a></li>
          <li><a href="#"><i class="ri-linkedin-fill"></i></a></li>
          <li><a href="#">  <i class="ri-youtube-fill"></i></a></li>
        </ul>


        {/* <!---------------- Menu Section Codes End From Here ---------------> */}

        {/* <!---------------- Hero Section Codes Start From Here ---------------> */}
         {/* <Hero3/> */}
        {/* <!---------------- Hero Section Codes End From Here ---------------> */}


        {/* <!-- strip start here --> */}
        <div class="strip-section" >
          <h2 class="our-brands">your Brand{'\''}s BFF</h2>
        </div>
        {/* <!-- strip End here --> */}


        {/* <!-- Who Work With Section Start From Here --> */}

        <div class="container1">
          <div class="col-md-7 m-auto">
            <h2 class="text-center h2-h">WE ARE VIRALON</h2>
            <p class="text-dark text-center max-width600 pb-15">At Viralon, we believe in delivering exceptional client-centric solutions that build trust and deliver the best results. Turbocharge your digital presence and reap the rewards of the digital era. Crafting your online presence goes beyond mere necessity; it{'\''}s an art form, and we are dedicated to transforming each interaction into a masterpiece. For us, it{'\''}s a collaborative journey towards achieving digital excellence and raising the curtain on your brand{'\''}s digital transformation.</p>
          </div>
        </div>


        {/* <!-- Who Work With Section Start End Here --> */}


        {/* <!---------------- Our Specilalization Section Codes Start From Here ---------------> */}
        <Specilalisation />
        {/* Ended by Sachin J */}

        {/* <!---------------- Our Specilalization Section Codes End From Here ---------------> */}


        {/* <!---------------- Our Industry Section Codes Start From Here ---------------> */}

        <Works />
        <ourIndustrySwiper />
        <Clients />
        {/* <!---------------- Our Industry Section Codes End From Here ---------------> */}

        {/* <!---------------- Trending Section Codes Start From Here ---------------> */}
        <Trending />
        {/* <!---------------- Trending Section Codes End From Here ---------------> */}

        {/* <!---------------- Subscribe Section Codes Start From Here ---------------> */}
        <div class="subscribe-container" id="subscribe">
          <div class="container1">
            <div class="sub-bx2">
              <div>
                <h1 class="sub-heading">Subscribe Now</h1>
                <p class="sub-para">We won{'\''}t overburden you with annoying emails.</p>
                <div class="subbx">
                  <div class="emailbox">
                    <i class="ri-mail-line"></i>
                    <input type="email" class="form-control" placeholder="Enter your email" />
                  </div>
                  <div>
                    <div class="mdtop ui-btn studies-btn book-btn">
                      <a href="#" class="btn  btn-primary trans animated pulse abt-butn-bot">Subscribe<img src="./themes/viralon/images/icons/next.png" class="arrow  next-arow arrow1  animate-right-to-left" /></a>

                    </div>
                  </div>
                </div>
              </div>

              <div class="subs-img ">
                <img src="./themes/viralon/images/subscribe1.png" alt="Subscribe Image" class="gif" />
              </div>
            </div>
          </div>
        </div>
        {/* <!---------------- Subscribe Section Codes End From Here ---------------> */}

        {/* <!---------------- Footer Section Codes Start From Here ---------------> */}
        <Footer />
      </section>
    </>
  );
};

export default Layout;
