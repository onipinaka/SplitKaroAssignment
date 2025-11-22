import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import Expense from "../models/expense.model.js";
import { parseQueryLocal } from "../utils/nlParserRule.js";
import { parseWithGemini } from "../utils/nlParserGemini.js";

const router = express.Router();

router.post(
  "/local",
  asyncHandler(async (req, res) => {
    const { query } = req.body;
    if (!query)
      return res.status(400).json({ success: false, message: "query required" });

    const { category, from, to } = parseQueryLocal(query);

    const filter = {};
    if (category) filter.category = new RegExp(`^${category}`, "i");
    if (from || to) filter.datetime = {};
    if (from) filter.datetime.$gte = from;
    if (to) filter.datetime.$lte = to;

    const entries = await Expense.find(filter).sort({ datetime: -1 });

    const total = entries.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      meta: { category, from, to, totalEntries: entries.length, total },
      data: entries
    });
  })
);

router.post(
  "/gemini",
  asyncHandler(async (req, res) => {
    const { query } = req.body;
    if (!query)
      return res.status(400).json({ success: false, message: "query required" });

    const parsed = await parseWithGemini(query);

    const filter = {};
    if (parsed.category) filter.category = new RegExp(`^${parsed.category}`, "i");
    if (parsed.from || parsed.to) filter.datetime = {};
    if (parsed.from) filter.datetime.$gte = parsed.from;
    if (parsed.to) filter.datetime.$lte = parsed.to;

    const entries = await Expense.find(filter).sort({ datetime: -1 });
    const total = entries.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      meta: { source: "gemini", parsed, totalEntries: entries.length, total },
      data: entries
    });
  })
);

export default router;
    