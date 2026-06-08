import connectDB from "../../../../utils/mongodb";
import Lead from "../../../../models/Lead";
import { sendLeadConfirmationEmail } from "../../../../utils/mailer";

/* ─── In-memory rate limiter (resets on server restart, good enough for abuse) ─── */
const ipLog = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT   = 5;              // max submissions
const RATE_WINDOW  = 10 * 60 * 1000; // per 10 minutes

function isRateLimited(ip) {
  const now  = Date.now();
  const entry = ipLog.get(ip);
  if (!entry || now > entry.resetAt) {
    ipLog.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

/* ─── Simple email format check ─── */
function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).trim());
}

/* ─── Strip non-digits, check length ─── */
function validPhone(p) {
  const digits = String(p).replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export default async function handler(req, res) {
  await connectDB();

  /* ── GET — return all leads (dashboard only) ── */
  if (req.method === "GET") {
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(leads);
  }

  /* ── POST — submit a new lead ── */
  if (req.method === "POST") {
    const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();

    /* 1. Rate limit */
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: "rate_limit", message: "Too many submissions. Please try again later." });
    }

    const {
      name, email, phone, destination, travelDate, pax, message, formType,
      source, medium, campaign, adset, adContent, campaignId,
      _hp,   // honeypot field — must be empty
      _t,    // timestamp client set when form loaded (ms)
    } = req.body;

    /* 2. Honeypot — bots fill hidden fields, humans never see them */
    if (_hp && _hp.trim() !== "") {
      // Return 200 so bots think it worked — don't reveal the trap
      return res.status(200).json({ ok: true });
    }

    /* 3. Timing check — genuine users take > 2 s to fill a form */
    const elapsed = Date.now() - Number(_t || 0);
    if (!_t || elapsed < 2500) {
      return res.status(400).json({ error: "too_fast", message: "Form submitted too quickly." });
    }

    /* 4. Field validation */
    if (!name?.trim())              return res.status(400).json({ error: "validation", message: "Name is required." });
    if (!email?.trim())             return res.status(400).json({ error: "validation", message: "Email is required." });
    if (!phone?.trim())             return res.status(400).json({ error: "validation", message: "Phone is required." });
    if (!validEmail(email))         return res.status(400).json({ error: "validation", message: "Invalid email address." });
    if (!validPhone(phone))         return res.status(400).json({ error: "validation", message: "Invalid phone number — must be at least 10 digits." });

    /* 5. Duplicate check — same phone OR same email already in DB */
    const phoneDigits  = phone.replace(/\D/g, "");
    const emailNorm    = email.trim().toLowerCase();

    const existing = await Lead.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${emailNorm}$`, "i") } },
        // match any stored phone that has the same digit sequence
        { phone: { $regex: phoneDigits.slice(-10) } },
      ],
    }).lean();

    if (existing) {
      const field = existing.email?.toLowerCase() === emailNorm ? "email" : "phone";
      return res.status(409).json({ error: "duplicate", field });
    }

    /* 6. Save lead */
    const lead = await Lead.create({
      name: name.trim(),
      email: emailNorm,
      phone: phone.trim(),
      destination: destination?.trim() || "",
      travelDate:  travelDate?.trim() || "",
      pax:         pax?.trim()        || "",
      message:     message?.trim()    || "",
      formType: formType || "Popup Form",
      source, medium, campaign, adset, adContent, campaignId,
    });

    /* 7. Send confirmation email — fire-and-forget */
    sendLeadConfirmationEmail({
      name:        name.trim(),
      email:       emailNorm,
      phone:       phone.trim(),
      destination: destination?.trim() || "",
      travelDate:  travelDate?.trim() || "",
      pax:         pax?.trim() || "",
      message:     message?.trim() || "",
    }).catch(() => {});

    return res.status(201).json({ ok: true, id: lead._id });
  }

  res.status(405).end();
}
