import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bookingId:      { type: String, unique: true },
  packageId:      { type: String, required: true },
  packageName:    { type: String },
  destination:    { type: String },
  destSlug:       { type: String },
  duration:       { type: String },
  totalAmount:    { type: Number },
  basePrice:      { type: Number },
  travelDate:     { type: Date, required: true },
  adults:         { type: Number, default: 1 },
  children:       { type: Number, default: 0 },
  leadName:       { type: String, required: true },
  email:          { type: String, required: true },
  phone:          { type: String, required: true },
  altPhone:       { type: String },
  address:        { type: String },
  city:           { type: String },
  state:          { type: String },
  specialRequests:{ type: String },
  paymentMethod:  { type: String, default: "COD" },
  paymentStatus:  { type: String, default: "Pending" },
  status:         { type: String, default: "Confirmed" },
  userId:         { type: String, default: null },
}, { timestamps: true });

// Auto-generate booking ID before save
BookingSchema.pre("save", async function (next) {
  if (this.bookingId) return next();
  const date   = new Date();
  const prefix = `TWO-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const count  = await mongoose.model("Booking").countDocuments();
  this.bookingId = `${prefix}-${String(count + 1).padStart(4, "0")}`;
  next();
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
