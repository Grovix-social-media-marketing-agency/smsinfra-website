import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Factory,
  ShieldCheck,
  Building2,
  Truck,
  CheckCircle2,
  Mountain,
  Sparkles,
  BadgeCheck,
  ArrowRight,
  Globe2,
  ChevronRight,
  Phone,
  FileText,
} from "lucide-react";

import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from "framer-motion";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./MSandPSand.css";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const featuresMSand = [
  "IS 383-2016 Certified",
  "Advanced VSI Crusher Technology",
  "Superior Particle Shape",
  "High Concrete Strength",
  "Better Workability",
  "Reduced Cement Consumption",
  "Eco Friendly Alternative",
  "Uniform Grading",
];

const featuresPSand = [
  "5 Stage Processing",
  "Smooth Plaster Finish",
  "Excellent Workability",
  "Reduced Wastage",
  "Higher Productivity",
  "No Sieving Required",
  "Strong Adhesion",
  "Cost Effective Solution",
];

const stats = [
  { value: 30, suffix: "+", label: "Years Experience" },
  { value: 383, prefix: "IS ", suffix: "", label: "Certified Materials" },
  { value: 24, suffix: "/7", label: "Supply Support" },
  { value: 100, suffix: "%", label: "Quality Tested" },
];

const applications = [
  { label: "Residential Construction", img: "/msand/residential.png" },
  { label: "Commercial Buildings", img: "/msand/commercial.png" },
  { label: "Apartments & Villas", img: "/msand/residential.png" },
  { label: "Infrastructure Projects", img: "/msand/industrial.png" },
  { label: "Road Construction", img: "/msand/road-construction.png" },
  { label: "Ready Mix Concrete", img: "/msand/rmc.png" },
  { label: "Wall Plastering", img: "/msand/Psand.png" },
  { label: "Industrial Projects", img: "/msand/industrial.png" },
];

const processSteps = [
  { label: "Raw Stone Sourcing", img: "/msand/raw-stone.png" },
  { label: "Jaw Crushing", img: "/msand/jaw-crusher.png" },
  { label: "Cone Crusher Processing", img: "/msand/cone-crusher.png" },
  { label: "VSI Shaping", img: "/msand/vsi-machine.png" },
  { label: "5 Stage Fine Processing", img: "/msand/msand-plant.png" },
  { label: "Quality Testing", img: "/msand/msand.png" },
  { label: "Safe Dispatch", img: "/msand/dispatch.png" },
];

const faqData = [
  {
    q: "What is M-Sand?",
    a: "M-Sand is manufactured sand produced using advanced VSI crushing technology for superior construction performance.",
  },
  {
    q: "Is M-Sand better than river sand?",
    a: "Yes. M-Sand provides better strength, consistent grading, improved workability, and reduced environmental impact.",
  },
  {
    q: "What is P-Sand used for?",
    a: "P-Sand is used for wall plastering applications where smooth texture and excellent bonding are required.",
  },
  {
    q: "Does P-Sand reduce construction cost?",
    a: "Yes. P-Sand improves workability and reduces cement usage and wastage significantly.",
  },
];

/* ─────────────────────────── PARTICLE CANVAS ──────────────────────── */

const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      glow: Math.random() > 0.85,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save();
        if (p.glow) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#f59e0b";
          ctx.fillStyle = `rgba(251,191,36,${p.opacity})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(210,180,140,${p.opacity})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -5) p.y = canvas.height + 5;
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="sp-particle-canvas" />;
};

/* ─────────────────────────── MAGNETIC BUTTON ──────────────────────── */

const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const [ripples, setRipples] = useState([]);

  const handleMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.3);
    y.set(dy * 0.3);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleClick = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    onClick && onClick(e);
  }, [onClick]);

  return (
    <motion.button
      ref={ref}
      className={`sp-magnetic-btn ${className || ""}`}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="sp-ripple"
          style={{ left: rp.x, top: rp.y }}
        />
      ))}
    </motion.button>
  );
};

/* ──────────────────────────── COUNTER ─────────────────────────────── */

const AnimatedCounter = ({ target, suffix = "", prefix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const controls = animate(0, target, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (v) => setVal(Math.floor(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}{val}{suffix}
    </span>
  );
};

/* ────────────────────────── PRODUCT CARD ─────────────── */

const ProductCard = ({ img, videoSrc, icon: Icon, title, desc, features, delay }) => {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) videoRef.current.play().catch(() => {});
    else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);

  return (
    <motion.div
      className="sp-product-card"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="sp-product-media">
        <img
          src={img}
          alt={title}
          className={`sp-product-img ${hovered ? "sp-media-hidden" : ""}`}
        />
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            className={`sp-product-video ${hovered ? "sp-media-visible" : ""}`}
          />
        )}
        {!videoSrc && (
          <div className={`sp-product-img-hover ${hovered ? "sp-media-visible" : ""}`}>
            <img src={img} alt={title} style={{ filter: "brightness(1.15) saturate(1.3)" }} />
          </div>
        )}
        <div className="sp-product-media-overlay" />
      </div>
      <div className="sp-product-content">
        <div className="sp-product-icon"><Icon /></div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="sp-feature-list">
          {features.map((f, i) => (
            <div key={i}><ChevronRight size={16} />{f}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ──────────────────────── ANIMATED PROCESS TIMELINE ───────────────── */

const ProcessTimeline = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <div className="sp-timeline-wrapper" ref={ref}>
      <div className="sp-timeline-track">
        <motion.div className="sp-timeline-fill" style={{ width: lineWidth }} />
        {processSteps.map((step, i) => (
          <motion.div
            key={i}
            className="sp-timeline-node"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.13, duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="sp-node-img-wrap">
              <img src={step.img} alt={step.label} className="sp-node-img" />
              <div className="sp-node-glow" />
            </div>
            <div className="sp-node-dot">
              <span>{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="sp-node-label">{step.label}</p>
            {i < processSteps.length - 1 && (
              <div className="sp-node-arrow">
                <ArrowRight size={18} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   CINEMATIC CTA TRUCK SCENE — ENHANCED
   Truck enters from left, bounces, dust trail, headlight beam,
   glowing road line, animated road dashes, ambient particles
══════════════════════════════════════════════════════════════════════ */

const CTATruckScene = () => (
  <div className="cta-truck-scene" aria-hidden="true">

    {/* glowing road ground line */}
    <div className="cta-road-glow-line" />

    {/* animated dashed road markings */}
    <div className="cta-road-dashes">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="cta-road-dash"
          style={{ animationDelay: `${-(i * 1.6)}s` }}
        />
      ))}
    </div>

    {/* ambient dust particles */}
    <div className="cta-ambient-particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="cta-amb-dot"
          style={{
            left: `${(i * 5.1) % 100}%`,
            bottom: `${8 + (i * 7) % 55}px`,
            width: `${3 + (i % 4)}px`,
            height: `${3 + (i % 4)}px`,
            animationDelay: `${(i * 0.43) % 3}s`,
            animationDuration: `${2.5 + (i % 4) * 0.5}s`,
          }}
        />
      ))}
    </div>

    {/* truck wrapper — slides left → right */}
    <div className="cta-truck-mover">

      {/* headlight cone ahead of truck */}
      <div className="cta-headlight-cone" />

      {/* dust cloud behind truck */}
      <div className="cta-dust-cloud" />

      {/* truck image */}
      <img
        src="/msand/truck.png"
        alt=""
        className="cta-truck-img"
      />

      {/* spinning wheel overlays */}
      <div className="cta-wheel cta-wheel--front" />
      <div className="cta-wheel cta-wheel--rear" />

    </div>
  </div>
);

/* ──────────────────────────── MAIN COMPONENT ───────────────────────── */

const SandSolutions = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Premium M Sand & P Sand Suppliers in Bangalore | SMS Infra</title>
        <meta
          name="description"
          content="SMS Infra is a leading M Sand and P Sand manufacturer and supplier in Bangalore delivering IS 383-2016 certified construction materials with superior durability, workability, and strength."
        />
        <meta
          name="keywords"
          content="M Sand suppliers Bangalore, P Sand manufacturers Bangalore, plastering sand Bangalore, manufactured sand suppliers, construction materials Bangalore, premium M Sand"
        />
        <link rel="canonical" href="https://www.smsinfra.com/m-sand-p-sand" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a },
          })),
        })}</script>
      </Helmet>

      <div className="sand-page sp-page">

        {/* ── HERO ── */}
        <section className="sand-hero sp-hero" ref={heroRef}>

          {/* ✅ HERO BG IMAGE — parallax wrapper */}
          <motion.div className="hero-bg-image" style={{ y }} aria-hidden="true">
            <img
              src="/msand/hero-msand-bg.png"
              alt=""
              className="hero-bg-img"
              loading="eager"
              fetchpriority="high"
            />
          </motion.div>

          <ParticleCanvas />
          {/* hero-overlay removed — not needed with bg image */}
          <div className="hero-grid" />

          <div className="container hero-content">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="hero-left"
            >
              <span className="hero-badge">IS 383-2016 Certified Materials</span>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                Premium <span>M-Sand</span> & <span>P-Sand</span> Solutions
                for Modern Construction
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                SMS Infra delivers high-performance manufactured sand and plastering sand
                engineered using advanced VSI crushing and multi-stage processing technology
                for superior strength, durability, and workability across residential,
                commercial, and infrastructure projects in Bangalore.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="hero-right"
            >
              <div className="floating-card card-1"><ShieldCheck /><span>IS Certified</span></div>
              <div className="floating-card card-2"><Factory /><span>Advanced Manufacturing</span></div>
              <div className="floating-card card-3"><Truck /><span>Fast Delivery</span></div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="stats-section sp-stats">
          <div className="container">
            <motion.p
              className="sp-section-subtext sp-section-subtext--centered"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: .8 }}
              viewport={{ once: true }}
            >
              Backed by over 30 years of manufacturing excellence, SMS Infra is a
              trusted M-Sand and P-Sand supplier in Bangalore — delivering
              IS 383-2016 certified materials with 24/7 logistics support and
              100% quality-tested dispatches across Karnataka.
            </motion.p>
          </div>
          <div className="container stats-grid">
            {stats.map((item, index) => (
              <motion.div
                key={index}
                className="stat-card sp-stat-card"
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <h2>
                  <AnimatedCounter
                    target={item.value}
                    prefix={item.prefix || ""}
                    suffix={item.suffix || ""}
                  />
                </h2>
                <p>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="intro-section">
          <div className="container intro-grid">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="intro-image"
            >
              <img src="/msand/msand-plant.png" alt="M Sand Manufacturing Plant" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="intro-content"
            >
              <span className="section-tag">PREMIUM CONSTRUCTION MATERIALS</span>
              <h2>Trusted M-Sand & P-Sand Manufacturers in Bangalore</h2>
              <p>
                SMS Infra operates a state-of-the-art blue metals and sand processing unit
                designed to manufacture premium-quality M-Sand and P-Sand for modern
                construction requirements. Our materials conform to IS 383-2016 standards
                and are trusted by builders, developers, contractors, and infrastructure
                companies across Bangalore and Karnataka.
              </p>
              <p>
                Using advanced VSI crushing technology and multi-stage processing systems,
                we ensure superior particle shape, consistent grading, enhanced durability,
                excellent workability, and high-strength performance for all construction
                applications.
              </p>
              <div className="intro-points">
                {["Superior Strength", "Eco-Friendly Manufacturing", "High Workability", "Reliable Supply"].map((pt, i) => (
                  <div key={i}><CheckCircle2 size={18} />{pt}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION DIVIDER ── */}
        <div className="sp-section-divider">
          <div className="sp-divider-dust" />
        </div>

        {/* ── PRODUCTS ── */}
        <section className="products-section">
          <div className="container">
            <div className="section-header">
              <span>OUR PRODUCTS</span>
              <h2>Advanced Sand Solutions</h2>
            </div>
            <div className="products-grid">
              <ProductCard
                img="/msand/msand.png"
                videoSrc={null}
                icon={Mountain}
                title="M-Sand"
                desc="Manufactured using advanced Vertical Shaft Impactor (VSI) technology for superior particle shape, durability, and concrete strength."
                features={featuresMSand}
                delay={0}
              />
              <ProductCard
                img="/msand/Psand.png"
                videoSrc={null}
                icon={Sparkles}
                title="P-Sand"
                desc="Premium plastering sand engineered with 5-stage processing for smooth finish, excellent bonding, and faster productivity."
                features={featuresPSand}
                delay={0.15}
              />
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="process-section sp-process">
          <div className="container">
            <div className="section-header">
              <span>MANUFACTURING PROCESS</span>
              <h2>Advanced Production Workflow</h2>
              <motion.p
                className="sp-section-subtext sp-section-subtext--centered"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: .8, delay: .1 }}
                viewport={{ once: true }}
              >
                Every batch of SMS Infra M-Sand and P-Sand passes through a rigorous
                7-stage production workflow — from raw stone sourcing and jaw crushing
                to VSI shaping, 5-stage fine processing, and in-house quality testing —
                delivering IS 383-2016 compliant, zero-silt sand ready for immediate
                dispatch to your Bangalore construction site.
              </motion.p>
            </div>
            <ProcessTimeline />
          </div>
        </section>

        {/* ── SECTION DIVIDER ── */}
        <div className="sp-section-divider sp-divider-flip">
          <div className="sp-divider-dust" />
        </div>

        {/* ── APPLICATIONS ── */}
        <section className="applications-section">
          <div className="container">
            <div className="section-header">
              <span>APPLICATIONS</span>
              <h2>Industries We Serve</h2>
              <motion.p
                className="sp-section-subtext sp-section-subtext--centered"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: .8, delay: .1 }}
                viewport={{ once: true }}
              >
                SMS Infra supplies premium M-Sand and P-Sand across all major construction
                segments in Bangalore — residential villas, apartment complexes, commercial
                buildings, road construction, RMC plants, wall plastering, and large-scale
                infrastructure and industrial projects across Karnataka.
              </motion.p>
            </div>
            <div className="applications-grid sp-apps-grid">
              {applications.map((item, index) => (
                <motion.div
                  className="application-card sp-app-card"
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -6 }}
                >
                  <div className="sp-app-img-wrap">
                    <img src={item.img} alt={item.label} />
                    <div className="sp-app-overlay" />
                  </div>
                  <Building2 />
                  <h4>{item.label}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON ── */}
        <section className="comparison-section">
          <div className="container">
            <div className="section-header">
              <span>WHY M-SAND</span>
              <h2>M-Sand vs River Sand</h2>
              <motion.p
                className="sp-section-subtext sp-section-subtext--centered"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: .8, delay: .1 }}
                viewport={{ once: true }}
              >
                SMS Infra manufactured sand consistently outperforms natural river sand
                across every critical parameter — higher concrete strength, uniform particle
                grading, zero silt contamination, eco-friendly production, and better
                long-term cost efficiency for Bangalore construction projects.
              </motion.p>
            </div>
            <div className="comparison-table">
              <div className="table-header">
                <div>Feature</div>
                <div>M-Sand</div>
                <div>River Sand</div>
              </div>
              {[
                ["Strength", "High", "Moderate"],
                ["Consistency", "Uniform", "Inconsistent"],
                ["Eco Friendly", "Yes", "No"],
                ["Cost", "Economical", "Expensive"],
                ["Workability", "Superior", "Average"],
              ].map((row, index) => (
                <motion.div
                  className="table-row"
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div>{row[0]}</div>
                  <div className="sp-table-good">{row[1]}</div>
                  <div className="sp-table-bad">{row[2]}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CARDS ── */}
        <section className="seo-section">
          <div className="container seo-grid">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="seo-card"
            >
              <BadgeCheck />
              <h3>Premium M-Sand Manufacturers in Bangalore</h3>
              <p>
                SMS Infra is one of the leading M-Sand manufacturers and suppliers in
                Bangalore delivering premium-quality manufactured sand engineered using
                advanced VSI crushing technology. Our M-Sand conforms to IS 383-2016
                standards and ensures superior durability, better bonding strength,
                enhanced concrete performance, and consistent grading for modern
                construction projects.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1 }}
              viewport={{ once: true }}
              className="seo-card"
            >
              <Globe2 />
              <h3>High Quality P-Sand Suppliers in Bangalore</h3>
              <p>
                SMS Infra manufactures premium-quality P-Sand using advanced 5-stage
                processing systems for smooth plaster finish, reduced wastage, improved
                mason productivity, and long-lasting plastering strength. Trusted by
                contractors and builders across Bangalore, our P-Sand solutions help reduce
                overall construction cost while delivering superior finish quality.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="sp-faq-section">
          <div className="container">
            <div className="section-header">
              <span>FAQ</span>
              <h2>Frequently Asked Questions</h2>
              <motion.p
                className="sp-section-subtext sp-section-subtext--centered"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: .8, delay: .1 }}
                viewport={{ once: true }}
              >
                Have questions about M-Sand or P-Sand for your Bangalore project?
                Find answers to the most common queries about manufactured sand
                quality, IS certification, plastering applications, and how SMS Infra
                materials compare to traditional river sand.
              </motion.p>
            </div>
            <div className="sp-faq-grid">
              {faqData.map((faq, index) => (
                <motion.div
                  className="sp-faq-card"
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CINEMATIC CTA SECTION
        ══════════════════════════════════════════ */}
        <section className="cta-section sp-cta">

          {/* bg image layer — inline style so webpack resolves public/ correctly */}
          <div
            className="cta-bg-layer"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/msand/industrial-cta-bg.png)` }}
          />
          {/* dark gradient overlay */}
          <div className="cta-overlay" />

          {/* eyebrow label */}
          <div className="cta-eyebrow-wrap">
            <span className="cta-eyebrow-dot" />
            <span className="cta-eyebrow-text">
              PREMIUM QUALITY&nbsp;&nbsp;•&nbsp;&nbsp;TIMELY DELIVERY
            </span>
            <span className="cta-eyebrow-dot" />
          </div>

          {/* text + buttons */}
          <motion.div
            className="container cta-content"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-headline">
              Get high-quality M-Sand and P-Sand{" "}
              <span className="cta-headline-accent">delivered</span>{" "}
              across Bangalore
            </h2>

            <p className="cta-subtext">
              Reliable supply, competitive pricing, and unmatched quality
              <br className="cta-br" />
              for all your construction needs.
            </p>

            <div className="cta-btn-row">
              <MagneticButton
                className="cta-btn-primary"
                onClick={() => navigate("/contact")}
              >
                <FileText size={18} />
                Get a Quote
              </MagneticButton>

              <a href="tel:+918884442060" className="cta-btn-call sp-magnetic-btn">
                <Phone size={18} />
                Call: +91 888 444 2060
              </a>
            </div>
          </motion.div>

          {/* ✅ CINEMATIC TRUCK SCENE — enhanced version */}
          <CTATruckScene />

        </section>

      </div>
    </>
  );
};

export default SandSolutions;
