import React from 'react';
import { Shield } from 'lucide-react';

const SecurityNotice = () => {
  return (
    <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mt-0.5 sm:mt-1 flex-shrink-0" />
        <div>
          <p className="text-white font-semibold mb-1 text-sm sm:text-base">Enterprise-Grade Security</p>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Your health data is protected with military-grade encryption and HIPAA-compliant systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;
