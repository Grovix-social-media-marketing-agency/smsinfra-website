import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// 🔥 EXISTING ROUTES
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// 🔥 EXISTING HERO ROUTE
import heroRoutes from "./routes/heroRoutes.js";
// 🔥 NEW: CMS ROUTE (ADDED)
import cmsRoutes from "./routes/cmsRoutes.js";
// 🔥 NEW: ANNOUNCEMENT ROUTE (ADDED)
import announcementRoutes from "./routes/announcementRoutes.js";
// ⭐ CONTACT/QUOTATION ROUTE (ADDED)
import contactRoutes from "./routes/contactRoutes.js";
// ⭐ CAREERS ROUTE (ADDED)
import careersRoutes from "./routes/careersRoutes.js";
// ⭐ SERVICE PAGES ROUTE (ADDED)
import servicePageRoutes from "./routes/servicePageRoutes.js";
// ⭐ SERVICE HUB ROUTE (ADDED)
import serviceHubRoutes from "./routes/serviceHubRoutes.js";
// ⭐ ADMIN SERVICE PAGES CMS ROUTE (ADDED)
import servicePagesRoutes from "./routes/servicePagesRoutes.js";
// 🔔 LEADS ROUTE (ADDED)
import leadsRoutes from "./routes/Leadsroutes.js";
const app = express();
// 🔥 Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 🔥 Test route
app.get("/", (req, res) => {
  res.send("SMS INFRA Backend Running 🚀");
});
// ⭐ PING ROUTE — keeps backend awake on Render
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is awake!" });
});
// 🔥 EXISTING ROUTES (UNCHANGED)
app.use("/api/projects",      projectRoutes);
app.use("/api/admin",         adminRoutes);
// 🔥 EXISTING HERO ROUTE (UNCHANGED)
app.use("/api/hero",          heroRoutes);
// 🔥 CMS ROUTE — serves /api/cms, /api/cms/overview, /api/cms/logos, etc.
app.use("/api/cms",           cmsRoutes);
// 🔥 ANNOUNCEMENT ROUTE
app.use("/api/announcements", announcementRoutes);
// ⭐ CONTACT/QUOTATION ROUTE
app.use("/api/contact",       contactRoutes);
// ⭐ CAREERS ROUTE
app.use("/api/careers",       careersRoutes);
// ⭐ SERVICE PAGES ROUTE — serves /api/servicepages/:slug
app.use("/api/servicepages",  servicePageRoutes);
// ⭐ SERVICE HUB ROUTE (ADDED) — serves /api/servicehub
app.use("/api/servicehub",    serviceHubRoutes);
// ⭐ ADMIN SERVICE PAGES CMS — handles GET|PATCH /:slug and POST /:slug/upload-image
app.use("/api/servicepages",  servicePagesRoutes);
// 🔔 LEADS ROUTE — serves /api/leads
app.use("/api/leads",         leadsRoutes);
// 🔥 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("Mongo Error:", err));
// 🔥 Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});