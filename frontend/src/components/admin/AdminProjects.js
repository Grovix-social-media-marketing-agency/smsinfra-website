// frontend/src/components/admin/AdminProjects.js
import React, { useState, useEffect, useCallback } from "react";

const API = (process.env.REACT_APP_API_URL || "http://10.145.35.253:5000").replace(/\/api$/, "");

const CATEGORIES = ["Residential", "Commercial", "Infrastructure", "Industrial", "Institutional"];
const STATUSES   = ["completed", "ongoing", "upcoming"];

const emptyProject = {
  title: "", category: "Residential", location: "", description: "",
  status: "completed", featured: false, year: "", images: [],
};

export default function AdminProjects() {
  const [projects, setProjects]     = useState([]);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyProject);
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState("");

  // ── fetchProjects wrapped in useCallback so useEffect dep is stable ────────
  const fetchProjects = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/api/projects`);
      const json = await res.json();
      setProjects(Array.isArray(json) ? json : json.projects || []);
    } catch { showToast("Failed to load projects", true); }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const showToast = (msg, isError = false) => {
    setToast(isError ? `❌ ${msg}` : `✅ ${msg}`);
    setTimeout(() => setToast(""), 3000);
  };

  const openNew   = () => { setForm(emptyProject); setEditing("new"); };
  const openEdit  = (p) => { setForm({ ...p }); setEditing(p._id); };
  const closeForm = () => { setEditing(null); setForm(emptyProject); };

  const handleField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        const res  = await fetch(`${API}/api/projects/upload`, { method: "POST", body: fd });
        const json = await res.json();
        uploaded.push({ url: json.url, publicId: json.publicId, caption: "" });
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...uploaded] }));
      showToast(`${uploaded.length} image(s) uploaded`);
    } catch { showToast("Image upload failed", true); }
    finally { setUploading(false); }
  };

  const removeImage = async (publicId) => {
    try {
      await fetch(`${API}/api/projects/upload/${encodeURIComponent(publicId)}`, { method: "DELETE" });
      setForm(prev => ({ ...prev, images: prev.images.filter(img => img.publicId !== publicId) }));
    } catch { showToast("Failed to remove image", true); }
  };

  // ── Save (create or update) ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) return showToast("Title is required", true);
    setSaving(true);
    try {
      const isNew = editing === "new";
      const url   = isNew ? `${API}/api/projects` : `${API}/api/projects/${editing}`;
      const res   = await fetch(url, {
        method:  isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast(isNew ? "Project created" : "Project updated");
      closeForm();
      fetchProjects();
    } catch { showToast("Save failed", true); }
    finally { setSaving(false); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await fetch(`${API}/api/projects/${id}`, { method: "DELETE" });
      showToast("Project deleted");
      fetchProjects();
    } catch { showToast("Delete failed", true); }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    wrap:      { padding: 24, fontFamily: "sans-serif", maxWidth: 1000 },
    header:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    newBtn:    { padding: "10px 22px", background: "#1a2540", color: "#fff",
                 border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 },
    grid:      { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
    projCard:  { background: "#fff", borderRadius: 12, overflow: "hidden",
                 boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
    projImg:   { width: "100%", height: 160, objectFit: "cover", background: "#e5e7eb",
                 display: "flex", alignItems: "center", justifyContent: "center",
                 color: "#999", fontSize: 13 },
    projBody:  { padding: 14 },
    projTitle: { fontWeight: 700, fontSize: 15, color: "#1a2540", marginBottom: 4 },
    projMeta:  { fontSize: 12, color: "#666", marginBottom: 10 },
    btnRow:    { display: "flex", gap: 8 },
    editBtn:   { flex: 1, padding: "7px 0", background: "#f59e0b", color: "#fff",
                 border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 13 },
    delBtn:    { padding: "7px 12px", background: "#fee2e2", color: "#dc2626",
                 border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13 },
    formWrap:  { background: "#fff", borderRadius: 12, padding: 24,
                 boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
    label:     { display: "block", fontSize: 12, fontWeight: 600, color: "#555",
                 marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" },
    input:     { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd",
                 fontSize: 14, boxSizing: "border-box", marginBottom: 14 },
    textarea:  { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd",
                 fontSize: 14, boxSizing: "border-box", marginBottom: 14,
                 minHeight: 80, resize: "vertical" },
    select:    { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd",
                 fontSize: 14, boxSizing: "border-box", marginBottom: 14, background: "#fff" },
    row2:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    saveBtn:   { padding: "12px 32px", background: "#f59e0b", color: "#fff",
                 border: "none", borderRadius: 10, cursor: "pointer",
                 fontWeight: 700, fontSize: 15, marginRight: 12 },
    cancelBtn: { padding: "12px 24px", background: "#eef0f5", color: "#333",
                 border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 },
    imgGrid:   { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 },
    imgThumb:  { position: "relative", width: 100, height: 80 },
    imgEl:     { width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 },
    imgDel:    { position: "absolute", top: 2, right: 2, background: "#dc2626",
                 color: "#fff", border: "none", borderRadius: "50%",
                 width: 20, height: 20, cursor: "pointer", fontSize: 11,
                 display: "flex", alignItems: "center", justifyContent: "center" },
    toast:     { position: "fixed", bottom: 24, right: 24, background: "#1a2540",
                 color: "#fff", padding: "12px 20px", borderRadius: 10,
                 fontWeight: 600, zIndex: 9999 },
    badge:     (status) => ({
                 display: "inline-block", padding: "2px 8px", borderRadius: 20,
                 fontSize: 11, fontWeight: 700,
                 background: status === "completed" ? "#dcfce7" : status === "ongoing" ? "#fef9c3" : "#e0e7ff",
                 color:      status === "completed" ? "#166534" : status === "ongoing" ? "#854d0e" : "#3730a3",
               }),
    featBadge: { display: "inline-block", padding: "2px 8px", borderRadius: 20,
                 fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e",
                 marginLeft: 6 },
  };

  return (
    <div style={s.wrap}>
      {toast && <div style={s.toast}>{toast}</div>}

      {/* ── LIST VIEW ── */}
      {!editing && (
        <>
          <div style={s.header}>
            <div>
              <h2 style={{ margin: 0, color: "#1a2540" }}>Projects</h2>
              <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
                {projects.length} project{projects.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button style={s.newBtn} onClick={openNew}>+ New Project</button>
          </div>

          <div style={s.grid}>
            {projects.map(p => (
              <div key={p._id} style={s.projCard}>
                {p.images?.[0]?.url
                  ? <img src={p.images[0].url} alt={p.title} style={{ ...s.projImg, display: "block" }} />
                  : <div style={s.projImg}>No image</div>
                }
                <div style={s.projBody}>
                  <div style={s.projTitle}>{p.title}</div>
                  <div style={s.projMeta}>
                    <span style={s.badge(p.status)}>{p.status}</span>
                    {p.featured && <span style={s.featBadge}>⭐ Featured</span>}
                    <span style={{ marginLeft: 8 }}>{p.category}</span>
                    {p.location && <span> · {p.location}</span>}
                  </div>
                  <div style={s.btnRow}>
                    <button style={s.editBtn} onClick={() => openEdit(p)}>Edit</button>
                    <button style={s.delBtn}  onClick={() => handleDelete(p._id)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p style={{ color: "#999", gridColumn: "1/-1" }}>No projects yet. Add one!</p>
            )}
          </div>
        </>
      )}

      {/* ── FORM VIEW ── */}
      {editing && (
        <div style={s.formWrap}>
          <h2 style={{ margin: "0 0 20px", color: "#1a2540" }}>
            {editing === "new" ? "New Project" : "Edit Project"}
          </h2>

          <label style={s.label}>Title *</label>
          <input style={s.input} value={form.title}
            onChange={e => handleField("title", e.target.value)} placeholder="Project name" />

          <div style={s.row2}>
            <div>
              <label style={s.label}>Category</label>
              <select style={s.select} value={form.category}
                onChange={e => handleField("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Status</label>
              <select style={s.select} value={form.status}
                onChange={e => handleField("status", e.target.value)}>
                {STATUSES.map(st => <option key={st}>{st}</option>)}
              </select>
            </div>
          </div>

          <div style={s.row2}>
            <div>
              <label style={s.label}>Location</label>
              <input style={s.input} value={form.location}
                onChange={e => handleField("location", e.target.value)} placeholder="e.g. Whitefield, Bangalore" />
            </div>
            <div>
              <label style={s.label}>Year</label>
              <input style={s.input} value={form.year}
                onChange={e => handleField("year", e.target.value)} placeholder="e.g. 2024" />
            </div>
          </div>

          <label style={s.label}>Description</label>
          <textarea style={s.textarea} value={form.description}
            onChange={e => handleField("description", e.target.value)}
            placeholder="Brief description of the project..." />

          <label style={{ ...s.label, marginBottom: 10 }}>
            <input type="checkbox" checked={form.featured}
              onChange={e => handleField("featured", e.target.checked)}
              style={{ marginRight: 8 }} />
            Mark as Featured
          </label>

          {/* Images */}
          <label style={{ ...s.label, marginTop: 8 }}>Images</label>
          <div style={s.imgGrid}>
            {(form.images || []).map(img => (
              <div key={img.publicId} style={s.imgThumb}>
                <img src={img.url} alt="" style={s.imgEl} />
                <button style={s.imgDel} onClick={() => removeImage(img.publicId)}>✕</button>
              </div>
            ))}
          </div>
          <label style={{
            display: "inline-block", padding: "8px 16px", background: "#eef0f5",
            borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            marginBottom: 20, border: "1px dashed #ccc",
          }}>
            {uploading ? "Uploading..." : "+ Upload Images"}
            <input type="file" multiple accept="image/*" style={{ display: "none" }}
              onChange={handleImageUpload} disabled={uploading} />
          </label>

          <div style={{ marginTop: 8 }}>
            <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : (editing === "new" ? "Create Project" : "Save Changes")}
            </button>
            <button style={s.cancelBtn} onClick={closeForm}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
