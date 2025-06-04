import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no roles specified, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = allowedRoles.some(role => user?.role === role);

  if (!hasAllowedRole) {
    // Redirect based on user role
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin/Admindash" replace />;
      case 'mentor':
        return <Navigate to="/mentor/dashboard" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;