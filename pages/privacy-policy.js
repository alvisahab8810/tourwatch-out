import React from "react";
import Footer from "../components/footer/Footer";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";

export default function PrivacyPolicy() {
  return (
    <div>
      <Topbar />

      <Offcanvas/>

      <section className="kashmir-honeymoon-hero kashmir-hero">
        <div className="container">
          <div className="row align-items-center pt-200">
            <div className="col-md-12 about-contennt">
              <h2 className="fs-64 text-white fw-bold">Privacy Policy</h2>
            </div>
          </div>
        </div>
      </section>
      <div className="container py-5">
        <div className="privacy-policy p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="mb-4">Last updated: 10 October 2025</p>

          <p className="mb-4">
            At <strong>TourWatchOut</strong>, your privacy is extremely
            important to us. This Privacy Policy explains how we collect, use,
            share, and protect your personal information when you visit our
            website{" "}
            <a href="https://tourwatchout.com" className="text-blue-600">
              www.tourwatchout.com
            </a>{" "}
            or interact with our travel services.
          </p>

          <h2 className=" mb-2">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We collect personal and non-personal information to provide you with
            a seamless travel booking experience, including:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>
              <strong>Personal Information:</strong> Name, phone number, email
              address, billing/shipping address, passport details (if required
              for travel bookings), and payment information.
            </li>
            <li>
              <strong>Account Information:</strong> Username, password, and
              travel preferences if you create an account.
            </li>
            <li>
              <strong>Booking Details:</strong> Trip details, payment methods,
              booking history, and travel itineraries.
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, device
              information, operating system, and website usage patterns.
            </li>
            <li>
              <strong>Cookies and Tracking:</strong> We use cookies to enhance
              website functionality, analyze traffic, and personalize user
              experience.
            </li>
          </ul>

          <h2 className=" mb-2">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">Your information is used to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Process, confirm, and manage your travel bookings.</li>
            <li>
              Communicate updates about your trips, promotions, and relevant
              travel information.
            </li>
            <li>
              Improve website performance, user experience, and travel
              offerings.
            </li>
            <li>
              Prevent fraudulent transactions and ensure website security.
            </li>
            <li>Comply with applicable laws and regulations.</li>
          </ul>

          <h2 className=" mb-2">
            3. Information Sharing and Disclosure
          </h2>
          <p className="mb-4">
            We respect your privacy and do not sell your personal information.
            We may share your data with:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>
              <strong>Service Providers:</strong> Trusted travel partners,
              payment processors, hotels, airlines, and email service providers.
            </li>
            <li>
              <strong>Legal Authorities:</strong> When required by law or
              regulatory authorities.
            </li>
            <li>
              <strong>Business Transfers:</strong> In case of a merger,
              acquisition, or sale of assets, user data may be transferred to
              the new entity.
            </li>
          </ul>

          <h2 className=" mb-2">
            4. Data Retention
          </h2>
          <p className="mb-4">
            We retain your personal data only as long as necessary to fulfill
            the purposes outlined in this policy or as required by law. You may
            request deletion of your data by contacting us at{" "}
            <a href="mailto:info@tourwatchout.com" className="text-blue-600">
              info@tourwatchout.com
            </a>
            .
          </p>

          <h2 className=" mb-2">5. Data Security</h2>
          <p className="mb-4">
            We implement strict technical and organizational measures to protect
            your information against unauthorized access, misuse, or loss.
            However, no online platform can guarantee 100% security, so please
            ensure your account credentials are kept safe.
          </p>

          <h2 className=" mb-2">
            6. Cookies Policy
          </h2>
          <p className="mb-4">
            Cookies are small files stored on your device to enhance browsing
            experience. We use cookies to remember preferences, analyze traffic,
            and provide personalized recommendations. You can manage or disable
            cookies via your browser settings, but some features may not
            function properly.
          </p>

          <h2 className=" mb-2">7. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Access, correct, or delete your personal information.</li>
            <li>Opt out of marketing communications at any time.</li>
            <li>Withdraw consent for data processing where applicable.</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, contact us at{" "}
            <a href="mailto:info@tourwatchout.com" className="text-blue-600">
              info@tourwatchout.com
            </a>
            .
          </p>

          <h2 className=" mb-2">
            8. Third-Party Links
          </h2>
          <p className="mb-4">
            Our website may contain links to external sites. We are not
            responsible for their privacy practices or content. Please read
            their privacy policies before sharing personal information.
          </p>

          <h2 className=" mb-2">
            9. Policy Updates
          </h2>
          <p className="mb-4">
            We may update this Privacy Policy periodically to reflect changes in
            legal requirements or business practices. The latest version will
            always be posted on this page with an updated “Last Updated” date.
          </p>

          <h2 className=" mb-2">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions or concerns regarding this Privacy Policy
            or the handling of your personal information, contact us at:
          </p>
          <p className="mb-2">
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
