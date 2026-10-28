import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["saving", "loan"],
            required: true,
        },
        targetAmount: {
            type: Number,
            required: true,
        },
        currentAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        deadline: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Goal = mongoose.model("Goal", GoalSchema);
export default Goal;
