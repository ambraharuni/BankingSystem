import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { clearSession, getSession } from "../auth";
import {
    errMsg,
    formatCurrency,
    formatDateTime,
    statusClassName,
    transactionClassName,
} from "../ui";

function Toast({ toast }) {
    if (!toast.text) return null;
    return <div className={`toast toast-${toast.kind}`}>{toast.text}</div>;
}

export default function ProfessionalTellerDashboard() {
    const nav = useNavigate();
    const { username } = getSession();

    const [dashboard, setDashboard] = useState({
        metrics: {
            totalClients: 0,
            totalAccounts: 0,
            pendingAccounts: 0,
            totalCards: 0,
            pendingCards: 0,
            totalTransactions: 0,
        },
        clients: [],
        accounts: [],
        pendingAccounts: [],
        cards: [],
        pendingCards: [],
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ text: "", kind: "success" });
    const [clientQuery, setClientQuery] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newBirthDate, setNewBirthDate] = useState("");
    const [passwordMap, setPasswordMap] = useState({});
    const [creditInterestMap, setCreditInterestMap] = useState({});

    function show(text, kind = "success") {
        setToast({ text, kind });
        window.clearTimeout(show.timer);
        show.timer = window.setTimeout(() => setToast({ text: "", kind }), 3200);
    }

    async function loadDashboard() {
        setLoading(true);
        try {
            const [dashboardRes, transactionsRes] = await Promise.all([
                api.get("/teller/dashboard"),
                api.get("/teller/transactions"),
            ]);
            setDashboard(dashboardRes.data);
            setTransactions(transactionsRes.data || []);
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

    async function createClient(event) {
        event.preventDefault();
        if (!newUsername.trim() || !newPassword || !newEmail.trim() || !newPhoneNumber.trim() || !newAddress.trim()
            || !newFirstName.trim() || !newLastName.trim() || !newBirthDate) {
            show("Complete the full client profile before creating the account.", "warning");
            return;
        }

        try {
            await api.post("/teller/clients", {
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
            show("Client created successfully.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function updateClientPassword(id) {
        const password = passwordMap[id];
        if (!password) {
            show("Enter a new password before updating the client.", "warning");
            return;
        }

        try {
            await api.put(`/teller/clients/${id}/password`, { password });
            setPasswordMap((current) => ({ ...current, [id]: "" }));
            show("Client password updated.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function deleteClient(id) {
        if (!window.confirm("Delete this client?")) return;
        try {
            await api.delete(`/teller/clients/${id}`);
            show("Client deleted.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function approveAccount(id) {
        try {
            await api.post(`/teller/accounts/${id}/approve`);
            show("Account approved.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function rejectAccount(id) {
        try {
            await api.post(`/teller/accounts/${id}/reject`);
            show("Account rejected.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function approveDebit(id) {
        try {
            await api.post(`/teller/cards/${id}/approve-debit`);
            show("Debit card approved.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function approveCredit(id) {
        const interest = Number(creditInterestMap[id] || 0);
        if (Number.isNaN(interest) || interest < 0) {
            show("Interest must be a valid positive number or zero.", "warning");
            return;
        }

        try {
            await api.post(`/teller/cards/${id}/approve-credit`, { interestPercent: interest });
            show("Credit card approved.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function rejectCard(id) {
        try {
            await api.post(`/teller/cards/${id}/reject`);
            show("Card rejected.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    const filteredClients = useMemo(() => {
        const search = clientQuery.trim().toLowerCase();
        if (!search) return dashboard.clients;
        return dashboard.clients.filter((client) =>
            client.username.toLowerCase().includes(search)
            || String(client.id).includes(search)
            || `${client.firstName || ""} ${client.lastName || ""}`.toLowerCase().includes(search)
            || (client.email || "").toLowerCase().includes(search)
        );
    }, [clientQuery, dashboard.clients]);

    return (
        <div className="portal-page">
            <div className="portal-shell">
                <header className="portal-header">
                    <div>
                        <div className="brand-eyebrow">Teller Workspace</div>
                        <h1 className="brand-title">Front-office operations dashboard</h1>
                        <p className="brand-copy">
                            Open client relationships, approve requested products, monitor account activity, and keep branch operations moving.
                        </p>
                    </div>
                    <div className="header-meta">
                        <span className="meta-pill">Signed in as <strong>{username}</strong></span>
                        <span className="meta-pill">Role <strong>TELLER</strong></span>
                        <button className="btn" onClick={loadDashboard} disabled={loading}>Refresh</button>
                        <button className="btn" onClick={logout}>Logout</button>
                    </div>
                </header>

                <div className="metric-grid">
                    <article className="metric-card">
                        <div className="metric-label">Clients</div>
                        <div className="metric-value">{dashboard.metrics.totalClients}</div>
                        <div className="metric-note">Client records supported by this banking system.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Pending accounts</div>
                        <div className="metric-value">{dashboard.metrics.pendingAccounts}</div>
                        <div className="metric-note">Current account applications awaiting review.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Pending cards</div>
                        <div className="metric-value">{dashboard.metrics.pendingCards}</div>
                        <div className="metric-note">Debit and credit card requests awaiting decision.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Transactions</div>
                        <div className="metric-value">{dashboard.metrics.totalTransactions}</div>
                        <div className="metric-note">System-wide transfer entries available for teller review.</div>
                    </article>
                </div>

                <Toast toast={toast} />

                <div className="panel-grid">
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Client onboarding</div>
                                <h2 className="panel-title">Create client account</h2>
                                <p className="panel-copy">Register new banking clients and issue their initial login credentials.</p>
                            </div>
                        </div>
                        <form className="form-grid" onSubmit={createClient}>
                            <div className="field">
                                <label>Username</label>
                                <input value={newUsername} onChange={(event) => setNewUsername(event.target.value)} placeholder="client.private.001" />
                            </div>
                            <div className="field">
                                <label>First name</label>
                                <input value={newFirstName} onChange={(event) => setNewFirstName(event.target.value)} placeholder="John" />
                            </div>
                            <div className="field">
                                <label>Last name</label>
                                <input value={newLastName} onChange={(event) => setNewLastName(event.target.value)} placeholder="Doe" />
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <input value={newEmail} onChange={(event) => setNewEmail(event.target.value)} placeholder="john.doe@example.com" />
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
                            <button className="btn btn-primary" type="submit">Create client</button>
                        </form>
                    </section>

                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Review queue</div>
                                <h2 className="panel-title">Immediate teller workload</h2>
                                <p className="panel-copy">Prioritize product and account approvals that are currently waiting for teller action.</p>
                            </div>
                        </div>
                        <div className="notice">
                            Pending account requests: <strong>{dashboard.pendingAccounts.length}</strong>
                        </div>
                        <div className="notice">
                            Pending card requests: <strong>{dashboard.pendingCards.length}</strong>
                        </div>
                        <div className="notice">
                            Total open approvals: <strong>{dashboard.pendingAccounts.length + dashboard.pendingCards.length}</strong>
                        </div>
                    </section>
                </div>

                <section className="panel" style={{ marginTop: "18px" }}>
                    <div className="panel-header">
                        <div>
                            <div className="section-label">Client directory</div>
                            <h2 className="panel-title">Manage client users</h2>
                            <p className="panel-copy">Search active clients, rotate passwords, and remove obsolete client records when necessary.</p>
                        </div>
                        <div className="toolbar">
                            <div className="field">
                                <label>Search</label>
                                <input value={clientQuery} onChange={(event) => setClientQuery(event.target.value)} placeholder="Filter by id or username" />
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
                                    {filteredClients.length === 0 ? (
                                        <tr><td colSpan="9" className="empty-state">No clients match the current filter.</td></tr>
                                    ) : filteredClients.map((client) => (
                                        <tr key={client.id}>
                                            <td>{client.id}</td>
                                            <td><strong>{client.username}</strong></td>
                                            <td>{[client.firstName, client.lastName].filter(Boolean).join(" ") || "-"}</td>
                                            <td>{client.email || "-"}</td>
                                            <td>{client.phoneNumber || "-"}</td>
                                            <td>{client.birthDate || "-"}</td>
                                            <td>{client.role}</td>
                                            <td>
                                                <input
                                                    value={passwordMap[client.id] || ""}
                                                    type="password"
                                                    onChange={(event) => setPasswordMap((current) => ({ ...current, [client.id]: event.target.value }))}
                                                    placeholder="New password"
                                                />
                                            </td>
                                            <td>
                                                <div className="actions-row">
                                                    <button className="btn" onClick={() => updateClientPassword(client.id)}>Update password</button>
                                                    <button className="btn btn-danger" onClick={() => deleteClient(client.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <div className="split-grid" style={{ marginTop: "18px" }}>
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Accounts</div>
                                <h2 className="panel-title">Pending account requests</h2>
                                <p className="panel-copy">Approve or reject newly requested current accounts.</p>
                            </div>
                        </div>
                        <div className="table-shell">
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>IBAN</th>
                                            <th>Client</th>
                                            <th>Currency</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.pendingAccounts.length === 0 ? (
                                            <tr><td colSpan="5" className="empty-state">No pending account requests.</td></tr>
                                        ) : dashboard.pendingAccounts.map((account) => (
                                            <tr key={account.id}>
                                                <td><code>{account.iban}</code></td>
                                                <td>{account.ownerUsername}</td>
                                                <td>{account.currency}</td>
                                                <td><span className={statusClassName(account.status)}>{account.status}</span></td>
                                                <td>
                                                    <div className="actions-row">
                                                        <button className="btn btn-primary" onClick={() => approveAccount(account.id)}>Approve</button>
                                                        <button className="btn btn-danger" onClick={() => rejectAccount(account.id)}>Reject</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Cards</div>
                                <h2 className="panel-title">Pending card requests</h2>
                                <p className="panel-copy">Review debit and credit applications, including requested credit pricing.</p>
                            </div>
                        </div>
                        <div className="table-shell">
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Interest %</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.pendingCards.length === 0 ? (
                                            <tr><td colSpan="5" className="empty-state">No pending card requests.</td></tr>
                                        ) : dashboard.pendingCards.map((card) => (
                                            <tr key={card.id}>
                                                <td>{card.ownerUsername}</td>
                                                <td>{card.cardType}</td>
                                                <td><span className={statusClassName(card.status)}>{card.status}</span></td>
                                                <td>
                                                    {card.cardType === "CREDIT" ? (
                                                        <input
                                                            value={creditInterestMap[card.id] || ""}
                                                            onChange={(event) => setCreditInterestMap((current) => ({ ...current, [card.id]: event.target.value }))}
                                                            placeholder="5"
                                                        />
                                                    ) : "-"}
                                                </td>
                                                <td>
                                                    <div className="actions-row">
                                                        {card.cardType === "DEBIT" ? (
                                                            <button className="btn btn-primary" onClick={() => approveDebit(card.id)}>Approve debit</button>
                                                        ) : (
                                                            <button className="btn btn-primary" onClick={() => approveCredit(card.id)}>Approve credit</button>
                                                        )}
                                                        <button className="btn btn-danger" onClick={() => rejectCard(card.id)}>Reject</button>
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

                <div className="split-grid" style={{ marginTop: "18px" }}>
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Accounts overview</div>
                                <h2 className="panel-title">All banking accounts</h2>
                                <p className="panel-copy">Inspect all active, pending, and rejected accounts together with balances and ownership.</p>
                            </div>
                        </div>
                        <div className="table-shell">
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>IBAN</th>
                                            <th>Client</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.accounts.length === 0 ? (
                                            <tr><td colSpan="5" className="empty-state">No accounts found.</td></tr>
                                        ) : dashboard.accounts.map((account) => (
                                            <tr key={account.id}>
                                                <td><code>{account.iban}</code></td>
                                                <td>{account.ownerUsername}</td>
                                                <td>{account.accountType}</td>
                                                <td><span className={statusClassName(account.status)}>{account.status}</span></td>
                                                <td>{formatCurrency(account.balance, account.currency)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Transactions</div>
                                <h2 className="panel-title">Recent bank activity</h2>
                                <p className="panel-copy">Review recent transactions with account, client, counterparty, and reference visibility.</p>
                            </div>
                        </div>
                        <div className="table-shell">
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Posted</th>
                                            <th>Client</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Counterparty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length === 0 ? (
                                            <tr><td colSpan="5" className="empty-state">No transactions recorded.</td></tr>
                                        ) : transactions.slice(0, 12).map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td>{formatDateTime(transaction.createdAt)}</td>
                                                <td>{transaction.ownerUsername}</td>
                                                <td><span className={transactionClassName(transaction.type)}>{transaction.type}</span></td>
                                                <td>{formatCurrency(transaction.amount, transaction.accountCurrency)}</td>
                                                <td><code>{transaction.counterpartyIban}</code></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
