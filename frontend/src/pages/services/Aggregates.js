import React, { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  Factory,
  Layers3,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Building2,
  Mountain,
  Workflow,
  HardHat,
  Construction,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Aggregates.css";

// ─── API ──────────────────────────────────────────────────────────────────────
const API = (process.env.REACT_APP_API_URL || "https://smsinfra-website.onrender.com").replace(/\/api$/, "");

// ─── Static fallbacks (original hardcoded data) ───────────────────────────────
const fallbackAggregateSizes = [
  {
    size: "6MM",
    title: "Fine Grade Aggregates",
    uses: ["Tile Bedding", "Fine Concrete", "Precast Products", "Paver Applications"],
    desc: "Uniformly graded aggregates engineered for smooth concrete flow and precision finishing applications.",
    image: "/aggregates/6mm.png",
  },
  {
    size: "12MM",
    title: "RCC Aggregates",
    uses: ["RCC Works", "Residential Structures", "Slabs & Beams", "Columns"],
    desc: "High-bonding cubical aggregates designed for reinforced concrete structures and durable load distribution.",
    image: "/aggregates/12mm.png",
  },
  {
    size: "20MM",
    title: "Structural Aggregates",
    uses: ["Commercial Buildings", "Heavy Foundations", "Industrial Structures", "Concrete Roads"],
    desc: "Superior-strength aggregates providing enhanced structural stability and long-term durability.",
    image: "/aggregates/20mm.png",
  },
  {
    size: "40MM",
    title: "Infrastructure Aggregates",
    uses: ["Road Works", "Mass Concreting", "Infrastructure Projects", "Drainage Works"],
    desc: "Heavy-duty aggregates ideal for infrastructure projects demanding maximum load-bearing capacity.",
    image: "/aggregates/40mm.png",
  },
];

const fallbackProcessSteps = [
  { title: "Raw Stone Sourcing", desc: "Premium raw stones sourced from trusted quarries for consistent material quality.",    icon: Mountain,    image: "/aggregates/raw.png" },
  { title: "Jaw Crushing",       desc: "Primary crushing for optimized material sizing and uniform reduction.",                icon: Factory,     image: "/aggregates/jaw-crusher.png" },
  { title: "Cone Crushing",      desc: "Secondary crushing process ensuring precise aggregate formation.",                     icon: Workflow,    image: "/aggregates/cone-crusher.png" },
  { title: "VSI Shaping",        desc: "Vertical Shaft Impactor technology creates cubical particles with minimal flakiness.", icon: Layers3,     image: "/aggregates/vsi-machine.png" },
  { title: "Quality Testing",    desc: "Strict IS-standard testing for gradation, strength, and consistency.",                icon: ShieldCheck, image: "/aggregates/screening-uni.png" },
];

const fallbackBenefits = [
  "Improved Concrete Strength",
  "Reduced Voids & Segregation",
  "Enhanced Load Distribution",
  "Superior Durability",
  "Better Concrete Workability",
  "Reduced Cement Consumption",
];

const fallbackApplications = [
  { title: "Residential Buildings",  image: "/aggregates/application-residential.png" },
  { title: "Commercial Projects",     image: "/aggregates/application-commercial.png" },
  { title: "Road & Highway Projects", image: "/aggregates/application-road.png" },
  { title: "Industrial Foundations",  image: "/aggregates/application-industrial.png" },
  { title: "Infrastructure Projects", image: "/aggregates/application-infra.png" },
  { title: "RCC Structures",          image: "/aggregates/application-rcc.png" },
];

const fallbackFaqData = [
  { q: "What are construction aggregates?",               a: "Construction aggregates are crushed stones used in concrete, RCC works, road construction, foundations, and infrastructure projects." },
  { q: "What aggregate sizes are available?",             a: "SMS Infra supplies premium 6MM, 12MM, 20MM, and 40MM blue metal aggregates for different construction applications." },
  { q: "Are your aggregates IS certified?",               a: "Yes. Our aggregates conform to IS 383-2016 quality standards for superior construction performance." },
  { q: "Why are VSI-shaped aggregates better?",           a: "VSI shaping creates cubical aggregates with reduced flaky particles, improving concrete strength and durability." },
  { q: "Do you provide bulk aggregate supply in Bangalore?", a: "Yes. We provide reliable bulk aggregate supply and delivery across Bangalore and nearby regions." },
];

// ─── Icon map for backend iconName strings ────────────────────────────────────
const ICON_MAP = { Mountain, Factory, Workflow, Layers3, ShieldCheck, Truck, HardHat, Construction, BadgeCheck, Building2, CheckCircle2 };

/* ───────────────────────────────────────────────────────────────
   ProcessWheel — radial spoke diagram for BOTH desktop & mobile
─────────────────────────────────────────────────────────────── */
const ProcessWheel = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(null);
  const [visible, setVisible] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);
  const sectionRef = useRef(null);
  const autoTimer = useRef(null);
  const total = steps.length;

  /* Desktop wheel dimensions */
  const D_RADIUS = 220;
  const D_SVG = (D_RADIUS + 110) * 2;

  /* Mobile wheel dimensions — smaller but still radial */
  const M_RADIUS = 130;
  const M_SVG = (M_RADIUS + 80) * 2;

  const getAngleDeg = (i) => (360 / total) * i - 90;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    autoTimer.current = setInterval(() => {
      setAutoIndex((p) => (p + 1) % total);
    }, 2200);
    return () => clearInterval(autoTimer.current);
  }, [visible, total]);

  const current = hoveredStep !== null ? hoveredStep : (activeStep !== null ? activeStep : autoIndex);

  const handleClick = (i) => {
    clearInterval(autoTimer.current);
    setActiveStep(activeStep === i ? null : i);
  };

  const handleMouseEnter = (i) => {
    clearInterval(autoTimer.current);
    setHoveredStep(i);
  };

  const handleMouseLeave = () => {
    setHoveredStep(null);
    autoTimer.current = setInterval(() => {
      setAutoIndex((p) => (p + 1) % total);
    }, 2200);
  };

  /* Shared wheel renderer — used for both desktop and mobile */
  const renderWheel = (RADIUS, SVG_SIZE, nodeSize, imgSize, hubSize, isMobile) => (
    <div
      className={`pw-wheel-wrap${isMobile ? " pw-mobile" : " pw-desktop"}${visible ? " pw-in" : ""}`}
      style={{ width: SVG_SIZE, height: SVG_SIZE, maxWidth: "100%" }}
    >
      {/* SVG layer */}
      <svg
        className="pw-svg"
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer dashed orbit */}
        <circle
          cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={RADIUS}
          className="pw-orbit-ring pw-orbit-outer"
        />
        {/* Inner subtle ring */}
        <circle
          cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={RADIUS * 0.48}
          className="pw-orbit-ring pw-orbit-inner"
        />
        {/* Spokes */}
        {steps.map((_, i) => {
          const rad = (getAngleDeg(i) * Math.PI) / 180;
          const x2 = SVG_SIZE / 2 + RADIUS * Math.cos(rad);
          const y2 = SVG_SIZE / 2 + RADIUS * Math.sin(rad);
          return (
            <line
              key={i}
              x1={SVG_SIZE / 2} y1={SVG_SIZE / 2}
              x2={x2} y2={y2}
              className={`pw-spoke${current === i ? " pw-spoke-on" : ""}`}
              style={{ "--delay": `${i * 0.08}s` }}
            />
          );
        })}
        {/* Active arc highlight */}
        {steps.map((_, i) => {
          if (current !== i) return null;
          const startDeg = getAngleDeg(i) - 18;
          const endDeg = getAngleDeg(i) + 18;
          const toRad = (d) => (d * Math.PI) / 180;
          const x1 = SVG_SIZE / 2 + RADIUS * Math.cos(toRad(startDeg));
          const y1 = SVG_SIZE / 2 + RADIUS * Math.sin(toRad(startDeg));
          const x2 = SVG_SIZE / 2 + RADIUS * Math.cos(toRad(endDeg));
          const y2 = SVG_SIZE / 2 + RADIUS * Math.sin(toRad(endDeg));
          return (
            <path
              key={`arc-${i}`}
              d={`M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}`}
              className="pw-arc-highlight"
            />
          );
        })}
      </svg>

      {/* Hub */}
      <div className="pw-hub" style={{ width: hubSize, height: hubSize, marginLeft: -hubSize / 2, marginTop: -hubSize / 2 }}>
        <div className="pw-hub-ring pw-hub-ring-1" />
        <div className="pw-hub-ring pw-hub-ring-2" />
        <div className="pw-hub-core">
          <Factory size={isMobile ? 16 : 22} strokeWidth={1.5} />
          <span>SMS Infra</span>
        </div>
      </div>

      {/* Center info label */}
      <div
        className="pw-center-label"
        key={`label-${current}`}
        style={{ marginTop: isMobile ? hubSize * 0.65 : hubSize * 0.6 }}
      >
        <span className="pw-cl-num">0{current + 1}</span>
        <strong>{steps[current]?.title}</strong>
        {!isMobile && <p>{steps[current]?.desc}</p>}
      </div>

      {/* Nodes */}
      {steps.map((step, i) => {
        const angleDeg = getAngleDeg(i);
        const rad = (angleDeg * Math.PI) / 180;
        // Support both Lucide component (icon) and string iconName from backend
        const Icon = step.icon || ICON_MAP[step.iconName] || ShieldCheck;
        const isActive = current === i;
        const cx = 50 + (RADIUS / (SVG_SIZE / 2)) * 50 * Math.cos(rad);
        const cy = 50 + (RADIUS / (SVG_SIZE / 2)) * 50 * Math.sin(rad);

        return (
          <button
            key={i}
            className={`pw-node${isActive ? " pw-node-on" : ""}${visible ? " pw-node-in" : ""}`}
            style={{
              left: `${cx}%`,
              top: `${cy}%`,
              "--delay": `${0.35 + i * 0.1}s`,
            }}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            title={step.title}
          >
            <div
              className="pw-node-img"
              style={{ width: nodeSize, height: nodeSize }}
            >
              {step.image
                ? <img src={step.image} alt={step.title} style={{ width: imgSize, height: imgSize }} />
                : <Icon size={isMobile ? 16 : 22} strokeWidth={1.5} />}
            </div>
            <div className="pw-node-tag">
              <span className="pw-node-idx">0{i + 1}</span>
              <span className="pw-node-name">{step.title}</span>
            </div>
          </button>
        );
      })}

      {/* Mobile: show desc below wheel for active step */}
      {isMobile && (
        <div className="pw-mobile-desc" key={`mdesc-${current}`}>
          <p>{steps[current]?.desc}</p>
        </div>
      )}
    </div>
  );

  return (
    <div ref={sectionRef} className="pw-root">
      {/* Desktop wheel */}
      <div className="pw-show-desktop">
        {renderWheel(D_RADIUS, D_SVG, 80, 52, 64, false)}
      </div>
      {/* Mobile wheel — same radial design, smaller */}
      <div className="pw-show-mobile">
        {renderWheel(M_RADIUS, M_SVG, 58, 36, 46, true)}
      </div>

      <style>{`
        /* ── Root ── */
        .pw-root { width: 100%; margin: 48px 0 0; }

        .pw-show-desktop { display: none; }
        .pw-show-mobile  { display: flex; flex-direction: column; align-items: center; }

        @media (min-width: 768px) {
          .pw-show-desktop { display: flex; justify-content: center; }
          .pw-show-mobile  { display: none; }
        }

        /* ── Wheel Wrapper ── */
        .pw-wheel-wrap {
          position: relative;
          margin: 0 auto;
        }

        /* SVG */
        .pw-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* Orbit rings */
        .pw-orbit-ring {
          fill: none;
          stroke-width: 1.2;
          stroke-dasharray: 5 4;
        }
        .pw-orbit-outer {
          stroke: rgba(180,150,80,0.22);
          animation: pw-orbit-spin 60s linear infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .pw-orbit-inner {
          stroke: rgba(180,150,80,0.1);
        }
        @keyframes pw-orbit-spin {
          to { stroke-dashoffset: -200; }
        }

        /* Arc highlight */
        .pw-arc-highlight {
          fill: none;
          stroke: rgba(200,160,60,0.7);
          stroke-width: 3;
          stroke-linecap: round;
          filter: drop-shadow(0 0 6px rgba(200,160,60,0.5));
          animation: pw-arc-in 0.35s ease both;
        }
        @keyframes pw-arc-in {
          from { opacity: 0; stroke-dashoffset: 40; }
          to   { opacity: 1; stroke-dashoffset: 0; }
        }

        /* Spokes */
        .pw-spoke {
          stroke: rgba(180,150,80,0.14);
          stroke-width: 1.1;
          stroke-dasharray: 4 3;
          transition: stroke 0.35s, stroke-width 0.35s;
        }
        .pw-spoke.pw-spoke-on {
          stroke: rgba(200,160,60,0.65);
          stroke-width: 1.8;
          stroke-dasharray: none;
          filter: drop-shadow(0 0 4px rgba(200,160,60,0.4));
        }
        .pw-in .pw-spoke {
          animation: pw-spoke-draw 0.6s ease forwards;
          animation-delay: var(--delay, 0s);
        }
        @keyframes pw-spoke-draw {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Hub */
        .pw-hub {
          position: absolute;
          top: 50%; left: 50%;
          z-index: 10;
          border-radius: 50%;
        }
        .pw-hub-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(180,150,80,0.22);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: pw-ring-pulse 3s ease-in-out infinite;
        }
        .pw-hub-ring-1 { width: 110%; height: 110%; animation-delay: 0s; }
        .pw-hub-ring-2 { width: 135%; height: 135%; animation-delay: 1.1s; opacity: 0.5; }
        @keyframes pw-ring-pulse {
          0%, 100% { opacity: 0.25; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 0.6;  transform: translate(-50%,-50%) scale(1.06); }
        }
        .pw-hub-core {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          border: 2px solid rgba(180,150,80,0.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          color: #c8a040;
          box-shadow: 0 0 28px rgba(180,150,80,0.18), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .pw-hub-core span {
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(200,160,60,0.75);
          white-space: nowrap;
        }

        /* Center label */
        .pw-center-label {
          position: absolute;
          top: 50%; left: 50%;
          transform: translateX(-50%);
          width: 130px;
          text-align: center;
          pointer-events: none;
          animation: pw-fade-up 0.38s ease both;
          z-index: 5;
        }
        @keyframes pw-fade-up {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .pw-cl-num {
          display: block;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: rgba(200,160,60,0.55);
          margin-bottom: 3px;
        }
        .pw-center-label strong {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #e8e0cc;
          line-height: 1.35;
          margin-bottom: 4px;
        }
        .pw-center-label p {
          font-size: 9.5px;
          color: rgba(220,210,190,0.5);
          line-height: 1.5;
          margin: 0;
        }

        /* Mobile desc (below wheel) */
        .pw-mobile-desc {
          margin-top: 16px;
          text-align: center;
          max-width: 280px;
          animation: pw-fade-up 0.4s ease both;
        }
        .pw-mobile-desc p {
          font-size: 12.5px;
          color: rgba(220,210,190,0.6);
          line-height: 1.6;
          margin: 0;
        }

        /* Nodes */
        .pw-node {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.45s;
        }
        .pw-node.pw-node-in {
          opacity: 1;
          animation: pw-node-pop 0.52s cubic-bezier(0.34,1.56,0.64,1) both;
          animation-delay: var(--delay, 0s);
        }
        @keyframes pw-node-pop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.35); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        /* Node image circle */
        .pw-node-img {
          border-radius: 50%;
          background: linear-gradient(145deg, #262626, #1c1c1c);
          border: 2px solid rgba(180,150,80,0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: border-color 0.32s, box-shadow 0.32s, transform 0.32s;
          box-shadow: 0 5px 18px rgba(0,0,0,0.4);
          flex-shrink: 0;
        }
        .pw-node-img img {
          object-fit: cover;
          border-radius: 50%;
          filter: brightness(0.88) saturate(0.82);
          transition: filter 0.32s, transform 0.32s;
        }

        .pw-node.pw-node-on .pw-node-img,
        .pw-node:hover .pw-node-img {
          border-color: rgba(200,160,60,0.85);
          box-shadow: 0 0 22px rgba(200,160,60,0.38), 0 5px 18px rgba(0,0,0,0.55);
          transform: scale(1.14);
        }
        .pw-node.pw-node-on .pw-node-img img,
        .pw-node:hover .pw-node-img img {
          filter: brightness(1.08) saturate(1.15);
        }

        /* Node label tag */
        .pw-node-tag {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .pw-node-idx {
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: rgba(200,160,60,0.48);
        }
        .pw-node-name {
          font-size: 9.5px;
          font-weight: 600;
          color: rgba(230,220,200,0.65);
          text-align: center;
          max-width: 76px;
          line-height: 1.25;
          white-space: nowrap;
        }
        .pw-node.pw-node-on .pw-node-name {
          color: #c8a040;
        }

        /* Mobile node tag — hide to save space */
        .pw-mobile .pw-node-tag {
          display: none;
        }
        .pw-mobile .pw-node-img {
          box-shadow: 0 3px 12px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
};

/* ───────────────────────────────────────────────────────────────
   Main Component
─────────────────────────────────────────────────────────────── */
const Aggregates = () => {
  const navigate = useNavigate();

  // ── Backend data ─────────────────────────────────────────────
  const [pageData, setPageData]     = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/servicepages/aggregates`)
      .then((r) => r.json())
      .then((d) => { setPageData(d); setDataLoaded(true); })
      .catch(() => setDataLoaded(true)); // silently fall back to hardcoded
  }, []);

  // ── Derived data: backend first, original hardcoded as fallback ──
  const heroTag      = pageData?.heroTag      || "Premium Blue Metal Aggregates";
  const heroTitle    = pageData?.heroTitle    || "Premium Construction Aggregates Suppliers in Bangalore";
  const heroSubtitle = pageData?.heroSubtitle || "SMS Infra delivers high-strength construction aggregates manufactured using advanced VSI crushing technology for superior concrete durability, structural stability, and long-lasting performance across residential, commercial, industrial, and infrastructure projects.";
  const heroBgImage  = pageData?.heroBgImage  || "/aggregates/aggregates-hero-bg.png";

  const trustItems = pageData?.trustItems?.length
    ? pageData.trustItems
    : [
        { value: "30+",  label: "Years Industry Experience" },
        { value: "IS",   label: "383-2016 Standard Materials" },
        { value: "24/7", label: "Reliable Bulk Supply" },
        { value: "100%", label: "Quality Tested Aggregates" },
      ];

  const aboutTag    = pageData?.aboutTag   || "ABOUT OUR AGGREGATES";
  const aboutTitle  = pageData?.aboutTitle || "Engineered for Superior Construction Performance";
  const aboutPara1  = pageData?.aboutPara1 || "SMS Infra manufactures premium-quality construction aggregates using advanced three-stage crushing and VSI shaping technology for superior particle consistency, high compression strength, and exceptional concrete bonding performance.";
  const aboutPara2  = pageData?.aboutPara2 || "Our aggregates conform to IS 383-2016 standards and are widely used across residential, commercial, RCC, infrastructure, and industrial construction projects throughout Bangalore and nearby regions.";
  const aboutImage  = pageData?.aboutImage || "/aggregates/about-aggregates.png";
  const aboutPoints = pageData?.aboutPoints?.length
    ? pageData.aboutPoints
    : ["Cubical Aggregate Formation", "Reduced Flaky Particles", "Better Concrete Durability", "Superior Load Distribution"];

  const aggregateSizes = pageData?.serviceItems?.length
    ? pageData.serviceItems.map((item, i) => ({
        size:  item.title?.split(" ")[0] || item.title,
        title: item.title,
        desc:  item.desc,
        uses:  fallbackAggregateSizes[i]?.uses || [],
        image: item.image || fallbackAggregateSizes[i]?.image || "",
      }))
    : fallbackAggregateSizes;

  const processSteps = pageData?.processSteps?.length
    ? pageData.processSteps.map((step, i) => ({
        ...step,
        image:    step.image    || fallbackProcessSteps[i]?.image    || "",
        iconName: step.iconName || step.icon   || fallbackProcessSteps[i]?.iconName || "ShieldCheck",
        icon:     fallbackProcessSteps[i]?.icon || ShieldCheck,
      }))
    : fallbackProcessSteps;

  const benefitsTag   = pageData?.featuresHeading || "WHY CUBICAL AGGREGATES";
  const benefitsTitle = pageData?.featuresTitle   || "Advantages of VSI-Shaped Aggregates";
  const benefitsDesc  = pageData?.featuresDesc    || "Our advanced VSI shaping process produces premium cubical aggregates with superior bonding properties, reduced segregation, and improved structural performance in concrete applications.";
  const benefits      = pageData?.features?.length
    ? pageData.features.map((f) => f.title)
    : fallbackBenefits;
  const benefitsImage = pageData?.heroRightImage || "/aggregates/vsi-machine.png";

  const appsHeading  = pageData?.applicationsHeading || "APPLICATIONS";
  const appsTitle    = pageData?.applicationsTitle   || "Construction Applications";
  const applications = pageData?.applications?.length
    ? pageData.applications.map((a, i) => ({
        title: a.label || a.title,
        image: (a.image || a.img) || fallbackApplications[i]?.image || "",
      }))
    : fallbackApplications;

  const faqData = pageData?.faqs?.length
    ? pageData.faqs.map((f) => ({ q: f.question, a: f.answer }))
    : fallbackFaqData;

  const ctaTag   = pageData?.ctaTag      || "BUILD STRONGER STRUCTURES";
  const ctaTitle = pageData?.ctaTitle    || "Looking for Premium Construction Aggregates Suppliers in Bangalore?";
  const ctaDesc  = pageData?.ctaSubtitle || "Partner with SMS Infra for high-performance blue metal aggregates engineered for superior concrete strength, durability, and long-term structural reliability.";
  const ctaBtn1  = pageData?.ctaBtnPrimary   || "Request Quote";
  const ctaBtn2  = pageData?.ctaBtnSecondary || "Contact Us";

  // ── Scroll Reveal — comprehensive coverage of all page elements ──
  useEffect(() => {
    if (!dataLoaded) return;
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll(
        // Hero section
        ".aggregates-hero-left, " +
        ".hero-badge, " +
        ".aggregates-hero h1, " +
        ".aggregates-hero p, " +
        ".hero-mini-features, " +
        // Trust strip
        ".trust-strip, " +
        ".trust-card, " +
        // About section
        ".aggregates-about, " +
        ".about-image, .about-content, " +
        ".about-features div, " +
        // Aggregate sizes
        ".aggregate-sizes .section-heading, " +
        ".aggregate-card, " +
        // Process section
        ".process-section .section-heading, " +
        ".pw-root, " +
        // Benefits
        ".benefits-section, .benefits-left, .benefits-right, " +
        ".benefit-item, " +
        ".benefits-left span, .benefits-left h2, .benefits-left p, " +
        // Applications
        ".applications-section .section-heading, " +
        ".application-card, " +
        // Quality
        ".quality-section, .quality-content, .quality-image, " +
        ".quality-content span, .quality-content h2, .quality-content p, " +
        ".quality-grid div, " +
        // Logistics
        ".logistics-section .section-heading, " +
        ".logistics-card, " +
        // FAQ
        ".faq-section--aggregates .section-heading, " +
        ".faq-section--aggregates__card, " +
        // CTA
        ".aggregates-cta .cta-wrapper, " +
        ".aggregates-cta span, .aggregates-cta h2, .aggregates-cta p, .cta-buttons"
      );

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
      );

      targets.forEach((el) => io.observe(el));

      return () => io.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [dataLoaded]);

  // ── Magnetic Hover ──────────────────────────────────────────
  useEffect(() => {
    if (!dataLoaded) return;
    const magneticEls = document.querySelectorAll("[data-magnetic]");
    const handlers = [];
    magneticEls.forEach((el) => {
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${x}px, ${y}px)`;
      };
      const onLeave = () => { el.style.transform = "translate(0,0)"; };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      handlers.push({ el, onMove, onLeave });
    });
    return () => {
      handlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [dataLoaded]);

  // ── Cursor Spotlight ────────────────────────────────────────
  useEffect(() => {
    if (!dataLoaded) return;
    const spotlightEls = document.querySelectorAll("[data-spotlight]");
    const handlers = [];
    spotlightEls.forEach((el) => {
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--spotlight-x", e.clientX - r.left + "px");
        el.style.setProperty("--spotlight-y", e.clientY - r.top + "px");
      };
      el.addEventListener("mousemove", onMove);
      handlers.push({ el, onMove });
    });
    return () => {
      handlers.forEach(({ el, onMove }) => {
        el.removeEventListener("mousemove", onMove);
      });
    };
  }, [dataLoaded]);

  // ── 3D Card Tilt ────────────────────────────────────────────
  useEffect(() => {
    if (!dataLoaded) return;
    const cards = document.querySelectorAll(
      ".aggregate-card, .logistics-card"
    );
    const handlers = [];
    cards.forEach((card) => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `
          translateY(-12px) scale(1.015)
          rotateX(${-cy * 6}deg)
          rotateY(${cx * 6}deg)
        `;
      };
      const onLeave = () => { card.style.transform = ""; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push({ card, onMove, onLeave });
    });
    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [dataLoaded]);

  // ── Trust Card Number Counter ────────────────────────────────
  useEffect(() => {
    if (!dataLoaded) return;
    const countEls = document.querySelectorAll(".trust-card h2");
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            const text = el.textContent.trim();

            // FIX: skip animation for values containing "/" (e.g. "24/7")
            // or values with no numeric content at all (e.g. "IS")
            const hasSlash = text.includes("/");
            const num = parseFloat(text.replace(/[^0-9.]/g, ""));

            if (!isNaN(num) && !hasSlash) {
              const suffix = text.replace(/[0-9.]/g, "");
              let start = 0;
              const dur = 1400;
              const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / dur, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * num) + suffix;
                if (progress < 1) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
            }
            // else: leave "24/7" and "IS" exactly as-is

            countIO.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    countEls.forEach((el) => countIO.observe(el));
    return () => countIO.disconnect();
  }, [dataLoaded]);

  return (
    <div className="aggregates-page">
      {/* HERO SECTION */}
      <section
        className="aggregates-hero"
        style={{
          backgroundImage: `url('${heroBgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="aggregates-grid-overlay"></div>
        <div className="aggregates-gradient-overlay"></div>

        <div className="floating-particles">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>

        <div className="container">
          <div className="aggregates-hero-content">
            <div className="aggregates-hero-left">
              <span className="hero-badge">{heroTag}</span>
              <h1 style={{ fontSize: "clamp(26px, 4vw, 52px)" }}>{heroTitle}</h1>
              <p>{heroSubtitle}</p>
              <div className="hero-mini-features">
                <div><BadgeCheck size={18} />IS 383-2016 Certified</div>
                <div><Layers3 size={18} />VSI Cubical Technology</div>
                <div><Truck size={18} />Fast Bulk Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            {trustItems.map((item, i) => (
              <div className="trust-card" key={i}>
                <h2>{item.value}</h2>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="aggregates-about">
        <div className="container">
          <div className="section-heading">
            <span>{aboutTag}</span>
            <h2>{aboutTitle}</h2>
          </div>
          <div className="about-grid">
            <div className="about-image">
              <img src={aboutImage} alt="Construction Aggregates" />
            </div>
            <div className="about-content">
              {aboutPara1 && <p>{aboutPara1}</p>}
              {aboutPara2 && <p>{aboutPara2}</p>}
              <div className="about-features">
                {aboutPoints.map((pt, i) => (
                  <div key={i}><CheckCircle2 size={18} />{pt}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AGGREGATE SIZES */}
      <section className="aggregate-sizes">
        <div className="container">
          <div className="section-heading center">
            <span>{pageData?.servicesHeading || "PRODUCT RANGE"}</span>
            <h2>{pageData?.servicesTitle || "Available Aggregate Sizes"}</h2>
          </div>
          <div className="aggregate-grid">
            {aggregateSizes.map((item, index) => (
              <div
                className="aggregate-card"
                key={index}
                style={{ "--card-delay": `${index * 0.12}s` }}
              >
                <div className="aggregate-image">
                  <img src={item.image} alt={item.title} />
                  <div className="aggregate-overlay"></div>
                  <h3>{item.size}</h3>
                </div>
                <div className="aggregate-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                  {item.uses?.length > 0 && (
                    <ul>
                      {item.uses.map((use, idx) => (
                        <li key={idx}><ChevronRight size={16} />{use}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — Radial Wheel */}
      <section className="process-section">
        <div className="container">
          <div className="section-heading center">
            <span>{pageData?.processHeading || "MANUFACTURING PROCESS"}</span>
            <h2>{pageData?.processTitle || "Advanced 3-Stage Crushing Technology"}</h2>
          </div>
          <ProcessWheel steps={processSteps} />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-wrapper">
            <div className="benefits-left">
              <span>{benefitsTag}</span>
              <h2>{benefitsTitle}</h2>
              <p>{benefitsDesc}</p>
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div
                    className="benefit-item"
                    key={index}
                    style={{ "--item-delay": `${index * 0.08}s` }}
                  >
                    <CheckCircle2 size={20} />{benefit}
                  </div>
                ))}
              </div>
            </div>
            <div className="benefits-right">
              <img src={benefitsImage} alt="Cubical Aggregates" />
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="applications-section">
        <div className="container">
          <div className="section-heading center">
            <span>{appsHeading}</span>
            <h2>{appsTitle}</h2>
          </div>
          <div className="applications-grid">
            {applications.map((app, index) => (
              <div
                className="application-card"
                key={index}
                style={{ "--card-delay": `${index * 0.1}s` }}
              >
                <img src={app.image} alt={app.title} />
                <div className="application-overlay">
                  <Building2 size={30} />
                  <h3>{app.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUALITY */}
      <section className="quality-section">
        <div className="container">
          <div className="quality-wrapper">
            <div className="quality-content">
              <span>QUALITY CONTROL</span>
              <h2>Strict Testing & Material Inspection</h2>
              <p>
                Every aggregate batch undergoes rigorous testing and inspection
                processes to ensure consistent grading, particle shape, strength
                performance, and construction reliability.
              </p>
              <div className="quality-grid">
                <div><ShieldCheck size={22} />Gradation Testing</div>
                <div><ShieldCheck size={22} />Compression Testing</div>
                <div><ShieldCheck size={22} />Shape Analysis</div>
                <div><ShieldCheck size={22} />Moisture Control</div>
              </div>
            </div>
            <div className="quality-image">
              <img src="/aggregates/screening-uni.png" alt="Quality Testing" />
            </div>
          </div>
        </div>
      </section>

      {/* LOGISTICS */}
      <section className="logistics-section">
        <div className="container">
          <div className="section-heading center">
            <span>DELIVERY & SUPPLY</span>
            <h2>Reliable Bulk Aggregate Supply Across Bangalore</h2>
          </div>
          <div className="logistics-grid">
            <div className="logistics-card" style={{ "--card-delay": "0.05s" }}>
              <Truck size={45} />
              <h3>Fast Delivery</h3>
              <p>Timely dispatch and efficient transportation management for all project sizes.</p>
            </div>
            <div className="logistics-card" style={{ "--card-delay": "0.18s" }}>
              <Construction size={45} />
              <h3>Bulk Supply</h3>
              <p>Reliable aggregate availability for residential, commercial, and infrastructure works.</p>
            </div>
            <div className="logistics-card" style={{ "--card-delay": "0.31s" }}>
              <HardHat size={45} />
              <h3>Project Support</h3>
              <p>Dedicated support and material planning for uninterrupted construction operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section--aggregates">
        <div className="container">
          <div className="section-heading center">
            <span>FREQUENTLY ASKED QUESTIONS</span>
            <h2>Everything You Need to Know</h2>
          </div>
          <div className="faq-section--aggregates__grid">
            {faqData.map((faq, index) => (
              <div
                className="faq-section--aggregates__card"
                key={index}
                style={{ "--card-delay": `${index * 0.1}s` }}
              >
                <div className="faq-section--aggregates__icon">
                  <ChevronRight size={18} />
                </div>
                <div className="faq-section--aggregates__body">
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          /* ── Scoped FAQ styles — aggregates page only ── */

          .faq-section--aggregates {
            padding: 80px 0;
            background: #0f0f0f;
            position: relative;
          }

          .faq-section--aggregates::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(ellipse 60% 40% at 20% 50%, rgba(180,140,50,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 50% 35% at 80% 50%, rgba(180,140,50,0.04) 0%, transparent 70%);
            pointer-events: none;
          }

          .faq-section--aggregates__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 48px;
          }

          /* ── Base state: hidden, ready for scroll reveal ── */
          .faq-section--aggregates__card {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(180, 150, 80, 0.14);
            border-radius: 12px;
            padding: 24px 22px;
            position: relative;
            overflow: hidden;
            transition:
              border-color 0.3s,
              background 0.3s,
              transform 0.55s cubic-bezier(0.16,1,0.3,1),
              opacity 0.55s cubic-bezier(0.16,1,0.3,1);
            opacity: 0;
            transform: translateY(28px);
          }

          .faq-section--aggregates__card.is-visible {
            opacity: 1;
            transform: translateY(0);
            transition-delay: var(--card-delay, 0s);
          }

          .faq-section--aggregates__card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(200,160,60,0.5), transparent);
            opacity: 0;
            transition: opacity 0.3s;
          }

          .faq-section--aggregates__card:hover {
            border-color: rgba(200, 160, 60, 0.38);
            background: rgba(200, 160, 60, 0.05);
            transform: translateY(-4px);
          }

          .faq-section--aggregates__card:hover::before {
            opacity: 1;
          }

          .faq-section--aggregates__icon {
            flex-shrink: 0;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: rgba(200, 160, 60, 0.1);
            border: 1px solid rgba(200, 160, 60, 0.28);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c8a040;
            margin-top: 2px;
            transition: background 0.3s, border-color 0.3s;
          }

          .faq-section--aggregates__card:hover .faq-section--aggregates__icon {
            background: rgba(200, 160, 60, 0.18);
            border-color: rgba(200, 160, 60, 0.55);
          }

          .faq-section--aggregates__body h3 {
            font-size: 15px;
            font-weight: 600;
            color: #e8e0cc;
            margin: 0 0 10px;
            line-height: 1.4;
          }

          .faq-section--aggregates__body p {
            font-size: 13.5px;
            color: rgba(210, 200, 180, 0.62);
            line-height: 1.65;
            margin: 0;
          }

          @media (max-width: 640px) {
            .faq-section--aggregates {
              padding: 56px 0;
            }
            .faq-section--aggregates__grid {
              grid-template-columns: 1fr;
              gap: 14px;
              margin-top: 32px;
            }
            .faq-section--aggregates__card {
              padding: 18px 16px;
            }
          }

          /* ═══════════════════════════════════════════════════════
             SCROLL REVEAL — base hidden states for ALL elements
          ═══════════════════════════════════════════════════════ */

          /* ── Hero left: slide in from left ── */
          .aggregates-hero-left {
            opacity: 0;
            transform: translateX(-48px);
            transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
          }
          .aggregates-hero-left.is-visible {
            opacity: 1;
            transform: translateX(0);
          }

          /* ── Hero badge: fade + drop ── */
          .hero-badge {
            opacity: 0;
            transform: translateY(-16px);
            transition: opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s;
            display: inline-block;
          }
          .hero-badge.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── Hero h1: fade up ── */
          .aggregates-hero h1 {
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s;
          }
          .aggregates-hero h1.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── Hero p: fade up ── */
          .aggregates-hero > .container p,
          .aggregates-hero-left > p {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s;
          }
          .aggregates-hero > .container p.is-visible,
          .aggregates-hero-left > p.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── Hero mini features ── */
          .hero-mini-features {
            opacity: 0;
            transform: translateY(18px);
            transition: opacity 0.65s ease 0.38s, transform 0.65s ease 0.38s;
          }
          .hero-mini-features.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── Trust strip: slide up ── */
          .trust-strip {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
          }
          .trust-strip.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── Trust cards: staggered scale-in ── */
          .trust-card {
            opacity: 0;
            transform: translateY(24px) scale(0.93);
            transition: opacity 0.55s cubic-bezier(0.34,1.2,0.64,1), transform 0.55s cubic-bezier(0.34,1.2,0.64,1);
          }
          .trust-card:nth-child(1) { transition-delay: 0.06s; }
          .trust-card:nth-child(2) { transition-delay: 0.14s; }
          .trust-card:nth-child(3) { transition-delay: 0.22s; }
          .trust-card:nth-child(4) { transition-delay: 0.30s; }
          .trust-card.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          /* ── About section ── */
          .aggregates-about {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.7s ease, transform 0.7s ease;
          }
          .aggregates-about.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── About image / content: directional slides ── */
          .about-image,
          .benefits-left,
          .quality-content {
            opacity: 0;
            transform: translateX(-42px);
            transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
          }
          .about-content,
          .benefits-right,
          .quality-image {
            opacity: 0;
            transform: translateX(42px);
            transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s;
          }
          .about-image.is-visible,
          .benefits-left.is-visible,
          .quality-content.is-visible,
          .about-content.is-visible,
          .benefits-right.is-visible,
          .quality-image.is-visible {
            opacity: 1;
            transform: translateX(0);
          }

          /* ── About features items ── */
          .about-features div {
            opacity: 0;
            transform: translateX(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
          }
          .about-features div:nth-child(1) { transition-delay: 0.05s; }
          .about-features div:nth-child(2) { transition-delay: 0.13s; }
          .about-features div:nth-child(3) { transition-delay: 0.21s; }
          .about-features div:nth-child(4) { transition-delay: 0.29s; }
          .about-features div.is-visible {
            opacity: 1;
            transform: translateX(0);
          }

          /* ── Aggregate / logistics / application cards ── */
          .aggregate-card,
          .logistics-card,
          .application-card {
            opacity: 0;
            transform: translateY(36px);
            transition:
              opacity 0.65s cubic-bezier(0.16,1,0.3,1),
              transform 0.65s cubic-bezier(0.16,1,0.3,1);
          }
          .aggregate-card.is-visible,
          .logistics-card.is-visible,
          .application-card.is-visible {
            opacity: 1;
            transform: translateY(0);
            transition-delay: var(--card-delay, 0s);
          }

          /* ── Benefit items: stagger fade-left ── */
          .benefit-item {
            opacity: 0;
            transform: translateX(-22px);
            transition: opacity 0.5s ease, transform 0.5s ease;
          }
          .benefit-item.is-visible {
            opacity: 1;
            transform: translateX(0);
            transition-delay: var(--item-delay, 0s);
          }

          /* ── Benefits section wrapper ── */
          .benefits-section {
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.6s ease, transform 0.6s ease;
          }
          .benefits-section.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── Quality section ── */
          .quality-section {
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.6s ease, transform 0.6s ease;
          }
          .quality-section.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── Quality grid items ── */
          .quality-grid div {
            opacity: 0;
            transform: translateY(18px) scale(0.95);
            transition: opacity 0.5s ease, transform 0.5s ease;
          }
          .quality-grid div:nth-child(1) { transition-delay: 0.06s; }
          .quality-grid div:nth-child(2) { transition-delay: 0.14s; }
          .quality-grid div:nth-child(3) { transition-delay: 0.22s; }
          .quality-grid div:nth-child(4) { transition-delay: 0.30s; }
          .quality-grid div.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          /* ── Process wheel: scale in ── */
          .pw-root {
            opacity: 0;
            transform: scale(0.94);
            transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
          }
          .pw-root.is-visible {
            opacity: 1;
            transform: scale(1);
          }

          /* ── Section headings: fade up ── */
          .aggregate-sizes .section-heading,
          .process-section .section-heading,
          .applications-section .section-heading,
          .logistics-section .section-heading,
          .faq-section--aggregates .section-heading {
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
          }
          .aggregate-sizes .section-heading.is-visible,
          .process-section .section-heading.is-visible,
          .applications-section .section-heading.is-visible,
          .logistics-section .section-heading.is-visible,
          .faq-section--aggregates .section-heading.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── CTA wrapper ── */
          .aggregates-cta .cta-wrapper {
            opacity: 0;
            transform: translateY(36px);
            transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
          }
          .aggregates-cta .cta-wrapper.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── CTA inner elements: stagger ── */
          .aggregates-cta span {
            opacity: 0;
            transform: translateY(14px);
            transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
            display: block;
          }
          .aggregates-cta span.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          .aggregates-cta h2 {
            opacity: 0;
            transform: translateY(18px);
            transition: opacity 0.6s ease 0.18s, transform 0.6s ease 0.18s;
          }
          .aggregates-cta h2.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          .aggregates-cta p {
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.6s ease 0.26s, transform 0.6s ease 0.26s;
          }
          .aggregates-cta p.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          .cta-buttons {
            opacity: 0;
            transform: translateY(14px);
            transition: opacity 0.6s ease 0.34s, transform 0.6s ease 0.34s;
          }
          .cta-buttons.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </section>

      {/* CTA */}
      <section className="aggregates-cta">
        <div className="container">
          <div className="cta-wrapper">
            <span>{ctaTag}</span>
            <h2 style={{ fontSize: "clamp(20px, 3vw, 40px)" }}>{ctaTitle}</h2>
            <p>{ctaDesc}</p>
            <div className="cta-buttons">
              <button className="primary-btn" onClick={() => navigate("/contact")}>
                {ctaBtn1} <ArrowRight size={18} />
              </button>
              <button className="secondary-btn" onClick={() => navigate("/contact")}>
                {ctaBtn2}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aggregates;
