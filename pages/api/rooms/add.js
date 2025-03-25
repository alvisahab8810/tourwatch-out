import dbConnect from "@/utils/dbconnect";
import Room from "@/models/Room";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { roomNumber, occupancy } = req.body;

    try {
      const newRoom = new Room({ roomNumber, occupancy });
      await newRoom.save();
      res.status(201).json({ message: "Room added successfully", room: newRoom });
    } catch (error) {
      res.status(500).json({ message: "Error adding room", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
