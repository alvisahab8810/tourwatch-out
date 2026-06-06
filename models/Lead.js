import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true },
    destination: { type: String, default: "", trim: true },
    travelDate:  { type: String, default: "" },
    pax:         { type: String, default: "" },
    message:     { type: String, default: "" },
    formType:    { type: String, default: "Popup Form" },
    // UTM / ad tracking
    source:      { type: String, default: "" },
    medium:      { type: String, default: "" },
    campaign:    { type: String, default: "" },
    adset:       { type: String, default: "" },
    adContent:   { type: String, default: "" },
    campaignId:  { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
