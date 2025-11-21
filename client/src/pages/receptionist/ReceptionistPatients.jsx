import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { receptionistAPI } from '../../api/receptionistApi';
import { 
  PatientFormModal, 
  PatientDetailsModal
} from '../../components/receptionist';
import { SuccessDialog } from '../../components/common';

const ReceptionistPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    gender: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await receptionistAPI.getPatients();
      setPatients(response || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await receptionistAPI.createPatient(formData);
      setShowSuccessDialog(true);
      setSuccessMessage('Patient added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchPatients();
    } catch (err) {
      console.error('Error adding patient:', err);
      setError(err.message || 'Failed to add patient');
    }
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    try {
      await receptionistAPI.updatePatient(selectedPatient._id, formData);
      setShowSuccessDialog(true);
      setSuccessMessage('Patient updated successfully!');
      setShowEditModal(false);
      resetForm();
      fetchPatients();
    } catch (err) {
      console.error('Error updating patient:', err);
      setError(err.message || 'Failed to update patient');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      contactNumber: '',
      gender: '',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      emergencyContact: {
        name: '',
        phone: '',
        relation: ''
      }
    });
  };

  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.userId?.name || patient.name || '',
      email: patient.userId?.email || patient.email || '',
      password: '',
      contactNumber: patient.contactNumber || '',
      gender: patient.gender || '',
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
      address: {
        street: patient.address?.street || '',
        city: patient.address?.city || '',
        state: patient.address?.state || '',
        pincode: patient.address?.pincode || ''
      },
      emergencyContact: {
        name: patient.emergencyContact?.name || '',
        phone: patient.emergencyContact?.phone || '',
        relation: patient.emergencyContact?.relation || ''
      }
    });
    setShowEditModal(true);
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    (patient.userId?.name || patient.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.userId?.email || patient.email)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contactNumber?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading patients...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-1">Manage patient records and information</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        {patients.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{patients.length}</div>
                <div className="text-sm text-gray-500">Total Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {patients.filter(patient => patient.isActive !== false).length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {patients.filter(patient => patient.gender === 'male').length}
                </div>
                <div className="text-sm text-gray-500">Male</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {patients.filter(patient => patient.gender === 'female').length}
                </div>
                <div className="text-sm text-gray-500">Female</div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={fetchPatients}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Patients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div 
                key={patient._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-blue-300 cursor-pointer"
                onClick={() => openViewModal(patient)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.userId?.name || patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.userId?.email || patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      patient.isActive !== false 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {patient.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{patient.contactNumber || 'No phone number'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'No date of birth'}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{patient.address?.city || 'No address'}</span>
                  </div>
                  {patient.gender && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="text-sm capitalize">{patient.gender}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">View Details</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(patient);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms.' 
                  : 'Get started by adding your first patient.'}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Your First Patient
              </button>
            </div>
          )}
        </div>


        {/* Add Patient Modal */}
        <PatientFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPatient}
          formData={formData}
          onInputChange={handleInputChange}
          isEdit={false}
        />

        {/* View Patient Modal */}
        <PatientDetailsModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          patient={selectedPatient}
        />

        {/* Edit Patient Modal */}
        <PatientFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditPatient}
          formData={formData}
          onInputChange={handleInputChange}
          isEdit={true}
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

export default ReceptionistPatients;
