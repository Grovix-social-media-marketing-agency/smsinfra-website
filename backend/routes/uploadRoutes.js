import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ── Admin auth ──
const verifyAdmin = (req, res, next) => {
  if (req.headers["x-admin-password"] !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: "Unauthorized" });
  next();
};

// ── Save to /public/uploads/ ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

router.post("/", verifyAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // returns a URL the frontend saves into CMS
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;