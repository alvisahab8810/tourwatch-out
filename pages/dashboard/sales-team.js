import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  MdAdd, MdDelete, MdWarning, MdPerson, MdRefresh,
  MdCheckBox, MdCheckBoxOutlineBlank, MdEdit,
} from "react-icons/md";
import DashboardLayout from "../../components/backend/DashboardLayout";

const ALL_PERMISSIONS = [
  // Sales CRM
  { key: "leads",        label: "Leads" },
  { key: "brr",          label: "BRR" },
  { key: "quotation",    label: "Quotation" },
  { key: "invoice",      label: "Invoice" },
  { key: "voucher",      label: "Voucher" },
  { key: "reminders",    label: "Reminder" },
  { key: "vendors",      label: "Vendors" },
  // Content
  { key: "destinations", label: "Destinations" },
  { key: "packages",     label: "All Packages" },
  { key: "blogs",        label: "Blogs" },
  { key: "comments",     label: "Comments" },
  { key: "reviews",      label: "Reviews" },
  { key: "mostPopular",  label: "Most Popular" },
  { key: "faqs",         label: "FAQs" },
  { key: "users",        label: "Users" },
  // Business
  { key: "financials",   label: "Financials" },
  { key: "reports",      label: "Reports" },
  { key: "tripRecords",  label: "Trip Records" },
  { key: "leadProfiles", label: "Lead Profiles" },
];

const DEFAULT_PERMS = Object.fromEntries(ALL_PERMISSIONS.map(p => [p.key, p.key === "leads"]));

const EMPTY_FORM = { name: "", email: "", permissions: { ...DEFAULT_PERMS } };

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SalesTeamPage() {
  const [team,         setTeam]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showInvite,   setShowInvite]   = useState(false);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [saving,       setSaving]       = useState(false);
  const [formError,    setFormError]    = useState("");
  const [successMsg,   setSuccessMsg]   = useState("");
  const [confirmId,    setConfirmId]    = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [editSp,       setEditSp]       = useState(null); // salesperson being edited

  useEffect(() => { fetchTeam(); }, []);

  async function fetchTeam() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/salesperson");
      if (res.ok) setTeam(await res.json());
    } finally { setLoading(false); }
  }

  async function inviteSalesPerson() {
    setFormError("");
    if (!form.name.trim()) return setFormError("Name is required.");
    if (!form.email.trim()) return setFormError("Email is required.");
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/salesperson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), permissions: form.permissions }),
      });
      const data = await res.json();
      if (!res.ok) return setFormError(data.error || "Failed to invite salesperson.");
      setTeam(prev => [data.salesperson, ...prev]);
      setShowInvite(false);
      setForm(EMPTY_FORM);
      setSuccessMsg(`Invitation sent to ${form.email.trim()}`);
      setTimeout(() => setSuccessMsg(""), 5000);
    } finally { setSaving(false); }
  }

  async function deleteSalesPerson() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await fetch(`/api/dashboard/salesperson/${confirmId}`, { method: "DELETE" });
      setTeam(prev => prev.filter(s => s._id !== confirmId));
    } finally { setDeleting(false); setConfirmId(null); }
  }

  async function savePermissions() {
    if (!editSp) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/salesperson/${editSp._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: editSp.permissions }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTeam(prev => prev.map(s => s._id === editSp._id ? updated : s));
        setEditSp(null);
      }
    } finally { setSaving(false); }
  }

  async function toggleActive(sp) {
    const res = await fetch(`/api/dashboard/salesperson/${sp._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !sp.isActive }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTeam(prev => prev.map(s => s._id === sp._id ? updated : s));
    }
  }

  const confirmSp = team.find(s => s._id === confirmId);

  return (
    <DashboardLayout active="Sales Team">
      <Head><title>Sales Team — Tourwatchout</title></Head>

      <div style={S.page}>
        <style>{`
          .sp-card { transition: box-shadow 0.15s; }
          .sp-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.10) !important; }
        `}</style>

        {/* Header */}
        <div style={S.header}>
          <h1 style={S.title}>Sales Team</h1>
          <button style={S.refreshBtn} onClick={fetchTeam} title="Refresh"><MdRefresh size={18} /></button>
          <button style={S.addBtn} onClick={() => { setForm(EMPTY_FORM); setFormError(""); setShowInvite(true); }}>
            <MdAdd size={18} /> Invite Salesperson
          </button>
        </div>

        {successMsg && (
          <div style={{ marginBottom: 16, padding: "12px 18px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 13, color: "#15803d", fontWeight: 600 }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
          <Stat label="Total"  value={team.length}                        color="#2563eb" />
          <Stat label="Active" value={team.filter(s => s.isActive).length} color="#16a34a" />
          <Stat label="Inactive" value={team.filter(s => !s.isActive).length} color="#dc2626" />
        </div>

        {/* Team cards */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 14 }}>Loading…</div>
        ) : team.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <MdPerson size={48} color="#cbd5e1" />
            <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 15 }}>No salespersons yet</div>
            <div style={{ color: "#cbd5e1", fontSize: 13, marginTop: 4 }}>Click "Invite Salesperson" to add your first team member</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {team.map(sp => (
              <div key={sp._id} className="sp-card" style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                {/* Card header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EE4C49", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                      {sp.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{sp.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{sp.email}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>@{sp.username}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", background: sp.isActive ? "#f0fdf4" : "#fef2f2", color: sp.isActive ? "#16a34a" : "#dc2626" }}>
                      {sp.isActive ? "Active" : "Inactive"}
                    </span>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Joined {fmtDate(sp.createdAt)}</div>
                  </div>
                </div>

                {/* Permissions chips */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Permissions</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {ALL_PERMISSIONS.filter(p => sp.permissions?.[p.key]).map(p => (
                      <span key={p.key} style={{ fontSize: 11, background: "#eff6ff", color: "#2563eb", borderRadius: 20, padding: "2px 8px", fontWeight: 600 }}>
                        {p.label}
                      </span>
                    ))}
                    {!ALL_PERMISSIONS.some(p => sp.permissions?.[p.key]) && (
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>No permissions granted</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                  <button
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                    onClick={() => setEditSp({ ...sp, permissions: { ...sp.permissions } })}
                  >
                    <MdEdit size={14} /> Edit Permissions
                  </button>
                  <button
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${sp.isActive ? "#fecaca" : "#bbf7d0"}`, background: sp.isActive ? "#fef2f2" : "#f0fdf4", color: sp.isActive ? "#dc2626" : "#16a34a", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    onClick={() => toggleActive(sp)}
                  >
                    {sp.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => setConfirmId(sp._id)}
                    title="Remove salesperson"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Invite Modal ── */}
      {showInvite && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget && !saving) setShowInvite(false); }}>
          <div style={{ ...S.modalCard, maxWidth: 560 }}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Invite Salesperson</h2>
              <button style={S.modalClose} onClick={() => !saving && setShowInvite(false)}>×</button>
            </div>
            <div style={S.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <Field label="Full Name *">
                  <input style={S.input} placeholder="e.g. Priya Sharma" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </Field>
                <Field label="Email Address *">
                  <input style={S.input} placeholder="priya@example.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </Field>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Dashboard Permissions
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {ALL_PERMISSIONS.map(p => (
                  <label key={p.key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 10px", borderRadius: 8, border: `1px solid ${form.permissions[p.key] ? "#bfdbfe" : "#e2e8f0"}`, background: form.permissions[p.key] ? "#eff6ff" : "#fff", fontSize: 13, fontWeight: 600, color: form.permissions[p.key] ? "#2563eb" : "#374151", userSelect: "none" }}>
                    {form.permissions[p.key]
                      ? <MdCheckBox size={18} color="#2563eb" />
                      : <MdCheckBoxOutlineBlank size={18} color="#cbd5e1" />}
                    {p.label}
                    <input type="checkbox" style={{ display: "none" }} checked={!!form.permissions[p.key]}
                      onChange={e => setForm(f => ({ ...f, permissions: { ...f.permissions, [p.key]: e.target.checked } }))} />
                  </label>
                ))}
              </div>

              <div style={{ marginTop: 16, padding: "10px 14px", background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
                A username and password will be auto-generated and emailed to the salesperson.
              </div>

              {formError && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#dc2626" }}>
                  {formError}
                </div>
              )}
            </div>
            <div style={S.modalFooter}>
              <button style={S.cancelBtn} onClick={() => !saving && setShowInvite(false)} disabled={saving}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={inviteSalesPerson} disabled={saving}>
                {saving ? "Sending Invite…" : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Permissions Modal ── */}
      {editSp && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget && !saving) setEditSp(null); }}>
          <div style={{ ...S.modalCard, maxWidth: 480 }}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Edit Permissions — {editSp.name}</h2>
              <button style={S.modalClose} onClick={() => !saving && setEditSp(null)}>×</button>
            </div>
            <div style={S.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {ALL_PERMISSIONS.map(p => (
                  <label key={p.key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 10px", borderRadius: 8, border: `1px solid ${editSp.permissions?.[p.key] ? "#bfdbfe" : "#e2e8f0"}`, background: editSp.permissions?.[p.key] ? "#eff6ff" : "#fff", fontSize: 13, fontWeight: 600, color: editSp.permissions?.[p.key] ? "#2563eb" : "#374151", userSelect: "none" }}>
                    {editSp.permissions?.[p.key]
                      ? <MdCheckBox size={18} color="#2563eb" />
                      : <MdCheckBoxOutlineBlank size={18} color="#cbd5e1" />}
                    {p.label}
                    <input type="checkbox" style={{ display: "none" }} checked={!!editSp.permissions?.[p.key]}
                      onChange={e => setEditSp(sp => ({ ...sp, permissions: { ...sp.permissions, [p.key]: e.target.checked } }))} />
                  </label>
                ))}
              </div>
            </div>
            <div style={S.modalFooter}>
              <button style={S.cancelBtn} onClick={() => !saving && setEditSp(null)} disabled={saving}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={savePermissions} disabled={saving}>
                {saving ? "Saving…" : "Save Permissions"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {confirmId && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget && !deleting) setConfirmId(null); }}>
          <div style={{ ...S.confirmCard }}>
            <div style={S.confirmIcon}><MdWarning size={36} color="#ef4444" /></div>
            <h3 style={S.confirmTitle}>Remove Salesperson?</h3>
            <p style={S.confirmMsg}>
              Removing <strong>{confirmSp?.name}</strong> will also un-assign all leads assigned to them. This cannot be undone.
            </p>
            <div style={S.confirmBtns}>
              <button style={S.cancelBtn} onClick={() => setConfirmId(null)} disabled={deleting}>Cancel</button>
              <button style={S.deleteBtn} onClick={deleteSalesPerson} disabled={deleting}>
                {deleting ? "Removing…" : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
    </div>
  );
}

const S = {
  page:       { padding: "24px 28px", minHeight: "100vh", background: "#f8fafc", width: "100%", boxSizing: "border-box" },
  header:     { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  title:      { fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 },
  refreshBtn: { marginLeft: "auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" },
  addBtn:     { display: "flex", alignItems: "center", gap: 6, background: "#EE4C49", color: "#fff", border: "none", borderRadius: 10, padding: "0 18px", height: 38, fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" },
  overlay:    { position: "fixed", inset: 0, background: "rgba(10,15,30,0.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 },
  modalCard:  { background: "#fff", borderRadius: 18, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.22)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" },
  modalHeader:{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" },
  modalTitle: { fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 },
  modalClose: { background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8", lineHeight: 1, padding: 0 },
  modalBody:  { padding: "20px 24px", overflowY: "auto", flex: 1 },
  modalFooter:{ display: "flex", gap: 10, padding: "16px 24px", borderTop: "1px solid #f1f5f9" },
  input:      { border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box", background: "#f8fafc" },
  cancelBtn:  { flex: 1, padding: "12px 0", borderRadius: 50, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  saveBtn:    { flex: 1, padding: "12px 0", borderRadius: 50, border: "none", background: "#EE4C49", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  confirmCard:{ background: "#fff", borderRadius: 18, padding: "36px 32px 28px", width: "100%", maxWidth: 420, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.22)" },
  confirmIcon:{ marginBottom: 14, display: "flex", justifyContent: "center" },
  confirmTitle:{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" },
  confirmMsg: { fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 26px" },
  confirmBtns:{ display: "flex", gap: 10 },
  deleteBtn:  { flex: 1, padding: "12px 0", borderRadius: 50, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
};
