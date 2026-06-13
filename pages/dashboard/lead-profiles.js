import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import DashboardLayout from "../../components/backend/DashboardLayout";

/* ── helpers ── */
const inr = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");

function fmtLabel(date) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  } catch { return ""; }
}

function initials(name) {
  const p = (name || "").trim().split(/\s+/);
  return p.length >= 2 ? p[0][0].toUpperCase() + p[1][0].toUpperCase() : (name || "?")[0].toUpperCase();
}

const AV_COLORS = ["#7C3AED", "#2563EB", "#0891B2", "#059669", "#D97706", "#BE123C"];
function avatarColor(name) {
  let h = 0;
  for (const c of (name || "")) h = (h * 31 + c.charCodeAt(0)) | 0;
  return AV_COLORS[Math.abs(h) % AV_COLORS.length];
}

function gradeOf(q) {
  if (!q || !(q.cost > 0)) return null;
  const p = (q.margin / q.cost) * 100;
  if (p > 30) return "A";
  if (p > 20) return "B+";
  if (p >= 16) return "B";
  return "C";
}

function calcGrand(inv) {
  const sub  = (inv?.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const cgst = sub * (parseFloat(inv?.cgstPct) || 0) / 100;
  const sgst = sub * (parseFloat(inv?.sgstPct) || 0) / 100;
  const igst = sub * (parseFloat(inv?.igstPct) || 0) / 100;
  const after = sub + cgst + sgst + igst;
  const tcs  = after * (parseFloat(inv?.tcsPct) || 0) / 100;
  return after + tcs;
}

function buildJourney(lead, quotations, invoices, vouchers) {
  const ev = [];

  /* 1. Lead captured */
  ev.push({
    date: lead.createdAt,
    title: "Lead captured" + (lead.formType ? ` from ${lead.formType}` : ""),
    desc: [
      lead.source  && lead.medium ? `${lead.source} · ${lead.medium}` : lead.source || "",
      lead.campaign ? `Campaign: ${lead.campaign}` : "",
    ].filter(Boolean).join(" · "),
    dot: "#3b82f6",
  });

  /* 2. Connect attempts */
  if (lead.connects > 0) {
    ev.push({
      date: lead.contactedAt || lead.createdAt,
      title: `${lead.connects} connect attempt${lead.connects > 1 ? "s" : ""} logged`,
      desc: lead.assignedTo?.name ? `By ${lead.assignedTo.name}` : "",
      dot: "#3b82f6",
    });
  }

  /* 3. Score */
  if (lead.score?.val > 0) {
    const v = lead.score.val;
    const lbl = v >= 8 ? "Hot" : v >= 5 ? "Warm" : "Cold";
    ev.push({
      date: lead.createdAt,
      title: `Lead scored ${v}/10 (${lbl})`,
      desc: `Auto-scored from ${(lead.score.ans || []).length || 5} qualification questions`,
      dot: "#3b82f6",
    });
  }

  /* 4. Marked Qualified */
  if (["Qualified", "Not Qualified"].includes(lead.status) || quotations.length > 0) {
    if (lead.status === "Qualified" || quotations.length > 0) {
      ev.push({
        date: lead.createdAt,
        title: "Marked Qualified",
        desc: "BRR unlocked for collection",
        dot: "#22c55e",
      });
    }
  }

  /* 5. BRR collected */
  if (lead.brr) {
    const b = lead.brr;
    ev.push({
      date: b.collectedOn ? b.collectedOn : lead.createdAt,
      title: "BRR collected",
      desc: [b.duration, b.mealPlan, b.hotelCategory, b.budgetRange ? `Budget ${b.budgetRange}` : ""].filter(Boolean).join(" · "),
      dot: "#22c55e",
    });
  }

  /* 6. Quotation events */
  for (const q of quotations) {
    const sell = q.newSellingPrice > 0 ? q.newSellingPrice : ((q.cost || 0) + (q.margin || 0));
    const g = gradeOf(q);

    ev.push({
      date: q.createdAt,
      title: `Quotation ${q.quotationNo} created · ${inr(sell)}`,
      desc: [q.type, q.pkgMode, g && q.cost > 0 ? `Margin ${((q.margin / q.cost) * 100).toFixed(1)}% (${g} Grade)` : ""].filter(Boolean).join(" · "),
      dot: "#22c55e",
    });

    /* versions */
    (q.versions || []).forEach(ver => {
      ev.push({
        date: ver.date || q.createdAt,
        title: `Quote revised to v${ver.v}`,
        desc: ver.note || "",
        dot: "#3b82f6",
      });
    });

    /* follow-ups */
    (q.followups || []).forEach((f, i) => {
      ev.push({
        date: f.date || q.createdAt,
        title: `Follow-up #${i + 1}`,
        desc: f.note || "",
        dot: "#3b82f6",
      });
    });

    /* Won */
    if (q.status === "Won") {
      ev.push({
        date: q.updatedAt || q.createdAt,
        title: "Deal WON 🏆",
        desc: `Final at ${inr(sell)}`,
        dot: "#22c55e",
      });
    }
  }

  /* 7. Invoice & payments */
  for (const inv of invoices) {
    const grand = calcGrand(inv);
    ev.push({
      date: inv.createdAt,
      title: `Invoice ${inv.invoiceNo} raised · ${inr(grand)}`,
      desc: "Quote auto-marked Won",
      dot: "#22c55e",
    });
    (inv.payments || []).forEach((p, i) => {
      ev.push({
        date: p.date ? p.date + "T00:00:00" : inv.createdAt,
        title: `Payment part ${i + 1} · ${inr(p.amount)}`,
        desc: p.mode || "",
        dot: "#22c55e",
      });
    });
  }

  /* 8. Vouchers */
  for (const v of vouchers) {
    ev.push({
      date: v.createdAt,
      title: `Voucher created · Trip ${v.tripId || v.voucherNo || ""}`,
      desc: v.travelDate ? `Journey ${v.travelDate}` : "",
      dot: "#22c55e",
    });
  }

  return ev.filter(e => e.date).sort((a, b) => new Date(a.date) - new Date(b.date));
}

const STATUS_STYLE = {
  "Qualified":     { bg: "#DCFCE7", c: "#15803D" },
  "Not Qualified": { bg: "#F1F5F9", c: "#94A3B8" },
  "New":           { bg: "#F1F5F9", c: "#475569" },
  "Contacted":     { bg: "#EFF4FF", c: "#2563EB" },
  "Follow Up":     { bg: "#FEF3C7", c: "#B45309" },
  "Not Interested":{ bg: "#FEE2E2", c: "#BE123C" },
  "No Answer":     { bg: "#FEF3C7", c: "#92400E" },
};

export default function LeadProfilesPage() {
  const [leads,      setLeads]      = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [invoices,   setInvoices]   = useState([]);
  const [vouchers,   setVouchers]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [search,     setSearch]     = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/leads").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/quotations").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/invoices").then(r => r.json()).catch(() => []),
      fetch("/api/dashboard/vouchers").then(r => r.json()).catch(() => []),
    ]).then(([l, q, inv, v]) => {
      const ll = Array.isArray(l) ? l : [];
      setLeads(ll);
      setQuotations(Array.isArray(q) ? q : []);
      setInvoices(Array.isArray(inv) ? inv : []);
      setVouchers(Array.isArray(v) ? v : []);
      if (ll.length > 0) setSelectedId(String(ll[0]._id));
    }).finally(() => setLoading(false));
  }, []);

  /* Assign display IDs in createdAt-ascending order */
  const leadsWithId = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((l, i) => ({ ...l, leadDisplayId: `TWO-L-${1001 + i}` }));
  }, [leads]);

  const filteredLeads = useMemo(() => {
    if (!search) return leadsWithId;
    const q = search.toLowerCase();
    return leadsWithId.filter(l =>
      (l.name || "").toLowerCase().includes(q) ||
      (l.destination || "").toLowerCase().includes(q) ||
      (l.leadDisplayId || "").toLowerCase().includes(q)
    );
  }, [leadsWithId, search]);

  const selected = useMemo(() => leadsWithId.find(l => String(l._id) === selectedId) || null, [leadsWithId, selectedId]);

  const selectedQ   = useMemo(() => !selected ? [] : quotations.filter(q => String(q.leadId?._id || q.leadId) === String(selected._id)), [quotations, selected]);
  const selectedInv = useMemo(() => !selected ? [] : invoices.filter(inv => inv.leadId === String(selected._id)), [invoices, selected]);
  const selectedInvIds = useMemo(() => new Set(selectedInv.map(i => i.id || String(i._id))), [selectedInv]);
  const selectedV   = useMemo(() => vouchers.filter(v => selectedInvIds.has(v.invoiceId)), [vouchers, selectedInvIds]);

  const wonQ    = useMemo(() => selectedQ.find(q => q.status === "Won"), [selectedQ]);
  const selling = useMemo(() => !wonQ ? 0 : wonQ.newSellingPrice > 0 ? wonQ.newSellingPrice : (wonQ.cost + wonQ.margin), [wonQ]);
  const paid    = useMemo(() => selectedInv.reduce((s, inv) => s + (inv.payments || []).reduce((ps, p) => ps + (parseFloat(p.amount) || 0), 0), 0), [selectedInv]);
  const balance = useMemo(() => Math.max(0, selling - paid), [selling, paid]);
  const mpct    = useMemo(() => wonQ && wonQ.cost > 0 ? (wonQ.margin / wonQ.cost) * 100 : 0, [wonQ]);
  const fuCount = useMemo(() => selectedQ.reduce((s, q) => s + (q.followups || []).length, 0), [selectedQ]);
  const verCount= useMemo(() => selectedQ.reduce((s, q) => s + (q.versions  || []).length, 0), [selectedQ]);

  const journey = useMemo(() => !selected ? [] : buildJourney(selected, selectedQ, selectedInv, selectedV), [selected, selectedQ, selectedInv, selectedV]);

  return (
    <DashboardLayout active="Lead Profiles">
      <Head><title>Lead Profiles — Tourwatchout</title></Head>

      {/* Page header */}
      <div style={{ padding: "14px 24px 10px", borderBottom: "1px solid #E4E9F2", background: "#fff" }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#0F1B33" }}>Lead Profiles</div>
        <div style={{ fontSize: 12, color: "#6B7A99", marginTop: 1 }}>The full journey of every lead, from first click to voucher</div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 96px)", overflow: "hidden" }}>

        {/* ──── LEFT: Lead list ──── */}
        <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid #E4E9F2", display: "flex", flexDirection: "column", background: "#fff" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9" }}>
            <input
              placeholder="Search leads…"
              style={{ width: "100%", padding: "7px 10px", border: "1px solid #E4E9F2", borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "inherit", color: "#374151", background: "#F8FAFD", boxSizing: "border-box" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading && <div style={{ padding: "20px 14px", color: "#94A3B8", fontSize: 13 }}>Loading leads…</div>}
            {!loading && filteredLeads.length === 0 && (
              <div style={{ padding: "20px 14px", color: "#94A3B8", fontSize: 13 }}>No leads found</div>
            )}
            {filteredLeads.map(l => {
              const isActive = String(l._id) === selectedId;
              const isHot    = (l.score?.val || 0) >= 7;
              const sc = STATUS_STYLE[l.status] || STATUS_STYLE["New"];
              return (
                <div
                  key={String(l._id)}
                  onClick={() => setSelectedId(String(l._id))}
                  style={{
                    padding: "11px 14px", cursor: "pointer",
                    borderBottom: "1px solid #F1F5F9",
                    borderLeft: isActive ? "3px solid #2563EB" : "3px solid transparent",
                    background: isActive ? "#EFF4FF" : "transparent",
                    transition: "background .12s",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, color: isActive ? "#1D4ED8" : "#0F1B33", marginBottom: 2 }}>
                    {l.name}{isHot && <span style={{ marginLeft: 4, fontSize: 12 }}>🔥</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7A99", display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600 }}>{l.leadDisplayId}</span>
                    {l.destination && <><span>·</span><span>{l.destination}</span></>}
                    <span>·</span>
                    <span style={{ color: sc.c, fontWeight: 600 }}>{l.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ──── RIGHT: Profile detail ──── */}
        <div style={{ flex: 1, overflowY: "auto", background: "#F3F5FA" }}>
          {!selected ? (
            <div style={{ padding: 50, textAlign: "center", color: "#94A3B8", fontSize: 14, marginTop: 40 }}>
              Select a lead from the list to view their full journey
            </div>
          ) : (
            <div style={{ padding: "18px 22px 60px" }}>

              {/* Lead header */}
              <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, padding: "16px 20px", marginBottom: 14, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                {/* Avatar */}
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: avatarColor(selected.name),
                  color: "#fff", fontWeight: 900, fontSize: 17,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {initials(selected.name)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 20, color: "#0F1B33", marginBottom: 3 }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7A99", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#374151" }}>{selected.leadDisplayId}</span>
                    {selected.phone && <><span>·</span><span>{selected.phone}</span></>}
                    {selected.email && <><span>·</span><span>{selected.email}</span></>}
                    {selected.assignedTo?.name && <><span>·</span><span>handled by <b style={{ color: "#374151" }}>{selected.assignedTo.name}</b></span></>}
                  </div>
                </div>

                {/* Status + Score */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {(() => {
                    const sc = STATUS_STYLE[selected.status] || STATUS_STYLE["New"];
                    return (
                      <span style={{ padding: "5px 13px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.c, display: "flex", alignItems: "center", gap: 5 }}>
                        {selected.status === "Qualified" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />}
                        {selected.status}
                      </span>
                    );
                  })()}
                  {selected.score?.val > 0 && (
                    <span style={{ fontWeight: 800, fontSize: 15, color: "#0F1B33" }}>
                      {selected.score.val}/10
                    </span>
                  )}
                </div>
              </div>

              {/* Summary chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 18 }}>
                <Chip label="QUOTED VALUE"   value={inr(selling)} />
                <Chip label="PAID TILL DATE" value={inr(paid)}    accent="#15803D" />
                <Chip label="BALANCE DUE"    value={inr(balance)} accent={balance > 0 ? "#BE123C" : "#15803D"} />
                <Chip label="MARGIN"
                  value={wonQ && wonQ.cost > 0 ? `${mpct.toFixed(1)}% · ${gradeOf(wonQ)}` : "—"}
                  accent={wonQ && wonQ.cost > 0 ? "#15803D" : undefined}
                />
                <Chip label="FOLLOW-UPS"     value={fuCount}  />
                <Chip label="QUOTE VERSIONS" value={verCount} />
              </div>

              {/* Complete Journey */}
              <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#0F1B33" }}>Complete Journey</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic" }}>First click to voucher, every event auto-logged</div>
                </div>

                {journey.length === 0 ? (
                  <div style={{ color: "#94A3B8", fontSize: 13, padding: "10px 0" }}>No journey events yet for this lead</div>
                ) : (
                  <div style={{ position: "relative", paddingLeft: 8 }}>
                    {/* Vertical timeline line */}
                    <div style={{ position: "absolute", left: 18, top: 6, bottom: 20, width: 2, background: "#E4E9F2", borderRadius: 2 }} />

                    {journey.map((ev, i) => (
                      <div key={i} style={{ display: "flex", gap: 16, marginBottom: 22 }}>
                        {/* Dot */}
                        <div style={{ flexShrink: 0, width: 22, display: "flex", justifyContent: "center", zIndex: 1, marginTop: 2 }}>
                          <div style={{
                            width: 14, height: 14, borderRadius: "50%",
                            background: ev.dot,
                            border: "2.5px solid #fff",
                            boxShadow: `0 0 0 2.5px ${ev.dot}33`,
                          }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 3 }}>
                            {fmtLabel(ev.date)}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0F1B33", marginBottom: ev.desc ? 2 : 0 }}>
                            {ev.title}
                          </div>
                          {ev.desc && (
                            <div style={{ fontSize: 12, color: "#6B7A99", lineHeight: 1.5 }}>{ev.desc}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Chip({ label, value, accent }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E4E9F2", borderRadius: 10, padding: "11px 14px", boxShadow: "0 1px 3px rgba(0,0,0,.03)" }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: "#6B7A99", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: accent || "#0F1B33" }}>{value}</div>
    </div>
  );
}
