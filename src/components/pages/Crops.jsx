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
import { useCrops } from '@/hooks/useCrops';
import { useFarms } from '@/hooks/useFarms';
import { toast } from 'react-toastify';

const Crops = ({ selectedFarmId }) => {
  const { crops, loading, error, addCrop, updateCrop, deleteCrop, fetchCrops } = useCrops();
  const { farms } = useFarms();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    farmId: selectedFarmId,
    type: '',
    location: '',
    plantingDate: '',
    expectedHarvest: '',
    status: 'planted'
  });

  const cropTypes = [
    { value: 'corn', label: 'Corn' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'soybeans', label: 'Soybeans' },
    { value: 'tomatoes', label: 'Tomatoes' },
    { value: 'potatoes', label: 'Potatoes' },
    { value: 'carrots', label: 'Carrots' },
    { value: 'lettuce', label: 'Lettuce' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'planted', label: 'Planted' },
    { value: 'growing', label: 'Growing' },
    { value: 'ready', label: 'Ready to Harvest' },
    { value: 'harvested', label: 'Harvested' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Crops' },
    ...statusOptions
  ];

  const farmOptions = farms.map(farm => ({
    value: farm.id,
    label: farm.name
  }));

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || crop.status === statusFilter;
    const matchesFarm = crop.farmId === selectedFarmId;
    
    return matchesSearch && matchesStatus && matchesFarm;
  });

  const handleFormChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.location || !formData.plantingDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const cropData = {
        ...formData,
        farmId: selectedFarmId
      };

      if (editingCrop) {
        await updateCrop(editingCrop.id, cropData);
        toast.success('Crop updated successfully');
      } else {
        await addCrop(cropData);
        toast.success('Crop added successfully');
      }
      
      setShowForm(false);
      setEditingCrop(null);
      setFormData({
        farmId: selectedFarmId,
        type: '',
        location: '',
        plantingDate: '',
        expectedHarvest: '',
        status: 'planted'
      });
    } catch (error) {
      toast.error('Failed to save crop');
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId,
      type: crop.type,
      location: crop.location,
      plantingDate: crop.plantingDate,
      expectedHarvest: crop.expectedHarvest,
      status: crop.status
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await deleteCrop(cropId);
        toast.success('Crop deleted successfully');
      } catch (error) {
        toast.error('Failed to delete crop');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCrop(null);
    setFormData({
      farmId: selectedFarmId,
      type: '',
      location: '',
      plantingDate: '',
      expectedHarvest: '',
      status: 'planted'
    });
  };

  const getCropIcon = (type) => {
    const iconMap = {
      'corn': 'Wheat',
      'wheat': 'Wheat',
      'soybeans': 'Sprout',
      'tomatoes': 'Apple',
      'potatoes': 'Apple',
      'carrots': 'Carrot',
      'lettuce': 'Leaf',
    };
    return iconMap[type] || 'Sprout';
  };

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={fetchCrops} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crop Management</h1>
          <p className="text-gray-600">
            Track your plantings for {farms.find(f => f.id === selectedFarmId)?.name || 'Selected Farm'}
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Add Crop
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search crops by type or location..."
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
              {editingCrop ? 'Edit Crop' : 'Add New Crop'}
            </h3>
            <Button variant="ghost" size="sm" icon="X" onClick={handleCancel} />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="select"
                label="Crop Type"
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                options={cropTypes}
                required
              />
              
              <FormField
                label="Location/Field"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g., North Field, Greenhouse A"
                required
              />
              
              <FormField
                label="Planting Date"
                name="plantingDate"
                type="date"
                value={formData.plantingDate}
                onChange={handleFormChange}
                required
              />
              
              <FormField
                label="Expected Harvest"
                name="expectedHarvest"
                type="date"
                value={formData.expectedHarvest}
                onChange={handleFormChange}
              />
              
              <FormField
                type="select"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                options={statusOptions}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingCrop ? 'Update Crop' : 'Add Crop'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Crops List */}
      {filteredCrops.length === 0 ? (
        <Empty
          type="crops"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop, index) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-400 to-forest-600 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name={getCropIcon(crop.type)} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">{crop.type}</h3>
                      <p className="text-sm text-gray-600">{crop.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={crop.status}>{crop.status}</Badge>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => handleEdit(crop)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDelete(crop.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Planted</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {format(new Date(crop.plantingDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  
                  {crop.expectedHarvest && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ApperIcon name="Calendar" className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Expected Harvest</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {format(new Date(crop.expectedHarvest), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Days since planting</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.floor((new Date() - new Date(crop.plantingDate)) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
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

export default Crops;