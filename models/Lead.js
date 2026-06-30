import mongoose from "mongoose";

const BRRSchema = new mongoose.Schema({
  adults:        { type: Number },
  children:      { type: Number },
  childAge1:     { type: String },
  childAge2:     { type: String },
  duration:      { type: String },
  tripDate:      { type: String },
  mealPlan:      { type: String },
  flight:        { type: Boolean },
  train:         { type: Boolean },
  transfers:     { type: Boolean },
  sightseeing:   { type: Boolean },
  hotelCategory: { type: String },
  budgetRange:   { type: String },
  collectedOn:   { type: String },
  notes:         { type: String, default: "" },
}, { _id: false });

const ScoreSchema = new mongoose.Schema({
  val: { type: Number },
  ans: { type: [Number] },
}, { _id: false });

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
    budgetBracket: { type: String, default: "" },
    assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "SalesPerson", default: null },
    contacted:   { type: Boolean, default: false },
    contactedAt: { type: Date, default: null },
    verificationStatus: {
      type: String,
      enum: ["New", "Verified", "Not Verified"],
      default: "New",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow Up", "Not Interested", "No Answer", "Qualified", "Not Qualified"],
      default: "New",
    },
    isManual:   { type: Boolean, default: false },
    // UTM / ad tracking
    source:     { type: String, default: "" },
    medium:     { type: String, default: "" },
    campaign:   { type: String, default: "" },
    adset:      { type: String, default: "" },
    adContent:  { type: String, default: "" },
    campaignId: { type: String, default: "" },
    // Meta CAPI matching fields (captured at enquiry time)
    fbc:       { type: String, default: "" },
    fbp:       { type: String, default: "" },
    clientIp:  { type: String, default: "" },
    userAgent: { type: String, default: "" },
    // CRM fields
    connects: { type: Number, default: 0 },
    score:    { type: ScoreSchema, default: null },
    brr:      { type: BRRSchema,   default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
