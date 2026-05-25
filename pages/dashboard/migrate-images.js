import { useState } from "react";
import DashboardLayout from "../../components/backend/DashboardLayout";

export default function MigrateImages() {
  const [status,   setStatus]   = useState("idle");   // idle | running | done | error
  const [total,    setTotal]    = useState(0);
  const [errors,   setErrors]   = useState(0);
  const [log,      setLog]      = useState([]);

  const addLog = (msg) => setLog(prev => [msg, ...prev].slice(0, 50));

  const runMigration = async () => {
    setStatus("running");
    setTotal(0);
    setErrors(0);
    setLog([]);

    let lastId    = "";
    let hasMore   = true;
    let totalMig  = 0;
    let totalErr  = 0;
    let batchNum  = 0;

    while (hasMore) {
      batchNum++;
      try {
        const res  = await fetch("/api/dashboard/migrate-images", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ lastId, limit: 5 }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          addLog(`Batch ${batchNum}: error — ${err.error}. Retrying in 3s…`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }

        const data = await res.json();
        totalMig += data.migrated || 0;
        totalErr += data.errors   || 0;
        setTotal(totalMig);
        setErrors(totalErr);
        addLog(`Batch ${batchNum}: migrated ${data.migrated}, errors ${data.errors}`);

        hasMore = data.hasMore;
        lastId  = data.lastId || lastId;

        // Small pause between batches to avoid overwhelming the DB
        if (hasMore) await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        addLog(`Batch ${batchNum}: network error — ${e.message}. Retrying in 5s…`);
        await new Promise(r => setTimeout(r, 5000));
      }
    }

    setStatus(totalErr > 0 ? "done-with-errors" : "done");
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ marginBottom: 8 }}>Image Migration</h2>
        <p style={{ color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
          Moves all existing package &amp; destination images from MongoDB to the
          server filesystem. This frees MongoDB storage so packages can be saved
          again. All existing image URLs continue to work automatically — no
          re-uploading needed.
        </p>

        {status === "idle" && (
          <button
            onClick={runMigration}
            style={{
              background: "#7c3aed", color: "#fff", border: "none",
              borderRadius: 8, padding: "12px 28px", fontSize: 15,
              cursor: "pointer", fontWeight: 600,
            }}
          >
            Start Migration
          </button>
        )}

        {status === "running" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 20, height: 20, border: "3px solid #7c3aed",
                borderTopColor: "transparent", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              <span style={{ fontWeight: 600 }}>
                Migrating… {total} images done{errors > 0 ? `, ${errors} errors` : ""}
              </span>
            </div>
            <p style={{ color: "#6b7280", fontSize: 13 }}>
              Do not close this tab. This may take a few minutes.
            </p>
          </div>
        )}

        {(status === "done" || status === "done-with-errors") && (
          <div style={{
            background: status === "done" ? "#ecfdf5" : "#fffbeb",
            border: `1px solid ${status === "done" ? "#6ee7b7" : "#fcd34d"}`,
            borderRadius: 10, padding: 20, marginBottom: 16,
          }}>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              {status === "done" ? "Migration complete!" : "Migration finished with some errors"}
            </p>
            <p style={{ color: "#374151" }}>
              {total} images migrated to filesystem.
              {errors > 0 && ` ${errors} images could not be migrated (see log).`}
            </p>
            <p style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>
              MongoDB storage has been freed. You can now save packages normally.
              All image URLs continue to work — nothing needs to be re-uploaded.
            </p>
          </div>
        )}

        {log.length > 0 && (
          <div style={{
            background: "#f9fafb", border: "1px solid #e5e7eb",
            borderRadius: 8, padding: 12, marginTop: 16,
            maxHeight: 300, overflowY: "auto", fontFamily: "monospace", fontSize: 12,
          }}>
            {log.map((line, i) => (
              <div key={i} style={{ marginBottom: 3, color: "#374151" }}>{line}</div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
