import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { useWeather } from '@/hooks/useWeather';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const WeatherWidget = () => {
  const { weather, loading, error, fetchWeather } = useWeather();

  if (loading) return <Loading type="weather" />;
  if (error) return <Error message={error} onRetry={fetchWeather} />;

  const today = weather[0];
  if (!today) return null;

  const getWeatherIcon = (conditions) => {
    const iconMap = {
      'sunny': 'Sun',
      'cloudy': 'Cloud',
      'rainy': 'CloudRain',
      'stormy': 'CloudLightning',
      'snowy': 'CloudSnow'
    };
    return iconMap[conditions.toLowerCase()] || 'Sun';
  };

  return (
    <Card gradient className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Today's Weather</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {today.tempHigh}°F
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Low: {today.tempLow}°F
          </p>
          <p className="text-sm text-gray-600 capitalize">
            {today.conditions}
          </p>
          {today.precipitation > 0 && (
            <p className="text-sm text-blue-600 font-medium">
              Rain: {today.precipitation}"
            </p>
          )}
        </div>
        
        <div className="text-right">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
            <ApperIcon name={getWeatherIcon(today.conditions)} className="w-8 h-8 text-white" />
          </div>
          <p className="text-xs text-gray-500">
            {new Date(today.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;