import mongoose from "mongoose";

const OccupancySchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

export default mongoose.models.Occupancy || mongoose.model("Occupancy", OccupancySchema);
