import React, { useState, useEffect, useCallback } from "react";

const API = (process.env.REACT_APP_API_URL || "http://10.145.35.253:5000").replace(/\/api$/, "");

const SECTION_TABS = ["hero", "intro", "stats", "services", "industries", "process", "whyus", "cta"];

export default function AdminServiceHub() {
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState("");
  const [activeSection, setActive]  = useState("hero");

  // ⭐ Per-card upload state
  const [uploadStatus, setUploadStatus] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/servicehub`);
      const json = await res.json();
      setData(json);
    } catch { showToast("Failed to load", true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showToast = (msg, isError = false) => {
    setToast(isError ? `❌ ${msg}` : `✅ ${msg}`);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/servicehub`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setData(json);
      showToast("Saved successfully");
    } catch { showToast("Save failed", true); }
    finally { setSaving(false); }
  };

  // ⭐ Reset to defaults
  const handleReset = async () => {
    if (!window.confirm("Reset Service Hub to original defaults? This will overwrite all current content and cannot be undone.")) return;
    setSaving(true);
    try {
      const res  = await fetch(`${API}/api/servicehub/reset`, { method: "POST" });
      const json = await res.json();
      setData(json);
      showToast("🔄 Reset to defaults successfully");
    } catch { showToast("Reset failed", true); }
    finally { setSaving(false); }
  };

  // ── Generic field setter ───────────────────────────────────────────────────
  const set = (key, val) => setData(p => ({ ...p, [key]: val }));

  // ── Array item setters ────────────────────────────────────────────────────
  const setArr = (key, idx, field, val) =>
    setData(p => { const a = [...(p[key]||[])]; a[idx] = { ...a[idx], [field]: val }; return { ...p, [key]: a }; });

  const addItem = (key, template) =>
    setData(p => ({ ...p, [key]: [...(p[key]||[]), template] }));

  const removeItem = (key, idx) =>
    setData(p => ({ ...p, [key]: (p[key]||[]).filter((_,i) => i !== idx) }));

  // ── String array helpers ──────────────────────────────────────────────────
  const setStrArr = (key, idx, val) =>
    setData(p => { const a = [...(p[key]||[])]; a[idx] = val; return { ...p, [key]: a }; });

  const addStr = (key, val = "") =>
    setData(p => ({ ...p, [key]: [...(p[key]||[]), val] }));

  const removeStr = (key, idx) =>
    setData(p => ({ ...p, [key]: (p[key]||[]).filter((_,i) => i !== idx) }));

  // ── Service card sub-array helpers ────────────────────────────────────────
  const setSvcSubArr = (svcIdx, subKey, itemIdx, val) =>
    setData(p => {
      const svcs = [...(p.services||[])];
      const sub  = [...(svcs[svcIdx][subKey]||[])];
      sub[itemIdx] = val;
      svcs[svcIdx] = { ...svcs[svcIdx], [subKey]: sub };
      return { ...p, services: svcs };
    });

  const addSvcSubItem = (svcIdx, subKey) =>
    setData(p => {
      const svcs = [...(p.services||[])];
      svcs[svcIdx] = { ...svcs[svcIdx], [subKey]: [...(svcs[svcIdx][subKey]||[]), ""] };
      return { ...p, services: svcs };
    });

  const removeSvcSubItem = (svcIdx, subKey, itemIdx) =>
    setData(p => {
      const svcs = [...(p.services||[])];
      svcs[svcIdx] = { ...svcs[svcIdx], [subKey]: (svcs[svcIdx][subKey]||[]).filter((_,i) => i !== itemIdx) };
      return { ...p, services: svcs };
    });

  // ⭐ Upload card image to Cloudinary via backend
  const handleCardImageUpload = async (cardIndex, file) => {
    if (!file) return;
    setUploadStatus(prev => ({ ...prev, [cardIndex]: "uploading" }));
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch(`${API}/api/servicehub/upload-card-image/${cardIndex}`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(p => {
        const svcs = [...(p.services||[])];
        svcs[cardIndex] = { ...svcs[cardIndex], img: json.url };
        return { ...p, services: svcs };
      });
      setUploadStatus(prev => ({ ...prev, [cardIndex]: "done" }));
      showToast(`Card ${cardIndex + 1} image uploaded`);
      setTimeout(() => setUploadStatus(prev => ({ ...prev, [cardIndex]: "idle" })), 3000);
    } catch {
      setUploadStatus(prev => ({ ...prev, [cardIndex]: "error" }));
      showToast(`Image upload failed for card ${cardIndex + 1}`, true);
      setTimeout(() => setUploadStatus(prev => ({ ...prev, [cardIndex]: "idle" })), 3000);
    }
  };

  // ── Resolve image for preview ─────────────────────────────────────────────
  const resolveImg = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${process.env.PUBLIC_URL || ""}${img}`;
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    wrap:      { padding: 24, maxWidth: 900, fontFamily: "sans-serif" },
    secBar:    { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20,
                 borderBottom: "2px solid #eee", paddingBottom: 12 },
    secBtn:    (a) => ({ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                         background: a ? "#f59e0b" : "transparent",
                         color: a ? "#fff" : "#555", fontWeight: 600, fontSize: 13 }),
    card:      { background: "#fff", borderRadius: 12, padding: 20, marginBottom: 14,
                 boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
    label:     { display: "block", fontSize: 11, fontWeight: 700, color: "#555",
                 marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" },
    input:     { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd",
                 fontSize: 14, boxSizing: "border-box", marginBottom: 12 },
    textarea:  { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd",
                 fontSize: 14, boxSizing: "border-box", marginBottom: 12,
                 minHeight: 80, resize: "vertical" },
    row2:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    itemCard:  { background: "#f8f9fc", borderRadius: 8, padding: 14, marginBottom: 10,
                 border: "1px solid #e5e7eb" },
    addBtn:    { padding: "8px 16px", background: "#1a2540", color: "#fff", border: "none",
                 borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, marginTop: 4 },
    delBtn:    { padding: "5px 9px", background: "#fee2e2", color: "#dc2626", border: "none",
                 borderRadius: 6, cursor: "pointer", fontSize: 12, flexShrink: 0 },
    saveBtn:   { padding: "12px 32px", background: "#f59e0b", color: "#fff", border: "none",
                 borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15 },
    resetBtn:  { padding: "12px 24px", background: "#f8f9fc", color: "#555", border: "1px solid #ddd",
                 borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 },
    toast:     { position: "fixed", bottom: 24, right: 24, background: "#1a2540", color: "#fff",
                 padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999 },
    inlineRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },
    featChk:   { display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
                 fontSize: 14, fontWeight: 600, color: "#1a2540" },
    imgBox:    { border: "2px dashed #ddd", borderRadius: 10, padding: 14, marginBottom: 12,
                 background: "#fafafa" },
    imgPreview:{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8,
                 marginBottom: 8, display: "block" },
    uploadBtn: { display: "inline-block", padding: "8px 16px", background: "#eef0f5",
                 borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                 border: "1px solid #ddd", color: "#333" },
    uploadBtnUploading: { display: "inline-block", padding: "8px 16px", background: "#fef3c7",
                          borderRadius: 8, fontSize: 13, fontWeight: 600,
                          border: "1px solid #fde68a", color: "#92400e" },
    uploadBtnDone: { display: "inline-block", padding: "8px 16px", background: "#dcfce7",
                     borderRadius: 8, fontSize: 13, fontWeight: 600,
                     border: "1px solid #bbf7d0", color: "#166534" },
  };

  if (loading || !data) return <div style={s.wrap}><p>⏳ Loading Service Hub CMS...</p></div>;

  return (
    <div style={s.wrap}>
      {toast && <div style={s.toast}>{toast}</div>}

      <h2 style={{ margin: "0 0 4px", color: "#1a2540" }}>🌐 Service Hub Page CMS</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
        Edit every section of the /services page. Changes only go live after clicking Save.
      </p>

      {/* ── Section tabs ── */}
      <div style={s.secBar}>
        {SECTION_TABS.map(t => (
          <button key={t} style={s.secBtn(activeSection === t)} onClick={() => setActive(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ════════ HERO ════════ */}
      {activeSection === "hero" && (
        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Hero Section</h3>
          <label style={s.label}>Hero Title (H1)</label>
          <input style={s.input} value={data.heroTitle||""} onChange={e => set("heroTitle", e.target.value)} />
          <label style={s.label}>Hero Subtitle Paragraph</label>
          <textarea style={s.textarea} value={data.heroSubtitle||""} onChange={e => set("heroSubtitle", e.target.value)} />
          <div style={s.row2}>
            <div>
              <label style={s.label}>Primary Button Text</label>
              <input style={s.input} value={data.heroBtnPrimary||""} onChange={e => set("heroBtnPrimary", e.target.value)} />
            </div>
            <div>
              <label style={s.label}>Secondary Button Text</label>
              <input style={s.input} value={data.heroBtnSecondary||""} onChange={e => set("heroBtnSecondary", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* ════════ INTRO ════════ */}
      {activeSection === "intro" && (
        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Intro Section</h3>
          <label style={s.label}>Title</label>
          <input style={s.input} value={data.introTitle||""} onChange={e => set("introTitle", e.target.value)} />
          <label style={s.label}>Paragraph</label>
          <textarea style={s.textarea} value={data.introPara||""} onChange={e => set("introPara", e.target.value)} />
        </div>
      )}

      {/* ════════ STATS ════════ */}
      {activeSection === "stats" && (
        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Stats Counter</h3>
          <div style={s.row2}>
            <div>
              <label style={s.label}>Years Experience Target</label>
              <input style={s.input} type="number" value={data.statExp||0} onChange={e => set("statExp", Number(e.target.value))} />
            </div>
            <div>
              <label style={s.label}>Projects Delivered Target</label>
              <input style={s.input} type="number" value={data.statProjects||0} onChange={e => set("statProjects", Number(e.target.value))} />
            </div>
          </div>
          <label style={s.label}>Blocks Supplied Target</label>
          <input style={s.input} type="number" value={data.statBlocks||0} onChange={e => set("statBlocks", Number(e.target.value))} />
        </div>
      )}

      {/* ════════ SERVICES ════════ */}
      {activeSection === "services" && (
        <div>
          <div style={{ ...s.card, background: "#fffbeb", border: "1px solid #fde68a" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#92400e" }}>
              ⭐ Mark exactly <strong>one</strong> card as Featured — it shows in the "Most Popular" highlight.<br />
              📸 Upload a new image per card using the upload button, or type a local path e.g. <code>/earthmovers.png</code>
            </p>
          </div>

          {(data.services||[]).map((svc, si) => (
            <div key={si} style={{ ...s.card, border: svc.featured ? "2px solid #f59e0b" : "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h4 style={{ margin: 0, color: "#1a2540" }}>Card {si + 1}: {svc.title || "Untitled"}</h4>
                <button style={s.delBtn} onClick={() => removeItem("services", si)}>✕ Remove</button>
              </div>

              <div style={s.row2}>
                <div>
                  <label style={s.label}>Title</label>
                  <input style={s.input} value={svc.title||""} onChange={e => setArr("services", si, "title", e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>Path (route)</label>
                  <input style={s.input} value={svc.path||""} onChange={e => setArr("services", si, "path", e.target.value)} placeholder="/services/rmc" />
                </div>
              </div>

              {/* ⭐ IMAGE UPLOAD SECTION */}
              <label style={s.label}>Card Image</label>
              <div style={s.imgBox}>
                {svc.img && resolveImg(svc.img) && (
                  <img
                    src={resolveImg(svc.img)}
                    alt={svc.title}
                    style={s.imgPreview}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <label style={
                    uploadStatus[si] === "uploading" ? s.uploadBtnUploading :
                    uploadStatus[si] === "done"      ? s.uploadBtnDone :
                    s.uploadBtn
                  }>
                    {uploadStatus[si] === "uploading" ? "⏳ Uploading..." :
                     uploadStatus[si] === "done"      ? "✅ Uploaded!" :
                     uploadStatus[si] === "error"     ? "❌ Failed — try again" :
                     "📤 Upload New Image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: "none" }}
                      disabled={uploadStatus[si] === "uploading"}
                      onChange={e => handleCardImageUpload(si, e.target.files[0])}
                    />
                  </label>
                  <span style={{ fontSize: 12, color: "#999" }}>or type path below</span>
                </div>
                <input
                  style={{ ...s.input, marginTop: 10, marginBottom: 0, fontSize: 12 }}
                  value={svc.img||""}
                  onChange={e => setArr("services", si, "img", e.target.value)}
                  placeholder="/earthmovers.png or https://res.cloudinary.com/..."
                />
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>
                  Upload replaces automatically. Manual path works for local /public images.
                </p>
              </div>

              <label style={s.label}>Description</label>
              <textarea style={{ ...s.textarea, minHeight: 60 }} value={svc.desc||""} onChange={e => setArr("services", si, "desc", e.target.value)} />

              <label style={s.label}>Delivery Timeline</label>
              <input style={s.input} value={svc.deliveryTimeline||""} onChange={e => setArr("services", si, "deliveryTimeline", e.target.value)} placeholder="1–2 Days" />

              <label style={s.featChk}>
                <input type="checkbox" checked={!!svc.featured}
                  onChange={e => setArr("services", si, "featured", e.target.checked)} />
                ⭐ Featured (shows in "Most Popular" highlight)
              </label>

              {/* Feature Tags */}
              <label style={s.label}>Feature Tags</label>
              {(svc.features||[]).map((f, fi) => (
                <div key={fi} style={s.inlineRow}>
                  <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={f}
                    onChange={e => setSvcSubArr(si, "features", fi, e.target.value)} />
                  <button style={s.delBtn} onClick={() => removeSvcSubItem(si, "features", fi)}>✕</button>
                </div>
              ))}
              <button style={{ ...s.addBtn, marginBottom: 14 }} onClick={() => addSvcSubItem(si, "features")}>+ Add Tag</button>

              {/* Hover Benefits */}
              <label style={s.label}>Hover Benefits</label>
              {(svc.hoverBenefits||[]).map((b, bi) => (
                <div key={bi} style={s.inlineRow}>
                  <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={b}
                    onChange={e => setSvcSubArr(si, "hoverBenefits", bi, e.target.value)} />
                  <button style={s.delBtn} onClick={() => removeSvcSubItem(si, "hoverBenefits", bi)}>✕</button>
                </div>
              ))}
              <button style={{ ...s.addBtn, marginBottom: 14 }} onClick={() => addSvcSubItem(si, "hoverBenefits")}>+ Add Benefit</button>

              {/* Industries */}
              <label style={s.label}>Industries</label>
              {(svc.industries||[]).map((ind, ii) => (
                <div key={ii} style={s.inlineRow}>
                  <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={ind}
                    onChange={e => setSvcSubArr(si, "industries", ii, e.target.value)} />
                  <button style={s.delBtn} onClick={() => removeSvcSubItem(si, "industries", ii)}>✕</button>
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addSvcSubItem(si, "industries")}>+ Add Industry</button>
            </div>
          ))}

          <button style={s.addBtn} onClick={() => addItem("services", {
            title: "", img: "", path: "", desc: "", features: [], hoverBenefits: [],
            deliveryTimeline: "", industries: [], featured: false,
          })}>+ Add Service Card</button>
        </div>
      )}

      {/* ════════ INDUSTRIES ════════ */}
      {activeSection === "industries" && (
        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Industries We Serve</h3>
          {(data.industries||[]).map((ind, i) => (
            <div key={i} style={s.itemCard}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={s.row2}>
                    <div>
                      <label style={s.label}>Icon (emoji)</label>
                      <input style={s.input} value={ind.icon||""} onChange={e => setArr("industries", i, "icon", e.target.value)} placeholder="🏠" />
                    </div>
                    <div>
                      <label style={s.label}>Label</label>
                      <input style={s.input} value={ind.label||""} onChange={e => setArr("industries", i, "label", e.target.value)} placeholder="Residential" />
                    </div>
                  </div>
                  <label style={s.label}>Description</label>
                  <input style={s.input} value={ind.desc||""} onChange={e => setArr("industries", i, "desc", e.target.value)} placeholder="Villas, apartments & housing complexes" />
                </div>
                <button style={{ ...s.delBtn, marginTop: 22 }} onClick={() => removeItem("industries", i)}>✕</button>
              </div>
            </div>
          ))}
          <button style={s.addBtn} onClick={() => addItem("industries", { icon: "", label: "", desc: "" })}>
            + Add Industry
          </button>
        </div>
      )}

      {/* ════════ PROCESS STEPS ════════ */}
      {activeSection === "process" && (
        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Process Timeline Steps</h3>
          {(data.processSteps||[]).map((step, i) => (
            <div key={i} style={s.itemCard}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={s.row2}>
                    <div>
                      <label style={s.label}>Icon (emoji)</label>
                      <input style={s.input} value={step.icon||""} onChange={e => setArr("processSteps", i, "icon", e.target.value)} placeholder="📞" />
                    </div>
                    <div>
                      <label style={s.label}>Title</label>
                      <input style={s.input} value={step.title||""} onChange={e => setArr("processSteps", i, "title", e.target.value)} placeholder="Consultation" />
                    </div>
                  </div>
                  <label style={s.label}>Description</label>
                  <input style={s.input} value={step.desc||""} onChange={e => setArr("processSteps", i, "desc", e.target.value)} placeholder="Understand your project requirements" />
                </div>
                <button style={{ ...s.delBtn, marginTop: 22 }} onClick={() => removeItem("processSteps", i)}>✕</button>
              </div>
            </div>
          ))}
          <button style={s.addBtn} onClick={() => addItem("processSteps", { icon: "", title: "", desc: "" })}>
            + Add Step
          </button>
        </div>
      )}

      {/* ════════ WHY US ════════ */}
      {activeSection === "whyus" && (
        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Why Choose Us Section</h3>
          <label style={s.label}>Title</label>
          <input style={s.input} value={data.whyTitle||""} onChange={e => set("whyTitle", e.target.value)} />
          <label style={s.label}>Paragraph</label>
          <textarea style={s.textarea} value={data.whyPara||""} onChange={e => set("whyPara", e.target.value)} />
          <label style={s.label}>Bullet Points</label>
          {(data.whyPoints||[]).map((pt, i) => (
            <div key={i} style={s.inlineRow}>
              <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={pt}
                onChange={e => setStrArr("whyPoints", i, e.target.value)} />
              <button style={s.delBtn} onClick={() => removeStr("whyPoints", i)}>✕</button>
            </div>
          ))}
          <button style={s.addBtn} onClick={() => addStr("whyPoints", "✔ ")}>+ Add Point</button>
        </div>
      )}

      {/* ════════ CTA ════════ */}
      {activeSection === "cta" && (
        <div style={s.card}>
          <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Call To Action Section</h3>
          <label style={s.label}>Title</label>
          <input style={s.input} value={data.ctaTitle||""} onChange={e => set("ctaTitle", e.target.value)} />
          <label style={s.label}>Paragraph</label>
          <textarea style={s.textarea} value={data.ctaPara||""} onChange={e => set("ctaPara", e.target.value)} />
          <label style={s.label}>Button Text</label>
          <input style={s.input} value={data.ctaBtn||""} onChange={e => set("ctaBtn", e.target.value)} />
        </div>
      )}

      {/* ── Save + Reset buttons ── */}
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", alignItems: "center" }}>
        <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? "⏳ Saving..." : "💾 Save Service Hub"}
        </button>
        <button style={s.resetBtn} onClick={handleReset} disabled={saving}>
          🔄 Reset to Defaults
        </button>
      </div>

      {/* ── Info note ── */}
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8,
                    padding: "10px 14px", marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 12, color: "#92400e" }}>
          ℹ️ <strong>Save</strong> pushes all changes to the live /services page instantly.
          <strong> Reset to Defaults</strong> restores the original hardcoded content — use carefully.
          Make sure you have also replaced <code>ServiceHub.js</code> (frontend) with the CMS-integrated
          version so the page fetches from <code>/api/servicehub</code>.
        </p>
      </div>
    </div>
  );
}