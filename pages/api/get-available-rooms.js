// pages/api/get-available-rooms.js
import dbConnect from "@/utils/dbconnect";
import AdminCheckinModel from "@/models/AdminCheckinModel";
import CheckinModel from "@/models/CheckinModel";

const OCCUPANCY_LIMIT = {
  Single: 1,
  Double: 2,
  Triple: 3,
  Fourth: 4,
};

export default async function handler(req, res) {
  await dbConnect();

  const { sharedId, occupancy } = req.query;

  if (!sharedId || !occupancy) {
    return res.status(400).json({ message: "Missing params" });
  }

  try {
    const adminRecord = await AdminCheckinModel.findOne({ _id: sharedId });

    if (!adminRecord) {
      return res.status(404).json({ message: "Invalid sharedId" });
    }

    const roomsForOccupancy = adminRecord.occupancyTypeToRooms[occupancy] || [];

    const checkins = await CheckinModel.find({
      sharedId,
      occupancy,
      roomNo: { $in: roomsForOccupancy },
    });

    // Count how many users are in each room
    const roomCounts = {};
    checkins.forEach((checkin) => {
      roomCounts[checkin.roomNo] = (roomCounts[checkin.roomNo] || 0) + 1;
    });

    const availableRooms = roomsForOccupancy.filter(
      (room) => (roomCounts[room] || 0) < OCCUPANCY_LIMIT[occupancy]
    );

    return res.status(200).json({ availableRooms });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
