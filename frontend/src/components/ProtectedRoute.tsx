import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to salesman dashboard if a non-admin tries to access admin route
    return <Navigate to="/salesman" replace />;
  }

  if (!requireAdmin && isAdmin && location.pathname.startsWith('/salesman')) {
     // Optional: Redirect admin to admin dashboard if they try to access salesman routes
     // return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
