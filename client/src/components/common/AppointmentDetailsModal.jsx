import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MessageSquare, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AppointmentDetailsModal = ({ 
  isOpen, 
  onClose, 
  appointment,
  showPatientInfo = true,
  showDoctorInfo = true,
  showNotes = true,
  variant = "detailed" // "detailed" or "compact"
}) => {
  if (!isOpen || !appointment) return null;

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

  // Compact variant
  if (variant === "compact") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {/* FIX: Check for name in multiple locations to ensure it displays */}
                    {showPatientInfo ? (appointment.patientId?.userId?.name || appointment.patientId?.name || 'Unknown Patient') : 'Appointment'}
                  </h3>
                  <p className="text-gray-600">with {appointment.doctorId?.userId?.name || 'Unknown Doctor'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Appointment Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(appointment.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {appointment.time || appointment.timeSlot || formatTime(appointment.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {appointment.reason || 'No reason specified'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1 capitalize">{appointment.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {showPatientInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {/* FIX: Check for name in multiple locations */}
                        {appointment.patientId?.userId?.name || appointment.patientId?.name || 'Unknown'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {/* FIX: Check for email in multiple locations */}
                        {appointment.patientId?.userId?.email || appointment.patientId?.email || 'No email'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {appointment.patientId?.contactNumber || appointment.patientId?.userId?.phone || 'No phone'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {showNotes && appointment.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant (default)
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Appointment Details</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
              {appointment.doctorId?.userId?.name || 'Unknown Doctor'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Appointment Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Appointment Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-gray-900">{formatDate(appointment.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Time</label>
                  <p className="text-gray-900">{appointment.time || appointment.timeSlot || formatTime(appointment.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reason</label>
                  <p className="text-gray-900">{appointment.reason || 'Consultation'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            {showPatientInfo && appointment.patientId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    {/* FIX: Check for name in multiple locations */}
                    <p className="text-gray-900">{appointment.patientId?.userId?.name || appointment.patientId?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    {/* FIX: Check for email in multiple locations */}
                    <p className="text-gray-900">{appointment.patientId?.userId?.email || appointment.patientId?.email || 'No email'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{appointment.patientId?.contactNumber || appointment.patientId?.userId?.phone || 'No phone'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Info */}
            {showDoctorInfo && appointment.doctorId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Doctor Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900"> {appointment.doctorId?.userId?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Specialization</label>
                    <p className="text-gray-900">{appointment.doctorId?.specialization || 'General'}</p>
                  </div>
                  {appointment.doctorId?.userId?.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{appointment.doctorId.userId.phone}</p>
                    </div>
                  )}
                  {appointment.doctorId?.userId?.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{appointment.doctorId.userId.email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {showNotes && appointment.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;