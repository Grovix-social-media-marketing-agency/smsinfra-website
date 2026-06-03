import express from "express";
import multer from "multer";
import cloudinaryV2 from "../config/cloudinary.js"; // ⭐ uses your existing config with credentials
import { Readable } from "stream";
const cloudinary = cloudinaryV2;
import nodemailer from "nodemailer";
import { Resend } from "resend"; // ⭐ Resend fallback
import Job from "../models/Job.js";
import Application from "../models/Application.js";

const router = express.Router();

// ─── Nodemailer transporter ───────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── Resend fallback ─────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Send email with Gmail primary, Resend fallback ──────
const sendEmail = async ({ from, to, subject, html }) => {
  try {
    await transporter.sendMail({ from, to, subject, html });
    console.log("✅ Email sent via Gmail");
  } catch (gmailErr) {
    console.error("⚠️ Gmail failed, trying Resend:", gmailErr.message);
    try {
      await resend.emails.send({
        from: "SMS Infra <noreply@smsinfra.com>",
        to,
        subject,
        html,
      });
      console.log("✅ Email sent via Resend");
    } catch (resendErr) {
      console.error("❌ Resend also failed:", resendErr.message);
      throw resendErr;
    }
  }
};

// ─── Multer memory storage ────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

// ─── Upload buffer to Cloudinary ─────────────────────────
const uploadToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "smsinfra/resumes", resource_type: "raw", public_id: filename },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    Readable.from(buffer).pipe(stream);
  });

// ─── Email templates ──────────────────────────────────────

function buildClientApplicationEmail(data) {
  return {
    from: `"SMS Infra Careers" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `✅ Application Received — ${data.position} | SMS Infra`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
        <div style="background:#1a1a1a;padding:20px 24px">
          <h2 style="color:#f9b233;margin:0;font-size:18px">SMS Infra</h2>
          <p style="color:#888;margin:4px 0 0;font-size:13px">Turning Dreams Into Reality</p>
        </div>
        <div style="padding:24px">
          <p style="font-size:15px;color:#333">Dear <strong>${data.fullName}</strong>,</p>
          <p style="font-size:14px;color:#555;line-height:1.7">
            Thank you for applying for the position of <strong>${data.position}</strong> at SMS Infra.
            We have received your application and our HR team will review your profile.
          </p>
          <div style="background:#f9f9f9;border-radius:6px;padding:16px;margin:20px 0">
            <p style="margin:0 0 6px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px">Application Details</p>
            <p style="margin:4px 0;font-size:13px"><strong>Position:</strong> ${data.position}</p>
            <p style="margin:4px 0;font-size:13px"><strong>Experience:</strong> ${data.experience}</p>
            <p style="margin:4px 0;font-size:13px"><strong>Location:</strong> ${data.location}</p>
            <p style="margin:4px 0;font-size:13px"><strong>Phone:</strong> ${data.phone}</p>
          </div>
          <p style="font-size:14px;color:#555;line-height:1.7">
            Shortlisted candidates will be contacted within <strong>3–5 business days</strong>.
          </p>
          <p style="font-size:14px;color:#555">
            For queries: <a href="mailto:Info@smsinfra.com" style="color:#f9b233">Info@smsinfra.com</a>
          </p>
        </div>
        <div style="background:#f5f5f5;padding:12px 24px;text-align:center;font-size:12px;color:#999">
          © SMS Infra · 407/11, SMS ELITE, Chandapura, Bengaluru - 560081
        </div>
      </div>
    `,
  };
}

function buildAdminApplicationEmail(data) {
  return {
    from: `"SMS Infra Website" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL_CAREERS || "Info@smsinfra.com",
    subject: `🆕 New Job Application — ${data.position} from ${data.fullName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
        <div style="background:#1a1a1a;padding:20px 24px">
          <h2 style="color:#f9b233;margin:0;font-size:18px">📄 New Job Application</h2>
          <p style="color:#888;margin:4px 0 0;font-size:13px">Received from SMS Infra Careers page</p>
        </div>
        <div style="padding:24px">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr style="background:#f9f9f9"><td style="padding:8px 12px;color:#666;font-size:13px;width:140px">Name</td><td style="padding:8px 12px;font-size:13px"><strong>${data.fullName}</strong></td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:13px">Position</td><td style="padding:8px 12px;font-size:13px"><strong>${data.position}</strong></td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px 12px;color:#666;font-size:13px">Phone</td><td style="padding:8px 12px;font-size:13px"><a href="tel:${data.phone}" style="color:#f9b233">${data.phone}</a></td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:13px">Email</td><td style="padding:8px 12px;font-size:13px"><a href="mailto:${data.email}" style="color:#f9b233">${data.email}</a></td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px 12px;color:#666;font-size:13px">Experience</td><td style="padding:8px 12px;font-size:13px">${data.experience}</td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:13px">Location</td><td style="padding:8px 12px;font-size:13px">${data.location}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px 12px;color:#666;font-size:13px">Expected Salary</td><td style="padding:8px 12px;font-size:13px">${data.expectedSalary || "Not specified"}</td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:13px">Available From</td><td style="padding:8px 12px;font-size:13px">${data.joiningDate || "Immediately"}</td></tr>
            ${data.resumeUrl ? `<tr style="background:#f9f9f9"><td style="padding:8px 12px;color:#666;font-size:13px">Resume</td><td style="padding:8px 12px;font-size:13px"><a href="${data.resumeUrl}" style="color:#f9b233">📎 View Resume</a></td></tr>` : ""}
          </table>
          ${data.message ? `<div style="background:#f9f9f9;border-left:3px solid #f9b233;padding:12px 16px;border-radius:4px;font-size:13px;color:#333">${data.message}</div>` : ""}
        </div>
        <div style="background:#f5f5f5;padding:12px 24px;text-align:center;font-size:12px;color:#999">
          Submitted at ${new Date().toLocaleString("en-IN")}
        </div>
      </div>
    `,
  };
}

// ═══════════════════════════════════════════════════════
// DEFAULT JOBS — seeded into DB if empty
// ═══════════════════════════════════════════════════════

const DEFAULT_JOBS = [
  {
    title: "Site Engineer",
    location: "Bengaluru, Karnataka",
    experience: "2–5 years",
    salary: "₹3.5L – ₹6L per annum",
    type: "Full Time",
    status: "active",
    description:
      "Oversee day-to-day construction activities, ensure quality standards, coordinate with contractors and vendors, and maintain project timelines at active SMS Infra sites.",
  },
  {
    title: "Civil Engineer",
    location: "Bengaluru, Karnataka",
    experience: "3–7 years",
    salary: "₹4L – ₹8L per annum",
    type: "Full Time",
    status: "active",
    description:
      "Design, plan, and supervise civil construction projects. Prepare BOQs, review drawings, and ensure compliance with safety and quality standards.",
  },
  {
    title: "Machine Operator",
    location: "Bengaluru, Karnataka",
    experience: "1–3 years",
    salary: "₹2L – ₹3.5L per annum",
    type: "Full Time",
    status: "active",
    description:
      "Operate and maintain construction machinery including excavators, compactors, and concrete mixers. Follow safety protocols and perform routine equipment checks.",
  },
  {
    title: "Equipment Driver",
    location: "Bengaluru, Karnataka",
    experience: "2–4 years",
    salary: "₹2.5L – ₹4L per annum",
    type: "Full Time",
    status: "active",
    description:
      "Transport materials and equipment to and from project sites. Valid HMV/LMV license required. Must adhere to traffic rules and company safety policies.",
  },
  {
    title: "Office Staff",
    location: "Bengaluru, Karnataka",
    experience: "0–2 years",
    salary: "₹2L – ₹3L per annum",
    type: "Full Time",
    status: "active",
    description:
      "Handle administrative tasks including data entry, filing, correspondence, and coordination with field teams. Proficiency in MS Office required.",
  },
];

// ─── Helper: seed DB if empty ─────────────────────────────
const seedIfEmpty = async () => {
  const count = await Job.countDocuments();
  if (count === 0) {
    await Job.insertMany(DEFAULT_JOBS);
    console.log("🌱 Seeded 5 default jobs into DB");
  }
};

// ═══════════════════════════════════════════════════════
// JOB ROUTES
// ═══════════════════════════════════════════════════════

// Public: active jobs only (auto-seeds if DB empty)
router.get("/jobs", async (req, res) => {
  try {
    await seedIfEmpty();
    const jobs = await Job.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: all jobs (auto-seeds if DB empty)
router.get("/jobs/all", async (req, res) => {
  try {
    await seedIfEmpty();
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: explicit seed button — only inserts if DB is empty
router.post("/jobs/seed", async (req, res) => {
  try {
    const count = await Job.countDocuments();
    if (count > 0) {
      return res.json({
        success: false,
        message: `DB already has ${count} job(s). Seed skipped.`,
        count,
      });
    }
    await Job.insertMany(DEFAULT_JOBS);
    res.json({
      success: true,
      message: `✅ Seeded ${DEFAULT_JOBS.length} default jobs successfully.`,
      count: DEFAULT_JOBS.length,
    });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ error: "Server error during seeding" });
  }
});

router.post("/jobs", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ═══════════════════════════════════════════════════════
// APPLICATION ROUTES
// ═══════════════════════════════════════════════════════

router.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    const {
      fullName, phone, email, position,
      experience, location, expectedSalary,
      joiningDate, message,
    } = req.body;

    if (!fullName || !phone || !email || !position || !experience || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let resumeUrl = "";
    let resumePublicId = "";

    if (req.file) {
      try {
        const filename = `${Date.now()}_${fullName.replace(/\s+/g, "_")}`;
        const result = await uploadToCloudinary(req.file.buffer, filename);
        resumeUrl = result.secure_url;
        resumePublicId = result.public_id;
      } catch (uploadErr) {
        console.error("Resume upload failed:", uploadErr.message);
      }
    }

    const application = await Application.create({
      fullName, phone, email, position,
      experience, location, expectedSalary,
      joiningDate, message,
      resumeUrl, resumePublicId,
    });

    // ⭐ Send emails (non-blocking) — Gmail primary, Resend fallback
    try {
      const clientEmail = buildClientApplicationEmail({ fullName, email, position, experience, location, phone });
      const adminEmail = buildAdminApplicationEmail({ fullName, phone, email, position, experience, location, expectedSalary, joiningDate, message, resumeUrl });
      await Promise.all([
        sendEmail(clientEmail),
        sendEmail(adminEmail),
      ]);
    } catch (emailErr) {
      console.error("⚠️ Email failed (application still saved):", emailErr.message);
    }

    res.status(201).json({ success: true, message: "Application submitted successfully!", id: application._id });
  } catch (err) {
    console.error("Application submit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/applications/:id/status", async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/applications/:id", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (app?.resumePublicId) {
      try { await cloudinary.uploader.destroy(app.resumePublicId, { resource_type: "raw" }); } catch (_) {}
    }
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;