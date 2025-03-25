

import connectDB from "../../../utils/mongodb";
import Checkin from "../../../models/Checkin";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await Checkin.findByIdAndDelete(id);
      return res.status(200).json({ message: "Check-in deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete check-in" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
