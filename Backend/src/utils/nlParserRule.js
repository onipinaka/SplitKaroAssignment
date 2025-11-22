import * as chrono from "chrono-node";
import { CATEGORIES } from "../constants/categories.js";

// Try to find a category in the user's query
export function detectCategory(query) {
  const q = query.toLowerCase().trim();

  // Check if query contains any known category
  for (const c of CATEGORIES) {
    if (q.includes(c)) return c;
  }

  const match = q.match(/\b(on|for|in)\s+([a-zA-Z]+)/);
  if (match && match[2]) return match[2];

  const words = q.split(/\s+/).map(w => w.trim());
  const skip = ["how", "much", "did", "i", "spend", "where", "all", "this", "last", "week", "month", "day"];

  for (const w of words) {
    if (w.length > 2 && !skip.includes(w)) {
      return w; 
    }
  }

  return null;
}

// Main parser - extracts category and date range from natural language
export function parseQueryLocal(query, referenceDate = new Date()) {
  const result = { category: null, from: null, to: null };

  result.category = detectCategory(query);

  // Use chrono library to understand dates like "last week" or "yesterday"
  const parsed = chrono.parse(query, referenceDate);

  if (parsed.length) {
    const p = parsed[0];

    if (p.start) result.from = p.start.date();
    if (p.end) result.to = p.end.date();

    // If only one date found, treat it as a full day (00:00 to 23:59)
    if (p.start && !p.end) {
      const start = result.from ?? p.start.date();
      result.from = new Date(start.setHours(0, 0, 0, 0));
      result.to = new Date(start.setHours(23, 59, 59, 999));
    }
  }

  return result;
}
