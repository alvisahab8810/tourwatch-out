import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    packageId:       { type: String, required: true, index: true },
    packageName:     { type: String, default: "" },
    destinationSlug: { type: String, default: "" },
    userId:          { type: String, required: true },
    userName:        { type: String, required: true },
    userEmail:       { type: String, required: true },
    userImage:       { type: String, default: "" },
    rating:          { type: Number, required: true, min: 1, max: 5 },
    title:           { type: String, default: "" },
    text:            { type: String, required: true },
    status:          { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminNote:       { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
