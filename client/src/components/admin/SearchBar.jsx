import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className = "",
  focusColor = "focus:ring-blue-500"
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:border-transparent`}
        />
      </div>
    </div>
  );
};

export default SearchBar;
