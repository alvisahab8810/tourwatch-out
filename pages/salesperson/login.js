import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";

const SP_AUTH_KEY = "tw_sp_auth";

export default function SalesPersonLogin() {
  const router = useRouter();
  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SP_AUTH_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.token && d.salesperson) router.replace("/dashboard");
      }
    } catch {}
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) return setError("Enter your username and password.");
    setLoading(true);
    try {
      const res = await fetch("/api/salesperson/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Login failed.");
      localStorage.setItem(SP_AUTH_KEY, JSON.stringify({ token: data.token, salesperson: data.salesperson }));
      router.replace("/dashboard");
    } finally { setLoading(false); }
  }

  return (
    <>
      <Head><title>Sales Login — Tourwatchout</title></Head>
      <div style={S.page}>
        <div style={S.card}>
          <div style={S.logo}>
            <img src="/assets/images/dark-logo.svg" alt="Tourwatchout" style={{ height: 36 }} />
          </div>
          <h1 style={S.title}>Sales Dashboard</h1>
          <p style={S.sub}>Sign in with your salesperson credentials</p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={S.fieldWrap}>
              <MdPerson size={18} color="#94a3b8" style={S.fieldIcon} />
              <input
                style={S.input}
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div style={S.fieldWrap}>
              <MdLock size={18} color="#94a3b8" style={S.fieldIcon} />
              <input
                style={S.input}
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" style={S.eyeBtn} onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                {showPass ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>

            {error && <div style={S.error}>{error}</div>}

            <button type="submit" style={{ ...S.submitBtn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const S = {
  page:      { minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Segoe UI', Arial, sans-serif" },
  card:      { background: "#fff", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.10)" },
  logo:      { textAlign: "center", marginBottom: 20 },
  title:     { fontSize: 22, fontWeight: 800, color: "#0f172a", textAlign: "center", margin: "0 0 6px" },
  sub:       { fontSize: 13, color: "#64748b", textAlign: "center", margin: "0 0 28px" },
  fieldWrap: { display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0 14px", height: 48, gap: 10, background: "#f8fafc" },
  fieldIcon: { flexShrink: 0 },
  input:     { flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0f172a", background: "transparent" },
  eyeBtn:    { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", padding: 0 },
  error:     { padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#dc2626" },
  submitBtn: { padding: "14px 0", background: "#EE4C49", color: "#fff", border: "none", borderRadius: 50, fontSize: 15, fontWeight: 700, cursor: "pointer" },
};
