import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdAdd, MdEdit, MdDelete, MdFlight, MdLogout, MdConfirmationNumber } from "react-icons/md";
import { isAuthenticated, logout } from "../../utils/voucherAuth";

export default function Dashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/dashboard/login");
      return;
    }
    const saved = JSON.parse(localStorage.getItem("tw_vouchers") || "[]");
    setVouchers(saved);
    setReady(true);
  }, []);

  function handleLogout() {
    logout();
    router.replace("/dashboard/login");
  }

  function deleteVoucher(id) {
    if (!confirm("Delete this voucher?")) return;
    const updated = vouchers.filter((v) => v.id !== id);
    localStorage.setItem("tw_vouchers", JSON.stringify(updated));
    setVouchers(updated);
  }

  if (!ready) return null;

  return (
    <>
      <Head>
        <title>Dashboard — TourWatchOut</title>
      </Head>
      <div style={s.page}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          <div style={s.sideLogoWrap}>
            <img src="/assets/images/logo.png" alt="TW" style={s.sideLogo} />
          </div>
          <nav style={s.nav}>
            <div style={{ ...s.navItem, ...s.navActive }}>
              <MdConfirmationNumber size={17} /> Vouchers
            </div>
          </nav>
          <button onClick={handleLogout} style={s.logoutBtn}>
            <MdLogout size={15} /> Logout
          </button>
        </aside>

        {/* Main */}
        <main style={s.main}>
          <header style={s.header}>
            <div>
              <h1 style={s.heading}>Voucher Management</h1>
              <p style={s.subheading}>Create, manage and share travel vouchers</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/create-voucher")}
              style={s.createBtn}
            >
              <MdAdd size={18} /> Create Voucher
            </button>
          </header>

          {vouchers.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>🎫</div>
              <h3 style={s.emptyTitle}>No vouchers yet</h3>
              <p style={s.emptyText}>Click "Create Voucher" to generate your first travel voucher.</p>
              <button
                onClick={() => router.push("/dashboard/create-voucher")}
                style={s.createBtn}
              >
                <MdAdd size={18} /> Create Voucher
              </button>
            </div>
          ) : (
            <div style={s.grid}>
              {vouchers.map((v) => (
                <div key={v.id} style={s.card}>
                  <div style={s.cardHeader}>
                    <span style={s.badge}>#{v.voucherNo || v.id.slice(-6)}</span>
                    <span style={s.cardDate}>
                      {new Date(v.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <h3 style={s.cardName}>{v.name || "—"}</h3>
                  <p style={s.cardDest}>
                    <MdFlight size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                    {v.destination || "No destination"}
                  </p>
                  <p style={s.cardTrip}>Trip ID: {v.tripId || "—"}</p>
                  <div style={s.cardActions}>
                    <button
                      style={s.viewBtn}
                      onClick={() =>
                        router.push(`/dashboard/create-voucher?id=${v.id}`)
                      }
                    >
                      <MdEdit size={14} style={{ verticalAlign: "middle" }} /> Edit / View
                    </button>
                    <button
                      style={s.delBtn}
                      onClick={() => deleteVoucher(v.id)}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f6fa",
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebar: {
    width: 220,
    background: "#1a1a2e",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 24px",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
  },
  sideLogoWrap: {
    padding: "24px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 16,
  },
  sideLogo: { height:28, objectFit: "contain", filter: "brightness(0) invert(1)" },
  nav: { flex: 1, padding: "0 12px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 8,
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginBottom: 4,
  },
  navActive: {
    background: "rgba(232,73,73,0.2)",
    color: "#e84949",
  },
  logoutBtn: {
    margin: "0 12px",
    background: "none",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    color: "rgba(255,255,255,0.6)",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: 14,
    textAlign: "left",
  },
  main: {
    marginLeft: 220,
    flex: 1,
    padding: "32px 40px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  heading: { fontSize: 26, fontWeight: 700, color: "#1a1a2e", margin: 0 },
  subheading: { fontSize: 14, color: "#888", margin: "6px 0 0" },
  createBtn: {
    background: "#e84949",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px" },
  emptyText: { color: "#888", fontSize: 15, marginBottom: 24 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    background: "#fff2f2",
    color: "#e84949",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
  },
  cardDate: { fontSize: 12, color: "#aaa" },
  cardName: { fontSize: 17, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" },
  cardDest: { fontSize: 14, color: "#555", margin: "0 0 4px" },
  cardTrip: { fontSize: 13, color: "#aaa", margin: "0 0 16px" },
  cardActions: { display: "flex", gap: 8 },
  viewBtn: {
    flex: 1,
    background: "#f5f6fa",
    border: "none",
    borderRadius: 7,
    padding: "9px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#333",
  },
  delBtn: {
    background: "#fff2f2",
    border: "none",
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
};
