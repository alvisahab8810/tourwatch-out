import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function OnloadPopup() {
  const [formData, setFormData] = useState({
    fullName: "",
    destination: "",
    contact: "",
    email: "",
    formType: "TourWatchout-Form",
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFormPopup(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxo7bKXBcwDk6oGV3pz1fzDR8cpaIKAJSW82flunKKrTOg1d_anWYMpVAXnEbOIXa9B/exec",
        { method: "POST", body: new URLSearchParams(formData) }
      );
      if (response.ok) {
        setShowPopup(true);
        setShowFormPopup(false);
        setFormData({ fullName: "", destination: "", contact: "", email: "", formType: "TourWatchout-Form" });
      } else {
        toast.error("Failed to submit form. Please try again.");
      }
    } catch {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Form Popup ── */}
      {showFormPopup && (
        <div className="rop-overlay">
          <div className="rop-card">

            {/* Close button */}
            <button className="rop-close" onClick={() => setShowFormPopup(false)} aria-label="Close">✕</button>

            {/* Banner */}
            <div className="rop-banner">
              <div className="rop-banner-inner">
                <h2 className="rop-banner-title">REACH OUT TO US</h2>
                <p className="rop-banner-sub">Just A Few Details &amp; We're On It!</p>
              </div>
            </div>

            {/* Form */}
            <form className="rop-form" onSubmit={handleSubmit}>
              <input
                type="text"
                id="fullName"
                className="rop-input"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                id="destination"
                className="rop-input"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />

              {/* Phone with flag */}
              <div className="rop-phone-wrap">
                <span className="rop-phone-prefix">
                  <span className="rop-flag">🇮🇳</span>
                  <span className="rop-code">+91</span>
                  <span className="rop-divider">|</span>
                </span>
                <input
                  type="tel"
                  id="contact"
                  className="rop-phone-input"
                  placeholder="0000 0000 00"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                id="email"
                className="rop-input"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <button type="submit" className="rop-btn" disabled={loading}>
                {loading ? "Submitting…" : "Request Callback"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Success Popup ── */}
      {showPopup && (
        <div className="rop-overlay">
          <div className="rop-success-card">
            <div className="rop-success-icon">🎉</div>
            <h3 className="rop-success-title">Form Submitted Successfully!</h3>
            <p className="rop-success-msg">Thank you for reaching out. We'll get back to you soon!</p>
            <button className="rop-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .rop-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 11000;
          padding: 16px;
        }

        /* Main card */
        .rop-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          width: 100%;
          max-width: 548px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
          position: relative;
        }

        /* Close button */
        .rop-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.85);
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          z-index: 10;
          line-height: 1;
          transition: background 0.15s;
        }
        .rop-close:hover { background: #fff; }

        /* Banner */
        .rop-banner {
          height: 130px;
          background:
            linear-gradient(rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.50)),
            url('/assets/images/blogs/blog-hero.webp') center / cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px 16px 0 0;
        }
        .rop-banner-inner { text-align: center; padding: 0 20px; }
        .rop-banner-title {
          font-size: 26px;
          font-weight: 900;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: 0.6px;
          line-height: 1.15;
        }
        .rop-banner-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        /* Form */
        .rop-form {
          padding: 20px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Standard inputs */
        .rop-input {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 13px 15px;
          font-size: 14px;
          color: #0c141d;
          background: #fff;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
          transition: border 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }
        .rop-input:focus {
          border-color: #EE4C49;
          box-shadow: 0 0 0 3px rgba(238, 76, 73, 0.08);
        }
        .rop-input::placeholder { color: #b0b7c3; }

        /* Phone field */
        .rop-phone-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .rop-phone-wrap:focus-within {
          border-color: #EE4C49;
          box-shadow: 0 0 0 3px rgba(238, 76, 73, 0.08);
        }
        .rop-phone-prefix {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 10px 0 14px;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .rop-flag  { font-size: 20px; line-height: 1; }
        .rop-code  { font-size: 14px; font-weight: 600; color: #0c141d; }
        .rop-divider { color: #d1d5db; font-size: 20px; margin-left: 2px; }
        .rop-phone-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 13px 14px 13px 6px;
          font-size: 14px;
          color: #0c141d;
          background: transparent;
          font-family: inherit;
        }
        .rop-phone-input::placeholder { color: #b0b7c3; }

        /* Submit button */
        .rop-btn {
          width: 100%;
          background: #EE4C49;
          color: #fff;
          border: none;
          padding: 15px 20px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          margin-top: 2px;
          transition: background 0.2s, transform 0.1s;
        }
        .rop-btn:hover:not(:disabled) { background: #d43d3a; transform: translateY(-1px); }
        .rop-btn:disabled { opacity: 0.7; cursor: default; }

        /* Success card */
        .rop-success-card {
          background: #fff;
          border-radius: 16px;
          padding: 44px 32px 36px;
          width: 100%;
          max-width: 420px;
          text-align: center;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
        }
        .rop-success-icon { font-size: 48px; margin-bottom: 14px; }
        .rop-success-title {
          font-size: 20px;
          font-weight: 800;
          color: #0c141d;
          margin: 0 0 10px;
        }
        .rop-success-msg {
          font-size: 14px;
          color: #667085;
          line-height: 1.6;
          margin: 0 0 24px;
        }
        .rop-success-card .rop-btn { max-width: 200px; margin: 0 auto; }

        @media (max-width: 600px) {
          .rop-banner { height: 110px; }
          .rop-banner-title { font-size: 21px; }
          .rop-form { padding: 16px 16px 20px; gap: 10px; }
        }
      `}</style>
    </>
  );
}
