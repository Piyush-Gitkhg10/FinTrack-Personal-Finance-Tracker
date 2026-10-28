import React, { useState, useEffect } from "react";
import Card from "../components/common/Card";
import ExpenseChart from "../components/statistics/ExpenseChart";
import { ICONS } from "../assets/icons";
import api from "../services/api";

// Helper array for chart colors
const CHART_COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
    "#ffc0cb",
];

// --- Helper Function to Get Date Text (NOW ACCEPTS A DATE) ---
const getDynamicDateText = (timeframe, baseDate) => {
    const now = new Date(baseDate); // Use the date from state

    // Options for formatting
    const shortDate = { month: "short", day: "numeric" };
    const longDate = { year: "numeric", month: "long", day: "numeric" };
    const monthYear = { year: "numeric", month: "long" };

    switch (timeframe) {
        case "Daily":
            return now.toLocaleDateString("en-IN", longDate); // e.g., "28 October 2025"

        case "Weekly":
            const today = new Date(now.setHours(0, 0, 0, 0));
            const firstDayOfWeek = new Date(today);
            const dayOfWeek = today.getDay();
            const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            firstDayOfWeek.setDate(diff);

            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

            // e.g., "27 Oct - 2 Nov, 2025"
            return `${firstDayOfWeek.toLocaleDateString(
                "en-IN",
                shortDate
            )} - ${lastDayOfWeek.toLocaleDateString("en-IN", {
                ...shortDate,
                year: "numeric",
            })}`;

        case "Monthly":
            return now.toLocaleDateString("en-IN", monthYear); // e.g., "October 2025"

        case "Yearly":
            return now.getFullYear().toString(); // e.g., "2025"

        default:
            return "Your financial summary.";
    }
};
// --- End Helper Function ---

const Statistics = () => {
    const [timeframe, setTimeframe] = useState("Monthly");
    const [viewType, setViewType] = useState("expense");
    const tabs = ["Daily", "Weekly", "Monthly", "Yearly"];

    // --- LIVE DATA LOGIC ---
    const [allTransactions, setAllTransactions] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [total, setTotal] = useState(0);
    const [dateRangeText, setDateRangeText] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date()); // <-- 1. ADD DATE STATE
    const [isNextDisabled, setIsNextDisabled] = useState(true); // Disable "next" by default

    // Fetch ALL transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get("/transactions");
                setAllTransactions(res.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchTransactions();
    }, []);

    // Process data
    useEffect(() => {
        // 2. USE currentDate as the base for all calculations
        const now = new Date(currentDate);
        const today = new Date(new Date().setHours(0, 0, 0, 0)); // Today's actual date
        const periodStart = new Date(now.setHours(0, 0, 0, 0));

        // Update the date text
        setDateRangeText(getDynamicDateText(timeframe, currentDate));

        let periodEnd = new Date(periodStart);

        // Determine the start and end of the selected period
        switch (timeframe) {
            case "Daily":
                periodEnd.setDate(periodStart.getDate() + 1);
                break;
            case "Weekly":
                const dayOfWeek = periodStart.getDay();
                const diff = periodStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                periodStart.setDate(diff); // Set to Monday
                periodEnd = new Date(periodStart);
                periodEnd.setDate(periodStart.getDate() + 7); // End of the week
                break;
            case "Monthly":
                periodStart.setDate(1); // First day of the month
                periodEnd = new Date(periodStart);
                periodEnd.setMonth(periodStart.getMonth() + 1); // First day of next month
                break;
            case "Yearly":
                periodStart.setMonth(0, 1); // Jan 1st
                periodEnd = new Date(periodStart);
                periodEnd.setFullYear(periodStart.getFullYear() + 1); // Jan 1st of next year
                break;
            default:
                break;
        }

        // Disable the "next" button if the period end is in the future
        setIsNextDisabled(periodEnd > today);

        // Filter by viewType FIRST
        const typeFilteredTransactions = allTransactions.filter((t) => t.type === viewType);

        // Filter by timeframe
        const filteredTransactions = typeFilteredTransactions.filter((t) => {
            const transactionDate = new Date(t.date);
            // Check if transaction is within the calculated period
            return transactionDate >= periodStart && transactionDate < periodEnd;
        });

        // Group by category and sum amounts
        const categoryMap = new Map();
        let newTotal = 0;
        filteredTransactions.forEach((t) => {
            const currentAmount = categoryMap.get(t.category) || 0;
            categoryMap.set(t.category, currentAmount + t.amount);
            newTotal += t.amount;
        });

        const formattedData = Array.from(categoryMap.entries()).map(
            ([name, value], index) => ({
                name,
                value,
                fill: CHART_COLORS[index % CHART_COLORS.length],
            })
        );

        setChartData(formattedData);
        setTotal(newTotal);

        // 3. Re-run logic when currentDate changes
    }, [timeframe, allTransactions, viewType, currentDate]);
    // --- END LIVE DATA LOGIC ---

    // --- 4. DATE NAVIGATION HANDLERS ---
    const handlePrevDate = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            switch (timeframe) {
                case "Daily":
                    newDate.setDate(newDate.getDate() - 1);
                    break;
                case "Weekly":
                    newDate.setDate(newDate.getDate() - 7);
                    break;
                case "Monthly":
                    newDate.setDate(1); // Go to start of month
                    newDate.setMonth(newDate.getMonth() - 1); // Go to prev month
                    break;
                case "Yearly":
                    newDate.setFullYear(newDate.getFullYear() - 1);
                    break;
                default:
                    break;
            }
            return newDate;
        });
    };

    const handleNextDate = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            switch (timeframe) {
                case "Daily":
                    newDate.setDate(newDate.getDate() + 1);
                    break;
                case "Weekly":
                    newDate.setDate(newDate.getDate() + 7);
                    break;
                case "Monthly":
                    newDate.setDate(1); // Go to start of month
                    newDate.setMonth(newDate.getMonth() + 1); // Go to next month
                    break;
                case "Yearly":
                    newDate.setFullYear(newDate.getFullYear() + 1);
                    break;
                default:
                    break;
            }
            return newDate;
        });
    };
    // --- END HANDLERS ---

    return (
        <>
            <div className="page-header">
                <h1>{viewType === "expense" ? "Expense Breakdown" : "Income Breakdown"}</h1>

                {/* --- 5. ADD DATE NAVIGATOR UI --- */}
                <div className="date-navigator">
                    <button onClick={handlePrevDate}>&lt;</button>
                    <p>{dateRangeText}</p>
                    <button onClick={handleNextDate} disabled={isNextDisabled}>
                        &gt;
                    </button>
                </div>
            </div>

            <Card>
                {/* --- DYNAMIC TABS --- */}
                <div
                    className="stats-header"
                    style={{ flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}
                >
                    {/* Income/Expense Toggle */}
                    <div className="stats-tabs">
                        <button
                            className={`stats-tab ${viewType === "expense" ? "active" : ""}`}
                            onClick={() => setViewType("expense")}
                        >
                            Expenses
                        </button>
                        <button
                            className={`stats-tab ${viewType === "income" ? "active" : ""}`}
                            onClick={() => setViewType("income")}
                        >
                            Income
                        </button>
                    </div>

                    {/* Timeframe Toggle */}
                    <div className="stats-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`stats-tab ${timeframe === tab ? "active" : ""}`}
                                onClick={() => setTimeframe(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="stats-chart-container">
                    <ExpenseChart data={chartData} />
                    <div className="chart-center-text">
                        <p>{viewType === "expense" ? "Total Spent" : "Total Earned"}</p>
                        <h3>₹{new Intl.NumberFormat("en-IN").format(total)}</h3>
                    </div>
                </div>

                <div className="transaction-list" style={{ marginTop: "2rem" }}>
                    {chartData.length > 0 ? (
                        chartData.map((item) => (
                            <div className="transaction-item" key={item.name}>
                                <div
                                    className="transaction-icon"
                                    style={{ backgroundColor: item.fill, color: "white" }}
                                >
                                    {viewType === "expense" ? (
                                        <ICONS.Expense />
                                    ) : (
                                        <ICONS.Income />
                                    )}
                                </div>
                                <div className="transaction-details">
                                    <h4>{item.name}</h4>
                                </div>
                                <div className="transaction-amount">
                                    <p>₹{item.value}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                            No {viewType === "expense" ? "expenses" : "income"} recorded for
                            this period.
                        </p>
                    )}
                </div>
            </Card>
        </>
    );
};

export default Statistics;
