import mongoose from "mongoose";

const QuotationSchema = new mongoose.Schema({
  leadId:      { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
  quotationNo: { type: String, default: "" },
  type:        { type: String, enum: ["Domestic", "International"], default: "Domestic" },
  pkgMode:     { type: String, enum: ["Complete Package", "Individual Service"], default: "Complete Package" },
  days:        { type: String, default: "" },
  travelDate:  { type: String, default: "" },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "SalesPerson", default: null },

  // Hotels (array — supports multiple properties)
  hotels: [{
    _id: false,
    name:    { type: String, default: "" },
    roomCat: { type: String, default: "Deluxe" },
    nights:  { type: Number, default: 0 },
    rooms:   { type: Number, default: 1 },
    price:   { type: Number, default: 0 },
  }],

  // Flights (array — outbound + return + any extra legs)
  flights: [{
    _id: false,
    from:        { type: String,  default: "" },
    to:          { type: String,  default: "" },
    date:        { type: String,  default: "" },
    pax:         { type: Number,  default: 0 },
    price:       { type: Number,  default: 0 },
    roundTrip:   { type: Boolean, default: false },
    returnPrice: { type: Number,  default: 0 },
  }],

  // Transfers (array — multiple cab arrangements)
  transfers: [{
    _id: false,
    cab:    { type: String, default: "" },
    perDay: { type: Number, default: 0 },
    days:   { type: Number, default: 0 },
  }],

  // Itinerary
  itinerary: [{
    _id: false,
    date:        { type: String, default: "" },
    title:       { type: String, default: "" },
    tour:        { type: String, default: "" },
    transfer:    { type: String, default: "" },
    pickup_time: { type: String, default: "" },
    itinerary:   { type: String, default: "" },  // rich-text HTML (new field name)
    description: { type: String, default: "" },  // legacy plain-text fallback
  }],

  // Miscellaneous items
  miscs: [{
    _id: false,
    name:   { type: String, default: "" },
    amount: { type: Number, default: 0 },
  }],

  // Content
  inclusions: { type: String, default: "" },
  exclusions: { type: String, default: "" },
  notes:      { type: String, default: "This is an initial quote based on our most popular holiday package to your chosen destination." },

  // Policies (prefilled defaults, editable per quotation)
  termsConditions:   { type: String, default: "" },
  bookingPolicy:     { type: String, default: "" },
  cancellationPolicy: { type: String, default: "" },

  // Company (internal)
  cost:            { type: Number, default: 0 },
  margin:          { type: Number, default: 0 },
  gstPct:          { type: Number, default: 5 },
  tcsPct:          { type: Number, default: 0 },
  tripExpense:     { type: Number, default: 0 },
  newSellingPrice: { type: Number, default: 0 },

  // Workflow
  status:     { type: String, enum: ["Open", "Won", "Lost"], default: "Open" },
  lostReason: { type: String, default: "" },
  versions:   [{ _id: false, v: Number, date: String, cost: Number, margin: Number, note: String }],
  followups:  [{ _id: false, date: String, note: String }],
  reminders:  [{ _id: false, date: String, type: { type: String, default: "" }, note: String }],
}, { timestamps: true });

delete mongoose.models.Quotation;
export default mongoose.model("Quotation", QuotationSchema);
