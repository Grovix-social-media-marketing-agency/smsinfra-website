import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema({
  url:      { type: String, required: true },
  publicId: { type: String, required: true }, // Cloudinary public_id for deletion/replacement
});

const heroSchema = new mongoose.Schema(
  {
    desktopImage: { type: mediaAssetSchema, required: false }, // ✅ changed to false
    mobileImage:  { type: mediaAssetSchema, required: false }, // ✅ changed to false
    video:        { type: mediaAssetSchema, required: false }, // ✅ changed to false
    tagline:      { type: String, default: "Turning Dreams Into Reality" },           // ✅ added
    ticker:       { type: String, default: "Earthmovers,Ready Mix Concrete,Solid Blocks,Aggregates,M Sand & P Sand,Infrastructure Projects" }, // ✅ added
  },
  { timestamps: true }
);

export default mongoose.model("Hero", heroSchema);