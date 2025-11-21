import React from 'react';
import { 
  X, 
  User, 
  Pill, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download
} from 'lucide-react';

const PrescriptionDetailsModal = ({ isOpen, onClose, prescription, onDownload }) => {
  if (!isOpen || !prescription) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculatePrescriptionStatus = (prescription) => {
    const prescriptionDate = new Date(prescription.createdAt);
    const today = new Date();
    
    // Find the maximum duration from all medications
    let maxDurationDays = 0;
    prescription.medications?.forEach(medication => {
      if (medication.duration) {
        // Extract number from duration string (e.g., "7 days" -> 7, "2 weeks" -> 14)
        const durationMatch = medication.duration.match(/(\d+)/);
        if (durationMatch) {
          const duration = parseInt(durationMatch[1]);
          if (medication.duration.toLowerCase().includes('week')) {
            maxDurationDays = Math.max(maxDurationDays, duration * 7);
          } else if (medication.duration.toLowerCase().includes('day')) {
            maxDurationDays = Math.max(maxDurationDays, duration);
          } else {
            // Assume days if no unit specified
            maxDurationDays = Math.max(maxDurationDays, duration);
          }
        }
      }
    });

    if (maxDurationDays === 0) {
      return 'progress'; // Default to progress if no duration specified
    }

    const daysSincePrescription = Math.floor((today - prescriptionDate) / (1000 * 60 * 60 * 24));
    
    if (daysSincePrescription >= maxDurationDays) {
      return 'completed';
    } else {
      return 'progress';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMedicationCount = (prescription) => {
    return prescription.medications?.length || 0;
  };

  const status = calculatePrescriptionStatus(prescription);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600/20 via-green-600/20 to-green-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Prescription Details</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
              {prescription.doctorId?.userId?.name || 'Unknown Doctor'}
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
            {/* Doctor Information */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Prescribing Doctor
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Doctor Name</label>
                  <p className="text-gray-900 font-medium">{prescription.doctorId?.userId?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Specialization</label>
                  <p className="text-gray-900">{prescription.doctorId?.specialization || 'General Medicine'}</p>
                </div>
                {prescription.doctorId?.userId?.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{prescription.doctorId.userId.email}</p>
                  </div>
                )}
                {prescription.doctorId?.userId?.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{prescription.doctorId.userId.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Prescription Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-blue-600" />
                Prescription Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Prescribed Date</label>
                  <p className="text-gray-900">{formatDateTime(prescription.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Medications</label>
                  <p className="text-gray-900">{getMedicationCount(prescription)} medication(s)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Prescription ID</label>
                  <p className="text-gray-900 font-mono text-sm">{prescription._id.slice(-8)}</p>
                </div>
              </div>
            </div>

            {/* Medications */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-green-600" />
                Prescribed Medications
              </h3>
              <div className="space-y-4">
                {prescription.medications?.map((medication, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Pill className="h-4 w-4 mr-2 text-green-600" />
                        {medication.name}
                      </h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Medication {index + 1}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {medication.dosage && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Dosage/Quantity</label>
                          <p className="text-gray-900 font-medium">{medication.dosage}</p>
                        </div>
                      )}
                      {medication.duration && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Duration</label>
                          <p className="text-gray-900 font-medium">{medication.duration}</p>
                        </div>
                      )}
                      {medication.instructions && (
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-gray-600">Instructions</label>
                          <p className="text-gray-900 bg-blue-50 p-2 rounded border-l-4 border-blue-200">
                            {medication.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor's Notes */}
            {prescription.notes && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Doctor's Notes & Instructions
                </h3>
                <div className="bg-white p-3 rounded border-l-4 border-blue-300">
                  <p className="text-gray-700">{prescription.notes}</p>
                </div>
              </div>
            )}

            {/* Related Appointment */}
            {prescription.appointmentId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Related Appointment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Appointment Date</label>
                    <p className="text-gray-900">{formatDate(prescription.appointmentId.date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reason for Visit</label>
                    <p className="text-gray-900">{prescription.appointmentId.reason || 'Consultation'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Appointment Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      prescription.appointmentId.status === 'completed' 
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {prescription.appointmentId.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Important Information */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                Important Information
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Take medications exactly as prescribed by your doctor</li>
                <li>• Do not stop taking medications without consulting your doctor</li>
                <li>• Contact your doctor if you experience any side effects</li>
                <li>• Keep this prescription for your medical records</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsModal;