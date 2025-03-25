import connectDB from "../../utils/mongodb";
import Checkin from "../../models/Checkin";

export default async function handler(req, res) {
  await dbConnect();

  const { company } = req.query;
  if (!company) return res.status(400).json({ error: "Company name is required" });

  try {
    const checkins = await Checkin.find({ companyName: company });

    const occupiedRooms = {
      Single: [],
      Double: [],
      Triple: [],
      Fourth: [], // Added Fourth Occupancy
    };

    checkins.forEach((entry) => {
      occupiedRooms[entry.occupancyType]?.push(entry.selectedRoom);
    });

    res.status(200).json(occupiedRooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch occupancy data" });
  }
}
