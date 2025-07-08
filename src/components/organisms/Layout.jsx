import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';
import TaskModal from '@/components/organisms/TaskModal';
import { taskService } from '@/services/api/taskService';

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    calculateProgress();
  }, []);

  const calculateProgress = async () => {
    try {
      const allTasks = await taskService.getAll();
      const completedTasks = allTasks.filter(task => task.completed && !task.archived);
      const totalTasks = allTasks.filter(task => !task.archived).length;
      const progressPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
      setProgress(progressPercentage);
    } catch (error) {
      console.error('Error calculating progress:', error);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (task) => {
    calculateProgress();
    // Refresh the current page data if needed
    window.location.reload();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={closeMobileSidebar}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          onSearch={handleSearch}
          onAddTask={handleAddTask}
          toggleMobileSidebar={toggleMobileSidebar}
          progress={progress}
        />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Layout;