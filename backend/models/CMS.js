import mongoose from "mongoose";

const cmsSchema = new mongoose.Schema({
  // ─── OVERVIEW (home.js <section className="overview">) ──
  overview: {
    title: String,
    tagline1: String,
    tagline2: String,
    description: String,
    yearsTarget: Number,
    projectsTarget: Number,
    clientsTarget: Number,
  },
  // ─── SERVICES SECTION (old — kept for backward compat) ──
  servicesSection: {
    title: String,
    description: String,
    items: [String],
  },
  // ⭐ SERVICE CARDS (ServicesSection.js — new CMS-driven cards)
  serviceCards: {
    heading:  String,
    title:    String,
    subtitle: String,
    cards: [
      {
        name: String,
        icon: String,
        link: String,
      }
    ],
  },
  // ─── AREAS SECTION ──────────────────────────────────────
  areasSection: {
    heading:  String,
    title:    String,
    subtitle: String,
    badge:    String,
    areas: [
      {
        label: String,
        slug:  String,
      }
    ],
  },
  // ─── GALLERY ────────────────────────────────────────────
  gallery: {
    title: String,
    subtitle: String,
    images: [
      {
        url: String,
        publicId: String,
        caption: String,
        isStatic: { type: Boolean, default: false },
      }
    ],
  },
  // ─── WHY CHOOSE US ──────────────────────────────────────
  whyChoose: {
    title: String,
    subtitle: String,
    points: [
      {
        icon: String,
        heading: String,
        text: String,
      }
    ],
  },
  // ─── TESTIMONIALS ────────────────────────────────────────
  testimonials: {
    title: String,
    subtitle: String,
    items: [
      {
        name: String,
        role: String,
        text: String,
        rating: Number,
        avatar: String,
      }
    ],
  },
  // ─── FAQ ────────────────────────────────────────────────
  faq: {
    title: String,
    subtitle: String,
    items: [
      {
        question: String,
        answer: String,
      }
    ],
  },
  // ─── CLIENT LOGOS ───────────────────────────────────────
  clientLogos: [
    {
      url: String,
      publicId: String,
      isLocal: { type: Boolean, default: false },
    }
  ],
  // ─── NAVBAR ─────────────────────────────────────────────
  navbar: {
    logo: String,
    ctaText: String,
    ctaLink: String,
  },
  // ─── SERVICES DROPDOWN ──────────────────────────────────
  services: [
    {
      name: String,
      link: String,
    }
  ],
  // ─── PROJECTS DROPDOWN ──────────────────────────────────
  projects: [
    {
      name: String,
      link: String,
    }
  ],
  // ─── ABOUT (old simple field — kept for backward compat) ─
  about: {
    title: String,
    description: String,
    experience: Number,
    projects: Number,
    clients: Number,
  },
  // ─── CONTACT ────────────────────────────────────────────
  contact: {
    phone:   String,
    phone2:  String,
    email:   String,
    email2:  String,
    address: String,
  },
  // ─── SOCIAL MEDIA (FOOTER) ──────────────────────────────
  social: {
    instagram: String,
    linkedin:  String,
    facebook:  String,
    youtube:   String,
  },
  // ─── SOCIAL MEDIA (NAVBAR / MOBILE MENU) ────────────────
  navbarSocial: {
    instagram: String,
    linkedin:  String,
    facebook:  String,
    youtube:   String,
  },

  // ⭐ CONTACT PAGE CMS — all editable content for /contact page
  contactPage: {
    heroTag:      { type: String, default: "CONTACT SMS INFRA" },
    heroTitle:    { type: String, default: "Let's Build Reliable Infrastructure Together" },
    heroSubtitle: { type: String, default: "Connect with SMS Infra for construction materials, earthmoving services, infrastructure support, commercial projects, residential developments, and industrial site solutions across Bangalore." },
    address:         { type: String, default: "407/11, SMS ELITE, 3rd Floor, Chandapura, Anekal Taluk, Bengaluru - 560081" },
    email1:          { type: String, default: "sales@smsinfra.com" },
    email2:          { type: String, default: "enquiry@smsinfra.com" },
    phone1:          { type: String, default: "7676590045" },
    phone2:          { type: String, default: "" },
    businessHours:   { type: String, default: "Mon – Sat: 9:00 AM – 7:00 PM" },
    sundayHours:     { type: String, default: "Sunday: Closed" },
    responseTime:    { type: String, default: "Within 2 hours during business hours" },
    responseTimeOff: { type: String, default: "Next business day by 11:00 AM" },
    monthlyCount:    { type: String, default: "47 businesses contacted us this month" },
    tickerMessages: {
      type: [String],
      default: [
        "A contractor from Whitefield just requested a quote 2 min ago",
        "A builder from Electronic City enquired about RMC 5 min ago",
        "A developer from Sarjapur submitted a quotation 8 min ago",
        "A site engineer from Hoodi requested M Sand pricing 12 min ago",
        "A contractor from HSR Layout asked about earthmoving 18 min ago",
        "A developer from Marathahalli enquired about aggregates 22 min ago",
      ],
    },
    formTag:         { type: String, default: "REQUEST A QUOTATION" },
    formTitle:       { type: String, default: "Get Custom Pricing For Your Construction Requirement" },
    formDescription: { type: String, default: "Submit your project requirements and our team will provide customised quotations for earthmoving, aggregates, ready mix concrete, M Sand, P Sand, solid blocks, and infrastructure projects." },
    formFeatures: {
      type: [String],
      default: [
        "Commercial & Residential Projects",
        "Infrastructure & Industrial Solutions",
        "Fast Response From Expert Team",
      ],
    },
    services: {
      type: [String],
      default: [
        "Earthmoving Services",
        "Ready Mix Concrete",
        "M Sand Supply",
        "P Sand Supply",
        "Solid Blocks",
        "Aggregates",
        "Infrastructure Projects",
      ],
    },
    mapTag:   { type: String, default: "LOCATION" },
    mapTitle: { type: String, default: "Visit Our Office" },
    mapEmbed: { type: String, default: "https://www.google.com/maps?q=Chandapura+Bangalore&output=embed" },
    successTitle:    { type: String, default: "Quotation request submitted!" },
    successTimeOpen: { type: String, default: "2–3 hours" },
    successTimeOff:  { type: String, default: "the next business day" },
  },

  // ⭐ ABOUT PAGE CMS — full editable content for /about page
  aboutPage: {
    // Hero
    heroH1:       { type: String, default: "ABOUT US" },
    heroH2a:      { type: String, default: "Top Construction Company in Bangalore" },
    heroH2b:      { type: String, default: "Turning Dreams Into Reality" },
    heroSubtitle: { type: String, default: "Integrated Infrastructure & Construction Solutions" },
    heroDesc:     { type: String, default: "" },
    heroBgDesktop:{ type: String, default: "/about-bg.png" },
    heroBgMobile: { type: String, default: "/about-mobile-bg.png" },
    // Intro
    introTitle:  { type: String, default: "About SMS Infra" },
    introPara1:  { type: String, default: "" },
    introPara2:  { type: String, default: "" },
    // Stats
    statsYearsVal:      { type: String, default: "30+" },
    statsYearsLabel:    { type: String, default: "Years of Excellence" },
    statsProjectsVal:   { type: String, default: "500+" },
    statsProjectsLabel: { type: String, default: "Projects Delivered" },
    statsClientsVal:    { type: String, default: "100+" },
    statsClientsLabel:  { type: String, default: "Trusted Clients" },
    // Journey
    journeyTitle: { type: String, default: "Our Journey" },
    journeyItems: [
      {
        year: String,
        text: String,
      }
    ],
    // Why Choose
    whyTitle: { type: String, default: "Why Choose Us" },
    whyCards: { type: [String], default: ["30+ Years Experience", "Advanced Machinery", "In-house Production", "On-time Delivery"] },
    // Expertise
    expertiseTitle: { type: String, default: "Our Expertise" },
    expertiseDesc:  { type: String, default: "" },
    // Services Banner
    servicesBannerTitle:   { type: String, default: "Complete Construction Solutions" },
    servicesBannerText:    { type: String, default: "" },
    servicesBannerBullets: { type: [String], default: ["High-quality materials", "Advanced machinery & technology", "Experienced team", "Reliable & on-time execution"] },
    servicesBannerImage:   { type: String, default: "/services-banner.png" },
    // Service Cards
    serviceCards: [
      {
        title: String,
        desc:  String,
      }
    ],
    // Process
    processTitle: { type: String, default: "Our Process" },
    processDesc:  { type: String, default: "" },
    processSteps: { type: [String], default: ["Planning", "Design", "Execution", "Delivery"] },
    // Equipment
    equipmentTitle: { type: String, default: "Equipment" },
    equipmentDesc:  { type: String, default: "" },
    equipmentItems: { type: [String], default: ["Earthmovers", "RMC Plants", "Crusher Units", "Block Units"] },
    fleetItems:     { type: [String], default: ["JCB Excavators", "Tipper Trucks", "Transit Mixers", "Cranes & Loaders", "Stone Crushers", "Water Tankers"] },
    // Safety
    safetyTitle: { type: String, default: "Safety & Sustainability" },
    safetyText:  { type: String, default: "" },
    // Mission & Vision
    missionTitle: { type: String, default: "Our Mission" },
    missionText:  { type: String, default: "Deliver high-quality infrastructure solutions with innovation and reliability." },
    visionTitle:  { type: String, default: "Our Vision" },
    visionText:   { type: String, default: "To be Bangalore's most trusted construction partner." },
    // Quality
    qualityTitle: { type: String, default: "Quality & Standards" },
    qualityItems: { type: [String], default: ["ISO Standard Processes", "Regular Cube Testing", "Third-party Verification", "In-house Laboratory", "Strict Safety Compliance"] },
    // Values
    valuesItems: { type: [String], default: ["Quality First", "Timely Delivery", "Customer Commitment", "Innovation", "Sustainability"] },
    // Projects
    projectsTitle: { type: String, default: "Our Projects" },
    projectsPara1: { type: String, default: "" },
    projectsPara2: { type: String, default: "" },
    // Areas
    areasTitle: { type: String, default: "Service Areas" },
    areasItems: { type: [String], default: ["Electronic City", "Sarjapur", "HSR Layout", "BTM Layout", "Whitefield", "Marathahalli"] },
    // CTA
    ctaTitle:   { type: String, default: "Let's Build Something Great Together" },
    ctaText:    { type: String, default: "Looking for a reliable construction partner in Bangalore? Get in touch with SMS Infra today for high-quality and cost-effective solutions." },
    ctaBtnText: { type: String, default: "Contact Us" },
  },

}, { timestamps: true, strict: false });

export default mongoose.model("CMS", cmsSchema);