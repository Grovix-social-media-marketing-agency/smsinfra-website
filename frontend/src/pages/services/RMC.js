import React, { useEffect } from "react";
import "./RMC.css";
import { Link } from "react-router-dom";

import {
  Truck,
  ShieldCheck,
  FlaskConical,
  Building2,
  Factory,
  ArrowRight,
  Phone,
  BadgeCheck,
} from "lucide-react";

/* ============================================================
   ALL ENHANCED STYLES — injected at runtime, zero changes to
   RMC.css or any shared file
   ============================================================ */
const ENHANCED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

  .rmc-page { font-family: 'Poppins', sans-serif !important; }
  .rmc-page h1,
  .rmc-page h2,
  .rmc-page h3,
  .rmc-floating-card h3,
  .rmc-btn-primary,
  .rmc-btn-secondary,
  .rmc-tag,
  .rmc-section-title span,
  .rmc-process-number,
  .rmc-ticker-item {
    font-family: 'Poppins', sans-serif !important;
  }

  .rmc-page h1 { letter-spacing: -0.03em !important; }
  .rmc-page h2 { letter-spacing: -0.025em !important; }
  .rmc-section-title span { font-size: 0.62rem !important; letter-spacing: 0.20em !important; }

  /* Global noise grain — subtle film texture */
  .rmc-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    opacity: 0.026;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: overlay;
  }

  /* Custom cursor */
  .rmc-page { cursor: none !important; }
  .rmc-page a, .rmc-page button { cursor: none !important; }

  #_rmc_dot {
    position: fixed;
    width: 10px; height: 10px;
    background: #c8963e;
    border-radius: 50%;
    pointer-events: none;
    z-index: 100000;
    transform: translate(-50%,-50%);
    transition: width .3s cubic-bezier(.34,1.56,.64,1), height .3s cubic-bezier(.34,1.56,.64,1), opacity .3s;
    will-change: left, top;
  }
  #_rmc_ring {
    position: fixed;
    width: 36px; height: 36px;
    border: 1.5px solid rgba(200,150,62,.50);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%,-50%);
    transition: width .4s cubic-bezier(.34,1.56,.64,1), height .4s cubic-bezier(.34,1.56,.64,1), border-color .3s, opacity .3s;
    will-change: left, top;
  }
  .rmc-page:has(a:hover) #_rmc_dot,
  .rmc-page:has(button:hover) #_rmc_dot { width:5px; height:5px; }
  .rmc-page:has(a:hover) #_rmc_ring,
  .rmc-page:has(button:hover) #_rmc_ring { width:52px; height:52px; border-color:rgba(200,150,62,.75); }

  /* Morphing blobs on hero */
  @keyframes _morph {
    0%,100% { border-radius:42% 58% 60% 40%/52% 44% 56% 48%; }
    33%     { border-radius:60% 40% 44% 56%/38% 62% 38% 62%; }
    66%     { border-radius:50% 50% 34% 66%/60% 40% 60% 40%; }
  }
  .rmc-hero::before { animation: orbDrift1 20s ease-in-out infinite, _morph 15s ease-in-out infinite !important; }
  .rmc-hero::after  { animation: orbDrift2 24s ease-in-out infinite, _morph 18s ease-in-out infinite 4s !important; }

  /* Spotlight sweep */
  @keyframes _spot {
    0%,100%{ opacity:0; left:-22%; }
    15%    { opacity:1; }
    85%    { opacity:1; }
    90%    { opacity:0; left:110%; }
  }
  .rmc-hero-scanline::before {
    content:'';
    position:absolute; top:0; bottom:0;
    width:200px;
    background:linear-gradient(to right,transparent,rgba(200,150,62,.07) 40%,rgba(200,150,62,.14) 50%,rgba(200,150,62,.07) 60%,transparent);
    animation:_spot 10s ease-in-out infinite 1.5s;
  }

  /* Glitch on highlight */
  @keyframes _glitch {
    0%,96%,100%{ clip-path:none; transform:none; }
    97%{ clip-path:inset(30% 0 50% 0); transform:translateX(-4px) skewX(-2deg); filter:hue-rotate(40deg); }
    98%{ clip-path:inset(60% 0 10% 0); transform:translateX(4px) skewX(2deg); }
    99%{ clip-path:inset(10% 0 80% 0); transform:translateX(-2px); }
  }
  .rmc-highlight { animation: textShimmer 5s linear infinite 1.2s, _glitch 15s ease-in-out infinite 4s !important; }

  /* Hero image 3D hover */
  .rmc-hero-image::before, .rmc-hero-image::after {
    transition: width .4s cubic-bezier(.34,1.56,.64,1), height .4s cubic-bezier(.34,1.56,.64,1) !important;
  }
  .rmc-hero-image:hover::before, .rmc-hero-image:hover::after { width:80px!important; height:80px!important; }
  .rmc-hero-image img { transition: transform .7s cubic-bezier(.19,1,.22,1), box-shadow .7s ease !important; }
  .rmc-hero-image:hover img {
    transform: scale(1.03) rotateY(-3deg) rotateX(1deg) !important;
    box-shadow: 0 32px 80px rgba(100,80,40,.22), 0 0 60px rgba(200,150,62,.30), 0 0 0 1px rgba(200,150,62,.15) inset !important;
  }

  /* Floating cards stronger */
  .rmc-floating-card { transition: transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s ease !important; }
  .rmc-floating-card:hover {
    transform: scale(1.09) translateY(-5px) !important;
    box-shadow: 0 20px 60px rgba(0,0,0,.55), 0 0 30px rgba(200,150,62,.28) !important;
  }

  /* Ticker */
  @keyframes _tick { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
  .rmc-ticker-wrap {
    display: none;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg,#9d6d1e 0%,#c8963e 50%,#e8b96a 100%);
    padding: 13px 0;
    z-index: 5;
  }
  .rmc-ticker-wrap.rmc-ready { display:block; }
  .rmc-ticker-wrap::before, .rmc-ticker-wrap::after {
    content:''; position:absolute; top:0; bottom:0; width:100px; z-index:2; pointer-events:none;
  }
  .rmc-ticker-wrap::before { left:0;  background:linear-gradient(to right, rgba(100,65,10,.9),transparent); }
  .rmc-ticker-wrap::after  { right:0; background:linear-gradient(to left, rgba(220,175,100,.9),transparent); }
  .rmc-ticker { display:flex; width:max-content; animation:_tick 26s linear infinite; }
  .rmc-ticker-item {
    display:flex; align-items:center; gap:10px; padding:0 40px;
    font-size:.68rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
    color:rgba(255,255,255,.93); white-space:nowrap;
    font-family: 'Poppins', sans-serif !important;
  }
  .rmc-ticker-item::after { content:'◆'; font-size:.40rem; opacity:.55; }

  /* Scroll reveal — .rmc-ev classes, toggled by JS */
  .rmc-ev {
    opacity:0; transform:translateY(42px) scale(.98);
    transition:opacity .85s cubic-bezier(.19,1,.22,1), transform .85s cubic-bezier(.19,1,.22,1);
  }
  .rmc-ev.on { opacity:1; transform:translateY(0) scale(1); }

  .rmc-ev-left {
    opacity:0; transform:translateX(-50px) scale(.97);
    transition:opacity .85s cubic-bezier(.19,1,.22,1), transform .85s cubic-bezier(.19,1,.22,1);
  }
  .rmc-ev-left.on { opacity:1; transform:translateX(0) scale(1); }

  .rmc-ev-right {
    opacity:0; transform:translateX(50px) scale(.97);
    transition:opacity .85s cubic-bezier(.19,1,.22,1), transform .85s cubic-bezier(.19,1,.22,1);
  }
  .rmc-ev-right.on { opacity:1; transform:translateX(0) scale(1); }

  .rmc-ev-stagger > * {
    opacity:0; transform:translateY(32px);
    transition:opacity .65s cubic-bezier(.19,1,.22,1), transform .65s cubic-bezier(.19,1,.22,1);
  }
  .rmc-ev-stagger.on > *:nth-child(1){opacity:1;transform:none;transition-delay:.00s;}
  .rmc-ev-stagger.on > *:nth-child(2){opacity:1;transform:none;transition-delay:.08s;}
  .rmc-ev-stagger.on > *:nth-child(3){opacity:1;transform:none;transition-delay:.16s;}
  .rmc-ev-stagger.on > *:nth-child(4){opacity:1;transform:none;transition-delay:.24s;}
  .rmc-ev-stagger.on > *:nth-child(5){opacity:1;transform:none;transition-delay:.32s;}
  .rmc-ev-stagger.on > *:nth-child(6){opacity:1;transform:none;transition-delay:.40s;}
  .rmc-ev-stagger.on > *:nth-child(7){opacity:1;transform:none;transition-delay:.48s;}
  .rmc-ev-stagger.on > *:nth-child(8){opacity:1;transform:none;transition-delay:.56s;}
  .rmc-ev-stagger.on > *:nth-child(9){opacity:1;transform:none;transition-delay:.64s;}
  .rmc-ev-stagger.on > *:nth-child(10){opacity:1;transform:none;transition-delay:.72s;}

  /* Feature cards — bottom corner glow */
  .rmc-feature-card { overflow:hidden; }
  .rmc-feature-card::after {
    content:''; position:absolute; bottom:-60px; right:-60px;
    width:160px; height:160px;
    background:radial-gradient(circle,rgba(200,150,62,.14) 0%,transparent 70%);
    border-radius:50%; opacity:0;
    transition:opacity .5s ease,transform .5s cubic-bezier(.34,1.56,.64,1);
    transform:scale(.5);
  }
  .rmc-feature-card:hover::after { opacity:1; transform:scale(1); }
  .rmc-feature-card:hover { transform:translateY(-10px) rotateX(2deg) rotateY(-1deg) scale(1.01) !important; }

  /* Grade cards 3D */
  .rmc-grade-card {
    transform-style:preserve-3d;
    transition:transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .5s ease, border-color .5s ease, background .5s ease !important;
  }
  .rmc-grade-card:hover {
    border-color:var(--clr-gold) !important;
    transform:translateY(-8px) scale(1.03) rotateX(3deg) !important;
    background:linear-gradient(160deg,#fffcf5,#fff) !important;
  }

  /* App cards 3D */
  .rmc-app-card {
    transform-style:preserve-3d;
    transition:transform .6s cubic-bezier(.34,1.56,.64,1), box-shadow .6s ease !important;
  }
  .rmc-app-card:hover { transform:translateY(-8px) scale(1.02) rotateX(2deg) !important; }

  /* FAQ item */
  .rmc-faq-item:hover { transform:translateY(-4px) scale(1.008) !important; }
  .rmc-faq-item::before { transition:transform .6s cubic-bezier(.19,1,.22,1) !important; }

  /* Process number ring */
  .rmc-process-number { position:relative; }
  .rmc-process-number::after {
    content:''; position:absolute; inset:-7px; border-radius:50%;
    border:1.5px solid rgba(200,150,62,.30);
    transform:scale(.75); opacity:0;
    transition:transform .5s cubic-bezier(.34,1.56,.64,1), opacity .4s ease;
  }
  .rmc-process-card:hover .rmc-process-number::after { transform:scale(1.20); opacity:1; }
  .rmc-process-card:hover .rmc-process-number {
    transform:scale(1.18) translateY(-5px) !important;
    box-shadow:0 0 0 10px rgba(200,150,62,.10),0 8px 32px rgba(100,80,40,.13) !important;
  }

  /* CTA stripe rotate */
  @keyframes _stripeRot { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  .rmc-cta::before { animation:_stripeRot 55s linear infinite !important; }

  /* ============================================================
     TOUCH CURSOR EFFECTS — mobile app cards
     All state driven by CSS custom properties set via JS.
     ============================================================ */

  /* Touch-follow spotlight glow */
  .rmc-app-card .rmc-touch-glow {
    position: absolute; inset: 0; z-index: 3;
    pointer-events: none; border-radius: inherit; opacity: 0;
    background: radial-gradient(
      180px circle at calc(var(--gx, 50) * 1px) calc(var(--gy, 50) * 1px),
      rgba(200,150,62,0.42) 0%,
      rgba(200,150,62,0.12) 45%,
      transparent 75%
    );
    transition: opacity 0.22s ease;
    mix-blend-mode: screen;
  }
  .rmc-app-card.is-touching .rmc-touch-glow { opacity: 1; }

  /* 3D press-depth tilt — origin follows finger */
  .rmc-app-card.is-touching {
    transform-origin:
      calc((var(--tx, 0) + 0.5) * 100%)
      calc((var(--ty, 0) + 0.5) * 100%);
    transform:
      perspective(600px)
      rotateX(calc(var(--ty, 0) * -18deg))
      rotateY(calc(var(--tx, 0) *  18deg))
      scale(0.955) !important;
    transition: transform 0.10s ease, box-shadow 0.10s ease !important;
    box-shadow: 0 20px 60px rgba(100,80,40,.16), 0 0 40px rgba(200,150,62,0.22) !important;
  }
  .rmc-app-card.is-touching img {
    filter: saturate(1.15) brightness(0.80) !important;
    transform: scale(1.04) !important;
  }

  /* Spring-back + border flash on release */
  @keyframes _borderFlash {
    0%   { outline: 2px solid rgba(200,150,62,0.85); outline-offset: 0px; }
    100% { outline: 2px solid rgba(200,150,62,0);    outline-offset: 6px; }
  }
  .rmc-app-card.touch-release {
    transform: perspective(600px) rotateX(0deg) rotateY(0deg) scale(1) !important;
    transition: transform 0.65s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease !important;
    animation: _borderFlash 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  /* Long-press shimmer sweep */
  @keyframes _longShimmer {
    0%   { background-position: -260% center; opacity: 1; }
    100% { background-position:  260% center; opacity: 0; }
  }
  .rmc-app-card .rmc-touch-shimmer {
    position: absolute; inset: 0; z-index: 4;
    pointer-events: none; border-radius: inherit;
    background: linear-gradient(
      105deg,
      transparent            15%,
      rgba(255,223,120,0.60) 38%,
      rgba(200,150,62,0.40)  50%,
      rgba(255,223,120,0.60) 62%,
      transparent            85%
    );
    background-size: 260% 100%; opacity: 0;
  }
  .rmc-app-card.long-press-active .rmc-touch-shimmer {
    animation: _longShimmer 0.72s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  /* Long-press ring pulse on card border */
  @keyframes _longRing {
    0%   { box-shadow: 0 0 0 0   rgba(200,150,62,0.60), 0 8px 32px rgba(100,80,40,.13); }
    45%  { box-shadow: 0 0 0 8px rgba(200,150,62,0.28), 0 20px 60px rgba(100,80,40,.16); }
    100% { box-shadow: 0 0 0 18px rgba(200,150,62,0),   0 8px 32px rgba(100,80,40,.13); }
  }
  .rmc-app-card.long-press-active {
    animation: _longRing 0.68s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  /* SVG progress ring — injected by JS */
  .rmc-long-press-ring {
    position: absolute; top: 8px; right: 8px;
    width: 30px; height: 30px; z-index: 6;
    pointer-events: none; opacity: 0;
    transition: opacity 0.18s ease;
  }
  .rmc-app-card.is-long-pressing .rmc-long-press-ring { opacity: 1; }
  .rmc-long-press-ring circle {
    fill: none;
    stroke: rgba(232,185,106,1);
    stroke-width: 2.5; stroke-linecap: round;
    stroke-dasharray: 75.4;
    stroke-dashoffset: 75.4;
    transform-origin: 15px 15px;
    transform: rotate(-90deg);
    transition: stroke-dashoffset 0.60s linear;
  }
  .rmc-app-card.is-long-pressing .rmc-long-press-ring circle {
    stroke-dashoffset: 0;
  }

  /* Gyroscope parallax — image drifts with device tilt */
  .rmc-app-card.gyro-active img {
    transform: scale(1.08)
      translate(calc(var(--gyro-x, 0) * 1px), calc(var(--gyro-y, 0) * 1px)) !important;
    transition: transform 0.08s linear !important;
  }
  .rmc-app-card.is-touching.gyro-active img {
    filter: saturate(1.15) brightness(0.80) !important;
    transform: scale(1.06)
      translate(calc(var(--gyro-x, 0) * 0.5px), calc(var(--gyro-y, 0) * 0.5px)) !important;
  }

  /* Gold corner bracket — appears on touch */
  .rmc-app-card::before {
    content: '';
    position: absolute; top: 8px; left: 8px;
    width: 22px; height: 22px;
    border-top: 2px solid rgba(200,150,62,0.75);
    border-left: 2px solid rgba(200,150,62,0.75);
    border-radius: 3px 0 0 0;
    z-index: 4; pointer-events: none;
    opacity: 0;
    transform: scale(0.6) translate(-4px,-4px);
    transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
  }
  .rmc-app-card.is-touching::before {
    opacity: 1;
    transform: scale(1) translate(0,0);
  }

  /* Reduced motion — disable touch effects */
  @media (prefers-reduced-motion: reduce) {
    .rmc-page::before { display:none; }
    .rmc-ev,.rmc-ev-left,.rmc-ev-right { opacity:1!important; transform:none!important; }
    .rmc-ev-stagger > * { opacity:1!important; transform:none!important; }
    .rmc-ticker { animation:none!important; }
    #_rmc_dot,#_rmc_ring { display:none!important; }
    .rmc-page { cursor:auto!important; }
    .rmc-app-card.is-touching,
    .rmc-app-card.touch-release { transform:none!important; animation:none!important; }
  }

  /* Desktop: restore cursor, hide touch dots */
  @media (min-width:641px){
    .rmc-long-press-ring { display:none!important; }
    .rmc-touch-glow      { display:none!important; }
    .rmc-touch-shimmer   { display:none!important; }
  }

  /* Mobile: restore system cursor, simplify ticker */
  @media (max-width:640px){
    #_rmc_dot,#_rmc_ring { display:none!important; }
    .rmc-page,.rmc-page a,.rmc-page button { cursor:auto!important; }
    .rmc-ticker-item { padding:0 28px; font-size:.62rem; }
  }
`;

/* ── Ticker labels ── */
const TICKER_ITEMS = [
  "ISO Certified","Cube Tested","Quality Assured",
  "Reliable Delivery","Dedicated Site Plants",
  "IS Standard","24/7 Supply","In-House Lab",
  "Advanced Batching","Bangalore RMC",
];

/* ============================================================
   DATA
   ============================================================ */
const grades = [
  { grade: "M7.5", use: "Levelling course, lightweight base applications & non-structural works." },
  { grade: "M10",  use: "PCC works, pathways, flooring base and levelling applications." },
  { grade: "M15",  use: "Flooring and lightweight residential structures." },
  { grade: "M20",  use: "Residential slabs, beams, columns and foundations." },
  { grade: "M25",  use: "Commercial construction projects and RCC structures." },
  { grade: "M30",  use: "High-strength structural concrete and infrastructure works." },
  { grade: "M35",  use: "Industrial and heavy-duty reinforced concrete structures." },
  { grade: "M40",  use: "Premium commercial and infrastructure projects." },
  { grade: "M50",  use: "High-rise buildings, bridges and heavy-load structures." },
  { grade: "M60",  use: "Advanced infrastructure and ultra high-strength concrete applications." },
];

const features = [
  { icon: ShieldCheck,  title: "IS Standard Concrete",  desc: "Concrete designed and tested as per IS standards with uncompromised quality assurance." },
  { icon: FlaskConical, title: "In-House Laboratory",   desc: "Dedicated laboratory for regular quality inspection and material verification." },
  { icon: BadgeCheck,   title: "Cube Testing",          desc: "Regular cube testing and third-party verification for consistent strength." },
  { icon: Factory,      title: "Advanced Batching",     desc: "Process-driven automated systems ensuring precision and consistency." },
  { icon: Truck,        title: "Timely Delivery",       desc: "Efficient delivery network for fast and reliable concrete supply." },
  { icon: Building2,    title: "Dedicated Site Plants", desc: "Reliable supply support for large-scale infrastructure and commercial projects." },
];

const applications = [
  "Residential Buildings","Commercial Projects",
  "Apartments","Villas",
  "Warehouses","Road Infrastructure",
  "Industrial Structures","Foundations & Columns",
];

const processSteps = [
  "Raw Material Selection","Aggregate Testing",
  "Automated Batching","Precision Mixing",
  "Quality Verification","Transit Delivery",
];

const faqs = [
  {
    question: "What is Ready Mix Concrete?",
    answer: "Ready Mix Concrete (RMC) is factory-produced concrete manufactured with accurate mix proportions and delivered directly to construction sites.",
  },
  {
    question: "Which RMC grade is suitable for residential construction?",
    answer: "M20 and M25 grades are commonly used for residential slabs, columns, beams and foundations depending on structural requirements.",
  },
  {
    question: "How is concrete quality tested?",
    answer: "Concrete quality is tested through cube testing, material verification, and continuous in-house laboratory checks.",
  },
  {
    question: "Do you provide commercial concrete supply?",
    answer: "Yes, SMS Infra supplies Ready Mix Concrete for residential, commercial, industrial and infrastructure projects across Bangalore.",
  },
];

/* ============================================================
   INTERACTIONS HOOK
   ============================================================ */
function useRMCInteractions() {
  useEffect(() => {
    /* 1 — inject styles */
    const tag = document.createElement("style");
    tag.id = "_rmc_styles";
    tag.textContent = ENHANCED_STYLES;
    document.head.appendChild(tag);

    /* 2 — cursor elements */
    const dot  = Object.assign(document.createElement("div"), { id: "_rmc_dot"  });
    const ring = Object.assign(document.createElement("div"), { id: "_rmc_ring" });
    dot.setAttribute("aria-hidden","true");
    ring.setAttribute("aria-hidden","true");
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    /* 3 — cursor RAF loop */
    const touch = window.matchMedia("(max-width:640px)").matches || ("ontouchstart" in window);
    let mx = -300, my = -300, rx = -300, ry = -300, raf;

    const onMove  = (e) => { mx = e.clientX; my = e.clientY; };
    const onLeave = ()  => { dot.style.opacity = ring.style.opacity = "0"; };
    const onEnter = ()  => { dot.style.opacity = ring.style.opacity = "1"; };

    if (!touch) {
      document.addEventListener("mousemove",  onMove);
      document.addEventListener("mouseleave", onLeave);
      document.addEventListener("mouseenter", onEnter);
      const loop = () => {
        dot.style.left  = mx + "px";
        dot.style.top   = my + "px";
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.left = rx + "px";
        ring.style.top  = ry + "px";
        raf = requestAnimationFrame(loop);
      };
      loop();
    }

    /* 4 — scroll reveal (IntersectionObserver) */
    const revealEls = document.querySelectorAll(".rmc-ev,.rmc-ev-left,.rmc-ev-right,.rmc-ev-stagger");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -55px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    /* 5 — 3D tilt (desktop only) */
    const tiltEls = document.querySelectorAll(
      ".rmc-feature-card,.rmc-grade-card,.rmc-app-card,.rmc-faq-item"
    );
    const tiltMove  = (e) => {
      const el = e.currentTarget;
      const r  = el.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y*9}deg) rotateY(${x*9}deg) translateY(-8px) scale(1.02)`;
    };
    const tiltLeave = (e) => { e.currentTarget.style.transform = ""; };
    if (!touch) {
      tiltEls.forEach((el) => {
        el.addEventListener("mousemove",  tiltMove);
        el.addEventListener("mouseleave", tiltLeave);
      });
    }

    /* 6 — hero parallax */
    const vid  = document.querySelector(".rmc-hero-video");
    const grid = document.querySelector(".rmc-grid-overlay");
    let tick = false;
    const onScroll = () => {
      if (!tick) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (vid)  vid.style.transform  = `translateY(${y * 0.24}px)`;
          if (grid) grid.style.transform = `translateY(${y * 0.07}px)`;
          tick = false;
        });
        tick = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* 7 — ticker duplicate for seamless loop */
    const wrap   = document.querySelector(".rmc-ticker-wrap");
    const ticker = document.querySelector(".rmc-ticker");
    if (ticker && wrap) {
      ticker.innerHTML += ticker.innerHTML;
      wrap.classList.add("rmc-ready");
    }

    /* 8 — video pause on tab hidden */
    const vidEl = document.querySelector(".rmc-hero-video");
    const onVis = () => {
      if (!vidEl) return;
      document.hidden ? vidEl.pause() : vidEl.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    /* 9 — process number pop on viewport enter */
    const procNums = document.querySelectorAll(".rmc-process-number");
    const procIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.animation = "countUp .6s cubic-bezier(.16,1,.3,1) both";
          procIO.unobserve(e.target);
        }
      }),
      { threshold: 0.5 }
    );
    procNums.forEach((n) => procIO.observe(n));

    /* ──────────────────────────────────────────────────────────
       10 — TOUCH CURSOR EFFECTS (mobile app cards)
       ────────────────────────────────────────────────────────── */
    if (touch) {
      const LONG_MS  = 600;
      const GYRO_MAX = 14;
      const appCards = document.querySelectorAll(".rmc-app-card");

      /* 10a — inject helper elements */
      const svgNS = "http://www.w3.org/2000/svg";
      appCards.forEach((card) => {
        if (!card.querySelector(".rmc-touch-glow")) {
          const glow = document.createElement("span");
          glow.className = "rmc-touch-glow";
          card.appendChild(glow);
        }
        if (!card.querySelector(".rmc-touch-shimmer")) {
          const shimmer = document.createElement("span");
          shimmer.className = "rmc-touch-shimmer";
          card.appendChild(shimmer);
        }
        if (!card.querySelector(".rmc-long-press-ring")) {
          const svg    = document.createElementNS(svgNS, "svg");
          svg.setAttribute("viewBox", "0 0 30 30");
          svg.setAttribute("aria-hidden", "true");
          svg.classList.add("rmc-long-press-ring");
          const circle = document.createElementNS(svgNS, "circle");
          circle.setAttribute("cx", "15");
          circle.setAttribute("cy", "15");
          circle.setAttribute("r",  "12");
          svg.appendChild(circle);
          card.appendChild(svg);
        }
      });

      /* 10b — gyroscope parallax */
      const attachGyro = () => {
        window.addEventListener("deviceorientation", (e) => {
          const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
          const gx = (clamp(e.gamma || 0, -30, 30) / 30) * GYRO_MAX;
          const gy = (clamp(e.beta  || 0, -30, 30) / 30) * GYRO_MAX;
          appCards.forEach((card) => {
            card.style.setProperty("--gyro-x", gx.toFixed(2));
            card.style.setProperty("--gyro-y", gy.toFixed(2));
            card.classList.add("gyro-active");
          });
        }, { passive: true });
      };

      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        /* iOS 13+ — request on first touchend */
        document.addEventListener("touchend", async function askGyro() {
          document.removeEventListener("touchend", askGyro);
          try {
            const perm = await DeviceOrientationEvent.requestPermission();
            if (perm === "granted") attachGyro();
          } catch (_) { /* silent */ }
        }, { once: true });
      } else {
        attachGyro();
      }

      /* 10c — per-card touch tracking */
      const touchCleanups = [];

      appCards.forEach((card) => {
        let longTimer = null;

        const setVars = (t) => {
          const r  = card.getBoundingClientRect();
          const gx = t.clientX - r.left;
          const gy = t.clientY - r.top;
          card.style.setProperty("--gx", gx.toFixed(1));
          card.style.setProperty("--gy", gy.toFixed(1));
          card.style.setProperty("--tx", ((gx / r.width)  - 0.5).toFixed(4));
          card.style.setProperty("--ty", ((gy / r.height) - 0.5).toFixed(4));
        };

        const onStart = (e) => {
          setVars(e.touches[0]);
          card.classList.remove("touch-release", "long-press-active");
          card.classList.add("is-touching");

          longTimer = setTimeout(() => {
            card.classList.add("is-long-pressing");
            setTimeout(() => {
              card.classList.add("long-press-active");
              setTimeout(() => card.classList.remove("long-press-active"), 800);
            }, 620);
          }, LONG_MS);
        };

        const onMove = (e) => {
          setVars(e.touches[0]);
          clearTimeout(longTimer);
          card.classList.remove("is-long-pressing");
        };

        const onEnd = () => {
          clearTimeout(longTimer);
          card.classList.remove("is-touching", "is-long-pressing");
          card.classList.add("touch-release");
          setTimeout(() => card.classList.remove("touch-release"), 700);
        };

        card.addEventListener("touchstart",  onStart, { passive: true });
        card.addEventListener("touchmove",   onMove,  { passive: true });
        card.addEventListener("touchend",    onEnd,   { passive: true });
        card.addEventListener("touchcancel", onEnd,   { passive: true });

        touchCleanups.push(() => {
          card.removeEventListener("touchstart",  onStart);
          card.removeEventListener("touchmove",   onMove);
          card.removeEventListener("touchend",    onEnd);
          card.removeEventListener("touchcancel", onEnd);
        });
      });

      /* store cleanups for teardown */
      useRMCInteractions._touchCleanups = touchCleanups;
    }

    /* cleanup */
    return () => {
      tag.remove(); dot.remove(); ring.remove();
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      if (!touch) {
        tiltEls.forEach((el) => {
          el.removeEventListener("mousemove",  tiltMove);
          el.removeEventListener("mouseleave", tiltLeave);
        });
      }
      if (useRMCInteractions._touchCleanups) {
        useRMCInteractions._touchCleanups.forEach((fn) => fn());
        useRMCInteractions._touchCleanups = null;
      }
      io.disconnect();
      procIO.disconnect();
    };
  }, []);
}

/* ============================================================
   COMPONENT
   ============================================================ */
export default function RMC() {

  useRMCInteractions();

  return (
    <div className="rmc-page">

      {/* ── HERO ── */}
      <section className="rmc-hero">

        <div className="rmc-hero-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture={true}
            disableRemotePlayback={true}
            preload="auto"
            className="rmc-hero-video"
            style={{ pointerEvents: "none" }}
          >
            <source src="/rmc/rmc-hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="rmc-overlay"></div>
        </div>

        <div className="rmc-grid-overlay"></div>
        <div className="rmc-hero-scanline"></div>

        <div className="rmc-hero-container">

          {/* LEFT */}
          <div>
            <span className="rmc-tag">Ready Mix Concrete Bangalore</span>

            <h1>
              <span className="rmc-hero-line"><span>Engineered</span></span>
              <span className="rmc-hero-line">
                <span><span className="rmc-highlight">&nbsp;Concrete Solutions</span></span>
              </span>
              <span className="rmc-hero-line"><span>For Modern Construction</span></span>
            </h1>

            <p>
              SMS Infra delivers premium Ready Mix Concrete in Bangalore
              with high-performance batching systems, IS-standard quality
              testing, and reliable supply for residential, commercial,
              industrial and infrastructure construction projects.
            </p>

            <div className="rmc-btns">
              <Link to="/contact" className="rmc-btn-primary">
                Get Quote <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="rmc-btn-secondary">
                <Phone size={18} /> Contact Us
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="rmc-hero-image">
            <div className="rmc-glow"></div>
            <img src="/rmc/process-bg.png" alt="RMC Plant Bangalore" />
            <div className="rmc-floating-card rmc-card-1"><h3>30+</h3><p>Years Experience</p></div>
            <div className="rmc-floating-card rmc-card-2"><h3>100%</h3><p>IS Standard Tested</p></div>
            <div className="rmc-floating-card rmc-card-3"><h3>24/7</h3><p>Reliable Supply</p></div>
          </div>

        </div>
      </section>

      {/* ── TICKER STRIP ── */}
      <div className="rmc-ticker-wrap" aria-hidden="true">
        <div className="rmc-ticker">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="rmc-ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <section className="rmc-section-dark">
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="grid md:grid-cols-5 grid-cols-2 gap-6 text-center rmc-ev-stagger">
            {["ISO Certified","Cube Tested","Quality Assured","Reliable Delivery","Dedicated Site Plants"].map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="rmc-section">
        <div className="rmc-section-title rmc-ev">
          <span>About SMS Infra RMC</span>
          <h2>Trusted Ready Mix Concrete Suppliers In Bangalore</h2>
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="rmc-about-text rmc-ev">
            SMS Infra is one of the trusted Ready Mix Concrete suppliers in Bangalore delivering
            premium concrete solutions engineered for strength, durability and precision. Our
            state-of-the-art batching infrastructure, advanced quality control systems and
            process-driven operations ensure reliable concrete supply for residential buildings,
            commercial projects, industrial structures and infrastructure developments.
          </p>
          <p className="rmc-about-text rmc-ev">
            Our Ready Mix Concrete is manufactured using carefully tested raw materials and advanced
            batching systems that maintain consistent mix quality for every project. From M7.5 concrete
            to M60 high-strength concrete, SMS Infra provides reliable RMC solutions designed for modern
            construction requirements across Bangalore and surrounding regions.
          </p>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="rmc-section rmc-section-dark">
        <div className="rmc-section-title rmc-ev">
          <span>Why Choose SMS Infra</span>
          <h2>Engineering Precision With Reliable Concrete Solutions</h2>
        </div>
        <div className="rmc-features-grid rmc-ev-stagger">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="rmc-feature-card">
                <div className="rmc-feature-icon">
                  <Icon size={34} color="#facc15" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── GRADES ── */}
      <section className="rmc-section">
        <div className="rmc-section-title rmc-ev">
          <span>Concrete Grades</span>
          <h2>High-Strength Concrete Grades For Every Construction Need</h2>
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="rmc-about-text center rmc-ev">
            SMS Infra supplies multiple grades of Ready Mix Concrete including M7.5, M10, M15, M20,
            M25, M30, M35, M40, M50 and M60 concrete grades for residential, commercial and
            infrastructure construction projects in Bangalore.
          </p>
        </div>
        <div className="rmc-grades-grid rmc-ev-stagger">
          {grades.map((grade, index) => (
            <div key={index} className="rmc-grade-card">
              <div className="rmc-grade-watermark">{grade.grade}</div>
              <h3>{grade.grade}</h3>
              <p>{grade.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="rmc-section rmc-section-dark">
        <div className="rmc-section-title rmc-ev">
          <span>Manufacturing Process</span>
          <h2>Precision Manufacturing Workflow</h2>
        </div>
        <div className="rmc-process-grid rmc-ev-stagger">
          {processSteps.map((step, index) => (
            <div key={index} className="rmc-process-card">
              <div className="rmc-process-number">0{index + 1}</div>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="rmc-about-text center rmc-ev">
            Our Ready Mix Concrete manufacturing process follows advanced batching standards with precise
            aggregate testing, automated batching systems, cube testing and continuous quality verification
            to ensure superior concrete performance and long-lasting structural durability.
          </p>
        </div>
      </section>

      {/* ── APPLICATIONS ── */}
      <section className="rmc-section">
        <div className="rmc-section-title rmc-ev">
          <span>Applications</span>
          <h2>Concrete Solutions For Every Construction Need</h2>
        </div>
        <div className="rmc-app-grid rmc-ev-stagger">
          {applications.map((item, index) => (
            <div key={index} className="rmc-app-card">
              <img src={`/rmc/application-${index + 1}.png`} alt={item} />
              <div className="rmc-app-overlay"></div>
              <div className="rmc-app-content"><h3>{item}</h3></div>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="rmc-about-text center rmc-ev">
            SMS Infra Ready Mix Concrete is widely used for residential apartments, villas, warehouses,
            commercial buildings, industrial structures, foundations, roads and infrastructure developments
            requiring high-strength and reliable concrete performance.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rmc-section rmc-section-dark">
        <div className="rmc-section-title rmc-ev">
          <span>FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="rmc-faq-container rmc-ev-stagger">
          {faqs.map((faq, index) => (
            <div key={index} className="rmc-faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="rmc-cta">
        <div className="rmc-cta-bg">
          <img src="/rmc/process-bg.png" alt="Ready Mix Concrete Bangalore" />
          <div className="rmc-cta-overlay"></div>
        </div>
        <div className="rmc-cta-content rmc-ev">
          <span className="rmc-tag">Build With Confidence</span>
          <h2>Build Stronger Foundations With SMS INFRA RMC</h2>
          <p>
            Choose SMS Infra for premium Ready Mix Concrete in Bangalore engineered for strength,
            durability, quality assurance and reliable project execution across every stage of construction.
          </p>
          <div className="rmc-btns">
            <Link to="/contact" className="rmc-btn-primary">
              Start Your Project <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="rmc-btn-secondary">
              <Phone size={18} /> Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}