import * as chrono from "chrono-node";
import { CATEGORIES } from "../constants/categories.js";

export function detectCategory(query) {
  const q = query.toLowerCase();

  for (const c of CATEGORIES) {
    if (q.includes(c)) return c;
  }

  const match = q.match(/\b(on|for)\s+([a-zA-Z]+)\b/);
  if (match && match[2]) return match[2];

  return null;
}

export function parseQueryLocal(query, referenceDate = new Date()) {
  const result = { category: null, from: null, to: null };

  result.category = detectCategory(query);

  const parsed = chrono.parse(query, referenceDate);

  if (parsed.length) {
    const p = parsed[0];

    if (p.start) result.from = p.start.date();
    if (p.end) result.to = p.end.date();

    if (p.start && !p.end) {
      const start = result.from;
      result.from = new Date(start.setHours(0, 0, 0, 0));
      result.to = new Date(start.setHours(23, 59, 59, 999));
    }
  }

  return result;
}