import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormInput = ({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  showPassword,
  onTogglePassword,
  required = false,
  className = ''
}) => {
  const baseClasses = `w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm sm:text-base ${error ? 'border-red-400' : ''} ${className}`;

  return (
    <div>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          className={baseClasses}
          placeholder={placeholder}
        />
        {onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
          >
            {showPassword ? (
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 hover:text-white transition-colors" />
            ) : (
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 hover:text-white transition-colors" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-300 flex items-center space-x-1">
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormInput;
