import mongoose from "mongoose";

const SalesPersonSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    username:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    salt:         { type: String, required: true },
    sessionToken: { type: String, default: null },
    permissions: {
      leads:        { type: Boolean, default: true },
      followUp:     { type: Boolean, default: false },
      reminders:    { type: Boolean, default: false },
      destinations: { type: Boolean, default: false },
      packages:     { type: Boolean, default: false },
      blogs:        { type: Boolean, default: false },
      comments:     { type: Boolean, default: false },
      reviews:      { type: Boolean, default: false },
      faqs:         { type: Boolean, default: false },
      users:        { type: Boolean, default: false },
      vendors:      { type: Boolean, default: false },
      voucher:      { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.SalesPerson || mongoose.model("SalesPerson", SalesPersonSchema);
