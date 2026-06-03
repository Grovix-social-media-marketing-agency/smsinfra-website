import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import ServiceHub from "../models/ServiceHub.js";

const router = express.Router();

// ─── Cloudinary storage for service hub card images ───────────────────────────
const serviceHubImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "service-hub",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});
const uploadServiceHubImage = multer({ storage: serviceHubImageStorage });

const DEFAULT = {
  heroTitle: "Construction & Infrastructure Services in Bangalore",
  heroSubtitle: "SMS Infra is one of the trusted construction and infrastructure solution providers in Bangalore, offering high-quality earthmoving services, ready mix concrete, M-sand, aggregates, concrete solid blocks, and complete infrastructure project solutions. With decades of industry expertise, modern machinery, and a commitment to quality, we deliver reliable construction materials and services for residential, commercial, industrial, and large-scale infrastructure developments across Karnataka.",
  heroBtnPrimary: "Get Quote",
  heroBtnSecondary: "Explore Services",
  introTitle: "Trusted Construction Solutions Partner",
  introPara: "At SMS Infra, we specialize in delivering dependable construction materials and infrastructure services tailored to modern project requirements. From excavation and earthmoving to concrete manufacturing and aggregate supply, our solutions are designed to support durable, efficient, and cost-effective construction. Our experienced team, advanced production facilities, and customer-focused approach make us a preferred construction partner for builders, contractors, developers, and infrastructure companies in Bangalore.",
  statExp: 30,
  statProjects: 50,
  statBlocks: 800000,
  services: [
    { title: "Earthmoving Services", img: "/earthmovers.png", path: "/services/earthmovers", desc: "Excavation, demolition, grading & hauling with modern machinery.", features: ["Fast","Reliable","Heavy Duty"], hoverBenefits: ["✔ GPS-tracked machinery","✔ Bangalore-wide coverage","✔ ISO-certified operations","✔ 24–48 hr deployment"], deliveryTimeline: "2–3 Days", industries: ["Residential","Industrial","Infrastructure"], featured: false },
    { title: "Concrete Solid Blocks", img: "/blocks.png", path: "/services/concrete-blocks", desc: "High-strength concrete blocks with durability and precision.", features: ["Strong","Durable","Cost Efficient"], hoverBenefits: ["✔ IS 2185 standard certified","✔ 800,000+ blocks supplied","✔ Custom sizes available","✔ Same-day dispatch"], deliveryTimeline: "1–2 Days", industries: ["Residential","Commercial","Government"], featured: true },
    { title: "Ready Mix Concrete", img: "/rmc.png", path: "/services/rmc", desc: "Consistent, high-quality concrete for all construction needs.", features: ["Quality Tested","On-time","Consistent"], hoverBenefits: ["✔ Lab-tested each batch","✔ Transit mixer delivery","✔ M20–M60 grades","✔ Real-time tracking"], deliveryTimeline: "Same Day", industries: ["Commercial","Industrial","Infrastructure"], featured: false },
    { title: "M-Sand", img: "/sand.png", path: "/services/m-sand", desc: "Manufactured sand ensuring strength and durability.", features: ["Eco","Strong","Uniform"], hoverBenefits: ["✔ Eco-friendly alternative","✔ Uniform particle size","✔ Zero silt content","✔ BIS compliant"], deliveryTimeline: "1–2 Days", industries: ["Residential","Commercial","Industrial"], featured: false },
    { title: "Aggregates", img: "/aggregates.png", path: "/services/aggregates", desc: "Well-graded aggregates for strong concrete structures.", features: ["Multi Size","Reliable","High Strength"], hoverBenefits: ["✔ 6mm to 40mm sizes","✔ Washed & graded","✔ Bulk supply available","✔ Quality tested"], deliveryTimeline: "1–2 Days", industries: ["Commercial","Industrial","Government"], featured: false },
    { title: "Infra Projects", img: "/projects.png", path: "/services/construction", desc: "End-to-end residential & commercial construction solutions.", features: ["Turnkey","Expert Team","Timely"], hoverBenefits: ["✔ Full project management","✔ Licensed engineers","✔ Pan-Karnataka coverage","✔ On-time guarantee"], deliveryTimeline: "As per scope", industries: ["Residential","Commercial","Government","Infrastructure"], featured: false },
  ],
  industries: [
    { icon: "🏠", label: "Residential", desc: "Villas, apartments & housing complexes" },
    { icon: "🏢", label: "Commercial",  desc: "Offices, malls & retail spaces" },
    { icon: "🏭", label: "Industrial",  desc: "Factories, warehouses & plants" },
    { icon: "🏛️", label: "Government", desc: "Public infrastructure & civic projects" },
    { icon: "🛣️", label: "Infrastructure", desc: "Roads, bridges & utilities" },
  ],
  processSteps: [
    { icon: "📞", title: "Consultation", desc: "Understand your project requirements and scope" },
    { icon: "📐", title: "Planning",     desc: "Detailed estimation, scheduling & resource allocation" },
    { icon: "🏗️", title: "Production",  desc: "Quality materials manufactured with precision" },
    { icon: "🚛", title: "Delivery",    desc: "On-time, tracked delivery to your site" },
    { icon: "✅", title: "Execution",   desc: "Expert support from start to project completion" },
  ],
  whyTitle:  "Why Choose SMS Infra?",
  whyPara:   "SMS Infra combines industry experience, advanced technology, and quality-driven operations to deliver reliable infrastructure and construction solutions. Our integrated approach ensures efficient project execution, consistent material quality, timely delivery, and customer satisfaction across every stage of construction and development.",
  whyPoints: ["✔ 30+ Years Experience","✔ In-house Production","✔ Timely Delivery"],
  ctaTitle: "Let's Build Your Next Project",
  ctaPara:  "Looking for reliable construction materials or infrastructure services in Bangalore? Contact SMS Infra today for customized solutions, competitive pricing, and expert support for your next residential, commercial, or industrial project.",
  ctaBtn:   "Get In Touch",
};

// ── GET /api/servicehub ───────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    let doc = await ServiceHub.findOne();
    if (!doc) doc = await ServiceHub.create(DEFAULT);
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH /api/servicehub ─────────────────────────────────────────────────────
router.patch("/", async (req, res) => {
  try {
    const doc = await ServiceHub.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ⭐ POST /api/servicehub/upload-card-image/:index — EXISTING UNCHANGED
router.post("/upload-card-image/:index", uploadServiceHubImage.single("image"), async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0) {
      return res.status(400).json({ error: "Invalid card index" });
    }

    const imageUrl = req.file.path;

    const doc = await ServiceHub.findOne();
    if (!doc) return res.status(404).json({ error: "ServiceHub not found" });

    if (!doc.services[index]) {
      return res.status(404).json({ error: "Card not found at index" });
    }

    doc.services[index].img = imageUrl;
    await doc.save();

    res.json({ url: imageUrl, index });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ⭐ POST /api/servicehub/reset — delete doc and recreate from DEFAULT
// MUST be defined BEFORE any /:param routes to avoid "reset" being treated as a param
router.post("/reset", async (req, res) => {
  try {
    await ServiceHub.deleteOne({});
    const doc = await ServiceHub.create(DEFAULT);
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;