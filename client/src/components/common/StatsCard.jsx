import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change, 
  className = "",
  size = "default" // "small", "default", "large"
}) => {
  const getPaddingClass = () => {
    switch (size) {
      case "small":
        return "p-3 sm:p-4";
      case "large":
        return "p-6 sm:p-8";
      case "default":
      default:
        return "p-4 sm:p-6";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return "h-4 w-4 sm:h-5 sm:w-5";
      case "large":
        return "h-6 w-6 sm:h-8 sm:w-8";
      case "default":
      default:
        return "h-5 w-5 sm:h-6 sm:w-6";
    }
  };

  const getIconPadding = () => {
    switch (size) {
      case "small":
        return "p-2 sm:p-2.5";
      case "large":
        return "p-3 sm:p-4";
      case "default":
      default:
        return "p-2 sm:p-3";
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${getPaddingClass()} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
        </div>
        <div className={`${getIconPadding()} rounded-lg ${color}`}>
          <Icon className={`${getIconSize()} text-white`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
