import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

const PageHeader = ({ 
  title, 
  subtitle, 
  showBackButton = true, 
  backPath = '/admin', 
  onBackClick,
  actionButton,
  actionButtonText,
  actionButtonIcon: ActionIcon = Plus,
  onActionClick,
  actionButtonColor = 'bg-blue-600 hover:bg-blue-700'
}) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1 text-sm sm:text-base">{subtitle}</p>}
          </div>
        </div>
        {(actionButton || onActionClick) && (
          <button
            onClick={onActionClick}
            className={`flex items-center justify-center space-x-2 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${actionButtonColor}`}
          >
            <ActionIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">{actionButtonText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
