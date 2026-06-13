import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  quotationId:  { type: mongoose.Schema.Types.ObjectId, ref: "Quotation", default: null },
  leadId:       { type: mongoose.Schema.Types.ObjectId, ref: "Lead",      default: null },
  salespersonId:{ type: mongoose.Schema.Types.ObjectId, ref: "SalesPerson", default: null },
  dueDate:      { type: String, default: "" },
  type:         { type: String, enum: ["Follow-up Call", "Send Package", "Document Reminder", "Payment Reminder", "Other"], default: "Follow-up Call" },
  note:         { type: String, default: "" },
  status:       { type: String, enum: ["Upcoming", "Done"], default: "Upcoming" },
}, { timestamps: true });

delete mongoose.models.Reminder;
export default mongoose.model("Reminder", ReminderSchema);
