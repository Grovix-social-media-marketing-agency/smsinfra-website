import express from "express";
import { uploadHeroMedia } from "../middleware/upload.js";
import { getHero, createHero, updateHero, deleteHero } from "../controllers/heroController.js";

const router = express.Router();

// ── Routes ────────────────────────────────────────────────────────────────────
router.get(   "/", getHero);
router.post(  "/", uploadHeroMedia, createHero);
router.patch( "/", uploadHeroMedia, updateHero);
router.delete("/", deleteHero);

export default router;