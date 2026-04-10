import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { clearSession, getSession } from "../auth";
import { errMsg } from "../ui";

function Toast({ toast }) {
    if (!toast.text) return null;
    return <div className={`toast toast-${toast.kind}`}>{toast.text}</div>;
}

export default function ProfessionalAdminDashboard() {
    const nav = useNavigate();
    const { username } = getSession();

    const [dashboard, setDashboard] = useState({
        metrics: {
            totalTellers: 0,
            totalClients: 0,
            totalAccounts: 0,
            totalCards: 0,
            totalTransactions: 0,
        },
        tellers: [],
    });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ text: "", kind: "success" });
    const [query, setQuery] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newBirthDate, setNewBirthDate] = useState("");
    const [passwordMap, setPasswordMap] = useState({});

    function show(text, kind = "success") {
        setToast({ text, kind });
        window.clearTimeout(show.timer);
        show.timer = window.setTimeout(() => setToast({ text: "", kind }), 3200);
    }

    async function loadDashboard() {
        setLoading(true);
        try {
            const response = await api.get("/admin/dashboard");
            setDashboard(response.data);
        } catch (error) {
            show(errMsg(error), "danger");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    function logout() {
        clearSession();
        nav("/login", { replace: true });
    }

    async function createTeller(event) {
        event.preventDefault();
        if (!newUsername.trim() || !newPassword || !newEmail.trim() || !newPhoneNumber.trim() || !newAddress.trim()
            || !newFirstName.trim() || !newLastName.trim() || !newBirthDate) {
            show("Complete the full teller profile before creating the account.", "warning");
            return;
        }

        try {
            await api.post("/admin/tellers", {
                username: newUsername.trim(),
                password: newPassword,
                email: newEmail.trim(),
                phoneNumber: newPhoneNumber.trim(),
                address: newAddress.trim(),
                firstName: newFirstName.trim(),
                lastName: newLastName.trim(),
                birthDate: newBirthDate,
            });
            setNewUsername("");
            setNewPassword("");
            setNewEmail("");
            setNewPhoneNumber("");
            setNewAddress("");
            setNewFirstName("");
            setNewLastName("");
            setNewBirthDate("");
            show("Teller created successfully.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function updatePassword(id) {
        const password = passwordMap[id];
        if (!password) {
            show("Enter a new password before updating.", "warning");
            return;
        }

        try {
            await api.put(`/admin/tellers/${id}/password`, { password });
            setPasswordMap((current) => ({ ...current, [id]: "" }));
            show("Teller password updated.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function deleteTeller(id) {
        if (!window.confirm("Delete this teller account?")) return;
        try {
            await api.delete(`/admin/tellers/${id}`);
            show("Teller deleted.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    const filteredTellers = useMemo(() => {
        const search = query.trim().toLowerCase();
        if (!search) return dashboard.tellers;
        return dashboard.tellers.filter((teller) =>
            teller.username.toLowerCase().includes(search)
            || String(teller.id).includes(search)
            || `${teller.firstName || ""} ${teller.lastName || ""}`.toLowerCase().includes(search)
            || (teller.email || "").toLowerCase().includes(search)
        );
    }, [dashboard.tellers, query]);

    return (
        <div className="portal-page">
            <div className="portal-shell">
                <header className="portal-header">
                    <div>
                        <div className="brand-eyebrow">Administration</div>
                        <h1 className="brand-title">Operations command center</h1>
                        <p className="brand-copy">
                            Manage teller access, review system-wide banking volumes, and keep operational staffing under administrative control.
                        </p>
                    </div>
                    <div className="header-meta">
                        <span className="meta-pill">Signed in as <strong>{username}</strong></span>
                        <span className="meta-pill">Role <strong>ADMIN</strong></span>
                        <button className="btn" onClick={loadDashboard} disabled={loading}>Refresh</button>
                        <button className="btn" onClick={logout}>Logout</button>
                    </div>
                </header>

                <div className="metric-grid">
                    <article className="metric-card">
                        <div className="metric-label">Tellers</div>
                        <div className="metric-value">{dashboard.metrics.totalTellers}</div>
                        <div className="metric-note">Active teller users available for front-line banking operations.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Clients</div>
                        <div className="metric-value">{dashboard.metrics.totalClients}</div>
                        <div className="metric-note">Bank clients currently managed in the system.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Accounts</div>
                        <div className="metric-value">{dashboard.metrics.totalAccounts}</div>
                        <div className="metric-note">Current and technical accounts across the bank.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Transactions</div>
                        <div className="metric-value">{dashboard.metrics.totalTransactions}</div>
                        <div className="metric-note">Total posted transaction entries in the platform.</div>
                    </article>
                </div>

                <Toast toast={toast} />

                <div className="panel-grid">
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Access management</div>
                                <h2 className="panel-title">Create teller access</h2>
                                <p className="panel-copy">Provision new teller users with role-specific access to client onboarding and approval workflows.</p>
                            </div>
                        </div>
                        <form className="form-grid" onSubmit={createTeller}>
                            <div className="field">
                                <label>Username</label>
                                <input value={newUsername} onChange={(event) => setNewUsername(event.target.value)} placeholder="teller.north.branch" />
                            </div>
                            <div className="field">
                                <label>First name</label>
                                <input value={newFirstName} onChange={(event) => setNewFirstName(event.target.value)} placeholder="Anna" />
                            </div>
                            <div className="field">
                                <label>Last name</label>
                                <input value={newLastName} onChange={(event) => setNewLastName(event.target.value)} placeholder="Kola" />
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <input value={newEmail} onChange={(event) => setNewEmail(event.target.value)} placeholder="anna.kola@bank.local" />
                            </div>
                            <div className="field">
                                <label>Telephone number</label>
                                <input value={newPhoneNumber} onChange={(event) => setNewPhoneNumber(event.target.value)} placeholder="+355 69 123 4567" />
                            </div>
                            <div className="field">
                                <label>Address</label>
                                <input value={newAddress} onChange={(event) => setNewAddress(event.target.value)} placeholder="Street, city, country" />
                            </div>
                            <div className="field">
                                <label>Birthday</label>
                                <input type="date" value={newBirthDate} onChange={(event) => setNewBirthDate(event.target.value)} />
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    placeholder="Create a secure password"
                                />
                            </div>
                            <button className="btn btn-primary" type="submit">Create teller</button>
                        </form>
                    </section>

                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Oversight</div>
                                <h2 className="panel-title">Platform snapshot</h2>
                                <p className="panel-copy">Administrative oversight over internal staffing and core banking inventory.</p>
                            </div>
                        </div>
                        <div className="notice">
                            Total cards in circulation or review: <strong>{dashboard.metrics.totalCards}</strong>
                        </div>
                        <div className="notice">
                            Internal teller-to-client coverage ratio: <strong>{dashboard.metrics.totalTellers === 0 ? "N/A" : (dashboard.metrics.totalClients / dashboard.metrics.totalTellers).toFixed(1)}</strong>
                        </div>
                        <div className="notice">
                            Use this dashboard for privileged access management only. Day-to-day client approvals remain in the teller workspace.
                        </div>
                    </section>
                </div>

                <section className="panel" style={{ marginTop: "18px" }}>
                    <div className="panel-header">
                        <div>
                            <div className="section-label">Teller directory</div>
                            <h2 className="panel-title">Manage teller accounts</h2>
                            <p className="panel-copy">Update teller credentials, search operational staff, and retire teller access when required.</p>
                        </div>
                        <div className="toolbar">
                            <div className="field">
                                <label>Search</label>
                                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by id or username" />
                            </div>
                        </div>
                    </div>

                    <div className="table-shell">
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Birthday</th>
                                        <th>Role</th>
                                        <th>New password</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTellers.length === 0 ? (
                                        <tr><td colSpan="9" className="empty-state">No teller accounts match the current filter.</td></tr>
                                    ) : filteredTellers.map((teller) => (
                                        <tr key={teller.id}>
                                            <td>{teller.id}</td>
                                            <td><strong>{teller.username}</strong></td>
                                            <td>{[teller.firstName, teller.lastName].filter(Boolean).join(" ") || "-"}</td>
                                            <td>{teller.email || "-"}</td>
                                            <td>{teller.phoneNumber || "-"}</td>
                                            <td>{teller.birthDate || "-"}</td>
                                            <td>{teller.role}</td>
                                            <td>
                                                <input
                                                    value={passwordMap[teller.id] || ""}
                                                    type="password"
                                                    onChange={(event) => setPasswordMap((current) => ({ ...current, [teller.id]: event.target.value }))}
                                                    placeholder="New password"
                                                />
                                            </td>
                                            <td>
                                                <div className="actions-row">
                                                    <button className="btn" onClick={() => updatePassword(teller.id)}>Update password</button>
                                                    <button className="btn btn-danger" onClick={() => deleteTeller(teller.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
