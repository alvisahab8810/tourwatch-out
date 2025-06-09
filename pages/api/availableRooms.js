// // pages/api/availableRooms.js
// // import dbConnect from '@/pages/utils/dbconnect';
// // import Booking from '@/pages/models/Booking';


// import connectDB from "../../utils/mongodb";
// import Checkin from "../../models/Checkin";

// const occupancyLimits = {
//   Single: 1,
//   Double: 2,
//   Triple: 3,
//   Fourth: 4
// };

// export default async function handler(req, res) {
//   const { occupancyType, availableRoomsList } = req.body;

//   await connectDB();

//   const allBookings = await Booking.find({ occupancyType });

//   // Count how many times each roomNumber has been booked
//   const roomUsageMap = {};

//   allBookings.forEach(({ roomNumber }) => {
//     roomUsageMap[roomNumber] = (roomUsageMap[roomNumber] || 0) + 1;
//   });

//   const filtered = availableRoomsList.filter((roomNo) => {
//     const used = roomUsageMap[roomNo] || 0;
//     return used < occupancyLimits[occupancyType];
//   });

//   res.status(200).json({ available: filtered });
// }
