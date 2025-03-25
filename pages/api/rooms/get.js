import dbConnect from "@/utils/dbconnect";
import Room from "@/models/Room";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { occupancy } = req.query;

    try {
      const availableRooms = await Room.find({ occupancy, isBooked: false });
      res.status(200).json(availableRooms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rooms", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
