import React, { useState } from "react";
import api from "../../services/api";

const AddExpenseForm = ({ onExpenseAdded }) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food & Beverages");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [budget, setBudget] = useState(""); // This is the budget for the category

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newExpense = {
                title,
                amount: parseFloat(amount),
                category,
                date,
                budget: budget ? parseFloat(budget) : 0,
                type: "expense", // Hard-code the type
            };
            await api.post("/transactions", newExpense);
            onExpenseAdded(); // Call the refresh function
        } catch (error) {
            console.error("Error adding expense:", error);
            // You could add error handling state here
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Expense Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Coffee"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="150"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Rent & Housing">Rent & Housing</option>
                    <option value="Beauty & Care">Beauty & Care</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="budget">Category Budget (Optional)</label>
                <input
                    type="number"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., 1000 (total for this category)"
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    Add Expense
                </button>
            </div>
        </form>
    );
};

export default AddExpenseForm;
