import * as chrono from "chrono-node";
import { CATEGORIES } from "../constants/categories.js";

function normalizeText(t) {
  return (t || "").toLowerCase().trim();
}

function extractCategory(query) {
  const q = normalizeText(query);
  for (const c of CATEGORIES) {
    if (q.includes(c)) return c;
  }
  return null;
}

function extractKeyword(query, category) {
  const q = normalizeText(query);
  const skip = new Set([
    "how",
    "much",
    "did",
    "i",
    "spend",
    "where",
    "all",
    "this",
    "last",
    "past",
    "week",
    "month",
    "day",
    "in",
    "on",
    "for",
    "the",
    "a",
    "an",
    "between",
    "and",
    "from",
    "to",
    "transactions",
    "expenses",
    "spent",
  ]);

  if (category) {
    const re = new RegExp(`\\b${category}\\b`, "gi");
    query = query.replace(re, "");
  }

  const phraseMatch = query.match(/(?:on|for|about|named|called|like)\s+([a-z0-9 ]{3,})/i);
  if (phraseMatch && phraseMatch[1]) return phraseMatch[1].trim();

  const words = query
    .replace(/[.,?]/g, " ")
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean);

  for (const w of words.reverse()) {
    if (w.length > 2 && !skip.has(w)) return w;
  }

  return null;
}

function applyDateRules(query, referenceDate) {
  const now = new Date(referenceDate || new Date());

  const parsed = chrono.parse(query, now);

  if (parsed.length) {
    const p = parsed[0];
    let from = null;
    let to = null;

    if (p.start) from = p.start.date();
    if (p.end) to = p.end.date();

    if (from && !to) {
      const start = new Date(from);
      from = new Date(start.setHours(0, 0, 0, 0));
      to = new Date(start.setHours(23, 59, 59, 999));
    }

    return { from, to };
  }

  const pastMatch = query.match(/past\s+(\d+)\s+days?/i);
  if (pastMatch) {
    const days = parseInt(pastMatch[1], 10);
    const to = new Date(now.setHours(23, 59, 59, 999));
    const from = new Date(to.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }

  return { from: null, to: null };
}

export async function parseWithGemini(query, referenceDate = new Date()) {
  const category = extractCategory(query);
  const { from, to } = applyDateRules(query, referenceDate);
  const keyword = extractKeyword(query, category);

  return {
    category: category || null,
    keyword: keyword || null,
    from: from || null,
    to: to || null,
  };
}
