import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../features/auth/LoginPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import SettingsPage from "../features/dashboard/SettingsPage";
import ReportsPage from "../features/dashboard/ReportsPage";
import VendorListPage from "../features/vendors/VendorListPage";
import VendorRegisterPage from "../features/vendors/VendorRegisterPage";
import VendorDetailPage from "../features/vendors/VendorDetailPage";
import UserListPage from "../features/users/UserListPage";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicOnlyRoute>
            <ResetPasswordPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="vendors"
          element={
            <ProtectedRoute permission="vendor:read">
              <VendorListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="vendors/register"
          element={
            <ProtectedRoute permission="vendor:create">
              <VendorRegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="vendors/:id"
          element={
            <ProtectedRoute permission="vendor:read">
              <VendorDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute permission="vendor:read">
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute permission="user:read">
              <UserListPage />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
