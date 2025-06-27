import { useState, useEffect } from 'react';
import { cropService } from '@/services/api/cropService';

export const useCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cropService.getAll();
      setCrops(data);
    } catch (err) {
      setError('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  const addCrop = async (cropData) => {
    const newCrop = await cropService.create(cropData);
    setCrops(prev => [...prev, newCrop]);
    return newCrop;
  };

  const updateCrop = async (id, cropData) => {
    const updatedCrop = await cropService.update(id, cropData);
    setCrops(prev => prev.map(crop => crop.id === id ? updatedCrop : crop));
    return updatedCrop;
  };

  const deleteCrop = async (id) => {
    await cropService.delete(id);
    setCrops(prev => prev.filter(crop => crop.id !== id));
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  return {
    crops,
    loading,
    error,
    fetchCrops,
    addCrop,
    updateCrop,
    deleteCrop
  };
};