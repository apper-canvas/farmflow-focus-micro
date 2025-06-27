import { useState, useEffect } from 'react';
import { weatherService } from '@/services/api/weatherService';

export const useWeather = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getAll();
      setWeather(data);
    } catch (err) {
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return {
    weather,
    loading,
    error,
    fetchWeather
  };
};