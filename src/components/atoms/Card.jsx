import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  padding = 'md',
  ...props 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: ''
  };

  const baseClasses = `
    rounded-card shadow-card transition-all duration-200
    ${gradient 
      ? 'bg-gradient-to-br from-white to-gray-50' 
      : 'bg-surface'
    }
    ${hover ? 'hover:shadow-elevated hover:-translate-y-1' : ''}
    ${paddingClasses[padding]}
    ${className}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;