"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    formType: "Contact Us Form", // 📌 Form Type for Sheet
  });

  const [loading, setLoading] = useState(false); // 🔥 State for Loader
  const [showPopup, setShowPopup] = useState(false); // 🔥 State for Popup

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔥 Show loader

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbznGhweLHBIxRd-ehdq1MAlYkWeiLCz_8-7J37axj90qmfVzFZqZkwfNASwO-gZKHOK/exec",
        {
          method: "POST",
          body: new URLSearchParams(formData).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.ok) {
        setShowPopup(true); // ✅ Show Popup
        setFormData({
          name: "",
          phone: "",
          email: "",
          formType: "Contact Us Form",
        }); // ✅ Reset form
      } else {
        alert("Failed to submit. Try again."); // ❌ Show error message
      }
    } catch (error) {
      alert("Failed to submit. Try again."); // ❌ Show error message
    } finally {
      setLoading(false); // 🔥 Hide loader after submission
    }
  };

  return (
    <>
      <section className="contact-form-section">
        <div className="container">
          <div className="row pt-100 flex-wrap-bx">
            <div className="col-md-6 c-leftbx">
              <h2>Get in Touch with Tourwatchout</h2>
              <p className="contact-para">
                 Our team is dedicated to turning your travel aspirations into reality by crafting unforgettable journeys tailored to your unique preferences and passions. Whether you dream of exploring uncharted landscapes, immersing yourself in vibrant cultures, or simply finding a serene escape, we bring expertise, creativity, and care to every step of your adventure.
              </p>

              <div className="c-parent-bx">
                <div className="contact-info d-flex align-items-center mb-3">
                  <i className="ri-phone-line"></i>
                  <div className="ms-3">
                    <h5>Phone</h5>
                    <p>
                      <Link href="tel:+91 8882701800">+91 8882701800</Link>
                    </p>
                  </div>
                </div>
                <div className="contact-info d-flex align-items-center mb-3">
                  <i className="ri-mail-line"></i>
                  <div className="ms-3">
                    <h5>Email</h5>
                    <p>
                      <Link href="mailto:sales1@tourwatchout.com">
                        sales1@tourwatchout.com
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-info d-flex align-items-center mb-3">
                <i className="ri-map-pin-line"></i>
                <div className="ms-3">
                  <h5>Office Address</h5>
                  <p>
                    DLF MyPad B-1 10th Floor Vibhuti Khand, Gomti Nagar,
                    Lucknow, Uttar Pradesh 226010
                  </p>
                </div>
              </div>
              <div className="social-icons">
                <h5>Follow Us on Social Media</h5>
                <div className="social-icons1">
                  <Link href="https://www.facebook.com/TourWatchout/">
                    <i className="ri-facebook-fill"></i>
                  </Link>
                  <Link href="https://www.instagram.com/tourwatchout/">
                    <i className="ri-instagram-line"></i>
                  </Link>
                  <Link href="https://x.com/tourwatchout">
                    <i>
                      <img src="./assets/images/icons/x.png" alt="X Logo" />
                    </i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 c-right-bx">
              <h2>Reach out to us today and let’s start the conversation!</h2>
              <p>
                Have questions, feedback, or need assistance with planning your
                next adventure? Get in touch with us today!
              </p>
              <div className="contact-form p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-block" disabled={loading}>
                    {loading ? (
                      <span>
                        <i className="ri-loader-4-line ri-spin"></i> Submitting...
                      </span>
                    ) : (
                      "Contact Us"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Form Submitted Successfully! 🎉</h2>
            <p>Thank you for reaching out. We'll get back to you soon!</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ✅ Popup Styles */}
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
          .popup-content p{
           font-size: 13px;
           margin-top: 20px;
            margin-bottom: 20px;
          }
        .popup-content h2 {
          margin-bottom: 10px;
          font-size:22px;
        }
        .popup-content button {
          padding: 10px 20px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 5px;
          font-size:14px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
