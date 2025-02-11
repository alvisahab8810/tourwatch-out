import React from "react";

export default function Faq() {
  return (
    <>
      <section className="faq-sections ptb-80">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="subtitle text-center">Still Having Queries ?</h2>
              <h1 className="heading lh-75">Frequently Asked Questions</h1>
            </div>
          </div>

          <div className="accordion-bx pt-80">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Do you provide makeup trials before the wedding?
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    Yes, we offer makeup trials to help you visualize your look
                    before your big day. Trials allow us to discuss your
                    preferences, experiment with different styles, and ensure
                    that you are completely satisfied with the final result.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    How do I book an appointment?
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    Booking an appointment is easy! You can reach out to us
                    through our website or contact us directly via phone or
                    social media. We recommend scheduling a consultation to
                    discuss your desired look and any specific requirements you
                    may have.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    How long does a bridal makeup session typically take?
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    A bridal makeup session usually takes between 1.5 to 2.5
                    hours, depending on the complexity of the desired look and
                    any additional services like hair styling. We recommend
                    allowing ample time to ensure a relaxed and enjoyable
                    experience.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFour">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    Can I book you for destination weddings?
                  </button>
                </h2>
                <div
                  id="collapseFour"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFour"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    Yes, we love traveling for destination weddings! Please
                    contact us to discuss logistics, including travel fees and
                    accommodations, so we can make arrangements to ensure you
                    look stunning on your special day.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFive">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFive"
                    aria-expanded="false"
                    aria-controls="collapseFive"
                  >
                    What is the best time to schedule my bridal makeup trial?
                  </button>
                </h2>
                <div
                  id="collapseFive"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFive"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    We recommend scheduling your bridal makeup trial about 1-3
                    months before your wedding day. This gives you enough time
                    to discuss your look and make any adjustments if needed,
                    ensuring you feel confident and beautiful on your big day.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
