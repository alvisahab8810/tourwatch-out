// import React, { useState } from "react";

// export default function DubaiFamilyNotes() {
//   const [open, setOpen] = useState({
//     inclusions: false,
//     about: true,
//     bucket: false,
//     cancellation: false
//   });

//   function toggle(key) {
//     setOpen({
//       inclusions: false,
//       about: false,
//       bucket: false,
//       cancellation: false,
//       [key]: !open[key] // toggle clicked
//     });
//   }

//   return (
//     <div className="dubai-family-notes" aria-live="polite">
//       <div className="dfn-accordion">

//         {/* Inclusions & Exclusions */}
//         <div className="dfn-section">
//           <button
//             className="dfn-section-header"
//             onClick={() => toggle("inclusions")}
//             aria-expanded={open.inclusions}
//             aria-controls="inclusions-panel"
//           >
//             <span className="dfn-pill">Inclusions &amp; Exclusions</span>

//             {/* ARROW ICON */}
//             <span
//               className="faq-icon"
//               style={{
//                 display: "inline-block",
//                 transform: open.inclusions ? "rotate(-90deg)" : "rotate(90deg)",
//                 transition: "0.3s ease",
//                 fontSize: "20px",
//                                 fontFamily: "DM Sans "

//               }}
//             >
//               &gt;
//             </span>
//           </button>

//           {open.inclusions && (
//             <div id="inclusions-panel" className="dfn-panel">
//               <p>Includeyour package details here — transfer, meals, sightseeing etc.</p>
//             </div>
//           )}
//         </div>

//         {/* About Dubai */}
//         <div className="dfn-section">
//           <button
//             className="dfn-section-header"
//             onClick={() => toggle("about")}
//             aria-expanded={open.about}
//             aria-controls="about-panel"
//           >
//             <span className="dfn-pill">About Dubai</span>

//             {/* ARROW ICON */}
//             <span
//               className="faq-icon"
//               style={{
//                 display: "inline-block",
//                 transform: open.about ? "rotate(-90deg)" : "rotate(90deg)",
//                 transition: "0.3s ease",
//                 fontSize: "20px",
//                                 fontFamily: "DM Sans "

//               }}
//             >
//               &gt;
//             </span>
//           </button>

//           {open.about && (
//             <div id="about-panel" className="dfn-panel dfn-about">
//               <div className="dfn-left-line" aria-hidden="true"></div>

//               <div className="dfn-content">
//                 <div className="dfn-intro">
//                   <img
//                     src="/assets/images/dubai/icons/info-circle.svg"
//                     alt="Dubai info icons"
//                     className="info-icon"
//                   />
//                   <div>
//                     <h3>Dubai: A Modern Marvel in the Heart of the Desert</h3>
//                     <p>
//                       Rising from the golden sands of the Arabian Peninsula,
//                       Dubai is a city where futuristic innovation meets rich heritage.
//                       Known for its iconic skyline, luxury lifestyle, and vibrant culture,
//                       Dubai has rapidly transformed into one of the world’s most sought-after travel destinations.
//                     </p>
//                   </div>
//                 </div>

//                 <section>
//                   <h4>Architectural Wonders</h4>
//                   <p>
//                     Dubai’s skyline is a testament to human ambition and creativity.
//                     The Burj Khalifa, the tallest building in the world, offers breathtaking panoramic views.
//                   </p>
//                 </section>

//                 <section>
//                   <h4>Desert Adventures</h4>
//                   <p>
//                     Beyond the city’s glittering facade lies the serene expanse of the Arabian Desert.
//                   </p>
//                 </section>

//                 <section>
//                   <h4>Cultural Blend</h4>
//                   <p>
//                     Dubai’s soul lies in its unique blend of modernity and tradition.
//                   </p>
//                 </section>

//                 <section>
//                   <h4>Culinary Excellence</h4>
//                   <p>
//                     Dubai is a haven for food lovers with Michelin-starred restaurants and authentic Emirati eateries.
//                   </p>
//                 </section>

//                 <section>
//                   <h4>Experiences for Every Traveler</h4>
//                   <p>
//                     From beaches to malls to skydiving — Dubai offers something for everyone.
//                   </p>
//                 </section>

//                 <section>
//                   <h4>Best Time to Visit</h4>
//                   <p>
//                     November to March is ideal for good weather and outdoor activities.
//                   </p>
//                 </section>

//                 {/* Highlights */}
//                 <div className="dfn-highlights-title">
//                   <img
//                     src="/assets/images/dubai/icons/property-icon.svg"
//                     alt="dubai property icon"
//                   />
//                   <strong>Some highlights</strong>
//                 </div>

//                 <div className="dfn-highlights">
//                   <img
//                     src="/assets/images/dubai/icons/card1.png"
//                     alt="dubai highlights"
//                   />
//                   <img
//                     src="/assets/images/dubai/icons/card2.png"
//                     alt="dubai highlights two"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Dubai Bucket List */}
//         <div className="dfn-section">
//           <button
//             className="dfn-section-header"
//             onClick={() => toggle("bucket")}
//             aria-expanded={open.bucket}
//             aria-controls="bucket-panel"
//           >
//             <span className="dfn-pill">Dubai Bucket List</span>

//             {/* ARROW ICON */}
//             <span
//               className="faq-icon"
//               style={{
//                 display: "inline-block",
//                 transform: open.bucket ? "rotate(-90deg)" : "rotate(90deg)",
//                 transition: "0.3s ease",
//                 fontSize: "20px",
//                 fontFamily: "DM Sans "

//               }}
//             >
//               &gt;
//             </span>
//           </button>

//           {open.bucket && (
//             <div id="bucket-panel" className="dfn-panel">
//               <ul>
//                 <li>Visit Burj Khalifa observation deck</li>
//                 <li>Desert safari with BBQ and shows</li>
//                 <li>Explore Dubai Mall & Aquarium</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Cancellation Policy */}
//         <div className="dfn-section">
//           <button
//             className="dfn-section-header"
//             onClick={() => toggle("cancellation")}
//             aria-expanded={open.cancellation}
//             aria-controls="cancel-panel"
//           >
//             <span className="dfn-pill">Cancellation Policy</span>

//             {/* ARROW ICON */}
//             <span
//               className="faq-icon"
//               style={{
//                 display: "inline-block",
//                 transform: open.cancellation ? "rotate(-90deg)" : "rotate(90deg)",
//                 transition: "0.3s ease",
//                 fontSize: "20px",
//                 fontFamily: "DM Sans "
//               }}
//             >
//               &gt;
//             </span>
//           </button>

//           {open.cancellation && (
//             <div id="cancel-panel" className="dfn-panel">
//               <p>
//                 Free cancellation up to 7 days before departure. Charges apply after that.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";

export default function DubaiFamilyNotes({ activeTab = "economy" }) {
  const [open, setOpen] = useState({
    inclusions: false,
    about: true,
    bucket: false,
    cancellation: false
  });

  // Reset accordion when tab changes (keeps "about" open by default)
  useEffect(() => {
    setOpen({
      inclusions: false,
      about: true,
      bucket: false,
      cancellation: false
    });
  }, [activeTab]);

  function toggle(key) {
    setOpen({
      inclusions: false,
      about: false,
      bucket: false,
      cancellation: false,
      [key]: !open[key] // toggle clicked
    });
  }

  return (
    <div className="dubai-family-notes" aria-live="polite">
      <div className="dfn-accordion">

        {/* ====================== ECONOMY (original content untouched) ====================== */}
        {activeTab === "economy" && (
          <>
            {/* Inclusions & Exclusions */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("inclusions")}
                aria-expanded={open.inclusions}
                aria-controls="inclusions-panel"
              >
                <span className="dfn-pill">Inclusions &amp; Exclusions</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.inclusions ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.inclusions && (
                <div id="inclusions-panel" className="dfn-panel">

                    <h2>INCLUSIONS:</h2>


                      <div className="it-day-body">
                        <ul>
                          <li>
                            <span className="it-icon">▸</span>  <b> Transfers:</b>  Airport on Private basis <br/>
                          </li>
                          <li>
                            <span className="it-icon">▸</span>  <b>Cab:</b> Airport / hotel /Sightseeings / airport transfers on (SIC Basis)
                          </li>
                          <li>
                            <span className="it-icon">▸</span>    <b>Meals:</b> Daily Breakfast
                            
                          </li>

                           <h2>Sightseeing:</h2>
                          
                           <li>
                            <span className="it-icon">▸</span>  Dhow Creek with Dinner
                            
                          </li>


                            <li>
                            <span className="it-icon">▸</span> <b>Dubai City Tour:- </b> Zabeel Palace, Dubai Frame, Palm Jumeirah, Palm Atlantis, Future Museum, Dubai Creek, Fountain show and Dubai Mall
                            
                          </li>


                            <li>
                            <span className="it-icon">▸</span>  Burj Khalifa Non Prime Hrs (124th & 125th Floor ) with Tickets
                            
                          </li>


                           <li>
                            <span className="it-icon">▸</span>    Desert Safari with BBQ Dinner (4 x 4 Vehicle) Standard
                            
                          </li>
                            <li>
                            <span className="it-icon">▸</span> <b>     Others: </b> Toll Tax, Parking, and driver allowance.
                            
                          </li>
                        
                        </ul>
                      </div>




                    <h2>EXCLUSIONS:</h2>

                  <p>
                    Early check-in & late checkout<br/>
                      <b>Meals:</b> Lunch & Dinner <br/>
                      Boating, Garden Entry Tickets.<br/>
                      Anything not mentioned in the inclusions is excluded.<br/>
                      TCS charges<br/>
                      Visa Charges<br/>
                  </p>
                </div>
              )}
            </div>

            {/* About Dubai */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("about")}
                aria-expanded={open.about}
                aria-controls="about-panel"
              >
                <span className="dfn-pill">About Dubai</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.about ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.about && (
                <div id="about-panel" className="dfn-panel dfn-about">
                  <div className="dfn-left-line" aria-hidden="true"></div>

                  <div className="dfn-content">
                    <div className="dfn-intro">
                      <img
                        src="/assets/images/dubai/icons/info-circle.svg"
                        alt="Dubai info icons"
                        className="info-icon"
                      />
                      <div>
                        <h3>Dubai: A Modern Marvel in the Heart of the Desert</h3>
                        <p>
                          Rising from the golden sands of the Arabian Peninsula,
                          Dubai is a city where futuristic innovation meets rich heritage.
                          Known for its iconic skyline, luxury lifestyle, and vibrant culture,
                          Dubai has rapidly transformed into one of the world’s most sought-after travel destinations.
                        </p>
                      </div>
                    </div>

                    <section>
                      <h4>Architectural Wonders</h4>
                      <p>
                        Dubai’s skyline is a testament to human ambition and creativity.
                        The Burj Khalifa, the tallest building in the world, offers breathtaking panoramic views.
                      </p>
                    </section>

                    <section>
                      <h4>Desert Adventures</h4>
                      <p>
                        Beyond the city’s glittering facade lies the serene expanse of the Arabian Desert.
                      </p>
                    </section>

                    <section>
                      <h4>Cultural Blend</h4>
                      <p>
                        Dubai’s soul lies in its unique blend of modernity and tradition.
                      </p>
                    </section>

                    <section>
                      <h4>Culinary Excellence</h4>
                      <p>
                        Dubai is a haven for food lovers with Michelin-starred restaurants and authentic Emirati eateries.
                      </p>
                    </section>

                    <section>
                      <h4>Experiences for Every Traveler</h4>
                      <p>
                        From beaches to malls to skydiving — Dubai offers something for everyone.
                      </p>
                    </section>

                    <section>
                      <h4>Best Time to Visit</h4>
                      <p>
                        November to March is ideal for good weather and outdoor activities.
                      </p>
                    </section>

                    {/* Highlights */}
                    <div className="dfn-highlights-title">
                      <img
                        src="/assets/images/dubai/icons/property-icon.svg"
                        alt="dubai property icon"
                      />
                      <strong>Some highlights</strong>
                    </div>

                    <div className="dfn-highlights">
                      <img
                        src="/assets/images/dubai/icons/card1.png"
                        alt="dubai highlights"
                      />
                      <img
                        src="/assets/images/dubai/icons/card2.png"
                        alt="dubai highlights two"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dubai Bucket List */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("bucket")}
                aria-expanded={open.bucket}
                aria-controls="bucket-panel"
              >
                <span className="dfn-pill">Dubai Bucket List</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.bucket ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.bucket && (
                <div id="bucket-panel" className="dfn-panel">
                  <ul>
                    <li>Visit Burj Khalifa observation deck</li>
                    <li>Desert safari with BBQ and shows</li>
                    <li>Explore Dubai Mall & Aquarium</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cancellation Policy */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("cancellation")}
                aria-expanded={open.cancellation}
                aria-controls="cancel-panel"
              >
                <span className="dfn-pill">Cancellation Policy</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.cancellation ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.cancellation && (
                <div id="cancel-panel" className="dfn-panel">
                  <p>
                    Free cancellation up to 7 days before departure. Charges apply after that.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================== DELUXE (renders same content by default) ====================== */}
        {activeTab === "deluxe" && (
          <>
            {/* Render the exact same content (keeps your design & copy) */}
            {/* Inclusions & Exclusions */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("inclusions")}
                aria-expanded={open.inclusions}
                aria-controls="inclusions-panel"
              >
                <span className="dfn-pill">Inclusions &amp; Exclusions Deluxe</span>
                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.inclusions ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.inclusions && (
                <div id="inclusions-panel" className="dfn-panel">
                  <p>Includeyour package details here — transfer, meals, sightseeing etc.</p>
                </div>
              )}
            </div>

            {/* About Dubai (same) */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("about")}
                aria-expanded={open.about}
                aria-controls="about-panel"
              >
                <span className="dfn-pill">About Dubai</span>
                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.about ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.about && (
                <div id="about-panel" className="dfn-panel dfn-about">
                  <div className="dfn-left-line" aria-hidden="true"></div>

                  <div className="dfn-content">
                    <div className="dfn-intro">
                      <img
                        src="/assets/images/dubai/icons/info-circle.svg"
                        alt="Dubai info icons"
                        className="info-icon"
                      />
                      <div>
                        <h3>Dubai: A Modern Marvel in the Heart of the Desert</h3>
                        <p>
                          Rising from the golden sands of the Arabian Peninsula,
                          Dubai is a city where futuristic innovation meets rich heritage.
                          Known for its iconic skyline, luxury lifestyle, and vibrant culture,
                          Dubai has rapidly transformed into one of the world’s most sought-after travel destinations.
                        </p>
                      </div>
                    </div>

                    <section>
                      <h4>Architectural Wonders</h4>
                      <p>
                        Dubai’s skyline is a testament to human ambition and creativity.
                        The Burj Khalifa, the tallest building in the world, offers breathtaking panoramic views.
                      </p>
                    </section>

                    <section>
                      <h4>Desert Adventures</h4>
                      <p>
                        Beyond the city’s glittering facade lies the serene expanse of the Arabian Desert.
                      </p>
                    </section>

                    <section>
                      <h4>Cultural Blend</h4>
                      <p>
                        Dubai’s soul lies in its unique blend of modernity and tradition.
                      </p>
                    </section>

                    <section>
                      <h4>Culinary Excellence</h4>
                      <p>
                        Dubai is a haven for food lovers with Michelin-starred restaurants and authentic Emirati eateries.
                      </p>
                    </section>

                    <section>
                      <h4>Experiences for Every Traveler</h4>
                      <p>
                        From beaches to malls to skydiving — Dubai offers something for everyone.
                      </p>
                    </section>

                    <section>
                      <h4>Best Time to Visit</h4>
                      <p>
                        November to March is ideal for good weather and outdoor activities.
                      </p>
                    </section>

                    <div className="dfn-highlights-title">
                      <img
                        src="/assets/images/dubai/icons/property-icon.svg"
                        alt="dubai property icon"
                      />
                      <strong>Some highlights</strong>
                    </div>

                    <div className="dfn-highlights">
                      <img
                        src="/assets/images/dubai/icons/card1.png"
                        alt="dubai highlights"
                      />
                      <img
                        src="/assets/images/dubai/icons/card2.png"
                        alt="dubai highlights two"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dubai Bucket List */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("bucket")}
                aria-expanded={open.bucket}
                aria-controls="bucket-panel"
              >
                <span className="dfn-pill">Dubai Bucket List</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.bucket ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.bucket && (
                <div id="bucket-panel" className="dfn-panel">
                  <ul>
                    <li>Visit Burj Khalifa observation deck</li>
                    <li>Desert safari with BBQ and shows</li>
                    <li>Explore Dubai Mall & Aquarium</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cancellation Policy */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("cancellation")}
                aria-expanded={open.cancellation}
                aria-controls="cancel-panel"
              >
                <span className="dfn-pill">Cancellation Policy</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.cancellation ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.cancellation && (
                <div id="cancel-panel" className="dfn-panel">
                  <p>
                    Free cancellation up to 7 days before departure. Charges apply after that.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================== PREMIUM (renders same content by default) ====================== */}
        {activeTab === "premium" && (
          <>
            {/* same original content preserved */}
            {/* Inclusions & Exclusions */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("inclusions")}
                aria-expanded={open.inclusions}
                aria-controls="inclusions-panel"
              >
                <span className="dfn-pill">Inclusions &amp; Exclusions Premium</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.inclusions ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.inclusions && (
                <div id="inclusions-panel" className="dfn-panel">
                  <p>Includeyour package details here — transfer, meals, sightseeing etc.</p>
                </div>
              )}
            </div>

            {/* About Dubai */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("about")}
                aria-expanded={open.about}
                aria-controls="about-panel"
              >
                <span className="dfn-pill">About Dubai</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.about ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.about && (
                <div id="about-panel" className="dfn-panel dfn-about">
                  <div className="dfn-left-line" aria-hidden="true"></div>

                  <div className="dfn-content">
                    <div className="dfn-intro">
                      <img
                        src="/assets/images/dubai/icons/info-circle.svg"
                        alt="Dubai info icons"
                        className="info-icon"
                      />
                      <div>
                        <h3>Dubai: A Modern Marvel in the Heart of the Desert</h3>
                        <p>
                          Rising from the golden sands of the Arabian Peninsula,
                          Dubai is a city where futuristic innovation meets rich heritage.
                          Known for its iconic skyline, luxury lifestyle, and vibrant culture,
                          Dubai has rapidly transformed into one of the world’s most sought-after travel destinations.
                        </p>
                      </div>
                    </div>

                    <section>
                      <h4>Architectural Wonders</h4>
                      <p>
                        Dubai’s skyline is a testament to human ambition and creativity.
                        The Burj Khalifa, the tallest building in the world, offers breathtaking panoramic views.
                      </p>
                    </section>

                    <section>
                      <h4>Desert Adventures</h4>
                      <p>
                        Beyond the city’s glittering facade lies the serene expanse of the Arabian Desert.
                      </p>
                    </section>

                    <section>
                      <h4>Cultural Blend</h4>
                      <p>
                        Dubai’s soul lies in its unique blend of modernity and tradition.
                      </p>
                    </section>

                    <section>
                      <h4>Culinary Excellence</h4>
                      <p>
                        Dubai is a haven for food lovers with Michelin-starred restaurants and authentic Emirati eateries.
                      </p>
                    </section>

                    <section>
                      <h4>Experiences for Every Traveler</h4>
                      <p>
                        From beaches to malls to skydiving — Dubai offers something for everyone.
                      </p>
                    </section>

                    <section>
                      <h4>Best Time to Visit</h4>
                      <p>
                        November to March is ideal for good weather and outdoor activities.
                      </p>
                    </section>

                    <div className="dfn-highlights-title">
                      <img
                        src="/assets/images/dubai/icons/property-icon.svg"
                        alt="dubai property icon"
                      />
                      <strong>Some highlights</strong>
                    </div>

                    <div className="dfn-highlights">
                      <img
                        src="/assets/images/dubai/icons/card1.png"
                        alt="dubai highlights"
                      />
                      <img
                        src="/assets/images/dubai/icons/card2.png"
                        alt="dubai highlights two"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dubai Bucket List */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("bucket")}
                aria-expanded={open.bucket}
                aria-controls="bucket-panel"
              >
                <span className="dfn-pill">Dubai Bucket List</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.bucket ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.bucket && (
                <div id="bucket-panel" className="dfn-panel">
                  <ul>
                    <li>Visit Burj Khalifa observation deck</li>
                    <li>Desert safari with BBQ and shows</li>
                    <li>Explore Dubai Mall & Aquarium</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cancellation Policy */}
            <div className="dfn-section">
              <button
                className="dfn-section-header"
                onClick={() => toggle("cancellation")}
                aria-expanded={open.cancellation}
                aria-controls="cancel-panel"
              >
                <span className="dfn-pill">Cancellation Policy</span>

                <span
                  className="faq-icon"
                  style={{
                    display: "inline-block",
                    transform: open.cancellation ? "rotate(-90deg)" : "rotate(90deg)",
                    transition: "0.3s ease",
                    fontSize: "20px",
                    fontFamily: "DM Sans "
                  }}
                >
                  &gt;
                </span>
              </button>

              {open.cancellation && (
                <div id="cancel-panel" className="dfn-panel">
                  <p>
                    Free cancellation up to 7 days before departure. Charges apply after that.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
