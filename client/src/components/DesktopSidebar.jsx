import React, { useState } from "react";
import { User, LogOut, Activity, Calendar, Pill, FileText, CreditCard, Stethoscope, Users, Receipt } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProfileImageContext } from "../contexts/ProfileImageContext";

const DesktopSidebar = ({ onLogoutClick }) => {
  const [isDesktopSidebarHovered, setIsDesktopSidebarHovered] = useState(false);
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

  if (!isAuthenticated) return null;

  return (
    <div 
      className="hidden md:block fixed left-0 top-18 h-[calc(100vh-4.5rem)] w-16 bg-white shadow-lg border-r border-gray-200 z-30 transition-all duration-300 hover:w-64"
      onMouseEnter={() => setIsDesktopSidebarHovered(true)}
      onMouseLeave={() => setIsDesktopSidebarHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* User Profile Section */}
        <Link
          to={getProfilePath()}
          className="p-4 border-b border-gray-200 flex-shrink-0 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
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
            <div className={`transition-all duration-300 overflow-hidden ${isDesktopSidebarHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              <p className="text-gray-900 font-medium text-sm whitespace-nowrap">{user?.name || 'User'}</p>
              <p className="text-gray-500 text-xs whitespace-nowrap">{user?.role || 'Patient'}</p>
            </div>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex-1 py-4 overflow-y-auto min-h-0">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isDesktopSidebarHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logout Button - Fixed at bottom */}
        <div className="flex-shrink-0 px-4 py-2 border-t border-gray-200">
          <button
            onClick={onLogoutClick}
            className="flex items-center space-x-3 w-full px-2 py-3 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-600 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isDesktopSidebarHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
