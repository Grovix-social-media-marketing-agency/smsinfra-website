import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  // ✅ EXISTING FIELDS — UNCHANGED
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["residential", "commercial", "construction", "machinery", "materials",
           // ⭐ ADDED — new categories for admin panel
           "Residential", "Commercial", "Infrastructure", "Industrial", "Institutional"],
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // ⭐ NEW FIELDS ADDED — all optional so existing documents are unaffected
  description: { type: String, default: "" },
  location:    { type: String, default: "" },
  status:      { type: String, enum: ["completed", "ongoing", "upcoming"], default: "completed" },
  featured:    { type: Boolean, default: false },
  year:        { type: String, default: "" },

  // ⭐ Multiple images support (new admin panel uploads via Cloudinary)
  // The original single `image` field is kept for backward compat
  images: [
    {
      url:      { type: String },
      publicId: { type: String },
      caption:  { type: String, default: "" },
    }
  ],
});

export default mongoose.model("Project", projectSchema);