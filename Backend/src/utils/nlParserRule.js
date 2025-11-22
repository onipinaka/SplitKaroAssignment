import * as chrono from "chrono-node";
import { CATEGORIES, CATEGORY_ALIASES } from "../constants/categories.js";


// These are query words, temporal expressions, and general terms

const QUERY_STOPWORDS = new Set([
  // Question words
  "how", "much", "what", "when", "where", "which", "who", "why",
  
  // Verbs related to expenses
  "did", "spend", "spent", "paid", "pay", "bought", "purchase", "purchased",
  "cost", "have", "has", "had", "do", "does",
  
  // Temporal words
  "this", "last", "next", "past", "today", "yesterday", "tomorrow",
  "week", "month", "day", "year", "days", "months", "weeks", "years",
  
  // Prepositions and conjunctions
  "on", "in", "at", "for", "from", "to", "between", "and", "or",
  "about", "with", "without",
  
  // Articles and pronouns
  "the", "a", "an", "my", "i", "me", "all",
  
  // Other query terms
  "total", "show", "get", "find", "list", "give", "tell",
  "expenses", "transactions", "money", "is", "was", "were", "are"
]);


export function detectCategory(query) {
  const normalizedQuery = query.toLowerCase().trim();

  // Priority 1: Check exact category matches with word boundaries
  for (const category of CATEGORIES) {
    const regex = new RegExp(`\\b${category}\\b`, 'i');
    if (regex.test(normalizedQuery)) {
      return category;
    }
  }

  // Priority 2: Check category aliases (plurals and variations)
  for (const [alias, baseCategory] of Object.entries(CATEGORY_ALIASES)) {
    const regex = new RegExp(`\\b${alias}\\b`, 'i');
    if (regex.test(normalizedQuery)) {
      return baseCategory;
    }
  }

  // Priority 3: Extract category after prepositions ("on groceries", "for rent")
  const prepositionMatch = normalizedQuery.match(/\b(on|for|in|about)\s+([a-zA-Z]+)/i);
  if (prepositionMatch) {
    const candidateWord = prepositionMatch[2].toLowerCase();
    
    if (CATEGORIES.includes(candidateWord)) {
      return candidateWord;
    }
    
    if (CATEGORY_ALIASES[candidateWord]) {
      return CATEGORY_ALIASES[candidateWord];
    }
  }

  // Priority 4: Find any meaningful word that could be a category
  const words = normalizedQuery.split(/\s+/);
  
  for (const word of words) {
    const cleanWord = word.trim().toLowerCase();
    
    // Skip short words, stopwords, numbers, and month names
    if (cleanWord.length <= 2 || 
        QUERY_STOPWORDS.has(cleanWord) ||
        /^\d+$/.test(cleanWord) ||
        /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(cleanWord)) {
      continue;
    }
    
    // Return first meaningful word found
    return cleanWord;
  }

  return null;
}


export function parseQueryLocal(query, referenceDate = new Date()) {
  const result = { category: null, from: null, to: null };

  // Extract category from query
  result.category = detectCategory(query);

  // Parse temporal expressions using chrono-node
  const parsedDates = chrono.parse(query, referenceDate, { forwardDate: false });

  if (parsedDates.length > 0) {
    const dateResult = parsedDates[0];

    // Extract start date
    if (dateResult.start) {
      result.from = dateResult.start.date();
    }

    // Extract end date 
    if (dateResult.end) {
      result.to = dateResult.end.date();
    } 
    // If single date/time, expand to full day (00:00:00 to 23:59:59)
    else if (dateResult.start) {
      const startDate = new Date(result.from);
      
      // Set to beginning of day
      result.from = new Date(startDate);
      result.from.setHours(0, 0, 0, 0);
      
      // Set to end of day
      result.to = new Date(startDate);
      result.to.setHours(23, 59, 59, 999);
    }
  }

  return result;
}


