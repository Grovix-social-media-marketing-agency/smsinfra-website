import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Admin from "../models/Admin.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ⭐ NODEMAILER — hardcoded credentials so env timing doesn't matter */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "smsinfra45@gmail.com",
    pass: "zsokioxjouiwaaoh",
  },
});

/* 🔐 LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid email" });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* 🔑 CREATE ADMIN (run once manually) */
router.post("/create", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashed });
    await admin.save();
    res.json({ success: true, message: "Admin created ✅" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating admin" });
  }
});

/* 📧 FORGOT PASSWORD — sends real email */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.json({ success: true, message: "If email exists, reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    admin.resetToken = token;
    admin.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await admin.save();

    /* ✅ localhost:3000 before live | www.smsinfra.com after live */
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/reset/${token}`;

    await transporter.sendMail({
      from: '"SMS Infra Admin" <smsinfra45@gmail.com>',
      to: "smsinfra45@gmail.com",
      subject: "🔐 SMS Infra — Password Reset Link",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;background:#f9f9f9;border-radius:10px;">
          <h2 style="color:#f59e0b;text-align:center;">SMS Infra Admin</h2>
          <h3 style="text-align:center;color:#333;">Password Reset Request</h3>
          <p style="color:#555;">Click the button below to reset your admin password. This link expires in 15 minutes.</p>
          <p style="text-align:center;margin:30px 0;">
            <a href="${resetLink}" style="background:#f59e0b;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
              Reset Password
            </a>
          </p>
          <p style="color:#888;font-size:13px;">If you did not request this, ignore this email.</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;"/>
          <p style="color:#aaa;font-size:12px;text-align:center;">SMS Infra — Chandapura, Bangalore</p>
        </div>
      `,
    });

    console.log("✅ Reset email sent to smsinfra45@gmail.com");
    res.json({ success: true, message: "Reset link sent to your email!" });
  } catch (err) {
    console.error("❌ Forgot password error:", err.message);
    res.status(500).json({ success: false, message: "Error sending reset email. Please try again." });
  }
});

/* 🔄 RESET PASSWORD */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const admin = await Admin.findOne({
      resetToken: req.params.token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!admin) return res.status(400).json({ success: false, message: "Token expired or invalid" });
    admin.password = await bcrypt.hash(password, 10);
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();
    res.json({ success: true, message: "Password updated ✅" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
});

/* 🔑 CHANGE PASSWORD */
router.post("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Old password incorrect" });
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ success: true, message: "Password updated successfully ✅" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating password" });
  }
});

/* 📧 CHANGE EMAIL */
router.post("/change-email", auth, async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findById(req.admin.id);
    admin.email = email;
    await admin.save();
    res.json({ success: true, message: "Email updated ✅" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating email" });
  }
});

export default router;