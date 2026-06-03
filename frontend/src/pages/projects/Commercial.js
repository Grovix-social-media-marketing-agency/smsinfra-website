import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Truck,
  Factory,
  HardHat,
  ChevronRight,
  ArrowUp,
  ShieldCheck,
  Hammer,
  Workflow,
  MapPinned,
} from 'lucide-react';

import './commercial.css';

/* ============================================================
   HOOK — useReveal
   Observes an element and marks it visible once it enters
   the viewport. Unobserves after first trigger by default.
============================================================ */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ============================================================
   DATA
============================================================ */
const EXECUTION_CARDS = [
  {
    icon: <Truck size={24} />,
    title: 'Earthmoving Operations',
    desc: 'Large-scale excavation, grading, hauling, and site preparation with heavy machinery support.',
    image: '/commercial/earthmovers-site.png',
  },
  {
    icon: <Factory size={24} />,
    title: 'Concrete & RMC Plants',
    desc: 'Process-driven batching systems delivering high-performance ready mix concrete solutions.',
    image: '/commercial/rmc-plant.png',
  },
  {
    icon: <Building2 size={24} />,
    title: 'Infrastructure Development',
    desc: 'Commercial and industrial infrastructure execution powered by engineering precision.',
    image: '/commercial/infra-development.png',
  },
];

const MACHINERY = [
  { title: 'Excavators',        image: '/commercial/excavator-machine.png' },
  { title: 'Crusher Units',     image: '/commercial/crusher-unit.png' },
  { title: 'Transit Mixers',    image: '/commercial/transit-mixer.png' },
  { title: 'Heavy Earthmovers', image: '/commercial/earthmover-machine.png' },
];

const PROJECT_STATS = [
  { number: '50+',    label: 'Excavation Contracts' },
  { number: '45,000', label: 'Blocks Produced Weekly' },
  { number: '800K+',  label: 'Ready Stock Capacity' },
  { number: '30+',    label: 'Years Industry Expertise' },
];

const PROCESS_STEPS = [
  {
    icon: <Workflow size={24} />,
    title: 'Site Planning',
    desc: 'Project evaluation, land assessment, and infrastructure planning.',
  },
  {
    icon: <HardHat size={24} />,
    title: 'Execution & Machinery',
    desc: 'Heavy equipment deployment and operational execution at scale.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Quality Assurance',
    desc: 'Strict IS-standard compliance with testing and verification.',
  },
  {
    icon: <Hammer size={24} />,
    title: 'Project Delivery',
    desc: 'Efficient delivery, installation, and infrastructure completion.',
  },
];

const MACHINERY_POINTS = [
  'Active infrastructure operations across Bangalore',
  'Advanced excavation & hauling systems',
  'High-capacity RMC & crusher plant operations',
];

/* ============================================================
   MAIN COMPONENT
============================================================ */
export default function Commercial() {
  const [showTop, setShowTop] = useState(false);

  const [heroRef,      heroVisible]      = useReveal(0.05);
  const [executionRef, executionVisible] = useReveal(0.05);
  const [machineryRef, machineryVisible] = useReveal(0.05);
  const [statsRef,     statsVisible]     = useReveal(0.05);
  const [processRef,   processVisible]   = useReveal(0.05);

  /* Back-to-top trigger */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="commercial-page">

      {/* ======================================================
          HERO
      ====================================================== */}
      <section className="commercial-hero">

        <div
          className="commercial-hero-bg"
          style={{ backgroundImage: "url('/commercial/commercial-hero-bg.png')" }}
        />
        <div className="commercial-overlay" />
        <div className="commercial-grid-overlay" />

        <div className="container">
          <div
            ref={heroRef}
            className={`commercial-hero-content${heroVisible ? ' is-visible' : ''}`}
          >
            {/* LEFT */}
            <div className="commercial-hero-left">

              <span className="commercial-badge">
                Industrial Infrastructure Division
              </span>

              <h1>
                Commercial Infrastructure
                <span> &amp; Industrial Execution</span>
              </h1>

              <p>
                SMS Infra delivers large-scale commercial and infrastructure
                execution powered by advanced machinery, operational expertise,
                batching plants, excavation systems, and process-driven
                construction capabilities across Bangalore and surrounding regions.
              </p>

              <div className="commercial-hero-actions">
                <Link to="/contact" className="commercial-btn primary">
                  Request Project Consultation
                </Link>
                <a href="#execution" className="commercial-btn secondary">
                  Explore Operations
                </a>
              </div>

              <div className="commercial-hero-tags">
                <span className="hero-tag">
                  <ShieldCheck size={14} />
                  IS Standard Quality
                </span>
                <span className="hero-tag">
                  <Factory size={14} />
                  RMC &amp; Crusher Plants
                </span>
                <span className="hero-tag">
                  <Truck size={14} />
                  Large Scale Operations
                </span>
              </div>

            </div>

            {/* RIGHT — floating cards */}
            <div className="commercial-hero-right">
              <div className="floating-machine-card card-1">
                <img src="/commercial/floating-excavator.png" alt="Excavator" />
                <div className="floating-content">
                  <h3>Earthmoving Division</h3>
                  <p>Excavation &amp; heavy machinery execution.</p>
                </div>
              </div>

              <div className="floating-machine-card card-2">
                <img src="/commercial/floating-rmc.png" alt="RMC Plant" />
                <div className="floating-content">
                  <h3>RMC Production</h3>
                  <p>Trusted batching plant infrastructure.</p>
                </div>
              </div>

              <div className="floating-machine-card card-3">
                <img src="/commercial/floating-crusher.png" alt="Crusher" />
                <div className="floating-content">
                  <h3>Crusher Operations</h3>
                  <p>High-performance aggregates &amp; M-Sand units.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================
          EXECUTION
      ====================================================== */}
      <section
        id="execution"
        ref={executionRef}
        className={`execution-section${executionVisible ? ' is-visible' : ''}`}
      >
        <div className="container">

          <div className="section-heading center">
            <span className="section-label">Operational Excellence</span>
            <h2>Real Infrastructure Execution</h2>
            <p>
              Our operational ecosystem includes excavation, machinery deployment,
              batching plants, crusher units, transportation systems, and
              infrastructure execution capabilities tailored for industrial and
              commercial developments.
            </p>
          </div>

          <div className="execution-grid">
            {EXECUTION_CARDS.map((card, i) => (
              <div key={i} className="execution-card">
                <div className="execution-image">
                  <img src={card.image} alt={card.title} />
                  <div className="execution-overlay" />
                </div>
                <div className="execution-content">
                  <div className="execution-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <button type="button">
                    Learn More <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================
          MACHINERY
      ====================================================== */}
      <section
        ref={machineryRef}
        className={`machinery-section${machineryVisible ? ' is-visible' : ''}`}
      >
        <div className="container">
          <div className="machinery-layout">

            <div className="machinery-left">
              <span className="section-label">Heavy Equipment Fleet</span>
              <h2>Machinery &amp; Operational Strength</h2>
              <p>
                SMS Infra operates advanced earthmovers, excavation equipment,
                crushing systems, transportation units, and batching infrastructure
                enabling reliable execution of large-scale commercial and
                infrastructure projects.
              </p>
              <ul className="machinery-list">
                {MACHINERY_POINTS.map((item, i) => (
                  <li key={i}>
                    <MapPinned size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="machinery-grid">
              {MACHINERY.map((item, i) => (
                <div key={i} className="machinery-card">
                  <img src={item.image} alt={item.title} />
                  <div className="machinery-card-overlay" />
                  <div className="machinery-card-content">
                    <h3>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================
          STATS
      ====================================================== */}
      <section
        ref={statsRef}
        className={`commercial-stats${statsVisible ? ' is-visible' : ''}`}
      >
        <div className="container">
          <div className="stats-grid">
            {PROJECT_STATS.map((item, i) => (
              <div key={i} className="stats-card">
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          PROCESS
      ====================================================== */}
      <section
        ref={processRef}
        className={`process-section${processVisible ? ' is-visible' : ''}`}
      >
        <div className="container">

          <div className="section-heading center">
            <span className="section-label">Process Driven Execution</span>
            <h2>End-to-End Infrastructure Workflow</h2>
            <p>
              From planning and machinery deployment to quality verification and
              project delivery, SMS Infra follows a structured operational workflow
              focused on reliability, efficiency, and engineering excellence.
            </p>
          </div>

          <div className="process-grid">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="process-card">
                <div className="process-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================
          CTA
      ====================================================== */}
      <section className="commercial-cta">
        <div
          className="commercial-cta-bg"
          style={{ backgroundImage: "url('/commercial/commercial-cta-bg.png')" }}
        />
        <div className="commercial-cta-overlay" />

        <div className="container">
          <div className="commercial-cta-content">
            <span className="section-label light">Build With SMS Infra</span>
            <h2>Planning A Commercial Infrastructure Project?</h2>
            <p>
              Partner with SMS Infra for excavation, infrastructure execution,
              batching plant support, crusher operations, aggregates supply, and
              industrial construction solutions.
            </p>
            <div className="commercial-cta-actions">
              <Link to="/contact" className="commercial-btn primary">
                Request Quote
              </Link>
              <Link to="/contact" className="commercial-btn glass">
                Talk To Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          BACK TO TOP
      ====================================================== */}
      <button
        type="button"
        className={`back-top${showTop ? ' show' : ''}`}
        onClick={scrollTop}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>

    </div>
  );
}
