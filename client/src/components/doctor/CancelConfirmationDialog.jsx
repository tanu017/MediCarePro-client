import React from 'react';
import { XCircle } from 'lucide-react';

const CancelConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  patientName = 'Unknown Patient'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-600/20 via-red-600/20 to-red-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Appointment</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to cancel this appointment with{' '}
            <strong>{patientName}</strong>?
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              This action cannot be undone.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Keep Appointment
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Yes, Cancel Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationDialog;
