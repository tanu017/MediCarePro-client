import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorDisplay = ({ 
  error, 
  onDismiss, 
  onRetry, 
  retryText = "Try Again", 
  title = "Error", 
  className = "",
  variant = "inline" // "inline" or "fullscreen"
}) => {
  if (!error) return null;

  // Inline variant (for forms, cards, etc.)
  if (variant === "inline") {
    return (
      <div className={`mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 ${className}`}>
        <AlertCircle className="h-5 w-5 text-red-500" />
        <span className="text-red-700">{error}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }

  // Fullscreen variant (for page-level errors)
  return (
    <div className={`min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
