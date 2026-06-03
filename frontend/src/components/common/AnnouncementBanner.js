import { useEffect, useState } from "react";

const ACCENT = {
  info:    { color: "#6366f1" },
  warning: { color: "#f59e0b" },
  success: { color: "#10b981" },
  urgent:  { color: "#ef4444" },
};

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/api$/, "");

/* ── Inline SVG Bell fallback ── */
function BellSVG() {
  return (
    <svg width="76" height="76" viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="56" rx="10" ry="4" fill="#b8860b" opacity="0.5"/>
      <path d="M32 8C20 8 14 18 14 30v14h36V30C50 18 44 8 32 8Z" fill="#FFD700"/>
      <path d="M32 8C22 8 16 17 16 30v14h16V8Z" fill="#FFC200"/>
      <path d="M14 44h36v4a2 2 0 01-2 2H16a2 2 0 01-2-2v-4Z" fill="#b8860b"/>
      <path d="M14 44h18v6H16a2 2 0 01-2-2v-4Z" fill="#8b6200"/>
      <ellipse cx="32" cy="8" rx="6" ry="3" fill="#FFD700"/>
      <circle cx="32" cy="5" r="3" fill="#c0c0c0"/>
      <circle cx="28" cy="56" r="4" fill="#c8a000"/>
      <circle cx="36" cy="56" r="4" fill="#c8a000"/>
      <path d="M16 30c0-9 7-18 16-20" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="32" cy="52" rx="5" ry="2" fill="#b8860b"/>
    </svg>
  );
}

/* ── Inline SVG Megaphone fallback ── */
function MegaphoneSVG() {
  return (
    <svg width="260" height="260" viewBox="0 0 200 200" fill="none">
      <path d="M50 80 L155 48 L155 148 L50 116 Z" fill="#FFD700"/>
      <path d="M50 80 L155 48 L155 98 L50 98 Z" fill="#FFC200"/>
      <ellipse cx="158" cy="98" rx="20" ry="52" fill="#d4960a"/>
      <ellipse cx="158" cy="98" rx="14" ry="44" fill="#FFD700"/>
      <ellipse cx="50" cy="98" rx="7" ry="18" fill="#b8860b"/>
      <ellipse cx="50" cy="98" rx="4" ry="12" fill="#7a5200"/>
      <rect x="8" y="102" width="56" height="15" rx="7.5" fill="#efefef" transform="rotate(-32,8,102)"/>
      <rect x="10" y="104" width="52" height="11" rx="5.5" fill="#ffffff" transform="rotate(-32,10,104)"/>
      <path d="M182 72 Q196 98 182 124" stroke="#FFD700" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.9"/>
      <path d="M192 60 Q210 98 192 136" stroke="#FFD700" strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.55"/>
      <path d="M60 84 L148 56 L148 72 L60 96 Z" fill="rgba(255,255,255,0.20)"/>
      <ellipse cx="158" cy="98" rx="20" ry="52" fill="none" stroke="#c8900a" strokeWidth="2.5"/>
    </svg>
  );
}

/* ── Dynamic scale ── */
function useScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function calc() {
      const vw = window.innerWidth;
      const fit = (vw * 0.96) / 760;
      setScale(fit < 1 ? parseFloat(fit.toFixed(4)) : 1);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return scale;
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [index, setIndex]                 = useState(0);
  const [visible, setVisible]             = useState(false);
  const [animOut, setAnimOut]             = useState(false);
  const scale                             = useScale();

  useEffect(() => {
    // ⭐ Don't show again if user already dismissed this session
    // ⭐ dismissed resets on every page refresh — shows again on reload
    if (AnnouncementBanner._dismissed) return;

    fetch(`${API_URL}/api/announcements/active`)
      .then((r) => r.json())
      .then((data) => {
        let items = [];
        if (Array.isArray(data)) {
          items = data.filter((d) => d.isActive || d.active);
        } else if (data && typeof data === "object" && (data.isActive || data.active || data.message)) {
          items = [data];
        }
        if (items.length > 0) { setAnnouncements(items); setVisible(true); }
      })
      .catch(() => {});
  }, []);

  function handleClose() {
    // ⭐ Remember dismissed for this session — won't re-appear on navigation
    AnnouncementBanner._dismissed = true; // ⭐ in-memory only, gone on refresh
    setAnimOut(true);
    setTimeout(() => setVisible(false), 380);
  }

  function handlePrev() {
    setIndex((i) => (i - 1 + announcements.length) % announcements.length);
  }

  function handleNext() {
    setIndex((i) => (i + 1) % announcements.length);
  }

  if (announcements.length === 0 || !visible) return null;

  const announcement = announcements[index];
  const total        = announcements.length;

  const stageStyle = scale < 1
    ? { transform: `scale(${scale})`, transformOrigin: "center center", marginLeft: 0 }
    : undefined;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&display=swap');

        @keyframes annPopIn {
          0%   { opacity:0; transform:scale(0.88) translateY(20px); }
          65%  { transform:scale(1.02) translateY(-2px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes annPopOut {
          to { opacity:0; transform:scale(0.93) translateY(10px); }
        }
        @keyframes bellRing {
          0%,44%,100% { transform:rotate(0deg); }
          48%  { transform:rotate(-20deg); }
          54%  { transform:rotate(20deg); }
          60%  { transform:rotate(-12deg); }
          66%  { transform:rotate(12deg); }
          72%  { transform:rotate(-5deg); }
          78%  { transform:rotate(5deg); }
        }
        @keyframes megaFloat {
          0%,100% { transform:translateY(0px); }
          50%     { transform:translateY(-7px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes dotPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.3; transform:scale(0.5); }
        }

        .ann-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.82);
          backdrop-filter: blur(7px);
          padding: 1rem;
          box-sizing: border-box;
        }

        .ann-stage {
          position: relative;
          width: 560px;
          max-width: 560px;
          flex-shrink: 0;
          box-sizing: border-box;
          padding-top: 65px;
          margin-left: 80px;
          animation: annPopIn 0.48s cubic-bezier(0.34,1.46,0.64,1) both;
        }
        .ann-stage.ann-out { animation: annPopOut 0.32s ease-in both; }

        /* ══ BELL ══ */
        .ann-bell {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 30;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: radial-gradient(circle at 36% 30%, #2e2a10, #0c0a04);
          border: 2.5px solid #f5c518;
          box-shadow:
            0 0 0 8px rgba(245,197,24,0.13),
            0 0 0 18px rgba(245,197,24,0.06),
            0 0 60px rgba(245,197,24,0.55),
            0 12px 40px rgba(0,0,0,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bellRing 4.5s ease-in-out infinite;
        }
        .ann-bell-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 28px;
          height: 28px;
          background: #e53e3e;
          border-radius: 50%;
          border: 2.5px solid #0c0a04;
          font-size: 12px;
          font-weight: 800;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow', sans-serif;
          box-shadow: 0 2px 14px rgba(229,62,62,0.8);
        }

        /* ══ MEGAPHONE ══ */
        .ann-mega {
          position: absolute;
          top: 30px;
          left: -120px;
          width: 300px;
          height: 300px;
          z-index: 40;
          animation: megaFloat 3.8s ease-in-out infinite;
          filter: drop-shadow(0 20px 36px rgba(0,0,0,0.9));
          pointer-events: none;
        }

        /* ── Gold border shell ── */
        .ann-shell {
          border-radius: 22px;
          padding: 2px;
          background: linear-gradient(138deg,
            #ffd700 0%, #b8860b 22%, #ffd700 44%,
            #8b6200 66%, #ffd700 88%, #b8860b 100%);
          box-shadow: 0 30px 80px rgba(0,0,0,0.95);
          overflow: visible;
          position: relative;
        }

        /* ── Dark card ── */
        .ann-card {
          border-radius: 20px;
          overflow: hidden;
          background: #0f0d06;
          position: relative;
        }
        .ann-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Top content ── */
        .ann-top {
          position: relative;
          z-index: 2;
          padding: 75px 2.2rem 1.6rem;
          text-align: center;
        }

        .ann-important-row {
          display: flex;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        .ann-imp-line {
          flex: 1;
          height: 1px;
          background: rgba(245,197,24,0.45);
        }
        .ann-imp-label {
          font-family: 'Barlow', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #f5c518;
          padding: 0 16px;
          white-space: nowrap;
        }

        .ann-heading {
          font-family: 'Bebas Neue', 'Impact', sans-serif;
          font-size: 3.2rem;
          letter-spacing: 3px;
          line-height: 1;
          color: #ffffff;
          margin: 0.1rem 0 1.1rem;
          text-shadow: 0 2px 22px rgba(0,0,0,0.55);
        }

        .ann-message-row {
          display: flex;
          align-items: flex-start;
          text-align: left;
          animation: fadeUp 0.4s ease 0.1s both;
        }
        .ann-message {
          font-family: 'Barlow', 'Segoe UI', sans-serif;
          font-size: 20px;
          font-weight: 400;
          color: #c0c0c0;
          line-height: 1.75;
          margin: 0;
        }
        .ann-message b,
        .ann-message strong { color: #f0c030; font-weight: 600; }

        .ann-sep {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0;
          position: relative;
          z-index: 2;
        }

        .ann-pills {
          position: relative;
          z-index: 2;
          display: flex;
          padding: 1rem 1.8rem 1.2rem;
        }
        .ann-pill {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          text-align: center;
          padding: 0 0.5rem;
        }
        .ann-pill + .ann-pill {
          border-left: 1px solid rgba(255,255,255,0.08);
        }
        .ann-pill-icon {
          width: 26px;
          height: 26px;
          color: #f5c518;
          margin-bottom: 3px;
        }
        .ann-pill-label {
          display: block;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: #f5c518;
        }
        .ann-pill-sub {
          display: block;
          font-family: 'Barlow', sans-serif;
          font-size: 11px;
          color: #666;
          font-weight: 500;
          line-height: 1.35;
        }

        /* ── Instagram handle link ── */
        .ann-handle-link {
          display: block;
          font-family: 'Barlow', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #f5c518;
          text-decoration: none;
          line-height: 1.35;
          transition: color 0.18s, text-decoration 0.18s;
        }
        .ann-handle-link:hover {
          color: #fff;
          text-decoration: underline;
        }

        /* ══ FOOTER ══ */
        .ann-footer {
          position: relative;
          z-index: 2;
          background: linear-gradient(90deg,
            #7a5800 0%, #c8900a 12%, #ffd700 28%,
            #ffe566 50%, #ffd700 72%, #c8900a 88%, #7a5800 100%);
          padding: 0.6rem 0.7rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .ann-thankyou-pill {
          flex: 1;
          background: rgba(0,0,0,0.30);
          border-radius: 50px;
          padding: 0.55rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }
        .ann-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          animation: dotPulse 1.6s ease-in-out infinite;
        }
        .ann-thankyou-text {
          font-family: 'Barlow', sans-serif;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          color: #fff;
          white-space: nowrap;
        }
        .ann-gotit {
          flex-shrink: 0;
          background: rgba(255,255,255,0.25);
          border: 1.5px solid rgba(0,0,0,0.20);
          color: #1a1000;
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 8px 20px;
          border-radius: 24px;
          cursor: pointer;
          transition: background 0.18s;
          white-space: nowrap;
        }
        .ann-gotit:hover { background: rgba(255,255,255,0.45); }

        /* ── Multi-announcement nav ── */
        .ann-nav {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0.5rem 1rem 0.6rem;
          background: rgba(0,0,0,0.18);
        }
        .ann-nav-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(245,197,24,0.4);
          background: rgba(245,197,24,0.08);
          color: #f5c518;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          flex-shrink: 0;
        }
        .ann-nav-btn:hover { background: rgba(245,197,24,0.22); border-color: #f5c518; }
        .ann-nav-btn:disabled { opacity: 0.3; cursor: default; }
        .ann-nav-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ann-nav-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(245,197,24,0.30);
          transition: background 0.2s, transform 0.2s;
        }
        .ann-nav-dot.active {
          background: #f5c518;
          transform: scale(1.3);
        }
        .ann-nav-counter {
          font-family: 'Barlow', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: rgba(245,197,24,0.7);
          letter-spacing: 1px;
          min-width: 32px;
          text-align: center;
        }

        /* ── Mobile ≤ 480px ── */
        @media (max-width: 480px) {
          .ann-overlay { padding: 0.5rem; }
          .ann-stage { padding-top: 50px; margin-left: 40px; max-width: calc(100vw - 48px); }
          .ann-bell { width: 98px; height: 98px; }
          .ann-bell-badge { width: 22px; height: 22px; font-size: 10px; top: 2px; right: 2px; }
          .ann-mega { width: 180px; height: 180px; top: 20px; left: -72px; }
          .ann-top { padding: 58px 0.9rem 1rem; }
          .ann-heading { font-size: 2rem; letter-spacing: 1.5px; margin-bottom: 0.8rem; }
          .ann-imp-label { font-size: 8px; letter-spacing: 3px; }
          .ann-message-row { padding-left: 70px; }
          .ann-message { font-size: 15px; }
          .ann-pills { padding: 0.65rem 0.8rem 0.85rem; }
          .ann-pill-icon { width: 20px; height: 20px; }
          .ann-pill-label { font-size: 7.5px; }
          .ann-pill-sub { font-size: 9.5px; }
          .ann-thankyou-text { font-size: 9.5px; letter-spacing: 2px; }
        }

        /* ── Tablet 481–700px ── */
        @media (min-width: 481px) and (max-width: 700px) {
          .ann-stage { padding-top: 58px; margin-left: 60px; }
          .ann-bell { width: 114px; height: 114px; }
          .ann-mega { width: 240px; height: 240px; top: 0px; left: -96px; }
          .ann-top { padding: 66px 1.4rem 1.3rem; }
          .ann-heading { font-size: 3.2rem; }
          .ann-message-row { padding-left: 120px; }
          .ann-message { font-size: 16px; }
        }
      `}</style>

      <div
        className="ann-overlay"
        onClick={(e) => e.target.classList.contains("ann-overlay") && handleClose()}
      >
        <div
          className={`ann-stage${animOut ? " ann-out" : ""}`}
          style={stageStyle}
        >

          {/* ══ BELL — badge shows total count ══ */}
          <div className="ann-bell">
            <img
              src="/announcement/bell-icon.png"
              alt="bell"
              width="126"
              height="126"
              style={{ objectFit: "contain", display: "block" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "block";
              }}
            />
            <span style={{ display: "none" }}><BellSVG /></span>
            <div className="ann-bell-badge">{total}</div>
          </div>

          {/* ══ MEGAPHONE ══ */}
          <div className="ann-mega">
            <img
              src="/announcement/megaphone.png"
              alt="megaphone"
              width="300"
              height="300"
              style={{ objectFit: "contain", display: "block" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "block";
              }}
            />
            <span style={{ display: "none" }}><MegaphoneSVG /></span>
          </div>

          {/* ══ Card ══ */}
          <div className="ann-shell">
            <div className="ann-card">

              <div className="ann-top">
                <div className="ann-important-row">
                  <div className="ann-imp-line" />
                  <span className="ann-imp-label">Important</span>
                  <div className="ann-imp-line" />
                </div>

                <h2 className="ann-heading">ANNOUNCEMENT!</h2>

                <div className="ann-message-row">
                  <p className="ann-message">{announcement.message}</p>
                </div>
              </div>

              <div className="ann-sep" />

              <div className="ann-pills">
                <div className="ann-pill">
                  <svg className="ann-pill-icon" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="4" width="22" height="21" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
                    <path d="M9 2V7M19 2V7M3 10H25" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    <path d="M7 15.5H21M7 20H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="ann-pill-label">Stay Informed</span>
                  <span className="ann-pill-sub">Follow our account</span>
                </div>

                <div className="ann-pill">
                  <svg className="ann-pill-icon" viewBox="0 0 28 28" fill="none">
                    <path d="M14 3L5 7.5V14C5 19.5 9 24 14 26C19 24 23 19.5 23 14V7.5L14 3Z"
                      stroke="currentColor" strokeWidth="1.7"/>
                    <path d="M10 14.5L13 17.5L18.5 11.5"
                      stroke="currentColor" strokeWidth="1.7"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="ann-pill-label">Stay Safe</span>
                  <span className="ann-pill-sub">Do not engage with fake accounts</span>
                </div>

                <div className="ann-pill">
                  <svg className="ann-pill-icon" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="10" r="5.5" stroke="currentColor" strokeWidth="1.7"/>
                    <path d="M5 26C5 21.6 9 18 14 18C19 18 23 21.6 23 26"
                      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                  <span className="ann-pill-label">Our Account</span>
                  {/* ── Clickable Instagram link ── */}
                  <a
                    className="ann-handle-link"
                    href={announcement.instagramUrl || "https://www.instagram.com/smsinfra/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {announcement.handle || "@smsinfra"}
                  </a>
                </div>
              </div>

              {/* ── Nav bar: only shown when multiple announcements ── */}
              {total > 1 && (
                <div className="ann-nav">
                  <button
                    className="ann-nav-btn"
                    onClick={handlePrev}
                    aria-label="Previous announcement"
                  >‹</button>

                  <div className="ann-nav-dots">
                    {announcements.map((_, i) => (
                      <div
                        key={i}
                        className={`ann-nav-dot${i === index ? " active" : ""}`}
                        onClick={() => setIndex(i)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </div>

                  <span className="ann-nav-counter">{index + 1}/{total}</span>

                  <button
                    className="ann-nav-btn"
                    onClick={handleNext}
                    aria-label="Next announcement"
                  >›</button>
                </div>
              )}

              {/* Footer */}
              <div className="ann-footer">
                <div className="ann-thankyou-pill">
                  <div
                    className="ann-dot"
                    style={{ background: (ACCENT[announcement.type] || ACCENT.info).color }}
                  />
                  <span className="ann-thankyou-text">Thank you for your support!</span>
                </div>
                <button className="ann-gotit" onClick={handleClose}>Got it</button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
