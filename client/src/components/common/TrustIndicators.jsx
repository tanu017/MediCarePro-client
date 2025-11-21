import React from 'react';
import { Shield, Award, Clock } from 'lucide-react';

const TrustIndicators = () => {
  const trustIndicators = [
    { icon: Shield, title: 'HIPAA Compliant', subtitle: 'Your data is protected' },
    { icon: Award, title: 'Award Winning', subtitle: 'Top healthcare provider' },
    { icon: Clock, title: '24/7 Support', subtitle: 'Always here for you' }
  ];

  return (
    <div className="space-y-4">
      {trustIndicators.map((item, index) => (
        <div key={index} className="flex items-center space-x-3 text-blue-100">
          <div className="bg-white/20 p-2 rounded-lg">
            <item.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-white">{item.title}</div>
            <div className="text-sm opacity-80">{item.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustIndicators;
