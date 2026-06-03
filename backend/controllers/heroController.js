import Hero from "../models/Hero.js";
import cloudinary from "../config/cloudinary.js";

// ── Helper: delete a Cloudinary asset safely ──────────────────────────────────
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn("Cloudinary delete warning:", err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/hero  — called by Hero.js frontend
// ─────────────────────────────────────────────────────────────────────────────
export const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne().sort({ createdAt: -1 });

    if (!hero) return res.status(200).json(null); // ✅ fixed: return 200 with null instead of 404

    res.json(hero);
  } catch (err) {
    console.error("getHero error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/hero  — upload all 3 assets fresh
// multipart/form-data fields: desktopImage, mobileImage, video
// ─────────────────────────────────────────────────────────────────────────────
export const createHero = async (req, res) => {
  try {
    const { files } = req;

    if (!files?.desktopImage?.[0] || !files?.mobileImage?.[0] || !files?.video?.[0]) {
      return res.status(400).json({
        message: "Please upload desktopImage, mobileImage, and video",
      });
    }

    // Delete existing hero from Cloudinary + DB
    const existing = await Hero.findOne();
    if (existing) {
      await deleteFromCloudinary(existing.desktopImage?.publicId, "image");
      await deleteFromCloudinary(existing.mobileImage?.publicId,  "image");
      await deleteFromCloudinary(existing.video?.publicId,        "video");
      await existing.deleteOne();
    }

    const hero = await Hero.create({
      desktopImage: { url: files.desktopImage[0].path, publicId: files.desktopImage[0].filename },
      mobileImage:  { url: files.mobileImage[0].path,  publicId: files.mobileImage[0].filename  },
      video:        { url: files.video[0].path,         publicId: files.video[0].filename        },
      tagline:      req.body?.tagline || undefined,
      ticker:       req.body?.ticker  || undefined,
    });

    res.status(201).json(hero);
  } catch (err) {
    console.error("createHero error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/hero  — update any one or more assets + text fields
// multipart/form-data: any subset of desktopImage, mobileImage, video, tagline, ticker
// ─────────────────────────────────────────────────────────────────────────────
export const updateHero = async (req, res) => {
  try {
    // ✅ upsert — create document if none exists yet so text-only save always works
    let hero = await Hero.findOne();
    if (!hero) hero = new Hero({});

    const { files } = req;

    if (files?.desktopImage?.[0]) {
      await deleteFromCloudinary(hero.desktopImage?.publicId, "image");
      hero.desktopImage = { url: files.desktopImage[0].path, publicId: files.desktopImage[0].filename };
    }

    if (files?.mobileImage?.[0]) {
      await deleteFromCloudinary(hero.mobileImage?.publicId, "image");
      hero.mobileImage = { url: files.mobileImage[0].path, publicId: files.mobileImage[0].filename };
    }

    if (files?.video?.[0]) {
      await deleteFromCloudinary(hero.video?.publicId, "video");
      hero.video = { url: files.video[0].path, publicId: files.video[0].filename };
    }

    if (req.body?.tagline) hero.tagline = req.body.tagline;
    if (req.body?.ticker)  hero.ticker  = req.body.ticker;

    await hero.save();
    res.json(hero);
  } catch (err) {
    console.error("updateHero error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/hero  — remove document + all Cloudinary assets
// ─────────────────────────────────────────────────────────────────────────────
export const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: "No hero media found" });

    await deleteFromCloudinary(hero.desktopImage?.publicId, "image");
    await deleteFromCloudinary(hero.mobileImage?.publicId,  "image");
    await deleteFromCloudinary(hero.video?.publicId,        "video");

    await hero.deleteOne();
    res.json({ message: "Hero media deleted successfully" });
  } catch (err) {
    console.error("deleteHero error:", err);
    res.status(500).json({ message: "Server error" });
  }
};