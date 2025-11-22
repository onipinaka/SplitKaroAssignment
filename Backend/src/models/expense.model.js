import mongoose from "mongoose"
import { CATEGORIES } from "../constants/categories";

const ExpenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true, min:0},
    category: {
        type: String, required: true,
        enum: CATEGORIES, trim:true
    },
    datetime: {type:Date, required:true,},
    description: {type:String, required: true, default: ""},
    createdAt: {type: String, default: Date.now}
},{
    timestamps: true
});

ExpenseSchema.index({ category: 1, datetime: 1 });

const Expense = mongoose.model("Expense",ExpenseSchema)

export default Expense;