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

const accountCurrencies = ["EUR", "USD", "ALL"];

function Toast({ toast }) {
    if (!toast.text) return null;
    return <div className={`toast toast-${toast.kind}`}>{toast.text}</div>;
}

export default function ProfessionalClientDashboard() {
    const nav = useNavigate();
    const { username } = getSession();

    const [toast, setToast] = useState({ text: "", kind: "success" });
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState({
        metrics: {
            totalBalance: 0,
            totalAccounts: 0,
            activeAccounts: 0,
            pendingAccounts: 0,
            activeCards: 0,
            pendingCards: 0,
            transactionCount: 0,
        },
        accounts: [],
        cards: [],
    });
    const [transactions, setTransactions] = useState([]);

    const [currency, setCurrency] = useState("EUR");
    const [fromAccountId, setFromAccountId] = useState("");
    const [toIban, setToIban] = useState("");
    const [amount, setAmount] = useState("");
    const [debitAccountId, setDebitAccountId] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState("");

    function show(text, kind = "success") {
        setToast({ text, kind });
        window.clearTimeout(show.timer);
        show.timer = window.setTimeout(() => setToast({ text: "", kind }), 3200);
    }

    async function loadDashboard() {
        setLoading(true);
        try {
            const [dashboardRes, transactionsRes] = await Promise.all([
                api.get("/client/dashboard"),
                api.get("/client/transactions"),
            ]);
            const nextDashboard = dashboardRes.data;
            setDashboard(nextDashboard);
            setTransactions(transactionsRes.data || []);

            const nextActiveAccounts = (nextDashboard.accounts || []).filter((account) => account.status === "ACTIVE");
            if (!fromAccountId && nextActiveAccounts.length) setFromAccountId(String(nextActiveAccounts[0].id));

            const nextDebitEligible = (nextDashboard.accounts || []).filter(
                (account) => account.status === "ACTIVE" && account.accountType === "CURRENT" && !account.linkedCardId
            );
            if (!debitAccountId && nextDebitEligible.length) setDebitAccountId(String(nextDebitEligible[0].id));
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

    const activeAccounts = useMemo(
        () => dashboard.accounts.filter((account) => account.status === "ACTIVE"),
        [dashboard.accounts]
    );

    const debitEligibleAccounts = useMemo(
        () => dashboard.accounts.filter(
            (account) => account.status === "ACTIVE" && account.accountType === "CURRENT" && !account.linkedCardId
        ),
        [dashboard.accounts]
    );

    async function requestAccount(event) {
        event.preventDefault();
        try {
            await api.post("/client/accounts/request", { currency });
            show("Current account request submitted.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function requestDebitCard(event) {
        event.preventDefault();
        if (!debitAccountId) {
            show("Select an active current account for the debit card request.", "warning");
            return;
        }

        try {
            await api.post("/client/cards/debit/request", { currentAccountId: Number(debitAccountId) });
            show("Debit card request submitted for review.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function requestCreditCard(event) {
        event.preventDefault();
        if (!monthlyIncome) {
            show("Enter monthly income before submitting a credit card request.", "warning");
            return;
        }

        try {
            await api.post("/client/cards/credit/request", { monthlyIncome: Number(monthlyIncome) });
            setMonthlyIncome("");
            show("Credit card request submitted.", "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    async function transfer(event) {
        event.preventDefault();
        if (!fromAccountId || !toIban || !amount) {
            show("Complete the transfer form before submitting.", "warning");
            return;
        }

        try {
            const response = await api.post("/client/transactions/transfer", {
                fromAccountId: Number(fromAccountId),
                toIban: toIban.trim(),
                amount: Number(amount),
            });
            setToIban("");
            setAmount("");
            show(`Transfer submitted successfully. Reference: ${response.data.transferRef}`, "success");
            await loadDashboard();
        } catch (error) {
            show(errMsg(error), "danger");
        }
    }

    return (
        <div className="portal-page">
            <div className="portal-shell">
                <header className="portal-header">
                    <div>
                        <div className="brand-eyebrow">Client Banking</div>
                        <h1 className="brand-title">Personal dashboard</h1>
                        <p className="brand-copy">
                            Review balances, initiate transfers, request debit and credit products, and track your private account activity in one place.
                        </p>
                    </div>
                    <div className="header-meta">
                        <span className="meta-pill">Signed in as <strong>{username}</strong></span>
                        <span className="meta-pill">Role <strong>CLIENT</strong></span>
                        <button className="btn" onClick={loadDashboard} disabled={loading}>Refresh</button>
                        <button className="btn" onClick={logout}>Logout</button>
                    </div>
                </header>

                <div className="hero-grid">
                    <section className="hero-card">
                        <div className="hero-kicker">Portfolio Balance</div>
                        <div className="hero-value">
                            {formatCurrency(dashboard.metrics.totalBalance)}
                            <small>available across all accounts</small>
                        </div>
                        <p className="hero-copy">
                            Your transaction history is scoped to your own banking relationship. Only your personal accounts and cards are shown here.
                        </p>
                        <div className="hero-list">
                            <div className="hero-list-item">
                                <span>Active current and technical accounts</span>
                                <strong>{dashboard.metrics.activeAccounts}</strong>
                            </div>
                            <div className="hero-list-item">
                                <span>Cards currently active</span>
                                <strong>{dashboard.metrics.activeCards}</strong>
                            </div>
                            <div className="hero-list-item">
                                <span>Total transactions recorded</span>
                                <strong>{dashboard.metrics.transactionCount}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="stack">
                        <article className="metric-card">
                            <div className="metric-label">Accounts in review</div>
                            <div className="metric-value">{dashboard.metrics.pendingAccounts}</div>
                            <div className="metric-note">Pending current account applications awaiting teller decision.</div>
                        </article>
                        <article className="metric-card">
                            <div className="metric-label">Cards in review</div>
                            <div className="metric-value">{dashboard.metrics.pendingCards}</div>
                            <div className="metric-note">Debit and credit card applications currently under review.</div>
                        </article>
                    </section>
                </div>

                <div className="metric-grid">
                    <article className="metric-card">
                        <div className="metric-label">Total Accounts</div>
                        <div className="metric-value">{dashboard.metrics.totalAccounts}</div>
                        <div className="metric-note">Current and technical accounts linked to your profile.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Active Accounts</div>
                        <div className="metric-value">{dashboard.metrics.activeAccounts}</div>
                        <div className="metric-note">Accounts available for transfers and product linkage.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Active Cards</div>
                        <div className="metric-value">{dashboard.metrics.activeCards}</div>
                        <div className="metric-note">Debit and credit cards currently issued to you.</div>
                    </article>
                    <article className="metric-card">
                        <div className="metric-label">Transaction Count</div>
                        <div className="metric-value">{dashboard.metrics.transactionCount}</div>
                        <div className="metric-note">Total posted debit and credit movements.</div>
                    </article>
                </div>

                <Toast toast={toast} />

                <div className="panel-grid">
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Payments</div>
                                <h2 className="panel-title">Initiate a transfer</h2>
                                <p className="panel-copy">Transfers are limited to active accounts and currently support same-currency payments only.</p>
                            </div>
                        </div>
                        <form className="form-grid" onSubmit={transfer}>
                            <div className="field">
                                <label>From account</label>
                                <select value={fromAccountId} onChange={(event) => setFromAccountId(event.target.value)}>
                                    {activeAccounts.length === 0 ? <option value="">No active accounts available</option> : null}
                                    {activeAccounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.iban} | {account.currency} | {formatCurrency(account.balance, account.currency)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label>Destination IBAN</label>
                                <input value={toIban} onChange={(event) => setToIban(event.target.value)} placeholder="Enter beneficiary IBAN" />
                            </div>
                            <div className="field">
                                <label>Amount</label>
                                <input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="250.00" />
                            </div>
                            <div className="actions-row">
                                <button className="btn btn-primary" type="submit">Submit transfer</button>
                            </div>
                        </form>
                    </section>

                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Products</div>
                                <h2 className="panel-title">Apply for banking products</h2>
                                <p className="panel-copy">Request new current accounts, debit cards, and credit cards from your personal dashboard.</p>
                            </div>
                        </div>
                        <div className="stack">
                            <form className="form-grid" onSubmit={requestAccount}>
                                <div className="field">
                                    <label>Current account currency</label>
                                    <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                                        {accountCurrencies.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className="btn btn-primary" type="submit">Request current account</button>
                            </form>

                            <form className="form-grid" onSubmit={requestDebitCard}>
                                <div className="field">
                                    <label>Debit card account</label>
                                    <select value={debitAccountId} onChange={(event) => setDebitAccountId(event.target.value)}>
                                        {debitEligibleAccounts.length === 0 ? <option value="">No eligible account available</option> : null}
                                        {debitEligibleAccounts.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.iban} | {account.currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button className="btn" type="submit">Request debit card</button>
                            </form>

                            <form className="form-grid" onSubmit={requestCreditCard}>
                                <div className="field">
                                    <label>Monthly income</label>
                                    <input
                                        value={monthlyIncome}
                                        onChange={(event) => setMonthlyIncome(event.target.value)}
                                        placeholder="Enter monthly income"
                                    />
                                </div>
                                <button className="btn" type="submit">Request credit card</button>
                            </form>
                        </div>
                    </section>
                </div>

                <div className="split-grid">
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <div className="section-label">Accounts</div>
                                <h2 className="panel-title">Your banking accounts</h2>
                                <p className="panel-copy">Operational balances, status, and account-type visibility for each owned account.</p>
                            </div>
                        </div>
                        <div className="table-shell">
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>IBAN</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.accounts.length === 0 ? (
                                            <tr><td colSpan="4" className="empty-state">No accounts found.</td></tr>
                                        ) : dashboard.accounts.map((account) => (
                                            <tr key={account.id}>
                                                <td><code>{account.iban}</code></td>
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
                                <div className="section-label">Cards</div>
                                <h2 className="panel-title">Issued and requested cards</h2>
                                <p className="panel-copy">Track debit and credit card requests together with linked accounts.</p>
                            </div>
                        </div>
                        <div className="table-shell">
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Linked account</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.cards.length === 0 ? (
                                            <tr><td colSpan="3" className="empty-state">No cards found.</td></tr>
                                        ) : dashboard.cards.map((card) => (
                                            <tr key={card.id}>
                                                <td>{card.cardType}</td>
                                                <td><span className={statusClassName(card.status)}>{card.status}</span></td>
                                                <td>{card.linkedAccountIban ? <code>{card.linkedAccountIban}</code> : "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="panel" style={{ marginTop: "18px" }}>
                    <div className="panel-header">
                        <div>
                            <div className="section-label">Transactions</div>
                            <h2 className="panel-title">Private transaction history</h2>
                            <p className="panel-copy">Only your own account movements are shown here. Counterparty IBANs and transfer references remain attached to each entry.</p>
                        </div>
                    </div>
                    <div className="table-shell">
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Posted</th>
                                        <th>Account</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Counterparty</th>
                                        <th>Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr><td colSpan="6" className="empty-state">No transactions recorded yet.</td></tr>
                                    ) : transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>{formatDateTime(transaction.createdAt)}</td>
                                            <td><code>{transaction.accountIban}</code></td>
                                            <td><span className={transactionClassName(transaction.type)}>{transaction.type}</span></td>
                                            <td>{formatCurrency(transaction.amount, transaction.accountCurrency)}</td>
                                            <td><code>{transaction.counterpartyIban}</code></td>
                                            <td><code>{transaction.transferRef}</code></td>
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
