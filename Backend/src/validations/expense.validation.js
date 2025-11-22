import Joi from "joi";
import { CATEGORIES } from "../constants/categories.js";

export const expenseSchema = Joi.object({
  amount: Joi.number().positive().required(),
  category: Joi.string().valid(...CATEGORIES).required(),
  datetime: Joi.date().required(),
  description: Joi.string().allow("").max(1000)
});
