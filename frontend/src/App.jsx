import { Routes, Route, Navigate } from "react-router-dom";
import Hero from "./pages/hero"; 
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { VerificationEmailPage } from "./pages/VerificationEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import UploadExcel from "./pages/UploadExcel";
import AdminPanel from "./pages/AdminPanel";

import { Toaster } from "@/components/ui/toaster";
import { Button } from "./components/ui/button";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

// Protect normal user routes
const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return children;
};

// Redirect logged-in users from login/signup pages
const AuthenticatedUserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    if (!user.isVerified) return <Navigate to="/verify-email" replace />;
    return user.role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Protect admin-only routes
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, logout, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <div>Loading...</div>;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      {user && (
        <Button onClick={handleLogout} className="absolute top-4 right-4">
          Logout
        </Button>
      )}

      <Routes>
        
        <Route path="/" element={<Hero />} />

        
        <Route
          path="/signup"
          element={
            <AuthenticatedUserRoute>
              <SignUpPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthenticatedUserRoute>
              <LoginPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route path="/verify-email" element={<VerificationEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <DashboardPage />
            </ProtectRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectRoute>
              <UploadExcel />
            </ProtectRoute>
          }
        />

        
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
