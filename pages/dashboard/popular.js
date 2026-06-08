import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdSearch, MdStar, MdStarBorder,
} from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

export default function PopularPackages() {
  const router = useRouter();
  const openSidebar = useOpenSidebar();
  const [packages, setPackages] = useState([]);
  const [search,  setSearch]  = useState("");
  const [saving,  setSaving]  = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/packages")
      .then(r => r.json())
      .then(setPackages)
      .catch(() => {});
  }, []);

  async function togglePopular(id, current) {
    setSaving(id);
    // Optimistic update
    setPackages(prev => prev.map(p => p.id === id ? { ...p, popular: !current } : p));
    try {
      const res = await fetch(`/api/dashboard/packages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ popular: !current }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      toast.success(!current ? "Marked as popular" : "Removed from popular");
    } catch (err) {
      // Revert optimistic update on failure
      setPackages(prev => prev.map(p => p.id === id ? { ...p, popular: current } : p));
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(null);
    }
  }

  const filtered = packages.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.packageName?.toLowerCase().includes(q) ||
      p.destination?.toLowerCase().includes(q) ||
      p.packageSubtype?.toLowerCase().includes(q)
    );
  });

  const popularCount = packages.filter(p => p.popular).length;

  return (
    <>
      <Toaster position="top-right" />
      <Head><title>Most Popular — Tourwatchout</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}>
            <MdMenu size={22} />
          </button>
          <h1 className="bk-page-title">Most Popular Packages</h1>
        </div>
        <div className="bk-header-right">
          <div className="bk-team-pill"><span>Sales Team</span><MdKeyboardArrowDown size={16} /></div>
          <button className="bk-avatar-btn">
            <MdPeople size={18} color="#2563eb" />
            <span className="bk-avatar-badge">4</span>
          </button>
        </div>
      </header>

      <div className="bk-content">

            {/* Info bar */}
            <div className="pop-info-bar">
              <div className="pop-count-pill">
                <MdStar size={18} color="#f59e0b" />
                <span><strong>{popularCount}</strong> packages marked as popular</span>
              </div>
              <p className="pop-hint">
                Click the star on any package to show it in the homepage "Most Popular" carousel.
              </p>
            </div>

            {/* Search */}
            <div className="bk-topbar" style={{ marginBottom: 24 }}>
              <div className="bk-search-wrap">
                <MdSearch size={18} className="bk-search-icon" />
                <input
                  className="bk-search-input"
                  placeholder="Search by name or destination…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <p className="pop-total">{filtered.length} packages</p>
            </div>

            {/* Package grid */}
            <div className="pop-grid">
              {filtered.length === 0 ? (
                <p style={{ color: "#9ca3af", gridColumn: "1/-1" }}>No packages found.</p>
              ) : filtered.map(pkg => (
                <div
                  key={pkg.id}
                  className={`pop-card ${pkg.popular ? "pop-card--active" : ""}`}
                >
                  <div className="pop-card-img">
                    {pkg.featureImage?.src
                      ? <img src={pkg.featureImage.src} alt={pkg.packageName || pkg.destination} />
                      : <span className="pop-card-no-img">No Image</span>
                    }
                  </div>

                  <div className="pop-card-body">
                    <div className="pop-card-name">{pkg.packageName || pkg.destination}</div>
                    <div className="pop-card-meta">
                      <span className="pop-card-dest">{pkg.destination}</span>
                      {pkg.duration && (
                        <span className="pop-card-badge">{pkg.duration}</span>
                      )}
                      <span className={`pop-card-status ${pkg.status === "Active" ? "active" : "inactive"}`}>
                        {pkg.status}
                      </span>
                    </div>
                    {(pkg.finalPrice || pkg.basePrice) && (
                      <div className="pop-card-price">
                        ₹{Number(pkg.finalPrice || pkg.basePrice).toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>

                  <button
                    className={`pop-star-btn ${pkg.popular ? "active" : ""}`}
                    onClick={() => togglePopular(pkg.id, !!pkg.popular)}
                    disabled={saving === pkg.id}
                    title={pkg.popular ? "Remove from popular" : "Mark as popular"}
                  >
                    {pkg.popular ? <MdStar size={22} /> : <MdStarBorder size={22} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

      <style jsx>{`
        .pop-info-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .pop-count-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 14px;
          color: #92400e;
        }
        .pop-count-pill strong { color: #b45309; }
        .pop-hint {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
        }
        .pop-total {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
          white-space: nowrap;
        }
        .pop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .pop-card {
          background: #fff;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pop-card--active {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
        }
        .pop-card-img {
          height: 140px;
          background: #f1f5f9;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pop-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pop-card-no-img {
          font-size: 13px;
          color: #9ca3af;
        }
        .pop-card-body {
          padding: 12px 44px 14px 14px;
        }
        .pop-card-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pop-card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }
        .pop-card-dest {
          font-size: 12px;
          color: #6b7280;
        }
        .pop-card-badge {
          background: #f1f5f9;
          border-radius: 20px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 500;
          color: #374151;
        }
        .pop-card-status {
          border-radius: 20px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 500;
        }
        .pop-card-status.active   { background: #d1fae5; color: #065f46; }
        .pop-card-status.inactive { background: #f3f4f6; color: #6b7280; }
        .pop-card-price {
          font-size: 14px;
          font-weight: 700;
          color: #2563eb;
        }
        .pop-star-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #d1d5db;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.14);
          transition: color 0.15s, transform 0.12s;
          padding: 0;
        }
        .pop-star-btn.active { color: #f59e0b; }
        .pop-star-btn:hover:not(:disabled) { transform: scale(1.15); }
        .pop-star-btn:disabled { opacity: 0.55; cursor: default; }

        @media (max-width: 768px) {
          .pop-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
        }
      `}</style>
    </>
  );
}

PopularPackages.getLayout = (page) => (
  <DashboardLayout active="Most Popular">{page}</DashboardLayout>
);
