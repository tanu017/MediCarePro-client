import React from 'react';

const QuickActionsCard = ({ actions, title = "Quick Actions" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
      <div className="space-y-2 sm:space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className={`p-1.5 sm:p-2 rounded-lg ${action.color}`}>
              <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-gray-700 font-medium text-sm sm:text-base">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
