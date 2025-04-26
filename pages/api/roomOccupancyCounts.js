import connectDB from "../../utils/mongodb";
import Checkin from "../../models/Checkin";

export default async function handler(req, res) {
  const { company, occupancy } = req.query;
  await connectDB();

  if (!company || !occupancy) {
    return res.status(400).json({ error: "Missing company or occupancy type" });
  }

  try {
    const checkIns = await Checkin.find({ companyName: company, selectedOccupancy: occupancy });

    const roomCounts = {};
    checkIns.forEach((entry) => {
      const room = entry.selectedRoom;
      roomCounts[room] = (roomCounts[room] || 0) + 1;
    });

    res.status(200).json(roomCounts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching room occupancy" });
  }
}
