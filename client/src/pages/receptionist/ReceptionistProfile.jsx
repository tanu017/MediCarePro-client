import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Users,
  CalendarCheck,
  Clock,
  Award,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { receptionistAPI } from '../../api/receptionistApi';
import { compressImage, isValidImageType, getFileSizeInMB } from '../../utils/imageUtils';
import { useProfileImageContext } from '../../contexts/ProfileImageContext';
import { PasswordChangeModal, SuccessDialog } from '../../components/common';

const ReceptionistProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { refetchProfileImage } = useProfileImageContext();
  const [receptionistData, setReceptionistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    contactNumber: '',
    qualification: '',
    department: '',
    experienceYears: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    workSchedule: {
      startTime: '',
      endTime: '',
      workingDays: []
    }
  });
  

  // Profile image states
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const workingDaysOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReceptionistProfile();
    }
  }, [isAuthenticated, user]);

  const fetchReceptionistProfile = async () => {
    try {
      setLoading(true);
      const response = await receptionistAPI.getProfile();
      setReceptionistData(response);
      
      // Populate form data
      setFormData({
        contactNumber: response.contactNumber || '',
        qualification: response.qualification || '',
        department: response.department || '',
        experienceYears: response.experienceYears || '',
        address: {
          street: response.address?.street || '',
          city: response.address?.city || '',
          state: response.address?.state || '',
          pincode: response.address?.pincode || ''
        },
        workSchedule: {
          startTime: response.workSchedule?.startTime || '',
          endTime: response.workSchedule?.endTime || '',
          workingDays: response.workSchedule?.workingDays || []
        }
      });
      setImagePreview(response.profileImage || null);
    } catch (error) {
      console.error('Error fetching receptionist profile:', error);
      setError('Failed to load profile data');
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

  const handleWorkingDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        workingDays: prev.workSchedule.workingDays.includes(day)
          ? prev.workSchedule.workingDays.filter(d => d !== day)
          : [...prev.workSchedule.workingDays, day]
      }
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
        } catch (err) {
          console.error('Error compressing image:', err);
          setError('Failed to process image. Please try again.');
          return;
        }
      }
      
      await receptionistAPI.updateProfile(updateData);
      setReceptionistData(prev => ({
        ...prev,
        ...updateData
      }));
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessDialog(true);
      // Refresh profile image in sidebar
      refetchProfileImage();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      await receptionistAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setShowPasswordForm(false);
      setSuccessMessage('Password changed successfully!');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      contactNumber: receptionistData?.contactNumber || '',
      qualification: receptionistData?.qualification || '',
      department: receptionistData?.department || '',
      experienceYears: receptionistData?.experienceYears || '',
      address: {
        street: receptionistData?.address?.street || '',
        city: receptionistData?.address?.city || '',
        state: receptionistData?.address?.state || '',
        pincode: receptionistData?.address?.pincode || ''
      },
      workSchedule: {
        startTime: receptionistData?.workSchedule?.startTime || '',
        endTime: receptionistData?.workSchedule?.endTime || '',
        workingDays: receptionistData?.workSchedule?.workingDays || []
      }
    });
    setImagePreview(receptionistData?.profileImage || null);
    setProfileImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !receptionistData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReceptionistProfile}
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
        <div className="max-w-full md:pl-20 px-4 sm:px-6 lg:px-8">
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
                    <div className="relative inline-block mb-6">
                      <div className="h-40 w-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-24 w-24 text-blue-500" />
                        )}
                      </div>
                      {/* Status indicator */}
                      <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                      
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                          <Camera className="h-4 w-4" />
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {receptionistData?.userId?.name || user?.name}
                      </h2>
                      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold inline-block">
                        Receptionist
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
                        <p className="text-sm font-medium text-gray-900">{receptionistData?.qualification || 'Not specified'}</p>
                        <p className="text-xs text-gray-500">Qualification</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Building className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{receptionistData?.department || 'Not specified'}</p>
                        <p className="text-xs text-gray-500">Department</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {receptionistData?.experienceYears ? `${receptionistData.experienceYears} years` : 'Not specified'}
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
                          onClick={handleCancelEdit}
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
                    {/* Contact Number */}
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
                          <span>{receptionistData?.contactNumber || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{receptionistData?.userId?.email || user?.email}</span>
                      </div>
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualification
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter qualification"
                        />
                      ) : (
                        <span className="text-gray-900">{receptionistData?.qualification || 'Not provided'}</span>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter department"
                        />
                      ) : (
                        <span className="text-gray-900">{receptionistData?.department || 'Not provided'}</span>
                      )}
                    </div>

                    {/* Experience Years */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (Years)
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter years of experience"
                        />
                      ) : (
                        <span className="text-gray-900">{receptionistData?.experienceYears ? `${receptionistData.experienceYears} years` : 'Not provided'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    Address Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter street address"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{receptionistData?.address?.street || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter city"
                        />
                      ) : (
                        <span className="text-gray-900">{receptionistData?.address?.city || 'Not provided'}</span>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter state"
                        />
                      ) : (
                        <span className="text-gray-900">{receptionistData?.address?.state || 'Not provided'}</span>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.pincode"
                          value={formData.address.pincode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter pincode"
                        />
                      ) : (
                        <span className="text-gray-900">{receptionistData?.address?.pincode || 'Not provided'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Work Schedule Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    Work Schedule
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      {isEditing ? (
                        <input
                          type="time"
                          name="workSchedule.startTime"
                          value={formData.workSchedule.startTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-900">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{receptionistData?.workSchedule?.startTime || 'Not set'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      {isEditing ? (
                        <input
                          type="time"
                          name="workSchedule.endTime"
                          value={formData.workSchedule.endTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-900">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{receptionistData?.workSchedule?.endTime || 'Not set'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Working Days */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Working Days
                    </label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {workingDaysOptions.map((day) => (
                          <label key={day} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.workSchedule.workingDays.includes(day)}
                              onChange={() => handleWorkingDaysChange(day)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {receptionistData?.workSchedule?.workingDays?.length > 0 ? (
                          receptionistData.workSchedule.workingDays.map((day) => (
                            <span
                              key={day}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {day}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No working days set</span>
                        )}
                      </div>
                    )}
                  </div>
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
        onSubmit={handleChangePassword}
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

export default ReceptionistProfile;
