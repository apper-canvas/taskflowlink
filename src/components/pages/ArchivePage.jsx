import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import FilterBar from '@/components/molecules/FilterBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';
import { cn } from '@/utils/cn';

const ArchivePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      const completedTasks = data.filter(task => task.completed);
      setTasks(completedTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, { 
        completed: false, 
        completedAt: null 
      });
      setTasks(tasks.filter(task => task.Id !== taskId));
      toast.success('Task restored successfully');
    } catch (error) {
      toast.error('Failed to restore task');
    }
  };

  const handlePermanentDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      try {
        await taskService.delete(taskId);
        setTasks(tasks.filter(task => task.Id !== taskId));
        toast.success('Task permanently deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks.filter(task => {
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

    return true;
  });

  const TaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-4 group"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <ApperIcon name="Check" size={20} className="text-success" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 line-through opacity-75">
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 opacity-75">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <Badge variant={task.priority}>
                  {task.priority}
                </Badge>
                
                {task.completedAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ApperIcon name="Check" size={12} />
                    Completed {format(parseISO(task.completedAt), 'MMM dd, yyyy')}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRestore(task.Id)}
                className="p-1 h-6 w-6 text-success hover:text-green-700"
                title="Restore task"
              >
                <ApperIcon name="RotateCcw" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePermanentDelete(task.Id)}
                className="p-1 h-6 w-6 text-secondary hover:text-red-700"
                title="Delete permanently"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
            <ApperIcon name="Archive" size={28} className="text-primary" />
            Archive
          </h1>
          <p className="text-gray-600 mt-1">
            Your completed tasks
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredTasks.length} completed task{filteredTasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      <FilterBar
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />

      {filteredTasks.length === 0 ? (
        <Empty
          title="No completed tasks"
          description="Tasks you complete will appear here. Start by completing some tasks!"
          icon="Archive"
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.Id} task={task} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ArchivePage;