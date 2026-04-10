import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import ClientDashboard from "./ClientDashboard";
import AdminDashboard from "./AdminDashboard";
import TellerDashboard from "./TellerDashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/client"
                    element={
                        <ProtectedRoute allowed={["CLIENT"]}>
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowed={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teller"
                    element={
                        <ProtectedRoute allowed={["TELLER"]}>
                            <TellerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
