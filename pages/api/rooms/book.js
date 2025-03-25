import dbConnect from "@/utils/dbconnect";
import Room from "@/models/Room";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { roomNumber } = req.body;

    try {
      const room = await Room.findOneAndUpdate(
        { roomNumber },
        { isBooked: true },
        { new: true }
      );

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.status(200).json({ message: "Room booked successfully", room });
    } catch (error) {
      res.status(500).json({ message: "Error booking room", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
