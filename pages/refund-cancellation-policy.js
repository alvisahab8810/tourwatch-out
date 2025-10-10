import React from "react";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
import Footer from "../components/footer/Footer";

export default function RefundCancellationPolicy() {
  return (
    <div>
      <Topbar />

      <Offcanvas />

      <section className="kashmir-honeymoon-hero kashmir-hero">
        <div className="container">
          <div className="row align-items-center pt-200">
            <div className="col-md-12 about-contennt">
              <h2 className="fs-64 text-white fw-bold">Refund & Cancellation Policy</h2>
            </div>
          </div>
        </div>
      </section>
      <div className="container py-5">
         <div className="refund-policy p-6 max-w-4xl mx-auto privacy-policy">
      <h1 className="text-3xl font-bold mb-4">Refund & Cancellation Policy</h1>
      <p className="mb-4">Last updated: 10 October 2025</p>

      <p className="mb-4">
        At <strong>TourWatchOut</strong>, we strive to provide our customers with a seamless travel booking experience. 
        However, we understand that travel plans may change due to unforeseen circumstances. 
        The following Cancellation and Refund Policy outlines the conditions under which cancellations and refunds are processed.
      </p>

      <h2 className="mb-2">1. Cancellation Policy</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>If cancellations are made <strong>30 days before</strong> the start date of the trip, <strong>25% of the total package cost</strong> will be charged as cancellation fees.</li>
        <li>If cancellations are made between <strong>15–30 days</strong> before the start date, <strong>50% of the total package cost</strong> will be charged as cancellation fees.</li>
        <li>If cancellations are made within <strong>0–15 days</strong> before the start date, <strong>100% of the total package cost</strong> will be charged as cancellation fees.</li>
        <li>In case of unforeseen weather conditions or government restrictions, certain activities may be canceled. We will try our best to offer alternate feasible options; however, <strong>no refund will be provided</strong> for such changes.</li>
        <li><strong>100% cancellation fees</strong> apply in case of last-minute cancellations due to flight/train delays, political unrest, or natural calamities.</li>
        <li>In case of lockdowns (e.g., due to COVID-19 or similar events), a <strong>credit note</strong> may be issued which can be redeemed within 1 year of issuance, subject to applicable season rates.</li>
        <li>If travel plans are affected by riots, floods, accidents, or other natural/man-made calamities, <strong>no refund</strong> will be provided, and any additional expenses must be borne by the traveler.</li>
        <li>If a traveler discontinues the tour mid-way due to personal reasons (e.g., illness, family emergency, etc.), <strong>no refund</strong> will be issued for the remaining portion of the trip.</li>
      </ul>

      <h2 className="mb-2">2. Refund Policy</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Refunds, where applicable, will be processed within <strong>10–15 working days</strong> after receiving a formal cancellation request.</li>
        <li>All refunds will be made through the original payment method used at the time of booking.</li>
        <li>In case of partial cancellations, applicable charges will be deducted, and the balance amount will be refunded.</li>
        <li><strong>Non-refundable components</strong> such as flight tickets, visa fees, insurance, or special event bookings are not eligible for any refund.</li>
        <li>Refunds are subject to confirmation from hotels, airlines, and other service providers involved in the booking.</li>
        <li>If a refund is delayed due to third-party settlement (like airlines or hotels), TourWatchOut will not be held responsible for the delay.</li>
        <li>In cases where a credit note is issued, it cannot be encashed or transferred to another traveler.</li>
      </ul>

      <h2 className="mb-2">3. No Show Policy</h2>
      <p className="mb-4">
        In the event that a traveler fails to appear for a booked service (hotel stay, tour, flight, etc.) without prior notice, 
        <strong>100% of the total booking amount</strong> will be charged as a “No Show” fee, and no refund will be provided.
      </p>

      <h2 className="mb-2">4. Modifications & Date Changes</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Requests for date changes are subject to availability and may incur rescheduling charges.</li>
        <li>Any difference in fare, room cost, or transportation fees due to date changes will be borne by the traveler.</li>
        <li>In peak seasons or blackout dates, date changes may not be permitted by suppliers.</li>
      </ul>

      <h2 className="mb-2">5. Force Majeure</h2>
      <p className="mb-4">
        TourWatchOut shall not be held liable or responsible for any failure or delay in performing its obligations 
        due to circumstances beyond its control, including but not limited to natural disasters, war, political unrest, 
        lockdowns, or technical failures of airlines or transport operators.
      </p>

      <h2 className="mb-2">6. Important Notes</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>All cancellation requests must be made in writing via email to <a href="mailto:info@tourwatchout.com" className="text-blue-600">info@tourwatchout.com</a>.</li>
        <li>Refund and cancellation policies are subject to change without prior notice based on supplier and airline terms.</li>
        <li>Any booking made through third-party portals or affiliates will follow their respective refund and cancellation rules.</li>
      </ul>

      <h2 className="mb-2">7. Contact Us</h2>
      <p className="mb-4">
        For any questions or assistance related to cancellations or refunds, please reach out to our support team:
      </p>
      <p>
        <strong>TourWatchOut</strong><br />
        Email: <a href="mailto:info@tourwatchout.com" className="text-blue-600">info@tourwatchout.com</a><br />
        Website: <a href="https://tourwatchout.com" className="text-blue-600">www.tourwatchout.com</a>
      </p>
    </div>
      </div>

      <Footer />
    </div>
  );
}
