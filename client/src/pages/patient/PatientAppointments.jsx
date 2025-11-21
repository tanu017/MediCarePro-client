import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Filter,
  Search,
  RefreshCw,
  Plus,
  X,
  Eye,
  MessageSquare
} from 'lucide-react';
import { appointmentAPI } from '../../api/appointmentApi';
import BookAppointmentModal from '../../components/BookAppointmentModal';
import { AppointmentDetailsModal, CancelAppointmentModal, SuccessDialog } from '../../components/common';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentAPI.getMyAppointments();
      setAppointments(response.appointments || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (reason) => {
    try {
      await appointmentAPI.cancelAppointment(selectedAppointment._id, reason);
      // Update the local state
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === selectedAppointment._id 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );
      setSuccessMessage('Appointment cancelled successfully!');
      setShowSuccessDialog(true);
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err.message || 'Failed to cancel appointment');
    }
  };

  const handleCardClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const handleAppointmentBooked = () => {
    // Refresh the appointments list when a new appointment is booked
    fetchAppointments();
  };

  // Filter appointments based on status and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      appointment.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });


  // Sort appointments by date (most recent first)
  const sortedAppointments = filteredAppointments.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'booked':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'booked':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Appointments</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-7xl mx-auto md:pl-16 px-2 sm:px-4 lg:px-8">
        <div className="py-4 sm:py-6 m-2 sm:m-4 md:pl-16 lg:mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
                <p className="text-sm sm:text-base text-gray-600">View and manage your medical appointments</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowBookModal(true)}
                  className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Book Appointment</span>
                  <span className="sm:hidden">Book</span>
                </button>
                <button
                  onClick={fetchAppointments}
                  className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          {appointments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {appointments.filter(apt => apt.status === 'booked').length}
                  </div>
                  <div className="text-sm text-gray-500">Booked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {appointments.filter(apt => apt.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {appointments.filter(apt => apt.status === 'cancelled').length}
                  </div>
                  <div className="text-sm text-gray-500">Cancelled</div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appointments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 transition-all duration-200 hover:shadow-md hover:border-blue-300 cursor-pointer"
                  onClick={() => handleCardClick(appointment)}
                >
                  {/* Header */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                           {appointment.doctorId?.userId?.name || 'Unknown Doctor'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{appointment.reason || 'Consultation'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      {getStatusIcon(appointment.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{formatTime(appointment.date)}</span>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    {appointment.doctorId?.specialization && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm truncate">{appointment.doctorId.specialization}</span>
                      </div>
                    )}
                    {appointment.doctorId?.userId?.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">{appointment.doctorId.userId.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Message */}
                  <div className="pt-3 sm:pt-4 border-t border-gray-100">
                    {appointment.status === 'booked' && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-2 text-blue-600">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm font-medium">Booked appointment</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelClick(appointment);
                          }}
                          className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium self-start sm:self-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {appointment.status === 'completed' && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-medium">Appointment completed</span>
                      </div>
                    )}
                    {appointment.status === 'cancelled' && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-medium">Appointment cancelled</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'You don\'t have any appointments yet.'}
                </p>
                <button
                  onClick={() => setShowBookModal(true)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Book Your First Appointment
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={showDetailsModal}
        onClose={closeModals}
        appointment={selectedAppointment}
      />

      {/* Cancel Appointment Modal */}
      <CancelAppointmentModal
        isOpen={showCancelModal}
        onClose={closeModals}
        appointment={selectedAppointment}
        onConfirm={cancelAppointment}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        message={successMessage}
      />

    </div>

    {/* Book Appointment Modal */}
    <BookAppointmentModal
      isOpen={showBookModal}
      onClose={() => setShowBookModal(false)}
      onAppointmentBooked={handleAppointmentBooked}
      userRole="PATIENT"
    />
  </>
  );
};

export default PatientAppointments;
