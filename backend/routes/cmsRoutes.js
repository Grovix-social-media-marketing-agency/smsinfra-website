import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import CMS from "../models/CMS.js";

const router = express.Router();

// ─── Cloudinary storage: client logos ───────────────────────────────────────
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "client-logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});
const uploadLogo = multer({ storage: logoStorage });

// ─── Cloudinary storage: gallery images ─────────────────────────────────────
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});
const uploadGallery = multer({ storage: galleryStorage });

// ─── Cloudinary storage: generic images (About page etc.) ───────────────────
const genericImageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req) => ({
    folder: req.body.folder || "cms-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  }),
});
const uploadGenericImage = multer({ storage: genericImageStorage });

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
const defaultCMS = {
  navbar: {
    logo: "/logo.png",
    ctaText: "Get Quote",
    ctaLink: "/contact",
  },
  services: [
    { name: "Earthmovers",         link: "/services/earthmovers" },
    { name: "Ready Mix Concrete",  link: "/services/rmc" },
    { name: "Solid Blocks",        link: "/services/solid-blocks" },
    { name: "Aggregates",          link: "/services/aggregates" },
    { name: "M Sand & P Sand",     link: "/services/msand" },
    { name: "Builders Projects",   link: "/services/builders" },
  ],
  projects: [
    { name: "Residential",        link: "/projects/residential" },
    { name: "Commercial",         link: "/projects/commercial" },
    { name: "Construction Sites", link: "/projects/sites" },
    { name: "Machinery",          link: "/projects/machinery" },
    { name: "Production Units",   link: "/projects/production" },
  ],
  overview: {
    title: "Top Construction Company in Bangalore",
    tagline1: "Turning Dreams Into Reality",
    tagline2: "Integrated Infrastructure & Construction Solutions",
    description:
      "SMS Infra is a leading construction and infrastructure company based in Chandapura, Bangalore, with over 30 years of experience in delivering high-quality engineering and material solutions. We specialize in earthmoving services, ready mix concrete (RMC), concrete block manufacturing, aggregates, M Sand, and P Sand supply for residential, commercial, and large-scale infrastructure projects across Bangalore. Operating within a 30 km service radius from Chandapura, we serve key areas including Electronic City, Sarjapur, HSR Layout, BTM Layout, Whitefield, and Marathahalli. With advanced machinery, in-house production units, and a strong focus on quality, safety, and timely execution, SMS Infra is a trusted partner for builders, developers, and contractors across Bangalore.",
    yearsTarget: 30,
    projectsTarget: 500,
    clientsTarget: 100,
  },
  areasSection: {
    title: "Areas We Serve",
    subtitle: "Delivering within a 30 km radius of Chandapura, Bangalore",
    areas: [
      "Electronic City", "Sarjapur", "HSR Layout", "BTM Layout",
      "Whitefield", "Marathahalli", "Chandapura", "Bommasandra",
      "Attibele", "Anekal",
    ],
  },
  whyChoose: {
    title: "Why Choose SMS Infra?",
    subtitle: "30+ years of trust, quality, and on-time delivery",
    points: [
      { icon: "🏗️", heading: "30+ Years Experience",   text: "Decades of expertise in construction & infrastructure." },
      { icon: "⚡", heading: "On-Time Delivery",        text: "We respect your timelines and deliver without delays." },
      { icon: "✅", heading: "Quality Assured",         text: "All materials meet IS standards and are lab-tested." },
      { icon: "🚛", heading: "In-House Fleet",          text: "Own machinery & vehicles for reliable operations." },
      { icon: "📍", heading: "Local Expertise",         text: "Deep knowledge of Bangalore's terrain & regulations." },
      { icon: "🤝", heading: "Trusted Partnerships",    text: "100+ clients including top builders & developers." },
    ],
  },
  testimonials: {
    title: "What Our Clients Say",
    subtitle: "Trusted by builders, developers and contractors across Bangalore",
    items: [
      {
        name: "Rajesh Kumar",
        role: "Builder, Electronic City",
        text: "SMS Infra delivered RMC on time for our 200-unit residential project. Quality was excellent.",
        rating: 5,
        avatar: "",
      },
      {
        name: "Suresh Reddy",
        role: "Contractor, Sarjapur",
        text: "Their earthmoving team is highly professional. Completed excavation ahead of schedule.",
        rating: 5,
        avatar: "",
      },
      {
        name: "Meena Sharma",
        role: "Developer, Whitefield",
        text: "Best M Sand supplier in Bangalore. Consistent quality and fair pricing every time.",
        rating: 4,
        avatar: "",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about SMS Infra",
    items: [
      {
        question: "What areas does SMS Infra serve?",
        answer: "We serve a 30 km radius from Chandapura including Electronic City, Sarjapur, HSR Layout, Whitefield, Marathahalli and more.",
      },
      {
        question: "What materials do you supply?",
        answer: "We supply Ready Mix Concrete (RMC), M Sand, P Sand, aggregates, concrete solid blocks, and provide earthmoving services.",
      },
      {
        question: "How can I get a quote?",
        answer: "Call us directly or use the Get Quote button on our website. We respond within 24 hours.",
      },
      {
        question: "Do you provide earthmoving equipment on hire?",
        answer: "Yes, we provide JCBs, dozers, tippers, and other earthmoving machinery on hire basis.",
      },
    ],
  },
};

// ⭐ LOCAL LOGOS SEED — these are the 12 local /public files seeded into DB on first load
const DEFAULT_LOCAL_LOGOS = Array.from({ length: 12 }, (_, i) => ({
  url: `/client${i + 1}.png`,
  publicId: `local-client${i + 1}`,
  isLocal: true,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ensureField = (data, key, defaultVal) => {
  const isEmpty = (v) =>
    v === undefined || v === null || (Array.isArray(v) && v.length === 0) ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);
  if (isEmpty(data[key])) {
    data[key] = defaultVal;
    return true;
  }
  return false;
};

// ─── GET CMS ─────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    let data = await CMS.findOne();
    if (!data) {
      data = await CMS.create(defaultCMS);
    }

    let needsUpdate = false;
    const fields = [
      "navbar", "services", "projects", "overview",
      "areasSection", "whyChoose", "testimonials", "faq",
      "social", "navbarSocial",
    ];
    for (const f of fields) {
      if (ensureField(data, f, defaultCMS[f])) needsUpdate = true;
    }

    // ⭐ AUTO-SEED: if clientLogos is empty, seed the 12 local logos into DB
    if (!data.clientLogos || data.clientLogos.length === 0) {
      data.clientLogos = DEFAULT_LOCAL_LOGOS;
      needsUpdate = true;
    }

    if (needsUpdate) await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT CMS (full update) ────────────────────────────────────────────────────
router.put("/", async (req, res) => {
  try {
    // Don't overwrite gallery or clientLogos via bulk PUT — those have dedicated endpoints
    const { gallery, clientLogos, ...rest } = req.body;
    const updated = await CMS.findOneAndUpdate(
      {},
      { $set: rest },
      { returnDocument: "after", upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  CLIENT LOGOS
// ═══════════════════════════════════════════════════════════════════════════════

router.post("/logos", uploadLogo.single("logo"), async (req, res) => {
  try {
    const logo = { url: req.file.path, publicId: req.file.filename, isLocal: false };
    const data = await CMS.findOneAndUpdate(
      {},
      { $push: { clientLogos: logo } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.clientLogos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/logos/reorder", async (req, res) => {
  try {
    const { logos } = req.body;
    if (!Array.isArray(logos)) {
      return res.status(400).json({ error: "logos must be an array" });
    }
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { clientLogos: logos } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.clientLogos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/logos/delete", async (req, res) => {
  try {
    const publicId = req.query.pid;
    if (!publicId) return res.status(400).json({ error: "pid query param required" });
    if (!publicId.startsWith("local-")) {
      await cloudinary.uploader.destroy(publicId);
    }
    const data = await CMS.findOneAndUpdate(
      {},
      { $pull: { clientLogos: { publicId } } },
      { returnDocument: "after" }
    );
    res.json(data.clientLogos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/logos/:publicId", async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    if (!publicId.startsWith("local-")) {
      await cloudinary.uploader.destroy(publicId);
    }
    const data = await CMS.findOneAndUpdate(
      {},
      { $pull: { clientLogos: { publicId } } },
      { returnDocument: "after" }
    );
    res.json(data.clientLogos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  GALLERY
// ═══════════════════════════════════════════════════════════════════════════════

router.post("/gallery", uploadGallery.single("image"), async (req, res) => {
  try {
    const image = {
      url: req.file.path,
      publicId: req.file.filename,
      caption: req.body.caption || "",
    };
    const data = await CMS.findOneAndUpdate(
      {},
      { $push: { "gallery.images": image } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/gallery/meta", async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { "gallery.title": title, "gallery.subtitle": subtitle } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/gallery/caption/:publicId", async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const data = await CMS.findOneAndUpdate(
      { "gallery.images.publicId": publicId },
      { $set: { "gallery.images.$.caption": req.body.caption } },
      { returnDocument: "after" }
    );
    res.json(data.gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/gallery/reset", async (req, res) => {
  try {
    const DEFAULT_STATIC_GALLERY_IMAGES = [
      { url: "/residential-1.jpg",        publicId: "static-res-1",   caption: "Residential Projects",        isStatic: true },
      { url: "/commercial.png",           publicId: "static-com-1",   caption: "Commercial",                  isStatic: true },
      { url: "/construction Site-1.jpg",  publicId: "static-con-1",   caption: "Construction Sites",          isStatic: true },
      { url: "/construction Site-2.jpg",  publicId: "static-con-2",   caption: "Construction Sites",          isStatic: true },
      { url: "/construction.png",         publicId: "static-con-3",   caption: "Construction Sites",          isStatic: true },
      { url: "/construction-mobile.png",  publicId: "static-con-4",   caption: "Construction Sites",          isStatic: true },
      { url: "/Machinery1.jpg",           publicId: "static-mach-1",  caption: "Machinery & Infrastructure",  isStatic: true },
      { url: "/Machinery-2.jpg",          publicId: "static-mach-2",  caption: "Machinery & Infrastructure",  isStatic: true },
      { url: "/Machinery-3.png",          publicId: "static-mach-3",  caption: "Machinery & Infrastructure",  isStatic: true },
      { url: "/Machinery-5.jpg",          publicId: "static-mach-4",  caption: "Machinery & Infrastructure",  isStatic: true },
      { url: "/Machinery-6.png",          publicId: "static-mach-5",  caption: "Machinery & Infrastructure",  isStatic: true },
      { url: "/Production Units-1.png",   publicId: "static-mat-1",   caption: "Material Production Units",   isStatic: true },
      { url: "/Production Units-2.jpg",   publicId: "static-mat-2",   caption: "Material Production Units",   isStatic: true },
      { url: "/Production Units-3.JPG",   publicId: "static-mat-3",   caption: "Material Production Units",   isStatic: true },
      { url: "/Production Units-4.png",   publicId: "static-mat-4",   caption: "Material Production Units",   isStatic: true },
      { url: "/Production Units-5.JPG",   publicId: "static-mat-5",   caption: "Material Production Units",   isStatic: true },
      { url: "/Production Units-6.png",   publicId: "static-mat-6",   caption: "Material Production Units",   isStatic: true },
      { url: "/Production Units-7.png",   publicId: "static-mat-7",   caption: "Material Production Units",   isStatic: true },
    ];
    const existing = await CMS.findOne();
    if (existing?.gallery?.images?.length) {
      const cloudinaryImages = existing.gallery.images.filter((img) => !img.isStatic);
      await Promise.allSettled(
        cloudinaryImages.map((img) => cloudinary.uploader.destroy(img.publicId))
      );
    }
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { "gallery.images": DEFAULT_STATIC_GALLERY_IMAGES } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/gallery/delete", async (req, res) => {
  try {
    const publicId = req.query.pid;
    if (!publicId) return res.status(400).json({ error: "pid query param required" });
    if (!publicId.startsWith("static-")) {
      await cloudinary.uploader.destroy(publicId);
    }
    const data = await CMS.findOneAndUpdate(
      {},
      { $pull: { "gallery.images": { publicId } } },
      { returnDocument: "after" }
    );
    res.json(data.gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/gallery/:publicId", async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId);
    const data = await CMS.findOneAndUpdate(
      {},
      { $pull: { "gallery.images": { publicId } } },
      { returnDocument: "after" }
    );
    res.json(data.gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════

router.patch("/testimonials", async (req, res) => {
  try {
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { testimonials: req.body } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  FAQ
// ═══════════════════════════════════════════════════════════════════════════════

router.patch("/faq", async (req, res) => {
  try {
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { faq: req.body } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  AREAS
// ═══════════════════════════════════════════════════════════════════════════════

router.patch("/areas", async (req, res) => {
  try {
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { areasSection: req.body } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.areasSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  WHY CHOOSE
// ═══════════════════════════════════════════════════════════════════════════════

router.patch("/whychoose", async (req, res) => {
  try {
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { whyChoose: req.body } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.whyChoose);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════

router.patch("/overview", async (req, res) => {
  try {
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { overview: req.body } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.overview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  SERVICE CARDS
// ═══════════════════════════════════════════════════════════════════════════════

router.patch("/servicecards", async (req, res) => {
  try {
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { serviceCards: req.body } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.serviceCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════════════════════════════

router.patch("/navbar", async (req, res) => {
  try {
    const { ctaText, ctaLink, instagram, linkedin, facebook, youtube } = req.body;
    const data = await CMS.findOneAndUpdate(
      {},
      {
        $set: {
          "navbar.ctaText": ctaText,
          "navbar.ctaLink": ctaLink,
          navbarSocial: { instagram, linkedin, facebook, youtube },
        },
      },
      { returnDocument: "after", upsert: true }
    );
    res.json({ navbar: data.navbar, navbarSocial: data.navbarSocial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ABOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════════

router.get("/about", async (req, res) => {
  try {
    const data = await CMS.findOne();
    res.json(data?.about || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/about", async (req, res) => {
  try {
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { about: req.body } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  CONTACT PAGE
// ═══════════════════════════════════════════════════════════════════════════════

router.get("/contactpage", async (req, res) => {
  try {
    const data = await CMS.findOne();
    res.json(data?.contactPage || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/contactpage", async (req, res) => {
  try {
    const data = await CMS.findOneAndUpdate(
      {},
      { $set: { contactPage: req.body } },
      { returnDocument: "after", upsert: true }
    );
    res.json(data.contactPage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  GENERIC IMAGE UPLOAD (About page hero/banner images → Cloudinary)
// ═══════════════════════════════════════════════════════════════════════════════

router.post("/upload-image", uploadGenericImage.single("image"), async (req, res) => {
  try {
    res.json({ url: req.file.path, publicId: req.file.filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;