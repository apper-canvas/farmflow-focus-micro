import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = 'Something went wrong', 
  onRetry,
  type = 'default'
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff';
      case 'data':
        return 'Database';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'data':
        return 'Data Error';
      default:
        return 'Error';
    }
  };

  return (
    <Card className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <ApperIcon name={getErrorIcon()} className="w-8 h-8 text-white" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          icon="RefreshCw"
          className="mx-auto"
        >
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;