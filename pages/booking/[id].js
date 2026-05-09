import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Topbar from "../../components/header/Header";
import Offcanvas from "../../components/header/Offcanvas";
import NewFooter from "../../components/footer/NewFooter";

function fmt(n) {
  const num = Number(n);
  if (!num) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

export async function getServerSideProps({ params }) {
  const connectDB = require("../../utils/mongodb").default;
  const Booking   = require("../../models/Booking").default;

  await connectDB();
  const doc = await Booking.findOne({ bookingId: params.id }).lean();
  if (!doc) return { notFound: true };

  return {
    props: { booking: JSON.parse(JSON.stringify(doc)) },
  };
}

export default function BookingConfirmPage({ booking }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const travelers = `${booking.adults} Adult${booking.adults > 1 ? "s" : ""}${
    booking.children > 0 ? `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}` : ""
  }`;

  return (
    <>
      <Head>
        <title>Booking Confirmed — {booking.bookingId} | TourWatchOut</title>
      </Head>
      <Topbar />
      <Offcanvas />

      <div className="bc-page">
        <div className="bc-container">
          <div className="bc-card">

            {/* Header */}
            <div className="bc-header">
              <div className="bc-check-circle">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="bc-confirmed-title">Booking Confirmed!</h1>
              <p className="bc-confirmed-sub">Thank you for choosing TourWatchOut. We can&apos;t wait to take you there.</p>
              <div className="bc-booking-id-row">
                <div className="bc-bid-label">Booking ID</div>
                <div className="bc-bid-value">{booking.bookingId}</div>
              </div>
            </div>

            {/* Body */}
            <div className="bc-body">

              {/* Trip Details */}
              <div className="bc-section-title">Trip Details</div>
              <div className="bc-detail-block">
                <div className="bc-row">
                  <span className="bc-row-label">Package</span>
                  <span className="bc-row-value">{booking.packageName || booking.destination}</span>
                </div>
                <div className="bc-row">
                  <span className="bc-row-label">Destination</span>
                  <span className="bc-row-value">{booking.destination}</span>
                </div>
                {booking.duration && (
                  <div className="bc-row">
                    <span className="bc-row-label">Duration</span>
                    <span className="bc-row-value">{booking.duration}</span>
                  </div>
                )}
                <div className="bc-row">
                  <span className="bc-row-label">Travel Date</span>
                  <span className="bc-row-value">{mounted ? fmtDate(booking.travelDate) : "—"}</span>
                </div>
                <div className="bc-row">
                  <span className="bc-row-label">Travelers</span>
                  <span className="bc-row-value">{travelers}</span>
                </div>
                <div className="bc-total-row">
                  <span className="bc-total-label">Total Amount</span>
                  <span className="bc-total-value">{fmt(booking.totalAmount)}</span>
                </div>
              </div>

              {/* Traveler Details */}
              <div className="bc-section-title">Lead Traveler</div>
              <div className="bc-detail-block">
                <div className="bc-row">
                  <span className="bc-row-label">Name</span>
                  <span className="bc-row-value">{booking.leadName}</span>
                </div>
                <div className="bc-row">
                  <span className="bc-row-label">Email</span>
                  <span className="bc-row-value">{booking.email}</span>
                </div>
                <div className="bc-row">
                  <span className="bc-row-label">Phone</span>
                  <span className="bc-row-value">+91 {booking.phone}</span>
                </div>
                {booking.address && (
                  <div className="bc-row">
                    <span className="bc-row-label">Address</span>
                    <span className="bc-row-value">{booking.address}</span>
                  </div>
                )}
                {(booking.city || booking.state) && (
                  <div className="bc-row">
                    <span className="bc-row-label">City / State</span>
                    <span className="bc-row-value">{[booking.city, booking.state].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              <div className="bc-section-title">Payment</div>
              <div className="bc-detail-block">
                <div className="bc-row">
                  <span className="bc-row-label">Method</span>
                  <span className="bc-row-value">Pay at Office (COD)</span>
                </div>
                <div className="bc-row">
                  <span className="bc-row-label">Payment Status</span>
                  <span className="bc-row-value">
                    <span className="bc-status-badge bc-status-pending">Pending</span>
                  </span>
                </div>
                <div className="bc-row">
                  <span className="bc-row-label">Booking Status</span>
                  <span className="bc-row-value">
                    <span className="bc-status-badge bc-status-confirmed">Confirmed</span>
                  </span>
                </div>
              </div>

              {/* Info alert */}
              <div className="bc-alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>
                  Our team will reach out to you at <strong>{booking.phone}</strong> within 24 hours to confirm your trip details and guide you on the payment process.
                  Please keep your Booking ID <strong>{booking.bookingId}</strong> handy for reference.
                </span>
              </div>

              {/* Actions */}
              <div className="bc-actions">
                <Link href="/" className="bc-btn-primary">Go to Homepage</Link>
                <a href="https://wa.link/pshqg5" target="_blank" rel="noreferrer" className="bc-btn-outline">
                  Chat on WhatsApp
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      <NewFooter />
    </>
  );
}
