import { taskData } from '@/services/mockData/tasks';

let tasks = [...taskData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...tasks.map(t => parseInt(t.id)), 0);
    const newTask = {
      id: (maxId + 1).toString(),
      ...taskData
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...tasks[index],
      ...taskData
    };
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    tasks.splice(index, 1);
    return true;
  }
};