import * as chrono from "chrono-node";
import { CATEGORIES, CATEGORY_ALIASES } from "../constants/categories.js";

// Words to ignore when detecting categories
const QUERY_STOPWORDS = new Set([
  "how", "much", "what", "when", "where", "which", "who", "why",
  "did", "spend", "spent", "paid", "pay", "bought", "purchase", "purchased",
  "cost", "have", "has", "had", "do", "does", "made", "make",
  "this", "last", "next", "past", "today", "yesterday", "tomorrow",
  "week", "month", "day", "year", "days", "months", "weeks", "years",
  "on", "in", "at", "for", "from", "to", "between", "and", "or",
  "about", "with", "without", "during", "around",
  "the", "a", "an", "my", "i", "me", "all", "any", "some",
  "total", "show", "get", "find", "list", "give", "tell",
  "expenses", "transactions", "money", "is", "was", "were", "are", "be"
]);

// Detect category from query text
export function detectCategory(query) {
  const lower = query.toLowerCase().trim();

  // First: Look for exact category matches
  for (const cat of CATEGORIES) {
    if (new RegExp(`\\b${cat}\\b`, 'i').test(lower)) {
      return cat;
    }
  }

  // Second: Check plural/alias forms like "groceries"
  for (const [alias, cat] of Object.entries(CATEGORY_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`, 'i').test(lower)) {
      return cat;
    }
  }

  // Third: Look after prepositions ("on food", "for rent")
  const prepMatch = lower.match(/\b(on|for|in|about)\s+([a-z]+)/i);
  if (prepMatch) {
    const word = prepMatch[2];
    if (CATEGORIES.includes(word)) return word;
    if (CATEGORY_ALIASES[word]) return CATEGORY_ALIASES[word];
  }

  // Last resort: find any word that's not a stopword
  const words = lower.split(/\s+/);
  for (const word of words) {
    if (word.length > 2 && 
        !QUERY_STOPWORDS.has(word) &&
        !/^\d+$/.test(word) &&
        !/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|mon|tue|wed|thu|fri|sat|sun)/i.test(word)) {
      return word;
    }
  }

  return null;
}

// Handle "last N days/weeks/months" patterns manually
function parseCustomRanges(query, refDate) {
  const lower = query.toLowerCase();
  
  // "today"
  if (lower.includes('today')) {
    const start = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 0, 0, 0, 0);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 23, 59, 59, 999);
    return { from: start, to: end };
  }

  // "yesterday"
  if (lower.includes('yesterday')) {
    const start = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - 1, 0, 0, 0, 0);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - 1, 23, 59, 59, 999);
    return { from: start, to: end };
  }

  // "tomorrow"
  if (lower.includes('tomorrow')) {
    const start = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() + 1, 0, 0, 0, 0);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() + 1, 23, 59, 59, 999);
    return { from: start, to: end };
  }
  
  // "last 7 days" or "past 7 days"
  const daysMatch = lower.match(/(?:last|past)\s+(\d+)\s+days?/);
  if (daysMatch) {
    const n = parseInt(daysMatch[1], 10);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - n + 1);
    start.setHours(0, 0, 0, 0);
    return { from: start, to: end };
  }

  // "last N weeks"
  const weeksMatch = lower.match(/(?:last|past)\s+(\d+)\s+weeks?/);
  if (weeksMatch) {
    const n = parseInt(weeksMatch[1], 10);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - (n * 7) + 1);
    start.setHours(0, 0, 0, 0);
    return { from: start, to: end };
  }

  // "last N months"
  const monthsMatch = lower.match(/(?:last|past)\s+(\d+)\s+months?/);
  if (monthsMatch) {
    const n = parseInt(monthsMatch[1], 10);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 23, 59, 59, 999);
    const start = new Date(end);
    start.setMonth(start.getMonth() - n + 1);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return { from: start, to: end };
  }

  // "this month"
  if (lower.includes('this month')) {
    const start = new Date(refDate.getFullYear(), refDate.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0, 23, 59, 59, 999);
    return { from: start, to: end };
  }

  // "this week"
  if (lower.includes('this week')) {
    const day = refDate.getDay();
    const start = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - day, 0, 0, 0, 0);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - day + 6, 23, 59, 59, 999);
    return { from: start, to: end };
  }

  // "last month"
  if (lower.includes('last month')) {
    const start = new Date(refDate.getFullYear(), refDate.getMonth() - 1, 1, 0, 0, 0, 0);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), 0, 23, 59, 59, 999);
    return { from: start, to: end };
  }

  // "last week"
  if (lower.includes('last week')) {
    const day = refDate.getDay();
    const start = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - day - 7, 0, 0, 0, 0);
    const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - day - 1, 23, 59, 59, 999);
    return { from: start, to: end };
  }

  return null;
}

// Main parser function
export function parseQueryLocal(query, referenceDate = new Date()) {
  const result = { category: null, from: null, to: null };

  // Get category
  result.category = detectCategory(query);

  // Try custom range patterns first (handles timezone correctly)
  const customRange = parseCustomRanges(query, referenceDate);
  if (customRange) {
    result.from = customRange.from;
    result.to = customRange.to;
    return result;
  }

  // Use chrono for other date phrases (like "last Saturday", specific dates)
  const parsed = chrono.parse(query, referenceDate);

  if (parsed.length > 0) {
    const match = parsed[0];

    if (match.start) {
      const startParsed = match.start.date();
      // Normalize to midnight in local timezone
      result.from = new Date(
        startParsed.getFullYear(), 
        startParsed.getMonth(), 
        startParsed.getDate(), 
        0, 0, 0, 0
      );
    }

    if (match.end) {
      const endParsed = match.end.date();
      // Normalize to end of day in local timezone
      result.to = new Date(
        endParsed.getFullYear(), 
        endParsed.getMonth(), 
        endParsed.getDate(), 
        23, 59, 59, 999
      );
    } else if (match.start) {
      // Single date: expand to full day in local timezone
      const startParsed = match.start.date();
      result.to = new Date(
        startParsed.getFullYear(), 
        startParsed.getMonth(), 
        startParsed.getDate(), 
        23, 59, 59, 999
      );
    }
  }

  return result;
}




