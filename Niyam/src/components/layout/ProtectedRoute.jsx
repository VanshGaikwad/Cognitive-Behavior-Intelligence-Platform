import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
