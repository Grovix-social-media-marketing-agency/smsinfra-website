import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './residential.css';

/* ─────────────────────────────────────────
   CUSTOM HOOKS
───────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

/* ─────────────────────────────────────────
   NOTIFY FORM  — connected to backend API
───────────────────────────────────────── */
function NotifyForm() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | duplicate | error
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    // Client-side validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/residential/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setStatus('success');
        setMessage(data.message || "You're on the list!");
        setEmail('');
      } else if (res.status === 409) {
        setStatus('duplicate');
        setMessage(data.message || 'This email is already registered.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="rp-notify__success">
        <span className="rp-notify__check">✓</span>
        <p>{message || "You're on the list! We'll notify you when residential projects launch."}</p>
      </div>
    );
  }

  return (
    <div className="rp-notify">
      <p className="rp-notify__label">Be the first to know when we launch</p>
      <div className="rp-notify__form">
        <input
          type="email"
          className="rp-notify__input"
          placeholder="Enter your email address"
          value={email}
          disabled={status === 'loading'}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error' || status === 'duplicate') setStatus('idle');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          className="rp-btn rp-btn--primary"
          onClick={handleSubmit}
          disabled={status === 'loading'}
          style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
        >
          {status === 'loading' ? 'Submitting…' : 'Notify Me'}
        </button>
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p className="rp-notify__error">⚠️ {message}</p>
      )}

      {/* Duplicate message — reuse error style or add rp-notify__duplicate in CSS */}
      {status === 'duplicate' && (
        <p className="rp-notify__error" style={{ color: '#fb923c' }}>
          📋 {message}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const HIGHLIGHTS = [
  { icon: '⬡', label: 'Precision Engineering', desc: 'Sub-millimetre tolerances across every structural pour and placement.' },
  { icon: '⬡', label: 'Modern Machinery', desc: 'Fleet of advanced equipment ensuring speed without compromise.' },
  { icon: '⬡', label: 'Durable Infrastructure', desc: 'Long-life materials tested to exceed IS standards by 40%.' },
  { icon: '⬡', label: 'Premium Concrete Quality', desc: 'Proprietary concrete mix designs for superior load performance.' },
  { icon: '⬡', label: 'Advanced Site Execution', desc: 'Real-time monitoring and BIM-driven project management.' },
  { icon: '⬡', label: 'Reliable Workforce', desc: 'Certified, trained teams with safety-first protocols on every site.' },
];

const UPCOMING = [
  { name: 'Luxury Villa Communities', status: 'Pre-Construction' },
  { name: 'Apartment Infrastructure Projects', status: 'Design Phase' },
  { name: 'Residential Layout Developments', status: 'Planning' },
  { name: 'Smart Housing Infrastructure', status: 'Concept' },
];

const CATEGORIES = [
  {
    icon: '🏡',
    title: 'Luxury Villas',
    desc: 'Premium villa communities with bespoke structural solutions and high-end material finishes.',
  },
  {
    icon: '🏢',
    title: 'Apartment Complexes',
    desc: 'High-rise and mid-rise residential developments with modern infrastructure systems.',
  },
  {
    icon: '🏘️',
    title: 'Township Layouts',
    desc: 'Integrated residential townships with master-planned infrastructure and amenities.',
  },
  {
    icon: '🏗️',
    title: 'Smart Housing',
    desc: 'Future-ready smart residential projects with embedded technology infrastructure.',
  },
];

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Residential() {
  const scrollProgress = useScrollProgress();

  const [highlightsRef, highlightsVisible] = useReveal();
  const [upcomingRef, upcomingVisible] = useReveal();
  const [categoriesRef, categoriesVisible] = useReveal();
  const [whyRef, whyVisible] = useReveal();

  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="rp-page">

      {/* SCROLL PROGRESS BAR */}
      <div className="rp-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* ── HERO ── */}
      <section className="rp-hero">
        <div
          className="rp-hero__bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="rp-hero__overlay" />
        <div className="rp-hero__particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="rp-particle" style={{ '--i': i }} />
          ))}
        </div>
        <div className="rp-hero__content">
          <p className="rp-label rp-hero__label">SMS Infra Projects</p>
          <div className="rp-hero__badge">🚀 Launching Soon</div>
          <h1 className="rp-hero__title">
            Residential<br />
            <span className="rp-hero__title-accent">Projects — Coming Soon</span>
          </h1>
          <p className="rp-hero__desc">
            SMS Infra is gearing up to launch premium residential infrastructure
            developments. Structural excellence and modern engineering, crafted for
            the future — stay tuned.
          </p>
          <div className="rp-hero__actions">
            <a href="#rp-upcoming-section" className="rp-btn rp-btn--primary">View Upcoming Projects</a>
            <Link to="/contact" className="rp-btn rp-btn--outline">Register Interest</Link>
          </div>
        </div>
        <div className="rp-hero__scroll-indicator">
          <span />
        </div>
      </section>

      {/* ── COMING SOON BANNER ── */}
      <section className="rp-coming-soon-banner">
        <div className="rp-container">
          <div className="rp-csb__inner">
            <div className="rp-csb__icon">🏗️</div>
            <div className="rp-csb__text">
              <h3>Residential Projects — Pre-Launch Phase</h3>
              <p>
                Our residential division is currently in the planning and pre-construction
                phase. Projects will be announced as they are confirmed.
                Register your interest below to receive updates as soon as we launch.
              </p>
            </div>
          </div>
          <NotifyForm />
        </div>
      </section>

      {/* ── UPCOMING PROJECTS ── */}
      <section
        id="rp-upcoming-section"
        className={`rp-upcoming ${upcomingVisible ? 'rp-revealed' : ''}`}
        ref={upcomingRef}
      >
        <div className="rp-container">
          <div className="rp-section-head rp-section-head--center">
            <p className="rp-label">Pipeline</p>
            <h2 className="rp-section-title">Upcoming Residential Developments</h2>
            <p className="rp-section-desc">
              Our residential project pipeline is being structured. Here's a snapshot
              of what's in the works — project timelines will be announced once confirmed.
            </p>
          </div>
          <div className="rp-upcoming__list">
            {UPCOMING.map((item, index) => (
              <div className="rp-upcoming__item" key={index} style={{ '--delay': `${index * 0.13}s` }}>
                <div className="rp-upcoming__meta">
                  <h3 className="rp-upcoming__name">{item.name}</h3>
                  <span className="rp-upcoming__status">{item.status}</span>
                </div>
                <div className="rp-upcoming__bar-wrap">
                  <span className="rp-upcoming__tba">Timeline — To Be Announced</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT CATEGORIES ── */}
      <section
        className={`rp-categories ${categoriesVisible ? 'rp-revealed' : ''}`}
        ref={categoriesRef}
      >
        <div className="rp-container">
          <div className="rp-section-head rp-section-head--center">
            <p className="rp-label">What We're Building</p>
            <h2 className="rp-section-title">Residential Project Categories</h2>
            <p className="rp-section-desc">
              Across four key residential segments, SMS Infra is preparing to deliver
              infrastructure built for the long term.
            </p>
          </div>
          <div className="rp-categories__grid">
            {CATEGORIES.map((cat, i) => (
              <div className="rp-category-card" key={i} style={{ '--delay': `${i * 0.1}s` }}>
                <div className="rp-category-card__icon">{cat.icon}</div>
                <span className="rp-category-card__tag">Coming Soon</span>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className={`rp-highlights ${highlightsVisible ? 'rp-revealed' : ''}`} ref={highlightsRef}>
        <div className="rp-container">
          <div className="rp-section-head rp-section-head--center">
            <p className="rp-label">Engineering Excellence</p>
            <h2 className="rp-section-title">What Makes SMS Infra Different</h2>
            <p className="rp-section-desc">
              Our residential projects will be built on the same engineering principles
              that define all SMS Infra work — precision, quality, and reliability.
            </p>
          </div>
          <div className="rp-highlights__grid">
            {HIGHLIGHTS.map((item, index) => (
              <div className="rp-highlight-card" key={index} style={{ '--delay': `${index * 0.1}s` }}>
                <div className="rp-highlight-card__icon">{item.icon}</div>
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER EARLY ── */}
      <section className={`rp-why ${whyVisible ? 'rp-revealed' : ''}`} ref={whyRef}>
        <div className="rp-container">
          <div className="rp-why__inner">
            <div className="rp-why__text">
              <p className="rp-label">Early Partnership</p>
              <h2 className="rp-section-title">Why Connect With Us Now?</h2>
              <p className="rp-section-desc">
                Getting in early means priority access to project slots, early-stage
                pricing discussions, and the opportunity to shape infrastructure
                requirements before groundbreaking.
              </p>
              <ul className="rp-why__list">
                <li>✓ Priority project slot allocation</li>
                <li>✓ Early-stage consultation &amp; planning input</li>
                <li>✓ First access to project details and timelines</li>
                <li>✓ Direct channel with SMS Infra's project team</li>
              </ul>
              <Link to="/contact" className="rp-btn rp-btn--primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                Register Your Interest
              </Link>
            </div>
            <div className="rp-why__visual">
              <div className="rp-why__orb" />
              <div className="rp-why__card">
                <p className="rp-label">Current Status</p>
                <div className="rp-why__timeline">
                  {[
                    { q: 'Now', label: 'Pre-Registration Open', active: true },
                    { q: 'Next', label: 'Project Announcements' },
                    { q: 'Soon', label: 'Site Commencement' },
                    { q: 'TBA', label: 'Full Pipeline Active' },
                  ].map((step, i) => (
                    <div className={`rp-why__step ${step.active ? 'rp-why__step--active' : ''}`} key={i}>
                      <div className="rp-why__step-dot" />
                      <div>
                        <span className="rp-why__step-q">{step.q}</span>
                        <p className="rp-why__step-label">{step.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="rp-cta">
        <div
          className="rp-cta__bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="rp-cta__overlay" />
        <div className="rp-cta__orb rp-cta__orb--1" />
        <div className="rp-cta__orb rp-cta__orb--2" />
        <div className="rp-cta__content">
          <p className="rp-label rp-label--light">Build With SMS Infra</p>
          <h2 className="rp-cta__title">Planning a Residential<br />Development Project?</h2>
          <p className="rp-cta__desc">
            Our residential division is gearing up for launch. Connect with us now
            to discuss your requirements, secure your slot, and be among the first
            to partner on our residential projects.
          </p>
          <div className="rp-cta__actions">
            <Link to="/contact" className="rp-btn rp-btn--primary">Register Interest</Link>
            <Link to="/contact" className="rp-btn rp-btn--glass">Talk to Our Team</Link>
          </div>
        </div>
      </section>

      {/* BACK TO TOP */}
      <button
        className={`rp-back-top ${showTop ? 'rp-back-top--visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>

    </div>
  );
}
