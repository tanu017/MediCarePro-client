import React from 'react';
import { CheckCircle } from 'lucide-react';

const TrustBadge = ({ text = "Trusted by 25,000+ patients" }) => {
  return (
    <div className="inline-flex items-center space-x-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-6 py-3 mb-8">
      <CheckCircle className="h-5 w-5 text-green-400" />
      <span className="text-blue-100 font-medium">{text}</span>
    </div>
  );
};

export default TrustBadge;
