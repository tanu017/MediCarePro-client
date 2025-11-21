import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  User
} from 'lucide-react';
import { adminPatientAPI } from '../../api/adminApi';
import {
  PageHeader,
  SearchBar,
  UserCard,
  UserFormModal,
  DeleteConfirmationModal,
  EmptyState
} from '../../components/admin';
import { ErrorDisplay, LoadingSpinner } from '../../components/common';

const AdminPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '', // FIX: Changed from 'dob'
    gender: '',
    address: '',
    bloodGroup: '',
    medicalHistory: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatAddress(patient.address).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminPatientAPI.getAllPatients();
      setPatients(response.patients || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = () => {
    setModalType('add');
    setSelectedPatient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      dateOfBirth: '', // FIX: Changed from 'dob'
      gender: '',
      address: '',
      bloodGroup: '',
      medicalHistory: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: ''
    });
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setModalType('edit');
    setSelectedPatient(patient);
    setFormData({
      name: patient.userId?.name || '',
      email: patient.userId?.email || '',
      phone: patient.userId?.phone || '',
      password: '',
      // FIX: Changed from 'dob' to 'dateOfBirth' to match backend model
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      gender: patient.gender || '',
      address: typeof patient.address === 'object' ? 
        `${patient.address?.street || ''}, ${patient.address?.city || ''}, ${patient.address?.state || ''}, ${patient.address?.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') : 
        patient.address || '',
      bloodGroup: patient.bloodGroup || '',
      medicalHistory: patient.medicalHistory || '',
      emergencyContactName: patient.emergencyContact?.name || '',
      emergencyContactPhone: patient.emergencyContact?.phone || '',
      emergencyContactRelation: patient.emergencyContact?.relation || ''
    });
    setShowModal(true);
  };

  const handleViewPatient = (patient) => {
    setModalType('view');
    setSelectedPatient(patient);
    setFormData({
      name: patient.userId?.name || '',
      email: patient.userId?.email || '',
      phone: patient.userId?.phone || '',
      password: '',
      // FIX: Changed from 'dob' to 'dateOfBirth' to match backend model
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      gender: patient.gender || '',
      address: typeof patient.address === 'object' ? 
        `${patient.address?.street || ''}, ${patient.address?.city || ''}, ${patient.address?.state || ''}, ${patient.address?.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') : 
        patient.address || '',
      bloodGroup: patient.bloodGroup || '',
      medicalHistory: patient.medicalHistory || '',
      emergencyContactName: patient.emergencyContact?.name || '',
      emergencyContactPhone: patient.emergencyContact?.phone || '',
      emergencyContactRelation: patient.emergencyContact?.relation || ''
    });
    setShowModal(true);
  };

  const handleDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const confirmDeletePatient = async () => {
    if (patientToDelete) {
      try {
        await adminPatientAPI.deletePatient(patientToDelete._id);
        await fetchPatients();
        setShowDeleteModal(false);
        setPatientToDelete(null);
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError('Failed to delete patient');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emergencyContact = {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation
      };

      const dataToSend = { ...formData };

      // Ensure the date is in a standard format
      if (dataToSend.dateOfBirth) {
        dataToSend.dateOfBirth = new Date(dataToSend.dateOfBirth);
      }

      const submitData = {
        ...dataToSend,
        emergencyContact: emergencyContact
      };

      delete submitData.emergencyContactName;
      delete submitData.emergencyContactPhone;
      delete submitData.emergencyContactRelation;

      if (modalType === 'edit' && !submitData.password) {
        delete submitData.password;
      }

      if (modalType === 'add') {
        await adminPatientAPI.createPatient(submitData);
      } else if (modalType === 'edit') {
        await adminPatientAPI.updatePatient(selectedPatient._id, submitData);
      }
      
      setShowModal(false);
      await fetchPatients();
    } catch (err) {
      console.error('Error saving patient:', err);
      setError('Failed to save patient');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAge = (dob) => {
    if (!dob) return 'Unknown';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatAddress = (address) => {
    if (!address) return 'No address';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.pincode) parts.push(address.pincode);
      return parts.length > 0 ? parts.join(', ') : 'No address';
    }
    return 'No address';
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading patients..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-full md:pl-16 px-4 sm:px-6 lg:px-8">
        <div className="py-8 m-4 md:pl-16 lg:mx-auto">
        <PageHeader
          title="Manage Patients"
          subtitle="Add, edit, and manage patient profiles"
          onBackClick={() => navigate('/admin')}
          onActionClick={handleAddPatient}
          actionButtonText="Add Patient"
          actionButtonIcon={Plus}
          actionButtonColor="bg-purple-600 hover:bg-purple-700"
        />

        <SearchBar
              placeholder="Search patients by name, email, gender, blood group, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          focusColor="focus:ring-purple-500"
        />

        <ErrorDisplay error={error} onDismiss={() => setError(null)} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <UserCard
              key={patient._id}
              user={patient}
              icon={Users}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
              onView={handleViewPatient}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
              renderDetails={(patient) => (
                <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{patient.userId?.email || 'No email'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{patient.userId?.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Heart className="h-4 w-4" />
                  <span>{patient.bloodGroup || 'No blood group'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{formatAddress(patient.address)}</span>
                </div>
                </>
              )}
              renderFooter={(patient) => (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Registered {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              )}
            />
          ))}
        </div>

        {filteredPatients.length === 0 && !isLoading && (
          <EmptyState
            icon={Users}
            title="No patients found"
            description={searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
            actionButton={!searchTerm}
            actionButtonText="Add Patient"
            actionButtonIcon={Plus}
            onActionClick={handleAddPatient}
            actionButtonColor="bg-purple-600 hover:bg-purple-700"
          />
        )}

        <UserFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={modalType === 'add' ? 'Add New Patient' : 
                     modalType === 'edit' ? 'Edit Patient' : 'Patient Details'}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          modalType={modalType}
          fields={[
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true },
            ...(modalType === 'add' ? [{ name: 'password', label: 'Password', type: 'password', required: true }] : []),
            // FIX: Changed name from 'dob' to 'dateOfBirth'
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
            { name: 'gender', label: 'Gender', type: 'select', required: true, options: genderOptions },
            { name: 'bloodGroup', label: 'Blood Group', type: 'select', options: bloodGroupOptions },
            { name: 'address', label: 'Address', type: 'textarea', fullWidth: true, placeholder: 'Street, City, State, Pincode (e.g., 123 Main St, Houston, TX, 77001)' },
            { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text', placeholder: 'Enter emergency contact name' },
            { name: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'tel', placeholder: 'Enter emergency contact phone' },
            { name: 'emergencyContactRelation', label: 'Emergency Contact Relation', type: 'text', placeholder: 'e.g., Father, Mother, Spouse, Friend' },
            { name: 'medicalHistory', label: 'Medical History', type: 'textarea', fullWidth: true, rows: 3, placeholder: 'Any known medical conditions, allergies, or previous treatments...' }
          ]}
          submitButtonText={modalType === 'add' ? 'Add Patient' : 'Update Patient'}
          submitButtonColor="bg-purple-600 hover:bg-purple-700"
        />

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setPatientToDelete(null);
          }}
          onConfirm={confirmDeletePatient}
          item={patientToDelete}
          itemType="patient"
          icon={User}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;