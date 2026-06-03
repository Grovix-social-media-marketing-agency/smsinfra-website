import express from 'express';
import Announcement from '../models/announcement.js';
const router = express.Router();

// ─── Simple Admin Password Middleware ────────────────────────────────────────
const verifyAdmin = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// ─── PUBLIC: Get ALL active announcements (for Home page banner) ──────────────
router.get('/active', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(announcements); // always returns array (empty [] if none)
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── ADMIN: Get all announcements ─────────────────────────────────────────────
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── ADMIN: Create new announcement ──────────────────────────────────────────
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { message, type, handle, instagramUrl } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // ✅ No auto-deactivation — multiple announcements can be live at once
    const announcement = new Announcement({
      message,
      type,
      ...(handle && { handle }),
      ...(instagramUrl && { instagramUrl }),
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── ADMIN: Toggle active/inactive ───────────────────────────────────────────
router.patch('/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Not found' });
    announcement.isActive = !announcement.isActive;
    await announcement.save();
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── ADMIN: Delete announcement ───────────────────────────────────────────────
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;