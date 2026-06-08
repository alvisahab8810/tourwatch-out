import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdMenu, MdKeyboardArrowDown, MdPeople, MdSearch, MdAdd,
  MdEdit, MdDelete, MdFilterList, MdClose,
} from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import DashboardLayout, { useOpenSidebar } from "../../components/backend/DashboardLayout";

const EMPTY_FORM = { question: "", answer: "", status: "published", order: 0 };

export default function FaqsDashboard() {
  const router = useRouter();
  const openSidebar = useOpenSidebar();
  const [data,       setData]       = useState({ faqs: [], stats: {} });
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [modal,      setModal]      = useState(null); // null | "add" | "edit"
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [editId,     setEditId]     = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    load();
  }, [filter]);

  useEffect(() => {
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function load() {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    const r = await fetch(`/api/dashboard/faqs?${params}`);
    const json = await r.json();
    setData(json);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setModal("add");
  }

  function openEdit(faq) {
    setForm({ question: faq.question, answer: faq.answer, status: faq.status, order: faq.order || 0 });
    setEditId(faq.id);
    setModal("edit");
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    setSaving(true);
    try {
      const res = modal === "add"
        ? await fetch("/api/dashboard/faqs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          })
        : await fetch(`/api/dashboard/faqs/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
      if (!res.ok) throw new Error();
      toast.success(modal === "add" ? "FAQ added!" : "FAQ updated!");
      setModal(null);
      load();
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(faq) {
    const next = faq.status === "published" ? "draft" : "published";
    setData(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === faq.id ? { ...f, status: next } : f),
    }));
    const res = await fetch(`/api/dashboard/faqs/${faq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setData(prev => ({
        ...prev,
        faqs: prev.faqs.map(f => f.id === faq.id ? { ...f, status: faq.status } : f),
      }));
      toast.error("Failed to update status.");
    } else {
      load();
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this FAQ?")) return;
    setData(prev => ({ ...prev, faqs: prev.faqs.filter(f => f.id !== id) }));
    const res = await fetch(`/api/dashboard/faqs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete.");
      load();
    } else {
      toast.success("FAQ deleted.");
      load();
    }
  }

  const visible = data.faqs.filter(f => {
    if (!search) return true;
    const q = search.toLowerCase();
    return f.question?.toLowerCase().includes(q) || f.answer?.toLowerCase().includes(q);
  });

  return (
    <>
      <Toaster position="top-right" />
      <Head>
        <title>FAQs — Tourwatchout</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/backend.css" />
      </Head>

      <header className="bk-header">
        <div className="bk-header-left">
          <button className="bk-hamburger" onClick={openSidebar}><MdMenu size={22} /></button>
          <h1 className="bk-page-title">FAQs</h1>
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
            {/* Sub-heading */}
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20, marginTop: -8 }}>
              Welcome back! Here&apos;s what&apos;s happening with your FAQs today.
            </p>

            {/* Stats */}
            <div className="faq-stats-row">
              {[
                { label: "Total FAQs",  value: data.stats.total     || 0, color: "#2563eb" },
                { label: "Published",   value: data.stats.published || 0, color: "#16a34a" },
                { label: "Draft",       value: data.stats.draft     || 0, color: "#d97706" },
              ].map(s => (
                <div key={s.label} className="faq-stat-pill">
                  <span className="faq-stat-num" style={{ color: s.color }}>{s.value}</span>
                  <span className="faq-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="bk-topbar" style={{ marginBottom: 20 }}>
              <div className="bk-search-wrap">
                <MdSearch size={18} className="bk-search-icon" />
                <input
                  className="bk-search-input"
                  placeholder="Search FAQs…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {/* Filter */}
                <div style={{ position: "relative" }} ref={filterRef}>
                  <button
                    className={`faq-filter-btn ${showFilter ? "active" : ""}`}
                    onClick={() => setShowFilter(v => !v)}
                  >
                    <MdFilterList size={18} /> Filter
                    {filter !== "all" && <span className="faq-filter-dot" />}
                  </button>
                  {showFilter && (
                    <div className="faq-filter-panel">
                      <p className="faq-filter-heading">Status</p>
                      {["all", "published", "draft"].map(s => (
                        <label key={s} className="faq-filter-opt">
                          <input
                            type="radio"
                            name="faq-status"
                            checked={filter === s}
                            onChange={() => { setFilter(s); setShowFilter(false); }}
                          />
                          <span className="faq-filter-label">
                            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                          </span>
                          {s !== "all" && (
                            <span className={`faq-mini-badge ${s}`}>
                              {s === "published" ? data.stats.published : data.stats.draft}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <button className="bk-add-btn" onClick={openAdd}>
                  <MdAdd size={18} /> Add New FAQ
                </button>
              </div>
            </div>

            {/* FAQ list */}
            {visible.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
                {search ? "No FAQs match your search." : "No FAQs yet. Click \"Add New FAQ\" to create one."}
              </div>
            ) : (
              <div className="faq-cards">
                {visible.map(faq => (
                  <div key={faq.id} className="faq-admin-card">
                    <div className="faq-admin-body">
                      <p className="faq-admin-q">{faq.question}</p>
                      <p className="faq-admin-a">
                        {faq.answer.length > 120 ? faq.answer.slice(0, 120) + "…" : faq.answer}
                      </p>
                    </div>
                    <div className="faq-admin-actions">
                      <button
                        className={`faq-status-btn ${faq.status}`}
                        onClick={() => toggleStatus(faq)}
                        title="Click to toggle status"
                      >
                        {faq.status === "published" ? "Published" : "Draft"}
                      </button>
                      <button className="bk-edit-btn" onClick={() => openEdit(faq)} title="Edit">
                        <MdEdit size={15} />
                      </button>
                      <button className="bk-del-btn" onClick={() => handleDelete(faq.id)} title="Delete">
                        <MdDelete size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="faq-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="faq-modal">
            <div className="faq-modal-header">
              <h2>{modal === "add" ? "Add New FAQ" : "Edit FAQ"}</h2>
              <button className="faq-modal-close" onClick={() => setModal(null)}><MdClose size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="faq-modal-form">
              <label className="faq-modal-label">Question *</label>
              <input
                className="faq-modal-input"
                placeholder="Enter the question…"
                value={form.question}
                onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                required
              />

              <label className="faq-modal-label">Answer *</label>
              <textarea
                className="faq-modal-textarea"
                placeholder="Enter the answer…"
                rows={5}
                value={form.answer}
                onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                required
              />

              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label className="faq-modal-label">Status</label>
                  <select
                    className="faq-modal-input"
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div style={{ width: 100 }}>
                  <label className="faq-modal-label">Order</label>
                  <input
                    type="number"
                    className="faq-modal-input"
                    value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                    min={0}
                  />
                </div>
              </div>

              <div className="faq-modal-footer">
                <button type="button" className="faq-modal-cancel" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="faq-modal-save" disabled={saving}>
                  {saving ? "Saving…" : modal === "add" ? "Add FAQ" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Stats row */
        .faq-stats-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .faq-stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 13px;
        }
        .faq-stat-num   { font-size: 20px; font-weight: 700; line-height: 1; }
        .faq-stat-label { color: #6b7280; }

        /* Filter button */
        .faq-filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fff;
          padding: 9px 16px;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          transition: border-color 0.15s;
        }
        .faq-filter-btn:hover, .faq-filter-btn.active { border-color: #2563eb; color: #2563eb; }
        .faq-filter-dot {
          position: absolute;
          top: 6px; right: 6px;
          width: 7px; height: 7px;
          background: #2563eb;
          border-radius: 50%;
        }

        /* Filter panel */
        .faq-filter-panel {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          padding: 14px 16px;
          min-width: 180px;
          z-index: 200;
        }
        .faq-filter-heading {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #9ca3af;
          margin: 0 0 10px;
        }
        .faq-filter-opt {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 0;
          cursor: pointer;
          font-size: 13.5px;
          color: #374151;
        }
        .faq-filter-opt input[type=radio] { accent-color: #2563eb; cursor: pointer; }
        .faq-filter-label { flex: 1; }
        .faq-mini-badge {
          font-size: 11px;
          font-weight: 600;
          border-radius: 20px;
          padding: 1px 8px;
        }
        .faq-mini-badge.published { background: #dcfce7; color: #15803d; }
        .faq-mini-badge.draft     { background: #fef3c7; color: #b45309; }

        /* FAQ card list */
        .faq-cards { display: flex; flex-direction: column; gap: 12px; }
        .faq-admin-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: box-shadow 0.15s;
        }
        .faq-admin-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .faq-admin-body { flex: 1; min-width: 0; }
        .faq-admin-q {
          font-size: 14.5px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 5px;
          line-height: 1.4;
        }
        .faq-admin-a {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }
        .faq-admin-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .faq-status-btn {
          border: none;
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .faq-status-btn:hover { opacity: 0.8; }
        .faq-status-btn.published { background: #dcfce7; color: #15803d; }
        .faq-status-btn.draft     { background: #fef3c7; color: #b45309; }

        /* Modal */
        .faq-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
        }
        .faq-modal {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 560px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.16);
          overflow: hidden;
        }
        .faq-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .faq-modal-header h2 { font-size: 18px; font-weight: 700; color: #111827; margin: 0; }
        .faq-modal-close {
          background: none; border: none; cursor: pointer;
          color: #6b7280; padding: 4px; border-radius: 6px;
          display: flex; align-items: center;
        }
        .faq-modal-close:hover { background: #f1f5f9; }
        .faq-modal-form { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 14px; }
        .faq-modal-label { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: -8px; }
        .faq-modal-input, .faq-modal-textarea {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          color: #0c141d;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
          background: #fff;
        }
        .faq-modal-input:focus, .faq-modal-textarea:focus { border-color: #2563eb; }
        .faq-modal-textarea { resize: vertical; min-height: 110px; }
        .faq-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }
        .faq-modal-cancel {
          background: #f1f5f9; border: none; border-radius: 8px;
          padding: 10px 20px; font-size: 14px; font-weight: 500;
          color: #374151; cursor: pointer;
        }
        .faq-modal-cancel:hover { background: #e5e7eb; }
        .faq-modal-save {
          background: #2563eb; color: #fff; border: none;
          border-radius: 8px; padding: 10px 24px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.15s;
        }
        .faq-modal-save:hover:not(:disabled) { background: #1d4ed8; }
        .faq-modal-save:disabled { opacity: 0.6; cursor: default; }
      `}</style>
    </>
  );
}

FaqsDashboard.getLayout = (page) => (
  <DashboardLayout active="Faq's">{page}</DashboardLayout>
);
