import connectDB from "../../../../utils/mongodb";
import Lead from "../../../../models/Lead";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "DELETE") {
    await Lead.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
