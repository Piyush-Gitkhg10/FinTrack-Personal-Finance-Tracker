import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: "/api", // This will be proxied to http://localhost:5001
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
