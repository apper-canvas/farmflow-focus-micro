import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = 'No data found', 
  description = 'Get started by adding your first item',
  icon = 'Plus',
  actionText = 'Add Item',
  onAction,
  type = 'default'
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'farms':
        return {
          icon: 'MapPin',
          title: 'No farms added yet',
          description: 'Start by adding your first farm property to begin tracking your crops and activities.',
          actionText: 'Add Your First Farm'
        };
      case 'crops':
        return {
          icon: 'Sprout',
          title: 'No crops planted',
          description: 'Track your plantings by adding crops with their planting dates and expected harvest times.',
          actionText: 'Plant Your First Crop'
        };
      case 'tasks':
        return {
          icon: 'CheckSquare',
          title: 'No tasks scheduled',
          description: 'Stay organized by creating tasks for watering, fertilizing, harvesting, and other farm activities.',
          actionText: 'Create Your First Task'
        };
      case 'expenses':
        return {
          icon: 'DollarSign',
          title: 'No expenses recorded',
          description: 'Keep track of your farm expenses including seeds, equipment, and maintenance costs.',
          actionText: 'Record Your First Expense'
        };
      default:
        return { icon, title, description, actionText };
    }
  };

  const config = getEmptyConfig();

  return (
    <Card className="text-center py-12">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <ApperIcon name={config.icon} className="w-10 h-10 text-white" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {config.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {config.description}
      </p>
      
      {onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          icon={config.icon}
          size="lg"
          className="mx-auto"
        >
          {config.actionText}
        </Button>
      )}
    </Card>
  );
};

export default Empty;