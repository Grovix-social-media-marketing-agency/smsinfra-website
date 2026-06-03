import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

// ── POST /api/leads — save a new lead (called from frontend)
router.post("/", async (req, res) => {
  try {
    const { type, name, email, phone, projectType, message, source } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    const lead = await Lead.create({ type, name, email, phone, projectType, message, source });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/leads — get all leads (admin only)
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/leads/:id/read — mark as read
router.patch("/:id/read", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/leads/:id — delete a lead
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/leads/unread-count — for admin badge
router.get("/unread-count", async (req, res) => {
  try {
    const count = await Lead.countDocuments({ read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;