import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Droplets,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI } from '../../api/patientApi';
import { compressImage, isValidImageType, getFileSizeInMB } from '../../utils/imageUtils';
import { useProfileImageContext } from '../../contexts/ProfileImageContext';
import { PasswordChangeModal, SuccessDialog } from '../../components/common';

const PatientProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { refetchProfileImage } = useProfileImageContext();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
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
    },
    medicalHistory: []
  });
  
  
  // Profile image states
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'PATIENT') {
      fetchPatientProfile();
    } else {
      setLoading(false);
      setError('Please login as a patient to view your profile');
    }
  }, [isAuthenticated, user]);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getProfile();
      
      // Extract patient data from response
      const patientData = response.patient || response;
      
      setPatientData(patientData);
      setFormData({
        gender: patientData.gender || '',
        dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth).toISOString().split('T')[0] : '',
        contactNumber: patientData.contactNumber || '',
        address: {
          street: patientData.address?.street || '',
          city: patientData.address?.city || '',
          state: patientData.address?.state || '',
          pincode: patientData.address?.pincode || ''
        },
        emergencyContact: {
          name: patientData.emergencyContact?.name || '',
          phone: patientData.emergencyContact?.phone || '',
          relation: patientData.emergencyContact?.relation || ''
        },
        medicalHistory: patientData.medicalHistory || []
      });
      setImagePreview(patientData.profileImage || null);
    } catch (err) {
      console.error('Error fetching patient profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handleMedicalHistoryChange = (e, index) => {
    const { value } = e.target;
    const newMedicalHistory = [...formData.medicalHistory];
    newMedicalHistory[index] = value;
    setFormData(prev => ({
      ...prev,
      medicalHistory: newMedicalHistory
    }));
  };

  const addMedicalHistory = () => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: [...prev.medicalHistory, '']
    }));
  };

  const removeMedicalHistory = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };


  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isValidImageType(file)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      const fileSizeMB = getFileSizeInMB(file);
      if (fileSizeMB > 5) {
        setError('Image file is too large. Please select an image smaller than 5MB.');
        return;
      }

      try {
        setError(null);
        setProfileImage(file);
        const compressedBase64 = await compressImage(file, 400, 400, 0.8);
        setImagePreview(compressedBase64);
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process image. Please try again.');
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updateData = { ...formData };
  
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth);
      }
  
      // Handle image processing separately
      if (profileImage) {
        try {
          const compressedBase64 = await compressImage(profileImage, 400, 400, 0.8);
          updateData.profileImage = compressedBase64;
        } catch (err) {
          console.error('Error compressing image:', err);
          setError('Failed to process image. Please try again.');
          return; // Stop if image processing fails
        }
      }
  
      // Perform the API update
      await patientAPI.updateProfile(updateData);
  
      // FIX: Refetch the profile data from the server to ensure the UI shows the latest information.
      // This is more reliable than using the response from the update API call.
      await fetchPatientProfile();
  
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessDialog(true);
      setIsEditing(false);
  
      // If the image was part of the update, also refetch it for other components like the sidebar.
      if (profileImage) {
        await refetchProfileImage();
      }
  
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (passwordData) => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
      
      await patientAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccessMessage('Password changed successfully!');
      setShowSuccessDialog(true);
      setShowPasswordForm(false);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Failed to change password');
    }
  };


  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      gender: patientData?.gender || '',
      dateOfBirth: patientData?.dateOfBirth ? new Date(patientData.dateOfBirth).toISOString().split('T')[0] : '',
      contactNumber: patientData?.contactNumber || '',
      address: {
        street: patientData?.address?.street || '',
        city: patientData?.address?.city || '',
        state: patientData?.address?.state || '',
        pincode: patientData?.address?.pincode || ''
      },
      emergencyContact: {
        name: patientData?.emergencyContact?.name || '',
        phone: patientData?.emergencyContact?.phone || '',
        relation: patientData?.emergencyContact?.relation || ''
      },
      medicalHistory: patientData?.medicalHistory || []
    });
    setProfileImage(null);
    setImagePreview(patientData?.profileImage || null);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Not specified';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !patientData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPatientProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
        <div className="max-w-full md:pl-16 px-4 sm:px-6 lg:px-8">
          <div className="py-6 m-4 md:pl-16 lg:mx-auto">
          {/* Enhanced Header */}
          <div className="mb-6 lg:mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">My Profile</h1>
                  <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Manage your personal information and medical details</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20 text-sm sm:text-base"
                  >
                    <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="font-medium">Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-10 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
              
              <div className="text-center relative z-10">
                {/* Profile Image Section */}
                <div className="relative inline-block mb-6">
                  <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 sm:h-24 sm:w-24 text-blue-500" />
                    )}
                  </div>
                  {/* Status indicator */}
                  <div className="absolute bottom-2 right-2 h-5 w-5 sm:h-6 sm:w-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white rounded-full"></div>
                  </div>
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Name and Role Section */}
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {patientData?.name}
                  </h2>
                  <div className="bg-blue-50 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold inline-block">
                    Patient
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                Personal Info
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {patientData?.gender ? patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1) : 'Not specified'}
                    </p>
                    <p className="text-xs text-gray-500">Gender</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {patientData?.dateOfBirth ? calculateAge(patientData.dateOfBirth) : 'Not specified'}
                    </p>
                    <p className="text-xs text-gray-500">Age</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {patientData?.bloodGroup || 'Not specified'}
                    </p>
                    <p className="text-xs text-gray-500">Blood Group</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Edit3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                Actions
              </h3>
              
              <div className="space-y-3">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center space-x-2 text-gray-900">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{patientData?.name}</span>
                    </div>
                  </div>

                  {/* Email - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{patientData?.email}</span>
                    </div>
                  </div>

                  {/* Phone - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{patientData?.phone}</span>
                    </div>
                  </div>

                  {/* Contact Number - Editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter contact number"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{patientData?.contactNumber || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  {/* Gender - Editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{patientData?.gender ? patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1) : 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  {/* Date of Birth - Editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{patientData?.dateOfBirth ? new Date(patientData.dateOfBirth).toLocaleDateString() : 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  {/* Blood Group - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Droplets className="h-4 w-4 text-gray-400" />
                      <span>{patientData?.bloodGroup || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
            </div>

            {/* Address Information Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                Address Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Street */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="street"
                      value={formData.address.street}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter street address"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{patientData?.address?.street || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{patientData?.address?.city || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{patientData?.address?.state || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="pincode"
                      value={formData.address.pincode}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter pincode"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{patientData?.address?.pincode || 'Not specified'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                Emergency Contact
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Emergency Contact Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.emergencyContact.name}
                        onChange={handleEmergencyContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter emergency contact name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{patientData?.emergencyContact?.name || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.emergencyContact.phone}
                        onChange={handleEmergencyContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter emergency contact phone"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{patientData?.emergencyContact?.phone || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact Relation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relation
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="relation"
                        value={formData.emergencyContact.relation}
                        onChange={handleEmergencyContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter relation (e.g., Father, Mother, Spouse)"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span>{patientData?.emergencyContact?.relation || 'Not specified'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
          </div>

            </div>
            {/* Metadata Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                Profile Information
              </h3>
              
              {patientData?.createdAt && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Profile Created:</span>
                      <span className="ml-2">
                        {new Date(patientData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {patientData?.updatedAt && (
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <span className="ml-2">
                          {new Date(patientData.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordForm}
        onClose={() => setShowPasswordForm(false)}
        onSubmit={handlePasswordUpdate}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        message={successMessage}
      />
    </>
  );
};

export default PatientProfile;