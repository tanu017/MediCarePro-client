import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Building,
  Settings,
  Database,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminProfileAPI } from '../../api/adminApi';
import { compressImage, isValidImageType, getFileSizeInMB } from '../../utils/imageUtils';
import { useProfileImageContext } from '../../contexts/ProfileImageContext';

const AdminProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { refetchProfileImage } = useProfileImageContext();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
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
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchAdminProfile();
    } else {
      setLoading(false);
      setError('Please login as an admin to view your profile');
    }
  }, [isAuthenticated, user]);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminProfileAPI.getProfile();
      
      setAdminData(response.user || response);
      setFormData({
        name: response.user?.name || response.name || '',
        email: response.user?.email || response.email || '',
        phone: response.user?.phone || response.phone || ''
      });
      setImagePreview(response.user?.profileImage || response.profileImage || null);
    } catch (err) {
      console.error('Error fetching admin profile:', err);
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
          
          const response = await adminProfileAPI.updateProfile(updateData);
          
          setAdminData(response.user || response);
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
        const response = await adminProfileAPI.updateProfile(updateData);
        
        setAdminData(response.user || response);
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
      
      await adminProfileAPI.changePassword({
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
      name: adminData?.name || '',
      email: adminData?.email || '',
      phone: adminData?.phone || ''
    });
    setProfileImage(null);
    setImagePreview(adminData?.profileImage || null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !adminData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAdminProfile}
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
        <div className="max-w-full  md:pl-16 px-4 sm:px-6 lg:px-8">
          <div className="py-6 m-4 md:pl-16 lg:mx-auto">
            {/* Enhanced Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Profile</h1>
                    <p className="text-blue-100 text-lg">Manage your administrative account and system settings</p>
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
                          <Shield className="h-24 w-24 text-blue-500" />
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
                        {adminData?.name}
                      </h2>
                      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold inline-block">
                        System Administrator
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Info Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    Admin Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">System Administrator</p>
                        <p className="text-xs text-gray-500">Role</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Database className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Full System Access</p>
                        <p className="text-xs text-gray-500">Permissions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Active</p>
                        <p className="text-xs text-gray-500">Status</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Settings className="h-5 w-5 text-blue-600 mr-2" />
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
                    {/* Name - Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name"
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-900">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{adminData?.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Email - Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{adminData?.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Phone - Editable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your phone number"
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-900">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{adminData?.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* Role - Read Only */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {adminData?.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Access Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    System Access & Permissions
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Management Access</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">User Management</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">Doctor Management</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">Patient Management</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">Receptionist Management</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">System Access</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">Billing Management</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">Appointment Management</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">System Analytics</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">Database Access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    Account Information
                  </h3>
                  
                  {/* Metadata Section */}
                  {adminData?.createdAt && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Account Created:</span>
                        <span className="ml-2">
                          {new Date(adminData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {adminData?.updatedAt && (
                        <div>
                          <span className="font-medium">Last Updated:</span>
                          <span className="ml-2">
                            {new Date(adminData.updatedAt).toLocaleDateString('en-US', {
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
                <p className="text-gray-600 mb-6">{successMessage}</p>
                <button
                  onClick={() => setShowSuccessDialog(false)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default AdminProfile;
