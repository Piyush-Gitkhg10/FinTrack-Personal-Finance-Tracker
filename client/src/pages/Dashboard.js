import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import Card from "../components/common/Card";
import ProgressBar from "../components/common/ProgressBar";
import { ICONS } from "../assets/icons";
import Modal from "../components/common/Modal";
import AddExpenseForm from "../components/dashboard/AddExpenseForm";
import AddIncomeForm from "../components/dashboard/AddIncomeForm";

// Helper to format currency
const formatCurrency = (amount) => {
    if (isNaN(parseFloat(amount))) {
        return `₹0`;
    }
    const value = Math.abs(parseFloat(amount));
    const formatted = new Intl.NumberFormat("en-IN").format(value);
    return (amount < 0 ? "-" : "") + `₹${formatted}`;
};

const getCategoryIcon = (category) => {
    if (category.includes("Food")) return <ICONS.Food />;
    if (category.includes("Beauty")) return <ICONS.Beauty />;
    if (category.includes("Rent")) return <ICONS.Rent />;
    return <ICONS.Expense />;
};

const Dashboard = () => {
    const { user } = useAuth();
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

    const [summary, setSummary] = useState({
        remainingMoney: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        remainingLoan: 0,
    });
    const [transactions, setTransactions] = useState([]); // This will hold category summaries

    // --- THIS FUNCTION IS UPDATED TO GROUP BY CATEGORY ---
    const fetchData = async () => {
        try {
            // Parallel fetch all data
            const [summaryRes, goalsRes, transRes] = await Promise.all([
                api.get("/transactions/summary"),
                api.get("/goals"),
                api.get("/transactions"),
            ]);

            // Process Goals
            let totalSavings = 0;
            let remainingLoan = 0;
            goalsRes.data.forEach((goal) => {
                if (goal.type === "saving") totalSavings += goal.currentAmount;
                if (goal.type === "loan")
                    remainingLoan += goal.targetAmount - goal.currentAmount;
            });

            // --- NEW LOGIC: Group transactions by category ---
            const categoryMap = {};
            const expenses = transRes.data.filter((t) => t.type === "expense");

            expenses.forEach((t) => {
                if (!categoryMap[t.category]) {
                    // First time seeing this category, initialize it
                    categoryMap[t.category] = {
                        _id: t.category,
                        category: t.category,
                        amount: t.amount, // Set initial amount
                        budget: t.budget || 0, // Set initial budget
                    };
                } else {
                    // Category already exists, ADD to it
                    categoryMap[t.category].amount += t.amount;
                    categoryMap[t.category].budget += t.budget || 0; // Sums the budget
                }
            });

            // Set the state to the list of grouped categories
            setTransactions(Object.values(categoryMap));
            // --- END OF NEW LOGIC ---

            // Set Combined Summary
            setSummary({
                ...summaryRes.data,
                totalSavings,
                remainingLoan: -remainingLoan,
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };
    // --- END OF UPDATED FUNCTION ---

    useEffect(() => {
        fetchData();
    }, []);

    const handleExpenseAdded = () => {
        setIsExpenseModalOpen(false);
        fetchData();
    };

    const handleIncomeAdded = () => {
        setIsIncomeModalOpen(false);
        fetchData();
    };

    return (
        <>
            <div className="page-header">
                <h1>Welcome back, {user?.name.split(" ")[0]}!</h1>
                <p>Here's your transaction details.</p>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
                <Card className="summary-card">
                    <p>Remaining Money</p>
                    <h3>{formatCurrency(summary.remainingMoney)}</h3>
                </Card>

                <Card className="summary-card">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}
                    >
                        <div>
                            <p>Total Income</p>
                            <h3 className="income">+{formatCurrency(summary.totalIncome)}</h3>
                        </div>
                        <button
                            onClick={() => setIsIncomeModalOpen(true)}
                            className="btn"
                            style={{
                                padding: "0.5rem 0.6rem",
                                background: "var(--color-accent)",
                                color: "var(--text-light)",
                            }}
                            title="Add Income"
                        >
                            <ICONS.Add size={20} />
                        </button>
                    </div>
                </Card>

                <Card className="summary-card">
                    <p>Total Expenses</p>
                    <h3 className="expense">-{formatCurrency(summary.totalExpenses)}</h3>
                </Card>
                <Card className="summary-card">
                    <p>Total Savings</p>
                    <h3>{formatCurrency(summary.totalSavings)}</h3>
                </Card>
                <Card className="summary-card">
                    <p>Remaining Loan</p>
                    <h3 className="loan">{formatCurrency(summary.remainingLoan)}</h3>
                </Card>
            </div>

            {/* Transaction Breakdown */}
            <Card>
                <div className="card-header">
                    <h2>Transaction Breakdown</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsExpenseModalOpen(true)}
                    >
                        <ICONS.Add /> Add Expense
                    </button>
                </div>

                <div className="transaction-list">
                    {transactions.length > 0 ? (
                        // Map over the category summaries
                        transactions.map((t) => (
                            <TransactionItem key={t._id} transaction={t} />
                        ))
                    ) : (
                        <p
                            style={{
                                textAlign: "center",
                                padding: "1rem 0",
                                color: "var(--text-secondary)",
                            }}
                        >
                            No expenses recorded yet.
                        </p>
                    )}
                </div>
            </Card>

            {/* Modals */}
            <Modal
                isVisible={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                title="Add New Expense"
            >
                <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
            </Modal>

            <Modal
                isVisible={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                title="Add New Income"
            >
                <AddIncomeForm onIncomeAdded={handleIncomeAdded} />
            </Modal>
        </>
    );
};

// --- THIS COMPONENT IS UPDATED TO SHOW THE CATEGORY SUMMARY ---
const TransactionItem = ({ transaction }) => {
    // De-structure the category summary
    const { category, amount, budget } = transaction;

    const spent = amount;
    const left = budget - spent;

    return (
        <div className="transaction-item">
            <div className="transaction-icon">{getCategoryIcon(category)}</div>
            <div className="transaction-details">
                {/* Show the category name (e.g., "Food & Beverages") */}
                <h4>{category}</h4>

                <div className="transaction-info">
                    {/* Show the "Spent X out of Y" summary */}
                    <span>Spent {formatCurrency(spent)}</span>
                    {budget > 0 && <span> out of {formatCurrency(budget)}</span>}
                </div>

                {budget > 0 && <ProgressBar value={spent} max={budget} />}
            </div>
            <div className="transaction-amount">
                {budget > 0 ? (
                    left >= 0 ? (
                        <p className="left">Left {formatCurrency(left)}</p>
                    ) : (
                        <p className="over-budget">Over {formatCurrency(Math.abs(left))}</p>
                    )
                ) : (
                    // If no budget, just show the total amount spent
                    <p className="expense">-{formatCurrency(spent)}</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
