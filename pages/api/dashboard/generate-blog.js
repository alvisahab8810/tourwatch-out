import Anthropic from "@anthropic-ai/sdk";

export const config = { api: { responseLimit: false, bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic, destination, fillMeta } = req.body || {};
  if (!topic?.trim()) return res.status(400).json({ error: "Topic is required." });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are an expert travel SEO content writer for TourWatchOut, an Indian travel company.
Follow the user's instructions precisely — including word count, structure, headings, tone, keywords, and all formatting requirements.
Always write in Markdown. Start the blog with a # H1 title on the very first line.
Do not add any preamble, commentary, or explanation — output only the blog content as instructed.`;

  const userPrompt = fillMeta
    ? `${topic}${destination ? `\n\nDestination context: ${destination}` : ""}

---
After the complete blog content above, add exactly this separator on its own line: METAJSON_START
Then output a single-line JSON object (no markdown, no line breaks inside JSON):
{"metaTitle":"...(60 chars max)","metaDescription":"...(155 chars max)","summary":"...(180 chars max)","tags":"...","categories":"Travel, India"}`
    : `${topic}${destination ? `\n\nDestination context: ${destination}` : ""}`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const stream = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      stream: true,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
        res.write(event.delta.text);
      }
    }
    res.end();
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ error: e.message });
    else res.end();
  }
}
