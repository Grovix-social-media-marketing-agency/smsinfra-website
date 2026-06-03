import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "./ElectronicCity.css";

const PHONE = "+917676590045";
const PHONE_DISPLAY = "+91 76765 90045";
const EMAIL = "sales@smsinfra.com";
const WHATSAPP =
  "https://wa.me/917676590045?text=Hi%20I%20need%20a%20quote%20for%20Sarjapur";

const SERVICES = [
  {
    num: "01",
    title: "Ready Mix Concrete",
    short: "RMC",
    desc: "M20 to M40 grade concrete delivered fresh via our own transit mixers — for slabs, columns, and foundations across Sarjapur Road and surrounding areas.",
    tag: "Same-day delivery",
  },
  {
    num: "02",
    title: "M Sand & P Sand",
    short: "Manufactured Sand",
    desc: "ISI-certified M Sand for concrete and P Sand for plastering. Bulk delivery to all localities along the Sarjapur corridor.",
    tag: "ISI Certified",
  },
  {
    num: "03",
    title: "Solid Concrete Blocks",
    short: "4″ · 6″ · 8″",
    desc: "Consistent quality solid blocks for load-bearing walls, partitions, and compound walls — available in bulk for residential and commercial projects in Sarjapur.",
    tag: "Bulk available",
  },
  {
    num: "04",
    title: "Aggregates Supply",
    short: "6mm – 40mm",
    desc: "Coarse and fine aggregates for structural, road, and drainage works. We supply 6mm, 10mm, 20mm, and 40mm grades directly to sites in Sarjapur.",
    tag: "All grades",
  },
  {
    num: "05",
    title: "Earthmoving & Excavation",
    short: "JCBs & Tippers",
    desc: "Site clearing, soil excavation, levelling, and material transport with our own fleet of JCBs, excavators, and tipper trucks across Sarjapur.",
    tag: "Own fleet",
  },
  {
    num: "06",
    title: "Infrastructure Projects",
    short: "End-to-End",
    desc: "Road work, drainage, building foundations, and industrial site development — complete supply and execution support across the Sarjapur corridor.",
    tag: "Full support",
  },
];

const REASONS = [
  {
    label: "Closest Supplier",
    body: "Our Chandapura base is ideally located to serve Sarjapur — short transit distance means fresher RMC, faster turnaround, and lower transport cost.",
  },
  {
    label: "Own Fleet, Zero Delays",
    body: "We own every transit mixer, tipper, and machine. No third-party logistics. Your material arrives exactly when scheduled.",
  },
  {
    label: "ISI Certified Materials",
    body: "Every batch of M Sand, P Sand, RMC, and aggregates is quality-tested. We supply to apartment complexes, IT campuses, and infrastructure projects in Sarjapur.",
  },
  {
    label: "30+ Years in South Bangalore",
    body: "Decades of supply experience across the Hosur Road and Sarjapur corridor means fewer surprises and more reliable service throughout your project.",
  },
  {
    label: "Transparent Pricing",
    body: "No hidden charges. Bulk orders for large projects get preferential rates and priority delivery scheduling.",
  },
  {
    label: "Dedicated Account Manager",
    body: "Every project gets a single point of contact who tracks your orders, coordinates delivery, and keeps your site running smoothly.",
  },
];

const LOCALITIES = [
  "Sarjapur Road",
  "Sarjapur Town",
  "Carmelram",
  "Dommasandra",
  "Kodathi",
  "Ambalipura",
  "Bellandur",
  "Halanayakanahalli",
];

const FAQS = [
  {
    q: "Do you deliver to Sarjapur Town and Sarjapur Road?",
    a: "Yes — we cover all areas along Sarjapur Road including Sarjapur Town, Carmelram, Dommasandra, Kodathi, and surrounding localities.",
  },
  {
    q: "Minimum order for RMC delivery?",
    a: "Our minimum for Ready Mix Concrete is 6 cubic metres. For smaller quantities, we'll advise on the best approach for your project.",
  },
  {
    q: "How quickly can M Sand reach my site in Sarjapur?",
    a: "Same-day or next-day delivery for orders placed before 12 noon, subject to availability. We prioritise sites along the Sarjapur corridor.",
  },
  {
    q: "Can you handle large apartment projects in Sarjapur?",
    a: "Absolutely. We regularly supply RMC, aggregates, M Sand, and blocks for large residential complexes and commercial developments along Sarjapur Road.",
  },
  {
    q: "How do I get a quote?",
    a: "Call +91 76765 90045, WhatsApp us, or submit a quotation request online. Our team responds within 2 hours during business hours.",
  },
];

const NEARBY = [
  { label: "Electronic City", slug: "electronic-city" },
  { label: "BTM Layout", slug: "btm-layout" },
  { label: "Whitefield", slug: "whitefield" },
  { label: "Attibele", slug: "attibele" },
];

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08 },
  }),
};

const slideRight = {
  hidden: { opacity: 0, x: -32 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const lineGrow = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const VP = { once: true, amount: 0.18 };

/* ── Component ──────────────────────────────────────────── */
export default function Sarjapur() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="ec-page">
      <Helmet>
        <title>
          Construction Material Supplier in Sarjapur Bangalore | SMS Infra
        </title>
        <meta
          name="description"
          content="SMS Infra supplies RMC, M Sand, P Sand, solid blocks, aggregates, and earthmoving services in Sarjapur Bangalore. Same-day delivery. Call +91 76765 90045."
        />
        <link
          rel="canonical"
          href="https://www.smsinfra.com/construction-services-sarjapur"
        />
      </Helmet>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="ec-hero" ref={heroRef}>
        <motion.div className="ec-hero-bg" style={{ y: heroY }}>
          <div className="ec-hero-grain" />
          <div className="ec-hero-orb ec-hero-orb--a" />
          <div className="ec-hero-orb ec-hero-orb--b" />
          <div className="ec-hero-lines" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="ec-hero-line" style={{ "--li": i }} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="ec-container ec-hero-inner"
          style={{ opacity: heroOpacity }}
        >
          <motion.nav
            className="ec-breadcrumb"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            aria-label="breadcrumb"
          >
            <a href="/">Home</a>
            <span className="ec-bc-sep">›</span>
            <a href="/services">Services</a>
            <span className="ec-bc-sep">›</span>
            <span>Sarjapur</span>
          </motion.nav>

          <motion.div
            className="ec-live-chip"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
          >
            <span className="ec-dot" />
            Serving Sarjapur · Bengaluru
          </motion.div>

          <div className="ec-hero-headline">
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Construction{" "}
              <em className="ec-hero-em">
                Materials
                <motion.span
                  className="ec-hero-em-line"
                  variants={lineGrow}
                  initial="hidden"
                  animate="visible"
                />
              </em>
              <br />
              Delivered to{" "}
              <strong className="ec-hero-strong">Sarjapur</strong>
            </motion.h1>
          </div>

          <motion.p
            className="ec-hero-sub"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            SMS Infra — based in Chandapura, perfectly placed to serve Sarjapur. We deliver
            Ready Mix Concrete, M Sand, P Sand, solid blocks, and aggregates on time,
            every time.
          </motion.p>

          <motion.div
            className="ec-hero-chips"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <span className="ec-chip">📍 Sarjapur Road, Bengaluru</span>
            <span className="ec-chip">🚛 Same-day delivery</span>
            <span className="ec-chip">🕘 Mon–Sat, 9 AM–7 PM</span>
          </motion.div>

          <motion.div
            className="ec-hero-ctas"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <button className="ec-btn-fill" onClick={() => navigate("/contact")}>
              Get Free Quote
              <span className="ec-btn-arrow">→</span>
            </button>
            <a href={`tel:${PHONE}`} className="ec-btn-ghost">
              📞 {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="ec-btn-wa"
            >
              💬 WhatsApp
            </a>
          </motion.div>

          <motion.div
            className="ec-scroll-cue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            <span className="ec-scroll-line" />
            <span className="ec-scroll-label">Scroll</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ MARQUEE STRIP ════════════════════════════════ */}
      <div className="ec-marquee-wrap" aria-hidden="true">
        <div className="ec-marquee-track">
          {[
            "Ready Mix Concrete",
            "M Sand",
            "P Sand",
            "Solid Blocks",
            "Aggregates",
            "Earthmoving",
            "Infrastructure",
            "Ready Mix Concrete",
            "M Sand",
            "P Sand",
            "Solid Blocks",
            "Aggregates",
            "Earthmoving",
            "Infrastructure",
          ].map((item, i) => (
            <span key={i} className="ec-marquee-item">
              {item} <span className="ec-marquee-dot">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══════════════════════════════════════ */}
      <section className="ec-section ec-services">
        <div className="ec-container">
          <motion.div
            className="ec-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <span className="ec-label">What We Supply</span>
            <h2 className="ec-h2">
              Everything your Sarjapur
              <br />
              project needs — in one call.
            </h2>
          </motion.div>

          <div className="ec-service-list">
            {SERVICES.map((s, i) => (
              <motion.article
                className="ec-service-row"
                key={s.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                custom={i * 0.07}
              >
                <div className="ec-service-meta">
                  <span className="ec-service-num">{s.num}</span>
                  <span className="ec-service-tag">{s.tag}</span>
                </div>
                <div className="ec-service-body">
                  <div className="ec-service-titles">
                    <h3 className="ec-service-title">{s.title}</h3>
                    <span className="ec-service-short">{s.short}</span>
                  </div>
                  <p className="ec-service-desc">{s.desc}</p>
                </div>
                <button
                  className="ec-service-arrow"
                  onClick={() => navigate("/contact")}
                  aria-label={`Get quote for ${s.title}`}
                >
                  →
                </button>
                <motion.div
                  className="ec-service-underline"
                  variants={lineGrow}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY US ════════════════════════════════════════ */}
      <section className="ec-section ec-why">
        <div className="ec-container">
          <motion.div
            className="ec-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <span className="ec-label">Why Choose Us</span>
            <h2 className="ec-h2">
              Builders across Sarjapur
              <br />
              trust SMS Infra.
            </h2>
          </motion.div>

          <div className="ec-why-list">
            {REASONS.map((r, i) => (
              <motion.div
                className="ec-why-row"
                key={i}
                variants={slideRight}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                custom={i}
              >
                <span className="ec-why-idx">{String(i + 1).padStart(2, "0")}</span>
                <div className="ec-why-content">
                  <h3 className="ec-why-title">{r.label}</h3>
                  <p className="ec-why-body">{r.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COVERAGE ══════════════════════════════════════ */}
      <section className="ec-section ec-coverage">
        <div className="ec-container ec-coverage-inner">
          <motion.div
            className="ec-coverage-left"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <span className="ec-label">Coverage</span>
            <h2 className="ec-h2">
              Every corner of
              <br />
              Sarjapur.
            </h2>
            <p className="ec-coverage-sub">
              We deliver construction materials to all localities within and
              surrounding the Sarjapur zone, Bengaluru.
            </p>
            <button
              className="ec-btn-fill"
              onClick={() => navigate("/contact")}
            >
              Check Your Area <span className="ec-btn-arrow">→</span>
            </button>
          </motion.div>

          <motion.div
            className="ec-coverage-right"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {LOCALITIES.map((loc, i) => (
              <motion.div
                className="ec-coverage-item"
                key={loc}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                custom={i * 0.06}
              >
                <span className="ec-coverage-dot" />
                <span>{loc}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════ */}
      <section className="ec-section ec-faq-section">
        <div className="ec-container">
          <motion.div
            className="ec-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <span className="ec-label">FAQ</span>
            <h2 className="ec-h2">Common questions from builders.</h2>
          </motion.div>

          <div className="ec-faq-list">
            {FAQS.map((f, i) => (
              <motion.div
                className="ec-faq-row"
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                custom={i * 0.08}
              >
                <span className="ec-faq-q-mark">Q</span>
                <div className="ec-faq-body">
                  <p className="ec-faq-q">{f.q}</p>
                  <p className="ec-faq-a">{f.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAP ═══════════════════════════════════════════ */}
      <section className="ec-section ec-map-section">
        <div className="ec-container">
          <motion.div
            className="ec-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <span className="ec-label">Location</span>
            <h2 className="ec-h2">
              Chandapura — close to
              <br />
              Sarjapur Road.
            </h2>
            <p className="ec-map-addr">
              407/11, SMS Elite, 3rd Floor, Chandapura, Anekal Taluk, Bengaluru – 560081
            </p>
          </motion.div>

          <motion.div
            className="ec-map-wrap"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VP}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <iframe
              title="SMS Infra Location – Chandapura Bangalore"
              src="https://www.google.com/maps?q=Chandapura+Anekal+Taluk+Bengaluru+560081&output=embed"
              loading="lazy"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>

      {/* ══ NEARBY ════════════════════════════════════════ */}
      <section className="ec-section ec-nearby-section">
        <div className="ec-container">
          <motion.div
            className="ec-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <span className="ec-label">Nearby Areas</span>
            <h2 className="ec-h2">We also serve these areas.</h2>
          </motion.div>
          <div className="ec-nearby-list">
            {NEARBY.map((a, i) => (
              <motion.div
                key={a.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                custom={i * 0.1}
              >
                <Link
                  to={`/construction-services-${a.slug}`}
                  className="ec-nearby-link"
                >
                  <span className="ec-nearby-label">
                    Construction Services in {a.label}
                  </span>
                  <span className="ec-nearby-arrow">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════ */}
      <section className="ec-cta-section">
        <motion.div
          className="ec-cta-bg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ duration: 1 }}
        />
        <div className="ec-container ec-cta-inner">
          <motion.span
            className="ec-cta-eyebrow"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            Ready to start?
          </motion.span>
          <motion.h2
            className="ec-cta-h2"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            custom={0.5}
          >
            Need construction materials
            <br />
            in Sarjapur?
          </motion.h2>
          <motion.p
            className="ec-cta-sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            custom={1}
          >
            Call us or submit a request. We respond within 2 hours, Mon–Sat, 9 AM–7 PM.
          </motion.p>
          <motion.div
            className="ec-cta-actions"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            custom={1.5}
          >
            <button
              className="ec-btn-fill ec-btn-fill--light"
              onClick={() => navigate("/contact")}
            >
              Get Free Quote <span className="ec-btn-arrow">→</span>
            </button>
            <a href={`tel:${PHONE}`} className="ec-btn-ghost ec-btn-ghost--light">
              📞 {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="ec-btn-wa"
            >
              💬 WhatsApp Us
            </a>
          </motion.div>
          <motion.p
            className="ec-cta-note"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            custom={2}
          >
            📧 {EMAIL} &nbsp;·&nbsp; 📍 Chandapura, Bengaluru 560081
          </motion.p>
        </div>
      </section>
    </div>
  );
}