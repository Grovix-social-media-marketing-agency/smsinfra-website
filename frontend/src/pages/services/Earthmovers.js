import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight2,
} from "iconsax-react";

import {
  FaHardHat,
  FaCheckCircle,
  FaIndustry,
  FaMountain,
  FaTruck,
  FaRulerCombined,
  FaShieldAlt,
  FaHome,
  FaBuilding,
  FaRoad,
  FaMapMarkedAlt,
  FaLayerGroup,
} from "react-icons/fa";

import {
  GiBulldozer,
  GiRoad,
  GiMining,
  GiMineTruck,
} from "react-icons/gi";

import { MdConstruction, MdFactory } from "react-icons/md";

import "./Earthmovers.css";

const services = [
  {
    title: "Excavation Services",
    description:
      "Site excavation services for residential, commercial, and infrastructure developments across Bangalore.",
    image: "/earthmovers/excavation.png",
  },
  {
    title: "Land Grading & Leveling",
    description:
      "Professional grading and leveling operations for layouts, roads, and foundation preparation.",
    image: "/earthmovers/grading.png",
  },
  {
    title: "Rock Breaking",
    description:
      "Heavy-duty rock excavation and controlled demolition support using advanced machinery.",
    image: "/earthmovers/rockbreaking.png",
  },
  {
    title: "Earth Hauling",
    description:
      "Efficient transportation of soil, debris, and construction materials across project sites.",
    image: "/earthmovers/hauling.png",
  },
];

const workflow = [
  { label: "Site Inspection",         desc: "On-site survey & feasibility check" },
  { label: "Terrain Analysis",        desc: "Soil type, slope & risk assessment" },
  { label: "Equipment Planning",      desc: "Right machine selection for the task" },
  { label: "Earthmoving Execution",   desc: "Precision digging, grading & hauling" },
  { label: "Debris Removal",          desc: "Clean-up & material transportation" },
  { label: "Final Site Delivery",     desc: "Handover-ready site with inspection" },
];

const machinery = [
  {
    title: "Hydraulic Excavators",
    icon: <GiBulldozer style={{ fontSize: "40px" }} />,
    text: "Heavy-duty excavation and earthmoving operations.",
  },
  {
    title: "Loaders & Tippers",
    icon: <GiMineTruck style={{ fontSize: "40px" }} />,
    text: "Efficient loading and hauling across project sites.",
  },
  {
    title: "Rock Breakers",
    icon: <GiMining style={{ fontSize: "40px" }} />,
    text: "Controlled rock excavation and demolition support.",
  },
  {
    title: "Graders",
    icon: <GiRoad style={{ fontSize: "40px" }} />,
    text: "Accurate leveling and grading for infrastructure projects.",
  },
];

/* Industries — now with icon, sub-label, number */
const industries = [
  {
    label: "Residential Projects",
    sub: "Foundation, grading & site prep for housing",
    icon: <FaHome />,
    num: "01",
  },
  {
    label: "Commercial Buildings",
    sub: "Large-scale excavation & levelling",
    icon: <FaBuilding />,
    num: "02",
  },
  {
    label: "Industrial Infrastructure",
    sub: "Heavy earthwork for factories & warehouses",
    icon: <MdFactory />,
    num: "03",
  },
  {
    label: "Road Construction",
    sub: "Sub-grading, compaction & drainage",
    icon: <FaRoad />,
    num: "04",
  },
  {
    label: "Layout Development",
    sub: "Plot forming, marking & terrain shaping",
    icon: <FaMapMarkedAlt />,
    num: "05",
  },
  {
    label: "Large Scale Earthwork",
    sub: "Bulk cut & fill, embankments & slopes",
    icon: <FaLayerGroup />,
    num: "06",
  },
];

/* ─────────────────────────────────────────
   Marquee items (strip between hero & trust)
───────────────────────────────────────── */
const marqueeItems = [
  "Excavation Services",
  "Rock Breaking",
  "Site Clearing",
  "Bulk Earthworks",
  "Demolition",
  "Grading & Leveling",
  "Hauling & Transport",
  "Infrastructure Projects",
];

const Earthmovers = () => {
  const navigate = useNavigate();

  /* ── refs for scroll-reveal & counters ── */
  const revealRefs = useRef([]);
  const counterRefs = useRef([]);
  const machineryImageRef = useRef(null);
  const heroRef = useRef(null);
  const floatCardRefs = useRef([]);

  /* ── counter data (matches experience-stats in JSX) ── */
  const counterTargets = [
    { target: 50, suffix: "+" },
    { target: 100, suffix: "%" },
    { target: 24, suffix: "/7" },
  ];

  useEffect(() => {
    /* ── 1. SCROLL REVEAL (IntersectionObserver) ── */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("em-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealRefs.current.forEach((el) => {
      if (el) io.observe(el);
    });

    /* ── 2. MACHINERY IMAGE ZOOM REVEAL ── */
    const mio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("em-img-in");
            mio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (machineryImageRef.current) mio.observe(machineryImageRef.current);

    /* ── 3. COUNTER ANIMATION ── */
    const animateCounter = (el, target, suffix) => {
      let start = 0;
      const dur = 1800;
      const step = 16;
      const inc = target / (dur / step);
      const timer = setInterval(() => {
        start += inc;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        el.textContent = Math.round(start) + suffix;
      }, step);
    };

    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = parseInt(e.target.dataset.counterIdx, 10);
            if (!isNaN(idx) && counterTargets[idx]) {
              animateCounter(
                e.target,
                counterTargets[idx].target,
                counterTargets[idx].suffix
              );
            }
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterRefs.current.forEach((el) => {
      if (el) cio.observe(el);
    });

    /* ── 4. HERO PARALLAX ON SCROLL ── */
    const heroEl = heroRef.current;
    const onScroll = () => {
      if (!heroEl) return;
      const y = window.scrollY;
      const content = heroEl.querySelector(".earthmovers-hero-content");
      const machine = heroEl.querySelector(".em-hero-machine-bg");
      if (content) content.style.transform = `translateY(${y * 0.26}px)`;
      if (machine) machine.style.transform = `translateY(${y * 0.11}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── 5. FLOATING CARD MOUSE PARALLAX (hero) ── */
    const onMouseMove = (e) => {
      if (!heroEl) return;
      const { width, height } = heroEl.getBoundingClientRect();
      const cx = e.clientX / width - 0.5;
      const cy = e.clientY / height - 0.5;
      floatCardRefs.current.forEach((fc, i) => {
        if (!fc) return;
        const depth = [10, 16, 22, 14][i] || 12;
        fc.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
      });
    };
    if (heroEl) heroEl.addEventListener("mousemove", onMouseMove);

    /* ── 6. MAGNETIC BUTTONS ── */
    const btns = document.querySelectorAll(
      ".earthmovers-page .primary-btn, .earthmovers-page .secondary-btn"
    );
    const onBtnMove = function (e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.18;
      this.style.setProperty("--em-mag-x", `${x}px`);
      this.style.setProperty("--em-mag-y", `${y}px`);
    };
    const onBtnLeave = function () {
      this.style.setProperty("--em-mag-x", "0px");
      this.style.setProperty("--em-mag-y", "0px");
    };
    btns.forEach((btn) => {
      btn.addEventListener("mousemove", onBtnMove);
      btn.addEventListener("mouseleave", onBtnLeave);
    });

    return () => {
      io.disconnect();
      mio.disconnect();
      cio.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (heroEl) heroEl.removeEventListener("mousemove", onMouseMove);
      btns.forEach((btn) => {
        btn.removeEventListener("mousemove", onBtnMove);
        btn.removeEventListener("mouseleave", onBtnLeave);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* helper to push elements into revealRefs */
  const sr = (extraClass = "") => (el) => {
    if (el && !revealRefs.current.includes(el)) {
      if (extraClass) el.dataset.srClass = extraClass;
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="earthmovers-page">

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <section
        className="earthmovers-hero"
        ref={heroRef}
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0,0,0,0.72),
              rgba(0,0,0,0.82)
            ),
            url("/earthmovers/earthmovers-hero-bg.png")
          `,
        }}
      >
        {/* animated scan-line overlay */}
        <div className="em-scan-line" aria-hidden="true"></div>

        {/* machine silhouette depth layer */}
        <div className="em-hero-machine-bg" aria-hidden="true"></div>

        <div className="earthmovers-overlay"></div>

        <div className="earthmovers-hero-content">
          <span className="earthmovers-tag">
            <span className="em-tag-dot" aria-hidden="true"></span>
            SMS INFRA EARTHMOVERS
          </span>

          <h1>
            Reliable Earthmoving &
            Excavation Services Across{" "}
            <em className="em-shimmer">Bangalore</em>
          </h1>

          <p>
            SMS Infra provides excavation,
            grading, demolition, rock breaking,
            and earth hauling services for
            residential, commercial, and
            infrastructure developments.
          </p>

          <div className="earthmovers-hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/contact")}
            >
              Request Quote
              <ArrowRight2 size="20" />
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/services")}
            >
              View Our Services
            </button>
          </div>

          {/* ── MOBILE FLOATING CARDS — shown inline on mobile only ── */}
          <div className="em-mobile-cards">
            <div
              className="earthmovers-floating-card card-one"
              ref={(el) => (floatCardRefs.current[0] = el)}
            >
              <GiBulldozer style={{ fontSize: "20px", color: "#e8a48a" }} />
              <span>Excavation</span>
            </div>
            <div
              className="earthmovers-floating-card card-two"
              ref={(el) => (floatCardRefs.current[1] = el)}
            >
              <FaTruck style={{ fontSize: "18px", color: "#e8a48a" }} />
              <span>Hauling</span>
            </div>
            <div
              className="earthmovers-floating-card card-three-m"
            >
              <FaRulerCombined style={{ fontSize: "16px", color: "#e8a48a" }} />
              <span>Grading</span>
            </div>
          </div>
        </div>

        {/* ── DESKTOP floating cards — positioned absolutely ── */}
        <div
          className="earthmovers-floating-card card-three em-desktop-only"
          ref={(el) => (floatCardRefs.current[2] = el)}
        >
          <FaRulerCombined style={{ fontSize: "20px", color: "#e8a48a" }} />
          <span>Grading</span>
        </div>

        <div
          className="earthmovers-floating-card card-four em-desktop-only"
          ref={(el) => (floatCardRefs.current[3] = el)}
        >
          <MdConstruction style={{ fontSize: "24px", color: "#e8a48a" }} />
          <span>Demolition</span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE STRIP
      ════════════════════════════════════════ */}
      <div className="em-marquee-wrap" aria-hidden="true">
        <div className="em-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span className="em-marquee-item" key={i}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          TRUST STRIP
      ════════════════════════════════════════ */}
      <section className="earthmovers-trust-strip">
        <div className="trust-box" ref={sr()}>
          <h2>50+</h2>
          <p>Excavation Contracts</p>
        </div>
        <div className="trust-box" ref={sr()}>
          <h2>Bangalore</h2>
          <p>Operational Coverage</p>
        </div>
        <div className="trust-box" ref={sr()}>
          <h2>Skilled</h2>
          <p>Machine Operators</p>
        </div>
        <div className="trust-box" ref={sr()}>
          <h2>Modern</h2>
          <p>Equipment Fleet</p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ABOUT SECTION
      ════════════════════════════════════════ */}
      <section className="earthmovers-about">
        <div className="earthmovers-about-left em-sr-left" ref={sr("left")}>
          <span className="section-subtitle">EARTHMOVERS</span>

          <h2>
            Heavy Earthmoving Operations Built
            For Infrastructure Projects
          </h2>

          <p>
            From excavation and land leveling
            to demolition and debris hauling,
            SMS Infra supports infrastructure
            and construction projects with
            skilled operators, heavy machinery,
            and reliable on-site execution
            across Bangalore.
          </p>

          <div className="earthmovers-about-points">
            <div>
              <FaCheckCircle />
              <span>Excavation & Site Preparation</span>
            </div>
            <div>
              <FaCheckCircle />
              <span>Demolition & Rock Breaking</span>
            </div>
            <div>
              <FaCheckCircle />
              <span>Land Grading & Earth Hauling</span>
            </div>
          </div>
        </div>

        <div
          className="earthmovers-about-right em-sr-right"
          ref={sr("right")}
          style={{ backgroundImage: 'url("/earthmovers/about.png")' }}
        >
          {/* floating badge over about image */}
          <div className="em-about-badge">
            <div className="em-badge-num">28+</div>
            <div className="em-badge-txt">Years of Excellence</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICES SECTION
      ════════════════════════════════════════ */}
      <section className="earthmovers-services">
        <div className="section-heading" ref={sr()}>
          <span>OUR SERVICES</span>
          <h2>Earthmoving & Site Development Services</h2>
        </div>

        <div className="earthmovers-services-grid">
          {services.map((service, index) => (
            <div
              className="service-panel em-sr"
              key={index}
              ref={sr()}
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div
                className="service-image"
                style={{ backgroundImage: `url(${service.image})` }}
              >
                <div className="service-overlay">
                  <h3>{service.title}</h3>
                </div>
              </div>
              <div className="service-content">
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          WORKFLOW
      ════════════════════════════════════════ */}
      <section className="earthmovers-workflow">
        <div className="section-heading light" ref={sr()}>
          <span>EXECUTION FLOW</span>
          <h2>Our Earthmoving Process</h2>
        </div>

        {/* Desktop: horizontal flex (unchanged) */}
        <div className="workflow-container em-desktop-workflow">
          {workflow.map((step, index) => (
            <div
              className="workflow-step em-sr"
              key={index}
              ref={sr()}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="workflow-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3>{step.label}</h3>
            </div>
          ))}
        </div>

        {/* Mobile: vertical stepper */}
        <div className="workflow-stepper em-mobile-workflow">
          {workflow.map((step, index) => (
            <div
              className="workflow-stepper-item em-sr"
              key={index}
              ref={sr()}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* left column: number + line */}
              <div className="stepper-left">
                <div className="stepper-num">
                  {String(index + 1).padStart(2, "0")}
                </div>
                {index < workflow.length - 1 && (
                  <div className="stepper-line" />
                )}
              </div>
              {/* right column: text */}
              <div className="stepper-body">
                <h3>{step.label}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          MACHINERY
      ════════════════════════════════════════ */}
      <section className="earthmovers-machinery">
        <div className="section-heading" ref={sr()}>
          <span>OUR MACHINERY</span>
          <h2>Equipment & Site Support Machinery</h2>
        </div>

        <div className="machinery-grid">
          {machinery.map((item, index) => (
            <div
              className="machinery-card em-sr-scale"
              key={index}
              ref={sr()}
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div className="machinery-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Machinery image — always visible, forced display */}
        <div
          className="earthmovers-machinery-image em-img-reveal"
          ref={machineryImageRef}
          style={{
            backgroundImage: 'url("/earthmovers/machinery.png")',
            display: "block",
          }}
        ></div>
      </section>

      {/* ════════════════════════════════════════
          EXPERIENCE
      ════════════════════════════════════════ */}
      <section
        className="earthmovers-experience"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0,0,0,0.72),
              rgba(0,0,0,0.82)
            ),
            url("/earthmovers/experience.png")
          `,
        }}
      >
        <div className="experience-overlay"></div>

        <div className="experience-content">
          <span className="em-sr" ref={sr()}>
            PROJECT EXPERIENCE
          </span>

          <h2 className="em-sr" ref={sr()}>
            Supporting Excavation & Site
            Development Projects Across Bangalore
          </h2>

          <div className="experience-stats">
            <div className="em-sr" ref={sr()}>
              <h3
                data-counter-idx="0"
                ref={(el) => {
                  if (el && !counterRefs.current.includes(el)) {
                    el.dataset.counterIdx = "0";
                    counterRefs.current.push(el);
                  }
                }}
              >
                50+
              </h3>
              <p>Completed Excavation Contracts</p>
            </div>

            <div className="em-sr" ref={sr()}>
              <h3>Large Scale</h3>
              <p>Infrastructure Site Operations</p>
            </div>

            <div className="em-sr" ref={sr()}>
              <h3
                data-counter-idx="2"
                ref={(el) => {
                  if (el && !counterRefs.current.includes(el)) {
                    el.dataset.counterIdx = "2";
                    counterRefs.current.push(el);
                  }
                }}
              >
                24/7
              </h3>
              <p>Operational Project Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SAFETY
      ════════════════════════════════════════ */}
      <section className="earthmovers-safety">
        <div className="earthmovers-safety-left em-sr-left" ref={sr("left")}>
          <span>SAFETY & COMPLIANCE</span>

          <h2>
            Disciplined Site Operations With
            Safety-First Execution
          </h2>

          <p>
            SMS Infra follows Environmental,
            Health &amp; Safety standards with
            trained operators, monitored
            equipment handling, and
            process-driven site execution.
          </p>
        </div>

        <div className="earthmovers-safety-right em-sr-right" ref={sr("right")}>
          <div className="safety-card">
            <FaHardHat />
            <h3>Trained Operators</h3>
          </div>
          <div className="safety-card">
            <FaShieldAlt style={{ fontSize: "45px" }} />
            <h3>Safety Compliance</h3>
          </div>
          <div className="safety-card">
            <FaIndustry />
            <h3>Process Driven Execution</h3>
          </div>
          <div className="safety-card">
            <FaMountain />
            <h3>Site Risk Management</h3>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          INDUSTRIES — Redesigned bold cards
      ════════════════════════════════════════ */}
      <section className="earthmovers-industries">
        <div className="section-heading" ref={sr()}>
          <span>INDUSTRIES</span>
          <h2>Projects We Support</h2>
        </div>

        <div className="industries-grid">
          {industries.map((industry, index) => (
            <div
              className="industry-card em-sr"
              key={index}
              ref={sr()}
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              {/* numbered badge top-right */}
              <span className="industry-num">{industry.num}</span>

              {/* icon block */}
              <div className="industry-icon">
                {industry.icon}
              </div>

              {/* title */}
              <span className="industry-label">{industry.label}</span>

              {/* sub-description */}
              <p className="industry-sub">{industry.sub}</p>

              {/* hover arrow */}
              <span className="industry-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          GALLERY
      ════════════════════════════════════════ */}
      <section className="earthmovers-gallery">
        <div className="section-heading light" ref={sr()}>
          <span>PROJECT GALLERY</span>
          <h2>Operational Site Visuals</h2>
        </div>

        <div className="gallery-grid">
          <div
            className="gallery-item large em-sr"
            ref={sr()}
            style={{ backgroundImage: 'url("/earthmovers/gallery1.png")' }}
          ></div>
          <div
            className="gallery-item em-sr"
            ref={sr()}
            style={{
              backgroundImage: 'url("/earthmovers/gallery2.png")',
              transitionDelay: "0.1s",
            }}
          ></div>
          <div
            className="gallery-item em-sr"
            ref={sr()}
            style={{
              backgroundImage: 'url("/earthmovers/gallery3.png")',
              transitionDelay: "0.2s",
            }}
          ></div>
          <div
            className="gallery-item tall em-sr"
            ref={sr()}
            style={{
              backgroundImage: 'url("/earthmovers/gallery4.png")',
              transitionDelay: "0.3s",
            }}
          ></div>
          <div
            className="gallery-item em-sr"
            ref={sr()}
            style={{
              backgroundImage: 'url("/earthmovers/gallery5.png")',
              transitionDelay: "0.4s",
            }}
          ></div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
      ════════════════════════════════════════ */}
      <section className="earthmovers-faq">
        <div className="section-heading" ref={sr()}>
          <span>FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-container">
          <div className="faq-item em-sr" ref={sr()}>
            <h3>What earthmoving services do you provide?</h3>
            <p>
              We provide excavation, grading, demolition, hauling, and rock
              breaking services for infrastructure and construction developments.
            </p>
          </div>
          <div
            className="faq-item em-sr"
            ref={sr()}
            style={{ transitionDelay: "0.1s" }}
          >
            <h3>Do you support large-scale projects?</h3>
            <p>
              Yes, SMS Infra supports industrial, commercial, and infrastructure
              earthmoving operations.
            </p>
          </div>
          <div
            className="faq-item em-sr"
            ref={sr()}
            style={{ transitionDelay: "0.2s" }}
          >
            <h3>Do you provide machinery with operators?</h3>
            <p>
              Yes, all equipment operations are managed by trained and skilled
              operators.
            </p>
          </div>
          <div
            className="faq-item em-sr"
            ref={sr()}
            style={{ transitionDelay: "0.3s" }}
          >
            <h3>Which regions do you serve?</h3>
            <p>
              Our operations are primarily focused in and around Bangalore.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="earthmovers-cta">
        <div className="cta-content em-sr" ref={sr()}>
          <span>LET'S BUILD TOGETHER</span>

          <h2>
            Need Reliable Earthmoving Support
            For Your Next Project?
          </h2>

          <div className="cta-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/contact")}
            >
              Request A Quote
              <ArrowRight2 size="20" />
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/contact")}
            >
              Contact Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Earthmovers;