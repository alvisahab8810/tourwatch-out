import { readAll } from "../../utils/packageStore";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const all = readAll();
  const active = all.filter(p => p.status === "Active");
  const { destination, packageType } = req.query;
  let result = active;
  if (destination) result = result.filter(p => p.destination === destination);
  if (packageType) result = result.filter(p => p.packageType === packageType);
  res.status(200).json(result);
}
