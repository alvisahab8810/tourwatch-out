import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({ src: String, alt: String }, { _id: false });

/* ── Season pricing (per room, per night, double occ.) ── */
const seasonSchema = new mongoose.Schema({
  label:  { type: String, default: "" },  // e.g. "Nov 2026 – Mar 2027"
  cpai:   { type: Number, default: 0 },   // CPAI — Room + Breakfast
  mapai:  { type: Number, default: 0 },   // MAPAI — Breakfast & Dinner
  apai:   { type: Number, default: 0 },   // APAI — All Meals
}, { _id: false });

const hotelRoomSchema = new mongoose.Schema({
  roomType:        String,
  roomName:        String,   // display name e.g. "Regal Classic Room"
  bedType:         String,   // e.g. "1 Queen Bed"
  roomSize:        String,   // e.g. "350 sq.ft"
  totalRooms:      { type: Number, default: 0 },
  // Extra person / child rates (flat per room, apply across all seasons)
  extraPerson:     { type: Number, default: 0 },
  childWithBed:    { type: Number, default: 0 },
  childWithoutBed: { type: Number, default: 0 },
  amenities:       [String],
  gallery:         [imageSchema],
  seasons:         [seasonSchema],  // Season-wise pricing
  // Legacy flat fields kept for backward-compat reads
  pricePerNight: Number,
  cp:            Number,
  map:           Number,
  ap:            Number,
  epai:          Number,
  guests:        { type: Number, default: 2 },
}, { _id: false });

const vehicleSchema = new mongoose.Schema({
  vehicleImage: imageSchema,
  vehicleType:  String,
  pricePerDay:  Number,
  passengers:   Number,
  inclusions:   [String],
}, { _id: false });

const activitySchema = new mongoose.Schema({
  activityImage:  imageSchema,
  activityName:   String,
  pricePerPerson: Number,
  duration:       String,
  description:    String,
}, { _id: false });

const VendorSchema = new mongoose.Schema(
  {
    _id:            { type: String },
    vendorTab:      { type: String, default: "Stay" }, // Stay | Transfers | Activities
    businessName:   { type: String },
    typeOfBusiness: { type: String },
    place:          { type: String },
    image:          imageSchema,
    gallery:        [imageSchema],
    contactPerson: {
      position:      { type: String, default: "Mr" },
      firstName:     String,
      lastName:      String,
      email:         String,
      countryCode:   { type: String, default: "+91" },
      contactNumber: String,
    },
    starRating: { type: Number },
    hotelRooms: [hotelRoomSchema],
    vehicles:   [vehicleSchema],
    activities: [activitySchema],
    status:     { type: String, default: "Active" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") delete mongoose.models["Vendor"];
export default mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
