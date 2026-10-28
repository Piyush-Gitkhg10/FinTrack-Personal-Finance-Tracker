import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// @desc    Get all transactions for logged in user
// @route   GET /api/transactions
router.get("/", protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a new transaction
// @route   POST /api/transactions
router.post("/", protect, async (req, res) => {
    const { title, amount, type, category, date, budget } = req.body;
    try {
        const transaction = new Transaction({
            user: req.user._id,
            title,
            amount,
            type,
            category,
            date,
            budget,
        });
        const createdTransaction = await transaction.save();
        res.status(201).json(createdTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get dashboard summary
// @route   GET /api/transactions/summary
router.get("/summary", protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });

        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach((t) => {
            if (t.type === "income") {
                totalIncome += t.amount;
            } else {
                totalExpenses += t.amount;
            }
        });

        // This is a simplified summary. The UI shows 'Remaining Loan' and 'Total Savings'
        // which come from Goals. We'll fetch goals separately on the frontend.
        const remainingMoney = totalIncome - totalExpenses;

        res.json({
            totalIncome,
            totalExpenses,
            remainingMoney,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
