import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar,
  UserPlus, 
  Activity, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/common/AnimatedBackground';
import TrustIndicators from '../components/common/TrustIndicators';
import StatsDisplay from '../components/common/StatsDisplay';
import MobileLogo from '../components/common/MobileLogo';
import SecurityNotice from '../components/common/SecurityNotice';
import TrustBadge from '../components/common/TrustBadge';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, loginLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
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
    medicalHistory: [],
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreePrivacy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    if (!formData.agreePrivacy) newErrors.agreePrivacy = 'You must agree to the privacy policy';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setApiError('');
    
    try {
      const response = await signup(formData);
      
      // Redirect to dashboard (context handles auth state)
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.message || 'Signup failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested objects (address, emergencyContact)
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
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };


  return (
    <div className="min-h-screen pt-14 sm:pt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden">
      <AnimatedBackground />

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8 xl:px-12 2xl:px-16">
          <div className="max-w-lg">

            <TrustBadge text="Join 25,000+ patients" />

            {/* Heading */}
            <div className="space-y-6 mb-12">
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Start Your{' '}
                <span className="bg-gradient-to-r from-blue-200 to-blue-300 bg-clip-text text-transparent">
                  Patient Journey
                </span>{' '}
                with MediCarePro
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Create your patient account to access personalized healthcare, AI-powered insights, and world-class medical care.
              </p>
            </div>

            <StatsDisplay />

            <TrustIndicators />
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full space-y-6 sm:space-y-8">
            <MobileLogo />

            {/* Form Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
              {/* Form Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-semibold">Create Account</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Join as Patient</h2>
                <p className="text-blue-100 text-sm sm:text-base">Create your patient account to access healthcare services</p>
              </div>

              {/* API Error Message */}
              {apiError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full"></div>
                    <p className="text-red-200 text-xs sm:text-sm">{apiError}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>

                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base ${errors.firstName ? 'border-red-400' : ''}`}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-xs sm:text-sm text-red-300 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{errors.firstName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-white mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${errors.lastName ? 'border-red-400' : ''}`}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-300 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.lastName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base ${errors.email ? 'border-red-400' : ''}`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-300 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone, Date of Birth & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base ${errors.phone ? 'border-red-400' : ''}`}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-300 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-white mb-2">
                      Birth Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                      </div>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base ${errors.dateOfBirth ? 'border-red-400' : ''}`}
                      />
                    </div>
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-300 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.dateOfBirth}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-white mb-2">
                      Gender
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                      </div>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base ${errors.gender ? 'border-red-400' : ''}`}
                      >
                        <option value="" className="bg-blue-900 text-white">Select Gender</option>
                        <option value="male" className="bg-blue-900 text-white">Male</option>
                        <option value="female" className="bg-blue-900 text-white">Female</option>
                        <option value="other" className="bg-blue-900 text-white">Other</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-300 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.gender}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base ${errors.password ? 'border-red-400' : ''}`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength(formData.password))}`}
                            style={{ width: `${(passwordStrength(formData.password) / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-blue-200">
                          {getStrengthText(passwordStrength(formData.password))}
                        </span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-300 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base ${errors.confirmPassword ? 'border-red-400' : ''}`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-300 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                {/* Optional Address Section */}
                <div className="space-y-4">
                  <div className="border-t border-white/20 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Address (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="address.street" className="block text-sm font-semibold text-white mb-2">
                          Street Address
                        </label>
                        <input
                          id="address.street"
                          name="address.street"
                          type="text"
                          value={formData.address.street}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div>
                        <label htmlFor="address.city" className="block text-sm font-semibold text-white mb-2">
                          City
                        </label>
                        <input
                          id="address.city"
                          name="address.city"
                          type="text"
                          value={formData.address.city}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label htmlFor="address.state" className="block text-sm font-semibold text-white mb-2">
                          State
                        </label>
                        <input
                          id="address.state"
                          name="address.state"
                          type="text"
                          value={formData.address.state}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label htmlFor="address.pincode" className="block text-sm font-semibold text-white mb-2">
                          ZIP Code
                        </label>
                        <input
                          id="address.pincode"
                          name="address.pincode"
                          type="text"
                          value={formData.address.pincode}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="border-t border-white/20 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="emergencyContact.name" className="block text-sm font-semibold text-white mb-2">
                          Contact Name
                        </label>
                        <input
                          id="emergencyContact.name"
                          name="emergencyContact.name"
                          type="text"
                          value={formData.emergencyContact.name}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContact.phone" className="block text-sm font-semibold text-white mb-2">
                          Contact Phone
                        </label>
                        <input
                          id="emergencyContact.phone"
                          name="emergencyContact.phone"
                          type="tel"
                          value={formData.emergencyContact.phone}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                          placeholder="(555) 987-6543"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContact.relation" className="block text-sm font-semibold text-white mb-2">
                          Relation
                        </label>
                        <input
                          id="emergencyContact.relation"
                          name="emergencyContact.relation"
                          type="text"
                          value={formData.emergencyContact.relation}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                          placeholder="Spouse, Parent, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Privacy */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/10"
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-blue-100">
                      I agree to the{' '}
                      <button type="button" className="text-white hover:text-blue-200 underline">
                        Terms of Service
                      </button>
                      {errors.agreeTerms && (
                        <span className="text-red-300 ml-2">{errors.agreeTerms}</span>
                      )}
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      id="agreePrivacy"
                      name="agreePrivacy"
                      type="checkbox"
                      checked={formData.agreePrivacy}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/10"
                    />
                    <label htmlFor="agreePrivacy" className="text-sm text-blue-100">
                      I agree to the{' '}
                      <button type="button" className="text-white hover:text-blue-200 underline">
                        Privacy Policy
                      </button>
                      {errors.agreePrivacy && (
                        <span className="text-red-300 ml-2">{errors.agreePrivacy}</span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="group w-full flex items-center justify-center space-x-3 bg-white text-blue-700 py-4 px-6 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loginLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-700 border-t-transparent"></div>
                      <span>Creating Patient Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      <span>Create Patient Account</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-4">
                  <p className="text-blue-100">
                    Already have an account?{' '}
                    <Link 
                      to="/signin"
                      className="text-white font-semibold hover:text-blue-200 transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            <SecurityNotice />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;