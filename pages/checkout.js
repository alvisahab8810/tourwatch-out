import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
import NewFooter from "../components/footer/NewFooter";
import { getUser } from "../utils/userAuth";

function fmt(n) {
  const num = Number(n);
  if (!num) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
}

// Extracts child age labels for display: "below 4 years, below 10 years"
function childAgeLabels(priceType) {
  if (!priceType) return null;
  const matches = [...priceType.matchAll(/child\s*\(([^)]+)\)/gi)];
  if (!matches.length) return null;
  return matches.map(m => m[1]).join(", ");
}

// Parses priceType like "01 Couple + 01 Child (below 4 years) + 01 Child (below 10 years)"
// → { adults: 2, children: 2, isFixed: true }
// Returns null for flexible pricing like "per person on twin sharing"
function parseFixedPax(priceType) {
  if (!priceType) return null;
  const pt = priceType.toLowerCase();
  if (pt.includes("per person") || pt.includes("per head") || pt.includes("/person")) return null;

  let adults = null;
  let children = 0;

  // "02 Couples" → 4 adults, "01 Couple" → 2 adults
  const coupleMatch = pt.match(/(\d+)\s*couple/);
  if (coupleMatch) adults = Number(coupleMatch[1]) * 2;

  // "02 Adults" → 2 adults (overrides couple if both present)
  const adultMatch = pt.match(/(\d+)\s*adult/);
  if (adultMatch && !coupleMatch) adults = Number(adultMatch[1]);

  // Sum ALL child entries: "01 Child (below 4 years) + 01 Child (below 10 years)" → 2
  const childMatches = [...pt.matchAll(/(\d+)\s*child/g)];
  if (childMatches.length) {
    children = childMatches.reduce((sum, m) => sum + Number(m[1]), 0);
  }

  return adults !== null ? { adults, children } : null;
}

function today() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function maxDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().split("T")[0];
}

// ── Step indicator ────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Your Details", "Review & Pay", "Confirmed"];
  return (
    <div className="ck-steps">
      {steps.map((s, i) => (
        <div key={s} className={`ck-step ${i + 1 <= current ? "ck-step-active" : ""}`}>
          <div className="ck-step-circle">{i + 1 < current ? "✓" : i + 1}</div>
          <span className="ck-step-label">{s}</span>
          {i < steps.length - 1 && <div className="ck-step-line" />}
        </div>
      ))}
    </div>
  );
}

// ── Package summary card ──────────────────────────────────────
function PackageSummary({ pkg, adults, childCount, travelDate, fixedPax }) {
  const price = Number(pkg.finalPrice || pkg.basePrice || 0);
  // Fixed-pax: the listed price is the total for the whole group — never multiply
  const total = fixedPax ? price : price * (Number(adults) || 1);
  const image = pkg.featureImage?.src || pkg.webBanner?.src || "/assets/images/n-destination/kashmir.webp";

  return (
    <div className="ck-summary-card">
      <div className="ck-summary-img-wrap">
        <img src={image} alt={pkg.packageName} className="ck-summary-img" />
        <div className="ck-summary-img-overlay">
          <span className="ck-summary-dest">{pkg.destination}</span>
        </div>
      </div>
      <div className="ck-summary-body">
        <h3 className="ck-summary-pkgname">{pkg.packageName || pkg.destination}</h3>
        {pkg.duration && <div className="ck-summary-tag">{pkg.duration}</div>}

        <div className="ck-summary-rows">
          {travelDate && (
            <div className="ck-summary-row">
              <span>Travel Date</span>
              <strong>{new Date(travelDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong>
            </div>
          )}
          <div className="ck-summary-row">
            <span>Adults</span>
            <strong>{adults || 1}</strong>
          </div>
          {Number(childCount) > 0 && (
            <div className="ck-summary-row">
              <span>Children</span>
              <strong>{childCount}</strong>
            </div>
          )}
        </div>

        <div className="ck-summary-divider" />

        <div className="ck-summary-total">
          <span>Total Amount</span>
          <strong className="ck-total-price">{fmt(total)}</strong>
        </div>
        <p className="ck-summary-note">{pkg.priceType || "per person on twin sharing"}</p>

        <div className="ck-payment-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          <span>Pay at Office (COD)</span>
        </div>
      </div>
    </div>
  );
}

// ── Stepper ───────────────────────────────────────────────────
function Stepper({ value, min, max, onChange, disabled }) {
  return (
    <div className={`ck-stepper${disabled ? " ck-stepper-locked" : ""}`}>
      <button type="button" className="ck-stepper-btn" disabled={disabled}
        onClick={() => !disabled && onChange(Math.max(min, value - 1))}>−</button>
      <span className="ck-stepper-val">{value}</span>
      <button type="button" className="ck-stepper-btn" disabled={disabled}
        onClick={() => !disabled && onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

// ── Field component ───────────────────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div className="ck-field">
      <label className="ck-label">{label}{required && <span className="ck-required">*</span>}</label>
      {children}
      {error && <span className="ck-field-error">{error}</span>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { packageId, slug } = router.query;

  const [pkg,       setPkg]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step,      setStep]      = useState(1);
  const [user,      setUser]      = useState(null);
  const [fixedPax,  setFixedPax]  = useState(null); // { adults, children } if package has fixed group

  // Form state
  const [travelDate,  setTravelDate]  = useState(today());
  const [adults,      setAdults]      = useState(2);
  const [children,    setChildren]    = useState(0);
  const [leadName,    setLeadName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [altPhone,    setAltPhone]    = useState("");
  const [address,     setAddress]     = useState("");
  const [city,        setCity]        = useState("");
  const [state,       setState]       = useState("");
  const [special,     setSpecial]     = useState("");
  const [agreed,      setAgreed]      = useState(false);
  const [errors,      setErrors]      = useState({});

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser(u);
      setLeadName(u.name || "");
      setEmail(u.email || "");
    }
  }, []);

  useEffect(() => {
    if (!packageId) return;
    fetch(`/api/packages?id=${packageId}`)
      .then(r => r.json())
      .then(data => {
        if (data?.error) { setPkg(null); setLoading(false); return; }
        setPkg(data);
        const fixed = parseFixedPax(data.priceType);
        if (fixed) {
          setFixedPax(fixed);
          setAdults(fixed.adults);
          setChildren(fixed.children);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [packageId]);

  function validate() {
    const e = {};
    if (!travelDate)          e.travelDate = "Select a travel date.";
    if (Number(adults) < 1)   e.adults     = "At least 1 adult required.";
    if (!leadName.trim())     e.leadName   = "Full name is required.";
    if (!email.trim())        e.email      = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
    if (!phone.trim())        e.phone      = "Phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!agreed)              e.agreed     = "Please accept the terms to continue.";
    return e;
  }

  function handleNext(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = document.querySelector(".ck-field-error");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConfirm() {
    setSubmitting(true);
    const price     = Number(pkg?.finalPrice || pkg?.basePrice || 0);
    const totalAmt  = fixedPax ? price : price * (Number(adults) || 1);

    try {
      const res  = await fetch("/api/bookings/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          packageName:    pkg?.packageName || pkg?.destination,
          destination:    pkg?.destination,
          destSlug:       slug,
          duration:       pkg?.duration,
          totalAmount:    totalAmt,
          basePrice:      price,
          travelDate,
          adults:         Number(adults),
          children:       Number(children),
          leadName:       leadName.trim(),
          email:          email.trim(),
          phone:          phone.trim(),
          altPhone:       altPhone.trim(),
          address:        address.trim(),
          city:           city.trim(),
          state:          state.trim(),
          specialRequests: special.trim(),
          userId:         user?.id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Booking failed."); setSubmitting(false); return; }

      toast.success("Booking confirmed!");
      router.push(`/booking/${data.bookingId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Topbar /><Offcanvas />
        <div className="ck-loading"><div className="ck-spinner" /><p>Loading package details…</p></div>
      </>
    );
  }

  if (!pkg) {
    return (
      <>
        <Topbar /><Offcanvas />
        <div className="ck-loading">
          <p>Package not found.</p>
          <Link href="/" className="ck-back-btn">Go Home</Link>
        </div>
      </>
    );
  }

  const price    = Number(pkg.finalPrice || pkg.basePrice || 0);
  const totalAmt = fixedPax ? price : price * (Number(adults) || 1);

  return (
    <>
      <Head><title>Checkout — {pkg.packageName || pkg.destination} | TourWatchOut</title></Head>
      <Topbar />
      <Offcanvas />

      <div className="ck-page">
        <div className="ck-container">

          {/* Steps */}
          <Steps current={step} />

          <div className="ck-layout">

            {/* ── Left: Form ── */}
            <div className="ck-left">

              {step === 1 && (
                <form onSubmit={handleNext} noValidate>

                  {/* Trip Details */}
                  <div className="ck-section">
                    <h2 className="ck-section-title">
                      <span className="ck-section-num">1</span> Trip Details
                    </h2>

                    <div className="ck-trip-grid">
                      {/* Travel Date */}
                      <div className={`ck-trip-card ${errors.travelDate ? "ck-trip-card-err" : ""}`}>
                        <div className="ck-trip-card-top">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e84949" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span>Travel Date</span>
                          <span className="ck-required" style={{marginLeft:2}}>*</span>
                        </div>
                        <input type="date" className="ck-trip-date-input"
                          value={travelDate} min={today()} max={maxDate()}
                          onChange={e => setTravelDate(e.target.value)} />
                        {errors.travelDate && <span className="ck-field-error">{errors.travelDate}</span>}
                      </div>

                      {/* Adults */}
                      <div className="ck-trip-card">
                        <div className="ck-trip-card-top">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e84949" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          <span>Adults</span>
                          {fixedPax && <span className="ck-trip-lock-badge">Fixed</span>}
                        </div>
                        <Stepper value={Number(adults)} min={1} max={20} onChange={setAdults} disabled={!!fixedPax} />
                        {errors.adults && <span className="ck-field-error">{errors.adults}</span>}
                      </div>

                      {/* Children */}
                      <div className="ck-trip-card">
                        <div className="ck-trip-card-top">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e84949" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"/>
                          </svg>
                          <span>Children</span>
                          {fixedPax && <span className="ck-trip-lock-badge">Fixed</span>}
                        </div>
                        <Stepper value={Number(children)} min={0} max={10} onChange={setChildren} disabled={!!fixedPax} />
                        <div className="ck-trip-card-note">
                          {pkg && fixedPax && childAgeLabels(pkg.priceType)
                            ? childAgeLabels(pkg.priceType)
                            : "below 12 years"}
                        </div>
                      </div>
                    </div>

                    {fixedPax && (
                      <div className="ck-fixed-pax-notice" style={{marginTop: 14, marginBottom: 0}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        Traveler count is fixed based on this package&apos;s pricing.
                      </div>
                    )}
                  </div>

                  {/* Traveler Details */}
                  <div className="ck-section">
                    <h2 className="ck-section-title">
                      <span className="ck-section-num">2</span> Lead Traveler Details
                    </h2>

                    <div className="ck-grid-2">
                      <Field label="Full Name" error={errors.leadName} required>
                        <input type="text" className={`ck-input ${errors.leadName ? "ck-input-err" : ""}`}
                          placeholder="Your full name" value={leadName}
                          onChange={e => setLeadName(e.target.value)} />
                      </Field>

                      <Field label="Email Address" error={errors.email} required>
                        <input type="email" className={`ck-input ${errors.email ? "ck-input-err" : ""}`}
                          placeholder="you@email.com" value={email}
                          onChange={e => setEmail(e.target.value)} />
                      </Field>

                      <Field label="Mobile Number" error={errors.phone} required>
                        <div className="ck-phone-wrap">
                          <span className="ck-phone-prefix">+91</span>
                          <input type="tel" className={`ck-input ck-phone-input ${errors.phone ? "ck-input-err" : ""}`}
                            placeholder="10-digit mobile number" value={phone} maxLength={10}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} />
                        </div>
                      </Field>

                      <Field label="Alternate Number">
                        <div className="ck-phone-wrap">
                          <span className="ck-phone-prefix">+91</span>
                          <input type="tel" className="ck-input ck-phone-input"
                            placeholder="Optional" value={altPhone} maxLength={10}
                            onChange={e => setAltPhone(e.target.value.replace(/\D/g, ""))} />
                        </div>
                      </Field>

                      

                      <Field label="State">
                        <input type="text" className="ck-input"
                          placeholder="e.g. Jammu & Kashmir" value={state}
                          onChange={e => setState(e.target.value)} />
                      </Field>

                      <Field label="City">
                        <input type="text" className="ck-input"
                          placeholder="e.g. Delhi" value={city}
                          onChange={e => setCity(e.target.value)} />
                      </Field>

                      
                    </div>

                    
                  <div className="top-spacer">
                      <Field label="Address">
                      <input type="text" className="ck-input"
                        placeholder="House / Flat no., Street, Area" value={address}
                        onChange={e => setAddress(e.target.value)} />
                    </Field>
                  </div>


                  <div className="top-spacer">

                    <Field label="Special Requests">
                      <textarea className="ck-input ck-textarea"
                        placeholder="Any dietary preferences, room preferences, medical needs, etc."
                        value={special} rows={3}
                        onChange={e => setSpecial(e.target.value)} />
                    </Field>

                    </div>

                  </div>

                  {/* Payment Method */}
                  <div className="ck-section">
                    <h2 className="ck-section-title">
                      <span className="ck-section-num">3</span> Payment Method
                    </h2>

                    <div className="ck-payment-methods">
                      <label className="ck-pay-option ck-pay-active">
                        <input type="radio" name="payment" defaultChecked readOnly />
                        <div className="ck-pay-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e84949" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                          </svg>
                        </div>
                        <div className="ck-pay-info">
                          <span className="ck-pay-title">Pay at Office (COD)</span>
                          <span className="ck-pay-desc">Pay in full at our office before departure</span>
                        </div>
                        <div className="ck-pay-check">✓</div>
                      </label>

                      <div className="ck-pay-option ck-pay-soon">
                        <div className="ck-pay-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                        </div>
                        <div className="ck-pay-info">
                          <span className="ck-pay-title">Online Payment</span>
                          <span className="ck-pay-desc">UPI / Card / Net Banking</span>
                        </div>
                        <span className="ck-pay-soon-badge">Coming Soon</span>
                      </div>

                      <div className="ck-pay-option ck-pay-soon">
                        <div className="ck-pay-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                          </svg>
                        </div>
                        <div className="ck-pay-info">
                          <span className="ck-pay-title">EMI / Pay Later</span>
                          <span className="ck-pay-desc">Easy monthly installments</span>
                        </div>
                        <span className="ck-pay-soon-badge">Coming Soon</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="ck-section ck-terms-section">
                    <label className={`ck-terms-check ${errors.agreed ? "ck-terms-err" : ""}`}>
                      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                      <span>I agree to the <a href="/term-and-conditions" target="_blank" className="ck-link">Terms & Conditions</a> and <a href="/refund-cancellation-policy" target="_blank" className="ck-link">Cancellation Policy</a></span>
                    </label>
                    {errors.agreed && <span className="ck-field-error">{errors.agreed}</span>}
                  </div>

                  <button type="submit" className="ck-submit-btn">
                    Review My Booking →
                  </button>
                </form>
              )}

              {step === 2 && (
                <div>
                  <div className="ck-section">
                    <h2 className="ck-section-title">Review Your Booking</h2>

                    <div className="ck-review-block">
                      <div className="ck-review-head">Trip Details</div>
                      <ReviewRow label="Package"     value={pkg.packageName || pkg.destination} />
                      <ReviewRow label="Destination" value={pkg.destination} />
                      <ReviewRow label="Duration"    value={pkg.duration} />
                      <ReviewRow label="Travel Date" value={new Date(travelDate).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} />
                      <ReviewRow label="Travelers"   value={`${adults} Adult${adults > 1 ? "s" : ""}${Number(children) > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}`} />
                    </div>

                    <div className="ck-review-block">
                      <div className="ck-review-head">Lead Traveler</div>
                      <ReviewRow label="Name"    value={leadName} />
                      <ReviewRow label="Email"   value={email} />
                      <ReviewRow label="Phone"   value={`+91 ${phone}`} />
                      {address  && <ReviewRow label="Address" value={address} />}
                      {city     && <ReviewRow label="City"    value={city} />}
                      {state    && <ReviewRow label="State"   value={state} />}
                      {special  && <ReviewRow label="Special Requests" value={special} />}
                    </div>

                    <div className="ck-review-block">
                      <div className="ck-review-head">Payment</div>
                      <ReviewRow label="Method"  value="Pay at Office (COD)" />
                      <ReviewRow label="Status"  value="To be paid before departure" />
                      <div className="ck-review-total">
                        <span>Total Amount</span>
                        <strong>{fmt(totalAmt)}</strong>
                      </div>
                    </div>

                    <div className="ck-info-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      Our team will contact you within 24 hours to confirm your booking and share the payment details.
                    </div>
                  </div>

                  <div className="ck-review-actions">
                    <button className="ck-back-link" onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                      ← Edit Details
                    </button>
                    <button className="ck-submit-btn ck-confirm-btn"
                      onClick={handleConfirm} disabled={submitting}>
                      {submitting ? "Confirming…" : "Confirm Booking"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Summary ── */}
            <div className="ck-right">
              <PackageSummary pkg={pkg} adults={adults} childCount={children} travelDate={travelDate} fixedPax={fixedPax} />

              <div className="ck-help-card">
                <p className="ck-help-title">Need Help?</p>
                <a href="tel:+918882701800" className="ck-help-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  +91 88827 01800
                </a>
                <a href="https://wa.link/pshqg5" target="_blank" className="ck-help-link ck-wa-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewFooter />
    </>
  );
}

function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="ck-review-row">
      <span className="ck-review-label">{label}</span>
      <span className="ck-review-value">{value}</span>
    </div>
  );
}
