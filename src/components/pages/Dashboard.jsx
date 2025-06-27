import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '@/components/molecules/StatsCard';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import WeatherWidget from '@/components/organisms/WeatherWidget';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { useFarms } from '@/hooks/useFarms';
import { useCrops } from '@/hooks/useCrops';
import { useTasks } from '@/hooks/useTasks';
import { useExpenses } from '@/hooks/useExpenses';
import { toast } from 'react-toastify';

const Dashboard = ({ selectedFarmId }) => {
  const { farms } = useFarms();
  const { crops } = useCrops();
  const { tasks } = useTasks();
  const { expenses } = useExpenses();

  // Filter data for selected farm
  const farmCrops = crops.filter(crop => crop.farmId === selectedFarmId);
  const farmTasks = tasks.filter(task => task.farmId === selectedFarmId);
  const farmExpenses = expenses.filter(expense => expense.farmId === selectedFarmId);

  // Calculate stats
  const activeCrops = farmCrops.filter(crop => crop.status !== 'harvested').length;
  const pendingTasks = farmTasks.filter(task => !task.completed).length;
  const monthlyExpenses = farmExpenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Get today's tasks
  const today = new Date().toDateString();
  const todaysTasks = farmTasks.filter(task => 
    new Date(task.dueDate).toDateString() === today && !task.completed
  );

  // Get recent activities
  const recentExpenses = farmExpenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const handleQuickAction = (action) => {
    toast.info(`${action} feature coming soon!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <Card gradient className="bg-gradient-to-r from-forest-50 to-earth-50 border border-forest-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to FarmFlow
              </h1>
              <p className="text-gray-600">
                {farms.find(f => f.id === selectedFarmId)?.name || 'Your Farm'} - 
                Managing {activeCrops} active crops with {pendingTasks} pending tasks
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Crops"
          value={activeCrops}
          icon="Sprout"
          color="forest"
          gradient
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          color="amber"
          gradient
        />
        <StatsCard
          title="Monthly Expenses"
          value={`$${monthlyExpenses.toFixed(2)}`}
          icon="DollarSign"
          color="earth"
          gradient
        />
        <StatsCard
          title="Total Farms"
          value={farms.length}
          icon="MapPin"
          color="blue"
          gradient
        />
      </motion.div>

      {/* Weather and Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <WeatherWidget />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
              <Badge variant="info">{todaysTasks.length} pending</Badge>
            </div>
            
            {todaysTasks.length > 0 ? (
              <div className="space-y-3">
                {todaysTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ApperIcon name="Clock" className="w-4 h-4 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <Badge variant={task.cropId ? 'planted' : 'default'}>
                      {task.cropId ? 'Crop Task' : 'General'}
                    </Badge>
                  </div>
                ))}
                
                {todaysTasks.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{todaysTasks.length - 3} more tasks
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">All tasks completed for today!</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-earth-400 to-earth-500 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name="DollarSign" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-600">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
<p className="font-semibold text-gray-900">${(expense.amount || 0).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Receipt" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No recent expenses recorded</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Add Crop"
            description="Plant new crops and track their growth"
            icon="Sprout"
            buttonText="Plant Crop"
            onAction={() => handleQuickAction('Add Crop')}
            color="forest"
          />
          <QuickActionCard
            title="Create Task"
            description="Schedule farming activities and reminders"
            icon="Plus"
            buttonText="Add Task"
            onAction={() => handleQuickAction('Create Task')}
            color="amber"
          />
          <QuickActionCard
            title="Log Expense"
            description="Record farm-related expenses and costs"
            icon="Receipt"
            buttonText="Add Expense"
            onAction={() => handleQuickAction('Log Expense')}
            color="earth"
          />
          <QuickActionCard
            title="Check Weather"
            description="View detailed weather forecast"
            icon="Cloud"
            buttonText="View Weather"
            onAction={() => handleQuickAction('Check Weather')}
            variant="outline"
            color="forest"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;