import React, { useState } from "react";
import api from "../../services/api";

const AddIncomeForm = ({ onIncomeAdded }) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Salary");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newIncome = {
                title,
                amount: parseFloat(amount),
                category,
                date,
                type: "income", // Hard-code the type
            };
            await api.post("/transactions", newIncome);
            onIncomeAdded(); // Call the refresh function
        } catch (error) {
            console.error("Error adding income:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="income-title">Income Title</label>
                <input
                    type="text"
                    id="income-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Monthly Salary"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="income-amount">Amount (₹)</label>
                <input
                    type="number"
                    id="income-amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50000"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="income-category">Category</label>
                <select
                    id="income-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investment">Investment</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="income-date">Date</label>
                <input
                    type="date"
                    id="income-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    Add Income
                </button>
            </div>
        </form>
    );
};

export default AddIncomeForm;
