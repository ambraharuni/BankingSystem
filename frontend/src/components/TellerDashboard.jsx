import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { ui, errMsg } from "../ui";
import { clearSession, getSession } from "../auth";
import { useNavigate } from "react-router-dom";

export default function TellerDashboard() {
    const nav = useNavigate();
    const { username } = getSession();

    const [tab, setTab] = useState("clients");
    const [toast, setToast] = useState({ text: "", kind: "ok" });
    const [loading, setLoading] = useState(false);

    const [clients, setClients] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [txns, setTxns] = useState([]);

    const [q, setQ] = useState("");

    const [newUser, setNewUser] = useState("");
    const [newPass, setNewPass] = useState("");

    const [pwdMap, setPwdMap] = useState({});

    const [accountReqId, setAccountReqId] = useState("");
    const [creditCardId, setCreditCardId] = useState("");
    const [interest, setInterest] = useState("5");

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
            const [c, a, t] = await Promise.all([
                api.get("/teller/clients"),
                api.get("/teller/accounts"),
                api.get("/teller/transactions"),
            ]);
            setClients(c.data || []);
            setAccounts(a.data || []);
            setTxns(t.data || []);
        } catch (e) {
            show(errMsg(e), "bad");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    async function createClient() {
        const u = newUser.trim();
        const p = newPass;

        if (!u || !p) return show("Fill in username & password.", "warn");
        if (p.length < 4) return show("Password min 4 characters.", "warn");

        try {
            await api.post("/teller/clients", { username: u, password: p });
            setNewUser("");
            setNewPass("");
            show("✅ Client created!");
            loadAll();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    async function updateClientPassword(id) {
        const p = pwdMap[id];
        if (!p) return show("Enter new password.", "warn");
        try {
            await api.put(`/teller/clients/${id}/password`, { password: p });
            setPwdMap((m) => ({ ...m, [id]: "" }));
            show("✅ Password updated!");
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    async function deleteClient(id) {
        if (!confirm("Are you sure you want to delete this client?")) return;
        try {
            await api.delete(`/teller/clients/${id}`);
            show("🗑️ Client deleted!");
            loadAll();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    async function approveAccount() {
        if (!accountReqId) return show("Enter Account ID.", "warn");
        try {
            await api.post(`/teller/accounts/${Number(accountReqId)}/approve`);
            show("✅ Account approved!");
            setAccountReqId("");
            loadAll();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    async function rejectAccount() {
        if (!accountReqId) return show("Enter Account ID.", "warn");
        try {
            await api.post(`/teller/accounts/${Number(accountReqId)}/reject`);
            show("🛑 Account rejected!");
            setAccountReqId("");
            loadAll();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    async function approveCredit() {
        if (!creditCardId) return show("Enter Card ID.", "warn");
        const ip = Number(interest);
        if (Number.isNaN(ip) || ip < 0) return show("Interest must be a number ≥ 0.", "warn");

        try {
            await api.post(`/teller/cards/${Number(creditCardId)}/approve-credit`, {
                interestPercent: ip,
            });
            show("✅ Credit card approved!");
            setCreditCardId("");
            loadAll();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    const kpiClients = clients.length;
    const kpiAccounts = accounts.length;
    const kpiTxns = txns.length;

    const filteredClients = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return clients;
        return clients.filter(
            (u) => String(u.id).includes(s) || (u.username || "").toLowerCase().includes(s)
        );
    }, [clients, q]);

    return (
        <div style={ui.page}>
            <div style={ui.shell}>
                <div style={ui.topbar}>
                    <div style={ui.brand}>
                        <div style={{ fontSize: 18, fontWeight: 1000 }}>🧾 Teller Portal</div>
                        <span style={ui.badge}>
                            Signed in as <b>{username}</b> • Role <b>TELLER</b>
                        </span>
                    </div>
                    <button style={ui.btn} onClick={logout}>Logout</button>
                </div>

                <div style={{ marginTop: 14, ...ui.grid3 }}>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Clients</div>
                        <div style={ui.big}>{kpiClients}</div>
                    </div>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Accounts</div>
                        <div style={ui.big}>{kpiAccounts}</div>
                    </div>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Transactions</div>
                        <div style={ui.big}>{kpiTxns}</div>
                    </div>
                </div>

                <div style={{ marginTop: 14, ...ui.card }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 1000 }}>Teller Dashboard</div>
                            <div style={{ fontSize: 12, opacity: 0.85 }}>
                                Clients CRUD • Accounts/Transactions • Approvals
                            </div>
                        </div>
                        <button style={ui.btn} onClick={loadAll}>
                            {loading ? "Loading..." : "Refresh"}
                        </button>
                    </div>

                    <div style={ui.tabs}>
                        <div style={ui.tab(tab === "clients")} onClick={() => setTab("clients")}>Clients</div>
                        <div style={ui.tab(tab === "approvals")} onClick={() => setTab("approvals")}>Approvals</div>
                        <div style={ui.tab(tab === "accounts")} onClick={() => setTab("accounts")}>All Accounts</div>
                        <div style={ui.tab(tab === "txns")} onClick={() => setTab("txns")}>All Transactions</div>
                    </div>

                    {toast.text && <div style={ui.toast(toast.kind)}>{toast.text}</div>}

                    {tab === "clients" && (
                        <>
                            <div style={{ marginTop: 12, ...ui.grid2 }}>
                                <div style={ui.card}>
                                    <div style={{ fontWeight: 1000, marginBottom: 8 }}>Create Client</div>
                                    <div style={{ display: "grid", gap: 10 }}>
                                        <div>
                                            <div style={ui.label}>Username</div>
                                            <input style={ui.input} value={newUser} onChange={(e) => setNewUser(e.target.value)} placeholder="client3" />
                                        </div>
                                        <div>
                                            <div style={ui.label}>Password</div>
                                            <input style={ui.input} type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="1234" />
                                            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                                                Passwords may be reused across accounts and roles.
                                            </div>
                                        </div>
                                        <button style={ui.btnPrimary} onClick={createClient}>Create</button>
                                    </div>
                                </div>

                                <div style={ui.card}>
                                    <div style={{ fontWeight: 1000, marginBottom: 8 }}>Search</div>
                                    <div style={ui.label}>Filter by id/username</div>
                                    <input style={ui.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="type to search..." />
                                    <div style={{ marginTop: 10, opacity: 0.85, fontSize: 13 }}>
                                        Tip: Passwords in DB are hashed (BCrypt). You cannot "find" the original password.
                                    </div>
                                </div>
                            </div>

                            <div style={ui.tableWrap}>
                                <table style={ui.table}>
                                    <thead>
                                        <tr>
                                            <th style={ui.th}>ID</th>
                                            <th style={ui.th}>Username</th>
                                            <th style={ui.th}>Role</th>
                                            <th style={ui.th}>New Password</th>
                                            <th style={ui.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClients.length === 0 ? (
                                            <tr><td style={ui.td} colSpan={5}>No clients.</td></tr>
                                        ) : (
                                            filteredClients.map((u) => (
                                                <tr key={u.id}>
                                                    <td style={ui.td}>{u.id}</td>
                                                    <td style={ui.td}>
                                                        <code style={{ padding: "2px 6px", borderRadius: 8, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.10)" }}>
                                                            {u.username}
                                                        </code>
                                                    </td>
                                                    <td style={ui.td}><span style={ui.badge}>{u.role}</span></td>
                                                    <td style={ui.td}>
                                                        <input
                                                            style={ui.input}
                                                            type="password"
                                                            value={pwdMap[u.id] ?? ""}
                                                            onChange={(e) => setPwdMap((m) => ({ ...m, [u.id]: e.target.value }))}
                                                            placeholder="new password"
                                                        />
                                                    </td>
                                                    <td style={ui.td}>
                                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                            <button style={ui.btn} onClick={() => updateClientPassword(u.id)}>Update Password</button>
                                                            <button style={ui.btnDanger} onClick={() => deleteClient(u.id)}>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {tab === "approvals" && (
                        <div style={{ marginTop: 12, ...ui.grid2 }}>
                            <div style={ui.card}>
                                <div style={{ fontWeight: 1000, marginBottom: 8 }}>Current Account Request</div>
                                <div style={ui.label}>Account ID (request)</div>
                                <input style={ui.input} value={accountReqId} onChange={(e) => setAccountReqId(e.target.value)} placeholder="e.g. 12" />
                                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                                    <button style={ui.btnPrimary} onClick={approveAccount}>Approve</button>
                                    <button style={ui.btnDanger} onClick={rejectAccount}>Reject</button>
                                </div>
                                <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
                                    (If `allAccounts()` returns status, we can auto-filter "PENDING".)
                                </div>
                            </div>

                            <div style={ui.card}>
                                <div style={{ fontWeight: 1000, marginBottom: 8 }}>Approve Credit Card</div>
                                <div style={ui.label}>Card ID</div>
                                <input style={ui.input} value={creditCardId} onChange={(e) => setCreditCardId(e.target.value)} placeholder="e.g. 7" />
                                <div style={{ marginTop: 10 }}>
                                    <div style={ui.label}>Interest Percent</div>
                                    <input style={ui.input} value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="5" />
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <button style={ui.btnPrimary} onClick={approveCredit}>Approve Credit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "accounts" && (
                        <div style={ui.tableWrap}>
                            <table style={ui.table}>
                                <thead>
                                    <tr>
                                        <th style={ui.th}>ID</th>
                                        <th style={ui.th}>IBAN</th>
                                        <th style={ui.th}>Currency</th>
                                        <th style={ui.th}>Balance</th>
                                        <th style={ui.th}>Client</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.length === 0 ? (
                                        <tr><td style={ui.td} colSpan={5}>No accounts.</td></tr>
                                    ) : (
                                        accounts.map((a) => (
                                            <tr key={a.id}>
                                                <td style={ui.td}>{a.id}</td>
                                                <td style={ui.td}>
                                                    <code style={{ padding: "2px 6px", borderRadius: 8, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.10)" }}>
                                                        {a.iban}
                                                    </code>
                                                </td>
                                                <td style={ui.td}>{a.currency}</td>
                                                <td style={ui.td}>{Number(a.balance || 0).toFixed(2)}</td>
                                                <td style={ui.td}>{a.clientUsername || a.client || "-"}</td>
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
                                        <tr><td style={ui.td} colSpan={4}>No transactions.</td></tr>
                                    ) : (
                                        txns.map((t) => (
                                            <tr key={t.id}>
                                                <td style={ui.td}>{t.id}</td>
                                                <td style={ui.td}><span style={ui.badge}>{t.type || "TXN"}</span></td>
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

                <div style={{ textAlign: "center", marginTop: 14, opacity: 0.7, fontSize: 12 }}>
                    BankingSystem • Frontend (Vite + React) • Backend (Spring Boot)
                </div>
            </div>
        </div>
    );
}
