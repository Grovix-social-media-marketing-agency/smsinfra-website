import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema({
  fullName:        { type: String, required: true },
  companyName:     { type: String, default: "" },
  phone:           { type: String, required: true },
  email:           { type: String, required: true },
  service:         { type: String, required: true },
  projectLocation: { type: String, required: true },
  message:         { type: String, required: true },

  // ⭐ Dynamic fields (grade, volume, blockSize, etc.) stored as flexible object
  dynamicFields:   { type: mongoose.Schema.Types.Mixed, default: {} },

  // ⭐ Status tracking
  status:          { type: String, enum: ["new", "contacted", "converted", "closed"], default: "new" },
}, { timestamps: true });

export default mongoose.model("Quotation", quotationSchema);