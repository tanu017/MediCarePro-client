import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  Activity,
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram
} from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-2xl shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">MediCarePro</div>
                <div className="text-sm text-gray-400">Medical Excellence</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Transforming healthcare through innovation, compassion, and cutting-edge medical technology. 
              Your health is our mission.
            </p>
            <div className="flex space-x-4">
              <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl transition-colors">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl transition-colors">
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Our Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Medical Team</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Sign In</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>123 Medical Center Dr.<br />Healthcare City, HC 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>info@MediCarePro.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 MediCarePro Center. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">HIPAA Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
