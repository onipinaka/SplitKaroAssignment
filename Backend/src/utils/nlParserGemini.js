import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

// Create client (API key auto-loaded from env)
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function parseWithGemini(query, referenceDate = new Date()) {
  const prompt = `
You are an expense-query parser.
Return ONLY a JSON object. No explanation.

JSON format:
{
  "category": string | null,
  "keyword": string | null,
  "from": string | null,
  "to": string | null
}

Rules:
- Extract "category" (one of common categories OR null)
- Extract "keyword" from description e.g. "chinese", "pizza", "uber"
- If query implies a single day, set from/to to that day
- NEVER return anything outside the JSON

User query: "${query}"
Reference date: "${referenceDate.toISOString()}"
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text();

  // Extract JSON safely
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);

  return {
    category: parsed.category || null,
    keyword: parsed.keyword || null,
    from: parsed.from ? new Date(parsed.from) : null,
    to: parsed.to ? new Date(parsed.to) : null,
  };
}
