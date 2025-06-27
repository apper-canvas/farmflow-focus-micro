import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickActionCard = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  onAction,
  variant = 'primary',
  color = 'forest'
}) => {
  const colors = {
    forest: 'bg-forest-50 border-forest-200',
    earth: 'bg-earth-50 border-earth-200',
    amber: 'bg-amber-50 border-amber-200'
  };

  return (
    <Card className={`border-2 ${colors[color]} hover:shadow-elevated transition-all duration-300`}>
      <div className="text-center">
        <div className={`inline-flex p-4 rounded-full bg-gradient-to-br from-${color}-400 to-${color}-600 text-white mb-4`}>
          <ApperIcon name={icon} className="w-8 h-8" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        
        <Button 
          variant={variant} 
          onClick={onAction}
          className="w-full"
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default QuickActionCard;