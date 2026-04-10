import axios from "axios";
import { getToken, clearSession } from "./auth";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: false, // JWT bearer token, not cookies
});

// Automatically attach Bearer token on every request
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401/403 -> clear session and redirect to login
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
            clearSession();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(err);
    }
);

export default api;
