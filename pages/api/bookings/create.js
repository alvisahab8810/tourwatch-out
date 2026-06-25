import connectDB from "../../../utils/mongodb";
import Booking from "../../../models/Booking";
import { sendMetaEvent } from "../../../utils/metaCapi";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    packageId, packageName, destination, destSlug, duration,
    totalAmount, basePrice, travelDate, adults, children,
    leadName, email, phone, altPhone, address, city, state, specialRequests, userId,
  } = req.body;

  // Validation
  if (!packageId)   return res.status(400).json({ error: "Package ID is required." });
  if (!travelDate)  return res.status(400).json({ error: "Travel date is required." });
  if (!leadName?.trim()) return res.status(400).json({ error: "Full name is required." });
  if (!email?.trim())    return res.status(400).json({ error: "Email is required." });
  if (!phone?.trim())    return res.status(400).json({ error: "Phone number is required." });
  if (new Date(travelDate) < new Date()) return res.status(400).json({ error: "Travel date must be in the future." });

  await connectDB();

  const booking = await Booking.create({
    packageId, packageName, destination, destSlug, duration,
    totalAmount:  Number(totalAmount) || 0,
    basePrice:    Number(basePrice) || 0,
    travelDate:   new Date(travelDate),
    adults:       Number(adults) || 1,
    children:     Number(children) || 0,
    leadName:     leadName.trim(),
    email:        email.trim().toLowerCase(),
    phone:        phone.trim(),
    altPhone:     altPhone?.trim() || "",
    address:      address?.trim() || "",
    city:         city?.trim() || "",
    state:        state?.trim() || "",
    specialRequests: specialRequests?.trim() || "",
    paymentMethod: "COD",
    paymentStatus: "Pending",
    status:        "Confirmed",
    userId:        userId || null,
  });

  sendMetaEvent({
    eventName: "Purchase",
    eventId:   `booking_${booking._id}`,
    email:     booking.email,
    phone:     booking.phone,
    value:     booking.totalAmount,
    currency:  "INR",
  }).catch((err) => console.error("[MetaCAPI] Purchase failed:", err));

  res.status(201).json({ bookingId: booking.bookingId, id: booking._id });
}
