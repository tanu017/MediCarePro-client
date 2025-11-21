import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Award, 
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
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../api/doctorApi';
import { compressImage, isValidImageType, getFileSizeInMB } from '../../utils/imageUtils';
import { useProfileImageContext } from '../../contexts/ProfileImageContext';
import { 
  ProfileImageUpload, 
  AvailabilityManager 
} from '../../components/doctor';
import { PasswordChangeModal, SuccessDialog, LoadingSpinner, ErrorDisplay } from '../../components/common';

const DoctorProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { refetchProfileImage } = useProfileImageContext();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    contactNumber: '',
    consultationFee: '',
    availability: []
  });
  
  // Password form states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Profile image states
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'DOCTOR') {
      fetchDoctorProfile();
    } else {
      setLoading(false);
      setError('Please login as a doctor to view your profile');
    }
  }, [isAuthenticated, user]);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorAPI.getProfile();
      
      // Extract doctor data from response
      const doctorData = response.doctor || response;
      
      setDoctorData(doctorData);
      setFormData({
        contactNumber: doctorData.contactNumber || '',
        consultationFee: doctorData.consultationFee || '',
        availability: doctorData.availability || []
      });
      setImagePreview(doctorData.profileImage || null);
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!isValidImageType(file)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Check file size (warn if > 5MB)
      const fileSizeMB = getFileSizeInMB(file);
      if (fileSizeMB > 5) {
        setError('Image file is too large. Please select an image smaller than 5MB.');
        return;
      }

      try {
        setError(null);
        setProfileImage(file);
        
        // Compress and preview the image
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
      
      // If there's a new profile image, compress and convert it to base64 string
      if (profileImage) {
        try {
          const compressedBase64 = await compressImage(profileImage, 400, 400, 0.8);
          updateData.profileImage = compressedBase64;
          
          const response = await doctorAPI.updateProfile(updateData);
          
          // Extract updated doctor data from response
          const updatedDoctorData = response.doctor || response;
          setDoctorData(updatedDoctorData);
          
          setSuccessMessage('Profile updated successfully!');
          setShowSuccessDialog(true);
          setIsEditing(false);
          // Refresh profile image in sidebar
          refetchProfileImage();
        } catch (err) {
          console.error('Error compressing image:', err);
          setError('Failed to process image. Please try again.');
          return;
        }
      } else {
        // No new image, just update other fields
        const response = await doctorAPI.updateProfile(updateData);
        
        // Extract updated doctor data from response
        const updatedDoctorData = response.doctor || response;
        setDoctorData(updatedDoctorData);
        
        setSuccessMessage('Profile updated successfully!');
        setShowSuccessDialog(true);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
      
      await doctorAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccessMessage('Password changed successfully!');
      setShowSuccessDialog(true);
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Failed to change password');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      contactNumber: doctorData?.contactNumber || '',
      consultationFee: doctorData?.consultationFee || '',
      availability: doctorData?.availability || []
    });
    setProfileImage(null);
    setImagePreview(doctorData?.profileImage || null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error && !doctorData) {
    return <ErrorDisplay 
      error={error} 
      title="Error Loading Profile" 
      onRetry={fetchDoctorProfile} 
      retryText="Try Again" 
    />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
        <div className="max-w-full  md:pl-16 px-4 sm:px-6 lg:px-8">
          <div className="py-6 m-4 md:pl-16 lg:mx-auto">
            {/* Enhanced Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Profile</h1>
                    <p className="text-blue-100 text-lg">Manage your professional information and settings</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20"
                    >
                      <Edit3 className="h-5 w-5" />
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
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Profile Overview */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Profile Card Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 relative overflow-hidden">
                  {/* Decorative background */}
                  <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
                  
                  <div className="text-center relative z-10">
                    {/* Profile Image Section */}
                    <ProfileImageUpload
                      imagePreview={imagePreview}
                      onImageChange={handleImageChange}
                      isEditing={isEditing}
                    />

                    {/* Name and Role Section */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {doctorData?.name}
                      </h2>
                      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold inline-block">
                        {doctorData?.specialization}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    Professional Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doctorData?.qualification}</p>
                        <p className="text-xs text-gray-500">Qualification</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Building className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doctorData?.department}</p>
                        <p className="text-xs text-gray-500">Department</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doctorData?.experienceYears ? `${doctorData.experienceYears} years` : doctorData?.yearsOfExperience ? `${doctorData.yearsOfExperience} years` : 'Not specified'}
                        </p>
                        <p className="text-xs text-gray-500">Experience</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Edit3 className="h-5 w-5 text-blue-600 mr-2" />
                    Actions
                  </h3>
                  
                  <div className="space-y-3">
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name - Read Only */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{doctorData?.name}</span>
                      </div>
                    </div>

                    {/* Email - Read Only */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{doctorData?.email}</span>
                      </div>
                    </div>

                    {/* Contact Number - Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter contact number"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-900">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{doctorData?.contactNumber || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    Professional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specialization - Read Only */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span>{doctorData?.specialization || 'Not specified'}</span>
                      </div>
                    </div>

                    {/* Qualification - Read Only */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualification
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        <span>{doctorData?.qualification || 'Not specified'}</span>
                      </div>
                    </div>

                    {/* Experience - Read Only */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {doctorData?.experienceYears 
                            ? `${doctorData.experienceYears} years` 
                            : doctorData?.yearsOfExperience 
                              ? `${doctorData.yearsOfExperience} years` 
                              : 'Not specified'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Department - Read Only */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span>{doctorData?.department || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    Financial Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Consultation Fee - Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultation Fee
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <input
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleInputChange}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-900">
                          <span className="text-lg font-semibold text-green-600">₹{doctorData?.consultationFee || '0'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Schedule & Availability Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    Schedule & Availability
                  </h3>
                  <AvailabilityManager
                    availability={isEditing ? formData.availability : doctorData?.availability || []}
                    isEditing={isEditing}
                    onAvailabilityChange={(newAvailability) => setFormData(prev => ({ ...prev, availability: newAvailability }))}
                    onAddSlot={() => {
                      setFormData(prev => ({
                        ...prev,
                        availability: [...prev.availability, { day: 'Mon', from: '09:00', to: '17:00' }]
                      }));
                    }}
                    onRemoveSlot={(index) => {
                      const newAvailability = formData.availability.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, availability: newAvailability }));
                    }}
                  />

                  {/* Metadata Section */}
                  {doctorData?.createdAt && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Profile Created:</span>
                          <span className="ml-2">
                            {new Date(doctorData.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {doctorData?.updatedAt && (
                          <div>
                            <span className="font-medium">Last Updated:</span>
                            <span className="ml-2">
                              {new Date(doctorData.updatedAt).toLocaleDateString('en-US', {
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
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordForm}
        onClose={() => setShowPasswordForm(false)}
        passwordData={passwordData}
        showPasswords={showPasswords}
        onPasswordChange={handlePasswordChange}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onSubmit={handlePasswordUpdate}
        error={error}
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

export default DoctorProfile;
