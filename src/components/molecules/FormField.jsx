import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ 
  type = 'input', 
  label, 
  name, 
  value, 
  onChange, 
  options = [],
  error,
  required = false,
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, name);
    }
  };

  const commonProps = {
    label: required ? `${label} *` : label,
    name,
    value,
    onChange: handleChange,
    error,
    ...props
  };

  switch (type) {
    case 'select':
      return <Select {...commonProps} options={options} />;
    case 'textarea':
      return (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {required ? `${label} *` : label}
            </label>
          )}
          <textarea
            className={`
              w-full px-4 py-3 border-2 rounded-lg bg-white text-gray-900 placeholder-gray-500
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}
              resize-vertical min-h-[100px]
            `}
            name={name}
            value={value}
            onChange={handleChange}
            {...props}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      );
    default:
      return <Input {...commonProps} />;
  }
};

export default FormField;