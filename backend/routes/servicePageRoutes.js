import express from "express";
import {
  getPage,
  updatePage,
  uploadImage,
  deleteImage,
  listPages,
} from "../controllers/Servicepagescontroller.js";
import { uploadServicePageImage } from "../middleware/upload.js";

const router = express.Router();

// ── Optional: auth middleware ─────────────────────────────────────────────
// import { protect, adminOnly } from "../middleware/auth.js";
// router.use(protect, adminOnly);

// ── List all pages (admin dashboard overview) ─────────────────────────────
router.get("/", listPages);

// ── Get full page data ────────────────────────────────────────────────────
// GET /api/servicepages/:slug
// Used by: AdminServicePages.js → fetchPage()
//          Frontend service pages → useEffect fetch
router.get("/:slug", getPage);

// ── Save full page (admin panel single PATCH) ─────────────────────────────
// PATCH /api/servicepages/:slug
// Body: full JSON data object from admin state
router.patch("/:slug", updatePage);

// ── Image upload ──────────────────────────────────────────────────────────
// POST /api/servicepages/:slug/upload-image
// Body: multipart/form-data  field: "image"
// Returns: { url, publicId }
router.post("/:slug/upload-image", uploadServicePageImage, uploadImage);

// ── Delete image from Cloudinary ──────────────────────────────────────────
// DELETE /api/servicepages/:slug/image
// Body: { publicId }
router.delete("/:slug/image", deleteImage);

export default router;