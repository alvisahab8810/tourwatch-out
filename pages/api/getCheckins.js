import dbConnect from "../../utils/mongodb"; // Import DB connection
import Checkin from "../../models/Checkin"; // Import Checkin Model

export default async function handler(req, res) {
  await dbConnect(); // Connect to MongoDB

  if (req.method === "GET") {
    try {
      const checkins = await Checkin.find({}).sort({ createdAt: -1 }); // Get all check-ins
      res.status(200).json(checkins);
    } catch (error) {
      res.status(500).json({ error: "Error fetching check-in data" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
