// Public API — returns only Active destinations
import { readAll } from "../../utils/destStore";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  let data = readAll().filter((d) => d.status === "Active");

  const { type } = req.query;
  if (type) data = data.filter((d) => d.type === type);

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");
  res.json(data);
}
