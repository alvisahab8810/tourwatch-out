import React from "react";
import Link from "next/link";
export default function Map() {
  return (
    <>
      <section className="map-section ptb-80 " id="location">
        <div className="container">
          <h1 className="heading">Visualize Your Adventure</h1>
          <div className="map-box">
            <Link href="#">
              <img src="./assets/images/kashmir/map.png" alt="map image" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
