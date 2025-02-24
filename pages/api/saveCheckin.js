import connectDB from "../../utils/mongodb";
import Checkin from "../../models/Checkin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectDB();
    try {
      const checkinData = new Checkin(req.body);
      await checkinData.save();
      res.status(201).json({ message: "Check-in successful!" });
    } catch (error) {
      res.status(500).json({ error: "Database error", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
