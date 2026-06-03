import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowUp,
  Factory,
  ShieldCheck,
  ChevronRight,
  Layers3,
  CheckCircle2,
  Building2,
  Droplets,
  Mountain,
  Waves,
  FlaskConical,
} from 'lucide-react';

import './productionUnit.css';

/* =========================================================
   REVEAL HOOK
========================================================= */

function useReveal(threshold = 0.05) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* =========================================================
   DATA  (sourced directly from SMS Infra company brochure)
========================================================= */

const PRODUCTION_UNITS = [
  {
    icon: <Layers3 size={24} />,
    title: 'Concrete Solid Blocks',
    desc: '45,000 blocks produced weekly from our 2-acre facility in Allibommasandra, operational since 1996. Ready stock of 800,000+ blocks.',
  },
  {
    icon: <Mountain size={24} />,
    title: 'Aggregates — Bluemetals Unit',
    desc: 'Raw stone from Hosur, TN crushed via a three-stage Jaw → Cone → VSI system into 6mm, 12mm, 20mm & 40mm sizes conforming to IS 383-2016.',
  },
  {
    icon: <Waves size={24} />,
    title: 'M Sand & P Sand',
    desc: 'Premium M Sand via VSI crusher for superior particle shape. P Sand uses 5-stage processing — ideal for 1:6 cement-to-sand plastering mix.',
  },
  {
    icon: <Droplets size={24} />,
    title: 'Ready Mix Concrete',
    desc: 'State-of-the-art RMC plants with dedicated site plants. Concrete tested per IS standards with in-house lab, cube testing & third-party verification.',
  },
];

const BLOCK_SIZES = [
  '400 x 200 x 200mm  (8 Inch)',
  '400 x 150 x 200mm  (6 Inch)',
  '400 x 100 x 200mm  (4 Inch)',
];

const BLOCK_ADVANTAGES = [
  'Superior compression strength',
  '100% improvement in labour productivity',
  '30% reduction in plastering cost',
  'Environment friendly — Conforms to IS:2185',
];

const AGGREGATE_SIZES = ['6mm', '12mm', '20mm', '40mm'];

const AGGREGATE_POINTS = [
  'Well-graded, conforming to IS 383-2016',
  'Three-stage crushing: Jaw → Cone → VSI Impactor',
  'Cubically shaped — free from elongated & flaky particles',
  'High strength and long life to concrete structures',
];

const MSAND_POINTS = [
  'Produced via VSI Crusher — superior particle shape & consistent gradation',
  'Balanced physical & chemical properties for all climatic conditions',
  'Eliminates defects: honey combing, segregation, voids & capillary',
  'Significant reduction in cement usage vs river sand',
];

const PSAND_POINTS = [
  '5-stage processing for premium quality plastering sand',
  'Achieves 1:6 cement-to-sand mix ratio — lower construction cost',
  'Minimum bounce-back during plastering, reducing wastage',
  'No deleterious material — eliminates on-site sieving',
  'Greater plaster strength for long-lasting, durable finishes',
];

const RMC_POINTS = [
  {
    icon: <ShieldCheck size={18} />,
    title: 'IS Standard Testing',
    desc: 'Concrete designed and tested per IS standards. Regular cube testing and third-party verification at every stage.',
  },
  {
    icon: <FlaskConical size={18} />,
    title: 'In-House Laboratory',
    desc: 'Continuous quality checks via a dedicated in-house lab ensuring consistent mix design and performance.',
  },
  {
    icon: <Factory size={18} />,
    title: 'Own Raw Material Source',
    desc: 'Raw materials sourced directly from our own crusher — seamless delivery, quality control and cost efficiency.',
  },
  {
    icon: <Building2 size={18} />,
    title: 'Dedicated Site Plants',
    desc: 'Over 30 years providing dedicated site plants to the country\'s top builders with timely, uncompromised supply.',
  },
];

const EXPERIENCE = [
  { number: '1996', label: 'Production Facility Operational Since' },
  { number: '45,000', label: 'Concrete Blocks Produced Weekly' },
  { number: '800,000+', label: 'Ready Block Stock Capacity' },
  { number: '30+', label: 'Years of Industry Experience' },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ProductionUnit() {
  const [showTop, setShowTop]               = useState(false);
  const [blocksImgError, setBlocksImgError] = useState(false);
  const [aggImgError, setAggImgError]       = useState(false);
  const [rmcImgError, setRmcImgError]       = useState(false);

  const [heroRef,      heroVisible]      = useReveal();
  const [unitsRef,     unitsVisible]     = useReveal();
  const [blocksRef,    blocksVisible]    = useReveal();
  const [aggregateRef, aggregateVisible] = useReveal();
  const [sandRef,      sandVisible]      = useReveal();
  const [rmcRef,       rmcVisible]       = useReveal();
  const [statsRef,     statsVisible]     = useReveal();

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="production-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="production-hero">
        <div
          className="production-hero-bg"
          style={{ backgroundImage: "url('/production/production-hero-bg.png')" }}
        />
        <div className="production-overlay" />
        <div className="production-grid-overlay" />

        <div className="container">
          <div
            ref={heroRef}
            className={`production-hero-content ${heroVisible ? 'is-visible' : ''}`}
          >
            <div className="production-hero-left">
              <span className="production-badge">
                ISO 9001:2015 Certified — Turning Dreams Into Reality
              </span>

              <h1>
                Industrial Production
                <span> Units & Manufacturing Systems</span>
              </h1>

              <p>
                SMS Infra operates advanced production infrastructure across
                concrete solid blocks, aggregates, M Sand, P Sand and ready mix
                concrete — serving construction companies, real estate developers,
                contractors and individual clients across Bangalore since 1996.
              </p>

              <div className="production-hero-actions">
                <Link to="/contact" className="production-btn primary">
                  Request Product Inquiry
                </Link>
                <a href="#production-units" className="production-btn secondary">
                  Explore Units
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTION UNITS OVERVIEW
      ===================================================== */}

      <section
        id="production-units"
        ref={unitsRef}
        className={`production-systems ${unitsVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          <div className="section-heading center">
            <span className="section-label">What We Manufacture</span>
            <h2>Our Production Units</h2>
            <p>
              Four integrated manufacturing divisions — each built on decades of
              expertise, IS-standard compliance, and state-of-the-art machinery.
            </p>
          </div>

          <div className="systems-grid">
            {PRODUCTION_UNITS.map((item, index) => (
              <div key={index} className="system-card" style={{ '--delay': `${index * 0.1}s` }}>
                <div className="system-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONCRETE SOLID BLOCKS
      ===================================================== */}

      <section
        ref={blocksRef}
        className={`blocks-section ${blocksVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          <div className={`blocks-layout${blocksImgError ? ' blocks-layout--single' : ''}`}>
            {!blocksImgError && (
              <div className="blocks-image">
                <img
                  src="/production/concrete-blocks.png"
                  alt="Concrete Solid Blocks — SMS Infra Allibommasandra"
                  onError={() => setBlocksImgError(true)}
                />
              </div>
            )}

            <div className="blocks-content">
              <span className="section-label">Concrete Solid Blocks</span>
              <h2>Superior Strength & Industrial Grade Finish</h2>
              <p>
                Crafted from only the finest materials, our concrete solid blocks
                are renowned for their superior strength and impeccable finish.
                Our production facility, spanning <strong>two acres in
                Allibommasandra</strong>, has been operational since 1996 —
                currently producing <strong>45,000 blocks per week</strong> with
                a ready stock of over <strong>800,000 blocks</strong>.
              </p>

              <div className="block-sizes">
                <h4>Available Sizes</h4>
                {BLOCK_SIZES.map((size, i) => (
                  <div key={i} className="size-item">
                    <CheckCircle2 size={16} />
                    {size}
                  </div>
                ))}
              </div>

              <div className="advantage-list">
                <h4>Key Advantages</h4>
                {BLOCK_ADVANTAGES.map((adv, i) => (
                  <div key={i} className="advantage-item">
                    <CheckCircle2 size={14} />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AGGREGATES — BLUEMETALS UNIT
      ===================================================== */}

      <section
        ref={aggregateRef}
        className={`aggregate-section ${aggregateVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          <div className={`aggregate-layout${aggImgError ? ' aggregate-layout--single' : ''}`}>

            <div className="aggregate-content">
              <span className="section-label">Bluemetals Unit</span>
              <h2>Aggregates & Three-Stage Crushing</h2>
              <p>
                Raw stone sourced from the quarries of Hosur, Tamil Nadu and
                expertly crushed through our three-stage system — Jaw Crusher →
                Cone Crusher → VSI Impactor — into premium aggregates in high
                demand across Bangalore's construction sector.
              </p>

              <div className="aggregate-sizes">
                <h4>Available Sizes</h4>
                <div className="size-tags">
                  {AGGREGATE_SIZES.map((s, i) => (
                    <span key={i} className="size-tag">{s}</span>
                  ))}
                </div>
              </div>

              <div className="point-list">
                {AGGREGATE_POINTS.map((pt, i) => (
                  <div key={i} className="point-item">
                    <CheckCircle2 size={14} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {!aggImgError && (
              <div className="aggregate-image">
                <img
                  src="/production/aggregate-crusher.png"
                  alt="SMS Infra Bluemetals Crushing Unit"
                  onError={() => setAggImgError(true)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          M SAND & P SAND
      ===================================================== */}

      <section
        ref={sandRef}
        className={`sand-section ${sandVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          <div className="section-heading center">
            <span className="section-label">Sand Manufacturing</span>
            <h2>M Sand & P Sand</h2>
            <p>
              State-of-the-art VSI crusher technology producing premium M Sand
              and 5-stage processed P Sand — meeting Bangalore's growing
              construction demand with IS 383-2016 compliance.
            </p>
          </div>

          <div className="sand-grid">
            <div className="sand-card">
              <div className="sand-card-header">
                <div className="sand-icon"><Waves size={22} /></div>
                <div>
                  <h3>M Sand</h3>
                  <p className="sand-sub">Manufactured Sand — IS 383-2016</p>
                </div>
              </div>
              <div className="sand-points">
                {MSAND_POINTS.map((pt, i) => (
                  <div key={i} className="point-item">
                    <CheckCircle2 size={14} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sand-card">
              <div className="sand-card-header">
                <div className="sand-icon"><Layers3 size={22} /></div>
                <div>
                  <h3>P Sand</h3>
                  <p className="sand-sub">Plastering Sand — 5-Stage Processing</p>
                </div>
              </div>
              <div className="sand-points">
                {PSAND_POINTS.map((pt, i) => (
                  <div key={i} className="point-item">
                    <CheckCircle2 size={14} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          READY MIX CONCRETE
      ===================================================== */}

      <section
        ref={rmcRef}
        className={`rmc-section ${rmcVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          <div className={`rmc-layout${rmcImgError ? ' rmc-layout--single' : ''}`}>
            {!rmcImgError && (
              <div className="rmc-image">
                <img
                  src="/production/rmc-plant.png"
                  alt="SMS Infra Ready Mix Concrete Plant"
                  onError={() => setRmcImgError(true)}
                />
              </div>
            )}

            <div className="rmc-content">
              <span className="section-label">Ready Mix Concrete</span>
              <h2>Built on Trust & Technology</h2>
              <p>
                For over <strong>30 years</strong>, SMS Infra has set benchmarks
                in RMC service — providing dedicated site plants to the country's
                top builders and ensuring timely supply with uncompromised
                quality at every stage of construction.
              </p>

              <div className="rmc-points">
                {RMC_POINTS.map((item, i) => (
                  <div key={i} className="quality-point">
                    <div className="quality-icon">{item.icon}</div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPERIENCE STATS
      ===================================================== */}

      <section
        ref={statsRef}
        className={`experience-section ${statsVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          <div className="experience-grid">
            {EXPERIENCE.map((item, index) => (
              <div key={index} className="experience-card" style={{ '--delay': `${index * 0.1}s` }}>
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

      <section className="production-cta">
        <div
          className="production-cta-bg"
          style={{ backgroundImage: "url('/production/production-cta-bg.png')" }}
        />
        <div className="production-cta-overlay" />

        <div className="container">
          <div className="production-cta-content">
            <span className="section-label light">Partner With SMS Infra</span>
            <h2>Need Aggregates, Sand, Blocks or RMC?</h2>
            <p>
              Contact our team for aggregates, M Sand, P Sand, ready mix
              concrete, concrete solid blocks and full-scale industrial
              production supply across Bangalore.
            </p>
            <p className="cta-contact">
              📞 +91 9448466238 &nbsp;|&nbsp; 7676590045 &nbsp;|&nbsp; 080 62179939
            </p>
            <div className="production-cta-actions">
              <Link to="/contact" className="production-btn primary">
                Request a Quote
              </Link>
              <Link to="/contact" className="production-btn glass">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BACK TO TOP
      ===================================================== */}

      <button
        className={`back-top ${showTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp size={18} />
      </button>

    </div>
  );
}