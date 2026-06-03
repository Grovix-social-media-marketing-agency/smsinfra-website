import mongoose from "mongoose";

// ── Reusable sub-schemas ───────────────────────────────────────────────────
const trustItemSchema = new mongoose.Schema({
  value: { type: String, default: "" },
  label: { type: String, default: "" },
});

const statSchema = new mongoose.Schema({
  value: { type: String, default: "" },
  label: { type: String, default: "" },
});

const serviceItemSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  desc:  { type: String, default: "" },
  image: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
});

const processStepSchema = new mongoose.Schema({
  icon:  { type: String, default: "" },
  title: { type: String, default: "" },
  desc:  { type: String, default: "" },
  image: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
});

const featureSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  desc:  { type: String, default: "" },
});

const applicationSchema = new mongoose.Schema({
  label: { type: String, default: "" },
  title: { type: String, default: "" },
  image: { type: String, default: "" },
  img:   { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
});

const faqSchema = new mongoose.Schema({
  question: { type: String, default: "" },
  answer:   { type: String, default: "" },
});

// ── Builders-specific sub-schemas ─────────────────────────────────────────
const progressBarSchema = new mongoose.Schema({
  label: { type: String, default: "" },
  pct:   { type: Number, default: 0  },
});

// ── Main schema ────────────────────────────────────────────────────────────
const servicePageSchema = new mongoose.Schema(
  {
    // Unique identifier: "rmc" | "aggregates" | "earthmovers" | "msand" | "solid-blocks" | "builders"
    slug: { type: String, required: true, unique: true },

    // ── HERO ────────────────────────────────────────────────────────────────
    heroTag:          { type: String, default: "" },
    heroTitle:        { type: String, default: "" },
    heroSubtitle:     { type: String, default: "" },
    heroBtnPrimary:   { type: String, default: "Request Quote" },
    heroBtnSecondary: { type: String, default: "View Services" },
    heroBgImage:      { type: String, default: "" },
    heroBgImagePublicId: { type: String, default: "" },
    heroRightImage:   { type: String, default: "" },
    heroRightImagePublicId: { type: String, default: "" },

    // ── TRUST STRIP ─────────────────────────────────────────────────────────
    trustItems: [trustItemSchema],

    // ── ABOUT ───────────────────────────────────────────────────────────────
    aboutTag:    { type: String, default: "" },
    aboutTitle:  { type: String, default: "" },
    aboutPara1:  { type: String, default: "" },
    aboutPara2:  { type: String, default: "" },
    aboutImage:  { type: String, default: "" },
    aboutImagePublicId: { type: String, default: "" },
    aboutPoints: [{ type: String }],

    // ── STATS ───────────────────────────────────────────────────────────────
    stats: [statSchema],

    // ── SERVICES / PRODUCT CARDS ─────────────────────────────────────────────
    servicesHeading: { type: String, default: "" },
    servicesTitle:   { type: String, default: "" },
    serviceItems:    [serviceItemSchema],

    // ── PROCESS STEPS ────────────────────────────────────────────────────────
    processHeading: { type: String, default: "" },
    processTitle:   { type: String, default: "" },
    processSteps:   [processStepSchema],

    // ── FEATURES / BENEFITS ──────────────────────────────────────────────────
    featuresHeading: { type: String, default: "" },
    featuresTitle:   { type: String, default: "" },
    featuresDesc:    { type: String, default: "" },
    features:        [featureSchema],

    // ── APPLICATIONS ─────────────────────────────────────────────────────────
    applicationsHeading: { type: String, default: "" },
    applicationsTitle:   { type: String, default: "" },
    applications:        [applicationSchema],

    // ── COMPARISON ───────────────────────────────────────────────────────────
    comparisonHeading:    { type: String, default: "" },
    comparisonTitle:      { type: String, default: "" },
    comparisonLeftTitle:  { type: String, default: "" },
    comparisonRightTitle: { type: String, default: "" },
    comparisonLeftPoints:  [{ type: String }],
    comparisonRightPoints: [{ type: String }],

    // ── FAQs ─────────────────────────────────────────────────────────────────
    faqs: [faqSchema],

    // ── CTA ──────────────────────────────────────────────────────────────────
    ctaTag:          { type: String, default: "" },
    ctaTitle:        { type: String, default: "" },
    ctaSubtitle:     { type: String, default: "" },
    ctaBtnPrimary:   { type: String, default: "Request Quote" },
    ctaBtnSecondary: { type: String, default: "Contact Us" },
    ctaBgImage:      { type: String, default: "" },
    ctaBgImagePublicId: { type: String, default: "" },

    // ── BUILDERS & INFRA — Launching Soon section ─────────────────────────
    launchDate:          { type: String, default: "2027-01-01T00:00:00" },
    launchingTag:        { type: String, default: "" },
    launchingHeading:    { type: String, default: "" },
    launchingCardHeader: { type: String, default: "" },
    launchingCardBody:   { type: String, default: "" },
    launchProgressBars:  [progressBarSchema],
    launchMilestones:    [{ type: String }],
    notifyCardHeading:   { type: String, default: "" },
    notifyCardSubtext:   { type: String, default: "" },

    // ── BUILDERS & INFRA — Popup ──────────────────────────────────────────
    popupBadge:    { type: String, default: "" },
    popupTitle1:   { type: String, default: "" },
    popupTitle2:   { type: String, default: "" },
    popupSubtitle: { type: String, default: "" },
    popupFeatures: [{ type: String }],

    // ── Meta ─────────────────────────────────────────────────────────────────
    lastUpdatedBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

export default mongoose.model("ServicePage", servicePageSchema);