import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.0";

export async function parseWithGemini(query, referenceDate = new Date()) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  const prompt = `
Return JSON only.
Fields: category, from, to.
User query: "${query}"
Reference date: ${referenceDate.toISOString()}
`;

  const url = `https://generativeapi.googleapis.com/v1/models/${GEMINI_MODEL}:generate`;

  const resp = await axios.post(
    url,
    { prompt },
    {
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text =
    resp.data?.output?.[0]?.content?.[0]?.text ||
    resp.data?.choices?.[0]?.message?.content ||
    JSON.stringify(resp.data);

  const match = text.match(/\{[\s\S]*\}/);
  const json = JSON.parse(match ? match[0] : text);

  return {
    category: json.category || null,
    from: json.from ? new Date(json.from) : null,
    to: json.to ? new Date(json.to) : null
  };
}
