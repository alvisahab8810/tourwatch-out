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
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img2.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Goa</h3>
                    <p>
                      Goa is a vibrant coastal haven, known for its stunning
                      beaches, lively nightlife, and rich cultural heritage,
                      ideal for relaxation and exploration.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          />
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          />
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          />
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      />{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="national-features">
              <Link href="/kashmir">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
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
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
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
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img4.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Darjeeling</h3>
                    <p>
                      Darjeeling, with its lush tea gardens and panoramic views
                      of the Himalayas, is a charming hill station that
                      captivates visitors seeking tranquility & natural beauty.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="national-features mt-2">
              <Link href="/kashmir">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
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
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
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
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img2.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Goa</h3>
                    <p>
                      Goa is a vibrant coastal haven, known for its stunning
                      beaches, lively nightlife, and rich cultural heritage,
                      ideal for relaxation and exploration.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          />
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          />
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
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
              <Link href="/kashmir">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
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
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
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
            <div className="national-features">
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img4.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Darjeeling</h3>
                    <p>
                      Darjeeling, with its lush tea gardens and panoramic views
                      of the Himalayas, is a charming hill station that
                      captivates visitors seeking tranquility & natural beauty.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          />
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          />
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          />
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      />{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="national-features">
              <Link href="/kashmir">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
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
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
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
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img2.webp"
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
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      ></img>{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="national-features mt-2">
              <Link href="/kashmir">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
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
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
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
              <Link href="#">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img4.webp"
                    alt="National Destination"
                  />{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Darjeeling</h3>
                    <p>
                      Darjeeling, with its lush tea gardens and panoramic views
                      of the Himalayas, is a charming hill station that
                      captivates visitors seeking tranquility & natural beauty.
                    </p>
                  </div>
                  <div className="facility-section">
                    <div className="faci-1">
                      <ul>
                        <li className="ml-0">
                          <img
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          />
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          />
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          />
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
                        alt="Heart Icon"
                      />{" "}
                      <span>4.8</span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="national-features mt-2">
              <Link href="/kashmir">
                <div className="desti-img">
                  {" "}
                  <img
                    src="./assets/images/n-destination/img3.webp"
                    alt="National Destination"
                  ></img>{" "}
                </div>
                <div className="desti-main">
                  <div className="desti-info">
                    <h3>Kashmir</h3>
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
                            src="./assets/images/destination/icons/hotel.png"
                            alt="Hotel Icon"
                          ></img>
                          <p> Upto 3 Stars</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/meal.png"
                            alt="Meal Icon"
                          ></img>
                          <p> Meal</p>
                        </li>
                        <li>
                          <img
                            src="./assets/images/destination/icons/sight.png"
                            alt="sight Icon"
                          ></img>
                          <p> Sightseeing</p>
                        </li>
                      </ul>
                    </div>
                    <div className="faci-ratings">
                      {" "}
                      <img
                        src="./assets/images/destination/icons/heart.png"
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
