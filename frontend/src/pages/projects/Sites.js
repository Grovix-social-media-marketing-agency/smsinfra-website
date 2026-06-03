import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowUp,
  HardHat,
  ShieldCheck,
  Truck,
  Hammer,
  ChevronRight,
  Activity,
  AlertTriangle,
  Clock3,
  MapPinned,
  Workflow,
  Construction,
} from 'lucide-react';

import './constructionSite.css';

/* =========================================================
   REVEAL HOOK
========================================================= */

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* =========================================================
   LIVE SITE DATA
========================================================= */

const LIVE_OPERATIONS = [
  {
    title: 'Excavation & Earthwork',
    image: '/construction-site/excavation-earthwork.png',
    desc:
      'Large-scale excavation, grading, land preparation, and earthmoving operations for infrastructure development.',
  },

  {
    title: 'Structural Concrete Work',
    image: '/construction-site/structural-concrete.png',
    desc:
      'On-site concrete execution supported by batching systems, transit mixers, and engineering supervision.',
  },

  {
    title: 'Machinery Deployment',
    image: '/construction-site/machinery-deployment.png',
    desc:
      'Operational deployment of excavators, hauling systems, and heavy-duty construction machinery.',
  },
];

const SITE_WORKFLOW = [
  {
    icon: <Activity size={24} />,
    title: 'Site Inspection',
    desc:
      'Land analysis, operational planning, and infrastructure site evaluation before execution.',
  },

  {
    icon: <Truck size={24} />,
    title: 'Heavy Equipment Mobilization',
    desc:
      'Transportation and deployment of excavators, earthmovers, and operational machinery.',
  },

  {
    icon: <Construction size={24} />,
    title: 'Construction Execution',
    desc:
      'Excavation, structural development, concrete operations, and infrastructure execution.',
  },

  {
    icon: <ShieldCheck size={24} />,
    title: 'Safety & Quality Monitoring',
    desc:
      'Continuous supervision, structural verification, and process-driven quality systems.',
  },
];

const LIVE_SITE_STATS = [
  {
    number: '50+',
    label: 'Excavation Contracts Completed',
  },

  {
    number: '30+',
    label: 'Heavy Machinery Units',
  },

  {
    number: '120+',
    label: 'Operational Workforce',
  },

  {
    number: '24/7',
    label: 'Construction Workflow',
  },
];

const SITE_GALLERY = [
  {
    title: 'Excavation Operations',
    image: '/construction-site/gallery-excavation.png',
  },

  {
    title: 'Concrete Site Execution',
    image: '/construction-site/gallery-concrete.png',
  },

  {
    title: 'Heavy Machinery',
    image: '/construction-site/gallery-machinery.png',
  },

  {
    title: 'Infrastructure Development',
    image: '/construction-site/gallery-infrastructure.png',
  },
];

const SAFETY_HIGHLIGHTS = [
  {
    icon: <Hammer size={18} />,
    label: 'Tool & Equipment Compliance',
  },
  {
    icon: <Clock3 size={18} />,
    label: 'Round-the-Clock Monitoring',
  },
  {
    icon: <MapPinned size={18} />,
    label: 'Site-Specific Risk Mapping',
  },
  {
    icon: <Workflow size={18} />,
    label: 'Structured Safety Workflows',
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ConstructionSite() {

  const [showTop, setShowTop] = useState(false);

  const [heroRef, heroVisible] = useReveal();
  const [operationsRef, operationsVisible] = useReveal();
  const [workflowRef, workflowVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();
  const [galleryRef, galleryVisible] = useReveal();

  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () =>
      window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="construction-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="construction-hero">

        <div
          className="construction-hero-bg"
          style={{
            backgroundImage:
              "url('/construction-site/construction-hero-bg.png')",
          }}
        />

        <div className="construction-overlay" />

        <div className="construction-grid-overlay" />

        <div className="container">

          <div
            ref={heroRef}
            className={`construction-hero-content ${
              heroVisible ? 'is-visible' : ''
            }`}
          >

            {/* LEFT */}

            <div className="construction-hero-left">

              <span className="construction-badge">
                Live Infrastructure Operations
              </span>

              <h1>
                Real-Time
                <span> Construction Site Execution</span>
              </h1>

              <p>
                SMS Infra executes large-scale infrastructure and
                construction site operations powered by excavation
                systems, heavy machinery deployment, structural
                concrete execution, and process-driven engineering
                workflows across Bangalore.
              </p>

              <div className="construction-hero-actions">

                <Link
                  to="/contact"
                  className="construction-btn primary"
                >
                  Request Site Consultation
                </Link>

                <a
                  href="#operations"
                  className="construction-btn secondary"
                >
                  Explore Site Operations
                </a>

              </div>

              <div className="construction-tags">

                <div className="construction-tag">
                  <Truck size={14} />
                  Heavy Machinery Operations
                </div>

                <div className="construction-tag">
                  <ShieldCheck size={14} />
                  Safety & Quality Monitoring
                </div>

                <div className="construction-tag">
                  <HardHat size={14} />
                  Live Infrastructure Execution
                </div>

              </div>

            </div>

            {/* RIGHT FLOATING LIVE CARDS */}

            <div className="construction-hero-right">

              <div className="live-site-card card-1">

                <img
                  src="/construction-site/live-excavator.png"
                  alt="Excavation"
                />

                <div className="live-card-content">

                  <span>LIVE SITE</span>

                  <h3>Excavation Operations</h3>

                  <p>
                    Earthmoving and grading workflow currently active.
                  </p>

                </div>

              </div>

              <div className="live-site-card card-2">

                <img
                  src="/construction-site/live-concrete.png"
                  alt="Concrete"
                />

                <div className="live-card-content">

                  <span>STRUCTURAL WORK</span>

                  <h3>Concrete Execution</h3>

                  <p>
                    Real-time concrete pouring & site operations.
                  </p>

                </div>

              </div>

              <div className="live-site-card card-3">

                <img
                  src="/construction-site/live-machinery.png"
                  alt="Machinery"
                />

                <div className="live-card-content">

                  <span>HEAVY MACHINERY</span>

                  <h3>Operational Deployment</h3>

                  <p>
                    Excavators, hauling systems & machinery support.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          LIVE OPERATIONS
      ===================================================== */}

      <section
        id="operations"
        ref={operationsRef}
        className={`live-operations-section ${
          operationsVisible ? 'is-visible' : ''
        }`}
      >

        <div className="container">

          <div className="section-heading center">

            <span className="section-label">
              Active Site Execution
            </span>

            <h2>
              Real Construction Operations
            </h2>

            <p>
              Active infrastructure projects powered by excavation
              systems, heavy machinery, structural execution,
              hauling operations, and coordinated workforce
              management.
            </p>

          </div>

          <div className="operations-grid">

            {LIVE_OPERATIONS.map((item, index) => (

              <div
                key={index}
                className="operations-card"
              >

                <div className="operations-image">

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <div className="operations-overlay" />

                </div>

                <div className="operations-content">

                  <h3>{item.title}</h3>

                  <p>{item.desc}</p>

                  <button>

                    View Operations

                    <ChevronRight size={16} />

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          WORKFLOW TIMELINE
      ===================================================== */}

      <section
        ref={workflowRef}
        className={`construction-workflow ${
          workflowVisible ? 'is-visible' : ''
        }`}
      >

        <div className="container">

          <div className="section-heading center">

            <span className="section-label">
              Process Driven Workflow
            </span>

            <h2>
              Site Execution Lifecycle
            </h2>

            <p>
              Structured construction operations from land analysis
              and machinery deployment to infrastructure execution,
              quality verification, and final project delivery.
            </p>

          </div>

          <div className="workflow-grid">

            {SITE_WORKFLOW.map((step, index) => (

              <div
                key={index}
                className="workflow-card"
              >

                <div className="workflow-number">
                  0{index + 1}
                </div>

                <div className="workflow-icon">
                  {step.icon}
                </div>

                <h3>{step.title}</h3>

                <p>{step.desc}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          LIVE STATS
      ===================================================== */}

      <section
        ref={statsRef}
        className={`construction-stats ${
          statsVisible ? 'is-visible' : ''
        }`}
      >

        <div className="container">

          <div className="stats-grid">

            {LIVE_SITE_STATS.map((item, index) => (

              <div
                key={index}
                className="stats-card"
              >

                <h3>{item.number}</h3>

                <p>{item.label}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          SITE GALLERY
      ===================================================== */}

      <section
        ref={galleryRef}
        className={`site-gallery ${
          galleryVisible ? 'is-visible' : ''
        }`}
      >

        <div className="container">

          <div className="section-heading center">

            <span className="section-label">
              Live Site Visuals
            </span>

            <h2>
              Infrastructure Execution Gallery
            </h2>

            <p>
              Explore real construction operations including
              excavation systems, structural work, heavy equipment
              deployment, and active infrastructure development.
            </p>

          </div>

          <div className="gallery-grid">

            {SITE_GALLERY.map((item, index) => (

              <div
                key={index}
                className="gallery-card"
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div className="gallery-overlay" />

                <div className="gallery-content">

                  <h3>{item.title}</h3>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          SAFETY STRIP
      ===================================================== */}

      <section className="site-safety-strip">

        <div className="container">

          <div className="safety-strip-content">

            <div className="safety-icon">

              <AlertTriangle size={22} />

            </div>

            <div>

              <h3>
                Safety Focused Infrastructure Operations
              </h3>

              <p>
                SMS Infra follows process-driven safety systems,
                workforce supervision, operational monitoring,
                machinery inspections, and quality-focused
                infrastructure execution workflows.
              </p>

              <div className="safety-highlights">

                {SAFETY_HIGHLIGHTS.map((item, index) => (

                  <div
                    key={index}
                    className="safety-highlight-tag"
                  >

                    {item.icon}

                    <span>{item.label}</span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="construction-cta">

        <div
          className="construction-cta-bg"
          style={{
            backgroundImage:
              "url('/construction-site/construction-cta-bg.png')",
          }}
        />

        <div className="construction-cta-overlay" />

        <div className="container">

          <div className="construction-cta-content">

            <span className="section-label light">
              Build With SMS Infra
            </span>

            <h2>
              Need Industrial Construction
              Site Execution?
            </h2>

            <p>
              Partner with SMS Infra for excavation systems,
              heavy machinery deployment, infrastructure execution,
              structural concrete operations, and industrial-scale
              construction workflow management.
            </p>

            <div className="construction-cta-actions">

              <Link
                to="/contact"
                className="construction-btn primary"
              >
                Request Quote
              </Link>

              <Link
                to="/contact"
                className="construction-btn glass"
              >
                Talk To Our Team
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          BACK TO TOP
      ===================================================== */}

      <button
        className={`back-top ${
          showTop ? 'show' : ''
        }`}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
      >
        <ArrowUp size={18} />
      </button>

    </div>
  );
}