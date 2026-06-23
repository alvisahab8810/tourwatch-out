import crypto from "crypto";
import connectDB from "../../../../utils/mongodb";
import SalesPerson from "../../../../models/SalesPerson";
import { sendSalesPersonInviteEmail } from "../../../../utils/mailer";

function hashPassword(password, salt) {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

function generatePassword(length = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#";
  return Array.from(crypto.randomBytes(length))
    .map(b => chars[b % chars.length])
    .join("");
}

function generateUsername(name, email) {
  const base = name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${suffix}`;
}

export default async function handler(req, res) {
  await connectDB();

  /* ── GET — list all salespersons ── */
  if (req.method === "GET") {
    const list = await SalesPerson.find({})
      .select("-passwordHash -salt -sessionToken")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(list);
  }

  /* ── POST — invite a new salesperson ── */
  if (req.method === "POST") {
    const { name, email, permissions, designation } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Name is required." });
    if (!email?.trim()) return res.status(400).json({ error: "Email is required." });

    const emailNorm = email.trim().toLowerCase();
    const existing = await SalesPerson.findOne({ email: emailNorm }).lean();
    if (existing) return res.status(409).json({ error: "A salesperson with this email already exists." });

    const plainPassword = generatePassword();
    const username      = generateUsername(name, emailNorm);
    const salt          = crypto.randomBytes(16).toString("hex");
    const passwordHash  = hashPassword(plainPassword, salt);

    const sp = await SalesPerson.create({
      name: name.trim(),
      designation: (designation || "").trim(),
      email: emailNorm,
      username,
      passwordHash,
      salt,
      permissions: permissions || {},
    });

    /* Send invite email with credentials */
    await sendSalesPersonInviteEmail({
      name: sp.name,
      email: sp.email,
      username,
      password: plainPassword,
    }).catch(() => {});

    return res.status(201).json({
      ok: true,
      salesperson: {
        _id: sp._id,
        name: sp.name,
        designation: sp.designation,
        email: sp.email,
        username: sp.username,
        permissions: sp.permissions,
        isActive: sp.isActive,
        createdAt: sp.createdAt,
      },
    });
  }

  res.status(405).end();
}
