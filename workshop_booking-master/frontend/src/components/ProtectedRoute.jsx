import React, { createElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute component that checks authentication and role
 * @param {React.Component} Component - The component to render if authorized
 * @param {string[]} requiredRoles - Array of allowed roles (e.g., ['instructor', 'coordinator'])
 */
export const ProtectedRoute = ({ Component, requiredRoles = null }) => {
  const { isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) {
    // Show loading spinner while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fossee-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check role if required roles specified
  if (requiredRoles && !requiredRoles.includes(role)) {
    // Redirect to 404 if wrong role
    return <Navigate to="/404" replace />;
  }

  // Render the component using createElement
  return createElement(Component);
};
