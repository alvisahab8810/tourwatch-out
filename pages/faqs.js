import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
import NewFooter from "../components/footer/NewFooter";
import Popup from "../components/corporate/Popup";

export default function FaqsPage({ faqs = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(f =>
    !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>FAQs — Tourwatchout</title>
        <meta name="description" content="Find answers to the most frequently asked questions about Tourwatchout travel packages." />
      </Head>

      <Topbar />
      <Offcanvas />

      {/* Hero */}
      <div className="faqs-page-hero">
        <div className="mini-container1">
          <h1 className="faqs-page-title">Frequently Asked Questions</h1>
          <p className="faqs-page-sub">Everything you need to know about planning your trip with us.</p>

          {/* Search */}
          <div className="faqs-search-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="faqs-search-input"
              placeholder="Search questions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="faqs-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ list */}
      <section className="faq-section" style={{ paddingTop: 48 }}>
        <div className="mini-container1">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
              <p>No FAQs found{search ? ` for "${search}"` : ""}.</p>
              {search && (
                <button onClick={() => setSearch("")} style={{ marginTop: 10, background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, color: "#374151" }}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {search && (
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                  Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
                </p>
              )}
              <div className="faq-list">
                {filtered.map((item, i) => {
                  const isOpen = activeIndex === i;
                  return (
                    <div className="faq-item" key={item.id || i}>
                      <div
                        className={`faq-question ${isOpen ? "active" : ""}`}
                        onClick={() => setActiveIndex(isOpen ? null : i)}
                      >
                        <h3>{item.question}</h3>
                        <span
                          className="faq-icon"
                          style={{
                            display: "inline-block",
                            transform: isOpen ? "rotate(-90deg)" : "rotate(90deg)",
                            transition: "0.3s ease",
                            fontSize: "20px",
                            color: isOpen ? "#26828d" : "#34384c",
                          }}
                        >
                          &gt;
                        </span>
                      </div>
                      <div className={`faq-answer ${isOpen ? "active" : ""}`}>
                        <p>{item.answer}</p>
                      </div>
                      <div className="faq-divider"></div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/" className="explore-more-btn" style={{ display: "inline-block" }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Popup />
      <NewFooter />

      <style jsx>{`
        .faqs-page-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
          padding: 60px 0 48px;
          text-align: center;
        }
        .faqs-page-title {
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .faqs-page-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
          margin: 0 0 28px;
        }
        .faqs-search-wrap {
          max-width: 500px;
          margin: 0 auto;
          background: #fff;
          border-radius: 50px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          gap: 10px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }
        .faqs-search-wrap svg { color: #9ca3af; flex-shrink: 0; }
        .faqs-search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 14px 0;
          font-size: 15px;
          color: #111827;
          background: transparent;
          font-family: inherit;
        }
        .faqs-search-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 14px;
          padding: 4px;
          line-height: 1;
        }
        .faqs-search-clear:hover { color: #374151; }

        @media (max-width: 600px) {
          .faqs-page-title { font-size: 26px; }
          .faqs-page-sub { font-size: 14px; }
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps() {
  const connectDB = require("../utils/mongodb").default;
  const Faq = require("../models/Faq").default;
  await connectDB();
  const faqs = await Faq.find({ status: "published" }).sort({ order: 1, createdAt: 1 }).lean();
  return {
    props: {
      faqs: JSON.parse(JSON.stringify(faqs.map(f => ({ ...f, id: String(f._id) })))),
    },
  };
}
