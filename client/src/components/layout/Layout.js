import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Outlet /> {/* This is where nested routes will render */}
            </main>
        </div>
    );
};

export default Layout;
