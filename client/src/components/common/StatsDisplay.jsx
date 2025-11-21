import React from 'react';
import { Users, Activity, Star } from 'lucide-react';

const StatsDisplay = () => {
  const stats = [
    { number: '25,000+', label: 'Active Patients', icon: Users },
    { number: '99.8%', label: 'Uptime', icon: Activity },
    { number: '4.9/5', label: 'Satisfaction', icon: Star }
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div key={index} className="backdrop-blur-sm bg-white/10 rounded-xl p-4 text-center border border-white/20">
          <stat.icon className="h-6 w-6 text-blue-200 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stat.number}</div>
          <div className="text-sm text-blue-200">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;
