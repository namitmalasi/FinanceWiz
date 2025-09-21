import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import calcRoutes from "./routes/calc.js";
import { connectDB } from "./utils/db.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/calc", calcRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
