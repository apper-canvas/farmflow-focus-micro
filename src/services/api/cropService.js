import { cropData } from '@/services/mockData/crops';

let crops = [...cropData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cropService = {
  async getAll() {
    await delay(300);
    return [...crops];
  },

  async getById(id) {
    await delay(200);
    const crop = crops.find(c => c.id === id);
    if (!crop) throw new Error('Crop not found');
    return { ...crop };
  },

  async create(cropData) {
    await delay(400);
    const maxId = Math.max(...crops.map(c => parseInt(c.id)), 0);
    const newCrop = {
      id: (maxId + 1).toString(),
      ...cropData
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  async update(id, cropData) {
    await delay(350);
    const index = crops.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Crop not found');
    
    const updatedCrop = {
      ...crops[index],
      ...cropData
    };
    crops[index] = updatedCrop;
    return { ...updatedCrop };
  },

  async delete(id) {
    await delay(250);
    const index = crops.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Crop not found');
    crops.splice(index, 1);
    return true;
  }
};