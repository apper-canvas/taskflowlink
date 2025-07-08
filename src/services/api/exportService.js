import { format } from 'date-fns';
import { taskService } from '@/services/api/taskService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const formatDateForExport = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
};

const convertToCSV = (tasks) => {
  const headers = [
    'ID',
    'Title',
    'Description',
    'List ID',
    'Priority',
    'Due Date',
    'Completed',
    'Completed At',
    'Created At',
    'Archived'
  ];

  const csvContent = [
    headers.join(','),
    ...tasks.map(task => [
      task.Id,
      `"${task.title.replace(/"/g, '""')}"`,
      `"${(task.description || '').replace(/"/g, '""')}"`,
      task.listId,
      task.priority,
      formatDateForExport(task.dueDate),
      task.completed ? 'Yes' : 'No',
      formatDateForExport(task.completedAt),
      formatDateForExport(task.createdAt),
      task.archived ? 'Yes' : 'No'
    ].join(','))
  ].join('\n');

  return csvContent;
};

const downloadFile = (content, filename, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const exportService = {
  async exportTasks(format = 'json') {
    await delay(500); // Simulate processing time
    
    try {
      const tasks = await taskService.export();
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      
      if (format === 'json') {
        const jsonContent = JSON.stringify(tasks, null, 2);
        downloadFile(
          jsonContent,
          `tasks-export-${timestamp}.json`,
          'application/json'
        );
      } else if (format === 'csv') {
        const csvContent = convertToCSV(tasks);
        downloadFile(
          csvContent,
          `tasks-export-${timestamp}.csv`,
          'text/csv'
        );
      } else {
        throw new Error(`Unsupported format: ${format}`);
      }
      
      return { success: true, format, count: tasks.length };
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }
};