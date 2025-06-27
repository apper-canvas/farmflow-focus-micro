import { useState, useEffect } from 'react';
import { taskService } from '@/services/api/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    const newTask = await taskService.create(taskData);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (id, taskData) => {
    const updatedTask = await taskService.update(id, taskData);
    setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    return updatedTask;
  };

  const deleteTask = async (id) => {
    await taskService.delete(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  };
};