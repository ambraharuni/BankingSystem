export function errMsg(error) {
    return error?.response?.data?.error || error?.response?.data?.message || "Request failed";
}

export function formatCurrency(value, currency = "EUR") {
    const numeric = Number(value || 0);
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numeric);
    } catch {
        return `${numeric.toFixed(2)} ${currency}`;
    }
}

export function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function statusTone(status) {
    switch ((status || "").toUpperCase()) {
        case "ACTIVE":
        case "CREDIT":
            return "success";
        case "PENDING":
            return "warning";
        case "REJECTED":
        case "DEBIT":
            return "danger";
        default:
            return "neutral";
    }
}

export function statusClassName(status) {
    return `chip chip-${statusTone(status)}`;
}

export function transactionClassName(type) {
    return `chip chip-${(type || "").toUpperCase() === "CREDIT" ? "success" : "danger"}`;
}
