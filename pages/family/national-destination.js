import React from "react";
import Link from "next/link";
import Topbar from "../../components/header/Header";
import Offcanvas from "../../components/header/Offcanvas";
import FAQs from "../../components/home/FAQs";
import Blogs from "../../components/home/Blogs";
import Popup from "../../components/corporate/Popup";
import NewFooter from "../../components/footer/NewFooter";
import PromoSection from "../../components/home/PromoSection";
import BenifitSection from "../../components/home/BenifitSection";
import MostPopular from "../../components/home/MostPopular";
import TopReviews from "../../components/home/TopReviews";
import Instagram from "../../components/home/Instagram";

function fmt(n) {
  if (!n) return null;
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function DestCard({ d }) {
  const image = d.mainImage?.src || d.images?.Family?.Economy?.src || "/assets/images/n-destination/kashmir.webp";
  const price = d.startingPrice ? fmt(d.startingPrice) : null;
  const href  = `/destination/${d.slug}`;

  return (
    <Link href={href} className="dest-slide-card">
      <div className="dest-slide-img">
        <img src={image} alt={d.mainImage?.alt || d.name || d.title} loading="lazy" />
        <div className="dest-slide-overlay">
          <h3 className="dest-slide-name">{d.name || d.title}</h3>
          {price && (
            <p className="dest-slide-price">
              Starting from <br />
              <span className="destination-card-price"><strong>{price}</strong></span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function NationalDestinationPage({ destinations = [] }) {
  return (
    <div className="dubai-family-package national-pages familypage">
      <Topbar />
      <Offcanvas />

      <div className="packages-hero-area">
        <img
          src="/assets/images/family/national-hero.webp"
          alt="National Destinations"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      <div className="package-details-page">
        <div className="container">
          <section className="package-details-tabs">

            <div className="section-header" style={{ marginBottom: "22px" }}>
              <h2 className="section-title">
                Find Your perfect <span className="highlight">National </span> Destinations
              </h2>
              <p className="section-subtitle">Plan your truly heartwarming or family getaways with TourWatchOut!</p>
            </div>

            {destinations.length > 0 ? (
              <div className="national-list-bx">
                {destinations.map(d => (
                  <DestCard key={d.id || d.slug} d={d} />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
                No destinations available yet.
              </p>
            )}

          </section>
        </div>
      </div>

      <PromoSection />
      <BenifitSection />
      <MostPopular />
      <TopReviews />
      <Instagram />
      <FAQs />
      <PromoSection />
      <Blogs />
      <Popup />
      <NewFooter />
    </div>
  );
}

export async function getServerSideProps() {
  const { readAll: readDests } = require("../../utils/destStore");
  const connectDB = require("../../utils/mongodb").default;
  const Package   = require("../../models/Package").default;

  await connectDB();

  const allDests = readDests();
  const nationalDests = allDests.filter(d => d.type === "national" && d.status === "Active");

  const pkgsRaw = await Package.find({ status: { $regex: /^active$/i } }).lean();

  const priceMap = {};
  pkgsRaw.forEach(p => {
    const price = Number(p.finalPrice || p.basePrice || 0);
    const key   = p.destination;
    if (key && (!priceMap[key] || price < priceMap[key])) priceMap[key] = price;
  });

  const destinations = nationalDests.map(d => ({
    ...d,
    startingPrice: priceMap[d.name] || priceMap[d.title] || null,
  }));

  return { props: { destinations: JSON.parse(JSON.stringify(destinations)) } };
}
