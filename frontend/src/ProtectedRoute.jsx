import { Navigate } from "react-router-dom";
import { getRole, getToken } from "./auth";

export default function ProtectedRoute({ allowed, children }) {
    const role = getRole();
    const token = getToken();

    if (!role || !token) return <Navigate to="/login" replace />;

    if (allowed && !allowed.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
