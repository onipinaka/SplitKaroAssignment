import * as chrono from "chrono-node";
import { CATEGORIES } from "../constants/categories.js";

// Try to find a category in the user's query
export function detectCategory(query) {
  const q = query.toLowerCase().trim();

  // Check if query contains any known category
  for (const c of CATEGORIES) {
    // Use word boundary to match exact category words
    const regex = new RegExp(`\\b${c}\\b`, 'i');
    if (regex.test(q)) return c;
  }

  // Try to find category after prepositions like "on food" or "for travel"
  const match = q.match(/\b(on|for|in|about)\s+([a-zA-Z]+)/);
  if (match && match[2] && CATEGORIES.includes(match[2])) {
    return match[2];
  }

  // Words to skip when trying to guess category from query
  const skipWords = [
    "how", "much", "did", "i", "spend", "spent", "where", "all", 
    "this", "last", "next", "past", "week", "month", "day", "year",
    "today", "yesterday", "tomorrow", "between", "and", "from", "to",
    "what", "when", "total", "my", "the", "a", "an", "is", "was",
    "have", "has", "had", "do", "does", "show", "get", "find",
    "list", "give", "tell", "me", "expenses", "transactions", "money",
    "cost", "paid", "pay", "bought", "purchase", "purchased"
  ];

  // Look for any remaining word that could be a category
  const words = q.split(/\s+/).map(w => w.trim().toLowerCase());

  for (const w of words) {
    if (w.length > 2 && !skipWords.includes(w)) {
      // Only return if it's not a number or date-like word
      if (!/^\d+$/.test(w) && !w.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)) {
        return w;
      }
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
