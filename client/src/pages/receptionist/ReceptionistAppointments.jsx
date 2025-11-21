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
  MessageSquare,
  Trash2,
  Edit3
} from 'lucide-react';
import { receptionistAPI } from '../../api/receptionistApi';
import BookAppointmentModal from '../../components/BookAppointmentModal';
import { AppointmentDetailsModal, CancelAppointmentModal, SuccessDialog } from '../../components/common';

const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const appointmentsRes = await receptionistAPI.getAppointments();
      setAppointments(appointmentsRes || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentBooked = () => {
    setShowSuccessDialog(true);
    setSuccessMessage('Appointment created successfully!');
    fetchData();
  };

  const handleCancelAppointment = async (reason) => {
    try {
      await receptionistAPI.cancelAppointment(selectedAppointment._id, reason);
      setShowSuccessDialog(true);
      setSuccessMessage('Appointment cancelled successfully!');
      setShowCancelModal(false);
      fetchData();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err.message || 'Failed to cancel appointment');
    }
  };


  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
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

  // Filter appointments based on status and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = 
      appointment.patientId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-7xl mx-auto md:pl-20 px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
              <p className="text-gray-600 mt-1">Manage patient appointments and schedules</p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        {appointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {appointments.filter(apt => apt.status === 'pending' || apt.status === 'booked').length}
                </div>
                <div className="text-sm text-gray-500">Pending/Booked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-500">Confirmed</div>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, or reason..."
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div 
                key={appointment._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-blue-300 cursor-pointer"
                onClick={() => openDetailsModal(appointment)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patientId?.userId?.name || 'Unknown Patient'}
                      </h3>
                      <p className="text-sm text-gray-500">{appointment.reason || 'Consultation'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(appointment.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{appointment.time || appointment.timeSlot}</span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Stethoscope className="h-4 w-4" />
                    <span className="text-sm">{appointment.doctorId?.userId?.name || 'Unknown Doctor'}</span>
                  </div>
                  {appointment.doctorId?.specialization && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{appointment.doctorId.specialization}</span>
                    </div>
                  )}
                </div>

                {/* Status Message */}
                <div className="pt-4 border-t border-gray-100">
                  {appointment.status === 'booked' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Booked appointment</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCancelModal(appointment);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {appointment.status === 'completed' && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Appointment completed</span>
                    </div>
                  )}
                  {appointment.status === 'cancelled' && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Appointment cancelled</span>
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
                  : 'Get started by creating your first appointment.'}
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

        {/* Book Appointment Modal */}
        <BookAppointmentModal
          isOpen={showBookModal}
          onClose={() => setShowBookModal(false)}
          onAppointmentBooked={handleAppointmentBooked}
          userRole="RECEPTIONIST"
        />

        {/* Appointment Details Modal */}
        <AppointmentDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          appointment={selectedAppointment}
        />

        {/* Cancel Appointment Modal */}
        <CancelAppointmentModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          appointment={selectedAppointment}
          onConfirm={handleCancelAppointment}
        />

        {/* Success Dialog */}
        <SuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          message={successMessage}
        />
      </div>
    </div>
  );
};

export default ReceptionistAppointments;
