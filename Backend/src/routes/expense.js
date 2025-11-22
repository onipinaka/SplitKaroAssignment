import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { createExpense, getExpenses } from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/", asyncHandler(createExpense));
router.get("/", asyncHandler(getExpenses));

export default router;