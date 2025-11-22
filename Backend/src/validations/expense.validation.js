import Joi from "joi";
import { CATEGORIES } from "../constants/categories";

const expenseSchema = Joi.object({
    amount: Joi.number().positive().required(),
    description: Joi.string().allow("").max(1000),
    category: Joi.string().valid(...CATEGORIES).required(),
    datetime: Joi.date().required()
})