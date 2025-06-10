import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function Projects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="project-counter bg-prime how-we-work-container pb-80">
      <div className="container">
        <div className="counter-area">
          <div className="counter-items">
            <div className="counter-title">
              <img src="./assets/images/icons/ic1.png" alt="Happy Clients" />
              <h3>
                {inView ? <CountUp start={0} end={5000} duration={3} separator="," /> : "5000"}+
              </h3>
            </div>
            <p className="happy-title">Happy Clients</p>
          </div>

          <div className="counter-items">
            <div className="counter-title">
              <img src="./assets/images/icons/ic2.png" alt="Years of Expertise" />
              <h3>{inView ? <CountUp start={0} end={10} duration={3} /> : "10"}+</h3>
            </div>
            <p className="happy-title">Years of Expertise</p>
          </div>

          <div className="counter-items">
            <div className="counter-title">
              <img src="./assets/images/icons/ic3.png" alt="Global Destinations" />
              <h3>{inView ? <CountUp start={0} end={50} duration={3} /> : "50"}+</h3>
            </div>
            <p className="happy-title">Global Destinations</p>
          </div>

          <div className="counter-items">
            <div className="counter-title">
              <img src="./assets/images/icons/ic4.png" alt="Hotel Collaboration" />
              <h3>
                {inView ? <CountUp start={0} end={500} duration={3} separator="," /> : "500"}+
              </h3>
            </div>
            <p className="happy-title">Hotel Collaboration</p>
          </div>
        </div>
      </div>
    </section>
  );
}
