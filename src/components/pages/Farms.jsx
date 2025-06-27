import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { useFarms } from '@/hooks/useFarms';
import { toast } from 'react-toastify';

const Farms = () => {
  const { farms, loading, error, addFarm, updateFarm, deleteFarm, fetchFarms } = useFarms();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    sizeUnit: 'acres'
  });

  const sizeUnitOptions = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'sqft', label: 'Square Feet' }
  ];

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.size) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingFarm) {
        await updateFarm(editingFarm.id, formData);
        toast.success('Farm updated successfully');
      } else {
        await addFarm(formData);
        toast.success('Farm added successfully');
      }
      
      setShowForm(false);
      setEditingFarm(null);
      setFormData({ name: '', location: '', size: '', sizeUnit: 'acres' });
    } catch (error) {
      toast.error('Failed to save farm');
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit
    });
    setShowForm(true);
  };

  const handleDelete = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        await deleteFarm(farmId);
        toast.success('Farm deleted successfully');
      } catch (error) {
        toast.error('Failed to delete farm');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFarm(null);
    setFormData({ name: '', location: '', size: '', sizeUnit: 'acres' });
  };

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={fetchFarms} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Management</h1>
          <p className="text-gray-600">Manage your farm properties and locations</p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Add Farm
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search farms by name or location..."
        value={searchTerm}
        onChange={setSearchTerm}
        className="max-w-md"
      />

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-forest-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingFarm ? 'Edit Farm' : 'Add New Farm'}
            </h3>
            <Button variant="ghost" size="sm" icon="X" onClick={handleCancel} />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Farm Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter farm name"
                required
              />
              
              <FormField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Enter farm location"
                required
              />
              
              <FormField
                label="Size"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleFormChange}
                placeholder="Enter farm size"
                required
              />
              
              <FormField
                type="select"
                label="Size Unit"
                name="sizeUnit"
                value={formData.sizeUnit}
                onChange={handleFormChange}
                options={sizeUnitOptions}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingFarm ? 'Update Farm' : 'Add Farm'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Farms List */}
      {filteredFarms.length === 0 ? (
        <Empty
          type="farms"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm, index) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-400 to-forest-600 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name="MapPin" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                      <p className="text-sm text-gray-600">{farm.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => handleEdit(farm)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(farm.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ApperIcon name="Maximize" className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Size</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {farm.size} {farm.sizeUnit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Added</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Farms;