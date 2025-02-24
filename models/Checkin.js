import mongoose from "mongoose";

const CheckinSchema = new mongoose.Schema({
  companyName: String,
  fullName: String,
  whatsappContact: String,
  emailAddress: String,
  selectedOccupancy: String,
  selectedRoom: String,
  governmentId: String,
  timestamp: String,
});

export default mongoose.models.Checkin || mongoose.model("Checkin", CheckinSchema);
