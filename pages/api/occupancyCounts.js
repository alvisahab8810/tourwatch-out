import connectDB from "../../utils/mongodb";
import Checkin from "../../models/Checkin";


export default async function handler(req, res) {
  await connectDB();

  const { company } = req.query;
  if (!company) return res.status(400).json({ error: "Company name is required" });

  try {
    // Count active (non-deleted) check-ins for each occupancy type.
    // Adjust the query if you use a soft delete flag, e.g. { isDeleted: { $ne: true } }
    const occupancyTypes = ["Single", "Double", "Triple", "Fourth"];
    const counts = await Promise.all(
      occupancyTypes.map(async (type) => {
        const count = await Checkin.countDocuments({
          companyName: company,
          selectedOccupancy: type,
          // If using soft delete, add: isDeleted: { $ne: true }
        });
        return { type, count };
      })
    );
    const occupancyCounts = counts.reduce((acc, { type, count }) => {
      acc[type] = count;
      return acc;
    }, { Single: 0, Double: 0, Triple: 0, Fourth: 0 });
    res.status(200).json(occupancyCounts);
  } catch (error) {
    console.error("Error fetching occupancy counts:", error);
    res.status(500).json({ error: "Failed to get occupancy counts" });
  }
}
