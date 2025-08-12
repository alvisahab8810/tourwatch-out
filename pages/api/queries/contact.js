// import { getToken } from "next-auth/jwt";
// import mongoose from "mongoose";
// import dbConnect from "../../../utils/mongodb";
// import Contact from "../../../models/Contact";
// import nodemailer from "nodemailer";

// const secret = process.env.NEXTAUTH_SECRET;

// export default async function handler(req, res) {
//   // ✅ CORS headers for cross-origin requests from admin panel
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   if (req.method === "OPTIONS") {
//     res.status(200).end(); // Preflight request
//     return;
//   }

//   await dbConnect();

//   /* ─────────────── POST: Save Contact Form Submission ─────────────── */
//   if (req.method === "POST") {
//     const { name, phone, email, formType } = req.body;

//     if (!name || !phone || !email) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     try {
//       await Contact.create({
//         name,
//         email,
//         phone,
//         businessName: "",
//         formType: formType || "Contact Form",
//       });

//       // Send confirmation email
//       const transporter = nodemailer.createTransport({
//         host: "smtp.hostinger.com",
//         port: 465,
//         secure: true,
//         auth: {
//           user: "info@viralon.in",
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       await transporter.sendMail({
//         from: '"Viralon" <info@viralon.in>',
//         to: email,
//         subject: "Thank you for contacting us!",
//         html: `
//           <p>Hi ${name},</p>
//           <p>Thanks for reaching out via our Contact Form. Our team will connect with you shortly.</p>
//           <p>Regards,<br/>Team Viralon</p>
//         `,
//       });

//       return res.status(201).json({ success: true, message: "Form submitted and email sent!" });
//     } catch (err) {
//       console.error("POST Error:", err);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }
//   }

//   /* ─────────────── GET: Fetch Contact Form Entries ─────────────── */
//   if (req.method === "GET") {
//     try {
//       const token = await getToken({ req, secret });
//       const legacy = (req.headers.cookie || "").includes("admin_auth=true");

//       if (!token && !legacy) {
//         return res.status(401).json({ message: "Unauthorised" });
//       }

//       const filter = { formType: { $regex: /contact form/i } };

//       if (token?.role === "salesperson") {
//         filter.salespersonId = new mongoose.Types.ObjectId(token.id || token.sub);
//       }

//       const contacts = await Contact.find(filter).sort({ createdAt: -1 });

//       return res.status(200).json({ success: true, data: contacts });
//     } catch (err) {
//       console.error("GET Error:", err);
//       return res.status(500).json({ success: false, message: "Failed to fetch" });
//     }
//   }

//   // Unsupported method
//   res.status(405).json({ message: "Method Not Allowed" });
// }
