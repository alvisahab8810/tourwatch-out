import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getToken, getUser } from "../../utils/userAuth";

const INITIAL_COUNT = 10;

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7)  return `${days} days ago`;
  const wk = Math.floor(days / 7);
  if (days < 30) return `${wk} week${wk > 1 ? "s" : ""} ago`;
  const mo = Math.floor(days / 30);
  if (days < 365) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  const yr = Math.floor(days / 365);
  return `${yr} year${yr > 1 ? "s" : ""} ago`;
}

function Avatar({ name, image, size = 50 }) {
  const initials = (name || "?").trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#EE4C49", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0891b2"];
  const bg = colors[(name?.charCodeAt(0) || 0) % colors.length];
  if (image) {
    return (
      <img
        src={image} alt={name}
        style={{ width: size, height: size, minWidth: size, borderRadius: "50%", objectFit: "cover", display: "block", overflow: "hidden" }}
        onError={e => { e.target.style.display = "none"; }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, minWidth: size, minHeight: size,
      borderRadius: "50%", background: bg, overflow: "hidden",
      color: "#fff", fontWeight: 700, fontSize: Math.round(size * 0.36),
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, userSelect: "none", boxSizing: "border-box",
    }}>{initials}</div>
  );
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div style={{ display: "flex", gap: 4, cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          style={{ fontSize: 30, lineHeight: 1, color: n <= active ? "#f5a623" : "#d1d5db", transition: "color 0.1s" }}
        >★</span>
      ))}
    </div>
  );
}

function computeStats(reviews) {
  if (!reviews.length) return { avg: 0, breakdown: [] };
  const total = reviews.length;
  const sum   = reviews.reduce((s, r) => s + r.rating, 0);
  const avg   = (sum / total).toFixed(1);
  const breakdown = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
    return { star, count, pct };
  });
  return { avg, breakdown };
}

export default function PackageReviews({ packageId, packageName, destinationSlug }) {
  const router = useRouter();

  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showMore,   setShowMore]   = useState(false);

  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const [rating,        setRating]        = useState(0);
  const [title,         setTitle]         = useState("");
  const [text,          setText]          = useState("");
  const [reviewImages,  setReviewImages]  = useState([]); // { src, alt, uploading? }

  const reviewImgRef = useRef(null);

  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setUser(getUser());
    setToken(getToken());
  }, []);

  useEffect(() => {
    if (!packageId) return;
    fetch(`/api/reviews?packageId=${packageId}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [packageId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating)      { toast.error("Please select a star rating.", { id: "rev" }); return; }
    if (!text.trim()) { toast.error("Please write your review.",    { id: "rev" }); return; }
    if (reviewImages.some(i => i.uploading)) { toast.error("Please wait for photos to finish uploading.", { id: "rev" }); return; }

    setSubmitting(true);
    try {
      const uploadedImages = reviewImages.filter(i => i.src && !i.uploading);
      const res = await fetch("/api/reviews", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ packageId, packageName, destinationSlug, rating, title, text, images: uploadedImages }),
      });
      const data = await res.json();
      if (res.status === 409) { toast.error("You have already reviewed this package.", { id: "rev" }); return; }
      if (!res.ok)            { toast.error(data.error || "Failed to submit.",         { id: "rev" }); return; }

      const newReview = {
        _id:        data.id,
        userName:   user.name,
        userEmail:  user.email,
        userImage:  user.profileImage || "",
        rating,
        title:      title.trim(),
        text:       text.trim(),
        images:     uploadedImages,
        packageName,
        createdAt:  new Date().toISOString(),
      };
      setReviews(prev => [newReview, ...prev]);
      setSubmitted(true);
      setShowForm(false);
      setRating(0); setTitle(""); setText(""); setReviewImages([]);
      toast.success("Review posted successfully!", { id: "rev" });
    } catch {
      toast.error("Network error. Please try again.", { id: "rev" });
    } finally {
      setSubmitting(false);
    }
  }

  const { avg, breakdown } = computeStats(reviews);
  const visible = showMore ? reviews : reviews.slice(0, INITIAL_COUNT);
  const extra   = reviews.length - INITIAL_COUNT;

  if (loading) return null;

  return (
    <div>
      <section className="google-reviews">
        <div className="mini-container1">

          <h2 className="google-reviews-header">
            Client Reviews {reviews.length > 0 && <span style={{ fontWeight: 500, fontSize: "0.65em", color: "#64748b" }}>({reviews.length})</span>}
          </h2>

          {/* ── Overview — only when there are reviews ── */}
          {reviews.length > 0 && (
            <div className="reviews-overview">
              <div className="reviews-summary">
                <div className="rating-display">
                  <img
                    src="/assets/images/hero/icons/reviews.svg"
                    alt="Rating stars"
                    className="rating-stars"
                  />
                  <div className="rating-number">{avg}</div>
                  <div className="rating-source">{reviews.length} Review{reviews.length !== 1 ? "s" : ""}</div>
                </div>
              </div>

              <div className="rating-breakdown">
                {breakdown.map(({ star, pct, count }) => (
                  <div key={star} className="rating-row">
                    <span className="rating-label">{star}</span>
                    <img src="/assets/images/hero/icons/star.svg" alt="Star" className="rating-star" />
                    <div className="rating-bar">
                      <div className="rating-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="rating-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Review cards ── */}
          {reviews.length > 0 && (
            <div className="customer-reviews">
              {visible.map((r, i) => (
                <div key={r._id || i} className="customer-review">
                  <div className="customer-header">
                    <div className="customer-info">
                      <div className="customer-profile">
                        <Avatar name={r.userName} image={r.userImage} size={50} />
                      </div>
                      <div className="customer-info-row">
                        <h4>{r.userName}</h4>
                        <p className="date">Reviewed: {timeAgo(r.createdAt)}</p>
                      </div>
                    </div>
                    <div className="customer-rating">
                      <img src="/assets/images/hero/icons/color-star.svg" alt="Star" />
                      <span>{r.rating}.0/5</span>
                    </div>
                  </div>
                  {r.title && (
                    <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 4px", color: "#0f172a" }}>{r.title}</p>
                  )}
                  <p className="booking-info">
                    <span className="booked">Booked:</span> {r.packageName || packageName || "—"}
                  </p>
                  <p className="customer-review-text">{r.text}</p>
                  {Array.isArray(r.images) && r.images.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                      {r.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.src}
                          alt={img.alt || "Review photo"}
                          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer" }}
                          onClick={() => window.open(img.src, "_blank")}
                        />
                      ))}
                    </div>
                  )}
                  {r.adminNote && r.adminNote.trim() && (
                    <div style={{ marginTop: 12, marginLeft: 16, borderLeft: "3px solid #EE4C49", background: "#fff7f7", borderRadius: "0 8px 8px 0", padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                        <img src="/assets/images/favicon.png" alt="Tourwatchout" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#EE4C49" }}>Tourwatchout Team</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{r.adminNote}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Load more / show less ── */}
          {extra > 0 && (
            <button className="load-more-button interactive" onClick={() => setShowMore(p => !p)}>
              {showMore ? "Show Less Reviews" : `Load More reviews (${extra}+)`}
            </button>
          )}

          {/* ── Write a Review ── */}
          <div style={{ marginTop: reviews.length > 0 ? 36 : 0, borderTop: reviews.length > 0 ? "1px solid #f1f5f9" : "none", paddingTop: reviews.length > 0 ? 32 : 0 }}>

            {!submitted && !showForm && (
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: "0 0 12px", fontSize: 15, color: "#374151", fontWeight: 500 }}>
                  {reviews.length === 0
                    ? "Be the first to share your experience with this package!"
                    : "Share your experience with this package"}
                </p>
                <button className="load-more-button interactive" style={{ margin: "0 auto" }}
                  onClick={() => {
                    if (!token) {
                      toast.error("Please login first to write a review.", { id: "rev-login" });
                      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
                      return;
                    }
                    setShowForm(true);
                  }}>
                  ✏ Write a Review
                </button>
              </div>
            )}

            {submitted && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✓</div>
                <p style={{ margin: 0, fontWeight: 600, color: "#16a34a", fontSize: 15 }}>Review posted! Thank you for sharing.</p>
              </div>
            )}

            {showForm && (
              <div className="customer-review" style={{ background: "#fafbff", border: "1.5px solid #e5e7eb" }}>

                {/* Form header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #f1f5f9" }}>
                  <Avatar name={user?.name} size={44} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Posting as you</div>
                  </div>
                  <button
                    onClick={() => { setShowForm(false); setRating(0); setTitle(""); setText(""); setReviewImages([]); }}
                    style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 20, color: "#94a3b8", cursor: "pointer", lineHeight: 1, padding: 4 }}
                  >✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Star rating */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={labelSt}>Your Rating *</div>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>

                  {/* Title */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={labelSt}>Review Title</div>
                    <input
                      style={inputSt}
                      placeholder="Summarise your experience…"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  {/* Text */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={labelSt}>Your Review *</div>
                    <textarea
                      style={{ ...inputSt, resize: "vertical", minHeight: 96 }}
                      placeholder="Tell others about this trip — highlights, what you loved, tips…"
                      value={text}
                      onChange={e => setText(e.target.value)}
                      maxLength={1000}
                      required
                    />
                    <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "right", marginTop: 2 }}>
                      {text.length}/1000
                    </div>
                  </div>

                  {/* Review photos */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={labelSt}>Add Photos</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                      {reviewImages.map((img, idx) => (
                        <div key={idx} style={{ position: "relative", width: 72, height: 72, borderRadius: 8, overflow: "hidden", border: "1.5px solid #e5e7eb", background: "#f1f5f9" }}>
                          {img.uploading
                            ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#94a3b8" }}>…</div>
                            : <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          }
                          <button type="button"
                            onClick={() => setReviewImages(p => p.filter((_, i) => i !== idx))}
                            style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", color: "#fff", fontSize: 11, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>✕</button>
                        </div>
                      ))}
                      {reviewImages.length < 6 && (
                        <button type="button"
                          onClick={() => reviewImgRef.current?.click()}
                          style={{ width: 72, height: 72, borderRadius: 8, border: "1.5px dashed #cbd5e1", background: "#f8fafc", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
                          <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>Photo
                        </button>
                      )}
                    </div>
                    <input ref={reviewImgRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                      onChange={async e => {
                        const files = Array.from(e.target.files || []);
                        e.target.value = "";
                        const slots = files.slice(0, 6 - reviewImages.length);
                        const placeholders = slots.map(() => ({ src: "", alt: "", uploading: true }));
                        setReviewImages(p => [...p, ...placeholders]);
                        const startIdx = reviewImages.length;
                        slots.forEach(async (file, i) => {
                          const reader = new FileReader();
                          reader.onload = async ev => {
                            try {
                              const r = await fetch("/api/dashboard/packages/upload-image", {
                                method: "POST", headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ base64: ev.target.result, name: file.name }),
                              });
                              const { url } = await r.json();
                              setReviewImages(p => { const next = [...p]; next[startIdx + i] = { src: url, alt: file.name }; return next; });
                            } catch { setReviewImages(p => p.filter((_, idx2) => idx2 !== startIdx + i)); }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      type="submit"
                      className="load-more-button interactive"
                      style={{ margin: 0, background: "#EE4C49", color: "#fff", border: "2px solid #EE4C49" }}
                      disabled={submitting}
                    >
                      {submitting ? "Posting…" : "Post Review"}
                    </button>
                    <button
                      type="button"
                      className="load-more-button interactive"
                      style={{ margin: 0 }}
                      onClick={() => { setShowForm(false); setRating(0); setTitle(""); setText(""); setReviewImages([]); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}

const labelSt = {
  fontSize: 12, fontWeight: 700, color: "#374151",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em",
};
const inputSt = {
  width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
  padding: "10px 13px", fontSize: 14, color: "#0c141d",
  background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
