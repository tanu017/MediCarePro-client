import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  FileText, 
  Pill,
  Heart,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentAPI } from '../../api/appointmentApi';
import { billingAPI } from '../../api/billingApi';
import { prescriptionAPI } from '../../api/prescriptionApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: 0,
    totalPrescriptions: 0,
    completedAppointments: 0,
    loading: true
  });

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Fetch dashboard data
  useEffect(() => {
    if (user && !loading) {
      fetchDashboardData();
    }
  }, [user, loading]);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      // Fetch appointments
      const appointmentsResponse = await appointmentAPI.getMyAppointments();
      const appointments = appointmentsResponse.appointments || [];
      
      // Fetch prescriptions
      const prescriptionsResponse = await prescriptionAPI.getMyPrescriptions();
      const prescriptions = prescriptionsResponse.prescriptions || [];
      
      // Calculate statistics
      const today = new Date();
      const upcomingAppointments = appointments.filter(apt => 
        new Date(apt.date) >= today && 
        ['booked', 'confirmed', 'pending'].includes(apt.status)
      ).length;
      
      const completedAppointments = appointments.filter(apt => 
        apt.status === 'completed'
      ).length;
      
      setDashboardData({
        upcomingAppointments,
        totalPrescriptions: prescriptions.length,
        completedAppointments,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      title: 'Upcoming Appointments', 
      value: dashboardData.loading ? '...' : dashboardData.upcomingAppointments.toString(), 
      icon: Calendar, 
      color: 'bg-blue-500',
      change: 'Scheduled visits',
      onClick: () => navigate('/patient/appointments')
    },
    { 
      title: 'Prescriptions', 
      value: dashboardData.loading ? '...' : dashboardData.totalPrescriptions.toString(), 
      icon: Pill, 
      color: 'bg-green-500',
      change: 'Total prescriptions',
      onClick: () => navigate('/patient/prescriptions')
    },
    { 
      title: 'My Bills', 
      value: dashboardData.loading ? '...' : dashboardData.completedAppointments.toString(), 
      icon: CreditCard, 
      color: 'bg-orange-500',
      change: 'Completed visits',
      onClick: () => navigate('/patient/bills')
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Appointment scheduled', time: '2 hours ago', type: 'appointment' },
    { id: 2, action: 'Prescription renewed', time: '1 day ago', type: 'prescription' },
    { id: 3, action: 'Medical record updated', time: '2 days ago', type: 'record' },
    { id: 4, action: 'Payment received', time: '3 days ago', type: 'payment' }
  ];

  const quickActions = [
    { title: 'My Appointments', icon: Calendar, color: 'bg-blue-500', action: () => navigate('/patient/appointments') },
    { title: 'My Prescriptions', icon: Pill, color: 'bg-green-500', action: () => navigate('/patient/prescriptions') },
    { title: 'My Bills', icon: CreditCard, color: 'bg-orange-500', action: () => navigate('/patient/bills') },
    { title: 'My Profile', icon: User, color: 'bg-purple-500', action: () => navigate('/patient/profile') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-7xl mx-auto md:pl-16 px-4 sm:px-6 lg:px-8">
        <div className="py-6 m-4 md:pl-16 lg:mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Here's what's happening with your health today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer" 
                onClick={stat.onClick}
              >
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

            {/* ✅ Patient Profile Card instead of Total Bills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/patient/profile')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">My Profile</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{user?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">{user?.email || 'No email'}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-purple-500">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'appointment' && <Calendar className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'prescription' && <Pill className="h-5 w-5 text-green-500" />}
                        {activity.type === 'record' && <FileText className="h-5 w-5 text-purple-500" />}
                        {activity.type === 'payment' && <CreditCard className="h-5 w-5 text-orange-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Health Tips */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              <h3 className="text-base sm:text-lg font-semibold">Health Tip of the Day</h3>
            </div>
            <p className="text-blue-100 text-sm sm:text-base">
              Regular exercise and a balanced diet are key to maintaining good health. 
              Remember to stay hydrated and get at least 7-8 hours of sleep each night.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
