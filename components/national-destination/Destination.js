import React from "react";
import Link from "next/link";
export default function Destination() {
  return (
    <>
      <section className="destination-row pt-80">
        <div className="container">
          <div className="row w-100">
            <div className="content-section">
              <h1>Top Travel Packages</h1>
              <p className="mt-4 mb-5">
                Explore our most popular packages, loved by travelers worldwide.
              </p>
            </div>
          </div>
          <div className="national-list-bx">
            <div className="national-features">
              <Link href="/family/national-destination/kashmir">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/kashmir.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
                    <p>
                      Kashmir, known as “Paradise on Earth,” boasts breathtaking landscapes, serene lakes, and vibrant culture, offering a truly magical experience..

                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="national-features">
              <Link href="/family/national-destination/leh-laddakh">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/leh.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Leh Ladakh</h3>
                    <p>
                      Leh-Ladakh, where rugged mountains meet serene monasteries, is an adventure lover’s paradise and a tranquil escape for the soul.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          />
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          />
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          />
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      />{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          

            {/* ================== CTA ================== */}
            <section className="banner-sections desktop-none ptb-40-30">
              <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
            </section>
            {/* ================== CTA ================== */}

            <div className="national-features">
              <Link href="/family/national-destination/manali">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/manali.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Manali</h3>
                    <p>
                       Manali, a captivating hill station, offers snow-capped peaks, lush valleys, and thrilling adventure sports, making it the perfect blend of beauty and excitement.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="national-features mt-2">
              <Link href="/family/national-destination/shimla">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/shimla.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Shimla</h3>
                    <p>
                      Shimla and Manali are picturesque hill stations, offering scenic landscapes, adventure activities, and a refreshing escape into the mountains. Both are perfect for nature lovers and thrill-seekers alike.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

         


             {/* ================== CTA ================== */}
             <section className="banner-sections desktop-none ptb-40-30">
              <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
            </section>
            {/* ================== CTA ================== */}

            <div className="national-features mt-2">
              <Link href="/family/national-destination/shimla-manali">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/shimla&manali.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Shimla & Manali</h3>
                    <p>
                       Shimla and Manali are picturesque hill stations, offering scenic landscapes, adventure activities, and a refreshing escape into the mountains. Both are perfect for nature lovers and thrill-seekers alike.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          />
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          />
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          />
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img /> <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="national-features mt-2">
              <Link href="/family/national-destination/dharamshala">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/dharamshala.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Dharamshala</h3>
                    <p>
                       Dharamshala, nestled in the Himachal Pradesh hills, is known for its Tibetan culture, serene landscapes, and peaceful atmosphere, making it a perfect destination for spiritual retreats 
                       and nature lovers.

                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            
             {/* ================== CTA ================== */}
             <section className="banner-sections desktop-none ptb-40-30">
              <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
            </section>
            {/* ================== CTA ================== */}


           
          </div>
        </div>
      </section>

      {/* ================== CTA ================== */}
      <section className="banner-sections ptb-40-30 ptb-80">
            <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
      </section>
       {/* ================== CTA ================== */}
      <section className="destination-row ">
        <div className="container">
          <div className="national-list-bx pb-80">
            

             <div className="national-features mt-2">
              <Link href="/family/national-destination/nanital">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/shimla&manali.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Nanital</h3>
                    <p>
                       Nanital are picturesque hill stations, offering scenic landscapes, adventure activities, and a refreshing escape into the mountains. Both are perfect for nature lovers and thrill-seekers alike.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          />
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          />
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          />
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img /> <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="national-features mt-2">
              <Link href="/family/national-destination/dehradun">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/dharamshala.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Dehradun</h3>
                    <p>
                       Dehradun, nestled in the Himachal Pradesh hills, is known for its Tibetan culture, serene landscapes, and peaceful atmosphere, making it a perfect destination for spiritual retreats 
                       and nature lovers.

                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            
             {/* ================== CTA ================== */}
             <section className="banner-sections desktop-none ptb-40-30">
              <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
            </section>
            {/* ================== CTA ================== */}

            <div className="national-features">
              <Link href="/family/national-destination/goa">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/img2.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Goa</h3>
                    <p>
                      Kashmir is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="national-features mt-2">
              <Link href="/family/national-destination/jim-corbett">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Jim Corbett </h3>
                    <p>
                      Jim Corbett is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            
             {/* ================== CTA ================== */}
             <section className="banner-sections desktop-none ptb-40-30">
              <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
            </section>
            {/* ================== CTA ================== */}
            
            <div className="national-features mt-2">
              <Link href="/family/national-destination/jaipur">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/img4.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Jaipur</h3>
                    <p>
                      Jaipur, with its lush tea gardens and panoramic views
                      of the Himalayas, is a charming hill station that
                      captivates visitors seeking tranquility & natural beauty.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          />
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          />
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          />
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      />{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="national-features mt-2">
              <Link href="/family/national-destination/north-sikkim">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>North Sikkim</h3>
                    <p>
                      North Sikkim is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

               {/* ================== CTA ================== */}
             <section className="banner-sections desktop-none ptb-40-30">
              <div className="container">
                <div className="banner-section">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1 desktop-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                  <div className="con-ctabx">
                    <button className="btn btn-primary1 mobile-none" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"
                          fdprocessedid="s6df8j">Start Journey Now</button>
                  </div>
                </div>
              </div>
            </section>
            {/* ================== CTA ================== */}
             <div className="national-features mt-2">
              <Link href="/family/national-destination/lonavala-khandala">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Lonavala & Khandala</h3>
                    <p>
                      Lonavala & Khandala is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
              <div className="national-features mt-2">
              <Link href="/family/national-destination/andaman">
                <div className="desti-img">
                  {" "}
                  <img
                    src="/assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Andaman</h3>
                    <p>
                      Andaman is a breathtaking paradise, featuring majestic
                      mountains and serene lakes, perfect for nature lovers and
                      adventure seekers.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="/assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="/assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="/assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
