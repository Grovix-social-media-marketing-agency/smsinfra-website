import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./about.css";

const API = (process.env.REACT_APP_API_URL || "https://smsinfra-website.onrender.com").replace(/\/api$/, "");

function About() {
  const isMobile = window.innerWidth < 768;
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    years: 0,
    projects: 0,
    clients: 0,
  });

  const [cms, setCms] = useState({});

  // 🔥 FETCH CMS DATA
  useEffect(() => {
    fetch(`${API}/api/cms/about`)
      .then(r => r.json())
      .then(d => { if (d && !d.error) setCms(d); })
      .catch(() => {});
  }, []);

  // 🔥 AOS INIT
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // 🔥 COUNTER
  useEffect(() => {
    let start = 0;
    const end = { years: 30, projects: 500, clients: 100 };

    const timer = setInterval(() => {
      start++;

      setCounts({
        years: Math.min(start, end.years),
        projects: Math.min(start * 5, end.projects),
        clients: Math.min(start, end.clients),
      });

      if (start >= 100) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, []);

  // 🔥 PARTICLES
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "about-particles";
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    let W, H;
    let scrollY = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();

    window.addEventListener("resize", resize);

    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    const COUNT = 75;
    const pts = [];

    for (let i = 0; i < COUNT; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        a: Math.random() * 0.5 + 0.15,
      });
    }

    const COLOURS = [
      "rgba(184,137,42,",
      "rgba(200,78,42,",
      "rgba(210,168,80,",
    ];

    let animFrameId;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      pts.forEach((p, idx) => {
        p.y += p.vy - scrollY * 0.00012;
        p.x += p.vx;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const col = COLOURS[idx % COLOURS.length];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col + p.a + ")";
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle =
              "rgba(184,137,42," + (0.06 * (1 - dist / 110)) + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      canvas.remove();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ── CMS helpers with fallbacks ──────────────────────────
  const c = (field, fallback) => cms[field] || fallback;
  const arr = (field, fallback) =>
    Array.isArray(cms[field]) && cms[field].length > 0 ? cms[field] : fallback;

  const journeyItems = arr("journeyItems", [
    { year: "1996", text: "Established concrete solid block manufacturing unit, laying the foundation of SMS Infra." },
    { year: "2008", text: "Expanded into earthwork and excavation services with modern heavy machinery." },
    { year: "2017", text: "Commissioned a stone crusher unit for in-house aggregate production." },
    { year: "2023", text: "Launched M Sand washing unit, enabling eco-friendly manufactured sand supply." },
    { year: "2024", text: "Underwent major renovation and modernisation of the concrete block manufacturing unit." },
    { year: "2026", text: "Launched Ready Mix Concrete (RMC) plant, completing our full-spectrum construction solutions offering." },
  ]);

  const whyCards = arr("whyCards", ["30+ Years Experience", "Advanced Machinery", "In-house Production", "On-time Delivery"]);

  const servicesBannerBullets = arr("servicesBannerBullets", [
    "High-quality materials",
    "Advanced machinery & technology",
    "Experienced team",
    "Reliable & on-time execution",
  ]);

  const serviceCards = arr("serviceCards", [
    { title: "Earthmoving",        desc: "Excavation and site preparation." },
    { title: "Concrete Blocks",    desc: "High strength blocks manufacturing." },
    { title: "Ready Mix Concrete", desc: "Quality tested RMC solutions." },
    { title: "Aggregates & Sand",  desc: "Premium construction materials supply." },
  ]);

  const processSteps   = arr("processSteps",   ["Planning", "Design", "Execution", "Delivery"]);
  const equipmentItems = arr("equipmentItems", ["Earthmovers", "RMC Plants", "Crusher Units", "Block Units"]);
  const fleetItems     = arr("fleetItems",     ["🚜 JCB Excavators", "🚛 Tipper Trucks", "🚚 Transit Mixers", "🏗️ Cranes & Loaders", "🪨 Stone Crushers", "💧 Water Tankers"]);
  const qualityItems   = arr("qualityItems",   ["ISO Standard Processes", "Regular Cube Testing", "Third-party Verification", "In-house Laboratory", "Strict Safety Compliance"]);
  const valuesItems    = arr("valuesItems",    ["Quality First", "Timely Delivery", "Customer Commitment", "Innovation", "Sustainability"]);
  const areasItems     = arr("areasItems",     ["Electronic City", "Sarjapur", "HSR Layout", "BTM Layout", "Whitefield", "Marathahalli"]);

  return (
    <div className="about-page">

      {/* 🔥 SEO */}
      <Helmet>
        <title>Top Construction Company in Bangalore | SMS Infra</title>
        <meta name="description" content="SMS Infra is a leading construction company in Bangalore with 30+ years experience." />
        <link rel="canonical" href="https://www.smsinfra.com/about" />
      </Helmet>

      {/* 🔥 HERO */}
      <section
        className="about-hero"
        style={{
          backgroundImage: isMobile
            ? `url('${c("heroBgMobile", "/about-mobile-bg.png")}')`
            : `url('${c("heroBgDesktop", "/about-bg.png")}')`,
        }}
      >
        <div className="about-overlay">
          <div className="about-hero-content" data-aos="fade-up">
            <h1>{c("heroH1", "ABOUT US")}</h1>
            <h2>{c("heroH2a", "Top Construction Company in Bangalore")}</h2>
            <h2>{c("heroH2b", "Turning Dreams Into Reality")}</h2>
            <p>{c("heroSubtitle", "Integrated Infrastructure & Construction Solutions")}</p>
            <p className="about-hero-desc">
              {c("heroDesc", "SMS Infra is a trusted construction and infrastructure company in Bangalore, specializing in earthmoving, ready mix concrete (RMC), aggregates, M Sand, and P Sand supply. With over 30 years of experience, we deliver reliable, high-quality solutions for residential, commercial, and large-scale infrastructure projects.")}
            </p>
          </div>
        </div>
      </section>

      {/* 🔥 INTRO */}
      <section className="about-intro" data-aos="fade-up">
        <div className="about-container">
          <h2>{c("introTitle", "About SMS Infra")}</h2>
          <p>
            {c("introPara1", "SMS Infra is a leading construction and infrastructure company based in Chandapura, Bangalore, with over 30 years of experience in delivering high-quality engineering and material solutions. We specialize in earthmoving services, ready mix concrete (RMC), concrete block manufacturing, aggregates, M Sand, and P Sand supply for residential, commercial, and large-scale infrastructure projects across Bangalore.")}
          </p>
          <p>
            {c("introPara2", "Operating within a 30 km service radius from Chandapura, we serve key areas including Electronic City, Sarjapur, HSR Layout, BTM Layout, Whitefield, and Marathahalli. With advanced machinery, in-house production units, and a strong focus on quality, safety, and timely execution, SMS Infra is a trusted partner for builders, developers, and contractors across Bangalore.")}
          </p>
        </div>
      </section>

      {/* 🔥 STATS */}
      <section className="about-stats">
        <div className="about-container about-stats-grid">

          <div className="about-stat" data-aos="zoom-in">
            <h3>{counts.years}+</h3>
            <p>{c("statsYearsLabel", "Years of Excellence")}</p>
          </div>

          <div className="about-stat" data-aos="zoom-in" data-aos-delay="200">
            <h3>{counts.projects}+</h3>
            <p>{c("statsProjectsLabel", "Projects Delivered")}</p>
          </div>

          <div className="about-stat" data-aos="zoom-in" data-aos-delay="400">
            <h3>{counts.clients}+</h3>
            <p>{c("statsClientsLabel", "Trusted Clients")}</p>
          </div>

        </div>
      </section>

      {/* 🔥 JOURNEY */}
      <section className="about-journey">
        <div className="about-container">
          <h2 data-aos="fade-up">{c("journeyTitle", "Our Journey")}</h2>

          <div className="about-timeline">
            {journeyItems.map((item, i) => (
              <div
                key={i}
                className="about-timeline-item"
                data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
              >
                <div className="about-timeline-content">
                  <h3>{item.year}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 WHY CHOOSE US */}
      <section className="about-why">
        <div className="about-container">
          <h2>{c("whyTitle", "Why Choose Us")}</h2>
          <div>
            <h4>{whyCards[0] || "30+ Years Experience"}</h4>
            <p>Decades of expertise in construction and infrastructure projects across Bangalore.</p>
          </div>
          <div className="about-why-grid">
            {whyCards.map((card, i) => (
              <div key={i}>{card}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 SERVICES */}
      <section className="about-services">
        <div className="about-container">
          <h2 data-aos="fade-up">{c("expertiseTitle", "Our Expertise")}</h2>
          <p className="about-section-desc">
            {c("expertiseDesc", "We offer end-to-end construction and material supply services tailored for residential, commercial, and infrastructure development projects.")}
          </p>

          {/* 🔥 UPDATED BANNER (LEFT IMAGE + RIGHT TEXT) */}
          <div className="about-services-banner-flex" data-aos="fade-up">

            {/* LEFT IMAGE */}
            <div className="about-services-banner-image">
              <img src={c("servicesBannerImage", "/services-banner.png")} alt="SMS Infra Services" />
            </div>

            {/* RIGHT TEXT */}
            <div className="about-services-banner-text">
              <h3>{c("servicesBannerTitle", "Complete Construction Solutions")}</h3>
              <p>
                {c("servicesBannerText", "SMS Infra delivers integrated construction services including earthmoving, ready mix concrete, aggregates, M Sand, P Sand, and concrete blocks.")}
              </p>
              <ul>
                {servicesBannerBullets.map((bullet, i) => (
                  <li key={i}>✔ {bullet}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* 🔥 YOUR ORIGINAL GRID (UNCHANGED) */}
          <div className="about-service-grid">
            {serviceCards.map((card, i) => (
              <div
                key={i}
                className="about-card"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 PROCESS */}
      <section className="about-process">
        <div className="about-container">
          <h2>{c("processTitle", "Our Process")}</h2>
          <p className="about-section-desc">
            {c("processDesc", "Our structured approach ensures every project is delivered with precision, efficiency, and high-quality standards.")}
          </p>
          <div className="about-process-grid">
            {processSteps.map((step, i) => (
              <div key={i}>{step}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 EQUIPMENT */}
      <section className="about-equipment">
        <div className="about-container">
          <h2>{c("equipmentTitle", "Equipment")}</h2>
          <p className="about-section-desc">
            {c("equipmentDesc", "Our advanced machinery and in-house production units enable us to handle projects of any scale with efficiency and reliability.")}
          </p>

          <div className="about-equipment-grid">
            {equipmentItems.map((item, i) => (
              <div key={i}>{item}</div>
            ))}

            {/* ✅ FLEET CARD — hover reveals fleet items as pills */}
            <div className="about-fleet-hover-card">
              <span className="about-fleet-label">Fleet</span>
              <div className="about-fleet-hover-content">
                {fleetItems.map((item, i) => (
                  <span key={i}>{item}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🔥 SAFETY */}
      <section className="about-safety">
        <div className="about-container">
          <h2>{c("safetyTitle", "Safety & Sustainability")}</h2>
          <p>
            {c("safetyText", "At SMS Infra, safety and sustainability are at the core of our operations. We follow strict safety protocols, use environmentally responsible materials, and ensure compliance with industry standards in every project.")}
          </p>
        </div>
      </section>

      {/* 🔥 MISSION */}
      <section className="about-mission">
        <div className="about-container about-mission-grid">

          <div className="about-mission-card" data-aos="fade-right">
            <h3>{c("missionTitle", "Our Mission")}</h3>
            <p>{c("missionText", "Deliver high-quality infrastructure solutions with innovation and reliability.")}</p>
          </div>

          <div className="about-mission-card" data-aos="fade-left">
            <h3>{c("visionTitle", "Our Vision")}</h3>
            <p>{c("visionText", "To be Bangalore's most trusted construction partner.")}</p>
          </div>

        </div>
      </section>

      {/* 🔥 QUALITY */}
      <section className="about-quality" data-aos="fade-up">
        <div className="about-container">
          <h2>{c("qualityTitle", "Quality & Standards")}</h2>
          <ul>
            {qualityItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 🔥 VALUES */}
      <section className="about-values">
        <div className="about-container about-values-grid">
          {valuesItems.map((val, i) => (
            <div key={i} data-aos="zoom-in" data-aos-delay={i * 100}>{val}</div>
          ))}
        </div>
      </section>

      {/* 🔥 PROJECTS */}
      <section className="about-projects" data-aos="fade-up">
        <div className="about-container">
          <h2>{c("projectsTitle", "Our Projects")}</h2>
          <p>
            {c("projectsPara1", "Residential, commercial, and infrastructure projects delivered with precision, on-time execution, and complete EPC solutions.")}
          </p>
          <p>
            {c("projectsPara2", "From residential buildings to large-scale infrastructure developments, our projects reflect quality, durability, and timely execution.")}
          </p>
        </div>
      </section>

      {/* 🔥 AREAS */}
      <section className="about-areas">
        <div className="about-container">
          <h2 data-aos="fade-up">{c("areasTitle", "Service Areas")}</h2>

          <div className="about-map-wrapper" data-aos="zoom-in">
            <img src="/bangalore-map.png" alt="Bangalore Service Map" />
            <div className="map-center"></div>
            <div className="map-radius"></div>

            <span className="map-point ecity">Electronic City</span>
            <span className="map-point sarjapur">Sarjapur</span>
            <span className="map-point hsr">HSR Layout</span>
            <span className="map-point btm">BTM Layout</span>
            <span className="map-point whitefield">Whitefield</span>
            <span className="map-point marathahalli">Marathahalli</span>
          </div>

          <div className="about-areas-grid">
            {areasItems.map((area, i) => (
              <span key={i}>{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 CTA */}
      <section className="about-cta" data-aos="zoom-in">
        <div className="about-container">
          <h2>{c("ctaTitle", "Let's Build Something Great Together")}</h2>
          <p>
            {c("ctaText", "Looking for a reliable construction partner in Bangalore? Get in touch with SMS Infra today for high-quality and cost-effective solutions.")}
          </p>
          <button onClick={() => navigate("/contact")}>{c("ctaBtnText", "Contact Us")}</button>
        </div>
      </section>

    </div>
  );
}

export default About;
