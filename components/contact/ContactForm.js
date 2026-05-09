"use client";
import { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    formType: "Contact Form",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/queries/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Your request has been sent. We'll be in touch soon.");
        setFormData({ name: "", phone: "", email: "", message: "", formType: "Contact Form" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="cf-section">
        <div className="container">
          <div className="cf-grid">

            {/* ── Left: Form ── */}
            <div className="cf-left">
              <span className="cf-tag">HAVE QUESTIONS?</span>
              <div className="cf-heading-box">
                <h2 className="cf-heading">Reach out to us today and let's start the conversation!</h2>
              </div>

              <form className="cf-form" onSubmit={handleSubmit}>
                <div className="cf-field">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="cf-row">
                  <div className="cf-field">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email*"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="cf-field">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="cf-field">
                  <textarea
                    name="message"
                    placeholder="Tell Us About Project *"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="cf-btn" disabled={loading}>
                  {loading ? "Submitting…" : "Get In Touch"}
                </button>
              </form>
            </div>

            {/* ── Right: Info ── */}
            <div className="cf-right">
              <h2 className="cf-right-title">
                Get in Touch with <span className="cf-brand">Tourwatchout</span>
              </h2>

              <div className="cf-info-item">
                <p className="cf-info-label">Location</p>
                <p className="cf-info-text">Regency Rd, Vibhuti Khand, Gomti Nagar, Lucknow,<br />Uttar Pradesh 226010</p>
                <div className="cf-divider" />
              </div>

              <div className="cf-info-item">
                <p className="cf-info-label">Email</p>
                <p className="cf-info-text">
                  <Link href="mailto:Sales1@tourwatchout.com">Sales1@tourwatchout.com</Link>
                </p>
                <div className="cf-divider" />
              </div>

              <div className="cf-info-item">
                <p className="cf-info-label">Phone</p>
                <p className="cf-info-text">
                  <Link href="tel:+918882701800">+91 88827 01800</Link>
                </p>
                <div className="cf-divider" />
              </div>

              <div className="cf-socials">
                <Link href="https://www.instagram.com/tourwatchout/" target="_blank" aria-label="Instagram">
                  <span className="cf-social-icon"><i className="ri-instagram-line"></i></span>
                </Link>
                <Link href="https://www.youtube.com/@tourwatchout" target="_blank" aria-label="YouTube">
                  <span className="cf-social-icon"><i className="ri-youtube-fill"></i></span>
                </Link>
                <Link href="https://www.facebook.com/TourWatchout/" target="_blank" aria-label="Facebook">
                  <span className="cf-social-icon"><i className="ri-facebook-fill"></i></span>
                </Link>
                <Link href="https://www.linkedin.com/company/tourwatchout" target="_blank" aria-label="LinkedIn">
                  <span className="cf-social-icon"><i className="ri-linkedin-fill"></i></span>
                </Link>
              </div>
            </div>

          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </section>

      <style jsx>{`
        .cf-section {
          background: #fff;
          padding: 80px 0 200px;
        }

        .cf-right-title span{
        color: #F74C4D;}
        .cf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        /* ── Left ── */
        .cf-tag {
       display: inline-block;
    font-size: 20px;
    font-weight: bold;
    line-height: 24px;
    color: #F74C4D;
    letter-spacing: 1.5px;
    margin-bottom: 16px;
        }
        .cf-heading-box {
          // border: 1.5px dashed #a8c4e0;
          // border-radius: 10px;
          // padding: 18px 22px;
          margin-bottom: 32px;
        }
        .cf-heading {
              font-size: 45px;
    font-weight: 500;
    color: #1a1a2e;
    line-height: 42px;
    margin: 0;
    font-family: 'Erstoria';
        }
        .cf-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .cf-field input,
        .cf-field textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          color: #1a1a2e;
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
          font-family: inherit;
        }
        .cf-field input::placeholder,
        .cf-field textarea::placeholder {
          color: #9ca3af;
        }
        .cf-field input:focus,
        .cf-field textarea:focus {
          border-color: #2563eb;
        }
        .cf-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .cf-btn {
          align-self: flex-start;
          background: #F74C4D;
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 13px 36px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .cf-btn:hover { background: #F74C4D; }
        .cf-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ── Right ── */
        .cf-right {
          padding-top: 8px;
        }
        .cf-right-title {
    font-size: 45px;
    font-weight: 500;
    color: #1a1a2e;
    line-height: 41px;
    margin-bottom: 30px;
    padding-top: 32px;
    font-family: "Erstoria";
}
        

        
        .cf-brand {
          color: #F74C4D!important;
        }
        .cf-info-item {
          margin-bottom: 4px;
        }
        .cf-info-label {
          font-size: 17px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 4px;
        }
        .cf-info-text {
          font-size: 14px;
          color: #4b5563;
          margin: 0 0 14px;
          line-height: 1.6;
        }
        .cf-info-text a {
          color: #4b5563;
          text-decoration: none;
        }
        .cf-info-text a:hover { color: #F74C4D; }
        .cf-divider {
          height: 1px;
          background: #e5e7eb;
          margin-bottom: 18px;
        }
        .cf-socials {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .cf-social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #F74C4D;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          transition: background 0.2s;
        }
        .cf-social-icon:hover { background: #F74C4D; }

        @media (max-width: 768px) {

        .cf-btn {
    padding: 10px 36px;
    font-size: 13px;
      }

        .cf-field input{
    padding: 10px 16px;
    font-size: 12px;

}

        .cf-field textarea{
    font-size: 12px;

}
        .cf-heading {
    font-size: 24px;
    font-weight: bold;
    line-height: 24px;
}

        .cf-section{
    padding: 50px 0 100px;
}

        .cf-tag{
            margin-bottom: 5px;
        font-size: 18px;}
          .cf-grid {
            grid-template-columns: 1fr;
            gap: 0px;
          }
          .cf-row {
            grid-template-columns: 1fr;
          }
          .cf-right-title { font-size: 24px; }
        }
      `}</style>
    </>
  );
}
