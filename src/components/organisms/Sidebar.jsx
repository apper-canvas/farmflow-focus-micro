import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'Home' },
    { name: 'Farms', href: '/farms', icon: 'MapPin' },
    { name: 'Crops', href: '/crops', icon: 'Sprout' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Expenses', href: '/expenses', icon: 'DollarSign' },
    { name: 'Weather', href: '/weather', icon: 'Cloud' },
  ];

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        className={`
          fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-elevated
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-forest-500 to-forest-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Sprout" className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-forest-600 to-earth-600 bg-clip-text text-transparent">
              FarmFlow
            </h1>
          </div>
          
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-forest-50 hover:text-forest-600'
                      }
                    `}
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-forest-50 to-earth-50 rounded-lg p-4 border border-forest-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Online</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Data synced successfully</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;