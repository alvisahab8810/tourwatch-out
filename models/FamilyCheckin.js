// File: /models/FamilyCheckin.js
import mongoose from "mongoose";

// Schema for each person (traveller)
const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Here you might store a filename or URL for the uploaded government ID
  governmentId: { type: String }
});

// Schema for each child
const KidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true }
});

// Main Family Check-in Schema
// const FamilyCheckinSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     contact: { type: String, required: true },
//     email: { type: String, required: true },
//     // Array of traveller details
//     persons: [PersonSchema],
//     // Array of kid details
//     kids: [KidSchema]
//   },
//   { timestamps: true }
// );



const FamilyCheckinSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    totalPersons: { type: Number, required: true },
    totalKids: { type: Number, required: true },
    persons: [PersonSchema],
    kids: [KidSchema],
  },
  { timestamps: true }
);

// Export the model if it doesn't exist, or use the existing one.
export default mongoose.models.FamilyCheckin ||
  mongoose.model("FamilyCheckin", FamilyCheckinSchema);
