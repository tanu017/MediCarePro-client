import React from 'react';

const RecentItemsCard = ({ 
  title, 
  items, 
  icon: Icon, 
  iconColor = "text-blue-500",
  emptyMessage = "No items found",
  renderItem 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={item._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              {renderItem ? renderItem(item) : (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name || item.title || 'Unknown Item'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.description || item.subtitle || 'No description'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentItemsCard;
