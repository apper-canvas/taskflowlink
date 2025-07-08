import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import FilterBar from '@/components/molecules/FilterBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';
import { listService } from '@/services/api/listService';
import ApperIcon from '@/components/ApperIcon';

const ListPage = () => {
  const { listId } = useParams();
  const [list, setList] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    loadListAndTasks();
  }, [listId]);

  const loadListAndTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const [listData, tasksData] = await Promise.all([
        listService.getById(listId),
        taskService.getByListId(listId)
      ]);
      
      if (!listData) {
        setError('List not found');
        return;
      }
      
      setList(listData);
      const activeTasks = tasksData.filter(task => !task.archived);
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
  if (error) return <Error message={error} onRetry={loadListAndTasks} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-3">
            <ApperIcon 
              name={list?.icon || 'Folder'} 
              size={28} 
              style={{ color: list?.color || '#5B4CFF' }}
            />
            {list?.name || 'List'}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage tasks in this list
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
          title="No tasks in this list"
          description="Add your first task to this list to get started organizing your work."
          action={() => setIsTaskModalOpen(true)}
          actionLabel="Add Task"
          icon={list?.icon || 'Folder'}
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

export default ListPage;