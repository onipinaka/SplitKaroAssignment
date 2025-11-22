import Expense from "../models/expense.model.js";
import { expenseSchema } from "../validations/expense.validation.js";

// Create a new expense entry
export const createExpense = async (req, res) => {
    const { error, value } = expenseSchema.validate(req.body);

    if (error)
        return res.status(400).json({ success: false, message: error.message });

    const expense = new Expense(value);
    await expense.save();

    res.status(201).json({ success: true, data: expense });
};

// Fetch expenses with optional filters
export const getExpenses = async (req, res) => {
    const { category, from, to, limit = 100, skip = 0 } = req.query;

    // Build filter object for MongoDB query
    const filter = {};

    if (category) filter.category = category;
    if (from || to) filter.datetime = {};
    if (from) filter.datetime.$gte = new Date(from);
    if (to) filter.datetime.$lte = new Date(to);

    const expenses = await Expense.find(filter)
        .sort({ datetime: -1 })
        .limit(Number(limit))
        .skip(Number(skip));

    res.json({
        success: true,
        count: expenses.length,
        data: expenses,
    });
};
