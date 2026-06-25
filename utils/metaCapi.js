import crypto from "crypto";

function sha256(value) {
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

function sha256Phone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  const withCC = digits.length === 10 ? `91${digits}` : digits;
  return crypto.createHash("sha256").update(withCC).digest("hex");
}

/**
 * Send a server-side event to Meta Conversions API.
 * @param {object} opts
 * @param {string} opts.eventName   - "QualifiedLead" | "Purchase"
 * @param {string} opts.eventId     - unique dedup ID e.g. "qlead_<id>" or "booking_<id>"
 * @param {string} [opts.email]
 * @param {string} [opts.phone]
 * @param {string} [opts.fbc]       - raw _fbc cookie, NOT hashed
 * @param {string} [opts.fbp]       - raw _fbp cookie, NOT hashed
 * @param {string} [opts.clientIp]  - raw IP, NOT hashed
 * @param {string} [opts.userAgent] - raw user agent, NOT hashed
 * @param {number} [opts.value]     - purchase amount (Purchase event only)
 * @param {string} [opts.currency]  - e.g. "INR"
 */
export async function sendMetaEvent({ eventName, eventId, email, phone, fbc, fbp, clientIp, userAgent, value, currency }) {
  const datasetId   = process.env.META_DATASET_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!datasetId || !accessToken) {
    console.warn("[MetaCAPI] Missing META_DATASET_ID or META_ACCESS_TOKEN");
    return;
  }

  const userData = {
    ...(email     && { em: [sha256(email)] }),
    ...(phone     && { ph: [sha256Phone(phone)] }),
    ...(fbc       && { fbc }),
    ...(fbp       && { fbp }),
    ...(clientIp  && { client_ip_address: clientIp }),
    ...(userAgent && { client_user_agent: userAgent }),
  };

  const eventPayload = {
    event_name:    eventName,
    event_time:    Math.floor(Date.now() / 1000),
    action_source: "system_generated",
    event_id:      eventId,
    user_data:     userData,
  };

  if (value !== undefined && currency) {
    eventPayload.custom_data = { value, currency };
  }

  const body = { data: [eventPayload] };

  if (process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${datasetId}/events?access_token=${accessToken}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    const result = await response.json();
    if (!response.ok) console.error("[MetaCAPI] Error:", result);
    return result;
  } catch (err) {
    console.error("[MetaCAPI] Fetch error:", err);
  }
}
