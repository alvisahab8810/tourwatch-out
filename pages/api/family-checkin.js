// File: /pages/api/family-checkin.js
import connectDB from "../../utils/mongodb";
import FamilyCheckin from "../../models/FamilyCheckin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectDB();
      const newCheckin = new FamilyCheckin(req.body);
      await newCheckin.save();
      res.status(201).json({ success: true, data: newCheckin });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      await connectDB();
      const checkins = await FamilyCheckin.find();
      res.status(200).json({ success: true, data: checkins });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
