import React, { useState, useEffect } from 'react';
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
  Stethoscope,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Pill,
  Heart,
  UserCheck,
  BarChart3,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../api/doctorApi';
import { StatsCard, LoadingSpinner, ErrorDisplay } from '../../components/common';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    appointments: [],
    doctorProfile: null
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [statsResponse, appointmentsResponse, profileResponse] = await Promise.all([
          doctorAPI.getDashboardStats(),
          doctorAPI.getTodayAppointments(),
          doctorAPI.getProfile()
        ]);

        setDashboardData({
          stats: statsResponse.stats,
          appointments: appointmentsResponse,
          doctorProfile: profileResponse.doctor
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };

    if (!loading && user) {
      fetchDashboardData();
    }
  }, [loading, user]);

  if (loading || dataLoading) {
    return <LoadingSpinner message="Loading your dashboard..." className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" />;
  }

  if (error) {
    return <ErrorDisplay 
      error={error} 
      title="Error Loading Dashboard" 
      onRetry={() => window.location.reload()} 
      retryText="Retry" 
    />;
  }

  const stats = dashboardData.stats ? [
    { 
      title: 'Today\'s Appointments', 
      value: dashboardData.stats.todayAppointments.toString(), 
      icon: Calendar, 
      color: 'bg-blue-500',
      change: `${dashboardData.stats.todayAppointments} scheduled for today`
    },
    { 
      title: 'Total Patients', 
      value: dashboardData.stats.totalPatients.toString(), 
      icon: Users, 
      color: 'bg-green-500',
      change: `${dashboardData.stats.uniquePatients} unique patients`
    },
    { 
      title: 'Prescriptions Written', 
      value: dashboardData.stats.prescriptionsWritten.toString(), 
      icon: Pill, 
      color: 'bg-purple-500',
      change: 'All prescriptions documented'
    },
    { 
      title: 'Consultation Hours', 
      value: `${dashboardData.stats.consultationHours}h`, 
      icon: Clock, 
      color: 'bg-orange-500',
      change: 'Based on completed appointments'
    }
  ] : [];

  const recentActivities = [
    { id: 1, action: 'Patient consultation completed', time: '15 minutes ago', type: 'consultation' },
    { id: 2, action: 'Prescription written for John Doe', time: '1 hour ago', type: 'prescription' },
    { id: 3, action: 'Medical report reviewed', time: '2 hours ago', type: 'report' },
    { id: 4, action: 'Appointment scheduled for tomorrow', time: '3 hours ago', type: 'appointment' }
  ];

  const quickActions = [
    { title: 'View Today\'s Schedule', icon: Calendar, color: 'bg-blue-500', action: () => console.log('View schedule') },
    { title: 'Write Prescription', icon: Pill, color: 'bg-green-500', action: () => console.log('Write prescription') },
    { title: 'Patient Records', icon: FileText, color: 'bg-purple-500', action: () => console.log('View records') },
    { title: 'Medical Reports', icon: ClipboardList, color: 'bg-orange-500', action: () => console.log('View reports') }
  ];

  // Format appointments for display
  const formatAppointments = (appointments) => {
    return appointments.map(appointment => {
      const appointmentDate = new Date(appointment.date);
      const timeString = appointmentDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      return {
        id: appointment._id,
        patient: appointment.patientId?.userId?.name || 'Unknown Patient',
        time: timeString,
        type: appointment.reason || 'Consultation',
        status: appointment.status,
        date: appointmentDate.toLocaleDateString()
      };
    }).sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  const upcomingAppointments = dashboardData.appointments ? formatAppointments(dashboardData.appointments) : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-7xl mx-auto md:pl-16 px-4 sm:px-6 lg:px-8">
        <div className="py-6 m-4 md:pl-16 lg:mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Welcome back, {dashboardData.doctorProfile?.userId?.name || user?.name || 'User'}!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {dashboardData.doctorProfile?.specialization ? 
                `${dashboardData.doctorProfile.specialization} Specialist` : 
                'Here\'s your medical practice overview for today.'
              }
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                change={stat.change}
              />
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
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Today's Appointments</h3>
                <div className="space-y-3 sm:space-y-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <User className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                            <p className="text-xs text-gray-500">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : appointment.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medical Tip */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
              <h3 className="text-base sm:text-lg font-semibold">Medical Tip of the Day</h3>
            </div>
            <p className="text-green-100 text-sm sm:text-base">
              Always ensure proper documentation of patient consultations and maintain clear communication 
              with patients about their treatment plans and follow-up care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
