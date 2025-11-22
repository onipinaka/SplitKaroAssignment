import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import expensesRoutes from "./routes/expenses.routes.js";
import queryRoutes from "./routes/query.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use("/api/expenses", expensesRoutes);
app.use("/api/query", queryRoutes);

app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/splitkaro";
console.log(MONGODB_URI)
connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
