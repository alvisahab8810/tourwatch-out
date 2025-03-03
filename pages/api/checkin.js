// File: /pages/api/checkin.js

import connectDB from "../../utils/mongodb";
import Checkin from "../../models/Checkin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Connect to the database
      await connectDB();

      // Create a new check-in record with the submitted data
      const newCheckin = new Checkin(req.body);
      await newCheckin.save();

      res.status(201).json({ success: true, data: newCheckin });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      // Connect to the database
      await connectDB();

      // Fetch all check-in records
      const checkins = await Checkin.find();
      res.status(200).json({ success: true, data: checkins });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
