import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Stethoscope,
  Mail,
  Phone,
  Calendar,
  User
} from 'lucide-react';
import { adminDoctorAPI } from '../../api/adminApi';
import {
  PageHeader,
  SearchBar,
  UserCard,
  UserFormModal,
  DeleteConfirmationModal,
  EmptyState
} from '../../components/admin';
import { ErrorDisplay, LoadingSpinner } from '../../components/common';

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    department: '',
    yearsOfExperience: '',
    availability: []
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminDoctorAPI.getAllDoctors();
      setDoctors(response.doctors || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDoctor = () => {
    setModalType('add');
    setSelectedDoctor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      specialization: '',
      department: '',
      yearsOfExperience: '',
      availability: []
    });
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setModalType('edit');
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.userId?.name || '',
      email: doctor.userId?.email || '',
      phone: doctor.userId?.phone || '',
      password: '',
      specialization: doctor.specialization || '',
      department: doctor.department || '',
      yearsOfExperience: doctor.yearsOfExperience || doctor.yearsOfExperience || '',
      availability: doctor.availability || []
    });
    setShowModal(true);
  };

  const handleViewDoctor = (doctor) => {
    setModalType('view');
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.userId?.name || '',
      email: doctor.userId?.email || '',
      phone: doctor.userId?.phone || '',
      password: '',
      specialization: doctor.specialization || '',
      department: doctor.department || '',
      yearsOfExperience: doctor.yearsOfExperience || doctor.yearsOfExperience || '',
      availability: doctor.availability || []
    });
    setShowModal(true);
  };

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const confirmDeleteDoctor = async () => {
    if (doctorToDelete) {
      try {
        await adminDoctorAPI.deleteDoctor(doctorToDelete._id);
        await fetchDoctors();
        setShowDeleteModal(false);
        setDoctorToDelete(null);
      } catch (err) {
        console.error('Error deleting doctor:', err);
        setError('Failed to delete doctor');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await adminDoctorAPI.createDoctor(formData);
      } else if (modalType === 'edit') {
        await adminDoctorAPI.updateDoctor(selectedDoctor._id, formData);
      }
      setShowModal(false);
      await fetchDoctors();
    } catch (err) {
      console.error('Error saving doctor:', err);
      setError('Failed to save doctor');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading doctors..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-full md:pl-16 px-4 sm:px-6 lg:px-8">
        <div className="py-8 m-4 md:pl-16 lg:mx-auto">
        <PageHeader
          title="Manage Doctors"
          subtitle="Add, edit, and manage doctor profiles"
          onBackClick={() => navigate('/admin')}
          onActionClick={handleAddDoctor}
          actionButtonText="Add Doctor"
          actionButtonIcon={Plus}
          actionButtonColor="bg-blue-600 hover:bg-blue-700"
        />

        <SearchBar
          placeholder="Search doctors by name, email, specialization, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          focusColor="focus:ring-blue-500"
        />

        <ErrorDisplay error={error} onDismiss={() => setError(null)} />

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <UserCard
              key={doctor._id}
              user={doctor}
              icon={Stethoscope}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
              onView={handleViewDoctor}
              onEdit={handleEditDoctor}
              onDelete={handleDeleteDoctor}
              renderDetails={(doctor) => (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{doctor.userId?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{doctor.userId?.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{doctor.department || 'No department'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{doctor.yearsOfExperience || doctor.experienceYears || 0} years experience</span>
                  </div>
                </>
              )}
              renderFooter={(doctor) => (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Added {new Date(doctor.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              )}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && !isLoading && (
          <EmptyState
            icon={Stethoscope}
            title="No doctors found"
            description={searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first doctor'}
            actionButton={!searchTerm}
            actionButtonText="Add Doctor"
            actionButtonIcon={Plus}
            onActionClick={handleAddDoctor}
            actionButtonColor="bg-blue-600 hover:bg-blue-700"
          />
        )}

        <UserFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={modalType === 'add' ? 'Add New Doctor' : 
                 modalType === 'edit' ? 'Edit Doctor' : 'Doctor Details'}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          modalType={modalType}
          fields={[
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true },
            ...(modalType === 'add' ? [{ name: 'password', label: 'Password', type: 'password', required: true }] : []),
            { name: 'specialization', label: 'Specialization', type: 'text', required: true },
            { name: 'department', label: 'Department', type: 'text', required: true },
            { name: 'yearsOfExperience', label: 'Years of Experience', type: 'number', required: true }
          ]}
          submitButtonText={modalType === 'add' ? 'Add Doctor' : 'Update Doctor'}
          submitButtonColor="bg-blue-600 hover:bg-blue-700"
        />

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDoctorToDelete(null);
          }}
          onConfirm={confirmDeleteDoctor}
          item={doctorToDelete}
          itemType="doctor"
          icon={Stethoscope}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
