import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MdSearch, MdAdd, MdEdit, MdDelete, MdClose, MdExpandMore, MdExpandLess } from "react-icons/md";
import SPLayout from "../../components/backend/SPLayout";

const SP_AUTH_KEY = "tw_sp_auth";
const EMPTY_FORM = { question: "", answer: "", status: "published", order: 0 };

export default function SPFaqs() {
  const router = useRouter();
  const [spData,   setSpData]   = useState(null);
  const [data,     setData]     = useState({ faqs: [], stats: {} });
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SP_AUTH_KEY);
      if (!raw) return router.replace("/salesperson/login");
      const { token, salesperson } = JSON.parse(raw);
      if (!token || !salesperson) return router.replace("/salesperson/login");
      setSpData(salesperson);
    } catch { router.replace("/salesperson/login"); }
  }, []);

  useEffect(() => { if (spData) load(); }, [spData, filter]);

  async function load() {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    const r = await fetch(`/api/dashboard/faqs?${params}`);
    const json = await r.json();
    setData(json);
  }

  function handleLogout() {
    localStorage.removeItem(SP_AUTH_KEY);
    router.replace("/salesperson/login");
  }

  function openAdd() { setForm(EMPTY_FORM); setEditId(null); setModal("add"); }
  function openEdit(faq) {
    setForm({ question: faq.question, answer: faq.answer, status: faq.status, order: faq.order || 0 });
    setEditId(faq.id);
    setModal("edit");
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return alert("Question and answer are required.");
    setSaving(true);
    try {
      const isEdit = modal === "edit";
      const res = await fetch(isEdit ? `/api/dashboard/faqs/${editId}` : "/api/dashboard/faqs", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const e = await res.json(); alert(e.error || "Save failed"); return; }
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/dashboard/faqs/${id}`, { method: "DELETE" });
    setData(prev => ({ ...prev, faqs: (prev.faqs || []).filter(f => f.id !== id) }));
  }

  const visible = (data.faqs || []).filter(f => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (f.question || "").toLowerCase().includes(q) || (f.answer || "").toLowerCase().includes(q);
  });

  if (!spData) return null;

  return (
    <SPLayout active="FAQs" spData={spData} onLogout={handleLogout}>
      <Head><title>FAQs — Tourwatchout</title></Head>

      <div style={{ padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>FAQs</h1>
          <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <MdAdd size={16} /> Add FAQ
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {["all", "published", "draft"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: filter === f ? 700 : 500, cursor: "pointer", background: filter === f ? "#EE4C49" : "#f1f5f9", color: filter === f ? "#fff" : "#374151" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="bk-topbar" style={{ marginBottom: 16 }}>
          <div className="bk-search-wrap">
            <MdSearch size={18} className="bk-search-icon" />
            <input className="bk-search-input" placeholder="Search FAQs…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>No FAQs found</div>
          ) : visible.map(faq => (
            <div key={faq.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", cursor: "pointer" }}
                onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}>
                <div style={{ flex: 1, fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{faq.question}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: faq.status === "published" ? "#dcfce7" : "#f1f5f9", color: faq.status === "published" ? "#15803d" : "#64748b" }}>{faq.status}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={e => { e.stopPropagation(); openEdit(faq); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", padding: "2px 4px" }}><MdEdit size={15} /></button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(faq.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "2px 4px" }}><MdDelete size={15} /></button>
                </div>
                {expanded === faq.id ? <MdExpandLess size={18} color="#64748b" /> : <MdExpandMore size={18} color="#64748b" />}
              </div>
              {expanded === faq.id && (
                <div style={{ padding: "0 18px 14px", borderTop: "1px solid #f1f5f9", color: "#374151", fontSize: 14, lineHeight: 1.7 }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 560, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{modal === "add" ? "Add FAQ" : "Edit FAQ"}</h3>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><MdClose size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Question *</label>
                <input value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="Enter FAQ question" required
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Answer *</label>
                <textarea value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} placeholder="Enter FAQ answer" required rows={5}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none" }}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} min="0"
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModal(null)} style={{ padding: "9px 20px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "9px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SPLayout>
  );
}
