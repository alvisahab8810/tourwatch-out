import mongoose from "mongoose";

const RoomCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

delete mongoose.models.RoomCategory;
export default mongoose.model("RoomCategory", RoomCategorySchema);
