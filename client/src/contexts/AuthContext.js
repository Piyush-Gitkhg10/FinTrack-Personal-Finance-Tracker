import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwt_decode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    // Fetch user profile to verify
                    api.get("/auth/profile")
                        .then((res) => setUser(res.data))
                        .catch(() => logout());
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setUser({ _id: data._id, name: data.name, email: data.email });
    };

    const signup = async (name, email, password) => {
        const { data } = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setUser({ _id: data._id, name: data.name, email: data.email });
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
