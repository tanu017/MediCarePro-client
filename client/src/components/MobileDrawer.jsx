import React from "react";
import { User, LogOut, Activity, Calendar, Pill, FileText, CreditCard, Stethoscope, Users, Receipt } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProfileImageContext } from "../contexts/ProfileImageContext";

const MobileDrawer = ({ isOpen, onClose, onLogoutClick }) => {
  const { user, isAuthenticated } = useAuth();
  const { profileImage } = useProfileImageContext();
  const location = useLocation();

  // Get role-specific paths
  const getDashboardPath = () => {
    switch (user?.role) {
      case 'DOCTOR':
        return '/doctor/dashboard';
      case 'PATIENT':
        return '/patient/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      case 'RECEPTIONIST':
        return '/receptionist/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getProfilePath = () => {
    switch (user?.role) {
      case 'DOCTOR':
        return '/doctor/profile';
      case 'PATIENT':
        return '/patient/profile';
      case 'ADMIN':
        return '/admin/profile';
      case 'RECEPTIONIST':
        return '/receptionist/profile';
      default:
        return '/profile';
    }
  };

  // Get role-specific navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', icon: Activity, path: getDashboardPath() }
    ];

    switch (user?.role) {
      case 'DOCTOR':
        return [
          ...baseItems,
          { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
          { name: 'Billing', icon: CreditCard, path: '/doctor/billing' }
        ];
      case 'PATIENT':
        return [
          ...baseItems,
          { name: 'Appointments', icon: Calendar, path: '/patient/appointments' },
          { name: 'Prescriptions', icon: Pill, path: '/patient/prescriptions' },
          { name: 'Billing', icon: CreditCard, path: '/patient/billing' }
        ];
      case 'ADMIN':
        return [
          ...baseItems,
          { name: 'Doctors', icon: Stethoscope, path: '/admin/doctors' },
          { name: 'Patients', icon: Users, path: '/admin/patients' },
          { name: 'Receptionists', icon: User, path: '/admin/receptionists' },
          { name: 'Billing', icon: Receipt, path: '/admin/billing' }
        ];
      case 'RECEPTIONIST':
        return [
          ...baseItems,
          { name: 'Appointments', icon: Calendar, path: '/receptionist/appointments' },
          { name: 'Patients', icon: User, path: '/receptionist/patients' },
          { name: 'Billing', icon: CreditCard, path: '/receptionist/billing' }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  if (!isAuthenticated || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="md:hidden fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="md:hidden fixed left-0 top-0 h-full w-64 z-50">
        <div className="flex flex-col h-full w-full bg-white shadow-xl border-r border-gray-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <Link
              to={getProfilePath()}
              onClick={onClose}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">{user?.name || 'User'}</p>
                <p className="text-gray-500 text-xs">{user?.role || 'Patient'}</p>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto min-h-0">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button - Fixed at bottom */}
          <div className="flex-shrink-0 px-4 py-2 border-t border-gray-200">
            <button
              onClick={() => {
                console.log('Mobile logout button clicked!');
                onClose();
                onLogoutClick();
              }}
              className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-600 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
