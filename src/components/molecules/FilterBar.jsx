import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';

const FilterBar = ({ onFilterChange, currentFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...currentFilters,
      [filterType]: value === 'all' ? null : value
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <ApperIcon name="Filter" size={16} />
          Filters
          <ApperIcon 
            name={showFilters ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </Button>
        
        {(currentFilters.priority || currentFilters.status) && (
          <Button
            variant="ghost"
            onClick={() => onFilterChange({})}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear filters
          </Button>
        )}
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showFilters ? 'auto' : 0, 
          opacity: showFilters ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <Select
              value={currentFilters.priority || 'all'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={currentFilters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Select
              value={currentFilters.dueDate || 'all'}
              onChange={(e) => handleFilterChange('dueDate', e.target.value)}
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This week</option>
              <option value="overdue">Overdue</option>
            </Select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterBar;