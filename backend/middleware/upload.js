import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ═══════════════════════════════════════════════════════════════════════════
//  EXISTING — Hero media upload (images + video) — DO NOT TOUCH
// ═══════════════════════════════════════════════════════════════════════════

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "hero/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ quality: "auto", fetch_format: "auto" }],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "hero/videos",
    resource_type:   "video",
    allowed_formats: ["mp4", "mov", "webm"],
  },
});

const storageSelector = {
  _handleFile(req, file, cb) {
    if (file.fieldname === "video") {
      videoStorage._handleFile(req, file, cb);
    } else {
      imageStorage._handleFile(req, file, cb);
    }
  },
  _removeFile(req, file, cb) {
    if (file.fieldname === "video") {
      videoStorage._removeFile(req, file, cb);
    } else {
      imageStorage._removeFile(req, file, cb);
    }
  },
};

const multerUpload = multer({ storage: storageSelector }).fields([
  { name: "desktopImage", maxCount: 1 },
  { name: "mobileImage",  maxCount: 1 },
  { name: "video",        maxCount: 1 },
]);

// ✅ Wraps multer so it never errors when no files are sent (text-only PATCH)
export const uploadHeroMedia = (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ message: "File upload error", error: err.message });
    }
    next();
  });
};

// ═══════════════════════════════════════════════════════════════════════════
//  NEW — Service pages single-image upload
//  Used by: POST /api/servicepages/:slug/upload-image
//  - Images go to Cloudinary under  sms-infra/<slug>/
//  - Field name expected: "image"
//  - Returns req.file.path (URL) and req.file.filename (publicId)
// ═══════════════════════════════════════════════════════════════════════════

const servicePageImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Each service gets its own Cloudinary subfolder: sms-infra/aggregates/, etc.
    const slug   = req.params.slug || "general";
    const folder = `sms-infra/${slug}`;

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 1400, height: 1000, crop: "limit", quality: "auto:good" },
      ],
      public_id: `${Date.now()}-${file.originalname
        .replace(/\.[^.]+$/, "")
        .replace(/\s+/g, "-")}`,
    };
  },
});

const servicePageMulter = multer({
  storage: servicePageImageStorage,
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// ✅ Wraps multer so it never errors when no file is sent (text-only PATCH)
export const uploadServicePageImage = (req, res, next) => {
  servicePageMulter.single("image")(req, res, (err) => {
    if (err) {
      console.error("Service page upload error:", err.message);
      return res.status(400).json({ message: "File upload error", error: err.message });
    }
    next();
  });
};