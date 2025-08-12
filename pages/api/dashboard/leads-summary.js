

// import dbConnect from "../../../utils/mongodb";
// import Query from "../../../models/Query";
// import Contact from "../../../models/Contact";
// import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   if (req.method === "OPTIONS") return res.status(200).end();
//   if (req.method !== "GET")
//     return res.status(405).json({ success: false, message: "Method Not Allowed" });

//   try {
//     await dbConnect();
//     const now = new Date();

//     const months = Array.from({ length: 6 }).map((_, i) => {
//       const date = subMonths(now, i);
//       return {
//         label: format(date, "MMM yy"),
//         start: startOfMonth(date),
//         end: endOfMonth(date),
//       };
//     }).reverse();

//     const data = [];

//     for (const m of months) {
//       const queryCount = await Query.countDocuments({
//         createdAt: { $gte: m.start, $lte: m.end },
//         formType: { $regex: /helping form/i },
//       });

//       const contactCount = await Contact.countDocuments({
//         createdAt: { $gte: m.start, $lte: m.end },
//         formType: { $regex: /contact form/i },
//       });

//       data.push({
//         month: m.label,
//         Leads: queryCount + contactCount,
//       });
//     }

//     return res.status(200).json({ success: true, data });
//   } catch (err) {
//     console.error("Monthly lead summary error:", err);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// }
