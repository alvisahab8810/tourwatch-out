// import connectDB from "../../utils/mongodb";
// import Checkin from "../../models/Checkin";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     await connectDB();
//     try {
//       const checkinData = new Checkin(req.body);
//       await checkinData.save();
//       res.status(201).json({ message: "Check-in successful!" });
//     } catch (error) {
//       res.status(500).json({ error: "Database error", details: error.message });
//     }
//   } else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// }



import connectDB from "../../utils/mongodb";
import Checkin from "../../models/Checkin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  await connectDB();

  const { companyName, fullName, whatsappContact, emailAddress, selectedOccupancy, selectedRoom, governmentId } = req.body;

  try {
    const existingEntry = await Checkin.findOne({ whatsappContact });

    if (existingEntry) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }

    const newCheckin = new Checkin({ companyName, fullName, whatsappContact, emailAddress, selectedOccupancy, selectedRoom, governmentId });
    await newCheckin.save();

    return res.status(201).json({ message: "Check-in successful!" });
  } catch (error) {
    return res.status(500).json({ error: "Error saving check-in data" });
  }
}
