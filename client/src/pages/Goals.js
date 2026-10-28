import React, { useState, useEffect } from "react"; // Import useEffect
import Card from "../components/common/Card";
import ProgressBar from "../components/common/ProgressBar";
import { ICONS } from "../assets/icons";
import Modal from "../components/common/Modal";
import AddGoalForm from "../components/goals/AddGoalForm";
import api from "../services/api"; // Import api

// --- MOCK DATA (COMMENTED OUT) ---
/*
const mockSavings = [
  { _id: 's1', title: 'House', currentAmount: 5000, targetAmount: 10000 },
  { _id: 's2', title: 'Wedding', currentAmount: 425, targetAmount: 1000 },
  { _id: 's3', title: 'General Savings', currentAmount: 290, targetAmount: 1230 },
];
const mockLoans = [
  { _id: 'l1', title: 'Study Loan', currentAmount: 5797, targetAmount: 46000 },
];
*/

const formatCurrency = (amount) => {
    return `₹${new Intl.NumberFormat("en-IN").format(amount)}`;
};

const Goals = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- LIVE DATA STATE ---
    const [savings, setSavings] = useState([]);
    const [loans, setLoans] = useState([]);

    // --- Data Fetching Function ---
    const fetchGoals = async () => {
        try {
            const res = await api.get("/goals");
            setSavings(res.data.filter((g) => g.type === "saving"));
            setLoans(res.data.filter((g) => g.type === "loan"));
        } catch (error) {
            console.error("Error fetching goals:", error);
        }
    };

    // --- Fetch data on component load ---
    useEffect(() => {
        fetchGoals();
    }, []);

    const totalSavings = savings.reduce((acc, s) => acc + s.currentAmount, 0);
    // Note: For loans, we show remaining, not amount paid
    const totalLoans = loans.reduce((acc, l) => acc + (l.targetAmount - l.currentAmount), 0);

    const handleGoalAdded = async (newGoalData) => {
        try {
            // 1. Post new goal to API
            await api.post("/goals", newGoalData);
            // 2. Close modal and refresh data
            setIsModalOpen(false);
            fetchGoals();
        } catch (error) {
            console.error("Error adding goal:", error);
            // You could add error state here
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>Goals Breakdown</h1>
                <p>Here's your goals summary.</p>
            </div>

            {/* Summary Cards */}
            <div
                className="summary-grid"
                style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "2rem" }}
            >
                <Card className="summary-card">
                    <p>Total Savings</p>
                    <h3>{formatCurrency(totalSavings)}</h3>
                </Card>
                <Card className="summary-card">
                    <p>Remaining Loan</p>
                    <h3 className="loan">-{formatCurrency(totalLoans)}</h3>
                </Card>
            </div>

            {/* Goals Grid */}
            <div className="goals-grid">
                <Card>
                    <div className="card-header">
                        <h2>Savings</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <ICONS.Add /> Add Saving
                        </button>
                    </div>
                    <div className="goal-list">
                        {savings.length > 0 ? (
                            savings.map((goal) => <GoalItem key={goal._id} goal={goal} />)
                        ) : (
                            <p
                                style={{
                                    textAlign: "center",
                                    padding: "1rem 0",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                No savings goals yet.
                            </p>
                        )}
                    </div>
                </Card>
                <Card>
                    <div className="card-header">
                        <h2>Loans</h2>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <ICONS.Add /> Add Loan
                        </button>
                    </div>
                    <div className="goal-list">
                        {loans.length > 0 ? (
                            loans.map((goal) => <GoalItem key={goal._id} goal={goal} />)
                        ) : (
                            <p
                                style={{
                                    textAlign: "center",
                                    padding: "1rem 0",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                No loan goals yet.
                            </p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Add Goal Modal */}
            <Modal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Goal"
            >
                <AddGoalForm onGoalAdded={handleGoalAdded} />
            </Modal>
        </>
    );
};

const GoalItem = ({ goal }) => {
    const { title, currentAmount, targetAmount } = goal;
    const percentage = (currentAmount / targetAmount) * 100;

    const getIcon = (title) => {
        if (title.includes("House")) return <ICONS.House />;
        if (title.includes("Wedding")) return <ICONS.Wedding />;
        if (title.includes("Study")) return <ICONS.StudyLoan />;
        return <ICONS.GeneralSavings />;
    };

    return (
        <div className="goal-item transaction-item">
            {" "}
            {/* Re-using styles */}
            <div className="transaction-icon">{getIcon(title)}</div>
            <div className="transaction-details">
                <div className="goal-item-header">
                    <h4>{title}</h4>
                    <span>{percentage.toFixed(0)}%</span>
                </div>
                <ProgressBar value={currentAmount} max={targetAmount} />
                <div className="goal-item-progress">
                    <span className="current">{formatCurrency(currentAmount)}</span>
                    <span>Target: {formatCurrency(targetAmount)}</span>
                </div>
            </div>
        </div>
    );
};

export default Goals;
