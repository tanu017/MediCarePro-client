import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    UserCheck,
    Mail,
    Phone,
    Clock,
    User
} from 'lucide-react';
import { adminReceptionistAPI } from '../../api/adminApi';
import {
    PageHeader,
    SearchBar,
    UserCard,
    UserFormModal,
    DeleteConfirmationModal,
    EmptyState
} from '../../components/admin';
import { ErrorDisplay, LoadingSpinner } from '../../components/common';

const AdminReceptionists = () => {
    const navigate = useNavigate();
    const [receptionists, setReceptionists] = useState([]);
    const [filteredReceptionists, setFilteredReceptionists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
    const [selectedReceptionist, setSelectedReceptionist] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [receptionistToDelete, setReceptionistToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        shift: '',
        contactNumber: '',
        qualification: '',
        department: '',
        experienceYears: ''
    });

    const shiftOptions = [
        { value: 'morning', label: 'Morning (9:00 AM - 8:00 PM)' },
        { value: 'night', label: 'Night (8:00 PM - 7:00 AM)' }
    ];

    useEffect(() => {
        fetchReceptionists();
    }, []);

    useEffect(() => {
        const filtered = receptionists.filter(receptionist =>
            receptionist.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receptionist.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receptionist.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receptionist.shift?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receptionist.shiftTimings?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReceptionists(filtered);
    }, [receptionists, searchTerm]);

    const fetchReceptionists = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminReceptionistAPI.getAllReceptionists();
            setReceptionists(response.receptionists || []);
        } catch (err) {
            console.error('Error fetching receptionists:', err);
            setError('Failed to load receptionists');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddReceptionist = () => {
        setModalType('add');
        setSelectedReceptionist(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            shift: '',
            contactNumber: '',
            qualification: '',
            department: '',
            experienceYears: ''
        });
        setShowModal(true);
    };

    const handleEditReceptionist = (receptionist) => {
        setModalType('edit');
        setSelectedReceptionist(receptionist);
        setFormData({
            name: receptionist.userId?.name || '',
            email: receptionist.userId?.email || '',
            phone: receptionist.userId?.phone || '',
            password: '', // Intentionally blank for security
            shift: receptionist.shift || '',
            contactNumber: receptionist.contactNumber || '',
            qualification: receptionist.qualification || '',
            department: receptionist.department || '',
            // Use nullish coalescing '??' to correctly handle 0 years of experience
            experienceYears: receptionist.experienceYears ?? ''
        });
        setShowModal(true);
    };

    const handleViewReceptionist = (receptionist) => {
        setModalType('view');
        setSelectedReceptionist(receptionist);
        setFormData({
            name: receptionist.userId?.name || '',
            email: receptionist.userId?.email || '',
            phone: receptionist.userId?.phone || '',
            password: '',
            shift: receptionist.shift || '',
            contactNumber: receptionist.contactNumber || '',
            qualification: receptionist.qualification || '',
            department: receptionist.department || '',
            experienceYears: receptionist.experienceYears ?? ''
        });
        setShowModal(true);
    };

    const handleDeleteReceptionist = (receptionist) => {
        setReceptionistToDelete(receptionist);
        setShowDeleteModal(true);
    };

    const confirmDeleteReceptionist = async () => {
        if (receptionistToDelete) {
            try {
                await adminReceptionistAPI.deleteReceptionist(receptionistToDelete._id);
                await fetchReceptionists();
                setShowDeleteModal(false);
                setReceptionistToDelete(null);
            } catch (err) {
                console.error('Error deleting receptionist:', err);
                setError('Failed to delete receptionist');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Create a payload to avoid mutating state directly and to format data for the API.
        const payload = { ...formData };

        // Ensure 'experienceYears' is sent as a number.
        // The Number() constructor handles empty strings by converting them to 0.
        payload.experienceYears = Number(payload.experienceYears) || 0;

        // For security, don't send an empty password field during an update.
        if (modalType === 'edit' && !payload.password) {
            delete payload.password;
        }

        try {
            if (modalType === 'add') {
                await adminReceptionistAPI.createReceptionist(payload);
            } else if (modalType === 'edit') {
                await adminReceptionistAPI.updateReceptionist(selectedReceptionist._id, payload);
            }
            setShowModal(false);
            await fetchReceptionists();
        } catch (err) {
            console.error('Error saving receptionist:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save receptionist';
            setError(errorMessage);
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
        return <LoadingSpinner message="Loading receptionists..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
            <div className="max-w-full md:pl-16 px-4 sm:px-6 lg:px-8">
                <div className="py-8 m-4 md:pl-16 lg:mx-auto">
                    <PageHeader
                        title="Manage Receptionists"
                        subtitle="Add, edit, and manage receptionist profiles"
                        onBackClick={() => navigate('/admin')}
                        onActionClick={handleAddReceptionist}
                        actionButtonText="Add Receptionist"
                        actionButtonIcon={Plus}
                        actionButtonColor="bg-green-600 hover:bg-green-700"
                    />

                    <SearchBar
                        placeholder="Search receptionists by name, email, department, or shift..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        focusColor="focus:ring-green-500"
                    />

                    <ErrorDisplay error={error} onDismiss={() => setError(null)} />

                    {/* Receptionists Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReceptionists.map((receptionist) => (
                            <UserCard
                                key={receptionist._id}
                                user={receptionist}
                                icon={UserCheck}
                                iconColor="text-green-600"
                                iconBg="bg-green-100"
                                onView={handleViewReceptionist}
                                onEdit={handleEditReceptionist}
                                onDelete={handleDeleteReceptionist}
                                renderDetails={(receptionist) => (
                                    <>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Mail className="h-4 w-4" />
                                            <span>{receptionist.userId?.email || 'No email'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            <span>{receptionist.userId?.phone || receptionist.contactNumber || 'No phone'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span className="capitalize">{receptionist.shiftTimings || (receptionist.shift === 'morning' ? '9:00 AM - 8:00 PM' : receptionist.shift === 'night' ? '8:00 PM - 7:00 AM' : 'No shift')}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <User className="h-4 w-4" />
                                            <span>{receptionist.experienceYears ?? 0} years experience</span>
                                        </div>
                                    </>
                                )}
                                renderFooter={(receptionist) => (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            Added {new Date(receptionist.createdAt).toLocaleDateString()}
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
                    {filteredReceptionists.length === 0 && !isLoading && (
                        <EmptyState
                            icon={UserCheck}
                            title="No receptionists found"
                            description={searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first receptionist'}
                            actionButton={!searchTerm}
                            actionButtonText="Add Receptionist"
                            actionButtonIcon={Plus}
                            onActionClick={handleAddReceptionist}
                            actionButtonColor="bg-green-600 hover:bg-green-700"
                        />
                    )}

                    <UserFormModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title={modalType === 'add' ? 'Add New Receptionist' :
                            modalType === 'edit' ? 'Edit Receptionist' : 'Receptionist Details'}
                        formData={formData}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                        modalType={modalType}
                        fields={[
                            { name: 'name', label: 'Full Name', type: 'text', required: true },
                            { name: 'email', label: 'Email', type: 'email', required: true },
                            { name: 'phone', label: 'Phone', type: 'tel', required: true },
                            ...(modalType === 'add' ? [{ name: 'password', label: 'Password', type: 'password', required: true }] : []),
                            { name: 'shift', label: 'Shift', type: 'select', required: true, options: shiftOptions },
                            { name: 'contactNumber', label: 'Contact Number', type: 'tel' },
                            { name: 'qualification', label: 'Qualification', type: 'text' },
                            { name: 'department', label: 'Department', type: 'text' },
                            { name: 'experienceYears', label: 'Years of Experience', type: 'number' }
                        ]}
                        submitButtonText={modalType === 'add' ? 'Add Receptionist' : 'Update Receptionist'}
                        submitButtonColor="bg-green-600 hover:bg-green-700"
                    />

                    <DeleteConfirmationModal
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setReceptionistToDelete(null);
                        }}
                        onConfirm={confirmDeleteReceptionist}
                        item={receptionistToDelete}
                        itemType="receptionist"
                        icon={User}
                        iconColor="text-purple-600"
                        iconBg="bg-purple-100"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminReceptionists;