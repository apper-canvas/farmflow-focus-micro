import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useFarms } from "@/hooks/useFarms";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, selectedFarmId, onFarmChange }) => {
const { farms } = useFarms();
  const { logout } = useContext(AuthContext);

  const farmOptions = farms.map(farm => ({
    value: farm.id,
    label: farm.name
  }));
  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden mr-4"
          />
          
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-gray-900">
              Good morning, Farmer!
            </h2>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

<div className="flex items-center space-x-4">
          <div className="w-48 hidden md:block">
            <Select
              value={selectedFarmId}
              onChange={(e) => onFarmChange(e.target.value)}
              options={farmOptions}
              className="text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 hidden sm:inline">Synced</span>
          </div>
          
<Button
            variant="ghost"
            size="sm"
            icon="LogOut"
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <span className="hidden sm:inline ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;