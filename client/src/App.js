import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuth } from "./hooks/useAuth";

// A wrapper for protected routes
function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
}

function App() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Auth Routes */}
            <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
                path="/signup"
                element={user ? <Navigate to="/" replace /> : <SignUpPage />}
            />

            {/* App Routes (Protected) */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="goals" element={<Goals />} />
                <Route path="profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
