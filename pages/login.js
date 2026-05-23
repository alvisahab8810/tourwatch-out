import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { saveSession, isLoggedIn } from "../utils/userAuth";

// ── Icons ─────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
      <path d="M6.3 14.7l7 5.1C15.1 16 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.4-17.7 11.7z" fill="#FF3D00"/>
      <path d="M24 45c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.7 35.9 27 37 24 37c-6.1 0-10.7-3.1-11.8-7.5l-7 5.4C8.8 40.7 15.8 45 24 45z" fill="#4CAF50"/>
      <path d="M44.5 20H24v8.5h11.8c-.9 2.7-2.7 4.9-5.1 6.4l6.6 5.6C40.9 37.2 44.5 31.1 44.5 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.532-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}
function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function Divider({ label = "or" }) {
  return (
    <div style={s.divider}>
      <span style={s.dividerLine} />
      <span style={s.dividerText}>{label}</span>
      <span style={s.dividerLine} />
    </div>
  );
}

function SocialRow() {
  function comingSoon(name) {
    toast("Coming soon!", { icon: "🚀",
      style: { background: "#fff", border: "1.5px solid #e84949", color: "#333" }
    });
  }
  return (
    <div style={s.socialBtns}>
      <button style={s.socialBtn} onClick={() => comingSoon("Google")}>
        <GoogleIcon /><span>Continue with Google</span>
      </button>
      <button style={s.socialBtn} onClick={() => comingSoon("Facebook")}>
        <FacebookIcon /><span>Continue with Facebook</span>
      </button>
      <button style={s.socialBtn} onClick={() => comingSoon("Apple")}>
        <AppleIcon /><span>Continue with Apple</span>
      </button>
    </div>
  );
}

function SocialIcons() {
  function comingSoon() {
    toast("Coming soon!", { icon: "🚀",
      style: { background: "#fff", border: "1.5px solid #e84949", color: "#333" }
    });
  }
  return (
    <div style={s.socialIconsRow}>
      <button style={s.iconCircle} onClick={comingSoon}><GoogleIcon /></button>
      <button style={s.iconCircle} onClick={comingSoon}><FacebookIcon /></button>
      <button style={s.iconCircle} onClick={comingSoon}><AppleIcon /></button>
    </div>
  );
}

// ── Back button ───────────────────────────────────────────────
function BackBtn({ onClick }) {
  return (
    <button style={s.backBtn} onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
  );
}

// ── Screen 1: Get Started ─────────────────────────────────────
function GetStarted({ onLogin, onSignup }) {
  return (
    <>
      <img src="/assets/images/dark-logo.svg" alt="TourWatchOut" style={s.logo} />
      <h1 style={s.title}>Let's Get Started</h1><br/>
      <p style={s.subtitle}>Welcome to TourWatchOut! Sign in or create an account to plan your next adventure.</p>
      <SocialRow />
      <Divider label="or continue with email" />
      <button style={s.primaryBtn} onClick={onLogin}>Log in</button>
      <p style={s.bottomText}>
        Don't have an account?{" "}
        <button style={s.linkBtn} onClick={onSignup}>Sign Up</button>
      </p>
    </>
  );
}

// ── Screen 2: Login ───────────────────────────────────────────
function LoginForm({ onSignup, onForgot, onBack, onSuccess }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  function validate() {
    const e = {};
    if (!email.trim())    e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
    if (!password)        e.password = "Password is required.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Login failed."); return; }

      saveSession(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      onSuccess();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackBtn onClick={onBack} />
      <img src="/assets/images/dark-logo.svg" alt="TourWatchOut" style={s.logo} />
      <h1 style={s.title}>Log In To Your Account</h1>
      <p style={s.subtitle}>Welcome back! Please enter your details to continue.</p>
      <form onSubmit={handleSubmit} style={s.form} noValidate>
        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com" style={{ ...s.input, ...(errors.email ? s.inputError : {}) }} />
          {errors.email && <span style={s.fieldError}>{errors.email}</span>}
        </div>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <div style={{ position: "relative" }}>
            <input type={showPass ? "text" : "password"} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              style={{ ...s.input, paddingRight: 44, ...(errors.password ? s.inputError : {}) }} />
            <button type="button" style={s.eyeBtn} onClick={() => setShowPass(v => !v)}>
              <EyeIcon open={showPass} />
            </button>
          </div>
          {errors.password && <span style={s.fieldError}>{errors.password}</span>}
        </div>
        <div style={{ textAlign: "right", marginTop: -8 }}>
          <button type="button" style={s.linkBtn} onClick={onForgot}>Forgot Password?</button>
        </div>
        <button type="submit" style={{ ...s.primaryBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <Divider label="or continue with" />
      <SocialIcons />
      <p style={s.bottomText}>Don't have an account?{" "}<button style={s.linkBtn} onClick={onSignup}>Sign Up</button></p>
    </>
  );
}

// ── Screen 3: Sign Up ─────────────────────────────────────────
function SignupForm({ onLogin, onBack, onOtp }) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  function validate() {
    const e = {};
    if (!name.trim())  e.name     = "Full name is required.";
    if (!email.trim()) e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
    if (!password)     e.password = "Password is required.";
    else if (password.length < 6) e.password = "Minimum 6 characters.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const res  = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Something went wrong."); return; }

      toast.success("OTP sent! Check your email.");
      onOtp({ name: name.trim(), email: email.trim() });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackBtn onClick={onBack} />
      <img src="/assets/images/dark-logo.svg" alt="TourWatchOut" style={s.logo} />
      <h1 style={s.title}>Create Your Account</h1>
      <p style={s.subtitle}>Join TourWatchOut and discover your next unforgettable journey.</p>
      <form onSubmit={handleSubmit} style={s.form} noValidate>
        <div style={s.field}>
          <label style={s.label}>Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Your name" style={{ ...s.input, ...(errors.name ? s.inputError : {}) }} />
          {errors.name && <span style={s.fieldError}>{errors.name}</span>}
        </div>
        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com" style={{ ...s.input, ...(errors.email ? s.inputError : {}) }} />
          {errors.email && <span style={s.fieldError}>{errors.email}</span>}
        </div>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <div style={{ position: "relative" }}>
            <input type={showPass ? "text" : "password"} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
              style={{ ...s.input, paddingRight: 44, ...(errors.password ? s.inputError : {}) }} />
            <button type="button" style={s.eyeBtn} onClick={() => setShowPass(v => !v)}>
              <EyeIcon open={showPass} />
            </button>
          </div>
          {errors.password && <span style={s.fieldError}>{errors.password}</span>}
        </div>
        <button type="submit" style={{ ...s.primaryBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? "Sending OTP…" : "Send Verification Code"}
        </button>
      </form>
      <Divider label="or continue with" />
      <SocialIcons />
      <p style={s.bottomText}>Already have an account?{" "}<button style={s.linkBtn} onClick={onLogin}>Log In</button></p>
    </>
  );
}

// ── Screen 3b: OTP Verify ─────────────────────────────────────
function OtpForm({ email, name, onBack, onSuccess }) {
  const [otp,       setOtp]       = useState(["", "", "", "", "", ""]);
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [error,     setError]     = useState("");
  const [countdown, setCountdown] = useState(60);
  const r0 = useRef(null), r1 = useRef(null), r2 = useRef(null),
        r3 = useRef(null), r4 = useRef(null), r5 = useRef(null);
  const inputRefs = [r0, r1, r2, r3, r4, r5];

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleChange(i, val) {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    setError("");
    if (v && i < 5) inputRefs[i + 1].current?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs[i - 1].current?.focus();
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      inputRefs[5].current?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) { setError("Enter the full 6-digit code."); return; }
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed."); return; }

      saveSession(data.token, data.user);
      toast.success(`Welcome to TourWatchOut, ${data.user.name}! 🎉`);
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      const res  = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to resend."); return; }
      toast.success("New OTP sent! Check your email.");
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setCountdown(60);
      inputRefs[0].current?.focus();
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <BackBtn onClick={onBack} />
      <img src="/assets/images/dark-logo.svg" alt="TourWatchOut" style={s.logo} />

      {/* Email icon */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e84949" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
      </div>

      <h1 style={s.title}>Verify Your Email</h1>
      <p style={{ ...s.subtitle, marginBottom: 8 }}>
        We sent a 6-digit code to
      </p>
      <p style={{ textAlign: "center", fontWeight: 700, fontSize: 14, color: "#e84949", marginBottom: 24 }}>
        {email}
      </p>

      {/* OTP boxes */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 8 }} onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={inputRefs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            style={{
              width: 46, height: 54,
              textAlign: "center",
              fontSize: 22, fontWeight: 700,
              border: `2px solid ${error ? "#ef4444" : digit ? "#e84949" : "#e5e5e5"}`,
              borderRadius: 10,
              outline: "none",
              background: digit ? "#fff8f8" : "#fafafa",
              color: "#111",
              fontFamily: "'DM Sans', sans-serif",
              transition: "border-color 0.15s",
            }}
            autoFocus={i === 0}
          />
        ))}
      </div>

      {error && (
        <p style={{ textAlign: "center", color: "#ef4444", fontSize: 13, margin: "6px 0 0" }}>{error}</p>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleVerify}
          disabled={loading}
          style={{ ...s.primaryBtn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Verifying…" : "Verify & Create Account"}
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 16 }}>
        Didn't receive the code?{" "}
        {countdown > 0 ? (
          <span style={{ color: "#aaa", fontWeight: 600 }}>Resend in {countdown}s</span>
        ) : (
          <button
            style={s.linkBtn}
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending…" : "Resend OTP"}
          </button>
        )}
      </p>
      <p style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 4 }}>
        Wrong email? <button style={{ ...s.linkBtn, fontSize: 12 }} onClick={onBack}>Go back</button>
      </p>
    </>
  );
}

// ── Screen 4: Forgot Password ─────────────────────────────────
function ForgotForm({ onBack }) {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email."); return; }
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
      toast.success("Reset instructions sent if email is registered.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackBtn onClick={onBack} />
      <img src="/assets/images/dark-logo.svg" alt="TourWatchOut" style={s.logo} />
      <h1 style={s.title}>Forgot Password?</h1>
      <p style={s.subtitle}>Enter your registered email and we'll send you reset instructions.</p>
      {sent ? (
        <div style={s.successBox}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 12px" }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p style={{ textAlign: "center", color: "#166534", fontWeight: 600, margin: 0 }}>Check your inbox!</p>
          <p style={{ textAlign: "center", color: "#555", fontSize: 13, margin: "6px 0 0" }}>If that email is registered, a reset link has been sent.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com" required style={s.input} />
          </div>
          <button type="submit" style={{ ...s.primaryBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function LoginPage() {
  const [screen,   setScreen]   = useState("get-started");
  const [otpMeta,  setOtpMeta]  = useState({ email: "", name: "" });
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) router.replace("/");
  }, []);

  // Show a hint toast if user was redirected here from a protected page
  useEffect(() => {
    if (router.query.redirect) {
      toast("Please login to continue.", {
        icon: "🔒",
        style: { background: "#fff", border: "1.5px solid #e84949", color: "#333" },
      });
    }
  }, [router.query.redirect]);

  function onSuccess() {
    const redirect = router.query.redirect;
    const dest = redirect ? decodeURIComponent(redirect) : "/";
    setTimeout(() => router.push(dest), 1200);
  }

  return (
    <>
      <Head><title>Login — TourWatchOut</title></Head>

      <div className="login-page-area">
        <div className="login-row">
          <div className="login-left-col" />
          <div className="login-right-col">
            <div className="login-card">
              {screen === "get-started" && (
                <GetStarted onLogin={() => setScreen("login")} onSignup={() => setScreen("signup")} />
              )}
              {screen === "login" && (
                <LoginForm
                  onSignup={() => setScreen("signup")}
                  onForgot={() => setScreen("forgot")}
                  onBack={() => setScreen("get-started")}
                  onSuccess={onSuccess}
                />
              )}
              {screen === "signup" && (
                <SignupForm
                  onLogin={() => setScreen("login")}
                  onBack={() => setScreen("get-started")}
                  onOtp={({ email, name }) => { setOtpMeta({ email, name }); setScreen("otp"); }}
                />
              )}
              {screen === "otp" && (
                <OtpForm
                  email={otpMeta.email}
                  name={otpMeta.name}
                  onBack={() => setScreen("signup")}
                  onSuccess={onSuccess}
                />
              )}
              {screen === "forgot" && (
                <ForgotForm onBack={() => setScreen("login")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = {
  logo:        { height: 44, objectFit: "contain", display: "block", margin: "0 auto 20px" },
  title:       { textAlign: "center", fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px", letterSpacing: "-0.3px" },
  subtitle:    { textAlign: "center", color: "#888", fontSize: 13.5, margin: "0 0 22px", lineHeight: 1.55 },
  socialBtns:  { display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 },
  socialBtn:   { display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "11px 16px", fontSize: 14, fontWeight: 500, color: "#333", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%" },
  socialIconsRow: { display: "flex", justifyContent: "center", gap: 14, margin: "4px 0 16px" },
  iconCircle:  { width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #e5e5e5", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  divider:     { display: "flex", alignItems: "center", gap: 10, margin: "14px 0" },
  dividerLine: { flex: 1, height: 1, background: "#ebebeb", display: "block" },
  dividerText: { color: "#aaa", fontSize: 12, whiteSpace: "nowrap" },
  form:        { display: "flex", flexDirection: "column", gap: 14, marginBottom: 14 },
  field:       { display: "flex", flexDirection: "column", gap: 4 },
  label:       { fontSize: 13, fontWeight: 600, color: "#444" },
  input:       { border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "12px 14px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", color: "#222", background: "#fafafa" },
  inputError:  { borderColor: "#ef4444", background: "#fff8f8" },
  fieldError:  { fontSize: 12, color: "#ef4444", marginTop: 2 },
  eyeBtn:      { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" },
  primaryBtn:  { background: "#e84949", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" },
  linkBtn:     { background: "none", border: "none", color: "#e84949", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" },
  bottomText:  { textAlign: "center", fontSize: 13, color: "#888", margin: "12px 0 0" },
  backBtn:     { position: "absolute", top: -8, left: -8, background: "#f5f5f5", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 },
  successBox:  { background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: "24px 20px", marginBottom: 16 },
};
