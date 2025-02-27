import connectDB from "../../utils/mongodb";
import Checkin from "../../models/Checkin";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  
    await connectDB();
  
    const { whatsappContact } = req.body;
  
    try {
      const existingEntry = await Checkin.findOne({ whatsappContact });
      if (existingEntry) {
        return res.status(200).json({ exists: true });
      }
      return res.status(200).json({ exists: false });
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  }
  
