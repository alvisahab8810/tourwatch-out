import mongoose from "mongoose";

const PackageImageSchema = new mongoose.Schema(
  {
    _id:         { type: String },
    data:        { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  { timestamps: false }
);

export default mongoose.models.PackageImage ||
  mongoose.model("PackageImage", PackageImageSchema);
