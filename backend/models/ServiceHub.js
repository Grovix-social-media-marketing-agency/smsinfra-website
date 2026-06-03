import mongoose from "mongoose";

const serviceHubSchema = new mongoose.Schema({
  // ── HERO ──────────────────────────────────────────────────────────────────
  heroTitle:    { type: String, default: "Construction & Infrastructure Services in Bangalore" },
  heroSubtitle: { type: String, default: "SMS Infra is one of the trusted construction and infrastructure solution providers in Bangalore, offering high-quality earthmoving services, ready mix concrete, M-sand, aggregates, concrete solid blocks, and complete infrastructure project solutions." },
  heroBtnPrimary:   { type: String, default: "Get Quote" },
  heroBtnSecondary: { type: String, default: "Explore Services" },

  // ── INTRO ─────────────────────────────────────────────────────────────────
  introTitle: { type: String, default: "Trusted Construction Solutions Partner" },
  introPara:  { type: String, default: "At SMS Infra, we specialize in delivering dependable construction materials and infrastructure services tailored to modern project requirements." },

  // ── STATS ─────────────────────────────────────────────────────────────────
  statExp:      { type: Number, default: 30 },
  statProjects: { type: Number, default: 50 },
  statBlocks:   { type: Number, default: 800000 },

  // ── SERVICES GRID ─────────────────────────────────────────────────────────
  services: [
    {
      title:            { type: String, default: "" },
      img:              { type: String, default: "" },
      path:             { type: String, default: "" },
      desc:             { type: String, default: "" },
      features:         [{ type: String }],
      hoverBenefits:    [{ type: String }],
      deliveryTimeline: { type: String, default: "" },
      industries:       [{ type: String }],
      featured:         { type: Boolean, default: false },
    }
  ],

  // ── INDUSTRIES ────────────────────────────────────────────────────────────
  industries: [
    {
      icon:  { type: String, default: "" },
      label: { type: String, default: "" },
      desc:  { type: String, default: "" },
    }
  ],

  // ── PROCESS STEPS ─────────────────────────────────────────────────────────
  processSteps: [
    {
      icon:  { type: String, default: "" },
      title: { type: String, default: "" },
      desc:  { type: String, default: "" },
    }
  ],

  // ── WHY US ────────────────────────────────────────────────────────────────
  whyTitle:   { type: String, default: "Why Choose SMS Infra?" },
  whyPara:    { type: String, default: "SMS Infra combines industry experience, advanced technology, and quality-driven operations." },
  whyPoints:  [{ type: String }],

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctaTitle:  { type: String, default: "Let's Build Your Next Project" },
  ctaPara:   { type: String, default: "Looking for reliable construction materials or infrastructure services in Bangalore? Contact SMS Infra today." },
  ctaBtn:    { type: String, default: "Get In Touch" },

}, { timestamps: true });

export default mongoose.model("ServiceHub", serviceHubSchema);