import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDefaultRouteForRole } from '../constants/routes';
import PatientRoutes from './PatientRoutes';
import DoctorRoutes from './DoctorRoutes';
import AdminRoutes from './AdminRoutes';
import ReceptionistRoutes from './ReceptionistRoutes';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading your dashboard...</p>
    </div>
  </div>
);

// Access denied component
const AccessDenied = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
      <p className="text-gray-600">You don't have permission to access this dashboard.</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AccessDenied />;
  }

  // Route to appropriate role-based routes
  switch (user.role) {
    case 'PATIENT':
      return <PatientRoutes />;
    case 'DOCTOR':
      return <DoctorRoutes />;
    case 'ADMIN':
      return <AdminRoutes />;
    case 'RECEPTIONIST':
      return <ReceptionistRoutes />;
    default:
      return <AccessDenied />;
  }
};

export default AppRoutes;
