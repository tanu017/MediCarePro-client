import React from 'react';

const LoadingSpinner = ({ 
  message = "Loading...", 
  className = "",
  size = "large" // "small", "medium", "large"
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case "small":
        return "h-6 w-6";
      case "medium":
        return "h-8 w-8";
      case "large":
      default:
        return "h-12 w-12";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "medium":
        return "text-base";
      case "large":
      default:
        return "text-lg";
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4 ${getSpinnerSize()}`}></div>
        <p className={`text-gray-600 ${getTextSize()}`}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
