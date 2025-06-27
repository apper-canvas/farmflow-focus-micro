import { useState, useEffect } from 'react';
import { expenseService } from '@/services/api/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    const newExpense = await expenseService.create(expenseData);
    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  };

  const updateExpense = async (id, expenseData) => {
    const updatedExpense = await expenseService.update(id, expenseData);
    setExpenses(prev => prev.map(expense => expense.id === id ? updatedExpense : expense));
    return updatedExpense;
  };

  const deleteExpense = async (id) => {
    await expenseService.delete(id);
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  };
};