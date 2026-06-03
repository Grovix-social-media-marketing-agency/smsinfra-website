import React, { useEffect, useState, useRef } from "react";
import {
  Building2,
  Home,
  HardHat,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ChevronDown,
  Zap,
  Shield,
  Layers,
  TrendingUp,
  Bell,
  Hammer,
  Cpu,
  X,
  Loader2,
  Send,
  Mail,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import emailjs from "@emailjs/browser";
import "./BuildersInfrastructure.css";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ─── API ──────────────────────────────────────────────────────────────────────
const API = (process.env.REACT_APP_API_URL || "http://10.145.35.253:5000").replace(/\/api$/, "");

/* ─────────────────────────────────────────
   EMAILJS CONFIG  — replace with your real IDs
   Emails go to sales@smsinfra.com
───────────────────────────────────────── */
const EJS = {
  SERVICE_ID:       "service_kligv3j",
  NOTIFY_TEMPLATE:  "template_qifj9rh",
  CONSULT_TEMPLATE: "template_4gj88sw",
  PUBLIC_KEY:       "zlgiKUAABWCs-ESHz",
};

/* ─────────────────────────────────────────
   COUNTDOWN TIMER HOOK
───────────────────────────────────────── */
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date(targetDate);
    // Guard: if date is invalid, show zeros
    if (isNaN(target.getTime())) {
      setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      return;
    }
    const calc = () => {
      const diff = target - new Date();
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
};

/* ─────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(245,158,11,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="bi-particle-canvas" />;
};

/* ─────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => (
  <motion.div
    className={`bi-toast bi-toast-${type}`}
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    transition={{ type: "spring", stiffness: 260, damping: 22 }}
  >
    {type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}
    <span>{msg}</span>
    <button onClick={onClose}><X size={14} /></button>
  </motion.div>
);

/* ─────────────────────────────────────────
   LAUNCHING SOON POPUP
   cms.launchDate  — countdown target (editable from admin)
   cms.popupBadge/Title1/Title2/Subtitle/Features — all editable
───────────────────────────────────────── */
const LaunchingPopup = ({ onClose, onToast, cms = {} }) => {
  // ── launchDate from backend via cms prop, validate to prevent NaN ──
  const rawLD = cms.launchDate || "2027-01-01T00:00:00";
  const LAUNCH_DATE = (rawLD && !isNaN(new Date(rawLD).getTime()))
    ? rawLD
    : "2027-01-01T00:00:00";
  const countdown = useCountdown(LAUNCH_DATE);
  const pad = (n) => String(n ?? 0).padStart(2, "0");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // All popup text CMS-driven with original as fallback
  const popupBadge    = cms.popupBadge    || "Launching Soon";
  const popupTitle1   = cms.popupTitle1   || "Something Big";
  const popupTitle2   = cms.popupTitle2   || "Is Coming";
  const popupSubtitle = cms.popupSubtitle || "Premium construction & infrastructure solutions for Bangalore. Be the first to know.";
  const popupFeatures = (cms.popupFeatures || []).filter(Boolean).length
    ? (cms.popupFeatures || []).filter(Boolean)
    : ["Residential Villas", "Commercial Complexes", "EPC Solutions"];

  const handleNotify = async () => {
    if (!email) return;
    setLoading(true);
    try {
      // Save to backend leads
      await fetch(`${API}/api/leads`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "notify", name: "Website Visitor", email, phone: "—", projectType: "General Notification", source: "builders-popup" }),
      });
      // Send email via EmailJS
      await emailjs.send(EJS.SERVICE_ID, EJS.NOTIFY_TEMPLATE, {
        from_name: "Website Visitor", from_email: email, phone: "—",
        project_type: "General Notification", to_email: "sales@smsinfra.com",
        subject: "New Launch Notification Request — SMS Infra Builders",
        message: `${email} has requested to be notified when SMS Infra Builders & Infrastructure launches.`,
      }, EJS.PUBLIC_KEY);
      setSubmitted(true);
      onToast("You're on the list! We'll notify you at launch.", "success");
    } catch {
      onToast("Something went wrong. Please try again.", "error");
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div className="bi-popup-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="bi-popup-box"
          initial={{ scale: 0.7, opacity: 0, y: 60 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}>
          <div className="bi-popup-orb bi-popup-orb-1" />
          <div className="bi-popup-orb bi-popup-orb-2" />
          <button className="bi-popup-close" onClick={onClose}><X size={20} /></button>

          <div className="bi-popup-badge">
            <span className="bi-popup-dot" />{popupBadge}
          </div>
          <h2 className="bi-popup-title">
            {popupTitle1}<br /><span>{popupTitle2}</span>
          </h2>
          <p className="bi-popup-sub">{popupSubtitle}</p>

          <div className="bi-popup-countdown">
            {[{ label: "Days", val: pad(countdown.d) }, { label: "Hours", val: pad(countdown.h) },
              { label: "Mins",  val: pad(countdown.m) }, { label: "Secs",  val: pad(countdown.s) }
            ].map(({ label, val }, i) => (
              <div className="bi-popup-cd-block" key={i}>
                <motion.div className="bi-popup-cd-num" key={val}
                  initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}>{val}</motion.div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {!submitted ? (
            <div className="bi-popup-form">
              <input type="email" placeholder="Enter your email address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNotify()} />
              <button onClick={handleNotify} disabled={loading}>
                {loading ? <Loader2 size={15} className="bi-spin" /> : <Bell size={15} />}
                {loading ? "Sending…" : "Notify Me"}
              </button>
            </div>
          ) : (
            <motion.div className="bi-popup-success"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <CheckCircle2 size={32} />
              <p>You're on the list! We'll notify you at <strong>{email}</strong></p>
            </motion.div>
          )}

          <div className="bi-popup-features">
            {popupFeatures.map((f, i) => (
              <span key={i}><CheckCircle2 size={13} />{f}</span>
            ))}
          </div>
          <p className="bi-popup-mailto">
            Or email us directly: <a href="mailto:sales@smsinfra.com">sales@smsinfra.com</a>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   EARLY CONSULTATION MODAL
───────────────────────────────────────── */
const ConsultationModal = ({ onClose, onToast }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      // Save to backend leads
      await fetch(`${API}/api/leads`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "consultation", name: form.name, email: form.email, phone: form.phone || "—", message: form.message || "Early consultation request.", source: "builders-consult" }),
      });
      // Send email via EmailJS
      await emailjs.send(EJS.SERVICE_ID, EJS.CONSULT_TEMPLATE, {
        from_name: form.name, from_email: form.email,
        phone: form.phone || "—",
        message: form.message || "Early consultation request from website.",
        to_email: "sales@smsinfra.com",
        subject: `Early Consultation Request — ${form.name}`,
      }, EJS.PUBLIC_KEY);
      setSent(true);
      onToast("Request sent! Our team will reach out shortly.", "success");
    } catch {
      onToast("Failed to send. Please email sales@smsinfra.com directly.", "error");
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div className="bi-popup-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="bi-popup-box bi-consult-box"
          initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}>
          <div className="bi-popup-orb bi-popup-orb-1" />
          <div className="bi-popup-orb bi-popup-orb-2" />
          <button className="bi-popup-close" onClick={onClose}><X size={20} /></button>

          {!sent ? (
            <>
              <div className="bi-popup-badge"><span className="bi-popup-dot" />Free Early Consultation</div>
              <h2 className="bi-popup-title">Let's Plan Your<br /><span>Dream Project</span></h2>
              <p className="bi-popup-sub">Fill in your details and our team will contact you within 24 hours.</p>
              <form className="bi-consult-form" onSubmit={handleSubmit}>
                <div className="bi-input-float">
                  <input type="text" required placeholder=" " value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <label>Your Full Name *</label>
                </div>
                <div className="bi-input-float">
                  <input type="email" required placeholder=" " value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <label>Email Address *</label>
                </div>
                <div className="bi-input-float">
                  <input type="tel" placeholder=" " value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <label>Phone Number</label>
                </div>
                <div className="bi-input-float">
                  <textarea rows={3} placeholder=" " value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <label>Project Details (optional)</label>
                </div>
                <motion.button type="submit" className="bi-notify-submit-btn"
                  disabled={loading} whileHover={{ scale: loading ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}>
                  {loading ? (<><Loader2 size={16} className="bi-spin" /> Sending…</>) : (<><Send size={16} /> Send Consultation Request</>)}
                </motion.button>
              </form>
              <p className="bi-popup-mailto">Prefer email? <a href="mailto:sales@smsinfra.com">sales@smsinfra.com</a></p>
            </>
          ) : (
            <motion.div className="bi-success-state"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}>
              <div className="bi-success-ring"><CheckCircle2 size={42} /></div>
              <h3>Request Sent!</h3>
              <p>Our team will reach out to <strong>{form.email}</strong> within 24 hours.</p>
              <button className="bi-btn-secondary bi-mt-20" onClick={onClose}>Close</button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const BuildersInfrastructure = () => {
  const navigate = useNavigate();

  const [openFaq,       setOpenFaq]       = useState(null);
  const [notifyStep,    setNotifyStep]    = useState(0);
  const [showPopup,     setShowPopup]     = useState(false);
  const [showConsult,   setShowConsult]   = useState(false);
  const [toast,         setToast]         = useState(null);
  const [formData,      setFormData]      = useState({ name: "", email: "", phone: "", type: "" });
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [mousePos,      setMousePos]      = useState({ x: 50, y: 50 });
  const [activeService, setActiveService] = useState(null);

  // ── Backend CMS data ─────────────────────────────────────────
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/servicepages/builders`)
      .then((r) => r.json())
      .then((d) => setBackendData(d))
      .catch(() => {});
  }, []);

  const heroRef      = useRef(null);
  const heroTitleRef = useRef(null);
  const servicesRef  = useRef(null);
  const whyRef       = useRef(null);
  const roadmapRef   = useRef(null);

  const { scrollYProgress } = useScroll();
  const heroParallax  = useTransform(scrollYProgress, [0, 0.3],  [0, -120]);
  const heroOpacity   = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // ── Derived backend shorthand ─────────────────────────────────
  const B = backendData || {};

  // ── LAUNCH DATE: from backend, validate before use to prevent NaN ──
  const rawLaunchDate = B.launchDate || "2027-01-01T00:00:00";
  const LAUNCH_DATE = (rawLaunchDate && !isNaN(new Date(rawLaunchDate).getTime()))
    ? rawLaunchDate
    : "2027-01-01T00:00:00";
  const countdown = useCountdown(LAUNCH_DATE);
  const pad = (n) => String(n ?? 0).padStart(2, "0");

  const showToast   = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 4500); };
  const goToContact = () => navigate("/contact");

  useEffect(() => { const t = setTimeout(() => setShowPopup(true), 3000); return () => clearTimeout(t); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroTitleRef.current) {
        gsap.fromTo(".bi-hero-word", { y: 80, opacity: 0, rotationX: -40 },
          { y: 0, opacity: 1, rotationX: 0, stagger: 0.12, duration: 1, ease: "power4.out", delay: 0.3 });
      }
      gsap.utils.toArray(".bi-service-card").forEach((card, i) => {
        gsap.fromTo(card, { y: 100, opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
            delay: i * 0.15 });
      });
      gsap.utils.toArray(".bi-why-card").forEach((card, i) => {
        gsap.fromTo(card, { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 88%" } });
      });
      gsap.utils.toArray(".bi-roadmap-card").forEach((card, i) => {
        gsap.fromTo(card, { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.5)",
            scrollTrigger: { trigger: card, start: "top 90%" }, delay: i * 0.18 });
      });
      ScrollTrigger.create({
        trigger: ".bi-stats-section", start: "top center",
        onEnter: () => gsap.to(".bi-stat-chip", { scale: 1, opacity: 1, stagger: 0.12, duration: 0.6, ease: "back.out(1.7)" }),
      });
      gsap.utils.toArray(".bi-progress-fill").forEach((bar) => {
        const pct = bar.style.getPropertyValue("--pct") || "0%";
        gsap.fromTo(bar, { width: "0%" }, { width: pct, duration: 1.5, ease: "power2.out",
          scrollTrigger: { trigger: bar, start: "top 90%" } });
      });
      gsap.to(".bi-cta-glow", { scale: 1.3, opacity: 0.7, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".bi-float-el", { y: -18, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.4 });
    });
    return () => ctx.revert();
  }, []);

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setNotifyLoading(true);
    try {
      // Save to backend leads
      await fetch(`${API}/api/leads`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "notify", name: formData.name, email: formData.email, phone: formData.phone || "—", projectType: formData.type || "Not specified", source: "builders-section" }),
      });
      // Send email via EmailJS
      await emailjs.send(EJS.SERVICE_ID, EJS.NOTIFY_TEMPLATE, {
        from_name: formData.name, from_email: formData.email,
        phone: formData.phone || "—", project_type: formData.type || "Not specified",
        to_email: "sales@smsinfra.com",
        subject: `Launch Notification Signup — ${formData.name}`,
        message: `${formData.name} (${formData.email}) has signed up for launch notifications. Project type: ${formData.type || "Not specified"}. Phone: ${formData.phone || "—"}.`,
      }, EJS.PUBLIC_KEY);
      setNotifyStep(1);
      showToast("You're on the list! We'll notify you at launch.", "success");
    } catch {
      showToast("Failed to submit. Please email sales@smsinfra.com directly.", "error");
    } finally { setNotifyLoading(false); }
  };

  const serviceIcons = { home: <Home size={36} />, commercial: <Building2 size={36} />, epc: <HardHat size={36} /> };

  // ── Static fallbacks (original hardcoded data) ────────────────
  const FB = {
    services: [
      { title: "Residential Construction", icon: "home",       image: "/builders/residential-project.png",
        description: "Modern residential solutions — villas, apartments, gated communities — built with premium materials, smart layouts, and on-time delivery.",
        features: ["Luxury Villas", "Apartment Developments", "Turnkey Homes", "Gated Communities"], tag: "Launching Soon", accent: "#f59e0b" },
      { title: "Commercial Projects",       icon: "commercial", image: "/builders/commercial-project.png",
        description: "Office towers, retail spaces, industrial facilities, and warehouses built for scale, durability, and business performance.",
        features: ["Office Buildings", "Retail Spaces", "Industrial Infrastructure", "Warehouses"], tag: "Launching Soon", accent: "#10b981" },
      { title: "EPC Solutions",             icon: "epc",        image: "/builders/epc-project.png",
        description: "Engineering, Procurement & Construction services for large-scale infrastructure — from concept to final handover.",
        features: ["Engineering Planning", "Procurement Management", "Execution & Delivery", "Project Management"], tag: "Launching Soon", accent: "#6366f1" },
    ],
    roadmap: [
      { phase: "Phase 01", label: "Residential Projects",     icon: <Home      size={22} /> },
      { phase: "Phase 02", label: "Commercial Infrastructure", icon: <Building2 size={22} /> },
      { phase: "Phase 03", label: "EPC & Industrial",          icon: <HardHat   size={22} /> },
      { phase: "Phase 04", label: "Smart Cities",              icon: <Cpu       size={22} /> },
    ],
    whyUs: [
      { icon: <Shield     size={28} />, title: "Quality-First Approach", desc: "Premium materials, structural integrity, and uncompromising construction standards on every project." },
      { icon: <Zap        size={28} />, title: "Fast Execution",          desc: "Timeline-driven project management with milestone tracking and transparent delivery schedules." },
      { icon: <Layers     size={28} />, title: "End-to-End Planning",     desc: "Integrated workflow from concept design to final handover — one partner, zero gaps." },
      { icon: <TrendingUp size={28} />, title: "Scalable Solutions",      desc: "Future-ready capabilities for projects of any scale — residential plots to industrial complexes." },
    ],
    faq: [
      { question: "When will the Builders & Infrastructure division launch?",
        answer: "Our division is in the final stages of setup and will officially launch soon with full residential, commercial, and EPC construction services." },
      { question: "What construction services will be offered?",
        answer: "We will offer residential construction, commercial infrastructure development, and complete end-to-end EPC solutions for industrial and infrastructure projects." },
      { question: "Will EPC services be available for industrial projects?",
        answer: "Yes — our EPC division will cover industrial infrastructure, large-scale construction, and complete project lifecycle management." },
      { question: "Do you provide residential construction in Bangalore?",
        answer: "Yes. Our residential division will focus primarily on Bangalore and the broader Karnataka region." },
    ],
    progressBars: [
      { label: "Infrastructure Setup", pct: 88 },
      { label: "Team Onboarding",      pct: 74 },
      { label: "Project Pipeline",     pct: 61 },
      { label: "Tech Integration",     pct: 45 },
    ],
    milestones: ["Planning", "Setup", "Launch", "Scale"],
  };

  // ── All CMS-driven values with fallbacks ──────────────────────
  const heroBgImage  = B.heroBgImage  || "/builders/builders-hero.png";
  const heroBadge    = B.heroTag      || "Launching Soon — Countdown Active";
  const heroSubtitle = B.heroSubtitle || "A new era of construction begins — premium residential, commercial, and EPC infrastructure, launching very soon.";
  const heroPrimaryBtn   = B.ctaBtnPrimary   || "Get Early Consultation";
  const heroSecondaryBtn = B.ctaBtnSecondary || "Get Notified";

  const launchingTag        = B.launchingTag        || "Future Infrastructure Division";
  const launchingHeading    = B.launchingHeading    || "Building Tomorrow's Infrastructure";
  const launchingCardHeader = B.launchingCardHeader || "Division In Progress";
  const launchingCardBody   = B.launchingCardBody   || "Our Builders & Infrastructure division is in final stages of development. Residential villas, commercial complexes, and end-to-end EPC solutions — all launching very soon across Bangalore and Karnataka.";
  const progressBars        = B.launchProgressBars?.length ? B.launchProgressBars : FB.progressBars;
  const milestones          = B.launchMilestones?.length   ? B.launchMilestones   : FB.milestones;
  const notifyCardHeading   = B.notifyCardHeading   || "Get Launch Updates";
  const notifyCardSubtext   = B.notifyCardSubtext   || "Be the first to know when we go live.";

  const servicesHeading = B.servicesHeading || "Upcoming Services";
  const servicesTitle   = B.servicesTitle   || "Future Construction & Infrastructure Solutions";
  const services        = B.serviceItems?.length
    ? B.serviceItems.map((item, i) => ({
        title: item.title, icon: FB.services[i]?.icon || "home",
        image: item.image || FB.services[i]?.image || "",
        description: item.desc, features: FB.services[i]?.features || [],
        tag: "Launching Soon", accent: FB.services[i]?.accent || "#f59e0b",
      }))
    : FB.services;

  const whyHeading = B.featuresHeading || "Why Choose Us";
  const whyTitle   = B.featuresTitle   || "Future-Ready Construction Excellence";
  const whyUs      = B.features?.length
    ? B.features.map((f, i) => ({ icon: FB.whyUs[i]?.icon || <Shield size={28} />, title: f.title, desc: f.desc }))
    : FB.whyUs;

  const roadmapHeading = B.processHeading || "Growth Roadmap";
  const roadmapTitle   = B.processTitle   || "Future Infrastructure Expansion Plan";
  const roadmap        = B.processSteps?.length
    ? B.processSteps.map((step, i) => ({ phase: `Phase 0${i + 1}`, label: step.title, icon: FB.roadmap[i]?.icon || <Home size={22} /> }))
    : FB.roadmap;

  const faq = B.faqs?.length
    ? B.faqs.map((f) => ({ question: f.question, answer: f.answer }))
    : FB.faq;

  const ctaTag  = B.ctaTag        || "Future Construction Partnerships";
  const ctaTitle= B.ctaTitle      || "Planning a Future Construction Project?";
  const ctaDesc = B.ctaSubtitle   || "Connect with our team today to discuss upcoming residential, commercial, and infrastructure development requirements.";
  const ctaBtn1 = B.ctaBtnPrimary   || "Contact Team";
  const ctaBtn2 = B.ctaBtnSecondary || "Get Notified";

  // ── Popup CMS props — includes launchDate for popup countdown ──
  const popupCms = {
    launchDate:    B.launchDate,
    popupBadge:    B.popupBadge,
    popupTitle1:   B.popupTitle1,
    popupTitle2:   B.popupTitle2,
    popupSubtitle: B.popupSubtitle,
    popupFeatures: B.popupFeatures,
  };

  return (
    <>
      <Helmet>
        <title>Builders & Infrastructure Projects in Bangalore | Premium Construction Solutions</title>
        <meta name="description" content="Launching soon — premium residential, commercial, and EPC construction solutions in Bangalore. Future-ready infrastructure development." />
        <link rel="canonical" href="https://www.smsinfra.in/builders-infrastructure" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question", name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          })}
        </script>
      </Helmet>

      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {showPopup   && <LaunchingPopup   onClose={() => setShowPopup(false)}  onToast={showToast} cms={popupCms} />}
      {showConsult && <ConsultationModal onClose={() => setShowConsult(false)} onToast={showToast} />}

      <motion.div className="bi-scroll-bar" style={{ scaleX: scaleProgress }} />

      <div className="bi-page">

        {/* ═══════════════════════ HERO ═══════════════════════ */}
        <section className="bi-hero" ref={heroRef}>
          <video autoPlay muted loop playsInline className="bi-hero-video">
            <source src="/builders/builders-hero.mp4" type="video/mp4" />
          </video>
          <div className="bi-hero-img-bg" style={{ backgroundImage: `url(${heroBgImage})` }} />
          <div className="bi-hero-overlay" />
          <div className="bi-hero-spotlight" style={{
            background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%, rgba(245,158,11,0.12), transparent 70%)`,
          }} />
          <div className="bi-construction-grid" />
          <ParticleCanvas />
          <div className="bi-float-el bi-float-el-1"><Building2 size={28} /></div>
          <div className="bi-float-el bi-float-el-2"><HardHat   size={24} /></div>
          <div className="bi-float-el bi-float-el-3"><Home      size={22} /></div>
          <div className="bi-float-el bi-float-el-4"><Cpu       size={20} /></div>

          <motion.div className="bi-hero-content" style={{ y: heroParallax, opacity: heroOpacity }}>
            <motion.div className="bi-launch-badge"
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
              <span className="bi-badge-pulse" /><Clock3 size={15} />&nbsp;{heroBadge}
            </motion.div>

            <div ref={heroTitleRef} className="bi-hero-title-wrap">
              <h1 className="bi-hero-title">
                {"Building Tomorrow's".split(" ").map((w, i) => (
                  <span key={i} className="bi-hero-word">{w}&nbsp;</span>
                ))}
                <br />
                <span className="bi-hero-word bi-hero-accent">Bangalore</span>
              </h1>
            </div>

            <motion.p className="bi-hero-sub"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}>
              {heroSubtitle}
            </motion.p>

            {/* ── HERO COUNTDOWN — driven by backend launchDate ── */}
            <motion.div className="bi-hero-countdown"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.6 }}>
              {[{ label: "Days", val: pad(countdown.d) }, { label: "Hours", val: pad(countdown.h) },
                { label: "Mins",  val: pad(countdown.m) }, { label: "Secs",  val: pad(countdown.s) }
              ].map(({ label, val }, i) => (
                <div className="bi-cd-block" key={i}>
                  <AnimatePresence mode="wait">
                    <motion.div key={val} className="bi-cd-num"
                      initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }}
                      exit={{ rotateX: 90, opacity: 0 }} transition={{ duration: 0.25 }}>{val}</motion.div>
                  </AnimatePresence>
                  <span className="bi-cd-label">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* ── HERO BUTTONS — fully dynamic from backend ── */}
            <motion.div className="bi-hero-btns"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}>
              <motion.button className="bi-btn-primary"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(245,158,11,0.5)" }}
                whileTap={{ scale: 0.97 }} onClick={() => setShowConsult(true)}>
                {heroPrimaryBtn} <ArrowRight size={18} />
              </motion.button>
              <motion.button className="bi-btn-secondary"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setShowPopup(true)}>
                <Bell size={16} /> {heroSecondaryBtn}
              </motion.button>
            </motion.div>

            <motion.div className="bi-hero-stats"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}>
              {[
                { icon: <Home      size={16} />, label: "Residential" },
                { icon: <Building2 size={16} />, label: "Commercial"  },
                { icon: <HardHat   size={16} />, label: "EPC Projects"},
                { icon: <Cpu       size={16} />, label: "Smart Cities"},
              ].map(({ icon, label }, i) => (
                <motion.div className="bi-stat-chip" key={i}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.1, type: "spring", stiffness: 200 }}>
                  <h3 className="bi-stat-chip-soon"><span className="bi-stat-soon-dot" />Soon</h3>
                  <span className="bi-stat-chip-label-row">{icon}{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="bi-scroll-indicator"
            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
            <ChevronDown size={24} />
          </motion.div>
        </section>

        {/* ═══════════════════════ LAUNCHING SOON SECTION ═══════════════════════ */}
        <section className="bi-launching-section">
          <motion.div className="bi-section-heading"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span>{launchingTag}</span>
            <h2>{launchingHeading}</h2>
          </motion.div>

          <div className="bi-launching-grid">
            <motion.div className="bi-launching-card"
              initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="bi-launching-header">
                <Hammer size={16} /> &nbsp;{launchingCardHeader}
              </div>
              <p>{launchingCardBody}</p>

              <div className="bi-multi-progress">
                {progressBars.map(({ label, pct }, i) => (
                  <div className="bi-progress-row" key={i}>
                    <div className="bi-progress-meta">
                      <span>{label}</span>
                      <span className="bi-pct-label">{pct}%</span>
                    </div>
                    <div className="bi-progress-bar">
                      <motion.div className="bi-progress-fill" style={{ "--pct": `${pct}%` }}
                        initial={{ width: "0%" }} whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut", delay: i * 0.2 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bi-milestone-track">
                {milestones.map((m, i) => (
                  <div className={`bi-milestone ${i < 2 ? "done" : i === 2 ? "active" : ""}`} key={i}>
                    <motion.div className="bi-m-dot" initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.15, type: "spring" }} />
                    <span>{m}</span>
                  </div>
                ))}
                <div className="bi-milestone-line" />
              </div>
            </motion.div>

            {/* ── NOTIFY ME CARD ── */}
            <motion.div className="bi-notify-card"
              initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <AnimatePresence mode="wait">
                {notifyStep === 0 ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="bi-notify-icon-ring"><Bell size={28} /></div>
                    <h3>{notifyCardHeading}</h3>
                    <p className="bi-notify-sub">{notifyCardSubtext}</p>
                    <form className="bi-notify-form" onSubmit={handleNotifySubmit}>
                      {[
                        { type: "text",  field: "name",  label: "Your Name",    required: true  },
                        { type: "email", field: "email", label: "Email Address", required: true  },
                        { type: "tel",   field: "phone", label: "Phone Number",  required: false },
                      ].map(({ type, field, label, required }) => (
                        <div className="bi-input-float" key={field}>
                          <input type={type} required={required} placeholder=" " value={formData[field]}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} />
                          <label>{label}</label>
                        </div>
                      ))}
                      <div className="bi-input-float">
                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                          <option value="">Project Type</option>
                          <option>Residential</option>
                          <option>Commercial</option>
                          <option>EPC</option>
                        </select>
                      </div>
                      <motion.button type="submit" className="bi-notify-submit-btn"
                        disabled={notifyLoading} whileHover={{ scale: notifyLoading ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}>
                        {notifyLoading ? (<><Loader2 size={16} className="bi-spin" />Sending…</>) : (<><Bell size={16} />&nbsp;Notify Me on Launch</>)}
                      </motion.button>
                    </form>
                    <p className="bi-notify-mailto"><Mail size={13} /><a href="mailto:sales@smsinfra.com">sales@smsinfra.com</a></p>
                  </motion.div>
                ) : (
                  <motion.div key="success" className="bi-success-state"
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}>
                    <div className="bi-success-ring"><CheckCircle2 size={42} /></div>
                    <h3>You're on the List!</h3>
                    <p>We'll notify <strong>{formData.email}</strong> the moment we launch. Stay tuned for something extraordinary.</p>
                    <button className="bi-btn-secondary bi-mt-20"
                      onClick={() => { setNotifyStep(0); setFormData({ name: "", email: "", phone: "", type: "" }); }}>
                      Register Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════ SERVICES ═══════════════════════ */}
        <section className="bi-services-section" ref={servicesRef}>
          <motion.div className="bi-section-heading bi-center-heading"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span>{servicesHeading}</span>
            <h2>{servicesTitle}</h2>
          </motion.div>
          <div className="bi-services-grid">
            {services.map((service, index) => (
              <motion.div className="bi-service-card" key={index}
                onHoverStart={() => setActiveService(index)} onHoverEnd={() => setActiveService(null)}
                whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <div className="bi-service-img-wrap">
                  <img src={service.image} alt={service.title} loading="lazy" className="bi-service-img" />
                  <div className="bi-service-overlay" style={{ "--accent": service.accent }} />
                  <motion.div className="bi-service-coming-badge"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.5 }}>{service.tag}</motion.div>
                  <motion.div className="bi-service-hover-overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: activeService === index ? 1 : 0 }} transition={{ duration: 0.3 }}>
                    <div className="bi-service-hover-content">
                      <div className="bi-service-icon-lg">{serviceIcons[service.icon]}</div>
                      <p>{service.description}</p>
                      <ul>{service.features.map((f, i) => <li key={i}><CheckCircle2 size={14} />{f}</li>)}</ul>
                    </div>
                  </motion.div>
                </div>
                <div className="bi-service-content">
                  <div className="bi-service-icon" style={{ "--accent": service.accent }}>{serviceIcons[service.icon]}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="bi-service-features">
                    {service.features.map((feature, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.08 + index * 0.1 }}>
                        <CheckCircle2 size={15} />{feature}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button className="bi-service-btn" style={{ "--accent": service.accent }}
                    whileHover={{ scale: 1.04, x: 4 }} whileTap={{ scale: 0.97 }} onClick={() => setShowConsult(true)}>
                    Learn More <ArrowRight size={15} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ WHY US ═══════════════════════ */}
        <section className="bi-why-section" ref={whyRef}>
          <motion.div className="bi-section-heading bi-center-heading"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span>{whyHeading}</span>
            <h2>{whyTitle}</h2>
          </motion.div>
          <div className="bi-why-grid">
            {whyUs.map(({ icon, title, desc }, i) => (
              <motion.div className="bi-why-card" key={i}
                whileHover={{ scale: 1.04, y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="bi-why-icon-wrap">
                  <motion.div className="bi-why-icon" whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 400 }}>
                    {icon}
                  </motion.div>
                  <div className="bi-why-icon-ring" />
                </div>
                <h3>{title}</h3><p>{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ ROADMAP ═══════════════════════ */}
        <section className="bi-roadmap-section" ref={roadmapRef}>
          <motion.div className="bi-section-heading bi-center-heading"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span>{roadmapHeading}</span>
            <h2>{roadmapTitle}</h2>
          </motion.div>
          <div className="bi-stepper">
            {roadmap.map(({ phase, label, icon }, index) => (
              <motion.div className="bi-stepper-item" key={index}
                initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}>
                <div className="bi-stepper-left">
                  <motion.div className="bi-stepper-icon"
                    whileHover={{ scale: 1.12, rotate: 8 }} transition={{ type: "spring", stiffness: 300 }}>
                    {icon}
                  </motion.div>
                  {index < roadmap.length - 1 && (
                    <motion.div className="bi-stepper-line" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }} transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }} />
                  )}
                </div>
                <div className="bi-stepper-content">
                  <span className="bi-stepper-phase">{phase}</span>
                  <h3 className="bi-stepper-label">{label}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ FAQ ═══════════════════════ */}
        <section className="bi-faq-section">
          <motion.div className="bi-section-heading bi-center-heading"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span>Frequently Asked Questions</span>
            <h2>Builders &amp; Infrastructure FAQs</h2>
          </motion.div>
          <div className="bi-faq-wrapper">
            {faq.map((f, index) => (
              <motion.div className={`bi-faq-card ${openFaq === index ? "bi-faq-open" : ""}`} key={index}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <button className="bi-faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{f.question}</span>
                  <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div className="bi-faq-answer"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }}>
                      <p>{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ CTA ═══════════════════════ */}
        <section className="bi-cta-section">
          <motion.div className="bi-cta-content"
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="bi-cta-glow" />
            <span>{ctaTag}</span>
            <h2>{ctaTitle}</h2>
            <p>{ctaDesc}</p>
            <div className="bi-cta-btns">
              <motion.button className="bi-btn-primary"
                whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(245,158,11,0.6)" }}
                whileTap={{ scale: 0.97 }} onClick={goToContact}>
                {ctaBtn1} <ArrowRight size={18} />
              </motion.button>
              <motion.button className="bi-btn-outline"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setShowPopup(true)}>
                <Bell size={16} /> {ctaBtn2}
              </motion.button>
            </div>
            <motion.a href="mailto:sales@smsinfra.com" className="bi-cta-email-link"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <Mail size={15} />sales@smsinfra.com
            </motion.a>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default BuildersInfrastructure;
