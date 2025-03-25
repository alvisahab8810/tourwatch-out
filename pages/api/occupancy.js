import connectDB from "../../utils/mongodb";
import Occupancy from "../../models/Occupancy";

export default async function handler(req, res) {
  await connectDB(); // Use correct function name

  if (req.method === "POST") {
    const { occupancyType } = req.body;
    
    // Find and update occupancy count
    const updatedOccupancy = await Occupancy.findOneAndUpdate(
      { type: occupancyType },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedOccupancy);
  } else if (req.method === "GET") {
    const occupancyData = await Occupancy.find({});
    res.status(200).json(occupancyData);
  } else {
    res.status(405).end();
  }
}
