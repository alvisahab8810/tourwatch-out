



import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../utils/mongodb";
import Query from "../../../models/Query";
import nodemailer from "nodemailer";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  // ✅ CORS headers for cross-origin requests from admin panel
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end(); // Preflight request
    return;
  }

  await dbConnect();

  /* ─────────────── POST: Save Query Form Submission ─────────────── */
  if (req.method === "POST") {
    const { fullName, phoneNumber, emailAddress, formType } = req.body;

    try {
      await Query.create({
        name: fullName,
        email: emailAddress,
        phone: phoneNumber,
        businessName: "",
        formType: formType || "Query Form",
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: "info@viralon.in",
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Viralon" <info@viralon.in>',
        to: emailAddress,
        subject: "Thank you for contacting us!",
        html: `
          <p>Hi ${fullName},</p>
          <p>Thanks for reaching out via our Query Form. Our team will connect with you shortly.</p>
          <p>Regards,<br/>Team Viralon</p>
        `,
      });

      res.status(201).json({ success: true, message: "Form submitted and email sent!" });
      return;
    } catch (err) {
      console.error("POST Error:", err);
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
  }

  /* ─────────────── GET: Fetch All Helping Form Entries ─────────────── */
  if (req.method === "GET") {
    try {
      const token = await getToken({ req, secret });
      const legacy = (req.headers.cookie || "").includes("admin_auth=true");

      if (!token && !legacy) {
        res.status(401).json({ message: "Unauthorised" });
        return;
      }

      const filter = { formType: { $regex: /helping form/i } };
      

      if (token?.role === "salesperson") {
        filter.salespersonId = new mongoose.Types.ObjectId(token.id || token.sub);
      }

      const queries = await Query.find(filter).sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: queries });
      return;
    } catch (err) {
      console.error("GET Error:", err);
      res.status(500).json({ success: false, message: "Failed to fetch" });
      return;
    }
  }

  // Fallback for unsupported methods
  res.status(405).json({ message: "Method Not Allowed" });
}
