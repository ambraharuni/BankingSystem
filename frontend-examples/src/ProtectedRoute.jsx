import { Navigate } from "react-router-dom";
import { getRole, getToken } from "./auth";

export default function ProtectedRoute({ allowed, children }) {
    const role = getRole();
    const token = getToken();

    // If no token or role, redirect to login
    if (!role || !token) return <Navigate to="/login" replace />;

    // If logged in but role not in allowed list, redirect to login
    if (allowed && !allowed.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
