// models/RoomLinks.js
import mongoose from 'mongoose';

const RoomLinksSchema = new mongoose.Schema({
  companyName: String,
  rooms: Object, // e.g., { single: ['101'], double: ['201'], triple: ['301'] }
  shortId: { type: String, unique: true },
});

export default mongoose.models.RoomLinks || mongoose.model('RoomLinks', RoomLinksSchema);
