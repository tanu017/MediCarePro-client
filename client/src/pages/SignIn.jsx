import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Activity,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/common/AnimatedBackground';
import TrustIndicators from '../components/common/TrustIndicators';
import StatsDisplay from '../components/common/StatsDisplay';
import MobileLogo from '../components/common/MobileLogo';
import SecurityNotice from '../components/common/SecurityNotice';
import TrustBadge from '../components/common/TrustBadge';


const SignIn = () => {
  const navigate = useNavigate();
  const { login, loginLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      // Redirect to dashboard (context handles auth state)
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  return (
    <div className="min-h-screen pt-14 sm:pt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden">
      <AnimatedBackground />

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8 xl:px-12 2xl:px-16">
          <div className="max-w-lg">

            <TrustBadge />

            {/* Heading */}
            <div className="space-y-6 mb-12">
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Welcome to the{' '}
                <span className="bg-gradient-to-r from-blue-200 to-blue-300 bg-clip-text text-transparent">
                  Future
                </span>{' '}
                of Healthcare
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Access your personalized health dashboard with AI-powered insights and world-class medical care.
              </p>
            </div>

            <StatsDisplay />

            <TrustIndicators />
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
            <MobileLogo />

            {/* Form Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
              {/* Form Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-semibold">Secure Access</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Welcome Back</h2>
                <p className="text-blue-100 text-sm sm:text-base">Sign in to access your health dashboard</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full"></div>
                    <p className="text-red-200 text-xs sm:text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter your password"
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
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/10"
                    />
                    <label htmlFor="rememberMe" className="ml-2 sm:ml-3 text-xs sm:text-sm text-blue-100">
                      Remember me
                    </label>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => console.log('Forgot password')}
                    className="text-xs sm:text-sm text-blue-200 hover:text-white transition-colors font-medium text-left sm:text-right"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="group w-full flex items-center justify-center space-x-2 sm:space-x-3 bg-white text-blue-700 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {loginLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-blue-700 border-t-transparent"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Access Dashboard</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center pt-3 sm:pt-4">
                  <p className="text-blue-100 text-xs sm:text-sm">
                    New to MediCarePro?{' '}
                    <Link 
                      to="/signup"
                      className="text-white font-semibold hover:text-blue-200 transition-colors underline decoration-2 underline-offset-2 sm:underline-offset-4 hover:decoration-blue-200"
                    >
                      Create Account
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

export default SignIn;