import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
