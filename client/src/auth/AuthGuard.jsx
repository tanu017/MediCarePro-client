import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDefaultRouteForRole } from '../constants/routes';

// Loading component
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

// Unified AuthGuard component that handles all authentication scenarios
const AuthGuard = ({ 
  children, 
  type = 'protected', // 'protected', 'public', 'role'
  requiredRole = null,
  allowedRoles = [],
  redirectTo = null 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner message="Verifying authentication..." />;
  }

  // Handle public routes (only accessible when NOT logged in)
  if (type === 'public') {
    if (isAuthenticated && user) {
      const defaultRoute = redirectTo || getDefaultRouteForRole(user.role);
      return <Navigate to={defaultRoute} replace />;
    }
    return children;
  }

  // Handle protected routes (require authentication)
  if (type === 'protected') {
    if (!isAuthenticated || !user) {
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // Check if specific roles are allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      const defaultRoute = getDefaultRouteForRole(user.role);
      return <Navigate to={defaultRoute} replace />;
    }

    return children;
  }

  // Handle role-specific routes
  if (type === 'role') {
    if (!isAuthenticated || !user) {
      return <Navigate to="/signin" replace />;
    }

    if (user.role !== requiredRole) {
      const defaultRoute = getDefaultRouteForRole(user.role);
      return <Navigate to={defaultRoute} replace />;
    }

    return children;
  }

  // Default fallback
  return children;
};

// Convenience components for common use cases
export const ProtectedRoute = ({ children, allowedRoles = [] }) => (
  <AuthGuard type="protected" allowedRoles={allowedRoles}>
    {children}
  </AuthGuard>
);

export const PublicRoute = ({ children, redirectTo = null }) => (
  <AuthGuard type="public" redirectTo={redirectTo}>
    {children}
  </AuthGuard>
);

export const RoleRoute = ({ children, requiredRole }) => (
  <AuthGuard type="role" requiredRole={requiredRole}>
    {children}
  </AuthGuard>
);

// Default redirect component for catch-all routes
export const DefaultRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Redirecting..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  const defaultRoute = getDefaultRouteForRole(user.role);
  return <Navigate to={defaultRoute} replace />;
};

export default AuthGuard;
