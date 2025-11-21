import React from 'react';
import { AlertCircle } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  item, 
  itemType = "item",
  icon: Icon,
  iconColor = "text-red-600",
  iconBg = "bg-red-100"
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-600/20 via-red-600/20 to-red-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-full flex-shrink-0 ${iconBg}`}>
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Confirm Deletion</h3>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            Are you sure you want to delete this {itemType}? This action cannot be undone.
          </p>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className={`p-2 rounded-lg flex-shrink-0 ${iconBg}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                  {item.userId?.name || item.name || 'Unknown Item'}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {item.specialization || item.department || item.gender || 'No additional info'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
