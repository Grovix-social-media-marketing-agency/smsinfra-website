import React, { useEffect, useState, useRef } from "react";
import "./WhyChoose.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ⭐ API BASE URL */
const API = process.env.REACT_APP_API_URL || "https://smsinfra-website.onrender.com/api";

const DEFAULT_STATS = [
  { value: 30,  label: "Years Experience" },
  { value: 500, label: "Projects Completed" },
  { value: 100, label: "Client Satisfaction (%)" },
];

const DEFAULT_FEATURES = [
  { title: "Advanced Equipment",  desc: "Modern machinery ensuring precision & efficiency." },
  { title: "Skilled Workforce",   desc: "Highly trained professionals delivering quality work." },
  { title: "Timely Execution",    desc: "Projects completed on schedule without compromise." },
  { title: "Cost Effective",      desc: "Smart solutions that save cost without reducing quality." },
];

/* WATERFALL ANIMATION VARIANTS */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Time delay between each element
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export default function WhyChoose() {
  /* ⭐ CMS STATE — all start null so original JSX renders as fallback */
  const [whyTitle, setWhyTitle]       = useState(null);
  const [whySubtitle, setWhySubtitle] = useState(null);
  const [features, setFeatures]       = useState(DEFAULT_FEATURES);
  const [stats, setStats]             = useState(DEFAULT_STATS);

  const [counts, setCounts] = useState(DEFAULT_STATS.map(() => 0));
  const [flippedIndex, setFlippedIndex] = useState(null);
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  /* ⭐ FETCH CMS DATA */
  useEffect(() => {
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        // whyChoose — title, subtitle, points (feature cards)
        if (data?.whyChoose?.title)    setWhyTitle(data.whyChoose.title);
        if (data?.whyChoose?.subtitle) setWhySubtitle(data.whyChoose.subtitle);
        if (Array.isArray(data?.whyChoose?.points) && data.whyChoose.points.length > 0) {
          setFeatures(data.whyChoose.points.map((p) => ({
            title: p.heading || p.title || "",
            desc:  p.text   || p.desc  || "",
          })));
        }
        // Stats from overview (yearsTarget, projectsTarget, clientsTarget)
        if (data?.overview) {
          const { yearsTarget, projectsTarget, clientsTarget } = data.overview;
          if (yearsTarget || projectsTarget || clientsTarget) {
            setStats([
              { value: yearsTarget    || 30,  label: "Years Experience" },
              { value: projectsTarget || 500, label: "Projects Completed" },
              { value: clientsTarget  || 100, label: "Client Satisfaction (%)" },
            ]);
          }
        }
      })
      .catch(() => {}); // silently fall back to defaults on error
  }, []);

  /* COUNTER LOGIC — reruns when stats change from CMS */
  useEffect(() => {
    setCounts(stats.map(() => 0));
    const intervals = stats.map((stat, i) =>
      setInterval(() => {
        setCounts((prev) => {
          const newCounts = [...prev];
          if (newCounts[i] < stat.value) {
            newCounts[i] += Math.ceil(stat.value / 50);
          }
          return newCounts;
        });
      }, 40)
    );
    return () => intervals.forEach(clearInterval);
  }, [stats]);

  /* CURSOR GLOW LOGIC */
  useEffect(() => {
    const moveGlow = (e) => {
      const glow = document.querySelector(".cursor-glow");
      if (glow) {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", moveGlow);
    return () => window.removeEventListener("mousemove", moveGlow);
  }, []);

  /* INTERSECTION OBSERVER */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add("show");
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* TILT LOGIC */
  const handleMouseMove = (e, el) => {
    if (window.innerWidth < 768) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = -(y / rect.height - 0.5) * 10;
    const rotateY = (x / rect.width - 0.5) * 10;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const resetTilt = (el) => {
    el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <section className="why-section" ref={sectionRef}>
      <div className="cursor-glow"></div>
      <div className="blob2"></div>

      <motion.div 
        className="why-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* LEFT CONTENT (Sequential Reveal) */}
        <div className="why-left">
          {/* ⭐ TAG — CMS subtitle or original hardcoded */}
          <motion.h4 variants={itemVariants} className="why-tag">
            {whySubtitle || "WHY CHOOSE US"}
          </motion.h4>
          
          {/* ⭐ TITLE — CMS title or original hardcoded */}
          <motion.h2 variants={itemVariants} className="why-title">
            {whyTitle || "Why Choose SMS Infra?"}
          </motion.h2>

          <motion.p variants={itemVariants} className="why-text">
            With over three decades of experience, SMS Infra has built a strong
            reputation as a reliable construction company in Bangalore. Our
            commitment to quality, advanced equipment, skilled workforce, and
            timely execution ensures that every project meets the highest standards.
          </motion.p>

          <motion.p variants={itemVariants} className="why-text">
            We focus on delivering cost-effective and durable solutions for
            residential, commercial, and infrastructure projects across Bangalore.
          </motion.p>

          {/* ⭐ STATS — from CMS overview or original defaults */}
          <motion.div variants={itemVariants} className="why-stats">
            {stats.map((stat, i) => (
              <div key={i} className="stat-box">
                <h3>{Math.min(counts[i], stat.value)}+</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.p variants={itemVariants} className="why-text why-cta-text">
            Looking for a trusted construction company in Bangalore?
          </motion.p>

          <motion.button
            variants={itemVariants}
            className="why-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/contact")}
          >
            Contact SMS Infra →
          </motion.button>
        </div>

        {/* ⭐ RIGHT CONTENT — CMS feature cards or original defaults */}
        <div className="why-right">
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`why-card flip ${flippedIndex === index ? "flipped" : ""}`}
              onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => resetTilt(e.currentTarget)}
            >
              <div className="flip-inner">
                <div className="flip-front">
                  <h3>{item.title}</h3>
                </div>
                <div className="flip-back">
                  <p>{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
