
import connectDB from "../../../utils/mongodb";
import FamilyCheckin from "../../../models/FamilyCheckin";

export default async function handler(req, res) {
    await connectDB();
  
    if (req.method === "DELETE") {
      try {
        const { id } = req.query;
        await FamilyCheckin.findByIdAndDelete(id);
        return res.status(200).json({ message: "Family check-in deleted successfully" });
      } catch (error) {
        return res.status(500).json({ error: "Failed to delete family check-in" });
      }
    }
  
    return res.status(405).json({ error: "Method Not Allowed" });
  }