import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useWeather } from '@/hooks/useWeather';

const Weather = () => {
  const { weather, loading, error, fetchWeather } = useWeather();

  if (loading) return <Loading type="weather" />;
  if (error) return <Error message={error} onRetry={fetchWeather} type="network" />;

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

  const getWeatherColor = (conditions) => {
    const colorMap = {
      'sunny': 'from-yellow-400 to-orange-500',
      'cloudy': 'from-gray-400 to-gray-500',
      'rainy': 'from-blue-400 to-blue-600',
      'stormy': 'from-purple-500 to-indigo-600',
      'snowy': 'from-blue-200 to-blue-400'
    };
    return colorMap[conditions.toLowerCase()] || 'from-yellow-400 to-orange-500';
  };

  const getFarmingAdvice = (conditions, precipitation, tempHigh) => {
    if (conditions.toLowerCase() === 'rainy' || precipitation > 0.5) {
      return {
        type: 'warning',
        message: 'Heavy rain expected - avoid field work and harvesting'
      };
    }
    if (tempHigh > 85) {
      return {
        type: 'info',
        message: 'Hot weather - ensure adequate watering for crops'
      };
    }
    if (tempHigh < 50) {
      return {
        type: 'warning',
        message: 'Cool temperatures - protect sensitive plants'
      };
    }
    return {
      type: 'success',
      message: 'Good conditions for most farming activities'
    };
  };

  const today = weather[0];
  const forecast = weather.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
        <p className="text-gray-600">5-day weather forecast with farming insights</p>
      </div>

      {/* Today's Weather - Featured */}
      {today && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <h2 className="text-xl font-bold text-gray-900 mr-2">Today</h2>
                <Badge variant="info">Current</Badge>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {today.tempHigh}°F
              </p>
              <p className="text-lg text-gray-700 mb-1">
                Low: {today.tempLow}°F
              </p>
              <p className="text-gray-600 capitalize mb-3">
                {today.conditions}
              </p>
              {today.precipitation > 0 && (
                <div className="flex items-center text-blue-600">
                  <ApperIcon name="CloudRain" className="w-4 h-4 mr-1" />
                  <span className="font-medium">{today.precipitation}" rain expected</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${getWeatherColor(today.conditions)} rounded-full flex items-center justify-center mb-3`}>
                <ApperIcon name={getWeatherIcon(today.conditions)} className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm text-gray-600">
                {format(new Date(today.date), 'EEEE')}
              </p>
            </div>
          </div>
          
          {/* Farming Advice */}
          <div className="mt-6 p-4 bg-white/50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                {(() => {
                  const advice = getFarmingAdvice(today.conditions, today.precipitation, today.tempHigh);
                  return (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      advice.type === 'warning' ? 'bg-yellow-100' :
                      advice.type === 'success' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <ApperIcon 
                        name={
                          advice.type === 'warning' ? 'AlertTriangle' :
                          advice.type === 'success' ? 'CheckCircle' :
                          'Info'
                        } 
                        className={`w-4 h-4 ${
                          advice.type === 'warning' ? 'text-yellow-600' :
                          advice.type === 'success' ? 'text-green-600' :
                          'text-blue-600'
                        }`} 
                      />
                    </div>
                  );
                })()}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Farming Advice</h4>
                <p className="text-sm text-gray-700">
                  {getFarmingAdvice(today.conditions, today.precipitation, today.tempHigh).message}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="text-center">
              <h3 className="font-semibold text-gray-900 mb-3">
                {format(new Date(day.date), 'EEEE')}
              </h3>
              
              <div className={`w-16 h-16 bg-gradient-to-br ${getWeatherColor(day.conditions)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <ApperIcon name={getWeatherIcon(day.conditions)} className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High</span>
                  <span className="text-lg font-bold text-gray-900">{day.tempHigh}°F</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low</span>
                  <span className="text-sm font-medium text-gray-700">{day.tempLow}°F</span>
                </div>
                
                <p className="text-sm text-gray-600 capitalize">{day.conditions}</p>
                
                {day.precipitation > 0 && (
                  <div className="flex items-center justify-center text-blue-600 text-sm">
                    <ApperIcon name="CloudRain" className="w-3 h-3 mr-1" />
                    {day.precipitation}"
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weather Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Thermometer" className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-700">Avg High</span>
              </div>
              <span className="font-medium text-gray-900">
                {Math.round(weather.reduce((sum, day) => sum + day.tempHigh, 0) / weather.length)}°F
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Snowflake" className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-700">Avg Low</span>
              </div>
              <span className="font-medium text-gray-900">
                {Math.round(weather.reduce((sum, day) => sum + day.tempLow, 0) / weather.length)}°F
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="CloudRain" className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-700">Total Rain</span>
              </div>
              <span className="font-medium text-gray-900">
                {weather.reduce((sum, day) => sum + day.precipitation, 0).toFixed(1)}"
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Days For</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Sprout" className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-700">Planting</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {weather.filter(day => day.conditions === 'sunny' && day.precipitation === 0).length} days
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Droplets" className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-gray-700">Watering</span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {weather.filter(day => day.precipitation === 0).length} days
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Scissors" className="w-4 h-4 text-amber-600 mr-2" />
                <span className="text-sm text-gray-700">Harvesting</span>
              </div>
              <span className="text-sm font-medium text-amber-600">
                {weather.filter(day => day.conditions === 'sunny' && day.precipitation === 0).length} days
              </span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Weather;