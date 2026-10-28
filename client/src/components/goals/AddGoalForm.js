import React, { useState } from "react";

const AddGoalForm = ({ onGoalAdded }) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("saving");
    const [targetAmount, setTargetAmount] = useState("");
    const [currentAmount, setCurrentAmount] = useState("0");

    const handleSubmit = (e) => {
        e.preventDefault();
        onGoalAdded({
            title,
            type,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount),
        });
        // Reset form
        setTitle("");
        setType("saving");
        setTargetAmount("");
        setCurrentAmount("0");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Goal Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., New Car"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="type">Goal Type</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    <option value="saving">Saving</option>
                    <option value="loan">Loan</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="targetAmount">Target Amount (₹)</label>
                <input
                    type="number"
                    id="targetAmount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="100000"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="currentAmount">Current Amount (₹)</label>
                <input
                    type="number"
                    id="currentAmount"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    required
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    Add Goal
                </button>
            </div>
        </form>
    );
};

export default AddGoalForm;
