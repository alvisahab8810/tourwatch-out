import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({ src: String, alt: String }, { _id: false });

const hotelRoomSchema = new mongoose.Schema({
  roomType:      String,
  pricePerNight: Number,
  cp:            Number,
  map:           Number,
  ap:            Number,
  guests:        { type: Number, default: 2 },
  amenities:     [String],
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
    hotelRooms: [hotelRoomSchema],
    vehicles:   [vehicleSchema],
    activities: [activitySchema],
    status:     { type: String, default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
