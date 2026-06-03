import express from "express";
import {
  getPage,
  updatePage,
  uploadImage,
  deleteImage,
  listPages,
  resetPage,
} from "../controllers/Servicepagescontroller.js";
import { uploadServicePageImage } from "../middleware/upload.js";

const router = express.Router();

// ── Optional: auth middleware ─────────────────────────────────────────────
// import { protect, adminOnly } from "../middleware/auth.js";
// router.use(protect, adminOnly);

// ── List all pages ────────────────────────────────────────────────────────
router.get("/", listPages);

// ── Get full page data ────────────────────────────────────────────────────
router.get("/:slug", getPage);

// ── Save full page ────────────────────────────────────────────────────────
router.patch("/:slug", updatePage);

// ── Image upload ──────────────────────────────────────────────────────────
router.post("/:slug/upload-image", uploadServicePageImage, uploadImage);

// ── Reset to seed defaults ────────────────────────────────────────────────
router.post("/:slug/reset", resetPage);

// ── Delete image from Cloudinary ──────────────────────────────────────────
router.delete("/:slug/image", deleteImage);

export default router;