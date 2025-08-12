import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      default: "",
      trim: true,
    },
    formType: {
      type: String,
      default: "Contact Form",
      enum: ["Contact Form"],
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
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
