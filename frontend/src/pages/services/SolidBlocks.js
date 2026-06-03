import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Factory,
  ShieldCheck,
  Truck,
  Building2,
  Layers3,
  Warehouse,
  CheckCircle2,
  Building,
  Home,
  Landmark,
  BadgeCheck,
  ClipboardCheck,
  TimerReset,
  Shield,
  Hammer,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Phone,
} from "lucide-react";

import "./SolidBlocks.css";

/* ─────────────────────────────────────────────
   HELPER: animated count-up hook
───────────────────────────────────────────── */
function useCountUp(target, duration = 1800, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const end = parseFloat(String(target).replace(/,/g, ""));
    if (isNaN(end)) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────
   HELPER: animated metric card with count-up
───────────────────────────────────────────── */
function AnimatedMetricCard({ label, value, icon, rawNum, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const counted = useCountUp(rawNum, 1600, inView);
  const displayVal = rawNum ? `${counted.toLocaleString()}${suffix}` : value;

  return (
    <motion.div ref={ref} whileHover={{ y: -10 }} className="metricCard">
      <div className="metricIcon">{icon}</div>
      <h3 className="metricValue">{displayVal}</h3>
      <p className="metricLabel">{label}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   HELPER: accordion FAQ item
───────────────────────────────────────────── */
function FaqAccordionItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="faqCard"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <button
        className="faqToggle"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.28 }}
          style={{ display: "flex", flexShrink: 0, color: "var(--col-accent)" }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            key="body"
            className="faqAnswer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: "hidden" }}
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════════ */
export default function SolidBlocksPage() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const fadeUpFast = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  const blockSizes = [
    {
      title: "8 Inch Block",
      size: "400 × 200 × 200 mm",
      usage: "Load-bearing walls & industrial structures",
      weight: "34-36 Kg",
      density: "High Density",
      image: "/solidblocks/block-8inch.png",
      badge: "Most Popular",
    },
    {
      title: "6 Inch Block",
      size: "400 × 150 × 200 mm",
      usage: "Commercial partitions & apartment projects",
      weight: "24-28 Kg",
      density: "Medium Density",
      image: "/solidblocks/block-6inch.png",
      badge: null,
    },
    {
      title: "4 Inch Block",
      size: "400 × 100 × 200 mm",
      usage: "Internal walls & lightweight structures",
      weight: "17-20 Kg",
      density: "Lightweight",
      image: "/solidblocks/block-4inch.png",
      badge: null,
    },
  ];

  const applications = [
    {
      title: "Residential Buildings",
      icon: <Home size={40} />,
      image: "/solidblocks/application-1.png",
      description:
        "Ideal for villas, apartments, gated communities, and modern residential construction projects.",
    },
    {
      title: "Commercial Complexes",
      icon: <Building size={40} />,
      image: "/solidblocks/application-2.png",
      description:
        "High-strength concrete solid blocks suitable for malls, office spaces, and commercial infrastructures.",
    },
    {
      title: "Industrial Warehouses",
      icon: <Warehouse size={40} />,
      image: "/solidblocks/application-3.png",
      description:
        "Durable and load-bearing concrete blocks engineered for warehouses and industrial buildings.",
    },
    {
      title: "Hospitals & Schools",
      icon: <Landmark size={40} />,
      image: "/solidblocks/application-4.png",
      description:
        "Superior sound insulation and structural durability for educational and healthcare projects.",
    },
  ];

  const advantages = [
    "Superior Compression Strength",
    "Uniform Shape & Dimensional Accuracy",
    "Eco-Friendly Manufacturing Process",
    "45,000 Blocks Production Capacity Per Week",
    "800,000+ Ready Stock Availability",
    "30% Reduction in Plastering Cost",
    "100% Improvement in Labour Productivity",
    "Fast Bangalore Delivery Support",
  ];

  const faqData = [
    {
      question: "What are concrete solid blocks?",
      answer:
        "Concrete solid blocks are high-density construction blocks manufactured using cement, aggregates, and water for superior structural strength and durability.",
    },
    {
      question: "What sizes of solid blocks are available?",
      answer:
        "SMS Infra provides 8-inch, 6-inch, and 4-inch concrete solid blocks suitable for different construction requirements.",
    },
    {
      question: "Are your blocks IS 2185 certified?",
      answer:
        "Yes. Our concrete solid blocks conform to IS:2185 standards for quality, strength, and durability.",
    },
    {
      question: "Do you provide bulk orders in Bangalore?",
      answer:
        "Yes. We provide bulk supply and fast delivery support across Bangalore and nearby industrial zones.",
    },
    {
      question: "Are solid blocks better than traditional bricks?",
      answer:
        "Concrete solid blocks offer higher strength, faster construction, lower mortar usage, and improved durability compared to traditional bricks.",
    },
  ];

  return (
    <>
      <Helmet>

        <title>
          Concrete Solid Blocks Manufacturers in Bangalore | SMS Infra
        </title>

        <meta
          name="description"
          content="SMS Infra is a trusted concrete solid blocks manufacturer in Bangalore offering premium-quality concrete blocks for residential, commercial, and industrial construction projects. IS:2185 certified solid blocks with superior compression strength, dimensional accuracy, and reliable supply."
        />

        <meta
          name="keywords"
          content="Concrete solid blocks Bangalore, solid block manufacturers Bangalore, concrete blocks supplier Bangalore, cement solid blocks, construction blocks Bangalore, IS 2185 solid blocks, concrete block manufacturers Karnataka, SMS Infra"
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          name="author"
          content="SMS Infra"
        />

        <meta
          name="geo.region"
          content="IN-KA"
        />

        <meta
          name="geo.placename"
          content="Bangalore"
        />

        <meta
          property="og:title"
          content="Concrete Solid Blocks Manufacturers in Bangalore | SMS Infra"
        />

        <meta
          property="og:description"
          content="Premium-quality concrete solid blocks engineered for superior strength, durability, and modern construction projects."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content="https://www.smsinfra.com/services/solid-blocks"
        />

        <meta
          property="og:image"
          content="https://www.smsinfra.com/solidblocks/blocks-hero-bg.mp4"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Concrete Solid Blocks Manufacturers in Bangalore | SMS Infra"
        />

        <meta
          name="twitter:description"
          content="High-strength concrete solid blocks for residential, commercial, and industrial construction projects."
        />

        <link
          rel="canonical"
          href="https://www.smsinfra.com/services/solid-blocks"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Concrete Solid Blocks",
            brand: "SMS Infra",
            description:
              "Premium concrete solid blocks manufacturers in Bangalore for residential and industrial construction.",
            category: "Construction Materials",
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          })}
        </script>

      </Helmet>

      <div className="solidBlocksPage">

        {/* ════════════════════════════════
            HERO SECTION
        ════════════════════════════════ */}

        <section className="solidBlocksHero">

          <div className="heroOverlay"></div>

          <video
            src="/solidblocks/blocks-hero-bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="heroBgImage"
          />

          {/* upgraded: staggerContainer + per-child fadeUpFast */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="heroContent"
          >

            <div>

              <motion.span variants={fadeUpFast} className="heroTag">
                SMS Infra Industrial Products
              </motion.span>

              {/* upgraded: shimmer <span> on "SOLID" */}
              <motion.h1 variants={fadeUpFast} className="heroHeading">
                CONCRETE
                <br />
                <span>SOLID</span>
                <br />
                BLOCKS
              </motion.h1>

              <motion.p variants={fadeUpFast} className="heroDescription">
                SMS Infra manufactures premium-quality concrete solid blocks in Bangalore using advanced production systems and high-grade raw materials. Designed for superior compression strength, dimensional accuracy, and long-term durability for residential, commercial, and industrial construction projects.
              </motion.p>

              <motion.div variants={fadeUpFast} className="heroHighlights">

                <div className="heroHighlightCard">
                  <BadgeCheck size={22} />
                  <span>IS:2185 Certified</span>
                </div>

                <div className="heroHighlightCard">
                  <Factory size={22} />
                  <span>30+ Years Experience</span>
                </div>

                <div className="heroHighlightCard">
                  <Truck size={22} />
                  <span>Fast Bangalore Delivery</span>
                </div>

              </motion.div>

              {/* NEW: CTA row with primary button + call link */}
              <motion.div variants={fadeUpFast} className="heroCtaRow">
                <Link to="/contact">
                  <button className="primaryBtn">
                    Request Quote <ArrowRight size={18} />
                  </button>
                </Link>
                <a href="tel:+919999999999" className="heroCallLink">
                  <Phone size={16} />
                  <span>Call Us Now</span>
                </a>
              </motion.div>

            </div>

            <motion.div variants={fadeUpFast} className="heroImageWrapper">

              <div className="heroImageBorder"></div>

              <div className="heroImage">
                <img
                  src="/solidblocks/hero-blocks.png"
                  alt="High strength cement concrete blocks"
                />
              </div>

              {/* NEW: floating IS:2185 badge */}
              <motion.div
                className="heroBadgeFloat"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 220 }}
              >
                <ShieldCheck size={22} />
                <div>
                  <strong>IS:2185</strong>
                  <span>Certified</span>
                </div>
              </motion.div>

            </motion.div>

          </motion.div>

          {/* NEW: animated scroll cue */}
          <motion.div
            className="heroScrollCue"
            animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? 10 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span>Scroll</span>
            <ChevronDown size={16} />
          </motion.div>

        </section>

        {/* ════════════════════════════════
            FLOATING METRICS
        ════════════════════════════════ */}

        <section className="metricsSection">

          <div className="metricsContainer">

            {/* upgraded: animated count-up cards */}
            <AnimatedMetricCard label="Since"      value="1996"     icon={<Factory   size={32} />} />
            <AnimatedMetricCard label="Production" rawNum={45000}   suffix=" Blks/Wk" icon={<Layers3  size={32} />} />
            <AnimatedMetricCard label="Ready Stock" rawNum={800000} suffix="+"         icon={<Warehouse size={32} />} />
            <AnimatedMetricCard label="Standards"  value="IS:2185"  icon={<ShieldCheck size={32} />} />

          </div>

        </section>

        {/* ════════════════════════════════
            ABOUT SECTION
        ════════════════════════════════ */}

        <section className="aboutSection">

          <div className="aboutContainer">

            {/* upgraded: scroll-triggered fadeUp on image column */}
            <motion.div
              className="aboutImageWrapper"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >

              <div className="aboutImage">
                <img
                  src="/solidblocks/factory.png"
                  alt="Concrete blocks factory in Bangalore"
                />
              </div>

              <div className="experienceCard">

                <h4>30+</h4>

                <p>
                  Years of industrial manufacturing experience.
                </p>

              </div>

            </motion.div>

            {/* upgraded: stagger on text column */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >

              <motion.span variants={fadeUpFast} className="sectionTag">
                About Our Manufacturing
              </motion.span>

              <motion.h2 variants={fadeUpFast} className="sectionHeading">
                Trusted Concrete Block Manufacturers in Bangalore
              </motion.h2>

              <motion.p variants={fadeUpFast} className="sectionDescription">
                SMS Infra delivers high-strength concrete solid blocks with superior finish and consistent quality for residential, commercial, and industrial projects. Our advanced manufacturing systems ensure dimensional accuracy, durability, and reliable supply across Bangalore, Electronic City, Chandapura, Anekal, and nearby industrial regions.
              </motion.p>

              <motion.div variants={fadeUpFast} className="aboutFeatures">

                {advantages.map((feature, index) => (

                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className="aboutFeatureCard"
                  >

                    <CheckCircle2 size={20} />

                    <h4>{feature}</h4>

                  </motion.div>

                ))}

              </motion.div>

            </motion.div>

          </div>

        </section>

        {/* ════════════════════════════════
            APPLICATIONS SECTION
        ════════════════════════════════ */}

        <section className="applicationsSection">

          <div className="centerHeading">

            <span className="sectionTag">
              Construction Applications
            </span>

            <h2 className="sectionHeading">
              Applications of Concrete Solid Blocks
            </h2>

            <p className="sectionDescription">
              SMS Infra solid concrete blocks are widely used across residential, industrial, and commercial construction projects in Bangalore and Karnataka.
            </p>

          </div>

          {/* upgraded: stagger grid */}
          <motion.div
            className="applicationsGrid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >

            {applications.map((item, index) => (

              <motion.div
                key={index}
                variants={fadeUpFast}
                whileHover={{ y: -10 }}
                className="applicationCard"
              >

                <div className="applicationImage">
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                </div>

                <div className="applicationContent">

                  <div className="applicationIcon">
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                </div>

              </motion.div>

            ))}

          </motion.div>

        </section>

        {/* ════════════════════════════════
            TECHNICAL SPECIFICATIONS
        ════════════════════════════════ */}

        <section className="technicalSection">

          <div className="centerHeading">

            <span className="sectionTag">
              Technical Specifications
            </span>

            <h2 className="sectionHeading">
              Solid Block Specifications
            </h2>

          </div>

          {/* upgraded: scroll-triggered table wrapper */}
          <motion.div
            className="technicalTableWrapper"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            <table className="technicalTable">

              <thead>

                <tr>
                  <th>Block Type</th>
                  <th>Size</th>
                  <th>Weight</th>
                  <th>Density</th>
                  <th>Application</th>
                </tr>

              </thead>

              <tbody>

                {blockSizes.map((block, index) => (

                  <tr key={index}>

                    <td>{block.title}</td>

                    <td>{block.size}</td>

                    <td>{block.weight}</td>

                    <td>{block.density}</td>

                    <td>{block.usage}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </motion.div>

        </section>

        {/* ════════════════════════════════
            BLOCK SIZE SHOWCASE
        ════════════════════════════════ */}

        <section className="blockSizeSection">

          <div className="centerHeading">

            <span className="sectionTag">
              Product Specifications
            </span>

            <h2 className="sectionHeading">
              Available Block Sizes
            </h2>

            <p className="sectionDescription">
              Our concrete solid blocks are available in multiple dimensions suitable for different structural and construction requirements.
            </p>

          </div>

          {/* upgraded: stagger grid */}
          <motion.div
            className="blockCards"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >

            {blockSizes.map((block, index) => (

              <motion.div
                key={index}
                variants={fadeUpFast}
                whileHover={{ y: -10 }}
                className="blockCard"
              >

                {/* NEW: "Most Popular" badge on 8-inch block */}
                {block.badge && (
                  <span className="blockBadge">{block.badge}</span>
                )}

                <div className="blockCardImage">

                  <img
                    src={block.image}
                    alt={block.title}
                  />

                </div>

                <div className="blockCardContent">

                  <h3>{block.title}</h3>

                  <p className="blockSize">
                    {block.size}
                  </p>

                  {/* NEW: weight + density inline row */}
                  <p className="blockWeight">
                    <strong>Weight:</strong> {block.weight}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>Density:</strong> {block.density}
                  </p>

                  <p className="blockUsage">
                    {block.usage}
                  </p>

                </div>

              </motion.div>

            ))}

          </motion.div>

        </section>

        {/* ════════════════════════════════
            ADVANTAGES / COMPARISON SECTION
        ════════════════════════════════ */}

        <section className="comparisonSection">

          <div className="centerHeading">

            <span className="sectionTag">
              Why Builders Prefer SMS Infra
            </span>

            <h2 className="sectionHeading">
              Traditional Bricks vs Concrete Solid Blocks
            </h2>

          </div>

          {/* upgraded: scroll-triggered */}
          <motion.div
            className="comparisonGrid"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            <div className="comparisonCard oldMethod">

              <h3>Traditional Bricks</h3>

              <ul>

                <li>Higher mortar usage</li>
                <li>Uneven finish</li>
                <li>Slower construction</li>
                <li>Higher plastering cost</li>
                <li>More labour requirement</li>

              </ul>

            </div>

            <div className="comparisonCard newMethod">

              <h3>SMS Infra Solid Blocks</h3>

              <ul>

                <li>Superior compression strength</li>
                <li>Precision dimensional finish</li>
                <li>Faster installation</li>
                <li>Reduced plastering cost</li>
                <li>Improved labour productivity</li>

              </ul>

            </div>

          </motion.div>

        </section>

        {/* ════════════════════════════════
            MANUFACTURING PROCESS
        ════════════════════════════════ */}

        <section className="processSection">

          <div className="centerHeading">

            <span className="sectionTag">
              Advanced Manufacturing
            </span>

            <h2 className="sectionHeading">
              Our Manufacturing Process
            </h2>

          </div>

          {/* upgraded: stagger grid */}
          <motion.div
            className="processGrid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >

            {[
              {
                title: "Raw Material Selection",
                icon: <Layers3 size={34} />,
              },
              {
                title: "Automated Mixing",
                icon: <Factory size={34} />,
              },
              {
                title: "Hydraulic Compression",
                icon: <Hammer size={34} />,
              },
              {
                title: "Water Curing",
                icon: <TimerReset size={34} />,
              },
              {
                title: "Quality Testing",
                icon: <ClipboardCheck size={34} />,
              },
              {
                title: "Delivery & Logistics",
                icon: <Truck size={34} />,
              },
            ].map((item, index) => (

              <motion.div
                key={index}
                variants={fadeUpFast}
                whileHover={{ y: -10 }}
                className="processCard"
              >

                {/* NEW: ghost step number */}
                <span className="processStep">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="processIcon">
                  {item.icon}
                </div>

                <h3>{item.title}</h3>

                {/* NEW: connector arrow between steps */}
                {index < 5 && (
                  <span className="processArrow">
                    <ChevronRight size={14} />
                  </span>
                )}

              </motion.div>

            ))}

          </motion.div>

        </section>

        {/* ════════════════════════════════
            QUALITY SECTION
        ════════════════════════════════ */}

        <section className="qualitySection">

          <div className="qualityContainer">

            {/* upgraded: scroll-triggered */}
            <motion.div
              className="qualityLeft"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >

              <span className="sectionTag">
                Quality Assurance
              </span>

              <h2 className="sectionHeading">
                Tested for Strength & Reliability
              </h2>

              <p className="sectionDescription">
                Every concrete solid block manufactured at SMS Infra undergoes strict quality inspection and testing procedures to ensure maximum durability and construction performance.
              </p>

            </motion.div>

            {/* upgraded: stagger quality cards */}
            <motion.div
              className="qualityGrid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >

              {[
                "Compression Strength Testing",
                "Dimensional Accuracy Checks",
                "Water Absorption Testing",
                "Density Verification",
                "In-House Laboratory Testing",
                "Third-Party Quality Verification",
              ].map((item, index) => (

                <motion.div
                  key={index}
                  variants={fadeUpFast}
                  className="qualityCard"
                >

                  <Shield size={20} />

                  <p>{item}</p>

                </motion.div>

              ))}

            </motion.div>

          </div>

        </section>

        {/* ════════════════════════════════
            FAQ SECTION
        ════════════════════════════════ */}

        <section className="faqSection">

          <div className="centerHeading">

            <span className="sectionTag">
              Frequently Asked Questions
            </span>

            <h2 className="sectionHeading">
              FAQs About Concrete Solid Blocks
            </h2>

          </div>

          <div className="faqContainer">

            {/* upgraded: animated accordion replaces static cards */}
            {faqData.map((faq, index) => (
              <FaqAccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}

          </div>

        </section>

        {/* ════════════════════════════════
            FINAL CTA
        ════════════════════════════════ */}

        <section className="finalCtaSection">

          <img
            src="/solidblocks/cta-bg.png"
            alt="Concrete blocks supplier Bangalore"
            className="finalCtaBg"
          />

          <div className="finalCtaOverlay"></div>

          {/* upgraded: stagger on CTA content */}
          <motion.div
            className="finalCtaContent"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            <motion.span variants={fadeUpFast} className="sectionTag">
              Contact SMS Infra
            </motion.span>

            <motion.h2 variants={fadeUpFast}>
              Build Stronger with SMS Infra Solid Blocks
            </motion.h2>

            <motion.p variants={fadeUpFast}>
              Partner with SMS Infra for durable and high-performance concrete solid blocks designed for modern residential, commercial, and industrial construction projects in Bangalore.
            </motion.p>

            <motion.div variants={fadeUpFast} className="ctaButtons">

              <Link to="/contact">

                <button className="primaryBtn">

                  Request Quote

                  <Truck size={20} />

                </button>

              </Link>

              <Link to="/contact">

                <button className="secondaryBtn">

                  Contact Sales Team

                  <Building2 size={20} />

                </button>

              </Link>

            </motion.div>

          </motion.div>

        </section>

      </div>
    </>
  );
}
