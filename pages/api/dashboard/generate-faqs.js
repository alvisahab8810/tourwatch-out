import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { destination, packageName, packageType, duration, highlights } = req.body || {};

  if (!destination && !packageName) {
    return res.status(400).json({ error: "Provide at least a destination or package name." });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Generate exactly 10 FAQs for a travel package with the following details:
- Destination: ${destination || "Not specified"}
- Package Name: ${packageName || "Not specified"}
- Package Type: ${packageType || "Family"}
- Duration: ${duration || "Not specified"}
- Highlights: ${highlights || "Not specified"}

Return a JSON array of 10 objects. Each object must have exactly two keys: "question" and "answer".
Cover practical topics like: visa/entry requirements, best time to visit, what's included, weather, local tips, payment/booking, cancellation, transport, food, activities.
Keep answers concise (2-4 sentences). Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0]?.text || "[]";
    // Strip any markdown code fences if present
    const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const faqs  = JSON.parse(clean);

    if (!Array.isArray(faqs)) throw new Error("Not an array");
    return res.status(200).json(faqs.slice(0, 10).map(f => ({
      question: String(f.question || ""),
      answer:   String(f.answer   || ""),
    })));
  } catch (e) {
    return res.status(500).json({ error: "Failed to generate FAQs: " + e.message });
  }
}
