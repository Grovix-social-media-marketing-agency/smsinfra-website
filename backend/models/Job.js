import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  location:    { type: String, required: true },
  experience:  { type: String, required: true },
  salary:      { type: String, required: true },
  type:        { type: String, enum: ["Full Time", "Part Time", "Contract", "Internship"], default: "Full Time" },
  description: { type: String, required: true },
  status:      { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);