import React from 'react';
import { X, Plus, Pill } from 'lucide-react';

const PrescriptionModal = ({
  isOpen,
  onClose,
  selectedAppointment,
  prescriptionData,
  onMedicationChange,
  onAddMedication,
  onRemoveMedication,
  onCompleteWithPrescription,
  onCompleteWithoutPrescription,
  onCancelAppointment,
  hasCompleteMedication,
  isMedicationComplete
}) => {
  if (!isOpen || !selectedAppointment) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Prescription & Complete Appointment</h2>
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
          {/* Medications Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center">
                <Pill className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Medications
              </h3>
              <button
                onClick={onAddMedication}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-4">
              {prescriptionData.medications.map((medication, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                    {prescriptionData.medications.length > 1 && (
                      <button
                        onClick={() => onRemoveMedication(index)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medication Name *
                      </label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) => onMedicationChange(index, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                          medication.name.trim() === '' ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Paracetamol"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity/Dosage *
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => onMedicationChange(index, 'dosage', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                          medication.dosage.trim() === '' ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 500mg, 2 tablets"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Many Days *
                      </label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => onMedicationChange(index, 'duration', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                          medication.duration.trim() === '' ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 7 days, 2 weeks"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructions
                      </label>
                      <input
                        type="text"
                        value={medication.instructions}
                        onChange={(e) => onMedicationChange(index, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., Take with food, twice daily"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Help Text */}
            {!hasCompleteMedication() && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Please fill in at least one complete medication (Name, Quantity/Dosage, and How Many Days) to enable the "Complete with Prescription" button.
                </p>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={prescriptionData.notes}
              onChange={(e) => onMedicationChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
              placeholder="Any additional notes or instructions for the patient..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            
            <button
              onClick={onCancelAppointment}
              className="w-full sm:w-auto px-4 py-2 text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
            >
              Cancel Appointment
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={onCompleteWithoutPrescription}
              className="w-full sm:w-auto px-4 py-2 text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors"
            >
              Complete Without Prescription
            </button>
            
            <button
              onClick={onCompleteWithPrescription}
              disabled={!hasCompleteMedication()}
              className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors font-medium ${
                hasCompleteMedication()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Complete with Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
