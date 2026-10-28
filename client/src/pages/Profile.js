import React from "react";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/common/Card";
import { ICONS } from "../assets/icons";

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <>
            <div className="page-header">
                <h1>Profile</h1>
                <p>Manage your account settings.</p>
            </div>
            <Card>
                <div
                    className="profile-details"
                    style={{ textAlign: "center", padding: "2rem" }}
                >
                    <img
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`}
                        alt="avatar"
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            marginBottom: "1rem",
                            border: "3px solid var(--color-primary)",
                        }}
                    />
                    <h2>{user?.name}</h2>
                    <p className="text-secondary">{user?.email}</p>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: "2rem", backgroundColor: "var(--color-danger)" }}
                        onClick={logout}
                    >
                        <ICONS.Logout /> Logout
                    </button>
                </div>
            </Card>
        </>
    );
};

export default Profile;
