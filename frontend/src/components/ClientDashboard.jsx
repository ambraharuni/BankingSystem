import { useEffect, useState } from "react";
import api from "../api";
import { ui, errMsg } from "../ui";
import { clearSession, getSession } from "../auth";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
    const nav = useNavigate();
    const { username } = getSession();

    const [tab, setTab] = useState("accounts");
    const [toast, setToast] = useState({ text: "", kind: "ok" });
    const [loading, setLoading] = useState(false);

    const [accounts, setAccounts] = useState([]);
    const [cards, setCards] = useState([]);
    const [txns, setTxns] = useState([]);

    const [fromAccountId, setFromAccountId] = useState("");
    const [toIban, setToIban] = useState("");
    const [amount, setAmount] = useState("");

    const [currency, setCurrency] = useState("EUR");

    function show(text, kind = "ok") {
        setToast({ text, kind });
        setTimeout(() => setToast({ text: "", kind }), 2600);
    }

    function logout() {
        clearSession();
        nav("/login");
    }

    async function loadAll() {
        setLoading(true);
        try {
            const [a, c, t] = await Promise.all([
                api.get("/client/accounts"),
                api.get("/client/cards"),
                api.get("/client/transactions"),
            ]);
            setAccounts(a.data || []);
            setCards(c.data || []);
            setTxns(t.data || []);
            if (!fromAccountId && (a.data || []).length) setFromAccountId(String(a.data[0].id));
        } catch (e) {
            show(errMsg(e), "bad");
        } finally {
            setLoading(false);
        }
    }

    async function requestAccount() {
        try {
            await api.post("/client/accounts/request", { currency });
            show("✅ Account request created!", "ok");
            loadAll();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    async function transfer() {
        if (!fromAccountId || !toIban || !amount) return show("Fill in all transfer fields.", "warn");
        try {
            const res = await api.post("/client/transactions/transfer", {
                fromAccountId: Number(fromAccountId),
                toIban,
                amount: Number(amount),
            });
            show(`✅ Transfer success • Ref: ${res.data?.transferRef}`, "ok");
            setToIban("");
            setAmount("");
            loadAll();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0);

    return (
        <div style={ui.page}>
            <div style={ui.shell}>
                <div style={ui.topbar}>
                    <div style={ui.brand}>
                        <div style={{ fontSize: 18, fontWeight: 1000 }}>💳 Client Portal</div>
                        <span style={ui.badge}>
                            Signed in as <b>{username}</b> • Role <b>CLIENT</b>
                        </span>
                    </div>
                    <button style={ui.btn} onClick={logout}>Logout</button>
                </div>

                <div style={{ marginTop: 14, ...ui.grid3 }}>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Accounts</div>
                        <div style={ui.big}>{accounts.length}</div>
                    </div>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Total Balance</div>
                        <div style={ui.big}>{totalBalance.toFixed(2)}</div>
                    </div>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Status</div>
                        <div style={ui.big}>{loading ? "Loading..." : "Ready"}</div>
                    </div>
                </div>

                <div style={{ marginTop: 14, ...ui.card }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 1000 }}>Client Dashboard</div>
                            <div style={{ fontSize: 12, opacity: 0.85 }}>Accounts • Cards • Transactions • Transfer</div>
                        </div>
                        <button style={ui.btn} onClick={loadAll}>Refresh</button>
                    </div>

                    <div style={ui.tabs}>
                        <div style={ui.tab(tab === "accounts")} onClick={() => setTab("accounts")}>Accounts</div>
                        <div style={ui.tab(tab === "transfer")} onClick={() => setTab("transfer")}>Transfer</div>
                        <div style={ui.tab(tab === "cards")} onClick={() => setTab("cards")}>Cards</div>
                        <div style={ui.tab(tab === "txns")} onClick={() => setTab("txns")}>Transactions</div>
                    </div>

                    {toast.text && <div style={ui.toast(toast.kind)}>{toast.text}</div>}

                    {tab === "accounts" && (
                        <>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12, alignItems: "end" }}>
                                <div style={{ minWidth: 180 }}>
                                    <div style={ui.label}>Currency</div>
                                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={ui.input}>
                                        <option>EUR</option>
                                        <option>USD</option>
                                        <option>ALL</option>
                                    </select>
                                </div>
                                <button style={ui.btnPrimary} onClick={requestAccount}>Request Current Account</button>
                            </div>

                            <div style={ui.tableWrap}>
                                <table style={ui.table}>
                                    <thead>
                                        <tr>
                                            <th style={ui.th}>ID</th>
                                            <th style={ui.th}>IBAN</th>
                                            <th style={ui.th}>Currency</th>
                                            <th style={ui.th}>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.length === 0 ? (
                                            <tr><td style={ui.td} colSpan={4}>No accounts yet.</td></tr>
                                        ) : (
                                            accounts.map((a) => (
                                                <tr key={a.id}>
                                                    <td style={ui.td}>{a.id}</td>
                                                    <td style={ui.td}><code style={{ padding: "2px 6px", borderRadius: 8, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.10)" }}>{a.iban}</code></td>
                                                    <td style={ui.td}>{a.currency}</td>
                                                    <td style={ui.td}>{Number(a.balance || 0).toFixed(2)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {tab === "transfer" && (
                        <div style={{ marginTop: 12, ...ui.grid2 }}>
                            <div style={ui.card}>
                                <div style={{ fontWeight: 1000, marginBottom: 6 }}>Make a Transfer</div>

                                <div style={{ marginTop: 10 }}>
                                    <div style={ui.label}>From Account</div>
                                    <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} style={ui.input}>
                                        {accounts.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.id} • {a.currency} • {a.balance}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ marginTop: 10 }}>
                                    <div style={ui.label}>To IBAN</div>
                                    <input style={ui.input} value={toIban} onChange={(e) => setToIban(e.target.value)} placeholder="AL...." />
                                </div>

                                <div style={{ marginTop: 10 }}>
                                    <div style={ui.label}>Amount</div>
                                    <input style={ui.input} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100" />
                                </div>

                                <div style={{ marginTop: 12 }}>
                                    <button style={ui.btnPrimary} onClick={transfer}>Send Transfer</button>
                                </div>
                            </div>

                            <div style={ui.card}>
                                <div style={{ fontWeight: 1000, marginBottom: 6 }}>Tips</div>
                                <div style={{ opacity: 0.85, fontSize: 13, lineHeight: 1.5 }}>
                                    • Make sure IBAN is correct.<br />
                                    • If you don't have an account, create one in "Accounts".<br />
                                    • Transfer returns a reference you can save.
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "cards" && (
                        <div style={ui.tableWrap}>
                            <table style={ui.table}>
                                <thead>
                                    <tr>
                                        <th style={ui.th}>ID</th>
                                        <th style={ui.th}>Type</th>
                                        <th style={ui.th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cards.length === 0 ? (
                                        <tr><td style={ui.td} colSpan={3}>No cards yet.</td></tr>
                                    ) : (
                                        cards.map((c) => (
                                            <tr key={c.id}>
                                                <td style={ui.td}>{c.id}</td>
                                                <td style={ui.td}>{c.type || c.cardType}</td>
                                                <td style={ui.td}><span style={ui.badge}>{c.status || "ACTIVE"}</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {tab === "txns" && (
                        <div style={ui.tableWrap}>
                            <table style={ui.table}>
                                <thead>
                                    <tr>
                                        <th style={ui.th}>ID</th>
                                        <th style={ui.th}>Type</th>
                                        <th style={ui.th}>Amount</th>
                                        <th style={ui.th}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {txns.length === 0 ? (
                                        <tr><td style={ui.td} colSpan={4}>No transactions yet.</td></tr>
                                    ) : (
                                        txns.map((t) => (
                                            <tr key={t.id}>
                                                <td style={ui.td}>{t.id}</td>
                                                <td style={ui.td}><span style={ui.badge}>{t.type || "TRANSFER"}</span></td>
                                                <td style={ui.td}>{t.amount}</td>
                                                <td style={ui.td}>{t.createdAt || t.timestamp || "-"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
