import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  User, 
  Calendar, 
  FileText, 
  Users, 
  Clock,
  LogOut,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Pill,
  Heart,
  UserCheck,
  BarChart3,
  Phone,
  UserPlus,
  CalendarCheck,
  Clock3,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      title: 'Today\'s Appointments', 
      value: '32', 
      icon: Calendar, 
      color: 'bg-blue-500',
      change: '+5 from yesterday'
    },
    { 
      title: 'New Registrations', 
      value: '8', 
      icon: UserPlus, 
      color: 'bg-green-500',
      change: '3 pending approval'
    },
    { 
      title: 'Calls Handled', 
      value: '45', 
      icon: Phone, 
      color: 'bg-purple-500',
      change: '12 in queue'
    },
    { 
      title: 'Check-ins Today', 
      value: '28', 
      icon: CheckCircle, 
      color: 'bg-orange-500',
      change: '4 waiting'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Appointment booked for John Doe', time: '10 minutes ago', type: 'appointment' },
    { id: 2, action: 'Patient checked in - Alice Smith', time: '25 minutes ago', type: 'checkin' },
    { id: 3, action: 'New patient registration completed', time: '1 hour ago', type: 'registration' },
    { id: 4, action: 'Appointment rescheduled - Bob Wilson', time: '2 hours ago', type: 'reschedule' }
  ];

  const quickActions = [
    { title: 'Book Appointment', icon: Calendar, color: 'bg-blue-500', action: () => navigate('/receptionist/appointments') },
    { title: 'Register Patient', icon: UserPlus, color: 'bg-green-500', action: () => navigate('/receptionist/patients') },
    { title: 'Manage Appointments', icon: CalendarCheck, color: 'bg-purple-500', action: () => navigate('/receptionist/appointments') },
    { title: 'View Patients', icon: Users, color: 'bg-orange-500', action: () => navigate('/receptionist/patients') },
    { title: 'Billing Management', icon: CreditCard, color: 'bg-indigo-500', action: () => navigate('/receptionist/bills') }
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'Alice Johnson', doctor: 'Dr. Smith', time: '10:00 AM', status: 'confirmed' },
    { id: 2, patient: 'Bob Wilson', doctor: 'Dr. Davis', time: '10:15 AM', status: 'waiting' },
    { id: 3, patient: 'Carol Brown', doctor: 'Dr. Johnson', time: '10:30 AM', status: 'confirmed' },
    { id: 4, patient: 'David Lee', doctor: 'Dr. Smith', time: '10:45 AM', status: 'checked-in' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-7xl mx-auto md:pl-20 px-4 sm:px-6 lg:px-8">
        <div className="py-6 m-4 md:pl-16 lg:mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Here's your reception desk overview for today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
                <div className="space-y-2 sm:space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm sm:text-base">{action.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Upcoming Appointments</h3>
                <div className="space-y-3 sm:space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <User className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                          <p className="text-xs text-gray-500">with {appointment.doctor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : appointment.status === 'waiting'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Receptionist Tip */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6" />
              <h3 className="text-base sm:text-lg font-semibold">Receptionist Tip of the Day</h3>
            </div>
            <p className="text-orange-100 text-sm sm:text-base">
              Always greet patients with a warm smile and maintain a professional yet friendly demeanor. 
              Keep the waiting area clean and ensure patients are informed about any delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
