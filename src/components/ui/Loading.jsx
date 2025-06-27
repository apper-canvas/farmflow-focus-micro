import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'default', className = '' }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '-200px 0' },
    animate: { 
      backgroundPosition: 'calc(200px + 100%) 0',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const renderSkeleton = () => {
    switch (type) {
      case 'stats':
        return (
          <div className="bg-white rounded-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <motion.div 
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="h-4 bg-gray-200 rounded w-24 mb-2 shimmer"
                />
                <motion.div 
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="h-8 bg-gray-200 rounded w-16 mb-2 shimmer"
                />
                <motion.div 
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="h-3 bg-gray-200 rounded w-20 shimmer"
                />
              </div>
              <motion.div 
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="w-12 h-12 bg-gray-200 rounded-full shimmer"
              />
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="bg-white rounded-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <motion.div 
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="h-5 bg-gray-200 rounded w-32 mb-2 shimmer"
                />
                <motion.div 
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="h-10 bg-gray-200 rounded w-20 mb-2 shimmer"
                />
                <motion.div 
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="h-4 bg-gray-200 rounded w-16 mb-1 shimmer"
                />
                <motion.div 
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="h-4 bg-gray-200 rounded w-24 shimmer"
                />
              </div>
              <motion.div 
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="w-16 h-16 bg-gray-200 rounded-full shimmer"
              />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-card p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <motion.div 
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="h-5 bg-gray-200 rounded w-48 mb-2 shimmer"
                    />
                    <motion.div 
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="h-4 bg-gray-200 rounded w-32 shimmer"
                    />
                  </div>
                  <motion.div 
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="h-8 bg-gray-200 rounded w-16 shimmer"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="p-6">
              <motion.div 
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="h-6 bg-gray-200 rounded w-32 mb-4 shimmer"
              />
            </div>
            <div className="space-y-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <motion.div 
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="h-4 bg-gray-200 rounded w-40 shimmer"
                    />
                    <motion.div 
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="h-4 bg-gray-200 rounded w-24 shimmer"
                    />
                    <motion.div 
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="h-4 bg-gray-200 rounded w-16 shimmer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-card p-6 shadow-card">
            <motion.div 
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="h-6 bg-gray-200 rounded w-3/4 mb-4 shimmer"
            />
            <motion.div 
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="h-4 bg-gray-200 rounded w-1/2 mb-2 shimmer"
            />
            <motion.div 
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="h-4 bg-gray-200 rounded w-2/3 shimmer"
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {renderSkeleton()}
    </motion.div>
  );
};

export default Loading;