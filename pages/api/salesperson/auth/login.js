import crypto from "crypto";
import connectDB from "../../../../utils/mongodb";
import SalesPerson from "../../../../models/SalesPerson";

function hashPassword(password, salt) {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();

  const { username, password } = req.body;
  if (!username?.trim() || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const sp = await SalesPerson.findOne({ username: username.trim().toLowerCase() }).lean();
  if (!sp || !sp.isActive) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const hash = hashPassword(password, sp.salt);
  if (hash !== sp.passwordHash) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  await SalesPerson.findByIdAndUpdate(sp._id, { sessionToken: token });

  return res.status(200).json({
    ok: true,
    token,
    salesperson: {
      _id:         sp._id,
      name:        sp.name,
      email:       sp.email,
      username:    sp.username,
      permissions: sp.permissions,
    },
  });
}
