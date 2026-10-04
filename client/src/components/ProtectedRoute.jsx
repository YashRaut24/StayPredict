import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="protected-loading-screen">
        <div className="loading-spinner"></div>
        <p>Verifying clinical session credentials...</p>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user doesn't match
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'patient') {
      return <Navigate to="/patient-portal" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
