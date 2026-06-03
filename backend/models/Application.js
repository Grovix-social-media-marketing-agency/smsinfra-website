import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  fullName:       { type: String, required: true },
  phone:          { type: String, required: true },
  email:          { type: String, required: true },
  position:       { type: String, required: true },
  experience:     { type: String, required: true },
  location:       { type: String, required: true },
  expectedSalary: { type: String, default: "" },
  joiningDate:    { type: String, default: "" },
  message:        { type: String, default: "" },
  resumeUrl:      { type: String, default: "" },   // Cloudinary URL
  resumePublicId: { type: String, default: "" },
  status:         { type: String, enum: ["new", "reviewed", "shortlisted", "rejected"], default: "new" },
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);