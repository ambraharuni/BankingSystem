export const ui = {
    page: {
        minHeight: "100vh",
        background:
            "radial-gradient(900px 500px at 20% 10%, rgba(99,102,241,0.35), transparent 60%)," +
            "radial-gradient(700px 500px at 80% 20%, rgba(34,197,94,0.25), transparent 60%)," +
            "radial-gradient(700px 500px at 40% 90%, rgba(244,63,94,0.18), transparent 60%)," +
            "linear-gradient(180deg, #0b1220, #070b14)",
        color: "#EAF0FF",
    },
    shell: { maxWidth: 1100, margin: "0 auto", padding: "26px 18px" },
    topbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(10px)",
    },
    brand: { display: "flex", alignItems: "center", gap: 10 },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        fontSize: 12,
        opacity: 0.95,
    },
    btn: {
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.06)",
        color: "#EAF0FF",
        fontWeight: 850,
        cursor: "pointer",
    },
    btnPrimary: {
        padding: "10px 14px",
        borderRadius: 14,
        border: "none",
        background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(59,130,246,0.85))",
        color: "#0b1220",
        fontWeight: 950,
        cursor: "pointer",
    },
    btnDanger: {
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid rgba(244,63,94,0.35)",
        background: "rgba(244,63,94,0.14)",
        color: "#FFD3DA",
        fontWeight: 900,
        cursor: "pointer",
    },
    grid2: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
    grid3: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 },
    card: {
        borderRadius: 20,
        padding: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(10px)",
    },
    cardTitle: { fontSize: 13, opacity: 0.85, marginBottom: 6 },
    big: { fontSize: 22, fontWeight: 1000, letterSpacing: 0.2 },
    tabs: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginTop: 12,
        marginBottom: 10,
    },
    tab: (active) => ({
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: active ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
        cursor: "pointer",
        fontWeight: 900,
        fontSize: 12,
    }),
    input: {
        width: "100%",
        padding: "11px 12px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(0,0,0,0.22)",
        color: "#EAF0FF",
        outline: "none",
    },
    label: { fontSize: 12, opacity: 0.85, marginBottom: 6 },
    tableWrap: { overflowX: "auto", marginTop: 12 },
    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },
    th: {
        textAlign: "left",
        fontSize: 12,
        opacity: 0.8,
        padding: "10px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
    },
    td: {
        padding: "10px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        fontSize: 13,
        verticalAlign: "middle",
    },
    toast: (kind) => ({
        marginTop: 12,
        padding: 10,
        borderRadius: 14,
        fontSize: 12,
        background:
            kind === "ok"
                ? "rgba(34,197,94,0.12)"
                : kind === "warn"
                    ? "rgba(245,158,11,0.12)"
                    : "rgba(244,63,94,0.12)",
        border:
            kind === "ok"
                ? "1px solid rgba(34,197,94,0.25)"
                : kind === "warn"
                    ? "1px solid rgba(245,158,11,0.25)"
                    : "1px solid rgba(244,63,94,0.25)",
    }),
};

export function errMsg(e) {
    return e?.response?.data?.error || e?.response?.data?.message || "Request failed";
}
