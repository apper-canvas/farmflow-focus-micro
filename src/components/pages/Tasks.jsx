import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { useTasks } from '@/hooks/useTasks';
import { useFarms } from '@/hooks/useFarms';
import { useCrops } from '@/hooks/useCrops';
import { toast } from 'react-toastify';

const Tasks = ({ selectedFarmId }) => {
  const { tasks, loading, error, addTask, updateTask, deleteTask, fetchTasks } = useTasks();
  const { farms } = useFarms();
  const { crops } = useCrops();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    farmId: selectedFarmId,
    cropId: '',
    title: '',
    description: '',
    dueDate: '',
    completed: false
  });

  const taskTypes = [
    'Watering',
    'Fertilizing',
    'Harvesting',
    'Weeding',
    'Pruning',
    'Planting',
    'Equipment Maintenance',
    'Pest Control',
    'Soil Testing',
    'Other'
  ];

  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const farmCrops = crops.filter(crop => crop.farmId === selectedFarmId);
  const cropOptions = [
    { value: '', label: 'General Task (No Crop)' },
    ...farmCrops.map(crop => ({
      value: crop.id,
      label: `${crop.type} - ${crop.location}`
    }))
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFarm = task.farmId === selectedFarmId;
    
    let matchesStatus = true;
    if (statusFilter === 'pending') {
      matchesStatus = !task.completed;
    } else if (statusFilter === 'completed') {
      matchesStatus = task.completed;
    } else if (statusFilter === 'overdue') {
      matchesStatus = !task.completed && new Date(task.dueDate) < new Date();
    }
    
    return matchesSearch && matchesStatus && matchesFarm;
  });

  const handleFormChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const taskData = {
        ...formData,
        farmId: selectedFarmId,
        cropId: formData.cropId || null
      };

      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        toast.success('Task updated successfully');
      } else {
        await addTask(taskData);
        toast.success('Task created successfully');
      }
      
      setShowForm(false);
      setEditingTask(null);
      setFormData({
        farmId: selectedFarmId,
        cropId: '',
        title: '',
        description: '',
        dueDate: '',
        completed: false
      });
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      farmId: task.farmId,
      cropId: task.cropId || '',
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: task.completed
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task.id, { ...task, completed: !task.completed });
      toast.success(task.completed ? 'Task marked as pending' : 'Task completed!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      farmId: selectedFarmId,
      cropId: '',
      title: '',
      description: '',
      dueDate: '',
      completed: false
    });
  };

  const getTaskPriority = (task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (task.completed) return 'completed';
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 3) return 'soon';
    return 'normal';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'overdue': return 'error';
      case 'today': return 'warning';
      case 'soon': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={fetchTasks} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">
            Manage tasks for {farms.find(f => f.id === selectedFarmId)?.name || 'Selected Farm'}
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
        />
        
        <div className="w-full sm:w-48">
          <FormField
            type="select"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={filterOptions}
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-forest-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <Button variant="ghost" size="sm" icon="X" onClick={handleCancel} />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Enter task title"
                required
              />
              
              <FormField
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleFormChange}
                required
              />
              
              <FormField
                type="select"
                label="Related Crop"
                name="cropId"
                value={formData.cropId}
                onChange={handleFormChange}
                options={cropOptions}
              />
            </div>
            
            <FormField
              type="textarea"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Describe the task details..."
              rows={3}
            />
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          type="tasks"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => {
            const priority = getTaskPriority(task);
            const relatedCrop = farmCrops.find(crop => crop.id === task.cropId);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className={`border-l-4 ${
                  priority === 'overdue' ? 'border-red-500' :
                  priority === 'today' ? 'border-yellow-500' :
                  priority === 'soon' ? 'border-blue-500' :
                  priority === 'completed' ? 'border-green-500' :
                  'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${task.completed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-500'
                            }
                          `}
                        >
                          {task.completed && <ApperIcon name="Check" className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-lg font-semibold ${
                            task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={getPriorityColor(priority)}>
                              {priority === 'overdue' ? 'Overdue' :
                               priority === 'today' ? 'Due Today' :
                               priority === 'soon' ? 'Due Soon' :
                               priority === 'completed' ? 'Completed' :
                               'Upcoming'}
                            </Badge>
                            
                            {relatedCrop && (
                              <Badge variant="planted">
                                {relatedCrop.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className={`text-gray-600 mb-3 ${
                            task.completed ? 'line-through' : ''
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                            Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Edit"
                              onClick={() => handleEdit(task)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Trash2"
                              onClick={() => handleDelete(task.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Tasks;