import React, { useState } from "react";
import PromoSection1 from "../dubai-package/PromoSection1";
import DubaiFamilyNotes from "../dubai-package/DubaiFamilyNotes";
import WhyTourwatchout from "./WhyTourwatchout";
import SimiliarPackage from "./SimiliarPackage";
import BottomReviews from "../home/BottomReviews";
import FAQs from "../home/FAQs";
import Blogs from "../home/Blogs";
import NewFooter from "../footer/NewFooter";

const TABS = [
  {
    id: "economy",
    label: "Economy",
    price: "₹50,000",
    oldPrice: "₹80,000",
    icon: "/assets/images/dubai/itinerary/star.svg"
  },
  {
    id: "deluxe",
    label: "Deluxe",
    price: "₹75,000",
    oldPrice: "₹95,000",
    best: true,
       icon: "/assets/images/dubai/itinerary/stars.svg"

  },
  {
    id: "premium",
    label: "Premium",
    price: "₹1,20,000",
    oldPrice: "₹1,50,000",
        icon: "/assets/images/dubai/itinerary/starss.svg"

  }
];


export default function PackageDetailsTabs() {
  const [activeTab, setActiveTab] = useState("economy");
  const [openDay, setOpenDay] = useState(1);

  const active = TABS.find((t) => t.id === activeTab);

  return (
    <div className="package-details-page">
      <div className="container">
      <section className="package-details-tabs">
        {/* ---------------- TAB BUTTONS ---------------- */}
       <div className="pdt-tabs-row">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`pdt-tab ${activeTab === t.id ? "is-active" : ""}`}
              onClick={() => {
                setActiveTab(t.id);
                setOpenDay(1);
              }}
            >
              <img src={t.icon} alt={t.label} className="pdt-tab-icon" />
              <span className="pdt-tab-label">{t.label}</span>

              {t.best && <span className="pdt-best">BEST VALUE</span>}
            </button>
          ))}
       </div>


        <div className="pdt-content">
          {/* ---------------- LEFT SIDE CONTENT ---------------- */}
          {/* ---------------- LEFT SIDE CONTENT ---------------- */}
          <div className="pdt-left">
            {/* ===================== ECONOMY TAB ===================== */}
            {activeTab === "economy" && (
              <>
                <div className="pdt-header">
                  <h1 className="pdt-title">Economy Dubai Exploration</h1>
                  <div className="pdt-tag">3N / 4D</div>
                </div>

                <div className="location">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    stroke="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                  </svg>
                  <span>
                    • Zabeel Palace • Dubai Frame • Palm Jumeirah • Palm
                    Atlantis • Future of Museum • Dubai Creek • Dubai Mall.
                  </span>
                </div>


                   <div className="price-card desktop-none">
              <div className="prices-row">
                <div>
                  <div className="pc-top">
                <div className="pc-from">
                  Starting from{" "}
                  <span className="pc-old">{active.oldPrice}</span>
                </div>
              </div>

              <div className="pc-price">
                <div className="pc-amount">{active.price}</div>
                <div className="pc-note">per person on twin sharing</div>
              </div>
                </div>

                <div>
                    <img src="/assets/images/dubai/itinerary/it-banner.png" alt="dubai image"></img>
                </div>
              </div>
               <div className="price-card-cta">
                 <a href="#" className="pc-cta1">*Cancellation Policy</a>

              <button className="pc-cta">Request A Callback</button>
               </div>

            </div>


                <div className="pdt-banner">
                  <img
                    src="/assets/images/dubai/itinerary/banner.png"
                    alt="Economy Banner"
                  />
                  <div className="pdt-banner-chips">
                    <span className="chip left">
                      <img src="/assets/images/icons/itinerary/flight.svg" />{" "}
                      Flight Excluded
                    </span>
                    <span className="chip right">
                      Rating: 4.2{" "}
                      <img src="/assets/images/icons/itinerary/stars.svg" />
                    </span>
                  </div>
                </div>

                <div className="pdt-amenities">
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon1.svg" />
                    Meals
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon2.svg" />
                    Hotel
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon3.svg" />
                    Sightseeing
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon4.svg" />
                    WiFi
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon5.svg" />
                    Transport
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon6.svg" />
                    Local Guide
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon7.svg" />
                    Safe to Travel
                  </div>
                </div>

                <hr className="pdt-sep" />
                <h3 className="pdt-section-title">Itinerary</h3>

                {/* ---- ECONOMY ITINERARY (FULL) ---- */}
                <div className="pdt-itinerary">
                  {/* DAY 1 */}
                  <div className={`it-day ${openDay === 1 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 1 ? null : 1)}
                    >
                      <div className="it-day-pill">Day 1</div>
                      <div className="it-day-title">Arrival at Dubai & Creek Dhow Cruise </div>
                      <div className="it-day-arrow">
                        {openDay === 1 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 1 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Arrival  at Airport and Airport Pickup
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Hotel Check-in and Rest
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Visit Dhow Cruise with Buffet Dinner 
                          
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay 
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 2 */}
                  <div className={`it-day ${openDay === 2 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 2 ? null : 2)}
                    >
                      <div className="it-day-pill">Day 2</div>
                      <div className="it-day-title">Half Day City Tour, Burj Khalifa  & Dubai Mall</div>
                      <div className="it-day-arrow">
                        {openDay === 2 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 2 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Breakfast in the morning at Hotel
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Explore Dubai City Tour - Burj Al Arab Hotel, the Palm Islands, Dubai Creek and many more
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Drop at Dubai Mall for shopping and indoor activities
                          </li>

                            <li>
                            <span className="it-icon">▸</span> Evening Visit at Burj Khalifa's observation deck on the 124th and 125th floors (Non- Prime hrs)
                          </li>

                            <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay 
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 3 */}
                  <div className={`it-day ${openDay === 3 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 3 ? null : 3)}
                    >
                      <div className="it-day-pill">Day 3</div>
                      <div className="it-day-title">Desert Safari Experience with BBQ Dinner</div>
                      <div className="it-day-arrow">
                        {openDay === 3 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 3 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Breakfast in the morning at Hotel
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Get - Set - Go for afternoon Desert Safari by 4*4 vechicle
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Enjoy evening Tanuara and fire Show followed by BBQ Dinner
                            
                          </li>

                           <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay 
                            
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 4 */}
                  <div className={`it-day ${openDay === 4 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 4 ? null : 4)}
                    >
                      <div className="it-day-pill">Day 4</div>
                      <div className="it-day-title">Depart from Dubai</div>
                      <div className="it-day-arrow">
                        {openDay === 4 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 4 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Morning after breakfast,  you will be transferred to airport for your flight back home
                          </li>
                       
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ===================== DELUXE TAB ===================== */}
            {activeTab === "deluxe" && (
              <>
                <div className="pdt-header">
                  <h1 className="pdt-title">Deluxe Dubai Exploration</h1>
                  <div className="pdt-tag">4N / 5D</div>
                </div>

                <div className="location">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    stroke="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                  </svg>
                  <span>
                    • Zabeel Palace • Dubai Frame • Palm Jumeirah • Palm
                    Atlantis • Future of Museum • Dubai Creek • Dubai Mall.
                  </span>
                </div>

                <div className="pdt-banner">
                  <img
                    src="/assets/images/dubai/itinerary/banner.png"
                    alt="Economy Banner"
                  />
                  <div className="pdt-banner-chips">
                    <span className="chip left">
                      <img src="/assets/images/icons/itinerary/flight.svg" />{" "}
                      Flight Excluded
                    </span>
                    <span className="chip right">
                      Rating: 4.2{" "}
                      <img src="/assets/images/icons/itinerary/stars.svg" />
                    </span>
                  </div>
                </div>

                <div className="pdt-amenities">
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon1.svg" />
                    Meals
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon2.svg" />
                    Hotel
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon3.svg" />
                    Sightseeing
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon4.svg" />
                    WiFi
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon5.svg" />
                    Transport
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon6.svg" />
                    Local Guide
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon7.svg" />
                    Safe to Travel
                  </div>


                   

                {/* ---- ECONOMY ITINERARY (FULL) ---- */}
               
                </div>



                 <div className="pdt-itinerary">
                      <hr className="pdt-sep" />
                <h3 className="pdt-section-title">Itinerary</h3>
                  {/* DAY 1 */}
                  <div className={`it-day ${openDay === 1 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 1 ? null : 1)}
                    >
                      <div className="it-day-pill">Day 1</div>
                      <div className="it-day-title">Arrival at Dubai & Creek Dhow Cruise </div>
                      <div className="it-day-arrow">
                        {openDay === 1 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 1 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Arrival  at Airport and Pickup
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Check-in at Hotel
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Visit Evening Dhow Cruise with Buffet Dinner 
                          
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay 
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 2 */}
                  <div className={`it-day ${openDay === 2 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 2 ? null : 2)}
                    >
                      <div className="it-day-pill">Day 2</div>
                      <div className="it-day-title">Half Day City Tour, Burj Khalifa  & Dubai Mall</div>
                      <div className="it-day-arrow">
                        {openDay === 2 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 2 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Breakfast at Hotel
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Explore Dubai City Tour like Future Museum , The Palm Islands, Dubai Creek and many more
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Drop at Dubai Mall for shopping and indoor activities at own
                          </li>

                            <li>
                            <span className="it-icon">▸</span> Evening Visit at Burj Khalifa's 124th and 125th floor
                          </li>

                          
                            <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay 
                          </li>

                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 3 */}
                  <div className={`it-day ${openDay === 3 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 3 ? null : 3)}
                    >
                      <div className="it-day-pill">Day 3</div>
                      <div className="it-day-title">Desert Safari Experience with BBQ Dinner</div>
                      <div className="it-day-arrow">
                        {openDay === 3 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 3 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Breakfast  at Hotel
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Get - Set - Go for afternoon Desert Safari by 4*4 vechicle
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Enjoy evening Tanuara and fire Show followed by BBQ Dinner
                            
                          </li>

                           <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay  
                            
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 4 */}
                  <div className={`it-day ${openDay === 4 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 4 ? null : 4)}
                    >
                      <div className="it-day-pill">Day 4</div>
                      <div className="it-day-title">Day at Leisure</div>
                      <div className="it-day-arrow">
                        {openDay === 4 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 4 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Breakfast at Hotel
                          </li>

                              <li>
                            <span className="it-icon">▸</span> Leisure day free for shopping or optional activities on your own
                          </li>
                       
                             <li>
                            <span className="it-icon">▸</span> Overnight stay.
                          </li>
                        </ul>
                      </div>
                    )}



                    
                  </div>


                    {/* DAY 5 */}
                  <div className={`it-day ${openDay === 5 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 5 ? null : 5)}
                    >
                      <div className="it-day-pill">Day 5</div>
                      <div className="it-day-title">Depart from Dubai</div>
                      <div className="it-day-arrow">
                        {openDay === 5 ? "˄" : "˅"}
                      </div>
                    </button>

                 


                     {openDay === 5 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Morning after breakfast,  you will be transferred to the airport for your flight back home
                          </li>

                          
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ===================== PREMIUM TAB ===================== */}
            {activeTab === "premium" && (
              <>
                <div className="pdt-header">
                  <h1 className="pdt-title">Premium Dubai Luxury Tour</h1>
                  <div className="pdt-tag">4N / 5D</div>
                </div>

                  <div className="location">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    stroke="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                  </svg>
                  <span>
                    • Zabeel Palace • Dubai Frame • Palm Jumeirah • Palm
                    Atlantis • Future of Museum • Dubai Creek • Dubai Mall.
                  </span>
                </div>

                <div className="pdt-banner">
                  <img
                    src="/assets/images/dubai/itinerary/banner.png"
                    alt="Economy Banner"
                  />
                  <div className="pdt-banner-chips">
                    <span className="chip left">
                      <img src="/assets/images/icons/itinerary/flight.svg" />{" "}
                      Flight Excluded
                    </span>
                    <span className="chip right">
                      Rating: 4.2{" "}
                      <img src="/assets/images/icons/itinerary/stars.svg" />
                    </span>
                  </div>
                </div>

                <div className="pdt-amenities">
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon1.svg" />
                    Meals
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon2.svg" />
                    Hotel
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon3.svg" />
                    Sightseeing
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon4.svg" />
                    WiFi
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon5.svg" />
                    Transport
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon6.svg" />
                    Local Guide
                  </div>
                  <div className="amenity">
                    <img src="/assets/images/icons/itinerary/icon7.svg" />
                    Safe to Travel
                  </div>


                   

                {/* ---- ECONOMY ITINERARY (FULL) ---- */}
               
                </div>



                 <div className="pdt-itinerary">
                      <hr className="pdt-sep" />
                <h3 className="pdt-section-title">Itinerary</h3>
                  {/* DAY 1 */}
                  <div className={`it-day ${openDay === 1 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 1 ? null : 1)}
                    >
                      <div className="it-day-pill">Day 1</div>
                      <div className="it-day-title">Arrival at Dubai & Creek Dhow Cruise  </div>
                      <div className="it-day-arrow">
                        {openDay === 1 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 1 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Arrival  at Airport and Pickup
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Check-in at Hotel
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Visit Evening Dhow Cruise with Buffet Dinner 
                          
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay  
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 2 */}
                  <div className={`it-day ${openDay === 2 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 2 ? null : 2)}
                    >
                      <div className="it-day-pill">Day 2</div>
                      <div className="it-day-title">Half Day City Tour, Burj Khalifa  & Dubai Mall</div>
                      <div className="it-day-arrow">
                        {openDay === 2 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 2 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Breakfast at Hotel
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Explore Dubai City Tour like Future Museum , The Palm Islands, Dubai Creek and many more
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Drop at Dubai Mall for shopping and indoor activities at own
                          </li>

                            <li>
                            <span className="it-icon">▸</span> Evening Visit at Burj Khalifa's 124th and 125th floor
                          </li>

                          
                            <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay 
                          </li>

                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 3 */}
                  <div className={`it-day ${openDay === 3 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 3 ? null : 3)}
                    >
                      <div className="it-day-pill">Day 3</div>
                      <div className="it-day-title">Desert Safari Experience with BBQ Dinner</div>
                      <div className="it-day-arrow">
                        {openDay === 3 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 3 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Breakfast at Hotel
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Get - Set - Go for afternoon Desert Safari by 4*4 vechicle
                          </li>
                          <li>
                            <span className="it-icon">▸</span> Enjoy evening Tanuara and fire Show followed by BBQ Dinner
                            
                          </li>

                           <li>
                            <span className="it-icon">▸</span> Hotel Return & Overnight stay 
                            
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* DAY 4 */}
                  <div className={`it-day ${openDay === 4 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 4 ? null : 4)}
                    >
                      <div className="it-day-pill">Day 4</div>
                      <div className="it-day-title">Abu Dhabi and Ferrari World </div>
                      <div className="it-day-arrow">
                        {openDay === 4 ? "˄" : "˅"}
                      </div>
                    </button>

                    {openDay === 4 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> Breakfast at Hotel
                          </li>

                              <li>
                            <span className="it-icon">▸</span> Excursion Abu Dhabi like Sheikh Zayed Grand Mosque, Emirates place soundings, Heritage Village and many more.
                          </li>
                       
                             <li>
                            <span className="it-icon">▸</span> Ferrari World 
                          </li>

                          
                             <li>
                            <span className="it-icon">▸</span> Overnight stay.
                          </li>

                          
                        </ul>
                      </div>
                    )}



                    
                  </div>


                    {/* DAY 5 */}
                  <div className={`it-day ${openDay === 5 ? "open" : ""}`}>
                    <button
                      className="it-day-header"
                      onClick={() => setOpenDay(openDay === 5 ? null : 5)}
                    >
                      <div className="it-day-pill">Day 5</div>
                      <div className="it-day-title">Depart from Dubai</div>
                      <div className="it-day-arrow">
                        {openDay === 5 ? "˄" : "˅"}
                      </div>
                    </button>

                 


                     {openDay === 5 && (
                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span> After breakfast,  you will be transferred to the airport for your flight back home</li>

                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ------------------- RIGHT COLUMN ------------------- */}
          <aside className="pdt-right">
            <div className="price-card mobile-none">
              <div className="prices-row">
                <div>
                  <div className="pc-top">
                <div className="pc-from">
                  Starting from{" "}
                  <span className="pc-old">{active.oldPrice}</span>
                </div>
              </div>

              <div className="pc-price">
                <div className="pc-amount">{active.price}</div>
                <div className="pc-note">per person on twin sharing</div>
              </div>
                </div>

                <div>
                    <img src="/assets/images/dubai/itinerary/it-banner.png" alt="dubai image"></img>
                </div>
              </div>

              <button className="pc-cta">Request A Callback</button>
            </div>

            <div className="enquiry-card  mobile-none">
              <div className="enq-badge">
                <span className="offer">Flat 20% </span>Off On Your First Tour
                Package!
              </div>

              <p className="query-form-heading">
                Your Dream Destination Just One Click away
              </p>
              <form className="enq-form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Full Name" />
                <input type="text" placeholder="Destination" />
                <div className="enq-phone">
                  <select>
                    <option value="+91">+91</option>
                  </select>
                  <input type="tel" placeholder="0000 0000 00" />
                </div>
                <input type="email" placeholder="Email" />
                <button className="enq-submit">Request A Callback</button>
              </form>
            </div>
          </aside>
        </div>

      <PromoSection1/>

      <DubaiFamilyNotes activeTab={activeTab} />


      <WhyTourwatchout/>

      <SimiliarPackage/>

      <BottomReviews/>

      <PromoSection1/>

      <FAQs/>

      <Blogs/>


      
      </section>
    </div>

      <NewFooter/>
    </div>

  );
}
