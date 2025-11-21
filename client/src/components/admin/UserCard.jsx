import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const UserCard = ({ 
  user, 
  icon: Icon, 
  iconColor = "text-blue-500", 
  iconBg = "bg-blue-100",
  onView, 
  onEdit, 
  onDelete,
  renderDetails,
  renderFooter
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.userId?.name || user.name || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500">
              {user.specialization || user.department || user.gender || 'General'}
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          {onView && (
            <button
              onClick={() => onView(user)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {renderDetails && (
        <div className="space-y-2">
          {renderDetails(user)}
        </div>
      )}

      {renderFooter && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {renderFooter(user)}
        </div>
      )}
    </div>
  );
};

export default UserCard;
