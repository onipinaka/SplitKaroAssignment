import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import Expense from "../models/expense.model.js";
import { parseQueryLocal } from "../utils/nlParserRule.js";

const router = express.Router();

router.post(
  "/local",
  asyncHandler(async (req, res) => {
    const { query } = req.body;
    if (!query)
      return res.status(400).json({ success: false, message: "query required" });

    const { category, from, to } = parseQueryLocal(query);

    const filter = {};

    if (category) {
      filter.$or = [
        { category: new RegExp(category, "i") },
        { description: new RegExp(category, "i") }
      ];
    }

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


export default router;
