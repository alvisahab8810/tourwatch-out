import mongoose from "mongoose";

const QuotationSchema = new mongoose.Schema({
  leadId:      { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
  quotationNo: { type: String, default: "" },
  type:      { type: String, enum: ["Domestic", "International"], default: "Domestic" },
  pkgMode:   { type: String, enum: ["Complete Package", "Individual Service"], default: "Complete Package" },
  days:      { type: String, default: "" },
  travelDate:{ type: String, default: "" },
  assignedTo:{ type: mongoose.Schema.Types.ObjectId, ref: "SalesPerson", default: null },
  // Hotel
  hotelName:  { type: String, default: "" },
  hotelCat:   { type: String, default: "Deluxe" },
  hotelNights:{ type: Number, default: 0 },
  hotelRooms: { type: Number, default: 1 },
  hotelPrice: { type: Number, default: 0 },
  // Flight
  flightFrom: { type: String, default: "" },
  flightTo:   { type: String, default: "" },
  flightDate: { type: String, default: "" },
  flightPax:  { type: Number, default: 0 },
  flightPrice:{ type: Number, default: 0 },
  // Transfer
  transferCab:   { type: String, default: "" },
  transferPerDay:{ type: Number, default: 0 },
  transferDays:  { type: Number, default: 0 },
  // Itinerary
  itinerary: [{ _id: false, title: String, description: String }],
  // Content
  inclusions: { type: String, default: "" },
  exclusions: { type: String, default: "" },
  notes:      { type: String, default: "This is an initial quote based on our most popular holiday package to your chosen destination." },
  // Company (internal)
  cost:       { type: Number, default: 0 },
  margin:     { type: Number, default: 0 },
  gstPct:     { type: Number, default: 5 },
  tcsPct:     { type: Number, default: 0 },
  tripExpense:{ type: Number, default: 0 },
  // Workflow
  status:     { type: String, enum: ["Open", "Won", "Lost"], default: "Open" },
  lostReason: { type: String, default: "" },
  versions:  [{ _id: false, v: Number, date: String, cost: Number, margin: Number, note: String }],
  followups: [{ _id: false, date: String, note: String }],
  reminders: [{ _id: false, date: String, type: String, note: String }],
}, { timestamps: true });

export default mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema);
