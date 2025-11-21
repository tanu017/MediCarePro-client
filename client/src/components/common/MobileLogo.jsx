import React from 'react';
import { Activity } from 'lucide-react';

const MobileLogo = () => {
  return (
    <div className="lg:hidden text-center">
      <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
        <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/30">
          <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-white">MediCarePro</h1>
          <p className="text-blue-200 text-xs sm:text-sm">Healthcare Excellence</p>
        </div>
      </div>
    </div>
  );
};

export default MobileLogo;
