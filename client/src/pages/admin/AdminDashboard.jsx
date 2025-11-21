import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope,
  Users, 
  Calendar,
  Receipt,
  CreditCard,
  Shield,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAdminDashboardStats, 
  adminDoctorAPI, 
  adminReceptionistAPI, 
  adminPatientAPI, 
  adminBillingAPI 
} from '../../api/adminApi';
import {
  QuickActionsCard,
  RecentItemsCard
} from '../../components/admin';
import { StatsCard, LoadingSpinner, ErrorDisplay } from '../../components/common';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentBills: [],
    doctors: [],
    patients: [],
    appointments: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [
          dashboardStatsResponse,
          doctorsResponse,
          patientsResponse,
          billsResponse,
          receptionistsResponse
        ] = await Promise.all([
          getAdminDashboardStats(),
          adminDoctorAPI.getAllDoctors(),
          adminPatientAPI.getAllPatients(),
          adminBillingAPI.getAllBills(),
          adminReceptionistAPI.getAllReceptionists()
        ]);

        const doctors = doctorsResponse.doctors || [];
        const patients = patientsResponse.patients || [];
        const bills = billsResponse.bills || [];
        const receptionists = receptionistsResponse.receptionists || [];
        const dashboardStats = dashboardStatsResponse.stats || {};
        const recentData = dashboardStatsResponse.recent || {};

        setDashboardData({
          stats: {
            totalDoctors: dashboardStats.totalDoctors || doctors.length,
            totalPatients: dashboardStats.totalPatients || patients.length,
            totalReceptionists: dashboardStats.totalReceptionists || receptionists.length,
            totalBills: dashboardStats.totalBills || bills.length,
            totalRevenue: dashboardStats.totalRevenue || 0,
            paidRevenue: dashboardStats.paidRevenue || 0,
            pendingBills: dashboardStats.pendingBills || 0,
            paidBills: dashboardStats.paidBills || 0,
            totalAppointments: dashboardStats.totalAppointments || 0,
            todayAppointments: dashboardStats.todayAppointments || 0
          },
          recentBills: recentData.bills || bills.slice(0, 5),
          doctors: recentData.doctors || doctors.slice(0, 5),
          patients: recentData.patients || patients.slice(0, 5),
          appointments: recentData.appointments || []
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user]);

  if (loading || isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <ErrorDisplay error={error} />
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      title: 'Total Doctors', 
      value: dashboardData.stats.totalDoctors || 0, 
      icon: Stethoscope, 
      color: 'bg-blue-500',
      change: `${dashboardData.stats.totalDoctors || 0} active doctors`
    },
    { 
      title: 'Total Patients', 
      value: dashboardData.stats.totalPatients || 0, 
      icon: Users, 
      color: 'bg-green-500',
      change: `${dashboardData.stats.totalPatients || 0} registered patients`
    },
    { 
      title: 'Total Appointments', 
      value: dashboardData.stats.totalAppointments || 0, 
      icon: Calendar, 
      color: 'bg-purple-500',
      change: `${dashboardData.stats.todayAppointments || 0} today`
    },
    { 
      title: 'Total Revenue', 
      value: `₹${(dashboardData.stats.totalRevenue || 0).toLocaleString()}`, 
      icon: Receipt, 
      color: 'bg-orange-500',
      change: `₹${(dashboardData.stats.paidRevenue || 0).toLocaleString()} collected`
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New doctor registered', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'System backup completed', time: '4 hours ago', type: 'system' },
    { id: 3, action: 'Patient data updated', time: '6 hours ago', type: 'data' },
    { id: 4, action: 'Appointment system optimized', time: '1 day ago', type: 'system' }
  ];

  const quickActions = [
    { title: 'Manage Doctors', icon: Stethoscope, color: 'bg-blue-500', action: () => navigate('/admin/doctors') },
    { title: 'Manage Receptionists', icon: UserCheck, color: 'bg-green-500', action: () => navigate('/admin/receptionists') },
    { title: 'Manage Patients', icon: Users, color: 'bg-purple-500', action: () => navigate('/admin/patients') },
    { title: 'View Billing', icon: CreditCard, color: 'bg-orange-500', action: () => navigate('/admin/billing') }
  ];

  const systemOverview = [
    { id: 1, metric: 'Server Status', value: 'Online', status: 'good' },
    { id: 2, metric: 'Database Health', value: '98.5%', status: 'good' },
    { id: 3, metric: 'Active Sessions', value: '23', status: 'normal' },
    { id: 4, metric: 'Storage Used', value: '67%', status: 'warning' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-7xl mx-auto md:pl-16 px-4 sm:px-6 lg:px-8">
        <div className="py-6 m-4 md:pl-16 lg:mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Here's your hospital management system overview.</p>
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
              <QuickActionsCard actions={quickActions} />
            </div>

            {/* Recent Bills */}
            <div className="lg:col-span-2">
              <RecentItemsCard
                title="Recent Bills"
                items={dashboardData.recentBills}
                icon={CreditCard}
                iconColor="text-blue-500"
                emptyMessage="No bills found"
                renderItem={(bill) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Bill #{bill.billId || bill._id.slice(-6)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {bill.patientId?.userId?.name || 'Unknown Patient'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{bill.amount}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        bill.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : bill.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bill.paymentStatus}
                      </span>
                    </div>
                  </>
                )}
              />
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
            {/* Recent Doctors */}
            <RecentItemsCard
              title="Recent Doctors"
              items={dashboardData.doctors}
              icon={Stethoscope}
              iconColor="text-blue-500"
              emptyMessage="No doctors found"
              renderItem={(doctor) => (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Stethoscope className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{doctor.userId?.name}</p>
                    <p className="text-xs text-gray-500">{doctor.specialization || 'General Medicine'}</p>
                  </div>
                </div>
              )}
            />

            {/* Recent Patients */}
            <RecentItemsCard
              title="Recent Patients"
              items={dashboardData.patients}
              icon={Users}
              iconColor="text-green-500"
              emptyMessage="No patients found"
              renderItem={(patient) => (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{patient.userId?.name}</p>
                    <p className="text-xs text-gray-500">{patient.gender} • {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'No DOB'}</p>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Admin Tip */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
              <h3 className="text-base sm:text-lg font-semibold">Admin Tip of the Day</h3>
            </div>
            <p className="text-purple-100 text-sm sm:text-base">
              Regularly monitor system performance and user activity to ensure optimal operation. 
              Keep backups updated and review security logs for any unusual activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
