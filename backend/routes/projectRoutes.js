import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js"; // ✅ EXISTING

const router = express.Router();

// ─── Cloudinary storage for project images ────────────────────────────────────
const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});
const uploadProject = multer({ storage: projectStorage });

// ⭐ POST /api/projects/upload — upload a single image to Cloudinary
// MUST be defined BEFORE /:id routes to avoid "upload" being treated as an id
router.post("/upload", uploadProject.single("image"), async (req, res) => {
  try {
    res.json({ url: req.file.path, publicId: req.file.filename });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ⭐ DELETE /api/projects/upload/:publicId — delete a single Cloudinary image
// MUST be defined BEFORE /:id routes
router.delete("/upload/:publicId", async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ GET ALL PROJECTS (PUBLIC) — EXISTING UNCHANGED
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// ⭐ GET /api/projects/:id — get single project (NEW)
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ ADD PROJECT (PROTECTED 🔐) — EXISTING UNCHANGED
router.post("/add", auth, async (req, res) => {
  try {
    const { title, category, image } = req.body;
    const newProject = new Project({ title, category, image });
    await newProject.save();
    res.json({ message: "Project added successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error adding project" });
  }
});

// ⭐ POST /api/projects — create project from admin (NEW, no auth needed for admin panel)
router.post("/", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ⭐ PATCH /api/projects/:id — update project (NEW)
router.patch("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ DELETE PROJECT (PROTECTED 🔐) — EXISTING UNCHANGED
router.delete("/:id", auth, async (req, res) => {
  try {
    // ⭐ Also delete associated Cloudinary images on delete
    const project = await Project.findById(req.params.id);
    if (project) {
      await Promise.allSettled(
        (project.images || []).map(img => cloudinary.uploader.destroy(img.publicId))
      );
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
});

export default router;