import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { 
  Heart, 
  Users, 
  Shield, 
  Clock, 
  Star, 
  ArrowRight,
  Stethoscope,
  Calendar,
  Phone,
  Award,
  CheckCircle,
  Play,
  MapPin,
  Mail,
  Zap,
  Activity,
  AlertCircle,
} from 'lucide-react';
import AnimatedBackground from '../components/common/AnimatedBackground';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered appointment booking with instant confirmations  ',
      highlight: 'NEW',
      highlightColor: 'from-amber-400 to-orange-500'
    },
    {
      icon: Users,
      title: 'Expert Medical Team',
      description: 'Board-certified specialists with 15+ years experience in cutting-edge treatments.',
      highlight: 'VERIFIED',
      highlightColor: 'from-green-400 to-green-500'
    },
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'End-to-end encryption and HIPAA-compliant systems protecting your data.',
      highlight: 'SECURE',
      highlightColor: 'from-red-400 to-red-500'
    },
    {
      icon: Clock,
      title: '24/7 Rapid Response',
      description: 'Emergency care with average response time under 3 minutes.',
      highlight: 'PRIORITY',
      highlightColor: 'from-purple-400 to-purple-500'
    }
  ];

  const stats = [
    { number: '25,000+', label: 'Lives Transformed', icon: Heart },
    { number: '150+', label: 'Medical Experts', icon: Users },
    { number: '99.8%', label: 'Success Rate', icon: Award },
    { number: '24/7', label: 'Emergency Care', icon: Clock }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiac Surgeon',
      rating: 5,
      comment: 'Revolutionary healthcare technology combined with exceptional patient care. The digital health records system has transformed how we deliver treatment.',
      avatar: 'SJ',
      verified: true
    },
    {
      name: 'Michael Chen',
      role: 'Patient & Tech Executive',
      rating: 5,
      comment: 'The most advanced medical facility I\'ve experienced. From AI diagnostics to personalized treatment plans - this is the future of healthcare.',
      avatar: 'MC',
      verified: true
    },
    {
      name: 'Emily Rodriguez',
      role: 'Wellness Coach',
      rating: 5,
      comment: 'Incredible attention to detail and holistic approach. The preventive care program has been life-changing for me and my family.',
      avatar: 'ER',
      verified: true
    }
  ];

  const services = [
    { name: 'Cardiology', icon: Heart, patients: '5,000+' },
    { name: 'Neurology', icon: Activity, patients: '3,500+' },
    { name: 'Orthopedics', icon: Shield, patients: '4,200+' },
    { name: 'Pediatrics', icon: Users, patients: '6,800+' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        <AnimatedBackground />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                <span className="text-xs sm:text-sm font-medium text-blue-100">Trusted by 25,000+ patients</span>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  Your Health,{' '}
                  <span className="relative block bg-gradient-to-r from-blue-200 to-blue-300 bg-clip-text text-transparent">
                    Our Mission
                    <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"></div>
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                  Experience the future of healthcare with AI-powered diagnostics, personalized treatment plans, and world-class medical expertise.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <Link to="/signin" className="group inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-white text-blue-700 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <span>Book Smart Consultation</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center justify-center space-x-2 sm:space-x-3 border-2 border-white text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-white hover:text-blue-700 transition-all duration-300 group text-sm sm:text-base"
                >
                  <Play className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 transition-transform ${isPlaying ? 'scale-110' : ''}`} />
                  <span>Watch Our Story</span>
                </button>
              </div>

              {/* Quick Contact */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 pt-4 sm:pt-6">
                <a href="tel:+15551234567" className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-semibold text-sm sm:text-base">Emergency: (555) 123-4567</span>
                </a>
                <div className="hidden sm:block h-6 w-px bg-blue-300"></div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">24/7 Available</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Stats Card */}
            <div className="relative">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                      <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Health Dashboard</h3>
                      <p className="text-blue-200 text-sm sm:text-base">Real-time health monitoring</p>
                    </div>
                  </div>
                  <div className="bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full animate-pulse">LIVE</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="backdrop-blur-sm bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 text-center hover:bg-white/20 transition-all duration-300 group">
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-200 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-xs sm:text-sm text-blue-200 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold text-sm sm:text-base">System Status</div>
                      <div className="text-blue-200 text-xs sm:text-sm">All services operational</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6 font-semibold">
              <Zap className="h-5 w-5" />
              <span>Advanced Healthcare Technology</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">MediCarePro</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We revolutionize healthcare through cutting-edge technology, personalized care, and unwavering commitment to your wellbeing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-6 text-center hover:text-white transition-all duration-300 transform hover:-translate-y-3 hover:shadow-2xl border-2 border-transparent group-hover:border-white/20">
                  {/* Highlight Badge */}
                  <div className={`absolute -top-3 -right-3 bg-gradient-to-r ${feature.highlightColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                    {feature.highlight}
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200   w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-10 w-10 text-blue-600  transition-colors duration-300" />
                  </div>
                  <h3 className="text-md font-bold text-gray-900  mb-4 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/10 to-transparent"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Trusted by <span className="text-blue-200">Thousands</span> Worldwide
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our commitment to excellence and innovation has made us a leader in healthcare delivery
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <stat.icon className="h-12 w-12 text-blue-200 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-blue-200 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <service.icon className="h-8 w-8 text-blue-200 mx-auto mb-3" />
                <div className="font-semibold text-white mb-1">{service.name}</div>
                <div className="text-sm text-blue-200">{service.patients} treated</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-700 rounded-full px-6 py-3 mb-6 font-semibold">
              <Star className="h-5 w-5" />
              <span>4.9/5 Patient Satisfaction</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Community</span> Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who've experienced the MediCarePro difference
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-3xl p-12 shadow-xl border border-blue-100">
              <div className="text-center">
                {/* Stars */}
                <div className="flex items-center justify-center space-x-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-amber-400 fill-current" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-2xl lg:text-3xl text-gray-700 italic font-medium leading-relaxed mb-8">
                  "{testimonials[currentTestimonial].comment}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {testimonials[currentTestimonial].avatar}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <div className="font-bold text-xl text-gray-900">
                        {testimonials[currentTestimonial].name}
                      </div>
                      {testimonials[currentTestimonial].verified && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-blue-300 w-3'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 transform translate-x-48 -translate-y-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300 rounded-full opacity-10 transform -translate-x-40 translate-y-40 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-6 py-3 font-semibold">
                <Heart className="h-5 w-5 text-red-400" />
                <span>Join Our Healthcare Revolution</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Ready to Experience the{' '}
                <span className="text-blue-200 block">Future</span> of Healthcare?
              </h2>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
                Join thousands of satisfied patients who trust MediCarePro for their health and wellness journey. Your best health starts today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <Link
                to="/signin"
                className="group inline-flex items-center justify-center space-x-3 bg-white text-blue-700 px-12 py-6 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                <Calendar className="h-6 w-6" />
                  <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link to="/signin" className="inline-flex items-center justify-center space-x-3 border-2 border-white text-white px-12 py-6 rounded-2xl font-bold hover:bg-white hover:text-blue-700 transition-all duration-300 group">
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <Shield className="h-8 w-8" />
                <div>
                  <div className="font-bold">HIPAA Compliant</div>
                  <div className="text-sm opacity-80">Your data is protected</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <Award className="h-8 w-8" />
                <div>
                  <div className="font-bold">Award Winning</div>
                  <div className="text-sm opacity-80">Top healthcare provider</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <Clock className="h-8 w-8" />
                <div>
                  <div className="font-bold">24/7 Support</div>
                  <div className="text-sm opacity-80">Always here for you</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;