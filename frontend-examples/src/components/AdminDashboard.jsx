import { useEffect, useMemo, useState } from "react";
import api from "./api";
import { ui, errMsg } from "./ui";
import { clearSession, getSession } from "./auth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const nav = useNavigate();
    const { username } = getSession();

    const [tab, setTab] = useState("tellers");
    const [tellers, setTellers] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);

    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [pwdMap, setPwdMap] = useState({});
    const [toast, setToast] = useState({ text: "", kind: "ok" });

    function show(text, kind = "ok") {
        setToast({ text, kind });
        setTimeout(() => setToast({ text: "", kind }), 2600);
    }

    async function loadTellers() {
        setLoading(true);
        try {
            const res = await api.get("/admin/tellers");
            setTellers(res.data || []);
        } catch (e) {
            show(errMsg(e), "bad");
        } finally {
            setLoading(false);
        }
    }

    async function createTeller() {
        const u = newUsername.trim();
        const p = newPassword;

        if (!u || !p) return show("Fill in username & password.", "warn");
        if (u.toLowerCase() === "admin") return show("Don't use 'admin' as teller.", "warn");
        if (p.length < 4) return show("Password min 4 characters.", "warn");

        try {
            await api.post("/admin/tellers", { username: u, password: p });
            setNewUsername("");
            setNewPassword("");
            show("✅ Teller created!");
            loadTellers();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    async function updatePassword(id) {
        const pass = pwdMap[id];
        if (!pass) return show("Enter new password.", "warn");

        try {
            await api.put(`/admin/tellers/${id}/password`, { password: pass });
            setPwdMap((m) => ({ ...m, [id]: "" }));
            show("✅ Password updated!");
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    async function deleteTeller(id) {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/admin/tellers/${id}`);
            show("🗑️ Teller deleted!");
            loadTellers();
        } catch (e) {
            show(errMsg(e), "bad");
        }
    }

    function logout() {
        clearSession();
        nav("/login");
    }

    useEffect(() => {
        loadTellers();
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return tellers;
        return tellers.filter(
            (t) => String(t.id).includes(s) || (t.username || "").toLowerCase().includes(s)
        );
    }, [tellers, q]);

    return (
        <div style={ui.page}>
            <div style={ui.shell}>
                <div style={ui.topbar}>
                    <div style={ui.brand}>
                        <div style={{ fontSize: 18, fontWeight: 1000 }}>🏦 Admin Portal</div>
                        <span style={ui.badge}>
                            Signed in as <b>{username}</b> • Role <b>ADMIN</b>
                        </span>
                    </div>
                    <button style={ui.btn} onClick={logout}>
                        Logout
                    </button>
                </div>

                <div style={{ marginTop: 14, ...ui.grid3 }}>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Total Tellers</div>
                        <div style={ui.big}>{tellers.length}</div>
                    </div>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Status</div>
                        <div style={ui.big}>{loading ? "Loading..." : "Ready"}</div>
                    </div>
                    <div style={ui.card}>
                        <div style={ui.cardTitle}>Quick Search</div>
                        <input style={ui.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="search by id/username" />
                    </div>
                </div>

                <div style={{ marginTop: 14, ...ui.card }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 1000 }}>Admin Dashboard</div>
                            <div style={{ fontSize: 12, opacity: 0.85 }}>Manage Tellers with Create / Update / Delete</div>
                        </div>
                        <button style={ui.btn} onClick={loadTellers}>Refresh</button>
                    </div>

                    <div style={ui.tabs}>
                        <div style={ui.tab(tab === "tellers")} onClick={() => setTab("tellers")}>Tellers</div>
                        <div style={ui.tab(tab === "audit")} onClick={() => setTab("audit")}>Audit (soon)</div>
                    </div>

                    {toast.text && <div style={ui.toast(toast.kind)}>{toast.text}</div>}

                    {tab === "tellers" && (
                        <>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12, alignItems: "end" }}>
                                <div style={{ flex: 1, minWidth: 220 }}>
                                    <div style={ui.label}>New Teller Username</div>
                                    <input style={ui.input} value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="teller3" />
                                </div>
                                <div style={{ flex: 1, minWidth: 220 }}>
                                    <div style={ui.label}>New Teller Password</div>
                                    <input style={ui.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="1234" />
                                </div>
                                <button style={ui.btnPrimary} onClick={createTeller}>Create</button>
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
                                        {filtered.length === 0 ? (
                                            <tr><td style={ui.td} colSpan={5}>{loading ? "Loading..." : "No results."}</td></tr>
                                        ) : (
                                            filtered.map((u) => (
                                                <tr key={u.id}>
                                                    <td style={ui.td}>{u.id}</td>
                                                    <td style={ui.td}><code style={{ padding: "2px 6px", borderRadius: 8, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.10)" }}>{u.username}</code></td>
                                                    <td style={ui.td}><span style={ui.badge}>{u.role}</span></td>
                                                    <td style={ui.td}>
                                                        <input
                                                            style={{ ...ui.input, margin: 0 }}
                                                            type="password"
                                                            value={pwdMap[u.id] ?? ""}
                                                            onChange={(e) => setPwdMap((m) => ({ ...m, [u.id]: e.target.value }))}
                                                            placeholder="new password"
                                                        />
                                                    </td>
                                                    <td style={ui.td}>
                                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                            <button style={ui.btn} onClick={() => updatePassword(u.id)}>Update Password</button>
                                                            <button style={ui.btnDanger} onClick={() => deleteTeller(u.id)}>Delete</button>
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

                    {tab === "audit" && (
                        <div style={{ marginTop: 12, opacity: 0.85 }}>
                            Audit log can be added later (e.g., save admin operations to DB).
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
