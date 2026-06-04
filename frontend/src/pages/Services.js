import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./services.css";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";

// ⭐ CMS API
const API = (process.env.REACT_APP_API_URL || "https://smsinfra-website.onrender.com").replace(/\/api$/, "");

const ServiceHub = () => {
  const navigate = useNavigate();

  /* 🔥 Stats animation state — UNCHANGED */
  const [counts, setCounts] = useState({ exp: 0, projects: 0, blocks: 0 });

  /* 🔥 Hover state — UNCHANGED */
  const [hoveredCard, setHoveredCard] = useState(null);

  // ⭐ CMS state
  const [cms, setCms]             = useState(null);
  const [logos, setLogos]         = useState([]);
  const [cmsLoaded, setCmsLoaded] = useState(false);

  // ⭐ Fetch ServiceHub CMS + client logos on mount
  useEffect(() => {
    fetch(`${API}/api/servicehub`)
      .then(r => r.json())
      .then(data => { setCms(data); setCmsLoaded(true); })
      .catch(() => setCmsLoaded(true));

    fetch(`${API}/api/cms`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data?.clientLogos) && data.clientLogos.length > 0) {
          setLogos(data.clientLogos.map(l => l.url));
        }
      })
      .catch(() => {});
  }, []);

  /* ============================================================
     ORIGINAL useEffect — ALL animations unchanged.
     Only change: depends on cmsLoaded so stat targets are correct
  ============================================================ */
  useEffect(() => {
    if (!cmsLoaded) return;

    AOS.init({ duration: 900, once: true });

    /* Animate numbers — uses CMS targets, falls back to originals */
    const expTarget      = cms?.statExp      ?? 30;
    const projectsTarget = cms?.statProjects  ?? 50;
    const blocksTarget   = cms?.statBlocks    ?? 800000;
    const steps          = expTarget || 30;

    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      setCounts({
        exp:      Math.min(start, expTarget),
        projects: Math.min(Math.round((start / steps) * projectsTarget), projectsTarget),
        blocks:   Math.min(Math.round((start / steps) * blocksTarget),   blocksTarget),
      });
      if (start >= steps) clearInterval(interval);
    }, 40);

    /* 🔥 Floating background orbs animation — UNCHANGED */
    const orbs = document.querySelectorAll(".floating-orb");
    orbs.forEach((orb, i) => { orb.style.animationDelay = `${i * 1.2}s`; });

    /* ============================================================
       === PARTICLE SYSTEM (Hero) === UNCHANGED
    ============================================================ */
    const hero = document.querySelector(".serviceHub-hero");
    const particleRefs = [];

    function spawnParticle() {
      if (!hero) return;
      const p = document.createElement("div");
      p.className = "hero-particle";
      const size = 2 + Math.random() * 5;
      const x = Math.random() * 100;
      const dur = 4 + Math.random() * 6;
      const cols = ["rgba(196,98,58,","rgba(196,154,60,","rgba(232,164,132,"];
      const col = cols[Math.floor(Math.random() * cols.length)];
      p.style.cssText = `
        position:absolute;
        border-radius:50%;
        pointer-events:none;
        width:${size}px;height:${size}px;
        left:${x}%;bottom:-10px;
        background:${col}0.7);`;
      hero.appendChild(p);
      const kf = [
        { transform: "translateY(0) scale(1)", opacity: 0 },
        { transform: "translateY(-50px) scale(1)", opacity: 0.85, offset: 0.1 },
        { transform: `translateY(-${90 + Math.random() * 130}px) translateX(${(Math.random() - 0.5) * 36}px) scale(0.25)`, opacity: 0 },
      ];
      const anim = p.animate(kf, { duration: dur * 1000, easing: "ease-out", fill: "forwards" });
      anim.onfinish = () => { p.remove(); spawnParticle(); };
      particleRefs.push({ el: p, anim });
    }

    const particleTimers = [];
    for (let i = 0; i < 14; i++) {
      particleTimers.push(setTimeout(spawnParticle, i * 280));
    }

    /* ============================================================
       === STAT COUNTER (IntersectionObserver) === UNCHANGED
    ============================================================ */
    function animateCount(el, target, suffix, dur = 2200) {
      const startTime = performance.now();
      (function step(now) {
        const p = Math.min((now - startTime) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }

    const statsSection = document.querySelector(".serviceHub-stats");
    let statObserver = null;
    if (statsSection) {
      statObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        document.querySelectorAll(".serviceHub-stats [data-target]").forEach(el => {
          animateCount(el, +el.dataset.target, el.dataset.suffix || "");
        });
        statObserver.disconnect();
      }, { threshold: 0.3 });
      statObserver.observe(statsSection);
    }

    /* ============================================================
       === 3D TILT === UNCHANGED
    ============================================================ */
    const tiltCards = document.querySelectorAll("[data-tilt]");
    const tiltHandlers = [];

    tiltCards.forEach((card) => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-10px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
        card.style.boxShadow = `${-x * 16}px ${-y * 10}px 48px rgba(196,98,58,0.18), 0 0 0 1px rgba(196,98,58,0.18)`;
      };
      const onLeave = () => { card.style.transform = ""; card.style.boxShadow = ""; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      tiltHandlers.push({ card, onMove, onLeave });
    });

    /* ============================================================
       === SCROLL REVEAL === UNCHANGED
    ============================================================ */
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));

    /* ============================================================
       === CLEANUP === UNCHANGED
    ============================================================ */
    return () => {
      clearInterval(interval);
      particleTimers.forEach(clearTimeout);
      if (statObserver) statObserver.disconnect();
      tiltHandlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
      revealIO.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmsLoaded]);

  /* 🔥 Smooth scroll to services grid — UNCHANGED */
  const handleExploreServices = () => {
    const grid = document.querySelector(".serviceHub-grid");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ⭐ Resolve image: Cloudinary URL stays as-is, local path gets PUBLIC_URL prefix
  const resolveImg = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${process.env.PUBLIC_URL}${img}`;
  };

  /* 🔥 Hardcoded fallback services — UNCHANGED values, used when CMS is empty */
  const fallbackServices = [
    { title: "Earthmoving Services", img: `${process.env.PUBLIC_URL}/earthmovers.png`, path: "/services/earthmovers", desc: "Excavation, demolition, grading & hauling with modern machinery.", features: ["Fast","Reliable","Heavy Duty"], hoverBenefits: ["✔ GPS-tracked machinery","✔ Bangalore-wide coverage","✔ ISO-certified operations","✔ 24–48 hr deployment"], deliveryTimeline: "2–3 Days", industries: ["Residential","Industrial","Infrastructure"], featured: false },
    { title: "Concrete Solid Blocks", img: `${process.env.PUBLIC_URL}/blocks.png`, path: "/services/concrete-blocks", desc: "High-strength concrete blocks with durability and precision.", features: ["Strong","Durable","Cost Efficient"], hoverBenefits: ["✔ IS 2185 standard certified","✔ 800,000+ blocks supplied","✔ Custom sizes available","✔ Same-day dispatch"], deliveryTimeline: "1–2 Days", industries: ["Residential","Commercial","Government"], featured: true },
    { title: "Ready Mix Concrete", img: `${process.env.PUBLIC_URL}/rmc.png`, path: "/services/rmc", desc: "Consistent, high-quality concrete for all construction needs.", features: ["Quality Tested","On-time","Consistent"], hoverBenefits: ["✔ Lab-tested each batch","✔ Transit mixer delivery","✔ M20–M60 grades","✔ Real-time tracking"], deliveryTimeline: "Same Day", industries: ["Commercial","Industrial","Infrastructure"], featured: false },
    { title: "M-Sand", img: `${process.env.PUBLIC_URL}/sand.png`, path: "/services/m-sand", desc: "Manufactured sand ensuring strength and durability.", features: ["Eco","Strong","Uniform"], hoverBenefits: ["✔ Eco-friendly alternative","✔ Uniform particle size","✔ Zero silt content","✔ BIS compliant"], deliveryTimeline: "1–2 Days", industries: ["Residential","Commercial","Industrial"], featured: false },
    { title: "Aggregates", img: `${process.env.PUBLIC_URL}/aggregates.png`, path: "/services/aggregates", desc: "Well-graded aggregates for strong concrete structures.", features: ["Multi Size","Reliable","High Strength"], hoverBenefits: ["✔ 6mm to 40mm sizes","✔ Washed & graded","✔ Bulk supply available","✔ Quality tested"], deliveryTimeline: "1–2 Days", industries: ["Commercial","Industrial","Government"], featured: false },
    { title: "Infra Projects", img: `${process.env.PUBLIC_URL}/projects.png`, path: "/services/construction", desc: "End-to-end residential & commercial construction solutions.", features: ["Turnkey","Expert Team","Timely"], hoverBenefits: ["✔ Full project management","✔ Licensed engineers","✔ Pan-Karnataka coverage","✔ On-time guarantee"], deliveryTimeline: "As per scope", industries: ["Residential","Commercial","Government","Infrastructure"], featured: false },
  ];

  const fallbackLogos = Array.from({ length: 12 }, (_, i) => `${process.env.PUBLIC_URL}/client${i + 1}.png`);

  // ⭐ Resolve all data — CMS if available, fallback if not
  const heroTitle        = cms?.heroTitle        || "Construction & Infrastructure Services in Bangalore";
  const heroSubtitle     = cms?.heroSubtitle     || "SMS Infra is one of the trusted construction and infrastructure solution providers in Bangalore, offering high-quality earthmoving services, ready mix concrete, M-sand, aggregates, concrete solid blocks, and complete infrastructure project solutions. With decades of industry expertise, modern machinery, and a commitment to quality, we deliver reliable construction materials and services for residential, commercial, industrial, and large-scale infrastructure developments across Karnataka.";
  const heroBtnPrimary   = cms?.heroBtnPrimary   || "Get Quote";
  const heroBtnSecondary = cms?.heroBtnSecondary || "Explore Services";
  const introTitle       = cms?.introTitle       || "Trusted Construction Solutions Partner";
  const introPara        = cms?.introPara        || "At SMS Infra, we specialize in delivering dependable construction materials and infrastructure services tailored to modern project requirements. From excavation and earthmoving to concrete manufacturing and aggregate supply, our solutions are designed to support durable, efficient, and cost-effective construction. Our experienced team, advanced production facilities, and customer-focused approach make us a preferred construction partner for builders, contractors, developers, and infrastructure companies in Bangalore.";
  const services         = (cms?.services?.length > 0) ? cms.services : fallbackServices;
  const industries       = (cms?.industries?.length > 0) ? cms.industries : [
    { icon: "🏠", label: "Residential",    desc: "Villas, apartments & housing complexes" },
    { icon: "🏢", label: "Commercial",     desc: "Offices, malls & retail spaces" },
    { icon: "🏭", label: "Industrial",     desc: "Factories, warehouses & plants" },
    { icon: "🏛️", label: "Government",    desc: "Public infrastructure & civic projects" },
    { icon: "🛣️", label: "Infrastructure", desc: "Roads, bridges & utilities" },
  ];
  const processSteps = (cms?.processSteps?.length > 0) ? cms.processSteps : [
    { icon: "📞", title: "Consultation", desc: "Understand your project requirements and scope" },
    { icon: "📐", title: "Planning",     desc: "Detailed estimation, scheduling & resource allocation" },
    { icon: "🏗️", title: "Production",  desc: "Quality materials manufactured with precision" },
    { icon: "🚛", title: "Delivery",    desc: "On-time, tracked delivery to your site" },
    { icon: "✅", title: "Execution",   desc: "Expert support from start to project completion" },
  ];
  const whyTitle  = cms?.whyTitle  || "Why Choose SMS Infra?";
  const whyPara   = cms?.whyPara   || "SMS Infra combines industry experience, advanced technology, and quality-driven operations to deliver reliable infrastructure and construction solutions. Our integrated approach ensures efficient project execution, consistent material quality, timely delivery, and customer satisfaction across every stage of construction and development.";
  const whyPoints = (cms?.whyPoints?.length > 0) ? cms.whyPoints : ["✔ 30+ Years Experience","✔ In-house Production","✔ Timely Delivery"];
  const ctaTitle  = cms?.ctaTitle  || "Let's Build Your Next Project";
  const ctaPara   = cms?.ctaPara   || "Looking for reliable construction materials or infrastructure services in Bangalore? Contact SMS Infra today for customized solutions, competitive pricing, and expert support for your next residential, commercial, or industrial project.";
  const ctaBtn    = cms?.ctaBtn    || "Get In Touch";

  const clientLogos    = logos.length > 0 ? logos : fallbackLogos;
  const scrollingLogos = [...clientLogos, ...clientLogos];
  const featuredService = services.find((s) => s.featured);

  return (
    <div className="serviceHub">

      <Helmet>
        <title>Construction Services in Bangalore | SMS Infra</title>
        <meta name="description" content="Earthmoving, Ready Mix Concrete, M-Sand, Aggregates and Infra Projects in Bangalore." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            provider: { "@type": "Organization", name: "SMS Infra" },
            areaServed: "Bangalore",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Construction Services",
              itemListElement: services.map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.title, description: s.desc },
              })),
            },
          })}
        </script>
      </Helmet>

      {/* 🔥 FLOATING ANIMATED BACKGROUND ORBS — UNCHANGED */}
      <div className="floating-bg" aria-hidden="true">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
      </div>

      {/* ── HERO — now uses CMS data ── */}
      <section className="serviceHub-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/services-bg.png)` }}>
        <div className="hero-overlay">
          <div className="breadcrumb">Home / Services</div>
          <h1>{heroTitle}</h1>
          <p className="hero-seo-para">{heroSubtitle}</p>
          <div className="hero-actions">
            <button onClick={() => navigate("/contact")}>{heroBtnPrimary}</button>
            <button onClick={handleExploreServices}>{heroBtnSecondary}</button>
          </div>
        </div>
      </section>

      {/* ── INTRO — now uses CMS data ── */}
      <section className="serviceHub-intro" data-aos="fade-up">
        <h2>{introTitle}</h2>
        <p>{introPara}</p>
      </section>

      {/* 🔥 STATS WITH ANIMATION — UNCHANGED structure, counts driven by CMS */}
      <section className="serviceHub-stats" data-aos="fade-up">
        <div><h3>{counts.exp}+</h3><p>Years Experience</p></div>
        <div><h3>{counts.projects}+</h3><p>Projects Delivered</p></div>
        <div><h3>{counts.blocks.toLocaleString()}+</h3><p>Blocks Supplied</p></div>
      </section>

      {/* 🔥 FEATURED SERVICE HIGHLIGHT — UNCHANGED structure, data from CMS */}
      {featuredService && (
        <section className="featured-service-section" data-aos="fade-up">
          <div className="featured-ribbon">⭐ Most Popular</div>
          <div className="featured-service-card">
            <div className="featured-image">
              <img src={resolveImg(featuredService.img)} alt={featuredService.title} loading="lazy" />
            </div>
            <div className="featured-content">
              <span className="featured-tag">Featured Service</span>
              <h2>{featuredService.title}</h2>
              <p>{featuredService.desc}</p>
              <ul className="featured-benefits">
                {(featuredService.hoverBenefits||[]).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <button className="featured-cta" onClick={() => navigate(featuredService.path)}>
                Learn More <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES GRID — UNCHANGED structure, data from CMS */}
      <section className="serviceHub-grid" data-aos="fade-up">
        <p className="services-grid-text">
          Explore our complete range of construction and infrastructure services including earthmoving, M-sand
          manufacturing, aggregates supply, ready mix concrete production, concrete solid blocks, and turnkey
          infrastructure solutions. Every service is backed by quality assurance, timely delivery, and
          industry-standard processes to meet the demands of residential, commercial, and industrial
          construction projects.
        </p>

        {services.map((service, index) => (
          <div
            key={index}
            className={`service-card ${hoveredCard === index ? "active-card" : ""} ${service.featured ? "is-featured" : ""}`}
            onClick={() => navigate(service.path)}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(service.path)}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            data-tilt
          >
            {service.featured && <div className="card-featured-badge">⭐ Popular</div>}

            <div className="card-image">
              <img src={resolveImg(service.img)} alt={service.title} loading="lazy" />

              <div className="card-hover-overlay">
                <ul className="hover-benefits">
                  {(service.hoverBenefits||[]).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <div className="hover-delivery">🚛 Delivery: <strong>{service.deliveryTimeline}</strong></div>
                <div className="hover-industries">🏗️ {(service.industries||[]).join(" · ")}</div>
              </div>
            </div>

            <div className="card-content">
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <div className="card-tags">
                {(service.features||[]).map((f, i) => <span key={i}>{f}</span>)}
              </div>
              <div className="view-more" onClick={(e) => { e.stopPropagation(); navigate(service.path); }}>
                <span>View More</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 🔥 INDUSTRIES WE SERVE — UNCHANGED structure, data from CMS */}
      <section className="industries-section" data-aos="fade-up">
        <h2>Industries We Serve</h2>
        <p className="industries-subtitle">Delivering construction excellence across every sector of development</p>
        <div className="industries-grid">
          {industries.map((ind, i) => (
            <div className="industry-card reveal" key={i} data-aos="zoom-in" data-aos-delay={i * 80}>
              <div className="industry-icon">{ind.icon}</div>
              <h4>{ind.label}</h4>
              <p>{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 SERVICE PROCESS TIMELINE — UNCHANGED structure, data from CMS */}
      <section className="process-timeline-section" data-aos="fade-up">
        <h2>Our Service Process</h2>
        <p className="process-subtitle">From first call to final execution — here's how we work</p>
        <div className="process-steps">
          {processSteps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="process-step reveal" data-aos="fade-right" data-aos-delay={i * 100}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">0{i + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
              {i < processSteps.length - 1 && (
                <div className="process-connector" aria-hidden="true">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* CLIENT LOGOS — now fetches from CMS, falls back to local files */}
      <section className="serviceHub-clients">
        <h2>Trusted By Leading Clients</h2>
        <div className="logos-wrapper">
          <div className="client-logos">
            {scrollingLogos.map((logo, index) => (
              <div key={index} className="logo-box">
                <img src={logo} alt={`client-${index}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US — now uses CMS data */}
      <section className="why-us" data-aos="fade-up">
        <h2>{whyTitle}</h2>
        <p className="why-us-seo">{whyPara}</p>
        <ul>
          {whyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
        </ul>
      </section>

      {/* CTA — now uses CMS data */}
      <section className="serviceHub-cta">
        <h2>{ctaTitle}</h2>
        <p className="cta-seo-para">{ctaPara}</p>
        <button onClick={() => navigate("/contact")}>{ctaBtn}</button>
      </section>

    </div>
  );
};

export default ServiceHub;
