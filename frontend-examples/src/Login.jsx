import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { setSession } from "./auth";
import "./Login.css";

function extractToken(data) {
    if (!data) return null;
    return data.token || data.accessToken || data.jwt || null;
}

function extractRole(data) {
    if (!data) return null;
    return data.role || data?.user?.role || null;
}

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", { username, password });

            const token = extractToken(res.data);
            const role = extractRole(res.data);

            // Store token, role, AND username for dashboards
            setSession({ token, role, username });

            if (role === "ADMIN") nav("/admin", { replace: true });
            else if (role === "TELLER") nav("/teller", { replace: true });
            else nav("/client", { replace: true });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 403) setErr("Forbidden – check credentials or login endpoint.");
            else if (status === 401) setErr("Invalid username or password.");
            else setErr("Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Banking System</h1>
                <p className="login-subtitle">Sign in with your credentials to continue.</p>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="field">
                        <label>Username</label>
                        <input
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            placeholder="e.g. admin"
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button className="primary-btn" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                {err ? <div className="error-box">{err}</div> : null}
            </div>
        </div>
    );
}
