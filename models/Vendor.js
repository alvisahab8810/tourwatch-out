import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({ src: String, alt: String }, { _id: false });

const hotelRoomSchema = new mongoose.Schema({
  roomType:      String,
  roomName:      String,   // display name e.g. "Standard Double"
  bedType:       String,   // e.g. "1 queen bed or 2 Single beds"
  roomSize:      String,   // e.g. "Normal Size Room"
  pricePerNight: Number,
  cp:            Number,
  map:           Number,
  ap:            Number,
  guests:        { type: Number, default: 2 },
  amenities:     [String],
  gallery:       [imageSchema],
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
    starRating: { type: Number },   // hotel star rating e.g. 3.5
    hotelRooms: [hotelRoomSchema],
    vehicles:   [vehicleSchema],
    activities: [activitySchema],
    status:     { type: String, default: "Active" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") delete mongoose.models["Vendor"];
export default mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
