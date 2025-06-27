import { weatherData } from '@/services/mockData/weather';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const weatherService = {
  async getAll() {
    await delay(400);
    return [...weatherData];
  },

  async getById(date) {
    await delay(200);
    const weather = weatherData.find(w => w.date === date);
    if (!weather) throw new Error('Weather data not found');
    return { ...weather };
  }
};