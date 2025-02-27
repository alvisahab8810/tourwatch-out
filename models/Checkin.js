// import mongoose from "mongoose";

// const CheckinSchema = new mongoose.Schema({
//   companyName: String,
//   fullName: String,
//   whatsappContact: String,
//   emailAddress: String,
//   selectedOccupancy: String,
//   selectedRoom: String,
//   governmentId: String,
//   timestamp: String,
// });

// export default mongoose.models.Checkin || mongoose.model("Checkin", CheckinSchema);



import mongoose from "mongoose";

const CheckinSchema = new mongoose.Schema({
  companyName: String,
  fullName: String,
  whatsappContact: { type: String, required: true, unique: true }, // Ensure unique mobile number
  emailAddress: String,
  selectedOccupancy: String,
  selectedRoom: String,
  governmentId: String,
  timestamp: { type: Date, default: Date.now }, // Store actual date
});

export default mongoose.models.Checkin || mongoose.model("Checkin", CheckinSchema);
