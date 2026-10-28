import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Goal from "../models/Goal.js";

const router = express.Router();

// @desc    Get all goals for logged in user
// @route   GET /api/goals
router.get("/", protect, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a new goal
// @route   POST /api/goals
router.post("/", protect, async (req, res) => {
    const { title, type, targetAmount, currentAmount, deadline } = req.body;
    try {
        const goal = new Goal({
            user: req.user._id,
            title,
            type,
            targetAmount,
            currentAmount,
            deadline,
        });
        const createdGoal = await goal.save();
        res.status(201).json(createdGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
