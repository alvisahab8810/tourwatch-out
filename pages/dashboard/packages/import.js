import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdChevronLeft,
  MdCheckCircle, MdCloudUpload, MdTableChart,
} from "react-icons/md";
import DashboardLayout, { useOpenSidebar } from "../../../components/backend/DashboardLayout";

export default function ImportPackages() {
  const router      = useRouter();
  const openSidebar = useOpenSidebar();
  const fileRef     = useRef(null);

  const [step,      setStep]      = useState(1);
  const [file,      setFile]      = useState(null);
  const [parsing,   setParsing]   = useState(false);
  const [preview,   setPreview]   = useState(null);
  const [importing, setImporting] = useState(false);
  const [results,   setResults]   = useState(null);
  const [dragOver,  setDragOver]  = useState(false);
  const [debugRows, setDebugRows] = useState(null);

  async function handlePreview() {
    if (!file) return;
    setParsing(true);
    setDebugRows(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("preview", "true");
      const r    = await fetch("/api/dashboard/packages/import", { method: "POST", body: fd });
      const data = await r.json();
      if (!r.ok || data.error) { alert(data.error || "Parse failed"); return; }
      if (!data.packages?.length) { setDebugRows(data.debugRows || []); return; }
      setPreview(data.packages);
      setStep(2);
    } catch (e) {
      alert("Parse failed: " + e.message);
    } finally {
      setParsing(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r    = await fetch("/api/dashboard/packages/import", { method: "POST", body: fd });
      const data = await r.json();
      if (!r.ok || data.error) { alert(data.error || "Import failed"); return; }
      setResults(data);
      setStep(3);
    } catch (e) {
      alert("Import failed: " + e.message);
    } finally {
      setImporting(false);
    }
  }

  function pickFile(f) {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(ext)) { alert("Please upload a .xlsx or .xls file."); return; }
    setFile(f);
  }

  const tick = <span style={{ color: "#16a34a", fontSize: 15, fontWeight: 700 }}>✓</span>;
  const dash = <span style={{ color: "#d1d5db" }}>—</span>;
  const badge = (text, bg, color) => (
    <span style={{ background: bg, color, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
      {text}
    </span>
  );

  return (
    <>
      <Head><title>Import Packages — Tourwatchout</title></Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
          <button className="bk-back-btn" onClick={() => router.push("/dashboard/packages")}>
            <MdChevronLeft size={20} />
          </button>
          <h1 className="bk-page-title">Import Packages from Excel</h1>
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

        {/* Step indicator */}
        <div className="bk-import-steps">
          {["Upload File", "Preview & Import", "Done"].map((label, i) => (
            <div key={i} className={`bk-import-step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
              <span className="bk-import-step-num">{step > i + 1 ? "✓" : i + 1}</span>
              <span className="bk-import-step-label">{label}</span>
              {i < 2 && <span className="bk-import-step-line" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Upload */}
        {step === 1 && (
          <div className="bk-form-section" style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 className="bk-section-title">Upload your Excel / Google Sheets file</h2>
            <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              Export as <strong>.xlsx</strong> and upload. All fields are read automatically from the file —
              destination, type, subtype, duration, prices, itinerary, inclusions &amp; exclusions.
              Bold rows in inclusions / exclusions become section headers.
              Images can be added after import via the Edit form.
            </p>

            <div
              className={`bk-excel-drop-zone ${file ? "has-file" : ""} ${dragOver ? "drag-over" : ""}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0]); }}
            >
              {file ? (
                <div className="bk-excel-file-selected">
                  <MdTableChart size={38} color="#2563eb" />
                  <div>
                    <p style={{ fontWeight: 600, color: "#1e3a5f", margin: 0 }}>{file.name}</p>
                    <p style={{ color: "#6b7280", fontSize: 12, margin: "4px 0 0" }}>
                      {(file.size / 1024).toFixed(1)} KB — click to change
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bk-excel-drop-inner">
                  <MdCloudUpload size={44} color="#94a3b8" />
                  <p style={{ fontWeight: 600, color: "#374151", margin: "10px 0 4px" }}>
                    Click to browse or drag &amp; drop
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>.xlsx or .xls files only</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={e => { pickFile(e.target.files[0]); e.target.value = ""; }}
              />
            </div>

            <button
              className="bk-publish-btn"
              style={{ marginTop: 20, width: "100%" }}
              onClick={handlePreview}
              disabled={!file || parsing}
            >
              {parsing ? "Parsing file…" : "Parse & Preview →"}
            </button>

            {/* Debug panel */}
            {debugRows && (
              <div style={{ marginTop: 20, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "14px 16px" }}>
                <p style={{ fontWeight: 600, color: "#c2410c", fontSize: 13, margin: "0 0 8px" }}>
                  No packages detected. The parser looks for a row where Column A or B contains only a
                  number (1, 2, 3…) to mark each package start. Raw rows below for diagnosis:
                </p>
                {debugRows.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace", width: "100%" }}>
                      <tbody>
                        {debugRows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci} style={{
                                border: "1px solid #fcd34d", padding: "3px 7px",
                                maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                background: ci === 0 ? "#fef9c3" : "#fffbeb",
                              }}>
                                {cell || <span style={{ color: "#d1d5db" }}>—</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>File appears empty or unreadable.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Preview */}
        {step === 2 && preview && (
          <div className="bk-form-section">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <h2 className="bk-section-title" style={{ margin: 0 }}>
                <MdCheckCircle size={20} color="#16a34a" style={{ marginRight: 8, verticalAlign: "middle" }} />
                {preview.length} package{preview.length !== 1 ? "s" : ""} detected
              </h2>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="bk-cancel-btn" onClick={() => { setStep(1); setPreview(null); }}>
                  ← Back
                </button>
                <button
                  className="bk-publish-btn"
                  onClick={handleImport}
                  disabled={importing}
                >
                  {importing
                    ? "Importing…"
                    : `Import ${preview.length} Package${preview.length !== 1 ? "s" : ""} as Drafts`}
                </button>
              </div>
            </div>

            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>
              All values extracted from the file. Packages are saved as <strong>Inactive drafts</strong> — add images &amp; publish later.
              Bold rows in inclusions/exclusions are saved as section headers.
            </p>

            <div className="bk-table-card">
              <div className="bk-table-wrap">
                <table className="bk-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Package Name</th>
                      <th>Destination</th>
                      <th>Type</th>
                      <th>Subtype</th>
                      <th>Duration</th>
                      <th>Base ₹</th>
                      <th>Final ₹</th>
                      <th>Days</th>
                      <th>Inc</th>
                      <th>Exc</th>
                      <th>About</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((p, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 500, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.packageName || dash}
                        </td>
                        <td>{p.destination   || dash}</td>
                        <td>{p.packageType   ? badge(p.packageType,   "#eff6ff", "#1d4ed8") : dash}</td>
                        <td>{p.packageSubtype ? badge(p.packageSubtype, "#f0fdf4", "#15803d") : dash}</td>
                        <td>{p.duration      || dash}</td>
                        <td>{p.basePrice  ? `₹${Number(p.basePrice).toLocaleString("en-IN")}`  : dash}</td>
                        <td>{p.finalPrice ? `₹${Number(p.finalPrice).toLocaleString("en-IN")}` : dash}</td>
                        <td style={{ textAlign: "center" }}>{p.days.length}</td>
                        <td style={{ textAlign: "center" }}>{p.inclusions ? tick : dash}</td>
                        <td style={{ textAlign: "center" }}>{p.exclusions ? tick : dash}</td>
                        <td style={{ textAlign: "center" }}>{p.aboutText  ? tick : dash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning for any missing destination */}
            {preview.some(p => !p.destination) && (
              <div style={{ marginTop: 14, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#92400e" }}>
                ⚠ {preview.filter(p => !p.destination).length} package(s) have no destination extracted from the file
                and will be skipped. Add a <code>Destination - ...</code> row in the Excel for those packages.
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Done */}
        {step === 3 && results && (
          <div className="bk-form-section" style={{ maxWidth: 520, margin: "40px auto", textAlign: "center" }}>
            <MdCheckCircle size={60} color="#16a34a" style={{ marginBottom: 16 }} />
            <h2 className="bk-section-title" style={{ textAlign: "center", marginBottom: 8 }}>Import Complete</h2>
            <p style={{ fontSize: 15, color: "#374151", marginBottom: 6 }}>
              <strong style={{ color: "#16a34a" }}>{results.imported}</strong> package{results.imported !== 1 ? "s" : ""} imported
              {results.failed > 0 && (
                <>, <strong style={{ color: "#dc2626" }}>{results.failed}</strong> failed / skipped</>
              )}
            </p>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>
              Saved as Inactive drafts — open each one to add images and publish.
            </p>

            {results.failed > 0 && (
              <div style={{ textAlign: "left", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: "0 0 6px" }}>Failed / skipped:</p>
                {results.results.filter(r => !r.success).map((r, i) => (
                  <p key={i} style={{ fontSize: 12, color: "#6b7280", margin: "2px 0" }}>✗ {r.name}: {r.error}</p>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="bk-draft-btn" onClick={() => { setStep(1); setFile(null); setPreview(null); setResults(null); }}>
                Import Another File
              </button>
              <button className="bk-publish-btn" onClick={() => router.push("/dashboard/packages")}>
                Go to Packages
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

ImportPackages.getLayout = (page) => (
  <DashboardLayout active="All Packages">{page}</DashboardLayout>
);
