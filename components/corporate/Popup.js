"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Popup() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataWithType = { ...formData, formType: "Popup Form" }; // ✅ Ensuring correct form type

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbznGhweLHBIxRd-ehdq1MAlYkWeiLCz_8-7J37axj90qmfVzFZqZkwfNASwO-gZKHOK/exec",
        {
          method: "POST",
          body: new URLSearchParams(formDataWithType).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.ok) {
        setShowPopup(true); // ✅ Show confirmation popup
        setFormData({ name: "", phone: "", email: "" }); // ✅ Reset form
      } else {
        toast.error("Failed to submit form. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="modal popup-modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="popup-img">
                <img src="/assets/images/corporate/ad.png" alt="Ad Image" />
              </div>

              <div className="form-pop">
                <h2>Get A Callback</h2>
                <p>Let us help you decide your Dream Vacation</p>

                <Toaster /> {/* Toast Notification Container */}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Your Name
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
                      Email
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

                  <button type="submit" className="btn submit-btn" disabled={loading}>
                    {loading ? (
                      <span>
                        <i className="ri-loader-4-line ri-spin"></i> Submitting...
                      </span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Confirmation Popup */}
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
          z-index:11000;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          max-width: 400px;
          z-index:1000;

          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .popup-content h2 {
          margin-bottom: 10px;
          font-size: 22px;
        }
        .popup-content button {
          padding: 10px 20px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
