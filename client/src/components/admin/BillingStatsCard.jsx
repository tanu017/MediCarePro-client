import React from 'react';
import { Receipt, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

const BillingStatsCard = ({ 
  title, 
  value, 
  icon: Icon = Receipt, 
  color = "bg-green-100", 
  iconColor = "text-green-600",
  subtitle 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default BillingStatsCard;
