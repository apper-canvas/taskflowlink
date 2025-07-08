import tasksData from '@/services/mockData/tasks.json';

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(task => task.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null,
      archived: false
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(250);
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) return null;
    
    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) return false;
    
    tasks.splice(taskIndex, 1);
    return true;
  },

  async toggleComplete(id) {
    await delay(200);
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) return null;
    
    const task = tasks[taskIndex];
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    };
    
    tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  },

  async getByListId(listId) {
    await delay(300);
    return tasks.filter(task => task.listId === listId.toString()).map(task => ({ ...task }));
  },

  async getCompleted() {
    await delay(300);
    return tasks.filter(task => task.completed).map(task => ({ ...task }));
  },

  async getToday() {
    await delay(300);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= startOfDay && dueDate < endOfDay;
    }).map(task => ({ ...task }));
  },

  async getUpcoming() {
    await delay(300);
    const today = new Date();
    const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= startOfTomorrow;
    }).map(task => ({ ...task }));
  },

  async getOverdue() {
    await delay(300);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < startOfDay;
    }).map(task => ({ ...task }));
  },

  async archive(id) {
    await delay(200);
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) return null;
    
    const updatedTask = { ...tasks[taskIndex], archived: true };
    tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  },

  async restore(id) {
    await delay(200);
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) return null;
    
    const updatedTask = { ...tasks[taskIndex], archived: false };
tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  },

  async export() {
    await delay(300);
    return [...tasks];
  }
};