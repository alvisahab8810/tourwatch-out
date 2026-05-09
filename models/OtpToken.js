import mongoose from "mongoose";

const OtpTokenSchema = new mongoose.Schema({
  email:        { type: String, required: true, lowercase: true },
  name:         { type: String, required: true },
  passwordHash: { type: String, required: true },
  salt:         { type: String, required: true },
  otp:          { type: String, required: true },
  expiresAt:    { type: Date, required: true, index: { expires: 0 } },
});

OtpTokenSchema.index({ email: 1 });

export default mongoose.models.OtpToken || mongoose.model("OtpToken", OtpTokenSchema);
