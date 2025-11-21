import React from "react";

const AppointmentConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  appointmentDetails 
}) => {
  if (!isOpen) return null;

  const { selectedDoctor, selectedDate, selectedTime, consultationFee, selectedPatient } = appointmentDetails;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-2 sm:mx-0">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            {selectedPatient 
              ? `The appointment for ${selectedPatient.userId?.name || selectedPatient.name} with ${selectedDoctor?.userId?.name || selectedDoctor?.name} has been successfully booked and payment processed.`
              : `Your appointment with ${selectedDoctor?.name} has been successfully booked and payment processed.`
            }
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-2">Appointment Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {selectedPatient && (
                <p><strong>Patient:</strong> {selectedPatient.userId?.name || selectedPatient.name}</p>
              )}
              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Doctor:</strong> {selectedDoctor?.userId?.name || selectedDoctor?.name}</p>
              <p><strong>Amount Paid:</strong> ₹{consultationFee}</p>
            </div>
          </div>
          <button
            onClick={onConfirm}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmationModal;
