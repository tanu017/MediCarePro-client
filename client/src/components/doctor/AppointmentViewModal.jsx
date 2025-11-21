import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const AppointmentViewModal = ({
  isOpen,
  onClose,
  selectedAppointment,
  getStatusIcon,
  getStatusColor,
  formatDate,
  formatTime
}) => {
  if (!isOpen || !selectedAppointment) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Appointment Details
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
              Patient: {selectedAppointment.patientId?.userId?.name || 'Unknown Patient'}
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
          {/* Appointment Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Appointment Status</h3>
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedAppointment.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.patientId?.userId?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.patientId?.userId?.email || 'No email'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.patientId?.userId?.phone || 'No phone'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.patientId?.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedAppointment.date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <p className="text-sm text-gray-900">{formatTime(selectedAppointment.date)}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.reason || 'Consultation'}</p>
                </div>
                {selectedAppointment.notes && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <p className="text-sm text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedAppointment._id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedAppointment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {selectedAppointment.updatedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedAppointment.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentViewModal;
