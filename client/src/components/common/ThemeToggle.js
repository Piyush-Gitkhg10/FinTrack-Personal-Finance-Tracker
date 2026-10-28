import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { ICONS } from "../../assets/icons";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="theme-toggle-container">
            <span className="theme-toggle-label">
                {theme === "light" ? "Light Mode" : "Dark Mode"}
            </span>
            <label className="switch">
                <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
                <span className="slider"></span>
            </label>
        </div>
    );
};

export default ThemeToggle;
