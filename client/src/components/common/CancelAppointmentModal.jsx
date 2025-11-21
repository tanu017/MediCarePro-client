import React, { useState } from 'react';
import { XCircle, X } from 'lucide-react';

const CancelAppointmentModal = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onConfirm,
  variant = "centered" // "centered" or "compact"
}) => {
  const [cancellationReason, setCancellationReason] = useState('');

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

  const handleConfirm = () => {
    onConfirm(cancellationReason);
    setCancellationReason('');
  };

  const handleClose = () => {
    setCancellationReason('');
    onClose();
  };

  // Centered variant (default)
  if (variant === "centered") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-600/20 via-red-600/20 to-red-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Appointment</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your appointment with {appointment.doctorId?.userId?.name} on {formatDate(appointment.date)}?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                placeholder="Please provide a reason for cancelling..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Cancel Appointment</h3>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900">
                {appointment.patientId?.userId?.name} with {appointment.doctorId?.userId?.name}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(appointment.date)} at {appointment.time || appointment.timeSlot}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={3}
              placeholder="Please provide a reason for cancellation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Keep Appointment
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Cancel Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
