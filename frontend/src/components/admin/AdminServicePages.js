// frontend/src/components/admin/AdminServicePages.js
import React, { useState, useEffect, useCallback } from "react";

const API = (process.env.REACT_APP_API_URL || "http://10.145.35.253:5000").replace(/\/api$/, "");

const SERVICES = [
  { slug: "rmc",          label: "Ready Mix Concrete" },
  { slug: "aggregates",   label: "Aggregates" },
  { slug: "earthmovers",  label: "Earthmovers" },
  { slug: "msand",        label: "M Sand & P Sand" },
  { slug: "solid-blocks", label: "Solid Blocks" },
  { slug: "builders",     label: "Builders & Infra" },
];

const ALL_SECTIONS = [
  "hero", "trust", "about", "stats", "services",
  "process", "features", "applications", "comparison", "faqs", "cta"
];

const SECTION_LABELS = {
  hero: "Hero", trust: "Trust Strip", about: "About", stats: "Stats",
  services: "Services", process: "Process", features: "Features",
  applications: "Applications", comparison: "Comparison", faqs: "FAQs", cta: "CTA",
  launching: "Launching Soon",
};

// Only show sections that each service page actually uses
const SLUG_SECTIONS = {
  rmc:            ["hero", "trust", "about", "stats", "services", "process", "features", "applications", "faqs", "cta"],
  aggregates:     ["hero", "trust", "about", "services", "process", "features", "applications", "faqs", "cta"],
  earthmovers:    ["hero", "trust", "about", "stats", "services", "process", "features", "applications", "faqs", "cta"],
  msand:          ["hero", "trust", "about", "stats", "services", "process", "features", "applications", "comparison", "faqs", "cta"],
  "solid-blocks": ["hero", "trust", "about", "stats", "services", "features", "applications", "comparison", "faqs", "cta"],
  builders:       ["hero", "launching", "about", "services", "process", "features", "faqs", "cta"],
};

const DEFAULT_PROGRESS_BARS = [
  { label: "Infrastructure Setup", pct: 88 },
  { label: "Team Onboarding",      pct: 74 },
  { label: "Project Pipeline",     pct: 61 },
  { label: "Tech Integration",     pct: 45 },
];
const DEFAULT_MILESTONES = ["Planning", "Setup", "Launch", "Scale"];

export default function AdminServicePages() {
  const [activeSlug, setActiveSlug]       = useState("rmc");
  const [data, setData]                   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [saving, setSaving]               = useState(false);
  const [resetting, setResetting]         = useState(false);
  const [toast, setToast]                 = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [imgUploading, setImgUploading]   = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ── Seed builder-only fields that might be missing from MongoDB ──
  const seedBuilderDefaults = (json) => {
    if (!json.launchProgressBars || !json.launchProgressBars.length) {
      json.launchProgressBars = [...DEFAULT_PROGRESS_BARS];
    }
    if (!json.launchMilestones || !json.launchMilestones.length) {
      json.launchMilestones = [...DEFAULT_MILESTONES];
    }
    return json;
  };

  const fetchPage = useCallback(async (slug) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/servicepages/${slug}`);
      const json = await res.json();
      setData(slug === "builders" ? seedBuilderDefaults(json) : json);
    } catch { showToast("Failed to load", true); }
    finally   { setLoading(false); }
  }, []);

  useEffect(() => { fetchPage(activeSlug); }, [activeSlug, fetchPage]);

  const showToast = (msg, isError = false) => {
    setToast(isError ? `❌ ${msg}` : `✅ ${msg}`);
    setTimeout(() => setToast(""), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`${API}/api/servicepages/${activeSlug}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      // After save, preserve local builder-only fields if backend returns them empty
      if (activeSlug === "builders") {
        if (!json.launchProgressBars || !json.launchProgressBars.length) {
          json.launchProgressBars = data.launchProgressBars;
        }
        if (!json.launchMilestones || !json.launchMilestones.length) {
          json.launchMilestones = data.launchMilestones;
        }
      }
      setData(activeSlug === "builders" ? seedBuilderDefaults(json) : json);
      showToast("Saved successfully");
    } catch { showToast("Save failed", true); }
    finally   { setSaving(false); }
  };

  // ── Reset to seed defaults ─────────────────────────────────────────────────
  const handleReset = async () => {
    setResetting(true);
    setShowResetConfirm(false);
    try {
      const res = await fetch(`${API}/api/servicepages/${activeSlug}/reset`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      await fetchPage(activeSlug);
      showToast("Reset to defaults");
    } catch {
      await fetchPage(activeSlug);
      showToast("Reset to defaults");
    }
    finally { setResetting(false); }
  };

  // ── Image upload helper ────────────────────────────────────────────────────
  const handleImageUpload = async (fieldKey, file) => {
    if (!file) return;
    setImgUploading(p => ({ ...p, [fieldKey]: true }));
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch(`${API}/api/servicepages/${activeSlug}/upload-image`, {
        method: "POST", body: fd,
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(p => ({ ...p, [fieldKey]: json.url }));
      showToast("Image uploaded");
    } catch { showToast("Upload failed", true); }
    finally   { setImgUploading(p => ({ ...p, [fieldKey]: false })); }
  };

  const handleArrayImageUpload = async (arrayKey, index, file) => {
    if (!file) return;
    const key = `${arrayKey}_${index}`;
    setImgUploading(p => ({ ...p, [key]: true }));
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch(`${API}/api/servicepages/${activeSlug}/upload-image`, {
        method: "POST", body: fd,
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(prev => {
        const arr = [...(prev[arrayKey] || [])];
        arr[index] = { ...arr[index], image: json.url };
        return { ...prev, [arrayKey]: arr };
      });
      showToast("Image uploaded");
    } catch { showToast("Upload failed", true); }
    finally   { setImgUploading(p => ({ ...p, [key]: false })); }
  };

  // ── Field helpers ──────────────────────────────────────────────────────────
  const set    = (k, v)       => setData(p => ({ ...p, [k]: v }));
  const setArr = (k, i, f, v) => setData(p => { const a=[...(p[k]||[])]; a[i]={...a[i],[f]:v}; return {...p,[k]:a}; });
  const addArr = (k, tpl)     => setData(p => ({ ...p, [k]: [...(p[k]||[]), tpl] }));
  const delArr = (k, i)       => setData(p => ({ ...p, [k]: (p[k]||[]).filter((_,x)=>x!==i) }));
  const setStr = (k, i, v)    => setData(p => { const a=[...(p[k]||[])]; a[i]=v; return {...p,[k]:a}; });
  const addStr = (k)          => setData(p => ({ ...p, [k]: [...(p[k]||[]), ""] }));
  const delStr = (k, i)       => setData(p => ({ ...p, [k]: (p[k]||[]).filter((_,x)=>x!==i) }));

  // ── Styles ─────────────────────────────────────────────────────────────────
  const s = {
    wrap:      { padding: 24, fontFamily: "sans-serif", maxWidth: 920 },
    slugBar:   { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 },
    slugBtn:   (a) => ({ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                         background: a ? "#1a2540" : "#eef0f5", color: a ? "#fff" : "#333",
                         fontWeight: 600, fontSize: 13 }),
    secBar:    { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20,
                 borderBottom: "2px solid #eee", paddingBottom: 10 },
    secBtn:    (a) => ({ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                         background: a ? "#f59e0b" : "transparent",
                         color: a ? "#fff" : "#555", fontWeight: 600, fontSize: 12 }),
    card:      { background: "#fff", borderRadius: 12, padding: 20, marginBottom: 16,
                 boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
    itemCard:  { background: "#f8f9fc", borderRadius: 8, padding: 14, marginBottom: 10,
                 border: "1px solid #e5e7eb" },
    label:     { display: "block", fontSize: 11, fontWeight: 700, color: "#555",
                 marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" },
    input:     { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd",
                 fontSize: 14, boxSizing: "border-box", marginBottom: 12 },
    textarea:  { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd",
                 fontSize: 14, boxSizing: "border-box", marginBottom: 12,
                 minHeight: 80, resize: "vertical" },
    row2:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    addBtn:    { padding: "8px 16px", background: "#1a2540", color: "#fff", border: "none",
                 borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, marginTop: 4 },
    delBtn:    { padding: "5px 9px", background: "#fee2e2", color: "#dc2626", border: "none",
                 borderRadius: 6, cursor: "pointer", fontSize: 12, flexShrink: 0 },
    saveBtn:   { padding: "12px 32px", background: "#f59e0b", color: "#fff", border: "none",
                 borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15 },
    resetBtn:  { padding: "12px 24px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5",
                 borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 },
    toast:     { position: "fixed", bottom: 24, right: 24, background: "#1a2540", color: "#fff",
                 padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999 },
    imgBox:    { border: "2px dashed #ddd", borderRadius: 10, padding: 12, marginBottom: 12,
                 background: "#fafafa" },
    imgPrev:   { width: "100%", maxHeight: 130, objectFit: "cover", borderRadius: 8,
                 marginBottom: 8, display: "block" },
    upBtn:     { display: "inline-block", padding: "7px 14px", background: "#eef0f5",
                 borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                 border: "1px solid #ddd", color: "#333" },
    upBtnBusy: { display: "inline-block", padding: "7px 14px", background: "#fef3c7",
                 borderRadius: 8, fontSize: 13, fontWeight: 600,
                 border: "1px solid #fde68a", color: "#92400e" },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 },
    modalBox:     { background: "#fff", borderRadius: 14, padding: 28, maxWidth: 400, width: "90%",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)" },
    infoBox:      { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
                    padding: "10px 14px", marginBottom: 16 },
    infoText:     { margin: 0, fontSize: 12, color: "#1e40af" },
    lockedInput:  { width: "100%", padding: "9px 12px", borderRadius: 8,
                    border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box",
                    marginBottom: 12, background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" },
    subHead:      { fontSize: 13, fontWeight: 700, color: "#1a2540",
                    margin: "20px 0 10px", borderBottom: "1px solid #eee", paddingBottom: 6 },
  };

  // ── Image upload block ─────────────────────────────────────────────────────
  const ImgField = ({ fieldKey, label = "Image", value }) => (
    <div>
      <span style={s.label}>{label}</span>
      <div style={s.imgBox}>
        {value && <img src={value.startsWith("http") ? value : `${process.env.PUBLIC_URL || ""}${value}`}
          alt="" style={s.imgPrev} onError={e => { e.target.style.display="none"; }} />}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={imgUploading[fieldKey] ? s.upBtnBusy : s.upBtn}>
            {imgUploading[fieldKey] ? "⏳ Uploading..." : "📤 Upload Image"}
            <input type="file" accept="image/*" style={{ display: "none" }}
              disabled={!!imgUploading[fieldKey]}
              onChange={e => handleImageUpload(fieldKey, e.target.files[0])} />
          </label>
          <span style={{ fontSize: 12, color: "#999" }}>or type path below</span>
        </div>
        <input style={{ ...s.input, marginTop: 8, marginBottom: 0, fontSize: 12 }}
          value={value || ""} onChange={e => set(fieldKey, e.target.value)}
          placeholder="/public-path.png or https://res.cloudinary.com/..." />
      </div>
    </div>
  );

  const ArrImgField = ({ arrayKey, index, value }) => (
    <div>
      <span style={s.label}>Image</span>
      <div style={s.imgBox}>
        {value && <img src={value.startsWith("http") ? value : `${process.env.PUBLIC_URL || ""}${value}`}
          alt="" style={s.imgPrev} onError={e => { e.target.style.display="none"; }} />}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={imgUploading[`${arrayKey}_${index}`] ? s.upBtnBusy : s.upBtn}>
            {imgUploading[`${arrayKey}_${index}`] ? "⏳ Uploading..." : "📤 Upload Image"}
            <input type="file" accept="image/*" style={{ display: "none" }}
              disabled={!!imgUploading[`${arrayKey}_${index}`]}
              onChange={e => handleArrayImageUpload(arrayKey, index, e.target.files[0])} />
          </label>
          <span style={{ fontSize: 12, color: "#999" }}>or type path</span>
        </div>
        <input style={{ ...s.input, marginTop: 8, marginBottom: 0, fontSize: 12 }}
          value={value || ""} onChange={e => setArr(arrayKey, index, "image", e.target.value)}
          placeholder="/path.png or https://..." />
      </div>
    </div>
  );

  if (!data && loading) return <div style={s.wrap}>⏳ Loading...</div>;
  if (!data) return <div style={s.wrap}>Select a service above.</div>;

  const svcLabel = SERVICES.find(sv => sv.slug === activeSlug)?.label;
  const visibleSections = SLUG_SECTIONS[activeSlug] || ALL_SECTIONS;
  const isBuilders = activeSlug === "builders";

  return (
    <div style={s.wrap}>
      {toast && <div style={s.toast}>{toast}</div>}

      {/* ── Reset confirm modal ── */}
      {showResetConfirm && (
        <div style={s.modalOverlay}>
          <div style={s.modalBox}>
            <h3 style={{ margin: "0 0 10px", color: "#1a2540" }}>⚠️ Reset to Defaults?</h3>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
              This will restore all content for <strong>{svcLabel}</strong> back to the
              original seed defaults. Any edits and uploaded images will be lost.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ ...s.resetBtn, flex: 1 }} onClick={handleReset} disabled={resetting}>
                {resetting ? "⏳ Resetting..." : "Yes, Reset"}
              </button>
              <button style={{ ...s.saveBtn, flex: 1, background: "#6b7280" }}
                onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ margin: "0 0 4px", color: "#1a2540" }}>🛠 Service Pages CMS</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
        Edit every section of each service page — hero to CTA, all text and images.
      </p>

      {/* ── Slug selector ── */}
      <div style={s.slugBar}>
        {SERVICES.map(svc => (
          <button key={svc.slug} style={s.slugBtn(activeSlug === svc.slug)}
            onClick={() => { setActiveSlug(svc.slug); setActiveSection("hero"); }}>
            {svc.label}
          </button>
        ))}
      </div>

      {loading ? <p>⏳ Loading {activeSlug}...</p> : (
        <>
          {/* ── Section tabs — only show sections relevant to this service ── */}
          <div style={s.secBar}>
            {visibleSections.map(sec => (
              <button key={sec} style={s.secBtn(activeSection === sec)}
                onClick={() => setActiveSection(sec)}>
                {SECTION_LABELS[sec]}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════════
              HERO
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "hero" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Hero Section</h3>

              {isBuilders && (
                <div style={s.infoBox}>
                  <p style={s.infoText}>
                    ℹ️ <strong>Builders page:</strong> The animated hero title <em>"Building Tomorrow's Bangalore"</em> is hardcoded with GSAP word animation and cannot be changed here. Edit subtitle, background image, badge text, and button texts below.
                  </p>
                </div>
              )}

              <label style={s.label}>Hero Tag / Badge (small text above title)</label>
              <input style={s.input} value={data.heroTag || ""}
                onChange={e => set("heroTag", e.target.value)}
                placeholder={isBuilders ? "Launching Soon — Countdown Active" : "e.g. SMS INFRA EARTHMOVERS"} />

              {isBuilders ? (
                <div>
                  <label style={s.label}>Hero Title (H1) — locked, GSAP animated</label>
                  <input style={s.lockedInput} value="Building Tomorrow's Bangalore" readOnly disabled />
                </div>
              ) : (
                <div>
                  <label style={s.label}>Hero Title (H1)</label>
                  <input style={s.input} value={data.heroTitle || ""}
                    onChange={e => set("heroTitle", e.target.value)} />
                </div>
              )}

              <label style={s.label}>Hero Subtitle / Description</label>
              <textarea style={s.textarea} value={data.heroSubtitle || ""}
                onChange={e => set("heroSubtitle", e.target.value)}
                placeholder={isBuilders ? "A new era of construction begins — premium residential, commercial, and EPC infrastructure, launching very soon." : ""} />

              {isBuilders ? (
                <>
                  <div style={s.infoBox}>
                    <p style={s.infoText}>
                      ℹ️ These button texts appear on the hero section. Primary opens the consultation modal; secondary opens the notify popup. They also appear in the CTA section at the bottom.
                    </p>
                  </div>
                  <div style={s.row2}>
                    <div>
                      <label style={s.label}>Primary Button Text (consultation modal)</label>
                      <input style={s.input} value={data.ctaBtnPrimary || ""}
                        onChange={e => set("ctaBtnPrimary", e.target.value)} placeholder="Get Early Consultation" />
                    </div>
                    <div>
                      <label style={s.label}>Secondary Button Text (notify popup)</label>
                      <input style={s.input} value={data.ctaBtnSecondary || ""}
                        onChange={e => set("ctaBtnSecondary", e.target.value)} placeholder="Get Notified" />
                    </div>
                  </div>
                </>
              ) : (
                <div style={s.row2}>
                  <div>
                    <label style={s.label}>Primary Button Text</label>
                    <input style={s.input} value={data.heroBtnPrimary || ""}
                      onChange={e => set("heroBtnPrimary", e.target.value)} placeholder="Request Quote" />
                  </div>
                  <div>
                    <label style={s.label}>Secondary Button Text</label>
                    <input style={s.input} value={data.heroBtnSecondary || ""}
                      onChange={e => set("heroBtnSecondary", e.target.value)} placeholder="View Services" />
                  </div>
                </div>
              )}

              <ImgField fieldKey="heroBgImage" label="Hero Background Image" value={data.heroBgImage} />
              {!isBuilders && (
                <ImgField fieldKey="heroRightImage" label="Hero Right / Feature Image" value={data.heroRightImage} />
              )}

              {/* ── Builders: Popup text ── */}
              {isBuilders && (
                <>
                  <p style={s.subHead}>🔔 "Something Big Is Coming" Popup Content</p>
                  <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
                    This popup auto-opens 3 seconds after page load and when "Get Notified" is clicked.
                  </p>
                  <label style={s.label}>Popup Badge Text</label>
                  <input style={s.input} value={data.popupBadge || ""}
                    onChange={e => set("popupBadge", e.target.value)} placeholder="Launching September 2025" />
                  <div style={s.row2}>
                    <div>
                      <label style={s.label}>Popup Title Line 1</label>
                      <input style={s.input} value={data.popupTitle1 || ""}
                        onChange={e => set("popupTitle1", e.target.value)} placeholder="Something Big" />
                    </div>
                    <div>
                      <label style={s.label}>Popup Title Line 2 (gold colour)</label>
                      <input style={s.input} value={data.popupTitle2 || ""}
                        onChange={e => set("popupTitle2", e.target.value)} placeholder="Is Coming" />
                    </div>
                  </div>
                  <label style={s.label}>Popup Subtitle</label>
                  <textarea style={{ ...s.textarea, minHeight: 60 }} value={data.popupSubtitle || ""}
                    onChange={e => set("popupSubtitle", e.target.value)}
                    placeholder="Premium construction & infrastructure solutions for Bangalore. Be the first to know." />
                  <label style={s.label}>Popup Feature Tags (one per line, 3 tags)</label>
                  <textarea style={{ ...s.textarea, minHeight: 72 }}
                    value={(data.popupFeatures || []).join("\n")}
                    onChange={e => set("popupFeatures", e.target.value.split("\n"))}
                    placeholder={"Residential Villas\nCommercial Complexes\nEPC Solutions"} />
                </>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              LAUNCHING SOON — BUILDERS ONLY
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "launching" && isBuilders && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 4px", color: "#1a2540" }}>Launching Soon Section</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
                The section below the hero with progress bars, milestones, and the "Get Launch Updates" form.
              </p>

              {/* ── Launch Date ── */}
              <p style={s.subHead}>📅 Countdown Target Date</p>
              <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
                The date the countdown timer counts down to. Format: YYYY-MM-DDTHH:MM:SS (e.g. 2027-06-01T00:00:00)
              </p>
              <label style={s.label}>Launch Date & Time</label>
              <input style={s.input} value={data.launchDate || "2027-01-01T00:00:00"}
                onChange={e => set("launchDate", e.target.value)}
                placeholder="2027-01-01T00:00:00" />

              <label style={s.label}>Section Tag (small text above heading)</label>
              <input style={s.input} value={data.launchingTag || ""}
                onChange={e => set("launchingTag", e.target.value)} placeholder="Future Infrastructure Division" />
              <label style={s.label}>Section Heading</label>
              <input style={s.input} value={data.launchingHeading || ""}
                onChange={e => set("launchingHeading", e.target.value)} placeholder="Building Tomorrow's Infrastructure" />

              <p style={s.subHead}>📋 Left Card — Division In Progress</p>
              <label style={s.label}>Card Header Label</label>
              <input style={s.input} value={data.launchingCardHeader || ""}
                onChange={e => set("launchingCardHeader", e.target.value)} placeholder="Division In Progress" />
              <label style={s.label}>Card Body Text</label>
              <textarea style={s.textarea} value={data.launchingCardBody || ""}
                onChange={e => set("launchingCardBody", e.target.value)}
                placeholder="Our Builders & Infrastructure division is in final stages of development..." />

              {/* ── Progress Bars — uses setArr directly, no inline fallback ── */}
              <p style={s.subHead}>📊 Progress Bars</p>
              {(data.launchProgressBars || []).map((bar, i) => (
                <div key={i} style={{ ...s.itemCard, marginBottom: 8 }}>
                  <div style={s.row2}>
                    <div>
                      <label style={s.label}>Label</label>
                      <input style={{ ...s.input, marginBottom: 0 }}
                        value={bar.label || ""}
                        onChange={e => setArr("launchProgressBars", i, "label", e.target.value)} />
                    </div>
                    <div>
                      <label style={s.label}>Percentage (0–100)</label>
                      <input style={{ ...s.input, marginBottom: 0 }} type="number" min="0" max="100"
                        value={bar.pct ?? 0}
                        onChange={e => setArr("launchProgressBars", i, "pct", Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              ))}
              <button style={{ ...s.addBtn, marginBottom: 16 }}
                onClick={() => addArr("launchProgressBars", { label: "", pct: 50 })}>
                + Add Progress Bar
              </button>

              {/* ── Milestones — uses setStr/delStr/addStr directly ── */}
              <p style={s.subHead}>🏁 Milestone Track</p>
              <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
                First 2 show as "done" (✓), 3rd is "active", rest are upcoming.
              </p>
              {(data.launchMilestones || []).map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input style={{ ...s.input, marginBottom: 0, flex: 1 }}
                    value={m}
                    onChange={e => setStr("launchMilestones", i, e.target.value)}
                    placeholder={DEFAULT_MILESTONES[i] || `Step ${i + 1}`} />
                  <button style={s.delBtn} onClick={() => delStr("launchMilestones", i)}>✕</button>
                </div>
              ))}
              <button style={{ ...s.addBtn, marginBottom: 16 }} onClick={() => addStr("launchMilestones")}>
                + Add Milestone
              </button>

              <p style={s.subHead}>🔔 Right Card — "Get Launch Updates" Form</p>
              <label style={s.label}>Notify Card Heading</label>
              <input style={s.input} value={data.notifyCardHeading || ""}
                onChange={e => set("notifyCardHeading", e.target.value)} placeholder="Get Launch Updates" />
              <label style={s.label}>Notify Card Subtext</label>
              <input style={s.input} value={data.notifyCardSubtext || ""}
                onChange={e => set("notifyCardSubtext", e.target.value)} placeholder="Be the first to know when we go live." />
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TRUST STRIP
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "trust" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Trust Strip</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
                The 4 stat boxes below the hero (e.g. "30+ Years", "IS Certified", "24/7 Supply", "100% Tested").
              </p>
              {(data.trustItems || []).map((item, i) => (
                <div key={i} style={s.itemCard}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={s.row2}>
                        <div>
                          <label style={s.label}>Value / Heading</label>
                          <input style={s.input} value={item.value || ""}
                            onChange={e => setArr("trustItems", i, "value", e.target.value)}
                            placeholder="30+" />
                        </div>
                        <div>
                          <label style={s.label}>Label</label>
                          <input style={s.input} value={item.label || ""}
                            onChange={e => setArr("trustItems", i, "label", e.target.value)}
                            placeholder="Years Experience" />
                        </div>
                      </div>
                    </div>
                    <button style={{ ...s.delBtn, marginTop: 22 }} onClick={() => delArr("trustItems", i)}>✕</button>
                  </div>
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addArr("trustItems", { value: "", label: "" })}>
                + Add Trust Item
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              ABOUT
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "about" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>About Section</h3>
              <label style={s.label}>Section Tag (small label above heading)</label>
              <input style={s.input} value={data.aboutTag || ""}
                onChange={e => set("aboutTag", e.target.value)} placeholder="ABOUT OUR AGGREGATES" />
              <label style={s.label}>About Title / Heading</label>
              <input style={s.input} value={data.aboutTitle || ""}
                onChange={e => set("aboutTitle", e.target.value)} />
              <label style={s.label}>About Paragraph 1</label>
              <textarea style={s.textarea} value={data.aboutPara1 || ""}
                onChange={e => set("aboutPara1", e.target.value)} />
              <label style={s.label}>About Paragraph 2</label>
              <textarea style={s.textarea} value={data.aboutPara2 || ""}
                onChange={e => set("aboutPara2", e.target.value)} />
              <ImgField fieldKey="aboutImage" label="About Section Image" value={data.aboutImage} />
              <div style={{ marginTop: 8 }}>
                <label style={s.label}>About Bullet Points</label>
                {(data.aboutPoints || []).map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={pt}
                      onChange={e => setStr("aboutPoints", i, e.target.value)} />
                    <button style={s.delBtn} onClick={() => delStr("aboutPoints", i)}>✕</button>
                  </div>
                ))}
                <button style={s.addBtn} onClick={() => addStr("aboutPoints")}>+ Add Point</button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STATS
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "stats" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Stats / Counters</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
                Animated number counters (e.g. "500+ Projects", "30+ Years").
              </p>
              {(data.stats || []).map((stat, i) => (
                <div key={i} style={s.itemCard}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={s.row2}>
                        <div>
                          <label style={s.label}>Value (e.g. "50+")</label>
                          <input style={s.input} value={stat.value || ""}
                            onChange={e => setArr("stats", i, "value", e.target.value)} />
                        </div>
                        <div>
                          <label style={s.label}>Label</label>
                          <input style={s.input} value={stat.label || ""}
                            onChange={e => setArr("stats", i, "label", e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <button style={{ ...s.delBtn, marginTop: 22 }} onClick={() => delArr("stats", i)}>✕</button>
                  </div>
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addArr("stats", { value: "", label: "" })}>
                + Add Stat
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              SERVICES / PRODUCT CARDS
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "services" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>
                {isBuilders ? "Services (Residential / Commercial / EPC)" : "Services / Product Cards"}
              </h3>
              {isBuilders && (
                <div style={s.infoBox}>
                  <p style={s.infoText}>
                    ℹ️ Edit the 3 service card titles and descriptions. Images can be uploaded per card. Card icons and accent colours are fixed in code.
                  </p>
                </div>
              )}
              <label style={s.label}>Section Tag (small label above heading)</label>
              <input style={s.input} value={data.servicesHeading || ""}
                onChange={e => set("servicesHeading", e.target.value)}
                placeholder={isBuilders ? "Upcoming Services" : "OUR SERVICES"} />
              <label style={s.label}>Section Title / Heading</label>
              <input style={s.input} value={data.servicesTitle || ""}
                onChange={e => set("servicesTitle", e.target.value)}
                placeholder={isBuilders ? "Future Construction & Infrastructure Solutions" : "Services We Offer"} />
              <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px" }}>
                {isBuilders
                  ? "The 3 service cards: Residential Construction, Commercial Projects, EPC Solutions."
                  : "Cards shown on the page."}
              </p>
              {(data.serviceItems || []).map((item, i) => (
                <div key={i} style={s.itemCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <strong style={{ fontSize: 13, color: "#1a2540" }}>
                      {isBuilders
                        ? ["Residential Construction", "Commercial Projects", "EPC Solutions"][i] || `Card ${i + 1}`
                        : `Card ${i + 1}`}
                    </strong>
                    <button style={s.delBtn} onClick={() => delArr("serviceItems", i)}>✕ Remove</button>
                  </div>
                  <label style={s.label}>Title</label>
                  <input style={s.input} value={item.title || ""}
                    onChange={e => setArr("serviceItems", i, "title", e.target.value)} />
                  <label style={s.label}>Description</label>
                  <textarea style={{ ...s.textarea, minHeight: 60 }} value={item.desc || ""}
                    onChange={e => setArr("serviceItems", i, "desc", e.target.value)} />
                  <ArrImgField arrayKey="serviceItems" index={i} value={item.image} />
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addArr("serviceItems", { title: "", desc: "", image: "" })}>
                + Add Card
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              PROCESS STEPS  (= Roadmap for builders)
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "process" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>
                {isBuilders ? "Roadmap / Launch Phases" : "Process Steps"}
              </h3>
              {isBuilders && (
                <div style={s.infoBox}>
                  <p style={s.infoText}>
                    ℹ️ These are the 4 roadmap phases shown in the stepper: Phase 01 Residential, Phase 02 Commercial, Phase 03 EPC, Phase 04 Smart Cities. Edit titles here — phase numbers and icons are auto-generated.
                  </p>
                </div>
              )}
              <label style={s.label}>Section Tag (small label above heading)</label>
              <input style={s.input} value={data.processHeading || ""}
                onChange={e => set("processHeading", e.target.value)}
                placeholder={isBuilders ? "Growth Roadmap" : "MANUFACTURING PROCESS"} />
              <label style={s.label}>Section Title / Heading</label>
              <input style={s.input} value={data.processTitle || ""}
                onChange={e => set("processTitle", e.target.value)}
                placeholder={isBuilders ? "Future Infrastructure Expansion Plan" : "How We Work"} />
              {!isBuilders && (
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px" }}>
                  Step-by-step process (e.g. "Site Inspection → Terrain Analysis → Execution").
                </p>
              )}
              {(data.processSteps || []).map((step, i) => (
                <div key={i} style={s.itemCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <strong style={{ fontSize: 13, color: "#1a2540" }}>
                      {isBuilders ? `Phase 0${i + 1}` : `Step ${i + 1}`}
                    </strong>
                    <button style={s.delBtn} onClick={() => delArr("processSteps", i)}>✕</button>
                  </div>
                  {!isBuilders && (
                    <div style={s.row2}>
                      <div>
                        <label style={s.label}>Icon (emoji)</label>
                        <input style={s.input} value={step.icon || ""}
                          onChange={e => setArr("processSteps", i, "icon", e.target.value)} placeholder="🔨" />
                      </div>
                      <div>
                        <label style={s.label}>Step Title</label>
                        <input style={s.input} value={step.title || ""}
                          onChange={e => setArr("processSteps", i, "title", e.target.value)} />
                      </div>
                    </div>
                  )}
                  {isBuilders && (
                    <div>
                      <label style={s.label}>Phase Label</label>
                      <input style={s.input} value={step.title || ""}
                        onChange={e => setArr("processSteps", i, "title", e.target.value)}
                        placeholder={["Residential Projects", "Commercial Infrastructure", "EPC & Industrial", "Smart Cities"][i] || ""} />
                    </div>
                  )}
                  {!isBuilders && (
                    <>
                      <label style={s.label}>Description</label>
                      <textarea style={{ ...s.textarea, minHeight: 60 }} value={step.desc || ""}
                        onChange={e => setArr("processSteps", i, "desc", e.target.value)} />
                      <ArrImgField arrayKey="processSteps" index={i} value={step.image} />
                    </>
                  )}
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addArr("processSteps", { icon: "", title: "", desc: "", image: "" })}>
                {isBuilders ? "+ Add Phase" : "+ Add Step"}
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              FEATURES / BENEFITS  (= Why Us for builders)
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "features" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>
                {isBuilders ? "Why Choose Us" : "Features / Benefits"}
              </h3>
              {isBuilders && (
                <div style={s.infoBox}>
                  <p style={s.infoText}>
                    ℹ️ These are the 4 "Why Us" cards on the Builders page: Quality-First Approach, Fast Execution, End-to-End Planning, Scalable Solutions. Icons are fixed in code; edit titles and descriptions here.
                  </p>
                </div>
              )}
              <label style={s.label}>Section Tag (small label above heading)</label>
              <input style={s.input} value={data.featuresHeading || ""}
                onChange={e => set("featuresHeading", e.target.value)}
                placeholder={isBuilders ? "Why Choose Us" : "WHY CHOOSE SMS INFRA"} />
              <label style={s.label}>Section Title / Heading</label>
              <input style={s.input} value={data.featuresTitle || ""}
                onChange={e => set("featuresTitle", e.target.value)}
                placeholder={isBuilders ? "Future-Ready Construction Excellence" : ""} />
              <label style={s.label}>Section Description / Paragraph</label>
              <textarea style={s.textarea} value={data.featuresDesc || ""}
                onChange={e => set("featuresDesc", e.target.value)} />
              {(data.features || []).map((feat, i) => (
                <div key={i} style={s.itemCard}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <label style={s.label}>{isBuilders ? "Card Title" : "Feature Title"}</label>
                      <input style={s.input} value={feat.title || ""}
                        onChange={e => setArr("features", i, "title", e.target.value)} />
                      <label style={s.label}>{isBuilders ? "Card Description" : "Feature Description"}</label>
                      <textarea style={{ ...s.textarea, minHeight: 60 }} value={feat.desc || ""}
                        onChange={e => setArr("features", i, "desc", e.target.value)} />
                    </div>
                    <button style={{ ...s.delBtn, marginTop: 22 }} onClick={() => delArr("features", i)}>✕</button>
                  </div>
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addArr("features", { title: "", desc: "" })}>
                {isBuilders ? "+ Add Why Us Card" : "+ Add Feature"}
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              APPLICATIONS
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "applications" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Applications</h3>
              <label style={s.label}>Section Tag (small label above heading)</label>
              <input style={s.input} value={data.applicationsHeading || ""}
                onChange={e => set("applicationsHeading", e.target.value)} placeholder="APPLICATIONS" />
              <label style={s.label}>Section Title / Heading</label>
              <input style={s.input} value={data.applicationsTitle || ""}
                onChange={e => set("applicationsTitle", e.target.value)} />
              {(data.applications || []).map((app, i) => (
                <div key={i} style={s.itemCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <strong style={{ fontSize: 13, color: "#1a2540" }}>Application {i + 1}</strong>
                    <button style={s.delBtn} onClick={() => delArr("applications", i)}>✕</button>
                  </div>
                  <label style={s.label}>Label / Title</label>
                  <input style={s.input} value={app.label || app.title || ""}
                    onChange={e => setArr("applications", i, "label", e.target.value)} />
                  <ArrImgField arrayKey="applications" index={i} value={app.image || app.img} />
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addArr("applications", { label: "", image: "" })}>
                + Add Application
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              COMPARISON
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "comparison" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Comparison Section</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
                e.g. "M-Sand vs River Sand" or "Solid Blocks vs Traditional Bricks"
              </p>
              <label style={s.label}>Section Tag (small label above heading)</label>
              <input style={s.input} value={data.comparisonHeading || ""}
                onChange={e => set("comparisonHeading", e.target.value)} placeholder="WHY M-SAND" />
              <label style={s.label}>Section Title / Heading</label>
              <input style={s.input} value={data.comparisonTitle || ""}
                onChange={e => set("comparisonTitle", e.target.value)} placeholder="M-Sand vs River Sand" />
              <div style={s.row2}>
                <div>
                  <label style={s.label}>Left Column Heading (Old / Traditional)</label>
                  <input style={s.input} value={data.comparisonLeftTitle || ""}
                    onChange={e => set("comparisonLeftTitle", e.target.value)} placeholder="Traditional Method" />
                  <label style={s.label}>Left Column Points (one per line)</label>
                  <textarea style={{ ...s.textarea, minHeight: 120 }}
                    value={(data.comparisonLeftPoints || []).join("\n")}
                    onChange={e => set("comparisonLeftPoints", e.target.value.split("\n"))} />
                </div>
                <div>
                  <label style={s.label}>Right Column Heading (SMS Infra / New)</label>
                  <input style={s.input} value={data.comparisonRightTitle || ""}
                    onChange={e => set("comparisonRightTitle", e.target.value)} placeholder="SMS Infra Solution" />
                  <label style={s.label}>Right Column Points (one per line)</label>
                  <textarea style={{ ...s.textarea, minHeight: 120 }}
                    value={(data.comparisonRightPoints || []).join("\n")}
                    onChange={e => set("comparisonRightPoints", e.target.value.split("\n"))} />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              FAQs
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "faqs" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>FAQs</h3>
              {isBuilders && (
                <div style={s.infoBox}>
                  <p style={s.infoText}>
                    ℹ️ These FAQs appear in the accordion on the Builders page. Edit questions and answers freely.
                  </p>
                </div>
              )}
              {(data.faqs || []).map((faq, i) => (
                <div key={i} style={s.itemCard}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <label style={s.label}>Question</label>
                      <input style={s.input} value={faq.question || ""}
                        onChange={e => setArr("faqs", i, "question", e.target.value)} />
                      <label style={s.label}>Answer</label>
                      <textarea style={s.textarea} value={faq.answer || ""}
                        onChange={e => setArr("faqs", i, "answer", e.target.value)} />
                    </div>
                    <button style={{ ...s.delBtn, marginTop: 22 }} onClick={() => delArr("faqs", i)}>✕</button>
                  </div>
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addArr("faqs", { question: "", answer: "" })}>
                + Add FAQ
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              CTA
          ══════════════════════════════════════════════════════════ */}
          {activeSection === "cta" && (
            <div style={s.card}>
              <h3 style={{ margin: "0 0 16px", color: "#1a2540" }}>Call To Action</h3>
              {isBuilders && (
                <div style={s.infoBox}>
                  <p style={s.infoText}>
                    ℹ️ The bottom CTA section on the Builders page. "Contact Team" button navigates to /contact. "Get Notified" button opens the launch popup.
                  </p>
                </div>
              )}
              <label style={s.label}>CTA Tag (small label above heading)</label>
              <input style={s.input} value={data.ctaTag || ""}
                onChange={e => set("ctaTag", e.target.value)}
                placeholder={isBuilders ? "Future Construction Partnerships" : "BUILD STRONGER STRUCTURES"} />
              <label style={s.label}>CTA Title / Heading</label>
              <input style={s.input} value={data.ctaTitle || ""}
                onChange={e => set("ctaTitle", e.target.value)}
                placeholder={isBuilders ? "Planning a Future Construction Project?" : ""} />
              <label style={s.label}>CTA Description / Subtitle</label>
              <textarea style={s.textarea} value={data.ctaSubtitle || ""}
                onChange={e => set("ctaSubtitle", e.target.value)} />
              <div style={s.row2}>
                <div>
                  <label style={s.label}>Primary Button Text</label>
                  <input style={s.input} value={data.ctaBtnPrimary || ""}
                    onChange={e => set("ctaBtnPrimary", e.target.value)}
                    placeholder={isBuilders ? "Contact Team" : "Request Quote"} />
                </div>
                <div>
                  <label style={s.label}>Secondary Button Text</label>
                  <input style={s.input} value={data.ctaBtnSecondary || ""}
                    onChange={e => set("ctaBtnSecondary", e.target.value)}
                    placeholder={isBuilders ? "Get Notified" : "Contact Us"} />
                </div>
              </div>
              {!isBuilders && (
                <ImgField fieldKey="ctaBgImage" label="CTA Background Image" value={data.ctaBgImage} />
              )}
            </div>
          )}

          {/* ── Save & Reset ── */}
          <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "⏳ Saving..." : `💾 Save ${svcLabel}`}
            </button>
            <button style={s.resetBtn} onClick={() => setShowResetConfirm(true)} disabled={resetting}>
              🔄 Reset to Defaults
            </button>
            <span style={{ fontSize: 13, color: "#666" }}>
              Changes go live on the website after saving.
            </span>
          </div>

          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8,
                        padding: "10px 14px", marginTop: 16 }}>
            <p style={{ margin: 0, fontSize: 12, color: "#92400e" }}>
              ℹ️ All sections are optional — empty fields show the original fallback content.
              Upload images via Cloudinary using the upload buttons, or type a local{" "}
              <code>/public</code> path directly. Use <strong>Reset to Defaults</strong> to
              restore original seed content for this service.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
