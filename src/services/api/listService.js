import listsData from '@/services/mockData/lists.json';

let lists = [...listsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const listService = {
  async getAll() {
    await delay(250);
    return [...lists];
  },

  async getById(id) {
    await delay(200);
    const list = lists.find(list => list.Id === parseInt(id));
    return list ? { ...list } : null;
  },

  async create(listData) {
    await delay(300);
    const newList = {
      ...listData,
      Id: Math.max(...lists.map(l => l.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      taskCount: 0
    };
    lists.push(newList);
    return { ...newList };
  },

  async update(id, updates) {
    await delay(250);
    const listIndex = lists.findIndex(list => list.Id === parseInt(id));
    if (listIndex === -1) return null;
    
    const updatedList = { ...lists[listIndex], ...updates };
    lists[listIndex] = updatedList;
    return { ...updatedList };
  },

  async delete(id) {
    await delay(200);
    const listIndex = lists.findIndex(list => list.Id === parseInt(id));
    if (listIndex === -1) return false;
    
    lists.splice(listIndex, 1);
    return true;
  },

  async updateTaskCount(id, count) {
    await delay(150);
    const listIndex = lists.findIndex(list => list.Id === parseInt(id));
    if (listIndex === -1) return null;
    
    const updatedList = { ...lists[listIndex], taskCount: count };
    lists[listIndex] = updatedList;
    return { ...updatedList };
  }
};