import { useState, useEffect } from 'react';
import { farmService } from '@/services/api/farmService';

export const useFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError('Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const addFarm = async (farmData) => {
    const newFarm = await farmService.create(farmData);
    setFarms(prev => [...prev, newFarm]);
    return newFarm;
  };

  const updateFarm = async (id, farmData) => {
    const updatedFarm = await farmService.update(id, farmData);
    setFarms(prev => prev.map(farm => farm.id === id ? updatedFarm : farm));
    return updatedFarm;
  };

  const deleteFarm = async (id) => {
    await farmService.delete(id);
    setFarms(prev => prev.filter(farm => farm.id !== id));
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  return {
    farms,
    loading,
    error,
    fetchFarms,
    addFarm,
    updateFarm,
    deleteFarm
  };
};