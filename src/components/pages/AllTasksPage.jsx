import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import FilterBar from '@/components/molecules/FilterBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';

const AllTasksPage = () => {
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
      const data = await taskService.getAll();
      const activeTasks = data.filter(task => !task.archived);
      setTasks(activeTasks);
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
    } else {
      setTasks([...tasks, savedTask]);
    }
    setEditingTask(null);
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
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            All Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all your tasks in one place
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
          title="No tasks yet"
          description="Create your first task to get started with TaskFlow"
          action={() => setIsTaskModalOpen(true)}
          actionLabel="Create Task"
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

export default AllTasksPage;