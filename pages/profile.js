import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Topbar from "../components/header/Header";
import Offcanvas from "../components/header/Offcanvas";
import NewFooter from "../components/footer/NewFooter";
import { getUser, getToken, clearSession } from "../utils/userAuth";

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 22px", border: "none", borderRadius: 10, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
        background: active ? "#e84949" : "#f5f5f5",
        color: active ? "#fff" : "#555",
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

function ProfileTab({ user }) {
  return (
    <div style={s.tabContent}>
      <div style={s.avatarWrap}>
        <div style={s.avatarBig}>
          {user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?"}
        </div>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>{user?.name}</h2>
          <p style={{ margin: 0, color: "#888", fontSize: 14 }}>{user?.email}</p>
        </div>
      </div>

      <div style={s.infoGrid}>
        <InfoRow label="Full Name" value={user?.name} />
        <InfoRow label="Email Address" value={user?.email} />
        <InfoRow label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : "—"} />
        <InfoRow label="Account Type" value="Customer" />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={s.infoRow}>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{value || "—"}</span>
    </div>
  );
}

function PasswordTab() {
  const [cur,      setCur]      = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cur || !next || !confirm) { toast.error("All fields are required."); return; }
    if (next.length < 6)           { toast.error("Password must be at least 6 characters."); return; }
    if (next !== confirm)          { toast.error("Passwords do not match."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast("Change password coming soon!", { icon: "🚀", style: { border: "1.5px solid #e84949" } });
    setLoading(false);
  }

  return (
    <div style={s.tabContent}>
      <h3 style={s.sectionTitle}>Change Password</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Current Password" type="password" value={cur} onChange={e => setCur(e.target.value)} placeholder="••••••••" />
        <Field label="New Password" type="password" value={next} onChange={e => setNext(e.target.value)} placeholder="Min 6 characters" />
        <Field label="Confirm New Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter new password" />
        <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={s.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <input type={show ? "text" : type} value={value} onChange={onChange} placeholder={placeholder}
          style={s.input} />
        {type === "password" && (
          <button type="button" onClick={() => setShow(v => !v)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 13 }}>
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

function TripsTab() {
  return (
    <div style={s.tabContent}>
      <h3 style={s.sectionTitle}>My Trips</h3>
      <div style={s.emptyState}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 16px" }}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <p style={{ fontWeight: 600, color: "#bbb", margin: "0 0 6px" }}>No trips yet</p>
        <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>Your booked trips will appear here.</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]   = useState(null);
  const [tab,  setTab]    = useState("profile");

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    if (router.query.tab) setTab(router.query.tab);
  }, [router.query.tab]);

  async function handleLogout() {
    const token = getToken();
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    clearSession();
    toast.success("Logged out successfully");
    router.push("/");
  }

  if (!user) return null;

  return (
    <>
      <Head><title>My Profile — TourWatchOut</title></Head>
      <Topbar />
      <Offcanvas />

      <div style={s.page}>
        <div style={s.container}>
          {/* Sidebar */}
          <aside style={s.sidebar}>
            <div style={s.sideAvatar}>
              {user.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>{user.email}</div>
            </div>

            {[
              { key: "profile",  label: "View Profile",     icon: "👤" },
              { key: "password", label: "Change Password",  icon: "🔒" },
              { key: "trips",    label: "My Trips",         icon: "🏕️" },
            ].map(item => (
              <button key={item.key} onClick={() => setTab(item.key)} style={{
                ...s.sideBtn,
                background: tab === item.key ? "#fff5f5" : "transparent",
                color:      tab === item.key ? "#e84949" : "#555",
                fontWeight: tab === item.key ? 700 : 500,
              }}>
                <span>{item.icon}</span> {item.label}
              </button>
            ))}

            <div style={s.sideDivider} />
            <button onClick={handleLogout} style={{ ...s.sideBtn, color: "#e84949" }}>
              <span>↩</span> Log Out
            </button>
          </aside>

          {/* Main content */}
          <main style={s.main}>
            {tab === "profile"  && <ProfileTab user={user} />}
            {tab === "password" && <PasswordTab />}
            {tab === "trips"    && <TripsTab />}
          </main>
        </div>
      </div>

      <NewFooter />
    </>
  );
}

const s = {
  page:       { minHeight: "100vh", background: "#f7f7f8", paddingTop: 100, paddingBottom: 60, fontFamily: "'DM Sans', sans-serif" },
  container:  { maxWidth: 1000, margin: "0 auto", padding: "0 20px", display: "flex", gap: 24, alignItems: "flex-start" },
  sidebar:    { width: 240, background: "#fff", borderRadius: 16, padding: "28px 16px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", flexShrink: 0, position: "sticky", top: 100 },
  sideAvatar: { width: 72, height: 72, borderRadius: "50%", background: "#e84949", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, margin: "0 auto 14px" },
  sideBtn:    { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", textAlign: "left", transition: "all 0.15s", marginBottom: 4 },
  sideDivider:{ height: 1, background: "#f0f0f0", margin: "10px 0" },
  main:       { flex: 1, background: "#fff", borderRadius: 16, boxShadow: "0 2px 20px rgba(0,0,0,0.06)", overflow: "hidden" },
  tabContent: { padding: "32px 32px" },
  avatarWrap: { display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #f0f0f0" },
  avatarBig:  { width: 72, height: 72, borderRadius: "50%", background: "#e84949", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 24, flexShrink: 0 },
  infoGrid:   { display: "flex", flexDirection: "column", gap: 0 },
  infoRow:    { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f8f8f8" },
  infoLabel:  { fontSize: 13, color: "#999", fontWeight: 500 },
  infoValue:  { fontSize: 14, color: "#1a1a1a", fontWeight: 600 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px" },
  label:      { fontSize: 13, fontWeight: 600, color: "#444" },
  input:      { border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "12px 14px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", color: "#222", background: "#fafafa" },
  submitBtn:  { background: "#e84949", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  emptyState: { textAlign: "center", padding: "60px 20px", background: "#fafafa", borderRadius: 12 },
};
