import React, { useState } from "react";

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(2); // 3rd is open by default (as in screenshot)

  const faqData = [
    {
      q: "How does Tourwatchout ensure my trip is stress-free?",
      a: "We provide comprehensive trip planning, 24/7 support, and handle all logistics to ensure a seamless travel experience.",
    },
    {
      q: "What if we need help during the trip?",
      a: "Our 24/7 customer support team is always available to assist you during your trip.",
    },
    {
      q: "How do you ensure the safety of my family during the trip?",
      a: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    },
    {
      q: "Can Tourwatchout plan trips for corporate groups?",
      a: "Yes, we specialize in corporate travel planning and group bookings.",
    },
    {
      q: "Is there a limit to the number of people I can book for?",
      a: "No, we can accommodate groups of any size, from individual travelers to large corporate groups.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="mini-container1">
        <div className="faq-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>

          <div className="faq-list">
            {faqData.map((item, i) => {
              const isOpen = activeIndex === i;

              return (
                <div className="faq-item" key={i}>
                  {/* QUESTION ROW */}
                  <div
                    className={`faq-question ${isOpen ? "active" : ""}`}
                    onClick={() => toggleFAQ(i)}
                  >
                    <h3>{item.q}</h3>

                    {/* ARROW ICON */}
                    <span
                      className="faq-icon"
                      style={{
                        display: "inline-block",
                        transform: isOpen ? "rotate(-90deg)" : "rotate(90deg)",
                        transition: "0.3s ease",
                        fontSize: "20px",
                        color: isOpen ? "#26828d" : "#34384c",
                      }}
                    >
                      &gt;
                    </span>
                  </div>

                  {/* ANSWER BOX */}
                  <div className={`faq-answer ${isOpen ? "active" : ""}`}>
                    <p>{item.a}</p>
                  </div>

                  <div className="faq-divider"></div>
                </div>
              );
            })}
          </div>

          {/* <div className="faq-divider"></div> */}
        </div>
      </div>
    </section>
  );
}
