"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

function fmtINR(n) {
  const num = Number(n);
  if (!num) return "";
  return "₹" + num.toLocaleString("en-IN");
}

export default function Popup({ packageInfo, asDrawer, destination: destProp, autoShowDelay = 2000 }) {
  const prefillDest = packageInfo?.name || destProp || "";
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    destination: prefillDest,
    travelDate: "", pax: "", message: "",
  });
  const [honeypot, setHoneypot] = useState("");   // must stay empty — bot trap
  const [loading,   setLoading]   = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const formLoadTime  = useRef(Date.now());
  const travelDateRef = useRef(null);

  // Capture UTM / ad tracking params from URL once on mount
  const [utmData, setUtmData] = useState({});
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtmData({
      source:     p.get("utm_source")   || "",
      medium:     p.get("utm_medium")   || "",
      campaign:   p.get("utm_campaign") || "",
      adset:      p.get("utm_adset")    || p.get("utm_term") || "",
      adContent:  p.get("utm_content")  || "",
      campaignId: p.get("utm_id")       || p.get("campaign_id") || "",
    });
  }, []);

  // Auto-show only when autoShowDelay prop is provided (e.g. package pages)
  useEffect(() => {
    if (!autoShowDelay) return;
    let retryId;
    function tryShow() {
      const el = document.getElementById("exampleModalCenter");
      if (!el) return;
      if (window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(el).show();
      } else {
        retryId = setTimeout(tryShow, 300);
      }
    }
    const timer = setTimeout(tryShow, autoShowDelay);
    return () => { clearTimeout(timer); clearTimeout(retryId); };
  }, [autoShowDelay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Phone: only allow digits, spaces, +, -, ()
    if (name === "phone") {
      const cleaned = value.replace(/[^\d\s+\-()]/g, "");
      setFormData(p => ({ ...p, phone: cleaned }));
      return;
    }
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ── Client-side validation ── */
    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.", { id: "form-err" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.", { id: "form-err" });
      return;
    }
    if (!formData.travelDate) {
      toast.error("Please select your travel date.", { id: "form-err" });
      return;
    }
    if (!formData.pax || parseInt(formData.pax) < 1) {
      toast.error("Please enter number of travellers.", { id: "form-err" });
      return;
    }

    setLoading(true);

    try {
      /* ── 1. Submit to our secure API first ── */
      const apiRes = await fetch("/api/dashboard/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          formType: "Popup Form",
          ...utmData,
          _hp: honeypot,              // honeypot value (should be empty)
          _t:  formLoadTime.current,  // when form was loaded
        }),
      });

      /* ── Handle specific error codes ── */
      if (apiRes.status === 409) {
        const data = await apiRes.json().catch(() => ({}));
        if (data.field === "phone") {
          toast.error("This mobile number is already registered with us. Our team will reach out to you soon!", { id: "form-err", duration: 6000 });
        } else {
          toast.error("This email is already registered with us. Our team will reach out to you soon!", { id: "form-err", duration: 6000 });
        }
        setLoading(false);
        return;
      }

      if (apiRes.status === 429) {
        toast.error("Too many attempts. Please try again after some time.", { id: "form-err" });
        setLoading(false);
        return;
      }

      if (!apiRes.ok) {
        const data = await apiRes.json().catch(() => ({}));
        toast.error(data.message || "Failed to submit. Please try again.", { id: "form-err" });
        setLoading(false);
        return;
      }

      /* ── 2. Also push to Google Sheet (fire-and-forget) ── */
      fetch(
        "https://script.google.com/macros/s/AKfycbznGhweLHBIxRd-ehdq1MAlYkWeiLCz_8-7J37axj90qmfVzFZqZkwfNASwO-gZKHOK/exec",
        {
          method:  "POST",
          body:    new URLSearchParams({ ...formData, formType: "Popup Form" }).toString(),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      ).catch(() => {});

      /* ── 3. Success ── */
      try {
        const el = document.getElementById("exampleModalCenter");
        if (el && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(el).hide();
      } catch {}
      setShowPopup(true);
      setFormData({ name: "", email: "", phone: "", destination: prefillDest, travelDate: "", pax: "", message: "" });
      formLoadTime.current = Date.now(); // reset for next submission

    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Bootstrap Modal (keep ID — used by 45+ triggers sitewide) ── */}
      <div
        className={`modal popup-modal${asDrawer ? " popup-modal-drawer" : ""} fade`}
        id="exampleModalCenter"
        tabIndex="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered rop-dialog">
          <div className="modal-content rop-modal-content">

            {/* Mobile-only drag handle — hidden on desktop */}
            <div className="rop-drawer-handle">
              <div className="rop-drawer-pill" />
              <p className="rop-drawer-title">Request Callback</p>
            </div>

            {/* Close */}
            <button
              type="button"
              className="rop-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >✕</button>

            {/* Banner — hidden on package/itinerary pages */}
            {!packageInfo && (
              <div className="rop-banner">
                <div className="rop-banner-inner">
                  <h2 className="rop-banner-title">REACH OUT TO US</h2>
                  <img src="/assets/images/blogs/line.svg" alt="Plane" style={{ width: 370, height: 1 }} />
                  <p className="rop-banner-sub">Just A Few Details &amp; We're On It!</p>
                </div>
              </div>
            )}

            {/* Package info strip — only shown on package pages */}
            {packageInfo && (
              <div style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"12px 22px", background:"#fff7f7",
                borderBottom:"1px solid #fde8e8",
              }}>
                {packageInfo.image && (
                  <img
                    src={packageInfo.image}
                    alt={packageInfo.name}
                    onError={e => { e.target.style.display = "none"; }}
                    style={{
                      width:72, height:56, objectFit:"cover",
                      borderRadius:8, flexShrink:0, display:"block",
                    }}
                  />
                )}
                <div style={{ minWidth:0, flex:1 }}>
                  <p style={{
                    fontSize:13, fontWeight:700, color:"#111",
                    margin:"0 0 5px", whiteSpace:"nowrap",
                    overflow:"hidden", textOverflow:"ellipsis",
                  }}>{packageInfo.name}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    {packageInfo.basePrice && packageInfo.finalPrice &&
                      String(packageInfo.basePrice) !== String(packageInfo.finalPrice) && (
                      <span style={{ fontSize:12, color:"#9ca3af", textDecoration:"line-through" }}>
                        {fmtINR(packageInfo.basePrice)}
                      </span>
                    )}
                    <span style={{ fontSize:15, fontWeight:800, color:"#EE4C49" }}>
                      {fmtINR(packageInfo.finalPrice || packageInfo.basePrice)}
                    </span>
                    {packageInfo.basePrice && packageInfo.finalPrice &&
                      String(packageInfo.basePrice) !== String(packageInfo.finalPrice) && (
                      <span style={{
                        fontSize:11, fontWeight:700, color:"#15803d",
                        background:"#dcfce7", borderRadius:4, padding:"2px 6px",
                      }}>
                        SAVE {fmtINR(Number(packageInfo.basePrice) - Number(packageInfo.finalPrice))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form className="rop-form" onSubmit={handleSubmit} autoComplete="off">

              {/* ── Honeypot — invisible to humans, filled by bots ── */}
              <div aria-hidden="true" style={{ position:"absolute", left:"-9999px", width:1, height:1, overflow:"hidden", opacity:0 }}>
                <label htmlFor="rop_website">Website</label>
                <input
                  id="rop_website"
                  type="text"
                  name="_hp"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="nope"
                />
              </div>

              <input
                type="text"
                name="name"
                className="rop-input"
                placeholder="Full Name*"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="destination"
                className="rop-input"
                placeholder="Destination (e.g. Kashmir, Goa…)"
                value={formData.destination}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                className="rop-input"
                placeholder="Email*"
                value={formData.email}
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
                  placeholder="Your Phone*"
                  value={formData.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={15}
                  required
                />
              </div>

              {/* Travel Date + Traveller Count — side by side */}
              <div style={{ display:"flex", gap:8 }}>

                {/* Date — formatted display div + full-size transparent input on top */}
                <div
                  style={{ position:"relative", flex:1 }}
                  onClick={() => { try { travelDateRef.current?.showPicker(); } catch {} }}
                >
                  {/* Visible formatted text */}
                  <div
                    className="rop-input"
                    style={{
                      pointerEvents:"none", userSelect:"none",
                      color: formData.travelDate ? "#0c141d" : "#b0b7c3",
                    }}
                  >
                    {formData.travelDate
                      ? new Date(formData.travelDate + "T00:00:00").toLocaleDateString("en-IN", {
                          day:"2-digit", month:"long", year:"numeric",
                        })
                      : "Travel Date*"}
                  </div>
                  {/* Full-size transparent input — Chrome requires real dimensions for showPicker() */}
                  <input
                    ref={travelDateRef}
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    style={{
                      position:"absolute", inset:0,
                      width:"100%", height:"100%",
                      opacity:0, cursor:"pointer",
                    }}
                  />
                </div>

                <input
                  type="number"
                  name="pax"
                  className="rop-input"
                  placeholder="Traveller Count*"
                  value={formData.pax}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  inputMode="numeric"
                  style={{ flex:1 }}
                />
              </div>

              <textarea
                name="message"
                className="rop-input"
                placeholder="Message..."
                value={formData.message}
                onChange={handleChange}
                rows={2}
                style={{ resize:"none" }}
              />

              <button id="popup-submit-btn" type="submit" className="rop-btn" disabled={loading}
                style={loading ? { opacity: 1, background: "#EE4C49", cursor: "not-allowed" } : {}}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span className="rop-spinner" />
                    Sending your request…
                  </span>
                ) : "Connect with an Expert"}
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* ── Success Popup ── */}
      {showPopup && (
        <div className="rop-overlay" onClick={e => { if (e.target === e.currentTarget) setShowPopup(false); }}>
          <div className="rop-success-card">

            {/* top banner */}
            <div className="rop-sc-banner">
              <svg className="rop-sc-plane" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 32L56 8L44 56L30 38L8 32Z" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M30 38L34 52L44 40" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="rop-sc-check">
                <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="25" stroke="white" strokeWidth="2"/>
                  <path d="M14 26L22 34L38 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rop-check-path"/>
                </svg>
              </div>
            </div>

            {/* body */}
            <div className="rop-sc-body">
              <h3 className="rop-sc-title">Request Received!</h3>
              <p className="rop-sc-sub">Our travel expert will reach out to you shortly.</p>

              <div className="rop-sc-steps">
                <div className="rop-sc-step">
                  <span className="rop-sc-step-num">1</span>
                  <span>Our expert reviews your details</span>
                </div>
                <div className="rop-sc-step">
                  <span className="rop-sc-step-num">2</span>
                  <span>We call you within <strong>24 hours</strong></span>
                </div>
                <div className="rop-sc-step">
                  <span className="rop-sc-step-num">3</span>
                  <span>Get your custom travel plan ✈️</span>
                </div>
              </div>

              <button className="rop-sc-btn" onClick={() => setShowPopup(false)}>
                Got It, Thanks!
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx global>{`
        html { overflow-y: scroll; }
        body.modal-open { padding-right: 0 !important; overflow: hidden; }
        .modal { padding-right: 0 !important; }

        /* ── Mobile: bottom-drawer (package pages only, via asDrawer prop) ── */
        @media (max-width: 760px) {
          /* Pin the dialog to the bottom — bypasses Bootstrap's flex centering */
          .popup-modal-drawer .modal-dialog {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: auto !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            min-height: unset !important;
            display: block !important;
          }
          /* Slide-up animation */
          .popup-modal-drawer.fade .modal-dialog {
            transform: translateY(100%) !important;
            transition: transform 0.36s cubic-bezier(0.32, 0.72, 0, 1) !important;
          }
          .popup-modal-drawer.show .modal-dialog {
            transform: translateY(0) !important;
          }
          /* Full-width, top-rounded, scrollable — override responsive.css max-width:320px */
          .popup-modal-drawer .modal-content,
          .popup-modal-drawer .rop-modal-content {
            border-radius: 22px 22px 0 0 !important;
            max-height: 88vh !important;
            overflow-y: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          /* Hide banner, show compact drawer handle */
          .popup-modal-drawer .rop-banner { display: none !important; }
          .popup-modal-drawer .rop-drawer-handle { display: block !important; }
        }
      `}</style>

      <style jsx>{`
        :global(.rop-dialog) {
          max-width: 548px;
          width: 100%;
        }
        :global(.rop-drawer-handle) {
          display: none; /* shown only on mobile via global CSS */
          padding: 10px 20px 6px;
          background: #fff;
          text-align: center;
        }
        :global(.rop-drawer-pill) {
          width: 40px;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          margin: 0 auto 10px;
        }
        :global(.rop-drawer-title) {
          font-size: 16px;
          font-weight: 800;
          color: #111;
          margin: 0;
          text-align: left;
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

        /* spinner */
        :global(.rop-spinner) {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: rop-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes rop-spin { to { transform: rotate(360deg); } }
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
          background: rgba(10,15,30,0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 11000;
          padding: 16px;
          animation: rop-fade-in 0.2s ease;
        }
        @keyframes rop-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .rop-success-card {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 420px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.28);
          animation: rop-pop-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes rop-pop-in {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        /* banner */
        .rop-sc-banner {
          background: linear-gradient(135deg, #EE4C49 0%, #c0392b 100%);
          padding: 36px 24px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .rop-sc-banner::before {
          content: '';
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          top: -60px; right: -50px;
        }
        .rop-sc-banner::after {
          content: '';
          position: absolute;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          bottom: -40px; left: -30px;
        }
        .rop-sc-plane {
          width: 36px; height: 36px;
          position: absolute; top: 16px; right: 20px;
          opacity: 0.6;
        }
        .rop-sc-check {
          width: 72px; height: 72px;
          position: relative; z-index: 1;
        }
        .rop-check-path {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: rop-draw 0.5s ease 0.25s forwards;
        }
        @keyframes rop-draw {
          to { stroke-dashoffset: 0; }
        }

        /* body */
        .rop-sc-body {
          padding: 28px 28px 30px;
          text-align: center;
        }
        .rop-sc-title {
          font-size: 22px;
          font-weight: 900;
          color: #0c141d;
          margin: 0 0 6px;
          letter-spacing: -0.3px;
        }
        .rop-sc-sub {
          font-size: 14px;
          color: #667085;
          margin: 0 0 22px;
          line-height: 1.55;
        }

        /* steps */
        .rop-sc-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
          text-align: left;
        }
        .rop-sc-step {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13.5px;
          color: #374151;
          background: #fef2f2;
          border-radius: 10px;
          padding: 10px 14px;
        }
        .rop-sc-step-num {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: #EE4C49;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* close button */
        .rop-sc-btn {
          width: 100%;
          background: linear-gradient(135deg, #EE4C49 0%, #c0392b 100%);
          color: #fff;
          border: none;
          padding: 14px 20px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition: opacity 0.2s, transform 0.1s;
          box-shadow: 0 4px 16px rgba(238,76,73,0.35);
        }
        .rop-sc-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        @media (max-width: 600px) {
          :global(.rop-dialog)       { max-width: 100%; }
          :global(.rop-form)         { padding: 14px 16px 18px; gap: 9px; }
          :global(.rop-banner-title) { font-size: 23px; }

        .rop-input {
            padding: 10px 15px!important;
            font-size: 12px!important;
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
