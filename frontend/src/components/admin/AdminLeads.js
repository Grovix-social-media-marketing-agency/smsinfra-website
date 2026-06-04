import React, { useEffect, useState } from "react";

const API = (process.env.REACT_APP_API_URL || "https://smsinfra-website.onrender.com").replace(/\/api$/, "");

export default function AdminLeads() {
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all"); // all | notify | consultation
  const [toast, setToast]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/leads`);
        const data = await res.json();
        setLeads(data);
      } catch { showToast("Failed to load leads"); }
      finally   { setLoading(false); }
    };
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/leads`);
      const data = await res.json();
      setLeads(data);
    } catch { showToast("Failed to load leads"); }
    finally   { setLoading(false); }
  };

  const markRead = async (id) => {
    await fetch(`${API}/api/leads/${id}/read`, { method: "PATCH" });
    setLeads(p => p.map(l => l._id === id ? { ...l, read: true } : l));
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await fetch(`${API}/api/leads/${id}`, { method: "DELETE" });
    setLeads(p => p.filter(l => l._id !== id));
    showToast("Deleted");
  };

  const filtered = leads.filter(l => filter === "all" ? true : l.type === filter);
  const unread   = leads.filter(l => !l.read).length;

  const s = {
    wrap:    { padding: 24, fontFamily: "sans-serif", maxWidth: 900 },
    header:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    badge:   { background: "#f59e0b", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 },
    filters: { display: "flex", gap: 8, marginBottom: 20 },
    fBtn:    (a) => ({ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                       background: a ? "#1a2540" : "#eef0f5", color: a ? "#fff" : "#555", fontWeight: 600, fontSize: 13 }),
    card:    (read) => ({ background: read ? "#fff" : "#fffbeb", border: `1px solid ${read ? "#e5e7eb" : "#fde68a"}`,
                          borderRadius: 10, padding: 16, marginBottom: 12,
                          borderLeft: `4px solid ${read ? "#e5e7eb" : "#f59e0b"}` }),
    row:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 },
    tag:     (t) => ({ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                       background: t === "notify" ? "#dbeafe" : "#d1fae5",
                       color: t === "notify" ? "#1e40af" : "#065f46" }),
    meta:    { fontSize: 12, color: "#999", marginTop: 4 },
    actions: { display: "flex", gap: 8, marginTop: 10 },
    readBtn: { padding: "4px 12px", background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe",
               borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 },
    delBtn:  { padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5",
               borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 },
    empty:   { textAlign: "center", padding: 40, color: "#999" },
    toast:   { position: "fixed", bottom: 24, right: 24, background: "#1a2540", color: "#fff",
               padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999 },
  };

  return (
    <div style={s.wrap}>
      {toast && <div style={s.toast}>{toast}</div>}

      <div style={s.header}>
        <div>
          <h2 style={{ margin: 0, color: "#1a2540" }}>
            🔔 Builder Leads
            {unread > 0 && <span style={{ ...s.badge, marginLeft: 10 }}>{unread} new</span>}
          </h2>
          <p style={{ color: "#666", fontSize: 14, margin: "4px 0 0" }}>
            Notify Me & Consultation requests from the Builders page
          </p>
        </div>
        <button onClick={fetchLeads} style={{ ...s.readBtn, fontSize: 13 }}>🔄 Refresh</button>
      </div>

      <div style={s.filters}>
        {[["all","All"], ["notify","Notify Me"], ["consultation","Consultation"]].map(([val, label]) => (
          <button key={val} style={s.fBtn(filter === val)} onClick={() => setFilter(val)}>
            {label} ({val === "all" ? leads.length : leads.filter(l => l.type === val).length})
          </button>
        ))}
      </div>

      {loading ? <p>⏳ Loading...</p> : filtered.length === 0 ? (
        <div style={s.empty}>
          <p style={{ fontSize: 40 }}>📭</p>
          <p>No leads yet</p>
        </div>
      ) : (
        filtered.map(lead => (
          <div key={lead._id} style={s.card(lead.read)}>
            <div style={s.row}>
              <div>
                <span style={s.tag(lead.type)}>
                  {lead.type === "notify" ? "🔔 Notify Me" : "📋 Consultation"}
                </span>
                {!lead.read && <span style={{ marginLeft: 8, fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>● NEW</span>}
                <div style={{ marginTop: 6 }}>
                  <strong style={{ fontSize: 15, color: "#1a2540" }}>{lead.name || "Website Visitor"}</strong>
                  <span style={{ marginLeft: 10, color: "#4b5563", fontSize: 14 }}>{lead.email}</span>
                </div>
                {lead.phone && lead.phone !== "—" && (
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>📞 {lead.phone}</div>
                )}
                {lead.projectType && lead.projectType !== "Not specified" && (
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>🏗 {lead.projectType}</div>
                )}
                {lead.message && lead.message !== "Early consultation request." && (
                  <div style={{ fontSize: 13, color: "#374151", marginTop: 4, fontStyle: "italic" }}>"{lead.message}"</div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={s.meta}>{new Date(lead.createdAt).toLocaleString("en-IN")}</div>
                <div style={{ ...s.meta, marginTop: 2 }}>via {lead.source}</div>
              </div>
            </div>
            <div style={s.actions}>
              {!lead.read && (
                <button style={s.readBtn} onClick={() => markRead(lead._id)}>✓ Mark Read</button>
              )}
              <a href={`mailto:${lead.email}`} style={{ ...s.readBtn, textDecoration: "none" }}>✉ Reply</a>
              <button style={s.delBtn} onClick={() => deleteLead(lead._id)}>✕ Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
