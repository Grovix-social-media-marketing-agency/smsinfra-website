import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowUp,
  Truck,
  Factory,
  Hammer,
  ShieldCheck,
  ChevronRight,
  Workflow,
  HardHat,
  Building2,
} from 'lucide-react';

import './machinery.css';

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
   DATA
========================================================= */

const EARTHMOVERS = [
  {
    icon: <Truck size={24} />,
    title: 'Excavation Services',
    desc:
      'Large-scale excavation and land preparation services for infrastructure and industrial projects.',
  },

  {
    icon: <Hammer size={24} />,
    title: 'Demolition & Grading',
    desc:
      'Operational demolition, grading, and hauling systems executed using heavy-duty machinery.',
  },

  {
    icon: <ShieldCheck size={24} />,
    title: 'Infrastructure Execution',
    desc:
      'Reliable earthmoving operations supporting commercial and infrastructure development.',
  },
];

const CRUSHER_SYSTEMS = [
  {
    icon: <Factory size={22} />,
    title: 'Aggregates Production',
    desc:
      'Production of well-graded aggregates conforming to IS 383-2016 standards.',
  },

  {
    icon: <Factory size={22} />,
    title: 'VSI Crushing Technology',
    desc:
      'Three-stage crushing systems using Jaw Crusher, Cone Crusher, and VSI shaping machines.',
  },

  {
    icon: <Factory size={22} />,
    title: 'M Sand & P Sand',
    desc:
      'Premium-quality manufactured sand and plastering sand with superior consistency and durability.',
  },
];

const WORKFLOW = [
  {
    icon: <Workflow size={22} />,
    title: 'Planning & Engineering',
    desc:
      'Process-driven planning and engineering systems for infrastructure execution.',
  },

  {
    icon: <Building2 size={22} />,
    title: 'Procurement & Deployment',
    desc:
      'Machinery mobilization, resource procurement, and operational setup.',
  },

  {
    icon: <HardHat size={22} />,
    title: 'Construction & Commissioning',
    desc:
      'Execution, installation, supervision, and commissioning under one integrated workflow.',
  },
];

const EXPERIENCE = [
  {
    number: '50+',
    label: 'Excavation Contracts Completed',
  },

  {
    number: '1996',
    label: 'Production Facility Operational Since',
  },

  {
    number: '45,000',
    label: 'Concrete Blocks Produced Weekly',
  },

  {
    number: '30+',
    label: 'Years Industry Experience',
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Machinery() {

  const [showTop, setShowTop] = useState(false);

  const [heroRef, heroVisible] = useReveal();
  const [earthRef, earthVisible] = useReveal();
  const [crusherRef, crusherVisible] = useReveal();
  const [workflowRef, workflowVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () =>
      window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="machinery-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="machinery-hero">

        <div
          className="machinery-hero-bg"
          style={{
            backgroundImage:
              "url('/machinery/machinery-hero-bg.png')",
          }}
        />

        <div className="machinery-overlay" />

        <div className="machinery-grid-overlay" />

        <div className="container">

          <div
            ref={heroRef}
            className={`machinery-hero-content ${
              heroVisible ? 'is-visible' : ''
            }`}
          >

            {/* LEFT */}

            <div className="machinery-hero-left">

              <span className="machinery-badge">
                Heavy Machinery & Infrastructure
              </span>

              <h1>
                Industrial Machinery
                <span> Powering Infrastructure Development</span>
              </h1>

              <p>
                SMS Infra operates advanced earthmoving equipment,
                crusher systems, excavation machinery, and
                infrastructure production units supporting
                construction and industrial projects across Bangalore.
              </p>

              <div className="machinery-hero-actions">

                <Link
                  to="/contact"
                  className="machinery-btn primary"
                >
                  Request Consultation
                </Link>

                <a
                  href="#earthmovers"
                  className="machinery-btn secondary"
                >
                  Explore Operations
                  <ChevronRight size={16} />
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          EARTHMOVERS
      ===================================================== */}

      <section
        id="earthmovers"
        ref={earthRef}
        className={`earthmovers-section ${
          earthVisible ? 'is-visible' : ''
        }`}
      >

        <div className="container">

          <div className="section-heading center">

            <span className="section-label">
              Earthmoving Operations
            </span>

            <h2>
              Excavation & Heavy Equipment Services
            </h2>

            <p>
              SMS Infra provides excavation, demolition,
              grading, and hauling services with a reputation
              for delivering high-quality earthmoving operations
              across Bangalore.
            </p>

          </div>

          <div className="earthmovers-layout">

            <div className="earthmovers-image">

              <img
                src="/machinery/earthmovers-operation.png"
                alt="Earthmovers"
              />

            </div>

            <div className="earthmovers-grid">

              {EARTHMOVERS.map((item, index) => (

                <div
                  key={index}
                  className="earth-card"
                >

                  <div className="earth-icon">
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.desc}</p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CRUSHER & AGGREGATES
      ===================================================== */}

      <section
        ref={crusherRef}
        className={`crusher-section ${
          crusherVisible ? 'is-visible' : ''
        }`}
      >

        <div className="container">

          <div className="crusher-layout">

            <div className="crusher-content">

              <span className="section-label">
                Crusher & Production Systems
              </span>

              <h2>
                Aggregates, M Sand &
                Industrial Processing Infrastructure
              </h2>

              <p>
                SMS Infra operates advanced crusher systems
                producing aggregates, M Sand, and plastering
                sand using VSI technology and process-driven
                manufacturing infrastructure.
              </p>

              <div className="crusher-points">

                {CRUSHER_SYSTEMS.map((item, index) => (

                  <div
                    key={index}
                    className="crusher-point"
                  >

                    <div className="crusher-point-icon">
                      {item.icon}
                    </div>

                    <div>

                      <h4>{item.title}</h4>

                      <p>{item.desc}</p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="crusher-image">

              <img
                src="/machinery/crusher-unit.png"
                alt="Crusher Unit"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WORKFLOW
      ===================================================== */}

      <section
        ref={workflowRef}
        className={`workflow-section ${
          workflowVisible ? 'is-visible' : ''
        }`}
      >

        <div className="container">

          <div className="section-heading center">

            <span className="section-label">
              EPC Workflow
            </span>

            <h2>
              Process Driven Infrastructure Execution
            </h2>

            <p>
              SMS Infra follows a structured execution process
              covering engineering design, procurement,
              construction, installation, and commissioning
              under one integrated system.
            </p>

          </div>

          <div className="workflow-grid">

            {WORKFLOW.map((item, index) => (

              <div
                key={index}
                className="workflow-card"
              >

                <div className="workflow-number">
                  0{index + 1}
                </div>

                <div className="workflow-icon">
                  {item.icon}
                </div>

                <h3>{item.title}</h3>

                <p>{item.desc}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          EXPERIENCE
      ===================================================== */}

      <section
        ref={statsRef}
        className={`experience-section ${
          statsVisible ? 'is-visible' : ''
        }`}
      >

        <div className="container">

          <div className="experience-grid">

            {EXPERIENCE.map((item, index) => (

              <div
                key={index}
                className="experience-card"
              >

                <h3>{item.number}</h3>

                <p>{item.label}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="machinery-cta">

        <div
          className="machinery-cta-bg"
          style={{
            backgroundImage:
              "url('/machinery/machinery-cta-bg.png')",
          }}
        />

        <div className="machinery-cta-overlay" />

        <div className="container">

          <div className="machinery-cta-content">

            <span className="section-label light">
              Partner With SMS Infra
            </span>

            <h2>
              Need Industrial Machinery &
              Infrastructure Support?
            </h2>

            <p>
              Partner with SMS Infra for excavation systems,
              crusher operations, earthmoving services,
              infrastructure execution, and industrial
              production support.
            </p>

            <div className="machinery-cta-actions">

              <Link
                to="/contact"
                className="machinery-btn primary"
              >
                Request Quote
              </Link>

              <Link
                to="/contact"
                className="machinery-btn glass"
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
