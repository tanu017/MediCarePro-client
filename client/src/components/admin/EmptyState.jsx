import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionButton,
  actionButtonText,
  actionButtonIcon: ActionIcon,
  onActionClick,
  actionButtonColor = "bg-blue-600 hover:bg-blue-700"
}) => {
  return (
    <div className="text-center py-12">
      <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {actionButton && onActionClick && (
        <button
          onClick={onActionClick}
          className={`inline-flex items-center space-x-2 text-white px-4 py-2 rounded-lg transition-colors ${actionButtonColor}`}
        >
          {ActionIcon && <ActionIcon className="h-5 w-5" />}
          <span>{actionButtonText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
