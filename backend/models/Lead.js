import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    type:        { type: String, enum: ["notify", "consultation"], required: true },
    name:        { type: String, default: "" },
    email:       { type: String, required: true },
    phone:       { type: String, default: "" },
    projectType: { type: String, default: "" },
    message:     { type: String, default: "" },
    source:      { type: String, default: "builders-page" },
    read:        { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);