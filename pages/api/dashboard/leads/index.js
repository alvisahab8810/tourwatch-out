import connectDB from "../../../../utils/mongodb";
import Lead from "../../../../models/Lead";
import SalesPerson from "../../../../models/SalesPerson";
import { sendLeadConfirmationEmail } from "../../../../utils/mailer";

/* ─── In-memory rate limiter ─── */
const ipLog = new Map();
const RATE_LIMIT  = 5;
const RATE_WINDOW = 10 * 60 * 1000;

function isRateLimited(ip) {
  const now   = Date.now();
  const entry = ipLog.get(ip);
  if (!entry || now > entry.resetAt) {
    ipLog.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).trim()); }
function validPhone(p) { const d = String(p).replace(/\D/g, ""); return d.length >= 10 && d.length <= 15; }

export default async function handler(req, res) {
  await connectDB();

  /* ── GET — return all leads with salesperson info ── */
  if (req.method === "GET") {
    const leads = await Lead.find({})
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email username")
      .lean();
    return res.status(200).json(leads);
  }

  /* ── POST — submit a new lead ── */
  if (req.method === "POST") {
    const { adminCreate, ...body } = req.body;

    /* Admin-created leads skip spam checks */
    if (!adminCreate) {
      const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
      if (isRateLimited(ip)) {
        return res.status(429).json({ error: "rate_limit", message: "Too many submissions. Please try again later." });
      }
      const { _hp, _t } = body;
      if (_hp && _hp.trim() !== "") return res.status(200).json({ ok: true });
      const elapsed = Date.now() - Number(_t || 0);
      if (!_t || elapsed < 2500) return res.status(400).json({ error: "too_fast", message: "Form submitted too quickly." });
    }

    const { name, email, phone, destination, travelDate, pax, message, formType,
            source, medium, campaign, adset, adContent, campaignId, budgetBracket,
            fbc, fbp } = body;

    if (!name?.trim())    return res.status(400).json({ error: "validation", message: "Name is required." });
    if (!email?.trim())   return res.status(400).json({ error: "validation", message: "Email is required." });
    if (!phone?.trim())   return res.status(400).json({ error: "validation", message: "Phone is required." });
    if (!validEmail(email)) return res.status(400).json({ error: "validation", message: "Invalid email address." });
    if (!validPhone(phone)) return res.status(400).json({ error: "validation", message: "Invalid phone number." });

    // Note: intentionally no duplicate email/phone block here — the same
    // person is allowed to submit the enquiry form again (e.g. for a
    // different trip), so every valid submission is saved as a new lead.

    const clientIp  = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
    const userAgent = req.headers["user-agent"] || "";

    const lead = await Lead.create({
      name:          name.trim(),
      email:         email.trim().toLowerCase(),
      phone:         phone.trim(),
      destination:   destination?.trim() || "",
      travelDate:    travelDate?.trim()  || "",
      pax:           pax?.trim()         || "",
      message:       message?.trim()     || "",
      formType:      adminCreate ? "Manual" : (formType || "Popup Form"),
      budgetBracket: budgetBracket?.trim() || "",
      isManual:      !!adminCreate,
      source, medium, campaign, adset, adContent, campaignId,
      fbc:       fbc       || req.cookies?._fbc || "",
      fbp:       fbp       || req.cookies?._fbp || "",
      clientIp,
      userAgent,
    });

    /* Send confirmation email for public-form submissions only */
    if (!adminCreate) {
      sendLeadConfirmationEmail({
        name: name.trim(), email: email.trim().toLowerCase(),
        phone: phone.trim(), destination: destination?.trim() || "",
        travelDate: travelDate?.trim() || "", pax: pax?.trim() || "",
        message: message?.trim() || "",
      }).catch(() => {});
    }

    return res.status(201).json({ ok: true, id: lead._id, lead });
  }

  res.status(405).end();
}
