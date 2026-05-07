import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer:   { type: String, required: true },
    status:   { type: String, default: "draft", enum: ["published", "draft"] },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

FaqSchema.index({ status: 1, order: 1 });

export default mongoose.models.Faq || mongoose.model("Faq", FaqSchema);
