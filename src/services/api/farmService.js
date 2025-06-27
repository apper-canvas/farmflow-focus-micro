import { farmData } from '@/services/mockData/farms';

let farms = [...farmData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const farmService = {
  async getAll() {
    await delay(300);
    return [...farms];
  },

  async getById(id) {
    await delay(200);
    const farm = farms.find(f => f.id === id);
    if (!farm) throw new Error('Farm not found');
    return { ...farm };
  },

  async create(farmData) {
    await delay(400);
    const maxId = Math.max(...farms.map(f => parseInt(f.id)), 0);
    const newFarm = {
      id: (maxId + 1).toString(),
      ...farmData,
      size: parseFloat(farmData.size)
    };
    farms.push(newFarm);
    return { ...newFarm };
  },

  async update(id, farmData) {
    await delay(350);
    const index = farms.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Farm not found');
    
    const updatedFarm = {
      ...farms[index],
      ...farmData,
      size: parseFloat(farmData.size)
    };
    farms[index] = updatedFarm;
    return { ...updatedFarm };
  },

  async delete(id) {
    await delay(250);
    const index = farms.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Farm not found');
    farms.splice(index, 1);
    return true;
  }
};