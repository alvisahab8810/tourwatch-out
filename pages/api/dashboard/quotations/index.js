import connectDB from "../../../../utils/mongodb";
import Quotation from "../../../../models/Quotation";

function getFY() {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
  return m >= 4
    ? `${String(y).slice(2)}${String(y + 1).slice(2)}`
    : `${String(y - 1).slice(2)}${String(y).slice(2)}`;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const quotes = await Quotation.find({})
      .sort({ createdAt: -1 })
      .populate("leadId", "name phone email destination travelDate pax brr")
      .populate("assignedTo", "name email")
      .lean();
    return res.status(200).json(quotes);
  }

  if (req.method === "POST") {
    const { leadId, type, ...rest } = req.body;
    if (!leadId) return res.status(400).json({ error: "leadId required" });

    const fy = getFY();
    const prefix = `TWO-Q-${fy}-`;
    const count = await Quotation.countDocuments({ quotationNo: { $regex: `^${prefix}` } });
    const quotationNo = `${prefix}${String(count + 1).padStart(3, "0")}`;

    const quote = await Quotation.create({ leadId, type: type || "Domestic", quotationNo, ...rest });
    const populated = await Quotation.findById(quote._id)
      .populate("leadId", "name phone email destination travelDate pax brr")
      .populate("assignedTo", "name email")
      .lean();
    return res.status(201).json(populated);
  }

  res.status(405).end();
}
