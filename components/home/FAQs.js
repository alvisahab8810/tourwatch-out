import React, { useState, useEffect } from "react";
import Link from "next/link";

const STATIC = [
  {
    id: "s1",
    question: "How does Tourwatchout ensure my trip is stress-free?",
    answer: "We provide comprehensive trip planning, 24/7 support, and handle all logistics to ensure a seamless travel experience.",
  },
  {
    id: "s2",
    question: "What if we need help during the trip?",
    answer: "Our 24/7 customer support team is always available to assist you during your trip.",
  },
  {
    id: "s3",
    question: "How do you ensure the safety of my family during the trip?",
    answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
  },
  {
    id: "s4",
    question: "Can Tourwatchout plan trips for corporate groups?",
    answer: "Yes, we specialize in corporate travel planning and group bookings.",
  },
  {
    id: "s5",
    question: "Is there a limit to the number of people I can book for?",
    answer: "No, we can accommodate groups of any size, from individual travelers to large corporate groups.",
  },
];

export default function FAQs({ items = null }) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [faqs, setFaqs] = useState(items || STATIC);

  useEffect(() => {
    if (items) { setFaqs(items); return; }
    fetch("/api/faqs?limit=15")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setFaqs(data);
      })
      .catch(() => {});
  }, [items]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="mini-container1">
        <div className="faq-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>

          <div className="faq-list">
            {faqs.map((item, i) => {
              const isOpen = activeIndex === i;

              return (
                <div className="faq-item" key={item.id || i}>
                  <div
                    className={`faq-question ${isOpen ? "active" : ""}`}
                    onClick={() => toggleFAQ(i)}
                  >
                    <h3>{item.question || item.q}</h3>
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

                  <div className={`faq-answer ${isOpen ? "active" : ""}`}>
                    <p>{item.answer || item.a}</p>
                  </div>

                  <div className="faq-divider"></div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/faqs" className="explore-more-btn" style={{ display: "inline-block" }}>
              View more FAQs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
