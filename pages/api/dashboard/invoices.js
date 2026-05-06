import connectDB from "../../../utils/mongodb";
import Invoice from "../../../models/Invoice";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(invoices.map(i => ({ ...i, id: i._id })));
  }

  if (req.method === "POST") {
    const id  = uuidv4();
    const inv = await Invoice.create({ ...req.body, _id: id });
    const obj = inv.toObject();
    return res.status(201).json({ ...obj, id: obj._id });
  }

  res.status(405).end();
}
