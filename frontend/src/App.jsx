import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import ProfessionalClientDashboard from "./components/ProfessionalClientDashboard";
import ProfessionalAdminDashboard from "./components/ProfessionalAdminDashboard";
import ProfessionalTellerDashboard from "./components/ProfessionalTellerDashboard";
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
                            <ProfessionalClientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowed={["ADMIN"]}>
                            <ProfessionalAdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teller"
                    element={
                        <ProtectedRoute allowed={["TELLER"]}>
                            <ProfessionalTellerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
