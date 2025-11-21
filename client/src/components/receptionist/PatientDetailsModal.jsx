import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin 
} from 'lucide-react';

const PatientDetailsModal = ({ 
  isOpen, 
  onClose, 
  patient 
}) => {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Patient Details</h2>
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
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {patient.userId?.name || patient.name}
                </h3>
                <p className="text-gray-600">{patient.userId?.email || patient.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {patient.contactNumber || 'No phone number'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {patient.userId?.email || patient.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'No date of birth'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {patient.gender || 'Not specified'}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Address</h4>
                <div className="text-sm text-gray-600">
                  {patient.address?.street && <p>{patient.address.street}</p>}
                  {patient.address?.city && <p>{patient.address.city}</p>}
                  {patient.address?.state && <p>{patient.address.state}</p>}
                  {patient.address?.pincode && <p>{patient.address.pincode}</p>}
                  {!patient.address?.street && !patient.address?.city && (
                    <p className="text-gray-400">No address provided</p>
                  )}
                </div>
              </div>
            </div>

            {patient.emergencyContact && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">{patient.emergencyContact.name}</p>
                  <p className="text-sm text-gray-600">{patient.emergencyContact.phone}</p>
                  <p className="text-sm text-gray-600">{patient.emergencyContact.relation}</p>
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
};

export default PatientDetailsModal;
