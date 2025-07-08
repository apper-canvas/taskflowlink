import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import FilterBar from '@/components/molecules/FilterBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';
import ApperIcon from '@/components/ApperIcon';

const UpcomingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getUpcoming();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.Id !== taskId));
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (savedTask) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.Id === savedTask.Id ? savedTask : task
      ));
    }
    setEditingTask(null);
    loadTasks(); // Refresh to get updated data
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

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
            <ApperIcon name="Clock" size={28} className="text-primary" />
            Upcoming Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Tasks scheduled for the future
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      <FilterBar
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />

      {tasks.length === 0 ? (
        <Empty
          title="No upcoming tasks"
          description="You don't have any tasks scheduled for the future. Create one to stay organized!"
          action={() => setIsTaskModalOpen(true)}
          actionLabel="Schedule Task"
          icon="Clock"
        />
      ) : (
        <TaskList
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskEdit={handleTaskEdit}
          searchTerm={searchTerm}
          filters={filters}
        />
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleTaskSave}
      />
    </motion.div>
  );
};

export default UpcomingPage;