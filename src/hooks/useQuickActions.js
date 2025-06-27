import { useState, useEffect } from 'react';
import { quickActionService } from '@/services/api/quickActionService';

export const useQuickActions = () => {
  const [quickActions, setQuickActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuickActions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quickActionService.getAll();
      setQuickActions(data);
    } catch (err) {
      setError('Failed to load quick actions');
    } finally {
      setLoading(false);
    }
  };

  const addQuickAction = async (actionData) => {
    const newAction = await quickActionService.create(actionData);
    setQuickActions(prev => [...prev, newAction]);
    return newAction;
  };

  const updateQuickAction = async (id, actionData) => {
    const updatedAction = await quickActionService.update(id, actionData);
    setQuickActions(prev => prev.map(action => action.Id === id ? updatedAction : action));
    return updatedAction;
  };

  const deleteQuickAction = async (id) => {
    await quickActionService.delete(id);
    setQuickActions(prev => prev.filter(action => action.Id !== id));
  };

  const executeAction = async (action) => {
    try {
      let parameters = {};
      if (action.parameters) {
        try {
          parameters = JSON.parse(action.parameters);
        } catch (e) {
          console.warn('Invalid JSON in action parameters:', action.parameters);
        }
      }

      return { action, parameters, success: true };
    } catch (error) {
      console.error('Error executing quick action:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchQuickActions();
  }, []);

  return {
    quickActions,
    loading,
    error,
    fetchQuickActions,
    addQuickAction,
    updateQuickAction,
    deleteQuickAction,
    executeAction
  };
};