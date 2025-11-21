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
  Pill
} from 'lucide-react';
import { doctorAPI } from '../../api/doctorApi';
import { 
  AppointmentCard, 
  PrescriptionModal, 
  AppointmentViewModal, 
  CancelConfirmationDialog 
} from '../../components/doctor';
import { SuccessDialog, LoadingSpinner, ErrorDisplay } from '../../components/common';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    medications: [{ name: '', dosage: '', duration: '', instructions: '' }],
    notes: ''
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorAPI.getAppointments();
      setAppointments(response);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await doctorAPI.updateAppointment(appointmentId, newStatus);
      // Update the local state
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError(err.message || 'Failed to update appointment status');
    }
  };

  const handleCardClick = (appointment) => {
    if (appointment.status === 'booked') {
      setSelectedAppointment(appointment);
      setShowPrescriptionModal(true);
      // Reset prescription data
      setPrescriptionData({
        medications: [{ name: '', dosage: '', duration: '', instructions: '' }],
        notes: ''
      });
    } else if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      setSelectedAppointment(appointment);
      setShowViewModal(true);
    }
  };

  const handleAddMedication = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', duration: '', instructions: '' }]
    }));
  };

  const handleRemoveMedication = (index) => {
    if (prescriptionData.medications.length > 1) {
      setPrescriptionData(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }));
    }
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleCompleteWithPrescription = async () => {
    try {
      // First create the prescription
      const prescriptionResponse = await doctorAPI.createPrescription({
        appointmentId: selectedAppointment._id,
        doctorId: selectedAppointment.doctorId,
        patientId: selectedAppointment.patientId._id,
        medications: prescriptionData.medications.filter(med => med.name.trim() !== ''),
        notes: prescriptionData.notes
      });

      // Then update appointment status to completed
      await updateAppointmentStatus(selectedAppointment._id, 'completed');
      
      // Show success dialog
      setSuccessMessage('Appointment completed successfully with prescription!');
      setShowSuccessDialog(true);
      
      // Close modal
      setShowPrescriptionModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Error completing appointment with prescription:', err);
      setError(err.message || 'Failed to complete appointment');
    }
  };

  const handleCompleteWithoutPrescription = async () => {
    try {
      await updateAppointmentStatus(selectedAppointment._id, 'completed');
      
      // Show success dialog
      setSuccessMessage('Appointment completed successfully!');
      setShowSuccessDialog(true);
      
      setShowPrescriptionModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Error completing appointment:', err);
      setError(err.message || 'Failed to complete appointment');
    }
  };

  const handleCancelAppointment = async () => {
    try {
      await updateAppointmentStatus(selectedAppointment._id, 'cancelled');
      
      // Show success dialog
      setSuccessMessage('Appointment cancelled successfully!');
      setShowSuccessDialog(true);
      
      setShowPrescriptionModal(false);
      setShowCancelDialog(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err.message || 'Failed to cancel appointment');
    }
  };

  const closeModal = () => {
    setShowPrescriptionModal(false);
    setShowCancelDialog(false);
    setShowViewModal(false);
    setSelectedAppointment(null);
    setPrescriptionData({
      medications: [{ name: '', dosage: '', duration: '', instructions: '' }],
      notes: ''
    });
  };

  // Check if at least one medication is complete
  const isMedicationComplete = (medication) => {
    return medication.name.trim() !== '' && 
           medication.dosage.trim() !== '' && 
           medication.duration.trim() !== '';
  };

  // Check if at least one medication is complete
  const hasCompleteMedication = () => {
    return prescriptionData.medications.some(med => isMedicationComplete(med));
  };

  // Filter appointments based on status and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      appointment.patientId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    return <LoadingSpinner message="Loading appointments..." />;
  }

  if (error) {
    return <ErrorDisplay 
      error={error} 
      title="Error Loading Appointments" 
      onRetry={fetchAppointments} 
      retryText="Try Again" 
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-7xl mx-auto md:pl-16 px-4 sm:px-6 lg:px-8">
        <div className="py-6 m-4 md:pl-16 lg:mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
                <p className="text-gray-600">Manage your patient appointments</p>
              </div>
              <button
                onClick={fetchAppointments}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Summary - Moved above search bar */}
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by patient name or reason..."
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  onClick={handleCardClick}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
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
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={closeModal}
        selectedAppointment={selectedAppointment}
        prescriptionData={prescriptionData}
        onMedicationChange={handleMedicationChange}
        onAddMedication={handleAddMedication}
        onRemoveMedication={handleRemoveMedication}
        onCompleteWithPrescription={handleCompleteWithPrescription}
        onCompleteWithoutPrescription={handleCompleteWithoutPrescription}
        onCancelAppointment={() => setShowCancelDialog(true)}
        hasCompleteMedication={hasCompleteMedication}
        isMedicationComplete={isMedicationComplete}
      />

      {/* View Appointment Modal */}
      <AppointmentViewModal
        isOpen={showViewModal}
        onClose={closeModal}
        selectedAppointment={selectedAppointment}
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelAppointment}
        patientName={selectedAppointment?.patientId?.userId?.name || 'Unknown Patient'}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        message={successMessage}
      />
    </div>
  );
};

export default DoctorAppointments;
