import React from "react";
import Link from "next/link";

export default function BlogList() {
  return (
    <>
      <section className="blogs-list-section ptb-80">
        <div className="container">
          <h2 className="blogs-title">Featured blog posts</h2>
          <div className="blogs-list-bx pt-40">
            <div className="blogs-items">
              <div className="blog-list-bx">
                <div className="blogs-list-img">
                  <img
                    src="./assets/images/blogs/img1.webp"
                    alt="Blogs Image"
                  />
                </div>
                <div className="blogs-info">
                  <ul className="blogs-cate">
                    <li className="category-blogs">Adventure</li>
                    <li className="time-blogs">5 min read</li>
                  </ul>
                  <Link href="#">
                    <h2>
                      Conquer Bali’s Thrilling Rapids: A Guide to White-Water
                      Rafting
                    </h2>
                  </Link>
                  <p>
                    Experience the adrenaline rush of white-water rafting on
                    Bali’s Ayung River, surrounded by lush jungles and
                    breathtaking landscapes.
                  </p>

                  <Link href="#" className="read-more-btn">
                    Read more{" "}
                    <img
                      src="./assets/images/blogs/icons/arrow.png"
                      alt="arrow icon"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="blogs-items">
              <div className="blog-list-bx">
                <div className="blogs-list-img">
                  <img
                    src="./assets/images/blogs/img2.webp"
                    alt="Blogs Image"
                  />
                </div>
                <div className="blogs-info">
                  <ul className="blogs-cate">
                    <li className="category-blogs">Food</li>
                    <li className="time-blogs">5 min read</li>
                  </ul>
                  <Link href="#">
                    {" "}
                    <h2>
                      Savor the Flavors of Kashmir: Must-Try Traditional
                      Delicaciess
                    </h2>
                  </Link>
                  <p>
                    From the rich Wazwan feast to the warm sweetness of Kahwa
                    tea, explore the authentic tastes of Kashmir that tell
                    stories of its vibrant culture.
                  </p>

                  <Link href="#" className="read-more-btn">
                    Read more{" "}
                    <img
                      src="./assets/images/blogs/icons/arrow.png"
                      alt="arrow icon"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="blogs-items ">
              <div className="blog-list-bx">
                <div className="blogs-list-img">
                  <img
                    src="./assets/images/blogs/img3.webp"
                    alt="Blogs Image"
                  />
                </div>
                <div className="blogs-info">
                  <ul className="blogs-cate">
                    <li className="category-blogs">Hidden Gems</li>
                    <li className="time-blogs">5 min read</li>
                  </ul>
                  <Link href="#">
                    <h2>
                      Discover Gangtok’s Best-Kept Secret: Ranka Monastery
                    </h2>
                  </Link>
                  <p>
                    Escape the crowds and find tranquility at Ranka Monastery, a
                    peaceful retreat offering stunning views and a serene
                    atmosphere.
                  </p>

                  <Link href="#" className="read-more-btn">
                    Read more{" "}
                    <img
                      src="./assets/images/blogs/icons/arrow.png"
                      alt="arrow icon"
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="blogs-items mt-44">
              <div className="blog-list-bx">
                <div className="blogs-list-img">
                  <img
                    src="./assets/images/blogs/img4.webp"
                    alt="Blogs Image"
                  />
                </div>
                <div className="blogs-info">
                  <ul className="blogs-cate">
                    <li className="category-blogs">Adventure</li>
                    <li className="time-blogs">5 min read</li>
                  </ul>
                  <Link href="#">
                    <h2>Jungle Adventures: Night Safaris in Jim Corbett</h2>
                  </Link>
                  <p>
                    Dive into the wild side of Jim Corbett with a night safari,
                    where you can witness the jungle’s nocturnal life in all its
                    glory.
                  </p>

                  <Link href="#" className="read-more-btn">
                    Read more{" "}
                    <img
                      src="./assets/images/blogs/icons/arrow.png"
                      alt="arrow icon"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="blogs-items mt-44">
              <div className="blog-list-bx">
                <div className="blogs-list-img">
                  <img
                    src="./assets/images/blogs/img5.webp"
                    alt="Blogs Image"
                  />
                </div>
                <div className="blogs-info">
                  <ul className="blogs-cate">
                    <li className="category-blogs">Hidden Gems</li>
                    <li className="time-blogs">5 min read</li>
                  </ul>
                  <Link href="#">
                    <h2>
                      Leh Ladakh’s Turtuk Village: A Slice of History and Beauty
                    </h2>
                  </Link>
                  <p>
                    Discover the untouched charm of Turtuk Village, a remote
                    paradise with stunning landscapes and a rich Balti culture
                    near the Indo-Pak border.
                  </p>

                  <Link href="#" className="read-more-btn">
                    Read more{" "}
                    <img
                      src="./assets/images/blogs/icons/arrow.png"
                      alt="arrow icon"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="blogs-items mt-44">
              <div className="blog-list-bx">
                <div className="blogs-list-img">
                  <img
                    src="./assets/images/blogs/img6.webp"
                    alt="Blogs Image"
                  />
                </div>
                <div className="blogs-info">
                  <ul className="blogs-cate">
                    <li className="category-blogs">Food</li>
                    <li className="time-blogs">5 min read</li>
                  </ul>
                  <Link href="#">
                    <h2>A Culinary Tour of Europe: Dishes You Can’t Miss</h2>
                  </Link>
                  <p>
                    From French croissants to Italian pasta, embark on a journey
                    across Europe through its iconic and mouthwatering dishes.
                  </p>

                  <Link href="#" className="read-more-btn">
                    Read more{" "}
                    <img
                      src="./assets/images/blogs/icons/arrow.png"
                      alt="arrow icon"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
