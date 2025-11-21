import React from 'react';
import { X } from 'lucide-react';

const UserFormModal = ({ 
  isOpen, 
  onClose, 
  title, 
  formData, 
  onInputChange, 
  onSubmit, 
  modalType, // 'add', 'edit', 'view'
  fields,
  submitButtonText,
  submitButtonColor = "bg-blue-600 hover:bg-blue-700"
}) => {
  if (!isOpen) return null;

  const renderField = (field) => {
    const { name, label, type = 'text', required = false, options, placeholder, rows } = field;
    
    if (type === 'select' && options) {
      return (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && '*'}
          </label>
          <select
            name={name}
            value={formData[name] || ''}
            onChange={onInputChange}
            required={required}
            disabled={modalType === 'view'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div key={name} className={field.fullWidth ? 'md:col-span-2' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && '*'}
          </label>
          <textarea
            name={name}
            value={formData[name] || ''}
            onChange={onInputChange}
            required={required}
            disabled={modalType === 'view'}
            rows={rows || 3}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      );
    }

    return (
      <div key={name} className={field.fullWidth ? 'md:col-span-2' : ''}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && '*'}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={onInputChange}
          required={required}
          disabled={modalType === 'view'}
          placeholder={placeholder}
          min={type === 'number' ? '0' : undefined}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(renderField)}
            </div>

            {modalType !== 'view' && (
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${submitButtonColor}`}
                >
                  {submitButtonText}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
