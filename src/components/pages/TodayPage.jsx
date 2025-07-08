import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import FilterBar from '@/components/molecules/FilterBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';
import ApperIcon from '@/components/ApperIcon';

const TodayPage = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
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
      const [todayData, overdueData] = await Promise.all([
        taskService.getToday(),
        taskService.getOverdue()
      ]);
      setTodayTasks(todayData);
      setOverdueTasks(overdueData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTodayTasks(todayTasks.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
    setOverdueTasks(overdueTasks.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTodayTasks(todayTasks.filter(task => task.Id !== taskId));
    setOverdueTasks(overdueTasks.filter(task => task.Id !== taskId));
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (savedTask) => {
    if (editingTask) {
      setTodayTasks(todayTasks.map(task => 
        task.Id === savedTask.Id ? savedTask : task
      ));
      setOverdueTasks(overdueTasks.map(task => 
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

  const allTasks = [...overdueTasks, ...todayTasks];
  const hasAnyTasks = allTasks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Today
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {allTasks.length} task{allTasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      <FilterBar
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />

      {!hasAnyTasks ? (
        <Empty
          title="No tasks for today"
          description="You're all caught up! Enjoy your day or create a new task."
          action={() => setIsTaskModalOpen(true)}
          actionLabel="Add Task"
          icon="Calendar"
        />
      ) : (
        <div className="space-y-8">
          {overdueTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-secondary">
                <ApperIcon name="AlertCircle" size={20} />
                <h2 className="text-lg font-semibold">
                  Overdue ({overdueTasks.length})
                </h2>
              </div>
              <TaskList
                tasks={overdueTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleTaskEdit}
                searchTerm={searchTerm}
                filters={filters}
              />
            </motion.div>
          )}

          {todayTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-primary">
                <ApperIcon name="Calendar" size={20} />
                <h2 className="text-lg font-semibold">
                  Today ({todayTasks.length})
                </h2>
              </div>
              <TaskList
                tasks={todayTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleTaskEdit}
                searchTerm={searchTerm}
                filters={filters}
              />
            </motion.div>
          )}
        </div>
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

export default TodayPage;