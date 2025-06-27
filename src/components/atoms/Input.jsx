import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  icon, 
  error, 
  helperText,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-lg bg-white text-gray-900 placeholder-gray-500
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}
    ${icon ? 'pl-12' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;