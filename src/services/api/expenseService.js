import { expenseData } from '@/services/mockData/expenses';

let expenses = [...expenseData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseService = {
  async getAll() {
    await delay(300);
    return [...expenses];
  },

  async getById(id) {
    await delay(200);
    const expense = expenses.find(e => e.id === id);
    if (!expense) throw new Error('Expense not found');
    return { ...expense };
  },

  async create(expenseData) {
    await delay(400);
    const maxId = Math.max(...expenses.map(e => parseInt(e.id)), 0);
    const newExpense = {
      id: (maxId + 1).toString(),
      ...expenseData
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async update(id, expenseData) {
    await delay(350);
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    
    const updatedExpense = {
      ...expenses[index],
      ...expenseData
    };
    expenses[index] = updatedExpense;
    return { ...updatedExpense };
  },

  async delete(id) {
    await delay(250);
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    expenses.splice(index, 1);
    return true;
  }
};