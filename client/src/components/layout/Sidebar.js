import React from "react";
import { NavLink } from "react-router-dom";
import { ICONS } from "../../assets/icons";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <nav className="sidebar">
            <div className="sidebar-logo">
                <ICONS.Savings size={30} />
                <span className="sidebar-logo-text">FinTrack</span>
            </div>

            <ul className="sidebar-nav">
                <li>
                    <NavLink to="/" end className="sidebar-nav-link">
                        <ICONS.Home className="sidebar-nav-icon" />
                        <span className="sidebar-nav-text">Home</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/statistics" className="sidebar-nav-link">
                        <ICONS.Statistics className="sidebar-nav-icon" />
                        <span className="sidebar-nav-text">Statistics</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/goals" className="sidebar-nav-link">
                        <ICONS.Goals className="sidebar-nav-icon" />
                        <span className="sidebar-nav-text">Goals</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile" className="sidebar-nav-link">
                        <ICONS.Profile className="sidebar-nav-icon" />
                        <span className="sidebar-nav-text">Profile</span>
                    </NavLink>
                </li>
            </ul>

            <ThemeToggle />
        </nav>
    );
};

export default Sidebar;
