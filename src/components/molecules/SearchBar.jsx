import React from 'react';
import Input from '@/components/atoms/Input';

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon="Search"
        className="bg-white shadow-sm"
      />
    </div>
  );
};

export default SearchBar;