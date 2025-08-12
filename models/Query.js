import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // fullName
    email: { type: String, required: true }, // emailAddress
    phone: { type: String, required: true }, // phoneNumber
    businessName: { type: String, default: "" }, // Not used for Helping Form but kept for compatibility

    formType: {
      type: String,
      default: "Query Form", // will be "Helping Form" if passed
    },

    salespersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    customFields: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.Query || mongoose.model("Query", querySchema);
