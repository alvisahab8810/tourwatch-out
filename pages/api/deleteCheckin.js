import dbConnect from "../../utils/mongodb"; // Changed from connectDB to dbConnect
import Checkin from "../../models/Checkin"; // Adjust the model path as needed

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    try {
      const { id } = req.query; // Retrieve the id from the query parameters
      if (!id) return res.status(400).json({ error: "ID is required" });

      const deletedCheckin = await Checkin.findByIdAndDelete(id);
      if (!deletedCheckin) {
        return res.status(404).json({ error: "Check-in not found" });
      }

      return res.status(200).json({ message: "Check-in deleted successfully" });
    } catch (error) {
      console.error("Error deleting check-in:", error);
      return res.status(500).json({ error: "Failed to delete check-in" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
