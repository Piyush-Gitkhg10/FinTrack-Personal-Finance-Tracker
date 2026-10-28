import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import goalRoutes from "./routes/goals.js";

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to DB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.error(err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);

// Welcome Route
app.get("/", (req, res) => {
    res.send("Personal Finance Tracker API Running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
