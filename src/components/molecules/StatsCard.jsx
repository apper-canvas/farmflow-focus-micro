import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'positive',
  gradient = false,
  color = 'forest'
}) => {
  const colors = {
    forest: 'text-forest-600 bg-forest-100',
    earth: 'text-earth-600 bg-earth-100',
    amber: 'text-amber-600 bg-amber-100',
    blue: 'text-blue-600 bg-blue-100'
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <Card hover gradient={gradient} className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          {change && (
            <div className={`flex items-center text-sm ${changeColors[changeType]}`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                className="w-4 h-4 mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colors[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
      
      {gradient && (
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
          <div className={`w-full h-full rounded-full bg-gradient-to-br from-${color}-400 to-${color}-600`} />
        </div>
      )}
    </Card>
  );
};

export default StatsCard;