import React from "react";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
import Footer from "../components/footer/Footer";

export default function TermsAndConditions() {
  return (
    <div>
      <Topbar />

      <Offcanvas />

      <section className="kashmir-honeymoon-hero kashmir-hero">
        <div className="container">
          <div className="row align-items-center pt-200">
            <div className="col-md-12 about-contennt">
              <h2 className="fs-64 text-white fw-bold">Term & Conditions </h2>
            </div>
          </div>
        </div>
      </section>
      <div className="container py-5">
        <div className="terms-conditions p-6 max-w-4xl mx-auto privacy-policy">
          <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
          <p className="mb-4">Last updated: 10 October 2025</p>

          <p className="mb-4">
            Welcome to <strong>TourWatchOut</strong>. These Terms and Conditions
            govern your use of our website
            <a href="https://tourwatchout.com" className="text-blue-600">
              {" "}
              www.tourwatchout.com
            </a>
            and our travel-related services. By booking or using our services,
            you agree to comply with and be bound by the following terms.
          </p>

          <h2 className=" mb-2">1. General Conditions</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>
              No booking has been confirmed until written confirmation is
              received from TourWatchOut.
            </li>
            <li>
              Rooms and rates are subject to availability at the time of booking
              confirmation.
            </li>
            <li>
              All rates are quoted per person on a twin/double sharing basis,
              unless otherwise mentioned.
            </li>
            <li>
              Rates provided are based on real-time availability and may change
              between quotation and final confirmation.
            </li>
            <li>
              Any change in government taxes, fuel surcharges, or
              hotel/transport prices will be communicated and applied
              accordingly.
            </li>
            <li>
              The sequence of itineraries may be modified based on local
              conditions or availability.
            </li>
          </ul>

          <h2 className=" mb-2">2. Child Policy</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>
              Children above 6 years of age may be charged an additional amount
              as per the hotel’s policy.
            </li>
            <li>
              Child age and applicable charges are determined by individual
              hotel and service provider policies.
            </li>
          </ul>

          <h2 className=" mb-2">3. Check-in and Check-out</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>
              Early check-in or late check-out requests are subject to hotel
              availability and cannot be guaranteed.
            </li>
            <li>
              Bedding and room preferences are also subject to availability at
              the time of check-in. TourWatchOut can only forward special
              requests to hotels.
            </li>
          </ul>

          <h2 className=" mb-2">4. Flights and Transportation</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>
              TourWatchOut is not liable for any airline rescheduling, delays,
              or cancellations affecting your tour package.
            </li>
            <li>
              The amount paid for flight bookings is strictly non-refundable.
            </li>
            <li>
              Vehicle service is provided on a point-to-point basis and is not
              available for disposal use.
            </li>
            <li>
              Any additional transfers or changes requested beyond the itinerary
              may incur extra charges.
            </li>
          </ul>

          <h2 className=" mb-2">5. Travel Insurance</h2>
          <p className="mb-4">
            Travel insurance is not included in any TourWatchOut package unless
            explicitly mentioned. It is highly recommended that all travelers
            obtain comprehensive travel insurance to cover trip cancellations,
            medical emergencies, and other unforeseen events.
          </p>

          <h2 className=" mb-2">6. Payments and Cancellations</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>
              Full payment or the agreed deposit must be made by the due date to
              confirm the booking.
            </li>
            <li>
              Failure to make payments as per the agreed schedule may lead to
              immediate cancellation without refund.
            </li>
            <li>
              Special payment and cancellation policies apply during peak season
              or blackout dates such as city events, festivals, national
              holidays, and conferences.
            </li>
            <li>
              Refunds, if applicable, will be processed as per the cancellation
              policy shared at the time of booking.
            </li>
          </ul>

          <h2 className=" mb-2">
            7. Changes and Cancellations by TourWatchOut
          </h2>
          <ul className="list-disc ml-6 mb-4">
            <li>
              TourWatchOut reserves the right to amend, cancel, or reschedule
              tours due to unforeseen circumstances such as weather conditions,
              operational issues, or government restrictions.
            </li>
            <li>
              In such cases, we will make every effort to provide suitable
              alternatives or refunds where applicable.
            </li>
          </ul>

          <h2 className=" mb-2">8. Liability Disclaimer</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>
              TourWatchOut acts only as an intermediary between travelers and
              third-party service providers such as airlines, hotels, transport
              operators, and travel partners.
            </li>
            <li>
              We are not liable for delays, cancellations, losses, injuries, or
              damages arising from the actions of third-party providers.
            </li>
            <li>
              Prices are dynamic and may vary depending on availability,
              exchange rates, and supplier conditions at the time of booking.
            </li>
          </ul>

          <h2 className=" mb-2">9. Traveler Responsibilities</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>
              It is the traveler’s responsibility to ensure all travel documents
              (passport, visa, identification, etc.) are valid for the duration
              of the trip.
            </li>
            <li>
              Travelers must comply with all local laws, regulations, and
              customs during the tour.
            </li>
            <li>
              Any damages caused to property, hotels, or transport by the
              traveler must be paid for directly.
            </li>
          </ul>

          <h2 className=" mb-2">10. Governing Law</h2>
          <p className="mb-4">
            These Terms and Conditions shall be governed by and interpreted in
            accordance with the laws of India. Any disputes shall be subject to
            the exclusive jurisdiction of the courts in Lucknow, Uttar Pradesh.
          </p>

          <h2 className=" mb-2">11. Contact Us</h2>
          <p className="mb-4">
            For any clarification regarding these Terms and Conditions, please
            contact:
          </p>
          <p>
            <strong>TourWatchOut</strong>
            <br />
            Email:{" "}
            <a href="mailto:info@tourwatchout.com" className="text-blue-600">
              info@tourwatchout.com
            </a>
            <br />
            Website:{" "}
            <a href="https://tourwatchout.com" className="text-blue-600">
              www.tourwatchout.com
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
