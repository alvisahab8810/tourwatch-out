"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Popup() {
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    phone: "",
    email: "",
  });

  const [loading,   setLoading]   = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Auto-show after 2 seconds — uses window.bootstrap (loaded via CDN script tag)
  useEffect(() => {
    let retryId;

    function tryShow() {
      const el = document.getElementById("exampleModalCenter");
      if (!el) return;
      if (window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(el).show();
      } else {
        // Bootstrap script not ready yet — retry in 300ms
        retryId = setTimeout(tryShow, 300);
      }
    }

    const timer = setTimeout(tryShow, 2000);
    return () => { clearTimeout(timer); clearTimeout(retryId); };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataWithType = { ...formData, formType: "Popup Form" };
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbznGhweLHBIxRd-ehdq1MAlYkWeiLCz_8-7J37axj90qmfVzFZqZkwfNASwO-gZKHOK/exec",
        {
          method: "POST",
          body: new URLSearchParams(formDataWithType).toString(),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      if (response.ok) {
        // Hide Bootstrap modal then show success
        try {
          const el = document.getElementById("exampleModalCenter");
          if (el && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(el).hide();
        } catch {}
        setShowPopup(true);
        setFormData({ name: "", destination: "", phone: "", email: "" });
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
      <Toaster />

      {/* ── Bootstrap Modal (keep ID — used by 45+ triggers sitewide) ── */}
      <div
        className="modal popup-modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered rop-dialog">
          <div className="modal-content rop-modal-content">

            {/* Close */}
            <button
              type="button"
              className="rop-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >✕</button>

            {/* Banner */}
            <div className="rop-banner">
              <div className="rop-banner-inner">
                <h2 className="rop-banner-title">REACH OUT TO US</h2>
                <img src="/assets/images/blogs/line.svg" alt="Plane" style={{ width: 370, height: 1 }} />
                <p className="rop-banner-sub">Just A Few Details &amp; We're On It!</p>
              </div>
            </div>

            {/* Form */}
            <form className="rop-form" onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                className="rop-input"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="destination"
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
                  name="phone"
                  className="rop-phone-input"
                  placeholder="0000 0000 00"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                className="rop-input"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <button type="submit" className="rop-btn" disabled={loading}>
                {loading ? "Submitting…" : "Request A Call back"}
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* ── Success Popup ── */}
      {showPopup && (
        <div className="rop-overlay">
          <div className="rop-success-card">
            <div className="rop-success-icon">🎉</div>
            <h3 className="rop-success-title">Form Submitted Successfully!</h3>
            <p className="rop-success-msg">Thank you for reaching out. We'll get back to you soon!</p>
            <button className="rop-btn" style={{ maxWidth: 200, margin: "0 auto" }} onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        /*
          Fix Bootstrap modal layout shift.
          Bootstrap adds padding-right to body when modal opens to compensate
          for the scrollbar disappearing. Keeping the scrollbar always visible
          (overflow-y: scroll on html) means there's nothing to compensate for,
          so we can safely zero out the padding.
        */
        html { overflow-y: scroll; }
        body.modal-open { padding-right: 0 !important; overflow: hidden; }
        .modal { padding-right: 0 !important; }
      `}</style>

      <style jsx>{`
        :global(.rop-dialog) {
          max-width: 548px;
          width: 100%;
        }
        :global(.rop-modal-content) {
          border: none;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          position: relative;
          padding: 0;
        }
        :global(.rop-close) {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.85);
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
        :global(.rop-close:hover) { background: #fff; }
        :global(.rop-banner) {
          height: 201px;
          padding: 25px 0;
          background-image: url('/assets/images/blogs/cta.webp');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }
        :global(.rop-banner-inner) { padding: 0 25px; }
        :global(.rop-banner-title) {
          font-size: 30px;
          font-weight: 900;
          color: #fff;
          margin: 0 0 0px;
          letter-spacing: 0.6px;
          line-height: 1.15;
        }
        :global(.rop-banner-sub) {
          font-size: 15px;
          color: #fff;
          margin: 0;
              margin-top: 3px;
        }
        :global(.rop-form) {
          padding: 16px 22px 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        :global(.rop-input) {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px 15px;
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
        :global(.rop-input:focus) {
          border-color: #EE4C49;
          box-shadow: 0 0 0 3px rgba(238,76,73,0.08);
        }
        :global(.rop-input::placeholder) { color: #b0b7c3; }
        :global(.rop-select) { cursor: pointer; color: #0c141d; }
        :global(.rop-select option) { color: #0c141d; }
        :global(.rop-phone-wrap) {
          display: flex;
          align-items: center;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
          transition: border 0.2s, box-shadow 0.2s;
        }
        :global(.rop-phone-wrap:focus-within) {
          border-color: #EE4C49;
          box-shadow: 0 0 0 3px rgba(238,76,73,0.08);
        }
        :global(.rop-phone-prefix) {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 10px 0 14px;
          flex-shrink: 0;
          white-space: nowrap;
        }
        :global(.rop-flag)    { font-size: 20px; line-height: 1; }
        :global(.rop-code)    { font-size: 14px; font-weight: 600; color: #0c141d; }
        :global(.rop-divider) { color: #d1d5db; font-size: 20px; margin-left: 2px; }
        :global(.rop-phone-input) {
          flex: 1;
          border: none;
          outline: none;
          padding: 12px 14px 12px 6px;
          font-size: 14px;
          color: #0c141d;
          background: transparent;
          font-family: inherit;
        }
        :global(.rop-phone-input::placeholder) { color: #b0b7c3; }
        :global(.rop-btn) {
          width: 100%;
          background: #EE4C49;
          color: #fff;
          border: none;
          padding: 14px 20px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          margin-top: 2px;
          transition: background 0.2s, transform 0.1s;
          display: block;
        }
        :global(.rop-btn:hover:not(:disabled)) { background: #d43d3a; transform: translateY(-1px); }
        :global(.rop-btn:disabled) { opacity: 0.7; cursor: default; }
        .rop-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 11000;
          padding: 16px;
        }
        .rop-success-card {
          background: #fff;
          border-radius: 16px;
          padding: 44px 32px 36px;
          width: 100%;
          max-width: 420px;
          text-align: center;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
        }
        .rop-success-icon  { font-size: 48px; margin-bottom: 14px; }
        .rop-success-title { font-size: 20px; font-weight: 800; color: #0c141d; margin: 0 0 10px; }
        .rop-success-msg   { font-size: 14px; color: #667085; line-height: 1.6; margin: 0 0 24px; }
        @media (max-width: 600px) {
          :global(.rop-dialog)       { max-width: calc(100% - 32px); }
          :global(.rop-banner)       { height: 140px; }
          :global(.rop-banner-title) { font-size: 22px; line-height:12px; }
          :global(.rop-form)         { padding: 14px 16px 18px; gap: 9px; }

          .rop-banner-inner img{
          width: 100%!important;}
        }

        .rop-input {
            padding: 10px 15px!important;
                font-size: 12px!important;
        }

        .rop-banner-sub {
    font-size: 13px!important;
    margin-top: -5px!important;
}

        .rop-phone-input {
         font-size: 12px!important;
}

.rop-phone-prefix span {
    font-size: 12px;
}

.rop-close {
line-height: 20px!important;
      }

      .rop-btn{

      padding: 12px 20px!important;
      font-size: 12px!important;
      }
      `}</style>
    </>
  );
}
