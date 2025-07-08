import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ProgressRing from '@/components/molecules/ProgressRing';

const Header = ({ onSearch, onAddTask, toggleMobileSidebar, progress = 0 }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/today':
        return 'Today';
      case '/all-tasks':
        return 'All Tasks';
      case '/upcoming':
        return 'Upcoming';
      case '/archive':
        return 'Archive';
      default:
        return 'TaskFlow';
    }
  };

  return (
    <motion.header 
      className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {getPageTitle()}
            </h1>
            
            {(location.pathname === '/' || location.pathname === '/today') && (
              <ProgressRing progress={progress} size={40} strokeWidth={3} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar onSearch={onSearch} />
          </div>
          
          <Button onClick={onAddTask} className="gap-2">
            <ApperIcon name="Plus" size={16} />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <SearchBar onSearch={onSearch} />
      </div>
    </motion.header>
  );
};

export default Header;