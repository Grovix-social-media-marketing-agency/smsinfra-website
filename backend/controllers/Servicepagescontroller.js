import ServicePage  from "../models/ServicePage.js";
import cloudinary   from "../config/cloudinary.js";
import seedDefaults from "../config/Seeddefaults.js";

const VALID_SLUGS = ["rmc", "aggregates", "earthmovers", "msand", "solid-blocks", "builders"];

// ── Helper: delete old Cloudinary image ──────────────────────────────────
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try { await cloudinary.uploader.destroy(publicId); }
  catch (err) { console.error("Cloudinary delete error:", err.message); }
};

// ── Helper: check if a doc is essentially empty (no real content) ─────────
const isEmpty = (page) => {
  // If heroTitle is blank, the doc was created before seeds were added
  return !page.heroTitle || page.heroTitle.trim() === "";
};

// ── Helper: force-update builders doc with all new fields ─────────────────
const patchBuildersFields = async (page) => {
  const defaults = seedDefaults["builders"] || {};
  const newFields = [
    "launchDate","launchingTag","launchingHeading","launchingCardHeader",
    "launchingCardBody","launchProgressBars","launchMilestones",
    "notifyCardHeading","notifyCardSubtext","popupBadge","popupTitle1",
    "popupTitle2","popupSubtitle","popupFeatures",
    "heroTag","heroSubtitle","heroBgImage","ctaBtnPrimary","ctaBtnSecondary",
    "servicesHeading","servicesTitle","serviceItems","featuresHeading",
    "featuresTitle","features","processHeading","processTitle","processSteps",
    "faqs","ctaTag","ctaTitle","ctaSubtitle"
  ];
  let changed = false;
  newFields.forEach(f => {
    const val = page[f];
    const isEmpty = val === undefined || val === null || val === "" ||
      (typeof val === "string" && (val.startsWith("0000") || val.trim() === "")) ||
      (Array.isArray(val) && val.length === 0);
    if (isEmpty && defaults[f] !== undefined) {
      page[f] = defaults[f];
      changed = true;
    }
  });
  if (changed) await page.save();
  return page;
};

// ── Helper: get or create — also re-seeds empty docs ─────────────────────
const getOrCreate = async (slug) => {
  let page = await ServicePage.findOne({ slug });

  if (!page) {
    // Brand new — create with full seed defaults
    const defaults = seedDefaults[slug] || {};
    page = await ServicePage.create({ slug, ...defaults });
  } else if (isEmpty(page)) {
    // Doc exists but is empty (created before seeding was set up) — populate it
    const defaults = seedDefaults[slug] || {};
    Object.assign(page, defaults);
    await page.save();
  } else if (slug === "builders") {
    // Always check builders doc has all new fields — patch any missing ones
    page = await patchBuildersFields(page);
  }

  return page;
};

// ═══════════════════════════════════════════════════════════════════════════
//  GET /api/servicepages/:slug
//  Returns the full page document (used by both admin and frontend)
// ═══════════════════════════════════════════════════════════════════════════
export const getPage = async (req, res) => {
  const { slug } = req.params;
  if (!VALID_SLUGS.includes(slug)) {
    return res.status(404).json({ success: false, message: "Unknown service slug" });
  }
  try {
    const page = await getOrCreate(slug);
    res.json(page);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  PATCH /api/servicepages/:slug
//  Admin saves the entire page object in one shot.
// ═══════════════════════════════════════════════════════════════════════════
export const updatePage = async (req, res) => {
  const { slug } = req.params;
  if (!VALID_SLUGS.includes(slug)) {
    return res.status(404).json({ success: false, message: "Unknown service slug" });
  }
  try {
    const page    = await getOrCreate(slug);
    const updates = req.body;

    // Scalar fields
    const scalarFields = [
      // ── Hero ──────────────────────────────────────────────────────────────
      "heroTag", "heroTitle", "heroSubtitle", "heroBtnPrimary", "heroBtnSecondary",
      "heroBgImage", "heroRightImage",
      // ── About ─────────────────────────────────────────────────────────────
      "aboutTag", "aboutTitle", "aboutPara1", "aboutPara2", "aboutImage",
      // ── Services ──────────────────────────────────────────────────────────
      "servicesHeading", "servicesTitle",
      // ── Process ───────────────────────────────────────────────────────────
      "processHeading", "processTitle",
      // ── Features ──────────────────────────────────────────────────────────
      "featuresHeading", "featuresTitle", "featuresDesc",
      // ── Applications ──────────────────────────────────────────────────────
      "applicationsHeading", "applicationsTitle",
      // ── Comparison ────────────────────────────────────────────────────────
      "comparisonHeading", "comparisonTitle",
      "comparisonLeftTitle", "comparisonRightTitle",
      // ── CTA ───────────────────────────────────────────────────────────────
      "ctaTag", "ctaTitle", "ctaSubtitle", "ctaBtnPrimary", "ctaBtnSecondary",
      "ctaBgImage",
      // ── Builders: Launching Soon ──────────────────────────────────────────
      "launchDate",
      "launchingTag", "launchingHeading",
      "launchingCardHeader", "launchingCardBody",
      "notifyCardHeading", "notifyCardSubtext",
      // ── Builders: Popup ───────────────────────────────────────────────────
      "popupBadge", "popupTitle1", "popupTitle2", "popupSubtitle",
    ];
    scalarFields.forEach((f) => {
      if (updates[f] !== undefined) page[f] = updates[f];
    });

    // Array fields — replace entirely if provided
    const arrayFields = [
      // ── Common ────────────────────────────────────────────────────────────
      "trustItems", "aboutPoints", "stats",
      "serviceItems", "processSteps", "features",
      "applications", "faqs",
      "comparisonLeftPoints", "comparisonRightPoints",
      // ── Builders-specific ─────────────────────────────────────────────────
      "launchProgressBars", "launchMilestones", "popupFeatures",
    ];
    arrayFields.forEach((f) => {
      if (updates[f] !== undefined) page[f] = updates[f];
    });

    await page.save();
    res.json(page);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  POST /api/servicepages/:slug/upload-image
// ═══════════════════════════════════════════════════════════════════════════
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided" });
  }
  try {
    res.json({
      success:  true,
      url:      req.file.path,
      publicId: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  DELETE /api/servicepages/:slug/image
// ═══════════════════════════════════════════════════════════════════════════
export const deleteImage = async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) {
    return res.status(400).json({ success: false, message: "publicId required" });
  }
  try {
    await deleteFromCloudinary(publicId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  GET /api/servicepages  — list all pages
// ═══════════════════════════════════════════════════════════════════════════
export const listPages = async (req, res) => {
  try {
    const pages = await ServicePage.find({}, "slug heroTitle updatedAt");
    res.json(pages);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  POST /api/servicepages/:slug/reset
//  Wipes the document and re-creates from seedDefaults
// ═══════════════════════════════════════════════════════════════════════════
export const resetPage = async (req, res) => {
  const { slug } = req.params;
  if (!VALID_SLUGS.includes(slug)) {
    return res.status(404).json({ success: false, message: "Unknown service slug" });
  }
  try {
    // Always wipe and recreate from seed — no conditions
    await ServicePage.deleteOne({ slug });
    const defaults = seedDefaults[slug] || {};
    const fresh = await ServicePage.create({ slug, ...defaults });
    res.json(fresh);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};