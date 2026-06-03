import express from "express";
import nodemailer from "nodemailer";
import { Resend } from "resend"; // ⭐ Resend fallback
import Quotation from "../models/Quotation.js";

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

// ─── Email templates ──────────────────────────────────────

function buildClientQuotationEmail(data) {
  return {
    from: `"SMS Infra" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `✅ Quotation Request Received — SMS Infra`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
        <div style="background:#1a1a1a;padding:20px 24px">
          <h2 style="color:#f9b233;margin:0;font-size:18px">SMS Infra</h2>
          <p style="color:#888;margin:4px 0 0;font-size:13px">Turning Dreams Into Reality</p>
        </div>
        <div style="padding:24px">
          <p style="font-size:15px;color:#333">Dear <strong>${data.fullName}</strong>,</p>
          <p style="font-size:14px;color:#555;line-height:1.7">
            Thank you for reaching out to SMS Infra. We have received your quotation request for
            <strong>${data.service}</strong> and our team will get back to you shortly.
          </p>
          <div style="background:#f9f9f9;border-radius:6px;padding:16px;margin:20px 0">
            <p style="margin:0 0 6px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px">Your Request Details</p>
            <p style="margin:4px 0;font-size:13px"><strong>Service:</strong> ${data.service}</p>
            <p style="margin:4px 0;font-size:13px"><strong>Location:</strong> ${data.projectLocation}</p>
            <p style="margin:4px 0;font-size:13px"><strong>Phone:</strong> ${data.phone}</p>
          </div>
          <p style="font-size:14px;color:#555;line-height:1.7">
            For urgent requirements, call us directly:<br/>
            <a href="tel:7676590045" style="color:#f9b233;font-weight:bold">7676590045</a> &nbsp;|&nbsp;
            <a href="mailto:sales@smsinfra.com" style="color:#f9b233">sales@smsinfra.com</a>
          </p>
        </div>
        <div style="background:#f5f5f5;padding:12px 24px;text-align:center;font-size:12px;color:#999">
          © SMS Infra · 407/11, SMS ELITE, Chandapura, Bengaluru - 560081
        </div>
      </div>
    `,
  };
}

function buildAdminQuotationEmail(data) {
  const dynRows = Object.entries(data.dynamicFields || {})
    .map(([k, v]) => `<tr><td style="padding:8px 12px;color:#666;font-size:13px">${k}</td><td style="padding:8px 12px;font-size:13px">${v}</td></tr>`)
    .join("");

  return {
    from: `"SMS Infra Website" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL_QUOTATIONS || "sales@smsinfra.com",
    subject: `🆕 New Quotation Request — ${data.service} from ${data.fullName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
        <div style="background:#1a1a1a;padding:20px 24px">
          <h2 style="color:#f9b233;margin:0;font-size:18px">📋 New Quotation Request</h2>
          <p style="color:#888;margin:4px 0 0;font-size:13px">Received from SMS Infra website</p>
        </div>
        <div style="padding:24px">
          <h3 style="color:#333;font-size:13px;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px">Contact Info</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr style="background:#f9f9f9"><td style="padding:8px 12px;color:#666;font-size:13px;width:140px">Name</td><td style="padding:8px 12px;font-size:13px"><strong>${data.fullName}</strong></td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:13px">Company</td><td style="padding:8px 12px;font-size:13px">${data.companyName || "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px 12px;color:#666;font-size:13px">Phone</td><td style="padding:8px 12px;font-size:13px"><a href="tel:${data.phone}" style="color:#f9b233">${data.phone}</a></td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:13px">Email</td><td style="padding:8px 12px;font-size:13px"><a href="mailto:${data.email}" style="color:#f9b233">${data.email}</a></td></tr>
          </table>
          <h3 style="color:#333;font-size:13px;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px">Project Info</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr style="background:#f9f9f9"><td style="padding:8px 12px;color:#666;font-size:13px;width:140px">Service</td><td style="padding:8px 12px;font-size:13px"><strong>${data.service}</strong></td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:13px">Location</td><td style="padding:8px 12px;font-size:13px">${data.projectLocation}</td></tr>
            ${dynRows}
          </table>
          <div style="background:#f9f9f9;border-left:3px solid #f9b233;padding:12px 16px;border-radius:4px;font-size:13px;color:#333">${data.message}</div>
        </div>
        <div style="background:#f5f5f5;padding:12px 24px;text-align:center;font-size:12px;color:#999">
          Submitted at ${new Date().toLocaleString("en-IN")}
        </div>
      </div>
    `,
  };
}

// ─── POST /api/contact/quotation ─────────────────────────
// ⭐ FIXED: explicitly destructure dynamicFields instead of using ...rest
// so frontend sending { dynamicFields: {...} } is handled correctly
router.post("/quotation", async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      phone,
      email,
      service,
      projectLocation,
      message,
      dynamicFields, // ⭐ explicitly destructured — not captured via ...rest
    } = req.body;

    if (!fullName || !phone || !email || !service || !projectLocation || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const quotation = await Quotation.create({
      fullName,
      companyName: companyName || "",
      phone,
      email,
      service,
      projectLocation,
      message,
      dynamicFields: dynamicFields || {}, // ⭐ clean nested object, no double-wrapping
    });

    // ⭐ Send emails (non-blocking) — Gmail primary, Resend fallback
    try {
      const clientEmail = buildClientQuotationEmail({ fullName, email, service, projectLocation, phone });
      const adminEmail  = buildAdminQuotationEmail({ fullName, companyName, phone, email, service, projectLocation, message, dynamicFields: dynamicFields || {} });
      await Promise.all([
        sendEmail(clientEmail),
        sendEmail(adminEmail),
      ]);
    } catch (emailErr) {
      console.error("⚠️ Email failed (quotation still saved):", emailErr.message);
    }

    res.status(201).json({ success: true, id: quotation._id });
  } catch (err) {
    console.error("Quotation submit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── GET /api/contact/quotations ─────────────────────────
router.get("/quotations", async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ─── PATCH /api/contact/quotations/:id/status ────────────
router.patch("/quotations/:id/status", async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(quotation);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ─── DELETE /api/contact/quotations/:id ──────────────────
router.delete("/quotations/:id", async (req, res) => {
  try {
    await Quotation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;