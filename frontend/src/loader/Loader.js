import React, { useEffect, useRef, useState } from 'react';
import './Loader.css';

const services = [
  { emoji: '🏠', label: 'Residential', color: '#ff9f43' },
  { emoji: '🧱', label: 'Blocks',      color: '#ee5a24' },
  { emoji: '🏗️', label: 'RMC',         color: '#0984e3' },
  { emoji: '🪨', label: 'Aggregates',  color: '#6c5ce7' },
  { emoji: '🟡', label: 'M Sand',      color: '#fdcb6e' },
  { emoji: '🔶', label: 'P Sand',      color: '#e17055' },
  { emoji: '🚜', label: 'Earthmovers', color: '#00b894' },
];

const SEGS        = 24;
const ORBIT_R     = 140;
const CENTER      = 160;
const msgs        = ['Initializing','Loading assets','Laying foundations','Mixing concrete','Raising structures','Quality checks','Finishing touches','Welcome to SMS Infra'];
const checkpoints = [0, 13, 27, 43, 58, 72, 88, 100];
const times       = [0, 450, 950, 1550, 2150, 2700, 3250, 3800];

// ─── Hook — use this in App.js ───────────────────────────────────────────────
// import Loader, { useLoader } from './components/loader/Loader';
// const { showLoader, handleDone } = useLoader();
// {showLoader && <Loader onDone={handleDone} />}
// ─────────────────────────────────────────────────────────────────────────────
export function useLoader() {
  const [showLoader, setShowLoader] = useState(true);
  return { showLoader, handleDone: () => setShowLoader(false) };
}

export default function Loader({ onDone }) {
  const canvasRef    = useRef(null);
  const pnRef        = useRef(null);
  const tfRef        = useRef(null);
  const smRef        = useRef(null);
  const orbitRef     = useRef(null);
  const ticksRef     = useRef(null);
  const segsRef      = useRef(null);
  const orbitAngle   = useRef(0);
  const lastTimeRef  = useRef(0);
  const rafOrbitRef  = useRef(null);
  const rafCanvasRef = useRef(null);
  const frameRef     = useRef(0);
  const startTRef    = useRef(Date.now());
  const timersRef    = useRef([]);

  // NEW: controls slide-up exit
  const [exiting, setExiting] = useState(false);

  /* ── Tick marks ── */
  useEffect(() => {
    const el = ticksRef.current;
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 36; i++) {
      const t = document.createElement('div');
      t.className = 'sms-tick';
      const big = i % 9 === 0, mid = i % 3 === 0;
      t.style.height    = big ? '14px' : mid ? '8px' : '4px';
      t.style.top       = big ? '2px'  : mid ? '5px' : '7px';
      t.style.opacity   = big ? '1'    : mid ? '0.4' : '0.15';
      t.style.transform = `rotate(${i * 10}deg)`;
      el.appendChild(t);
    }
  }, []);

  /* ── Segments ── */
  useEffect(() => {
    const el = segsRef.current;
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < SEGS; i++) {
      const s = document.createElement('div');
      s.className = 'sms-seg';
      s.id = 'seg' + i;
      el.appendChild(s);
    }
  }, []);

  /* ── Canvas ── */
  useEffect(() => {
    const cv  = canvasRef.current;
    const ctx = cv.getContext('2d');
    startTRef.current = Date.now();

    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * 3000, y: Math.random() * 2000,
      r: Math.random() * 1.2, alpha: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
    }));
    const hexes = Array.from({ length: 10 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 1200,
      size: 25 + Math.random() * 85, rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      vy: -0.12 - Math.random() * 0.18,
      alpha: 0.012 + Math.random() * 0.02,
    }));
    const streaks = Array.from({ length: 8 }, () => ({
      x: 3000, y: Math.random() * 1200,
      len: 50 + Math.random() * 90, speed: 2 + Math.random() * 3,
      delay: Math.random() * 4000, active: false,
    }));

    function hex6(x, y, r, rot) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = rot + (i / 6) * Math.PI * 2;
        i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
                : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      ctx.closePath();
    }

    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      frameRef.current++;
      const elapsed = Date.now() - startTRef.current;

      stars.forEach(s => {
        s.alpha += s.speed;
        const a = 0.12 + 0.12 * Math.sin(s.alpha);
        ctx.beginPath();
        ctx.arc(s.x % cv.width, s.y % cv.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,194,0,${a})`;
        ctx.fill();
      });

      hexes.forEach(h => {
        h.y += h.vy; h.rot += h.rotSpeed;
        if (h.y + h.size < 0) { h.y = cv.height + h.size; h.x = Math.random() * cv.width; }
        hex6(h.x % cv.width, h.y, h.size, h.rot);
        ctx.strokeStyle = `rgba(245,194,0,${h.alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      streaks.forEach(s => {
        if (elapsed > s.delay && !s.active) { s.active = true; s.y = Math.random() * cv.height; s.x = cv.width + s.len; }
        if (!s.active) return;
        s.x -= s.speed;
        if (s.x < -s.len) { s.x = cv.width + s.len; s.y = Math.random() * cv.height; s.delay = elapsed + Math.random() * 3000; }
        const g = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y);
        g.addColorStop(0, 'rgba(245,194,0,0)');
        g.addColorStop(1, 'rgba(245,194,0,0.1)');
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + s.len, s.y);
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.stroke();
      });

      const gg = ctx.createRadialGradient(cv.width / 2, cv.height, 0, cv.width / 2, cv.height, cv.height * 0.4);
      gg.addColorStop(0, 'rgba(245,194,0,0.035)');
      gg.addColorStop(1, 'rgba(245,194,0,0)');
      ctx.fillStyle = gg;
      ctx.fillRect(0, 0, cv.width, cv.height);

      ctx.beginPath(); ctx.moveTo(0, cv.height);
      for (let x = 0; x <= cv.width; x += 3) {
        const y = cv.height - 16
          - Math.sin((x / cv.width) * Math.PI * 4 + frameRef.current * 0.018) * 9
          - Math.sin((x / cv.width) * Math.PI * 7 + frameRef.current * 0.012) * 4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(cv.width, cv.height); ctx.closePath();
      ctx.fillStyle = 'rgba(245,194,0,0.02)'; ctx.fill();

      rafCanvasRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafCanvasRef.current);
    };
  }, []);

  /* ── Orbit animation ── */
  useEffect(() => {
    const items = orbitRef.current?.querySelectorAll('.sms-orbit-item') || [];

    function animateOrbits(ts) {
      const dt = ts - lastTimeRef.current;
      lastTimeRef.current = ts;
      orbitAngle.current += 0.0004 * dt;

      items.forEach((el, i) => {
        const baseAngle = (i / services.length) * Math.PI * 2;
        const a = orbitAngle.current + baseAngle;
        const x = CENTER + ORBIT_R * Math.cos(a);
        const y = CENTER + ORBIT_R * Math.sin(a);
        el.style.left      = x + 'px';
        el.style.top       = y + 'px';
        el.style.transform = `rotate(${-orbitAngle.current}rad)`;
      });

      rafOrbitRef.current = requestAnimationFrame(animateOrbits);
    }
    rafOrbitRef.current = requestAnimationFrame(animateOrbits);

    return () => cancelAnimationFrame(rafOrbitRef.current);
  }, []);

  /* ── Progress + EXIT trigger ── */
  useEffect(() => {
    function setMsg(m) {
      const el = smRef.current;
      if (!el) return;
      el.style.opacity = '0';
      setTimeout(() => { if (smRef.current) { smRef.current.textContent = m; smRef.current.style.opacity = '1'; } }, 250);
    }

    function animTo(from, to, dur, onComplete) {
      const s = performance.now();
      function f(now) {
        const t = Math.min((now - s) / Math.max(dur, 1), 1);
        const e = 1 - Math.pow(1 - t, 4);
        const v = Math.round(from + (to - from) * e);
        if (pnRef.current) pnRef.current.textContent = v;
        if (tfRef.current) tfRef.current.style.width = v + '%';
        const onC = Math.round(v / 100 * SEGS);
        for (let i = 0; i < SEGS; i++) {
          const seg = document.getElementById('seg' + i);
          if (!seg) continue;
          if (i < onC) { seg.classList.add('sms-seg-on'); seg.classList.toggle('sms-seg-glow', i === onC - 1); }
          else         { seg.classList.remove('sms-seg-on', 'sms-seg-glow'); }
        }
        if (t < 1) requestAnimationFrame(f);
        else if (onComplete) onComplete();
      }
      requestAnimationFrame(f);
    }

    const ids = checkpoints.map((val, i) =>
      setTimeout(() => {
        const isLast = i === checkpoints.length - 1;
        animTo(
          i > 0 ? checkpoints[i - 1] : 0,
          val,
          i > 0 ? times[i] - times[i - 1] - 60 : 0,
          // When 100% is reached: pause 600ms → slide up → unmount
          isLast ? () => {
            setTimeout(() => {
              setExiting(true);                              // triggers CSS slide-up
              setTimeout(() => onDone && onDone(), 950);    // unmount after animation
            }, 600);
          } : null
        );
        setMsg(msgs[Math.min(i, msgs.length - 1)]);
      }, times[i])
    );

    timersRef.current = ids;
    return () => ids.forEach(clearTimeout);
  }, [onDone]);

  return (
    // sms-exiting class triggers the slide-up CSS transition
    <div className={`sms-loader-root${exiting ? ' sms-exiting' : ''}`}>
      <canvas ref={canvasRef} className="sms-canvas" />

      <div className="sms-corner sms-c-tl" />
      <div className="sms-corner sms-c-tr" />
      <div className="sms-corner sms-c-bl" />
      <div className="sms-corner sms-c-br" />
      <div className="sms-watermark">smsinfra.com</div>

      <div className="sms-wrap">
        {/* Ring */}
        <div className="sms-ring-wrap">
          <div className="sms-ring sms-r1" />
          <div className="sms-ring sms-r2" />
          <div className="sms-ring sms-r3" />
          <div className="sms-ring sms-r4" />
          <div className="sms-ticks" ref={ticksRef} />

          <div className="sms-orbit-track" />

          <div className="sms-orbit-container" ref={orbitRef}>
            {services.map((s, i) => (
              <div
                key={i}
                className="sms-orbit-item"
                style={{ marginLeft: '-23px', marginTop: '-23px' }}
              >
                <div
                  className="sms-orbit-icon"
                  style={{ borderColor: s.color + '33', boxShadow: `0 0 16px ${s.color}22` }}
                >
                  <span style={{ fontSize: '22px' }}>{s.emoji}</span>
                </div>
                <div className="sms-orbit-label" style={{ color: s.color + 'cc' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="sms-ring-center">
            <div className="sms-ring-logo">
              SMS<span>infra</span>
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="sms-brand-name">SMS&nbsp;<em>INFRA</em></div>
        <div className="sms-underline-wrap"><div className="sms-underline" /></div>
        <div className="sms-tagline">Turning Dreams Into Reality</div>

        {/* Progress */}
        <div className="sms-progress-area">
          <div className="sms-pct-row">
            <div className="sms-pct-n" ref={pnRef}>0</div>
            <div className="sms-pct-sym">%</div>
          </div>
          <div className="sms-seg-bar" ref={segsRef} />
          <div className="sms-thin-track">
            <div className="sms-thin-fill" ref={tfRef}>
              <div className="sms-glow-dot" />
            </div>
          </div>
          <div className="sms-status-row">
            <div className="sms-s-dot" />
            <div className="sms-s-msg" ref={smRef}>Initializing</div>
          </div>
        </div>
      </div>
    </div>
  );
}
