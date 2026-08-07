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
    _id:     false,
    name:    { type: String, default: "" },
    roomCat: { type: String, default: "Deluxe" },
    // legacy flat fields kept for backward-compat reads
    occupancy: { type: String, default: "" },
    nights:    { type: Number, default: 0 },
    rooms:     { type: Number, default: 1 },
    price:     { type: Number, default: 0 },
    // new: multiple rate types per hotel
    rates: [{
      _id:       false,
      occupancy: { type: String, default: "Double" },
      roomCat:   { type: String, default: "Deluxe" },
      nights:    { type: Number, default: 0 },
      rooms:     { type: Number, default: 1 },
      price:     { type: Number, default: 0 },
    }],
  }],

  // Flights (array — outbound + return + any extra legs / connecting segments)
  flights: [{
    _id: false,
    from:        { type: String,  default: "" },
    to:          { type: String,  default: "" },
    date:        { type: String,  default: "" },
    pax:         { type: Number,  default: 0 },
    price:       { type: Number,  default: 0 },
    roundTrip:   { type: Boolean, default: false },
    returnPrice: { type: Number,  default: 0 },
    pnr:         { type: String,  default: "" },
    flightNo:    { type: String,  default: "" },
    depCity:     { type: String,  default: "" },
    depIATA:     { type: String,  default: "" },
    depDate:     { type: String,  default: "" },
    depTime:     { type: String,  default: "" },
    arrCity:     { type: String,  default: "" },
    arrIATA:     { type: String,  default: "" },
    arrDate:     { type: String,  default: "" },
    arrTime:     { type: String,  default: "" },
    // Return leg full details (round trip)
    retFlightNo: { type: String,  default: "" },
    retPnr:      { type: String,  default: "" },
    retDepCity:  { type: String,  default: "" },
    retDepIATA:  { type: String,  default: "" },
    retDepDate:  { type: String,  default: "" },
    retDepTime:  { type: String,  default: "" },
    retArrCity:  { type: String,  default: "" },
    retArrIATA:  { type: String,  default: "" },
    retArrDate:  { type: String,  default: "" },
    retArrTime:  { type: String,  default: "" },
    // Layover after outbound (one-way: between this card and next; round-trip: between onward and return legs)
    hasLayover:      { type: Boolean, default: false },
    layoverCity:     { type: String,  default: "" },
    layoverDuration: { type: String,  default: "" },
    // Layover after return leg (round-trip only)
    hasReturnLayover:      { type: Boolean, default: false },
    returnLayoverCity:     { type: String,  default: "" },
    returnLayoverDuration: { type: String,  default: "" },
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
    activities:  [{
      _id:  false,
      type: { type: String, default: "transfer" },
      text: { type: String, default: "" },
    }],
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
  ppSubEnabled:      { type: Boolean, default: false },
  ppSubTotalEnabled: { type: Boolean, default: false },
  ppSellEnabled:     { type: Boolean, default: false },
  canxBar:           { type: mongoose.Schema.Types.Mixed, default: {} },

  // Package tiers (Economy / Deluxe / Premium — each has its own hotels/flights/transfers/miscs)
  pkgTiers: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Quotation type
  quoteType:  { type: String, enum: ["standard", "b2b", "package"], default: "standard" },
  highlights: [{ _id: false, key: { type: String }, label: { type: String } }],

  // Workflow
  status:     { type: String, enum: ["Open", "Won", "Lost"], default: "Open" },
  lostReason: { type: String, default: "" },
  versions:   [{ _id: false, v: Number, date: String, cost: Number, margin: Number, note: String }],
  followups:  [{ _id: false, date: String, note: String }],
  reminders:  [{ _id: false, date: String, type: { type: String, default: "" }, note: String }],
}, { timestamps: true });

delete mongoose.models.Quotation;
export default mongoose.model("Quotation", QuotationSchema);
