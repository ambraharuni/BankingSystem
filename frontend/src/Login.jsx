import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { setSession } from "./auth";

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

    const handleLogin = async (event) => {
        event.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { username, password });

            const token = extractToken(response.data);
            const role = extractRole(response.data);

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
                <div className="login-aside">
                    <div className="login-badge">Professional Banking Workspace</div>
                    <h1 className="login-title">Private banking operations for clients, tellers, and administrators.</h1>
                    <p className="login-subtitle">
                        Monitor balances, approve products, and manage internal workflows from one secure portal.
                    </p>

                    <div className="login-copy">
                        <div className="login-stat">
                            <strong>Role-specific dashboards</strong>
                            <span>Clients see only their own accounts and transactions. Tellers and administrators work from dedicated operational views.</span>
                        </div>
                        <div className="login-stat">
                            <strong>Scoped transaction visibility</strong>
                            <span>Customer transaction history is isolated by account owner and no longer exposed through raw entity responses.</span>
                        </div>
                        <div className="login-stat">
                            <strong>Approval-driven workflows</strong>
                            <span>Current accounts, debit cards, and credit cards move through explicit request and review stages.</span>
                        </div>
                    </div>
                </div>

                <div className="login-main">
                    <div className="brand-eyebrow">Secure Sign-In</div>
                    <h2 className="panel-title" style={{ fontSize: "2rem", margin: 0 }}>Access your banking role</h2>
                    <p className="login-subtitle">Use your issued credentials to continue to the correct workspace.</p>

                    <form className="login-form" onSubmit={handleLogin}>
                    <div className="field">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                            placeholder="e.g. admin"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <div className="field">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                    <div className="small-note" style={{ marginTop: "18px" }}>
                        Default seeded administrator account: <strong>admin</strong> / <strong>admin123</strong>
                    </div>

                    {err ? <div className="error-box">{err}</div> : null}
                </div>
            </div>
        </div>
    );
}
