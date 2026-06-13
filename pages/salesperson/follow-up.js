import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";

export default function SPFollowUp() {
  const router = useRouter();
  const [spData, setSpData] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SP_AUTH_KEY);
      if (!raw) return router.replace("/salesperson/login");
      const { token, salesperson } = JSON.parse(raw);
      if (!token || !salesperson) return router.replace("/salesperson/login");
      setSpData(salesperson);
    } catch { router.replace("/salesperson/login"); }
  }, []);

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

  if (!spData) return null;

  return (
    <SPLayout active="Follow Up" spData={spData} onLogout={handleLogout}>
      <Head><title>Follow Up — Tourwatchout</title></Head>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 54px)", padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>Follow Up</h1>
        <p style={{ fontSize: 15, color: "#64748b", maxWidth: 420, margin: "0 0 28px", lineHeight: 1.7 }}>
          The Follow Up module is being built. Soon you'll be able to schedule and track follow-up tasks for your leads here.
        </p>
        <button onClick={() => router.push("/salesperson/dashboard")}
          style={{ padding: "10px 24px", background: "#EE4C49", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Back to Leads
        </button>
      </div>
    </SPLayout>
  );
}
