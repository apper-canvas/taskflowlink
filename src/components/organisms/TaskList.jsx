import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Checkbox from '@/components/atoms/Checkbox';
import { taskService } from '@/services/api/taskService';
import { cn } from '@/utils/cn';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete, onTaskEdit, searchTerm, filters }) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.toggleComplete(task.Id);
      const newTasks = localTasks.map(t => 
        t.Id === task.Id ? updatedTask : t
      );
      setLocalTasks(newTasks);
      onTaskUpdate(updatedTask);
      
      toast.success(
        updatedTask.completed ? 'Task completed! 🎉' : 'Task marked as pending',
        { position: 'top-right' }
      );
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        const newTasks = localTasks.filter(t => t.Id !== taskId);
        setLocalTasks(newTasks);
        onTaskDelete(taskId);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const filteredTasks = localTasks.filter(task => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!task.title.toLowerCase().includes(searchLower) &&
          !task.description?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status) {
      switch (filters.status) {
        case 'completed':
          if (!task.completed) return false;
          break;
        case 'pending':
          if (task.completed) return false;
          break;
        case 'overdue':
          if (!task.dueDate || task.completed) return false;
          const dueDate = parseISO(task.dueDate);
          if (!isPast(dueDate) || isToday(dueDate)) return false;
          break;
        default:
          break;
      }
    }

    // Due date filter
    if (filters.dueDate) {
      switch (filters.dueDate) {
        case 'today':
          if (!task.dueDate) return false;
          const today = parseISO(task.dueDate);
          if (!isToday(today)) return false;
          break;
        case 'overdue':
          if (!task.dueDate || task.completed) return false;
          const overdue = parseISO(task.dueDate);
          if (!isPast(overdue) || isToday(overdue)) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });

  const TaskCard = ({ task }) => {
    const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !task.completed;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          'card p-4 group hover:shadow-card-hover transition-all duration-200',
          task.completed && 'opacity-75',
          isOverdue && 'border-l-4 border-l-secondary'
        )}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={cn(
                  'font-medium text-gray-900 truncate',
                  task.completed && 'line-through text-gray-500'
                )}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={task.priority}>
                    {task.priority}
                  </Badge>
                  
                  {task.dueDate && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs',
                      isOverdue ? 'text-secondary' : 'text-gray-500'
                    )}>
                      <ApperIcon name="Calendar" size={12} />
                      {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTaskEdit(task)}
                  className="p-1 h-6 w-6"
                >
                  <ApperIcon name="Edit2" size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task.Id)}
                  className="p-1 h-6 w-6 text-secondary hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="CheckSquare" size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchTerm || Object.keys(filters).length > 0 ? 'No tasks found' : 'No tasks yet'}
        </h3>
        <p className="text-gray-500">
          {searchTerm || Object.keys(filters).length > 0 
            ? 'Try adjusting your search or filters' 
            : 'Create your first task to get started'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <TaskCard key={task.Id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;